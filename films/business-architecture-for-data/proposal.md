# Business architecture for data

*Proposal for the first of four new series in the topic Enterprise architecture, after* The map before the data: *Business architecture for data*, *Data architecture*, *Platform and solution architecture* and *AI and continuous architecture*. *Drafted on 11 November 2026 from the author's review in the project thread that day. This file holds what the four series share (the brief, the world, the rules, the stories, the data practice on the map) and this series' own plan; each of the other three keeps its own in its folder. Status: proposed; no script is written until the author confirms it (AGENTS.md, stage 1).*

## Decided

<!-- decided: made by site-tools/build_series.py from decided.md, the series' and each film's -->
| Date | Decision |
|---|---|
| 11 November 2026 | Four new series join the topic *Enterprise architecture* after *The map before the data*, in this order: *Business architecture for data* (5 films), *Data architecture* (6), *Platform and solution architecture* (8) and *AI and continuous architecture* (6), in `films/business-architecture-for-data/`, `films/data-architecture/`, `films/platform-and-solution-architecture/` and `films/ai-and-continuous-architecture/`. Titles approved by the author; no other architecture series. |
| 11 November 2026 | Every series starts from the enterprise architecture map: its opening film opens on Tomás's map from *The map before the data* and shows where its architecture sits; each series page states its prerequisites. |
| 11 November 2026 | The world is *The map before the data*'s energy utility, with Tomás and its owners; two new people, assumptions for the author: Inés Duarte, data architect, and Ravi Menon, platform lead. The look is that series', from `films/enterprise-architecture/shared/`. |
| 11 November 2026 | One true story per series, told across its films, not one per film; each film opens on its part of it, in the four beats, and comes back to it. From outside the West: the qanats of Iran (business), Project Cybersyn in Chile (data), Japan's Gokaidō (platform); the ziggurat of Babylon, with the Tower of Babel told as the story it inspired (AI and continuous architecture). Each series' last film says what its story didn't achieve and why a practice has to keep maturing. |
| 11 November 2026 | "Data architecture", DAMA's term, not "information architecture", in titles and narration; the three meanings of "information architecture" are told once as an example of the confusion, and web navigation is out of scope. The six layers keep "information" for their fourth layer. |
| 11 November 2026 | The data practice on the map is embedded: every film of the first three series ends with a short piece adding its layer's data components (a data product as a product with its contract, owners as roles, glossary terms as business objects; data objects; interfaces, services, components and artifacts), building to one consolidated view in the platform series' last film, with a lab, *Model the data practice*. *The map before the data* is not re-cut. |
| 11 November 2026 | No draft label on these films: the author discussed them in detail before any was made. |
| 11 November 2026 | Processes: ArchiMate keeps the high-level processes; BPMN describes the detail from level 3 down. Levels follow APQC in four bands (strategic, operational, support, evaluation), breadth first and depth on pain, a SIPOC for each level-2 process, as the author's own method does. |
| 11 November 2026 | Industry reference models are taught in *What the business needs to know*: for energy, the IEC Common Information Model, IEC 61968-1's interface reference model, the Smart Grid Architecture Model and the Harmonised Electricity Market Role Model; others named once (HERM, BIAN, TM Forum, ACORD, HL7 FHIR, APQC). Seed from one, name it, and confirm each element with the business. |
| 11 November 2026 | The author's past work, a 2023 talk on enterprise data and an architecture repository for a university's data platform, is input to the four series, not his view today; *From the author's past engagements* in this proposal says which film takes what. The films never name the organisations. |
| 11 November 2026 | The business glossary is grouped by business domain, and by data domain for the definitions several business domains share, so owners are easy to find and allocate within their scope (the author). |
<!-- /decided -->

## The brief

The author, on 11 November 2026, in his words:

