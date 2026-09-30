with

badges as (

    select * from {{ ref('stg_learning_platform__badges') }}

),

enrolments as (

    select * from {{ ref('stg_short_courses__enrolments') }}

),

student_records as (

    select * from {{ ref('stg_student_system__learners') }}

),

awards as (

    select * from {{ ref('stg_student_system__awards') }}

),

matched_keys as (

    select * from {{ ref('int_learner_keys_matched') }}

),

-- the learning platform can't flag a revoked badge: it deletes it, so the last version closes
badge_history as (

    select
        badge_bk,
        max(case when is_current_version then 1 else 0 end) = 1 as is_still_shown,
        max(recorded_to) as last_recorded_to,
        max(loaded_at) as loaded_at
    from badges
    group by badge_bk

),

latest_badges as (

    select
        *,
        row_number() over (partition by badge_bk order by recorded_from desc) as newest_first
    from badges

),

platform_credentials as (

    select
        latest_badges.badge_bk as credential_bk,
        latest_badges.user_bk as holder_bk,
        'LMS' as key_set,
        case when latest_badges.credit_points > 0 then 'microcredential' else 'badge' end as credential_kind,
        latest_badges.badge_code as credential_code,
        latest_badges.badge_name as credential_name,
        latest_badges.credit_points,
        cast(latest_badges.issued_at as date) as issued_on,
        case when not badge_history.is_still_shown then cast(badge_history.last_recorded_to as date) end as revoked_on,
        badge_history.loaded_at
    from latest_badges
    inner join badge_history on badge_history.badge_bk = latest_badges.badge_bk
    where latest_badges.newest_first = 1

),

-- a certificate of attendance isn't a credential
course_credentials as (

    select
        certificate_bk as credential_bk,
        customer_bk as holder_bk,
        'SC' as key_set,
        'microcredential' as credential_kind,
        course_code as credential_code,
        course_name as credential_name,
        credit_points,
        completed_on as issued_on,
        cast(null as date) as revoked_on,
        loaded_at
    from enrolments
    where is_current_version
      and enrolment_status = 'completed'
      and certificate_type = 'completion'

),

-- the student system has no conferral table: an award is conferred when the record turns completed
completions as (

    select
        student_id,
        award_code,
        student_bk,
        award_bk,
        min(effective_date) as conferred_on,
        max(loaded_at) as loaded_at
    from student_records
    where status_code = 'CMP'
    group by student_id, award_code, student_bk, award_bk

),

award_credentials as (

    select
        {{ business_key('SIS', ['completions.student_id', 'completions.award_code']) }} as credential_bk,
        completions.student_bk as holder_bk,
        'SIS' as key_set,
        'award' as credential_kind,
        completions.award_code as credential_code,
        awards.award_name as credential_name,
        awards.credit_points_required as credit_points,
        completions.conferred_on as issued_on,
        cast(null as date) as revoked_on,
        completions.loaded_at
    from completions
    inner join awards
        on awards.award_bk = completions.award_bk
        and {{ valid_at('completions.conferred_on', 'cast(awards.recorded_from as date)', 'cast(awards.recorded_to as date)') }}

),

every_credential as (

    select * from platform_credentials
    union all
    select * from course_credentials
    union all
    select * from award_credentials

),

-- a credential whose holder has no key can't reach anyone: it stays out (see docs/gaps.md)
held as (

    select
        every_credential.*,
        matched_keys.learner_key,
        matched_keys.learner_bk
    from every_credential
    inner join matched_keys on matched_keys.qualified_key = every_credential.holder_bk

)

select
    {{ hash_key(['credential_bk']) }} as credential_key,
    credential_bk,
    learner_key,
    learner_bk,
    key_set,
    credential_kind,
    credential_code,
    credential_name,
    credit_points,
    issued_on,
    case when revoked_on is not null then 'revoked' else 'valid' end as status,
    revoked_on,
    loaded_at
from held
