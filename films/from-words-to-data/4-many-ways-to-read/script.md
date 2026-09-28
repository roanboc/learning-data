# From words to data · Many ways to read: script

*The script of Many ways to read, in [From words to data](../README.md), as filmed: 4:13, in eight chapters, in English. The narration lives in [`source/src/narration.js`](source/src/narration.js) and the pauses in [`source/src/breath.js`](source/src/breath.js); this page and those files say the same thing, and where they differ, the source wins.*

## The promise

A practitioner follows every line, and a data architect agrees with it. There is no best shape for reading data, only a best shape for each job. Integrate many changing sources in a normalised core or a data vault; present them to people as stars that share conformed dimensions; serve one entity, for people, machine learning and AI assistants, as one wide row. Each shape has a usual place on the platform, and a semantic layer on top keeps every tool's definitions the same. Every shape is also another copy to keep in step: **choose per question, not per fashion.**

## The story in one paragraph

For most of the twentieth century, a library filed each book on three cards, by author, title and subject: one book, three ways in. When the book moved and one card wasn't retyped, readers went to the wrong shelf. Data for reading works the same way. At the university, four engineers, Ben, Rosa, Sam and Noor, each argue for a shape: a normalised core, a data vault, a star, one wide table. This week there's a new source to add: microcredentials from the short-course platform. The film follows it through each job. To integrate, a normalised core changes what exists, while a data vault only adds: its hubs hold the business keys, its links the relationships, and its satellites every version of the descriptions, with their source and load time; the new source arrives as new satellites and a new row in the Credential hub, and nothing that exists changes. But the vault isn't for people to query. For people, stars for awards, enrolments and fees share one Learner and one Date dimension, conformed, planned on a bus matrix. For one learner asked about in many ways, one wide row makes "who is close to a graduate certificate?" one filter, at the cost of many columns and a measure defined twice. On the platform, silver integrates, gold presents and serves, and a semantic layer sits on top. That week, the vault took the short-course credentials without changing a thing; the award star gained rows and each learner's wide row gained a column.

## What each object stands for

| Object | Stands for |
|---|---|
| Warm, dusty reading room, drifting light, the year tag | The past: the library's card catalogue |
| A wooden cabinet of drawers, three pulled open in turn | The catalogue: one index for the whole library, each card filed under its own heading |
| Three catalogue cards, author, title and subject, each with the shelf mark in its corner | Three copies of one entry, each arranged for a different question |
| The book on its shelf, with its shelf mark on a label | The one thing the copies point to |
| Two cards retyped in green, one left with the old mark in red; an empty slot with a red cross | Copies kept in step, and one that wasn't: readers sent to the wrong shelf |
| A glass tile, "credential awards", and three small tables by learner, year and course | The facts recorded once, and copies arranged for reading |
| Four panels in their colours, each with its glyph | Four shapes for reading: normalised core (pale blue), data vault (violet), star (green), wide table (amber) |
| Source cards in their system's colour; a pink card marked "new" | Source systems; the short-course platform, arriving this week |
| A grid of entity boxes joined by relationship lines | A normalised core: each fact once, for the whole university |
| Violet hubs with a key, a hexagonal link, satellites stacking under them | A data vault: business keys, relationships, and every version of the descriptions |
| A satellite's source dot and timestamp; a dashed ring and "audit" | Record source and load time: where each value came from, and when |
| Pink satellites and a pink row in the Credential hub, green ticks on everything else | A new source adds rows and satellites; nothing that exists changes |
| An orange dashed path wandering through the vault | A person's query through hubs, links and satellites: many joins |
| Green fact boxes with a star, dimensions around them | Stars: facts in the middle, dimensions around |
| Each star's own learner and date sliding into one Learner and one Date | Conformed dimensions, drawn once and shared |
| A grid of ticks, processes down the side, dimensions across the top | The bus matrix |
| A long amber table, one row per learner, credentials as chips | An entity-centric wide table |
| Genie's orb, a funnel on one column, two rows lit | One filter instead of five joins |
| A second table with "credit so far" in red: 45 against 50 | The same measure defined twice |
| Bronze, silver and gold vaults, lanes between them | The platform's layers, from *The Inner Life of Data* |
| A thin glowing band above gold, and a dashboard, a spreadsheet and Genie asking it | A semantic layer: each measure defined once, asked for by every tool |
| Three decision cards | When each shape fits |
| The library's cards, returning under the decision cards, one flickering red | Every shape is another copy to keep in step |

