# Data governance, off the shelf

*Proposal for a series on data governance that works where data work happens, v0.5: *Governance you can use* (*Gobernanza que puedes usar*), named on 20 October 2026; the folder is named after the topic. Status: proposed, 16 October 2026; the opening film, *Off the shelf*, made 17 October 2026; the plan for films 2 to 19 approved by the author on 20 October 2026, with a new part on governance as a capability: nineteen films in three parts. A companion series on master and reference data is proposed beside it, in [`../master-and-reference-data/proposal.md`](../master-and-reference-data/proposal.md).*

## Decided

| Date | Decision |
|---|---|
| 16 October 2026 | A series on data governance, and a companion series on master and reference data. Both align with the series on definitions and modelling (*From words to data*, *In the weeds of data crafting*). |
| 16 October 2026 | DAMA-DMBOK is the reference body. It's named once, in the opening film; after that, the series teaches what to do, not the framework's vocabulary. |
| 16 October 2026 | Very practical, with no over-conceptualisation. The series shows governance **enablers**: things in the work that make the right thing the easy thing, and enforce it. Not assessments, plans and heavy documentation with low enforcement. |
| 16 October 2026 | More films on data quality (another film, on fixing at the source) and on data product ownership. |
| 16 October 2026 | A second part, *With the tools*: films on Databricks and dbt that implement the governance elements, each expanding the films of the first part it names. It includes data products and a marketplace with open formats for contracts and products, with Ontos (Databricks Labs) as the example. |
| 16 October 2026 | Governance is about people and processes first. Tools help, and the series shows them, but governance is human work: understanding, motivation, change management, support and guidance. Every film shows its people side, and the last film, *Teachers of data*, is about it. |
| 16 October 2026 | The governance team are the teachers of data, where all the pieces come together, as DAMA's wheel shows with governance at its centre. The proposal maps which of DAMA's knowledge areas each series and film covers. |
| 16 October 2026 | The look is **toy town**, chosen from three looks drawn with the same two moments of *Off the shelf* (toy town, the building in section, a graphic novel). The university is a model town on a table: rooms open at the front like dollhouses, people as painted figures on small bases, a soft blur at the top and bottom of the frame. It replaces "the binder is paper, the enablers are glass". Fewer diagrams, more situations: ideas are shown as people doing things in places. *Replaced by watercolour on 17 October 2026 (below).* |
| 16 October 2026 | *Off the shelf* keeps the Magna Carta opening, as the checks found it: the clause promised one measure, and measures still differed for six centuries; what worked, by the late 1800s, was all of it together (one definition in law, a copy in every county, an inspector who checked, with the law behind him). Inspectors came with the Act of 1834, local measures were abolished in 1835, and the Act of 1878 gave the uniformity. |
| 16 October 2026 | Current versions, named once in *Off the shelf*: DAMA-DMBOK, second edition, revised (2024); DCAM v3 (2025), now the EDM Association's; ISO 8000 for data quality; ISO/IEC 38505-1:2026, which replaced the 2017 edition. |
| 17 October 2026 | *Off the shelf* has its own sound: a soft brass choir, in D dorian for the market town and F major for today; a low music box for the moments that land; the series' mark, 1-5-4-8, on a horn at the title and the end; and one low pulse, only under the two numbers that disagree. Every effect is something on screen (a knock, paper, a cork pin, a rubber stamp, a hammer's thud). |
| 17 October 2026 | In Spanish, data governance is *gobernanza de datos*, never *gobierno de datos*: the films also speak of the government (*el gobierno*), and the two must not be confused. An award is a *título*, and Planning is *Planificación*, as in the other series. |
| 17 October 2026 | On the site, until the author chooses the series' title, it goes by *Governance you can use* (*Gobernanza que puedes usar*), the one option of the three that isn't also a film's title. The films' pictures and voice never name the series, so changing it needs no new render. |
| 17 October 2026 | On the site, the series has a topic of its own, *Data governance*, the seventh, after *Master and reference data*, which its own series opened. *Off the shelf* builds on *Declare it, then build it*, whose loop of ten steps it pins, and *Who owns what*. Until the author decides otherwise. |
| 17 October 2026 | *Off the shelf* stops for Pause and think after three chapters: *Who decides?*, *What governance is for* and *Where does it run?*, one question each. Labs and scenarios come later, with the series' first lab, *Where does it run?* |
| 17 October 2026 | A moment timed to a word must find that word, whole, in its line: the series' `build.py` stops when one doesn't (`shared/tools/cues.py`). Review found three in *Off the shelf* that came early: "again" had landed on "against", and two words weren't in their lines at all. |
| 17 October 2026 | The look is **watercolour**, the look of the series on master and reference data, in place of toy town: the author didn't like toy town's style, nor a landscape that showed homes and places unrelated to the university. The two series now look like one university. The series paints with master data's `wash.js` and `people.js`, bundled as they are, and adds its own places (`shared/src/rooms.js`). The films show only the university's own places: the campus, Yusuf's office, the floor of offices behind glass where the work is done, each team's room, and close-ups of their boards, screens and papers. Behind each person, a soft wash of their side: gold for the business side, cyan for the technical side. *Off the shelf*'s narration stays as it was. |
| 17 October 2026 | *Off the shelf*, redrawn in watercolour: in *Where does it run?*, Yusuf marks policy 12 line by line with three highlighters (green, runs in the work; gold, a decision someone owns; grey, can go), in place of three trays; in *Where decisions enter*, Jun asks "Another meeting?" and Yusuf holds up the box of gold pins; in *The series*, nine binders light up on the shelf, Yusuf takes down *Who decides*, the data team's board shows *With the tools* with six cards, and he carries the binder down the floor to where the work is done. |
| 17 October 2026 | A caption of more than about 140 characters runs to three lines in the player, and its box covers the picture: the series' `build.py` stops on one, in English and in every language's captions. Review found the last line of *Where decisions enter* at 163 characters, covering a label on the poster; it's now two lines, with the same words. |
| 20 October 2026 | A new part after the films on what governance needs, and before the films on the tools: two or three films (three proposed) that design data governance as a capability, in enterprise architecture terms, end to end: the services it offers, its processes, the roles and actors, the business glossary run as a business product, the information assets and the models. It links to *The map before the data*, and the tools films get the architectural context: governance artifacts are kept in several repositories and apps. The tools films move to the end of the series. |
| 20 October 2026 | Early in the films on what governance needs, the series shows one of governance's key challenges: having one trusted business glossary, where most organisations have many, siloed, inconsistent, invisible to others and unused. Then other tools use its definitions and stay in sync. *One word, one home* opens its story with it, and *Who decides* hands over to it. |
| 20 October 2026 | The author approved the plan for films 2 to 19, as revised that day: one series of nineteen films in three parts, *What governance needs* (films 1 to 10), *Governance as a capability* (11 to 13) and *With the tools* (14 to 19). The story, the people and the university carry over, and each tools film says which films it expands. Each film still gets its own script, its fact checks and the author's review of its video. |
| 20 October 2026 | Part two has three films, each a decision of its own: the capability and the services it offers (*A capability, not a project*), one service followed end to end, with the glossary run as a product (*Who does what, end to end*), and one home for every governance artifact across repositories and apps (*Where each piece lives*). |
| 20 October 2026 | Part two's reference is what *The map before the data* teaches (capabilities, services, processes, roles and actors, business objects, drawn in ArchiMate 4), with DAMA-DMBOK's roles and DCAM's capabilities for governance itself, so the two series read as one. DAMA and DCAM stay named once, in *Off the shelf*. |
| 20 October 2026 | A definition is written once, in Noor's architecture map, which publishes it to the business glossary, as *Meaning machines can read* and *The map before the data* show. The glossary is still run as the business's product, and every other tool syncs from it, one way. |
| 20 October 2026 | Ontos is the example for products and contracts (*Products in open formats*, *The marketplace*), said plainly to be a Databricks Labs project without formal support. The open contract file is the part that lasts. |
| 20 October 2026 | *Rules that run* opens in Cairo, in 861: the Nilometer, where the year's tax followed the river's measured height, not a report. No opening in this series or its companion came from Africa, and each already opened once in Rome. It's checked against Egyptian sources when the film is scripted. |
| 20 October 2026 | The films are made one thread per film, side by side, after *Off the shelf* and one shared pass that adds the places several films need to the series' shared pictures (a film may not change them for itself). The example project's additions come from one thread, the governance check first, and each file exists before the film that shows it is scripted. Films 11 to 13 start once part one's scripts are approved, and films 14 to 19 once part two's are. |
| 20 October 2026 | Labs and scenarios come per film, as in *In the weeds of data crafting*: each film has its own fix to practise. |
| 20 October 2026 | The series is *Governance you can use* (*Gobernanza que puedes usar*), the name the site already used; the other two options, *Off the shelf* and *Rules that run*, are film titles. |
| 20 October 2026 | *Off the shelf*'s last chapter names the three parts: on "three more", three cards on Yusuf's board for the films on governance as a capability, and the films on the tools, numbered 14 to 19, on the data team's board. The title and end cards say "Film 1 of 19". The film also takes the master and reference data series' fix that blotches a wash right to the frame's edge, which removes pale bands along the top and left of some walls; the author agreed to take it the same day. |
| 20 October 2026 | The places the later films share are painted once, in the series' shared pictures (`shared/src/rooms.js`): the stewards' meeting room, with a long table people sit behind; the registrar's, the platform team's and a faculty analyst's desks close up, each with a screen for what the film shows; and Noor's room, whose wall is her architecture map in the six layers and colours of *The map before the data*, with room in each layer for the cards part two pins up. One new person, Anil Kurian, an analyst in the Faculty of Health, is the faculty's analyst the films need, such as in *An agent that checks*. |
| 21 October 2026 | The story's numbers and dates that more than one film touches are kept in one place, *The facts the films share* below, so no two films choose differently. A film that needs a new one asks the thread of *Off the shelf*, which adds it there. The first were asked for by *Teachers of data*: the binder's 215 lines and where they end, the number on submission day, the stewards' monthly meeting and Thursday office hours, and a fifth rule for the governance check that warns until 1 December 2026. |
| 21 October 2026 | Each policy is a binder of the same number, and each film of part one opens its own: 2 (*Who decides*), 12 (*One word, one home*, the binder *Off the shelf* already opens), then 6, 9, 15, 19, 22, 26 and 29 for *Who may see it* to *Teachers of data*, so no two films show the same one. *Off the shelf*'s shelf shows no numbers. Policy 26 is *AI and automated tools*. |
| 21 October 2026 | Two additions to the series' shared pictures, asked for by the films that show them, so every film draws them the same way: Marta Nowak, who leads the wallet app team, joins the shared people (`shared/src/people.js`) for *Change without surprises*; and the learning team's office, Tom's, has soft apricot walls (`GV_ROOM.learn`, in `shared/src/rooms.js`), for *Rules that run* and *Fixed where it starts*. |

