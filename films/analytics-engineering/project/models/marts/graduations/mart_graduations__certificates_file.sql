-- The printer's file: what the certificate printer prints, for each certificate of a round whose
-- names haven't gone to the printer yet. A check stops it while a name on it isn't the name its
-- graduate last gave in the portal (tests/rules/printers_file_has_the_names_graduates_gave.sql):
-- the night's build fails, and the file isn't sent until a person settles each name.

with

graduation_list as (

    select * from {{ ref('mart_graduations__graduation_list') }}

),

ceremonies as (

    select * from {{ ref('ceremonies') }}

)

select
    graduation_list.graduation_bk,
    graduation_list.name_as_printed,
    graduation_list.award_name,
    graduation_list.conferred_on,
    graduation_list.ceremony_id,
    -- How old the list's data is, for the file's header (Late is wrong too).
    graduation_list.student_system_as_of,
    graduation_list.portal_as_of
from graduation_list
inner join ceremonies
    on graduation_list.ceremony_id = ceremonies.ceremony_id
where cast(ceremonies.list_due_at as date) >= {{ as_is_date() }}