## Script

Timings are the voiced film's.

### 1 · One book, three cards · 0:00–0:30

**Narration.** For most of the twentieth century, a library's card catalogue filed each book three times: under its author, its title and its subject. One book on the shelf. Three ways in. Every card had to be kept in step with the book, or readers went to the wrong shelf. Data for reading works the same way: copies arranged for the questions people ask.

**Picture.** A reading room in warm light that drifts through high windows. A wooden card catalogue; three drawers slide out in turn, and each card rises from the drawer it's filed in: the author card from "Gr–Ha" (Hale), the title card from "Ti–Z" (Treatise: the article is skipped) and the subject card, its heading typed in red, from "Be–Bo" (BOOKKEEPING). Each has the shelf mark 657 HAL in its corner. A bookcase: the book, *A treatise on accounts*, glows on its shelf under a label, and an arrow runs from each card to it. The book moves to another shelf and gets a new mark, 657.2 HAL; the author and title cards flip and are retyped, their marks outlined in green; the subject card keeps the old mark, now red, and its arrow points at an empty slot with a red cross: "wrong shelf". The room gives way to the films' dark glass: "credential awards, the facts, recorded once", with three copies beside it, by learner, by year and by course, each with its question. The title.

**On screen.** 1900s · the card catalogue · CATALOGUE · Hale, Margaret. · A treatise on accounts. · BOOKKEEPING. · 657 HAL · 657.2 HAL · one book, three ways in · wrong shelf · every card, kept in step · credential awards · copies, arranged for the questions people ask · What has Aisha earned? · How many this year? · Which courses award most? · FROM WORDS TO DATA · Many ways to read · a shape for each job

### 2 · The argument · 0:30–1:01

**Narration.** Ask four data engineers how to shape data for reading, and you may get four answers: a normalised core, a data vault, a star, or one wide table. The arguments have names: Inmon's integrated core, Kimball's stars, Linstedt's data vault, and one big table. This week, there's a new source to add: credentials from the short-course platform. There's no best shape. There's a best shape for each job.

**Picture.** Ben, Rosa, Sam and Noor, each under a panel that lights with a shape as it's named, each gesturing in turn; a name tag under each panel. Two source cards appear at the top, and a third, pink, slides in marked "new", with dashed lines to all four panels; the engineers look concerned. The name tags give way to jobs, and everyone relaxes.

**On screen.** How should we shape data for reading? · normalised core · data vault · star · wide table · Inmon · Linstedt · Kimball · one big table · Student system · Learning platform · Short-course platform · new · best to integrate · best to present · best to serve

### 3 · Integrate first · 1:01–1:44

**Narration.** The first job is to bring many sources together, under one meaning. One way is a normalised core: a shape built to write, but for the whole university. Another is a data vault. Hubs hold the business keys, the things that identify a learner or a credential. Links hold the relationships between them. Satellites hold the descriptions, and every change to them, with the source and the time each change arrived. A new source just adds new satellites. Nothing that exists has to change. It's built for change, and for audit. It isn't built for people to query.

**Picture.** Three sources, each in its colour, send dotted lines into a ring: one meaning. The ring becomes a normalised core of eight entities joined by relationship lines. Then a data vault builds: two hubs with their keys, a link between them, satellites dropping into place, one version of the learner's email stacking under the other, each with its source and load time lit. The short-course platform arrives: a pink satellite attaches to the learner, the Credential hub gains a pink row, "code SC-SQL", the SQL microcredential's own business key, with a pink satellite of its own, and every existing table gets a green tick. A dashed ring marks one value's source and time: audit. Ana asks "Awards by faculty, this year?", and an orange query wanders through every table: "+ 6 more joins".

