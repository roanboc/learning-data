with

source as (

    select * from {{ source('claims_app', 'claims') }}

),

renamed as (

    select
        upper(trim(claim_id)) as claim_id,
        upper(trim(staff_id)) as staff_id,
        upper(trim(contract_id)) as contract_id,
        upper(trim(unit_code)) as unit_code,
        lower(trim(duty)) as duty,
        cast(work_date as date) as worked_on,
        cast(hours as decimal(5, 2)) as hours,
        cast(amount as decimal(9, 2)) as amount,
        lower(trim(status)) as status,
        cast(approved_at as timestamp) as approved_at,
        cast(updated_at as timestamp) as updated_at
    from source

),

keyed as (

    select
        {{ business_key('CLM', 'claim_id') }} as claim_bk,
        {{ business_key('HR', 'staff_id') }} as staff_bk,
        {{ business_key('HR', 'contract_id') }} as contract_bk,
        *
    from renamed

)

select
    {{ hash_key(['claim_bk']) }} as claim_key,
    *
from keyed
