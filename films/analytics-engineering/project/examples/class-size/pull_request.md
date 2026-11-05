# Plan each unit's classes from its own class size

*The planning agent's pull request, its first: `planning-agent[bot]`, from `agent/planning/class-size`, opened on
Tuesday 3 November 2026. As it was opened; the review and the second push are in
[`governance_review.md`](governance_review.md).*

## What changed

- `mart_planning__class_plan`: one new column, `class_size`, from the student system, and each unit's `classes`
  from it: the students expected, divided by the class size, rounded up. A unit with no class size keeps 25, as
  before. No row added or removed ([`diff.txt`](diff.txt)).
- `class_size`'s description, copied from the glossary's *Class size*, with its source.
- Two new tests, written before the change. No test that was there changed.

| File | What changed in it |
|---|---|
| `models/marts/planning/mart_planning__class_plan.sql` | The column, and the classes from it |
| `models/marts/planning/_planning__models.yml` | Its description and its class |
| `models/marts/planning/_planning__conceptual.yml` | *Class size*, copied from the glossary, with its source |
| `models/marts/planning/_planning__definitions.md` | [generated] its doc block |
| `tests/rules/every_student_has_a_place_in_a_class.sql` | The first test |
| `tests/rules/no_class_planned_that_isnt_needed.sql` | The second test |
| `tests/rules/_rules__tests.yml` | The two tests' owner and dimension |

## Why

Clara Jensen, in Planning, asked for it on Monday 2 November 2026: "Plan each unit's classes from its own class
size". The plan put every unit's students in classes of 25. A laboratory holds 16 and a studio 20, so for those
units the faculties hired too few tutors, and found out in the first week, with students waiting for a bench. The
faculties hire their tutors from this plan, in November, for February.

## How I worked

On my own branch, and in my own development schema (`planning_agent_marts`, in the development catalog). I read
production, and write only to my branch and my schema. For Planning's tickets the map puts me at stage 4: I
propose, and people review. For what a word means, at stage 1: I only suggest. I don't approve or merge, and I
don't change a test once a person has approved it (`AGENTS.md`).

1. Read *Class size* and *Unit offering* in the glossary, and the class plan's model and tests.
2. Wrote the two tests below, before the change: until it was there, they couldn't pass.
3. Took `class_size` through from the student system (`stg_student_system__unit_offerings` passes it on), and
   planned each unit's classes from it.
4. Built the plan and what depends on it, in my schema, and ran every test on them: all pass.
5. Compared the plan with main's, unit by unit ([`diff.txt`](diff.txt)), and opened this pull request.

## The two tests, written first

The first: every student has a place in a class. Each unit's classes, at its class size, hold every student the
plan expects in it.

```sql
-- Every student expected in a unit has a place in one of its classes: its classes, at its class size,
-- hold at least as many students as the plan expects. A row back is a unit where some would have no
-- place. Written by the planning agent before the change; once approved, only a person changes it.
select
    unit_offering_key,
    students_expected,
    classes * coalesce(class_size, 25) as places
from {{ ref('mart_planning__class_plan') }}
where classes * coalesce(class_size, 25) < students_expected
```

The second: no class is planned that isn't needed. With one class fewer, some of the unit's students would have no
place, so a plan that doubled a unit's classes makes it fail. A unit dropped altogether is for the diff to show, as
a key only in main.

```sql
-- No class is planned that isn't needed: with one class fewer, some of the unit's students would have
-- no place. A row back is a unit with a class too many. Written by the planning agent before the
-- change; once approved, only a person changes it.
select
    unit_offering_key,
    students_expected,
    classes
from {{ ref('mart_planning__class_plan') }}
where classes > 0
  and (classes - 1) * coalesce(class_size, 25) >= students_expected
```

```yaml
  - name: every_student_has_a_place_in_a_class
    description: Each unit's classes, at its class size, hold every student the plan expects in it.
    config:
      meta: {owner: "Clara Jensen, Planning", dimension: consistency}

  - name: no_class_planned_that_isnt_needed
    description: With one class fewer, some of a unit's students would have no place.
    config:
      meta: {owner: "Clara Jensen, Planning", dimension: consistency}
```

## The words, with their source

```yaml
  - name: class_size
    label: class size
    definition: >
      The most students one class of a unit offering may hold, set by the unit's school.
    owner: Mei Tanaka, registrar's office
    source:
      glossary: the university's Unity Catalog Glossary, on Databricks
      term: Class size
      named_by: data governance
      synced_on: 2026-11-03
```

```yaml
      - name: class_size
        description: >
          The most students one class of the unit offering may hold, set by the unit's school. Empty
          where the school hasn't set one: the plan then uses 25, as before.
          {{ doc("class_size") }}
        data_type: int
        config:
          meta: {glossary_term: class_size, personal_data: none}
```

## The change

```diff
 select
     expected.unit_offering_key,
     expected.unit_code,
     expected.faculty,
     expected.class_type,
     expected.students_expected,
-    cast(ceil(expected.students_expected / 25) as int) as classes
+    -- Each unit's classes from its own class size, as the glossary has it. A unit whose school
+    -- hasn't set one keeps 25, as before.
+    offerings.class_size,
+    cast(ceil(expected.students_expected / coalesce(offerings.class_size, 25)) as int) as classes
 from expected
+left join offerings using (unit_offering_key)
```

`offerings` is one row per unit offering, from `stg_student_system__unit_offerings`, so the join can't double a
unit, and a left join can't drop one.

## Evidence

Counts only: no names, no IDs.

1. The classes, before and after: 3,214 and 3,477, for the same 1,236 units.
   `dbt show --inline "select case when class_size is null then 'none' when class_size = 25 then '25' else '16 or 20' end as class_size, count(*) as units, sum(classes) as classes from {{ ref('mart_planning__class_plan') }} group by 1"` →
   `25 | 1,017 units | 2,642 classes` · `16 or 20 | 188 | 752` · `none | 31 | 83`: 1,236 units and 3,477 classes.
   On main, the same units plan 2,642, 489 and 83: 3,214. Of the 188 laboratories and studios, 161 need more
   classes, 263 in all; 27 have too few students to need more.
2. Both tests pass, and every test after them: [`checks.txt`](checks.txt).
3. No unit is only in this branch or only in main, one column is new, and classes changed in 161 units, each one
   up: [`diff.txt`](diff.txt).

## What I wasn't sure of

31 units have no class size in the student system: their schools haven't set one. I left them at 25, as the plan
had them, so their classes don't change. I don't know what their class size should be: each unit's school sets
it.

## For the reviewers, from their roles on the map

- **Jun Park**, analytics engineer, the code: `CODEOWNERS` names you for the model, its tests and the doc block.
- **Clara Jensen**, product owner: you asked for it, and you own the plan. The rules on `main` ask a product owner
  to approve a change to Planning's marts.
- **Mei Tanaka**, data owner, the word it copies: *Class size* in `_planning__conceptual.yml`. The rules on `main`
  ask a data owner to approve a change to it.
- **Noor Rahman**, release approver, approves the release to production, after the merge.
- Any agent's review is for reference only. I approve nothing.
