-- The hundred most recent records of a ceremony season's graduation list, with the fields a certificate
-- and a ceremony need, for the people who know the list to mark by hand (A hundred records): the names,
-- the award, the ceremony and the date the degree is conferred. Every field that's wrong is marked; a
-- record with nothing marked is perfect, and the share of perfect records is the measure (Thomas Redman's
-- Friday afternoon measurement). On Friday 6 February 2026, December 2025's hundred gave 79 perfect.
-- The most recent by the day each joined the list, then by its key, so the same hundred come back. They
-- show the list as it's made now; they aren't a random sample of every year's records.
-- Run: dbt show --select hundred_most_recent --limit 100 --profiles-dir .
-- Another season: add --vars '{ceremony_round: March 2026}'
{% set ceremony_round = var('ceremony_round', 'December 2025') %}

with

graduation_list as (

    select * from {{ ref('mart_graduations__graduation_list') }}

),

ceremonies as (

    select * from {{ ref('ceremonies') }}

),

season as (

    select
        graduation_list.graduation_bk,
        graduation_list.student_bk,
        graduation_list.given_name,
        graduation_list.family_name,
        graduation_list.award_name,
        graduation_list.ceremony_id,
        graduation_list.conferred_on,
        graduation_list.added_on,
        row_number() over (
            order by graduation_list.added_on desc, graduation_list.graduation_bk desc
        ) as most_recent
    from graduation_list
    inner join ceremonies
        on graduation_list.ceremony_id = ceremonies.ceremony_id
    where ceremonies.ceremony_round = '{{ ceremony_round }}'

)

select *
from season
where most_recent <= 100
order by most_recent
