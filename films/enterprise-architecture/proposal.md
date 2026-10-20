# Enterprise architecture, for data

*Proposal for a series on enterprise architecture and why it matters for data, v0.2. The folder is named after the topic; the series title is still open. Status: proposed on 7 October 2026; films 9 to 11 drafted again and approved on 17 October 2026, each made in its own thread ([the author's answers](#questions-for-films-9-to-11)). *Day one*, *Who it serves, and how it pays*, *Why it moves*, *What it must be able to do*, *How value reaches people*, *Who does it, and where meaning changes*, *Today, and where it's going* and *Now the questions appear* are built and on the site ([series README](README.md)).*

## Decided

| Date | Decision |
|---|---|
| 7 October 2026 | A series about learning how an organisation works, before knowing what questions it needs to answer. Data is the payoff, not the starting point. |
| 7 October 2026 | The viewer is a newcomer. The thread is the first weeks of a new enterprise architect, Tomás, in an organisation he doesn't know. |
| 7 October 2026 | The organisation is a fictional, publicly owned energy utility: a composite of what public utilities publish, not any one company. Like the university in the other series, it stays unnamed. |
| 7 October 2026 | No single framework. The opening film, *Day one*, names the known bodies of knowledge once; after that, the series teaches the insights they share. |
| 7 October 2026 | The tools mature on screen: canvases as first drafts, then capability maps and value streams, then ArchiMate views, then a model people and agents can read. |
| 7 October 2026 | Eleven films in two parts: seven to understand the organisation, four on how that helps data solutions. |
| 7 October 2026 | *Day one* opens in 1085 with the Domesday survey: a ruler who, nineteen years on, still didn't know exactly what he ruled. The layers are held by three questions: why, and for whom; how it works; what runs it. |
| 7 October 2026 | A working title, *The map before the data*, for the title and end cards; it's one line in `shared/src/ea.js` to change. |
| 7 October 2026 | The series' look: drafts are paper on a wall, the confirmed model is glass in the layers' conventional colours. Its sound: nylon-string plucks and a soft flute over warm pads, and its own mark, 1-3-5-8. A second character, Grace Achieng, owns network operations. |
| 7 October 2026 | *Who it serves, and how it pays* opens in 1882 with Edison's Pearl Street customers, who wanted light, not electricity. Farah Siddiqui, the customer advocate, joins the cast. Fit is a rule: an unmatched pain is a missing capability or a customer not served, and the canvas says which. |
| 8 October 2026 | *What it must be able to do* opens in the Andes in the 1400s with the chasqui relay runners: the runners changed and the roads were rebuilt, and the ability to move a message stayed. Tomás's first capability map is the org chart again; the test is whether a box survives a restructure, a new system and a new process. Three levels, one owner each (a person), a heat map with evidence, and depth only where it hurts. Its present is in F major, and its past has a dark harp, with no borrowed Andean sound. |
| 8 October 2026 | *How value reaches people* opens in Mumbai with the dabbawalas, told in the past tense for its scale: about 5,000 dabbawalas and some 200,000 lunches a day were figures from before the pandemic, and the network has shrunk since. The story follows one call on a stormy night, from the household's side (a value stream, with Farah) to the one step that needs detail (who goes first, drawn in BPMN), and ends on the facts that rule needs. Its present is in B-flat major, the storm in G minor, and Mumbai has a warm electric piano, with no borrowed Indian sound. |
| 9 October 2026 | On the site, under the topic *Enterprise architecture*, with Spanish pages. Labs and scenarios will cover the whole series, not each film as in the other series: one set, drawn from every film's ideas (each script's *Labs (candidates)* feed it), later. Until then, each film has three Pause and think questions. |
| 10 October 2026 | *Who does it, and where meaning changes* opens in Japan with its two frequencies: Tokyo's German generators at 50 Hz and Osaka's American ones at 60 Hz in the 1890s, and in 2011 the converters between them too few to carry the west's spare power east. Roles do the work and actors fill them: people, teams, a contractor under a contract, and one AI agent that triages outage reports, with its rights written down and Grace as its owner. "Customer" means an account to retail and a connection point to the network; the two are domains, kept apart by a wall, and what crosses is a short, agreed list. Ama, the regulatory lead, explains the wall; the head of retail stays unseen. Its present is in G major, and Japan has a soft marimba over two low hums a minor third apart, with no borrowed Japanese sound. |
| 11 October 2026 | *Today, and where it's going* opens on an imagined morning in 2045 in the utility's own region, labelled as imagined: a street trading power from its batteries, and a crew sent before a transformer fails. The 140 systems from *Day one* are placed under the capabilities they serve: three for managing outages, a spreadsheet for assessing network capacity, and one system that serves nothing. The drafts become one ArchiMate model, and Archi and LeanIX are named once. Today, the target and the path are three drawings, the path in plateaus ordered by dependency, and one decision (one outage system) is written down with why. Part one ends here: the map of how the utility works is drawn. Its present is in E-flat major, and the imagined morning has a soft kalimba in A-flat lydian. |
| 16 October 2026 | Films 9 and 11 carry the vision that *Meaning machines can read* sets out in its chapter *One map, many views*. Data domains and their entities live in the architecture map, which feeds the business glossary and the conceptual model rather than competing with them. Each concept is written once there, with a stable id: its definition (owned by the business), its relationships, named as ArchiMate names them (or any other architecture modelling language), and its rules. Cardinality is decided in the logical model, not the conceptual one; a business rule's limit stays a rule. The glossary, the conceptual and logical models, an OWL ontology for reasoning and the checks on the data (SHACL shapes, data contracts, tests) are views generated from the map, one way, so they agree. |
| 16 October 2026 | *Now the questions appear* opens in Kerala in 1997, from Robert Jensen's survey: at Badagara, eleven crews pour their catch back into the sea while twenty-seven buyers within fifteen kilometres leave with no fish, until mobile phones let a skipper agree a price at sea before choosing where to land. The question was always the same; what changed is that its answer arrived in time. The reporting team's backlog from Tomás's first day, forty-two requests, is read again with one test: who will decide what with the answer, and when? Half reach a decision and a goal (some through the regulator's obligations), and half reach nothing and go back with one question. Traced down, a goal implies decisions, a decision questions, and a question a measure: the outcome nobody could check gets interruptions per customer, per year; keeping bills affordable has no measure for the people who pay; and connecting solar has one measure counted two ways until Grace writes one definition down, answering the questions *Why it moves* left open. Each measure gets a home (the capability whose work it measures) and an owner, and the requests that matter need four data products, scoped by capability and domain, not twenty-one reports. From this film on, the Spanish version is captions and page text; the pictures stay in English. Its present is in C major, and Kerala has a celesta over bowed strings in A minor, with the sea, and no borrowed Indian sound. |
| 17 October 2026 | After Rodrigo's review of *Now the questions appear*, its opening says its link to the film in one line: each skipper had to choose a market at sea without knowing what it would pay, and the question mattered because he would act on the answer, by choosing where to land; the phones brought it in time. The film names its test after him, "the skipper's test", and the lobby's dashboard is "as live as the skipper's call", but no one decides anything with it: live data is not what makes a question matter. A new chapter 10, *Back on the coast*, closes the story: the phones spread district by district, the skipper's question is traced the film's way (goal, decision with who and when, question, measure), and the outcomes follow: the waste stopped, prices evened out, crews earned 8% more and fish cost 4% less. The price chart in chapter 1 is gone. |
| 17 October 2026 | *Rules with a home* links rules to ontologies, and to the discussion of OWL in *Meaning machines can read*, as a good way to define them as part of the architecture. It only introduces the concept: each rule is written once in the map, as a statement about the concepts it governs and how they relate. Then it says that what's written this way is, generally, an ontology, ready for OWL. It keeps that film's rigour: OWL is for reasoning, and checking the data stays with the checks generated from the same map (SHACL shapes, data contracts, tests). |
| 17 October 2026 | The author approved the draft of films 9 to 11 below: its stories, what carries between them, and film 11 ending on a newcomer's first day next spring. Each film is made in its own thread, all three at once, and they merge in order: 9, 10, then 11. |
| 17 October 2026 | From *Rules with a home* on, the films use ArchiMate 4 (April 2026) as the standard and don't say what changed: a rule is drawn as a requirement, the difference between two plateaus as an assessment, and the agreement with the agency as a business object. What changed from version 3.2 is taught in the series' learning modules, which also evaluate some of the changes, such as how version 4 draws the contract in *Who does it, and where meaning changes* and the gaps in *Today, and where it's going*. Films 1 to 8 stay as approved. The series keeps "layers" for its own six, because "domain" already means a part of the organisation with its own meaning. Relationship multiplicity, new in version 4, isn't drawn on the map: cardinality stays in the logical model (16 October). |
| 17 October 2026 | Interactive learning and evaluation for the whole series starts now, in its own thread, instead of later (9 October): the best interactive experience on the most relevant concepts, across all eleven films, with ArchiMate 4's changes. |
| 17 October 2026 | The series' labs and scenarios are one set for all eleven films, on two pages of their own: twelve labs, one for each film and a twelfth, *Redraw it in ArchiMate 4*, and 25 scenarios, two or three for each film, each naming its film. Each film's Pause and think questions open its lab. The labs of films 9 to 11 follow the draft approved today and say the film is coming; each gets its chapter once its film is on the site: *Two rules, not one* for film 9, *Down every layer* for film 10, and, for film 11, the chapter where the map is written as text. |
| 17 October 2026 | Each lab lets people break the one thing its film teaches: sort day one's pile into the layers and see that nothing links them; find the pain a canvas leaves unanswered; keep out of the motivation chain what isn't ready; put the first capability map through a restructure, a new system and a new process; send two crews into the storm, then find the rule's facts and their sources; choose what crosses the wall; place systems under capabilities and switch one off; give eight requests the skipper's test; give day one's rule a home and plant a case that must fail; walk the social tariff down the layers without breaking the wall; and run the map's own checks before asking its agent. Every fix that makes a check pass is a real answer (an owner and its evidence), never a placeholder. |
| 17 October 2026 | ArchiMate 4's changes are taught and evaluated in the learning modules only: the lab *Redraw it in ArchiMate 4* and five scenarios show the contract as a business object, a gap as an assessment, a constraint as a requirement, software assigned to a role, an interaction as a process a collaboration performs, capabilities unchanged, and why the series keeps "layers" while version 4 says domains. A rule's limit stays a rule, not a 1 on a line (16 October). |
| 17 October 2026 | The labs' and scenarios' Spanish follows the films' Spanish captions (capacidad, flujo de valor, impulsor, punto de conexión, electrodependiente, cuadrilla, comercialización, el borde, el muro), and the map's ids stay as they are, like code. Their pictures are laid out from the measured words in each language, and the series-learn check fails if a picture cuts a word short. |
| 17 October 2026 | *When strategy moves*, as made. Its pilot line follows Hughes and Lonie (2007): M-Pesa began as a pilot for repaying small loans, people used it to send money to others, and sending money home became the plan. The new step goes into billing, the business process ("a new step in billing"), not into *meter to cash*, a value stream, whose parts are stages. The new rules are RUL-023 to RUL-025, and the decision is record 12, "the social tariff stays with retail". IT owns the secure exchange; Ama owns the agreement, and the agency is its other party. The old version of the contract gets its own `deprecation_date`. The sound: a felt piano over pizzicato strings and soft pads in F-sharp minor for Kenya, then the series' palette in A major, and the ripple, one soft felt-piano note for each layer the change reaches. |
| 18 October 2026 | The labs of films 9 to 11 follow the films as built, with their names, numbers and IDs; film 11's lab gets the chapter `text`, *From slides to text*, when the film is on the site. Its map is CAP-004, CAP-009, RUL-021, RUL-022, MSR-002 and MSR-004, a measure of *When strategy moves*' outcome, eligible households on the tariff, still a draft. Generating power, CAP-009, still has no owner, so the lab leaves it flagged after the fixes: a check is never passed with a guess. *Who does it, and where meaning changes* drew the outage agent as an actor, in version 3.2; film 11 draws both agents as version 4 does, as software assigned to a role (APP-015, and APP-030 in ROL-009, map drafter), and *Redraw it in ArchiMate 4* and scenario 112 teach that change. In Spanish, an agent's rights are its atribuciones, as in the films' captions. |
| 20 October 2026 | After Rodrigo's review of *When strategy moves*, its opening says what its example shows: a mobile network sets a new strategy, to carry money as well as calls, on a note; the strategy fits in a sentence, and making it real, as M-Pesa, reaches every layer, down to the shop counter. The pilot line is gone, because it read as if no one had set a strategy, and the walk starts from the same idea: "As with M-Pesa, the sentence is the easy part." "Longer than the code" now says which: agreeing takes longer than changing the systems. A data contract is added to before it's versioned: the discount is a new column, amount due keeps its meaning, the contract stays at version 1, and a second version is the last resort, for removing or redefining a column. The music follows the master data films: chords under the opening story, then only at a few turns, moments on screen and wordless pauses, with no bed under the voice, no pulse and nothing that beats on a phone's speaker; the film's `tools/quiet.py` checks it. The lab *Walk it down* and the film's Pause and think question follow. RUL-023, about what billing does, says it's a business rule, and when it fails, a bill is listed for the billing team, not failed as a test, as *Rules with a home* now splits rules by kind; RUL-024 and RUL-025 stay data rules. |

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

