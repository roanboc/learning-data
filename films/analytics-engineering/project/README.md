# The credential project

The example dbt project that *In the weeds of data crafting* draws from. From *Start from a
question* on, every snippet the films show on screen is code in this folder, and it runs.

It builds the slice of the university's credential model (v3) that answers one question from
Planning: **how many learners are within 15 credit points of a graduate certificate, by faculty,
as at census date?** A second consumer, the learner's wallet app, reads the same facts as they
are now. That makes two consumer contracts on one enterprise contract.

It runs here, and in CI, on DuckDB, with no account. The same code runs on Databricks, with dbt
Cloud or dbt Core. The university, its people and its data are fictional.

## Run it here

With Python 3.11 or later:

```sh
cd films/analytics-engineering/project
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
| `python scripts/definitions.py` | Regenerates `docs/definitions.md` from `model/conceptual.yml` |
| `dbt clean --profiles-dir .` | Deletes `target/`, the database with it, for a clean start |

The census date is a var. `dbt build --vars '{census_date: 2026-08-31}' --profiles-dir .` answers
Planning's question as at another date; the reconciliation test then fails, because the census
report has no number for that date.

Source freshness isn't part of `dbt build`. `dbt source freshness --profiles-dir .` checks it, and
since the sample files don't change, it reports them as stale. CI doesn't run it.

## Run it on Databricks

The sources must be tables first. On DuckDB they're the CSV files in `data/`; on Databricks,
ingestion lands them in three schemas named after the systems: `student_system`,
`learning_platform` and `short_courses`. To load the sample files into your workspace, upload
`data/` to a volume, then create one table per file:

```sql
create schema if not exists student_system;  -- and learning_platform, short_courses

create or replace table student_system.learners as
select * from read_files('/Volumes/<catalog>/<schema>/<volume>/student_system/learners.csv',
                         format => 'csv', header => true);
