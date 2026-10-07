# Enterprise architecture, for data

*Proposal for a series on enterprise architecture and why it matters for data, v0.1. The folder is named after the topic; the series title is still open. Status: proposed, 7 October 2026. Film 1 is scripted ([script](1-day-one/script.md)); nothing is built yet.*

## Decided

| Date | Decision |
|---|---|
| 7 October 2026 | A series about learning how an organisation works, before knowing what questions it needs to answer. Data is the payoff, not the starting point. |
| 7 October 2026 | The viewer is a newcomer. The thread is the first weeks of a new enterprise architect, Tomás, in an organisation he doesn't know. |
| 7 October 2026 | The organisation is a fictional, publicly owned energy utility: a composite of what public utilities publish, not any one company. Like the university in the other series, it stays unnamed. |
| 7 October 2026 | No single framework. Film 1 names the known bodies of knowledge once; after that, the series teaches the insights they share. |
| 7 October 2026 | The tools mature on screen: canvases as first drafts, then capability maps and value streams, then ArchiMate views, then a model people and agents can read. |
| 7 October 2026 | Eleven films in two parts: seven to understand the organisation, four on how that helps data solutions. |
| 7 October 2026 | Film 1, *Day one*, opens in 1085 with the Domesday survey: a ruler who, nineteen years on, still didn't know exactly what he ruled. The layers are held by three questions: why, and for whom; how it works; what runs it. |

## The brief

From the author (6 and 7 October 2026): a series on enterprise architecture and why it matters for data. As an enterprise and data architect, the author has found that knowing the domains, the capabilities and, sometimes, the processes makes data rules and expectations far more valuable. The series shouldn't start from data questions. It should widen the horizon: someone joins a new organisation, doesn't yet understand how it works, and so doesn't yet know which questions it needs to answer. TOGAF and ArchiMate are the natural reference, but, as with data modelling, the series shouldn't marry one approach; it takes the insights of all of them, mentions what exists, and shows the tools commonly used, from business model and value proposition canvases as first drafts to ArchiMate elements later. The final films focus on how all of this helps data solutions.

## Analysis

**What works**

- **The newcomer is everyone.** Every viewer has joined an organisation and not understood it. Starting there makes architecture a survival skill, not a discipline for specialists.
- **Questions come late, on purpose.** Data work usually starts from a request. This series shows where good requests come from: an understanding of why the organisation exists, what it must be able to do and who decides.
- **Insights over frameworks.** The frameworks overlap more than their vocabularies suggest. Teaching what they agree on stays true when a framework is renamed or revised.
- **A public utility is rich and safe.** It has customers, physical assets, a regulator, a minister, communities and an energy transition, and what it does is public. A composite avoids analysing, or overfitting to, a real company.

**What this proposal adds**

- **Evidence first.** Tomás learns from what the organisation publishes and from people: annual reports, the statement of intent from its government owner, regulatory decisions, the ombudsman's reports, interviews. Every element on his map can be traced back to one of them.
- **Wrong drafts.** Each layer is drawn wrong first, then corrected by the people who know: a team mistaken for a capability, a system for a process, a request for a need.
- **Today, the target and the path are kept apart.** A newcomer first describes what is true now; where the organisation is going is a separate drawing.
- **AI actors are part of the organisation,** each with a stated autonomy and decision rights, not only tools used to draw the map.

## Foundations: the insights, not one framework

Film 1 names the bodies of knowledge once:

- **Frameworks:** TOGAF and Zachman.
- **Notations:** ArchiMate, for architecture, and BPMN, for detailed processes.
- **Business architecture:** BIZBOK, the APQC process framework, and the process approach of ISO 9001.
- **Design and data:** domain-driven design, DAMA-DMBOK and data mesh.
- **Description:** ISO/IEC/IEEE 42010.
- **Canvases:** the Business Model Canvas and the Value Proposition Canvas.
- **The energy industry:** the IEC Common Information Model, so the newcomer never starts from a blank page.

After that, the series teaches what they share:

