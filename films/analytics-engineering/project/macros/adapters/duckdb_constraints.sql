{#-
    DuckDB only. DuckDB enforces primary and foreign keys, and won't rename or drop a table that a
    foreign key points to, which is how dbt replaces a table: the next build would fail. On
    Databricks, primary and foreign keys are informational: recorded in Unity Catalog, not
    enforced. So on DuckDB this project keeps the constraints both engines enforce (not_null,
    check) and leaves out the keys. Tests check keys and relationships on both engines.
-#}
{% macro duckdb__get_table_columns_and_constraints() -%}
    {%- set kept_types = ['not_null', 'check'] -%}
    {%- set columns = {} -%}
    {%- for name, column in model['columns'].items() -%}
        {%- set kept = [] -%}
        {%- for constraint in column.get('constraints', []) if constraint['type'] in kept_types -%}
            {%- do kept.append(constraint) -%}
        {%- endfor -%}
        {%- set copy = column.copy() -%}
        {%- do copy.update({'constraints': kept}) -%}
        {%- do columns.update({name: copy}) -%}
    {%- endfor -%}
    {%- set model_constraints = [] -%}
    {%- for constraint in model['constraints'] if constraint['type'] in kept_types -%}
        {%- do model_constraints.append(constraint) -%}
    {%- endfor -%}
    {%- set raw_column_constraints = adapter.render_raw_columns_constraints(raw_columns=columns) -%}
    {%- set raw_model_constraints = adapter.render_raw_model_constraints(raw_constraints=model_constraints) -%}
    (
    {% for c in raw_column_constraints -%}
      {{ c }}{{ "," if not loop.last or raw_model_constraints }}
    {% endfor %}
    {% for c in raw_model_constraints -%}
      {{ c }}{{ "," if not loop.last }}
    {% endfor -%}
    )
{%- endmacro %}
