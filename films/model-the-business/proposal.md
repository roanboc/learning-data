# Model the business

*Proposal for a series of two films on the ground a data model stands on, v0.1, 19 November 2026. In Spanish: Modelar el negocio. Status: in the making, on the author's stated assumptions (below), with a Draft label until the author reviews it.*

## Decided

<!-- decided: made by site-tools/build_series.py from decided.md, the series' and each film's -->
| Date | Decision |
|---|---|
| 19 November 2026 | A new series, *Model the business*, opens the topic Data modelling, as the author asked: a new film, *The map behind the sketch*, then *A Sharper Sketch*, which keeps its folder, its page at `sketch/`, its player at `assets/film3/` and its progress. The series takes *A Sharper Sketch*'s place in the topic and in the route's *start with data*. |
| 19 November 2026 | *The map behind the sketch* follows the intro's last promise (*what it means, and who decides, is the rest of the story*) and reads the university's map for a modeller: capabilities adopted from HERM, data domains each with one owner, systems of record, the glossary and who decides it, crossed to show who creates each thing and who only reads it. It teaches no new concept and points to the topic Enterprise architecture for how such a map is made. It gives the university the context a version of the EA module would have, so issue #405 closes with it (the author, 19 November 2026). |
| 19 November 2026 | One true story across both films, from the Ming History (*Mingshi*, juan 77): the Yellow Registers (1381) and the fish-scale registers (1387), the warp and the weft. *The map behind the sketch* takes the two registers; *A Sharper Sketch* their four columns, and, last, what the story didn't achieve: the white registers, kept for the real work while the yellow ones became a formality. |
| 19 November 2026 | The look is *The Inner Life of Data*'s, with *A Sharper Sketch*'s diagrams and *From words to data*'s tools: the past warm, on paper; the present in the films' dark glass; the story's people as plain silhouettes with no faces, lit at the edge, dressed for their time; never the style of Chinese painting or calligraphy, and no borrowed sounds. |
| 19 November 2026 | One playground for each film, three to five experiments each, and one evaluation for the series, of at most 12 questions, as decided for every series on 18 November 2026. |
| 19 November 2026 | A draft until the author reviews it: the series' pages say so under their title. The reference (HERM, the site's EA method, DAMA-DMBOK) and the practice behind it are assumptions, asked of the author. |
| 19 November 2026 | The opening is the Ming's two registers, checked against the *Ming History* (*Mingshi*, juan 77): the registers lost in the war and a land tax with no standard; in Zhejiang, rich families writing their fields under other households to escape labour service, so the burden fell on those who couldn't hide; then, before counting anything, a register for each thing: the Yellow Registers from 1381 (110 households to a unit, ten heads in turn) and the fish-scale registers from 1387 (fields measured by Imperial Academy students: shape, size, owner's name), the warp and the weft. The benefits: by 1393 the court could count its people again, "ten and a half million households" (10,652,870), and a field's tax went with it when sold. The film says *again*, not *ever*, and gives no acreage, which is disputed. The voice says Nanjing "Nahn-jing" and Noor "Nuur", as the other films do. The story's people are plain silhouettes dressed for their time, never drawn in the style of Chinese painting. An assumption for the author to review: that the story, its rounding and the respellings are right. |
| 19 November 2026 | The university's map is read, never drawn again: eight level-1 capabilities from HERM (*Learning and teaching* opened to five), nine data domains with their owners (student and course the registrar's office's, courses with the faculties; staff HR's; organisation Planning's), the systems of record (the student system, HR's, Finance's) and the platform's copies, and the business glossary (*Award*, *Unit offering*, *Teaching period*), all as the example project holds them. Crossed, the maps show who creates each thing (learning and teaching creates enrolments) and who only reads it (Planning). Two boxes keep a question: the class, which the registrar's office calls a unit offering, and the term, whose census date Planning counts by; *A Sharper Sketch* takes them up. The film ends on where the work starts: a ticket, the map, the glossary, a contract, then the model, from what exists. |
| 19 November 2026 | A new palette, as AGENTS.md asks: a harpsichord (the weft, plucked) and a bass clarinet (the warp, held), a pair no film on the site has and neither in the topic Data modelling, following the 12 November rule for pairing two instruments the site has. Its mark, *warp and weft*, has the harpsichord rise F A C F while the bass clarinet falls C A F, meeting on A, then an F major chord. Just intonation from F; nothing borrowed from Chinese music. Music under the opening story, then only at a turn. `tools/quiet.py`, the governance films' check, passes. |
| 19 November 2026 | The poster is the sketch on the map with its two open questions (*whose word?*, *whose date?*), at *Warp and weft*'s last line: what the film leaves for the next. |
<!-- /decided -->

## The brief

From the author (19 November 2026): add a video before *A Sharper Sketch* and make the two a series, *to indicate the enterprise architecture foundations required for good data modelling*. The topic Enterprise architecture is told in an energy company, so this film gives *the relevant enterprise architecture elements and data governance (from previous modules)* for the university, *as a follow up to the intro video*: connect it to *The Inner Life of Data*, and adjust *A Sharper Sketch* to cater for it. On issue #405, a university version of the whole EA module: it *becomes irrelevant if we provide the sufficient context for the uni instead of repeating all the films for the uni with the same content*.

## Is it sensible, beside the other series?

Yes. The topic Data modelling holds *A Sharper Sketch* (one film) and *From words to data* (seven). Neither says where a model's boxes come from in the organisation: who answers for each, where it is first written, what its word means and which part of the business uses it. Those answers are taught in other topics, in another world: capabilities, domains and owners in *The map before the data* and *Business architecture for data* (the energy utility), owners, stewards and the glossary in the three governance series (the university). The new film teaches no new concept. It reads the university's map for a modeller, in one film, and points to those topics for how such a map is made. It leaves to *From words to data* what words mean (language, ontologies, the map as one source of many views), and to *Data architecture* how data moves between systems.

So the series is: **1. The map behind the sketch** (new): place the intro's sketch on the university's map. **2. A Sharper Sketch** (reworked): make the boxes right, against a reference model. The intro draws the sketch; this series grounds it, then sharpens it; *From words to data* goes deep on meaning.

## The reference, and the alternatives

Asked of the author (AGENTS.md, stage 1); until the author answers, the films follow:

| Reference | What it adds | In the films |
|---|---|---|
| **CAUDIT's Higher Education Reference Models (HERM)**, v3.1.1 (June 2025; v3.2 announced) | A sector-owned set of reference models for universities: business capabilities, data, applications, technology | The university's eight level-1 capabilities are adopted from HERM's families, as in the example project's map; named once, as the sector's shared starting point |
| **The site's enterprise architecture method** (*The map before the data*: TOGAF's layers, ArchiMate's notation, BIZBOK's capabilities) | The layers a map is drawn in, and capabilities as what, not how | Capabilities, data domains, owners and systems of record, read from the university's map (`10-enterprise-architecture/` in the example project) |
| **DAMA-DMBOK** | Data governance's roles and the business glossary | Owners decide what words mean, the glossary holds each term once, the model copies it |
| Domain-driven design (bounded contexts) | The same word means different things in different parts of a business | Not named: the film shows it, in *class* and *term* |
| TCSI, HESA, CEDS, MortarCAPS | Data references for reporting | Stay in *A Sharper Sketch*, which checks the sketch against TCSI |
| Zachman | A classification of what an architecture describes | Not used: the films need the map, not a taxonomy of maps |

