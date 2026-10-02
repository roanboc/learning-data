# The credential project

The example dbt project that *In the weeds of data crafting* draws from. From *Start from a
question* on, every snippet the films show on screen is code in this folder, and it runs on
DuckDB. One exception: the cross-project sketch in `examples/planning/`, which needs dbt Cloud.

It builds the slice of the university's credential model (v3) that answers one question from
Planning: **how many learners are within 15 credit points of a graduate certificate, by faculty,
as at census date?** A second consumer, the learner's wallet app, reads the same facts as they
are now. That makes two consumer contracts on one enterprise contract.

It runs on your machine and in CI, on DuckDB, with no account. The same code runs on
Databricks, with dbt Cloud or dbt Core. The university, its people and its data are fictional.

## Run it on your machine

With Python 3.11 or later, in a virtual environment (many systems refuse `pip install` into
their own Python):

```sh
cd films/analytics-engineering/project
python -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
dbt build --profiles-dir .
```

`dbt build` loads the reference data, builds every model and runs every test. It ends green, with
one warning by design: a short-course enrolment with no email (see [the gap register](docs/gaps.md),
gap 5). The database is `target/credentials.duckdb`.

Then, if you like:

| Command | What it does |
|---|---|
| `dbt docs generate --profiles-dir . && dbt docs serve --profiles-dir .` | The docs site, with lineage |
| `dbt show --select profile_null_keys --profiles-dir .` | One of the evidence queries in `analyses/` |
| `dbt show --select reconcile_census_report --profiles-dir .` | Planning's number beside the census report's |
| `python scripts/diagrams.py` | Regenerates `docs/physical.md` from `target/manifest.json` |
| `python scripts/definitions.py` | Regenerates `docs/definitions.md` and `seeds/key_sets.csv` from `model/conceptual.yml` |
| `pip install dbt-metricflow==0.15.0`, then `DBT_PROFILES_DIR=. mf query --metrics learners_near_graduate_certificate --group-by learner_award__faculty_name` | Planning's answer, from the semantic layer's metric |
| `dbt clean --profiles-dir .` | Deletes `target/`, the database with it, for a clean start |

`core_learner`, `core_award` and `core_credit_towards_award` say which version is current as at
the day of the build. To repeat a run exactly, fix that day: `--vars '{as_is_date: 2026-09-30}'`.

The census date is a var. `dbt build --vars '{census_date: 2026-08-31}' --profiles-dir .` answers
Planning's question as at another date; the reconciliation test then fails, because the census
report has no number for that date.

Source freshness isn't part of `dbt build`. `dbt source freshness --profiles-dir .` checks it, and
since the sample files don't change, it reports every source as stale (`ERROR STALE`). CI doesn't
run it.

## Run it on Databricks

The sources must be tables first. On DuckDB they're the CSV files in `data/`; on Databricks,
ingestion lands them in three schemas named after the systems: `student_system`,
`learning_platform` and `short_courses`. To load the sample files into your workspace:

1. Upload `data/` to a Unity Catalog volume, with the Databricks CLI:
   `databricks fs cp -r data dbfs:/Volumes/<catalog>/<schema>/<volume>/data`
2. Run `scripts/load_databricks.sql` in the SQL editor, with two parameters: `catalog`, the
   catalog the three schemas go in, and `data`, the folder you uploaded
   (`/Volumes/<catalog>/<schema>/<volume>/data`). It creates the schemas and the seven tables.

The sources are read from the catalog in `DBT_SOURCES_CATALOG`, or the target's catalog if it's
not set. If ingestion prefixes the schema names (say, `raw_student_system`), set
`DBT_SOURCES_SCHEMA_PREFIX` to the prefix (`raw_`).

### With dbt Cloud

1. **Connect the repository**, and set the project subdirectory to `films/analytics-engineering/project`.
2. **Create a Databricks connection**: the workspace host and a SQL warehouse's HTTP path.
3. **Set up a development environment** with your credentials: a token, the catalog and a schema of your own.
4. **Build.** In the IDE, run `dbt build`. For production, create a deployment environment, with a job that runs `dbt build`.

dbt Cloud ignores `profiles.yml`: the connection and credentials live in the environment. Set
`DBT_SOURCES_CATALOG` and `DBT_SOURCES_SCHEMA_PREFIX` in the environment's variables if the sources
sit elsewhere.

### With dbt Core

```sh
pip install -r requirements-databricks.txt
export DATABRICKS_HOST=<workspace>.cloud.databricks.com
export DATABRICKS_HTTP_PATH=/sql/1.0/warehouses/<id>
export DATABRICKS_TOKEN=<token>
export DATABRICKS_CATALOG=<catalog>
export DATABRICKS_SCHEMA=<your schema>   # optional; dev if not set
dbt build --target databricks --profiles-dir .
```

