-- The learning team's follow-up list (DEC-SC-01): each current short-course enrolment with no
-- email, which can't be matched to a learner until the team finds who it is. A test checks the
-- data (warn on any, stop above five); this list tracks what people do about each one
-- (docs/conventions.md, Tests).
--
-- It reads the source, not staging: on the night more than five enrolments have no email, the
-- staging test fails and dbt skips what's built from staging, and this list is what the team
-- needs that morning. So it repeats staging's two steps it needs: trim, and qualify the key.

with

enrolments as (

    select
        {{ business_key('SC', 'upper(trim(enrolment_id))') }} as enrolment_bk,
        nullif(lower(trim(customer_email)), '') as email,
        trim(course_code) as course_code,
        trim(course_name) as course_name,
        lower(trim(enrolment_status)) as enrolment_status,
        cast(_valid_from as timestamp) as recorded_from,
        cast(_is_current as boolean) as is_current_version
    from {{ source('short_courses', 'enrolments') }}

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
    and enrolments.email is null
