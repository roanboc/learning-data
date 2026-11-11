-- The workload agent's mart: each contract that holds today, in the version HR holds as true today.
-- Each week the workload agent tells the Faculty of Health's heads of school from it how many teach
-- in each school or unit this term, and how many are casual. The count by school is made where the
-- list of units and their schools is, at the university; the project's sample has none.
--
-- HR keeps every version it records of a contract: staging has one row per version. A tutor who
-- moves to another unit during the term has two versions of the same contract, so the contracts are
-- first cut to the version that holds today, with the project's own macros (macros/shared/time.sql).
-- Without that clause, each such contract counts twice: the test "each contract counts once" fails,
-- as it did in test on the night of 4 November 2026 (examples/night-in-test/).
--
-- This folder is one of the three the workload agent may change, under its mandate
-- (governance/8-mandates/workload-agent.yml): this file, not its YAML, which holds its contract
-- and tests.

with

contracts as (

    select *
    from {{ ref('stg_hr_system__contracts') }}
    where {{ valid_at(as_is_date(),
        'cast(recorded_from as date)',
        'cast(recorded_to as date)') }}

)

select
    contract_key,
    contract_bk,
    position_type,
    pay_type,
    pay_type = 'CAS' as is_casual,
    unit_code,
    teaching_period,
    starts_on,
    ends_on
from contracts
where starts_on <= {{ as_is_date() }}
    and (ends_on is null or ends_on >= {{ as_is_date() }})
