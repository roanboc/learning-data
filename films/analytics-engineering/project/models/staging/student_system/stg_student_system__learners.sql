with

source as (

    select * from {{ source('student_system', 'learners') }}

),

renamed as (

    select
        trim(student_id) as student_id,
        trim(given_name) as given_name,
        trim(family_name) as family_name,
        nullif(lower(trim(email)), '') as email,
        trim(status_code) as status_code,
        trim(award_code) as award_code,
        cast(effective_date as date) as effective_date,
        cast(_valid_from as timestamp) as recorded_from,
        cast(_valid_to as timestamp) as recorded_to,
        cast(_is_current as boolean) as is_current_version,
        cast(_loaded_at as timestamp) as loaded_at
    from source

),

keyed as (

    select
        {{ business_key('SIS', 'student_id') }} as student_bk,
        {{ business_key('SIS', 'award_code') }} as award_bk,
        *
    from renamed

)

select
    {{ hash_key(['student_bk']) }} as student_key,
    *
from keyed
