with

source as (

    select * from {{ source('exam_boards', 'approved_awards') }}

),

renamed as (

    select
        upper(trim(approval_id)) as approval_id,
        upper(trim(student_id)) as student_id,
        upper(trim(award_code)) as award_code,
        cast(approved_on as date) as conferred_on,
        upper(trim(faculty_code)) as faculty_code,
        cast(_valid_from as timestamp) as recorded_from,
        cast(_valid_to as timestamp) as recorded_to,
        cast(_is_current as boolean) as is_current_version,
        cast(_loaded_at as timestamp) as loaded_at
    from source

),

keyed as (

    select
        {{ business_key('EB', 'approval_id') }} as approval_bk,
        {{ business_key('SIS', 'student_id') }} as student_bk,
        {{ business_key('SIS', 'award_code') }} as award_bk,
        *
    from renamed

)

select
    {{ hash_key(['approval_bk']) }} as approval_key,
    *
from keyed