-- the same for the other six files
```

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

CI here runs on DuckDB and needs no secrets. To also build on Databricks for each pull request,
add a second job to `.github/workflows/credential-project.yml`: install
`requirements-databricks.txt`, set the five `DATABRICKS_*` variables from repository secrets (a
service principal's token, not a person's), set `DATABRICKS_SCHEMA` to a schema for the pull
request (say, `ci_pr_<number>`), run `dbt build --target databricks`, and drop the schema at the
end. With dbt Cloud, a CI job does the same, and builds only the changed models and what depends
on them.

## Layout

```
project/
├── dbt_project.yml           vars (census date, the 15, the limit of four), layers, access, groups
├── profiles.yml              targets: duckdb (default), databricks
├── data/<system>/<table>.csv the three sources, every version kept (DuckDB only)
├── seeds/                    reference data the business owns: status map, identity decisions,
│                             credit recognition, key sets, the census report
├── models/
│   ├── staging/<system>/     one view per source table; sources YAML
│   ├── intermediate/         identity, timelines, the credit rule; unit tests
│   ├── core/                 the enterprise contract: public, versioned, enforced
│   ├── marts/planning/       as at census; the census dashboard exposure
│   ├── marts/wallet/         as it is now; the wallet app exposure
│   ├── semantic/             semantic model, metrics, time spine
│   └── _groups.yml           who owns which models
├── macros/                   keys and hashes, point in time, DuckDB constraints
├── tests/                    custom generic tests, reconciliation, identity
├── analyses/                 the evidence: profiling, fan-out, late changes, reconcile, as-was and as-is
├── model/conceptual.yml      the conceptual model in YAML (not read by dbt)
├── docs/                     conceptual model, decisions, gap register, conventions, doc blocks,
│                             and two generated pages: definitions and the physical diagram
├── scripts/                  diagrams.py and definitions.py, each with --check
├── AGENTS.md                 what an AI agent may and may not do here
└── skills/                   four skills for an agent: profile, draft, reconcile, review metadata
```

## Which film uses which part

| Film | What it shows from here |
|---|---|
| *A model is not a transformation* | The names of the sources and of the staging and intermediate models; `learner_key` tested unique and not null |
| *Start from a question* | The question and the slice in `model/conceptual.yml`; the hand-drawn diagram in `docs/conceptual-model.md`; the decision that a microcredential is a kind of credential |
| *What makes it the same one* | The profiling queries in `analyses/`; key sets and `macros/keys.sql`; the staging models; `int_learner_keys` and `int_learner_keys_matched`; the identity decisions and status map seeds; the unit test on matching |
| *One row of what, and when* | Grain sentences, tested as keys; `analyses/fan_out_without_point_in_time.sql`; the version columns; `int_learner_timeline`; the Planning mart (as it was) beside the wallet marts (as it is); `analyses/profile_late_changes.sql` and `diff_as_was_as_is.sql` |
| *Promises and proofs* | `docs/gaps.md`; the core YAML (enterprise contract) and the marts YAML (consumer contracts, exposures); the tests; unit tests on the credit rule; warn and error levels; source freshness |
| *Built in layers* | The four layers and `docs/conventions.md`; import and logical CTEs; views, tables and the incremental `core_credential`; liquid clustering; the semantic layer |
| *Who owns what* | `models/_groups.yml`; access in `dbt_project.yml`; `meta.owner` and `meta.domain`; the exposures; the key sets, hashing macro and conventions that every domain shares |
| *An agent on the team* | `AGENTS.md`; `skills/`; the evidence in `analyses/`; the reconciliation test; the CI workflow |
| *Written once* | Doc blocks in `docs/`; `model/conceptual.yml` generated into `docs/definitions.md`; `docs/physical.md` generated from the manifest; `persist_docs`; `core_credential` versions 1 and 2, with a deprecation date |

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
| Semantic layer | Parsed and validated | Queried through dbt Cloud's Semantic Layer, on plans that include it |

## Where dbt changed the plan

- **Key constraints on DuckDB.** DuckDB enforces foreign keys, and won't rename or drop a table that another table's foreign key points to, which is how dbt replaces a table on the next build. `macros/duckdb_constraints.sql` keeps `not_null` and `check` on DuckDB and leaves out the keys; tests check keys on both engines.
- **`core_credential` version 1 is a table, not a view.** A view can't hold the contract's constraints, and dbt warns. It's built from version 2, so its logic still lives once.
- **Seeds, and the identity test, are in the `credential_model` group.** A test that refers to a private model must be in that model's group. The singular test sets it in its own `config()`: set in YAML, it was lost on partial parses.
- **The sources' catalog variable is `DBT_SOURCES_CATALOG`.** dbt Cloud accepts only custom environment variables that start with `DBT_`.
- **Intermediate models are views, not ephemeral.** Unit tests can then mock their inputs as plain rows, and an agent can query each step.
- **The CSV files are read as text.** Staging casts every column, so the same SQL works on DuckDB's text columns and Databricks' typed ones.
- **The semantic layer has two simple metrics.** A ratio metric needs a metric on each side, not a measure; two simple metrics answer the question.

## The data

46 learners, fictional, in four faculties, built to hold the cases the films teach. The
learner the films follow, Aisha Karimi, arrives three times: `S-20417` in the student system,
`u-88213` on the learning platform, and ` Aisha.K@Mail.com ` on the short-course platform. The
others include Aisha Rahman, who looks like her; Jordan Lee, whose microcredential was revoked
without a flag; Priya Nair, whose withdrawal was recorded a week late; and Linh and Minh Nguyen,
who share an email.

As at census (31 March 2026), 12 learners are within 15 credit points of a graduate certificate:
Engineering and IT 5, Business 3, Health 2, Arts and Education 2. The census report says the
same, and `tests/reconcile_planning_with_census_report.sql` checks it on every build. As things
are now, the answer is 9 (`analyses/diff_as_was_as_is.sql`).
