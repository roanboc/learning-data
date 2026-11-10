{#-
    Databricks only (DEC-FIN-06). Who reads which faculty's claims: a row filter on Finance's claims,
    mart_finance__casual_claims, kept where the data lives, so it holds for every reader, through
    the metric view casual_teaching_cost too: Genie One, Finance's reports, the faculties' planning
    app and anything else, each reading as the person it acts for, or as itself. It's on when the
    var faculty_readers names the Unity Catalog groups: "all" for those who read every faculty, and
    each faculty's code for its own people.

        dbt build --target databricks --vars '{faculty_readers: {all: all_faculties, HLT: health_planners, EIT: engineering_planners}}'

    A faculty the var doesn't name is read by "all" only. A group here says which rows a reader
    sees; what it may read at all is still its grants. In "all": Finance's analysts, Finance's
    pay-day agent (finance-payday-agent, which may read the metric view and nothing under it), and
    the identity that runs dbt, since the tests, the metric view's build and the shared totals
    (mart_finance__faculty_totals) read the claims as it does.

    The function is made on-run-start, and set on the fact by its post-hook after each build, as
    the personal data masks are (macros/governance/personal_data.sql). DuckDB has no row filters,
    so there both macros do nothing.
-#}

{#- on-run-start: the filter, a function in the target's schema that's true for the rows the person asking may read. -#}
{% macro create_faculty_row_filter() -%}
    {%- set readers = var('faculty_readers', none) -%}
    {%- if target.type == 'databricks' and readers and execute -%}
        {%- if not readers.get('all') -%}
            {{ exceptions.raise_compiler_error("faculty_readers needs an 'all' group: those who read every faculty, the identity that runs dbt among them") }}
        {%- endif -%}
        {%- set faculties = [] -%}
        {%- for code, group in readers.items() if code != 'all' -%}
            {%- do faculties.append("when '" ~ code ~ "' then is_account_group_member('" ~ group ~ "')") -%}
        {%- endfor -%}
        {%- do run_query('create schema if not exists ' ~ target.catalog ~ '.' ~ target.schema) -%}
        {%- do run_query("create or replace function " ~ faculty_row_filter() ~ "(faculty_code string) returns boolean"
            ~ " comment 'Who reads which faculty''s claims: every faculty for " ~ readers['all']
            ~ ", each faculty''s own for its group (DEC-FIN-06).'"
            ~ " return is_account_group_member('" ~ readers['all'] ~ "')"
            ~ (" or case faculty_code " ~ faculties | join(' ') ~ " else false end" if faculties else "")) -%}
    {%- endif -%}
{%- endmacro %}

{#- post-hook on mart_finance__casual_claims: the filter, on its faculty_code. -#}
{% macro apply_faculty_row_filter() -%}
    {%- if target.type == 'databricks' and var('faculty_readers', none) and execute -%}
        {%- do run_query("alter table " ~ this ~ " set row filter " ~ faculty_row_filter() ~ " on (faculty_code)") -%}
    {%- endif -%}
{%- endmacro %}

{#- The function's name, in the target's schema. -#}
{% macro faculty_row_filter() -%}
    {{- target.catalog ~ '.' ~ target.schema ~ '.faculty_row_filter' -}}
{%- endmacro %}
