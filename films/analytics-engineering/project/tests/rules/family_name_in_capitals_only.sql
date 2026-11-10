-- A family name in capitals only, as the online application form took it until 2019, with no
-- accents: it holds for the registrar's office (a warning, _rules__tests.yml), a list to work
-- through, as each graduate confirms their name, those due to graduate first: one row per
-- graduate, each corrected once, in the student system (DEC-SIS-06).
-- Each night, on the student system's graduations as staged, where the list's names come from.
-- The name itself stays out of the result: the office reads it in the student system.
{{ config(group='graduations') }}

with

graduations as (

    select * from {{ ref('stg_student_system__graduations') }}
    where is_current_version

)

select distinct
    student_bk
from graduations
where family_name = upper(family_name)
    and family_name <> lower(family_name)
