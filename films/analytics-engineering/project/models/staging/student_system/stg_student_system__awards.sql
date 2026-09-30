with

source as (

    select * from {{ source('student_system', 'awards') }}

),

renamed as (

    select
        trim(award_code) as award_code,
        trim(award_name) as award_name,
        lower(trim(award_type)) as award_type,
        cast(credit_points_required as int) as credit_points_required,
        trim(faculty_code) as faculty_code,
        trim(faculty_name) as faculty_name,
        cast(_valid_from as timestamp) as recorded_from,
        cast(_valid_to as timestamp) as recorded_to,
        cast(_is_current as boolean) as is_current_version,
        cast(_loaded_at as timestamp) as loaded_at
    from source

),

keyed as (

    select
        {{ business_key('SIS', 'award_code') }} as award_bk,
        *
    from renamed

)

select
    {{ hash_key(['award_bk']) }} as award_key,
    *
from keyed
