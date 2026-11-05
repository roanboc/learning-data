# Quality as a habit

*Proposal for the second series of the module Data quality: four films on keeping data good and making it better. Planned on 5 November 2026 from the module's plan, [`../fit-for-use/proposal.md`](../fit-for-use/proposal.md), which holds the brief, the reference, the insights, the advice, the world, the people, the look and the sound the two series share; this file holds what is this series' own. Status: set up, on assumptions the author reviews later; the films are being made, one at a time, in order, each marked draft on the site.*

## Decided

<!-- decided: made by site-tools/build_series.py from decided.md, the series' and each film's -->
| Date | Decision |
|---|---|
| 5 November 2026 | *Quality as a habit* (*La calidad como hábito*), the second series of *Data quality*, is four films: *The hidden factory*, *Report, fix, tell*, *Read by an agent* and *Small, every week*, in `films/quality-as-a-habit/`, at `quality-as-a-habit/` on the site, with its page once its opening film is out; its cards say "Film N of 4". *Fit for use* comes before it. The module's plan, its rules, its world and its look are in `films/fit-for-use/proposal.md`, and its kit in `films/fit-for-use/shared/`, which this series bundles as it is. |
| 5 November 2026 | The series' thread, an assumption for the author to review: from August to December 2026, the graduation list goes from being fixed by hand to being fixed where its errors are born. The hidden work is counted (about 320 hours a year, in a copy of the list that never reaches the student system) and each kind of error traced to its cause and fixed there, with its owner; a graduate's report about his own name is answered, fixed at the source and told; an agent's confident wrong answer shows that a column's description is part of its quality; and a short meeting every Thursday makes one small change and measures it. By December 2026, 3 certificates are printed again, not 41, and the hidden work is about 40 hours a year. The module's last film closes on its promise. |
<!-- /decided -->

## The brief

*Fit for use* says what good means for each use of the graduation list and measures it. This series keeps it good. Measuring shows the errors; it doesn't stop the next one. The hidden work of fixing data by hand hides the true error rate and its cause, so *The hidden factory* counts it and traces each kind of error to where it's born. People find errors that checks can't, so *Report, fix, tell* closes the loop with them. An agent reads the list too, and it can't ask what an empty column means, so *Read by an agent* makes a column's description part of its quality. And quality improves in small steps, not in a programme launched once, so *Small, every week* shows one small change a week, measured, then kept, and closes the module on its promise.

The series follows the graduation list from August to December 2026 (the module's shared numbers): about 320 hours a year of fixing by hand, in a copy that never reaches the student system; four causes, each with its owner and fix; Andrés Peñaloza's report about his own name, on Monday 12 October 2026, fixed at the source in two days; the agent's 412 that should have been 38, on Thursday 22 October 2026; and every Thursday at 10:00, fifteen minutes, one change. By December 2026, 3 certificates are printed again, not 41.

## The films

| # | Folder | Film (working title) | What it shows | The idea to take away |
|---|---|---|---|---|
| 1 | `1-the-hidden-factory` | The hidden factory | Every November two people check every name by hand in a spreadsheet, and correct the copy, not the student system. Count it (about 320 hours a year); trace each kind of error to where it's born (a 30-character field, a form that took only A to Z, an old encoding in the printer's file, paper forms with one box for the whole name), with five whys, a fishbone and the lineage from the certificate back to the form; fix each there, with its owner | Count the work spent fixing data by hand; then fix where it's born. |
| 2 | `2-report-fix-tell` | Report, fix, tell | Andrés sees "Andres Penaloza" and presses "This isn't my name". The report goes to the owner with a promise of when; it's fixed in the student system, not the list; he's told, and thanked; the admissions team hears what its old form cost; and the kind of error becomes a check | Answer every report, fix it where it started, and tell them. |
| 3 | `3-read-by-an-agent` | Read by an agent | Malia asks the agent which December graduates haven't confirmed their name. It answers 412 with confidence; the right answer is 38, because empty meant two things nobody wrote down. Jun writes the description in Mei's words, and the agent answers 38, showing what it counted. The agent also proposes three checks; Jun reviews them and Mei sets their levels | Describe your data for a reader who can't ask. |
| 4 | `4-small-every-week` | Small, every week | Every Thursday, fifteen minutes, standing: the week's results, one small change, and how they'll know it worked. Certificates printed again 41, 14, 6, 3; perfect records 79, 88, 97 of 100; the hidden work from about 320 hours to 40. On Wednesday 9 December 2026, Andrés crosses the stage and his name is read as he says it | One small change a week, measured, then kept. |

Each opens with a story from outside data, in the four beats said outright: the Dead Letter Office's readers and the ZIP code; smallpox search and containment in India; the "Cupertino effect"; and Norman Borlaug and his Mexican colleagues' shuttle breeding of wheat (the module's `openings.md`).

## Rules from the plan

The module's rules hold (`../fit-for-use/proposal.md`, *Rules from the plan*): each film marked draft, its merge its release; no release status in a film; the tools named as their docs name them on the day; dbt checks for the data and their own model for what people do; an agent proposes and a person approves; the fictional university; Spanish as captions and pages only.
