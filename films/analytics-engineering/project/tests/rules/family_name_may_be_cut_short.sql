-- A family name exactly 30 characters long, the length of the student system's family name field
-- until the night of 14 September 2026: it may have been cut short when it was typed in. It holds
-- for the registrar's office (a warning, _rules__tests.yml), a list to work through against the
-- document seen at enrolment: one row per graduate, each corrected once, in the student system
-- (DEC-SIS-06). A name that's really 30 characters long holds too, until the office has looked.
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
where length(family_name) = 30
