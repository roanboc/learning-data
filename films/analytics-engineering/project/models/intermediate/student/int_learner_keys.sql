with

student_records as (

    select * from {{ ref('stg_student_system__learners') }}

),

platform_users as (

    select * from {{ ref('stg_learning_platform__users') }}

),

course_customers as (

    select * from {{ ref('stg_short_courses__learners') }}

),

-- every version of every key, in one shape
key_versions as (

    select
        'SIS' as key_set,
        student_id as system_key,
        student_bk as qualified_key,
        email,
        cast(null as string) as student_bk_held,
        recorded_from
    from student_records

    union all

    select
        'LMS' as key_set,
        user_id as system_key,
        user_bk as qualified_key,
        email,
        student_bk as student_bk_held,
        recorded_from
    from platform_users

    union all

    select
        'SC' as key_set,
        email as system_key,
        customer_bk as qualified_key,
        email,
        cast(null as string) as student_bk_held,
        recorded_from
    from course_customers

),

-- a key with no value identifies no one
known_keys as (

    select * from key_versions
    where qualified_key is not null

),

ranked as (

    select
        *,
        row_number() over (partition by qualified_key order by recorded_from desc) as newest_first,
        min(recorded_from) over (partition by qualified_key) as first_recorded_at
    from known_keys

)

-- one row per key, as its latest version holds it
select
    qualified_key,
    key_set,
    system_key,
    email,
    student_bk_held,
    first_recorded_at
from ranked
where newest_first = 1
