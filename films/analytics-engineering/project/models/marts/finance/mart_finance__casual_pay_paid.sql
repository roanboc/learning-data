-- Payroll's export to Finance: what casual staff are paid on each pay day, by faculty and unit,
-- from the claims approved for it (DEC-FIN-04). Totals only: no names, no IDs, no one's pay.
-- For years a script on one person's laptop made it; since March 2026 it's this model, versioned,
-- reviewed and tested like the rest of the project, and built at 06:00 on each pay day by the job
-- payroll_export, which the bundle deploys (databricks.yml, DEC-PRJ-16).

with

claims as (

    select * from {{ ref('core_claim', v=1) }}

),

units as (

    select * from {{ ref('units') }}

),

-- each approved claim, with the pay day that pays it: payroll's rule, written once
approved as (

    select
        claims.staff_bk,
        claims.unit_code,
        claims.hours,
        claims.amount,
        {{ pay_day_for('claims.approved_at') }} as pay_day
    from claims
    where claims.status = 'approved'

),

-- the pay days up to the day of the build: the export reports pay that has been paid
paid as (

    select * from approved
    where approved.pay_day <= {{ as_is_date() }}

)

-- a unit missing from the registrar's list keeps its row, with no faculty, and its test stops the build
select
    paid.pay_day,
    units.faculty_code,
    units.faculty_name,
    paid.unit_code,
    units.unit_name,
    cast(count(distinct paid.staff_bk) as int) as casual_staff_paid,
    cast(count(*) as int) as claims_paid,
    cast(sum(paid.hours) as decimal(9, 2)) as hours_paid,
    cast(sum(paid.amount) as decimal(12, 2)) as casual_pay_paid
from paid
left join units on units.unit_code = paid.unit_code
group by paid.pay_day, units.faculty_code, units.faculty_name, paid.unit_code, units.unit_name