- "We need to include in the enterprise architecture another series for business architecture, information or data architecture and another one for platform/solutions architecture."
- "The business architecture is covered somehow already in the enterprise architecture series so we might need to state that clearly as a requirement for information architecture, and explain the difference between information and data according to DAMA."
- "I think it's good to start the series always with enterprise architecture context again."
- "We need to then add a series for business architecture to represent more clearly the business owned data elements. Processes might be relevant as context as well, but we need to state we focus on the relevant aspects for data."
- "For processes, yes, ArchiMate generally keeps the high level processes and BPMN will describe the process details after level 3."
- "I would like to choose one single story per series, instead of a story per film as it can get overwhelming having so many stories, but we could relate to the story elements in each film."
- "For the stories, I definitely want other non Western stories, Middle East and Far East or South America."
- "I've always found useful the definition of the data practice as a business, meaning we model data products, data contracts, interfaces, business glossaries, domains, information assets and all the relevant data components in business layers as business objects, products, etc. It would be great to provide that navigation map … as a piece we introduce at the end of each layer until we have a consolidated view."
- "I want the data practice map embedded."
- "I'm happy to be challenged": data modellers and data experts review his content, so every claim is checked against its sources and corrected where it's off (*Checked claims*, below).

## The four series

| Order | Series | Films | What it adds to the map |
|---|---|---|---|
| 1 | *The map before the data* (on the site) | 11 | The whole organisation, layer by layer, for a newcomer |
| 2 | **Business architecture for data** | 5 | What the business owns about its data: concepts, owners, processes as context, rules and expectations |
| 3 | **Data architecture** (`../data-architecture/proposal.md`) | 6 | Where data lives, how it travels, who owns which, and one language for it |
| 4 | **Platform and solution architecture** (`../platform-and-solution-architecture/proposal.md`) | 8 | The data platform as a platform, its parts, how it meets the applications, security, and one solution on it |
| 5 | **AI and continuous architecture** (`../ai-and-continuous-architecture/proposal.md`) | 6 | Agents and AI services on the map, AI in the architecture practice, and architecture kept alive as a continuous capability: the topic's closing remarks |

No other architecture series (the author, 11 November 2026).

## What the four series share

- **They start from the enterprise architecture map.** The opening film of each series opens on Tomás's map from *The map before the data*, shows where its own architecture sits in the layers and what it takes from the layers above. Each series page states its prerequisites.
- **The world** is *The map before the data*'s fictional energy utility, owned by a regional government, with Tomás Herrera (enterprise architect) and the owners viewers already know (Grace, Farah, Ama). Two new people, assumptions for the author: **Inés Duarte**, data architect, who leads *Data architecture*, and **Ravi Menon**, platform lead, who leads *Platform and solution architecture*. Its industry reference models are named in *What the business needs to know*.
- **The look** is *The map before the data*'s: paper drafts on a wall, the confirmed model in glass, the six layers in their colours (`films/enterprise-architecture/shared/`). Each series gets its own sound palette; each film its own, within it.
- **One true story per series**, told across its films (below), not one story per film.
- **The data practice on the map**, a closing piece in every film, building to one consolidated view and a lab (below).
- **No draft label:** the author discussed them in detail before any film (11 November 2026).
- **Words:** "data architecture", not "information architecture"; *Data architecture*'s opening film tells the term's three meanings as the example of the confusion. The six layers keep the name "information" for their fourth layer, and the films say once that it's the layer DAMA's data architecture works in.

## One story per series

Each series follows one true story from outside the West. The opening film sets its scenario; each film opens on the part of the story that holds its idea, with the four beats of AGENTS.md said outright, and comes back to it at the close. Each story is told in the series' own drawing style, never in the style of its culture's art, and checked against sources from its own culture before any script. Each series' last film says honestly what the story didn't achieve, and why a practice has to keep maturing and improving rather than being built once (the author, 11 November 2026).

