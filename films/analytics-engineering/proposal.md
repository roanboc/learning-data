# An analytics engineering series

*Proposal for a technical series on data modelling with dbt, v0.1. The title is still open; the folder is named after the topic so it can stay. Status: proposal, 29 September 2026.*

## Decided

| Date | Decision |
|---|---|
| 29 September 2026 | A series for analytics engineers that continues *From words to data*, one level deeper: how modelling decisions become dbt code. |
| 29 September 2026 | The stack: Databricks, with dbt Cloud. |
| 29 September 2026 | The thread stays the credential, at the same university, with the same sources. |
| 29 September 2026 | A **core** layer between intermediate and marts holds the enterprise contract. |
| 29 September 2026 | Enterprise (core) models are `public`; consumer marts are `protected`. Domains and dbt Mesh get their own film. |
| 29 September 2026 | Known modelling approaches are named once, in the opening film. After that, the series teaches mechanisms (key sets, hashing, grain, timelines) without saying which approach each came from. |
| 29 September 2026 | Ingestion is out of scope: data arrives with every version kept (SCD2) and system keys identified. Ingestion can be its own series. |

## The brief

From the author (29 September 2026): an advanced series for analytics engineers that goes deeper than *From words to data*. Introduce the known modelling approaches, then settle on a middle ground between key-based integration and entity-centric tables, without a full data vault. Teach the basics that every approach shares: grain, keys, and when to abstract or split an entity. Explain why dbt models are transformations and not data models, and how each decision maps to dbt. Show the metadata and context kept in YAML and in Markdown with Mermaid diagrams, so anyone can understand the model. Cover responsible use of AI agents: how they help discover data, test and draft models, and what skills and guidelines they need.

The author's working process, as given:

1. Understand the scope, the business concepts, the conceptual model, and the relationships and keys, in YAML, from enterprise catalogs and glossaries.
2. Understand the source data and how it maps to the canonical model.
3. Define the required output and each consumer's requirements.
4. Assess the gaps between business expectations and source reality, and define the enterprise contract and the consumer contract.
5. Define the tests that cover the contracts and rules.
6. Build the models in dbt's layers, with CTE and coding standards.
7. Validate, and iterate so the artifacts stay up to date.
8. Clean up the Markdown and YAML so each fact lives once.

## Analysis

**What works**

- **The order is right.** Meaning first, then source reality, then contracts and tests, then code. Most dbt teaching starts from the SQL; this starts from what the SQL has to deliver.
- **Enterprise and consumer contracts are kept apart.** Canonical meaning and one consumer's view often differ, and saying so avoids marts that try to serve everyone.
- **Tests come before the build.** The contract defines "done" before any model exists.
- **Each fact lives once.** Duplicated definitions are how documentation drifts.

**What this proposal adds to the process**

- **Start from a question.** Scope is one use case, and the slice of the canonical model it touches. Without a question, the canonical model has no edge.
- **Grain is declared per model, in one sentence, before any SQL.** It becomes the key test.
- **Identity across sources.** A system key isn't a business key, and two systems can key the same thing differently. Key sets and hashing make identity explicit.
- **Time.** Kept versions at ingestion don't settle history. Each output needs "as it is now" or "as it was then", and SCD2 dates usually record when the platform saw a change, not when it was true.
- **Review and ship** becomes its own step: pull request, CI, human approval, deploy. That's where people approve an agent's work.
- **Operate and evolve:** versions, deprecation, and impact through lineage.
- **Where the "why" lives.** Decisions and accepted gaps stay in Markdown after the cleanup; they aren't duplication.

## The process

The spine of the series. The agent's part and the approval are shown at every step.

