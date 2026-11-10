# A worked example: the platform's checks, in the scorecard

On Databricks, the platform checks the tables too, beside dbt's tests. The platform team's loading
pipeline keeps out a row with no system key, and counts it
(`scripts/setup/loading_pipeline.sql`); anomaly detection learns when each table usually arrives and
how many rows it brings; and a profile of the badges counts, each night, how many carry no credit,
with an alert on it (`scripts/setup/monitoring.py`). `analyses/quality/platform_results.sql` reads
what they found, a row for each check on each table, with its quality dimension. The scorecard and
the issues read those rows beside the tests' results, and give each check its table's owner and
domain, from the source the project reads it as. *Governance you can use* film 4 of 6, *Quality on
the platform*, shows it.

Nothing here connects to Databricks, so the platform's results are examples: two nights' rows, as
the query writes them.

| File | What it is |
|---|---|
| `last_night.csv` | A night when every check on the platform passed: the pipeline's expectation on each of the seven tables, kept out none; each table's freshness and rows, as usual; and 1 badge with no credit, a welcome badge |
| `scorecard.md` | The scorecard written from the project's run and `last_night.csv`: the tests' table as it is in `docs/scorecard.md`, and the platform's under it |
| `two_kept_out.csv` | Another night, when two enrolments arrived with no ID, and the pipeline kept them out |
| `issue_two_kept_out.md` | The learning team's issue from that night: the two rows kept out, beside the test's warning |

In the platform's table, a warning is rows kept out at loading, or a table that wasn't as usual:
nothing stopped, and the table's owner is told, as for a test that warns. Each kind of check names
its dimension in the query, as each kind of dbt test does in `tests/generic/`: a key that's there,
completeness; a table's freshness, timeliness; its rows of the last 24 hours, completeness; the
badges' share with no credit, validity, as the rule it became (DEC-LMS-03).

## Run it again

From the project's folder, after a build (`dbt build --profiles-dir . --no-partial-parse`):

```sh
python scripts/generate/scorecard.py --platform examples/platform-results/last_night.csv --out examples/platform-results/scorecard.md
python scripts/generate/issues.py --platform examples/platform-results/two_kept_out.csv
```

The issues are written to `target/issues/`, one per owner; `issue_two_kept_out.md` is the learning
team's, from the run of 28 October 2026, so its dates are that week's.
