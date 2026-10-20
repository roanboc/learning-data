with

source as (

    select * from {{ source('hr_system', 'staff') }}

),

renamed as (

    select
        upper(trim(staff_id)) as staff_id,
        trim(given_name) as given_name,
        trim(family_name) as family_name,
        cast(birth_date as date) as birth_date,
        trim(country_of_birth) as country_of_birth,
        nullif(lower(trim(email)), '') as email,
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

select
    {{ hash_key(['staff_bk']) }} as staff_key,
    *
from keyed
