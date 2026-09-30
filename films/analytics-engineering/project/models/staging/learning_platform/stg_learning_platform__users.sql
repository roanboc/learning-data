with

source as (

    select * from {{ source('learning_platform', 'users') }}

),

renamed as (

    select
        lower(trim(user_id)) as user_id,
        nullif(upper(trim(student_id)), '') as student_id,
        nullif(lower(trim(email)), '') as email,
        trim(display_name) as display_name,
        lower(trim(account_status)) as account_status,
        cast(_valid_from as timestamp) as recorded_from,
        cast(_valid_to as timestamp) as recorded_to,
        cast(_is_current as boolean) as is_current_version,
        cast(_loaded_at as timestamp) as loaded_at
    from source

),

keyed as (

    select
        {{ business_key('LMS', 'user_id') }} as user_bk,
        {{ business_key('SIS', 'student_id') }} as student_bk,
        *
    from renamed

)

select
    {{ hash_key(['user_bk']) }} as user_key,
    *
from keyed
