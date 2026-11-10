-- Every name the student system sends for the graduation list is allowed: not empty, nothing but
-- letters (in any alphabet, accents too), spaces, hyphens and apostrophes, and no longer than its
-- field: 30 characters for a given name, 100 for a family name (30 until 14 September 2026,
-- DEC-SIS-07). Allowed isn't right: a name without its accents, cut short, or with its names swapped
-- passes too, and only a reference can say which, such as the graduate, in the portal. Fails with
-- one row per name that isn't allowed, and why; the name itself stays out of the result.
{{ config(group='graduations') }}

with

graduations as (

    select * from {{ ref('stg_student_system__graduations') }}
    where is_current_version

),

names as (

    select graduation_bk, 'given_name' as name_part, given_name as name_value, 30 as field_length
    from graduations

    union all

    select graduation_bk, 'family_name' as name_part, family_name as name_value, 100 as field_length
    from graduations

)

select
    graduation_bk,
    name_part,
    case
        when coalesce(name_value, '') = '' then 'empty'
        when length(name_value) > field_length then 'longer than its field'
        else 'a character not allowed'
    end as why
from names
where coalesce(name_value, '') = ''
   or length(name_value) > field_length
   or not {{ allowed_name('name_value') }}