*Day one* names the bodies of knowledge once:

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

## Openings: other places, other times

Each film opens with a short, true story that holds its idea, then cuts to Tomás. To keep viewers engaged, the openings vary in **place** (not only Europe and North America), in **time** (the past, the present, and imagined futures) and in **kind** (an invention, a failure, a system people run every day). A future opening is labelled as imagined, and set in the utility's own fictional world. A story from another culture is told in the series' own drawing style, never in that culture's art (PLAYBOOK §2), and checked against a source from that culture where one exists.

| Film | Opening | Where | When |
|---|---|---|---|
| 1 | The Domesday Book | England | 1086 |
| 2 | Edison's Pearl Street customers | United States | 1882 |
| 3 | The Northeast blackout | United States and Canada | 1965 |
| 4 | The Inca's chasqui runners | The Andes | 1400s |
| 5 | Mumbai's dabbawalas | India | Since 1890; figures from before 2020 |
| 6 | Two frequencies in one country | Japan | 1890s and 2011 |
| 7 | A morning in the utility's region | The series' fictional region | Imagined, 2045 |
| 8 | Fishermen with mobile phones | Kerala, India | 1997–2001 |
| 9 | "Once only": a birth, registered once | Estonia | Today |
| 10 | Money by phone | Kenya | 2007 |
| 11 | Wayfinding by the stars | The Pacific, Hawaiʻi to Tahiti | 1976, and fifty years on |

