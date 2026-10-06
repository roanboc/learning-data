-- Finance's number, reconciled with Finance's own tuition report, faculty by faculty.
-- Fails with one row per faculty where they differ, or that the report doesn't cover.
with

mart as (

    select
        faculty_code,
        sum(tuition_forgone) as tuition_forgone
    from {{ ref('mart_finance__tuition_forgone') }}
    group by faculty_code

),

report as (

    select
        faculty_code,
        tuition_forgone
    from {{ ref('tuition_report') }}
    where census_date = {{ census_date() }}

),

compared as (

    select
        coalesce(mart.faculty_code, report.faculty_code) as faculty_code,
        coalesce(mart.tuition_forgone, 0) as in_the_mart,
        report.tuition_forgone as in_the_report
    from mart
    full outer join report on report.faculty_code = mart.faculty_code

)

select *
from compared
where in_the_report is null
   or in_the_mart <> in_the_report
