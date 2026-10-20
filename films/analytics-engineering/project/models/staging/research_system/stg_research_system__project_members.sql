with

source as (

    select * from {{ source('research_system', 'project_members') }}

),

renamed as (

    select
        upper(trim(member_id)) as member_id,
        upper(trim(project_code)) as project_code,
        lower(trim(project_role)) as project_role,
        nullif(upper(trim(supervisor_member_id)), '') as supervisor_member_id,
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
        {{ business_key('RES', ['member_id', 'project_code']) }} as project_member_bk,
        {{ business_key('RES', 'member_id') }} as member_bk,
        {{ business_key('RES', 'project_code') }} as project_bk,
        {{ business_key('RES', 'supervisor_member_id') }} as supervisor_member_bk,
        *
    from renamed

)

select
    {{ hash_key(['project_member_bk']) }} as project_member_key,
    *
from keyed