**On screen.** Student system · Learning platform · Finance system · one meaning · learner · credential · fee · normalised core · built to write · for the whole university · data vault · HUB · Learner · learner_id L-20417 · Credential · code GC-DS · LINK · Learner–Credential · email: a.khan@uni.edu · email: aisha@mail.com · status: enrolled · Grad Cert · 60 credits · SIS · each change: its source, and when it arrived · Short-course platform · customer no: SC-8841 · SCP · code SC-SQL · new row · SQL · 5 credits · new rows and satellites · nothing that exists changes · audit: which system said so, and when · Awards by faculty, this year? · + 6 more joins · built for change and audit · not for people to query

### 4 · Present for people · 1:44–2:17

**Narration.** For people, there's the star: one for awards, one for enrolments, one for fees. They share the same learner and the same calendar, so one question can cross them: awards and fees, for the same learners, in the same year. These shared dimensions are called conformed. They make the stars agree with each other. Engineers plan them on a grid called a bus matrix: the business processes down the side, the shared dimensions across the top.

**Picture.** Three stars appear with a celesta sparkle, each with its grain and its own dimension, and its own small copies of learner and date. The copies slide together into one Learner and one Date, drawn once, with lines to every star. A question lights Awards and Fees and their shared dimensions. "conformed" tags; ticks on the lines: the stars agree. The picture becomes a bus matrix: four processes down the side, six dimensions across the top, ticks filling in, the columns ticked in more than one row glowing: the conformed dimensions.

**On screen.** stars, for people · Awards · Enrolments · Fees · one row per credential awarded · one row per unit enrolment · one row per fee charged · Credential type · Unit · Fee type · Learner · L-20417 · Aisha K. · Date · the calendar · awards and fees · the same learners · the same year · conformed · shared dimensions: the stars agree · bus matrix · Completions · Faculty · a column ticked in more than one row: a conformed dimension

### 5 · Serve an entity · 2:17–2:53

**Narration.** Some questions are always about one thing: one learner. So build one wide row per learner: their current course, their credit so far, every credential, and what's next. It's easy for people, for machine learning and for AI assistants. Most questions become a single lookup. Which learners are close to a graduate certificate? With a wide table, that's one filter, not five joins. The cost: many columns to maintain, and the same measure defined twice, unless you're careful.

**Picture.** Aisha, as a glass figure. A wide amber table fills column by column as each is named, then gains rows for other learners. A dashboard, a small neural network and an AI orb each point to Aisha's row: one lookup. Genie asks the question; a funnel on "credit so far" lights two rows and dims the rest: "one filter", beside five crossed-out join boxes. The columns count up to 124; a second table, "course progress", says 50 where the first says 45, both in red.

**On screen.** Aisha K. · one learner · learners · one row per learner · learner · current course · credit so far · credentials · next step · Grad Cert Data Science · 45 of 60 · BSc 2022 · Data viz ✦ · SQL ✦ · Machine learning ✦ · people · machine learning · AI assistants · one row: a single lookup · Genie · Which learners are close to a graduate certificate? · credit so far ≥ 45 of 60 · one filter · not five joins · 124 columns · to name, fill, test and keep · course progress · 50 of 60 · “credit so far”, defined twice: 45 or 50?

### 6 · Where each lives · 2:53–3:18

**Narration.** On the platform from The Inner Life of Data, each shape has its place. Silver integrates, in a normalised core or a vault. Gold presents stars for people, and serves wide tables to tools. And a semantic layer can sit on top, so every tool asks for the same definitions.

**Picture.** Sources drop into the bronze vault, raw and many-coloured; silver lights, and a normalised core and a data vault appear in it, "or" between them; gold lights with a star and a wide table. A thin band of light settles over gold, and a dashboard, a spreadsheet and Genie ask it. A wordless moment: data flows from the sources through bronze, silver and gold, and questions flow down from the tools.

**On screen.** the platform from The Inner Life of Data · sources · Bronze · as it arrived · Silver · integrated · normalised core · or · data vault · Gold · presented and served · stars · for people · wide tables · for tools · semantic layer · each measure defined once · dashboard · spreadsheet · Genie

### 7 · Choosing · 3:18–3:50

**Narration.** Many sources that keep changing, and auditors who ask where each value came from: a vault. Many processes that share the same context: conformed stars. One entity, asked about in many ways, by people and by AI: wide tables. And don't copy for its own sake. Every shape is another copy to keep in step, like the library's cards. Choose per question, not per fashion. Most platforms use more than one.

