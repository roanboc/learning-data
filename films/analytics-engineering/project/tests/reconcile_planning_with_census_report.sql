-- Planning's number, reconciled with the census report, faculty by faculty.
-- Fails with one row per faculty where they differ, or that the report doesn't cover.
with

mart as (

    {{ learners_near_graduate_certificate('faculty_code') }}

),

report as (

    select
        faculty_code,
        learners_near_graduate_certificate
    from {{ ref('census_report') }}
    where census_date = {{ census_date() }}

),

compared as (

    select
        coalesce(mart.faculty_code, report.faculty_code) as faculty_code,
        coalesce(mart.learners_near_graduate_certificate, 0) as in_the_mart,
        report.learners_near_graduate_certificate as in_the_census_report
    from mart
    full outer join report on report.faculty_code = mart.faculty_code

)

select *
from compared
where in_the_census_report is null
   or in_the_mart <> in_the_census_report
