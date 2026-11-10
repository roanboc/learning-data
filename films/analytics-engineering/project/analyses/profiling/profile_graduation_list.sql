-- What the platform's data profiling says of the graduation list, for anyone without the platform
-- (A hundred records): for each ceremony season, the profile's own metrics for family names (how many
-- are empty, how many are different, the shortest and the longest), and the three counts Jun adds to
-- the profile as custom metrics, each an aggregate over the table (:table), counting graduates, not
-- rows, since a double degree is two rows. On December 2025's list of 2,031 graduates: the longest
-- family name is exactly 30 characters, the length of the student system's field; 41 family names
-- are 30 characters long; 312 are in capitals only, every one of a student admitted before 2020; and
-- not one name has a letter outside A to Z. The checks in tests/quality/ were written from them.
-- On Databricks they're the table's data profiling (Catalog Explorer, the table's Quality tab), a
-- snapshot profile sliced by ceremony season, with these three as its custom metrics, Type Aggregate,
-- Output type Long. The most frequent family names (frequent_items) showed the same name twice: once
-- as written, once in capitals.
-- Run: dbt show --select profile_graduation_list --profiles-dir .

with

graduation_list as (

    select * from {{ ref('mart_graduations__graduation_list') }}

),

ceremonies as (

    select * from {{ ref('ceremonies') }}

)

select
    ceremony_round,
    count(distinct student_bk) as graduates,
    count(*) - count(family_name) as num_nulls,
    count(distinct family_name) as distinct_count,
    min(length(family_name)) as min_len,
    max(length(family_name)) as max_len,
    count(distinct case when length(family_name) = 30
      then student_bk end) as family_name_at_30,
    count(distinct case when family_name = upper(family_name) and family_name <> lower(family_name)
      then student_bk end) as family_name_in_capitals,
    -- a letter outside A to Z: what's left of a name once A to Z, apostrophes, spaces and hyphens go
    count(distinct case when length(translate(upper(given_name || family_name), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'' -', '')) > 0
      then student_bk end) as names_outside_a_to_z
from graduation_list
inner join ceremonies
    on graduation_list.ceremony_id = ceremonies.ceremony_id
group by ceremony_round
order by min(ceremonies.ceremony_on)
