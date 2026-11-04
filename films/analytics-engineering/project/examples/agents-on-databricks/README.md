# A worked example: agents on Databricks, reading the same count

At the Faculty of Health, three people's own agents, each wired to its own copy of the data, once gave
three answers to one question: how many students Health had on census day (2,160, 2,911 and 2,880).
On Databricks, every agent reads the same governed count through the same tools. The census-day count
is written once, as a function any agent can call; the data team's Genie Agent for census-day
questions reads Planning's count and is tested on the questions behind those three answers; and the
census check agent, which the nightly job calls when the count fails its check, is tested on four past
cases before anyone relies on it. *Working with agents on Databricks*, film 7 of 9 of *Agents at work
on data*, shows it.

Databricks only: nothing here runs on DuckDB or in CI. The numbers are the films' census-day numbers;
the example data counts far fewer.

| File | What it is |
|---|---|
| `census_day_students.sql` | The census-day count of one faculty, as a Unity Catalog function: it reads Planning's census-day count (`../planning/`) and adds nothing to it. Agents call it through the Unity Catalog functions tool server; its comment is the tool's description |
| `census_day_genie_agent.md` | The *Census day* Genie Agent as the data team sets it up and reviews it: its data, its instructions (each with where its words come from), its example query, and its three benchmarks, each with its SQL answer |
| `census_check_evaluation.yml` | The census check agent's evaluation cases: four past failures, with what each answer should find, and the three ways each answer is scored (the platform's judges, a plain check of the sums, and Mei's and Jun's feedback) |

Two things the film shows aren't files: the platform's tool servers (Databricks SQL, Unity Catalog
functions, AI Search, and Genie One's and each Genie Agent's own), which the platform runs; and the
team's skills, which Genie Code reads from a copy of `skills/` in the workspace
(`Workspace/.assistant/skills/`), in the same open format as Jun's agent reads them here.
