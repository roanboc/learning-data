with

source as (

    select * from {{ source('learning_platform', 'badges') }}

),

renamed as (

    select
        trim(badge_id) as badge_id,
        trim(user_id) as user_id,
        trim(badge_code) as badge_code,
        trim(badge_name) as badge_name,
        cast(credit_points as int) as credit_points,
        cast(issued_at as timestamp) as issued_at,
        cast(_valid_from as timestamp) as recorded_from,
        cast(_valid_to as timestamp) as recorded_to,
        cast(_is_current as boolean) as is_current_version,
        cast(_loaded_at as timestamp) as loaded_at
    from source

),

keyed as (

    select
        {{ business_key('LMS', 'badge_id') }} as badge_bk,
        {{ business_key('LMS', 'user_id') }} as user_bk,
        *
    from renamed

)

select
    {{ hash_key(['badge_bk']) }} as badge_key,
    *
from keyed
