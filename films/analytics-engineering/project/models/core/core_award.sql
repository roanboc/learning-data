with

awards as (

    select * from {{ ref('stg_student_system__awards') }}

)

-- one source and nothing to resolve: no intermediate step needed
select
    award_key,
    award_bk,
    cast(recorded_from as date) as valid_from,
    cast(recorded_to as date) as valid_to,
    {{ valid_at(as_is_date(), 'cast(recorded_from as date)', 'cast(recorded_to as date)') }} as is_current,
    award_code,
    award_name,
    award_type,
    credit_points_required,
    faculty_code,
    faculty_name
from awards
