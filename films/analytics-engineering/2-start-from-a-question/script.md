# In the weeds of data crafting · Start from a question: script

*The script of Start from a question, the film after Declare it, then build it in the series In the weeds of data crafting, a technical series for analytics engineers, as planned: about 4:45 (target 4 to 6 minutes), in eight chapters, in English, 30 September 2026. The narration lives in [`source/src/narration.js`](source/src/narration.js) and the pauses in [`source/src/breath.js`](source/src/breath.js); this page and those files say the same thing, and where they differ, the source wins. The timings are estimates from the word count (616 words, at the pace of the opening film) until the voice is recorded; the pacing report replaces them. Takes step 1 of Jun's ten: start from a question.*

## The promise

A practitioner follows every line, and a data architect agrees with it. A canonical model has no edge until a question gives it one. Start from a question with a decision behind it; model only the entities it touches; give each its business key and the person who owns its meaning, before opening a single source; combine two candidates into one entity when they share identity and lifecycle, and split them when they don't. An agent can draft all of it; the owner approves the meaning. **Model only what the question touches; name who owns each meaning first.**

## The story in one paragraph

In 1854, cholera killed hundreds of people in a few streets of Soho. John Snow asked one question, where did the dead get their water, and marked each death at its address; the deaths gathered around one pump. His map showed only what the question needed. Jun's model starts the same way, with one question from Planning: how many learners are within 15 credit points of a graduate certificate, by faculty, as at census date? Behind it is a decision (how many places to offer in each faculty's final units next semester) and a number to reach: the census report's twelve. A second consumer, the learner's wallet app, will read the same facts as they are today. The code and the data on screen are real, and run on dbt Core with DuckDB; the university runs the same project on Databricks with dbt Cloud. From a glossary of everything the university does, the question lights four things: learner, credential, award, and credit towards an award. Each is written once in YAML, with a hand-drawn diagram beside it. Each gets a business key qualified by the system it comes from, and an owner: Mei for learner, credential and award, the learning team for microcredentials and badges. A microcredential shares a credential's identity and lifecycle, so it becomes a kind of credential; a certificate of attendance is turned away. An agent drafts the lot from a skill in the project; Mei adds the clause the draft missed, and approves. Four things, two owners, one question. Now the sources, where Aisha is three.

## What each object stands for

| Object | Stands for |
|---|---|
| A hand-drawn street grid, 1854, with black bars at addresses | Snow's map: data drawn for one question |
| The pump, with the bars gathered round it; blank paper everywhere else | Scope: the question decides what goes on the map |
| The workhouse and the brewery, outlined and empty | What the question also explains, without extra detail |
| Planning's consumer badge and a question card typing itself | The question that scopes the model |
| A decision card under the question, and "census report · 12" | The decision behind the question, and the number to reach |
| The label `runs on dbt Core · DuckDB`, then a dim `Databricks · dbt Cloud` beside it | The setup is real; the same project runs on the story's platform |
| Two `profiles.yml` targets; two hash macros side by side | Only the connection and the function that turns a key into a hash change |
| A fan of glossary cards | The university's catalog and glossary: everything it does |
| Four cards lighting, the rest dimming off the edge | The slice: what the question touches, and what stays out |
| A YAML card beside a hand-drawn diagram | The conceptual model: written once for tools, drawn for people |
| A key tag on each entity, with a coloured prefix | A business key, qualified by its key set (`SIS`, `LMS`, `SC`) |
| Mei's face and the learning team's (Tom) on the entities | Owners of meaning |
| Two cards compared line by line, then merged, with kind tabs | Combine: same identity, same lifecycle, one entity with kinds |
| A certificate of attendance turned away at the edge | What stays out of an entity, and why |
| The teal orb and its draft | The AI agent, following `skills/draft-the-conceptual-model` |
| Mei's clause lighting gold; a gold tick | The owner approves the meaning |
| A new entry in the student domain's decision log, `_student__decisions.yml` | The decision, with its date and its owner |
| Three coloured streams arriving under the blueprint, Aisha under three keys | The next step: the sources |

## Script

### 1 · One question, one map · 0:00–0:31

**Narration.** In 1854, cholera killed hundreds of people in a few streets of Soho. John Snow asked one question: where did the dead get their water? He marked each death at its address, and the deaths gathered around one pump, on Broad Street. His map showed only what the question needed. Jun's model starts the same way: with one question, from Planning.

**Picture.** The warm past, with "1854 · Soho, London" in the corner. A pen draws a few streets by hand on cream paper. Short black bars stack at addresses, one per death, each with a pen nib's scratch; they gather around a small pump marked on Broad Street. Two buildings near it are outlined and stay empty: "workhouse · its own well" and "brewery". The rest of the sheet stays blank paper; the camera pulls back to show how much of it is empty. On the bridge line, a question mark lifts off the map and drifts right, towards the present. Wordless breather: the title card over the map, with the series' mark: "IN THE WEEDS OF DATA CRAFTING", *Start from a question*, "scope is a question, not the whole university".