| # | Insight | Where it comes from |
|---|---|---|
| 1 | **Why, and for whom, before what.** Who is served, what they're trying to get done, what hurts, and how each offering is paid for. | The canvases; TOGAF's architecture vision |
| 2 | **Motivation is written down.** Stakeholders, drivers, assessments, goals, outcomes and principles. | ArchiMate's motivation elements |
| 3 | **Capabilities are the stable spine.** What the organisation must be able to do outlasts its teams, systems and restructures. | BIZBOK; TOGAF's capability-based planning |
| 4 | **Value streams show the customer's view; processes go only as deep as needed.** Levels 1 to 4, grouped into strategic, operational, support and evaluation; SIPOC where a process needs its edges drawn. | BIZBOK; APQC; ISO 9001; Six Sigma |
| 5 | **Each layer is derived from the one above:** business, then information, then application, then technology. | ArchiMate's layers; TOGAF's business, data, application and technology architectures |
| 6 | **Information is a business question before it's a software one.** Who owns it, and what it means, is decided before where it's stored. | TOGAF's data architecture; DAMA-DMBOK |
| 7 | **A domain is a part of the organisation modelled as an organisation in its own right,** with its own customers, services, capabilities and language. Meaning changes at its edge. | Domain-driven design; data mesh |
| 8 | **Today, the target and the path are drawn separately.** The baseline from evidence; target states; the gaps between them; the order they're closed in. | TOGAF's baseline, target and migration planning; ArchiMate's plateaus and gaps |
| 9 | **Every claim traces to evidence, and every decision records why.** | ISO/IEC/IEEE 42010 correspondences; architecture decision records |
| 10 | **Just enough.** Declare how deep to model, and stop there. Fewer, well-made elements beat a complete catalogue nobody reads. | Common practice |
| 11 | **Actors can be people or AI,** each with an autonomy level, decision rights and an escalation path. | Human-in-the-loop practice |
| 12 | **A model is true when the people who own it confirm it.** | Governance practice |

## How the tools mature on screen

Tomás's map grows across the series, and its notation grows with it:

1. **Canvases,** on a wall: a value proposition canvas per customer segment, a business model canvas per offering. Quick, rough, and meant to be argued with.
2. **A capability map:** first wrong, then levelled, then heat-mapped to show where it hurts.
3. **Value stream maps and SIPOC,** for the few processes that need them.
4. **ArchiMate views,** when the drafts have earned them. The film shows each canvas block becoming its element: a customer segment becomes a stakeholder, a pain reliever a capability, a key activity a business process, a key resource a resource.
5. **A model kept as text,** under version control, that people review and agents read.

Modelling tools (Archi, Sparx Enterprise Architect, BiZZdesign, LeanIX, Ardoq) are mentioned once: they exist, and the ideas don't depend on them.

## The organisation

A fictional energy utility owned by a regional government. It runs the distribution network, owns some generation (hydro, wind and solar), and sells energy to households and businesses, including those in hardship.

What makes it good teaching material:

- **More than one bottom line.** It has to be affordable, reliable, safe and decarbonising, and pay a dividend to its owner. Public value replaces profit as the measure, and the canvases have to stretch to fit.
- **Many stakeholders:** customers, the minister, the regulator, the ombudsman, the auditor, communities, staff and the market operator.
- **Walls inside one organisation.** In many markets, rules keep the network business and the retail business apart: the network can't hand customer information to retail. Two domains, one group, and a rule that shapes the data.
- **Physical and digital at once:** poles, transformers, meters and crews, alongside accounts, bills and half-hourly readings.
- **A transition underway:** rooftop solar, batteries and electric vehicles change what the network is for.

## The character

**Tomás**, an enterprise architect, in his first weeks. He's experienced, but not in energy and not in the public sector. He's curious, writes everything down, and isn't afraid to be wrong in front of people. He meets the people who know: an operations manager, a customer advocate, a regulatory lead, a data owner. Noor and Jun, from the other series, don't appear; this is a different organisation.

## The thread: the first weeks

Day one is a welcome pack, an org chart, a list of 140 systems and an invitation to a meeting about "the transition program". By the end, Tomás can explain why the organisation exists, what it must be able to do, how value reaches people, who decides what, what it knows and what runs it. Then, and only then, he can say which questions the organisation needs to answer, where each data rule belongs, and what a change in strategy means for the data.

