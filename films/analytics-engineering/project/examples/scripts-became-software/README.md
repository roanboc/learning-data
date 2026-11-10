# A worked example: payroll's export, from a laptop to the project

Every second Thursday, Finance needs to know what casual staff are paid that day, by faculty and
unit. For years, that came from a script on one person's laptop ([`before/payroll_export.py`](before/payroll_export.py)):
before 6 a.m. on each pay day, someone ran it by hand. It read the faculties' approved claims from
a folder of spreadsheets, worked out the pay day for each (approved by 12:00 on the Monday before a
pay day, paid that Thursday; otherwise a fortnight later), added them up, and wrote a file that was
emailed to Finance. It worked, and nobody is to blame for it. Its author moved to another team in
2024, and it kept running. In February 2026 the claims moved into the claims app, the spreadsheets
stopped coming, and nobody could change the script safely: one copy, no history of why it worked
the way it did, and no test to say whether a change broke it.

In March 2026, Sam Okafor, who runs the data platform, and Jun Park moved it into the project. Jun
wrote the model and its tests, Sam the job, and each reviewed the other's pull request. Ingrid
Holm, in HR, confirmed the rule, and HR owns the calendar of pay days. Noor approved it for
production. *Scripts became software*, which opens the series *Data as software*, follows it.

| | The script on a laptop | In the project |
|---|---|---|
| The rule | Inside the script: the Monday-noon close worked out from a date typed in before each run; Easter and the summer break changed by hand | `pay_day_for()` ([`macros/payroll/pay_day.sql`](../../macros/payroll/pay_day.sql)), on HR's calendar of pay days and closes ([`seeds/reference/staff/pay_days.csv`](../../seeds/reference/staff/pay_days.csv)), owned by HR |
| Units to faculties | A list in the script, kept by hand | The units seed ([`seeds/reference/course/units.csv`](../../seeds/reference/course/units.csv)), owned by the registrar's office with the faculties, and tested |
| The export | A file on the desktop, emailed to Finance | `mart_finance__casual_pay_paid`, with a contract; Finance reads the table |
| Tests | None | A unit test of the rule at its edge (approved at 11:59 and at 12:01 on the Monday), a test that every approved claim has a pay day, and the model's tests |
| History | One copy | Git: every change, who made it and why |
| Review | Nobody else read it | A pull request, reviewed by someone other than its author; `CODEOWNERS` asks HR to review a change to the pay days |
| Running | By hand, on each pay day | A job written as a file ([`resources/payroll_export.job.yml`](../../resources/payroll_export.job.yml)), deployed by the bundle ([`databricks.yml`](../../databricks.yml)) |
| Production | The laptop | Deployed to test, then to production once Noor approves, as the platform's service principal ([`release.yml`](release.yml)) |

None of this is new. Software has been kept this way for decades: in version control, reviewed,
tested, and released the same way each time. Data work took it up because the same things go
wrong. *In the weeds of data crafting* teaches the models and tests themselves (*Declare it, then
build it*, *Promises and proofs*, *Built in layers*), and *Change without surprises* how a change
reaches the people it touches. The same road holds when an agent writes the change: it proposes,
and people approve (*AI agents in data work*).

## The road to production

1. **A branch.** Every change starts on a branch, never on `main`.
2. **A pull request, with its checks.** The whole build and every test run on it, the unit test
   included, and the bundle is validated (`release.yml`, job `check`).
3. **A review by someone else.** One approval from someone other than the person who pushed last;
   `main` accepts nothing else.
4. **Test.** Once merged, the same files are deployed to test and the job runs there, on test's
   data (job `test`).
5. **Production, after a person approves.** The workflow waits for Noor, production's required
   reviewer, then deploys the same files to production (job `production`), as the platform's
   service principal. Nobody deploys from a laptop.

## Files

| File | What it is |
|---|---|
| `before/payroll_export.py` | The script, as it ran until March 2026. Not run, and not part of the project |
| `release.yml` | The road to production as a GitHub Actions workflow. An example: here it never runs. In the project's own repository it would be `.github/workflows/release.yml`; its header lists the repository settings it needs |

What it moved into, in the project: [`models/marts/finance/mart_finance__casual_pay_paid.sql`](../../models/marts/finance/mart_finance__casual_pay_paid.sql)
and its YAML, with the unit test `a_claim_approved_by_monday_noon_is_paid_that_thursday`
([`_finance__models.yml`](../../models/marts/finance/_finance__models.yml)); the claims' core,
[`models/core/staff/core_claim.sql`](../../models/core/staff/core_claim.sql), which a mart reads
because staging is private to the credential model; the test that every approved claim has a pay
day ([`tests/rules/approved_claims_have_a_pay_day.sql`](../../tests/rules/approved_claims_have_a_pay_day.sql));
the products `payroll_export` and `claims` (`governance/4-data-products/`); and the decisions
DEC-FIN-04, the export as a model, and DEC-PRJ-16, every job as code that reaches production the
same way ([`docs/decisions.md`](../../docs/decisions.md)).

## Run it

On DuckDB, with no account, from the project's folder:

```sh
dbt build --profiles-dir . --select +mart_finance__casual_pay_paid   # the export, what it reads, and their tests
dbt test --profiles-dir . --select "test_type:unit"                  # the unit tests only
```

The bundle needs a Databricks workspace and its CLI; `databricks.yml`'s header has its commands.
The sample's export has four rows, the last on Thursday 5 November 2026; the film's numbers are the
university's.
