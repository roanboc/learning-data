{#-
    Databricks only (DEC-PRJ-13). Each column's class, meta.personal_data, goes to Unity Catalog
    as a tag on the column, so the platform knows what the project knows; and a column of direct
    personal data gets a mask when the var personal_data_readers names the group that may see it:

        dbt build --target databricks --vars '{personal_data_readers: personal_data_readers}'

    Everyone else reads '***'. The identity that runs dbt must be in that group too: a model that
    reads a masked column sees what its reader sees.

    Tables only: staging and intermediate are views in private schemas nobody is granted. DuckDB
    has no tags or masks, so there both macros do nothing, as DEC-PRJ-09 leaves keys out there.
    The class is written once, in the model's YAML; nothing here repeats it. none is no tag (DEC-PRJ-17).
-#}

{#- on-run-start: the mask, a function in the target's schema. -#}
{% macro create_personal_data_mask() -%}
    {%- set readers = var('personal_data_readers', none) -%}
    {%- if target.type == 'databricks' and readers and execute -%}
        {%- set function = target.catalog ~ '.' ~ target.schema ~ '.mask_personal_data' -%}
        {%- do run_query('create schema if not exists ' ~ target.catalog ~ '.' ~ target.schema) -%}
        {%- do run_query("create or replace function " ~ function ~ "(value string) returns string"
            ~ " comment 'Direct personal data, for the group " ~ readers ~ " only (DEC-PRJ-13).'"
            ~ " return case when is_account_group_member('" ~ readers ~ "') then value else '***' end") -%}
    {%- endif -%}
{%- endmacro %}

{#- post-hook: tag every classified column; mask the direct ones. -#}
{% macro apply_personal_data() -%}
    {%- if target.type != 'databricks' or not execute
          or config.get('materialized') not in ['table', 'incremental'] -%}
        {{ return('') }}
    {%- endif -%}
    {%- set statements = [] -%}
    {%- for name, column in model['columns'].items() -%}
        {%- set class = (column.get('meta') or {}).get('personal_data')
                        or ((column.get('config') or {}).get('meta') or {}).get('personal_data') -%}
        {%- if class and class != 'none' -%}
            {%- do statements.append("alter table " ~ this ~ " alter column " ~ name
                                     ~ " set tags ('personal_data' = '" ~ class ~ "')") -%}
        {%- endif -%}
        {#- Under the policy (below), the policy masks: a mask set here too would conflict with it. -#}
        {%- if class == 'direct' and var('personal_data_readers', none) and not var('personal_data_policy', false) -%}
            {%- if (column.get('data_type') or '') | lower not in ['string', 'text', 'varchar'] -%}
                {{ exceptions.raise_compiler_error(model['name'] ~ "." ~ name ~ " is direct personal data, "
                   ~ "but mask_personal_data masks strings only") }}
            {%- endif -%}
            {%- do statements.append("alter table " ~ this ~ " alter column " ~ name ~ " set mask "
                                     ~ target.catalog ~ "." ~ target.schema ~ ".mask_personal_data") -%}
        {%- endif -%}
    {%- endfor -%}
    {#- One statement at a time: Databricks runs one per call. -#}
    {%- for statement in statements -%}
        {%- do run_query(statement) -%}
    {%- endfor -%}
{%- endmacro %}

{#-
    Or one policy instead of a mask per column: Unity Catalog's attribute-based access control.
    It masks every column tagged personal_data = direct, in every schema of the catalog, for
    everyone but the readers, including tables built after it. It needs the governed tag
    personal_data (values special, direct, pseudonymous, indirect), created once by an account admin
    (docs/databricks-governance.md). Build with the var personal_data_policy, so the post-hook
    tags and leaves masking to the policy, then run this once:

        dbt run-operation create_personal_data_policy --target databricks \
            --vars '{personal_data_readers: personal_data_readers, personal_data_policy: true}'
-#}
{% macro create_personal_data_policy() -%}
    {%- set readers = var('personal_data_readers', none) -%}
    {%- if target.type != 'databricks' or not readers -%}
        {{ exceptions.raise_compiler_error("create_personal_data_policy runs on Databricks, with the var personal_data_readers") }}
    {%- endif -%}
    {%- do create_personal_data_mask() -%}
    {%- do run_query("create or replace policy mask_direct_personal_data on catalog " ~ target.catalog
        ~ " comment 'Direct personal data, for the group " ~ readers ~ " only (DEC-PRJ-13).'"
        ~ " column mask " ~ target.catalog ~ "." ~ target.schema ~ ".mask_personal_data"
        ~ " to `account users` except `" ~ readers ~ "`"
        ~ " for tables match columns has_tag_value('personal_data', 'direct') as personal on column personal") -%}
    {%- do log("mask_direct_personal_data covers " ~ target.catalog ~ " for everyone but " ~ readers, info=True) -%}
{%- endmacro %}

{#-
    post-hook, last (DEC-PRJ-17): what the platform needs once the classes are set. A column the
    YAML marks none carries no tag, so a personal_data tag left on it from an older build is taken
    off: a none tag would meet a real class in any column made from both, a conflict every time.
    Then the key-only tag faculty on the column that holds each row's faculty (meta.faculty), for a
    row filter by faculty. Last, the table's level, its model's meta.level (public, internal,
    confidential or restricted), set only once its columns' classes are there, and never under its
    two floors: a table with a column that points to a person (direct, pseudonymous or indirect) is
    never public, and one with anything special is restricted. Tag propagation never carries a
    level: two tables of different levels joined would be a conflict every time, so each table's
    level is its owner's call (docs/databricks-governance.md, section 14).

    It reads which columns carry the tags already, as apply_critical_data does: SET TAG fails on a
    tag already there. Tables only; DuckDB has no tags, so there it does nothing.
-#}
{% macro apply_faculty_and_level() -%}
    {%- if target.type != 'databricks' or not execute
          or config.get('materialized') not in ['table', 'incremental'] -%}
        {{ return('') }}
    {%- endif -%}
    {%- set classes = {} -%}
    {%- set faculty = [] -%}
    {%- for name, column in model['columns'].items() -%}
        {%- set meta = (column.get('meta') or {}) -%}
        {%- set config_meta = ((column.get('config') or {}).get('meta') or {}) -%}
        {%- do classes.update({name | lower: meta.get('personal_data') or config_meta.get('personal_data')}) -%}
        {%- if meta.get('faculty') or config_meta.get('faculty') -%}
            {%- do faculty.append(name | lower) -%}
        {%- endif -%}
    {%- endfor -%}
    {%- set tagged = run_query("select lower(column_name), tag_name from `" ~ this.database ~ "`.information_schema.column_tags"
        ~ " where schema_name = '" ~ this.schema ~ "' and table_name = '" ~ this.identifier ~ "'"
        ~ " and tag_name in ('personal_data', 'faculty')") -%}
    {%- set has_class = [] -%}
    {%- set has_faculty = [] -%}
    {%- for row in tagged.rows -%}
        {%- if row[1] == 'faculty' -%}
            {%- do has_faculty.append(row[0]) -%}
        {%- else -%}
            {%- do has_class.append(row[0]) -%}
        {%- endif -%}
    {%- endfor -%}
    {#- One statement at a time: Databricks runs one per call. -#}
    {%- for name in has_class if classes.get(name) == 'none' -%}
        {%- do run_query("unset tag on column " ~ this ~ "." ~ name ~ " personal_data") -%}
    {%- endfor -%}
    {%- for name in faculty if name not in has_faculty -%}
        {%- do run_query("set tag on column " ~ this ~ "." ~ name ~ " faculty") -%}
    {%- endfor -%}
    {%- for name in has_faculty if name not in faculty -%}
        {%- do run_query("unset tag on column " ~ this ~ "." ~ name ~ " faculty") -%}
    {%- endfor -%}
    {%- set level = (model.get('meta') or {}).get('level')
                    or ((model.get('config') or {}).get('meta') or {}).get('level') -%}
    {%- if level -%}
        {%- set levels = ['public', 'internal', 'confidential', 'restricted'] -%}
        {%- set held = classes.values() | list -%}
        {%- set floor = 'restricted' if 'special' in held
                        else 'internal' if ('direct' in held or 'pseudonymous' in held or 'indirect' in held)
                        else 'public' -%}
        {%- if level not in levels or levels.index(level) < levels.index(floor) -%}
            {{ exceptions.raise_compiler_error(model['name'] ~ " has the level " ~ level ~ ", but a table "
               ~ "with these classes is " ~ floor ~ " or above (DEC-PRJ-17)") }}
        {%- endif -%}
        {%- do run_query("alter table " ~ this ~ " set tags ('level' = '" ~ level ~ "')") -%}
    {%- endif -%}
{%- endmacro %}