## The series at a glance

| Part | # | Working title | The layer added to the map |
|---|---|---|---|
| Understand the organisation | 1 | **Day one** | None yet: the problem, and the ways of looking |
| | 2 | **Who it serves, and how it pays** | Customers and offerings: the canvases |
| | 3 | **Why it moves** | Motivation: stakeholders, drivers, goals, principles |
| | 4 | **What it must be able to do** | Capabilities |
| | 5 | **How value reaches people** | Value streams and processes |
| | 6 | **Who does it, and where meaning changes** | Actors, roles and domains |
| | 7 | **Today, and where it's going** | Applications, technology, and the path to a target |
| How it helps data | 8 | **Now the questions appear** | Decisions, questions and measures |
| | 9 | **Rules with a home** | Information: objects, owners and rules |
| | 10 | **When strategy moves** | A change walked through every layer |
| | 11 | **A map people and agents can read** | The model as something kept, not drawn once |

## The films

### 1. Day one

**Story.** Tomás's first day: acronyms, an org chart, a list of systems, a backlog of requests. He can answer none of the questions he's asked, because he doesn't yet know what the organisation is for.

**Ideas.** An org chart shows who reports to whom, not how the organisation works. A system list shows what was bought, not what's needed. Enterprise architecture is a way of looking: layers, from why down to what runs it. The known approaches, named once, and the promise to take what they agree on.

**On screen.** The pile of documents, sorted into the empty layers of a map.

Chapter by chapter, with narration: [the script](1-day-one/script.md).

### 2. Who it serves, and how it pays

**Story.** Tomás reads the annual report and talks to a customer advocate. He fills a value proposition canvas for households, then one for businesses, then realises the network's customers are also generators: homes with solar panels.

**Ideas.** Customer segments, jobs, pains and gains; products and services, pain relievers and gain creators; the fit between them. The business model canvas per offering. In the public sector, value isn't only revenue, and the canvas has to say so.

**On screen.** Canvases on a wall, with sticky notes moved as people correct them.

### 3. Why it moves

**Story.** The minister's statement of expectations, the regulator's latest decision and a community's objection to a new line pull in different directions.

**Ideas.** Stakeholders, drivers (decarbonisation, affordability, ageing assets), assessments, goals, outcomes and principles. Principles are what a later change is checked against.

**On screen.** A motivation view: who cares, what pressures them, what must be true.

### 4. What it must be able to do

**Story.** Tomás's first capability map looks like the org chart. The operations manager shows him that "Network Operations" is a team, and the capabilities are things like *manage outages*, *maintain assets* and *connect customers*.

**Ideas.** Capabilities are what, not who or how. Levels 1 to 3. Each capability has an owner. A heat map shows where it hurts, and where investment goes.

**On screen.** The map, drawn wrong, corrected, levelled and heat-mapped.

### 5. How value reaches people

**Story.** A household reports that the power is out. Tomás follows the value stream from the call to the restored supply, and finds that the detail matters at one step only: deciding which crew goes first.

**Ideas.** Value streams from the customer's view; their stages mapped to capabilities. Processes at levels 1 to 4, grouped into strategic, operational, support and evaluation. SIPOC for a process's edges. Going deeper only where a rule depends on order, state or timing.

**On screen.** Restore supply and meter to cash as value streams; one process opened to its activities.

### 6. Who does it, and where meaning changes

**Story.** "Customer" means a person with an account to retail, and a connection point to the network. The two businesses mustn't share what they know. Tomás draws the edge between them.

**Ideas.** Actors, roles and organisational units; partners and contracts. Domains as organisations in their own right. Meaning changes at a domain's edge; translate there, instead of forcing one definition everywhere. One AI actor appears: an agent that triages outage reports, with its autonomy and decision rights written down.

**On screen.** Two domains, one word, two meanings, and the wall between them.

### 7. Today, and where it's going

**Story.** The 140 systems, finally placed: each mapped to the capability it serves. Three systems do the same thing; one capability has nothing but a spreadsheet.