| Series | Story | Where and when |
|---|---|---|
| Business architecture for data | **The qanats**: underground channels that carry water to desert villages; the shareholders own the water, in shares of time; a water master, the *mirab*, keeps the turns; the diggers, the *muqannis*, build and repair the channel and own none of the water | Iran; over two thousand years, still running; eleven listed by UNESCO as *The Persian Qanat* in 2016 |
| Data architecture | **Project Cybersyn**: factories linked to Santiago by telex, a few agreed numbers sent each day, software that flagged only what was out of line, and each factory left to solve its own problems | Chile, 1971 to 1973 |
| Platform and solution architecture | **The Gokaidō**: five roads organised from Edo, with post stations, horses and porters, and checkpoints, shared by every domain, merchant and pilgrim | Japan, 1601 to the railway of the 1870s and 1880s |
| AI and continuous architecture | **The ziggurat of Babylon**, Etemenanki: rebuilt by kings over centuries with workers from many peoples, damaged when it stopped being kept, its rubble cleared by Alexander for a rebuild he didn't live to start; the Tower of Babel told plainly as the story it likely inspired, of builders who stop understanding each other (to check against sources from the region) | Iraq; restored under Nabopolassar and Nebuchadnezzar II (about 600 BCE), cleared about 323 BCE |

Checked on 11 November 2026, with the corrections already made:

- **Qanats:** UNESCO's *The Persian Qanat* (2016): eleven qanats chosen from over 37,000; water distributed "according to specific cycles by the qanat council manager (mirab)", "traditionally using a water clock". Share units vary by region: the films tell one village, as illustrative.
- **Cybersyn:** the telex network, from about 400 unused telex machines, was the part used regularly; daily indicators; software that flagged anomalies; used to coordinate trucks in the October 1972 strike. Its results were small: by May 1973 it reached about a quarter of the nationalised industries (Eden Medina, *Cybernetic Revolutionaries*, MIT Press, 2011), with some twenty factories fully modelled, and it never ran as designed. The films say so, and tell its end, the coup of September 1973, in one neutral line.
- **Gokaidō:** the roads were organised on older routes, not built new; in 1601 each Tōkaidō station had to keep 36 horses for official messengers, and others paid set prices; checkpoints such as Hakone and Arai checked travel passes; the 1872 railway ran Shimbashi to Yokohama, and the Tōkaidō Main Line (finished 1889) followed the old road's corridor. Still to confirm: how stations checked an official's permit before giving horses, which the security film needs.

## The data practice on the map

The author's idea: run the data practice as a business, and model it like one. Data products, data contracts, interfaces, glossaries, domains and information assets are drawn as elements on the enterprise map, so the data practice can be navigated like any other part of the organisation. Every film of the first three series ends with a short piece, *The data practice on the map*, adding its layer's data components, until the last film of *Platform and solution architecture* shows the consolidated view.

| Where | Layer | What it adds |
|---|---|---|
| *Business architecture for data* | Business | A data product as an ArchiMate **product**, aggregating its services and its **contract**; data domains and their owners (business actors and roles); glossary terms and information assets (**business objects**); the data team's services and processes |
| *Data architecture* | Information | Data objects realising those business objects; data domains as level 1 of the data objects; flows between them; classification and lifecycle |
| *Platform and solution architecture* | Application and technology | A data product's ports as **application interfaces**, its services as **application services**; pipelines and models as application components or functions; tables and files as **artifacts**; the platform's technology services |
| Its last film | All | One data product followed from its business owner to its files, every element traceable up and down |

The business view stays on top and the elements that realise it stay in their own layers, joined by realisation: drawing a product's ports, pipelines and tables as business objects would cut the line an architect follows to answer "what breaks if this table changes?". *Services with customers* (Data management) already runs a data team's services as a business; this gives the element-by-element model it stops short of, and links to it. *The map before the data* stays as it is.

**The lab, *Model the data practice*:** cards for a data product, its contract, an output port, a glossary term, a domain owner, a pipeline, a table and a dashboard, each placed as an ArchiMate element in its layer, then joined. The lab says why each choice is right or wrong ("an output port is an application interface; the product aggregates the service it exposes"). It uses *The map before the data*'s lab engine (`site/assets/enterprise-architecture/learn.js`), checked against the author's own ArchiMate-based method.

## From the author's past engagements

The author shared two pieces of his own past work on 11 November 2026, "additional insights and not necessarily my view today, as that is changing constantly". The films use them as inputs, in the utility's world, and never name the organisations they came from.

