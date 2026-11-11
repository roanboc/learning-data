# Data architecture

*Proposal for the second of four new series in the topic Enterprise architecture, drafted on 11 November 2026 from the author's review that day. What the four series share (the brief, the world, the rules, the stories and the data practice on the map) is in [`../business-architecture-for-data/proposal.md`](../business-architecture-for-data/proposal.md); this file holds this series' own plan. Status: proposed; no script is written until the author confirms it.*

## Decided

<!-- decided: made by site-tools/build_series.py from decided.md, the series' and each film's -->
| Date | Decision |
|---|---|
| 11 November 2026 | *Data architecture* is six films: *Between the business and the systems*, *The pyramid, taken apart*, *Where each fact is born*, *How it travels*, *Who owns which data* and *One language, kept*. It follows DAMA-DMBOK2's Data Architecture; its prerequisites are *The map before the data* and *Business architecture for data*. Inés Duarte, data architect, leads it. |
| 11 November 2026 | DAMA, said precisely: DMBOK2 knows the distinction between data and information, criticises the DIKW pyramid for separating them and uses the words interchangeably. TOGAF names data architecture as its own domain but groups it with applications; ArchiMate splits it between business object and data object. The series says why data architecture is an architecture of its own. |
| 11 November 2026 | *The pyramid, taken apart* takes the DIKW pyramid apart: what it gets right (context; people decide), what's wrong (a one-way factory; no raw data; separate levels; a vague top), with the arrows drawn both ways. |
| 11 November 2026 | Its story is Project Cybersyn (Chile, 1971 to 1973), told as an architecture, with its small reach and its end in one neutral line. |
<!-- /decided -->

## The brief

The author, on 11 November 2026: explain "the difference between information and data according to DAMA, which is none in the end but has some history"; information architects were "recognised more in the webpage navigation space, which is not in the scope"; "this actually illustrates quite funnily how the same data concepts have had noise where multiple people think of different things when referring to information architecture, but we follow DAMA"; "explain the pyramid of data, information, knowledge, wisdom … to show what's fine and wrong about it, and why we treat information architecture as a separate architecture, which is something TOGAF and ArchiMate don't separate clearly"; "I also agree with the suggestions for data architecture instead of information architecture."

**Prerequisites, stated on the series page:** *The map before the data* and *Business architecture for data*. Its opening film recaps them in a minute.

## Reference and alternatives

- **Follows:** DAMA-DMBOK2, Data Architecture, with Data Modelling and Design, Metadata, and Data Integration and Interoperability as neighbours.
- **Also uses:** TOGAF 10 Phase C (data entities, the data entity / business function matrix, data lifecycle diagrams); ArchiMate 4 (business object, data object, artifact); BIZBOK's information map, from *Business architecture for data*; the IEC Common Information Model for the industry's words.
- **Worth knowing:** Zachman's "What" column; Information Engineering; domain-driven design (bounded contexts); data mesh (domain ownership, data as a product); ISO/IEC 11179 (metadata registries). Kimball, Inmon and Data Vault are left to *From words to data*.
- **Where it differs:** data architecture is taught as decisions with owners, kept in the map repository and updated with every change, not as a model drawn once.

## What the films say about the terms

- **DAMA:** DMBOK2 knows the classic distinction, criticises the DIKW pyramid for treating data and information as separate ("data is a form of information and information is a form of data") and uses the words interchangeably. So: one discipline, called data architecture.
- **Three meanings of "information architecture":** a website's organisation and labels (Wurman, 1976; Rosenfeld and Morville, 1998; out of scope), an enterprise's information and its flows (Zachman, 1987; Information Engineering), and TOGAF's and DAMA's data architecture.
- **TOGAF and ArchiMate:** TOGAF names data architecture as its own domain, with its own deliverables, but groups it with applications as *Information Systems Architectures*; ArchiMate puts a business object in the business layer and a data object in the application layer, with no information layer.
- **Why it's an architecture of its own:** data outlives applications; one concept serves many applications; meaning is the business's and storage the systems', and someone has to own the join; DAMA makes it a discipline.
- **The pyramid (DIKW):** from T. S. Eliot (1934), Cleveland (1982), Zeleny (1987) and Ackoff (1989); no single inventor is claimed. Right: data needs context, and people turn it into decisions. Wrong: it's drawn as a one-way factory, when concepts and questions come first and decide what's recorded (Frické, 2009); "raw data" doesn't exist (Gitelman, 2013); the levels aren't separate things (DMBOK2); the top is vague (Rowley, 2007). The films draw the arrows both ways.

