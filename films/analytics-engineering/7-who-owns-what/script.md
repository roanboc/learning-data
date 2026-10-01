# In the weeds of data crafting · Who owns what: script

*The script of Who owns what, from In the weeds of data crafting, a technical series for analytics engineers, as planned: about 5:00 (target 4 to 6 minutes), in eight chapters, in English, 30 September 2026. The narration lives in [`source/src/narration.js`](source/src/narration.js) and the pauses in [`source/src/breath.js`](source/src/breath.js); this page and those files say the same thing, and where they differ, the source wins. The timings are estimates from the word count (645 words, at the pace of the opening film, with the holds) until the voice is recorded; the pacing report replaces them. Takes steps 4 and 10 of Jun's ten: the contracts each owner publishes, and how the project grows as owners multiply.*

## The promise

A practitioner follows every line, and a data architect agrees with it. The meaning of each fact has an owner, and ownership follows meaning: the registrar's office owns learners and awards, the learning team owns microcredentials, badges and its platforms' keys, and Planning and the wallet app own their marts. An owner publishes a core model as a product: an enforced contract, a version, an owner, a domain and documentation. dbt's access says which models can refer to which (private, protected, public); grants say who can read a table. Consumers build on the public core, never on each other's marts. When teams own their own projects, only public models cross, pinned to a version. And whatever is split, the key sets, the hash, the conventions and the glossary stay shared, or domains become silos. Groups first; projects when ownership needs them. **Owners publish. Consumers build on what's published.**

## The story in one paragraph

In 1858, South Australia passed Robert Torrens's Real Property Act. Before it, buying land meant tracing a chain of old deeds, any link of which could be missing; after it, the government's register was the title, anyone could rely on it, and only a registered transfer signed by the owner could change it. A core model works the same way. The credential project is green, built by one team, but its meaning has owners: the registrar's office (Mei) owns learners, awards and the student IDs; the learning team owns microcredentials, badges and its two platforms' keys; Planning and the wallet app own their marts. Each model says its domain in `meta.domain`, and each group names an owner. The learner's core model is what a domain publishes: a grain, an owner, a domain, a glossary term, an enforced contract, a version and docs, built by Noor's group and meaning what Mei says. dbt's access comes in three rings. The wallet team's attempt to build on an intermediate model is refused at parse, with dbt's own message; building on Planning's mart is allowed, since it's protected and in the same project, and it's still wrong, because that mart changes when Planning needs it to. Access isn't reading: on Databricks, grants decide who reads a table, and the agent's service principal reads only the core and the marts. One day Planning may own a project: it declares `credentials` as a dependency and refers to the learner's core model by project and name, pinned to version 1; only public models cross, and this part is a sketch that only dbt Cloud runs. Split or not, the key sets, the hash macro, the conventions and the glossary stay shared: Aisha's student ID hashes to the same 64 characters in every project, and a different hash would give her a second key that nothing joins and no test catches. So Noor decided, on 12 October: groups first, in one project; projects later, when teams own their domains. Many owners, many hands, and one of them isn't a person.

## What each object stands for

| Object | Stands for |
|---|---|
| "1858 · Adelaide"; a chain of deeds unrolling, one link faded | Buying land before the register: every deed back to the grant, and a missing one undoes the rest |
| A register book, open on one title | The register is the title: rely on it without tracing its history |
| A transfer signed by the owner, stamped, and one line of the register changing | Only the owner, through the register, changes it |
| The register book drifting right, becoming a gold-edged core model card | A core model: published by its owner, relied on by everyone |
| Four territories on a map: registrar, learning, planning, wallet | Domains |
| Mei (business outline) in the registrar's; Tom for the learning team (business outline); the Planning and wallet badges, now drawn as small teams | Owners of meaning, and owners of their marts |
| A small flag on each model, reading its `meta.domain` | Each model names its domain |
| A product card: grain, owner, domain, glossary term, contract latch, version tag, docs | What a domain publishes: a data product |
| Three concentric rings: private (inner), protected, public (outer) | dbt's access levels |
| A red bar across an arrow, with dbt's message | A reference refused at parse |
| An arrow from the wallet's mart to Planning's, drawn amber, with a reviewer's hand | Allowed by dbt, stopped only by review |
| Doors on tables in the catalogue, each with a lock and a list of groups | Grants: who can read |
| The teal orb holding a key card, "service principal", fitting two doors only | The agent's access: reads core and marts, writes its own schema |
| A second project box on the right, dashed, labelled `sketch · dbt Cloud only` | Planning's own project, a cross-project sketch |
| A thin bridge from Planning's box to the core, a version tag `v1` on it | A cross-project reference, pinned to a version |
| The ground under both project boxes: key sets, the hash macro, conventions, the glossary | What stays shared |
| Two hashes side by side, one of them breaking a join line | A second key for the same learner |
| Three group outlines inside one project box, with a date "12 Oct 2026" | Groups now, projects later |
| The teal orb at the edge of the frame | The next film: an agent on the team |

