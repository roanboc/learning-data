-- A ceremony season's list of more than 200 graduates in which not one name has a letter outside A to Z.
-- Eight in the hundred most recent had lost their accents, so a list with none isn't chance: something
-- on the way stripped them. Fails with a row for each such season; it warns (_quality__tests.yml).
-- A letter outside A to Z: what's left of a name once A to Z, apostrophes, spaces and hyphens go.

with

graduation_list as (

    select * from {{ ref('mart_graduations__graduation_list') }}

),

ceremonies as (

    select * from {{ ref('ceremonies') }}

),

seasons as (

    select
        ceremonies.ceremony_round,
        count(distinct graduation_list.student_bk) as graduates,
        count(distinct case
            when length(translate(upper(graduation_list.given_name || graduation_list.family_name), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'' -', '')) > 0
            then graduation_list.student_bk
        end) as graduates_with_a_letter_outside_a_to_z
    from graduation_list
    inner join ceremonies
        on graduation_list.ceremony_id = ceremonies.ceremony_id
    group by ceremonies.ceremony_round

)

select *
from seasons
where graduates > 200
    and graduates_with_a_letter_outside_a_to_z = 0
