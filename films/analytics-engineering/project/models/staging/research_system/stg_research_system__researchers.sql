with

source as (

    select * from {{ source('research_system', 'researchers') }}

),

renamed as (

    select
        upper(trim(member_id)) as member_id,
        trim(display_name) as display_name,
        nullif(lower(trim(email)), '') as email,
        nullif(upper(trim(staff_id)), '') as staff_id,
        upper(trim(country_of_birth)) as country_of_birth,
        cast(_valid_from as timestamp) as recorded_from,
        cast(_valid_to as timestamp) as recorded_to,
        cast(_is_current as boolean) as is_current_version,
        cast(_loaded_at as timestamp) as loaded_at
    from source

),

keyed as (

    select
        {{ business_key('RES', 'member_id') }} as member_bk,
        {{ business_key('HR', 'staff_id') }} as staff_bk,
        *
    from renamed

)

select
    {{ hash_key(['member_bk']) }} as member_key,
    *
from keyed
