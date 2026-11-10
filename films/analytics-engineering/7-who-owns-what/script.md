# In the weeds of data crafting · Who owns what: script

*The script of Who owns what, from In the weeds of data crafting, a technical series for analytics engineers, as planned: about 5:00 (target 4 to 6 minutes), in eight chapters, in English, 30 September 2026. The narration lives in [`source/src/narration.js`](source/src/narration.js) and the pauses in [`source/src/breath.js`](source/src/breath.js); this page and those files say the same thing, and where they differ, the source wins. The timings are estimates from the word count (644 words, at the pace of the opening film, with the holds) until the voice is recorded; the pacing report replaces them. Takes steps 4 and 10 of Jun's ten: the contracts each owner publishes, and how the project grows as owners multiply.*

## The promise

A practitioner follows every line, and a data architect agrees with it. The meaning of each fact has an owner, and ownership follows meaning. There are three kinds of domain: the systems and the teams that run them (application domains: the registrar's office and its student system, the learning team and its two platforms), what the facts mean (data domains, named as the reference model names them: student and course), and those who decide with the data (business domains: Planning and the wallet app, who own their marts). The project's folders follow the same lines. An owner publishes a core model as a product: an enforced contract, a version, an owner, a domain and documentation. dbt's access says which models can refer to which (private, protected, public); grants say who can read a table. Consumers build on the public core, never on each other's marts. When teams own their own projects, only public models cross, pinned to a version. And whatever is split, the key sets, the hash, the conventions and the glossary stay shared, or domains become silos. Groups first; projects when ownership needs them, and then a domain moves out with its own folders. **Owners publish. Consumers build on what's published.**

## The story in one paragraph

In 1858, South Australia passed Robert Torrens's Real Property Act. Before it, buying land meant tracing a chain of old deeds, any link of which could be missing; after it, the government's register was the title, anyone could rely on it, and only a registered transfer signed by the owner could change it. The credential's core models work the same way. The credential project is green, built by one team, but its meaning has owners: the registrar's office (Mei) owns learners, awards, credentials and the student IDs; the learning team owns microcredentials, badges and its two platforms' keys. So there are three kinds of domain: the systems and the teams that run them are application domains; what the facts mean are data domains, `student` and `course`, named after the reference model, TCSI; Planning and the wallet app, who decide with the data and own their marts, are business domains. The project is laid out the same way: sources by system, the core by data domain, the marts and exposures by consumer. Each group names an owner, and the staging, core and mart models say their domain in `meta.domain`. The learner's core model is what a domain publishes: a grain, an owner, a domain, a glossary term, an enforced contract, a version and docs, built by Noor's group and meaning what Mei says. dbt's access comes in three rings: public and protected came with the contracts, and private is new. The wallet team's attempt to build on an intermediate model is refused at parse, with dbt's own message; building on Planning's mart is allowed, since it's protected and in the same project, and it's still wrong, because that mart changes when Planning needs it to. Access isn't reading: on Databricks, grants decide who reads a table, and a dashboard with a grant can read even a private staging table. One day Planning may own a project: it declares `credentials` as a dependency and refers to the learner's core model by project and name, pinned to version 1; only public models cross, and this part is a sketch that only dbt Cloud runs. Split or not, the key sets, the hash macro, the conventions and the glossary stay shared: Aisha's student ID hashes to the same 64 characters in every project, and hashing it in lower case would give her a second key that nothing joins and no test catches. So Noor decided, on 12 October: groups first, in one project; projects later, when teams own their domains. When that day comes, a domain moves out with its own folders: its marts, exposures, seeds and decisions. Many owners, many hands, and one of them isn't a person.

## What each object stands for

| Object | Stands for |
|---|---|
| "1858 · Adelaide"; a chain of deeds unrolling, one link faded | Buying land before the register: every deed back to the grant, and a missing one undoes the rest |
| A register book, open on one title | The register is the title: rely on it without tracing its history |
| A transfer signed by the owner, stamped, and one line of the register changing | Only the owner, through the register, changes it |
| The register book drifting right, becoming a gold-edged core model card | A core model: published by its owner, relied on by everyone |
| Six territories on a map, in three columns: the student system and the learning platforms; student and course; Planning and the wallet app | The three kinds of domain: application, data and business |
| Mei (business outline) in the student system's territory; Tom for the learning team (business outline) in the learning platforms'; the Planning and wallet badges, now drawn as small teams; in the data domains, their owners in words ("meaning: Mei") | The teams that run the systems, the owners of meaning, and the owners of their marts |
| A small flag on the staging, core and mart models, reading their `meta.domain` | The models name their domain |
| A card of the project's folders, each line tagged application, data or business | The project, laid out by domain |
| A product card: grain, owner, domain, glossary term, contract latch, version tag, docs | What a domain publishes: a data product |
| Three concentric rings: private (inner), protected, public (outer) | dbt's access levels |
| A red bar across an arrow, with dbt's message | A reference refused at parse |
| An arrow from the wallet's mart to Planning's, drawn amber, with a reviewer's hand | Allowed by dbt, stopped only by review |
| Doors on tables in the catalogue, each with a lock and a list of groups | Grants: who can read |
| A dashboard reading through the door of a private staging table, while the arrow to it stays red | Access doesn't stop reading; a grant does |
| A second project box on the right, dashed, labelled `sketch · dbt Cloud only` | Planning's own project, a cross-project sketch |
| A thin bridge from Planning's box to the core, a version tag `v1` on it | A cross-project reference, pinned to a version |
| The ground under both project boxes: key sets, the hash macro, conventions, the glossary | What stays shared |
| Two hashes side by side, one of them breaking a join line | A second key for the same learner |
| Three group outlines inside one project box, beside the decision `DEC-PRJ-03` | Groups now, projects later |
| Planning's folders gathered under the decision: its marts, exposures, seeds and decision log | A domain that moves out with its own folders |
| The teal orb at the edge of the frame | The next film: an agent on the team |

## Script

### 1 · The register is the title · 0:00–0:39

**Narration.** Before 1858, buying land in South Australia meant tracing a chain of old deeds, and hoping none was missing. That year, a law promoted by Robert Torrens made the government's register the title. Anyone could rely on it, without checking its history. Only a registered transfer, signed by the owner, could change it. The credential's core models work the same way. Their owner publishes them, everyone relies on them, and only their owner changes them.

**Picture.** The warm past, with "1858 · Adelaide" in the corner. A chain of deeds unrolls across a desk, each sealed to the one before; one link, halfway back, is faded (soft paper as each deed unrolls). A buyer's finger runs back along the chain and stops at the gap. Then a register book opens on one page (a register page turning): a parcel drawn in outline, one owner's name; the buyer reads it and nods. A transfer is signed by the owner, stamped, and one line on the page changes. The register closes (a low thud). On the bridge line, the book drifts right, towards the present, and becomes a card with a gold edge: "core_learner", the credential's first core model, with the others stacked behind it. Wordless breather: the title card over the register, with the series' mark (on a low harmonium): "IN THE WEEDS OF DATA CRAFTING", *Who owns what*, "owners publish; consumers build on what's published".

**On screen.** 1858 · Adelaide · a chain of deeds · one missing · the register is the title · rely on it · only a registered transfer · signed by the owner · the credential's core models · their owner publishes · everyone relies · only their owner changes them · *Who owns what* · owners publish; consumers build on what's published

### 2 · Domains · 0:39–1:54

**Narration.** Everything is green, in one project. But its meaning has owners. The registrar's office, where Mei works, owns learners, awards and credentials, and the student IDs it issues. The learning team owns two kinds of credential, microcredentials and badges, and the keys of its two platforms. So there are three kinds of domain. The systems, and the teams that run them, are application domains. What the facts mean, learners, credentials and awards, are data domains, named as the reference model names them: student and course. And Planning and the wallet app are business domains: they decide with the data, and own the marts they build for it. The project is laid out the same way: sources by system, the core by data domain, the marts and exposures by consumer. Each group names an owner, and the staging, core and mart models name their domain. Ownership follows meaning, not the code.

**Picture.** The lineage graph from the film before, all green, in one project box, with Jun beside it: "everything green · one project". On "registrar's", the graph lifts away into a map of six territories in three columns, each drawn as it's named. The student system (blue), with Mei (business outline), "the registrar's office · Mei": the `SIS · student IDs` key set. The learning platforms (green), with Tom (business outline), "the learning team · Tom": the `LMS` and `SC` key sets, green and pink. In the middle column, student ("meaning: Mei · kinds: the learning team"): learners, credentials, microcredentials · badges; and course ("meaning: Mei, registrar's office"): awards. On "three kinds", a label above the map, "three kinds of domain", and each column gets its head as its kind is named, with its folders on the right: "application domains" `sources/<system>/`, "data domains" `models/core/<domain>/`. Planning and the wallet app (their badges from the opening film, now drawn as small teams) arrive in the right-hand column, each holding its mart, under "business domains" `marts/ · exposures/`. On "laid out", the map shrinks to the left, and the project's folders type in beside it, each line lighting as its kind is named:

```
# the project's folders · runs on dbt Core · DuckDB
sources/student_system/          # application
sources/learning_platform/       # application
sources/short_courses/           # application
models/core/student/             # data
models/core/course/              # data
models/marts/planning/  exposures/planning/  # business
models/marts/wallet/    exposures/wallet/    # business
```

On "group", the groups card types in below it, each owner lighting on "names an owner":

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

On "name their domain", a small flag rises on each staging, core and mart model on the small map, reading its `meta.domain`: `registrar`, `learning`, `student`, `course`, `planning`, `wallet` (the intermediate steps carry none: they belong to the group that builds them). On "Ownership follows", a label above the map: "ownership follows meaning, not the code".

**On screen.** everything green · one project · student system · the registrar's office · Mei · SIS · student IDs · learning platforms · the learning team · Tom · LMS · SC · student · learners · credentials · microcredentials · badges · course · awards · three kinds of domain · application domains · sources/<system>/ · data domains · models/core/<domain>/ · Planning · wallet app · their marts · business domains · marts/ · exposures/ · the project's folders · groups · owners · meta.domain · intermediate: no domain · ownership follows meaning, not the code

**In the repo.** [`sources/student_system/`](https://github.com/roanboc/learning-data/tree/main/films/analytics-engineering/project/sources/student_system) · [`sources/learning_platform/`](https://github.com/roanboc/learning-data/tree/main/films/analytics-engineering/project/sources/learning_platform) · [`sources/short_courses/`](https://github.com/roanboc/learning-data/tree/main/films/analytics-engineering/project/sources/short_courses) · [`models/core/student/`](https://github.com/roanboc/learning-data/tree/main/films/analytics-engineering/project/models/core/student) · [`models/core/course/`](https://github.com/roanboc/learning-data/tree/main/films/analytics-engineering/project/models/core/course) · [`models/marts/planning/`](https://github.com/roanboc/learning-data/tree/main/films/analytics-engineering/project/models/marts/planning) · [`exposures/planning/`](https://github.com/roanboc/learning-data/tree/main/films/analytics-engineering/project/exposures/planning) · [`models/marts/wallet/`](https://github.com/roanboc/learning-data/tree/main/films/analytics-engineering/project/models/marts/wallet) · [`exposures/wallet/`](https://github.com/roanboc/learning-data/tree/main/films/analytics-engineering/project/exposures/wallet) · [`models/_groups.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/_groups.yml)

### 3 · What a domain publishes · 1:54–2:28

**Narration.** So what does a domain publish? A core model, as a product. Take the learner. Its YAML states its grain: one row per learner per version. Its owner: Mei, at the registrar's office. Its domain. And its glossary term: learner. An enforced contract. A version number, so a change never arrives as a surprise. And its documentation. Noor's group builds it. Mei owns what it means. Everyone else builds on it, not on how it was made.

**Picture.** The student domain's territory zooms in; `core_learner` becomes a product card, and its YAML lights line by line as each part is named:

```yaml
# models/core/student/_core_student__models.yml · runs on dbt Core · DuckDB
  - name: core_learner
    description: >
      What the model knows about a learner from valid_from until valid_to.
      {{ doc("learner") }}
    latest_version: 1
    config:
      meta:
        grain: One row per learner per version
        owner: Mei Tanaka, registrar's office
        domain: student
        glossary_term: learner
```

Beside it, the product card fills in: grain · owner · domain · glossary term · contract (the latch from the film before, closing: a soft wooden latch) · version tag `v1` (a latch) · docs (`{{ doc("learner") }}` lighting). On "Noor's group builds it", Noor (cyan) stands behind the card with the `credential_model` group outline around the staging and intermediate models behind it; Mei (business outline) beside its meaning; the consumers' arrows land on the card's face, not on the models behind it.

**On screen.** a data product · core_learner · grain · one row per learner per version · owner · Mei Tanaka · domain · student · glossary term · learner · contract · enforced · version 1 · docs · Noor's group builds it · Mei owns the meaning · build on the product, not how it's made

**In the repo.** [`models/core/student/_core_student__models.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/core/student/_core_student__models.yml)

### 4 · Private, protected, public · 2:28–3:20

**Narration.** Who can build on what? In dbt, that's access, and it comes in three rings. Two came with the contracts. Public, for the core: any project can build on it. Protected, for the marts: only this project. The third is private: only models in the same group. That's staging and intermediate. The wallet team tries to build on an intermediate model. dbt refuses before anything runs, and says why. Then it builds on Planning's mart. dbt allows it: same project, and the mart is protected. It's still wrong. That mart is shaped for Planning, and changes when Planning needs it to. Consumers build on the core, not on each other's marts.

**Picture.** Three rings draw around the four layers, each labelled as it's named, outer to inner: public (the core, 4 models, 5 with the old credential version) and protected (the marts) light first, with a small tag "from the contracts"; then the inner ring, private (staging and intermediate, 15 models), draws new. The folder settings light on the card:

```yaml
# dbt_project.yml · runs on dbt Core · DuckDB
    staging:
      +group: credential_model
      +access: private
    intermediate:
      +group: credential_model
      +access: private
    core:
      +group: credential_model
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
| `private` | Models in the same group only. … |
| `protected` | Any model in the same project. … |
| `public` | Any model in any project, … The core is public. |
```

On "tries", an arrow runs from a new wallet model towards `int_learners` inside the private ring; a red bar stops it at the ring (a muted double knock) and dbt's real message types in, trimmed:

```
# dbt parse · runs on dbt Core · DuckDB
Parsing Error
  Node model.credentials.mart_wallet__try_private
  attempted to reference node
  model.credentials.int_learners, which is not
  allowed because the referenced node is private
  to the 'credential_model' group.
```

On "Planning's mart", a second arrow runs from the wallet's model to `mart_planning__near_award` inside the protected ring: it goes through (a soft knock), drawn amber. On "still wrong", Planning's mart shifts (a column renamed, a grain line changing to "as at census"), and the amber arrow snaps; a reviewer's hand (Noor) redraws it to the core, green.

**On screen.** access · public · any project · core · protected · this project only · marts · private · same group · staging · intermediate · refused at parse · private to the 'credential_model' group · allowed · protected · still wrong · shaped for Planning · build on the core, not on each other's marts

**In the repo.** [`dbt_project.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/dbt_project.yml) · [`docs/conventions.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/docs/conventions.md)

### 5 · Who can read · 3:20–3:48

**Narration.** Access decides which models can refer to a model. It doesn't decide who can read its table. On Databricks, grants do that. Planning's marts grant reading to the groups Planning names. A dashboard can read a private staging table, if a grant lets it. Access doesn't stop it. Referring and reading are two different doors, opened by two different rules.

**Picture.** The rings stay, drawn as arrows between models; below them, the tables in the catalogue, each with a door. On "grants", the door on Planning's mart shows a small list of readers:

```yaml
# dbt_project.yml · runs on dbt Core · DuckDB
      planning:
        +group: planning
        …
        +grants: "{{ {'select': var('planning_readers')}
          if target.type == 'databricks'
          and var('planning_readers', none)
          else {} }}"
```

(The `+grants` line is one line in the file, wrapped on the card at its `if`, `and` and `else` so it reads at the film's width; the two comment lines above it are cut.)

On "a dashboard", a dashboard (Planning's, drawn as a small chart frame) reaches for `stg_student_system__learners` inside the private ring: the access arrow to it from a model stays red, but the table's door opens for the dashboard, which holds a grant (a soft click). On "two different doors", the arrow (access) and the door (grant) sit side by side, each labelled with its rule.

**On screen.** access: who can refer · grants: who can read · Databricks · Planning's readers · a dashboard · a private staging table · read with a grant · access doesn't stop it · two doors · two rules

**In the repo.** [`dbt_project.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/dbt_project.yml)

