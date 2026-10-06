-- Validation: Finance's mart beside Finance's own tuition report, faculty by faculty.
-- The singular test tests/reconciliation/reconcile_finance_with_tuition_report.sql fails the build on
-- any difference; this shows every row, for Finance's sign-off.
-- Run: dbt show --select reconcile_tuition_report --profiles-dir .
with

mart as (

    select
        faculty_code,
        sum(credit_points_recognised) as credit_points_recognised,
        sum(tuition_forgone) as tuition_forgone
    from {{ ref('mart_finance__tuition_forgone') }}
    group by faculty_code

),

report as (

    select * from {{ ref('tuition_report') }}
    where census_date = {{ census_date() }}

)

select
    report.census_date,
    report.faculty_name,
    coalesce(mart.credit_points_recognised, 0) as credit_points_recognised,
    coalesce(mart.tuition_forgone, 0) as in_the_mart,
    report.tuition_forgone as in_the_report,
    coalesce(mart.tuition_forgone, 0) - report.tuition_forgone as difference
from report
left join mart on mart.faculty_code = report.faculty_code
order by report.faculty_name
