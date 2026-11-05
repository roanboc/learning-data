---
name: reconcile-and-diff
description: Validate a change before sign-off, by reconciling with the census report and diffing against the previous version. Use before asking an owner to approve a change to the core or the marts.
---

# Reconcile and diff

Two checks before anyone signs off: does the answer match the number people trust, and what
changed against the version before?

## Reconcile

1. Build on the development target: `dbt build --profiles-dir .`.
2. The singular test `reconcile_planning_with_census_report` must pass. It compares Planning's mart with `seeds/expected/planning/census_report.csv`, faculty by faculty.
3. For the sign-off, show every row, not just the failures: `dbt show --select reconcile_census_report --profiles-dir .`.
4. If they differ, find the learners behind the difference: query `mart_planning__near_award` for the faculty, with `learner_key` and the credit columns, not names. Then trace one learner back through `core_credit_towards_award` and `int_credit_items`. Report each cause with its query.

## Diff against the previous version

1. Build the main branch, and keep its database; then build your branch with `--full-refresh`:
   ```sh
   git switch main && dbt build --profiles-dir . && cp target/credentials.duckdb target/main.duckdb
   git switch - && dbt build --full-refresh --profiles-dir .
   ```
   `--full-refresh` matters: `core_credential` is incremental, so a plain build merges only
   credentials whose source rows changed, and a change to the logic never reaches the rows
   already built. The diff would say nothing changed.
2. Compare each changed model by its key:
   ```sh
   python scripts/tools/diff_against_main.py dev_marts.mart_planning__near_award learner_award_key
   python scripts/tools/diff_against_main.py dev_core.core_credential_v2 credential_key
   ```
   It prints the keys only on one side and, for keys on both, how many rows changed in each
   column. Counts only: no personal data leaves the database.
3. Explain each difference: expected (the change intended it) or not. An unexpected difference blocks the change until someone understands it.
4. Show the as-was and as-is answers side by side with `dbt show --select diff_as_was_as_is --profiles-dir .`; say which one each consumer reads.

## Report

The reconciliation table, the diff summary, and the query behind each line. The model's owner
signs off, and the consumer when their contract changed.

## Causes met so far

When the count and the census report differ, check these first: each was found before, and a
person settled it. Report which one fits, with its query. When none fits, say so: a person
settles the new cause, and it gets an entry here, so nothing is solved twice.

### Withdrew after census day

- Shows: the count is under the census report.
- Settled: they still count, as at census (DEC-PLN-02).
- Decided by: Planning, the wallet app team and Noor.

### A degree in no faculty

- Shows: students under no faculty, beside a new degree.
- Settled: every degree belongs to a faculty; the registrar's office names it.
- Decided by: Mei Tanaka, registrar's office.

### A student counted twice

- Shows: one person with two learner keys.
- Settled: a person decides two keys are one (DEC-STU-04).
- Decided by: Mei Tanaka, registrar's office.

### Test records

- Shows: records made in one week, dated back months.
- Settled: they never count (DEC-SIS-05).
- Decided by: Mei Tanaka, registrar's office, 22 October 2026.

### Exchange students with no level

- Shows: a split by level of study comes up short of the census-day count, every year since 2021.
- Settled: they count as non-award, a level of its own (`examples/census-by-level/`).
- Decided by: Mei Tanaka, registrar's office, 3 November 2026.

## Every split adds up to its total

When a change splits a number people trust (by faculty, by level of study, by anything), the
parts must add up to the whole. Write it as a test before you build the split: the parts' sum
against the total already reconciled, and every row in exactly one part. A sum that comes up short
is news: find the rows behind the difference, with a query that returns counts, not names, and
how far back it goes. Ask the owner of the meaning where they belong, with options that each add
up (*Who approves what* in `AGENTS.md`); their answer goes into *Causes met so far*, and the years
before go to people. Don't drop rows or change the test to pass. See `examples/census-by-level/`.
