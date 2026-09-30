with

learners as (

    select * from {{ ref('core_learner') }}

),

awards as (

    select * from {{ ref('core_award') }}

),

credit as (

    select * from {{ ref('core_credit_towards_award') }}

),

credentials as (

    select * from {{ ref('core_credential') }}

),

-- as it is now: each entity's current version
current_learners as (

    select * from learners where is_current

),

current_awards as (

    select * from awards where is_current

),

current_credit as (

    select * from credit where is_current

),

credentials_held as (

    select
        learner_key,
        cast(count(case when status = 'valid' then 1 end) as int) as credentials_held,
        cast(count(case when status = 'valid' and credential_kind = 'award' then 1 end) as int) as awards_held,
        cast(count(case when status = 'valid' and credential_kind = 'microcredential' then 1 end) as int) as microcredentials_held,
        cast(count(case when status = 'valid' and credential_kind = 'badge' then 1 end) as int) as badges_held,
        cast(count(case when status = 'revoked' then 1 end) as int) as credentials_revoked
    from credentials
    group by learner_key

)

-- one wide row per learner: who they are, what they hold, and how far they are towards their award
select
    current_learners.learner_key,
    current_learners.full_name,
    current_learners.email,
    current_learners.status,
    current_awards.award_name as enrolled_award_name,
    current_awards.award_type as enrolled_award_type,
    current_awards.credit_points_required,
    coalesce(current_credit.credit_points_earned, 0) as credit_points_earned,
    greatest(current_awards.credit_points_required - coalesce(current_credit.credit_points_earned, 0), 0)
        as credit_points_remaining,
    coalesce(credentials_held.credentials_held, 0) as credentials_held,
    coalesce(credentials_held.awards_held, 0) as awards_held,
    coalesce(credentials_held.microcredentials_held, 0) as microcredentials_held,
    coalesce(credentials_held.badges_held, 0) as badges_held,
    coalesce(credentials_held.credentials_revoked, 0) as credentials_revoked
from current_learners
left join current_awards on current_awards.award_key = current_learners.enrolled_award_key
left join current_credit
    on current_credit.learner_key = current_learners.learner_key
    and current_credit.award_key = current_learners.enrolled_award_key
left join credentials_held on credentials_held.learner_key = current_learners.learner_key
