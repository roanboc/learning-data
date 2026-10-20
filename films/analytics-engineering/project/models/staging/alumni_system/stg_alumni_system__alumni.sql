with

source as (

    select * from {{ source('alumni_system', 'alumni') }}

),

renamed as (

    select
        upper(trim(alumni_id)) as alumni_id,
        upper(trim(student_id)) as student_id,
        trim(given_name) as given_name,
        trim(family_name) as family_name,
        nullif(lower(trim(email)), '') as email,
        trim(award_name) as award_name,
        cast(graduated_on as date) as graduated_on,
        cast(_valid_from as timestamp) as recorded_from,
        cast(_valid_to as timestamp) as recorded_to,
        cast(_is_current as boolean) as is_current_version,
        cast(_loaded_at as timestamp) as loaded_at
    from source

),

keyed as (

    select
        {{ business_key('ALU', 'alumni_id') }} as alumni_bk,
        {{ business_key('SIS', 'student_id') }} as student_bk,
        *
    from renamed

)

select
    {{ hash_key(['alumni_bk']) }} as alumni_key,
    *
from keyed