## The brief

From the author (16 October 2026): a data governance series, and a master and reference data series; draft the storyline and the themes to cover. They should align with the other series, especially those on definitions and modelling. Use DAMA as the reference body, but keep it very practical and avoid over-conceptualisation. Show data governance enablers: governance often becomes a body without tools, only assessments and plans, with heavy documentation, low enforcement and no real support for actual data work.

Added the same day: more films on data quality and on data product ownership, and films on the tools, specifically Databricks and dbt, that implement some of those governance elements, expanded from the films they reference. Of interest: data products and marketplace solutions such as Databricks' Ontos, which help with data domains, contracts and data products in open formats.

And later the same day: governance focuses on people and processes, which is why it benefits from the right tools too; but it's ultimately human work, requiring human understanding and motivation, change management, support and guidance. Data governance teams are the teachers of data, where all the pieces come together, as DAMA shows in its knowledge areas. Say which of those areas each series covers.

On 20 October 2026, after reading the plan for the other films: "I like the approach, but I think we would benefit of another section after video 10 with two or three videos focusing on designing data governance as a capability in enterprise architecture terms and the elements end to end (services, processes, business glossaries as business products, relevant DG roles and actors, information assets, models, etc). This should go before tooling and would link with enterprise architecture and the implementation would get the architectural context knowing there are multiple governance artifacts maintained in other repos and apps. It's also good to show somewhere in section 1, probably in the starting videos, that one of the challenges is to actually have one trusted business glossary, as you would generally find many: siloed, inconsistent, invisible to others, unused, etc. It's one of the key challenges. And then making other tools use those definitions and sync."

## Analysis

**What works**

- **The problem is real and everyone has seen it.** A policy library, a maturity score, a RACI with blanks, a council that meets monthly, and data work that carries on without any of it. Naming that honestly earns the trust of both audiences: the governance lead who wrote the binder, and the engineer who never read it.
- **The other series already built the enablers.** The glossary as the home of a definition and its sync (DEC-PRJ-11, `skills/sync-the-glossary/`), owners in `meta`, `personal_data` on columns, decision logs with who and when, contracts, tests with agreed severity, exposures, versions. This series shows them from governance's side: as the way a policy reaches the work.
- **DAMA as a map, not a syllabus.** DAMA-DMBOK's knowledge areas are a good checklist of what has to be governed. Teaching each area's vocabulary is how governance becomes conceptual; teaching what runs in each is how it becomes useful.

**What this proposal adds**

- **People and processes first; tools in support.** The enablers in this series work only because people understand them, want them and are helped to use them. Governance is human work: listening, explaining, agreeing, changing habits, supporting people when a check stops them. Each film shows its people side next to its enabler, and none shows a tool replacing a conversation.
- **Governance as the teacher of data.** DAMA's wheel puts governance at the centre, where every other knowledge area meets. The series ends there: the governance team's lasting job is to teach how the pieces fit, for which these films, their labs and the enablers' own messages are material.
- **One test for every policy line: where does it run?** Every line of the binder ends the series in one of three places: it runs somewhere (a required field, a check, a tag, a route, a test), it's a decision someone owns and has recorded, or it's retired.
- **Enable first, then enforce.** An enabler first makes the right thing easier (a field pre-filled, a definition already there, a mask applied for you); only then does a check stop what's still wrong. A check without the enabler is just a new way to say no.
- **Governance decides; the platform does.** Governance sets decision rights and a few shared rules. Owners decide meaning in their domains. The platform and the pipeline carry the rules out, on every change.
- **Measured by use, not by maturity.** *Teachers of data* replaces the maturity assessment with measures read from the work itself.
- **One trusted glossary, not many.** Most organisations have several glossaries: siloed, inconsistent, invisible to others and unused. Keeping one that everyone trusts, and making every other tool read from it, is one of governance's key challenges, and *One word, one home* is about it.
- **Governance as a capability, on the architecture map.** Part two designs governance the way *The map before the data* designs any part of an organisation: a capability that outlasts projects, the services it offers people, who does what end to end, and one home for every governance artifact across repositories and apps. The tools films then build each flow knowing where it belongs.

## The spine: where does each policy line run?

The university's governance programme starts the series with a binder: 34 policies, a maturity assessment of 2.1 out of 5, a RACI, and a council. Each film takes one kind of policy line and moves it off the shelf, into the work:

| The binder says | Where it runs | Film |
|---|---|---|
| "Every critical data element has an accountable owner." | `owner` is required on every domain, entity and public model; a change asks its owner to review it, automatically | Who decides |
| "Business terms are defined consistently across the organisation." | One trusted business glossary in place of many; every other tool reads or syncs from it; a sync flags drift and proposes the change as a pull request (DEC-PRJ-11) | One word, one home |
| "Personal data is classified and protected." | Every column of a public model is classified; the platform masks by classification, wherever the column travels | Who may see it |
| "Data quality is monitored and issues are remediated." | Each rule is a test with an owner, a threshold and a reason; a scorecard is read from the last run; a failure opens an issue for its owner | Rules that run |
| "Root causes of data quality issues are addressed." | Each issue is traced to where the data was made, fixed there, and turned into a check at entry; monitoring watches for what no rule names | Fixed where it starts |
| "Changes are assessed for impact before they are made." | Every pull request carries its impact: lineage, tests, exposures and their owners; a breaking change is a new version | Change without surprises |
| "Data is managed as an asset with clear accountability." | Data products with an owner, a contract, service levels and a lifecycle, published where consumers find and request them | A product with an owner |
| "AI use follows the organisation's data policies." | Agents read the same rules as checks and skills, with least privilege; they draft and flag, people approve | An agent that checks |
| "Governance maturity is assessed annually." | Measures read from the metadata and the runs, every day; a stewards' community, guidance beside every check, and rollouts that warn first | Teachers of data |
| "The data governance programme has a charter, and the council reviews it every year." | Governance on the architecture map as a capability, with services people ask for, roles end to end, and one home for every artifact; a budget line every year, not a project | A capability, not a project; Who does what, end to end; Where each piece lives |

## Foundations: DAMA, named once

*Off the shelf* names the bodies of knowledge once: **DAMA-DMBOK** (the reference, with data governance at the centre of its wheel of knowledge areas), and, in a line, DCAM, ISO 8000 for data quality, and ISO/IEC 38505 for the governance of data. After that, the series teaches what to do.

Governance sits at the centre of DAMA's wheel because it's where the other knowledge areas meet, and where someone has to explain how they fit. The films across the site already teach most of them. This series and its companion fill the gaps, and *Teachers of data* closes on the wheel, each area lit with the films that teach it.

**DAMA's knowledge areas, and where the films cover them:**

| Knowledge area | Where it's covered | Films |
|---|---|---|
| Data governance | This series; touched in every series that shows people approving | Here: all, centrally *Off the shelf*, *Who decides*, *Teachers of data*, *A capability, not a project*, *Who does what, end to end*. Also *Keeping it true*, *An agent on the team* |
| Data architecture | *The map before the data*; *In the weeds of data crafting* | All of *The map before the data*; *Who owns what*. Here: *Who decides*, *A product with an owner*, *Where each piece lives* |
| Data modelling and design | *A Sharper Sketch*; *From words to data*; *In the weeds of data crafting* | All of *From words to data*; *Declare it, then build it* to *Built in layers*. Companion: *One person, many roles*, *Roles come and go* |
| Data storage and operations | *The Inner Life of Data*; *From words to data* | *Into the platform*, *Two speeds* (chapters); *Both at once*; *Built in layers* (physical choices) |
| Data security | *The Inner Life of Data*; this series; its companion | *Meaning* (chapter: access control, masks). Here: *Who may see it*, *Governed in Unity Catalog*, *The marketplace*. Companion: *For this purpose only* |
| Data integration and interoperability | *The Inner Life of Data*; *When things go wrong*; *In the weeds of data crafting*; this series | *Into the platform*, *Ways out* (chapters); *Silent change*; *What makes it the same one*. Here: *Change without surprises*, *Products in open formats*, *The marketplace*. Companion: *One person, many systems* |
| Document and content management | Not covered | Parked |
| Reference and master data | The companion series; *In the weeds of data crafting* | All of the companion; *What makes it the same one* (key sets, code mappings) |
| Data warehousing and business intelligence | *The Inner Life of Data*; *From words to data*; *In the weeds of data crafting* | *Refining with dbt*, *Gold*, *Apps and Genie* (chapters); *Built to write, built to read*, *Many ways to read*; *One row of what, and when*, *Built in layers* |
| Metadata management | *The Inner Life of Data*; *From words to data*; *In the weeds of data crafting*; this series | *Meaning* (chapter); *Meaning machines can read*, *Keeping it true*; *Written once*. Here: *One word, one home*, *Where each piece lives*, *Governed in dbt*, *Meaning on the platform* |
| Data quality | *When things go wrong*; *In the weeds of data crafting*; this series; its companion | *Too good to be true*; *Promises and proofs*. Here: *Rules that run*, *Fixed where it starts*, *Quality on the platform*. Companion: *Kept, not cleaned* |

