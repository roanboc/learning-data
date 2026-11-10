-- A family name exactly as long as the student system's field (30 characters) may have been cut short
-- there. Fails with a row for each graduate whose family name is 30 characters long; it warns, and the
-- registrar's office looks at each against what the graduate wrote (_quality__tests.yml).

with

graduation_list as (

    select * from {{ ref('mart_graduations__graduation_list') }}

)

select distinct
    student_bk,
    ceremony_id,
    family_name
from graduation_list
where length(family_name) = 30
