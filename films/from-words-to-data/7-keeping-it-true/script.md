# From words to data · Keeping it true: script

*The script of Keeping it true, in the series From words to data, as filmed: 4:06, in nine chapters, in English. The narration lives in [`source/src/narration.js`](source/src/narration.js) and the pauses in [`source/src/breath.js`](source/src/breath.js); this page and those files say the same thing, and where they differ, the source wins. The timings are the voiced ones (see [Pacing report](#pacing-report)).*

## The promise

A newcomer understands it, and a data architect agrees with it. Meaning moves, so a data model drifts: what's written down and what's actually used slowly part ways. An AI agent is good at the tedious part, noticing drift and drafting the change across every layer. People decide what the business means, tests and contracts check everyone's work, and every definition carries an owner, a date and a version. **The agent recommends. People approve. Everything is versioned.**

## The story in one paragraph

Johnson hoped his dictionary of 1755 would fix English in place, and admitted in its preface that no dictionary can embalm a language; the Oxford English Dictionary is still being revised. In 2006 "planet" got a definition and the count went from nine to eight; in 2019 the kilogram became a constant of nature. At the university, three changes arrive in one month: the government adds an outcome field to the microcredential report, a credential issued in error is revoked, and a new measure, completion rate, shows 71%, 64% and 58% on three dashboards. The model, the sketch still stamped "v3 · draft", starts to drift from the data. An AI agent reads the catalog, the lineage, the queries and the new data, finds the glossary's definition and the code that calculates it have parted, and flags three definitions of completion rate with the dashboards that use each. It drafts the change package: glossary, ontology, logical model, the mapping to the government's field, the semantic layer, the contract, the tests and a note saying why. Mei approves the meaning, Noor the model, the teams the build; the tests run on the proposed change before it ships. A confident draft that invents a definition, a change that skipped review and an old meaning proposed back from old reports are all stopped by the contract and the tests. One change, followed end to end, gives three dashboards and Genie the same number, leaves last year's report reading with version two, and the sketch's stamp finally reads v3. Back to the start: a word, an idea, a thing, a mark in clay. A number in a report is a claim others can check, like a credential.

## What each object stands for

| Object | Stands for |
|---|---|
| Johnson's heavy book, with a padlock over its pages | A dictionary meant to fix a language; the lock opens and the letters drift off the page |
| A modern dictionary page with blue-pencil marks | The OED's continuing revision |
| A parchment list of nine planets, Pluto struck through, and the sky still turning | A definition changes a count without changing the world |
| A metal cylinder under a bell jar, replaced by the Planck constant | A definition moved from an artefact to a constant (2019) |
| Tags under each: owner · date · version | What every definition needs |
| A calendar with three marked days | Three changes in one month |
| The government's form with a new, highlighted field | A standard updated for a new year (the microcredential outcome) |
| A credential card stamped REVOKED | A credential issued in error |
| Three dashboards: 71%, 64%, 58% | One measure, three definitions |
| The sketch on its board, stamped "sketch v3 · draft", drifting away from a table of data | The model (what's written) and the data (what's used); the red gap between them is drift |
| Red marks on the data | Drift: a value nobody announced ("WAITLISTED"), a column whose meaning shifts, a measure defined twice, a new specification |
| A teal, geometric orb (an icosahedron inside a hexagon) | The AI agent; teal is its work. Genie keeps its own warm, round orb |
| Teal beams to four cards | The agent reading the catalog, the lineage, the queries people run and new data |
| A glossary card beside a code card, with the difference underlined in red | Comparing what's written with what's calculated |
| Teal flags on three definitions, each linked to a dashboard | Drift flagged with evidence |
| A folder of eight cards | The change package the agent drafts |
| Gold ticks | A person's approval |
| A review box, a panel of tests turning green, a gate, a stack of versions | The same review as anyone's; tests on the proposed change; shipping; versioning |
| A red stamp "nobody agreed", a red dashed path, a translucent v1 card | An invented definition, an unreviewed change, an old meaning proposed back |
| The gate marked "contract · tests" | Checks that stop anyone's change, the agent's included |
| Seven layers in a row, lighting in turn | One change end to end: glossary, ontology, logical model, shapes for writing and reading, semantic layer, contract and test, dashboards and Genie |
| Last year's report on paper, stamped "read with v2" | Every number keeps the meaning it had |
| The triangle, the clay tablet, the diploma and the digital credential | Callbacks to *What's in a word* and *Older than the systems* |

## Script

Timings are the voiced film's, from `tools/pace.py`.

### 1 · A dictionary is never finished · 0:00–0:42

**Narration.** In 1755, Samuel Johnson published his dictionary. He had hoped to fix the English language in place. In its preface, he admitted that no dictionary can embalm a language. The Oxford English Dictionary is still being revised today. In 2006, astronomers agreed a definition of planet. Nothing in the sky changed, and the count went from nine to eight. In 2019, even the kilogram got a new definition. Meaning moves. Every definition needs an owner, a date and a version.

**Picture.** The warm past (histBg). A heavy leather book, gilt, "A Dictionary of the English Language · Samuel Johnson · 1755", opens on two curved pages of entries (credential, credit, curriculum, degree, diploma, enrol, nice, student). A gold padlock settles over the gutter: "hoped: to fix the language in place". It opens, and letters lift off the page: "no dictionary can embalm a language". The book moves left; a modern OED page appears on the right, and a blue pencil strikes a sense, writes "digital, too", circles a word and marks a new sense: "still revised". Then 2006, Prague: a parchment list of nine planets beside a turning solar system; a card "planet · IAU, 2006: orbits the Sun, is nearly round, has cleared its orbit"; Pluto is struck through, the count turns from 9 to 8, and Pluto, still orbiting, is labelled "dwarf planet"; "nothing in the sky changed". Then 2019: the metal cylinder under its bell jar gives way to the Planck constant, "defined by a constant of nature". Last, the three on a timeline, "meaning moves", with a row of tags under each as they're named: owner (Samuel Johnson, IAU, CGPM), date (1755, 24 Aug 2006, 20 May 2019), version (1st edition, Resolution B5, revised SI). Wordless breather: the title card, *Keeping it true*, "who keeps the meaning up to date".

**On screen.** 1755 · Johnson · hoped: to fix the language in place · no dictionary can embalm a language · today · Oxford English Dictionary · still revised · 2006 · Prague · planet · IAU, 2006 · count 9 → 8 · dwarf planet · 2019 · the kilogram · h = 6.626 070 15 × 10⁻³⁴ J s · owner · date · version · *Keeping it true*

### 2 · Change arrives · 0:42–1:05

**Narration.** At the university, three changes arrive in one month. The government adds a new field to what universities report about microcredentials. A credential was issued in error, and has to be revoked. And a new measure, completion rate, appears in three dashboards, with three different definitions.

**Picture.** The films' dark glass. A calendar for October 2026. Three cards arrive and their days are marked: the government's "Microcredential report · 2027" with a new, amber field, Outcome (completed · withdrawn · enrolled); Jordan Lee's microcredential in Data Visualisation, "issued in error", stamped REVOKED; three dashboards in the style of *Silent change*, Short courses 71%, Planning 64%, Learning platform 58%, joined by one label, "completion rate".

**On screen.** October 2026 · three changes, one month · 6 Oct a new field to report · 14 Oct a credential revoked · 22 Oct one measure, three numbers · Outcome · new · REVOKED · “completion rate” · 71% · 64% · 58%

### 3 · How models go stale · 1:05–1:27

**Narration.** Models rarely break all at once. They drift. A value nobody announced, as in Silent change. A column whose meaning slowly shifts. One measure, defined twice. A standard, updated for a new year. Drift is the gap between what's written down and what's actually used.

**Picture.** The sketch (the credential and its kinds) on a board, "the model · what's written", stamped "sketch v3 · draft", above a table of enrolments, "the data · what's used", joined by dashed lines. Through the chapter the board drifts up and away and the lines stretch and redden. Four red marks as they're named: WAITLISTED in the status column, "a value nobody announced"; the "online" column, "meaning shifts: recorded → live"; two code chips for completion_rate with different formulas, "one measure, defined twice"; the government specification turning from 2026 to 2027, "updated for a new year". Then a red band opens across the gap: "drift: what's written vs what's used".

**On screen.** the model · what's written · sketch v3 · draft · the data · what's used · WAITLISTED · meaning shifts: recorded → live · one measure, defined twice · updated for a new year · drift: what's written vs what's used

### 4 · AI as a watcher · 1:27–1:58

**Narration.** This is where AI helps first. An agent can read the catalog, the lineage, the queries people run, and new data as it arrives. It compares each definition in the glossary with the code that calculates it, and spots where the two have parted. It flags each drift, with evidence: three definitions of completion rate, and the dashboards that use each one. Noticing is tedious for people, and cheap for machines.

**Picture.** "where AI helps first". The agent, a teal geometric orb, sends a beam to each of four cards as they're named: the catalog (tables and their owners), the lineage (bronze, silver, gold, three dashboards), the queries people run (scrolling SQL), and new data (tiles arriving). Then the glossary's completion rate v2, "learners who completed ÷ all who started", beside the learning platform's SQL, "sum(finished_all_modules) / count(logged_in)"; the two phrases are underlined in red, "the two have parted". Then the evidence: three definitions, each flagged in teal and linked to the dashboard that uses it (71%, 64%, 58%), and three counters: queries read tonight, definitions compared, drifts flagged.

**On screen.** catalog · lineage · queries people run · new data · what's written · what's used · the two have parted · evidence · definition 1 · their own · definition 2 · glossary v2 · definition 3 · v1, 2019 · 12,480 queries read tonight · 214 definitions compared · 3 drifts flagged

### 5 · AI as a drafter · 1:58–2:20

**Narration.** Then it drafts the change. A new entry for the glossary. A new statement in the ontology. The logical model, the mapping to the government's field, the semantic layer, the contract, the tests, and a note saying why. Drafting is cheap now. Judging the draft is still the job.

**Picture.** A teal folder, "change package · draft". Eight cards fly from the agent into it as they're named: Glossary (completion rate v3), Ontology (revoked is not completed), Logical model (Enrolment + outcome), Mapping (outcome → gov. field), Semantic layer (completion_rate), Contract (outcome: 3 values), Tests (revoked not counted), Change note (why). A teal "draft" stamp: "drafting: cheap". A gold magnifier moves over the cards: "judging: still the job".

**On screen.** change package · draft · the eight cards · drafting: cheap · judging: still the job

### 6 · People decide · 2:20–2:44

**Narration.** Mei, from the registrar's office, approves the meaning. Noor, the architect, approves the model. The teams approve the build. The agent's draft goes through the same review as anyone's. The tests run on the proposed change, before anything ships. The agent recommends. People approve. Everything is versioned.

**Picture.** Three cards over Mei, Noor, and Sam and Ben for the teams: the meaning (glossary, ontology), the model (logical model, mapping), the build (semantic layer, contract, tests). Each gets a gold tick as it's named, and its items turn from teal to gold. Then "#214 · from: the agent" and "#213 · from: Sam" merge into the same review; four tests on the proposed change turn green (allowed values, revoked not counted, one definition, one measure, 2025 report unchanged); the gate opens, "ships", and v3 lands on a stack of versions. Three phrases light in turn: the agent recommends (teal), people approve (gold), everything is versioned.

**On screen.** the meaning · the model · the build · review · by people · the same review as anyone's · tests, on the proposed change · ships · v1 · v2 · v3 · The agent recommends. People approve. Everything is versioned.

### 7 · What can go wrong · 2:44–3:05

**Narration.** A confident draft can invent a definition that nobody agreed. A change can slip through that nobody reviewed. And an agent that learns from old reports can propose an old meaning back. So the tests and the contracts check the agent's work too, just as they check ours.

**Picture.** A gate, "contract · tests", in front of the dashboards (71%, unchanged). A confident teal draft, "completion rate = passed ÷ enrolled on day one", stamped in red "nobody agreed". A change on a red dashed path passes under the review box: "not reviewed". From a stack of old reports (2019 to 2021), a translucent card rises: "completion rate (v1): finished ÷ logged in", "an old meaning, proposed back". All three reach the gate; it turns red and stops them. A change from Sam passes the same gate with a gold tick: "everyone's work, the same checks".

**On screen.** draft · glossary · confident · nobody agreed · review · change #219 · not reviewed · Report 2019 · completion rate (v1) · an old meaning, proposed back · contract · tests · stopped · everyone's work, the same checks

### 8 · End to end · 3:05–3:41

**Narration.** Follow one change all the way through. Completion rate gets one definition in the glossary, one statement in the ontology, one measure in the semantic layer, and one test. The three dashboards agree. Genie gives the same number, and shows why. Last year's report still reads with last year's definition, version two, unchanged. Each number keeps the meaning it had. And the sketch's stamp finally reads: version three.

**Picture.** "one change, end to end": seven layers in a row light in gold as the narration reaches them, each with a gold tick, and under the lit one a card with what changes in it. Then the three dashboards change to 71%, each reading "completion_rate · v3", and Genie's warm orb answers "71% of microcredential learners completed", with its why: completion rate v3, from the semantic layer. Then last year's report on paper, 62%, stamped "read with v2", linked to the v2 definition, while this year's 71% links to v3: "each number keeps the meaning it had". Last, the sketch on its board: the stamp flickers from "sketch v3 · draft" to "sketch v3", three gold ticks, "approved: Mei, Noor and the teams". Wordless breather: the light runs along the chain again.

**On screen.** one change, end to end · Glossary · Ontology · Logical model · Write · read · Semantic layer · Contract · test · Dashboards · Genie · 71% · three dashboards, one number · why: completion rate v3 · Annual report 2025 · read with v2 · each number keeps the meaning it had · sketch v3 · approved: Mei, Noor and the teams

### 9 · Pull back · 3:41–4:06

**Narration.** Back to the start of the series: a word, an idea, a thing, and a mark in clay. A credential is a claim that others can check. So is every number in a report. The tools have changed. The job hasn't: agree what things are, write it down, and keep it true.

**Picture.** The warm past again. The triangle from *What's in a word* (the word "credential", the idea "a trusted, checkable claim", a diploma), its corners lighting as they're named, and a clay tablet from Uruk with wedges pressed in. Then a digital microcredential (*Older than the systems*) beside a number in a report drawn as the same card: issuer, claim "71% completed", evidence "definition v3 · tests", date: "a claim that others can check". Then the tools, a row from clay to the agent (tablet, wax seal, diploma, digital credential, agent), dim as three panels light: agree what things are (the triangle), write it down (a sheet), keep it true (the agent, a v3 stamp, a gold tick). Wordless end card: "Agree what things are, write it down, and keep it true." *Keeping it true*.

**On screen.** What's in a word · a trusted, checkable claim · c. 3300 BCE · Uruk · Older than the systems · a number in a report · a claim that others can check · agree what things are · write it down · keep it true

## Pause and think

Four stops, one question each, at the ends of *Change arrives*, *AI as a watcher*, *People decide* and *End to end*. Each links to the film's own lab.

| After | Question | Answer, in short |
|---|---|---|
| 2 · Change arrives | A new measure shows three different numbers on three dashboards. What's the most likely reason? | Each dashboard calculates its own definition. That's drift: what's used has parted from what's written. |
| 4 · AI as a watcher | Why is noticing drift a good first job for an AI agent? | It can read every query, definition and new value tirelessly, and show the evidence; deciding stays with people. |
| 6 · People decide | The agent's draft changes the glossary, the model and the tests. Who approves it? | The owners: of the meaning, of the model and of the build. The agent recommends; tests check the result. |
| 8 · End to end | Completion rate was redefined this year. What happens to last year's report? | It keeps its number, read with last year's version; restate it beside the new one if you need to compare. |

## Rigour sheet

| Chapter | What the film says | What an expert would add, or what it simplifies |
|---|---|---|
| 1 | Johnson hoped to fix English, and admitted in the preface that no dictionary can embalm a language. | The preface says the lexicographer "shall imagine that his dictionary can embalm his language" would be derided, and that he "flattered myself for a while" that it could fix the language. The film paraphrases; it doesn't quote. Johnson himself revised the dictionary for the fourth edition (1773). |
| 1 | The OED is still being revised. | The third edition has been under way since the 1990s, published online since 2000, with quarterly updates of new and revised entries. |
| 1 | In 2006 astronomers agreed a definition of planet, and the count went from nine to eight. | IAU Resolution B5, adopted at the General Assembly in Prague on 24 August 2006: orbits the Sun, is in hydrostatic equilibrium (nearly round), has cleared the neighbourhood of its orbit. Pluto became a dwarf planet (Resolution B6). Some planetary scientists still dispute the definition. |
| 1 | In 2019 the kilogram got a new definition. | Decided by the CGPM on 16 November 2018, in force from 20 May 2019: the Planck constant fixed at exactly 6.626 070 15 × 10⁻³⁴ J s, replacing the International Prototype of the Kilogram, sanctioned in 1889. The film's owner tags (Johnson, IAU, CGPM) name who decided; the BIPM keeps the SI. |
| 2 | The government adds a reporting field; a credential is revoked; three dashboards show three numbers. | Invented, like the university. Real reporting specifications (in Australia, TCSI; elsewhere, national statistics returns) do change every year. Revocation is part of the credential models in *Older than the systems* (W3C Verifiable Credentials have a status). |
| 3 | Drift: a value nobody announced, a column whose meaning shifts, a measure defined twice, a standard updated. | Practitioners also call these schema drift, semantic drift and metric inconsistency; the film uses one word for the gap between the written model and actual use. Data drift in machine learning (a change in the distribution of values) is a related but different idea. |
| 4 | An agent reads the catalog, the lineage, the queries and new data, compares definitions with code and flags drift with evidence. | Each input exists in current platforms (catalogs with lineage and query history, quality monitoring), and agents can be given read access to them. How well an agent does this depends on the metadata being complete; the film shows a well-kept platform. Agents can be wrong, which is why their flags come with evidence. |
| 5 | The agent drafts a change package across every layer. | Current tools draft parts of this: for example, dbt Copilot generates documentation, tests, semantic models and metrics, and Databricks suggests AI-generated comments for Unity Catalog objects that it says a person should review. A single agent drafting every layer at once is the direction of travel, not yet a standard product. No product is named on screen. |
| 6 | Mei approves the meaning, Noor the model, the teams the build; the tests run on the proposed change. | This is ordinary change management (pull requests, CI tests, approvals by code owners and data stewards). The film keeps one owner per layer; real organisations often have a governance council for shared terms. |
| 7 | A confident draft can invent a definition; an unreviewed change can slip through; an agent can propose an old meaning back. | Language models do produce plausible, unsupported answers, and learn from whatever they read. Tests and contracts catch what they are written to check; they don't catch a wrong meaning that nobody wrote a test for, so review by the owner still matters. |
| 8 | One definition in the glossary, one statement in the ontology, one measure in the semantic layer, one test; the dashboards and Genie agree; last year's report reads with v2. | The film follows one measure; a real change also touches the lineage, access policies and documentation. "Genie" is the platform's AI assistant from the earlier films. Restating an old figure under a new definition is common in official statistics, and is always labelled. |
| 9 | A number in a report is a claim others can check, like a credential. | The analogy is the series' spine: issuer, claim, evidence, date. For a number, the evidence is its definition, its lineage and its tests. |

## Sources

- Samuel Johnson, *Preface to A Dictionary of the English Language* (1755): the passages on fixing the language ("I flattered myself for a while") and on the lexicographer who imagines "his dictionary can embalm his language". Text on Project Gutenberg (eBook 5430). Checked 28 September 2026.
- Oxford English Dictionary, "OED editions" and "Updates" pages: the third edition's continuing revision and its quarterly updates. Checked 28 September 2026.
- International Astronomical Union, Resolutions B5 and B6, General Assembly, Prague, 24 August 2006. Checked 28 September 2026.
- NIST and BIPM on the revised SI: the CGPM decision of 16 November 2018, in force from 20 May 2019, and the fixed value of the Planck constant, 6.626 070 15 × 10⁻³⁴ J s. Checked 28 September 2026.
- dbt Labs, dbt Copilot documentation (generating documentation, tests, semantic models and metrics); Databricks, "Add AI-generated comments to Unity Catalog objects" (review before saving). Checked 28 September 2026.
- To check: the International Prototype of the Kilogram's sanction by the first CGPM (1889); the fourth edition of Johnson's dictionary (1773); current products for drift detection and AI-drafted model changes, and their maturity, on the day of release.

## Pacing report

```
chapter      duration   wpm  voice  longest quiet  notes
dict            42.2s   114    73%           5.4s  
arrives         22.9s   121    73%           1.8s  
stale           22.2s   122    75%           1.8s  
watch           31.0s   137    77%           1.8s  
draft           21.9s   134    74%           1.8s  
decide          23.9s   118    77%           1.8s  
wrong           21.7s   133    74%           1.8s  
e2e             35.9s   114    70%           4.8s  
end             24.6s   127    60%           6.0s  

total 4:06.2, 506 words, 123 wpm, voice 73% of the time, 170 wpm while speaking
sentences with under 0.5 s after them: 0; stops of 2.5 s or more inside chapters: 0
```