- **A talk on enterprise data (2023):** the enterprise architecture domains, DIKW, why managing data is hard, the data lifecycle, the artifacts of a data practice and the teams that run a platform.
- **An architecture repository for a university's central data platform:** the platform modelled in six layers (business design, strategy, business, information, application, technology) as markdown in git, with viewpoints, decisions, business rules and agent roles, kept true by checks and by reading the running estate.

| What they say | Where it goes |
|---|---|
| Ask of each capability: who the experts are, what its key data elements are, who could own them and which could be master data. Data management is itself a business capability, with governance under it | *What the business owns*; *Who creates it, who owns it* |
| A glossary is grouped by business domain, and by data domain for the definitions several business domains share, so each term's owner is easy to find and its scope is clear; the owner matters before the tool, and a table is enough to start. Data assets are linked to glossary terms, joining the business's model to the physical one | *What the business needs to know*; *One language, kept* |
| A policy is carried out by processes, processes by procedures, and procedures make and keep the artifacts, as ISO 9000 does | *Rules and expectations the business owns* |
| A source system is accountable for its own data quality; the platform reads sources and never writes to them, and builds a quality rule only when the source can't | *Rules and expectations the business owns*; *Where each fact is born* |
| DIKW's levels, defined with an example, then "not as simple as that" | *The pyramid, taken apart* |
| Data made at different times, by different people, with different processes and tools; extract, transform and load is a technical answer, not a business-driven one | *Between the business and the systems* |
| Source data enters only under an agreement its owner approved, which classifies every object and names the roles that may see the sensitive fields; sensitive data with no named role isn't taken in | *How it travels*; *Security all the way through* |
| A published data product has an owner, documentation, lineage, a contract and an approved way to get access | *Who owns which data*; the data practice map |
| Data is taken on centrally only when it has value across domains; anything else goes to a local solution. The platform stays one model until a part of it has its own consumers, its own economics and its own approver | *An application or a platform?*; *One platform, or many* |
| The platform as a service line: who it serves, what hurts them, what it offers and how it's paid for (a value proposition and business model canvas) | *An application or a platform?*; *A road people choose* |
| Domain teams, a central data platform team and an infrastructure team, after *Team Topologies* | *Inside the platform*; *A road people choose* |
| Security is a viewpoint, not a technology slice: the chain runs from the source owner's agreement through classification, grants and masking to the person who sees the data, and most of the security team's questions are answered outside the technology layer | *Security all the way through* |
| A test for where a statement belongs: if it changes, how many repositories change with it? One, and it belongs in that repository; several, and it belongs in the architecture | *One solution, end to end* |
| A paved path is faster: a source on an approved pattern takes weeks less than one needing a new pattern | *A road people choose* |
| Start small: a pilot in under two months, then a project, then a programme | *Built to change* |
| Business and data facts are agreed before anything is built; the person who asked confirms a preview, and the merge records it | *Every change, checked* |
| An agent works in roles of its own, never a person's; each task of a written-down process states how far it may go (inform, draft, verify, run), set by the process owner; it acts under its own identity, one per access profile, and never approves | *Agents on the map* |
| A language model sees only official, non-sensitive data products, kept in a place of their own: the boundary is architectural, not a mask | *What an agent may read* |
| The model is read again from the estate (sources, pipelines, the cloud), by skills that repeat the reading: "the code shows intent; only the environment shows fact" | *Every change, checked* |

**Where the films differ.** The repository calls a reference-data table synchronised into the lakehouse "read in place"; the films say the platform keeps a copy there (AGENTS.md, *Known faults*). Data shared by another organisation and queried where it lives is read in place, and the films say so.

## Checked claims

The author asked to be challenged. What the series say, and why:

