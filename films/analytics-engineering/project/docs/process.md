# The process

Ten steps, from a question to a model in production and on to its next version. An agent helps
at every step; a person approves every step. Each step leaves something in this project.

| # | Step | What it produces | Where it is here | The agent's part | Who approves |
|---|---|---|---|---|---|
| 1 | **Scope and meaning.** One question, the decision it supports, the entities it touches; each entity's business key, identity rule and owner. | The conceptual model | `model/conceptual.yml`, `docs/conceptual-model.md` | Drafts it from the catalog and glossary (`skills/draft-the-conceptual-model/`) | The business owner: Mei Tanaka, registrar's office |
| 2 | **Source reality.** Profile every source; map system keys to business keys and codes to canonical ones; say what the version dates mean. | A source-to-canonical mapping, with evidence | `analyses/profile_*.sql`, `docs/sources.md`, `seeds/status_map.csv` | Profiles, and proposes the mapping with the query behind each claim (`skills/profile-a-source/`) | Jun Park, analytics engineer |
| 3 | **Consumer output.** The grain in one sentence; as-is or as-was; freshness; metrics defined once. | An output specification | `meta.grain` and descriptions in the marts YAML; `models/semantic/` | Drafts it from the request and existing reports | The consumer: Planning, the wallet app team |
| 4 | **Gaps and contracts.** A decision per gap: fix at source, rule in the model, or accept and document. | The gap register; the enterprise and consumer contracts | `docs/gaps.md`; the core and marts YAML | Drafts both | The owner and the consumer |
| 5 | **Tests.** Data tests, unit tests and source freshness, with warn and error levels, and a number to reconcile against. | Tests, before any model | The YAML, `tests/`, `seeds/census_report.csv` | Writes them first | Jun Park, in review |
| 6 | **Build.** Staging, intermediate, core, marts; materialisations; point-in-time joins; conventions. | dbt models | `models/`, `macros/`, `docs/conventions.md` | Drafts the SQL to pass the tests (`skills/draft-a-model/`) | Jun Park, in review |
| 7 | **Validate.** Reconcile with the trusted number; diff against the previous version; owner sign-off. | A reconciliation and a diff | `tests/reconcile_planning_with_census_report.sql`, `scripts/diff_against_main.py` | Runs them (`skills/reconcile-and-diff/`) | Jun Park and the owner |
| 8 | **Review and ship.** A pull request, CI on what changed, deploy. | A merged, deployed change | `.github/workflows/credential-project.yml` | Opens the pull request | A reviewer, never the agent |
| 9 | **Written once.** Markdown keeps meaning, decisions and accepted gaps; YAML keeps everything the build uses. | Clean docs; a generated physical diagram | `docs/`, `scripts/definitions.py`, `scripts/diagrams.py` | Finds duplicated and drifted metadata (`skills/review-metadata/`) | Jun Park |
| 10 | **Operate and evolve.** Versions, deprecation dates, impact through lineage and exposures. | Versioned models | `versions:` in the core YAML; the exposures | Flags breaking changes | The owners of what depends on it |
