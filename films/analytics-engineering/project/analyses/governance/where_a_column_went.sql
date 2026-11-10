-- Governance: where a column went. Everything made from one column, from the platform's lineage,
-- the system table system.access.column_lineage: each table and column a query, a job, a notebook
-- or a dashboard made from it, who made it, and when, first and last. No rows: nothing was made
-- from the column. One step at a time: ask again about a column it lists, to follow that one on.
-- Lineage records what the platform can infer, on the platform, for about a year: a copy made
-- elsewhere isn't in it. Databricks only, like the policy (docs/databricks-governance.md,
-- section 18). Here: the learner table's email; to ask about another column, name it:
--
--     dbt compile --target databricks --select where_a_column_went --profiles-dir . --vars \
--         '{lineage_table: registrar.support.exam_support, lineage_column: mobile}'
{%- set learner = ref('core_learner') %}
{%- set table = var('lineage_table', learner.database ~ '.' ~ learner.schema ~ '.' ~ learner.identifier) %}
{%- set column = var('lineage_column', 'email') %}
select target_table_full_name, target_column_name, entity_type,
       array_join(sort_array(collect_set(created_by)), ', ') as made_by,
       min(event_time) as first_made, max(event_time) as last_made
from system.access.column_lineage
where source_table_full_name = '{{ table }}'
  and source_column_name = '{{ column }}'
  and target_table_full_name is not null
group by target_table_full_name, target_column_name, entity_type
order by last_made desc
