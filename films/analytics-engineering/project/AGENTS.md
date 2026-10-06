# Working here as an AI agent

This project builds the university's credential model with dbt. An agent is welcome to help at
every step: profiling sources, drafting models and tests, reconciling, reviewing metadata. At
every step, a person approves. This page says what an agent may and may not do.

## Read first

- [`docs/process.md`](docs/process.md): the ten steps, what each produces, your part in it, and who approves it.
- [`docs/conventions.md`](docs/conventions.md): layers, names, SQL, keys, time, tests, metadata.
- The conceptual model: [the university's map](models/_shared/_shared__conceptual.md) of domains and key entities, and each core domain and mart's own, in its folder ([`student`](models/core/student/_student__conceptual.yml), [`course`](models/core/course/_course__conceptual.yml), [`planning`](models/marts/planning/_planning__conceptual.yml), [`wallet`](models/marts/wallet/_wallet__conceptual.yml)): what each entity means, its key and its owner, and each consumer's question.
- [`requirements/`](requirements/): the questions, requirements, decisions, gaps and limitations, each in the register of the source, domain or consumer it's about. [`docs/registers.md`](docs/registers.md) indexes them all.
- [`skills/`](skills/): how to do the five jobs agents do most here: draft the conceptual model, profile a source, draft a model, reconcile and diff, review metadata.

## What you may do

- Read every file in the project, and the docs site.
- Run dbt against the **development target only**: `duckdb` here, or your own development schema on Databricks. `parse`, `compile`, `build`, `test`, `show` and `docs generate` are all fine there.
- Read production, if you're given access, **read-only**.
- Profile data with the queries in `analyses/`, or new ones you add there.
- Draft models, tests, YAML and docs on a branch, and open a pull request.

## Your access

On Databricks, you work as your own service principal, never as a person. It can read
production and write only to its own development schema:

```sql
grant use catalog on catalog <production catalog> to `<agent service principal>`;
grant use schema, select on schema <production catalog>.<schema>_core to `<agent service principal>`;
grant use schema, select on schema <production catalog>.<schema>_marts to `<agent service principal>`;
grant all privileges on schema <development catalog>.<agent's schema> to `<agent service principal>`;
```

dbt's access levels (`private`, `protected`, `public`) say which models can `ref()` which; they
don't say who can read a table. Grants do: see `+grants` on the Planning marts in
`dbt_project.yml`.

## What you must not do

- **Write to production**, or to any schema that isn't a development one.
- **Pull bulk personal data.** Work with aggregates and small samples (`dbt show --limit 20`). Never copy names, emails or student IDs out of the project, into a prompt, a log or a pull request, beyond the sample a claim needs.
- **Weaken a test to make it pass.** Don't delete, disable or skip a test, lower its severity, raise its thresholds, or narrow it with a `where`. A failing test is news: report it, with its failing rows, and propose a fix to the data or the code.
- **Change what the business owns.** The seeds (identity decisions, status map, credit recognition, census report) and the conceptual models (`_<domain>__conceptual.yml`) record people's decisions. You may draft a change; the owner in its `meta` approves it.
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
dbt build --profiles-dir .              # green; the one warning is by design (GAP-SC-02 in docs/registers.md)
python scripts/generate/definitions.py --check   # the doc blocks match the conceptual models
python scripts/generate/diagrams.py --check      # the physical diagrams match the YAML
python scripts/generate/registers.py --check     # the registers are valid and indexed
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
