-- The hours to pay: each claim approved for the coming pay day, as the claims job sends them to the
-- payroll system at 22:00 on the Monday before it (resources/claims.job.yml). Payroll pays from its
-- own system, which the university buys and doesn't run on the platform, so these rows are the one
-- thing in the claims' story that leaves the platform. Payroll needs them by noon on Tuesday.

with

claims as (

    select * from {{ ref('core_claim', v=1) }}

),

pay_days as (

    select * from {{ ref('pay_days') }}

),

-- the pay run that's open on the day of the build: its claims have closed, at noon on the Monday,
-- and payroll hasn't closed it yet, at noon on the Tuesday. On any other day there's none, and the
-- job sends nothing.
open_pay_run as (

    select pay_days.pay_day
    from pay_days
    where cast(pay_days.claims_close_at as date) <= {{ as_is_date() }}
        and cast(pay_days.pay_run_closes_at as date) >= {{ as_is_date() }}

),

-- each approved claim, with the pay day that pays it: payroll's rule, written once
approved as (

    select
        claims.*,
        {{ pay_day_for('claims.approved_at') }} as pay_day
    from claims
    where claims.status = 'approved'

)

select
    approved.claim_key,
    approved.pay_day,
    approved.staff_bk,
    approved.contract_bk,
    approved.unit_code,
    approved.duty,
    approved.worked_on,
    approved.hours,
    approved.amount
from approved
inner join open_pay_run on open_pay_run.pay_day = approved.pay_day