| # | Step | What it produces | The agent | Who approves |
|---|---|---|---|---|
| 1 | **Scope and meaning.** One question, the decision it supports, the entities it touches. Each entity's business key, identity rule and owner. Generalise or split. | Conceptual model in YAML; Mermaid diagram | Drafts from the catalog and glossary | Business owner |
| 2 | **Source reality.** Profile every source; map system keys to business keys; code-mapping tables; what the SCD2 dates mean. | Source-to-canonical mapping, with evidence queries | Profiles and proposes the mapping, with the query behind each claim | Engineer |
| 3 | **Consumer output.** Grain in one sentence; as-is or as-was history; freshness; metrics defined once. | Output specification | Drafts from the request and existing reports | Consumer |
| 4 | **Gaps and contracts.** A decision per gap: fix at the source, rule in the model, or accept and document. | Gap register; enterprise and consumer contracts | Drafts both | Owner and consumer |
| 5 | **Tests.** Data tests, unit tests and source freshness, with warn and error levels, and a number to reconcile against. | Tests, before any model | Writes them first | Engineer, in review |
| 6 | **Build.** Staging, intermediate, core, marts; materialisations; point-in-time joins; coding standards. | dbt models | Drafts the SQL to pass the tests | Engineer, in review |
| 7 | **Validate.** Reconcile with the trusted number; diff against the previous version; owner sign-off. | Reconciliation and diff | Runs them | Engineer and owner |
| 8 | **Review and ship.** Pull request, CI on changed models, deploy. | A merged, deployed change | Opens the pull request | Reviewer |
| 9 | **Written once.** Markdown keeps the conceptual model, decisions and accepted gaps; YAML keeps everything the build uses. | Clean docs; a generated physical diagram | Finds duplicated and drifted metadata | Engineer |
| 10 | **Operate and evolve.** Versions, deprecation dates, impact through lineage and exposures. | Versioned models | Flags breaking changes | Owners of dependent models |

## How it maps to dbt

**A dbt model is a transformation.** It's a `SELECT` and a configuration. The data model is the grain, keys, relationships, meaning and time, declared in YAML and drawn in Markdown. Most dbt models (staging, intermediate) aren't entities at all; they're steps towards one.

| Layer | What it does | Access | Contract |
|---|---|---|---|
| Staging | One model per source table: rename, cast, add business keys qualified by their key set, and their hashes. No joins. | `private` | None |
| Intermediate | Resolve identity across key sets; stitch one timeline per entity from several versioned sources; apply business rules. | `private` | None |
| **Core** | One model per canonical entity and relationship, at a declared grain. | **`public`**, versioned | **Enterprise contract**: enforced columns and types, constraints, tests |
| Marts | Built for one consumer: entity-centric wide tables, and facts at a declared grain for BI. Metrics in the semantic layer. | **`protected`** | **Consumer contract**: enforced; `exposures` name who depends on it |

`access` decides who can `ref()` a model from other dbt code. It doesn't decide who can read the table: dashboards, Genie and other tools read through Unity Catalog grants. On Databricks, an enforced contract checks names and types at build; `NOT NULL` and `CHECK` constraints are enforced, and primary and foreign keys are informational, so tests do the checking.

**Metadata, written once.**

- **Markdown:** the conceptual model with a hand-drawn Mermaid diagram, decisions and why, accepted gaps as known limitations. Long descriptions in dbt doc blocks (`{% docs %}`), referenced from YAML with `doc()`.
- **YAML:** grain, keys, relationships, contracts, tests, and `meta` (owner, domain, glossary term, personal-data class).
- **Generated:** the physical diagram, from YAML. Descriptions pushed to Unity Catalog with `persist_docs`, so the catalog doesn't hold a second copy.

## The series at a glance

Nine films of 4 to 6 minutes, each built around one step or one idea. The agent appears in every film at its step; the eighth film gathers what it needs.

| # | Working title | Steps | The idea to take away |
|---|---|---|---|
| 1 | A model is not a transformation | All | The data model is what you declare; the dbt model is how you produce it. |
| 2 | Start from a question | 1 | Scope is a question, not the whole enterprise. |
| 3 | What makes it the same one | 2 | Identity is a decision, made explicit with key sets and hashes. |
| 4 | One row of what, and when | 3 | Grain and time, declared before any SQL. |
| 5 | Promises and proofs | 4, 5 | Contracts say what's promised; tests prove it, and come first. |
| 6 | Built in layers | 6 | Each layer has one job, and each CTE one step. |
| 7 | Who owns what | 4, 10 | Domains publish core models; consumers build on them, not on each other's marts. |
| 8 | An agent on the team | 7, 8 | The agent drafts and checks with evidence; people approve; tests are never weakened. |
| 9 | Written once | 9, 10 | Meaning in Markdown, facts in YAML, diagrams generated. |

