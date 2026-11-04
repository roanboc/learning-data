# Census-day count by level of study

Asked by: Clara Jensen, Planning, for the government's report · Plan: Jun Park · 2 November 2026

- **Goal:** students on census day, 31 March 2026, by level of study: undergraduate and
  postgraduate. One row per level, with its count.
- **Read:** the glossary's *Student*, *Census day* and *Level of study*; the census-day count it
  builds on, `mart_planning__census_day_students`, 18,412 students, already reconciled with the
  census report.
- **Tools:** Catalog, Query and Docs, read only.
- **Writes:** only its own branch, with Repository, and its sandbox, with Build.
- **Never:** read names or student IDs; write to production.
- **Limit:** 10 rounds, then stop and report.
- **Checks:** the levels add up to 18,412, the census-day count; and every student has exactly one
  level. Written as tests before any model; Jun Park approves them, and from then on only a person
  changes them.
- **Approves:** Jun Park checks the work against this page · Noor, data architect, approves it for
  production.
