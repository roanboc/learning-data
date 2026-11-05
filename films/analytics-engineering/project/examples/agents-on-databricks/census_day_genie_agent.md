# The *Census day* Genie Agent

The data team's Genie Agent for questions about the census-day count, as the team sets it up in the
workspace, written down here so that a change to it is reviewed like a change to the code. A Genie
Agent is set up from datasets registered in Unity Catalog, example SQL queries, instructions in the
organisation's own words, and benchmarks: test questions, each with its answer in SQL. Databricks
only; nothing here runs on DuckDB or in CI.

**Owner:** the data team (Jun Park). **The meaning in its instructions:** Mei Tanaka, registrar's
office, as for any definition (`AGENTS.md`, *Who approves what*).

## Data

| Dataset | What it is |
|---|---|
| `<production catalog>.<planning schema>.planning_enrolments_at_census` | **Students on census day · Planning's count**: students on census day, by faculty, from `examples/planning/` |

## Instructions

Each line takes its words from where the meaning is kept:

1. A student is a person, counted once, as their record stood on census day. (A learner is "a person
   the university has recorded learning with it", `models/core/student/_student__conceptual.yml`; and
   Planning's census rule, `models/marts/planning/_planning__definitions.md`: "every entity is read at
   its version valid that day".)
2. Student load, in full-time equivalents, is not a count of people, and this agent has no load table:
   if asked for load, say so, and don't answer with a count of students. (The data team's own line,
   agreed with Mei after the faculty's agents read load as people.)
3. A joint degree in no faculty, such as Health data, belongs to no faculty: its students are no
   faculty's. Count them on their own. (The award's faculty, in `core_award`.)

## Example query

```sql
-- How many students did Health have on census day?
select <production catalog>.<planning schema>.census_day_students('Faculty of Health') as students
```

The function is `census_day_students.sql`, next to this file.

## Benchmarks

The questions behind three answers the Faculty of Health's own agents once gave (2,160, 2,911 and
2,880), each with its SQL answer, so Genie marks each run Good or Bad. The team runs them after every
change to the agent.

| Benchmark | Question | SQL answer | Answer |
|---|---|---|---|
| Health's students on census day | How many students did the Faculty of Health have on census day? | `select learners_enrolled from <production catalog>.<planning schema>.planning_enrolments_at_census where faculty_name = 'Faculty of Health'` | 2,880 |
| Students in no faculty | How many students on census day were in no faculty? | `select learners_enrolled from <production catalog>.<planning schema>.planning_enrolments_at_census where faculty_name is null` | 31 |
| All students on census day | How many students did the university have on census day? | `select sum(learners_enrolled) from <production catalog>.<planning schema>.planning_enrolments_at_census` | 18,412 |

The answers are the films' census-day numbers; the example data counts far fewer.