The site could show the same map: the wheel on the Topics page, each area linking to its films (a decision for the author, below).

## The world, and the people

**The same university, platform and people** as the other series, and the same example dbt project ([`../analytics-engineering/project/`](../analytics-engineering/project/)): every enabler shown is a file in it, or a file this series adds to it. Mei Tanaka owns the meaning of *award* and decides learner identity; Noor Rahman, the data architect, owns the model; Jun Park builds it; Sam Okafor runs the platform; Leila and Rosa own admissions' data and system; Clara Jensen reports for Planning; Tom Whitfield runs short courses; Anil Kurian is an analyst in the Faculty of Health, in the old building; Prof. David Mensah is the deputy vice-chancellor. In part two, Noor works beside Yusuf: her architecture map, from *The map before the data* and *Meaning machines can read*, gains governance one layer at a time.

**One new character: Yusuf Demir, the data governance lead,** new to the role. Yusuf inherits the binder, and is asked to "fix governance" before the university's next government submission. Yusuf is the guide of the series, as Sam is of *When things go wrong* and Noor of *From words to data*.

**The look:** watercolour (decided 17 October 2026, in place of toy town), the look of the series on master and reference data, so the two series look like one university: a pencil line and watercolour on paper. The films show only the university's own places: the campus, Yusuf's office, the floor of offices behind glass where the work is done (Planning, the registrar's office, data governance in the middle, the data team, the platform team), each team's room, the stewards' meeting room, Noor's room with her architecture map, a faculty's office in the old building, and close-ups of their desks, boards, screens and papers. Behind each person, a soft wash of their side: gold for the business side, cyan for the technical side. The binders are on a real shelf in Yusuf's office; a policy line that finds where it runs leaves the shelf for a place in the work.

## The thread: the number reported to the government

The university reports its awards to the government every year. This year, the draft submission and the census report disagree on how many awards were conferred. The same week, the glossary's term *award* changes: microcredentials of at least 6 credit points now count (the kind of drift `skills/sync-the-glossary/` is built to catch). Yusuf is asked to make sure the reported number can be trusted, in time for the submission.

None of the 34 policies would have caught either problem. Each film of part one puts one enabler in place, and *Teachers of data* sends the submission and shows what's left on the shelf. Part two makes governance last beyond the submission, and part three builds each piece.

## The facts the films share

The story's numbers and dates, in one place, so no two films choose differently. A film that needs a new one asks the thread of *Off the shelf* to add it here.

| Fact | Set by |
|---|---|
| The binder: 34 policies, one binder each on Yusuf's shelf, 215 lines in all. A maturity assessment of 2.1 out of 5; a chart of who's responsible for what, with "TBC" against who decides how *award* maps to the government's definition; a council that meets monthly. Policy 12, *Data definitions*, has seven lines. | *Off the shelf*; the 215 lines, *Teachers of data* |
| Yusuf's first week. On Monday, the glossary's *award* changes: microcredentials of at least 6 credit points now count. Planning's census report ran on the Friday before, and says 4,812 awards; the draft submission ran on Wednesday, after the change, and says 4,867. | *Off the shelf* |
| Submission day: the submission and Planning's census report both say 4,867 awards, counted by the glossary's meaning. How that meaning maps to the government's definition is Mei's recorded decision. | *Teachers of data* |
| The stewards' community meets once a month; the films show October's meeting, on Tuesday 20 October 2026. Data governance holds office hours on Thursdays from 2 to 3 pm, or answers data.governance@uni.example, as the example project's how-to pages say. | *Teachers of data* |
| The governance check has four rules: an owner; a glossary term, or a confirmed absence; classified columns; tests with an owner and a dimension (DEC-PRJ-12). A fifth, "every column other teams read says what it holds", is announced at October's meeting, warns for six weeks, and becomes an error on 1 December 2026 (DEC-PRJ-14). Its warnings fall week by week: 41, 23, 9, 2 and 0, from 20 October to 17 November. | The example project; *Teachers of data* |
| The binder at the end of part one: of its 215 lines, 92 run in the work, 64 are decisions someone owns and has recorded, and 59 are retired. | *Teachers of data* |
| Each policy is a binder of the same number. *Off the shelf* shows binder 12, *Data definitions*, and lights nine binders on the shelf for the films to come, with no numbers to read. The films open binder 2, *Decision rights* (*Who decides*); 12 (*One word, one home*); 6, *Data protection* (*Who may see it*); 9, *Data quality* (*Rules that run*); 15, *Data quality issues* (*Fixed where it starts*); 19, *Change management* (*Change without surprises*); 22, *Data as an asset* (*A product with an owner*); 26, *AI and automated tools* (*An agent that checks*); and 29, *Maturity assessment* (*Teachers of data*). The line each film quotes is its row of *The spine*; a film names its own policy and tells the thread of *Off the shelf*. A binder's label is its film's title, as on the binder Yusuf takes down in *Off the shelf*, "Who decides", and the shelf shows a gap for each binder an earlier film took to the work. | This list; *Who may see it* |
| Policy 2's register lists the map's eight domains, with three owners (course, research, fees) and four stewards (person, student, course, staff) still "TBC", though the map already names every domain's owner. The council first minuted the action "name the data owners" in June 2026, and carried it forward in July, August and September; *Who decides* stamps September's sheet "DONE" when an owner becomes required. | *Off the shelf*; *Who decides* |
| Before *Who decides*, how *award* maps to the government's definition went round an email thread of 23 replies, with no decision. | *Who decides* |
| The council decides only conflicts between domains, and exceptions, by its next monthly meeting; if it can't agree, the deputy vice-chancellor decides. The owner decides everything else. | *Who decides* |
| In *Who decides*, the governance check fails on a change of Jun's, *Add a completions mart for Planning* (`mart_planning__completions`), until he adds `owner: Planning` and `domain: planning`, as `mart_planning__near_award` has them. The change and its mart are the story's own, not the example project's, so no later film shows or counts them: *A product with an owner*'s 33 models are the example project's. | *Who decides* |
| Mei has two hours a week as the owner of *award*, agreed by Yusuf with the university registrar, her manager. She owns *award*, not every term her office uses. | *Who decides* |
| The five glossaries Mei finds, with three meanings of *award*. The business glossary on the platform has the new words (from Monday, microcredentials of at least 6 credit points count), and the data team's models keep a reviewed copy, checked against it each night. Planning's spreadsheet, the registrar's policy appendix and a glossary tool bought in 2019 (600 terms, last opened 14 months ago) still have the old words: graduate certificates, masters and doctorates, as on *Off the shelf*'s glossary card. The faculties' dashboards count degrees only. Planning's spreadsheet and the policy appendix can't be seen outside the team that made them. | *One word, one home* |
| After *One word, one home* there's one glossary, the one on the platform. The 2019 tool is retired (terms with an owner moved across, the rest archived); Planning's spreadsheet links to each term, the policy appendix points to the glossary, and the faculties' dashboards show the glossary's words, read from the platform. | *One word, one home* |
| Monday's pull request, the glossary sync's, opened on Monday night and listed what the new words touch and the owner of each part. It changes only the words, and adds the setting `min_award_credit_points: 6` to the project's vars; Mei approved it on Tuesday morning. Jun's next pull request, on Tuesday, makes the models count by the new meaning (an additive column, `counts_as_award`, which reads the setting); it merged before Wednesday's draft ran, which is how the draft counts 4,867. | *One word, one home*; *Change without surprises* |
| The three meanings of *award* keep *Who decides*'s colours: violet for the glossary on the platform (microcredentials of 6 credit points or more count); rose for Planning's spreadsheet, the registrar's policy appendix and the 2019 tool (graduate certificates, masters and doctorates); olive for the faculties' dashboards (degrees only). | *Who decides*; *One word, one home* |
| Anil Kurian's first pull request: the Faculty of Health's call list for its student advisers (`mart_health__learner_progress`), every learner studying for one of the faculty's awards today: 7 learners, 4 in the Graduate Certificate in Health Informatics and 3 in the Master of Public Health, with names and emails. The agent's review finds no owner, ten columns with no class, and a rule with no test. The Faculty of Health becomes its owner (reviews to health.data@uni.example), confirmed by Yusuf for data governance; the faculty approves the classes, and Jun the code. | *An agent that checks* |
| The data team's agent runs as its own service principal, outside the readers' groups: it sees personal columns masked, and works from counts and samples (*Who may see it*). From *An agent that checks* on, the review skill reviews every pull request as the project's agent, and drafts classes for new columns. The film happens before submission day; its opening is an imagined night a few years later. | *Who may see it*; *An agent that checks* |
| In *Teachers of data*, Anil adds a column to his call list, `school_name` (the school of the faculty that teaches each award, which the advisers asked for), and the check stops him until he classifies it `none`, from the how-to page *Classify a column*. | *Teachers of data* |
| The learning team is Tom's. It owns the short-course platform's data and the learning platform's (the owner in both sources' metadata). | *Fixed where it starts* |
| *Rules that run*'s days. Each spring, every system's owner rates its data from 1 to 5: seven systems (the student system, the learning platform, the short-course platform, the HR system, the research system, the alumni system and Planning's reports), all 4 but the research system's 3, an average of 3.9. On Thursday 15 October 2026, at office hours, Tom reads the learning team's row of the scorecard; the team's follow-up list has one row, a walk-in from February (SC|E-7010, *Excel for Everyone*, enrolled 17 February, completed 2 March 2026), open 240 days. In the run of Monday 19 October, at 2 a.m., five more enrolments with no email arrive, *First Aid* walk-ins, six in all, over the five the learning team agreed to (DEC-SC-01): learning · completeness goes red, and 36 tests don't run (student 22, Planning 5, Finance 5, wallet 4). The learning team's issue reads "3 tests to answer, by 20 October 2026": the failure is due the next working day, the two warnings on 26 October. The six are registered at noon on Monday, and in the run of Tuesday 20 October learning · completeness is green again. The scorecard reads the owner and dimension each test already has; from 20 October the governance check requires them (DEC-PRJ-12). | *Rules that run* |
| The scorecard sends each owner an issue every Monday. In *Rules that run*, the red cell is learning · completeness. *Fixed where it starts* opens on the numbers of *Rules that run*'s last scorecard, the run of Tuesday 20 October 2026: learning 22/22 (2 warn), all tests 160/160 (2 warn), as the example project makes them at PR #53's 07d78aa. Learning · validity is amber every Monday, "7/7 (2 warn)": short-course emails as typed, in learners (3 rows) and enrolments (6 rows, as every version of a row is checked). That rule ran at warn on every row for a year, so the build never stopped, and staging cleaned the emails. | *Rules that run*; *Fixed where it starts* |
| From 2 November 2026, the short-course forms check an email where it's typed (DEC-SC-04); the old emails are corrected at the source (REQ-SC-01), and then staging's clean-up goes. | *Fixed where it starts* |
| One night, after a platform update the week before, half the new badges from the learning platform arrive with no credit: usually 1 badge in 12 has none (the welcome badges), that night 1 in 2. Monitoring on the platform tells the learning team, and it becomes DEC-LMS-03 (decided 20 October 2026). A microcredential badge carries 5 credit points, below the 6 that make a microcredential an award, so that night harms the wallet, not Planning's count. The 55 microcredentials that count as awards this year (4,867 less 4,812) carry 6 or more. | *Fixed where it starts*; *Off the shelf* |
| Before *Who may see it*, access to the learner table took a form, an emailed approval and three weeks, and gave a named person the whole table, with no end date. When Yusuf reads the grants, 41 people can read every column, and 9 of them have moved to other jobs. | *Who may see it* |
| This term, Mei, for the registrar's office (the learner table's owner), approves Clara's request to read the learner table "to plan next term's places", until 15 December 2026, through a Planning group; names and emails are masked for her. | *Who may see it* |
| Clara's access ends by itself on 15 December 2026. After Yusuf's access review, later in December, two groups can read the learner table: the registrar's office, which keeps the learners' records, and the data team, which builds the models. | *Who may see it* |
| Census day, Tuesday 31 March 2026 (the example project's `census_date`): Planning's count of learners near an award, the census dashboard's source, isn't ready by 7 a.m., and Anil, planning the Faculty of Health's places, can't find who answers for it: Jun built it, Noor owns the model, Planning asked for it. In October 2026 Clara Jensen becomes the owner of that product, *Learners near an award* (`products/learners_near_an_award.yml`). | *A product with an owner* |
| In October 2026, the example project has 33 models, 10 of them read by other teams, in 6 products; the sixth, *Short-course follow-ups*, is the learning team's. | *A product with an owner*; the example project |
| Before *Change without surprises*, policy 19's line ran as a change board that meets once a month, with a form answered from memory; its next meeting would have come after the draft submission. | *Change without surprises* |
| Marta Nowak leads the wallet app team, the owner of the wallet's exposure (wallet@uni.example). | *Change without surprises* |
| Jun's Tuesday pull request. Its first draft relabelled microcredentials of 6 credit points or more as awards, which would have changed what Planning, Finance and the wallet read, so he made it additive: `counts_as_award`, on version 2 of credentials, rebuilt in full on Tuesday night because version 2 is incremental (DEC-STU-08). Only what reads the new column changes: Wednesday's draft submission, and the wallet app, whose team Jun tells "from Wednesday" and pairs with Marta on Thursday. Planning's census report counts by `counts_as_award` from its next run. | *Change without surprises* |
| How the voice says the series' names, so every film says them alike, each from its own `film.json` (*say*, the full name before the first name): Yusuf Demir, "Yoosoof Demeer", and Yusuf, "Yoosoof"; Anil Kurian, "Unnil Coo-rean", and Anil, "Unnil": uh-NIL, with a short i, as the name is said in Hindi (Wiktionary's अनिल, /ə.nɪl/, checked 21 October 2026) and in Malayalam, and KOO-ree-an, a name of Kerala's Christians, not the voice's KYUR-ee-an. Without a respelling the voice says AN-il. Marta Nowak, for a film that says her name, "Marta Novak": NO-vak, as in Polish. | *Off the shelf*; *An agent that checks*; *Change without surprises* |

