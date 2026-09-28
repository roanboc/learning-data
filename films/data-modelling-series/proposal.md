# From words to data

*Proposal for an advanced series on data modelling, v0.1. Status: an idea, for the author to decide. Nothing here is scripted or made yet. The title is a working title (see the decisions at the end), and so is this folder's name: rename it before any of its films is released, never after.*

## The idea

Four films, from the author's brief (28 September 2026):

1. How we understand the world through language and define it, how people have organised concepts through history, and how that shapes our digital world. Why it matters to a business even if technology didn't exist. Conceptual only.
2. How that links to systems and technology in a business, and why conceptual (above all) and logical models matter.
3. Modelling variants for transactional, analytical and hybrid systems, including the new hybrid databases.
4. How semantic layers, ontologies, industry standards and AI can help keep it all right, end to end.

## Analysis

**What works**

- **The order is right: meaning, then systems, then shapes, then upkeep.** Most material on modelling starts with notation or a tool. Starting with language explains *why* models exist, and it's the part that never goes out of date.
- **It continues what *A Sharper Sketch* started.** That film's lesson was "the difference isn't in the data, it's in the meaning". This series explains where meaning comes from, and how to keep it.
- **Opening with a film that has no technology is the strongest and rarest idea.** It shows the business that the model is theirs, not IT's. Leaders who would never watch a film about databases can watch this one.
- **The ending is timely.** AI agents answer only as well as the meaning they can read, so semantic layers and ontologies are now a business topic, not just an architecture one.

**What to change**

- **Give the series one thing to follow.** Four films on four themes risk becoming four lectures (PLAYBOOK §1: follow one thing from start to finish). Follow one new concept, from a word in a meeting to a number an AI agent answers. *A Sharper Sketch* has already set it up: its last scene asks "how do we count short courses and microcredentials?", and the stamp flickers "sketch v3?". This series is v3.
- **The brief's videos on variants and on upkeep each hold two or three films' worth.** At the site's pace, about 125 to 130 words a minute, a 6-minute film is around 800 words and carries six to eight ideas. Transactional, analytical and hybrid each need their own side-by-side comparison. Semantic layers, ontologies and standards fill one film; AI keeping them current fills another. Recommended: seven films of 6 to 7 minutes, not four long ones. A four-film version is below, with what it loses.
- **Keep *Before we count* from becoming a history slideshow.** Pick five moments, each teaching one modelling idea, and frame them with a present-day problem the business solves on paper.
- **Don't repeat *A Sharper Sketch*.** It already teaches grain, the three levels, reference models and versioning. *Older than the systems* shouldn't explain the three levels again; it shows why they pay off across many systems.
- **Add what the brief doesn't name but the series needs:** identity (what makes one thing one thing, across systems), the same word meaning different things in different parts of a business (and when that's fine), who owns each definition, and how history is kept.
- **Clear up two common confusions on the way.** Bronze, silver and gold describe how refined data is, not what shape it has. A glossary, an ontology and a semantic layer are different things that stack, not rivals.
- **Make the fast-moving parts last, and easy to update.** Hybrid databases, semantic layer formats and AI tools change names and maturity every few months. Keep product names to labels and the rigour sheet, script those films last, and check them on the day (PLAYBOOK §3).
- **Be concrete about AI, not hyped.** Show what it does well (noticing drift, drafting changes and mappings, answering from governed definitions) and where it fails (confident answers when meaning is missing). Keep the rule from *The Inner Life of Data*: the agent recommends; people approve.

## The spine: sketch v3

The university launches microcredentials: short courses that can stack towards a degree, sold on a new platform. One simple question, "how many students do we have?", now gets four answers. Each film takes this new thing one step further.

