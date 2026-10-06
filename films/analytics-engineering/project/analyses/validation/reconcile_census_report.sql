-- Validation: Planning's number beside the census report's, faculty by faculty.
-- The singular test tests/reconciliation/reconcile_planning_with_census_report.sql fails the build on any difference;
-- this shows every row, for the sign-off.
-- Run: dbt show --select reconcile_census_report --profiles-dir .
with

mart as (

    {{ learners_near_graduate_certificate('faculty_code') }}

),

report as (

    select * from {{ ref('census_report') }}
    where census_date = {{ census_date() }}

)

select
    report.census_date,
    report.faculty_name,
    coalesce(mart.learners_near_graduate_certificate, 0) as in_the_mart,
    report.learners_near_graduate_certificate as in_the_census_report,
    coalesce(mart.learners_near_graduate_certificate, 0) - report.learners_near_graduate_certificate as difference
from report
left join mart on mart.faculty_code = report.faculty_code
order by report.faculty_name
