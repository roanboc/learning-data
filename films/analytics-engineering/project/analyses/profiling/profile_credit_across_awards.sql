-- Evidence: recognised credit counts towards every award it could count towards, so one
-- microcredential can be counted against two or three awards. Added up across awards, it would
-- save tuition two or three times over.
-- Run: dbt show --select profile_credit_across_awards --profiles-dir .
with

credit_at_census as (

    select * from {{ ref('core_credit_towards_award') }}
    where {{ valid_at(census_date()) }}
      and credit_points_from_microcredentials > 0

),

learners_at_census as (

    select * from {{ ref('core_learner') }}
    where {{ valid_at(census_date()) }}

)

select
    count(distinct credit_at_census.learner_key) as learners_with_recognised_credit,
    count(*) as awards_it_counts_towards,
    sum(credit_at_census.credit_points_from_microcredentials) as credit_points_across_awards,
    sum(
        case
            when learners_at_census.enrolled_award_key = credit_at_census.award_key
                then credit_at_census.credit_points_from_microcredentials
            else 0
        end
    ) as credit_points_in_the_enrolled_award
from credit_at_census
left join learners_at_census on learners_at_census.learner_key = credit_at_census.learner_key