## The thread: the credential, built

*Keeping it true* ends with version 3 of the credential model approved. This series builds it. The question that scopes it, from planning: *how many learners are within 15 credit points of a graduate certificate, by faculty, as at census date?* It needs credentials from three sources (student system, learning platform, short-course platform), the same learner keyed three ways, credit that counts towards awards, and history, because the answer must be as it was at census. A second consumer, the learner's wallet app, needs the same facts as they are now, which shows two consumer contracts on one enterprise contract.

## The films

### A model is not a transformation

**Logline.** The credential model is approved: a blueprint. Now it has to be built from three messy sources, with a tool that calls every query a model. Which of them is the data model? None of them, and all of the YAML.

| Chapter | What happens | What it teaches |
|---|---|---|
| A plan is not a building | 1870s: a blueprint says exactly what a building will be, and lays no bricks. | A model says what data must be; it doesn't build it. |
| Where we left off | Four offices, four answers, one agreed model; meaning, identity, grain and time; v3 approved. | The recap, complete for anyone who hasn't seen *From words to data*. |
| Many shapes, one model | The known approaches, named once, and the middle way this series takes. | The landscape, named here and only here. |
| Someone has to build it | The model as a blueprint over three messy sources. | The analytics engineer's job. |
| The building work | Notebooks, stored procedures, pipeline tools, dbt: queries in files, ordered by `ref()`, built as tables and views, with tests and docs. | dbt, one tool among several. |
| The name that misleads | dbt calls each query a model. | A dbt model is a transformation. |
| 300 models | A lineage graph. Most nodes are steps; a few are entities. | Only some transformations produce an entity. |
| Where the model lives | Grain, keys, relationships, contract, meaning: in YAML and Markdown. | The data model is declared, then produced. |
| The ten steps | The process, drawn as a loop. | The map for the rest of the series. |

**Labs.** *Which of these are entities?* (sort a lineage graph).

The opening, chapter by chapter, with narration: [1-opening-plan.md](1-opening-plan.md).

### Start from a question

**Logline.** "Model the university" never ends. "How many learners are close to a graduate certificate?" does.

| Chapter | What happens | What it teaches |
|---|---|---|
| The question | Planning's question, and the decision behind it. | Scope is a question and a decision. |
| The slice | From the glossary and catalog, only the entities the question touches. | The canonical model, one slice at a time. |
| Entities and relationships | Learner, credential, award, credit towards an award. | Conceptual model in YAML, with a Mermaid diagram. |
| Keys and owners | What identifies each entity in business terms, and who owns its meaning. | Business keys and ownership, before source keys. |
| Combine or split | Is a microcredential a kind of credential, or its own entity? | Same identity and lifecycle: one entity. Different grain or lifecycle: split. |
| The agent's draft | The agent drafts the YAML from the catalog; Mei corrects one definition. | The owner approves meaning. |

**Labs.** *Scope it* (cut a vague request down to a question). *Combine or split.*

### What makes it the same one

**Logline.** The same learner arrives three times, with three keys. Identity is a decision, and it has to be written down.

| Chapter | What happens | What it teaches |
|---|---|---|
| Three keys | Student ID, platform user ID, short-course email. | System keys aren't business keys. |
| Profile first | Uniqueness, nulls, orphans, value sets, with the query behind each. | Evidence before assumptions. |
| Key sets | Qualify each key by where it comes from: `SIS|20417`, `LMS|u-88`. | Two keys that look alike can mean different things. |
| Mapping | A table that says which keys are the same learner, and who decided. | Identity resolution, owned and tested. |
| Hashing | Normalise, join with a delimiter, handle nulls, hash; keep the readable key beside it. | Deterministic keys, the same in every model and domain. |
| Code mappings | Source status codes mapped to canonical ones. | Reference data, owned by the business. |

