-- Each name in the printer's file is the name its graduate last gave in the portal for that
-- ceremony: a confirmation, or a correction, checked or not. A correction still waiting for its
-- document isn't on the list yet, so the names differ, and the file stops until a person settles
-- it. Fails with one row per certificate whose name isn't the one its graduate last gave.
{{ config(group='graduations', severity='error') }}

with

printers_file as (

    select * from {{ ref('mart_graduations__certificates_file') }}

),

graduation_list as (

    select * from {{ ref('mart_graduations__graduation_list') }}

),

confirmations as (

    select * from {{ ref('stg_portal__name_confirmations') }}

),

last_answers as (

    select *
    from confirmations
    where is_current_version
    qualify row_number() over (
        partition by student_bk, ceremony_id
        order by confirmed_at desc, confirmation_bk desc
    ) = 1

)

select
    printers_file.graduation_bk,
    printers_file.name_as_printed,
    last_answers.name_as_printed as name_last_given,
    last_answers.answer,
    last_answers.checked_on
from printers_file
inner join graduation_list
    on printers_file.graduation_bk = graduation_list.graduation_bk
inner join last_answers
    on graduation_list.student_bk = last_answers.student_bk
    and printers_file.ceremony_id = last_answers.ceremony_id
where printers_file.name_as_printed <> last_answers.name_as_printed