### 6 · Across projects · 3:48–4:26

**Narration.** Today, it's all one project. One day, Planning may own a project of its own. Then it names the project it depends on: credentials. And it refers to the core by project and by name, pinned to a version: the learner, version one. Only public models cross. Planning can't reach the wallet's marts, or any step inside. The domains meet on the core. This part is a sketch. References across projects need dbt Cloud, so it doesn't run on DuckDB.

**Picture.** The one project box slides left; a second, dashed box draws on the right: "planning", with the label **`sketch · dbt Cloud only`** where the other cards carry theirs. Its dependency file:

```yaml
# examples/planning/dependencies.yml · sketch · dbt Cloud only
…
projects:
  - name: credentials
```

On "pinned", its model, with the two-argument reference lit and `v=1` glowing (a latch):

```sql
-- examples/planning/models/planning_enrolments_at_census.sql · sketch · dbt Cloud only
…
with

learners as (

    select * from {{ ref('credentials', 'core_learner', v=1) }}

),
…
```

A thin bridge runs from the Planning box to the public ring of the credential project, tagged `v1`. On "only public models cross", two more arrows try to leave the Planning box, towards the wallet's marts and an intermediate model: both stop at the box's edge. From the sketch's README:

```markdown
<!-- examples/planning/README.md · sketch · dbt Cloud only -->
- Only `public` models can be refed from another project.
  The credential project's marts are `protected`: this
  project can't ref them, so Planning builds on the core,
  never on the wallet's marts.
```

