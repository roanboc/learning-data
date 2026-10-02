-- Evidence: is each system key unique, and is an email enough to identify one person?
-- Run: dbt show --select profile_key_uniqueness --profiles-dir .
with

student_records as (

    select student_id as system_key, email from {{ source('student_system', 'learners') }}
    where _is_current = 'true'

),

platform_users as (

    select user_id as system_key, email from {{ source('learning_platform', 'users') }}
    where _is_current = 'true'

),

course_customers as (

    select customer_email as system_key, customer_email as email from {{ source('short_courses', 'learners') }}
    where _is_current = 'true'

),

checks as (

    select 'student_system.learners' as source_table, 'student_id' as key_column,
        count(*) as current_rows, count(distinct system_key) as distinct_keys,
        count(distinct lower(trim(email))) as distinct_emails
    from student_records

    union all

    select 'learning_platform.users', 'user_id',
        count(*), count(distinct system_key), count(distinct lower(trim(email)))
    from platform_users

    union all

    select 'short_courses.learners', 'customer_email',
        count(*), count(distinct system_key), count(distinct lower(trim(email)))
    from course_customers

)

select
    *,
    current_rows - distinct_keys as duplicate_keys
from checks
order by source_table
