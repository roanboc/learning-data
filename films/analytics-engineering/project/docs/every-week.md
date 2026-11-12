# Every week

*One small change a week, measured, then kept. How the graduation list gets better, as* Small, every week *shows it. Written by hand.*

Every Thursday at 10:00, for fifteen minutes, standing at the bench, the people who use the graduation list and the people who make it meet: Malia Fonoti, graduations office, who sends it to the printer; Mei Tanaka, registrar's office, whose office makes the names right; Jun Park, who builds it; and Sam Okafor, who runs it every night. When a change needs someone else, such as admissions, who make each student's first record, they're asked to that Thursday. Three questions:

1. What did this week's results say?
2. What one small change will we make?
3. How will we know it worked?

It began in January 2026, after 41 certificates were printed again in December 2025. The first idea was a big project, to clean every name on the list once, before March; but a clean-up fixes the names once, and the next list brings the same errors back.

## The results

- **The checks, every night, kept.** The last step of every run, `on-run-end` in [`dbt_project.yml`](../dbt_project.yml), adds each check's result to one table, `check_results` ([`macros/governance/keep_check_results.sql`](../macros/governance/keep_check_results.sql)): when the run started, the check, its status, how many rows it held or failed, its owner and its dimension. The scorecard ([`scorecard.md`](scorecard.md)) shows the last run; [`analyses/quality/checks_by_night.sql`](../analyses/quality/checks_by_night.sql) shows the week, night by night. A check that holds more rows each night is something to look at, even while every night passes.
- **What people count:** graduates' reports, the hours of hand work in each round before a list goes to the printer ([`hand_check_rounds.csv`](../seeds/reference/graduations/hand_check_rounds.csv), on the scorecard: December 2026's round, 78 names of 2,140 in 26 hours), and the hundred records (how many of a hundred records, drawn at random, are perfect).
- **On Databricks,** one dashboard reads both on Thursdays: the week of checks from `check_results`, beside the counts. It isn't in this project: the dashboard is kept on the platform.

## The order

Measure, simplify, standardise, and only then automate. Automate first, and you only do the wrong work faster. The hand checks before each list went that way in 2026:

| Step | What the team did |
|---|---|
| Measure | August: about 320 hours a year of checking names by hand (*The hidden factory*) |
| Simplify | 1 October: check by hand only the names a check holds or a graduate reports |
| Standardise | One way to settle a held name: in the student system, against the document seen at enrolment, by the registrar's office |
| Automate | Each night the checks hold names, in a list the registrar's office reads each morning (*Report, fix, tell*) |

## One turn, from Thursday 1 October 2026

- **Plan.** Malia asks: do we still need to check every name by hand? Since September, names are fixed where they're born, and each night the checks hold the doubtful ones. So check by hand only the names a check holds or a graduate reports, and let the hundred records look at the rest. Two measures, kept already, and what the team expects of each: the round's hours, far fewer; and the perfect records in the hundred, at least 95.
- **Do.** From Monday 19 October, the graduations team checks 78 names by hand, not all 2,140.
- **Study.** The round takes 26 hours, not 240 as in December 2025. On Friday 6 November, 97 of the hundred records are perfect. Both as the plan expected. Many call this step check; study is W. Edwards Deming's word for it: compare what happened with what the plan expected, and learn from it.
- **Act.** Kept, and written into the round's steps. When an agent drafts a change, for a person to approve, the steps stay a person's: understand the plan, know enough to help with the doing, study the results against the plan, and act on what they show.

## Each change, with its keeper

The last step of every change is a check that keeps it: without one, a change lasts only until someone forgets it. The hand checks are kept by the hundred records, now every month, at a level agreed with Malia: below 95 perfect, the next round checks more by hand.

| The change, and the film that shows it | What keeps it |
|---|---|
| *Good enough for what?* | The uses and their levels, written beside the list |
| *A hundred records* | The checks the profile led to |
| *Valid isn't true* | Each graduate's confirmation; the reconciliation with the boards |
| *Late is wrong too* | Each source's age, shown on the list and checked before the send |
| *The hidden factory* | Names fixed and checked at the source, each night |
| *Report, fix, tell* | Every report answered in two working days; the old form's check |
| *Read by an agent* | What empty means, written down; two columns that must agree |
| *Small, every week* | The hand checks, kept by the hundred records |

## The year

| What people count | December 2025 to December 2026 |
|---|---|
| Certificates printed again, by ceremonies | December 2025: 41 · March 2026: 14 · July 2026: 6 · December 2026: 3 |
| Perfect records in the hundred | Friday 6 February 2026: 79 · Friday 5 June 2026: 88 · Friday 6 November 2026: 97 |

The hand work fell from about 320 hours a year to about 40, the few names the checks can't settle. December 2026's 3 were none of them names a check could have held: two graduates changed their names after the list was sent, and one hadn't confirmed hers. On Thursday 17 December the four looked at the three and picked the next small change.
