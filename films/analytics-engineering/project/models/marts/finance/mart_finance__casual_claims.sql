-- Finance's fact for casual teaching cost (DEC-FIN-05): one row per claim approved for casual staff
-- (pay type CAS), with the teaching period of the contract it's claimed under, whether its duty is
-- teaching (Finance's list, the seed teaching_duties), and Finance's on-cost rate for the year of that
-- teaching period (the seed on_cost_rates). The metric view casual_teaching_cost counts it, once, on
-- Databricks: what the casual teaching in a teaching period costs.

with

claims as (

    select * from {{ ref('core_claim', v=1) }}

),

units as (

    select * from {{ ref('units') }}

),

duties as (

    select * from {{ ref('teaching_duties') }}

),

rates as (

    select * from {{ ref('on_cost_rates') }}

),

-- the claims approved for casual staff: approved, so paid or to be paid, and claimed under a casual contract
approved as (

    select * from claims
    where claims.status = 'approved'
        and claims.pay_type = 'CAS'

)

-- a duty or a year Finance hasn't decided keeps its row, with no flag or rate, and its test stops the build
select
    approved.claim_key,
    units.faculty_code,
    units.faculty_name,
    approved.unit_code,
    units.unit_name,
    approved.teaching_period,
    approved.duty,
    duties.is_teaching_duty,
    approved.amount,
    cast(rates.on_cost_rate as decimal(5, 4)) as on_cost_rate
from approved
left join units on units.unit_code = approved.unit_code
left join duties on duties.duty = approved.duty
left join rates on rates.rate_year = cast(substr(approved.teaching_period, 1, 4) as int)
