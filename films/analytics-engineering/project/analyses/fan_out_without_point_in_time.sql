-- Evidence for the grain: join credit to awards on the award key alone, and every learner of an
-- award with two versions gets their credit twice. Joining the version valid on the census date
-- keeps one row per learner per award.
-- Run: dbt show --select fan_out_without_point_in_time --profiles-dir .
with

credit as (

    select * from {{ ref('core_credit_towards_award') }}
    where {{ valid_at(census_date()) }}

),

awards as (

    select * from {{ ref('core_award') }}

),

every_version as (

    select awards.award_code, credit.learner_key, credit.credit_points_earned
    from credit
    inner join awards on awards.award_key = credit.award_key

),

version_at_census as (

    select awards.award_code, credit.learner_key, credit.credit_points_earned
    from credit
    inner join awards
        on awards.award_key = credit.award_key
        and {{ valid_at(census_date(), 'awards.valid_from', 'awards.valid_to') }}

)

select
    'every version' as joined_to,
    count(*) as rows_returned,
    count(distinct learner_key) as learners,
    sum(credit_points_earned) as credit_points
from every_version
where award_code = 'GCHI'

union all

select
    'the version at census',
    count(*),
    count(distinct learner_key),
    sum(credit_points_earned)
from version_at_census
where award_code = 'GCHI'
