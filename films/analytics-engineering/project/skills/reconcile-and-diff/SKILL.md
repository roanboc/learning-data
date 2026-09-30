---
name: reconcile-and-diff
description: Validate a change before sign-off, by reconciling with the census report and diffing against the previous version. Use before asking an owner to approve a change to the core or the marts.
---

# Reconcile and diff

Two checks before anyone signs off: does the answer match the number people trust, and what
changed against the version before?

## Reconcile

1. Build on the development target: `dbt build --profiles-dir .`.
2. The singular test `reconcile_planning_with_census_report` must pass. It compares Planning's mart with `seeds/census_report.csv`, faculty by faculty.
3. For the sign-off, show every row, not just the failures: `dbt show --select reconcile_census_report --profiles-dir .`.
4. If they differ, find the learners behind the difference: query `mart_planning__near_award` for the faculty, with `learner_key` and the credit columns, not names. Then trace one learner back through `core_credit_towards_award` and `int_credit_items`. Report each cause with its query.

## Diff against the previous version

1. Build the main branch, and keep its database: `git switch main && dbt build --profiles-dir . && cp target/credentials.duckdb target/main.duckdb`. Then switch back to your branch and build it.
2. Compare each changed model by its key, with the main build attached. For example, for the Planning mart:
   ```sh
   python - <<'PY'
   import duckdb
   db = duckdb.connect("target/credentials.duckdb", read_only=True)
   db.execute("attach 'target/main.duckdb' as main_build (read_only)")
   for side, a, b in [("only in this branch", "dev_marts", "main_build.dev_marts"),
                      ("only in main", "main_build.dev_marts", "dev_marts")]:
       n = db.sql(f"select count(*) from (select learner_award_key, is_near_award from {a}.mart_planning__near_award "
                  f"except select learner_award_key, is_near_award from {b}.mart_planning__near_award)").fetchone()[0]
       print(side, n)
   PY
   ```
   Count rows, keys only on one side, and, for keys on both, the columns that changed.
3. Explain each difference: expected (the change intended it) or not. An unexpected difference blocks the change until someone understands it.
4. Show the as-was and as-is answers side by side with `dbt show --select diff_as_was_as_is --profiles-dir .`; say which one each consumer reads.

## Report

The reconciliation table, the diff summary, and the query behind each line. The model's owner
signs off, and the consumer when their contract changed.
