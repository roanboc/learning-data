-- The plan's first check: the levels add up to the census-day count, 18,412 students, already
-- reconciled with the census report. Written by the agent before any model, approved by Jun Park
-- on 2 November 2026; from then on, only a person changes it. A row back means they differ.
with by_level as (
    select sum(students) as students
    from {{ ref('mart_planning__census_by_level') }}
),

census_day as (
    select count(*) as students
    from {{ ref('mart_planning__census_day_students') }}
)

select
    by_level.students as by_level,
    census_day.students as census_day
from by_level
cross join census_day
where by_level.students is distinct from census_day.students
