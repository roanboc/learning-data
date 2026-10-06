-- The contract before the logic: what it reads, and an empty table with the columns and types
-- Finance's forecast needs. The tests are written; the logic comes next.
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

rates as (

    select * from {{ ref('tuition_rates') }}

)

select
    cast(null as varchar) as learner_award_key,
    cast(null as date) as census_date,
    cast(null as varchar) as learner_key,
    cast(null as varchar) as award_key,
    cast(null as varchar) as award_code,
    cast(null as varchar) as award_name,
    cast(null as varchar) as award_type,
    cast(null as varchar) as faculty_code,
    cast(null as varchar) as faculty_name,
    cast(null as integer) as credit_points_recognised,
    cast(null as integer) as rate_year,
    cast(null as integer) as rate_per_credit_point,
    cast(null as integer) as tuition_forgone
where false
