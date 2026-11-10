-- Governance: who read a table, and when, from Unity Catalog's audit log, the system table
-- system.access.audit (in Public Preview; it keeps a year). Databricks only, like the policy
-- (docs/databricks-governance.md, section 6). A read is a getTable event, with the table's full
-- name in request_params.full_name_arg. Here: who read the learner table this month.
-- Compile it, then run the SQL in target/compiled/ on a SQL warehouse:
--
--     dbt compile --target databricks --select who_read_a_table --profiles-dir .
{%- set read = ref('core_learner') %}
select event_time, user_identity.email
from system.access.audit
where action_name = 'getTable'
  and request_params.full_name_arg = '{{ read.database }}.{{ read.schema }}.{{ read.identifier }}'
  and event_date >= date_trunc('month', current_date())
order by event_time