## Insights, and where they come from

| Insight | Where it comes from |
|---|---|
| Before a model is sharpened, each box needs a place: what the organisation does with it, who answers for it, where it is first written, what its word means | The author's question-to-core flow (16 November 2026): question, initiative and ticket, the map's objects and systems of record, the glossary, the core contract, then dbt |
| Capabilities say what an organisation does, not how; they outlast systems and teams | BIZBOK; *The map before the data*; HERM |
| Each data domain has one owner, the area that answers for its data; an owner decides meaning, never reviews code | DAMA-DMBOK; this site's rule (the author, 10 November 2026) |
| Each thing has one system of record; every other copy is a copy, fixed at the source | The intro (*the system of record*); the example project's realization register |
| A word is decided in the glossary first, and the model copies it | This site's rule (*Definitions come from the glossary*); the example project's glossary |
| Crossing what the business does with what it needs to know shows who creates each thing and who only reads it | *Business architecture for data* (its matrix); the CRUD matrix of information engineering |
| Words the sketch uses may not be the business's words: the registrar's office speaks of unit offerings, not classes | The example project's glossary (*Unit offering*, owned by Mei); *A Sharper Sketch* (*What is a class?*) |

## From practice

To ask the author: what a modeller gets wrong when the map is missing, and what they tell a newcomer. Assumed until then, from the site's films and the example project: models built from one system's tables inherit that system's meaning; boxes with no owner become numbers nobody can fix; a glossary grows with the questions, so a sketch finds words that aren't decided yet, and the modeller asks the owner rather than deciding them.

