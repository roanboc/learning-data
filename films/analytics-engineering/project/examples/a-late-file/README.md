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
the student system's file, so they were a day old too. What was wrong was the list's age, and
nothing said it. So the people who use the list agreed how old it may be for each use, on Monday
22 June, and the project now says how old it is, and checks it.

## Old, counted from when

Every record has three dates, and an age can be counted from any of them:

| The date | For an award of one of the 23 | Where the project has it |
|---|---|---|
| The business date: when it happened | The exam board approved it on Wednesday 17 June | `conferral_date` in `data/student_system/graduations.csv`. Each table says it in a column of its own (`effective_date`, `result_date`, `confirmed_at`), and some have none |
| The system date: when the source saved the record | The student system saved it that afternoon, at 16:10 | The newest in each night's file: `newest_record_at` in the receipts (`nightly_files`) |
| The load date: when it reached the platform | Its file arrived on Thursday at 11:40 | `received_at` in the receipts; `_loaded_at` and `_valid_from` on each table |

The business date is the one the list's users care about: the certificates need every award
approved up to the day before. It's also the hardest to read while the data is loaded. Each table
says it in its own way, a business date can rightly be weeks old or still to come, and on a day
when no exam board meets there's no new one to read. So it's measured afterwards, record by
record: `analyses/profiling/profile_late_changes.sql` lists the changes recorded more than a day
after they took effect, and the list's `added_on` beside `conferred_on` says how long an award
took to reach it.

The load date is the easiest to read, and says the least. On Thursday 13 November 2025 the student
system's file arrived at 02:00, on time, and it was the night before's again: the student system's
export had failed, and the transfer sent the file that was there. The list was built at 03:00,
every check passed, and it went to the printer that day. Six graduates approved on Wednesday 12
November were left off, and nobody saw. A check on when the file arrived would have passed.

So the age is counted from the system date: when the source saved its newest record, by its own
clock. It's the date an incremental load, or change data capture, already goes by to know what's
new, so every source has it, in the same form. Each of the two sources writes a heartbeat record
as it makes its file, so on a quiet night the newest record is still that night's; for a source
with no heartbeat, the level has to allow for its quiet days.

## Where it is in the project

| Where | What it holds |
|---|---|
| `data/student_system/nightly_files.csv`, `data/portal/nightly_files.csv` | Each source's receipts: one row for each nightly file, when it arrived (`received_at`) and when the source saved the newest record in it (`newest_record_at`). Lines 595 to 597 of the student system's are the night: `nightly_2026-06-16.csv` arrived at 02:00 on 17 June, its newest record saved at 01:52; then `nightly_2026-06-17.csv` at 11:40 on 18 June, made at 11:31, once the disk was freed. Lines 378 and 379 are the December before: `nightly_2025-11-12.csv` arrived at 02:00 on Thursday 13 November 2025, on time, and its newest record was the night before's, saved at 01:49 on Wednesday |
| `sources/student_system/`, `sources/portal/` (`nightly_files`) | The freshness check, on each source's newest record (`loaded_at_field: "cast(newest_record_at as timestamp)"`), never on when its file arrived. One level, agreed with the list's users: older than 24 hours, the check fails (`error_after: {count: 24, period: hour}`, and `warn_after: null`, so the sources' older default, a warning after a day, doesn't apply to it) |
| `mart_graduations__graduation_list` | Two columns on every row, `student_system_as_of` and `portal_as_of`: when each source saved the newest record the list was built from. Two, because each source has its own age. The printer's file shows both in its header: "Student system data as of Wed 17 Jun, 01:52 · Portal as of Thu 18 Jun, 01:47" |
| `models/marts/graduations/_graduations__models.yml` | The level, on each of the two columns: for the certificates, at most 24 hours old when the list goes to the printer, agreed with Malia Fonoti, who sends it. Seating the Great Hall is counted a week before, from a list a few days old; Planning's count of awards comes after the year's end, when weeks are fine. The strictest use sets the level |
| `tests/quality/graduation_list_at_most_a_day_old_at_the_send.sql` | The send's check: the list's own two columns, against the clock. Off in the night's build, which builds the list whatever its age; the send's job turns it on |
| `governance/4-data-products/graduation_list.yml` | The product's latency, among its `service_levels`: 24 hours, with the two columns as its `element`, the dates it's counted from |

The receipts tell the two nights apart. In June no row came until 11:40: a file was missing. In
December a row came on time, and its newest record was the night before's: a file was stale. The
check fails on both, because both leave the newest record more than a day old.

## Run the check

```sh
dbt source freshness --profiles-dir . --select source:student_system.nightly_files source:portal.nightly_files
```

The sample files don't change, so on them both sources are stale (`ERROR STALE`), as every source
is. At 8 am on Thursday 18 June 2026 the check would have said:

```text
1 of 2 PASS freshness of portal.nightly_files .......................... [PASS]
2 of 2 ERROR STALE freshness of student_system.nightly_files ........... [ERROR STALE]
```

The portal had saved its newest record at 01:47, six hours before; the student system's newest
was Wednesday's, saved at 01:52, thirty hours old. `target/sources.json` holds each age, in
seconds (`max_loaded_at_time_ago_in_s`). And at 03:00 on Thursday 13 November 2025, an hour after
that night's file had arrived on time, the same check would have failed: the student system's
newest record was 25 hours old.

## Warn first, then stop the send

Freshness isn't part of `dbt build`, so it runs as its own task, first, in the night's job. The
send has a job of its own, in Lakeflow Jobs on Databricks, and a check of its own:

| Job | Its tasks, in order | Run if | When a task fails |
|---|---|---|---|
| The night's update, at 03:00 | 1. Check the sources' age: the command above | | Sam Okafor and Malia Fonoti are told |
| | 2. Build the list: `dbt build --select +mart_graduations__graduation_list` | All done | |
| The send to the printer, started by Malia | 1. Check the list's age: the command below | | Malia Fonoti is told why it waits |
| | 2. Send the printer's file | All succeeded | |

```sh
dbt test --profiles-dir . --select graduation_list_at_most_a_day_old_at_the_send --vars '{at_the_send: true}'
```

The night's job never stops the data: if the check fails, its task fails, the two people it names
are told at once, and the list is built anyway (*All done*), saying how old it is. That failure is
the warning. dbt's own warning level isn't used: a warning exits as a success, so no failure notice
would go out. The send is what stops: its job checks the list's own age, its two columns against
the clock, and sends only if the check passes (*All succeeded*). It reads the list, not the
sources again: once a late file lands, the sources read fresh, and a list built before it is still
old. On 18 June the file landed at 11:40 and the list was built again at 12:10; a send started in
between would have waited. Each check tells its people with a notification on its own task, on
failure: a job's notice isn't sent while a failed task is retried, and a task's is.

The send's check is off unless the var `at_the_send` turns it on, so the night's `dbt build`
never runs it. On the sample files the list's newest records are those of 4 November 2026, so it
fails whenever it's run now; `send_at` sets the clock. With
`--vars '{at_the_send: true, send_at: "2026-11-04 15:20:00"}'` it passes, the list thirteen and a
half hours old; with `send_at: "2026-11-05 09:00:00"` it fails.