The first three openings are all from the West and the past; films 4 to 11 balance them. Each opening's facts go into that film's rigour notes and are checked before recording.

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

Chapter by chapter, with narration: [the script](2-who-it-serves/script.md).

### 3. Why it moves

**Story.** The minister's statement of expectations, the regulator's latest decision and a community's objection to a new line pull in different directions.

**Ideas.** Stakeholders, drivers (decarbonisation, affordability, ageing assets), assessments, goals, outcomes and principles. Principles are what a later change is checked against.

**On screen.** A motivation view: who cares, what pressures them, what must be true.

Chapter by chapter, with narration: [the script](3-why-it-moves/script.md).

### 4. What it must be able to do

**Opening.** The Andes, the 1400s: the Inca's chasqui runners carried messages and knotted-string records (khipu) along the roads in relays, about 240 km a day. The runners changed at every post; the ability to move a message across an empire stayed. A capability outlasts whoever performs it.


**Story.** Tomás's first capability map looks like the org chart. The operations manager shows him that "Network Operations" is a team, and the capabilities are things like *manage outages*, *maintain assets* and *connect customers*.

**Ideas.** Capabilities are what, not who or how. Levels 1 to 3. Each capability has an owner. A heat map shows where it hurts, and where investment goes.

**On screen.** The map, drawn wrong, corrected, levelled and heat-mapped.

Chapter by chapter, with narration: [the script](4-what-it-must-do/script.md).

### 5. How value reaches people

**Opening.** Mumbai, today: about 5,000 dabbawalas carry some 200,000 home-cooked lunches a day from kitchens to offices and back, with a colour-and-number code on each tin and almost no errors. One value stream, from the customer's view, with detail only at the hand-offs.


**Story.** A household reports that the power is out. Tomás follows the value stream from the call to the restored supply, and finds that the detail matters at one step only: deciding which crew goes first.

**Ideas.** Value streams from the customer's view; their stages mapped to capabilities. Processes at levels 1 to 4, grouped into strategic, operational, support and evaluation. SIPOC for a process's edges. Going deeper only where a rule depends on order, state or timing.

**On screen.** Restore supply and meter to cash as value streams; one process opened to its activities.

Chapter by chapter, with narration: [the script](5-how-value-reaches-people/script.md).

### 6. Who does it, and where meaning changes

**Opening.** Japan: in the 1890s, Tokyo bought German generators (50 Hz) and Osaka American ones (60 Hz). The country still runs on two frequencies, and in 2011, after the earthquake, the west could send the east only what a few converter stations could translate. The same word, "power", means something different on each side of an edge, and the translation is where it breaks.


**Story.** "Customer" means a person with an account to retail, and a connection point to the network. The two businesses mustn't share what they know. Tomás draws the edge between them.

**Ideas.** Actors, roles and organisational units; partners and contracts. Domains as organisations in their own right. Meaning changes at a domain's edge; translate there, instead of forcing one definition everywhere. One AI actor appears: an agent that triages outage reports, with its autonomy and decision rights written down.

**On screen.** Two domains, one word, two meanings, and the wall between them.

Chapter by chapter, with narration: [the script](6-who-does-it/script.md).

### 7. Today, and where it's going

**Opening.** An imagined morning in 2045, in the utility's own region: a street of homes trading power from their batteries, a crew sent before the fault happens. Then back to today's 140 systems. The target is drawn as carefully as the present, and the path between them is its own drawing.


**Story.** The 140 systems, finally placed: each mapped to the capability it serves. Three systems do the same thing; one capability has nothing but a spreadsheet.

**Ideas.** The application and technology layers as a register, mapped to capabilities. Overlaps, gaps, and shadow systems. Baseline, target and transition: plateaus, gaps and the order they're closed in. Decisions recorded with why. The drafts become ArchiMate views, and each canvas block finds its element.

**On screen.** The full map, layer by layer, in ArchiMate notation for the first time.

Chapter by chapter, with narration: [the script](7-today-and-where-its-going/script.md).

### 8. Now the questions appear

**Opening.** Kerala, India, 1997 to 2001: as mobile phones reached the coast, fishermen at sea began calling markets before choosing where to land their catch. Waste fell and prices across markets converged. A question only matters once someone can act on the answer.


