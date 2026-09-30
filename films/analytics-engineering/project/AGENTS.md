# Working here as an AI agent

This project builds the university's credential model with dbt. An agent is welcome to help at
every step: profiling sources, drafting models and tests, reconciling, reviewing metadata. At
every step, a person approves. This page says what an agent may and may not do.

## Read first

- [`docs/conventions.md`](docs/conventions.md): layers, names, SQL, keys, time, tests, metadata.
- [`model/conceptual.yml`](model/conceptual.yml): what each entity means, its key and its owner.
- [`docs/gaps.md`](docs/gaps.md) and [`docs/decisions.md`](docs/decisions.md): what's been decided, and why.
- [`skills/`](skills/): how to do the four jobs agents do most here.

## What you may do

- Read every file in the project, and the docs site.
- Run dbt against the **development target only**: `duckdb` here, or your own development schema on Databricks. `parse`, `compile`, `build`, `test`, `show` and `docs generate` are all fine there.
- Read production, if you're given access, **read-only**.
- Profile data with the queries in `analyses/`, or new ones you add there.
- Draft models, tests, YAML and docs on a branch, and open a pull request.

## What you must not do

- **Write to production**, or to any schema that isn't a development one.
- **Pull bulk personal data.** Work with aggregates and small samples (`dbt show --limit 20`). Never copy names, emails or student IDs out of the project, into a prompt, a log or a pull request, beyond the sample a claim needs.
- **Weaken a test to make it pass.** Don't delete, disable or skip a test, lower its severity, raise its thresholds, or narrow it with a `where`. A failing test is news: report it, with its failing rows, and propose a fix to the data or the code.
- **Change what the business owns.** The seeds (identity decisions, status map, credit recognition, census report) and `model/conceptual.yml` record people's decisions. You may draft a change; the owner in its `meta` approves it.
- **Break a public contract.** A change to a core model's columns or types is a new version, with a deprecation date for the old one.
- **Merge your own pull request**, or approve one.

## Evidence

Every claim about the data comes with the query that shows it and the result it gave. Name the
file in `analyses/`, or paste the query, then the result:

> 4 of 42 current learning platform accounts have no student ID.
> `dbt show --select profile_null_keys --profiles-dir .` → `learning_platform.users | student_id | 42 | 4`

A claim without its query is a guess, and reviewers treat it as one.

## Before you open a pull request

```sh
dbt build --profiles-dir .              # green; the one warning is by design (docs/gaps.md, gap 5)
python scripts/definitions.py --check   # the doc blocks match model/conceptual.yml
python scripts/diagrams.py --check      # the physical diagram matches the YAML
```

Say in the pull request what you changed, why, what you checked, and the evidence.

## Who approves what

| Change | Approves |
|---|---|
| Meaning: a definition, a key, an identity rule, a business rule | Mei Tanaka, registrar's office, for learners, awards and credentials; the learning team for microcredentials |
| The model: grain, entities, relationships, versions | Noor, data architect |
| The code: models, tests, macros | Jun Park, analytics engineer, in review |
| A consumer contract | Its consumer: Planning, or the wallet app team |

The agent recommends; people approve.