| Film | What happens to the microcredential |
|---|---|
| Before we count | The word arrives, and four offices count it differently. They agree what it means, on paper. |
| Older than the systems | It meets the systems: a new platform, bought with its own model, where learners are "customers". |
| Built to write, built to read | Its enrolments are written by an app and read by planners, in two shapes. |
| Many ways to read | It's a new source to integrate, a new fact to present and new columns to serve. |
| Both at once | The app wants live answers from the analytics: seats left, the next course to suggest. |
| Meaning machines can read | Genie is asked about "learners", and must read the meaning, not guess it. |
| Keeping it true | The government adds a reporting rule. AI spots it and drafts the change; people approve sketch v3. |

The pattern travels beyond universities: a bank launching buy-now-pay-later, a retailer launching subscriptions. A new thing that doesn't fit the old words is the moment every business needs its model.

## The series at a glance

In the suggested order. Like every film on the site, none carries a number.

| Working title | The question | The idea that lands | Builds on |
|---|---|---|---|
| Before we count | How many students do we have? | Before you can count anything, you have to agree what it is. | *The sketch* (The Inner Life of Data) |
| Older than the systems | Where does "student" live? | The concepts outlive the systems. Model them once, and hold every system up to that. | *Before we count*, and *Three levels of precision* (A Sharper Sketch) |
| Built to write, built to read | Why store the same enrolment twice? | One logical model, a shape for each job. | *Older than the systems* |
| Many ways to read | Star, vault or one wide table? | Each shape has a job and a place. Choose per question, not per fashion. | *Built to write, built to read* |
| Both at once | Can one database do both? | Hybrid removes the copy, not the model. | *Built to write, built to read* and *Many ways to read* |
| Meaning machines can read | What does an AI agent need to answer right? | Glossary, taxonomy, ontology and semantic layer stack. Standards save starting from blank. | *Before we count* and *Older than the systems* |
| Keeping it true | Who keeps all this up to date? | AI watches and drafts; people decide; everything is versioned, end to end. | All |

Each film runs 6 to 7 minutes, about 45 minutes in all. Every film stands alone and opens with a one-line recap, like the site's other films.

**Audience.** The promise stays two-sided, raised one step: someone who has watched *The Inner Life of Data* follows every film, and a data architect agrees with every line. *Before we count* needs no technology at all, so it keeps the 14-and-up promise.

## The films

### Before we count

**Logline.** The university launches microcredentials, and four offices give four answers to "how many students do we have?". None of them is wrong. To see why, we go back five thousand years.

Each moment in history gives one modelling idea, and the film returns to the university to use it.

| Chapter | What happens | What it teaches |
|---|---|---|
| Four answers | Registrar 31,240; admissions 32,900; finance 33,860; library 35,120. Each is right for its own meaning of "student". | The numbers aren't wrong. The word is shared, and the ideas behind it aren't. |
| Word, idea, thing | A triangle: a word points to an idea, which points to things. "Robin" names two different birds in Britain and in America. | Terms, concepts and things are different. Trouble starts when one word points to two ideas, or two words to one. |
| The first records | Clay tablets from Uruk, around 3300 BCE. Most of the earliest writing we have is accounts: grain, sheep, workers. Most of the rest is lists of words, grouped by kind. | Data and its dictionary were written side by side, from the start. A record says what, how many, who and when. |
| Things and what we say about them | Aristotle separates a thing from what we say about it: its qualities, quantities, relations, place and time. A good definition names the kind, then what sets it apart. | Entity, attribute, relationship. How to write a definition: "A microcredential is a short course that…". |
| One name, one thing | Linnaeus orders living things in a hierarchy, and gives each species one two-part name, whatever it's called locally. | Classification (a taxonomy), and identity: one unique name for one thing. |
| Two sides of every entry | Pacioli sets down double-entry bookkeeping in 1494: every amount goes into two accounts, and the books must balance. | Transactions relate things to each other. The chart of accounts is a model of a business, and the balance is the first data quality check. Businesses ran on this model for 500 years without a computer. |
| Nine planets, then eight | In 2006, astronomers define "planet". Nothing in the sky changes; the count drops from nine to eight. In 2019, even the kilogram gets a new definition. | Change a definition and the count changes. Definitions have owners, dates and versions. |
| Agreed on paper | Back at the university, with no system in sight. The offices agree a glossary: *learner* for everyone who studies here, *student* for a learner admitted to a degree. Each word gets an owner. The sketch gains a box in pencil: v3, draft. Each of the four numbers now has a name. | A conceptual model is the business's shared language, written down. It needs no technology. Offices may keep different words, as long as each is named and mapped. |
| Pull back | Every system inherited these ideas: the row from the tablet, the hierarchy from Linnaeus, the debit and credit from Pacioli. Six systems are waiting, each with its own idea of a student. | Our digital world runs on very old ideas. |

