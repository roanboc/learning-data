{#-
    Deleting a person's data for an answered request (docs/databricks-governance.md, "Deleted means
    deleted"). The nightly deletion job, privacy-deleter, runs both at 01:00, before the 02:00 load:

        dbt run-operation erase_a_request --args '{request: "2026-117"}' --target databricks --profiles-dir .
        dbt run-operation clean_up_old_files --target databricks --profiles-dir .

    erase_a_request deletes, from every model whose meta names erase_by, the rows whose key is one
    of the request's keys for that key set, read from the restricted table privacy.request_keys.
    It names the request, never the person: the platform keeps each statement's text for a year
    (system.query.history). On a table with deletion vectors a delete only marks the rows, so it
    then purges them (REORG TABLE ... APPLY (PURGE)), which writes new files without them.
    clean_up_old_files runs VACUUM on the same tables: it removes the files no version of the last
    7 days needs (delta.deletedFileRetentionDuration, the default kept so a mistake can be undone),
    so a delete's old files go on the seventh night after it, and time travel to before it ends.
    A model of the source systems' own keeps its rows: HR keeps pay records by law, and a person's
    no goes on their record there (stg_hr_system__wishes), where the lists are made from.
    Databricks only; on another engine both print what they would run.
-#}

{#- The models the deletion job erases from, each with its key set and column, from meta.erase_by. -#}
{% macro erased_models() -%}
    {%- set found = [] -%}
    {%- for node in graph.nodes.values() if node.resource_type == 'model' -%}
        {%- set erase_by = (node.config.get('meta') or {}).get('erase_by') or (node.meta or {}).get('erase_by') -%}
        {%- if erase_by -%}
            {%- do found.append({'name': node.name, 'relation': node.relation_name,
                                 'key_set': erase_by['key_set'], 'column': erase_by['column']}) -%}
        {%- endif -%}
    {%- endfor -%}
    {{ return(found | sort(attribute='name')) }}
{%- endmacro %}

{#- A request's number, like 2026-117: nothing else goes into a statement. -#}
{% macro request_number(request) -%}
    {%- if not modules.re.fullmatch('[0-9]{4}-[0-9]{3}', request | string) -%}
        {{ exceptions.raise_compiler_error("A request's number looks like 2026-117, not '" ~ request ~ "'") }}
    {%- endif -%}
    {{ return(request | string) }}
{%- endmacro %}

{#- The request's keys in one key set, from the restricted table: a subquery, never a value. -#}
{% macro request_keys(request, key_set) -%}
    select key from {{ target.database }}.privacy.request_keys
    where request = '{{ request_number(request) }}' and system = '{{ key_set }}'
{%- endmacro %}

{% macro erase_a_request(request) %}
    {%- set statements = [] -%}
    {%- for m in erased_models() -%}
        {%- do statements.append("delete from " ~ m.relation ~ " where " ~ m.column ~ " in ("
                                 ~ request_keys(request, m.key_set) ~ ")") -%}
        {%- do statements.append("reorg table " ~ m.relation ~ " apply (purge)") -%}
    {%- endfor -%}
    {{ privacy_run(statements) }}
{% endmacro %}

{% macro clean_up_old_files() %}
    {%- set statements = [] -%}
    {%- for m in erased_models() -%}
        {%- do statements.append("vacuum " ~ m.relation) -%}
    {%- endfor -%}
    {{ privacy_run(statements) }}
{% endmacro %}

{#- One statement at a time on Databricks, each in the job's run and the table's history; elsewhere, printed. -#}
{% macro privacy_run(statements) %}
    {%- for statement in statements -%}
        {%- if target.type == 'databricks' -%}
            {%- do run_query(statement) -%}
        {%- endif -%}
        {%- do log(statement, info=True) -%}
    {%- endfor -%}
{% endmacro %}