**Labs.** *Same learner?* *Break the hash* (trailing spaces, case, nulls).

### One row of what, and when

**Logline.** Two answers to the same question, both correct, one as it is and one as it was.

| Chapter | What happens | What it teaches |
|---|---|---|
| One sentence | "One row per learner per award, as at census date." | Grain, declared before SQL, tested as a key. |
| Fan-out | A join doubles the credit. | What a wrong grain does. |
| Versions kept | Every change in the source, with valid-from and valid-to. | SCD2 at ingestion, and what its dates record. |
| As it is, as it was | The wallet app wants now; planning wants census date. | Each output chooses its history. |
| One timeline | Three versioned sources stitched into one learner timeline. | Point-in-time joins. |
| Late news | A withdrawal recorded a week after it happened. | When it was true versus when it was recorded. |

**Labs.** *Declare the grain.* *As at census.*

### Promises and proofs

**Logline.** The business expects every credential to count. The source can't say which ones were revoked. Write that down before writing SQL.

| Chapter | What happens | What it teaches |
|---|---|---|
| The gap | Expectation against reality, one line per gap. | A gap register, with a decision per gap. |
| The enterprise contract | Core credential and award models: columns, types, keys, allowed values. | Enforced contracts, versioned, public. |
| The consumer contract | Planning's mart and the wallet's mart, on the same core. | Consumer contracts, protected, with exposures. |
| Tests first | Keys, relationships, allowed values, rules. | Data tests. |
| Logic, tested alone | Mock rows for "credit towards an award". | Unit tests. |
| Warn or stop | Two levels, agreed with the owner. | Severity; freshness. |

**Labs.** *Write the contract.* *Which test catches it?*

### Built in layers

**Logline.** The tests are red. Now write the least code that turns them green, in the right place.

| Chapter | What happens | What it teaches |
|---|---|---|
| Staging | One per source table, keys and hashes added, no joins. | Staging's one job. |
| Intermediate | Identity resolved, timelines stitched, rules applied. | Steps, not products. |
| Core | The canonical entities, at their grain, contracts green. | The enterprise contract, delivered. |
| Marts | A wide learner row; a fact of credit towards awards. | Entity-centric tables and facts, for their consumers. |
| One CTE, one step | Import CTEs, logical CTEs, a final select. Naming conventions. | Code a reviewer can follow. |
| Physical choices | View, table or incremental; the merge key; clustering. | Where transformation meets the engine. |
| Metrics once | Credit-to-award in the semantic layer. | Measures defined once, above the marts. |

**Labs.** *Which layer?* *Refactor the CTEs.*

### Who owns what

**Logline.** The registrar owns learners and awards. The learning team owns microcredentials. Planning builds on both. Who can `ref()` what?

| Chapter | What happens | What it teaches |
|---|---|---|
| Domains | Source-aligned domains own entities; consumer-aligned domains own marts. | Ownership follows meaning. |
| Data products | A public core model with a contract, a version, an owner and docs. | What a domain publishes. |
| Access | Private, protected, public. | Who can `ref()`, not who can read. |
| Across projects | Planning's project refs the registrar's core. | Cross-project refs in dbt Cloud. |
| What stays shared | Glossary, key sets, the hashing macro, conventions. | Without shared keys, a mesh becomes silos. |
| When to split | Groups in one project first; projects when teams own domains. | Mesh when ownership needs it, not before. |

**Labs.** *Public or protected?* *Draw the domains.*

### An agent on the team

**Logline.** An agent can profile, draft, test and reconcile in minutes. What does it need to be trusted, and what must it never do?

| Chapter | What happens | What it teaches |
|---|---|---|
| Skills | Conventions, the glossary, the process, checklists, as files in the project. | Agents follow what's written down. |
| Access | Read-only on production, a development schema, samples not bulk personal data. | Least privilege. |
| Evidence | Every claim about the data comes with its query and result. | Trust through evidence. |
| The shortcut | A test fails; the agent's draft lowers its severity. Review stops it. | Never weaken a test to pass it. |
| Validate | Reconcile with the census report; diff against last version. | Checks before sign-off. |
| Review and ship | Pull request, CI on changed models, approval, deploy. | The agent recommends; people approve. |

