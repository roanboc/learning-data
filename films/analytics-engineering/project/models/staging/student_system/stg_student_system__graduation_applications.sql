with

source as (

    select * from {{ source('student_system', 'graduation_applications') }}

),

renamed as (

    select
        upper(trim(student_id)) as student_id,
        upper(trim(ceremony_id)) as ceremony_id,
        lower(trim(application_form)) as application_form,
        cast(received_on as date) as received_on,
        cast(_valid_from as timestamp) as recorded_from,
        cast(_valid_to as timestamp) as recorded_to,
        cast(_is_current as boolean) as is_current_version,
        cast(_loaded_at as timestamp) as loaded_at
    from source

),

keyed as (

    select
        {{ business_key('SIS', ['student_id', 'ceremony_id']) }} as application_bk,
        {{ business_key('SIS', 'student_id') }} as student_bk,
        *
    from renamed

)

select
    {{ hash_key(['application_bk']) }} as application_key,
    *
from keyed
