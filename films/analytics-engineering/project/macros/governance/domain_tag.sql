{#-
    Databricks only (DEC-PRJ-15). Each table other teams read carries its area, its model's
    meta.domain, as a key-only Unity Catalog tag of the same name (student, course, learning,
    planning, finance or wallet), so the Discover page lays the tables out by area: there a domain
    is built on a governed tag of its name, created once, and a table joins it by carrying the tag
    (docs/databricks-governance.md, section 5). The identity that runs dbt needs ASSIGN on each.

    Tables only, as for the classes (personal_data.sql). DuckDB has no tags, so there it does
    nothing. The domain is written once, in the model's YAML; nothing here repeats it.
-#}

{#- post-hook: the table's area as a tag. -#}
{% macro apply_domain_tag() -%}
    {%- if target.type != 'databricks' or not execute
          or config.get('materialized') not in ['table', 'incremental'] -%}
        {{ return('') }}
    {%- endif -%}
    {%- set domain = (model.get('meta') or {}).get('domain')
                     or ((model.get('config') or {}).get('meta') or {}).get('domain') -%}
    {%- if domain -%}
        {%- do run_query("set tag on table " ~ this ~ " " ~ domain) -%}
    {%- endif -%}
{%- endmacro %}
