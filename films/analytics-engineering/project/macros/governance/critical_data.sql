{#-
    Databricks only. Each column a use of the table can't do without, the uses its
    meta.critical_for names, carries the key-only Unity Catalog tag critical_data, so whoever
    finds the table sees which columns its uses depend on, and can search for every one. With a
    governed tag of that name, created once by an account admin, only the people its policy names
    can assign it (docs/databricks-governance.md, section 11). What each use needs, and the level
    agreed for it, is in the model's YAML and its contract; nothing here repeats it.

    The build makes the tags match the YAML: it reads which columns carry the tag already, tags
    the critical ones that don't, and takes it off a column no use needs any more. So it doesn't
    matter whether a rebuilt table keeps its tags (SET TAG fails on a tag already there).

    Tables only, as for the classes (personal_data.sql). DuckDB has no tags, so there it does
    nothing. A model takes it as its own post-hook, in its YAML.
-#}

{#- post-hook: tag each critical column, and only those. -#}
{% macro apply_critical_data() -%}
    {%- if target.type != 'databricks' or not execute
          or config.get('materialized') not in ['table', 'incremental'] -%}
        {{ return('') }}
    {%- endif -%}
    {%- set critical = [] -%}
    {%- for name, column in model['columns'].items() -%}
        {%- if (column.get('meta') or {}).get('critical_for')
               or ((column.get('config') or {}).get('meta') or {}).get('critical_for') -%}
            {%- do critical.append(name | lower) -%}
        {%- endif -%}
    {%- endfor -%}
    {%- set tagged = run_query("select lower(column_name) from `" ~ this.database ~ "`.information_schema.column_tags"
        ~ " where schema_name = '" ~ this.schema ~ "' and table_name = '" ~ this.identifier ~ "'"
        ~ " and tag_name = 'critical_data'").columns[0].values() | list -%}
    {#- One statement at a time: Databricks runs one per call. -#}
    {%- for name in critical if name not in tagged -%}
        {%- do run_query("set tag on column " ~ this ~ "." ~ name ~ " critical_data") -%}
    {%- endfor -%}
    {%- for name in tagged if name not in critical -%}
        {%- do run_query("unset tag on column " ~ this ~ "." ~ name ~ " critical_data") -%}
    {%- endfor -%}
{%- endmacro %}
