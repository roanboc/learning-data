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

-- as it was: each entity's version on the census date
learners_at_census as (

    select * from learners
    where {{ valid_at(census_date()) }}

),

awards_at_census as (

    select * from awards
    where {{ valid_at(census_date()) }}

),

credit_at_census as (

    select * from credit
    where {{ valid_at(census_date()) }}

),

-- every award a learner was enrolled in, or had credit towards, on the census date
learner_awards as (

    select learner_key, award_key from credit_at_census
    union
    select learner_key, enrolled_award_key from learners_at_census where enrolled_award_key is not null

),

joined as (

    select
        learner_awards.learner_key,
        learner_awards.award_key,
        learners_at_census.learner_bk,
        awards_at_census.award_bk,
        awards_at_census.award_code,
        awards_at_census.award_name,
        awards_at_census.award_type,
        awards_at_census.faculty_code,
        awards_at_census.faculty_name,
        learners_at_census.status as learner_status,
        coalesce(learners_at_census.enrolled_award_key = learner_awards.award_key, false) as is_enrolled,
        awards_at_census.credit_points_required,
        coalesce(credit_at_census.credit_points_from_units, 0) as credit_points_from_units,
        coalesce(credit_at_census.credit_points_from_microcredentials, 0) as credit_points_from_microcredentials,
        coalesce(credit_at_census.credit_points_earned, 0) as credit_points_earned
    from learner_awards
    inner join awards_at_census on awards_at_census.award_key = learner_awards.award_key
    left join learners_at_census on learners_at_census.learner_key = learner_awards.learner_key
    left join credit_at_census
        on credit_at_census.learner_key = learner_awards.learner_key
        and credit_at_census.award_key = learner_awards.award_key

),

measured as (

    select
        *,
        greatest(credit_points_required - credit_points_earned, 0) as credit_points_remaining
    from joined

)

select
    {{ hash_key(['learner_bk', 'award_bk']) }} as learner_award_key,
    {{ census_date() }} as census_date,
    learner_key,
    award_key,
    award_code,
    award_name,
    award_type,
    faculty_code,
    faculty_name,
    learner_status,
    is_enrolled,
    credit_points_required,
    credit_points_from_units,
    credit_points_from_microcredentials,
    credit_points_earned,
    credit_points_remaining,
    is_enrolled
        and learner_status = 'studying'
        and {{ is_near_award('credit_points_remaining') }}
        as is_near_award
from measured