**Story.** The backlog from day one, read again. Half the requests serve no goal; some goals have no measure. Tomás can now say which questions matter. The film ends back on the coast, with the skipper's own question traced the same way.

**Ideas.** Goals and outcomes imply decisions; decisions imply questions; questions imply measures, such as how long and how often customers are without power, or how many households are in hardship. Each measure belongs to a capability and has an owner. Data products are scoped by capability and domain, not by request.

**On screen.** Lines drawn from a goal down to a measure, and from a request up to nothing.

Chapter by chapter, with narration: [the script](8-now-the-questions-appear/script.md).

### 9. Rules with a home

*Draft of 17 October 2026, for the author's approval. It replaces the outline of 7 October.*

**The idea.** A data rule is a claim about how the organisation works, so its home is the map. Each rule is written once, in the business's words, about the concepts it governs. It's attached to the step where it applies, with an owner who can change it and a reason that says why, and every check on the data is drawn from it, one way. Rules and concepts written like this are, generally, an ontology, ready for OWL; checking the data stays with the checks.

**Opening: once only.** Tartu, Estonia, today. A baby is born, and the birth is entered once, in the population register. Within days, the parents get an email from the Social Insurance Board: a family benefit is theirs if they accept it. They never applied. No office keeps its own copy of the birth; each asks the population register, over X-Road, the exchange every Estonian public office uses. The law forbids two databases for the same data, and every database is listed in one catalogue, with the office that owns it and the law that says what it holds. *The link, said in one line:* each fact has one home and one owner, so it's asked for once, and every office that needs it asks there. *Borrowed by name:* Tomás wants the same for rules, "once only". *Closed:* the film ends back in Tartu, with the benefit paid and nobody asked twice. The family is illustrative; the system is real.

**Story.** The data rule card from *Day one* comes back, "an estimated reading stands only until the next actual reading", with the bill of $412.80 that was flagged wrong beside it. Farah brings the household behind that bill. They were away for three weeks in June; their smart meter stopped sending readings, and the bill estimated those weeks from last year. When the meter reconnected, it sent the readings it had stored: they had used almost nothing. The actual readings arrived, and the bill was never corrected. The rule existed. A nightly script, written years ago by an analyst in the metering team as a stopgap, found estimates with an actual reading behind them and queued their bills to be corrected. In March, billing moved to its new system, and the script kept writing to the old queue, which nothing reads now. It ran every night, reported no error and corrected nothing: about 1,900 bills since March. Nobody owned it, because it lived on the wall between the network and retail, and belonged to neither side. Tomás finds it written four more ways, in the retail code, the meter system's settings, the billing system's notes and the complaints team's spreadsheet: the code says why, and the others each say how, a little differently. None of them is its home. Day one's rule turns out to be two rules, one on each side of the wall. On the network's side, an estimate is replaced when the actual reading arrives, and the replacement is sent to the retailer: Grace owns it, and its reason is the metering rules. On retail's side, a bill based on a replaced estimate is corrected on the next bill: the head of retail owns it, and its reason is the retail code. The replaced reading crosses the wall on the agreed list from *Who does it, and where meaning changes*. Ama corrects day one's draft too: "fair, accurate bills" was never one of the utility's goals; it's an obligation, in the regulator's code. Each rule is written once in the map and attached to its step of *meter to cash*, read or bill, and its checks are drawn from it. The household gets $144.40 back, the 1,900 bills are found and corrected, and when a check fails now, it tells the owner's team, not a mailbox.

**Ideas.**

