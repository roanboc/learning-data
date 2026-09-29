# Film 1 · The opening: plan

*The first 2 minutes 50 seconds of the series' first film, working title* A model is not a transformation. *Plan v0.1, 29 September 2026. The narration is a first draft, at the site's pace of about 125 to 135 words a minute.*

## What the opening has to do

1. **Pick up where *From words to data* ended.** Its last line is "agree what things are, write it down, and keep it true". This series starts from "write it down": the model is written, and now it has to be built.
2. **Work for someone who hasn't seen that series.** The narration states what's needed as facts, never "as you saw". One line says where the full story is, and the page links to it.
3. **Introduce dbt as one tool among several**, for the job of turning data into what the model says.
4. **End on the film's question:** dbt calls each query a model, but the model is something else.

## The picture that carries it: the blueprint

A blueprint says exactly what a building will be, and lays no bricks. That maps onto the series:

| In the building | In the series |
|---|---|
| The blueprint | The data model: meaning, identity, grain and time |
| The building work, step by step | Transformations: dbt's "models" |
| The site, with materials as they arrive | Sources in bronze, as they arrived |
| The inspection | Tests and contracts (film 5) |
| The trades, each with its own copy | Domains and consumers (film 7) |

The blueprint is drawn white on blue, and the credential model takes the same look in chapter 4, so the image returns without being explained twice.

## Chapters

### 1 · A plan is not a building · 0:00–0:25

**Narration.** In the eighteen-seventies, architects began copying their drawings as blueprints: white lines on blue paper, one copy for every trade on site. A blueprint says exactly what the building will be. Where every wall stands, how thick it is, and what it carries. It doesn't lay a single brick.

**Picture.** The warm past, with "1870s" in the corner. A drawing on a frame in sunlight turns blue, and its lines turn white. Copies pass to a mason and a carpenter. Then an empty site, and the drawing held up over it.

**On screen.** 1870s · blueprint · every wall · how thick · what it carries

### 2 · Where we left off · 0:25–1:05

**Narration.** Data has blueprints too. At a university, four offices once gave four different answers to one question: how many credentials did we award? So they agreed what a credential is, and wrote it down as a model. A model answers four questions. What a thing is. What makes it the same one everywhere. What one row holds. And when each thing was true. Meaning, identity, grain and time. Version three of the university's model has just been approved. The series *From words to data* tells that story; this is all you need from it.

**Picture.** The films' dark glass. Four office cards, each with its own count of credentials, then one agreed definition between them. The triangle from *What's in a word* shrinks into the corner as the model sketch draws: learner, credential, award. Four icons light as they're named. The gold "v3 · approved" stamp from *Keeping it true* lands on the sketch. A card slides in and out: "From words to data · seven films".

**On screen.** four offices · four answers · one definition · meaning · identity · grain · time · v3 · approved · From words to data · seven films

### 3 · Many shapes, one model · 1:05–1:30

**Narration.** A model can be written down in many shapes: a normalised core, stars, a data vault, anchors, hooks, one wide table per entity. Each has its champions. Look inside any of them, and you find the same four answers. This series takes a middle way. Integrate on business keys, keep every version, and serve each entity as one wide row, with stars where people need them.

**Picture.** The shape cards and glyphs from *Many ways to read* and *Keeping it true* fan out, each named as it arrives. The four icons light in every card at once. The cards fold into one line of three stages: keys, versions, then a wide row with a small star beside it.

**On screen.** normalised core · stars · data vault · anchors · hooks · wide tables · the same four answers · the middle way · business keys · every version · one wide row · stars where needed

*This is the only place in the series where approaches are named. The middle way is described by what it does, not by where each part came from.*

### 4 · Someone has to build it · 1:30–1:55

**Narration.** But an approved model is still a blueprint. The data arrives from three systems, each with its own keys, its own codes, and every version it has ever had. Someone has to turn what arrives into what was agreed, and show that it matches. That's the work of an analytics engineer, and this series follows one.