## The series at a glance

Nineteen films of 4 to 6 minutes, in three parts. The first ten show what governance needs, and the enabler that delivers each. The next three design governance as a capability, on the university's architecture map. The last six open the tools, Databricks and dbt, and show how each enabler is built, along the flow part two's map gives it; each names the films it expands.

| Part | # | Working title | What it puts in place | The idea to take away |
|---|---|---|---|---|
| What governance needs | 1 | **Off the shelf** | The map of where governance enters the work | A policy that doesn't run anywhere is a wish. |
| | 2 | **Who decides** | Owners as required metadata; approvals routed from it | A decision right is real when the work asks for it. |
| | 3 | **One word, one home** | One trusted glossary in place of many; every tool synced from it | Many glossaries are no glossary: keep one, and sync every tool from it. |
| | 4 | **Who may see it** | Classification on the column; masks by classification | Classify once; let the platform protect it everywhere. |
| | 5 | **Rules that run** | Owned tests and a scorecard read from the runs | A quality rule is a test with an owner. |
| | 6 | **Fixed where it starts** | Issues traced to their source; checks at entry; monitoring for the unknown | Fix the cause, then make the fix a check. |
| | 7 | **Change without surprises** | Impact on every pull request; versions; exposures | Change control is a step in the change, not a meeting. |
| | 8 | **A product with an owner** | Data products with an owner, a contract, service levels and a lifecycle | Own the product, not only the meaning. |
| | 9 | **An agent that checks** | A governance review skill | Agents follow what's written as a check. People decide. |
| | 10 | **Teachers of data** | The stewards' community, guidance beside every check, warn-then-error rollouts, measures read from the work | Governance is people's work; tools remember what people agreed. |
| Governance as a capability | 11 | **A capability, not a project** | Governance as a capability on the architecture map, and the services it offers, each with a promise | Governance is something the university can always do, offered as services people ask for. |
| | 12 | **Who does what, end to end** | One service followed end to end: roles, actors, steps and the information each step needs; the glossary run as a product | Model the service end to end, and run the glossary as a product. |
| | 13 | **Where each piece lives** | One home for every governance artifact across repositories and apps, and copies synced one way | Each artifact has one home and an owner; every copy is synced one way and says where it came from. |
| With the tools | 14 | **Governed in dbt** | `meta`, groups and access, contracts, versions, exposures, checks in CI | The project carries governance with the code. |
| | 15 | **Governed in Unity Catalog** | Grants, governed tags, attribute-based policies, masks, lineage, audit | The platform enforces what the metadata says. |
| | 16 | **Meaning on the platform** | Unity Catalog's Glossary, metric views, semantic models | One meaning, read by people, reports and agents. |
| | 17 | **Quality on the platform** | dbt tests, pipeline expectations, quality monitoring, alerts routed to owners | Rules you write, and monitoring for the rest. |
| | 18 | **Products in open formats** | Ontos: domains, data products (ODPS) and contracts (ODCS) over Unity Catalog | A contract in an open format outlives the tool. |
| | 19 | **The marketplace** | Discover, request, approve, grant, with an end date; share outside | Finding and getting data is part of governance. |

## Openings: other places, other times

| Film | Opening | Where | When |
|---|---|---|---|
| 1 | "One measure of wine throughout the kingdom", and the standard weights that finally made it true | England | 1215, then centuries later |
| 2 | The andon cord: anyone on the line can stop it | Japan | 1950s–60s |
| 3 | One script, one set of measures, across a newly unified empire | China | 221 BC |
| 4 | A court stops a census: the right to decide what happens to your data | Germany | 1983 |
| 5 | The Nilometer: the year's tax follows the river's measured height, not a report | Cairo, Egypt | 861 |
| 6 | Semmelweis has doctors wash their hands, and deaths on the ward fall | Vienna, Austria | 1847 |
| 7 | Dagen H: a whole country switches to driving on the right, overnight, prepared for years | Sweden | 1967 |
| 8 | A covered market where every stall has a maker who answers for it | Istanbul | 1460s onwards |
| 9 | An agent reviews a change at 3 a.m. (imagined) | The university | Imagined, near future |
| 10 | Mimes first, and the fine last: a city changes how people cross the street | Bogotá, Colombia | 1995 |
| 11 | The water boards keep the land dry, before and after every flood: "interest, payment, say" | The Netherlands | Since the 1200s |
| 12 | One dictionary, made together by the academies of the Spanish language, a word at a time | Madrid, and the Americas | 1713 to today |
| 13 | The Annals written once, printed, and kept in distant archives; one saved copy rebuilt the rest | Korea | 1392 to 1863 |