**Picture.** Three decision cards, one per line: four sources and an auditor's magnifying glass over a vault; three processes sharing Learner and Date; a learner, two questions and Genie's orb over a wide table. The library's cards return beneath them, one per shape, joined by "keep in step": the vault's is a copy of every version, added to every night, the others copies rebuilt every night; the middle one flickers red. A bracket gathers all three cards.

**On screen.** auditor · Many sources that keep changing, and auditors who ask where each value came from · → a vault · Many processes that share the same context · → conformed stars · close to a certificate? · what's next? · One entity, asked about in many ways, by people and by AI · → wide tables · don't copy for its own sake · DATA VAULT. · STARS. · WIDE TABLES. · copy 1 · copy 2 · copy 3 · a copy of every version · added to every night · a copy of the facts · rebuilt every night · keep in step · choose per question, not per fashion · most platforms use more than one

### 8 · Pull back · 3:50–4:13

**Narration.** The short-course credentials arrived this week. The vault took them without changing a thing. The award star gained new rows, and each learner's wide row gained a column. Next: what if the app and the analysts used the same database?

**Picture.** The short-course platform above three panels. The vault gains pink satellites and a green tick; the award star counts up its new rows; the wide table gains a pink column. Then an app on a phone and Sam with a dashboard, both pointing at one database under a question mark. End card.

**On screen.** Short-course platform · this week's microcredentials · data vault · silver · award star · gold · wide learner table · gold · new satellites · nothing changed · +748 rows · +1 column: short courses · the app · the analysts · one database? · Choose per question, not per fashion. · Many ways to read

## Pause and think

The film can stop at the end of four chapters, with one question each. Each links to the lab that teaches the same idea.

| After | Question | Answer | Lab |
|---|---|---|---|
| One book, three cards | A library filed each book on three cards. What did that cost? | Every card had to be kept in step with the book, or readers went to the wrong shelf. | Same question, four shapes |
| Integrate first | The short-course platform arrives. What changes in a data vault? | New satellites and new rows are added; no existing table is altered. | Add a source |
| Present for people | Why do the awards star and the fees star share one Learner dimension? | So one question can cross both stars, and their answers agree. | Same question, four shapes |
| Serve an entity | A wide learner table makes "close to a certificate?" one filter. What's the catch? | Many columns to maintain, and measures that can end up defined twice. | Where does each shape live? |

## Rigour sheet

