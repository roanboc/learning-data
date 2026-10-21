-- The learning team's follow-up list (DEC-SC-01): each current short-course enrolment with no
-- email, which can't be matched to a learner until the team finds who it is. A test checks the
-- data (warn on any, stop above five); this list tracks what people do about each one
-- (docs/conventions.md, Tests). It reads staging: an enrolment with no email never reaches the core.

with

enrolments as (

    select * from {{ ref('stg_short_courses__enrolments') }}

),

first_recorded as (

    select
        enrolment_bk,
        min(recorded_from) as enrolled_at
    from enrolments
    group by enrolment_bk

)

select
    enrolments.enrolment_bk,
    enrolments.course_code,
    enrolments.course_name,
    enrolments.enrolment_status,
    cast(first_recorded.enrolled_at as date) as enrolled_on,
    cast({{ dbt.datediff('cast(first_recorded.enrolled_at as date)', as_is_date(), 'day') }} as int) as days_open
from enrolments
inner join first_recorded on enrolments.enrolment_bk = first_recorded.enrolment_bk
where enrolments.is_current_version
    and enrolments.customer_bk is null
