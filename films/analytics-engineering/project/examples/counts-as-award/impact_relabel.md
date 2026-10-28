# What this change touches

1 file(s) changed in the project since `before-tuesday`; 1 model(s), seed(s) or source(s) changed, 0 test(s) changed, 9 downstream model(s), 39 test(s), 5 exposure(s).

## Changed

- `int_credentials_unioned` (model): changed in `models/intermediate/student/int_credentials_unioned.sql`

## Downstream

- `core_credential v1`
- `core_credential v2`
- `core_credit_towards_award v1`
- `int_credit_items`
- `int_credit_towards_award`
- `mart_finance__tuition_forgone`
- `mart_planning__near_award`
- `mart_wallet__credentials`
- `mart_wallet__learners`

## Who uses it

- `census_dashboard`, owned by Planning
- `census_report`, owned by Planning
- `draft_submission`, owned by Mei Tanaka, registrar's office
- `revenue_forecast`, owned by Finance
- `wallet_app`, owned by Wallet app team

## Decisions implemented in it, still true?

- DEC-STU-06: A credential keeps its whole life (`models/core/student/_student__decisions.yml`)
- DEC-LMS-01: A badge that disappears is revoked (`sources/learning_platform/_learning_platform__decisions.yml`)
- DEC-SC-03: Only certificates of completion are credentials (`sources/short_courses/_short_courses__decisions.yml`)
- DEC-SIS-03: An award is conferred when the first completed version takes effect (`sources/student_system/_student_system__decisions.yml`)

## Tests

39 test(s) on it and downstream. `dbt build --select int_credentials_unioned+ --profiles-dir .` runs them.

## Who to ask

Finance; Mei Tanaka, registrar's office; Planning; Wallet app team