## One true story across the series: the registers of the Ming

China, from 1368. After years of war at the end of the Yuan, the new Ming court in Nanjing finds the registers lost and taxes without a fixed measure; in Zhejiang, rich families register their fields under other households to escape labour service. The court gives people and land a register each: the **Yellow Registers** (1381), households in units of 110, ten heads taking turns, redone every ten years, in four copies, the court's under a yellow cover, kept on the islands of Houhu lake; and the **fish-scale registers** (1387), every field measured by students of the Imperial Academy, its shape, size and owner's name drawn plot by plot like fish scales. The Ming History calls the land register the warp, which settles disputes over fields, and the household register the weft, which sets taxes and labour. When a field was sold, its tax was written down with it, *so that the property would not leave while its tax stayed*. Each household's entry had four columns: what it held at the last count, what came in, what went out, and what it holds now. Officials checked the registers each year. In time, the Ming History says, the yellow registers became a formality, and the officials who collected taxes kept their own register, the *white register*.

| Film | Its part of the story | Its four beats |
|---|---|---|
| *The map behind the sketch* | The two registers: one thing, one register, one job, crossed like warp and weft | Lost records and land hidden under other names; the burden on those who couldn't hide; two registers; a count of the empire, and a tax that follows the land |
| *A Sharper Sketch* | The four columns, and the white register | A register that only says what is now can't show where a field went; four columns that must add up; the yearly check; and, last, what the story didn't achieve: a register kept for form, with the real work in a private copy |

Drawn in *The Inner Life of Data*'s look: the past warm, on paper, as *From words to data* draws it; the registers, the fields and the lake as objects and places; the story's people as plain silhouettes with no faces, lit at the edge, dressed for their time. Never in the style of Chinese painting or calligraphy, and no borrowed sounds.

Checked on 19 November 2026 against the Ming History (*Mingshi*, juan 77, *Shihuo* 1), the dynasty's official history:

- 洪武十四年 (1381): the Yellow Registers, 110 households to a *li*, the ten with the most adults and grain as heads, one serving each year, the rest in ten *jia*; redone every ten years; four copies, one to the Ministry of Revenue (yellow paper cover), the others kept by the province, the prefecture and the county; sent to the two stores at Houhu; checked each year by one supervising secretary, two censors and four secretaries of the Ministry.
- 元季喪亂，版籍多亡，田賦無準: in the chaos at the end of the Yuan, the registers were mostly lost, and the land tax had no standard.
- 兩浙富民畏避徭役，大率以田產寄他戶: the rich of Zhejiang, avoiding labour service, mostly registered their land under other households.
- 洪武二十年 (1387): Imperial Academy students, Wu Chun among them, sent to the prefectures and counties; fields measured, numbered, with the owner's name and size, compiled as registers *like fish scales*.
- 黃冊以戶為主，詳具舊管、新收、開除、實在之數為四柱式: the yellow register is by household, with four columns: old holdings, new receipts, removals, actual.
- 魚鱗冊為經，土田之訟質焉。黃冊為緯，賦役之法定焉: the fish-scale register is the warp, land disputes are settled by it; the yellow register is the weft, the taxes and labour are set by it.
- 凡質賣田土，備書稅糧科則，官為籍記之，毋令產去稅存以為民害: when land was pledged or sold, its tax was written in full and recorded, so property would not leave while its tax stayed, to the people's harm.
- 洪武二十六年 (1393): 10,652,870 households, 60,545,812 people.
- 其後黃冊只具文，有司徵稅、編徭，則自為一冊，曰白冊: later the yellow registers were only for form; those who collected taxes and set labour made their own register, called the white register.

