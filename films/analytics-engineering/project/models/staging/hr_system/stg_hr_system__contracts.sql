with

source as (

    select * from {{ source('hr_system', 'contracts') }}

),

renamed as (

    select
        upper(trim(contract_id)) as contract_id,
        upper(trim(staff_id)) as staff_id,
        trim(position_type) as position_type,
        trim(position_title) as position_title,
        upper(trim(pay_type)) as pay_type,
        nullif(upper(trim(unit_code)), '') as unit_code,
        nullif(upper(trim(teaching_period)), '') as teaching_period,
        cast(starts_on as date) as starts_on,
        cast(ends_on as date) as ends_on,
        cast(_valid_from as timestamp) as recorded_from,
        cast(_valid_to as timestamp) as recorded_to,
        cast(_is_current as boolean) as is_current_version,
        cast(_loaded_at as timestamp) as loaded_at
    from source

),

keyed as (

    select
        {{ business_key('HR', 'contract_id') }} as contract_bk,
        {{ business_key('HR', 'staff_id') }} as staff_bk,
        *
    from renamed

)

select
    {{ hash_key(['contract_bk']) }} as contract_key,
    *
from keyed