**Why a business needs this without technology.** Every contract opens with its definitions. Mergers stall when two companies each have "a customer" and mean different things. Funding, fees and rankings depend on who counts. Shared words cost little; disagreement is expensive, and it's paid for in meetings, rework and wrong decisions.

**Pictures.** The word, idea and thing triangle, which returns in *Meaning machines can read*. A clay tablet with its tally marks. Linnaeus's tree. Two ledger columns that must balance. A list of nine planets, one struck through. All drawn in code, in the series' style, as original art.

**Labs.** *Write the definition* (the kind, then what sets it apart). *Count the students* (pick a definition and watch the number move). *Same word, same thing?* (sort pairs into synonyms, homonyms and genuinely different ideas).

### Older than the systems

**Logline.** The glossary is agreed. Now it meets six systems, each built or bought with its own idea of a student. The ideas are centuries older than any of them, and will outlive them all.

**Why conceptual first.** It's the only model the business can read, the only one that survives a change of system, and the one every other level is checked against.

| Chapter | What happens | What it teaches |
|---|---|---|
| Older than the systems | Universities have had students, teachers and degrees since the Middle Ages; Bologna dates itself to 1088. Student systems are replaced every ten to fifteen years. | Concepts change slowly; systems change often. The conceptual model is what lasts. |
| Every system has a model inside | The student system, learning platform, CRM, finance, library and ID card each draw "student" differently. The new microcredential platform, bought off the shelf, calls learners "customers". | Buying a system means adopting its model, whether you look at it or not. If you don't model your business, your vendors will. |
| Where meanings meet | Six systems connected in pairs need up to fifteen translations. In 1999 a spacecraft is lost because one team's software works in pound-force seconds and another's in newton-seconds. | Meaning breaks at interfaces. Translate each system once, to a shared model, instead of pair by pair. |
| One person, many records | One learner has four IDs. The name comes from the student system, fees from finance, the email from IT. | Identity across systems: master data, and a system of record for each fact. Code sets (reference data) keep values the same everywhere. |
| Precise, but not yet technical | The logical model: what identifies each thing, its attributes and allowed values, how many of one relate to another, and the rules. Still no technology. | The logical model is the yardstick every system is held against: to choose a package (fit and gap), to map its fields, to migrate. |
| Who owns what | The registrar owns the word *student*; the architect the logical model; each team its tables. A change travels down; news of a change travels up. | Ownership and stewardship. The two halves of a change from *Silent change*, now for the model itself. |
| Pull back | The platform's "customer" is mapped to "learner". Nothing in the platform changed; the meaning is joined. | Next: one logical model, many physical shapes. |