1. **DAMA on data and information.** DAMA-DMBOK2 doesn't say there's no difference: it criticises the DIKW pyramid for treating them as separate things ("data is a form of information and information is a form of data") and then uses the two words interchangeably. Its knowledge area is called *Data Architecture*.
2. **"Information architecture" means at least three things:** how a website's content is organised (Wurman, 1976; Rosenfeld and Morville, 1998), an enterprise's information and how it flows (Zachman, 1987; Information Engineering), and TOGAF's and DAMA's data architecture. Web navigation is out of scope, said once.
3. **TOGAF and ArchiMate.** TOGAF names data architecture as one of its four domains, with its own Phase C deliverables, but groups it with applications as *Information Systems Architectures*. ArchiMate splits it: a business object in the business layer, a data object in the application layer, no information layer. *The map before the data*'s six layers draw an information layer by convention, as many practitioners do (its proposal's insight 5 now says so).
4. **Why data architecture is its own architecture:** data outlives the applications that hold it; one concept is used by many applications; meaning belongs to the business and storage to the systems, and someone has to own the join; DAMA makes it a discipline with its own deliverables.
5. **Business architecture holds the information map** (BIZBOK): the concepts behind each capability belong to the business; this series draws them, and *Data architecture* starts from them.
6. **Application or platform:** in *Platform and solution architecture*'s proposal, with the author's corrections.

## This series: *Business architecture for data*

**Why a series of its own.** *The map before the data* is a newcomer's tour of the whole map and reaches data in its last four films. This series stays in the business layer and draws what the business owns about its data. Business architecture is much wider (products, partners, finance, organisation design); the films take only what matters for data, and say so in the opening film.

**Reference and alternatives.**

- **Follows:** the BIZBOK Guide (capability, value stream and information mapping, and the cross-mappings between them).
- **Processes:** the APQC Process Classification Framework's levels and the ISO 9001 process approach.
- **Notation:** ArchiMate 4 keeps the high-level processes (levels 1 and 2, and where a level-3 process sits on the map); BPMN 2.0 describes the detail from level 3 down (the author, 11 November 2026).
- **Industry reference models:** for energy, the IEC Common Information Model (IEC 61968, 61970 and 62325), IEC 61968-1's interface reference model (the business functions of a distribution utility, a ready capability list), the Smart Grid Architecture Model (CEN-CENELEC-ETSI) and the Harmonised Electricity Market Role Model (ENTSO-E, ebIX and EFET). Named once for other industries: HERM (CAUDIT, higher education), BIAN (banking), TM Forum (telecoms), ACORD (insurance), HL7 FHIR (health data), APQC (across industries).
- **Worth knowing:** TOGAF Phase B; SBVR and DMN for rules and decisions; DAMA-DMBOK2 for ownership and stewardship; domain-driven design for language at a domain's edge.
- **Where it differs:** it follows BIZBOK's maps but goes only as deep as data needs, and every element ends with an owner confirmed by the business.