**On screen.** 1854 · Soho, London · one question · where did the dead get their water? · Broad Street pump · workhouse · its own well · brewery · left out · *Start from a question* · scope is a question, not the whole university

### 2 · The question · 0:31–1:24

**Narration.** Step one: start from a question. How many learners are within 15 credit points of a graduate certificate, by faculty, as at census date? Behind it, a decision: how many places to offer in each faculty's final graduate certificate units next semester. A second consumer, the learner's wallet app, will read the same facts, as they are today. The decision says what done looks like. The census report counted twelve. The model has to reach the same number. The code and the data on screen are real. They run on dbt Core, with DuckDB, in the series' repository, so anyone can run them. The university's own platform is Databricks, with dbt Cloud, and the same project runs there too. Only the connection changes, and one function: the one that turns a key into a hash.

**Picture.** The loop of ten steps from the opening film, small, with station 1 lit. Planning's consumer badge. The question types itself on a card, and the words "learners", "within 15 credit points", "graduate certificate", "by faculty" and "as at census date" underline as they're read. A second card below: the decision. On "wallet app", the wallet's consumer badge arrives, smaller, beside Planning's, and "as they are today" writes itself beneath it. A small tag, "census report · 12", pins to the corner (the number, not the report). The question card turns into the project's YAML, Planning's conceptual model, `models/marts/planning/_planning__conceptual.yml`, with its label:

```yaml
# models/marts/planning/_planning__conceptual.yml · runs on dbt Core · DuckDB
question:
  asked_by: Planning
  text: >
    How many learners are within 15 credit points of a graduate certificate, by faculty,
    as at census date?
  decision: >
    How many places to offer in each faculty's final graduate certificate units next semester.
```

On "real", the label `runs on dbt Core · DuckDB` glows. On "Databricks", a dim second label `Databricks · dbt Cloud` slides in beside it. On "the connection", `profiles.yml` opens beside the card, trimmed, with the film's label beside the `duckdb` target (the label, not a line of the file):

```yaml
# profiles.yml
credentials:
  target: duckdb
  outputs:
    duckdb:                  # runs on dbt Core · DuckDB
      type: duckdb
      …
    databricks:
      type: databricks
      …
```

On "turns a key into a hash", the words "key → hash" write themselves a beat before `macros/shared/keys.sql` shows the two macros side by side, and `sha256` and `sha2(…, 256)` light together:

```sql
-- macros/shared/keys.sql · runs on dbt Core · DuckDB (and Databricks)
{% macro duckdb__hash_key(columns) -%}
    sha256({{ credentials.key_string(columns) }})
{%- endmacro %}

{% macro databricks__hash_key(columns) -%}
    sha2({{ credentials.key_string(columns) }}, 256)
{%- endmacro %}
```

**On screen.** step 1 · a question · Planning · within 15 credit points · graduate certificate · by faculty · as at census date · the decision · places to offer · the wallet app · as they are today · census report · 12 · runs on dbt Core · DuckDB · Databricks · dbt Cloud · the connection · key → hash

