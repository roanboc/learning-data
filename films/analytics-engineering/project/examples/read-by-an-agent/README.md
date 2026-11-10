# A worked example: an agent reads only what's written

On Thursday 22 October 2026, Malia Fonoti asked the graduations team's agent which December
graduates hadn't confirmed their name. It counted the graduates whose `name_confirmed_on` was empty,
and answered 412 at once. Empty meant two things: 38 graduates hadn't confirmed yet, and 374 had
confirmed on the paper graduation form, before the portal opened in February, and the paper form
kept no date. The column's description didn't say so, and the agent can't ask. *Read by an agent*,
film 3 of 4 of *Quality as a habit*, shows it.

The team fixed the data first, then the words:

| In the film | In the project |
|---|---|
| Noor finds where the paper form is recorded, in the student system | The student system's applications to graduate, each on the paper form or in the portal: `data/student_system/graduation_applications.csv`, its source in `sources/student_system/` and `models/staging/student_system/stg_student_system__graduation_applications.sql` |
| Jun adds a column that says how each name was confirmed | `name_confirmed_how` on the graduation list (`models/marts/graduations/`): portal, paper, or empty for not yet |
| He writes the description in Mei's words, for a reader who can't ask | `name_confirmed_on` and `name_confirmed_how` in `_graduations__models.yml`: what each means, what empty means, and who answers for it. dbt writes them into Unity Catalog on every run (`persist_docs` in `dbt_project.yml`), where the agent reads them |
| Genie Code proposes three checks, Jun reviews them and Mei sets the levels | [`genie_code_review.md`](genie_code_review.md), and where each one went |
| A name that isn't the one its graduate gave stops the printer's file | `tests/rules/printers_file_has_the_names_graduates_gave.sql` (error), on the printer's file, `mart_graduations__certificates_file` |
| The two confirmation columns agree, or it holds for Jun | `tests/rules/name_confirmation_columns_agree.sql` (warn) |
| "Every graduate has confirmed" becomes a count Malia follows each week, and the agent's trusted answer | `mart_graduations__names_to_confirm`, owned by Malia (product `names_to_confirm`), read by the exposures `names_to_confirm_each_week` and `graduations_agent` |
| The graduations team's agent | [`graduations_agent.md`](graduations_agent.md), Databricks only |

The numbers are the film's: the example data holds a slice of December 2026's graduates, two who
confirmed on paper, three in the portal and four not yet. The follow-up and the printer's file hold
the rounds whose names haven't gone to the printer yet, as at the build. To see them as on the
film's day:

```sh
dbt build --profiles-dir . --vars '{as_is_date: "2026-10-22"}'
```
