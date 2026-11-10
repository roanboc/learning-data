# A worked example: agents on Databricks, reading the same count

At the Faculty of Health, three people's own agents, each wired to its own copy of the data, once gave
three answers to one question: how many active research projects Health has (141, 177 and 168). On
Databricks, every agent reads the same governed count through the same tools. The count of active
projects is written once, as a function any agent can call; the data team's *Research projects* Genie
Agent reads the research office's table of projects and is tested on the questions behind those three
answers; and the project check agent, which the nightly job calls when the count disagrees with the
research office's list, is tested on four past cases before anyone relies on it. *Working with agents
on Databricks*, film 7 of 9 of *Agents at work on data*, shows it.

Databricks only: nothing here runs on DuckDB or in CI. The numbers are the film's; the example data
(`data/research_system/`) holds two of Health's projects.

| File | What it is |
|---|---|
| `active_projects.sql` | The count of active research projects in one faculty, as a Unity Catalog function: started and not yet ended, each once, in the faculty that leads it. Agents call it through the Unity Catalog functions tool server; its comment is the tool's description |
| `research_projects_genie_agent.md` | The *Research projects* Genie Agent as the data team sets it up and reviews it: its data, its instructions (each with where its words come from), its example query, and its three benchmarks, each with its SQL answer |
| `project_check_evaluation.yml` | The project check agent's evaluation cases: four past failures, with what each answer should find, and the three ways each answer is scored (the platform's judges, a plain check of the sums, and Mei's and Jun's feedback) |

Two things the film shows aren't files: the platform's tool servers (Databricks SQL, Unity Catalog
functions, AI Search, and Genie One's and each Genie Agent's own), which the platform runs; and the
team's skills, which Genie Code reads from a copy of `skills/` in the workspace
(`Workspace/.assistant/skills/`), in the same open format as Jun's agent reads them here.
