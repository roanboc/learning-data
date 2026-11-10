# Only what you may see · One policy for many tables: script

*The script of* One policy for many tables*, film 6 of 8 of* Only what you may see*, the second series of the module* Data protection and privacy *(the module's film 15), drafted on 5 November 2026 in the module's project folder and built here on the module's kit on 10 November 2026. 8:08, in seven chapters, in English, in the module's look, Night glass (frosted glass, solid colour). Made on assumptions, as Rodrigo asked on 5 November 2026, 11:53 UTC: each question and the assumption taken is in the module's project folder (`only-what-you-may-see/6-one-policy-for-many-tables/assumptions.md`). It follows the four-beat rule for every opening (AGENTS.md, *Story and world*). Every claim is checked against its source on the day (*Rigour* below). The university, its people and its numbers are the module's invented ones (`numbers.md`). The narration lives in `source/src/narration.js` and the pauses in `source/src/breath.js`; where this page and those files differ, the source wins.*

## The promise

Every line passes two tests: someone who has never written an access rule can follow it, and a data protection officer and a platform engineer who runs Unity Catalog each find nothing wrong in it. *Show the least* chose a way to hide each class; this film builds those ways on Databricks, once, for every table. A mask set table by table protects nothing until someone sets it, and a grant on a shelf reaches a new table from its first minute. A policy by tag turns that round: it sits on a catalog or a shelf, covers everyone but the groups it lets through, finds columns by their class, and runs one small function for each way to hide. One more policy filters rows, so the study sees only the Faculty of Health's learners; one closes any table that comes without its level. The exceptions are the only way through, so who is on them is the data owner's decision. And the policies are code, reviewed by the data team, with the owner told what each change touches, and deployed by the job's own identity, before any grant opens the door. **The policy follows the tag, so new tables are protected the day they appear.**

## The story in one paragraph

In the 1970s, North America's guide for firefighters and police at a crashed truck or train gave a page to each of a few dozen chemicals: a crew had to know exactly what was inside, often from papers in the cab of the wreck, and thousands of chemicals had no page. Guess wrong, and water could meet a chemical that gives off a poison gas when wet. In 1980 the US Department of Transportation changed the book: chemicals that behave alike share one guide, each chemical's four-digit number leads to its guide, a new chemical needs only a line, and a load no one can name gets Guide 111, which assumes every danger. Today's book has 62 guides for nearly 2,000 numbers. At the registrar's office, every column has its class since Tuesday 13 October; masked by hand, its 38 tables would need 140 masks, each one late for a new table. On Wednesday 14 October Sam Okafor puts in one policy for each class on the whole catalog, a filter that shows the study only Health's learners, and a rule that closes any table with no level; the study's grant comes that afternoon. On Wednesday 21 October Jun's new table appears, the 39th, and nobody writes a mask.

## Opening story

Each beat of the opening, said outright in the narration (AGENTS.md, *Story and world*), and where the film comes back to it.

| Beat | The line that says it |
|---|---|
| Scenario | "North America, in the 1970s." "When a truck or a train carrying dangerous chemicals crashed, the first to arrive were firefighters and police." "Their guide gave each chemical a page of its own: a few dozen in all." |
| Problem | "To find the page, a crew had to know exactly what was inside, often from papers in the driver's cab, close to the wreck." "And thousands of chemicals had no page at all." "Guess wrong, and a crew might spray water on a chemical that gives off a poison gas when wet, with families still in the houses nearby." "Something had to change." |
| Solution | "In 1980, the US Department of Transportation changed the book." "Chemicals that behave alike in a fire or a spill share one guide, written once." "Each chemical's four-digit number leads to its guide, so a new chemical needs only one line: its number, and its guide." "And a load no one can name gets Guide 111, which assumes every danger." |
| Benefits | "Today's book, from Canada, the United States and Mexico, has 62 guides for nearly 2,000 numbers." "A crew reads the number through binoculars, from upwind, and knows what to do, and how far back to keep people, before it goes near." Then the same problem and benefit for data: "Data has the same problem: a mask written table by table protects nothing until someone writes it." "One policy for each class, found by its tag, protects every table that holds it, the day it appears." "So a learner's name stays hidden, wherever it lands." |
| Back to the story | In *The day a table appears*: "On the road, a load no one can name gets Guide 111, which assumes every danger." "Here, a table that comes without its level shows no rows to anyone but its builder, until its owner gives it one." In *Kept as code*: "On the road, one guide is written once, and a new chemical needs only a line." "Here, one policy is written once, and a new table needs only its tags." And its benefit for data: "So a learner's name stays hidden wherever it lands, and the study sees only its own faculty's learners." |

The test before recording: someone who has never heard of the guidebook can answer, from the narration alone, "why was that a problem?" (a crew had to know exactly what was inside to find its page, often by going to the cab of the wreck, thousands of chemicals had no page, and a wrong guess could put water on a chemical that gives off poison gas, with families nearby) and "what did the fix give people?" (one guide for chemicals that behave alike, found by a number read from a safe distance, so a crew knows what to do and how far back to keep people before it goes near; a new chemical needs only a line; an unknown load is treated as the most dangerous). And for data: a learner's name stays hidden wherever it lands, from the day each table appears.

## Reference

- **The reference:** Databricks' attribute-based access control in Unity Catalog, as its docs describe it on 5 November 2026 (*Core concepts*, *Create and manage policies*, *Policy evaluation*, *Requirements*, *Common patterns*, *Performance*, `CREATE POLICY`), with *Show the least*'s ways and *Know what you hold*'s classes. The film shows only what the docs give without a release label.
- **Alternatives a newcomer meets:** a mask set on each column (`ALTER TABLE ... SET MASK`, *Governed in Unity Catalog*'s first step, and the example project's section 2); a view per reader (each new table needs a new view); copies with the hidden columns removed (*Copies that keep the rules*). The film names the first and says why the policy replaces it; the others are the next film's.
- **Where the film follows, extends or differs:** it follows the docs' patterns (exempt the pipeline's identity; one mask per column per reader; a type-agnostic mask; fail closed until classified; partial reveal without regex; a row filter by a tagged column with a constant); it extends them with the module's own design (a policy per class, the owner deciding each exception list, policies as code in the registrar's bundle, reviewed by the data team, policies before grants); it never uses a Beta feature (metastore-level, view or deny policies, identity attributes, the `secret()` function).
- **Practice** (the module's, as practitioners do it): attach policies at the highest level that fits; keep the functions plain, deterministic and free of lookups; let the builder through or its tables keep the stars for good; set a table's level last, after its columns' classes; never put `level` on a catalog or a shelf; put the policies in before the grant that opens the door; check what a table really gets (`SHOW EFFECTIVE POLICIES`) rather than what you meant.

## What each object stands for

| Object | Stands for |
|---|---|
| A two-lane highway at night, a tank trailer on its side at the verge, a fire engine's work light, houses with lit windows beyond | The scene of the opening; no country's signs, no brand on any vehicle |
| A firefighter, an adult in a long turnout coat with pale bands and a helmet, holding the guide (`hold`) | The crews of the opening, in the clothes of their time; a composite, no real person |
| A thin grey guide, open at one chemical's page, "Chlorine", a few dozen tabs along its edge, then empty tabs fading into the dark | The guide of the 1970s, a page for each chemical, and thousands with none |
| The cab's open door and papers on the seat, lit warm | Knowing what's inside only from close up |
| A spray of water meeting the stain, and a pale cloud drifting to the houses | The wrong guess, and its harm |
| The book close up: yellow pages of numbers, each with its guide; the orange page of Guide 137 | One guide for chemicals that behave alike, found by number (drawn as the book is printed today, a slip says so) |
| A new line slipping into the yellow pages: "1754 · 137" (and, at the end, "1806 · 137", "+ 1 line") | A new chemical needs only one line |
| The page of Guide 111, "Mixed load · Unidentified cargo", every danger listed | A load no one can name is treated as the most dangerous |
| An orange panel on the tank, "1754", seen in a circle as through binoculars, the wind's arrow at the left | Reading the number from a safe distance, upwind |
| Guide 137's card: "Stay upwind", "Isolate at least 50 m" | What a crew knows before it goes near |
| The hall of frosted panes; the catalog `registrar` as a pane, its shelves as rows (`core`, `support`, `staging`, `intermediate`, `reference`, `published`, `policies`), each table a small card | The registrar's data on the platform (*Grants by design*'s names) |
| Violet chips on columns: `special`, `direct`, `pseudonymous`, `indirect` in the quieter violet, `none` in grey | Each column's class (*Know what you hold*), as the module's kit draws classes |
| Violet frost over a value, `***` | A value hidden |
| A violet bar drawn across one table's line at a time, "Set by hand: … of 140" | Masks set by hand, one table at a time |
| Cyan group chips with green lines down to a shelf | Grants on a shelf (*Grants by design*) |
| A coral slip, "masks: until someone remembers", and "Who reads it: everyone on core" | The gap a mask set by hand leaves |
| The policy drawn in Databricks' SQL editor, its four parts lit in turn | `CREATE POLICY`: where it sits, whom it covers, what it finds, what it does |
| Catalog Explorer's *Policies* tab, one row each, the groups each lets through as chips | The policies and their exceptions |
| A learner table's view with its group's chip, the rows that aren't `HLT` folding away; a cyan ring round its faculty column | The row filter, and the column it needs |
| Four function cards, each with a value before and after | A function for each way |
| A sealed card, "The registrar's key" | The key behind the learner code, never shown |
| A cyan chip with a gear, `registrar-loader` | The job's own identity, the builder |
| A coral card, "Error · Two masks · the query stops" | One mask per column per reader |
| The agent's sphere beside the list, outside it | An agent, never exempt |
| A card, "COMPUTE": green ticks for serverless and Databricks Runtime 16.4 and above, a coral cross for older | The compute that can read these tables |
| Jun's new table, `core_progress_v1`, "Wednesday 21 October 2026 · 09:12", "The 39th table · no new mask" | A new table, protected the day it appears |
| Three views of one table: the help desk's, Planning's, the study's | One table, read by three readers |
| A second new table, `core_contact_v1`, under coral frost; `registrar-loader` ticked, "everyone else: no rows" | A table no one has levelled, closed until its owner gives it a level |
| A coral ring round `preferred_name`, its value readable | A column no one has classed, which no policy finds |
| A pull request drawn as GitHub's own page: the registrar's grants files, the five new files in green, "Review required · data team", the data team's approval, Mei told | Policies as code, beside the grants, reviewed by the data team; the owner is told what a change touches |
| A job's runs drawn as Databricks' *Jobs & Pipelines*: "registrar_policies", test and production ticked, "Run as registrar-loader" | Deployed by the job's identity, never a person |
| A card, "WEDNESDAY 14 OCTOBER 2026": "Morning · the policies", "Afternoon · the study's grant" | Rules first, then the door |

