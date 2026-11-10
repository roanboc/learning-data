-- Every name the student system sends for the graduation list is allowed: not empty, nothing but
-- letters (in any alphabet, accents too), spaces, hyphens and apostrophes, and at most 30
-- characters, the length of the student system's field. Allowed isn't right: a name without its
-- accents, cut short, or with its given and family names swapped passes too, and only a reference
-- can say which, such as the graduate, in the portal. Fails with one row per name that isn't
-- allowed, and why; the name itself stays out of the result.
{{ config(group='graduations') }}

with

graduations as (

    select * from {{ ref('stg_student_system__graduations') }}
    where is_current_version

),

names as (

    select graduation_bk, 'given_name' as name_part, given_name as name_value
    from graduations

    union all

    select graduation_bk, 'family_name' as name_part, family_name as name_value
    from graduations

)

select
    graduation_bk,
    name_part,
    case
        when coalesce(name_value, '') = '' then 'empty'
        when length(name_value) > 30 then 'over 30 characters'
        else 'a character not allowed'
    end as why
from names
where coalesce(name_value, '') = ''
   or length(name_value) > 30
   or not {{ allowed_name('name_value') }}
