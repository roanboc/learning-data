with

source as (

    select * from {{ source('portal', 'name_confirmations') }}

),

renamed as (

    select
        upper(trim(confirmation_id)) as confirmation_id,
        upper(trim(student_id)) as student_id,
        upper(trim(ceremony_id)) as ceremony_id,
        lower(trim(answer)) as answer,
        trim(given_name) as given_name,
        trim(family_name) as family_name,
        trim(name_as_printed) as name_as_printed,
        cast(confirmed_at as timestamp) as confirmed_at,
        cast(checked_on as date) as checked_on,
        cast(_valid_from as timestamp) as recorded_from,
        cast(_valid_to as timestamp) as recorded_to,
        cast(_is_current as boolean) as is_current_version,
        cast(_loaded_at as timestamp) as loaded_at
    from source

),

keyed as (

    select
        {{ business_key('SP', 'confirmation_id') }} as confirmation_bk,
        {{ business_key('SIS', 'student_id') }} as student_bk,
        *
    from renamed

)

select
    {{ hash_key(['confirmation_bk']) }} as confirmation_key,
    *
from keyed
