-- Privacy: who read the table of a request's keys, and when, from the audit log, as
-- analyses/governance/who_read_a_table.sql does for the learner table (docs/databricks-governance.md,
-- "Who read it" and "A person's request"). Only the privacy office's group and its two jobs, privacy-finder and
-- privacy-deleter, may read privacy.request_keys; anyone else in this list is a question for the
-- platform team. A read is a getTable event, with the table's full name in
-- request_params.full_name_arg. Databricks only.
--
--     dbt compile --target databricks --profiles-dir . --select who_read_the_keys
select event_time, user_identity.email as who
from system.access.audit
where action_name = 'getTable'
  and request_params.full_name_arg = '{{ target.database }}.privacy.request_keys'
  and event_date >= date_trunc('month', current_date())
order by event_time
