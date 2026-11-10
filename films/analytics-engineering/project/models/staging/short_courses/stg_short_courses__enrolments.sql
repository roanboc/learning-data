with

source as (

    select * from {{ source('short_courses', 'enrolments') }}

),

renamed as (

    select
        upper(trim(enrolment_id)) as enrolment_id,
        nullif(lower(trim(customer_email)), '') as email,
        trim(course_code) as course_code,
        trim(course_name) as course_name,
        lower(trim(enrolment_status)) as enrolment_status,
        nullif(upper(trim(certificate_no)), '') as certificate_no,
        lower(trim(certificate_type)) as certificate_type,
        cast(credit_points as int) as credit_points,
        cast(completed_on as date) as completed_on,
        cast(_valid_from as timestamp) as recorded_from,
        cast(_valid_to as timestamp) as recorded_to,
        cast(_is_current as boolean) as is_current_version,
        cast(_loaded_at as timestamp) as loaded_at
    from source

),

keyed as (

    select
        {{ business_key('SC', 'enrolment_id') }} as enrolment_bk,
        {{ business_key('SC', 'email') }} as customer_bk,
        {{ business_key('SC', 'certificate_no') }} as certificate_bk,
        *
    from renamed

)

select
    {{ hash_key(['enrolment_bk']) }} as enrolment_key,
    *
from keyed