**In the repo.** [`models/marts/planning/_planning__conceptual.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/marts/planning/_planning__conceptual.yml) · [`profiles.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/profiles.yml) · [`macros/shared/keys.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/macros/shared/keys.sql)

### 3 · The slice · 1:24–1:54

**Narration.** The university's glossary has a term for everything it does: fees, timetables, rooms, staff. The question touches four: a learner, a credential, an award, and the credit a learner holds towards an award. Everything else stays out, however central it seems. Noor agreed that scope with Planning, and wrote down why. Model the university, and you never finish. A question, you can finish.

**Picture.** A fan of glossary cards spreads across the glass: fee, timetable, room, staff, enrolment, unit, course review, library loan, parking permit, learner, credential, award. Planning's YAML from chapter 2 folds back into the question card, which hangs above; its nouns send thin lines down to four cards, which light: learner, credential, award, and a fourth card, "credit towards an award", drawn as a relationship between learner and award. The rest dim and drift off the edge. Noor, outlined in cyan, and Planning's badge stand beside the four; her decision, DEC-PLN-01, writes itself below, from Planning's decision log:

```yaml
# models/marts/planning/_planning__decisions.yml
  - id: DEC-PLN-01
    title: Scope is what Planning's question touches
    …
    why: '"Model the university" never ends. A question does.'
    decided_by: Noor, data architect, with Planning
```

**On screen.** glossary · fees · timetables · rooms · staff · the question touches four · learner · credential · award · credit towards an award · everything else stays out · DEC-PLN-01 · Noor, data architect, with Planning

**In the repo.** [`models/marts/planning/_planning__conceptual.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/marts/planning/_planning__conceptual.yml) · [`models/marts/planning/_planning__decisions.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/marts/planning/_planning__decisions.yml)

### 4 · Written as YAML, drawn for people · 1:54–2:28

**Narration.** Each of the four is written down once, in YAML. The learner: a definition, an owner, and the rule for its key. The definition is in the business's words, not a system's: a person the university has recorded learning with it, in any of its systems. Beside it, a diagram drawn by hand: a learner holds credentials, and holds credit towards an award. The YAML holds the meaning. The diagram lets anyone read it.

**Picture.** The four cards settle as a blueprint (white on blue) at the top. The student domain's conceptual model opens as a YAML card with its label, each part lighting as it's named (`definition`, `owner`, `business_key`):

```yaml
# models/core/student/_student__conceptual.yml · runs on dbt Core · DuckDB
  - name: learner
    definition: >
      A person the university has recorded learning with it, in any of its systems: a student
      of an award, a learning platform user, or a short-course customer.
    owner: Mei Tanaka, registrar's office
    business_key:
      issued_by: Registrar's office
      rule: >
        The student ID, qualified by its key set: SIS|S-20417. A learner the student system
        doesn't know keeps the key of the first system that recorded them, …
```

Beside it, the domain's hand-drawn diagram, `models/core/student/_student__conceptual.md`, types its Mermaid source, and the diagram renders from it line by line:

```markdown
<!-- models/core/student/_student__conceptual.md -->
erDiagram
    LEARNER ||--o{ CREDENTIAL : holds
    LEARNER ||--o{ CREDIT_TOWARDS_AWARD : "holds credit"
    AWARD ||--o{ CREDIT_TOWARDS_AWARD : "is earned by"
    CREDENTIAL }o--o{ AWARD : "counts towards"
    LEARNER }o--o| AWARD : "is enrolled in"
```

**On screen.** written once · YAML · definition · owner · business key · the business's words, not a system's · drawn by hand · holds · holds credit · the meaning · anyone can read it

**In the repo.** [`models/core/student/_student__conceptual.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/core/student/_student__conceptual.yml) · [`models/core/student/_student__conceptual.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/core/student/_student__conceptual.md)

### 5 · Keys and owners · 2:28–3:10

**Narration.** Next, what identifies each one in business terms, before anyone opens a source. A learner is their student ID, which the registrar's office issues. An award is its code. A credential is the ID its issuer gave it. Each key is tagged with the system it comes from: the student system, the learning platform, or the short-course platform. And each meaning has an owner. Mei, in the registrar's office, owns learner, credential and award. The learning team owns microcredentials and badges. The sources will disagree. The owner is the person who decides which meaning wins.

**Picture.** The blueprint's entities each get a key tag as they're named, the prefix in its source colour: learner `SIS|S-20417` (blue), award `SIS|GCDA` (blue), credential `LMS|B-5010` (green) and `SC|C-88` (pink). The prefixes lift and line up as three key sets, beside the YAML that declares them: each key set is written on the source that issues it, as `meta.key_set`, and the card shows the three together:

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

On "owner", faces arrive on the entities: Mei (business outline) on learner, credential and award; the learning team (Tom, business outline) on two small kind tabs on the credential, "microcredential" and "badge". On "disagree", three faint source outlines flicker behind the blueprint, each with a different word for the learner ("student", "user", "customer"); Mei's face stays lit.

**On screen.** business keys · before any source · student ID · award code · the ID its issuer gave it · SIS · LMS · SC · key sets · owners · Mei, registrar's office · the learning team · the sources will disagree · the owner decides

**In the repo.** [`sources/student_system/_student_system__sources.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/sources/student_system/_student_system__sources.yml) · [`sources/learning_platform/_learning_platform__sources.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/sources/learning_platform/_learning_platform__sources.yml) · [`sources/short_courses/_short_courses__sources.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/sources/short_courses/_short_courses__sources.yml)

### 6 · Combine or split · 3:10–3:47

**Narration.** Then a harder call. Is a microcredential a kind of credential, or a thing of its own? Compare what identifies it: the issuer's own identifier. Compare its life: issued on a date, and perhaps revoked. Both match any credential. Only the credit points differ. Same identity, same lifecycle: one entity, with kinds. A different identity, grain or lifecycle, and you split. A certificate of attendance asks to join. It says someone was there, not what they can do. It stays out.

**Picture.** Two cards side by side, "microcredential" and "credential", with three rows each: identity (`LMS|B-5010` · the issuer's identifier), lifecycle (issued · revoked?), credit points (5 · varies). The first two rows tick as they match; the third stays apart, amber. The two cards merge into one credential card with three kind tabs, each with its owner, from the student domain's conceptual model:

```yaml
# models/core/student/_student__conceptual.yml · runs on dbt Core · DuckDB
    kinds:
      - name: award
        owner: Mei Tanaka, registrar's office
      - name: microcredential
        definition: A credential for a small, assessed piece of learning, which can carry credit points towards an award.
        owner: Learning team
      - name: badge
        definition: A credential with no credit points.
        owner: Learning team
```

A rule card: "same identity + same lifecycle → one entity, with kinds · different identity, grain or lifecycle → split". Then a certificate of attendance, `SC|C-81`, drifts towards the credential card; its rows show "was there" where the others show "can do"; it's turned away at the edge. The query that keeps it out, trimmed:

```sql
-- models/intermediate/student/int_credentials_unioned.sql · runs on dbt Core · DuckDB
-- a certificate of attendance isn't a credential
completed_courses as (

    select * from enrolments
    where enrolment_status = 'completed'
      and certificate_type = 'completion'
      and certificate_bk is not null

),
```

**On screen.** combine or split? · identity · lifecycle · credit points · one entity, with kinds · award · microcredential · badge · different identity, grain or lifecycle → split · certificate of attendance · was there, not can do · stays out

**In the repo.** [`models/core/student/_student__conceptual.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/core/student/_student__conceptual.yml) · [`models/intermediate/student/int_credentials_unioned.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/intermediate/student/int_credentials_unioned.sql)

### 7 · The agent's draft · 3:47–4:21

**Narration.** Jun doesn't write all this alone. An AI agent drafts it, following a skill kept in the project. Write the question first. List only what it touches. Propose combine or split, with the reasons. The draft defined the credential, but let certificates of attendance in. Mei adds one clause: a certificate of attendance isn't one. The agent drafts. The owner approves the meaning, and the decision goes in the log, with her name and the date.

**Picture.** The teal orb reads the glossary cards and the question card; a skill card opens beside it, three lines lighting as they're read:

```markdown
<!-- skills/draft-the-conceptual-model/SKILL.md -->
1. **Write the question** under `question:` in the mart's conceptual model (…): who asks it, the words they use, and the decision it supports. …
2. **List only the entities the question touches.** … An entity the question doesn't need stays out, however central it seems.
…
4. **Combine or split.** Two candidates with the same identity and the same lifecycle are one entity, with kinds …
```

The orb writes the credential's definition in teal, without its last clause. Mei steps in; the clause "a certificate of attendance isn't one" writes itself in her hand and lights gold, and her gold tick lands on the card:

```yaml
# models/core/student/_student__conceptual.yml · runs on dbt Core · DuckDB
  - name: credential
    definition: >
      A trusted, checkable statement that someone has shown what they know or can do.
      Awards, microcredentials and badges are kinds of credential; a certificate of attendance
      isn't one.
    owner: Mei Tanaka, registrar's office
```

The student domain's decision log, `models/core/student/_student__decisions.yml`, gains its two entries of 2 October, trimmed to who decided and when; on "her name" and "the date", each entry's `decided_by` and `decided_on` light gold:

```yaml
# models/core/student/_student__decisions.yml
  - id: DEC-STU-01
    title: A microcredential is a kind of credential
    decided_by: Mei Tanaka, registrar's office
    decided_on: 2026-10-02
  - id: DEC-STU-02
    title: A certificate of attendance isn't a credential
    decided_by: Mei Tanaka, registrar's office
    decided_on: 2026-10-02
```

**On screen.** the agent drafts · a skill · the question first · only what it touches · combine or split · Mei adds one clause · approved · DEC-STU-01 · DEC-STU-02 · 2026-10-02 · the owner approves the meaning

**In the repo.** [`skills/draft-the-conceptual-model/SKILL.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/skills/draft-the-conceptual-model/SKILL.md) · [`models/core/student/_student__conceptual.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/core/student/_student__conceptual.yml) · [`models/core/student/_student__decisions.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/core/student/_student__decisions.yml)

### 8 · Now, the sources · 4:21–4:43

**Narration.** One question. Four things to model. Two owners of meaning. Nothing else. Now, the sources. The model says a learner is one person. The sources say one learner, Aisha, is three.

**Picture.** The blueprint with its four things, the question card above it and two faces beside it; around it, blank space, as on Snow's map. Beneath the blueprint, three source streams arrive in their colours: student system (blue), learning platform (green), short-course platform (pink). On "one learner, Aisha", she surfaces in each, under `S-20417`, `u-88213` and ` Aisha.K@Mail.example ` (spaces drawn as visible dots). The loop's station 2 lights. Wordless end card: *Start from a question* · "Model only what the question touches; name who owns each meaning first." · In the weeds of data crafting.

**On screen.** one question · four things · two owners · nothing else · the sources · Aisha · S-20417 · u-88213 · Aisha.K@Mail.example · *Start from a question* · Model only what the question touches; name who owns each meaning first.

## Pause and think

Four stops, one question each.

| After | Question | Answer, in short |
|---|---|---|
| 2 · The question (`ask`) | Why does a question need a decision behind it? | The decision says how accurate, how fresh and how far back the answer must be, and gives a number to reach. A question with no decision has no "done". |
| 3 · The slice (`slice`) | Planning now asks about fees too. Which entity do you add to this model? | None, yet. Fees are a new question, with its own slice and its own owners; don't stretch this one to cover it. |
| 5 · Keys and owners (`owners`) | Why name the owner of each meaning before looking at the data? | The sources will disagree. Someone has to be able to decide which meaning wins, and that person has to be known before the argument starts. |
| 6 · Combine or split (`split`) | A badge carries no credit points. Should it be its own entity? | No. It has the same identity and lifecycle as any credential; credit points are an attribute of a kind, not a reason to split. |

## Rigour sheet

| Chapter | What the film says | What an expert would add, or what it simplifies |
|---|---|---|
| 1 | In 1854, cholera killed hundreds of people in a few streets of Soho. | The Broad Street outbreak began on 31 August 1854; 616 deaths is the figure usually given, most in the first ten days; John Snow was a London doctor (on screen: "1854 · Soho, London"). "Hundreds" avoids a disputed figure. |
| 1 | Snow asked where the dead got their water, and marked each death at its address; they gathered around one pump. | Snow collected the addresses from the General Register Office and visited households. The map most people know was published after the outbreak, in the second edition of *On the Mode of Communication of Cholera* (1855), and Snow's case rested on his interviews and counts as much as on the map. The film doesn't claim the map found the pump first. |
| 1 | (Picture only) the workhouse with its own well; the brewery. | Snow reports that the Poland Street workhouse, with 535 inmates and its own well, had five deaths, and that none of the Broad Street brewery's workers, who drank its beer, died. Kept to labels. |
| 1 | (Not said) the pump handle. | The handle was removed on 8 September 1854, when the outbreak was already declining. The story that removing it ended the outbreak is a legend; the film leaves the handle out rather than tell it. |
| 1 | His map showed only what the question needed. | A simplification: the map shows streets and some landmarks for orientation. The point is the selection, not an empty map. |
| 2 | Planning's question and its decision. | Verbatim from Planning's conceptual model, `models/marts/planning/_planning__conceptual.yml` 10-16: a mart's question lives in its own conceptual model (while it's still being worked out, it can be an open item in `requirements/`, deleted once it's agreed). The wallet app, the second consumer, asks its own question in `models/marts/wallet/_wallet__conceptual.yml`; the card shows Planning's only. The university, its people and its numbers are fictional. |
| 2 | The census report counted twelve; the model has to reach it. | `seeds/expected/planning/census_report.csv`: 2 + 3 + 5 + 2 = 12 as at 31 March 2026, published 14 April 2026 by the census team. `dbt show --select reconcile_census_report` gives difference 0 in all four faculties (run 30 September 2026). Reconciliation is the subject of later films. |
| 2 | The code and the data on screen are real; they run on dbt Core with DuckDB, in the series' repository. | Only the code and the data: the university, its people and the story's events are fictional, and the glossary cards are illustrative (chapter 3). `films/analytics-engineering/project/`. Run 30 September 2026: `dbt build --profiles-dir . --vars '{as_is_date: 2026-09-30}'`, dbt Core 1.12.5, dbt-duckdb 1.11.0: 146 nodes, PASS 143, WARN 1 (by design: an enrolment with no email, now LIM-SC-02), ERROR 0. Not rerun on the reorganised project. |
| 2 | The same project runs on Databricks with dbt Cloud. | "dbt Cloud" is the author's name for it; dbt Labs now calls it the dbt platform (its IDE is the Studio IDE, its explorer Catalog: getdbt.com/blog/updated-names-for-dbt-platform-and-features), to check on the day. `profiles.yml` holds a `databricks` target for dbt Core; dbt Cloud ignores `profiles.yml` and keeps the connection and credentials in the environment (the file's own comment, lines 1-2). The project's CI runs DuckDB; the Databricks target is the author's workspace. |
| 2 | Only the connection changes, and one function: the one that turns a key into a hash. | True of the SQL. The project also switches some things by target, in configuration rather than code (README, "What differs between engines"): where sources are read (CSV files through `external_location` on DuckDB, ingested tables on Databricks); primary and foreign keys (declared and informational on Databricks, left out on DuckDB by `macros/adapters/duckdb_constraints.sql`); `persist_docs` (on for Databricks only, `dbt_project.yml` 27-30); grants on the Planning marts; liquid clustering on `core_credential`. |
| 2 | The hash: `sha256` on DuckDB, `sha2(…, 256)` on Databricks, the same value. | `hash_key` is chosen per engine with `adapter.dispatch` (macro prefixes `duckdb__` and `databricks__`). Both functions return SHA-256 as a 64-character lower-case hex string. Checked here: DuckDB `sha256('SIS|S-20417')` = `0905e6e2b60bd76bfa5c6d3ed43ac6a4d55cf046c2c0cbce4c590300145f76a2`, identical to Python's `hashlib.sha256`. Databricks' `sha2` is documented to return the hex string of the SHA-2 digest; confirm on the day on a workspace. |
| 3 | The question touches four things: learner, credential, award, credit towards an award. | Three entities and one relationship that carries rules, each in the domain that owns it: learner, credential and credit towards an award in `models/core/student/_student__conceptual.yml` 22-84, award in `models/core/course/_course__conceptual.yml` 18-26; two simpler relationships, `holds` and `counts_towards` (student, 86-94), need no owner or rules of their own. Planning's own conceptual model lists the core entities its mart reads (`uses:` learner, award, credit towards an award); the credential reaches it through the credit. Units and enrolments appear in the sources as the evidence for credit, not as entities in this slice; on the university's map (`models/_shared/_shared__conceptual.yml`), units of study and unit enrolments are planned, for later questions. |
| 3 | A glossary with a term for everything. | Illustrative: the project has no enterprise glossary file. The cards on screen are generic terms, not a real catalog. The nearest thing is the university's map, `models/_shared/_shared__conceptual.yml`: its domains and key entities, no more than 50, most of them planned (fees are `student_fee`, in finance; staff have a domain of their own). |
| 3 | Noor agreed the scope with Planning and wrote down why. | DEC-PLN-01 in Planning's decision log, `models/marts/planning/_planning__decisions.yml` 10-18, decided on 1 October 2026 in the story. Each scope keeps its own log; `docs/decisions.md` is now an index generated from all of them (`scripts/generate/decisions.py`), not where a decision is written. |
| 4 | Each thing is written once, in YAML, with a hand-drawn diagram. | Each domain's conceptual model sits next to its models (`models/core/student/_student__conceptual.yml`; the award's in `models/core/course/_course__conceptual.yml`), and dbt doesn't parse it (`.dbtignore`). `scripts/generate/definitions.py` turns each definition into a doc block in the domain's `_<domain>__definitions.md`, which the models' YAML reads with `doc()`, and writes `seeds/reference/shared/key_sets.csv` from the key sets on the sources. The Mermaid `erDiagram` in `models/core/student/_student__conceptual.md` is drawn by hand; the physical diagram (`_student__physical.md`) is generated (a later film). The university's map, `models/_shared/_shared__conceptual.yml`, places each domain's entities among the others; the script fails if the map and the domains disagree. |
| 5 | A learner is their student ID; an award its code; a credential the ID its issuer gave it; each tagged with the system it comes from. | `business_key:` in `models/core/student/_student__conceptual.yml` 27-33 (learner) and 50-54 (credential), and `models/core/course/_course__conceptual.yml` 23-25 (award). A learner the student system doesn't know keeps the key of the first system that recorded them. "Tagged with the system" is the key set's code (`SIS`, `LMS`, `SC`), which names the issuing system, not the credential: the credential's key is the issuer's own identifier, qualified by it (`LMS|B-5010`). Key sets, matching and hashing are the next film's subject. |
| 5 | Mei owns learner, credential and award; the learning team owns microcredentials and badges. | `owner:` fields in each domain's conceptual model. Each key set is written once, on the source that issues it (`meta.key_set` in `sources/<system>/_<system>__sources.yml`, from line 16; DEC-PRJ-07), with its owner; `scripts/generate/definitions.py` generates `seeds/reference/shared/key_sets.csv` from them. The card shows the three sources' `code`, `system` and `owner` (17-19 in each) together, without their indent. The learning team also owns the `LMS` and `SC` key sets. |
| 6 | A microcredential shares a credential's identity and lifecycle; only the credit points differ. | DEC-STU-01 in the student domain's decision log, `models/core/student/_student__decisions.yml` 10-18. In the data, a platform badge is a microcredential when it carries credit points and a badge when it carries none (`int_credentials_unioned.sql`); run on 30 September 2026, `core_credential_v2` holds 8 awards (60 points each), 42 microcredentials (5 each) and 3 badges (0). |
| 6 | A different identity, grain or lifecycle: split. | A heuristic, not a law: another signal is attributes that apply to only one of the two; a different owner of a kind's details is not, on its own, a reason (the kinds carry their own owners). The skill writes the reason down as a proposal (`SKILL.md` 21). |
| 6 | A certificate of attendance stays out. | DEC-STU-02 (`models/core/student/_student__decisions.yml` 20-28), and, in the short-course source's log, DEC-SC-03, which began as gap GAP-SC-03 (`sources/short_courses/_short_courses__decisions.yml` 36-46); `int_credentials_unioned.sql` 72-80 keeps only certificates of completion. In the data, one current certificate of attendance, `SC|C-81` (First Aid, 0 credit points), and it isn't in `core_credential_v2` (checked 30 September 2026). |
| 7 | An AI agent drafts, following a skill kept in the project. | `skills/draft-the-conceptual-model/SKILL.md`; `AGENTS.md` at the project root. The film names no product. Agents in dbt Cloud (dbt Copilot, the dbt MCP server) are named only here, and their availability by plan is to check on the day. |
| 7 | The draft missed the clause; Mei added it. | The story's own event, placed on 2 October 2026 by DEC-STU-01 and DEC-STU-02 (`decided_on: 2026-10-02`). The skill's rule: "Don't approve a definition yourself" (`SKILL.md` 29). |

**Project files each snippet comes from** (checked against the files on 6 October 2026):

| Ch | File | Lines |
|---|---|---|
| 2 | [`models/marts/planning/_planning__conceptual.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/marts/planning/_planning__conceptual.yml) | 10-16 |
| 2 | [`profiles.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/profiles.yml) | 3-5, 7-8, 13-14 (trimmed with …) |
| 2 | [`macros/shared/keys.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/macros/shared/keys.sql) | 52-58 |
| 3 | [`models/marts/planning/_planning__decisions.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/marts/planning/_planning__decisions.yml) | 10, 12, 15-16 (trimmed with …) |
| 4 | [`models/core/student/_student__conceptual.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/core/student/_student__conceptual.yml) | 22-31 (trimmed with … mid-line 31) |
| 4 | [`models/core/student/_student__conceptual.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/core/student/_student__conceptual.md) | 9-14 |
| 5 | [`sources/student_system/_student_system__sources.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/sources/student_system/_student_system__sources.yml) · [`sources/learning_platform/_learning_platform__sources.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/sources/learning_platform/_learning_platform__sources.yml) · [`sources/short_courses/_short_courses__sources.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/sources/short_courses/_short_courses__sources.yml) | 17-19 in each, without their indent, under one comment |
| 6 | [`models/core/student/_student__conceptual.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/core/student/_student__conceptual.yml) | 55-63 |
| 6 | [`models/intermediate/student/int_credentials_unioned.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/intermediate/student/int_credentials_unioned.sql) | 72-80 |
| 7 | [`skills/draft-the-conceptual-model/SKILL.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/skills/draft-the-conceptual-model/SKILL.md) | 13-14, 21 (trimmed with …) |
| 7 | [`models/core/student/_student__conceptual.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/core/student/_student__conceptual.yml) | 44-49 |
| 7 | [`models/core/student/_student__decisions.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/core/student/_student__decisions.yml) | 10, 12, 16-17, 20, 22, 25-26 (trimmed: id, title, who and when) |

**dbt and Databricks documentation** (the pages behind each claim; on 30 September 2026 the pages couldn't be reached from the build machine, so each claim was checked against the project's own run instead; to confirm on the pages on the day):

- dbt: "About profiles.yml" (docs.getdbt.com/docs/core/connect-data-platform/profiles.yml); "DuckDB setup" and "Databricks setup" (docs.getdbt.com/docs/core/connect-data-platform/duckdb-setup, …/databricks-setup); "dispatch" (docs.getdbt.com/reference/dbt-jinja-functions/dispatch); "Connect data platform" in dbt Cloud, where the connection lives in the environment (docs.getdbt.com/docs/cloud/connect-data-platform/about-connections); "doc blocks" and `doc()` (docs.getdbt.com/reference/dbt-jinja-functions/doc); `persist_docs` (docs.getdbt.com/reference/resource-configs/persist_docs).
- Databricks: `sha2` function (docs.databricks.com/aws/en/sql/language-manual/functions/sha2); constraints, with primary and foreign keys informational (docs.databricks.com/aws/en/tables/constraints).
- DuckDB: `sha256` in the text functions (duckdb.org/docs/stable/sql/functions/text).

**Historical sources.**

- John Snow, *On the Mode of Communication of Cholera*, 2nd edition, London: John Churchill, 1855 (the map; the workhouse and brewery figures).
- UCLA Department of Epidemiology, Fielding School of Public Health, "John Snow" site (ph.ucla.edu/epi/snow.html): the outbreak's dates and the pump handle.
- Edward Tufte, *Visual Explanations*, 1997, chapter 2, and its critique in Tom Koch, *Cartographies of Disease*, 2005: what the map did and didn't prove.
- S. Johnson, *The Ghost Map*, 2006, for the general account; not relied on for figures.
- Checked 30 September 2026 against published accounts (a web search): the dates (31 August start; handle removed 8 September 1854) and the workhouse's 535 inmates and five deaths; to confirm in Snow (1855) itself. The claim that the handle's removal ended the outbreak is flagged as a legend and not told.

## Labs

| # | Lab | Kind | The mechanism people break |
|---|---|---|---|
| 1 | *Scope it* | pick | A vague request ("a dashboard of everything about credentials") and six candidate questions. Pick one with a decision behind it; the glossary cards it touches light. Pick one without a decision, and the slice never stops growing: every glossary card lights. |
| 2 | *What's in the slice?* | sort | Twelve glossary terms (learner, credential, award, credit towards an award, unit, enrolment, fee, timetable, room, staff, course review, library loan) into "the question touches it" and "stays out", for Planning's question. Unit and enrolment are the traps: the sources need them as evidence of credit, but they aren't entities in this slice. |
| 3 | *Combine or split* | pick | Five candidates against the credential: a badge, a microcredential, a certificate of attendance, a unit result, a graduate certificate. Pick one, and it's compared with a credential row by row (its key, its life, its grain, what it says), then gets its verdict: "a kind of credential", "its own entity" or "not a credential". Combine a unit result, and one credential per result appears: the grain breaks. |
| 4 | *Who owns the meaning?* | compose | Choose an owner (Mei, the learning team, Planning, Noor) for five parts of the model: two definitions and a rule, written in the domain's conceptual model, and two key sets, written on their sources. Give the learner's definition to Planning, and the picture shows the wallet team's meaning with no one to settle it. |

## Scenarios

Eight situations, in this order.

1. **Choose.** A new executive asks Jun to "model all our learning data first, then we'll ask questions." What does Jun propose? (Start from one question with a decision; model its slice; the next question extends it.)
2. **Spot the problem.** The agent's draft defines a learner as "a row in `student_system.learners`." (Defined by a source table: it leaves out platform users and short-course customers, and changes when the system does. The skill forbids it.)
3. **Choose.** Planning asks, mid-build, to add fee debt to the same model. (A new question, with its own slice and owners: finish this one, then scope the next.)
4. **Choose.** Short courses call their learners "customers"; the platform calls them "users". Which word goes in the model? (Learner, the owner's word, with a definition that covers both.)
5. **Spot the problem.** The glossary's definition of award disagrees with the registrar's, and the agent picks the glossary's. (The agent doesn't choose between meanings: it flags the conflict for the owner, Mei.)
6. **Choose.** The short-course system starts giving a certificate of attendance 5 credit points. Is it a credential now? (No: credit points don't change what it says, that someone was there. Take it to Mei, and record the gap.)
7. **Sort.** Noor proposes splitting microcredential into its own entity "because it has credit points". Sort the reasons into "a reason to split" and "not a reason": a different identifier; a different lifecycle; a different grain; an extra attribute; a different owner of its details. (Only the first three; an attribute and a kind's owner fit inside one entity.)
8. **Order.** A request with no decision ("just curious how many"). Put Jun's first moves in order: ask what it will decide; write the question and decision in the mart's conceptual model; list the entities it touches; name each owner; then look at the sources.

## Decisions taken

| Date | Decision |
|---|---|
| 30 September 2026 | Open in 1854 Soho with Snow's map: one question decides what goes on a map. The workhouse and brewery stay as labels; the pump handle legend is left out. |
| 30 September 2026 | The film says once, in *The question*, that the code and the data are real: dbt Core with DuckDB here, Databricks with dbt Cloud in the story, and only the connection and the hash function change. Every code and YAML card carries `runs on dbt Core · DuckDB` (on `profiles.yml`, beside the `duckdb` target; on `macros/keys.sql`, "(and Databricks)" since it shows both engines). Markdown cards (`docs/decisions.md`, `docs/conceptual-model.md`, `SKILL.md`) take no label: they are documents, and nothing runs them. |
| 30 September 2026 | The census report's twelve is named, not shown, as the number to reach. The film keeps the opening film's numbers out. |
| 1 October 2026 | Series read-through: the wallet app is named once in *The question*, as the second consumer that reads the same facts as they are today, so the next films can use it without introducing it. |
| 6 October 2026 | The example project was reorganised by application, data and business domains, so each domain can move to a project of its own. The film's cards show the files as they are now: the question in Planning's conceptual model, `models/marts/planning/_planning__conceptual.yml` (without the `also_served` line: the wallet asks its own question in its own conceptual model, so the narration still names it but the card no longer lights it); the scope as DEC-PLN-01 in Planning's decision log; the learner, the kinds and the credential in the student domain's conceptual model, with its hand-drawn diagram beside it; the key sets on the sources that issue them (`meta.key_set`); the two decisions of 2 October as DEC-STU-01 and DEC-STU-02 in the student domain's log, whose `decided_by` and `decided_on` light on "her name" and "the date"; `macros/shared/keys.sql` and `models/intermediate/student/int_credentials_unioned.sql`. The decision cards, now YAML, keep no label, like the other documents. No narration line changed. Each chapter, and each lab and scenario that's about a file, links to its files in the repository. |

## Open

1. **The learning team's face.** Drawn as Tom Whitfield, from *From words to data*; to confirm.
2. **Voice.** "dbt" is voiced "D B T" by the series' shared list, as in the opening film, so the film has no respelling of its own; "ID" is voiced "I D" the same way. Check "duck dee bee" and "May" by ear; the key strings, hashes and emails stay on screen only.
