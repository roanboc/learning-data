with

source as (

    select * from {{ source('research_system', 'projects') }}

),

renamed as (

    select
        upper(trim(project_code)) as project_code,
        trim(title) as title,
        upper(trim(lead_member_id)) as lead_member_id,
        cast(starts_on as date) as starts_on,
        cast(ends_on as date) as ends_on,
        cast(_valid_from as timestamp) as recorded_from,
        cast(_valid_to as timestamp) as recorded_to,
        cast(_is_current as boolean) as is_current_version,
        cast(_loaded_at as timestamp) as loaded_at
    from source

),

keyed as (

    select
        {{ business_key('RES', 'project_code') }} as project_bk,
        {{ business_key('RES', 'lead_member_id') }} as lead_member_bk,
        *
    from renamed

)

select
    {{ hash_key(['project_bk']) }} as project_key,
    *
from keyed
