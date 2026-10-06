# Conventions

How the code is written, so that anyone, or any agent, can follow it. Shared by every model and
domain, like the key sets and the hashing macro.

## Layers

| Layer | Folder | Job | Access | Materialised |
|---|---|---|---|---|
| Sources | `sources/<source>/` | What comes in: tables, freshness, key set, and the source's doc blocks. No SQL. | | |
| Staging | `models/staging/<source>/` | One model per source table: rename, cast, add keys qualified by their key set and their hashes. No joins, no rules. Keeps the source's own words (a "customer" is still a customer). | private | view |
| Intermediate | `models/intermediate/<domain>/` | Steps, not products: match keys, stitch timelines, apply business rules. Translates the source's words into the model's. | private | view |
| Core | `models/core/<domain>/` | One model per entity and relationship at a declared grain. The enterprise contract, versioned: a breaking change is a new version. | public | table (incremental where it pays) |
| Marts | `models/marts/<consumer>/` | Built for one consumer. The consumer contract. | protected | table |

Access, contracts and materialisations are set once per folder, in `dbt_project.yml`. Each
model's YAML holds the rest: `meta.grain`, the columns and their types, the constraints and the
tests.

An entity with one source and nothing to resolve (the award) needs no intermediate step.

## Domains

A large project holds several domains, and each owns its models and their metadata. There are
three kinds, and the project's folders follow them:

| Kind | What it is | Here | Folders |
|---|---|---|---|
| Application domain | A system, and the team that runs it | `registrar` (the student system), `learning` (the learning platform and the short-course platform) | `sources/<system>/`, `models/staging/<system>/` |
| Data domain | What the facts mean, following the reference model | `student`, `course` | `models/intermediate/<domain>/`, `models/core/<domain>/` |
| Business domain | Who decides with the data | `planning`, `wallet`, `finance` | `models/marts/<consumer>/`, `exposures/<consumer>/` |

Staging is split by source system, because one system can feed several data domains.
Intermediate and core are split by data domain; the marts and exposures by consumer. The data
and business domains:

| Domain | Folders | Holds | Reference |
|---|---|---|---|
| `student` | `models/intermediate/student/`, `models/core/student/`, `seeds/reference/student/` | Learners, the credentials they hold, the credit they hold towards an award | TCSI Student packet, extended to learners with no award and to microcredentials and badges |
| `course` | `models/core/course/` | The awards the university offers | TCSI Course packet |
| `planning` | `models/marts/planning/`, `seeds/expected/planning/` | Planning's marts, as at census | |
| `wallet` | `models/marts/wallet/` | The wallet app's marts, as they are now | |
| `finance` | `models/marts/finance/`, `seeds/reference/finance/`, `seeds/expected/finance/` | Finance's marts, as at census, and the tuition rates it publishes | |
| shared | `models/_shared/`, `seeds/reference/shared/` | The university's map (domains and key entities), the key sets seed (generated from the sources), the version columns, the time spine | |

The domains follow the reference model, TCSI (Tertiary Collection of Student Information): check
it, adopt what fits, extend where the business needs more, and record each extension in the
domain's conceptual model.

Sources, models and exposures each have their own top-level folder, so what comes in, what's
built and who uses it are never lost in each other's YAML:

| Folder | Holds |
|---|---|
| `sources/<source>/` | `_<source>__sources.yml` and `_<source>__docs.md`. The source's key set is an attribute of the source (`meta.key_set`): its code, system, owner, and each system key with the case staging writes it in |
| `models/` | The models, by layer and domain |
| `exposures/<consumer>/` | `_<consumer>__exposures.yml`: the dashboards and apps that use the marts |
| `requirements/` | Temporary: what's still open while something is built (questions, requirements, gaps), mirroring `sources/`, `models/<domain>/` and `exposures/`. Deleted when done; not a backlog. Not read by dbt. See [`requirements/README.md`](../requirements/README.md) |
| `_<scope>__decisions.yml` | Permanent: each scope's decision log, next to what it's about (`sources/<system>/`, `models/core/<domain>/`, `models/marts/<consumer>/`, `models/_shared/` for the project). Indexed in `docs/decisions.md`. Not read by dbt (`.dbtignore`) |

The conceptual model is written at two levels:

- **The university's map**, `models/_shared/_shared__conceptual.yml`: its domains and their key
  entities, no more than 50, each modelled or planned, with the TCSI element it follows. It's a
  map, not the detail; it grows as questions arrive. `scripts/generate/definitions.py` draws it
  into `_shared__conceptual.md`, and fails if it and the domains disagree.