**Ideas.** The application and technology layers as a register, mapped to capabilities. Overlaps, gaps, and shadow systems. Baseline, target and transition: plateaus, gaps and the order they're closed in. Decisions recorded with why. The drafts become ArchiMate views, and each canvas block finds its element.

**On screen.** The full map, layer by layer, in ArchiMate notation for the first time.

### 8. Now the questions appear

**Story.** The backlog from day one, read again. Half the requests serve no goal; some goals have no measure. Tomás can now say which questions matter.

**Ideas.** Goals and outcomes imply decisions; decisions imply questions; questions imply measures, such as how long and how often customers are without power, or how many households are in hardship. Each measure belongs to a capability and has an owner. Data products are scoped by capability and domain, not by request.

**On screen.** Lines drawn from a goal down to a measure, and from a request up to nothing.

### 9. Rules with a home

**Story.** An estimated meter reading triggers a bill dispute. The rule that should have caught it exists, but no one owns it, and it lives in a script.

**Ideas.** Business objects become data objects, in domains with owners. Each data rule and expectation traces to a process step, a regulation or a principle: an estimated read stands only until the next actual read; a connection point has one retailer at a time; network customer data stays on the network's side of the wall. Quality expectations come from the process: timeliness from its service level, completeness from its steps. The industry's information model as a starting point, not a blank page.

**On screen.** One rule, homeless, then placed: on a process step, with an owner and a reason.

### 10. When strategy moves

**Story.** The government directs the utility to offer a social tariff for households in hardship. Eligibility depends on information held by another agency.

**Ideas.** A change walked down every layer: a new driver and goal, a new product, changed capabilities and processes, a data-sharing agreement, consent and privacy rules, new data objects and measures, and the systems affected. The target state and the gaps, in order. What a well-architected organisation can answer in a day, and what a poorly architected one finds out in production.

**On screen.** The change as a ripple, layer by layer, ending at the data contracts that must change.

### 11. A map people and agents can read

**Story.** Tomás's map is now useful, so it's at risk of going stale. He moves it from slides to text that is versioned, reviewed and readable by agents.

**Ideas.** The model as living metadata: each fact once, each claim traced to evidence, each decision recorded. Agents read it to scope data work, find owners and flag impact; people confirm what's true. This is where *From words to data* begins: from the organisation's meaning to the data's.

**On screen.** The wall of drafts becomes a repository; an agent asks the map a question and gets an owner, a rule and a reason.

## Overlap with the other series

- ***From words to data*** starts where this series ends: with meaning, concepts and models. Film 11 hands over to it.
- ***In the weeds of data crafting*** builds the contracts and tests that films 9 and 10 say where to place.
- ***The Inner Life of Data*** shows the platform. This series shows the organisation the platform serves.

## Rigour to check when scripting

- **Current versions of the standards:** TOGAF, ArchiMate, BIZBOK, the APQC framework (and its utilities edition), DAMA-DMBOK, ISO/IEC/IEEE 42010 and the IEC Common Information Model (IEC 61968, 61970 and 62325).
- **Ring-fencing and unbundling** differ by jurisdiction. Keep it to "in many markets", and keep the rule generic.
- **Reliability measures** (SAIDI, SAIFI): use their standard definitions if named.
- **The canvases** are Strategyzer's; credit them.
- **Public-sector governance** (statements of expectations, ministerial directions, dividends) differs by country. Keep it generic and plausible.
- **Tool names** are checked when published.

## Decisions for the author

1. **The series title.** Some options: *The map before the data*, *Know the ground*, *Before the questions*.
2. **Film length:** 6 to 7 minutes each, like the other series?
3. **Labs and scenarios:** the same engine as *From words to data*? Candidate labs: sort clues into layers, fill a canvas from an annual report, correct a capability map, trace a rule to its home, walk a change through the layers.
4. **Spanish pages,** as for the other series?
5. **Its own sound and visual mark,** as *In the weeds* has?

## Next checkpoints

1. The author agrees this proposal, and decides the points above.
2. A treatment for film 1, and Tomás's character card.
3. The organisation's world: its canvases, capability map, value streams and domains, written once in `shared/` so every film draws from the same model.
