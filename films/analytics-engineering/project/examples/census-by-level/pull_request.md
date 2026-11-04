# Census-day count by level of study

*The agent's pull request, from its own branch, for Jun Park's review. The plan it answers:
[`plan.md`](plan.md).*

## What changed

- `mart_planning__census_day_levels`: one row per student on census day, with their level of study.
- `mart_planning__census_by_level`: the count by level: undergraduate, postgraduate and non-award.
- `level_of_study`'s description, copied from the glossary's *Level of study*, with its source.
- No test changed: both are as Jun Park approved them on 2 November 2026.

## Why

Clara Jensen, in Planning, asked for the census-day count by level of study, for the government's
report. Non-award is a third level because Mei Tanaka, who owns the meaning, decided so on
3 November 2026 ([`decision.yml`](decision.yml)): the government's list counts exchange students
taking single units as non-award, a level of its own.

## The plan, line by line

| Line | How it was met |
|---|---|
| Goal | Three levels, one row each, adding up to 18,412 (evidence 1) |
| Read | *Student*, *Census day* and *Level of study*, from Docs; the census-day count, from Catalog |
| Tools | Catalog, Query and Docs, read only, and nothing else (the tool log, below) |
| Writes | Only this branch, and the agent's sandbox |
| Never | No names or student IDs: every query returns counts |
| Limit | 4 of 10 rounds (below) |
| Checks | Both tests untouched, and both pass (evidence 3) |
| Approves | Jun Park checks it against the plan; Noor approves it for production. This agent doesn't approve |

## Rounds: 4 of 10

1. Read the three terms in Docs and found the tables in Catalog; built the count by level in the
   sandbox; ran the tests. The first failed: the two levels added up to 18,384, 28 short of 18,412.
2. Looked at the 28 with Query: on census day, they have no level; they're exchange students,
   taking single units, with no degree here (evidence 2). Which level they belong to is a meaning,
   so the agent didn't drop them or touch the test: it asked Mei Tanaka, with the query and its
   result, and stopped until she answered.
3. Added non-award, as Mei decided, and ran the tests again: both pass.
4. Wrote `level_of_study`'s description from the glossary, with its source, and opened this pull
   request.

## Evidence

1. The levels add up to 18,412.
   `dbt show --select mart_planning__census_by_level --profiles-dir .` →
   `undergraduate | 13,906` · `postgraduate | 4,478` · `non-award | 28`
2. On census day, 28 students had no level, all exchange students taking single units.
   `dbt show --select census_day_students_without_a_level --profiles-dir .` →
   `exchange | single units | 28`
3. Both tests pass, as approved.
   `dbt build --select +mart_planning__census_by_level --profiles-dir .` →
   `levels_add_up_to_census_day` PASS · `unique_mart_planning__census_day_levels_learner_key` PASS ·
   `not_null_mart_planning__census_day_levels_learner_key` PASS ·
   `not_null_mart_planning__census_day_levels_level_of_study` PASS

The query behind the second, in `analyses/validation/`:

```sql
select
    students.study_basis,
    students.enrolled_in,
    count(*) as students
from {{ ref('mart_planning__census_day_students') }} as students
left join {{ ref('mart_planning__census_day_levels') }} as levels
    on levels.learner_key = students.learner_key
where levels.learner_key is null
group by students.study_basis, students.enrolled_in
```

## The description, with its source

```yaml
      - name: level_of_study
        description: >
          The level of the course the student is enrolled in on the census date.
          {{ doc("level_of_study") }}
        config:
          meta: {glossary_term: level_of_study, personal_data: none}
```

The doc block is generated from the conceptual model, which copies the glossary's term:

```yaml
  - name: level_of_study
    label: level of study
    definition: >
      The level of the course a student is enrolled in, as the government's statistics count it:
      undergraduate, for a bachelor's degree or a course below it; postgraduate, for a graduate
      certificate, a graduate diploma, a master or a doctorate; or non-award, for a student who
      takes units without being enrolled in an award of the university, such as an exchange
      student.
    owner: Mei Tanaka, registrar's office
    source:
      glossary: the university's Unity Catalog Glossary, on Databricks
      term: Level of study
      named_by: data governance
      synced_on: 2026-11-03
```

## The tool log

| Tool | Calls | For |
|---|---|---|
| Docs | 3 | *Student*, *Census day*, *Level of study* |
| Catalog | 2 | The census-day count and its tables; the courses and their levels |
| Query | 3 | The count by level; the 28 with no level; the count again, after the fix |

## For the reviewers

- **Jun Park:** check it against the plan, line by line. Once you accept it, the change is yours.
- **Noor, data architect:** approves it for production, as the second person.
- The agent's own review is attached for reference only: it approves nothing.
