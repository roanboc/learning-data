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

    select *
    from badges
    qualify row_number() over (partition by badge_bk order by recorded_from desc) = 1

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

),

-- a certificate of attendance isn't a credential
completed_courses as (

    select * from enrolments
    where enrolment_status = 'completed'
      and certificate_type = 'completion'
      and certificate_bk is not null

),

-- a certificate is revoked when its enrolment stops being completed: from the day it stopped
certificate_history as (

    select
        certificate_bk,
        min(completed_on) as issued_on,
        max(case when is_current_version then 1 else 0 end) = 1 as is_still_completed,
        max(recorded_to) as last_recorded_to,
        max(loaded_at) as loaded_at
    from completed_courses
    group by certificate_bk

),

latest_certificates as (

    select *
    from completed_courses
    qualify row_number() over (partition by certificate_bk order by recorded_from desc) = 1

),

course_credentials as (

    select
        latest_certificates.certificate_bk as credential_bk,
        latest_certificates.customer_bk as holder_bk,
        'SC' as key_set,
        'microcredential' as credential_kind,
        latest_certificates.course_code as credential_code,
        latest_certificates.course_name as credential_name,
        latest_certificates.credit_points,
        certificate_history.issued_on,
        case
            when not certificate_history.is_still_completed
                then cast(certificate_history.last_recorded_to as date)
        end as revoked_on,
        certificate_history.loaded_at
    from latest_certificates
    inner join certificate_history
        on certificate_history.certificate_bk = latest_certificates.certificate_bk

),

-- the student system has no conferral table: an award is conferred when the record turns completed
student_record_changes as (

    select
        *,
        lead(status_code) over (
            partition by student_bk order by effective_date, recorded_from
        ) as next_status_code,
        lead(award_bk) over (
            partition by student_bk order by effective_date, recorded_from
        ) as next_award_bk,
        lead(effective_date) over (
            partition by student_bk order by effective_date, recorded_from
        ) as next_effective_date
    from student_records

),

completed_versions as (

    select
        *,
        row_number() over (
            partition by student_bk, award_bk order by effective_date desc, recorded_from desc
        ) as newest_first
    from student_record_changes
    where status_code = 'CMP'

),

-- conferred the day the first completed version took effect; revoked the day a later version
-- of the same award stopped being completed
completions as (

    select
        student_id,
        award_code,
        student_bk,
        award_bk,
        min(effective_date) as conferred_on,
        max(
            case
                when newest_first = 1
                 and next_award_bk = award_bk
                 and next_status_code <> 'CMP'
                    then next_effective_date
            end
        ) as revoked_on,
        max(loaded_at) as loaded_at
    from completed_versions
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
        completions.revoked_on,
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
