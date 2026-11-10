-- Quality: where the printed name comes from, column by column, from Unity Catalog's lineage, the
-- system table system.access.column_lineage (The hidden factory). From the graduation list's
-- family_name and name_as_printed back through the models that read them, to the source tables the
-- night's files land in: the student system's graduations and the portal's confirmations. The
-- lineage stops at the platform's edges: the forms before it and the spreadsheet and the printer
-- after it aren't in it, so at both ends the people who do the work have to tell you.
-- Two steps back, the depth of this project's path from a source to a mart; the nightly build
-- writes the lineage each night, so the last 30 days hold all of it. A read through a view is
-- recorded against the view and, with direct_access false, its base table too, so a source table
-- can show at both steps. Lineage is a subset of reads and writes: read it as a map, not a proof
-- that nothing else feeds a column. Databricks only: compile it,
-- then run the SQL in target/compiled/ on a SQL warehouse:
--
--     dbt compile --target databricks --select printed_name_lineage --profiles-dir .
{%- set graduation_list = ref('mart_graduations__graduation_list') %}
with lineage as (
    select distinct
        source_table_full_name, source_column_name, target_table_full_name, target_column_name
    from system.access.column_lineage
    where event_date >= current_date() - interval 30 days
      and source_column_name is not null
      and target_column_name is not null
),
into_the_list as (
    select *
    from lineage
    where target_table_full_name = '{{ graduation_list.database }}.{{ graduation_list.schema }}.{{ graduation_list.identifier }}'
      and target_column_name in ('family_name', 'name_as_printed')
)
select
    into_the_list.target_column_name as list_column,
    into_the_list.source_table_full_name as read_from,
    into_the_list.source_column_name as read_from_column,
    upstream.source_table_full_name as source_table,
    upstream.source_column_name as source_column
from into_the_list
left join lineage as upstream
    on upstream.target_table_full_name = into_the_list.source_table_full_name
    and upstream.target_column_name = into_the_list.source_column_name
order by list_column, read_from, read_from_column, source_table, source_column
