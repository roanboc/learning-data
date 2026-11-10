-- The night's file keeps every letter. A file of more than 200 names in which not one has a letter
-- outside A to Z is losing letters on the way in, as the file's old encoding did until the night of
-- 14 September 2026 (DEC-SIS-07): about one name in twelve has an accent, so 200 with none isn't
-- chance. A smaller file can be, and passes. It stops (an error, _rules__tests.yml): dbt build
-- skips everything built from the student system's graduations, so the graduation list keeps the
-- night before's names, and the night's job tells Sam Okafor, who runs the platform.
-- The night's file is the versions loaded on the newest night. A letter outside A to Z: what's left
-- of a name once A to Z, apostrophes, spaces and hyphens go. To see it stop on the example rows,
-- whose nights hold a few names each, lower the 200:
--
--     dbt build --select stg_student_system__graduations+ --vars '{night_file_names: 0}' --profiles-dir .
{{ config(group='graduations') }}

with

graduations as (

    select * from {{ ref('stg_student_system__graduations') }}

),

night_file as (

    select *
    from graduations
    where cast(loaded_at as date) = (select max(cast(loaded_at as date)) from graduations)

),

letters as (

    select
        cast(loaded_at as date) as loaded_on,
        count(*) as names,
        count(case
            when length(translate(upper(coalesce(given_name, '') || coalesce(family_name, '')),
                'ABCDEFGHIJKLMNOPQRSTUVWXYZ'' -', '')) > 0
            then 1
        end) as names_with_a_letter_outside_a_to_z
    from night_file
    group by cast(loaded_at as date)

)

select *
from letters
where names > {{ var('night_file_names', 200) }}
    and names_with_a_letter_outside_a_to_z = 0
