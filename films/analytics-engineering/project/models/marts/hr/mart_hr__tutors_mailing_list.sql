-- HR's tutors' mailing list: each casual tutor of the last two years whose answer about news of
-- tutoring work is yes, as it is on the day of the build. HR's job builds it again at the start of
-- each teaching period, from HR's records, and the mailing tool copies it each night
-- (exposures/hr/_hr__exposures.yml). So a no goes on the person's record in HR's system, where the
-- list is made from: deleting a row here alone would last only until the next build
-- (docs/databricks-governance.md, "Deleted means deleted").

with

staff as (

    select * from {{ ref('stg_hr_system__staff') }}
    where {{ valid_at(as_is_date(), 'recorded_from', 'recorded_to') }}

),

tutors as (

    select distinct staff_bk
    from {{ ref('stg_hr_system__contracts') }}
    where {{ valid_at(as_is_date(), 'recorded_from', 'recorded_to') }}
        and pay_type = 'CAS'
        and starts_on <= {{ as_is_date() }}
        and ends_on >= {{ dbt.dateadd('year', -2, as_is_date()) }}

),

wishes as (

    select * from {{ ref('stg_hr_system__wishes') }}
    where {{ valid_at(as_is_date(), 'recorded_from', 'recorded_to') }}
        and purpose = 'News of tutoring work'

)

select
    staff.staff_id,
    staff.given_name,
    staff.email
from staff
inner join tutors on staff.staff_bk = tutors.staff_bk
inner join wishes on staff.staff_bk = wishes.staff_bk
where wishes.answer = 'yes'
