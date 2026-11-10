# A worked example: the night the claims job failed

On the Monday before each pay day, at 22:00, the claims job builds the hours to pay and sends them
to the payroll system ([`resources/claims.job.yml`](../../resources/claims.job.yml)). Payroll needs
them by noon on Tuesday to pay casual staff on Thursday.

At 15:02 on Monday 2 November 2026, a new version of the claims app went live. Tutors could now type
their hours as they say them: `1:30` for an hour and a half, where the app sent `1.50`. Its contract
with the platform still said decimal hours (the doc block `claim_hours`). That afternoon, at 15:40,
Linh Nguyen claimed an hour and a half of consultation in the new form, CL-104287. At 22:00 the job
started, and at 22:03 it failed: staging couldn't read `1:30` as a number. The build stopped before
the hours to pay were built, so nothing wrong reached payroll; the hours waited. Nobody is to blame:
the app's change was a good one for tutors, and what was missing was a step.

Sam Okafor, who runs the data platform, has Genie ZeroOps watching the pay run's jobs and tables: an
agent that works in the background, with nobody asking. By morning it had found the failure, traced
its cause through lineage to the app's change, said what the failure touches, and proposed a fix:
one insight in Sam's inbox ([`insight.md`](insight.md)), and nothing changed in production. At 08:30
on Tuesday Sam checked the cause against the claims, and asked it to push its fix to a new branch;
it pushes only when a person asks, and confirms. Sam opened a pull request
([`pull_request.md`](pull_request.md)), its checks ran, and at 09:05 Noor, who didn't write it,
approved it. At 09:20 the job ran again, and payroll had the hours by 10:00. On Thursday 856 casual
staff were paid, Linh among them. The agent never approves: the platform proposes, and a person
approves.

The fix mended the night, not its cause. So Sam's pull request also asks Ingrid Holm, in HR, who owns
the claims' data, to change the contract first next time: DEC-CLM-03, proposed, for her to decide.
The film *A platform that watches itself*, in the series *Data as software*, follows it.

| File | What it is |
|---|---|
| `build_that_night.txt` | The job's first task that night, as dbt runs it: the two tests of the hours stop on `1:30`, and everything after them is skipped. Run here on DuckDB, with the old line put back |
| `insight.md` | What the insight held, in its four steps: detected, root cause, impact, proposed fix |
| `fix.patch` | The fix, as Genie ZeroOps proposed it and pushed it when asked: the macro `decimal_hours()`, the one line of staging it replaces, and the unit test of both forms |
| `pull_request.md` | Sam's pull request: what it changes and why, its checks, what it touches and who to tell, and the ask to Ingrid |

What it is in the project: [`macros/hr/decimal_hours.sql`](../../macros/hr/decimal_hours.sql), in
[`stg_claims_app__claims.sql`](../../models/staging/claims_app/stg_claims_app__claims.sql), with the
unit test `hours_are_read_as_said_or_as_decimal_hours`
([`_claims_app__models.yml`](../../models/staging/claims_app/_claims_app__models.yml)); the claim
CL-104287 in [`data/claims_app/claims.csv`](../../data/claims_app/claims.csv); the hours to pay,
[`mart_payroll__hours_to_pay`](../../models/marts/payroll/mart_payroll__hours_to_pay.sql), with the
unit test `the_claims_job_sends_the_open_pay_runs_approved_claims_only`, the product `hours_to_pay`
and the exposure `payroll_system`; the job, with its second task,
[`resources/send_hours_to_payroll.py`](../../resources/send_hours_to_payroll.py); and the decisions
DEC-CLM-02, agreed, and DEC-CLM-03, proposed ([`docs/decisions.md`](../../docs/decisions.md)).

## Watching, and what it reads

Watching systems isn't new: site reliability engineers have done it for years, with alerts, people
on call and blameless reviews, and the job still emails the platform team when it fails. What's new
is that the platform does the first hours of the work overnight. It can trace only what the platform
knows: the lineage Unity Catalog records as the job runs, and who owns what, from the metadata here
(`meta.owner`, the products, the exposures). Keep them, and the morning's insight can name the cause
and who to tell. Choose what it watches, and decide who reviews and who approves: here, a person
reviews, someone other than the author approves, and nothing reaches production without them
(DEC-PRJ-16). Genie ZeroOps's documentation says what it watches and how to set it up.

## Run it

On DuckDB, with no account, from the project's folder:

```sh
dbt build --profiles-dir .   # once, the whole project, so every test finds the tables it reads
# the claims job's first task, as it ran again on Tuesday, with the fix
dbt build --profiles-dir . --select +mart_payroll__hours_to_pay --vars '{as_is_date: "2026-11-03"}'
dbt show --profiles-dir . --select mart_payroll__hours_to_pay --vars '{as_is_date: "2026-11-03"}'
dbt test --profiles-dir . --select "test_type:unit"     # the unit tests, both forms of hours among them
```

To see the night fail, take the fix out, from the repository's root, and build again; then put it
back:

```sh
git apply -R films/analytics-engineering/project/examples/the-night-the-claims-job-failed/fix.patch
(cd films/analytics-engineering/project && dbt build --profiles-dir . --select +mart_payroll__hours_to_pay --exclude-resource-type unit_test)
git apply films/analytics-engineering/project/examples/the-night-the-claims-job-failed/fix.patch
```

The job and Genie ZeroOps need a Databricks workspace; `databricks.yml`'s header has the bundle's
commands. The sample has a few claims, as they stood at 22:00 that Monday; the film's numbers, such
as the 856 casual staff paid, are the university's.
