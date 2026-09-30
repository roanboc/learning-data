# Conventions

How the code is written, so that anyone, or any agent, can follow it. Shared by every model and
domain, like the key sets and the hashing macro.

## Layers

| Layer | Folder | Job | Access | Materialised |
|---|---|---|---|---|
| Staging | `models/staging/<source>/` | One model per source table: rename, cast, add keys qualified by their key set and their hashes. No joins, no rules. Keeps the source's own words (a "customer" is still a customer). | private | view |
| Intermediate | `models/intermediate/` | Steps, not products: match keys, stitch timelines, apply business rules. Translates the source's words into the model's. | private | view |
| Core | `models/core/` | One model per entity and relationship at a declared grain. The enterprise contract. | public | table (incremental where it pays) |
| Marts | `models/marts/<consumer>/` | Built for one consumer. The consumer contract. | protected | table |

An entity with one source and nothing to resolve (the award) needs no intermediate step.

## Names

| What | Pattern | Example |
|---|---|---|
| Staging model | `stg_<source>__<table>` | `stg_short_courses__learners` |
| Intermediate model | `int_<entity>_<what it does>` | `int_learner_keys_matched` |
| Core model | `core_<entity or relationship>` | `core_credit_towards_award` |
| Mart | `mart_<consumer>__<what>` | `mart_planning__near_award` |
| YAML | `_<source>__sources.yml`, `_<folder>__models.yml` | `_core__models.yml` |
| Readable key | `<thing>_bk`: qualified by its key set | `learner_bk` = `SIS\|S-20417` |
| Hash key | `<thing>_key`: the hash of `<thing>_bk` | `learner_key` |
| Versions | `valid_from` (inclusive), `valid_to` (exclusive, null while current), `is_current` | |
| When recorded | `recorded_from`, `recorded_to`, `recorded_at` | |
| Dates, times | `<event>_on` for a date, `<event>_at` for a timestamp | `issued_on`, `loaded_at` |
| True or false | `is_<state>`, `has_<thing>` | `is_near_award`, `has_student_id` |

## SQL

- Lower-case keywords, four-space indents, trailing commas, one column per line.
- **Import CTEs** first, one per model or source, each `select * from {{ ref(...) }}`.
- Then **logical CTEs**, one step each, named for what they hold (`learners_at_census`, not `cte2`). A comment says why, when the name can't.
- A **final select** that lists every column, in the contract's order.
- Full model names in joins, no one-letter aliases. `union all`, unless removing duplicates is the point.
- Cast to the contract's type where a function could return another (`sum` on DuckDB returns a 128-bit integer).

## Keys and hashes

- **Key sets.** Every key is qualified by where it comes from: `SIS` (student system), `LMS` (learning platform), `SC` (short-course platform). The list is `seeds/key_sets.csv`.
- **Readable key.** `business_key('SIS', 'student_id')` gives `SIS|S-20417`; null when any part is missing or blank.
- **Hash.** `hash_key(['learner_bk'])`: sha-256, as 64 hex characters, of the parts trimmed, upper-cased and joined with `|`, with a sentinel for a missing part. Every key in these sources is case-insensitive. The exact rules are in the macro's comment, `macros/keys.sql`. DuckDB's `sha256` and Databricks' `sha2(..., 256)` give the same value.
- **Collision risk.** Two different keys giving the same sha-256 is negligible. The real risk is two different keys normalising to the same string: keys that differ only by case or spaces (intended), or a key containing `|` (none in these sources).
- **The readable key stays beside the hash**, in every core model, so any row can be read and checked.

## Time

- `valid_from` is inclusive and `valid_to` exclusive; a null `valid_to` means current.
- A point-in-time join uses `valid_at(date)`: the version valid on that date.
- Where a source says when a change took effect, that date dates the version; otherwise, the day the platform recorded it. `recorded_at` keeps when it was recorded.

## Tests

- Every model's grain is tested as a key: `unique`, or `unique_combination` for several columns.
- Every relationship is tested (`relationships`); every closed set of values too (`accepted_values`).
- A rule with logic gets unit tests, with mock rows (`unit_tests:`).
- Severity is agreed with the data's owner, and written in the test's description.
- **A failing test is never weakened, deleted or given a lower severity to make it pass.** Fix the data, the code, or, with the owner's agreement, the expectation.

## Metadata

- `meta.owner`: who owns the meaning (models) or the data (sources, seeds).
- `meta.domain`: registrar, learning, planning or wallet.
- `meta.glossary_term`: the term in `model/conceptual.yml` a model or key holds.
- `meta.personal_data` on columns: `direct` (identifies a person: name, email, student ID, or a key that contains one) or `pseudonymous` (a hash of one). A column with neither holds no personal data.
- A description used in more than one place is a doc block, written once (`docs/columns.md`); a definition is written once, in `model/conceptual.yml`.