| Chapter | What the film says | What an expert would add, or what the picture simplifies |
|---|---|---|
| One book, three cards | For most of the twentieth century, card catalogues filed each book under its author, title and subject. | Dictionary catalogues interfiled author, title and subject cards; the Library of Congress began its card catalogue in 1898 and sold printed cards to other libraries from 1901. Each card was filed under its own heading, so the three sit in three drawers: the title card under "Treatise", since filing skips an initial article. Many books had more than one subject card, and added entries for co-authors; some had no title card. The book, its author and the move from 657 to 657.2 (Dewey: accounting, then bookkeeping) are invented for the picture. |
| The argument | Inmon's integrated core, Kimball's stars, Linstedt's data vault, one big table. | Inmon, *Building the Data Warehouse* (1992): a normalised, integrated enterprise warehouse feeding data marts. Kimball, *The Data Warehouse Toolkit* (1996): dimensional models joined by conformed dimensions. Linstedt and Olschimke, *Building a Scalable Data Warehouse with Data Vault 2.0* (2015). "One big table" is a practitioners' name, not a published method; the closest described approach is entity-centric modelling (Beauchemin, 2023). Real teams mix all four. |
| Integrate first | A normalised core is a shape built to write, for the whole university. A data vault: hubs for business keys, links for relationships, satellites for descriptions and every change, each with its source and load time. A new source adds satellites; nothing that exists changes. | A new source can also add rows to existing hubs, as here: the SQL microcredential is a new business key, so a new row in the Credential hub, and Aisha's award of it a new row in the link (not drawn); the narration's "just adds new satellites" simplifies. It can bring new hubs and links too, if it brings new concepts; what doesn't happen is altering existing tables. Loads are insert-only. Data Vault 2.0 also uses hash keys, a raw vault and a business vault, which the film leaves out. A normalised core can keep history too, where it's designed to. The query of "+ 6 more joins" is illustrative. |
| Present for people | Stars share conformed Learner and Date dimensions, so questions can cross them; the bus matrix plans them, processes down the side, shared dimensions across the top. | Kimball's enterprise data warehouse bus matrix, as described by the Kimball Group. Conformed dimensions can also be shrunken (a subset of rows or attributes). The film calls the Date dimension "the calendar". The matrix drawn shows six dimensions; a real one lists every dimension each process uses, such as the unit an enrolment is for. |
| Serve an entity | One wide row per learner makes most questions one lookup, and "close to a certificate" one filter, not five joins; the cost is many columns and measures defined twice. | Entity-centric modelling (Beauchemin, 2023) also nests arrays and snapshots in the row. The five joins are for the normalised core in this example. "Close" (45 of 60 credit points or more) is an invented rule; the 124 columns are illustrative. Wide tables also need keeping in step with the stars they sit beside. |
| Where each lives | Silver integrates, in a normalised core or a vault; gold presents stars and serves wide tables; a semantic layer sits on top. | A common pattern, not a rule: medallion layers describe how refined data is, not its shape (as *Built to write, built to read* says). Semantic layers include dbt's semantic layer, Databricks metric views, Snowflake semantic views and Cube; they define measures once and are queried by name. |
| Choosing | A vault for many changing sources and audit; conformed stars for processes sharing context; wide tables for one entity asked about in many ways. Every shape is another copy to keep in step. | Views, or tables computed on read, can avoid some copies; the point stands that each materialised shape must be kept in step and tested. Stars and wide tables are often rebuilt; a vault is loaded by inserting, not rebuilt. Many teams use a vault or normalised model in silver and both stars and wide tables in gold. |
| Pull back | The vault took the new credentials without changing a thing; the award star gained rows; each learner's wide row gained a column. | "Without changing a thing" means no existing table's structure changed; new rows and satellites were added. The 748 rows are illustrative. The next film asks whether hybrid databases remove the copy. |

## Sources

Checked 28 September 2026:

- Library of Congress, *The Library of Congress Card Catalog* research guide: origins and development of the card catalog (dictionary catalogue from 1898, printed cards sold from 1901), and author, title and subject cards. guides.loc.gov/card-catalog
- Kimball Group, *Enterprise Data Warehouse Bus Matrix* and *Enterprise Data Warehouse Bus Architecture* (Kimball dimensional modeling techniques): processes as rows, conformed dimensions as columns. kimballgroup.com
- Publication details of Inmon, *Building the Data Warehouse* (1992); Kimball, *The Data Warehouse Toolkit* (1996); Linstedt and Olschimke, *Building a Scalable Data Warehouse with Data Vault 2.0* (Morgan Kaufmann, 2015), as listed by the ACM Digital Library and publishers' pages.
- Descriptions of Data Vault hubs, links and satellites, with load dates and record sources (secondary sources, such as ScienceDirect's topic pages).
- Maxime Beauchemin, *Introducing Entity-Centric Data Modeling for Analytics*, Preset blog (April 2023). preset.io
- Dewey Decimal Classification: 657 accounting, 657.2 bookkeeping.
- Databricks documentation, *Unity Catalog metric views*. docs.databricks.com

To check:

- Linstedt and Olschimke's book itself, for its exact wording on satellites, record sources and load dates, and on how a new source is added.
- The current status and names of Snowflake semantic views, dbt's semantic layer and Cube, on the day of release.
- Beauchemin's own post, for how he describes the cost of wide, entity-centric tables.

## Pacing report

```
chapter      duration   wpm  voice  longest quiet  notes
cards           30.8s   123    65%           5.4s  
argue           30.6s   133    79%           1.8s  
integrate       42.9s   137    78%           1.8s  
present         32.7s   139    78%           1.8s  
serve           36.2s   129    78%           1.8s  
where           25.0s   120    64%           4.8s  
choose          32.4s   131    76%           1.8s  
end             22.6s   106    57%           6.0s  

total 4:13.3, 544 words, 129 wpm, voice 73% of the time, 177 wpm while speaking
sentences with under 0.5 s after them: 0; stops of 2.5 s or more inside chapters: 0
```
