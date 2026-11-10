# A worked example: reports on demand

Rohan Desai, in Finance, needs one number to set the Faculty of Health's casual teaching budget for
2027: what casual teaching has cost Health this semester, so far. It used to take a report from the
data team, and a week. On Thursday 5 November 2026, pay day, he asks Genie One in his own words, and
gets A$1.84 million, with what it counted and the query it ran. Genie One answers from the data
team's Genie Agent *Casual teaching cost*: one measure, the owners' rules, examples and tests. The
three questions asked every pay day get one AI/BI dashboard, *The fortnightly figures*, which
retired a 40-page report. *Reports on demand*, film 1 of 3 of *From tables to decisions*, shows it.

Databricks only: nothing here runs on DuckDB or in CI. The numbers are the films'; the example data
counts far fewer.

| File | What it is |
|---|---|
| `health_this_semester.sql` | The query Genie ran for Rohan, as the film shows it under *Show code*: the measure for the Faculty of Health in Semester 2 2026, so far |
| `casual_teaching_cost_genie_agent.md` | The *Casual teaching cost* Genie Agent as the data team sets it up and reviews it: its one dataset, its rules in their owners' words, its two example queries, and its two benchmarks, each with its SQL answer |
| `fortnightly_figures_dashboard.md` | *The fortnightly figures*: the three questions asked every pay day and who acts on each, what each tile reads, the schedule that refreshes it after each pay run and sends it to its subscribers, and its Ask Genie button, linked to the same Genie Agent |

The measure the agent reads is the metric view `university.prod_marts.casual_teaching_cost`, which
Rohan defined in September 2026. *Defined in the open*, the next film, adds it to Finance's marts,
with the fact under it, `mart_finance__casual_claims`; nothing here changes them.
