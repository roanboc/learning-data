# A worked example: a late file, and the send that waits

On Wednesday 17 June 2026 the student system's nightly file didn't come: a full disk on the
student system's side held the night's transfer. At 03:00 the night's update built the graduation
list from what was there, the file of the night before: 689 graduates, and every check passed. The
23 graduates the exam boards approved on Wednesday weren't on it. At 8 am on Thursday, Sam Okafor
saw in the platform's monitoring that the student system's tables were late; the file arrived at
11:40, the list was built again at 12:10 with 712 graduates, and it went to the printer at 3:20 pm,
before its 5 pm deadline. *Late is wrong too*, film 4 of *Fit for use*, follows that night.

Late data looks complete: every row in it is right, and the checks that read the rows pass. Even
the check against the exam boards' approved lists passed: they come in the same night's transfer as
the student system's file, so they were a day old too, and the student system's receipt is their
age as well. What was wrong was the list's age, and nothing said it. So the people who use the list
agreed how old it may be for each use, on Monday 22 June, and the project now says how old it is,
and checks it.

| Where | What it holds |
|---|---|
| `data/student_system/nightly_files.csv`, `data/portal/nightly_files.csv` | Each source's receipts: one row for each nightly file, and when it arrived. Lines 595 to 597 of the student system's are the night: `nightly_2026-06-16.csv` at 02:00 on 17 June, then `nightly_2026-06-17.csv` at 11:40 on 18 June. Line 379 is the December before: `nightly_2025-11-12.csv` at 09:15 on Thursday 13 November 2025, after the 03:00 build, the day that list went to the printer |
| `sources/student_system/`, `sources/portal/` (`nightly_files`) | The freshness check, on when each file arrived, not on the newest row: a night when no exam board met brings few new rows, but a file still arrives. One level, agreed with the list's users: older than 24 hours, the check fails (`error_after: {count: 24, period: hour}`, and `warn_after: null`, so the sources' older default, a warning after a day, doesn't apply to it) |
| `mart_graduations__graduation_list` | Two columns on every row, `student_system_as_of` and `portal_as_of`: when the files the list was built from arrived. Two, because each source has its own age. The printer's file shows both in its header: "Student system data as of Wed 17 Jun, 02:00 · Portal as of Thu 18 Jun, 02:00" |
| `models/marts/graduations/_graduations__models.yml` | The level, on each of the two columns: for the certificates, at most 24 hours old when the list goes to the printer, agreed with Malia Fonoti, who sends it. Seating the Great Hall is counted a week before, from a list a few days old; Planning's count of awards comes after the year's end, when weeks are fine. The strictest use sets the level |
| `governance/5-data-contracts/mart_graduations__graduation_list.yaml` | Both, in the list's contract, written by `scripts/generate/products.py`: each level as a quality rule with the dimension `timeliness`, and the product's latency, 24 hours on the two columns, as `slaProperties` |

## Run the check

```sh
dbt source freshness --profiles-dir . --select source:student_system.nightly_files source:portal.nightly_files
```

The sample files don't change, so on them both receipts are stale (`ERROR STALE`), as every source
is. At 8 am on Thursday 18 June 2026 the check would have said:

```text
1 of 2 PASS freshness of portal.nightly_files .......................... [PASS]
2 of 2 ERROR STALE freshness of student_system.nightly_files ........... [ERROR STALE]
```

The portal's file had come at 02:00, six hours before; the student system's newest was
Wednesday's, thirty hours old. `target/sources.json` holds each age, in seconds
(`max_loaded_at_time_ago_in_s`).

## Warn first, then stop the send

Freshness isn't part of `dbt build`, so it runs as its own task, first, in two Lakeflow jobs on
Databricks:

| Job | Its tasks, in order | Run if | When a task fails |
|---|---|---|---|
| The night's update, at 03:00 | 1. Check the sources' age: the command above | | Sam Okafor and Malia Fonoti are told |
| | 2. Build the list: `dbt build --select +mart_graduations__graduation_list` | All done | |
| The send to the printer, started by Malia | 1. Check the sources' age: the same command | | Malia Fonoti is told why it waits |
| | 2. Send the printer's file | All succeeded | |

The night's job never stops the data: if the check fails, its task fails, the two people it names
are told at once, and the list is built anyway (*All done*), saying how old it is. That failure is
the warning. dbt's own warning level isn't used: a warning exits as a success, so no failure notice
would go out. The send is what stops: its job runs the same check, and sends only if it passes
(*All succeeded*). Each check tells its people with a notification on its own task, on failure: a
job's notice isn't sent while a failed task is retried, and a task's is.
