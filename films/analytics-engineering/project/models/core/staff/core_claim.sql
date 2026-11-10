-- A claim for hours worked, as it stands now in the claims app, read where the app writes it
-- (stg_claims_app__claims), with the pay type and teaching period of the contract it's claimed under,
-- as the HR system holds that contract now. Marts read claims here: staging is private.

with

claims as (

    select * from {{ ref('stg_claims_app__claims') }}

),

contracts as (

    select * from {{ ref('stg_hr_system__contracts') }}
    where is_current_version

)

select
    claims.claim_key,
    claims.claim_bk,
    claims.staff_bk,
    claims.contract_bk,
    claims.unit_code,
    claims.duty,
    claims.worked_on,
    claims.hours,
    claims.amount,
    claims.status,
    claims.approved_at,
    claims.updated_at,
    contracts.pay_type,
    contracts.teaching_period
from claims
left join contracts on contracts.contract_bk = claims.contract_bk
