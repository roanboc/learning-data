-- Learners enrolled in each faculty's awards on the census date, from the credential project's
-- public core. A two-argument ref names the project; v= pins the version this model was built on.
with

learners as (

    select * from {{ ref('credentials', 'core_learner', v=1) }}

),

awards as (

    select * from {{ ref('credentials', 'core_award', v=1) }}

),

learners_at_census as (

    select * from learners
    where valid_from <= cast('{{ var("census_date") }}' as date)
      and (valid_to is null or valid_to > cast('{{ var("census_date") }}' as date))

),

awards_at_census as (

    select * from awards
    where valid_from <= cast('{{ var("census_date") }}' as date)
      and (valid_to is null or valid_to > cast('{{ var("census_date") }}' as date))

)

select
    awards_at_census.faculty_code,
    awards_at_census.faculty_name,
    count(distinct learners_at_census.learner_key) as learners_enrolled
from learners_at_census
inner join awards_at_census on awards_at_census.award_key = learners_at_census.enrolled_award_key
where learners_at_census.status = 'studying'
group by awards_at_census.faculty_code, awards_at_census.faculty_name
