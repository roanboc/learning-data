# The *Research projects* Genie Agent

The data team's Genie Agent for questions about research projects, as the team sets it up in the
workspace, written down here so that a change to it is reviewed like a change to the code. A Genie
Agent is set up from datasets registered in Unity Catalog, example SQL queries, instructions in the
organisation's own words, and benchmarks: test questions, each with its answer in SQL. Databricks
only; nothing here runs on DuckDB or in CI.

**Owner:** the data team (Jun Park). **The meaning in its instructions:** the research office, which
owns the research system's data (`meta.owner` in `models/staging/research_system/`), as for any
definition (`AGENTS.md`, *Who approves what*).

## Data

| Dataset | What it is |
|---|---|
| `<production catalog>.<research schema>.projects` | **Active projects · the Research Office's table**: the current version of each project, with its code, title, lead, start and end (as `research_system/projects.csv` has them), and the unit and faculty of the person who leads it |

## Instructions

Each line takes its words from where the meaning is kept:

1. A project is active from its start to its end, and counts once, in the faculty that leads it. Its
   end is the current record's: a project given more time is active until its new end date. (The
   research office's meaning; the dates are `starts_on` and `ends_on` in
   `models/staging/research_system/_research_system__models.yml`.)
2. The yearly research report's figures are shares, not counts: it gives each faculty half of a
   project shared with another. This agent has no report table: if asked for the report's figure, say
   so, and don't answer with a count of projects. (The data team's own line, agreed with the research
   office after the faculty's agents read the report's share as a count.)
3. A unit's name is not its faculty. Engineering's Bridge Health Lab tests bridges, and its projects
   are Engineering's. Count by the faculty that leads a project, never by a word in a name. (The lead's
   faculty, on each project.)

## Example query

```sql
-- How many active research projects does Health have?
select <production catalog>.<research schema>.active_projects('Faculty of Health') as projects
```

The function is `active_projects.sql`, next to this file.

## Benchmarks

The questions behind three answers the Faculty of Health's own agents once gave (141, 177 and 168),
each with its SQL answer, so Genie marks each run Good or Bad. The team runs them after every change
to the agent.

| Benchmark | Question | SQL answer | Answer |
|---|---|---|---|
| Health's active projects | How many active research projects does the Faculty of Health have? | `select count(distinct project_code) from <production catalog>.<research schema>.projects where lead_faculty = 'Faculty of Health' and starts_on <= current_date() and ends_on >= current_date()` | 168 |
| Bridge Health Lab's projects | How many active projects does the Bridge Health Lab have, and which faculty leads them? | `select lead_faculty, count(distinct project_code) from <production catalog>.<research schema>.projects where lead_unit = 'Bridge Health Lab' and starts_on <= current_date() and ends_on >= current_date() group by lead_faculty` | 9, Faculty of Engineering and IT |
| All active projects | How many active research projects does the university have? | `select count(distinct project_code) from <production catalog>.<research schema>.projects where starts_on <= current_date() and ends_on >= current_date()` | 547 |

The answers are the film's numbers; the example data holds two of Health's projects.