## Insights

| # | Insight | From |
|---|---|---|
| 1 | Data and information are one discipline; the business speaks of concepts, systems hold records. It's an architecture of its own because data outlives applications and one concept serves many. | DMBOK2; TOGAF; ArchiMate |
| 2 | The pyramid is half right: data needs context, but concepts and questions come first. | Ackoff; Frické; DMBOK2 |
| 3 | Each fact has one place it's born and one owner; every copy traces back to it. | DMBOK2; master data practice |
| 4 | How data travels between domains is part of the architecture: what crosses, by which pattern, under which contract. | DMBOK2; TOGAF |
| 5 | Who owns which data is a decision: domains own their data products and their meaning; warehouse, lakehouse, mesh and fabric are styles. | DMBOK2; data mesh |
| 6 | Standards (names, reference models, principles, decisions) keep many teams speaking one language. | DMBOK2 metadata; ISO/IEC 11179; decision records |

## In practice

Start from the questions that hurt, not an enterprise data model of everything. A capability × concept matrix finds the two systems that both think they create the customer. Name each fact's home before anyone copies it. Keep the data architecture in the same repository as the enterprise map, and review every change against it; a data architect who only draws and never reviews a change has no architecture.

## Films

Project Cybersyn (Chile, 1971 to 1973) runs through the series; the last film says honestly how little of it was built and why a practice has to keep maturing.

| # | Working title | What it teaches | Cybersyn | The utility |
|---|---|---|---|---|
| 1 | **Between the business and the systems** | Starts on Tomás's map; what business architecture gave; the three meanings of "information architecture"; DAMA's data architecture; why it's an architecture of its own | Before any computer, the team walked each factory and drew how it worked, then chose what to measure | Three people say "information architecture" and mean a website menu, a data model and a TOGAF phase; Inés writes down which one this team means, then shows "connection point" as one business object and six data objects, with nobody owning the line between |
| 2 | **The pyramid, taken apart** | DIKW: where it comes from, what it gets right, what's wrong; arrows both ways | Thousands of numbers were possible; a few indicators per factory were chosen, and the software passed on only what changed | The outage measure from *Now the questions appear* exists only because someone first decided what an "interruption" is |
| 3 | **Where each fact is born** | Systems of record and authoritative sources; one owner per fact; copies traced by lineage; hand-off to the master data series | Each factory reported its own production, once a day, at the source | The connection point is born in network and copied into retail, billing and outages; Inés names its home |
| 4 | **How it travels** | Data flows between domains: what crosses each edge, in which pattern, under which contract; hand-off to *Data that moves* | The telex network: agreed forms, a daily rhythm, one route to the centre; in the October 1972 strike it carried messages to keep goods moving | The replaced reading from *Rules with a home* crosses the wall between network and retail; its flow, contract and pattern are drawn |
| 5 | **Who owns which data** | Domain ownership, data as a product, styles (warehouse, lakehouse, mesh, fabric), the target and its gaps; where platforms run is the platform series' *One platform, or many* | Beer's viable system model: each factory solved its own problems; the centre stepped in only when one wasn't solved in time | Domains own their data products; one catalogue says what exists; the gaps go into the roadmap |
| 6 | **One language, kept** | Naming, reference models (the CIM), principles, decision records; the data architecture kept in the map repository and reviewed with every change; why it keeps maturing | The same indicators, defined once, across factories; but it reached about a quarter of the nationalised industries in under two years and never ran as designed: the ideas held, the practice never had time to mature | A new product team names "customer" a fourth way; the review catches it from the repository before it reaches a table |

## Overlap

*Rules with a home* (rules and business objects; not retold); *From words to data* (conceptual, logical and physical models: this series stops at the concepts and hands over); *The same one, everywhere* (master data); *Data that moves* (integration mechanics); *Architecture that keeps up* (the map in a repository). Each film says where to go next.

## Sources (checked 11 November 2026)

- DAMA-DMBOK2 (revised, 2024), chapters 1 and 4; TOGAF 10, Phase C; ArchiMate 4.
- R. L. Ackoff, "From data to wisdom", *Journal of Applied Systems Analysis*, 1989; M. Frické, "The knowledge pyramid: a critique of the DIKW hierarchy", *Journal of Information Science*, 2009; J. Rowley, "The wisdom hierarchy", *Journal of Information Science*, 2007; L. Gitelman (ed.), *"Raw Data" Is an Oxymoron*, MIT Press, 2013.
- E. Medina, *Cybernetic Revolutionaries: Technology and Politics in Allende's Chile*, MIT Press, 2011.
