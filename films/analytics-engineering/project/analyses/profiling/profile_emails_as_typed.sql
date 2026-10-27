-- Evidence: emails the short-course platform holds as they were typed, with spaces or capitals, in
-- the current version of each table, by when they were recorded: before the platform began
-- checking them at entry (2 November 2026, DEC-SC-04), and since. Staging cleans the ones before;
-- the source test entered_clean fails on any since. REQ-SC-01 is done when "before" is 0.
-- Run: dbt show --select profile_emails_as_typed --profiles-dir .
select 'short_courses.learners' as source_table,
    case when cast(_loaded_at as timestamp) < cast('2026-11-02' as timestamp) then 'before' else 'since' end as recorded,
    count(*) as current_rows,
    count(case when customer_email <> lower(trim(customer_email)) then 1 end) as as_typed
from {{ source('short_courses', 'learners') }}
where _is_current = 'true'
group by 2

union all

select 'short_courses.enrolments',
    case when cast(_loaded_at as timestamp) < cast('2026-11-02' as timestamp) then 'before' else 'since' end,
    count(*),
    count(case when customer_email <> lower(trim(customer_email)) then 1 end)
from {{ source('short_courses', 'enrolments') }}
where _is_current = 'true'
group by 2
