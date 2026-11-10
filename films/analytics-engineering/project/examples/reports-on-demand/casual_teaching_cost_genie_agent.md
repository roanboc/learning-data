# The *Casual teaching cost* Genie Agent

The data team's Genie Agent for Finance's questions about casual teaching cost, as Sam Okafor and Jun
Park set it up in the workspace, written down here so that a change to it is reviewed like a change
to the code. A Genie Agent is set up from datasets registered in Unity Catalog, example SQL queries,
SQL expressions for business semantics, instructions in the organisation's own words, and
benchmarks: test questions, each with its answer in SQL. Genie One answers from it when a question
is about its subject, and the Ask Genie button on *The fortnightly figures* opens it
(`fortnightly_figures_dashboard.md`). Databricks only; nothing here runs on DuckDB or in CI.

**Owner:** the data team (Sam Okafor sets it up; Jun Park keeps its examples and benchmarks).
**The meaning in its rules:** Rohan Desai, in Finance, owns casual teaching cost and what "this
semester" means; Ingrid Holm, in HR, owns what may be shown of anyone's pay. A change to a rule's
words is approved by its owner, as for any definition (`AGENTS.md`, *Who approves what*).

They started small, as the docs advise, with one dataset and the questions Finance asks most, and
Rohan, who knows the subject best, was its first user.

## Data

| Dataset | What it is |
|---|---|
| `university.prod_marts.casual_teaching_cost` | **Casual teaching cost**, the Unity Catalog metric view Rohan defined in September 2026: its one measure, `casual_teaching_cost`, by `faculty_name`, `unit_code` and `teaching_period`. *Defined in the open*, the next film, adds it to Finance's marts, over the fact `mart_finance__casual_claims` |

The agent reads the measure, never the claims behind it: the fact, one row per approved claim, isn't
one of its datasets, so no answer can show one person's claims or pay.

## Rules

Each in its owner's words, as the agent's instructions:

1. **What cost means** (Rohan Desai): casual teaching cost is the claims approved for casual
   teaching (casual staff, pay type CAS, teaching duties only), plus on-costs, what the university
   pays on top of pay. It's counted by the teaching period the teaching was done in, not the day
   it was paid. The measure holds this definition; say it with every answer.
2. **What this semester means** (Rohan Desai): the teaching period now running, Semester 2 2026
   (`2026-S2`) on 5 November 2026. A total for a period still running is a total so far: say so.
3. **Totals only** (Ingrid Holm): totals only, never one person's pay. If asked for a person's pay
   or claims, say the agent doesn't hold them, and point to HR.

Each answer runs as the person asking: Genie evaluates data access with each person's own Unity
Catalog permissions, so they see only what they may read.

## Example queries

```sql
-- Casual teaching cost for Health, this semester?
SELECT faculty_name, MEASURE(casual_teaching_cost)
FROM university.prod_marts.casual_teaching_cost
WHERE faculty_name = 'Faculty of Health'
  AND teaching_period = '2026-S2'
GROUP BY faculty_name
```

```sql
-- Each faculty's casual teaching cost, Semester 1?
SELECT faculty_name, MEASURE(casual_teaching_cost)
FROM university.prod_marts.casual_teaching_cost
WHERE teaching_period = '2026-S1'
GROUP BY faculty_name
ORDER BY faculty_name
```

The first is the query Genie ran for Rohan on Thursday 5 November 2026 (`health_this_semester.sql`).

## Benchmarks

Questions with known answers, each with its SQL answer, so Genie marks each run Good or Bad. The
team runs them after every change to the agent. Semester 1 2026 is closed, with every claim in, so
its answers no longer change.

| Benchmark | Question | SQL answer | Answer |
|---|---|---|---|
| Health, Semester 1 2026 | What did casual teaching cost the Faculty of Health in Semester 1 2026? | `SELECT MEASURE(casual_teaching_cost) FROM university.prod_marts.casual_teaching_cost WHERE faculty_name = 'Faculty of Health' AND teaching_period = '2026-S1'` | A$2.21 million |
| Each faculty, Semester 1 2026 | What did casual teaching cost each faculty in Semester 1 2026? | `SELECT faculty_name, MEASURE(casual_teaching_cost) FROM university.prod_marts.casual_teaching_cost WHERE teaching_period = '2026-S1' GROUP BY faculty_name` | The four faculties' totals, as Finance closed Semester 1 |

The answers are the films' numbers; the example data counts far less.
