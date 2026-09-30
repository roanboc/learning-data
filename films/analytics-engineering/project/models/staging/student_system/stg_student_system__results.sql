with

source as (

    select * from {{ source('student_system', 'results') }}

),

renamed as (

    select
        trim(result_id) as result_id,
        trim(student_id) as student_id,
        trim(award_code) as award_code,
        trim(unit_code) as unit_code,
        upper(trim(grade)) as grade,
        cast(credit_points as int) as credit_points,
        cast(result_date as date) as result_date,
        cast(_valid_from as timestamp) as recorded_from,
        cast(_valid_to as timestamp) as recorded_to,
        cast(_is_current as boolean) as is_current_version,
        cast(_loaded_at as timestamp) as loaded_at
    from source

),

keyed as (

    select
        {{ business_key('SIS', 'result_id') }} as result_bk,
        {{ business_key('SIS', 'student_id') }} as student_bk,
        {{ business_key('SIS', 'award_code') }} as award_bk,
        *
    from renamed

)

select
    {{ hash_key(['result_bk']) }} as result_key,
    *
from keyed