**On screen.** one project today · Planning's own project · dependencies.yml · credentials · ref('credentials', 'core_learner', v=1) · pinned to v1 · only public models cross · the domains meet on the core · sketch · dbt Cloud only

**In the repo.** [`examples/planning/dependencies.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/examples/planning/dependencies.yml) · [`examples/planning/models/planning_enrolments_at_census.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/examples/planning/models/planning_enrolments_at_census.sql) · [`examples/planning/README.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/examples/planning/README.md)

### 7 · What stays shared · 4:26–5:05

**Narration.** Split into domains, some things must still be shared. The key sets: one per system, each with its owner. One macro for every hash. Aisha's student ID gives the same sixty-four characters, in every project. Hash it another way, in lower case, and she gets a second key. Joins find nothing, and no test fails. The conventions and the glossary, too. Macros don't cross projects, so the shared ones would move to a package both install. Without shared keys, domains become silos.

**Picture.** The two project boxes rise; beneath them, the ground they both stand on draws in four slabs, each labelled as it's named: key sets ("on each source, an owner each"), the hash macro ("one for every hash"), conventions (`docs/conventions.md`), glossary (`_<domain>__conceptual.yml`). The key sets, as each source declares its own:

```yaml
# sources/*/_*__sources.yml · runs on dbt Core · DuckDB
# meta.key_set, on each source
code: SIS
system: student system
owner: Registrar's office
code: LMS
system: learning platform
owner: Learning team
code: SC
system: short-course platform
owner: Learning team
```

On "one macro", the hash macro, with its two engine lines side by side:

```sql
-- macros/shared/keys.sql · runs on dbt Core · DuckDB
{#- The hash of one or more parts. … -#}
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

Aisha's readable key `SIS|S-20417` goes in, in both boxes; the same hash comes out of each, `0905e6e2…f76a2` (a short muffled run of keys). On "another way", the right-hand box lower-cases the key and hashes `sis|s-20417`: `8c73518c…447e`. The join line between her two rows breaks (a muted double knock); the test list beside it stays green. On "a package", a small box labelled "package" slides under both projects, carrying the macros; from the sketch's README:

```markdown
<!-- examples/planning/README.md · sketch · dbt Cloud only -->
The point-in-time filter is written out here because macros
don't cross projects. Shared macros, such as the key and time
macros, would move to a package both projects install.
```

On "silos", the ground cracks between the two boxes for a moment, then closes.

**On screen.** what stays shared · key sets · on each source, an owner each · one hash macro · one for every hash · SIS|S-20417 → 0905e6e2…f76a2 · the same in every project · sis|s-20417, in lower case → 8c73518c…447e · a second key · joins find nothing · no test fails · conventions · docs/conventions.md · glossary · _<domain>__conceptual.yml · a package both install · without shared keys, silos

**In the repo.** [`sources/student_system/_student_system__sources.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/sources/student_system/_student_system__sources.yml) · [`sources/learning_platform/_learning_platform__sources.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/sources/learning_platform/_learning_platform__sources.yml) · [`sources/short_courses/_short_courses__sources.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/sources/short_courses/_short_courses__sources.yml) · [`macros/shared/keys.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/macros/shared/keys.sql) · [`examples/planning/README.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/examples/planning/README.md)

### 8 · Groups first · 5:05–5:44

**Narration.** So why not split now? Every project is more to deploy, and more to keep in step. On the twelfth of October, Noor decided: groups first, in one project, while one team builds the core. Projects later, when teams own their domains. When that day comes, a domain moves out with its own folders: its marts, its exposures, its seeds and its decisions. Nothing else needs untangling. Many owners, and many hands. One of them isn't a person.

**Picture.** The dashed Planning box fades back into the one project; inside it, three group outlines (credential_model, planning, wallet), each with its owner's name. The decision types in, with Noor's gold tick (a low stamp):

```yaml
# models/_shared/_shared__decisions.yml · runs on dbt Core · DuckDB
  - id: DEC-PRJ-03
    title: One project, groups per owner, until teams own their domains
    text: One group owns staging, intermediate and core while one team …
    why: Groups control who can ref() what within a project. …
    decided_by: Noor, data architect
    decided_on: 2026-10-12
```

The loop of ten steps, small in a corner: stations 4 and 10 lit. On "moves out", Planning's folders gather beside the decision, under "planning, as its own project:": `models/marts/planning/`, `exposures/planning/`, `seeds/expected/planning/`, `_planning__decisions.yml`. On "many hands", the owners stand along the core's edge: Mei, Tom, Planning, the wallet team, Noor, Jun. On "isn't a person", the teal orb drifts in at the edge and waits. Wordless end card: *Who owns what* · "Owners publish. Consumers build on what's published." · In the weeds of data crafting.

**On screen.** why not split now? · more to deploy · more to keep in step · DEC-PRJ-03 · 2026-10-12 · groups first · one project · projects later · when teams own their domains · planning, as its own project: · models/marts/planning/ · exposures/planning/ · seeds/expected/planning/ · _planning__decisions.yml · many owners · many hands · one isn't a person · *Who owns what* · Owners publish. Consumers build on what's published. · Promise and Keep · steps 4 and 10

**In the repo.** [`models/_shared/_shared__decisions.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/_shared/_shared__decisions.yml) · [`models/marts/planning/`](https://github.com/roanboc/learning-data/tree/main/films/analytics-engineering/project/models/marts/planning) · [`exposures/planning/`](https://github.com/roanboc/learning-data/tree/main/films/analytics-engineering/project/exposures/planning) · [`seeds/expected/planning/`](https://github.com/roanboc/learning-data/tree/main/films/analytics-engineering/project/seeds/expected/planning) · [`models/marts/planning/_planning__decisions.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/marts/planning/_planning__decisions.yml)

## Pause and think

Four stops, one question each.

| After | Question | Answer, in short |
|---|---|---|
| 2 · Domains (`domains`) | Who owns the meaning of a microcredential? | The learning team: the student domain's conceptual model (`models/core/student/_student__conceptual.yml`) names it the owner of the microcredential kind (and of badges); the `LMS` and `SC` key sets are its too, on its sources. The credential as a whole is Mei's, at the registrar's office, which is why `core_credential`'s `meta.owner` is hers; the learning team decides what a microcredential is, within it. |
| 4 · Private, protected, public (`access`) | The wallet refers to Planning's mart, and dbt allows it. Why is that still wrong? | The mart is Planning's consumer contract, shaped for Planning's question and changed when Planning needs it to. The wallet would silently depend on another consumer's choices. Consumers build on the public core; in one project, only review stops the shortcut. |
| 5 · Who can read (`grants`) | Can a `private` model's table be read? | Yes, if a grant allows it. Access is about which models can `ref()` which, at parse; reading a table is the platform's grants. |
| 7 · What stays shared (`shared`) | What breaks first when domains stop sharing keys? | Joins across domains: the same learner gets two keys, joins find nothing, and counts drift apart, with no test failing in either project. |

## Rigour sheet

| Chapter | What the film says | What an expert would add, or what it simplifies |
|---|---|---|
| 1 | In 1858, a law promoted by Robert Torrens made the government's register the title. | The Real Property Act 1858 (SA), assented to 27 January 1858; it came into operation on 1 July 1858 (the State Library's chronology gives 2 July for the first registrations). Robert Richard Torrens promoted it; the German lawyer Ulrich Hübbe is credited with much of its design, drawing on Hanseatic land registers. That Torrens drew on the registration of ships, which he knew as a customs official, is often told and debated: the film leaves it out. Adopted across Australia and in many other countries as "Torrens title". |
| 1 | Before 1858, buying land in South Australia meant tracing a chain of old deeds. | Under the old system (general law, or "old system", title) a buyer's title rested on a chain of deeds back to the Crown grant; a defect or missing deed anywhere could defeat it. The picture's faded link stands for that. |
| 1 | Anyone could rely on the register, without checking its history. | "Title by registration, not registration of title": the state-guaranteed certificate of title shows every registered dealing, and the registered owner's title is indefeasible, with exceptions (fraud, some prior interests, later statutes). The film keeps the one point. |
| 1 | Only a registered transfer, signed by the owner, could change it. | A dealing takes effect on registration, by an instrument the registered proprietor executes (a memorandum of transfer). Transmissions (death, bankruptcy) and court orders also change the register; the film keeps the ordinary sale. |
| 1 | The credential's core models work the same way. | The series' metaphor. A land register can be changed only through the registrar; a core model only through its owner's approval and its version. |
| 2 | The registrar's office owns learners and awards, and the student IDs; the learning team owns microcredentials, badges and its platforms' keys. | Key sets and their owners are on the sources that issue them: `meta.key_set` in `sources/student_system/_student_system__sources.yml` 16-19, and the same lines in `sources/learning_platform/_learning_platform__sources.yml` and `sources/short_courses/_short_courses__sources.yml`. Entity and kind owners: `models/core/student/_student__conceptual.yml` 26 (learner), 49 (credential), 55-63 (the award, microcredential and badge kinds), 75 (credit towards an award); `models/core/course/_course__conceptual.yml` 22 (award). The credential itself is owned by Mei; the microcredential and badge kinds by the learning team. All four core models carry `meta.owner: Mei Tanaka` (`models/core/student/_core_student__models.yml` 11, 120, 247; `models/core/course/_core_course__models.yml` 11). |
| 2 | Three kinds of domain: the systems and the teams that run them (application), what the facts mean (data, named as the reference model names them: student and course), and Planning and the wallet app (business), who decide with the data and own their marts. | `docs/conventions.md` 22-47 (*Domains*: the three kinds, their folders, and the reference model). Roughly what data mesh calls source-aligned, aggregate and consumer-aligned domains; the film uses the project's words and names no approach. The reference model is TCSI, the Tertiary Collection of Student Information, the Australian Government's collection of tertiary student data, set out in packets: `student` follows its Student packet and `course` its Course packet, each extended where the university needs more (`models/core/student/_student__conceptual.yml` 10-18, `models/core/course/_course__conceptual.yml` 10-14). Each model's `meta.domain` is its kind's: `registrar` or `learning` on staging (the application domains: `models/staging/student_system/_student_system__models.yml` 6, 52, 75; `learning` on the two platforms'), `student` or `course` on the core (`models/core/student/_core_student__models.yml` 12, 121, 248; `models/core/course/_core_course__models.yml` 12), `planning` or `wallet` on the marts (`models/marts/planning/_planning__models.yml` 15, `models/marts/wallet/_wallet__models.yml` 13, 82). The university's map of its domains is `models/_shared/_shared__conceptual.yml`. |
| 2 | The project is laid out the same way: sources by system, the core by data domain, the marts and exposures by consumer. | `docs/conventions.md` 33-34 and 49-58; `dbt_project.yml` 44-45. Staging follows the sources, by system (`models/staging/<system>/`), and intermediate follows the core, by data domain (`models/intermediate/student/`); the film names the two ends. The folders card is a summary, not a file: each line is a folder in the project. Decided as DEC-PRJ-05 and DEC-PRJ-06 (`models/_shared/_shared__decisions.yml` 53-79). |
| 2 | The staging, core and mart models name their domain, and each group names an owner. | `docs/conventions.md` 226 (`meta.domain`: the application, data and business domains, or `shared`). In the build of 30 September 2026 (`dbt ls --resource-type model --output json`), 15 of the 24 models carry `meta.domain`: the 7 staging models, the core and the marts; the 8 intermediate models and `metricflow_time_spine` carry none, which is why the film doesn't say "each model".  `models/_groups.yml` 1-20: three groups, each with an `owner` (dbt requires a group's owner to have a name or an email). `meta` is free-form: dbt doesn't read `meta.domain`; the docs site and the catalogue show it. |
| 3 | A core model as a product: grain, owner, domain, glossary term, contract, version, docs. | `models/core/student/_core_student__models.yml` 3-13. `latest_version: 1` with a `versions:` list further down (every core model is versioned from 1: DEC-PRJ-02, `models/_shared/_shared__decisions.yml` 21-29). The contract is set for the folder (`dbt_project.yml` 46-52). Its `meta.domain` is `student`, its data domain; its owner, Mei, works at the registrar's office. Grain has no built-in field; the project keeps it in `meta.grain` and tests it as a key. "Data product" is used in plain words. |
| 3 | Noor's group builds it; Mei owns what it means. | `models/_groups.yml` 2-8 (group `credential_model`, owner Noor); `meta.owner` on the model. The group owner answers for the code; `meta.owner` names who owns the meaning (`docs/conventions.md` 225). |
| 4 | Three rings: public and protected, from the contracts; private, new here. | dbt model access: `private` models can be referenced only from the same group; `protected` (the default) from the same project, or when installed as a package; `public` from any group, package or project. `dbt_project.yml` 32-57 sets it per folder; `docs/conventions.md` 164-168. In the build of 30 September 2026: 15 private models (7 staging, 8 intermediate, all views), 5 public core model versions (`core_learner`, `core_award`, `core_credit_towards_award`, `core_credential` v1 and v2), 4 protected models (the three marts and the metric time spine). |
| 4 | Refused before anything runs, with dbt's message. | Run 30 September 2026 on a scratch copy (dbt Core 1.12.5, dbt-duckdb 1.11.0), with `models/marts/wallet/mart_wallet__try_private.sql` holding `select * from {{ ref('int_learners') }}`: `dbt parse` gave "Parsing Error · Node model.credentials.mart_wallet__try_private attempted to reference node model.credentials.int_learners, which is not allowed because the referenced node is private to the 'credential_model' group." Not committed. |
| 4 | Building on Planning's mart is allowed. | Same scratch copy, `select * from {{ ref('mart_planning__near_award') }}` in the wallet folder: `dbt parse` succeeded. `docs/conventions.md` 167 says so. dbt Cloud can also flag such references in review; the project relies on review (`docs/process.md` 21). |
| 5 | Access decides which models can refer; grants decide who reads. | `AGENTS.md` 36-38; `docs/conventions.md` 161-162. dbt's `grants` config applies `grant select` (and others) after a model builds; on Databricks it maps to Unity Catalog privileges. |
| 5 | Planning's marts grant reading to the groups Planning names. | `dbt_project.yml` 60-64: the grant applies on Databricks only, and only when the var `planning_readers` names groups; on DuckDB it's empty. The film says "grant reading to the groups Planning names", which is what the var carries. |
| 5 | A dashboard can read a private staging table, if a grant lets it; access doesn't stop it. | Access is checked when dbt parses a `ref()`; it doesn't touch the warehouse's privileges. On Databricks, a principal with `USE CATALOG`, `USE SCHEMA` and `SELECT` on the staging schema reads its views, whatever their dbt access. (The agent's own service principal and grants, `AGENTS.md` 24-34, are left to the next film.) |
| 6 | Planning names the project it depends on, and refers to the core by project and name, pinned to a version. | `examples/planning/dependencies.yml` 1-4; `examples/planning/models/planning_enrolments_at_census.sql` 1-9 (the two-argument `ref` with `v=1`). Cross-project references ("project dependencies") are a dbt Cloud feature, on the Enterprise plans (checked by web search 30 September 2026; docs.getdbt.com was blocked from the build machine again on 1 October 2026, so the plan name, Enterprise or Enterprise+, is still to confirm on docs.getdbt.com/docs/mesh/govern/project-dependencies before publishing). dbt Cloud is now called the dbt platform (renamed by dbt Labs in 2025, and the docs use the new name); the film keeps the name the story uses. The consuming project reads the producing project's published public models from dbt Cloud's metadata; both must be in the same account. |
| 6 | Only public models cross. | `examples/planning/README.md` 12-14. A cross-project `ref` to a `protected` or `private` model is refused. |
| 6 | It doesn't run on DuckDB. | `examples/planning/README.md` 3: "dbt Cloud only. It doesn't run on DuckDB, and CI doesn't build it." Hence its label, `sketch · dbt Cloud only`, an exception to the series' label. |
| 7 | The key sets: one per system, each with its owner. | Each key set is written once, on the source that issues it: `meta.key_set` in `sources/student_system/_student_system__sources.yml` 16-19 (and the same lines in the two platforms' sources), with each system key and the case staging writes it in. `scripts/generate/definitions.py` generates `seeds/reference/shared/key_sets.csv` from them (`docs/conventions.md` 200). The card shows the three as one list. |
| 7 | One macro for every hash; Aisha's student ID gives the same 64 characters in every project. | `macros/shared/keys.sql` 47-58 (dispatch to `sha256` on DuckDB, `sha2(…, 256)` on Databricks, the same value) and 72-83 (trim, upper case, `|` joins, a sentinel for a missing part). Run 30 September 2026 against `target/credentials.duckdb`: `sha256('SIS|S-20417')` = `0905e6e2b60bd76bfa5c6d3ed43ac6a4d55cf046c2c0cbce4c590300145f76a2`; `hash_key` of `'sis|s-20417 '` through the macro gives the same. |
| 7 | Hash it another way, in lower case, and she gets a second key; joins find nothing, no test fails. | A project that lower-cases the key, as the short-course team does with emails (scenario 4). Her student ID arrives in upper case (`data/student_system/learners.csv` 26-27), so leaving out the macro's upper case alone would change nothing: `sha256('SIS|S-20417')` is the key in `core_learner` either way. `sha256('sis|s-20417')` = `8c73518cf662e82e5a12c6951dc494924bce32098a7b9ef3fc3023b836e2447e` (same run). "No test fails" is the point of the picture: each project's own key tests (unique, not null, relationships within the project) pass on either hash; nothing compares keys across projects. Illustrative, not run as two projects. |
| 7 | Macros don't cross projects; shared ones would move to a package both install. | `examples/planning/README.md` 16-17. A dbt package (`packages.yml`) installs macros into a project; cross-project `ref` shares models, not macros. |
| 8 | Why not split now? More to deploy, more to keep in step. | DEC-PRJ-03, `models/_shared/_shared__decisions.yml` 31-41: "Separate projects add cost that pays off only with separate teams." The film's two examples of that cost are its own. |
| 8 | On 12 October, Noor decided: groups first; projects later. | DEC-PRJ-03, `decided_on: 2026-10-12` (`models/_shared/_shared__decisions.yml` 39; the story's date; the university and its people are fictional). `docs/decisions.md` is now a generated index of every decision log, so the card shows the project's own log. |
| 8 | When that day comes, a domain moves out with its own folders: its marts, its exposures, its seeds and its decisions. Nothing else needs untangling. | `docs/conventions.md` 139-157 (*Splitting into projects*): every file a domain owns is under a path named for it, so its project is those paths. For Planning: `models/marts/planning/`, `exposures/planning/`, `seeds/expected/planning/` and `models/marts/planning/_planning__decisions.yml`, and also `macros/planning/`, which the film leaves out. What every domain shares (`models/_shared/`, `macros/shared/`, `seeds/reference/shared/`, the conventions) becomes a package each project installs (chapter 7), and a consumer's project refs the public core across projects (chapter 6). Not done yet: today it's one project. |

**Project files each snippet comes from** (checked against the files on 6 October 2026):

| Ch | File | Lines |
|---|---|---|
| 2 | the project's folders (a summary card, not a file) | one line per domain folder: [`sources/`](https://github.com/roanboc/learning-data/tree/main/films/analytics-engineering/project/sources) by system, [`models/core/`](https://github.com/roanboc/learning-data/tree/main/films/analytics-engineering/project/models/core) by data domain, [`models/marts/`](https://github.com/roanboc/learning-data/tree/main/films/analytics-engineering/project/models/marts) and [`exposures/`](https://github.com/roanboc/learning-data/tree/main/films/analytics-engineering/project/exposures) by consumer |
| 2 | [`models/_groups.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/_groups.yml) | 1-2, 6-7, 10, 12-13, 16, 18-19 (descriptions and emails trimmed with …) |
| 3 | [`models/core/student/_core_student__models.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/core/student/_core_student__models.yml) | 3-13 |
| 4 | [`dbt_project.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/dbt_project.yml) | 32, 35-36, 38, 41-42, 46, 49-50, 54, 57 (trimmed; materialisations and schemas left out) |
| 4 | [`docs/conventions.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/docs/conventions.md) | 164-168 (each row cut to its first sentence, or to its last, with …, so the card reads at the film's width) |
| 4 | dbt's message (scratch copy) | the parsing error, wrapped to fit |
| 5 | [`dbt_project.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/dbt_project.yml) | 60-61, 64 (the two comment lines 62-63 cut with …; line 64 wrapped on the card at `if`, `and` and `else`) |
| 6 | [`examples/planning/dependencies.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/examples/planning/dependencies.yml) | 3-4 (the two long comment lines 1-2 cut with …) |
| 6 | [`examples/planning/models/planning_enrolments_at_census.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/examples/planning/models/planning_enrolments_at_census.sql) | 3-9 (the two long comment lines 1-2 cut with …; then …) |
| 6 | [`examples/planning/README.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/examples/planning/README.md) | 12-14 (wrapped to fit) |
| 7 | [`sources/student_system/_student_system__sources.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/sources/student_system/_student_system__sources.yml), [`sources/learning_platform/_learning_platform__sources.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/sources/learning_platform/_learning_platform__sources.yml), [`sources/short_courses/_short_courses__sources.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/sources/short_courses/_short_courses__sources.yml) | 17-19 in each: the `code`, `system` and `owner` of `meta.key_set`, shown as one list under a comment line |
| 7 | [`macros/shared/keys.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/macros/shared/keys.sql) | 47-58 (line 47's comment trimmed with …) |
| 7 | [`examples/planning/README.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/examples/planning/README.md) | 16-17 (wrapped to fit) |
| 8 | [`models/_shared/_shared__decisions.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/_shared/_shared__decisions.yml) | 31, 33-34, 36, 38-39 (DEC-PRJ-03; `step`, `status` and `implemented_in` left out; `text` and `why` cut with …) |

**dbt and Databricks documentation** (the pages behind each claim; on 30 September 2026 docs.getdbt.com couldn't be reached from the build machine, so each claim was checked against the project's own runs and a web search; to confirm on the pages on the day):

- dbt: "Model access" (docs.getdbt.com/docs/mesh/govern/model-access) and the `access` config (docs.getdbt.com/reference/resource-configs/access): the three levels, `protected` the default; "Groups" (docs.getdbt.com/docs/build/groups): an owner with a name or email; "Model versions" (docs.getdbt.com/docs/mesh/govern/model-versions); "Project dependencies" / cross-project `ref` (docs.getdbt.com/docs/mesh/govern/project-dependencies), `dependencies.yml`, and which plan it needs; "About dbt Mesh" and "dbt Mesh FAQs" (docs.getdbt.com/best-practices/how-we-mesh/mesh-5-faqs) for when to split; `grants` (docs.getdbt.com/reference/resource-configs/grants); "Packages" (docs.getdbt.com/docs/build/packages); `meta` (docs.getdbt.com/reference/resource-configs/meta). dbt Cloud, now called the dbt platform; the film keeps the name the story uses.
- Databricks: "Unity Catalog privileges and securable objects" (docs.databricks.com/aws/en/data-governance/unity-catalog/manage-privileges/privileges): `USE CATALOG`, `USE SCHEMA`, `SELECT`, `ALL PRIVILEGES`; "Grant and revoke privileges" for reading a view with `SELECT`.

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
| 2 | *Draw the domains* | sort | Sort ten things from the project (the `SIS` key set, the short-course platform's source, a staging view, the learner, the award, the microcredential, `core_learner`, Planning's mart, the census dashboard, the wallet's mart) into the three kinds of domain: application (a system and the team that runs it, `sources/<system>/`), data (what the facts mean, following TCSI, `models/core/<domain>/`) and business (who decides with the data, `models/marts/<consumer>/` and `exposures/<consumer>/`). Put `core_learner` with the systems because Mei works at the registrar's office, and its meaning is tied to one system; put the learner or the microcredential there, and you miss that several systems record them. Each kind has its own folders, so a domain can move out to its own project with them. |
| 3 | *Ref or read?* | pick | Five requests: Planning's analyst queries a mart table; the wallet's model refs a core model; the wallet's model refs Planning's mart; a dashboard reads a private staging table; Planning's own project refs the core. For each, pick what decides: access, a grant, or both. Pick access for the dashboard, and see the table read anyway. |
| 4 | *What must be shared?* | steps | Step through two projects building the same learner. Remove the shared hash macro from one, and hash the key in lower case: Aisha's key changes from `0905e6e2…` to `8c73518c…`, the cross-project join returns nothing, and every test in both projects stays green. Put the package back, and the join returns. |

## Scenarios

Eight situations, in this order.

1. **Spot the problem.** The wallet team copies Planning's mart into its own folder, "because it's already there." (It's Planning's consumer contract, shaped for Planning's question; the wallet should build on the public core, and ask the owner if the core lacks something.)
2. **Choose.** Planning wants to ref `int_learner_keys_matched`, to see how keys were matched. (No: it's private to `credential_model`. Ask Noor's group; if the matching is a fact others need, it belongs in the core, with a contract and a version.)
3. **True or false.** "The staging models are private, so nobody can read their tables." (False: access governs `ref()`. Whoever has a grant on the schema can read them; grants are the place to restrict reading.)
4. **Explain.** The short-course team hashes emails in lower case in its own project; the credential project upper-cases them. What happens? (The same person gets two keys; joins across the projects find nothing; no test in either project fails. The hash macro must be shared, in a package.)
5. **Choose.** Someone proposes splitting the project into five projects on day one: staging, intermediate, core, Planning, wallet. (Groups first: one team builds the core, so separate projects add cost with no one to own them. Split when teams own domains, along domains, not layers: the folders are already split by domain, so a domain moves out with its own.)
6. **Spot the problem.** The learning team edits a microcredential column in `core_credential` in place, without a version. (A public contract changed under its consumers. A breaking change is a new version, with a deprecation date for the old one; the exposures say who to tell.)
7. **Order.** Planning moves into its own project. Put the steps in order: agree the move with Noor; make sure the core models Planning needs are public and versioned; move the shared macros into a package; create Planning's project from its own folders, with `dependencies.yml`; change its refs to `ref('credentials', …, v=…)`; delete Planning's folders from the credential project.
8. **Choose.** Planning pins `core_learner` version 1, and version 2 arrives. What happens to Planning's project? (Nothing at once: its pin keeps reading version 1 until the deprecation date. Planning moves when it's ready, and the owner of the core can see from the lineage who still reads version 1.)

## Pause and think

`domains`, `access`, `grants`, `shared` (the questions and answers are in [Pause and think](#pause-and-think) above).

## Decisions taken

| Date | Decision |
|---|---|
| 7 October 2026 | The series now groups its ten steps into four phases (ask, promise, build, keep), which the opening film introduces. This film's small loop names its phases: "Promise and Keep · steps 4 and 10". |
| 30 September 2026 | Open in Adelaide in 1858 with the Torrens register: the register is the title, relied on by everyone, changed only by its owner. The ships story is left out as uncertain. |
| 30 September 2026 | The refused reference is dbt's real message, from a scratch copy of the project; the allowed reference to Planning's mart was run too. Said so in the rigour sheet. |
| 30 September 2026 | The cross-project chapter shows `examples/planning/` with the label `sketch · dbt Cloud only`. Every other card carries `runs on dbt Core · DuckDB`. |
| 30 September 2026 | "The learning team owns microcredentials" is kept to what the project says: the kind's meaning and the platforms' keys; the credential and the core models are Mei's. |
| 30 September 2026 | Access and grants get one chapter each, for referring and for reading, so the difference is the lesson. |
| 1 October 2026 | After review: the agent's service principal and grants are left to the next film, which shows them; "who can read" is shown with a dashboard reading a private staging table. The second hash is framed as a lower-cased key, since Aisha's ID is already upper case. "Each model names its domain" narrowed to the staging, core and mart models. Long snippet lines cut or wrapped. |
| 1 October 2026 | Series read-through: the opening line starts "Before 1858". *Domains* doesn't repeat the film before's last line, gives the registrar's office credentials too (as *Start from a question* and `meta.domain` do), and says what a group is before *Access* uses it. *Access* recalls public and protected from the contracts and teaches only private as new. |
| 6 October 2026 | The example project was reorganised by application, data and business domains (roanboc/learning-data#17), so that each domain can later split into a project of its own. The film's cards show the files as they are now: the learner's YAML in `models/core/student/_core_student__models.yml`, with `domain: student`; the key sets as `meta.key_set` on each source; the hash macro in `macros/shared/keys.sql`; the decision as DEC-PRJ-03 in `models/_shared/_shared__decisions.yml`, since `docs/decisions.md` is now a generated index. *Domains* now tells the three kinds of domain, on a map in three columns, with a card of the project's folders in place of the conventions' `meta.domain` line. Its narration now reads: "So there are three kinds of domain. The systems, and the teams that run them, are application domains." "What the facts mean, learners, credentials and awards, are data domains, named as the reference model names them: student and course." "And Planning and the wallet app are business domains: they decide with the data, and own the marts they build for it." "The project is laid out the same way: sources by system, the core by data domain, the marts and exposures by consumer." "Each group names an owner, and the staging, core and mart models name their domain. Ownership follows meaning, not the code." *Groups first* adds: "When that day comes, a domain moves out with its own folders: its marts, its exposures, its seeds and its decisions. Nothing else needs untangling." Lab 2, *Draw the domains*, now sorts ten things into the three kinds; the labs and scenarios link to the project's files. Chapter times recomputed from the voiced lengths (`tools/pace.py`): 5:44 in all. |

## Open

1. **Scratch experiments.** The refused and allowed references were run on a copy of the project; consider adding them as documented commands so viewers can repeat them.
2. **Two hashes.** The second hash (`8c73518c…`) is computed directly, not from a second project; the lab can run it as two small projects.
3. **Voice.** Check "eighteen fifty-eight", "Torrens", "May", "dee bee tee", "duck dee bee" and "eye dees" by ear; key strings, hashes and file names stay on screen only.
4. **The learning team's face.** Drawn as Tom Whitfield, as the series plan proposes; to confirm.