**Labs.** *Review the agent's pull request.* *Write a guideline.*

### Written once

**Logline.** The definition of "award" is in a Markdown page, a YAML file, the catalog and a dashboard tooltip. Three of them are wrong.

| Chapter | What happens | What it teaches |
|---|---|---|
| Four copies | One definition, drifting in four places. | Duplication is how docs go stale. |
| What goes where | Markdown: meaning, decisions, gaps. YAML: everything the build uses. | One home per fact. |
| Doc blocks | Long text in Markdown, referenced from YAML. | Written once, shown everywhere. |
| Diagrams | Conceptual by hand; physical generated. | Diagrams that can't drift. |
| To the catalog | Descriptions pushed to Unity Catalog. | One direction of sync. |
| Next version | A breaking change: a new version, a deprecation date, exposures notified. | Evolve without breaking consumers. |

**Labs.** *Find the duplicates.* *Plan a new version.*

## What the series covers, and where

| Topic | Film |
|---|---|
| Known approaches, named | 1 |
| Transformations versus data models | 1 |
| Scope, conceptual model in YAML, owners | 2 |
| Generalise or split an entity | 2 |
| System keys, business keys, key sets, identity resolution, hashing | 3 |
| Profiling with evidence; code mappings | 3 |
| Grain, fan-out; SCD2, as-is and as-was, point-in-time joins, late data | 4 |
| Gap register; enterprise and consumer contracts; exposures | 5 |
| Data tests, unit tests, freshness, severity | 5 |
| Layers, CTE and naming standards, materialisations, semantic layer | 6 |
| Domains, access, groups, cross-project refs | 7 |
| Agent skills, access, evidence, guardrails; validation; CI and review | 8 |
| Docs, doc blocks, Mermaid, `persist_docs`; versions and deprecation | 9 |

**Parked:** ingestion and SCD2 capture (its own series); a full data vault; dashboard design; performance tuning beyond materialisation choices.

## Overlap with *From words to data*

*Many ways to read* covers the shapes, *Meaning machines can read* the semantic layer, and *Keeping it true* the rule "the agent recommends, people approve". This series recaps each in a line and goes straight to how it's built.

## Rigour to check when scripting

Confirm against current documentation, and record in each film's rigour sheet with the date checked. dbt Cloud features change names often: keep product names to labels and the rigour sheet.

- **dbt:** model contracts and which constraints Databricks enforces; `access`, groups and model versions with deprecation dates; exposures; unit tests; source freshness; test severity; doc blocks and `persist_docs` on Databricks; cross-project refs in dbt Cloud and which plan they need; the current names of dbt Cloud's catalog, AI assistant and MCP server; the semantic layer on Databricks.
- **Databricks:** Unity Catalog grants versus dbt access; informational primary and foreign keys; how SCD2 ingestion records its dates.
- **Hashing:** the hash functions available, how `dbt_utils.generate_surrogate_key` handles nulls, and collision risk stated honestly.
- **Mermaid:** where it renders (GitHub does; check dbt's docs site).
- **Approaches in film 1:** the landscape as it stands, with sources in the rigour sheet only; no attribution of mechanisms to approaches.

## Decisions for the author

1. **The title.** *Model, then build* · *From meaning to marts* · *Declared, then built*.
2. **The tagline.** "Declare it. Then build it." · "The model is what you promise." · "Tests first, meaning first."
3. **The guide.** Noor, the architect from *From words to data*, or a new analytics engineer.
4. **Nine films or eight.** Merge *Written once* into *An agent on the team*, or *Who owns what* into *Promises and proofs*.
5. **Your agent skills and guidelines.** Share them, so film 8 and its labs show them, not a generic version.
6. **Language.** English with Spanish pages and captions, as for *From words to data*.

## Next checkpoints

1. The author's answers to the decisions above.
2. A script and rigour sheet for the opening film.
3. The example dbt project the films draw from: the credential model, sources, YAML and tests, so every on-screen snippet is real code that runs.