**How processes are drawn** (the author's own method, checked 11 November 2026):

- Level 1 in four bands: strategic, operational, support and evaluation. The bands classify; they aren't elements. The value stream fills only the operational band, and an empty band is a finding.
- Levels follow APQC: level 1, a macro process (8 to 15 for a whole organisation); level 2, a process with a trigger, an output and one accountable role (3 to 8 per macro process); level 3, its activities, as a flow; level 4, a task, kept out of the model.
- Breadth first, depth on pain: levels 1 and 2 complete; level 3 only where a named pain justifies it, and the map says which branches weren't detailed.
- Each level-2 process is a SIPOC: supplier, input, process, output, customer, with purpose, trigger and owner.
- Processes are verbs, capabilities nouns. Data objects are levelled the same way: domains and owners first, then objects with owner, classification and where each is mastered; never a schema at this level.
- Seed from a reference model, name it, and mark every element unconfirmed until the business confirms it.

**Insights.**

| # | Insight | From |
|---|---|---|
| 1 | The business owns what its data means, who creates it, the rules on it and the quality it needs; the data team owns how it's stored, moved and checked. | BIZBOK; DAMA-DMBOK2 |
| 2 | Never start from a blank page: an industry reference model gives the first draft, confirmed element by element. | IEC CIM; IEC 61968-1; SGAM; the author's practice |
| 3 | Concepts come from capabilities: each capability needs, creates or changes some information. | BIZBOK information map |
| 4 | A concept's owner is the owner of the capability that creates it. | TOGAF matrices; Information Engineering |
| 5 | Processes go only as deep as data needs: levels 1 and 2 everywhere, level 3 where it hurts. | APQC; ISO 9001; the author's method |
| 6 | Quality expectations come from the process and its customer; the business sets the threshold, the data team builds the check. | DAMA-DMBOK2; *Rules with a home* |

**In practice.** Start from what already hurts, not a catalogue of everything. Draw the concepts with the business, in their words. Seed from the industry's reference model and confirm every element; a reference model presented as the organisation's own is a known mistake. Owners are found by capability, not by system. Rules and expectations start in the glossary or a data contract, and the code is built from them (PLAYBOOK §3).

**Films.**

| # | Working title | What it teaches | The qanats | The utility |
|---|---|---|---|---|
| 1 | **What the business owns** | Starts on Tomás's map. BIZBOK's parts and the ones that matter for data. What the business owns, what the data team owns; the scope said outright | Who owns what: shareholders own the water and its rules; the muqannis keep the channel. The data team is the muqanni | A request for "all customers" gets three answers, each right about its own meaning; the meaning was never the data team's to decide |
| 2 | **What the business needs to know** | Industry reference models; information concepts from capabilities; business objects in the business's words; one definition per domain; the glossary drawn from the map | A "share" has to mean the same to everyone before anyone counts it: water measured as time, in turns, taken from common practice and made the village's own | The capability map from *What it must be able to do*, seeded from IEC 61968-1 and CIM, now with its concepts; one capability needs a concept nobody holds |
| 3 | **Who creates it, who owns it** | The capability × concept matrix (creates, reads, updates, deletes); owners and stewards; the owner is always the business, hard to find where metadata is scarce | Shares held, inherited and sold by named owners; the mirab is the steward, not the owner | Two capabilities both "create" the customer; the business decides which one does, and who owns it |
| 4 | **Processes, as deep as data needs** | The four bands, APQC's levels, breadth first and depth on pain, a SIPOC per level-2 process naming its business objects, where data is born; ArchiMate for the map, BPMN from level 3 | The rotation: a cycle of days, each owner's turn within it, timed with a water clock, mapped as deep as it takes to settle disputes | Meter to cash from *How value reaches people*, with what each step reads and writes; only one branch reaches level 3, where the complaints are |
| 5 | **Rules and expectations the business owns** | Business rules and data rules (film 9's split), policies, decisions; quality expectations from the process's service levels; the business sets them, the data team builds the checks; why the practice keeps maturing | The rules everyone keeps: who repairs the channel, what happens in a dry year; a qanat nobody maintains silts up and dies, and many have | A late reading is "wrong" only against its step's service level; the owner writes it down and the check follows |

**Overlap.** It deepens *What it must be able to do*, *How value reaches people*, *Who does it, and where meaning changes* and *Rules with a home*, naming each and not retelling their stories.

## Sources (checked 11 November 2026)

- DAMA International, *DAMA-DMBOK*, 2nd edition, revised (2024); its wording on data and information quoted via [DAMA Finland](https://damafinland.fi/?p=922) and [Data Crossroads](https://datacrossroads.nl/2024/12/24/data-vs-information-foundations-of-the-debate/), to check against the book; [DMBOK 3.0](https://dama.org/dama-dmbok-3-0-project/) is in progress.
- The Open Group, TOGAF Standard, 10th Edition; ArchiMate 4 (April 2026). Business Architecture Guild, BIZBOK Guide. APQC Process Classification Framework. OMG, BPMN 2.0.
- J. A. Zachman, "A Framework for Information Systems Architecture", *IBM Systems Journal*, 1987; L. Rosenfeld and P. Morville, *Information Architecture for the World Wide Web*, 1998.
- IEC 61968-1 (interface reference model), IEC TR 62357-1 (TC 57 reference architecture); CEN-CENELEC-ETSI Smart Grid Coordination Group, SGAM (2012); ENTSO-E, ebIX and EFET, Harmonised Electricity Market Role Model.
- [UNESCO, *The Persian Qanat*](https://whc.unesco.org/en/list/1506) and its [nomination file](https://whc.unesco.org/document/152821); E. Medina, *Cybernetic Revolutionaries*, MIT Press, 2011; [nippon.com, *The Tōkaidō*](https://www.nippon.com/en/japan-topics/g02415/).