`requirements-databricks.txt` installs dbt-databricks 1.12.5, which brings dbt-core 1.12.3.

### Adding a Databricks job to CI

CI here builds on DuckDB and needs no secrets. To also build on Databricks for each pull request,
add a job to `.github/workflows/credential-project.yml`: install
`requirements-databricks.txt`, set the five `DATABRICKS_*` variables from repository secrets (a
service principal's token, not a person's), set `DATABRICKS_SCHEMA` to a schema for the pull
request (say, `ci_pr_<number>`), run `dbt build --target databricks`, and drop the schema at the
end. With dbt Cloud, a CI job does the same, and builds only the changed models and what depends
on them: `dbt build --select state:modified+ --defer --state <production artifacts>`, where the
artifacts are the `manifest.json` of the last production run.

CI already parses the project for Databricks, with no secrets and no connection: that catches a
Databricks-only mistake in the SQL's Jinja, the configs or the profile before it reaches dbt Cloud.

## Layout

```
project/
├── dbt_project.yml           vars (census date, the 15-credit-point threshold, the limit of four
│                             microcredentials), layers, access, contracts, groups, grants
├── profiles.yml              targets: duckdb (default), databricks
├── data/<system>/<table>.csv the three sources, every version kept (DuckDB only)
├── seeds/                    reference data the business owns: status map, identity decisions,
│                             credit recognition, key sets, the census report
├── models/
│   ├── staging/<system>/     one view per source table; sources YAML
│   ├── intermediate/         identity candidates and matches, timelines, the credit rule; unit tests
│   ├── core/                 the enterprise contract: public, versioned, enforced
│   ├── marts/planning/       as at census; the census dashboard exposure
│   ├── marts/wallet/         as it is now; the wallet app exposure
│   ├── semantic/             semantic model, metrics, time spine
│   └── _groups.yml           who owns which models
├── macros/                   keys and hashes, point in time, the near-award rule, DuckDB constraints
├── tests/                    custom generic tests, reconciliation, identity
├── analyses/                 the evidence: profiling, fan-out, late changes, reconcile, as-was and as-is
├── model/conceptual.yml      the conceptual model in YAML (not read by dbt)
├── docs/                     conceptual model, the process, decisions, gap register, conventions,
│                             doc blocks, and two generated pages: definitions and the physical diagram
├── scripts/                  diagrams.py and definitions.py, each with --check; diff_against_main.py;
│                             load_databricks.sql
├── examples/planning/        Planning's own project, refing the core across projects (dbt Cloud only)
├── AGENTS.md                 what an AI agent may and may not do here, and its access
└── skills/                   five skills for an agent: draft the conceptual model, profile, draft
                              a model, reconcile and diff, review metadata
```

## Which film uses which part