## Script

### 1 · The register is the title · 0:00–0:37

**Narration.** In 1858, South Australia passed a law for land, promoted by Robert Torrens. Before it, buying land meant tracing a chain of old deeds, and hoping none was missing. After it, the government's register was the title, and anyone could rely on it. Only a registered transfer, signed by the owner, could change it. A core model works the same way. Its owner publishes it, everyone relies on it, and only its owner changes it.

**Picture.** The warm past, with "1858 · Adelaide" in the corner. A chain of deeds unrolls across a desk, each sealed to the one before; one link, halfway back, is faded (a quill's soft scratch as the chain draws). A buyer's finger runs back along the chain and stops at the gap. Then a register book opens on one page (a register page turning): a parcel drawn in outline, one owner's name; the buyer reads it and nods. A transfer is signed by the owner, stamped, and one line on the page changes. The register closes (a low thud). On the bridge line, the book drifts right, towards the present, and becomes a card with a gold edge: "core model". Wordless breather: the title card over the register, with the series' mark (on a low harmonium): "IN THE WEEDS OF DATA CRAFTING", *Who owns what*, "owners publish; consumers build on what's published".

**On screen.** 1858 · Adelaide · a chain of deeds · one missing · the register is the title · rely on it · only a registered transfer · signed by the owner · a core model · its owner publishes · everyone relies · only its owner changes it · *Who owns what* · owners publish; consumers build on what's published

### 2 · Domains · 0:37–1:21

**Narration.** The credential model builds, and every test is green. One project, built by one team. But its meaning has owners. The registrar's office, where Mei works, owns learners and awards, and the student IDs it issues. The learning team owns microcredentials and badges, and the keys of its two platforms. Each is a domain: it owns the meaning of the facts it records. Planning and the wallet app are domains too. They own what they build for themselves: their marts. In the project, each model names its domain, and each group names an owner. Ownership follows meaning, not the code.

**Picture.** The lineage graph from the film before, all green, in one project box, with Jun beside it. The graph lifts into a map of four territories, each drawn as it's named. Registrar (Mei, business outline): learner, award, the `SIS` key set, blue. Learning (Tom, for the learning team, business outline): microcredential, badge, the `LMS` and `SC` key sets, green and pink. On "domain", a label: "owns the meaning of the facts it records". Planning and the wallet (their badges from the opening film, now drawn as small teams): each territory holds its mart. On "each model names its domain", a small flag rises on each model reading its domain; then the groups card types in:

```yaml
# models/_groups.yml · runs on dbt Core · DuckDB
groups:
  - name: credential_model
    …
    owner:
      name: Noor, data architect
  - name: planning
    …
    owner:
      name: Planning
  - name: wallet
    …
    owner:
      name: Wallet app team
```

and one line from the conventions:

```markdown
<!-- docs/conventions.md · runs on dbt Core · DuckDB -->
- `meta.domain`: registrar, learning, planning or wallet.
```

**On screen.** green · one project · one team · registrar · learners · awards · student IDs · learning · microcredentials · badges · two platforms' keys · a domain · owns the meaning of the facts it records · planning · wallet · their marts · meta.domain · groups · owners · ownership follows meaning

### 3 · What a domain publishes · 1:21–1:57

**Narration.** So what does a domain publish? A core model, as a product. Take the learner. Its YAML states its grain: one row per learner per version. Its owner: Mei, at the registrar's office. Its domain, and the word in the glossary it holds. An enforced contract. A version number, so a change never arrives as a surprise. And its documentation. Noor's group builds it. Mei owns what it means. Everyone else builds on it, not on how it was made.

**Picture.** The registrar's territory zooms in; `core_learner` becomes a product card, and its YAML lights line by line as each part is named:

```yaml
# models/core/_core__models.yml · runs on dbt Core · DuckDB
  - name: core_learner
    description: >
      What the model knows about a learner from valid_from until valid_to.
      {{ doc("learner") }}
    latest_version: 1
    config:
      meta:
        grain: One row per learner per version
        owner: Mei Tanaka, registrar's office
        domain: registrar
        glossary_term: learner
```

Beside it, the product card fills in: grain · owner · domain · glossary term · contract (the latch from the film before, closing: a soft wooden latch) · version tag `v1` (a latch) · docs (`{{ doc("learner") }}` lighting). On "Noor's group builds it", Noor (cyan) stands behind the card with the `credential_model` group outline around the staging and intermediate models behind it; Mei (business outline) beside its meaning; the consumers' arrows land on the card's face, not on the models behind it.

**On screen.** a data product · core_learner · grain · one row per learner per version · owner · Mei Tanaka · domain · registrar · glossary term · learner · contract · enforced · version 1 · docs · Noor's group builds it · Mei owns the meaning · build on the product, not how it's made

### 4 · Private, protected, public · 1:57–2:46

**Narration.** Who can build on what? In dbt, that's access, and it comes in three rings. Private: only models in the same group can refer to it. That's staging and intermediate. Protected: any model in the same project. That's the marts. Public: any project at all. That's the core. The wallet team tries to build on an intermediate model. dbt refuses before anything runs, and says why. Then it builds on Planning's mart. dbt allows it: same project, and the mart is protected. It's still wrong. That mart is shaped for Planning, and changes when Planning needs it to. Consumers build on the core, not on each other's marts.

**Picture.** Three rings draw around the four layers, inner to outer, each labelled as it's named: private (staging and intermediate, 15 models), protected (the marts), public (the core, 4 models, 5 with the old credential version). The folder settings light on the card:

```yaml
# dbt_project.yml · runs on dbt Core · DuckDB
    staging:
      +group: credential_model
      +access: private
    intermediate:
      +group: credential_model
      +access: private
    core:
      +access: public
      …
    marts:
      +access: protected
```

and the conventions' table:

```markdown
<!-- docs/conventions.md · runs on dbt Core · DuckDB -->
| Access | Who can `ref()` it |
|---|---|
| `private` | Models in the same group only. Staging and intermediate are private to `credential_model`. |
| `protected` | Any model in the same project. The marts are protected: in this one project, the wallet's marts could `ref()` Planning's, and only review stops it. |
| `public` | Any model in any project, through a cross-project `ref()` in dbt Cloud. The core is public. |
```

On "tries", an arrow runs from a new wallet model towards `int_learners` inside the private ring; a red bar stops it at the ring (a muted double knock) and dbt's real message types in, trimmed:

```
Parsing Error
  Node model.credentials.mart_wallet__try_private attempted to reference
  node model.credentials.int_learners, which is not allowed because the
  referenced node is private to the 'credential_model' group.
```

On "Planning's mart", a second arrow runs from the wallet's model to `mart_planning__near_award` inside the protected ring: it goes through (a soft knock), drawn amber. On "still wrong", Planning's mart shifts (a column renamed, a grain line changing to "as at census"), and the amber arrow snaps; a reviewer's hand (Noor) redraws it to the core, green.

**On screen.** access · private · same group · staging · intermediate · protected · same project · marts · public · any project · core · refused at parse · private to the 'credential_model' group · allowed · protected · still wrong · shaped for Planning · build on the core, not on each other's marts

### 5 · Who can read · 2:46–3:16

**Narration.** Access decides which models can refer to a model. It doesn't decide who can read its table. On Databricks, grants do that. Planning's marts grant reading to the groups Planning names. The agent works as its own service principal. It reads the core and the marts, and writes only to its own development schema. Referring and reading are two different doors, with two different keys.

**Picture.** The rings stay, drawn as arrows between models; below them, the tables in the catalogue, each with a door. On "grants", the door on Planning's mart shows a small list of readers:

```yaml
# dbt_project.yml · runs on dbt Core · DuckDB
      planning:
        +group: planning
        # Who can read, as opposed to who can ref() (access, above). Databricks only, when the
        # var planning_readers names Unity Catalog groups: --vars '{planning_readers: [planning_analysts]}'.
        +grants: "{{ {'select': var('planning_readers')} if target.type == 'databricks' and var('planning_readers', none) else {} }}"
```

On "the agent", the teal orb holds a key card, "service principal", and opens two doors (core, marts) and its own development room, and no other:

```sql
-- AGENTS.md · Databricks only
grant use catalog on catalog <production catalog> to `<agent service principal>`;
grant use schema, select on schema <production catalog>.<schema>_core to `<agent service principal>`;
grant use schema, select on schema <production catalog>.<schema>_marts to `<agent service principal>`;
grant all privileges on schema <development catalog>.<agent's schema> to `<agent service principal>`;
```

On "two different doors", the arrow (access) and the door (grant) sit side by side; a private staging table's door opens for a reader with a grant, while the arrow to it stays red.

**On screen.** access: who can refer · grants: who can read · Databricks · Planning's readers · the agent · service principal · reads core and marts · writes its own schema · two doors · two keys

### 6 · Across projects · 3:16–3:52

**Narration.** Today, it's all one project. One day, Planning may own a project of its own. Then it names the project it depends on: credentials. And it refers to the core by project and by name, pinned to a version: the learner, version one. Only public models cross. Planning can't reach the wallet's marts, or any step inside. The domains meet on the core. This part is a sketch. References across projects need dbt Cloud, so it doesn't run on DuckDB.

**Picture.** The one project box slides left; a second, dashed box draws on the right: "planning", with the label **`sketch · dbt Cloud only`** where the other cards carry theirs. Its dependency file:

```yaml
# examples/planning/dependencies.yml · sketch · dbt Cloud only
# Cross-project refs, a dbt Cloud feature: the credential project publishes its public models,
# and this project refs them by project name. Both projects must be in the same dbt Cloud account.
projects:
  - name: credentials
```

On "pinned", its model, with the two-argument reference lit and `v=1` glowing (a latch):

```sql
-- examples/planning/models/planning_enrolments_at_census.sql · sketch · dbt Cloud only
-- Learners enrolled in each faculty's awards on the census date, from the credential project's
-- public core. A two-argument ref names the project; v= pins the version this model was built on.
with

learners as (

    select * from {{ ref('credentials', 'core_learner', v=1) }}

),
…
```

A thin bridge runs from the Planning box to the public ring of the credential project, tagged `v1`. On "only public models cross", two more arrows try to leave the Planning box, towards the wallet's marts and an intermediate model: both stop at the box's edge. From the sketch's README:

```markdown
<!-- examples/planning/README.md · sketch · dbt Cloud only -->
- Only `public` models can be refed from another project. The credential project's marts are
  `protected`: this project can't ref them, so Planning builds on the core, never on the
  wallet's marts.
```

**On screen.** one project today · Planning's own project · dependencies.yml · credentials · ref('credentials', 'core_learner', v=1) · pinned to v1 · only public models cross · the domains meet on the core · sketch · dbt Cloud only

### 7 · What stays shared · 3:52–4:31

**Narration.** Split into domains, some things must still be shared. The key sets: one per system, each with its owner. One macro for every hash. Aisha's student ID gives the same sixty-four characters, in every project. Hash it another way, without the macro's upper case, and she gets a second key. Joins find nothing, and no test fails. The conventions and the glossary, too. Macros don't cross projects, so the shared ones would move to a package both install. Without shared keys, domains become silos.

**Picture.** The two project boxes rise; beneath them, the ground they both stand on draws in four slabs, each labelled as it's named: key sets, the hash macro, conventions, glossary. The key sets:

```yaml
# model/conceptual.yml · runs on dbt Core · DuckDB
key_sets:
  - code: SIS
    system: student system
    owner: Registrar's office
  - code: LMS
    system: learning platform
    owner: Learning team
  - code: SC
    system: short-course platform
    owner: Learning team
```

On "one macro", the hash macro, with its two engine lines side by side:

```sql
-- macros/keys.sql · runs on dbt Core · DuckDB
{#- The hash of one or more parts. Each engine has its own sha-256 function; the result is the same. -#}
{% macro hash_key(columns) -%}
    {{ return(adapter.dispatch('hash_key', 'credentials')(columns)) }}
{%- endmacro %}

{% macro duckdb__hash_key(columns) -%}
    sha256({{ credentials.key_string(columns) }})
{%- endmacro %}

{% macro databricks__hash_key(columns) -%}
    sha2({{ credentials.key_string(columns) }}, 256)
{%- endmacro %}
```

Aisha's readable key `SIS|S-20417` goes in, in both boxes; the same hash comes out of each, `0905e6e2…f76a2` (a short muffled run of keys). On "another way", the right-hand box hashes `sis|s-20417` without the macro: `8c73518c…447e`. The join line between her two rows breaks (a muted double knock); the test list beside it stays green. On "a package", a small box labelled "package" slides under both projects, carrying the macros; from the sketch's README:

```markdown
<!-- examples/planning/README.md · sketch · dbt Cloud only -->
The point-in-time filter is written out here because macros don't cross projects. Shared
macros, such as the key and time macros, would move to a package both projects install.
```

On "silos", the ground cracks between the two boxes for a moment, then closes.

**On screen.** what stays shared · key sets · one per system · an owner each · one hash macro · SIS|S-20417 → 0905e6e2…f76a2 · the same in every project · sis|s-20417, hashed another way → 8c73518c…447e · a second key · joins find nothing · no test fails · conventions · glossary · a package both install · without shared keys, silos

### 8 · Groups first · 4:31–5:00

**Narration.** So why not split now? Every project is more to deploy, and more to keep in step. On the twelfth of October, Noor decided: groups first, in one project, while one team builds the core. Projects later, when teams own their domains. Many owners, and many hands. One of them isn't a person.

**Picture.** The dashed Planning box fades back into the one project; inside it, three group outlines (credential_model, planning, wallet), each with its owner's name. The decision types in, with Noor's gold tick (a low stamp):

```markdown
<!-- docs/decisions.md · runs on dbt Core · DuckDB -->
| 12 Oct 2026 | One group owns staging, intermediate and core while one team builds them; Planning
and the wallet each own their marts. Split into projects when teams own their domains. |
Groups control who can `ref()` what within a project. Separate projects add cost that pays
off only with separate teams. | Noor, data architect |
```

The loop of ten steps, small in a corner: stations 4 and 10 lit. On "many hands", the owners stand along the core's edge: Mei, Tom, Planning, the wallet team, Noor, Jun. On "isn't a person", the teal orb drifts in at the edge and waits. Wordless end card: *Who owns what* · "Owners publish. Consumers build on what's published." · In the weeds of data crafting.

**On screen.** why not split now? · more to deploy · more to keep in step · 12 Oct 2026 · groups first · one project · projects later · when teams own their domains · many owners · many hands · one isn't a person · *Who owns what* · Owners publish. Consumers build on what's published.

## Pause and think

Four stops, one question each.

| After | Question | Answer, in short |
|---|---|---|
| 2 · Domains (`domains`) | Who owns the meaning of a microcredential? | The learning team: `model/conceptual.yml` names it the owner of the microcredential kind (and of badges), and of the `LMS` and `SC` key sets. The credential as a whole is Mei's, at the registrar's office, which is why `core_credential`'s `meta.owner` is hers; the learning team decides what a microcredential is, within it. |
| 4 · Private, protected, public (`access`) | The wallet refers to Planning's mart, and dbt allows it. Why is that still wrong? | The mart is Planning's consumer contract, shaped for Planning's question and changed when Planning needs it to. The wallet would silently depend on another consumer's choices. Consumers build on the public core; in one project, only review stops the shortcut. |
| 5 · Who can read (`grants`) | Can a `private` model's table be read? | Yes, if a grant allows it. Access is about which models can `ref()` which, at parse; reading a table is the platform's grants. |
| 7 · What stays shared (`shared`) | What breaks first when domains stop sharing keys? | Joins across domains: the same learner gets two keys, joins find nothing, and counts drift apart, with no test failing in either project. |

## Rigour sheet

| Chapter | What the film says | What an expert would add, or what it simplifies |
|---|---|---|
| 1 | In 1858, South Australia passed a law for land, promoted by Robert Torrens. | The Real Property Act 1858 (SA), assented to 27 January 1858; it came into operation on 1 July 1858 (the State Library's chronology gives 2 July for the first registrations). Robert Richard Torrens promoted it; the German lawyer Ulrich Hübbe is credited with much of its design, drawing on Hanseatic land registers. That Torrens drew on the registration of ships, which he knew as a customs official, is often told and debated: the film leaves it out. Adopted across Australia and in many other countries as "Torrens title". |
| 1 | Before it, buying land meant tracing a chain of old deeds. | Under the old system (general law, or "old system", title) a buyer's title rested on a chain of deeds back to the Crown grant; a defect or missing deed anywhere could defeat it. The picture's faded link stands for that. |
| 1 | After it, the register was the title, and anyone could rely on it. | "Title by registration, not registration of title": the state-guaranteed certificate of title shows every registered dealing, and the registered owner's title is indefeasible, with exceptions (fraud, some prior interests, later statutes). The film keeps the one point. |
| 1 | Only a registered transfer, signed by the owner, could change it. | A dealing takes effect on registration, by an instrument the registered proprietor executes (a memorandum of transfer). Transmissions (death, bankruptcy) and court orders also change the register; the film keeps the ordinary sale. |
| 1 | A core model works the same way. | The series' metaphor. A land register can be changed only through the registrar; a core model only through its owner's approval and its version. |
| 2 | The registrar's office owns learners and awards, and the student IDs; the learning team owns microcredentials, badges and its platforms' keys. | `model/conceptual.yml` 18-27 (key sets and owners), 35, 58, 64-72 (entity and kind owners). The credential itself is owned by Mei; the microcredential and badge kinds by the learning team. All four core models carry `meta.owner: Mei Tanaka` and `meta.domain: registrar` (`_core__models.yml` 11-12, 102-103, 179-180, 287-288); the staging models of the two platforms carry `meta: {owner: Learning team, domain: learning}`. |
| 2 | Each is a domain; Planning and the wallet are domains too, owning their marts. | Source-aligned and consumer-aligned domains, in plain words; the film names no approach. `models/marts/planning/_planning__models.yml` 14 and `models/marts/wallet/_wallet__models.yml` 12 carry their `meta.domain`. |
| 2 | Each model names its domain, and each group names an owner. | `docs/conventions.md` 88 (`meta.domain`); `models/_groups.yml` 1-20: three groups, each with an `owner` (dbt requires a group's owner to have a name or an email). `meta` is free-form: dbt doesn't read `meta.domain`; the docs site and the catalogue show it. |
| 3 | A core model as a product: grain, owner, domain, glossary term, contract, version, docs. | `_core__models.yml` 3-13. `latest_version: 1` with a `versions:` list further down (every core model is versioned from 1: `docs/decisions.md` 19). The contract is set for the folder (`dbt_project.yml` 40-46). Grain has no built-in field; the project keeps it in `meta.grain` and tests it as a key. "Data product" is used in plain words. |
| 3 | Noor's group builds it; Mei owns what it means. | `_groups.yml` 2-8 (group `credential_model`, owner Noor); `meta.owner` on the model. The group owner answers for the code; `meta.owner` names who owns the meaning (`docs/conventions.md` 87). |
| 4 | Three rings: private, protected, public. | dbt model access: `private` models can be referenced only from the same group; `protected` (the default) from the same project, or when installed as a package; `public` from any group, package or project. `dbt_project.yml` 28-53 sets it per folder; `docs/conventions.md` 26-30. In the build of 30 September 2026: 15 private models (7 staging, 8 intermediate, all views), 5 public core model versions (`core_learner`, `core_award`, `core_credit_towards_award`, `core_credential` v1 and v2), 4 protected models (the three marts and the metric time spine). |
| 4 | Refused before anything runs, with dbt's message. | Run 30 September 2026 on a scratch copy (dbt Core 1.12.5, dbt-duckdb 1.11.0), with `models/marts/wallet/mart_wallet__try_private.sql` holding `select * from {{ ref('int_learners') }}`: `dbt parse` gave "Parsing Error · Node model.credentials.mart_wallet__try_private attempted to reference node model.credentials.int_learners, which is not allowed because the referenced node is private to the 'credential_model' group." Not committed. |
| 4 | Building on Planning's mart is allowed. | Same scratch copy, `select * from {{ ref('mart_planning__near_award') }}` in the wallet folder: `dbt parse` succeeded. `docs/conventions.md` 29 says so. dbt Cloud can also flag such references in review; the project relies on review (`docs/process.md` 15). |
| 5 | Access decides which models can refer; grants decide who reads. | `AGENTS.md` 35-37; `docs/conventions.md` 23-24. dbt's `grants` config applies `grant select` (and others) after a model builds; on Databricks it maps to Unity Catalog privileges. |
| 5 | Planning's marts grant reading to the groups Planning names. | `dbt_project.yml` 54-58: the grant applies on Databricks only, and only when the var `planning_readers` names groups; on DuckDB it's empty. The film says "grant reading to the groups Planning names", which is what the var carries. |
| 5 | The agent's service principal reads the core and the marts, and writes only to its own development schema. | `AGENTS.md` 23-33: `use catalog`, `use schema, select` on the core and marts schemas of production, `all privileges` on its development schema. A service principal is Databricks' identity for tools and automation. |
| 6 | Planning names the project it depends on, and refers to the core by project and name, pinned to a version. | `examples/planning/dependencies.yml` 1-4; `examples/planning/models/planning_enrolments_at_census.sql` 1-9 (the two-argument `ref` with `v=1`). Cross-project references ("project dependencies") are a dbt Cloud feature, on the Enterprise plans (checked by web search 30 September 2026; plan names to confirm on the day). The consuming project reads the producing project's published public models from dbt Cloud's metadata; both must be in the same account. |
| 6 | Only public models cross. | `examples/planning/README.md` 12-14. A cross-project `ref` to a `protected` or `private` model is refused. |
| 6 | It doesn't run on DuckDB. | `examples/planning/README.md` 3: "dbt Cloud only. It doesn't run on DuckDB, and CI doesn't build it." Hence its label, `sketch · dbt Cloud only`, an exception to the series' label (the other is the agent's grants, labelled `Databricks only`). |
| 7 | The key sets: one per system, each with its owner. | `model/conceptual.yml` 18-27, generated into `seeds/key_sets.csv` by `scripts/definitions.py` (`docs/conventions.md` 62). |
| 7 | One macro for every hash; Aisha's student ID gives the same 64 characters in every project. | `macros/keys.sql` 47-58 (dispatch to `sha256` on DuckDB, `sha2(…, 256)` on Databricks, the same value) and 72-83 (trim, upper case, `|` joins, a sentinel for a missing part). Run 30 September 2026 against `target/credentials.duckdb`: `sha256('SIS|S-20417')` = `0905e6e2b60bd76bfa5c6d3ed43ac6a4d55cf046c2c0cbce4c590300145f76a2`; `hash_key` of `'sis|s-20417 '` through the macro gives the same. |
| 7 | Hash it another way, without the upper case, and she gets a second key; joins find nothing, no test fails. | `sha256('sis|s-20417')` = `8c73518cf662e82e5a12c6951dc494924bce32098a7b9ef3fc3023b836e2447e` (same run). "No test fails" is the point of the picture: each project's own key tests (unique, not null, relationships within the project) pass on either hash; nothing compares keys across projects. Illustrative, not run as two projects. |
| 7 | Macros don't cross projects; shared ones would move to a package both install. | `examples/planning/README.md` 16-17. A dbt package (`packages.yml`) installs macros into a project; cross-project `ref` shares models, not macros. |
| 8 | Why not split now? More to deploy, more to keep in step. | `docs/decisions.md` 20: "Separate projects add cost that pays off only with separate teams." The film's two examples of that cost are its own. |
| 8 | On 12 October, Noor decided: groups first; projects later. | `docs/decisions.md` 20 (the story's date; the university and its people are fictional). |

**Project files each snippet comes from** (checked against the files on 30 September 2026):

| Ch | File | Lines |
|---|---|---|
| 2 | `models/_groups.yml` | 1-2, 6-7, 10, 12-13, 16, 18-19 (descriptions and emails trimmed with …) |
| 2 | `docs/conventions.md` | 88 |
| 3 | `models/core/_core__models.yml` | 3-13 |
| 4 | `dbt_project.yml` | 28, 31-32, 34, 37-38, 40, 44, 48, 51 (trimmed; materialisations and schemas left out) |
| 4 | `docs/conventions.md` | 26-30 |
| 4 | dbt's message (scratch copy) | the parsing error, wrapped to fit |
| 5 | `dbt_project.yml` | 54-58 |
| 5 | `AGENTS.md` | 29-32 (the grants, from a `sql` block) |
| 6 | `examples/planning/dependencies.yml` | 1-4 |
| 6 | `examples/planning/models/planning_enrolments_at_census.sql` | 1-9 (then …) |
| 6 | `examples/planning/README.md` | 12-14 |
| 7 | `model/conceptual.yml` | 18-27 |
| 7 | `macros/keys.sql` | 47-58 |
| 7 | `examples/planning/README.md` | 16-17 |
| 8 | `docs/decisions.md` | 20 (the table row, wrapped) |

**dbt and Databricks documentation** (the pages behind each claim; on 30 September 2026 docs.getdbt.com couldn't be reached from the build machine, so each claim was checked against the project's own runs and a web search; to confirm on the pages on the day):

- dbt: "Model access" (docs.getdbt.com/docs/mesh/govern/model-access) and the `access` config (docs.getdbt.com/reference/resource-configs/access): the three levels, `protected` the default; "Groups" (docs.getdbt.com/docs/build/groups): an owner with a name or email; "Model versions" (docs.getdbt.com/docs/mesh/govern/model-versions); "Project dependencies" / cross-project `ref` (docs.getdbt.com/docs/mesh/govern/project-dependencies), `dependencies.yml`, and which plan it needs; "About dbt Mesh" and "dbt Mesh FAQs" (docs.getdbt.com/best-practices/how-we-mesh/mesh-5-faqs) for when to split; `grants` (docs.getdbt.com/reference/resource-configs/grants); "Packages" (docs.getdbt.com/docs/build/packages); `meta` (docs.getdbt.com/reference/resource-configs/meta).
- Databricks: "Unity Catalog privileges and securable objects" (docs.databricks.com/aws/en/data-governance/unity-catalog/manage-privileges/privileges): `USE CATALOG`, `USE SCHEMA`, `SELECT`, `ALL PRIVILEGES`; "Service principals" (docs.databricks.com/aws/en/admin/users-groups/service-principals).

**Historical sources.**

- National Archives of Australia and Museum of Australian Democracy, *Documenting a Democracy*: "Real Property or 'Torrens Title' Act 1858 (SA)" (foundingdocs.gov.au/item-sdid-43.html): assent 27 January 1858; the central register and government certificates; Hübbe's contribution.
- State Library of South Australia, "2 July 1858 · Real Property Act" (discoversouthaustraliashistory.org.au/chronology/july/2-july-1858-real-property-act.shtml).
- Government of South Australia, Office of the Registrar-General, "Indefeasibility" (dhud.sa.gov.au/our-department/office-of-the-registrar-general/land-titling/indefeasibility).
- Taylor, "Torrens, Sir Robert Richard (1814–1884)", *Australian Dictionary of Biography*; Esposito, "Ulrich Hübbe's role in the Torrens system of land registration" (2003). For the ships story, treat it as told, not settled.
- Checked in outline 30 September 2026 by a web search; the operative date (1 or 2 July 1858) and the ADB entry to confirm on the day.

## Labs

| # | Lab | Kind | The mechanism people break |
|---|---|---|---|
| 1 | *Public or protected?* | pick | Pick the access for eight models (a staging view, the key matching step, `core_learner`, `core_credential` v2, Planning's mart, the wallet's two marts, the time spine). Then try a reference from the wallet's mart to each: make an intermediate model public, and any project can build on a step that changes without notice; make the core private, and dbt refuses the marts with its real message. |
| 2 | *Draw the domains* | sort | Sort entities, kinds, key sets and marts (learner, award, microcredential, badge, `SIS`, `LMS`, `SC`, Planning's mart, the wallet's marts) into four domains. Put the microcredential in the registrar's, and the learning team loses the say over what it means; put `SC` in Planning's, and nobody owns the short-course keys. |
| 3 | *Ref or read?* | pick | Five requests: Planning's analyst queries a mart table; the wallet's model refs a core model; the agent reads production; a dashboard reads a private staging table; Planning's own project refs the core. For each, pick what decides: access, a grant, or both. Pick access for the dashboard, and see the table read anyway. |
| 4 | *What must be shared?* | steps | Step through two projects building the same learner. Remove the shared hash macro from one, and hash without upper case: Aisha's key changes from `0905e6e2…` to `8c73518c…`, the cross-project join returns nothing, and every test in both projects stays green. Put the package back, and the join returns. |

## Scenarios

Eight situations, in this order.

1. **Spot the problem.** The wallet team copies Planning's mart into its own folder, "because it's already there." (It's Planning's consumer contract, shaped for Planning's question; the wallet should build on the public core, and ask the owner if the core lacks something.)
2. **Choose.** Planning wants to ref `int_learner_keys_matched`, to see how keys were matched. (No: it's private to `credential_model`. Ask Noor's group; if the matching is a fact others need, it belongs in the core, with a contract and a version.)
3. **True or false.** "The staging models are private, so nobody can read their tables." (False: access governs `ref()`. Whoever has a grant on the schema can read them; grants are the place to restrict reading.)
4. **Explain.** The short-course team hashes emails in lower case in its own project; the credential project upper-cases them. What happens? (The same person gets two keys; joins across the projects find nothing; no test in either project fails. The hash macro must be shared, in a package.)
5. **Choose.** Someone proposes splitting the project into five projects on day one: staging, intermediate, core, Planning, wallet. (Groups first: one team builds the core, so separate projects add cost with no one to own them. Split when teams own domains, along domains, not layers.)
6. **Spot the problem.** The learning team edits a microcredential column in `core_credential` in place, without a version. (A public contract changed under its consumers. A breaking change is a new version, with a deprecation date for the old one; the exposures say who to tell.)
7. **Order.** Planning moves into its own project. Put the steps in order: agree the move with Noor; make sure the core models Planning needs are public and versioned; move the shared macros into a package; create Planning's project with `dependencies.yml`; change its refs to `ref('credentials', …, v=…)`; delete Planning's models from the credential project.
8. **Choose.** Planning pins `core_learner` version 1, and version 2 arrives. What happens to Planning's project? (Nothing at once: its pin keeps reading version 1 until the deprecation date. Planning moves when it's ready, and the owner of the core can see from the lineage who still reads version 1.)

## Pause and think

`domains`, `access`, `grants`, `shared` (the questions and answers are in [Pause and think](#pause-and-think) above).

## Decisions taken

| Date | Decision |
|---|---|
| 30 September 2026 | Open in Adelaide in 1858 with the Torrens register: the register is the title, relied on by everyone, changed only by its owner. The ships story is left out as uncertain. |
| 30 September 2026 | The refused reference is dbt's real message, from a scratch copy of the project; the allowed reference to Planning's mart was run too. Said so in the rigour sheet. |
| 30 September 2026 | The cross-project chapter shows `examples/planning/` with the label `sketch · dbt Cloud only`. The agent's grants, from `AGENTS.md`, are Databricks SQL and carry `Databricks only`; every other card carries `runs on dbt Core · DuckDB`. |
| 30 September 2026 | "The learning team owns microcredentials" is kept to what the project says: the kind's meaning and the platforms' keys; the credential and the core models are Mei's. |
| 30 September 2026 | Access, grants and the agent's service principal are one chapter each for referring and reading, so the difference is the lesson. |

## Open

1. **Scratch experiments.** The refused and allowed references were run on a copy of the project; consider adding them as documented commands so viewers can repeat them.
2. **Two hashes.** The second hash (`8c73518c…`) is computed directly, not from a second project; the lab can run it as two small projects.
3. **Voice.** Check "eighteen fifty-eight", "Torrens", "May", "dee bee tee", "duck dee bee" and "eye dees" by ear; key strings, hashes and file names stay on screen only.
4. **The learning team's face.** Drawn as Tom Whitfield, as the series plan proposes; to confirm.
