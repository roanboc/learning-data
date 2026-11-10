-- Governance: what an agent did on Databricks in a period, under its own name, as the auditors ask
-- (agents/README.md). Each statement it ran is in the query history, system.query.history, under its
-- service principal's application ID; what else it did in Unity Catalog, each table it read and each
-- schema it made, is in the audit log, system.access.audit. Its pull requests are GitHub's side: search
-- the repository for author:app/planning-agent. Databricks only, like the policy
-- (docs/databricks-governance.md). A statement's text shows only to an account admin or a member of
-- databricks_pii_access; anyone else reads <REDACTED>, and the row still says what kind it was, when,
-- and whether it ran. Here: the planning agent (agents/tools.yml), this year.
--
--     dbt compile --target databricks --select an_agents_work --profiles-dir .
--     dbt compile --target databricks --select an_agents_work --profiles-dir . \
--       --vars '{agent_application_id: <its application ID>, since: 2026-10-26}'
{%- set agent = var('agent_application_id', '4f1c9a2e-7b3d-4e61-a8c5-2d9f0b6e1a73') %}
{%- set since = "date '" ~ var('since') ~ "'" if var('since', none) else "date_trunc('year', current_date())" %}
select 'query history' as log, start_time as event_time, statement_type as action,
       statement_text as what, execution_status as outcome
from system.query.history
where executed_by = '{{ agent }}'
  and start_time >= {{ since }}
union all
select 'audit log', event_time, action_name,
       to_json(request_params), cast(response.status_code as string)
from system.access.audit
where service_name = 'unityCatalog'
  and user_identity.email = '{{ agent }}'
  and event_date >= {{ since }}
order by event_time
