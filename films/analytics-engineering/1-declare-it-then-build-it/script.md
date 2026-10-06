# In the weeds of data crafting · Declare it, then build it: script

*The script of the opening film of In the weeds of data crafting, a technical series for analytics engineers, as built: 5:36, in eleven chapters, in English, 6 October 2026. The narration lives in [`source/src/narration.js`](source/src/narration.js) and the pauses in [`source/src/breath.js`](source/src/breath.js); this page and those files say the same thing, and where they differ, the source wins. The timings are the voiced ones (see [Pacing report](#pacing-report)). The title, *Declare it, then build it*, is the series' tagline: this film introduces the whole series.*

## The promise

A practitioner follows every line, and a data architect agrees with it. The film opens the series and says what it's about: the model is the blueprint, and dbt is how you build it. A data model says what data must be: its meaning, identity, grain and time. A transformation makes data that way. dbt, a widely used tool for transformations, calls each of its queries a model, but a query is one step of the building work, not the model. The model lives beside the code, in YAML, in a conceptual model and in a decision log, and tests check that the tables match it. Jun builds it in ten steps, and the next eight films take them in turn. **Declare it, then build it.**

## The story in one paragraph

In the 1870s, architects began copying drawings as blueprints, one for every trade: a blueprint says exactly what a building will be, and lays no bricks. Data has blueprints too. At a university, four offices once gave four answers to how many credentials were awarded; they agreed what a credential is and wrote it down as a model, which answers four questions: meaning, identity, grain and time. Version 3 has just been approved. Many shapes can hold a model, and each holds the same four answers; this series takes a middle way. But the data arrives from three systems, each with its own keys, codes and versions, and someone has to turn it into what was agreed: Jun, the university's analytics engineer. The building work is transformation, and Jun's team does it with dbt: one SQL query per file, run in the order their references set, built as tables and views, with tests and documentation beside the code. dbt calls each query a model. It isn't. A year on, the project could hold three hundred of them, in four layers, each folder named for its domain; most are steps, and only the core holds what the blueprint names. The model lives beside the code, in YAML, in a conceptual model and in a decision log, and the tests check the tables against it. Jun works in ten steps, with an agent that helps at each and a person who approves each, and the next eight films take them in turn.

## What each object stands for

| Object | Stands for |
|---|---|
| A drawing turning blue in sunlight, with white lines | A blueprint: what a building will be, exactly |
| Copies passed to a mason and a carpenter | One plan, many trades: later, many domains and consumers |
| Four office cards with four counts, then one definition | The problem *From words to data* solved: agree the meaning first |
| The model sketch: learner, credential, award | The credential model, from *From words to data* |
| Four icons: Aa, a key, one row, a clock | The four answers: meaning, identity, grain and time |
| The gold stamp "v3 · approved" | The model agreed at the end of *Keeping it true* |
| Shape cards with their glyphs | The known modelling approaches, named once in the series |
| Three stages: keys, versions, a wide row with a small star | The series' middle way |
| The sketch drawn white on blue | The model as a blueprint |
| Three coloured streams into bronze, one learner under three keys | Sources as they arrive |
| A dashed gap between blueprint and data | The work to do: from what arrives to what was agreed |
| Jun, outlined in cyan | The analytics engineer (technical side, producing data) |
| Noor, outlined in cyan, handing over the blueprint | The architect: owns the model; Jun builds it |
| Four tool cards, three dim | Ways to transform data; dbt is one |
| A `.sql` file with `ref()` | A dbt model: one query |
| Arrows between files | The order, worked out from references |
| The label "model" lifting from a file to the blueprint | The name that misleads |
| A graph of 300 small nodes in four columns | A dbt project: staging, intermediate, core and marts, each folder named for its domain |
| A few nodes glowing gold | Core models: the entities the blueprint names |
| A YAML card, and a Markdown card with the conceptual model and the decision log, beside the graph | Where the model lives |
| Tests ticking green between YAML and tables | Checking that the tables are what the model says |
| A loop of ten steps, with a teal dot and a gold tick at each | The process; the agent helps (teal), a person approves (gold) |
| Nine film cards on the loop | The series |

## Script

### 1 · A plan is not a building · 0:00–0:25

**Narration.** In the 1870s, architects began copying their drawings as blueprints: white lines on blue paper, one copy for every trade on site. A blueprint says exactly what the building will be: where every wall stands, how thick it is, and what it carries. It doesn't lay a single brick.

**Picture.** The warm past, with "1870s" in the corner. A drawing in a frame, in sunlight, turns blue and its lines turn white: the plan of a small building, with walls, thicknesses and a beam. Copies pass to a mason and a carpenter. Then an empty site, and the blueprint held up over it. Wordless breather: the blueprint over the empty site.

**On screen.** 1870s · blueprint · every wall · how thick · what it carries · no bricks laid

### 2 · Where we left off · 0:25–1:07

**Narration.** Data has blueprints too. At a university, four offices once gave four different answers to one question: how many credentials did we award? So they agreed what a credential is, and wrote it down as a model. A model answers four questions. What a thing is. What makes it the same one everywhere. What one row holds. And when each thing was true. Meaning, identity, grain and time. Version three of the university's model has just been approved. The series *From words to data* tells that story. This is all you need from it.

**Picture.** The films' dark glass. "Data has blueprints too." Then the question, and four office cards (registrar 7,420, short courses 10,600, careers 14,650, learning platform 26,900: the numbers from *What's in a word*), then one definition card: "credential: a trusted, checkable claim about what someone knows · one definition · agreed". The model sketch draws: Learner, Credential, Award, with the lines between them. The four icons light as they're named. The gold "v3 · approved" stamp lands on the sketch. A card, bottom right: "The whole story · From words to data · seven films".

**On screen.** how many credentials did we award? · four offices · four answers · one definition · meaning · identity · grain · time · v3 · approved · From words to data · seven films

### 3 · Many shapes, one model · 1:07–1:35

**Narration.** A model can be written down in many shapes: a normalised core, stars, a data vault, anchors, hooks, one wide table per entity. Each has its champions. Look inside any of them, and you find the same four answers. This series takes a middle way. Integrate on business keys, keep every version, and serve each entity as one wide row, with stars where people need them.

**Picture.** The shape cards from *Many ways to read* and *Keeping it true* fan out, each with its glyph, named as it arrives. The four icons light in every card at once. The cards fold into one line of three stages: a key, a stack of versions, then a wide row with a small star beside it.

**On screen.** normalised core · stars · data vault · anchors · hooks · wide tables · the same four answers · a middle way · business keys · every version · one wide row · stars where needed

*The only place in the series where approaches are named. The middle way is described by what it does, not by where each part came from.*

### 4 · Someone has to build it · 1:35–2:01

**Narration.** But an approved model is still a blueprint. The data arrives from three systems, each with its own keys, its own codes, and every version it has ever had. Someone has to turn what arrives into what was agreed, and show that it matches. That's the work of an analytics engineer. At the university, that's Jun.

**Picture.** The v3 sketch turns white on blue: a blueprint, echoing chapter 1. Below it, the platform from *The Inner Life of Data*. Three streams pour into bronze, each in its colour: student system, learning platform, short-course platform. One learner arrives three times, under `S-20417`, `u-88213` and an email. Status codes differ (`ENR`, `active`, `1`). Behind one row, older versions stack. A dashed gap opens between the blueprint and the data. Noor hands the blueprint to Jun, who steps into the gap.

**On screen.** still a blueprint · student system · learning platform · short-course platform · three keys · three codes · every version · what arrives → what was agreed · show that it matches · analytics engineer · Jun

### 5 · The building work · 2:01–2:36

**Narration.** The building work is transformation: select, join, clean and reshape. It can be done in notebooks, in stored procedures, or in pipeline tools. Jun's team uses dbt, a widely used tool for it. Each transformation is a SQL query, in its own file. dbt works out the order from how the queries refer to each other, builds each result as a table or a view on the platform, and keeps the tests and documentation beside the code.

**Picture.** Four tool cards: notebooks, stored procedures, pipeline tools, dbt. Three dim; dbt lights. A file opens:

```sql
-- models/staging/student_system/stg_student_system__learners.sql
-- one query, in its own file
select
    upper(trim(student_id)) as student_id,
    nullif(lower(trim(email)), '') as email,
    trim(status_code) as status_code
from {{ source('student_system', 'learners') }}
```

A second file arrives, `models/intermediate/student/int_learners.sql`:

```sql
-- models/intermediate/student/int_learners.sql
matched_keys as (
    select * from {{ ref('int_learner_keys_matched') }}
),
learner_keys as (
    select * from {{ ref('int_learner_keys') }}
```

Its two `ref()` lines light, and an arrow runs from the first file to it: "ref() sets the order". On the right, "on the platform": the staging model appears as a view and the intermediate one as a table. A YAML card writes itself, and ticks green:

```yaml
# models/intermediate/student/_int_student__models.yml
- name: int_learners
  columns:
    - name: learner_key
      description: '{{ doc("learner_key") }}'
      data_tests: [unique, not_null]
```

**On screen.** transformation · select · join · clean · reshape · notebooks · stored procedures · pipeline tools · dbt · one query, one file · ref() · the order · table · view · tests · docs

**In the repo.** [`models/staging/student_system/stg_student_system__learners.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/staging/student_system/stg_student_system__learners.sql) · [`models/intermediate/student/int_learners.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/intermediate/student/int_learners.sql) · [`models/intermediate/student/_int_student__models.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/intermediate/student/_int_student__models.yml)

### 6 · The name that misleads · 2:36–3:01

**Narration.** dbt calls each of these queries a model. It's a useful name, and a misleading one. A query is one step of the building work. The model is the blueprint. This series is about keeping the two apart, and connecting them. It's for analytics engineers, and it goes into the weeds.

**Picture.** The label "model" sits on the staging file, `stg_student_system__learners.sql`. It lifts off and moves to the blueprint; the file is relabelled "transformation". A thin line runs from the file to the part of the blueprint it builds. A tag: "for analytics engineers · into the weeds". Wordless breather: the title card, with the series' mark (three blades of grass): "IN THE WEEDS OF DATA CRAFTING", *Declare it, then build it*, "the model is what you declare; a dbt model is how you make it", and "a technical series for analytics engineers".

**On screen.** model? · transformation · one step of the building work · the model · keep them apart · connect them · for analytics engineers · into the weeds · IN THE WEEDS OF DATA CRAFTING · *Declare it, then build it* · a technical series for analytics engineers

**In the repo.** [`models/staging/student_system/stg_student_system__learners.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/staging/student_system/stg_student_system__learners.sql)

### 7 · Three hundred models · 3:01–3:34

**Narration.** A year from now, Jun's project could hold three hundred of these files, in four layers, each folder named for its domain. Most are steps: one tidies a source, one matches a learner's three keys, one stitches their history into a single timeline. Only the core holds what the blueprint names: a learner, a credential, an award. The marts serve each consumer what it asked for. So which file is the data model? None of them.

**Picture.** The lineage graph grows to about 300 small nodes in four columns: staging, intermediate, core, marts. Three nodes are picked out as they're named, with a one-line label each (tidy a source · match three keys · one timeline). A handful of core nodes glow gold, each labelled with an entity from the blueprint. Two marts on the right carry consumer badges (planning, the learner's wallet). The question hangs over the graph; every node dims.

