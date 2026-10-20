{#-
    Databricks only (DEC-PRJ-13). Each column's class, meta.personal_data, goes to Unity Catalog
    as a tag on the column, so the platform knows what the project knows; and a column of direct
    personal data gets a mask when the var personal_data_readers names the group that may see it:

        dbt build --target databricks --vars '{personal_data_readers: personal_data_readers}'

    Everyone else reads '***'. The identity that runs dbt must be in that group too: a model that
    reads a masked column sees what its reader sees.

    Tables only: staging and intermediate are views in private schemas nobody is granted. DuckDB
    has no tags or masks, so there both macros do nothing, as DEC-PRJ-09 leaves keys out there.
    The class is written once, in the model's YAML; nothing here repeats it.
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
        {%- if class -%}
            {%- do statements.append("alter table " ~ this ~ " alter column " ~ name
                                     ~ " set tags ('personal_data' = '" ~ class ~ "')") -%}
        {%- endif -%}
        {%- if class == 'direct' and var('personal_data_readers', none) -%}
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
