-- A family name in capitals only, as older records were entered. Fails with a row for each graduate
-- whose family name has letters and every one of them is a capital; it warns (_quality__tests.yml).

with

graduation_list as (

    select * from {{ ref('mart_graduations__graduation_list') }}

)

select distinct
    student_bk,
    ceremony_id,
    family_name
from graduation_list
where family_name = upper(family_name)
    and family_name <> lower(family_name)