**Labs.** *Who is the source?* (give each fact its system of record). *Fit and gap* (hold a vendor's model up to ours: adopt, extend, map).

### Built to write, built to read

**Logline.** The same enrolment, stored twice: once for the app where thousands enrol at 9 am, once for the planners who read five years at a time. Why the shapes differ, and why both are right.

| Chapter | What happens | What it teaches |
|---|---|---|
| Two jobs | Opening morning: many small writes at once, each of which must be right. Planning day: one question over millions of rows. | Transactional and analytical work ask opposite things of a model. |
| Built to write | Each fact in one place: the learner's email once, not on every enrolment. Keys, rules, and changes that happen all at once or not at all. | Normalisation, keys and constraints, transactions. |
| What goes wrong without it | The email is stored three times, and changed in two. | Update anomalies: why "each fact once" matters for writing. |
| Another way to write | An application saved as one document, with its preferences inside. | Documents: keep together what changes together. Easy to write one; harder to query across many. |
| Built to read | Declare the grain first (one row per learner per offering at census date), then facts in the middle and dimensions around them: learner, unit, time, campus. | The star: grain, facts and dimensions. |
| Keeping history for reading | A student changed faculty mid-year. Count them in the old one or the new? Keep both, each with its dates. | Slowly changing dimensions; the status history from *A Sharper Sketch*, now for reading. |
| Side by side | The same question on both shapes: many joins and a history puzzle, against two joins. Then an email change: easy in one, awkward in the other. | Each shape is fast at its own job. |
| Pull back | One sketch, two shapes. And a common confusion: bronze, silver and gold say how refined data is, not what shape it has. | Medallion layers are not a modelling technique. Next: more shapes for reading. |

**Labs.** *Break the update.* *Declare the grain.* *Which shape answers this faster?*

### Many ways to read

**Logline.** Kimball, Inmon, Data Vault, one big table: the arguments are loud. In a lakehouse, each shape has a job and a place. This is the engineers' film *A Sharper Sketch* parked.

| Chapter | What happens | What it teaches |
|---|---|---|
| The argument | Four engineers, four favourite shapes, one new source: the microcredential platform. | There's no best shape, only a best shape for a job. |
| Integrate first | Many sources, one meaning. A normalised core, or a Data Vault: hubs for business keys, links for relationships, satellites for the history of descriptions, each with its source and load time. | Built for new sources, change and audit; not for people to query. |
| Present for people | Stars for enrolments, results and fees share the same Learner and Time dimensions. | Conformed dimensions: stars that agree with each other. |
| Serve an entity | One wide row per learner: current course, units this term, credit points to date, withdrawals in the last year. | Entity-centric tables: easy for people, machine learning and AI. The cost: many columns to maintain, and measures defined twice unless you're careful. |
| Where each lives | Silver integrates; gold presents and serves; a semantic layer sits on top. | Each shape placed on the platform from *The Inner Life of Data*. |
| Choosing | Many changing sources: a vault. Many processes sharing context: conformed stars. One entity, many questions, AI: wide tables. | Choose per question, not per fashion. |

**Labs.** *Same question, four shapes.* *Add a source* (see which shape absorbs it with least change).

### Both at once

**Logline.** New databases promise to write and read in one place. They remove a copy. Do they remove the need to model?

| Chapter | What happens | What it teaches |
|---|---|---|
| The distance | The app's database, a copy, a nightly build, an answer tomorrow. The microcredential app wants seats left and a suggested next course, now. | Why hybrid is appealing: the distance between writing and reading. |
| Two engines, one place | A row store for writes and a column store for reads, kept in step by the database. Or an operational database that lives inside the lakehouse, with tables synced both ways. | What hybrid (HTAP) databases do. Products named in labels and the rigour sheet only. |
| What it removes | Copies, pipelines, delay, a second set of permissions. | The real gains. |
| What it doesn't | Query the app's tables for the census count, and it's 131 against 118 again. History, conformed dimensions and definitions still need modelling. | Hybrid removes the copy, not the model. |
| Data flowing back | Gold data served back to the app: a suggestion, a risk flag. An AI agent that reads what's known and writes what it did. | Operational analytics, data flowing back to apps, and agents that need both shapes. |
| New questions for the modeller | Which shape is the source of truth for each idea? Which way does each table sync? How fresh must each answer be? | Contracts in both directions, and freshness per use. |

**Labs.** *Where does it live?* (choose the source of truth and the direction of sync for each table).

### Meaning machines can read

**Logline.** The glossary from *Before we count* was written for people. Now Genie gets the questions. What does an AI agent need to read, and how do semantic layers, ontologies and industry standards differ?

| Chapter | What happens | What it teaches |
|---|---|---|
| Genie guesses | Asked "how many learners this term?", Genie finds a column called STUDENT_FLAG, and is wrong. The definition exists, in a document no tool reads. | An agent answers from what it can read. Meaning kept in documents is invisible to it. |
| They tried before | The metre in the 1790s. Nightingale's model hospital statistics in 1860, so hospitals could be compared, and the international list of causes of death in 1893, today's ICD. And Wilkins, who in 1668 tried to classify everything; his scheme never took hold. | Shared definitions let strangers compare. Keep them bounded, and made for a purpose. |
| Four ways to write meaning down | A glossary (words, for people). A taxonomy (kinds, in a hierarchy, like Linnaeus's). An ontology (concepts, relationships and rules a machine can reason with). A semantic layer (how each number is calculated, once). | A stack, not rivals. Each answers a different question. |
| The ontology | "A student is a learner admitted to a degree. Every unit enrolment counts towards one course admission." Data organised by these rules becomes a knowledge graph. | Rules a machine can check: Aristotle's definitions, made formal. |
| The semantic layer | "Learners this term" defined once: the measure, filters, time and grain. Dashboards, spreadsheets and Genie all ask it, instead of each writing its own. | One definition, every tool. Open formats for sharing these definitions between tools are emerging. |
| Standards | Finance, health, insurance, retail and education each have published models. Check, adopt, extend and record, from *A Sharper Sketch*, works at every layer. | Don't start from blank; don't copy blindly. |
| Genie, again | Genie asks back, "learners, including microcredentials?", then answers with its definition. | Grounding an agent in explicit meaning makes its answers measurably more accurate. |
| Pull back | The triangle from *Before we count* returns: the word, with labels in English and Spanish; the idea; the data. | Next: keeping it true while everything changes. |

**Labs.** *Glossary, taxonomy, ontology or semantic layer?* (sort the statements). *Map to the standard.*

### Keeping it true

**Logline.** The meaning is written down end to end, from a word to a number. Then the university changes again. AI can watch, draft and check. People decide.

| Chapter | What happens | What it teaches |
|---|---|---|
| A change arrives | The government adds a reporting element for microcredentials. The platform adds a "stackable" flag. A new metric appears in three dashboards, with three definitions. | Change comes from the business, the systems and the standards. |
| How models go stale | Values nobody announced (*Silent change*), a column whose meaning drifts, one metric defined twice, a standard updated for the new year. | Drift: the gap between what's written and what's used. |
| AI as a watcher | An agent reads the catalog, the lineage, the queries and the new data. It flags the drift, with evidence. | Where AI helps first: noticing. |
| AI as a drafter | It drafts the change: the ontology, the logical model, the mapping to the standard, the semantic layer, the contract, the tests and the change note. | Drafting is cheap now. Judging the draft is still the job. |
| People decide | Mei approves the meaning, the architect the model, the teams the build. The draft goes through the same review as anyone's. | The agent recommends; people approve. Everything is versioned. |
| What can go wrong | A confident draft that invents a definition. A change nobody reviewed. | Tests and contracts check the agent's work too. |
| End to end | One change, followed through: glossary, ontology, logical model, the shapes for writing and reading, semantic layer, contract, Genie's answer. All in step. The stamp reads sketch v3. | Upkeep, end to end, and why each layer matters. |
| Pull back | Back to the clay tablet. Five thousand years of writing meaning down. The tools changed; the job didn't. | The series' closing line. |

**Labs.** *Approve or reject* (the agent's proposals, some plausible and wrong). *Follow one change end to end.*

## What the series covers, and where

| Concept | Where |
|---|---|
| Term, concept and thing; synonyms and homonyms | *Before we count* |
| Entity, attribute, relationship; writing a definition | *Before we count* |
| Classification and taxonomy; identity | *Before we count*, *Meaning machines can read* |
| Definitions change counts; owners and versions | *Before we count*, *Keeping it true*, and *A Sharper Sketch* |
| The same word meaning different things in different parts of a business | *Before we count*, *Older than the systems* |
| Grain; reference models; conceptual, logical and physical | *A Sharper Sketch*, used in every film after it |
| Every package has a model; integration through a shared model | *Older than the systems* |
| Master data, system of record, reference data | *Older than the systems* |
| Ownership and stewardship | *Older than the systems*, *Keeping it true* |
| Normalisation, keys, constraints, transactions; documents | *Built to write, built to read* |
| Stars, grain, slowly changing dimensions | *Built to write, built to read* |
| Medallion layers are not a model | *Built to write, built to read*, *Many ways to read* |
| Normalised core, Data Vault, conformed dimensions, entity-centric tables | *Many ways to read* |
| Hybrid (HTAP) databases, data flowing back to apps, freshness | *Both at once* |
| Glossary, taxonomy, ontology, knowledge graph, semantic layer | *Meaning machines can read* |
| Industry standards and reference models | *Meaning machines can read*, and *A Sharper Sketch* |
| Drift, AI-assisted modelling, versioning end to end | *Keeping it true* |

**Parked for later:** graph databases as a storage choice, vector search, event sourcing, time-series models and data mesh. Each is a real topic; none is needed for the series' spine.

## Set-ups and pay-offs

| Set up | Paid off |
|---|---|
| "Sketch v3?" at the end of *A Sharper Sketch* | Microcredentials arrive (*Before we count*); v3 is approved (*Keeping it true*) |
| The word, idea and thing triangle (*Before we count*) | The ontology, with labels in two languages (*Meaning machines can read*) |
| Linnaeus's tree (*Before we count*) | The taxonomy (*Meaning machines can read*) |
| Pacioli's balance (*Before we count*) | Tests and contracts (*Built to write, built to read*, *Keeping it true*) |
| Pluto: a definition changes a count (*Before we count*) | Versioned definitions (*Keeping it true*) |
| The lost spacecraft: meaning breaks at interfaces (*Older than the systems*) | Contracts in both directions (*Both at once*) |
| Genie guesses (*Meaning machines can read*) | Genie asks back (*Meaning machines can read*), and answers with v3 (*Keeping it true*) |
| The clay tablet (*Before we count*) | The last shot (*Keeping it true*) |

## People

The square from *When things go wrong* fits. Mei Tanaka, from the registrar's office, owns the word *student* and leads the business side of the series. Ana Ruiz and Prof. David Mensah use the numbers. Two new characters: the person who runs microcredentials (business, producing the data) and a data architect as the guide (technical). Sam stays the guide of *When things go wrong*.

## Order of making

1. ***Before we count* and *Older than the systems* first.** They're unique, they don't date, and their history is checked once.
2. ***Built to write, built to read* and *Many ways to read* next.** Their ideas are settled; only the lakehouse terms need a check.
3. ***Both at once*, *Meaning machines can read* and *Keeping it true* last, and close together.** Their products change fast: script them last, keep product names to labels and the rigour sheet, and check them on the day of release.

## A four-film version

If four films is a firm limit: *Before we count* and *Older than the systems* as above, then *Built to write, built to read* with one chapter on hybrid, and *Meaning machines can read* with two chapters on AI. What's lost: the Data Vault and entity-centric shapes, what hybrid doesn't remove, and the full upkeep loop. Each film would run 8 to 9 minutes, longer than any of the site's films so far.

## Rigour to check when scripting

To confirm against primary sources, and record in each film's rigour sheet with the date checked:

- ***Before we count*:** the share of administrative and lexical texts among the proto-cuneiform tablets of Uruk (Nissen, Damerow and Englund, *Archaic Bookkeeping*, 1993). Aristotle's ten categories, and that mapping them to entity and attribute is a simplification. ISO 704 on definitions by the broader kind and distinguishing features. Linnaeus, *Systema Naturae* (1735) and *Species Plantarum* (1753). The scientific names of the European and American robins. Pacioli's *Summa* (1494) described double-entry bookkeeping; it didn't invent it. Ogden and Richards' triangle (*The Meaning of Meaning*, 1923). IAU Resolution B5 (2006). The SI redefinition (20 May 2019).
- ***Older than the systems*:** Bologna's traditional founding date (1088). The Mars Climate Orbiter mishap report (1999). ANSI/SPARC's three-schema architecture (1975), Chen (1976) and Codd (1970) as origins. The typical life of a student system.
- ***Built to write, built to read* and *Many ways to read*:** Codd's normal forms. Kimball, *The Data Warehouse Toolkit* (1996 onwards). Inmon, *Building the Data Warehouse* (1992). Linstedt and Olschimke, *Building a Scalable Data Warehouse with Data Vault 2.0* (2015). Entity-centric modelling as described by Maxime Beauchemin.
- ***Both at once*:** the term HTAP (Gartner, 2014). The current names and maturity of hybrid and operational databases, such as Databricks Lakebase, Snowflake hybrid tables, SingleStore, TiDB and AlloyDB. Say "preview" where it is.
- ***Meaning machines can read*:** Nightingale's model hospital statistics (1860), and the Bertillon classification (1893) as the start of the ICD. Wilkins' *Essay* (1668), and Borges' essay on it (1942). W3C OWL, RDF and SKOS. Semantic layers, such as dbt's, Databricks metric views, Snowflake semantic views and Cube, and the Open Semantic Interchange initiative (announced September 2025) and its status. Ontology products, including what *A Sharper Sketch* calls Genie Ontology: its current name and scope. Industry standards: FIBO, ISO 20022, HL7 FHIR, OMOP, SNOMED CT, ACORD, GS1, CEDS, HERM and TCSI. Evidence that grounding improves answers, such as Sequeda, Allemang and Jacob (2023) on knowledge graphs and enterprise SQL, with its figures checked.
- ***Keeping it true*:** what current AI tools actually do for catalogs, lineage, drift and model changes. No claim of autonomy beyond what they do.

## Decisions for the author

1. **Seven films or four?** Recommended: seven, of 6 to 7 minutes each.
2. **The spine.** Microcredentials, continuing *A Sharper Sketch* (recommended), or a new business outside education, which travels further but leaves the world of the other films.
3. **The series title.** *From words to data* (recommended; in Spanish, *De las palabras a los datos*), *Say what you mean*, *Before we count* (then the opening film needs another title) or *The shape of meaning*.
4. **The tagline.** "Agree what it is. Then count it." · "Meaning first." · "Say what you mean, once."
5. **The guide.** A new data architect (recommended), or Sam.
6. **Level.** *Before we count* for anyone from 14 up, and the three films on shapes for practitioners (recommended). Or hold every film to the site's current promise, with less detail in *Many ways to read* and *Both at once*.
7. **Language.** English with Spanish pages around it, as for *Silent change*, or English and Spanish from the start, as for *The Inner Life of Data*.
8. **Place on the site.** A series page under *Topics › Data modelling*, beside *A Sharper Sketch*, with *Before we count* and *Older than the systems* suggested before it, and the rest after.

## Next checkpoints

1. Agree decisions 1 to 3.
2. A treatment, v0.1, for *Before we count*, with its rigour sheet started.
3. Style frames for *Before we count*: the triangle, the tablet, the tree, the ledger, the struck-through planet.
4. A voice test, then the script.
