-- A name the old form made, still in plain letters A to Z, not yet confirmed by its graduate
-- (Report, fix, tell). From 2015 to 2018 the old online form took only A to Z, in capitals, so it
-- dropped every accent; a student who came back kept that record, its capitals typed again by
-- hand as ordinary letters, and the name looks right. No test on the name itself can see a missing
-- accent: "Andres" is a name too, and only the graduate, or the document seen at enrolment, can
-- say which is theirs. So this test looks at where a name was born: a record first made before
-- 2019, a printed name with no letter outside A to Z, and no confirmation from its graduate.
--
-- It holds each one for the registrar's office, which writes to the graduate: a warning, a list to
-- work through, never a stop. It looks only at rounds whose list hasn't gone to the printer, as at
-- the night's data, and dbt keeps the names it holds in a table the office reads (store_failures).
{{ config(group='graduations', severity='warn', store_failures=true) }}

with

list as (

    select * from {{ ref('mart_graduations__graduation_list') }}

),

graduations as (

    select * from {{ ref('stg_student_system__graduations') }}

),

ceremonies as (

    select * from {{ ref('ceremonies') }}

),

-- When each graduate's record, and the name in it, was first made.
records as (

    select
        student_bk,
        min(record_created_on) as record_created_on
    from graduations
    group by student_bk

),

-- The night's data: when the student system's last nightly file arrived.
night as (

    select max(loaded_at) as loaded_at
    from graduations

)

select
    list.graduation_bk,
    list.name_as_printed,
    list.ceremony_id,
    records.record_created_on
from list
inner join records
    on list.student_bk = records.student_bk
inner join ceremonies
    on list.ceremony_id = ceremonies.ceremony_id
cross join night
where records.record_created_on < cast('2019-01-01' as date)
    -- nothing left once A to Z, spaces, hyphens and apostrophes are taken out
    and translate(
        list.name_as_printed,
        '{{ dbt.escape_single_quotes("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz -'") }}',
        ''
    ) = ''
    and list.name_confirmed_on is null
    and ceremonies.list_due_at > night.loaded_at
