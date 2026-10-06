# The process

Ten steps, from a question to a model in production and on to its next version. An agent helps
at every step; a person approves every step. Each step leaves something in this project.

While a step is under way, what's still open (a question, a requirement, a gap) is an item in
`requirements/`, deleted once it's done. What lasts goes to its home: a decision in its scope's
log, a known limitation on the model or source, an answered question in the mart's conceptual
model. Items and decisions are tagged with the step they belong to (the third column);
`docs/decisions.md` indexes every decision.

| # | Step | Tag in requirements and decisions | What it produces | Where it is here | The agent's part | Who approves |
|---|---|---|---|---|---|---|
| 1 | **Scope and meaning.** One question, the decision it supports, the entities it touches; each entity's business key, identity rule and owner. | `scope` | The question; the conceptual model | The question in the mart's `_<consumer>__conceptual.yml`; each core domain's `_<domain>__conceptual.yml`; the map in `models/_shared/` | Drafts it from the catalog and glossary (`skills/draft-the-conceptual-model/`) | The business owner: Mei Tanaka, registrar's office |
| 2 | **Source reality.** Profile every source; map system keys to business keys and codes to canonical ones; say what the version dates mean. | `source_reality` | A source-to-canonical mapping, with evidence | `analyses/profiling/profile_*.sql`, `models/staging/<source>/_<source>__docs.md`, `seeds/reference/student/status_map.csv` | Profiles, and proposes the mapping with the query behind each claim (`skills/profile-a-source/`) | Jun Park, analytics engineer |
| 3 | **Consumer output.** The grain in one sentence; as-is or as-was; freshness; metrics defined once. | `consumer_output` | An output specification | `meta.grain` and descriptions in the marts YAML; `models/marts/planning/_planning__semantic.yml` | Drafts it from the request and existing reports | The consumer: Planning, the wallet app team |
| 4 | **Gaps and contracts.** A decision per gap: fix at source, rule in the model, or accept and document. | `gaps_and_contracts` | A decision per gap; known limitations; the enterprise and consumer contracts | Open gaps in `requirements/`; decisions in each scope's log (`docs/decisions.md`); `meta.limitations`; the core and marts YAML | Drafts both | The owner and the consumer |
| 5 | **Tests.** Data tests, unit tests and source freshness, with warn and error levels, and a number to reconcile against. | `tests` | Tests, before any model | The YAML, `tests/`, `seeds/expected/planning/census_report.csv` | Writes them first | Jun Park, in review |
| 6 | **Build.** Staging, intermediate, core, marts; materialisations; point-in-time joins; conventions. | `build` | dbt models | `models/`, `macros/`, `docs/conventions.md` | Drafts the SQL to pass the tests (`skills/draft-a-model/`) | Jun Park, in review |
| 7 | **Validate.** Reconcile with the trusted number; diff against the previous version; owner sign-off. | `validate` | A reconciliation and a diff | `tests/reconciliation/reconcile_planning_with_census_report.sql`, `scripts/tools/diff_against_main.py` | Runs them (`skills/reconcile-and-diff/`) | Jun Park and the owner |
| 8 | **Review and ship.** A pull request, CI on what changed, deploy. | `review_and_ship` | A merged, deployed change | `.github/workflows/credential-project.yml` | Opens the pull request | A reviewer, never the agent |
| 9 | **Written once.** The conceptual models keep meaning; the decision logs keep why; `meta.limitations` keeps what can't change; YAML keeps everything the build uses; `requirements/` keeps only what's open. | `written_once` | Clean docs; generated definitions, diagrams and index | `requirements/`, `scripts/generate/` | Finds duplicated and drifted metadata (`skills/review-metadata/`) | Jun Park |
| 10 | **Operate and evolve.** Versions, deprecation dates, impact through lineage and exposures. | `operate_and_evolve` | Versioned models | `versions:` in the core YAML; `exposures/` | Flags breaking changes | The owners of what depends on it |