| Film | What it shows from here |
|---|---|
| *A model is not a transformation* | The names of the sources and of the staging and intermediate models; `learner_key` tested unique and not null |
| *Start from a question* | The question and the slice in `model/conceptual.yml`; the hand-drawn diagram in `docs/conceptual-model.md`; the decision that a microcredential is a kind of credential; `skills/draft-the-conceptual-model/` for the agent's draft |
| *What makes it the same one* | The profiling queries in `analyses/`; key sets and `macros/keys.sql` (its header shows the compiled SQL); the staging models; `int_learner_keys`, `int_learner_key_candidates` (one CTE per rule) and `int_learner_keys_matched`; the identity decisions and status map seeds; the unit tests on matching |
| *One row of what, and when* | `meta.grain`, tested as keys; `analyses/fan_out_without_point_in_time.sql`; the version columns; `int_learner_timeline`; the Planning mart (as it was) beside the wallet marts (as it is); `analyses/profile_late_changes.sql` and `diff_as_was_as_is.sql` |
| *Promises and proofs* | `docs/gaps.md`; the core YAML (enterprise contract) and the marts YAML (consumer contracts, exposures); the tests; unit tests on the credit rule; warn and error levels; source freshness |
| *Built in layers* | The four layers and `docs/conventions.md`; import and logical CTEs; views, tables and the incremental `core_credential`; liquid clustering; the semantic layer, and `macros/near_award.sql`, where the rule and the count are written once |
| *Who owns what* | `models/_groups.yml`; access and contracts in `dbt_project.yml` (set per folder; a model's YAML holds its grain, columns and tests); what each access level allows, in `docs/conventions.md`; `meta.owner` and `meta.domain`; the exposures; the key sets, hashing macro and conventions that every domain shares; for *Across projects*, `examples/planning/` (dbt Cloud only, not run here) |
| *An agent on the team* | `AGENTS.md`, with the agent's access; `docs/process.md`, the ten steps; `skills/`; the evidence in `analyses/`; the reconciliation test and `scripts/diff_against_main.py`; the CI workflow, and the `state:modified+` command above for CI on changed models |
| *Written once* | Doc blocks in `docs/`; `model/conceptual.yml` generated into `docs/definitions.md` and `seeds/key_sets.csv`; `docs/physical.md` generated from the manifest; `persist_docs`; `core_credential` versions 1 and 2, with a deprecation date, and the wallet's `ref('core_credential', v=2)` |

## What differs between engines

| | DuckDB | Databricks |
|---|---|---|
| Sources | The CSV files in `data/`, read with `read_csv` (the `external_location` config, read by dbt-duckdb only) | Ingested tables in `DBT_SOURCES_CATALOG`, or the target's catalog |
| Hash | `sha256(...)` | `sha2(..., 256)`: the same value |
| Primary and foreign keys | Left out: DuckDB enforces them, and won't replace a table a foreign key points to | Declared, informational, in Unity Catalog |
| `not_null` and `check` constraints | Enforced | Enforced |
| Incremental `core_credential` | `merge` on `credential_key` | `merge` on `credential_key`, liquid clustered by `learner_key` |
| `persist_docs` | Off | Descriptions pushed to Unity Catalog |
| Schemas | `dev_staging`, `dev_intermediate`, `dev_core`, `dev_marts`, `dev_reference` | The same suffixes on your target schema |
| Core tables | One per version: `core_learner_v1`, `core_credential_v2`, ... | The same |
| Grants | None | On the Planning marts, when the `planning_readers` var names groups |
| Semantic layer | Parsed, validated, and queried with MetricFlow in CI (`scripts/check_metric.py`) | Queried through dbt Cloud's Semantic Layer, on plans that include it |

## Engine and dbt workarounds

- **Key constraints on DuckDB.** DuckDB enforces foreign keys, and won't rename or drop a table that another table's foreign key points to, which is how dbt replaces a table on the next build. `macros/duckdb_constraints.sql` keeps `not_null` and `check` on DuckDB and leaves out the keys; tests check keys on both engines.
- **`core_credential` version 1 is a table, not a view.** A view can't hold the contract's constraints, and dbt warns. It's built from version 2, so its logic still lives once.
- **Seeds, and the identity test, are in the `credential_model` group.** A test that refers to a private model must be in that model's group. The singular test sets it in its own `config()`: set in YAML, it was lost on partial parses.
- **The sources' catalog variable is `DBT_SOURCES_CATALOG`.** dbt Cloud accepts only custom environment variables that start with `DBT_`.
- **Intermediate models are views, not ephemeral.** Unit tests can then mock their inputs as plain rows, and an agent can query each step.
- **The CSV files are read as text.** Staging casts every column, so the same SQL works on DuckDB's text columns and Databricks' typed ones.
- **The semantic layer has two simple metrics.** A ratio metric needs a metric on each side, not a measure; two simple metrics answer the question.
- **Each version of `core_credential` names its own primary key.** Both tables sit in one schema, and Unity Catalog wants constraint names unique within a schema.
- **Primary and foreign keys say `warn_unenforced: false`.** They're informational on Databricks on purpose; without it, dbt-databricks warns once per key on every build.

## The data

46 learners, fictional, in four faculties, built to hold the cases the films teach. The
learner the films follow, Aisha Karimi, arrives three times: `S-20417` in the student system,
`u-88213` on the learning platform, and `Aisha.K@Mail.example`, with a space before and after, on
the short-course platform. The
others include Aisha Rahman, who looks like her; Jordan Lee, whose microcredential was revoked
without a flag; Priya Nair, whose withdrawal was recorded a week late; and Linh and Minh Nguyen,
who share an email.

As at census (31 March 2026), 12 learners are within 15 credit points of a graduate certificate:
Engineering and IT 5, Business 3, Health 2, Arts and Education 2. The census report says the
same, and `tests/reconcile_planning_with_census_report.sql` checks it on every build. As things
are now, the answer is 9 (`analyses/diff_as_was_as_is.sql`).

## A new version, and who it touches

`core_credential` has two versions. The wallet's mart pins version 2 with
`ref('core_credential', v=2)`; version 1 is deprecated from 31 March 2027. To see who depends on
the model, through lineage to the exposures:

```sh
dbt ls --select core_credential+ --resource-type exposure --profiles-dir .
```

A consumer still on version 1, such as a model that selects
`credential_key, is_revoked from {{ ref('core_credential', v=1) }}`, gets dbt's warning on every
parse: version 1 is slated for deprecation, and version 2 is available.