**Picture.** The v3 sketch turns white on blue: a blueprint. Below it, the platform from *The Inner Life of Data*. Three sources pour into bronze: the student system, the learning platform and the short-course platform, each in its colour, one learner arriving under three keys. A dashed gap opens between the blueprint and the data. The analytics engineer steps into it.

**On screen.** blueprint · student system · learning platform · short-course platform · three keys · every version · what arrives → what was agreed · analytics engineer

### 5 · The building work · 1:55–2:30

**Narration.** The building work is transformation: select, join, clean and reshape. It can be done in notebooks, in stored procedures, or in pipeline tools. dbt is one of the most widely used. Each transformation is a SQL query, in its own file. dbt works out the order from how the queries refer to each other, builds each result as a table or a view on the platform, and keeps the tests and documentation beside the code.

**Picture.** Four tool cards: notebooks, stored procedures, pipeline tools, dbt. Three dim; dbt lights. A file opens: `select … from {{ ref('stg_learners') }}`. More files arrive, and arrows join them into a small graph, left to right. Tables and views appear in silver and gold as each file runs. A YAML file sits beside a model; its tests tick green.

**On screen.** transformation · select · join · clean · reshape · notebooks · stored procedures · pipeline tools · dbt · one query, one file · ref() · the order · table · view · tests · docs

### 6 · The name that misleads · 2:30–2:50

**Narration.** dbt calls each of these queries a model. It's a useful name, and a misleading one. A query is one step of the building work. The model is the blueprint. This series is about keeping the two apart, and connecting them.

**Picture.** The label "model" sits on a `.sql` file. It lifts off and moves to the blueprint; the file is relabelled "transformation". A thin line runs from the file to the part of the blueprint it builds. The title appears.

**On screen.** model? · transformation · the model · keep them apart · connect them · *A model is not a transformation*

**The film continues** with *300 models*, *Where the model lives*, *The ten steps* and *Pull back*, as in the [proposal](proposal.md#a-model-is-not-a-transformation).

## For viewers who haven't seen *From words to data*

- **In the narration:** chapter 2 states the four answers and the approved model as facts, and names the series once.
- **On the page:** a short "Before this film" note: *Keeping it true* for the approved model, and *Many ways to read* for the shapes. Both are optional.
- **Pause and think**, after chapter 2: "Two teams count credentials and get different numbers. Is the data wrong, or the meaning?" The answer links to the lab of *What's in a word*.
- **No numbers or terms from the earlier series that aren't explained on screen.** For example, the 131 and 118 from *A Sharper Sketch* don't appear.

## Set-ups and pay-offs

| Set up here | Paid off |
|---|---|
| The blueprint, one copy for every trade | Domains and consumers, each with their contract (film 7) |
| "Show that it matches" | Tests, contracts and reconciliation (films 5 and 8) |
| One learner, three keys | Key sets and hashing (film 3) |
| Every version it has ever had | As it is, and as it was (film 4) |
| A thin line from a file to the blueprint | Where the model lives: YAML and Markdown (this film, then film 9) |

## Rigour to check

- **Blueprints:** the cyanotype process (Herschel, 1842) and its use for copying architectural and engineering drawings from about the 1870s. Record the dates in the rigour sheet; on screen, only "1870s".
- **dbt:** a model is a `SELECT` in a `.sql` file (Python models also exist); `ref()` sets the order; materialisations include view, table and incremental; tests and docs live in YAML. "One of the most widely used" needs a source, or softer words: "a widely used tool".
- **Alternatives:** kept generic (notebooks, stored procedures, pipeline tools), so no product is compared.

## Decisions for the author

1. **The cold open in the past.** Keep the series' habit of starting in the past, with the blueprint (recommended), or open straight on the university.
2. **The analytics engineer.** A new character, or Noor, the architect from *From words to data*, stepping into the role. A new character makes the handover visible: Noor owns the blueprint, the engineer builds it.
3. **Naming the alternatives to dbt.** Generic labels (recommended), or product names on screen.