The tools films (14 to 19) don't open in the past. Each opens on the screen, with one line from the film it expands, and stays in the present: they're for the people who build it.

## The films

*Part one: what governance needs*

### 1. Off the shelf

**Opening.** England, 1215: Magna Carta promises one measure of wine, ale and corn throughout the kingdom. The promise is restated for centuries, and measures still differ from town to town. What finally works is a standard you can hold, kept where trade happens, and someone who checks against it.

**Story.** Yusuf's first week. The shelf: 34 policies, a maturity assessment of 2.1, a RACI, the council's minutes. The same week: two numbers for awards, and a changed glossary term. Yusuf follows the number back through the platform and finds the four places a definition lives (*Written once*), none of which knows the policy exists.

**Ideas.** What governance is for: deciding who decides what, and making sure that decision reaches the work. Governance is people and processes first: tools carry out what people agreed, and can't make them agree. Governance and management: governance decides and oversees; owners, engineers and the platform do. DAMA-DMBOK, named once, with its wheel; DCAM, ISO 8000 and ISO/IEC 38505 in a line. The test for every policy line: where does it run? Three outcomes: it runs, it's an owned decision, or it goes.

**The enabler.** *In the weeds*' loop of ten steps, with a pin at each point where a governance decision enters the work: a term at scope, an owner, a classification at source, a rule at tests, a contract, an approval at review, a version at operate.

**On screen.** The binder, paper on a shelf; the loop, glass. Policy lines lift off the page and find their pins; some find none.

**The people side.** Yusuf's first week is spent listening, not writing: sitting with Jun, Mei, Sam and Planning, asking what slows them down. The people who wrote the binder aren't the problem; they wrote what they were asked for. Change starts from what people already struggle with.

**Labs (candidates).** *Where does it run?* (sort policy lines into runs, owned decision, retire).

### 2. Who decides

**Opening.** Japan, the 1950s and 60s: on a car assembly line, any worker who sees a defect pulls a cord, the andon, and the line stops. A right that comes with a cord gets used; one written in a manual doesn't.

**Story.** The RACI says "Data steward: TBC" for half the domains, and learner identity is decided in email threads. Yusuf finds the owners are already written down, in the university's map of domains (`_shared__conceptual.yml`) and in each model's `meta.owner`. Yusuf and Noor make the owner required, and route every change from it: a change to the course domain's conceptual model asks Mei to review it, without anyone remembering to. Then Mei asks which *award* she owns: she has found five definitions.