- **Each core domain and mart's own conceptual model**, in its folder. A core domain defines its
  entities; a mart states its question, the core entities it uses, and any concept it adds
  (Planning's learner near an award, the wallet's learner's wallet).

Each core domain and mart's folder holds its data definitions, next to its models:

| File | What it holds |
|---|---|
| `_core_<domain>__models.yml`, `_int_<domain>__models.yml`, `_<consumer>__models.yml` | The models: grain, columns, types, constraints, tests |
| `_<domain>__conceptual.yml` | The question (a mart), and what each entity and relationship means, its key and its owner. Not read by dbt (`.dbtignore`) |
| `_<domain>__conceptual.md` | The conceptual diagram, drawn by hand |
| `_<domain>__definitions.md` | Doc blocks generated from the conceptual model by `scripts/generate/definitions.py` |
| `_<domain>__columns.md` | Doc blocks for the columns the domain owns, if any |
| `_<domain>__physical.md` | The physical diagram, generated from the manifest by `scripts/generate/diagrams.py` |

Seeds are split by purpose before domain, and the two purposes never share a folder:

| Folder | Holds | Schema | Who reads it |
|---|---|---|---|
| `seeds/reference/<domain>/` | Data the business owns: mappings, decisions, key sets | `reference` | Models |
| `seeds/expected/<domain>/` | Numbers published outside this project, to reconcile against | `expected` | Tests, analyses and scripts only; never a model |

Each seed's `meta.purpose` and tag (`reference` or `expected`) say the same, so
`dbt build --select tag:expected` finds them. The test
`tests/governance/models_do_not_read_expected_seeds.sql` fails the build if a model refs one.

## One purpose per folder

A folder holds one kind of thing. Where a dbt folder holds several, it's split by purpose first,
then by domain:

| Folder | Purposes |
|---|---|
| `seeds/` | `reference/` (models read it), `expected/` (tests reconcile against it) |
| `tests/` | `generic/` (custom generic tests), `rules/` (business rules that must hold), `reconciliation/` (a result against an expected seed), `governance/` (rules about the project itself) |
| `analyses/` | `profiling/` (evidence about the sources), `design/` (evidence for a modelling choice), `validation/` (checking the result) |
| `macros/` | `shared/` (conventions every domain uses), `<domain>/` (one domain's rule), `adapters/` (engine workarounds) |
| `scripts/` | `generate/` (write committed files), `check/` (CI checks), `tools/` (for people, on demand), `setup/` (one-off platform setup) |

The governance test does the job of a dbt v2 check. When the project moves to dbt v2 (the Fusion
engine), it moves to `checks/`, as the SQL in its header shows.

A source's folder holds its doc block and the columns only that source has
(`_<source>__docs.md`). `docs/` holds how the work is done (process, conventions) and the
generated index of the decision logs, not what the data means.

## File lifecycles

Every file in the project has one of four lifecycles. A file's header, or its folder, says which.

| Lifecycle | Files | How they change |
|---|---|---|
| **Permanent**, written by hand | Sources, models, exposures, seeds, tests, macros, analyses, scripts; conceptual models (`_<domain>__conceptual.yml`, `_<domain>__conceptual.md`); decision logs (`_<scope>__decisions.yml`); `meta.limitations`; `docs/process.md`, `docs/conventions.md` | Edited in a pull request and reviewed. A decision is never deleted: when it's replaced, it's marked `superseded` and relates to what replaced it |
| **Generated**, never edited by hand | `_<domain>__definitions.md`, `_<domain>__physical.md`, `models/_shared/_shared__conceptual.md`, `docs/decisions.md`, `seeds/reference/shared/key_sets.csv` | Rewritten by `scripts/generate/*` from the permanent files. Each says so in its first lines. CI fails if one is out of date: change the source, then run the script |
| **Temporary**, deleted when done | Items in `requirements/`; a deprecated model version (`core_credential` v1) | Live only while the work they're about is under way, then go (below). CI fails on a requirement that's done |
| **Build output**, never committed | `target/`, `logs/`, `*.duckdb`, `dbt_packages/` | Written by dbt, ignored by git, removed by `dbt clean` |

**A requirement**, from the day it's raised to the day it's gone:

```
open ─► in_progress ─► done ─► what lasts moves to its home ─► the item is deleted
                                (decision log, meta.limitations,     (and its register, once empty;
                                 question:, a test or contract)        git keeps the history)
```

Nothing stays in `requirements/` once it's done: `scripts/check/requirements.py` fails on any item
that isn't `open` or `in_progress`. [`requirements/README.md`](../requirements/README.md) says where
each kind of item goes.

**A deprecated model version** stays until its `deprecation_date`, so its consumers have time to
move. The newest version holds the logic, and each older version is built from it, never the other
way round: the new version can say what the old one can't (a credential that expired), so only the
old shape can be derived from the new one, and an old version can go without touching anything
else. With a version 3, versions 1 and 2 would both be built from it. An old version is removed in
the first release after its date: `core_credential` v1 after 31 March 2027 (DEC-STU-07). The
exposures say who to tell.

## Splitting into projects

Today one project holds every domain (DEC-PRJ-03). The files a domain owns are under paths named
for it, except its tests and analyses, which are split by purpose first and listed here by name. When
a team owns a domain, its project is these:

| What | A core domain's project (`student`) | A consumer's project (`planning`) | A consumer added later (`finance`) |
|---|---|---|---|
| Models | `models/intermediate/student/`, `models/core/student/` | `models/marts/planning/` | `models/marts/finance/` |
| Seeds | `seeds/reference/student/` | `seeds/expected/planning/` | `seeds/reference/finance/`, `seeds/expected/finance/` |
| Macros | | `macros/planning/` | |
| Exposures | | `exposures/planning/` | `exposures/finance/` |
| Decisions | `models/core/student/_student__decisions.yml` | `models/marts/planning/_planning__decisions.yml` | `models/marts/finance/_finance__decisions.yml` |
| Tests | `tests/rules/keys_decided_different_stay_apart.sql` | `tests/reconciliation/reconcile_planning_with_census_report.sql` | `tests/reconciliation/reconcile_finance_with_tuition_report.sql` |
| Analyses | `analyses/design/fan_out_without_point_in_time.sql`, and the profiles of the sources it reads (`analyses/profiling/`) | `analyses/validation/reconcile_census_report.sql`, `analyses/validation/diff_as_was_as_is.sql` | `analyses/profiling/profile_credit_across_awards.sql`, `analyses/validation/reconcile_tuition_report.sql` |
| Open requirements | `requirements/models/student/`, if any | `requirements/exposures/planning/`, if any | `requirements/exposures/finance/`, if any (none since it shipped) |
| Sources | The sources it reads, with their decisions and open requirements (`sources/<system>/`, `requirements/sources/<system>/`) | None: it reads the core | None: it reads the core, pinned to the versions it was built on |

A singular test's entry in its folder's YAML (`_reconciliation__tests.yml`, `_rules__tests.yml`)
moves with it. A consumer added later starts the same way: Finance's folders were named for it from
its first commit, and its test and analyses are listed above, so it can move out whole.

What every domain shares (`models/_shared/`, with the project's decisions; `macros/shared/`;
`seeds/reference/shared/`; these conventions) becomes a package each project
installs. A consumer's project refs the public core across projects, as `examples/planning/`
sketches.

## Access

Access says which models can `ref()` a model. It doesn't say who can read the table: on
Databricks, grants do that (`+grants` in `dbt_project.yml`).

| Access | Who can `ref()` it |
|---|---|
| `private` | Models in the same group only. Staging and intermediate are private to `credential_model`. |
| `protected` | Any model in the same project. The marts are protected: in this one project, the wallet's marts could `ref()` Planning's, and only review stops it. |
| `public` | Any model in any project, through a cross-project `ref()` in dbt Cloud. The core is public. |

When Planning and the wallet own their own projects, `protected` keeps each consumer's marts
to itself, and they meet only on the public core. `examples/planning/` sketches that.

## Names

| What | Pattern | Example |
|---|---|---|
| Staging model | `stg_<source>__<table>` | `stg_short_courses__learners` |
| Intermediate model | `int_<entity>`, or `int_<entity>_<step>` when an entity takes several steps | `int_learners`, `int_learner_keys_matched` |
| Core model | `core_<entity or relationship>` | `core_credit_towards_award` |
| Mart | `mart_<consumer>__<what>` | `mart_planning__near_award` |
| YAML | `_<source>__sources.yml`, `_<layer>_<domain>__models.yml` (`_<consumer>__models.yml` in the marts) | `_core_student__models.yml` |
| Readable key | `<thing>_bk`: qualified by its key set | `learner_bk` = `SIS\|S-20417` |
| Hash key | `<thing>_key`: the hash of `<thing>_bk` | `learner_key` |
| Versions | `valid_from` (inclusive), `valid_to` (exclusive, null for the last version), `is_current` (valid today) | |
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

- **Key sets.** Every key is qualified by where it comes from: `SIS` (student system), `LMS` (learning platform), `SC` (short-course platform). Each key set is written once, on the source that issues it (`meta.key_set` in `sources/<system>/_<system>__sources.yml`); `scripts/generate/definitions.py` generates `seeds/reference/shared/key_sets.csv` from them.
- **One case per key.** Staging writes each system key in one case: IDs and codes upper case (`S-20417`, `GCDA`), platform user IDs and emails lower case (`u-88213`). So `s-20417` typed into the platform is the same key as `S-20417`, and a readable key and its hash are one to one.
- **Readable key.** `business_key('SIS', 'student_id')` gives `SIS|S-20417`; null when any part is missing or blank.
- **Hash.** `hash_key(['learner_bk'])`: sha-256, as 64 hex characters, of the parts trimmed, upper-cased and joined with `|`, with a sentinel for a missing part. Every key in these sources is case-insensitive. The exact rules are in the macro's comment, `macros/shared/keys.sql`. DuckDB's `sha256` and Databricks' `sha2(..., 256)` give the same value.
- **Collision risk.** Two different keys giving the same sha-256 is negligible. The real risk is two different keys normalising to the same string: keys that differ only by case or spaces (intended), or a key containing `|` (none in these sources).
- **The readable key stays beside the hash**, in every core model, so any row can be read and checked.

## Time

- `valid_from` is inclusive and `valid_to` exclusive; a null `valid_to` means no later version.
- A point-in-time join uses `valid_at(date)`: the version valid on that date.
- **As it was** is `valid_at(census_date())`. **As it is** is `valid_at(as_is_date())`: the version valid today, not the latest one recorded, because a change can be dated in the future. `is_current` is the same test, as at the build.
- Where a source says when a change took effect, that date dates the version; otherwise, the day the platform recorded it. `recorded_at` keeps when it was recorded.

## Tests

- Every model's grain (`meta.grain`) is tested as a key: `unique`, or `unique_combination` for several columns.
- Every relationship is tested (`relationships`); every closed set of values too (`accepted_values`).
- A rule with logic gets unit tests, with mock rows (`unit_tests:`).
- Severity is agreed with the data's owner, and written in the test's description.
- **A failing test is never weakened, deleted or given a lower severity to make it pass.** Fix the data, the code, or, with the owner's agreement, the expectation.

## Metadata

- `meta.grain`: on every core and mart model, the grain in one sentence ("One row per credential"). Each domain's physical diagram (`_<domain>__physical.md`) reads it; a test proves it.
- `meta.owner`: who owns the meaning (models) or the data (sources, seeds).
- `meta.domain`: the domain that owns the model, seed or source: `registrar` or `learning` (application domains: the teams whose systems are the sources), `student` or `course` (data domains), `planning`, `wallet` or `finance` (business domains), or `shared`.
- `meta.glossary_term`: the term in the domain's conceptual model a model or key holds.
- `meta.limitations` on a model or a source table: what anyone using it needs to know and can't change, as `[{id: LIM-<SCOPE>-<nn>, text}]`, with `was:` naming the gap it came from, if any. An accepted gap ends here, with the decision that accepted it in the scope's log.
- `meta.personal_data` on columns: `direct` (identifies a person: name, email, student ID, or a key that contains one) or `pseudonymous` (a hash of one). A column with neither holds no personal data.
- A description used in more than one place is a doc block, written once, in the folder of the domain that owns it (`_<domain>__columns.md`), or in `models/_shared/_shared__columns.md` when every domain shares it. A definition is written once, in the domain's conceptual model, or taken from the glossary term it names in `source:`.

### Definitions from the business glossary

The university keeps a business glossary outside dbt: Unity Catalog's Glossary, on Databricks. Where it
defines an entity, the glossary is the home of the definition, not the project: data governance
names the term that applies, and the conceptual model takes its words and records the term in
`source:` (`glossary`, `term`, `named_by`, `synced_on`), adding only what the glossary doesn't
hold, such as keys, identity rules and history. An entity the glossary doesn't define is defined
in the conceptual model, once governance confirms there's no term for it. The copy flows one way,
from the glossary in: `skills/sync-the-glossary/` compares them on a schedule, and a changed term
arrives as a pull request that says what it touches, for the owner to approve (DEC-PRJ-11).
