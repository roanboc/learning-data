with

learners as (

    select * from {{ ref('core_learner', v=1) }}

),

awards as (

    select * from {{ ref('core_award', v=1) }}

),

credit as (

    select * from {{ ref('core_credit_towards_award', v=1) }}

),

rates as (

    select * from {{ ref('tuition_rates') }}

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

-- the census year's published rates
rates_for_census as (

    select
        award_type,
        rate_year,
        rate_per_credit_point
    from rates
    where rate_year = extract(year from {{ census_date() }})

),

-- the award each learner was enrolled in on the census date, and only that one (DEC-FIN-02)
enrolled as (

    select
        learner_key,
        learner_bk,
        enrolled_award_key as award_key
    from learners_at_census
    where enrolled_award_key is not null

),

joined as (

    select
        enrolled.learner_key,
        enrolled.learner_bk,
        awards_at_census.award_key,
        awards_at_census.award_bk,
        awards_at_census.award_code,
        awards_at_census.award_name,
        awards_at_census.award_type,
        awards_at_census.faculty_code,
        awards_at_census.faculty_name,
        coalesce(credit_at_census.credit_points_from_microcredentials, 0) as credit_points_recognised
    from enrolled
    inner join awards_at_census on awards_at_census.award_key = enrolled.award_key
    left join credit_at_census
        on credit_at_census.learner_key = enrolled.learner_key
        and credit_at_census.award_key = enrolled.award_key

)

select
    {{ hash_key(['joined.learner_bk', 'joined.award_bk']) }} as learner_award_key,
    {{ census_date() }} as census_date,
    joined.learner_key,
    joined.award_key,
    joined.award_code,
    joined.award_name,
    joined.award_type,
    joined.faculty_code,
    joined.faculty_name,
    joined.credit_points_recognised,
    rates_for_census.rate_year,
    rates_for_census.rate_per_credit_point,
    joined.credit_points_recognised * rates_for_census.rate_per_credit_point as tuition_forgone
from joined
inner join rates_for_census on rates_for_census.award_type = joined.award_type