The film says what these say and no more: no figure for the land surveyed (the Ming History's acreage is disputed), and *for the first time since the war*, not *ever*.

## The films

### 1. The map behind the sketch (new, about 6 minutes)

The intro ended on a promise: *what it means, and who decides, is the rest of the story*. Noor, the data architect, is about to make the intro's sketch (student, class, enrolment, term, course) the model the university shares. First she places each box on the university's map, the one the energy company's films draw in eleven: what the university does (capabilities, from HERM), what it needs to know (data domains, each with one owner), where each thing is first written (systems of record; every other copy is a copy), and what each word means (the glossary, decided by its owner, copied by the model). Crossed, warp and weft, the maps say who creates each thing and who only reads it. Three boxes find their place. Two don't: the registrar's office speaks of unit offerings, not classes, and the term's census date is reported by Planning. The map can't settle that; a sharper sketch can. The film ends where every data question starts: a question, its ticket, the map, the glossary, the contract, then the model.

### 2. A Sharper Sketch (reworked)

A new opening chapter, its part of the story (the four columns), with its four beats; the recap now starts from the film before (*we placed the sketch on the university's map*); *Enrolled when?* comes back to the four columns; and the close says what the story didn't achieve (the white register) before *Models evolve: not often, but always*. The rest is as it was. It keeps its folder, its page at `sketch/`, its player at `assets/film3/` and its progress under `ld3`.

## On the site

The series takes *A Sharper Sketch*'s place in the topic Data modelling and in the route's *start with data*: Topics › Data modelling › Model the business, *The map behind the sketch* at `model-the-business/the-map-behind-the-sketch/`, *A Sharper Sketch* at `sketch/` as now. The intro's *Where next?* leads to *The map behind the sketch*; that film to *A Sharper Sketch*; *A Sharper Sketch* to *From words to data*, as now.

## Labs and evaluation

As decided on 18 November 2026: one playground for each film, three to five experiments ticked as they happen, and one evaluation of at most 12 questions for the series, mostly decisions. *The map behind the sketch*: *Place the sketch*, the university's map, a box at a time, with what goes wrong when a box has no owner, two homes, or a word nobody decided. *A Sharper Sketch*: its most hands-on lab, *Enrolled when?*, made a playground. *A Sharper Sketch*'s six labs and twelve scenarios give way to them.

## Questions for the author

1. The reference: HERM for capabilities, the site's EA method, DAMA-DMBOK for governance. Another to follow?
2. From practice: what goes wrong when a modeller works without the map, and what you'd tell a newcomer.
3. The series' title, *Model the business*, and the film's, *The map behind the sketch*.
4. Issue #405 closed by this series.

## Sources (checked 19 November 2026)

- *Mingshi* (History of Ming), juan 77, *Shihuo* 1, Wikisource: https://zh.wikisource.org/wiki/明史/卷77
- Wikipedia, *Yellow Registers* and *Fish-Scale Registers* (for the Houhu archive and its end in 1645): https://en.wikipedia.org/wiki/Yellow_Registers, https://en.wikipedia.org/wiki/Fish-Scale_Registers
- CAUDIT, *HERM Version 3.1.1 Now Available* (June 2025): https://www.caudit.edu.au/resources/herm-version-3-1-1-now-available
- EDUCAUSE, *The Higher Education Reference Models*: https://library.educause.edu/resources/2021/9/the-higher-education-reference-models
- The example project (roanboc/learning-data-project): `10-enterprise-architecture/architecture/1_strategy/2_capabilities.md`, `3_information/1_data-domains-and-objects.md`, `4_application/1_realization-register.md`, `20-data-governance/1-glossary/business-glossary.yml`
