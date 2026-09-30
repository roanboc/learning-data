{#-
    One timeline per learner, stitched from three versioned sources. For each attribute, the
    student system wins, then the learning platform, then the short-course platform.
-#}

with

matched_keys as (

    select * from {{ ref('int_learner_keys_matched') }}

),

student_records as (

    select * from {{ ref('stg_student_system__learners') }}

),

platform_users as (

    select * from {{ ref('stg_learning_platform__users') }}

),

course_customers as (

    select * from {{ ref('stg_short_courses__learners') }}

),

status_map as (

    select * from {{ ref('status_map') }}

),

-- the student system says when each version took effect: that date, not the date it was recorded
student_versions as (

    select
        matched_keys.learner_key,
        student_records.effective_date as valid_from,
        coalesce(
            lead(student_records.effective_date) over (
                partition by student_records.student_bk
                order by student_records.effective_date, student_records.recorded_from
            ),
            case when not student_records.is_current_version then cast(student_records.recorded_to as date) end
        ) as valid_to,
        student_records.recorded_from as recorded_at,
        student_records.given_name || ' ' || student_records.family_name as full_name,
        student_records.email,
        student_records.status_code,
        student_records.award_bk as enrolled_award_bk
    from student_records
    inner join matched_keys on matched_keys.qualified_key = student_records.student_bk

),

-- the platforms only say when they recorded a change
platform_versions as (

    select
        matched_keys.learner_key,
        cast(platform_users.recorded_from as date) as valid_from,
        cast(platform_users.recorded_to as date) as valid_to,
        platform_users.recorded_from as recorded_at,
        platform_users.display_name as full_name,
        platform_users.email,
        platform_users.account_status as status_code
    from platform_users
    inner join matched_keys on matched_keys.qualified_key = platform_users.user_bk

),

customer_versions as (

    select
        matched_keys.learner_key,
        cast(course_customers.recorded_from as date) as valid_from,
        cast(course_customers.recorded_to as date) as valid_to,
        course_customers.recorded_from as recorded_at,
        course_customers.customer_name as full_name,
        course_customers.email,
        course_customers.status_code
    from course_customers
    inner join matched_keys on matched_keys.qualified_key = course_customers.customer_bk

),

-- every date on which any source changed
change_dates as (

    select learner_key, valid_from as changed_on from student_versions
    union
    select learner_key, valid_to from student_versions where valid_to is not null
    union
    select learner_key, valid_from from platform_versions
    union
    select learner_key, valid_to from platform_versions where valid_to is not null
    union
    select learner_key, valid_from from customer_versions
    union
    select learner_key, valid_to from customer_versions where valid_to is not null

),

-- on each of those dates, the version each source held
stitched as (

    select
        change_dates.learner_key,
        change_dates.changed_on as valid_from,
        student_versions.recorded_at as student_recorded_at,
        student_versions.full_name as student_full_name,
        student_versions.email as student_email,
        student_versions.status_code as student_status_code,
        student_versions.enrolled_award_bk,
        platform_versions.recorded_at as platform_recorded_at,
        platform_versions.full_name as platform_full_name,
        platform_versions.email as platform_email,
        platform_versions.status_code as platform_status_code,
        customer_versions.recorded_at as customer_recorded_at,
        customer_versions.full_name as customer_full_name,
        customer_versions.email as customer_email,
        customer_versions.status_code as customer_status_code
    from change_dates
    left join student_versions
        on student_versions.learner_key = change_dates.learner_key
        and {{ valid_at('change_dates.changed_on', 'student_versions.valid_from', 'student_versions.valid_to') }}
    left join platform_versions
        on platform_versions.learner_key = change_dates.learner_key
        and {{ valid_at('change_dates.changed_on', 'platform_versions.valid_from', 'platform_versions.valid_to') }}
    left join customer_versions
        on customer_versions.learner_key = change_dates.learner_key
        and {{ valid_at('change_dates.changed_on', 'customer_versions.valid_from', 'customer_versions.valid_to') }}

),

-- one value per attribute: the student system first, then the learning platform, then short courses
resolved as (

    select
        learner_key,
        valid_from,
        greatest(student_recorded_at, platform_recorded_at, customer_recorded_at) as recorded_at,
        coalesce(student_full_name, platform_full_name, customer_full_name) as full_name,
        coalesce(student_email, platform_email, customer_email) as email,
        case
            when student_status_code is not null then 'SIS'
            when platform_status_code is not null then 'LMS'
            when customer_status_code is not null then 'SC'
        end as status_key_set,
        coalesce(student_status_code, platform_status_code, customer_status_code) as status_code,
        enrolled_award_bk
    from stitched

),

-- each system's status code, in the canonical set
translated as (

    select
        resolved.*,
        status_map.canonical_status as status
    from resolved
    left join status_map
        on status_map.key_set = resolved.status_key_set
        and status_map.source_code = resolved.status_code

),

compared as (

    select
        *,
        row_number() over (partition by learner_key order by valid_from) as version_number,
        lag(full_name) over (partition by learner_key order by valid_from) as previous_full_name,
        lag(email) over (partition by learner_key order by valid_from) as previous_email,
        lag(status) over (partition by learner_key order by valid_from) as previous_status,
        lag(enrolled_award_bk) over (partition by learner_key order by valid_from) as previous_enrolled_award_bk
    from translated

),

-- keep a version only where something the model holds changed
changed as (

    select * from compared
    where version_number = 1
       or full_name is distinct from previous_full_name
       or email is distinct from previous_email
       or status is distinct from previous_status
       or enrolled_award_bk is distinct from previous_enrolled_award_bk

)

select
    learner_key,
    valid_from,
    lead(valid_from) over (partition by learner_key order by valid_from) as valid_to,
    recorded_at,
    full_name,
    email,
    status,
    enrolled_award_bk
from changed
