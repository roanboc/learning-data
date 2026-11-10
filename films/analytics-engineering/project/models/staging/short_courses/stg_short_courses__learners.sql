with

source as (

    select * from {{ source('short_courses', 'learners') }}

),

renamed as (

    select
        nullif(lower(trim(customer_email)), '') as email,
        trim(customer_name) as customer_name,
        trim(cast(status as string)) as status_code,
        cast(_valid_from as timestamp) as recorded_from,
        cast(_valid_to as timestamp) as recorded_to,
        cast(_is_current as boolean) as is_current_version,
        cast(_loaded_at as timestamp) as loaded_at
    from source

),

keyed as (

    select
        {{ business_key('SC', 'email') }} as customer_bk,
        *
    from renamed

)

select
    {{ hash_key(['customer_bk']) }} as customer_key,
    *
from keyed
