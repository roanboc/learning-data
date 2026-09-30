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
    recorded_to is null as is_current,
    award_code,
    award_name,
    award_type,
    credit_points_required,
    faculty_code,
    faculty_name
from awards
