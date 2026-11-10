with

source as (

    select * from {{ source('hr_system', 'wishes') }}

),

renamed as (

    select
        upper(trim(staff_id)) as staff_id,
        trim(purpose) as purpose,
        lower(trim(answer)) as answer,
        cast(given_on as date) as given_on,
        trim(given_how) as given_how,
        cast(_valid_from as timestamp) as recorded_from,
        cast(_valid_to as timestamp) as recorded_to,
        cast(_is_current as boolean) as is_current_version,
        cast(_loaded_at as timestamp) as loaded_at
    from source

),

keyed as (

    select
        {{ business_key('HR', 'staff_id') }} as staff_bk,
        *
    from renamed

)

select * from keyed
