-- Evidence: references that find nothing to point at, as typed and after trimming and lower-casing.
-- Run: dbt show --select profile_orphans --profiles-dir .
with

customers as (

    select distinct customer_email from {{ source('short_courses', 'learners') }}

),

enrolments as (

    select distinct customer_email from {{ source('short_courses', 'enrolments') }}
    where nullif(trim(customer_email), '') is not null

),

students as (

    select distinct student_id from {{ source('student_system', 'learners') }}

),

platform_students as (

    select distinct student_id from {{ source('learning_platform', 'users') }}
    where nullif(trim(student_id), '') is not null

)

select
    'short_courses.enrolments -> learners' as reference,
    count(case when customers_as_typed.customer_email is null then 1 end) as orphans_as_typed,
    count(case when customers_normalised.customer_email is null then 1 end) as orphans_normalised
from enrolments
left join customers as customers_as_typed
    on customers_as_typed.customer_email = enrolments.customer_email
left join customers as customers_normalised
    on lower(trim(customers_normalised.customer_email)) = lower(trim(enrolments.customer_email))

union all

select
    'learning_platform.users.student_id -> student_system.learners',
    count(case when students.student_id is null then 1 end),
    count(case when students.student_id is null then 1 end)
from platform_students
left join students on students.student_id = trim(platform_students.student_id)
