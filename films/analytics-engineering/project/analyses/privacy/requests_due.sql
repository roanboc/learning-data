-- Privacy: the privacy office's requests, and when each is due (docs/databricks-governance.md,
-- "A person's request"). Each request is answered within 30 days, the university's own rule. A request
-- close to its date isn't wrong data: it's work the office still has to do, so this is a list for
-- the office to work through, not a test that fails a build (PLAYBOOK, "Test the data; track the
-- business"). From the office's log, privacy.requests: each request's number, what was asked, and
-- the days it was received, is due and was answered; it names no one. Databricks only.
--
--     dbt compile --target databricks --profiles-dir . --select requests_due
select
    request,
    asks,
    due_on,
    answered_on,
    case when answered_on is null then datediff(due_on, current_date()) end as days_left,
    answered_on is null and datediff(due_on, current_date()) <= 7 as near_its_date,
    answered_on > due_on or (answered_on is null and current_date() > due_on) as late
from {{ target.database }}.privacy.requests
order by answered_on is not null, due_on
