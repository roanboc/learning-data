{#-
    Every night's checks, kept (Small, every week). The scorecard (scripts/generate/scorecard.py)
    shows only the last run, so last week's nights are gone by Thursday. This last step of each
    run, dbt_project.yml's on-run-end, adds a row for each check that ran to one table,
    check_results, in the target's own schema: when the run started, the run's id, the check, its
    status (pass, warn, fail, error or skipped), how many rows it held or failed, its owner and its
    quality dimension, from the check's meta. Nothing is replaced: each night adds to the nights
    before, so the week can be read on Thursdays, check by check
    (analyses/quality/checks_by_night.sql).

    Tests in tests/governance/ check the project, not the data, and aren't kept, as the scorecard
    doesn't score them. A run with no checks, such as dbt run, adds nothing. The same SQL runs on
    DuckDB and on Databricks.
-#}

{% macro keep_check_results(results) -%}
    {%- if not execute -%}
        {{ return('') }}
    {%- endif -%}
    {%- set rows = [] -%}
    {%- for res in results
          if res.node.resource_type == 'test'
          and not res.node.original_file_path.startswith('tests/governance/') -%}
        {%- set meta = res.node.meta or {} -%}
        {%- do rows.append('(' ~ [
            "cast('" ~ run_started_at.strftime('%Y-%m-%d %H:%M:%S') ~ "' as timestamp)",
            quote_text(invocation_id),
            quote_text(res.node.name),
            quote_text(res.status),
            res.failures if res.failures is not none else 'null',
            quote_text(meta.get('owner', 'no owner')),
            quote_text(meta.get('dimension', 'unknown'))
        ] | join(', ') ~ ')') -%}
    {%- endfor -%}
    {%- if not rows -%}
        {{ return('') }}
    {%- endif -%}
    {%- set kept = api.Relation.create(database=target.database, schema=target.schema, identifier='check_results') -%}
    {%- do run_query('create schema if not exists ' ~ kept.without_identifier()) -%}
    {%- do run_query('create table if not exists ' ~ kept ~ ' (run_started_at timestamp, invocation_id string,'
          ~ ' check_name string, status string, failures bigint, owner string, dimension string)') -%}
    {%- do run_query('insert into ' ~ kept ~ ' values ' ~ rows | join(', ')) -%}
    {{ return('') }}
{%- endmacro %}

{#- a text value in SQL: in single quotes, each quote inside doubled -#}
{% macro quote_text(value) -%}
    {{ return("'" ~ (value | string | replace("'", "''")) ~ "'") }}
{%- endmacro %}