**On screen.** 300 files · staging · intermediate · core · marts · tidy a source · match three keys · one timeline · learner · credential · award · for planning · for the wallet · which file is the data model? · none of them

**In the repo.** [`models/`](https://github.com/roanboc/learning-data/tree/main/films/analytics-engineering/project/models/)

### 8 · Where the model lives · 3:34–4:08

**Narration.** The model lives beside the code. In YAML: what one row holds, which key makes it unique, how it relates to the rest, and the contract each table promises. In a conceptual model, with a diagram anyone can read: what each thing means. And in a decision log beside it: why it was decided that way. The queries make the tables. The YAML and the Markdown say what those tables must be, and the tests check that they are.

**Picture.** Beside the graph, a YAML card writes itself, each part lighting as it's named:

```yaml
# models/core/student/_core_student__models.yml · YAML
models:
  - name: core_credential
    description: '{{ doc("credential") }}'
    config:
      access: public
      contract: {enforced: true}
      meta: {grain: one row per credential}
    columns:
      - name: credential_key
        data_tests: [unique, not_null]
      - name: learner_key
        data_tests:
          - relationships:
              arguments: {to: ref('core_learner'), field: learner_key}
```

Then a Markdown card, `core/student/_student__conceptual.md`: "# Credential", its definition and a small diagram (Learner, Credential, Award). Below them, the decision log, `_student__decisions.yml`, with one entry: "DEC-STU-01 · A microcredential is a kind of credential. Agreed 2 Oct 2026 · Mei, registrar's office". The lineage graph sits on the left, its core lit. Four tests tick green, one by one: unique, not_null, relationships, contract.

**On screen.** The model lives beside the code · YAML · one row per credential · the key · relationships · the contract · Markdown · the conceptual model · what it means · the decision log · DEC-STU-01 · why · tables ← the tests check → what the model says · unique · not_null · relationships · contract

**In the repo.** [`models/core/student/_core_student__models.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/core/student/_core_student__models.yml) · [`models/core/student/_student__conceptual.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/core/student/_student__conceptual.md) · [`models/core/student/_student__decisions.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/core/student/_student__decisions.yml)

### 9 · Ten steps · 4:08–4:41

**Narration.** Jun works in ten steps. Start from a question. Learn what the sources really hold. Define what each consumer needs. Name the gaps, and write the contracts. Write the tests, before any code. Build, layer by layer. Validate against a number people trust. Review and ship. Keep each fact written once. And let the model evolve without breaking anyone. An AI agent can help at every step. At every step, a person approves.

**Picture.** A loop of ten stations, lighting one by one as they're named, each with a small glyph: a question mark, a magnifier over a table, two consumer badges, a gap with a contract card, tests, four layers, a scale weighing two numbers, a pull request, a single page, a version stack. The agent's teal orb from *Keeping it true* visits each station, leaving a teal dot; a gold tick follows it at each.

**On screen.** 1 a question · 2 the sources · 3 the consumers · 4 gaps and contracts · 5 tests first · 6 build in layers · 7 validate · 8 review and ship · 9 written once · 10 evolve · an agent helps · a person approves

### 10 · The series · 4:41–5:16

**Narration.** The next eight films take the steps in turn. Scoping a model from a question. What makes a learner the same one across systems, and how keys and hashes make it explicit. Grain and time. Contracts and tests. Building in layers. Who owns what, across domains. Working with an agent, responsibly. And writing it all down, once. Everything they show is real code and real data. It runs on dbt Core, with DuckDB, and you can run it yourself.

**Picture.** Eight film cards arrive on the loop, each settling beside the steps it covers, with its working title. The card for this film, "1 · this film · Declare it, then build it", sits at the centre of the loop, lit. Then a label under the heading: real code, real data, runs on dbt Core with DuckDB (the example project in `../project/`).

**On screen.** 2 · Start from a question · 3 · What makes it the same one · 4 · One row of what, and when · 5 · Promises and proofs · 6 · Built in layers · 7 · Who owns what · 8 · An agent on the team · 9 · Written once · real code · real data · runs on dbt Core · DuckDB

### 11 · Pull back · 5:16–5:36

**Narration.** A blueprint says what a building will be. The building work makes it true. In data, the model is the blueprint, and dbt is one way to build it. Declare it. Then build it.

**Picture.** The warm past and the dark glass side by side: the 1870s blueprint over a finished building; the credential blueprint over the lineage graph, its gold core nodes lit. Wordless end card: "The model is the blueprint. dbt is how you build it.", the series' mark, *Declare it, then build it* · In the weeds of data crafting · Learning Data.

**On screen.** 1870s · the blueprint · the building work · the model · the building work: transformations · built with dbt · The model is the blueprint. dbt is how you build it. · *Declare it, then build it*

## Pause and think

Four stops, one question each.

| After | Question | Answer, in short |
|---|---|---|
| 2 · Where we left off | Two teams count credentials and get different numbers. Is the data wrong, or the meaning? | Usually the meaning: each counts what it thinks a credential is. Agree the meaning first. Links to the lab of *What's in a word*. |
| 6 · The name that misleads | dbt shows you a file called a model. What does it actually hold? | One query: a step that makes one table or view. The data model is what that table must be. |
| 8 · Where the model lives | You need to know what one row of a table means. Where do you look? | In its YAML (the grain, the key, the contract) and the conceptual model beside it (what each thing means), not in the SQL. |
| 9 · Ten steps | An agent drafts your tests and your SQL. What's still yours? | Approving: the meaning, the contract and the change. The agent drafts and checks, with evidence. |

## Rigour sheet

| Chapter | What the film says | What an expert would add, or what it simplifies |
|---|---|---|
| 1 | In the 1870s, architects began copying drawings as blueprints. | The cyanotype process was invented by John Herschel in 1842; ready-sensitised paper made it common for copying architectural and engineering drawings from about the 1870s. Dates to confirm. Blueprints were later replaced by diazo prints and then digital drawings. |
| 1 | A blueprint says exactly what the building will be. | Builders also work from specifications and change orders; the film keeps the drawing as the one image. |
| 2 | Four offices gave four answers; they agreed a definition. | Told in *What's in a word*. The university and its numbers are fictional. |
| 2 | A model answers four questions: meaning, identity, grain and time. | The series' own summary, from *Keeping it true*; relationships and rules sit inside meaning. Time often has two sides: when a fact was true and when it was recorded. |
| 3 | Many shapes; each holds the same four answers. | The approaches, with their sources, are in the rigour sheet of *Keeping it true*. The film credits no mechanism to any of them. |
| 3 | A middle way: business keys, every version, wide rows, stars where needed. | This is the series' pattern, not a named standard. It integrates on business keys without building a full set of vault tables. |
| 4 | Data arrives with every version it has ever had. | The series assumes ingestion keeps every version (SCD2) and identifies system keys; how that's done is out of scope. |
| 5 | Transformation can be done in notebooks, stored procedures or pipeline tools; dbt is widely used. | Labels are generic, so no product is compared. dbt is open source (dbt Core), with a managed service (dbt Cloud, which the series uses). "Widely used" to be backed by a source, such as dbt Labs' published user figures, checked on the day. |
| 5 | Each transformation is a SQL query in its own file; dbt works out the order from references. | dbt also supports Python models. `ref()` and `source()` build the dependency graph (a DAG). Materialisations include view, table, incremental and ephemeral; on Databricks, results are Delta tables and views in Unity Catalog. |
| 6 | dbt calls each query a model. | dbt's documentation defines a model as a SQL or Python file that holds a `select`; the name is historical, and widely used. |
| 7 | 300 files, in four layers: staging, intermediate, core, marts, each folder named for its domain. | Illustrative. dbt's guidance uses staging, intermediate and marts; this series adds a core layer for the enterprise contract. Large projects have hundreds to thousands of models. In the example project, staging is split by source system, intermediate and core by data domain (`student`, `course`, following the reference model, TCSI), and the marts by consumer (`planning`, `wallet`): `docs/conventions.md`, *Domains*. |
| 8 | YAML holds grain, key, relationships and contract; a conceptual model holds meaning, with a diagram, and a decision log holds why; tests check. | `contract: {enforced: true}` checks column names and types at build; on Databricks, `not_null` and `check` constraints are enforced and primary and foreign keys are informational, so tests do the checking. `data_tests` is the current key for tests (dbt 1.8+), and recent versions of dbt expect a generic test's arguments under `arguments:`, as shown; to check against the dbt version in use. Grain has no built-in field; `meta` holds it. Doc blocks (`{% docs credential %}`) keep long text in Markdown. The example is one row per credential, so the learner is a relationship, tested against `core_learner`. In the example project, each domain's conceptual model is written by hand (`_student__conceptual.yml`, with the diagram in `_student__conceptual.md`), its definitions are generated into doc blocks (`_student__definitions.md`), and each decision is an entry in the domain's decision log (`_student__decisions.yml`, YAML that dbt doesn't read). The cards are simplified from those files. |
| 9 | Ten steps; an agent helps at each, a person approves each. | The process is the series' own, from the author's practice. What agents can do in dbt Cloud (an AI assistant, an MCP server) is checked on the day, and named only in the rigour sheets. |

## Sources

- To check: the cyanotype (Herschel, 1842) and its use for architectural drawings from the 1870s.
- dbt documentation: models, `ref()` and `source()`, materialisations, model contracts, constraints on Databricks, `access`, `data_tests`, doc blocks, and the guide "How we structure our dbt projects". To check on the day.
- dbt Labs: a published figure for how widely dbt is used, or soften "widely used". To check.

## Pacing report

```
chapter      duration   wpm  voice  longest quiet  notes
plan            25.2s   117    67%           4.2s
recap           41.6s   136    74%           1.8s
shapes          28.7s   138    80%           1.8s
build           25.4s   132    69%           2.4s
work            34.9s   133    79%           2.6s
name            25.4s   120    65%           5.4s
models          32.8s   139    77%           1.8s
lives           34.0s   139    72%           2.6s
steps           33.0s   133    78%           3.2s
series          35.5s   134    81%           2.6s
end             19.6s   104    50%           6.0s

total 5:36.0, 734 words, 131 wpm, voice 73% of the time, 179 wpm while speaking
sentences with under 0.5 s after them: 0; stops of 2.5 s or more inside chapters: 0
```

No chapter is over the series' limit of 140 words a minute. *Three hundred models* and *Where the model lives*, whose lines grew on 6 October 2026, are at 139: longer holds after the new lines, and after the YAML line, keep them under it.

## Decisions taken

| Date | Decision |
|---|---|
| 29 September 2026 | Cold open in the past, with the blueprint. |
| 29 September 2026 | A new character, Jun, the analytics engineer; Noor, the architect, hands over the blueprint. |
| 29 September 2026 | Alternatives to dbt have generic labels. |
| 29 September 2026 | The film shows what the series covers: the ten steps, then the eight films that follow. |
| 30 September 2026 | The series title: *In the weeds of data crafting*, a technical series for analytics engineers. The title card and the narration say who it's for. |
| 30 September 2026 | After the first cut's review: the sound is quieter and in step with the picture. Nothing loops (no pulse, walking bass, repeated figures or random notes); the music is sustained chords, and every effect is something appearing on screen, at that moment. No high tones: knocks, muffled keys, paper and low felt notes instead of chimes, pings, shimmers and hi-hats. |
| 30 September 2026 | Motion with weight: things arrive with a spring, every shot drifts, and the model, the code file, the lineage graph and the loop carry across the cuts; the video adds motion blur and a soft glow (a film grain was tried and dropped: it made the video more than twice as large, 123 MB against 53 MB). The callouts on the 1870s plan, the blueprint Noor hands to Jun, the tags that sat on borders and the title and end cards were made readable, after a review of a still every 2 seconds. |
| 6 October 2026 | Renamed from *A model is not a transformation* to *Declare it, then build it*, the series' tagline, because the film introduces the whole series: the model as the blueprint, dbt as how you build it, and the ten steps. The title card, this film's card in *The series* and the end card ("The model is the blueprint. dbt is how you build it.") follow. The example project was reorganised by application, data and business domains (sources and staging by system, intermediate and core by data domain, marts and exposures by consumer), so each domain can move to its own project; the cards show the files as they are now: `models/staging/student_system/`, `models/intermediate/student/` and `_int_student__models.yml`, `models/core/student/_core_student__models.yml`, and the student domain's conceptual model (`_student__conceptual.md`) with its decision log (`_student__decisions.yml`, DEC-STU-01). Two narration lines changed: "A year from now, Jun's project could hold three hundred of these files, in four layers, each folder named for its domain." and "In a conceptual model, with a diagram anyone can read: what each thing means. And in a decision log beside it: why it was decided that way." Each chapter that shows project files links them (**In the repo.**). |

## Open

1. **Jun's look.** First pass: [the character card](../characters/card-jun.jpg).
2. **Publishing.** A page on the site, Spanish captions, Pause and think, labs and scenarios, and the release workflow's entry.