**Ideas.** Decision rights, in three roles: the owner (accountable for meaning), the steward (does the daily work, such as Mei's identity decisions), the custodian (runs the platform). Federated: domains decide their own meaning; governance sets a few shared rules (the glossary, key sets, classification, conventions), as in *Who owns what*. The council decides only conflicts and exceptions, with a time limit and an escalation path. Every decision recorded where the work is, with who and when (the decision logs).

**The enabler.** Owners in metadata; a check that fails a public model without one; review requests generated from the owners (a `CODEOWNERS` file, made from the metadata, not by hand).

**On screen.** A RACI matrix with blanks; then a pull request that asks Mei, by name.

**The people side.** Mei didn't ask to be an owner. Being named needs time from her manager, a small and clear scope, and someone to ask. A role without time is a name in a spreadsheet.

**Labs (candidates).** *Owner, steward or custodian?* *Route the change.*

### 3. One word, one home

**Opening.** China, 221 BC: a newly unified empire takes one script, one set of weights and measures, and one axle width, so a word, a weight and a cart mean the same in every former state. Shown at a market and on a road.

**Story.** Mei owns *award*, but which one? Yusuf finds five glossaries: Planning's spreadsheet, the registrar's policy appendix, the data team's model notes, the dashboards' own descriptions, and a glossary tool bought in 2019, with 600 terms nobody opens. They're siloed, they disagree (three different awards), two are invisible to anyone but the people who made them, and the biggest is unused. The owners choose one glossary everyone can trust: the business glossary on the platform, each term with its owner from *Who decides*. The others are retired or made to read from it: the project copies each term with its source, and a nightly sync flags any drift (DEC-PRJ-11); the dashboards read one shared definition; Planning's spreadsheet links to the term instead of keeping its own words. Then the term changes: microcredentials of at least 6 credit points now count. Before, someone noticed months later, in a dashboard. Now the sync finds the change and opens a pull request listing what it touches (the near-award mart, the wallet, the census dashboard) and who owns each part. Mei approves the new meaning, and Jun sees that "6 credit points" is a number, so it becomes a setting (a var).

**Ideas.** Why organisations end up with many glossaries, and why many is the same as none: nobody knows which to trust. Business glossary, data dictionary and catalog: three different things. A term has a definition, an owner, a status and a date. One glossary is the home of a definition it holds; every other tool reads it, or keeps a synced copy that records where it came from (DEC-PRJ-11). One direction of sync. A glossary is retired, or made to read from the trusted one; never two homes. A definition change is reviewed with what it touches. A definition with a number in it is also a rule.

**The enabler.** One trusted glossary, with the `sync-the-glossary` skill, already in the project, run on a schedule and in CI; the other glossaries retired or pointed at it.

**On screen.** Five glossaries side by side on Yusuf's desk and screens, *award* marked in each, three of them different; the old tool's login page, gathering dust; then one glossary, and the pull request arriving with its list of owners; Mei reading it; the workshop where she and the faculties argued the words out, remembered.

**The people side.** The words were agreed in a workshop where Mei and the faculties argued them out. The glossary keeps the agreement; it doesn't make it. The people who kept the other glossaries lose something they built: they're thanked, and their best definitions move into the one that stays.

**Labs (candidates).** *Which glossary do you trust?* *Glossary, dictionary or catalog?* *Read the drift report.*

### 4. Who may see it

**Opening.** Germany, 1983: the Constitutional Court halts the national census and rules that people have a right to decide what happens to their personal data.

**Story.** A planner asks for learner-level data behind the near-award list. The old path: a form, an emailed approval, the whole table granted, never revoked. The new one: every column of the public models is already classified (`personal_data: direct` or `pseudonymous`, in the project's YAML); the classification travels to the platform as a tag; a policy masks direct personal data for anyone outside the registrar's office. The planner gets pseudonymous keys, for the purpose stated, until the date stated. The agent works on samples.

**Ideas.** Classify once, at the column, when the column is made. Policies by classification, not table by table. Least privilege; purpose; expiry; retention. Access reviews read from the grants, not from a spreadsheet. dbt's `access` decides who can `ref()`; the platform's grants decide who can read (*Who owns what*).

**The enabler.** A check that every column of a public model is classified; tags and masks on Databricks applied from the classification; access with an end date.

**On screen.** One column's tag lights up, and the mask follows the column downstream, through every model it reaches.

**The people side.** The planner isn't a risk to manage. They're told why the mask is there and how to get more when the purpose needs it. A refusal without a path is a reason to copy data into a spreadsheet.

**Labs (candidates).** *Classify the columns.* *Who sees what?*

### 5. Rules that run

**Opening.** Cairo, 861: on Roda Island, the Nilometer measures how high the Nile rises each summer, and the year's tax follows the measured height, not a report. Measure; don't trust the register. (Chosen on 20 October 2026 in place of Frontinus at Rome's aqueducts; checked against Egyptian sources when scripted.)

**Story.** The programme measured quality with a survey: "rate your system's data quality from 1 to 5". Yusuf replaces it with what already runs. Each rule is a test with an owner, a threshold agreed with that owner (warn and error, as in *Too good to be true*) and a reason; the scorecard is read from last night's run, by domain and dimension; a failing rule opens an issue for its owner, with a date, and the fix happens at the source (Rosa's team, as in *Too good to be true*).

**Ideas.** The quality dimensions, named once and used as labels: completeness, validity, uniqueness, consistency, timeliness, accuracy. A rule comes from the process or the definition (*Rules with a home*). Prevention at entry beats detection; detection beats a survey. Issues have owners and root causes.

**The enabler.** Tests carrying `meta` (owner, dimension, the rule they enforce); a scorecard generated from dbt's run results; failures routed as issues to owners.

**On screen.** A bar chart of survey answers; beside it, a scorecard drawn from the tests, with one red cell and its owner's name.

**The people side.** Governance doesn't set the thresholds; Leila does, in a conversation, and learns to read the scorecard. A rule its owner doesn't understand gets switched off.

**Labs (candidates).** *Which dimension?* *Set the threshold with the owner.*

### 6. Fixed where it starts

**Opening.** Vienna, 1847: on one maternity ward, mothers die of fever far more often than on the other. Ignaz Semmelweis has the doctors wash their hands in chlorinated water before examining them, and deaths fall. The cause was where the care started, not where it ended.

**Story.** The scorecard shows the same red cell every Monday: short-course emails with spaces and capitals, duplicates in the wallet. The platform has been cleaning them in staging for a year. Yusuf follows the issue to where the data is made: Tom's sign-up form. Tom's team trims and checks the email at entry; the cleaning step in staging becomes a test that should never fail. Then something no rule names happens: one night, half the learning platform's badges arrive without a credit value. No test was written for it; monitoring sees the change in shape and tells the owner.

**Ideas.** Issue management: an issue has an owner, a cause, a due date and a check that proves it's closed. Root cause, not a cleaning step downstream. Prevention at entry beats detection, which beats cleaning. Quality service levels between producer and consumer, written in the contract (*Silent change*, *Promises and proofs*). Monitoring for what no one wrote a rule for: freshness, volume, distribution, null rates. Every confirmed surprise becomes a rule.

**The enabler.** Issues routed from failing tests to the source's owner; the fix at entry; the downstream clean-up replaced by a test; quality monitoring on the tables that matter, alerting the owner named in the metadata.

**On screen.** A mop under a dripping pipe; then the pipe fixed, and the mop put away, replaced by a small gauge.

**The people side.** Tom's team isn't blamed. They get the evidence, and help to change the form. Blameless, as in *When things go wrong*.

**Labs (candidates).** *Where did it start?* *Rule or monitor?*

### 7. Change without surprises

**Opening.** Sweden, 3 September 1967: Dagen H. At 5 a.m., the whole country switches from driving on the left to driving on the right. It took years of preparation, a sign on every road changed overnight, and a campaign everyone saw. The change was huge, and nothing about it was a surprise.

**Story.** The new meaning of *award* changes what `core_award` counts. A change advisory board would meet next month. Instead the pull request carries its impact: the models downstream, the tests that run, the exposures and their owners. Because the meaning of a public model changed, it's a new version, with a deprecation date for the old one (DEC-PRJ-02); the wallet team and Planning are told by name, from the exposures.

**Ideas.** Lineage and impact analysis. Data contracts between source and platform (*Silent change*) and between platform and consumers (*Promises and proofs*). Versions and deprecation. Notification from exposures, not a mailing list. Change control as a step in the pull request.

**The enabler.** Impact on every pull request: changed models and everything downstream, from the manifest; the exposures' owners asked; enforced contracts.

**On screen.** The change as a ripple along the lineage, pausing at each owner until they nod.

**The people side.** The wallet team hears early, in their own words, with a date and help to move. Communication is half of change control.

**Labs (candidates).** *Breaking or not?* *Who must be told?*

### 8. A product with an owner

**Opening.** Istanbul, from the 1460s: the covered market grows into streets of stalls, each trade with its guild and rules, each stall with a maker who answers for what it sells. A buyer finds what they need, knows who stands behind it, and comes back.

**Story.** Planning's census mart is used by the census dashboard, two faculties' spreadsheets and, it turns out, Finance. When it was late last term, nobody knew who to call: Jun built it, Noor owns the model, Planning asked for it. Yusuf, Noor and Planning name it a data product: an owner who answers for it (Clara Jensen, for Planning), a contract that says what it promises (*Promises and proofs*), service levels (fresh by 7 a.m. on census day), documentation, a version and a lifecycle, from draft to retired. The registrar's learner and award models are products too, owned by the registrar's office, which publishes them for everyone else to build on.

**Ideas.** A data product is data plus a promise: owner, contract, service levels, documentation, version and lifecycle. Its owner answers for the product; the data owner answers for meaning; they may be different people. Products belong to domains (*Who owns what*, *Who does it, and where meaning changes*). Source-aligned, aggregate and consumer-aligned products. Consumers are known by name, through exposures and access requests. Not everything is a product: most models are steps.

**The enabler.** A product descriptor beside the models: owner, domain, contract, service levels, consumers and status, generated into the catalog; a check that a public model belongs to a product; consumers asked before a product is deprecated.

**On screen.** One table, three people pointing at each other; then a product card with one name on it, and a line of consumers behind it.

**The people side.** Clara has to want the job. Yusuf shows who depends on the mart, what it's worth to them, and what support comes with owning it.

**Labs (candidates).** *Product or step?* *Write the product card.*

### 9. An agent that checks

**Opening.** Imagined, and labelled so: the university, a few years on, 3 a.m. An agent reviews a change from a faculty's analyst, finds an unclassified column holding dates of birth, and leaves a comment. The analyst fixes it before breakfast.

**Story.** Back to today. Yusuf turns the policy lines that run into a skill an agent can follow: on every pull request, check for an owner, a glossary term (or governance's confirmation that there's none), classified columns, a test for each stated rule, and named impact. The agent drafts classifications for new columns with the evidence for each, finds drift, and flags. It never approves, never edits the glossary, never lowers a test.

**Ideas.** Governance for AI and AI for governance. Agents follow what's written down, so a policy written as a check becomes something an agent can apply (*An agent on the team*). Agents are governed by the same enablers: least privilege, samples rather than bulk personal data, read-only on the glossary, every claim with its evidence.

**The enabler.** A `review-for-governance` skill beside `sync-the-glossary` and `review-metadata`.

**On screen.** The agent's review: three findings, each with its line, the rule it breaks and a proposed fix; a person's approval in gold.

**The people side.** People trust the agent's review only when they understand what it checks and can disagree with it. The agent explains; a person decides.

**Labs (candidates).** *Review the agent's review.* *Turn a policy into a check.*

### 10. Teachers of data

**Opening.** Bogotá, 1995: the mayor sends mimes into the streets. When a driver stops on a crossing, people whistle, a mime invites the driver to back up, and only then does a traffic officer write the fine, to applause: the last step of a sequence meant to teach. With other measures, deaths on the roads fall. People follow a rule more readily when they understand it, and when following it is easy, visible and normal.

**Story.** Submission day. The number is the same in the submission and the census report, and its definition is the glossary's. Yusuf knows why it worked: not because of the checks alone, but because people understood them. So the governance team's work changes. A stewards' community meets every month to share what broke and what helped. Office hours replace approval queues. Every check's message links to a short how-to, written for the person it stops. A new check is announced, explained, runs as a warning first, and becomes an error only on a date everyone knows. Every new analyst starts with these films and their labs. The maturity assessment isn't repeated; the measures come from the work: how many public models have an owner, a term and classified columns; how long a drift takes to close; how many failures were fixed at the source; how long access takes to grant; how many people came to office hours, and came back. The binder: of 34 policies, some became checks, some became decisions with owners, and the rest were retired.

**Ideas.** Governance is people and processes; tools serve them. Change management in practice: why before what, start with the willing, warn before enforcing, support at the moment of friction, celebrate what works; the common change models, named once (such as Kotter's steps and ADKAR). Guidance and support as the governance team's daily work. Communities of practice. Measure by use and outcome. Start small: one question, one domain, three enablers, then the next. The governance team as the teachers of data: at the centre of DAMA's wheel, because that's where every other area meets and someone has to show how they fit.

**The enabler.** The human ones: the stewards' community, office hours, guidance beside every check, a warn-then-error rollout, an onboarding path through the films and labs. And a governance scorecard generated from the metadata and the runs.

**The people side.** The whole film.

**On screen.** Yusuf in a room with stewards, not at a shelf. Then DAMA's wheel, governance at its centre; each slice lights with the films across the site that teach it, and the lines all run back to the centre.

**Labs (candidates).** *Warn first, or stop?* *Plan the rollout of a check.* *Measure it from the work.*

*Part two: governance as a capability*

After the submission, Yusuf and Noor, the data architect, put governance on the university's architecture map: what it must be able to do, the services it offers, who does what end to end, and where each piece lives. Each film adds one layer to Noor's map, with the ideas of *The map before the data* (drawn in ArchiMate 4, as that series draws them), and DAMA-DMBOK's roles and DCAM's capabilities as checklists for governance itself. At most one diagram-like picture per film, as in every film: here, it's Noor's map, painted as a board in her room, which gains a layer in each film.

### 11. A capability, not a project

**Opening.** The Netherlands, since the 1200s: the water boards have kept the land dry. Floods brought big projects, but the boards were there before and after: elected by the people they serve, paid for by them, under one rule, "interest, payment, say". A flood gets a project; keeping the land dry is a capability.

**Story.** The submission is in, and the project that paid for Yusuf's team ends in June. The deputy vice-chancellor asks what the university would lose without it. Yusuf brings the binder; Noor says that's what governance wrote, not what it does. On her map they place one capability, *Govern data*, with seven beneath it, each named for what the university must be able to do: define what words mean, decide who owns what, protect who sees what, keep data fit for use, change without surprises, provide data products, and teach. Each passes the test from *The map before the data*: it survives a restructure, a new system and a new process. Part one's evidence colours them: green where a check runs, amber where people still have to remember, red where nothing happens yet. Then the services people can ask for, each with a promise: what does this number mean, define or change a term, access with a purpose, is this product fit to use, fix it where it starts, and what does this change touch. The deputy vice-chancellor reads one page of services, not the binder, and governance becomes a budget line every year, not a project.

**Ideas.** A capability is what the organisation must be able to do, whoever does it and however; it outlasts projects, restructures and systems (*What it must be able to do*). Governance as one capability with a few beneath it, assessed from evidence in the work, not a maturity survey. Services: what people can ask governance for, each with a promise and a way to ask (*Who it serves, and how it pays*). DCAM's capabilities and DAMA-DMBOK's functions as checklists, not as the map. A capability is funded every year; a project, once.

**What it puts in place.** Governance on the architecture map: the capability and the seven beneath it, coloured by evidence, and one page of services with their promises.

**On screen.** Noor's board: the capability cards, coloured, with the two numbers and the hidden column pinned as evidence; then the services as a one-page menu on the deputy vice-chancellor's desk, each with its promise.

**The people side.** The deputy vice-chancellor isn't against governance, only unable to see what it does. A page of services, in the university's words, is something a budget can hold.

**Builds on** *What it must be able to do* and *Who it serves, and how it pays*, in *The map before the data*.

**Labs (candidates).** *Capability or project?* *Write a service's promise.*

### 12. Who does what, end to end

**Opening.** Madrid, 1713: the Spanish Royal Academy is founded to make a dictionary. Today 23 academies, across Spain, the Americas and beyond, make one dictionary together: a word goes from a proposal, through a commission, to the academies' agreement, and the online dictionary publishes each update with what changed. A dictionary is a product, with owners, a process and readers who rely on it.

**Story.** Clara, in Planning, asks for *completion* to be defined: three faculties count it three ways. Noor and Yusuf follow that one request as a service, end to end, through the rooms where it happens. Clara asks; a steward drafts; the owner decides; the glossary publishes; and the sync carries the term to every tool that reads it: the project's copy, the platform, the dashboards and Genie. Each step belongs to a role, not a person, and actors fill the roles: people, a team, and the agent from *An agent that checks*, whose rights are written down. Each step reads or writes an information asset: the request, the draft, the decision record, the term and its copies. The chart of who's responsible for what, from *Who decides*, is now drawn from this model, not typed by hand. Then the glossary is run as a product: an owner, its users (people, reports, models and agents), a promise (every term has an owner, a definition, an example and a status, and a change is decided within ten working days), a weekly list of what changed, and measures of use, so terms nobody reads are retired.

**Ideas.** A service followed end to end, through the processes that deliver it (*How value reaches people*). Roles, not people: actors fill roles, and an agent can be an actor with written rights (*Who does it, and where meaning changes*). The information each step reads and writes, as business objects. A responsibility chart drawn from the model, not typed by hand. DAMA-DMBOK's governance roles (owner, steward, custodian) placed on the map. The glossary as a product: an owner, users, a promise, a list of changes, measures of use, and terms retired when nobody reads them (*A product with an owner*).

**What it puts in place.** The glossary service modelled end to end: roles, actors, steps and information assets; the responsibility chart generated from it; the glossary's product card, its promise and its weekly list of changes.

**On screen.** Clara's request travelling down the floor from desk to desk, a role card at each step, and the papers and screens it passes; Noor's board gains services, roles and objects; the glossary's weekly list of what changed, on Planning's screen.

**The people side.** A steward is a role with time to do it, not a name on a chart: when someone moves on, the role is handed over and the chart follows. Clara sees where her request is without chasing it.

**Builds on** *How value reaches people* and *Who does it, and where meaning changes*, in *The map before the data*, and *A product with an owner*.

**Labs (candidates).** *Role or person?* *Follow the request end to end.*

### 13. Where each piece lives

**Opening.** Korea, 1392 to 1863: the Annals of the Joseon Dynasty were written once, printed, and the copies kept in archives in distant mountains. No copy was ever edited on its own. When war in 1592 burned all but one, the one saved copy rebuilt the rest. A copy can be trusted when it's made from one source, one way.

**Story.** Sam is planning the platform's next year and asks where governance's pieces live. Yusuf counts seven places: the glossary; policies in the document library; Noor's map in its own repository; owners, classes, models, contracts and tests in the dbt project; tags, access rules, lineage and the audit log on the platform; products in the product catalogue; and decisions and issues in the tracker. Some hold copies of the same thing, and one has drifted: the catalogue still names Jun as the owner of a table Mei now owns. Noor puts each on the map as an application and the artifacts it holds, under one rule: every artifact has exactly one home and an owner, and every other place keeps a copy synced one way from that home, saying where it came from and when, with a check that flags drift. Then the flows between homes, each one way: definitions from the map to the glossary, and from the glossary to the project and the platform, where dashboards and Genie read them; concepts from the map to the models; the project's classes to the platform's tags and access rules; contracts from the repository to the product catalogue. The map becomes part three's brief: each tools film builds one of these flows.

**Ideas.** Governance artifacts as information assets, each with a home, an owner and a lifecycle. Applications, the data they hold, and the flows between them (*Today, and where it's going*). One home, and copies synced one way that say where they came from, as DEC-PRJ-11 does for terms. Drift is something a check finds, not something a person remembers. A definition is written once, in the map, and published to the glossary (*Meaning machines can read*, *A map people and agents can read*).

**What it puts in place.** The governance part of Noor's map: each artifact's home and owner, its copies, the one-way flows between them, and a drift check for each copy.

**On screen.** Yusuf walking the floor with a card for each artifact, sticking it on the screen where it lives; Noor's board with homes drawn solid, copies dashed and every arrow one way; the drifted owner put right by the sync.

**The people side.** Each team keeps working in its own tool. What changes is that each knows which copy is theirs to change, and which only to read.

**Builds on** *Today, and where it's going* and *A map people and agents can read*, in *The map before the data*, and *Meaning machines can read*, in *From words to data*.

**Labs (candidates).** *Home or copy?* *Draw the flow, one way.*

The openings of part two are checked against Dutch, Spanish and Korean sources when each film is scripted.

*Part three: with the tools*

The films of this part show the same university, the same project and the same people, on Databricks and dbt, with the files and screens a practitioner uses. Each one builds one of the flows *Where each piece lives* drew, says which films it expands, recaps them in a line, and goes straight to how it's built. Product names change often: they're kept to labels, and checked in each film's rigour sheet.

### 14. Governed in dbt

**Expands** *Who decides*, *Rules that run*, *Change without surprises* and *Where each piece lives*; builds on *Promises and proofs*, *Who owns what* and *Written once*.

**Story.** Jun opens the project and shows where each governance element lives in dbt: `meta` on models and columns (owner, domain, glossary term, personal data class), groups and `access` (who may `ref()` what), enforced contracts, model versions with deprecation dates, exposures naming consumers and their owners, tests carrying their owner and dimension. Then the checks that make it stick: a CI step that fails a public model without an owner, a term or classified columns; `CODEOWNERS` generated from `meta`; `state:modified+` running only what changed and what depends on it; `persist_docs` pushing descriptions to the catalog.

**Ideas.** The project as the first place governance is enforced: before anything reaches the platform. What dbt decides (who can build on what) and what it doesn't (who can read).

**On screen.** One model's YAML, each governance line lit and labelled with the film it comes from; a red CI check, then green.

### 15. Governed in Unity Catalog

**Expands** *Who may see it*, *Who decides*, *Change without surprises* and *Where each piece lives*.

**Story.** Sam shows the platform's side. Catalogs and schemas laid out by domain; grants to groups, never to people; governed tags, set from the project's `personal_data`, and attribute-based policies that mask direct personal data and filter rows by tag, on every table that carries it; lineage down to the column, from source to dashboard; audit logs and system tables that answer "who read this, and when"; access requests that expire.

**Ideas.** Policies by attribute, not table by table. The metadata decides; the platform enforces. Access reviews read from the grants. The link to dbt: the build writes the tags, the platform applies the policies.

**On screen.** A tag set in YAML, travelling to a column in the catalog; a mask applied as a planner queries it; the audit log line that records the query.

### 16. Meaning on the platform

**Expands** *One word, one home*, *Who does what, end to end* and *Where each piece lives*; builds on *Written once* and *Meaning machines can read*.

**Story.** Mei, with Jun: her term *award* in Unity Catalog's Glossary, published there from Noor's map and linked to the tables and columns that hold it; the sync that keeps the conceptual model in step; a metric view that defines "awards conferred" once, for dashboards and Genie alike; and the semantic model in Ontos, which links business concepts to the assets that hold them.

**Ideas.** Glossary, metrics and semantic models: three layers of meaning, each with one home. Agents read the same meaning people do.

**On screen.** One term, its linked assets lighting up across the catalog; a question to Genie answered with the governed metric and its definition.

### 17. Quality on the platform

**Expands** *Rules that run* and *Fixed where it starts*; builds on *Too good to be true* and *Promises and proofs*.

**Story.** Rules where they belong: dbt tests on the models, expectations in the ingestion pipelines that keep bad rows out or flag them, and quality monitoring on the tables that matter, for freshness, volume and anomalies no rule names. Results land in system tables; the scorecard reads them; a failure alerts the owner in the metadata, not a shared inbox.

**Ideas.** Which check goes where: at entry, in the pipeline, on the model, or as monitoring. One scorecard from every source of results.

**On screen.** The loop of checks along the lineage, from source to mart, each with its owner's name; one alert travelling to one person.

### 18. Products in open formats

**Expands** *A product with an owner*, *Change without surprises* and *Where each piece lives*; builds on *Who owns what*.

**Story.** Noor sets up Ontos, a Databricks Labs project that adds a business catalog over Unity Catalog: the university's domains, teams and projects; the census mart registered as a data product, described in the Open Data Product Standard (ODPS); its promise as a data contract in the Open Data Contract Standard (ODCS): schema, quality rules, service levels and meaning. The contract is a file, in an open format, kept in the repository beside the dbt contract it matches, and checked against it in CI. Stewards approve a product before it goes to production; compliance rules run on a schedule and tag, notify or block.

**Ideas.** Contracts and product descriptors in open formats, so they move between tools and outlive any one of them. One source of truth for the schema: the dbt contract and the ODCS file are checked against each other, not written twice. Domains as the shape of the catalog. What a Labs project means: open, useful, and not a supported product, so it's chosen with care.

**On screen.** A product card in the catalog; behind it, two files side by side, the ODCS contract and the dbt YAML, the matching lines linked.

### 19. The marketplace

**Expands** *A product with an owner*, *Who may see it* and *A capability, not a project*.

**Story.** A faculty analyst needs learners near an award. Before, they'd ask around. Now they search the university's catalog of products, read the contract and the service levels, see the owner, and request access, stating a purpose. Clara, the product's owner, approves; access is granted to a group, with an end date; the request is the record. For a partner outside the university (the government's reporting, a partner university), the product is shared through OpenSharing or a private listing in the Databricks Marketplace, with the same contract.

**Ideas.** Discovery, request, approval, grant and expiry as one flow. Internal marketplaces and external sharing. Consumers become known, so changes reach them (*Change without surprises*).

**On screen.** A shop window of products, each with an owner's face; one request moving from the analyst to the owner and back as a key with a date on it.

## What the example project gains

So every enabler on screen is real, the series adds to [the example dbt project](../analytics-engineering/project/), and the films draw from it. One thread makes them, in this order, and each file exists before the film that shows it is scripted:

| Addition | For film |
|---|---|
| A governance check: owner on every domain, entity and public model; a glossary term or a confirmed absence; every column of a public model classified; tests with `meta` owner and dimension. First, since five films show it | 2, 4, 5, 9, 14 |
| `CODEOWNERS`, generated from the owners in the metadata | 2, 14 |
| A decision in the project's log: governance's checks, and who owns them | 1, 2 |
| A scorecard generated from the run results, by domain and dimension | 5, 10, 17 |
| An impact report on pull requests, generalised from the glossary sync's | 7 |
| A fix at entry for short-course emails, and the staging clean-up turned into a test | 6 |
| A `review-for-governance` skill | 9 |
| Product descriptors (owner, domain, contract, service levels, consumers, status) for the public core models and the marts | 8, 18 |
| ODCS contracts and ODPS descriptors generated from, or checked against, the dbt contracts in CI | 18 |
| The governance part of Noor's map, kept as text: the capability and the seven beneath it, the services and their promises, the roles and actors, each artifact's home, and the one-way flows between homes | 11, 12, 13 |
| Tags and masks on Databricks applied from `personal_data`, left out on DuckDB (as DEC-PRJ-09 does for keys) | 4, 15 |
| A Databricks target that applies governed tags and policies, and an Ontos setup that registers the products (both optional; DuckDB stays the default) | 15, 18, 19 |

## What the series covers, and where

| Topic | Film |
|---|---|
| Governance and management; DAMA-DMBOK and its wheel, named once; policy to enabler | 1 |
| Decision rights; owners, stewards and custodians; federated governance; the council; escalation | 2 |
| Many glossaries and one trusted glossary; business glossary, data dictionary, catalog; one direction of sync; metadata management | 3 |
| Classification, masking by policy, least privilege, purpose, expiry, retention, access reviews | 4 |
| Quality dimensions, rules as owned tests, thresholds, scorecards | 5 |
| Issue management, root cause, prevention at entry, quality service levels, monitoring | 6 |
| Lineage, impact analysis, contracts, versions, deprecation, change control | 7 |
| Data products, product ownership, service levels, lifecycle, domains, consumers | 8 |
| Agents under governance, and governance by agents; evidence; human approval | 9 |
| People and change: change management, guidance, support, communities of practice; measuring governance; starting small; DAMA's wheel brought together | 10 |
| Governance as a capability; capabilities assessed from evidence; governance services and their promises; funding a capability, not a project | 11 |
| A service end to end: processes, roles and actors (agents among them), information assets; a responsibility chart drawn from the model; the glossary as a product | 12 |
| Governance artifacts and their homes across repositories and apps; copies synced one way; drift checks; where a definition is written | 13 |
| dbt: `meta`, groups and access, contracts, versions, exposures, CI checks, `CODEOWNERS`, `persist_docs` | 14 |
| Unity Catalog: grants, governed tags, attribute-based policies, masks and row filters, lineage, audit, system tables | 15 |
| Glossary, metric views, semantic models, Genie | 16 |
| Tests, pipeline expectations, quality monitoring, alerting | 17 |
| Ontos; ODPS and ODCS; approvals; compliance rules | 18 |
| Internal marketplace, access requests, OpenSharing, Databricks Marketplace | 19 |

**Parked:** document and content management; records retention schedules in depth; regulatory specifics by country (kept generic); data ethics as its own film; comparing catalog tools beyond Databricks and dbt.

## Overlap with the other series

- ***Written once*** shows the glossary sync from the engineer's side; *One word, one home* shows it from governance's, and recaps in a line.
- ***Who owns what*** draws domains and access; *Who decides* adds decision rights and the routing that makes them real.
- ***Too good to be true*** and ***Promises and proofs*** build the tests; *Rules that run* gives them owners and reads the scorecard from them, and *Fixed where it starts* follows a failure to its source, as *Too good to be true* does once.
- ***Silent change*** shows a contract with a source; *Change without surprises* puts change control into the pull request.
- ***Rules with a home*** (*The map before the data*) says where a rule belongs in the organisation; this series makes it run.
- ***Who owns what*** names data products and domains; *A product with an owner* gives the product its owner, service levels and lifecycle, and *Products in open formats* writes them down in ODPS and ODCS.
- ***Meaning machines can read*** explains semantic layers and ontologies; *Meaning on the platform* shows them on Databricks.
- ***An agent on the team*** sets the agent's guardrails; *An agent that checks* gives it governance's checks.
- ***What it must be able to do*** and ***Who it serves, and how it pays*** (*The map before the data*) teach capabilities and services; *A capability, not a project* uses them on governance itself.
- ***How value reaches people*** and ***Who does it, and where meaning changes*** teach value streams, processes, roles and actors; *Who does what, end to end* follows one governance service through them.
- ***Today, and where it's going*** and ***A map people and agents can read*** draw applications, the data they hold and the map as the source; *Where each piece lives* gives every governance artifact one home on it.
- **The master and reference data series** takes over the identity, survivorship and code lists that *Who decides* and *Rules that run* point at.

## Rigour to check when scripting

- **The openings:** Semmelweis's ward, his figures, and how slowly his advice was accepted; the Grand Bazaar's founding and its guilds; Magna Carta's clause on measures and how measures were standardised later (the 1824 Weights and Measures Act and the standards sent to towns); the andon cord and its history at Toyota; the Qin standardisation of script, measures and axle widths; the 1983 census ruling (*Volkszählungsurteil*); the Nilometer on Roda Island (built in 861), and how the Nile's measured height set the year's tax, checked against Egyptian sources; the Dutch water boards, their age, how they're elected and paid for, and "interest, payment, say"; the Spanish Royal Academy's founding in 1713, the 23 academies of ASALE, and how the online dictionary publishes its updates; the Annals of the Joseon Dynasty, their archives, and the copy that survived the war of 1592; Dagen H's date, hour and preparation; Bogotá's mimes, their number and what the road-death figures can and can't be credited to.
- **DAMA-DMBOK:** the current edition, and the current names of its knowledge areas and quality dimensions. DCAM, ISO 8000 and ISO/IEC 38505: current versions, named only.
- **Databricks:** Unity Catalog's Glossary (its status, and how a term is read; see *Written once*'s rigour sheet); governed tags, attribute-based access control, column masks and row filters; how dbt-databricks applies tags; data quality monitoring. Product names change: keep them to labels and the rigour sheet.
- **Ontos:** what it does today (domains, teams, projects, data products, data contracts, semantic models, compliance rules, approvals, MCP), which ODCS and ODPS versions it reads and writes, its licence (the repository and third-party pages disagree), and its status as a Databricks Labs project, without formal support. Checked on 16 October 2026 from [its repository](https://github.com/databrickslabs/ontos): ODCS v3.1.0 for contracts, ODPS for products, runs as a Databricks App.
- **Open standards:** ODCS and ODPS (Bitol, the Linux Foundation), their current versions and lifecycle states; a tool that tests an ODCS contract in CI.
- **Databricks sharing:** OpenSharing (formerly Delta Sharing) and the Databricks Marketplace, private listings and exchanges, and their current names.
- **dbt:** `meta` on tests; run results; `state:modified+` for impact; exposures; model versions and deprecation.
- **Change models:** Kotter's steps and ADKAR, named only, with their sources.
- **DAMA's wheel:** the current edition's knowledge areas and how it draws governance at the centre; the coverage map above checked against the films as made.
- **Privacy:** keep it generic ("in many places, the law…"); no jurisdiction-specific advice.
- **Part two:** capabilities, services, value streams, roles, actors and business objects as *The map before the data* draws them, in ArchiMate 4; DCAM's capabilities and DAMA-DMBOK's governance roles, named only; a governance service catalogue as practitioners keep one.

## Still open

The author approved the plan on 20 October 2026, and with it the series' title, one series in three parts, Ontos, *Rules that run*'s opening, one thread per film and labs per film (see *Decided*). These can wait:

1. **DAMA's wheel on the site.** Show the coverage map above on the Topics page, each knowledge area linking to its films.
2. **The topic on the site.** Whether the master and reference data series joins *Data governance*, or each keeps its own topic, as now.
3. **The author's own material.** Governance checks, templates or policies used at work, so the films show them rather than a generic version; for part two, a capability map, a list of governance services or a chart of roles.

## Next checkpoints

1. *Off the shelf*: the author's review of its video, then its pull request.
2. One shared pass: the places several films need (the registrar's office close up, a meeting room for the stewards, the platform team's room, a faculty analyst's desk, and Noor's room with her map board), added once to the series' shared pictures. Done on 20 October 2026.
3. The example project's additions, in one thread, the governance check first.
4. Films 2 to 10, one thread each, side by side; each owns its folder and its opening, and shares the story's facts (names, numbers, dates) from one place, *The facts the films share*.
5. Films 11 to 13, once part one's scripts are approved; films 14 to 19, once part two's are. Each film goes live on the site when the author approves its pull request.