- A rule builds on facts, and facts on concepts (the Business Rules Manifesto, article 3). So it's written in the business's words, about the things it governs: a reading, an estimate, a bill, a connection point.
- Every rule traces to a reason: a regulation, a principle (such as *Why it moves*' "customer information stays with the business that collected it"), or the service level of the step it serves. A rule with no reason can't be changed safely, and one with no owner can't be fixed.
- A rule's home is the map. It's attached to the step where it applies, in the domain that owns that step, but it isn't inside the step: rules are not process (the Manifesto, article 2), and one rule may apply at several steps.
- A rule that crosses a domain's edge is two rules, one on each side, joined by what crosses. What lives on the wall belongs to no one.
- The business objects a rule talks about become data objects in the domains that own them. The industry's model (the IEC Common Information Model: usage point, meter reading, reading type) gives the starting words, and the map records the utility's own beside them.
- Quality expectations come from the process: timeliness from the step's service level (an estimate replaced within two working days of the actual reading), completeness from its steps (every estimate replaced, or explained), and validity from the rule itself (every reading marked actual or estimated).
- Written in a structured form (what it applies to, what must be true, its owner, its reason, its home, and what happens when it fails), a rule generates its checks, one way: a dbt test, a data contract's quality rule, a SHACL shape. Nobody edits a check directly. A rule's limit stays a rule: "a connection point has one retailer at a time" is a check that no two periods overlap, not a count on a line.
- Written this way, the rules and the concepts they govern are, generally, an ontology, ready for OWL. The film introduces the idea and links to *One map, many views* in *Meaning machines can read*, without teaching OWL. OWL reasons from what is said; in its open world, a correction that never happened is only unknown, so finding the uncorrected bill is the checks' job.

**Reference and alternatives.** The film follows the Business Rules Manifesto (version 2.0, 2003) and SBVR (OMG, version 1.5) for what a rule is: a declarative statement in the business's vocabulary, built on facts and concepts, kept apart from the process and from how it's enforced, in "one cohesive body of rules" (the Manifesto, 2.3). It uses ArchiMate 4 for where a rule sits on the map (a requirement that a step realises), and DAMA-DMBOK for the quality dimensions and for stewardship. Also worth knowing: DMN (OMG, 1.5), for rules that decide, written as tables of conditions and outcomes (film 10's eligibility is one); domain-driven design's invariants, which a domain keeps inside its own edge; data contracts (the Open Data Contract Standard, 3.1), for rules on what crosses an edge; and W3C's SHACL and OWL, for checking and for reasoning. Where it differs: it doesn't teach SBVR's structured English or DMN's tables. It writes each rule as a plain sentence on a card with its parts named, and it adds what the frameworks leave to practice: an owner, a reason and a home on the map for every rule, with its checks generated from it.

**In practice.**

- Rules hide in code, configuration, spreadsheets and people's heads. The ones at the edge between two teams are the ones nobody owns.
- Start with the rules that already hurt (a complaint, an incident, an audit finding), not an inventory of every rule.
- Write the rule in the business's words first, and have its owner confirm it. Generate the check from the rule, never the rule from the check.
- Decide what happens when a check fails (warn, stop, or send it to the owner's queue) and who hears about it. A check that reports to a mailbox nobody reads isn't a check.
- A check that finds nothing every night may be checking nothing: give it a case that must fail.
- Most rules are checks; few need reasoning over.
- *From the author's experience:* to add.

**Tools, shown, not leading.** dbt holds the generated checks as data tests beside the readings and billing models, each with its rule's id and the severity its owner chose (warn or error). Databricks runs them, and its catalogue shows each table's owner, its rules and the latest result on the table's page; where data arrives, a pipeline's expectations are the same checks. Names and maturity are checked when scripting.

**On screen.** The rule card from *Day one*, homeless, lands on the wall between the network and retail, where the script ran. It splits into two cards, each settling on its own side with a gold owner tag and its reason, and threads run from each card, one way, to the checks it generates. The bill of $412.80, flagged wrong on day one, is corrected.

**Chapters, a first outline.**

1. *Once only.* Tartu: a birth registered once, and a benefit offered, unasked.
2. *The bill from day one.* Farah brings the household behind the $412.80.
3. *A rule on the wall.* The script, the move in March, a clean run every night, and 1,900 bills.
4. *Five places, no home.* The same rule in five places, none of them its home; once only, for rules.
5. *Two rules, not one.* Split at the wall, joined by what crosses.
6. *Where a rule comes from.* A regulation, a principle, a service level; Ama corrects day one's goal.
7. *What a rule is about.* Business objects, data objects and their domains; the industry's words.
8. *Expectations from the process.* Timeliness, completeness and validity, each from a step.
9. *Written once, checked everywhere.* The rule's card, the checks drawn from it, the owner's queue.
10. *Generally, an ontology.* Concepts, relationships and rules, ready for OWL; reasoning and checking.
11. *Back in Tartu.* $144.40 back, 1,900 bills corrected, Tomás's note answered; next, when strategy moves.

**Its sound** (suggested; the thread designs it). The present in D major; Tartu in B minor, a soft vibraphone over a low clarinet; no borrowed Estonian sound.

**Rigour to check.** Estonia's Public Information Act (since 2007, no separate databases for the same data; the one-request-only principle named in it since 2019), the catalogue RIHA, X-Road (since 2001), the proactive family benefit (the first event-based proactive service, with about 30,000 offers in its first year), and which offices ask the register. How estimates are made and replaced differs by market; smart meters store their readings while they can't send them; refund and back-billing rules differ (twelve months under Ofgem's rules, nine under Australia's National Energy Retail Rules). The CIM's usage point is "a logical or physical point in the network to which readings or events may be attributed". The script, the move in March, the 1,900 bills, $412.80 and $268.40 are fictional and plausible.

### 10. When strategy moves

*Draft of 17 October 2026, for the author's approval. It replaces the outline of 7 October.*

**The idea.** A change in strategy is a few words at the top of the map, and it lands in every layer. With a map, the change can be walked down in a day: what changes, who owns each change, in what order, and which data contracts move. Without one, production finds out.

**Opening: money by phone.** Kenya, 2007. A man working in Nairobi sends part of his wages home to his family upcountry. Until then, cash went with a bus driver or a friend, or he took it himself, and not all of it arrived. In March 2007, a mobile network launched M-Pesa: money sent from a phone, confirmed by text message. It had begun as a pilot for repaying small loans; people in the pilot used it to send money to each other, and that became the plan. The idea took a sentence. Making it real reached every layer: shops that sold airtime became agents, changing cash into mobile money and back; the central bank let it run, with customers' money held in trust at a bank; every customer registered with a national identity card; and a short menu worked on the simplest phones. *The link, said in one line:* a change of strategy reaches every layer, down to the shop counter where people meet it. *Borrowed by name:* Tomás walks the change "down to the counter". *Closed:* back in Kenya at the end, within a few years most households had someone using it, and money sent home arrived in minutes.

**Story.** The government, the utility's owner, directs it to give a social tariff, a discount on the bill, to every eligible household from 1 July, automatically, with no forms to fill in. Who is eligible is known to another organisation, the social services agency, not to the utility. The minister's office asks what it will take, by tomorrow. Tomás walks it down the map. In motivation: a new driver, the direction, and an outcome with a measure (eligible households on the tariff), under a goal from *Why it moves*, keep bills affordable, the goal *Now the questions appear* found with no measure for the people who pay. In strategy: the capabilities it touches, selling energy, serving customers and meeting obligations. In business: a new product, the social tariff, a new step in *meter to cash*, a new partner, the agency, and a data-sharing agreement with it. In information: a new business object, eligibility, with its dates, and new rules, each with a home, an owner and a reason, as *Rules with a home* taught. Then the data products and contracts that change, and the systems: billing, the customer system and a secure exchange. "Once only", borrowed from Estonia, says don't make households prove what the agency already knows. The agreement asks for the least: the utility sends its account holders' matching details, and the agency answers only "eligible, from this date", never which support a household gets. Tomás's first draft, on paper, sends the list to the network as well, to discount the network charge; Ama checks it against the third principle from *Why it moves*, customer information stays with the business that collected it, and crosses it out. The decision is written down with why: retail applies the discount, and nothing new crosses the wall. Down at the counter, Farah finds who the match will miss: tenants whose account is in a landlord's name. A second route, an application, goes on the path for later in the year. The path is drawn in plateaus, as in *Today, and where it's going*: by 1 July, the match, the bills and the call centre's answer; by December, the second route; next year, the outcome measured. By the morning, the minister's office has one page: what changes, who owns each change, what's ready by 1 July and what isn't. On 1 July the first bills carry the discount, and about nine in ten eligible households get it without asking. The head of retail confirms the measure Farah has asked for since 2024, households falling behind, so the goal can now be steered.

**Ideas.**

- A strategy change enters at the top, as a driver and a goal or outcome, and is walked down every layer: motivation, strategy, business, information, application, technology. Every element it touches has an owner, so the walk is also the list of who must agree.
- Check the change against the principles before designing it (*Why it moves*): they settle the hard calls the same way every time.
- Data is where a change lands: new business objects, new rules with homes, an agreement with another organisation and its legal basis, asking for the least, and the contracts of the data products that change, each as a new version beside the old one, with its readers found through lineage.
- The target and the path are drawn separately (*Today, and where it's going*): plateaus, in the order their dependencies allow.
- Find who an automatic route misses, at the counter, before production does.
- Write each decision down with why, so the next change starts from it.
- What a well-architected organisation can answer in a day, a poorly architected one finds out in production.

**Reference and alternatives.** The film follows TOGAF's architecture change management (Phase H of the ADM, in the TOGAF Standard, 10th Edition: a change is assessed against the architecture, and starts a new cycle when it needs one) and capability-based planning, with the path drawn in ArchiMate 4's plateaus, and the difference between two of them as an assessment. At the data end, it follows data mesh's data products and versioned data contracts. Also worth knowing: OMG's Business Motivation Model (a directive from the owner as an influencer, assessed for its impact); BIZBOK's strategy mapping, from a strategy to the capabilities, value streams and initiatives it touches; privacy by design and data protection impact assessments (the GDPR's articles 25 and 35, or a country's equivalent) for the agreement; and ISO/IEC/IEEE 42010's correspondences, which make an impact traceable. Where it differs: it doesn't run a whole ADM cycle. It walks one change through the series' six layers in an afternoon, then plans its plateaus. People's side of a change (training, communication) is named, not taught.

**In practice.**

- Ask "what will it take?" before "by when?": the first answer is the list of owners who must agree.
- The legal basis and the agreement take longer than the code; start them on the first day.
- Ask another organisation for a yes or a no, not for its reasons. Asking for the least shapes the design, and is easier to agree.
- Look for whoever the automatic route misses (tenants, shared homes, accounts in someone else's name) at the start, not in the first bills.
- Version a contract; never change it in place. Lineage says whom to tell.
- Write the decision down with why, even when it's "no": the next change will ask again.
- *From the author's experience:* to add.

**Tools, shown, not leading.** The changed data product's contract in dbt, with version 2 beside version 1 and a date for the old one to go, and the exposures that say who reads it. In Databricks, the catalogue's lineage finds every table, dashboard and job downstream, and a column mask lets the call centre see "on the social tariff" and nothing about anyone's support. Names and maturity are checked when scripting.

**On screen.** A drop lands at the top of the map, and a ripple runs down every layer, lighting each element the change touches with its owner's tag, until it reaches the contracts that must change. Tomás's first draft of the ripple, on paper, with a line through the wall that Ama crosses out. A household's bill on 1 July, with its new line.

**Chapters, a first outline.**

1. *Money by phone.* Nairobi to a town upcountry; every layer moved, down to the shop counter.
2. *A direction.* A social tariff for every eligible household, automatically, from 1 July: what will it take?
3. *Down every layer.* The ripple, from the driver to the technology, each element with its owner.
4. *Ask once.* The agency already knows; what goes, and what comes back.
5. *The wall holds.* The draft that sent the list to the network; the third principle; the decision and its why.
6. *New rules, with homes.* Who is eligible and from when, how long the answer is kept, who may see it.
7. *Down to the counter.* The bill's new line, the letter, the call centre's answer; Farah finds the tenants.
8. *Where the data lands.* Version 2 of a product's contract; lineage finds its readers; the exchange's own contract.
9. *The path.* Three plateaus, in order.
10. *Answered in a day.* One page for the minister's office by morning.
11. *1 July.* The first bills, film 8's measure confirmed, back in Kenya; next, a map that's used goes stale.

**Its sound** (suggested; the thread designs it). The present in A major; Kenya in F-sharp minor, felt piano over pizzicato strings; no borrowed Kenyan sound. The ripple has its own soft, falling figure, a note for each layer.

**Rigour to check.** M-Pesa: the pilot from October 2005 with a microfinance lender, Faulu Kenya; the Central Bank of Kenya's letter of no objection (February 2007) and the launch (March 2007); customers' money in a trust account; more than 20,000 customers in the first month (Hughes and Lonie, 2007); adoption figures that vary by survey; and Suri and Jack (2016) on poverty, with its critics. Automatic social tariffs from another agency's data are real practice: Portugal's automatic social energy tariff since July 2016, checked with the Tax Authority and Social Security (its beneficiaries rose from about 4% to about 20% of households; a UN Public Service Award in 2020), and the UK's Warm Home Discount, for which the government's department returns only identifiers to suppliers. Who pays for a discount differs by country (taxes, a levy on all customers, or generators, as in Portugal). The direction, its dates, the agency, the numbers and the design are fictional and plausible; rules separating network and retail differ by market.

### 11. A map people and agents can read

*Draft of 17 October 2026, for the author's approval. It replaces the outline of 7 October.*

**The idea.** A map is only alive while people use it, keep it true and can pass it on. Kept as text, with each element written once with a stable id, an owner and its evidence, every change reviewed and versioned, and every view generated from it, it can be read by the next person and by agents, who scope data work, find owners and flag impact, while people confirm what's true. This is where *From words to data* begins: from the organisation's meaning to the data's.

**Opening: by the stars.** 1 May 1976. The double-hulled canoe Hōkūleʻa leaves Honolua Bay, on Maui, for Tahiti, about 4,000 kilometres south, with no compass, no charts and no instruments. Its navigator, Mau Piailug, from Satawal in Micronesia, reads the stars rising and setting on the horizon, the swells and the birds, holding a star compass in his memory. Thirty-one days later the crew sights Mataiva, and on 4 June they reach Papeʻete, where more than 17,000 people are waiting. Mau's knowledge had passed only from navigator to apprentice, and few still held it; he chose to teach it beyond his own island, and a young Hawaiian, Nainoa Thompson, learned it from him and taught others. *The link, said in one line:* a map lives while people use it on every voyage, keep it true and teach it to the next navigator. *Borrowed by name:* "the navigator's test": could someone else sail by it? *Closed:* the film ends fifty years on, with Hōkūleʻa still sailing, navigated by people Mau taught and people they taught.

**Story.** Tomás's map is used every week now: to read requests with the skipper's test, to place rules, to answer the minister. That's when a map goes stale. It lives in slides and in a modelling tool only Tomás edits; its views are copied into decks and drift; the glossary and the data catalogue keep their own words. It fails the navigator's test: without him, nobody could sail by it. So he moves it from slides to text. Each element (a capability, a step, a domain, a business object, a rule, a measure, a decision) is written once, as a short text file: a stable id, a name, a definition, an owner, its relationships, named as ArchiMate names them, its evidence (the document or the person it came from, with a date) and its status, draft or confirmed. Decisions are records, each with why. It all lives in a repository, versioned: a change is a pull request, which the owner of that part reviews (Grace for the network's, Ama for obligations), and checks on the map itself run on every change: every element has an owner, every rule a reason and a home, every measure a definition. The views are generated from it, one way, as *Meaning machines can read* showed: the ArchiMate views people read, the glossary, the conceptual model, the ontology in OWL, the checks and the heat map. Nobody edits a view; a fix goes to the map. Then agents can read it. Given a request, an agent applies the skipper's test and finds the decision, the capability and the owner, or nothing. Given a change, it walks the layers, as Tomás did for the social tariff, and lists the owners who must agree. Given a column in the catalogue, it finds the rule, the owner and the reason. It cites ids and evidence, so a person can check. The agent is itself on the map, an actor with its rights written down, like the outage agent in *Who does it, and where meaning changes*: it reads everything and drafts changes, it never confirms one, and its owner is Tomás. When the retail code changes, the agent drafts the change to the rule, with every check and view it touches; the head of retail confirms it, and a new version goes out. Next spring, a data engineer joins. Her first day, like Tomás's, brings acronyms and a list of systems, and this time a map. She asks who owns the readings data and which rules it keeps, and gets an owner, two rules and their reasons, with links; she asks Grace to confirm her first change.

**Ideas.**

- A model is living metadata: each fact once, each claim traced to its evidence with a date, each decision recorded with why (the series' insights 9 and 12).
- Ids before names: names change, ids don't, and every view and every agent cites the id.
- One map, many views, generated one way, and nobody edits a view. In ISO/IEC/IEEE 42010's terms, each view answers its readers' concerns, drawn from the same models.
- Reviewed and versioned like code: owners review their part, and checks on the map catch what's missing.
- Agents read the map to scope data work, find owners and flag impact. They draft; people confirm. The agent's own rights are on the map.
- Keep it small, owned and current: a map nobody updates is worse than none, because people trust it.
- The hand-over: *From words to data* starts here, with the meaning the map holds.

**Reference and alternatives.** The film follows ISO/IEC/IEEE 42010:2022 for what an architecture description is (stakeholders, concerns, viewpoints and views, model kinds, and the correspondences between them), and architecture as code for how to keep it: the model as text in a repository, reviewed and versioned, with architecture decision records (Michael Nygard, 2011). TOGAF's architecture repository is the idea behind it. Also worth knowing: the C4 model and Structurizr, which generate diagrams from a text model of software; Archi, with its plug-in for working together, and ArchiMate's model exchange format; knowledge graphs (RDF, OWL, SKOS) and enterprise ontologies such as ArchiMEO; data catalogues and lineage (Unity Catalog, OpenLineage); the EA tools that keep a repository (Archi, Sparx Enterprise Architect, BiZZdesign, LeanIX, Ardoq), named once, as in *Today, and where it's going*; and the standard ways agents now reach tools and data, named on the day. Where it differs: it doesn't choose a tool or a file format. It shows what any of them must keep (stable ids, owners, evidence, decisions, generated views) and what agents need from it.

**In practice.**

- Keep the map small, owned and reviewed. Start with the parts data work reads most: domains, owners, rules and measures.
- Ids before names, and never reuse an id.
- Link every claim to its evidence, with a date, so anyone can check it.
- Generate the views; never edit one. A fix goes back to the map.
- Let agents draft and find; never let one confirm. Write their rights down.
- Review the map when the organisation changes (a restructure, a new system, a new law), not only on a calendar.
- *From the author's experience:* to add.

**Tools, shown, not leading.** The map's generated views land where data people work: in dbt's YAML (descriptions, each model's owner, domain and rule ids in its meta, and the generated tests), and in Databricks' catalogue (each table's description, owner and tags, and its lineage). An agent reads the map and the catalogue together. Names and maturity are checked when scripting.

**On screen.** The wall of drafts, paper and glass, folds into lines of text, each element with its id; threads run one way from the repository to each view; an agent, a small glass actor on the map, follows the lines to an owner, a rule and a reason. The star compass, a ring of rising and setting points, around the canoe at night. The last shot: day one's empty layers, now full.

**Chapters, a first outline.**

1. *By the stars.* Hōkūleʻa, 1976: a star compass held in memory, and taught to the next navigator.
2. *Useful, so at risk.* Used every week, copied into decks, edited by one person; the navigator's test.
3. *From slides to text.* Each element once: its id, owner, definition, relationships, evidence and status.
4. *Reviewed and versioned.* A change is a pull request; owners review; checks run on the map.
5. *One map, many views.* Generated one way; nobody edits a view.
6. *An agent reads it.* A request, a change, a column: an owner, a rule and a reason, with ids.
7. *An agent on the map.* Its rights written down: it reads and drafts, and never confirms.
8. *People confirm.* The retail code changes; the agent drafts; the head of retail confirms; a new version.
9. *Day one, again.* A newcomer's first day, with a map.
10. *Still sailing.* Fifty years on, navigators taught by Mau's students.
11. *The map before the data.* The series, layer by layer; over to *From words to data*.

**Its sound** (suggested; the thread designs it). The present in E major; the Pacific night in C-sharp minor, a bowed vibraphone over low strings, with the sea; no borrowed Pacific sound (no drums, no nose flute, no slack-key guitar). The series' mark, 1-3-5-8, heard whole at the end.

**Rigour to check.** Hōkūleʻa's 1976 voyage, from the Polynesian Voyaging Society's own record: it left Honolua Bay on 1 May, sighted Mataiva after 31 days and reached Papeʻete on 4 June, where more than 17,000 people waited; Mau Piailug of Satawal navigated. His star compass is Carolinian, and the Hawaiian star compass is Nainoa Thompson's own; Nainoa navigated to Tahiti and back in 1980; and who navigates now. Check the canoe's form against the Society's photographs, and draw nothing from Pacific art. Also ISO/IEC/IEEE 42010:2022, architecture decision records, whether ArchiMate 4 has a model exchange format yet, and the names of agent interfaces on the day. *Keeping it true* already shows an agent watching a data model and drafting its changes; this film applies the same rule (agents draft, people approve, everything versioned) to the map the data model comes from, and says so.

### What carries across the last three films

Films 9 to 11 are made at the same time, so what one sets up and the next uses is fixed here.

| Set up in | Used in | What carries |
|---|---|---|
| *Day one* | 9 | The data rule card, "an estimated reading stands only until the next actual reading", and the bill of $412.80 flagged wrong |
| *Day one* | 11 | A first day of acronyms, an org chart and 140 systems, then a newcomer's first day with a map |
| *Why it moves* | 9, 10 | Principle 3, customer information stays with the business that collected it; the goal keep bills affordable |
| *How value reaches people* | 9, 10 | *Meter to cash*: read · bill · paid |
| *Who does it, and where meaning changes* | 9, 10, 11 | The wall and its agreed list; the outage agent, with its rights written down and Grace as its owner |
| *Today, and where it's going* | 10 | Plateaus and gaps, and decisions written down with why |
| *Now the questions appear* | 10, 11 | The skipper's test; households falling behind, a draft measure with the head of retail; the four data products, with accounts and bills on retail's side |
| *Rules with a home* | 10, 11 | "Once only"; the two rules split at the wall (the network replaces an estimate and sends it on, Grace's; retail corrects the bill, the head of retail's), with the stable ids film 9 gives them |
| *When strategy moves* | 11 | The social tariff and its decision record; the measure, confirmed |

People: Tomás, Grace, Farah and Ama, with the head of retail still unseen. New in these films, each drawn in its own film's source, not in `shared/src/people.js`: the analyst who wrote the script (film 9, who may stay unseen), the agency (film 10, unseen), and the newcomer and the map's agent (film 11).

### Making them

- The author approved this draft on 17 October 2026, and one thread per film started, all three at once, each following AGENTS.md from stage 2: the concept is settled here. Writing all three narrations first, as *From words to data* did (PLAYBOOK §9), keeps them in step.
- They share some files: `series.json`, the series README (generated), `films/legibility-report.md`, `PLAYBOOK.md` and the release workflow's list of films. They merge in order, 9, then 10, then 11; each brings main in before it asks for review, and re-runs `site-tools/build_series.py` rather than resolving generated pages by hand.
- Whatever one film fixes that another uses (ids, numbers, names) goes into the *Decided* table on main, where the other threads read it.

## Overlap with the other series

- ***From words to data*** starts where this series ends: with meaning, concepts and models. Film 11 hands over to it, and *Meaning machines can read* already shows the handover: Noor's architecture map as the one source of the glossary, the models, the ontology and the tests.
- ***In the weeds of data crafting*** builds the contracts and tests that films 9 and 10 say where to place: *Promises and proofs* writes the contracts and tests, *Who owns what* the domains and owners, and *Written once* gives each fact one home and generates the rest. Films 9 and 10 stay at the map: where a rule comes from, who owns it, and what a change touches.
- ***Keeping it true***, in *From words to data*, shows an agent watching a data model and drafting its changes, which people approve. Film 11 applies the same rule to the map the data model comes from.
- ***The Inner Life of Data*** shows the platform. This series shows the organisation the platform serves.

## Rigour to check when scripting

- **The openings** (see above): the chasqui's daily distance is an estimate; the dabbawalas' error rate is often quoted as "six sigma", a claim from press coverage rather than a formal study, so say "almost no errors"; Japan's converter capacity in 2011 was about 1 GW; the Kerala findings are from Robert Jensen's study (2007); Estonia's once-only principle is in law; M-Pesa's adoption figures vary by survey; Hōkūleʻa's 1976 voyage and Mau Piailug's role are well documented by the Polynesian Voyaging Society.

- **Current versions of the standards** (checked on 17 October 2026): the TOGAF Standard, 10th Edition (its 2025 update); ArchiMate 4 (April 2026); SBVR 1.5 (December 2019); DMN 1.5 (2024); the Open Data Contract Standard 3.1 (December 2025); BIZBOK; the APQC framework (and its utilities edition); DAMA-DMBOK; ISO/IEC/IEEE 42010:2022; and the IEC Common Information Model (IEC 61968, 61970 and 62325, with 61968-9, for meter readings, in its third edition of 2024).
- **ArchiMate 4.** Films 1 to 8 draw ArchiMate 3.2's notation (October 2022); films 9 to 11 use ArchiMate 4, published in April 2026, without saying what changed (17 October). Version 4 says it keeps users' models compatible. It cuts the concepts from 60 to 42, calls the layers domains, merges behaviour into one common domain, makes a contract a kind of business object, a constraint a kind of requirement and a gap an assessment of the difference between two plateaus, and lets a relationship say how many sit at each end. The learning modules teach these changes and evaluate some. The series keeps "layers" for its own six, and "domain" for a part of the organisation with its own meaning, as in *Who does it, and where meaning changes*. *Meaning machines can read* cites 3.2 too.
- **Ring-fencing and unbundling** differ by jurisdiction. Keep it to "in many markets", and keep the rule generic.
- **Reliability measures** (SAIDI, SAIFI): use their standard definitions if named.
- **The canvases** are Strategyzer's; credit them.
- **Public-sector governance** (statements of expectations, ministerial directions, dividends) differs by country. Keep it generic and plausible.
- **Tool names** are checked when published.

## Questions for films 9 to 11

Asked on 17 October 2026, with the draft above, and answered the same day.

1. **The three stories, as drafted.** Approved.
2. **ArchiMate 4.** Answered: films 9 to 11 use ArchiMate 4 as the standard and don't say what changed; the changes go into the learning modules, which also evaluate some of them. (The draft had recommended keeping the drawing of films 1 to 8.)
3. **Film 11's last scene.** Approved as recommended: a newcomer's first day next spring, with today's tools, so the series ends where it began. The plan of 7 October ended in an imagined near future instead.
4. **Your experience,** for each film's practice notes: rules you've seen work or fail, a strategy change that reached the data, a map that went stale. Not answered yet; each film's thread can ask again.

## Still open

1. **The series title:** still the working title, *The map before the data* (7 October).
2. **Learning and evaluation:** one set for the whole series, started on 17 October in its own thread. Which engine is still open; *From words to data*'s would fit. Candidate labs: sort clues into layers, fill a canvas from an annual report, correct a capability map, trace a rule to its home, walk a change through the layers, and what ArchiMate 4 changed.
3. **The author's experience** for films 9 to 11 (question 4 above).

## Next checkpoints

1. Films 9, 10 and 11, one thread each, merged in order: 9, 10, then 11, each once the author approves its review page.
2. The interactive learning and evaluation for the whole series, in its own thread.
