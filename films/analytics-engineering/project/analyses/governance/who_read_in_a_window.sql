-- Governance: who read a table's data in a window of time, from Unity Catalog's audit log, the
-- system table system.access.audit. Each time the platform hands a reader a short-lived credential
-- for a table's files, it logs generateTemporaryTableCredential, with the table's full name and
-- whether the credential can also write (operation): who read what, and when. Section 6's getTable
-- counts each look-up of a table; this counts each read of its data. Databricks only, like the
-- policy (docs/databricks-governance.md, section 18). event_time is in UTC. Here: who read the
-- learner table in the last seven days; to ask about another table and window, name them:
--
--     dbt compile --target databricks --select who_read_in_a_window --profiles-dir . --vars \
--         '{read_table: registrar.support.exam_support, read_from: "2027-01-07 02:04", read_to: "2027-01-08 09:30"}'
{%- set learner = ref('core_learner') %}
{%- set table = var('read_table', learner.database ~ '.' ~ learner.schema ~ '.' ~ learner.identifier) %}
{%- set read_from = var('read_from', none) %}
{%- set read_to = var('read_to', none) %}
select user_identity.email as reader, request_params.operation as operation,
       count(*) as credentials, min(event_time) as first_read, max(event_time) as last_read
from system.access.audit
where service_name = 'unityCatalog'
  and action_name = 'generateTemporaryTableCredential'
  and request_params.table_full_name = '{{ table }}'
{%- if read_from %}
  and event_time >= timestamp '{{ read_from }}'
{%- else %}
  and event_date >= date_sub(current_date(), 7)
{%- endif %}
{%- if read_to %}
  and event_time < timestamp '{{ read_to }}'
{%- endif %}
group by user_identity.email, request_params.operation
order by first_read
