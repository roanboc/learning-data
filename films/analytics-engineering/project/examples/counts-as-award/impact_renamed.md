# What this change touches

2 file(s) changed in the project since `column-added`; 1 model(s), seed(s) or source(s) changed, 0 test(s) changed, 3 downstream model(s), 15 test(s), 3 exposure(s).

## Changed

- `core_credential v2` (model): changed in `models/core/student/_core_student__models.yml`

## Contracts

- `core_credential v2`: **breaking**: removed counts_as_award, added is_award. Needs a new version, with a deprecation date for this one

## Downstream

- `core_credential v1`
- `mart_wallet__credentials`
- `mart_wallet__learners`

## Who uses it

- `census_report`, owned by Planning
- `draft_submission`, owned by Mei Tanaka, registrar's office
- `wallet_app`, owned by Wallet app team

## Decisions implemented in it, still true?

- DEC-STU-06: A credential keeps its whole life (`models/core/student/_student__decisions.yml`)
- DEC-STU-07: core_credential version 2 replaces is_revoked with status (`models/core/student/_student__decisions.yml`)
- DEC-STU-08: core_credential version 2 is incremental, merged on credential_key (`models/core/student/_student__decisions.yml`)

## Tests

15 test(s) on it and downstream. `dbt build --select core_credential+ --profiles-dir .` runs them.

## Who to ask

Mei Tanaka, registrar's office; Planning; Wallet app team