## The look

*Night glass*, the module's look (decided by the author on 5 November 2026, variant "Frosted glass, solid colour"): a dark hall of frosted panes; cards, chips, pills and ticks in clear, solid colour; every word at least 4.5 to 1 against what is behind it and at least 28 px in the 1920-pixel frame, none under the captions (below y 890). No film grain.

- **The module's kit** (`films/locks-before-the-data/shared/`), as it is: the hall, the panes, the people, the cards, chips and pills, the tools' pages and their logos. What this film needs beyond it is drawn in its own source, with the prefix `op_`: the road, the guidebook's pages, the binoculars' view and the firefighter (`src/op_road.js`); the catalog's pane, its shelves and tables, the policies' table, the SQL and the function cards (`src/op_catalog.js`); the chapters (`src/scenes.js`). The kit isn't changed.
- **Colours carry the module's meaning:** cyan an identity (group chips, `registrar-loader`, the people's cards), green allowed (grants, ticks), coral denied or closed (the closed table, the error, older compute, the gap a hand-set mask leaves), violet hidden personal data (`***`, frost) and the classes' chips, the quieter violet the indirect class, grey for none and for the totals. Amber isn't used: no power is switched on in this film. The opening keeps its own colours: the book's yellow and orange pages, the panel's orange, the fire engine's red kept soft in its warm light.
- **Two places.** The road at night (`opRoad`), with its close-up of the book (`opBook`), lit warm by the fire engine's work light; and the hall (`opHall`), where every chapter of the data story happens, the camera still and only what changes coming and going. The film cuts only between the two, each time on a shared shape: the guide's card on the road and the policy's card in the hall take one box (`OP_GUIDECARD`). In the hall, chapters glide on (`ag_cutInto`), and a chapter that starts somewhere new opens on a later moment (`later: true`), so what was there leaves first.
- **People:** the firefighter of the opening, drawn in this film's source from the kit's figure and face table (a turnout coat with pale bands, a helmet inside the head's picture), the guide in their hand; Mei Tanaka, Sam Okafor and Jun Park from the kit. One three-quarter head each; arms down; a hand only on the guide. Each comes in and goes whole.
- **Words on screen** are the narration's names and numbers, short; the policies' SQL and the tools' pages as their docs name them on the day; the module's ways as `numbers.md` writes them.

## Script

Timings are the measured ones (*Pacing report*).

### 1 · A page for each · 1:53, with the title card

**Narration.** North America, in the 1970s. When a truck or a train carrying dangerous chemicals crashed, the first to arrive were firefighters and police. Their guide gave each chemical a page of its own: a few dozen in all. To find the page, a crew had to know exactly what was inside, often from papers in the driver's cab, close to the wreck. And thousands of chemicals had no page at all. Guess wrong, and a crew might spray water on a chemical that gives off a poison gas when wet, with families still in the houses nearby. Something had to change. In 1980, the US Department of Transportation changed the book. Chemicals that behave alike in a fire or a spill share one guide, written once. Each chemical's four-digit number leads to its guide, so a new chemical needs only one line: its number, and its guide. And a load no one can name gets Guide 111, which assumes every danger. Today's book, from Canada, the United States and Mexico, has 62 guides for nearly 2,000 numbers. A crew reads the number through binoculars, from upwind, and knows what to do, and how far back to keep people, before it goes near. Data has the same problem: a mask written table by table protects nothing until someone writes it. One policy for each class, found by its tag, protects every table that holds it, the day it appears. So a learner's name stays hidden, wherever it lands.

**Picture.** The road at night, the kicker "North America · the 1970s": a two-lane highway running to a low horizon, a tank trailer on its side at the verge, a dark stain spreading on the asphalt; houses with lit windows beyond a field; at the left, a fire engine and its warm work light (the kit's `"lamp"` light). The firefighter, an adult in a long turnout coat with pale bands and a helmet, stands in its light, arms down. On "guide", the thin grey guide of the 1970s comes into their near hand (`hold`, blended in from the pose before), and a card rises beside them: the guide open at one page, "Chlorine", a few dozen tabs along its edge. On "exactly", the camera glides right to the cab: its door open, papers on the seat lit warm, a short way from the stain. On "no page at all", the camera glides back, and the card comes again, its tabs running on past the last as empty outlines fading into the dark, "Thousands with no page". On "spray", a thin arc of water from the left meets the stain; on "poison", a pale cloud lifts from it and drifts towards the houses, whose windows glow on "families". On "Something had to change", the spray and the cloud fade. On "changed", the kicker turns to "North America · 1980", and the grey guide in the firefighter's hand becomes the orange book.

A cut into the book close up (`opBook`), in the same warm light: its yellow pages, "Yellow pages · by number" (ID, Guide, Name of material), and its orange right page. On "alike", three lines (1809, 1830 and 1836, all Guide 137) light, and lines of light run from their guide numbers to the right page, which comes in on "share" as Guide 137, "Substances · Water-reactive · Corrosive" (its potential hazards, public safety and evacuation lines as the book prints them); its title glows on "written once". On "number", the column of numbers is outlined; on "one line", a new line slips in, "1754 · 137 · Chlorosulfonic acid", and its light runs to the same guide. On "Guide", the page turns (it narrows to its spine and opens, so two pages' words never show at once) to Guide 111, "Mixed load · Unidentified cargo", every danger listed down it, lit on "every danger". A slip at the top right says "As the book is printed today". On "Canada", the kicker turns to "North America · today", the book dims, and a card comes in: "Today's book · 62 guides · nearly 2,000 numbers · Canada · United States · Mexico".

A cut back to the road: the tank now carries an orange panel, "1754". On "upwind", the wind's arrow draws on at the left, "wind"; on "binoculars", a circle opens over the scene, the panel's number sharp and large inside it. On "what to do", Guide 137's card comes in at the right: "GUIDE 137 · 1754 · Chlorosulfonic acid", then "Stay upwind", and on "how far back", "Isolate at least 50 m". On "Data has the same problem", a cut into the hall on the same box: the guide's card is now an empty dashed slot; on "table by table", a row of five small table cards comes in, and a violet bar is drawn slowly across each one's personal line, one at a time; a sixth comes on "until" with its slot empty, coral on "nothing". On "policy", the policy's card fills the slot: "ONE POLICY · For each class, written once"; on "tag", violet `direct` pills land on every card; on "protects", violet frost falls on every one at once; on "appears", a seventh card slides in, and its pill and frost land at once. On "hidden", a glow runs along the frosted lines. The hall's cards leave as the title comes in; then the title card, held without words: **One policy for many tables**, "Every table, the day it appears", "FILM 6 OF 8 · ONLY WHAT YOU MAY SEE".

### 2 · A mask for every table · 0:56

**Narration.** On Tuesday 13 October, Mei Tanaka gave every column of the registrar's data its class, in Know what you hold. Show the least chose how to hide each one: a name masked whole, a date of birth cut to its year. Her catalog holds 38 tables with personal data: 140 columns to hide. By hand, that's 140 masks, set one table at a time, by someone who remembers. But Grants by design gives each shelf its readers, so a new table is read from its first minute. A mask set by hand comes later, if at all, and until then, everyone on the shelf reads every name. So Sam Okafor, who runs the platform, writes one policy for each class, on the whole catalog.

**Picture.** The hall, the kicker "Tuesday 13 October 2026". Mei comes in at the left, her card "Registrar's office · Mei Tanaka", and a slip at the top right, "Know what you hold". The learner table, `core_learner_v1`, springs in at the centre with Samuel's values; on "class", a violet chip lands on each column in turn: `direct` on `student_number`, `full_name` and `email`, `indirect` (the quieter violet) on `date_of_birth`, `pseudonymous` on `learner_code`, `none` (grey) on `course`. The slip turns to "Show the least"; on "whole", the name is masked whole, `***`, beside a slip "Mask it whole"; on "year", the date of birth becomes `1987-01-01`, beside "Generalise". On "tables", Mei walks out at the left, and the table shrinks into one small table of the catalog's pane, `registrar`, its shelves as rows (`core`, `support`, `staging`, `intermediate`, `reference`, `published`, `policies`), with its count: "38 tables with personal data · 140 columns to hide". On "masks", violet bars are drawn across the personal lines, one at a time, slowly, and a coral count rises: "Set by hand: … of 140". On "Grants by design" (its slip at the top right), the readers' chips come in along the top, `registrar_office`, `help_desk`, `health_progress_study`, `planning_learner_readers`, green lines run down from them, and `core` lights green. On "new", a new table card slides onto the `core` shelf, and on "first minute" a green ring lights round it: it's read at once. On "later", a coral slip beside it, "masks: until someone remembers"; on "everyone", a coral line runs down from it to a card, "Who reads it: everyone on core", its names invented (Ana Lima, Tom Reyes, Mia Chen), never Samuel's. On "Sam Okafor", the readers, the slip and the card go; Sam comes in at the right, his card "Data platform · Sam Okafor", and the pane moves to the left; on "whole catalog", a line of light runs round the whole pane.

### 3 · A policy for each class · 1:00

**Narration.** A policy has four parts. Where it sits: on the registrar's catalog, it covers every shelf and every table, now and later. Whom it covers: everyone, except the groups it lets through. What it finds: each column whose class is direct, by its tag, in any table. And what it does: mask it whole. Governed in Unity Catalog wrote one like it. Sam writes one for each class that's hidden: special, direct, pseudonymous and indirect. One more decides rows, not values: the study sees only the Faculty of Health's learners. It sits on the shelf the study reads, core, and finds each table's faculty column by its tag. A filter needs its column, so every table with learners in it carries their faculty: one without would show the study every learner.

**Picture.** The pane at the left, as chapter 2 leaves it; Sam goes out at the right once the chapters have crossed. A page drawn as Databricks' *SQL editor* comes in, the policy in it:

```sql
CREATE OR REPLACE POLICY hide_direct
ON CATALOG registrar
COLUMN MASK registrar.policies.mask_whole
TO `account users`
EXCEPT registrar_owners, registrar_office, help_desk
FOR TABLES
MATCH COLUMNS has_tag_value('personal_data', 'direct') AS v
ON COLUMN v;
```

On "registrar's", `ON CATALOG registrar` lights cyan, and on "every shelf" a line of light runs round the pane again; on "Whom", `TO` lights, and on "except", `EXCEPT`; on "direct", `MATCH COLUMNS` and `ON COLUMN` light violet, and on "by its tag" the pane's marks shine; on "mask it whole", `COLUMN MASK` lights violet, and violet frost falls on every personal value in the pane at once. On "Governed in Unity Catalog", a slip under the page, "First written in Governed in Unity Catalog". On "one for each class", the page becomes Catalog Explorer's *Policies* tab for `registrar` (Policy · On · Finds · Does), a row coming as each class is said: `hide_special` · registrar · `special` · Mask it whole; `hide_direct` · `direct` · Mask it whole; `hide_pseudonymous` · `pseudonymous` · Mask it whole; `generalise_indirect` · `indirect` · Generalise. On "rows", a fifth row, lit: `health_rows_only` · registrar.core · `faculty` · Filter rows, and `core` lights on the pane. On "shelf", the study's view of a learner table on `core`, its group's chip `health_progress_study`: `learner_code` and `faculty_code`, six learners; on "faculty", the faculty tag lands on `faculty_code`'s name; on "by its tag", the three rows that aren't `HLT` fold away; on "needs its column", a cyan ring is drawn round the faculty column. On "without", a card below, "A table with no faculty column" (`learner_code`, `credit_points`), and on "every learner", its rows wash coral beside a slip, "every learner shows".

### 4 · A function for each way · 0:57

**Narration.** Each way is a small function, written once, on the catalog's shelf for policies. Mask it whole: words become three stars, and anything else is left empty. Mask it in part, for the help desk: the last two digits, and the email's first letter. Generalise: a date of birth becomes the first of January of its year. A mask gives back the column's own type: a date stays a date, or the query fails. Filter rows: a yes or a no for each row: is this learner in the Faculty of Health? The other ways aren't masks. The learner code is made at the source, with a key the registrar's office keeps. And exam support is left out: the study has no grant to its shelf.

**Picture.** The pane as chapter 3 leaves it, every personal value frosted; on "policies", its `policies` shelf lights, where the functions are kept. Four function cards come up in turn, each a name and what goes in and comes out: `mask_whole`, "Samuel Osei → ***" on "stars" and "a date → empty" on "empty"; `mask_in_part`, "S-20412 → S-\*\*\*12" on "digits" and "samuel.osei@mail.example → s\*\*\*@mail.example" on "letter"; `generalise` (the quieter violet), "1987-05-14 → 1987-01-01" on "January" and "the year, kept a date" on "year", its tick landing on "stays"; `in_faculty` (green), "HLT → yes" in green and "BUS → no" in coral. On "fails", a coral slip under them, "\*\*\* in a date column · query stopped", gone on "Filter rows". On "The other ways", the function cards go, three cards come up, the ways' names as *Show the least* writes them, "Keyed hash · made at the source" (violet), "Leave it out · exam support" (coral), "Totals · small counts hidden" (grey), and the `published` shelf lights. On "learner code", under "Keyed hash", `learner_code` `a7772705…`, and on "key", a sealed card, "The registrar's key · kept by the registrar's office", never a character of it. On "left out", the `support` shelf frosts; on "grant", under "Leave it out", a coral slip, "no grant for the study".

### 5 · Who is let through · 1:09

**Narration.** A policy covers everyone but the groups it lets through: owning a table isn't enough, nor is an admin account. Who's on each list is Mei's decision: her office sees the learner table whole. The builder, registrar-loader, is let through too, or every table it built would hold stars. The help desk is let through the policy that masks names whole, and given the one that masks them in part. Each reader gets one mask for each column: two different masks for one person stop the query with an error. The study is let through the policy for the learner code: its agreement allows a code in place of who they are. An agent is never on a list: it reads with its own role's rights, as AI agents in data work shows. Only compute that applies policies can read these tables: serverless, or Databricks Runtime 16.4 and above. Older compute is refused.

**Picture.** The pane goes, and a page drawn as Catalog Explorer's *Policies* tab for `registrar` comes in where it was, with a column for the groups each policy lets through: `hide_special`, `hide_direct`, `hide_pseudonymous`, `generalise_indirect`, and `health_rows_only`, "to health_progress_study". On "owning", a coral card at the right, "Not enough · Owning a table · or an admin account". On "Mei's decision", Mei comes in at the right, her card "Registrar's office · Mei Tanaka"; on "office", `registrar_office` drops into the lists of `hide_direct`, `hide_pseudonymous` and `generalise_indirect`, and `registrar_exam_support` into `hide_special`'s. On "registrar-loader", Mei walks out; a cyan chip with a gear, `registrar-loader`, "in registrar_owners", and on "through", `registrar_owners` drops into every list; on "stars", a coral card, "If not let through", its names `***`, gone by "help desk". On "help desk", `help_desk` drops into `hide_direct`'s list; on "given", a row opens under it and `direct_in_part` slides in, "to help_desk". On "two different masks", `help_desk` is pulled out of `hide_direct`'s list for a moment, and a coral card comes in, "Error · Two masks · the query stops"; the chip goes back, and the card goes. On "study", `health_progress_study` drops into `hide_pseudonymous`'s list, then `planning_learner_readers`; on "agreement", a slip under the page, "Agreement 2026-14: a code in place of who they are". On "An agent", the agent's sphere at the right, outside the page, a card "Never on a list · its own role's rights" and a slip, "AI agents in data work". On "compute", a card "COMPUTE": a green tick and "Serverless" on "serverless", another and "Databricks Runtime 16.4 and above"; on "Older", a coral cross, "Older: refused".

### 6 · The day a table appears · 1:04

**Narration.** On Wednesday 21 October, Jun's new model is built for the first time: each learner's progress, year by year. Its columns bring their classes from its sources, as Tags that travel showed, and Mei's level comes with it. It's the 39th table, and nobody writes a mask. From its first minute, the help desk sees part of each student number, and Planning sees stars. And the study sees only Health's learners, each by their code. On the road, a load no one can name gets Guide 111, which assumes every danger. Here, a table that comes without its level shows no rows to anyone but its builder, until its owner gives it one. But a policy hides only what has a tag. A column no one has classed shows as it is, until the morning check of Proof it held finds it.

**Picture.** The hall, the kicker "Wednesday 21 October 2026 · 09:12". Jun comes in at the left, his card "Analytics engineer · Jun Park". On "built", his new table springs in, `core_progress_v1`: `student_number` S-20412, `learner_code` a7772705…, `faculty_code` HLT, `year` 2026, `credit_points` 90; on "bring", their chips land in turn (`direct`, `pseudonymous`, the `faculty` tag, `none`, `none`), beside a slip, "Tags that travel"; on "level", the level pill `confidential` and a slip, "level: set by Mei, in the model's code". On "39th", the slip turns to "The 39th table · no new mask", and on "mask", violet frost falls on `student_number` and `learner_code` at once. On "From its first minute", Jun walks out, and three views of the table come up below, each with its reader's chip: `help_desk` (`S-***12`, its codes `***`); on "Planning", `planning_learner_readers` (`***`, `a7772705…`); on "the study", `health_progress_study` (`learner_code`, `faculty_code`), and on "only", its `BUS` row folds away. On "On the road", a cut into the book as it is printed today: the yellow pages and Guide 111, its dangers lit on "every danger". On "Here", a cut back to the hall: Mei at the left, her card; a second new table springs in, `core_contact_v1` (`student_number` S-20511, `full_name` Lena Brandt, `email` l.brandt@mail.example, `preferred_name`, `faculty_code` BUS), closed under coral frost; on "builder", the chip `registrar-loader` with a green tick, and a coral slip, "everyone else: no rows". On "owner", the level pill lands; on "gives", the coral clears and its masks fall into place. On "only what has a tag", a coral ring round `preferred_name`, its value "Lena" readable, its chip's place empty; on "morning check", a slip, "found by the morning check · Proof it held".

### 7 · Kept as code · 1:08, with the end card

**Narration.** The policies are code, kept beside the grants, in the registrar's bundle. A change is a pull request the data team reviews, and Mei is told what it touches. It runs in test, then in production after a release approver, as registrar-loader, never a person. Each file replaces its policy whole, so what the repository says is what runs. On 14 October, the policies went in that morning, and the study's grant that afternoon: rules first, then the door. On the road, one guide is written once, and a new chemical needs only a line. Here, one policy is written once, and a new table needs only its tags. So a learner's name stays hidden wherever it lands, and the study sees only its own faculty's learners. The policy follows the tag, so new tables are protected the day they appear. Next: Copies that keep the rules.

**Picture.** A page drawn as GitHub's own (the GitHub mark and "GitHub" in its header): `uni-example/data-platform`, the pull request "Policies by tag for the registrar". Its files: the registrar's grants, already there, `registrar/resources/catalog.yml` and `registrar/resources/schemas.yml`, a grey "grants" pill landing on each on "grants"; and in green, one at a time on "code", `+ registrar/resources/policies.job.yml`, `+ registrar/policies/functions.sql`, `+ registrar/policies/policies.sql`, `+ registrar/policies/studies.sql` and `+ registrar/policies/check.sql`. On "pull request", "Review required · data team"; on "reviews", it gives way to a green tick and "Approved by the data team"; on "told", a cyan pill, "Told", and "Mei Tanaka · what it touches" (owners never review a pull request). On "runs", a second page, drawn as Databricks' *Jobs & Pipelines*: `registrar_policies`, its runs "test" and "production", each ticked green, the second after "release approver: approved", and "Run as" with the cyan gear chip `registrar-loader`. On "replaces", the files give way to `registrar/policies/policies.sql`, its first lines, `CREATE OR REPLACE POLICY hide_direct` lit. On "14 October", a card: "WEDNESDAY 14 OCTOBER 2026", a green tick and "Morning · the policies" on "morning", then "Afternoon · the study's grant" on "afternoon". On "On the road", a cut into the book: the yellow pages beside Guide 137, its title glowing on "written once"; on "only a line", a new line slips in, "1806 · 137 · Phosphorus pentachloride", its light runs to the guide, and "+ 1 line" is ringed. On "Here", a cut back to the hall: the catalog's pane, a new table card sliding onto `core`, "+ its tags", its marks and frost landing at once; on "hidden", light sweeps across every frosted value in the pane; on "the study", its view, and on "only", the `BUS` and `EIT` rows fold away. On "The policy follows the tag", the take-away card: **The policy follows the tag, so new tables are protected the day they appear.** On "Next", "Next · Copies that keep the rules". The end card, held without words: "The policy follows the tag.", the mark, "One policy for many tables", "Film 6 of 8 · Only what you may see · Learning Data", then "Next: Copies that keep the rules".

## Sound

*An orpharion*, with *Helmholtz resonators* (reserved in the module's `palettes.md`, 5 November 2026, 13:15 UTC; neither in any score on main or a branch, nor in any palettes list). Both made in `source/tools/score.py`, since From words to data's instruments have neither.

- **The lead:** an orpharion, the wire-strung lute of Elizabethan England (first made in London in 1580): brass and steel strings plucked softly with the fingertips, longer-ringing and rounder than a gut lute, its warmth near 900 Hz and nothing above 2.4 kHz; its fanned frets let strings of different lengths all play in tune on one fretboard, as one policy fits every table, whatever its columns are called. Played plain, a few notes at a time, never strummed, no vibrato. Made by additive synthesis of a wire string plucked about a fifth of the way along, with a fingertip's touch and a soft wooden body.
- **The partner:** Helmholtz resonators, the brass spheres of the 1860s that each answer only their own note, never struck or blown: the spheres are tuned to A, and after the orpharion plays an A, they answer it, a soft, pure, short bloom at the same pitch. A is the tag; the sphere is the policy. Where the story finds its guide (1980) and where a new table is protected the day it appears, the spheres answer in every octave.
- **The mark:** three notes, D, F sharp, A, the spheres answering the A. Under "alike" (the book of 1980), with the spheres in three octaves; an A answered on "a new chemical needs only one line"; under the title (D, F sharp, A, D); and at the end card, every sphere answering, with a low D after.
- **Key:** D major for the guide and the policy; B minor under the problem (a page for each, thousands with none, the wrong guess), with no A in it: there is no guide yet, so nothing answers. Tuned pure (just intonation from D), so no chord beats.
- **Music:** under the opening story; then only at a chapter's turn (a short figure of two or three notes, never the same twice: E, F sharp, D; A, D, E; D, C sharp, B; G, B, D; F sharp, D, A; B, C sharp, D), under a moment on screen (the frost falling at once, the seventh table and the 39th, each with an A answered in every octave; the key; the approval; the closed table opening; the new table's tags) or in a wordless pause (the title card, the end card), at most about once every 10 seconds; never a bed under the voice; no figure played twice.
- **Effects,** one at a time, each tied to something on screen, soft and below about 2.5 kHz: a wooden knock as a card comes; a soft tap as a chip, pill or row lands (once for all that land together); paper for the cab's papers and the book's pages; a breath of air as frost falls or someone comes or goes (once for all the frost that falls together); a pen's soft scratch under the masks set by hand; a soft hiss for the spray; a seal for the registrar's key; a glass touch as the closed table comes. 137 in all, at most 2 beginning in any second.
- **No urgent pulse:** nothing in this film is a breach or a rush (`film.json` `urgent: []`).
- **Mix** to -16 LUFS; `tools/quiet.py` passes: after the opening, the music sounds 13% of the time and comes in 18 times, once every 20.8 s; its loud moments -29.7 dB (at most -26.5), its loudest notes -26.4 dB; the effects' loud moments -47.2 dB; no notes beat, the room rings within 3 dB where the notes are, and nothing pulses.

## Pause and think

Four questions, at the ends of *A policy for each class*, *A function for each way*, *Who is let through* and *The day a table appears* (the last chapter holds none: the film ends there). Right answers in places 2, 3, 1 and 2; one near miss each (`near:true`); options of like length. Keys unquoted; each key is its chapter's id.

**`parts`** · "Suppose Jun's new table had no faculty column. What would the study see in it?"
1. "No rows at all: a filter that can't decide on a row keeps it hidden."
2. "Every learner's rows: a filter with no column to find doesn't apply." (right)
3. "Only Health's rows: the filter on the shelf reaches every table in it." (near)

*Why:* "A row filter needs the column it finds by its tag. The policy on the shelf does reach every table there, but where no column carries the faculty tag, it doesn't apply, and every row shows. That's why every table with learners in it carries their faculty. Which of your tables would a filter like this miss?"

**`ways`** · "Mask it whole turns words into three stars. Why does it leave a date empty instead?"
1. "So the study can still count how many learners were born in each year."
2. "Because a date is indirect, and an indirect value is always left empty." (near)
3. "Because a mask gives back the column's own type, and stars aren't a date." (right)

*Why:* "A mask must give back the same type as its column: a date column must still hold a date, or the query fails. Three stars are words, so for anything that isn't words, the mask gives back an empty value. A date of birth is indirect, but its own policy generalises it to a year, it doesn't empty it. Which columns in your data aren't words?"

**`through`** · "The help desk gets the policy that masks names in part. Why is it also let through the policy that masks them whole?"
1. "So only one mask reaches each column: two different masks stop the query." (right)
2. "So the help desk sees every value whole, as the registrar's office does."
3. "So the mask in part runs first, and the mask that hides it whole runs last." (near)

*Why:* "For one reader, each column may have only one mask. Two different ones don't run one after the other: the query stops with an error. So the help desk is let through the policy that masks names whole, and given the one that masks them in part. Where you work, who decides which readers see a value in part?"

**`appears`** · "A new table comes without its level. Who can read its rows?"
1. "Everyone on its shelf, with each column masked by its class as usual." (near)
2. "Only its builder, until its owner gives it a level and the rules apply." (right)
3. "Everyone on its shelf, as it is, until someone notices it has no level."

*Why:* "A table no one has levelled is closed to all but the job that builds it, like Guide 111's load that no one can name. The masks by class would apply to its classed columns, but the closure hides every row first, until Mei gives it its level. What would your platform show today for a table nobody has described?"

**In Spanish** (`think.es.js`, same keys, the right answers and near misses in the same places):

**`parts`** · "Supón que la nueva tabla de Jun no tuviera columna de facultad. ¿Qué vería el estudio en ella?"
1. "Ninguna fila: un filtro que no puede decidir sobre una fila la deja oculta."
2. "Las filas de todos: un filtro sin columna que encontrar no se aplica." (correcta)
3. "Solo las filas de Salud: el filtro del estante alcanza todas sus tablas." (cerca)

*Por qué:* "Un filtro de filas necesita la columna que encuentra por su etiqueta. La política del estante sí alcanza todas sus tablas, pero donde ninguna columna lleva la etiqueta de facultad no se aplica, y se ven todas las filas. Por eso cada tabla con estudiantes lleva su facultad. ¿Cuáles de tus tablas se le escaparían a un filtro así?"

**`ways`** · "Enmascararlo entero vuelve las palabras tres asteriscos. ¿Por qué deja vacía una fecha?"
1. "Para que el estudio pueda contar cuántos estudiantes nacieron cada año."
2. "Porque una fecha es indirecta, y un valor indirecto siempre queda vacío." (cerca)
3. "Porque una máscara da el tipo de su columna, y los asteriscos no son una fecha." (correcta)

*Por qué:* "Una máscara debe devolver el mismo tipo que su columna: una columna de fechas debe seguir teniendo una fecha, o la consulta falla. Tres asteriscos son palabras, así que para lo que no son palabras la máscara devuelve un valor vacío. Una fecha de nacimiento es indirecta, pero su propia política la generaliza a un año, no la vacía. ¿Qué columnas de tus datos no son palabras?"

**`through`** · "La mesa de ayuda recibe la política que enmascara los nombres en parte. ¿Por qué pasa también la que los enmascara enteros?"
1. "Para que una sola máscara llegue a cada columna: dos distintas paran la consulta." (correcta)
2. "Para que la mesa de ayuda vea cada valor entero, como la oficina de registro."
3. "Para que la máscara en parte se aplique primero, y la que oculta todo al final." (cerca)

*Por qué:* "Para un lector, cada columna puede tener una sola máscara. Dos distintas no se aplican una tras otra: la consulta se detiene con un error. Por eso la mesa de ayuda pasa la política que enmascara los nombres enteros, y recibe la que los enmascara en parte. Donde trabajas, ¿quién decide qué lectores ven un valor en parte?"

**`appears`** · "Una tabla nueva llega sin su nivel. ¿Quién puede leer sus filas?"
1. "Todos los de su estante, con cada columna enmascarada según su clase." (cerca)
2. "Solo quien la construye, hasta que su dueña le dé un nivel y apliquen las reglas." (correcta)
3. "Todos los de su estante, tal como está, hasta que alguien note que no tiene nivel."

*Por qué:* "Una tabla sin nivel queda cerrada para todos menos el proceso que la construye, como la carga sin nombre de la Guía 111. Las máscaras por clase se aplicarían a sus columnas clasificadas, pero el cierre oculta antes todas las filas, hasta que Mei le da su nivel. ¿Qué mostraría hoy tu plataforma de una tabla que nadie ha descrito?"

## The page

| Field | English | Spanish |
|---|---|---|
| kicker | Policies by tag | Políticas por etiqueta |
| title | One policy for many tables | Una política para muchas tablas |
| h1 | One policy for many tables: protected the day they appear | Una política para muchas tablas: protegidas el día que aparecen |
| lead | The registrar's catalog holds 38 tables with personal data: 140 columns to hide, and new tables keep coming. Masked by hand, each new table shows every name until someone remembers it. How can every table be protected from its first minute, with no mask written for it? | El catálogo del registro tiene 38 tablas con datos personales: 140 columnas que ocultar, y siguen llegando tablas nuevas. Enmascarada a mano, cada tabla nueva muestra todos los nombres hasta que alguien se acuerda. ¿Cómo proteger cada tabla desde su primer minuto, sin escribirle ninguna máscara? |
| card | One policy for each class, found by its tag: every table protected the day it appears, and the study sees only its faculty. | Una política por clase, hallada por su etiqueta: cada tabla protegida el día que aparece, y el estudio ve solo su facultad. |
| past | North America, 1980: one guide for chemicals that behave alike · Chemicals that behave alike got one guide, found by their number, and a new chemical needed only a line: so one policy for each class, found by its tag, protects every table the day it appears. | América del Norte, 1980: una guía para las sustancias que se comportan igual · Las sustancias que se comportan igual recibieron una sola guía, hallada por su número, y una sustancia nueva solo necesitaba una línea: así, una política por clase, hallada por su etiqueta, protege cada tabla el día que aparece. |
| next_h | You've seen one policy protect every table the day it appears. Next: copies that keep the rules, where made-up learners, totals to share and a clean room keep the protection, or a copy isn't made. | Viste una política proteger cada tabla el día que aparece. Después: copias que mantienen las reglas, donde estudiantes inventados, totales para compartir y una sala limpia mantienen la protección, o la copia no se hace. |
| chapters_es |  | page: Una página para cada una · mask: Una máscara para cada tabla · parts: Una política para cada clase · ways: Una función para cada forma · through: A quién deja pasar · appears: El día que aparece una tabla · code: Guardadas como código |
| draft | true (the module's Draft label) |  |
| elsewhere | Azure Databricks: Core concepts for attribute-based access control (ABAC); Azure Databricks: Create and manage row filter and column mask policies; Azure Databricks: Common patterns for row filtering and column masking; Azure Databricks: Requirements, quotas, and limitations for row filter and column mask policies; Databricks SQL: CREATE POLICY; Transport Canada: Emergency Response Guidebook | Azure Databricks: conceptos básicos para el control de acceso basado en atributos (ABAC); Azure Databricks: creación y administración de directivas de filtro de fila y máscara de columna; Azure Databricks: patrones comunes para el filtrado de filas y el enmascaramiento de columnas; Azure Databricks: requisitos, cuotas y limitaciones para las directivas de filtro de fila y máscara de columna; Databricks SQL: CREATE POLICY; Transport Canada: Guía de Respuesta en caso de Emergencia 2024 (PDF) |

## What the example project gets

New files only, so no cited line moves, in `films/analytics-engineering/project/examples/one-policy-for-many-tables/` (the project's `examples/` folder holds each film's worked example):

- `README.md`: what each file is, how the job runs them (a SQL task in the registrar's bundle, as `registrar-loader`, test first, then production after a release approver), and the rules: one policy per class at the highest level that fits; one mask per column per reader; let the builder through; set the level last, never on a catalog or shelf; policies before the grant that opens the door; check with `SHOW EFFECTIVE POLICIES`.
- `registrar/policies/functions.sql`: `mask_whole` (one function for every type, through `VARIANT`), `mask_in_part`, `generalise`, `in_faculty`, `no_rows`, each a few plain, deterministic lines.
- `registrar/policies/policies.sql`: the catalog's six policies and the core shelf's row filter, as the film shows them.
- `registrar/policies/studies.sql`: the study's shelf, the four classes masked whole, the study's group let through.
- `registrar/policies/check.sql`: run after the policies: fails the job if a table on the core shelf has learners' rows and no column tagged `faculty`, or if a table with personal data has no level.
- `registrar/resources/policies.job.yml`: the bundle's job, one SQL task per file, in order.
- `docs/databricks-governance.md`: a new section before its sources, *12. One policy for each class*, pointing to the example, and its sources added to the list (numbered on the day it merges, after the films before it). Section 3 (one policy for `direct`) stays as it is.

## Labs (candidates, for the module's set)

1. **A policy for each class.** The registrar's classes and readers (the office, the help desk, the study, Planning): write the four masks and the row filter, with their exception lists, and check that no reader gets two masks on one column.
2. **The table a filter misses.** Three new tables on the core shelf, one without a faculty column: find what the study would see in each, and fix it.
3. **Closed until named.** A table with no level: write the policy that closes it, try it as the builder and as a reader, then give it a level.

## Rigour to check before recording

| Claim in the film | Source, checked 5 November 2026 | Note |
|---|---|---|
| The 1970s guide gave a page to each of a few dozen chemicals | Wikipedia, *Emergency Response Guidebook* (1973: 29 chemicals); Firehouse, *Hazmatology* (1977: 43 chemicals) | The two differ on the first edition; the film says "the 1970s" and "a few dozen" |
| In 1980 the US DOT's book gave substances that behave alike one general guide | Wikipedia (the 1980 edition, "general guide pages ... replacing the specific entries for individual substances"); Firehouse (12 editions from 1980) | |
| Each chemical's four-digit number leads to its guide | ERG2024, yellow pages ("Search the yellow pages") | Said in the present; the film gives no date for numbers on vehicles |
| Guide 111 for a load no one can name; it lists every danger | ERG2024, flowchart ("Use GUIDE 111"); Guide 111's text | |
| 62 guides, nearly 2,000 numbers; made by Canada, the US and Mexico | ERG2024, counted (guides 111 to 174; 1,983 ID numbers); *User's guide* (TC, US DOT, SICT, with CIQUIME) | |
| Read the number through binoculars, from upwind | ERG2024 ("Use binoculars if available"; "APPROACH INCIDENT FROM UPWIND") | |
| Water on a chemical that gives off a poison gas when wet | ERG2024, Table 2 (water-reactive materials which produce toxic gases); UN 1754 chlorosulfonic acid, Guide 137, HCl | The film's panel shows 1754 and Guide 137; "Isolate at least 50 m": Guide 137's immediate precautionary measure for liquids, under *Evacuation* in the 2024 edition |
| Papers in the cab | ERG2024 ("Road – kept in the cab of a motor vehicle") | |
| A policy on a catalog covers every table in it, now and later | *Core concepts* ("Policies act like future grants"; "A policy attached at a catalog evaluates against all securables of that type within that catalog") | |
| Four parts: scope, principals (`TO`, `EXCEPT`), matching (`MATCH COLUMNS`, tags), function | `CREATE POLICY` | |
| Owners and admins aren't exempt; only `EXCEPT` | *Policy evaluation*; *ABAC vs table-level* (owners "can't remove, modify, or bypass it") | |
| The builder must be let through | *Requirements* (a pipeline subject to a policy leaves its tables "permanently" masked); *Policy evaluation* | dbt's identity is the same case |
| One mask per column per reader, or an error | *Policy evaluation* (`COLUMN_MASKS_FEATURE_NOT_SUPPORTED.MULTIPLE_MASKS`) | The same function with the same arguments doesn't conflict |
| A mask returns the column's type, or the query fails | *Policy evaluation*; *Row filters and column masks* | |
| Words to `***`, anything else empty: one function | *Common patterns* (VARIANT masks, `schema_of_variant`) | |
| Partial reveal with plain string functions | *Common patterns* ("Partial reveal without regex"); *Performance* | |
| A row filter finds a tagged column and takes a constant | `CREATE POLICY` ("each argument is either a constant expression or an alias"); *Common patterns* | |
| A table without the matching column isn't filtered or masked | *Core concepts* ("the policy does not apply") | |
| A table with no level closed to all but the builder | *Common patterns*, "fail closed until classified"; `NOT` in conditions (*Create and manage policies*) | `level` never on a catalog or shelf: `WHEN` sees inherited tags |
| Serverless, or Databricks Runtime 16.4 and above; older compute can't read | *Requirements* | Dedicated compute needs fine-grained access control on |
| Policies need governed tags | *Requirements* | `faculty` is a third governed tag |
| Policies are applied by a SQL task; `CREATE OR REPLACE` replaces the whole policy | `CREATE POLICY`; bundles' resource list (no policy resource, 5 Nov) | |
| The keyed learner code made at the source | *Tags that travel*'s design; Unity Catalog secrets page (a Python function could do it at read time) | The key is a sealed card |
| *Governed in Unity Catalog* wrote one policy for `direct` | Its script on main; the project's `macros/governance/personal_data.sql` | |
| Policies first, the grant in a second pull request | *Grants by design* (5 Nov 13:24 UTC) | Grants apply at deploy; policies when the task runs |
| Release status | None shown or said | Labels kept in `research.md` |

Sources, with dates and quotes, are in the film's research notes in the module's project folder (`only-what-you-may-see/6-one-policy-for-many-tables/research.md`). Release labels read on 5 November 2026, never said or shown: metastore-level policies, policies on views, deny policies, identity and context attributes in policies (Beta); the `secret()` SQL function (preview); tag propagation (Beta). The film uses none of them, and names tag propagation only as *Tags that travel*'s.

## Pacing report

```
chapter      duration   wpm  voice  longest quiet  notes
page           113.3s   131    72%           6.2s  
mask            56.5s   132    74%           3.0s  
parts           60.1s   131    73%           2.0s  
ways            57.2s   132    67%           2.4s  
through         69.1s   133    73%           2.2s  
appears         63.6s   134    70%           2.4s  
code            69.4s   127    70%           5.8s  

total 8:09.3, 1070 words, 131 wpm, voice 71% of the time, 185 wpm while speaking
sentences with under 0.5 s after them: 0; stops of 2.5 s or more inside chapters: 0
```
