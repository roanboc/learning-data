-- Reports due today: the registrar's office's morning alert (Report, fix, tell). Every name report
-- due today, or overdue, that the office hasn't answered yet, one row each. A Databricks SQL alert
-- runs it at 8:00 every morning and, when there are any, emails the office the list
-- (docs/databricks-governance.md, section 14). It reads the reports' own model, so the promise of
-- two working days is worked out in one place (mart_graduations__name_reports). Databricks only:
--
--     dbt compile --target databricks --select name_reports_due_today --profiles-dir .
--
-- then paste the compiled SQL into the alert's query. On DuckDB, dbt show runs it on the sample.
select
    due_on,
    name_given,
    reported_at,
    report_bk,
    1 as reports_due
from {{ ref('mart_graduations__name_reports') }}
where answered_at is null
    and due_on <= current_date
order by due_on, reported_at
