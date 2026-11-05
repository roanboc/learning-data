with

source as (

    select * from {{ source('student_system', 'graduations') }}

),

renamed as (

    select
        upper(trim(student_id)) as student_id,
        upper(trim(award_code)) as award_code,
        trim(given_name) as given_name,
        trim(family_name) as family_name,
        cast(conferral_date as date) as conferred_on,
        upper(trim(ceremony_id)) as ceremony_id,
        upper(trim(attendance_code)) as attendance_code,
        cast(_valid_from as timestamp) as recorded_from,
        cast(_valid_to as timestamp) as recorded_to,
        cast(_is_current as boolean) as is_current_version,
        cast(_loaded_at as timestamp) as loaded_at
    from source

),

keyed as (

    select
        {{ business_key('SIS', ['student_id', 'award_code']) }} as graduation_bk,
        {{ business_key('SIS', 'student_id') }} as student_bk,
        {{ business_key('SIS', 'award_code') }} as award_bk,
        *
    from renamed

)

select
    {{ hash_key(['graduation_bk']) }} as graduation_key,
    *
from keyed
