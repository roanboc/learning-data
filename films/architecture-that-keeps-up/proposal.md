# Architecture that keeps up

*Proposal for the third series of the module Data management: three films on the product owner's side of the job, borrowed from architecture. Planned on 10 November 2026 from the author's advice for technical managers and the module's plan, [`../a-plan-in-ninety-days/proposal.md`](../a-plan-in-ninety-days/proposal.md), which holds the reference, the world, the people, the look and the sound the series share; this file holds what is this series' own. Status: set up, on assumptions the author reviews later; the films are being made, one at a time, each marked draft on the site.*

## Decided

<!-- decided: made by site-tools/build_series.py from decided.md, the series' and each film's -->
| Date | Decision |
|---|---|
| 10 November 2026 | *Architecture that keeps up* (*Una arquitectura al día*), the third series of *Data management*, is three films: *Services with customers*, *One map, in the repo* and *A path for every provider*, in `films/architecture-that-keeps-up/`, at `architecture-that-keeps-up/` on the site, with its page once its opening film is out; its cards say "Film N of 3". *Making the case* comes before it, *Small steps, measured* after, so *Strategy is a habit* still closes the module. Made from the author's advice for technical managers of 10 November 2026 ("Product owners benefit from architectural background"); its place, its films and its openings are assumptions for the author to review. The module's plan, rules, world and look are in `films/a-plan-in-ninety-days/proposal.md`; the kit is the leading data people module's, `films/the-new-skills/shared/`, bundled as it is. |
| 10 November 2026 | Standards first: the films teach ArchiMate's layers and exchange format, and diagrams kept as text (Mermaid, draw.io), in a git repository. The author's own tool, ArChreator, built on ArchiMate for his enterprise architecture design, is named here as his example of building what's relevant to you on a standard; the films name no product as their subject, so it isn't shown or said on screen. |
<!-- /decided -->

## The brief

The author, on 10 November 2026, on technical managers, who he sees as both product owners and people leaders: "Product owners benefit from architectural background." In his words:

- "Treat the services you manage as an independent business with suppliers and customers. Start with refining the definition of those services and then identifying your customers (segments), their pains and business drivers; from there refine and traverse all the architectural layers (strategy, business, information, application and technology)."
- "Borrow from architecture: Visualization everywhere is key, always think of visualisations supporting your documentation and communications."
- "Make sure you have a proper git repo for the enterprise architecture view of your platform, so all initiatives and changes are tracked, and agents can help with ideation, information structure (even diagrams in mermaid and drawio). Every other documentation in wikis, videos and presentations comes from there. Remember, a single source of truth! I created ArChreator on top of Archimate to support my enterprise architecture design, you can build your own with what's relevant to you, but consider standards first."
- "Architecture must be agile, every time you are updating your current and target state. Don't wait for funding or external projects to do it or you will always end up building legacy solutions. Make sure architecture is a shared capability within your team, starting with you and supported by your principal engineers."
- "Define a preferred platform architecture and best practices, but recognize you'll always have legacy or less mature systems that can't deliver at that level. Not only legacy systems but even new SAS applications still have problems serving data as a product and struggle with notifying deletions, or even sending events. So your architecture must consider all the different scenarios and provide decision trees with the recommendations to the providers. Try to elevate them to follow best practices, but in the end, delivering value to the business is what matters."

His people-leader advice of the same message goes to the leading data people module. Where each point went, and every assumption taken, is in the project's shared files (`manager-advice/where-each-point-went.md`).

## The reference, and its alternatives

The module's spine (TOGAF's method, ArchiMate's words) holds. This series adds, an assumption for the author to review:

| Body of knowledge | What it adds | Here |
|---|---|---|
| ArchiMate (The Open Group): its layers and its exchange format | A standard language for the map, kept as files | *Services with customers*, *One map, in the repo* |
| TOGAF's four architectures (business, data, application, technology) | The layers below strategy; the author's "information" is TOGAF's data | *Services with customers* |
| The service catalogue (ITIL); the value proposition canvas (Osterwalder and others, 2014) | Services named in a customer's words; customers' pains and gains | *Services with customers* |
| Docs as code; architecture decision records (Michael Nygard, 2011); diagrams as text (Mermaid, draw.io) | The architecture in a repository, reviewed like code, every other document made from it | *One map, in the repo* |
| Change data capture and event-driven integration | The paths a provider can offer, from events to a nightly file | *A path for every provider* |

Where the series differs: the frameworks describe architecture as a practice of its own, often a separate team's; here it's the data manager's own habit, shared with the team's principal engineers, kept current with every change rather than in funded projects.

## The insights, and where each comes from

| Insight | Where it comes from | Film |
|---|---|---|
| Run your services as a business: define them, name the customers in groups with their pains and drivers, then design every layer for them | The author; the service catalogue; ArchiMate's layers | *Services with customers* |
| Every page has its picture, drawn with it, never after | The author: "visualization everywhere" | Every film |
| One map in a repository, reviewed like code; the wiki, slides and videos made from it | The author; docs as code | *One map, in the repo* |
| Update the current and target state with every change; don't wait for funding | The author | *One map, in the repo* |
| Architecture is a shared capability: the manager first, the principal engineers beside her | The author | *One map, in the repo* |
| Agents draft structure and diagrams; a person reviews every change | The author; the agent films' rule | *One map, in the repo* |
| One preferred way, and a decision tree for every provider who can't reach it; lift them over time, value first | The author | *A path for every provider* |

## The films

| # | Folder | Film (working title) | What it shows | The idea to take away |
|---|---|---|---|---|
| 1 | `1-services-with-customers` | Services with customers | Helena writes the team's four services, its suppliers and its customers in four groups, with their pains and drivers; one service walked down five layers, one picture each | Know your services and who they're for; then design every layer for them. |
| 2 | `2-one-map-in-the-repo` | One map, in the repo | The target picture in three versions that disagree; the map's source moves into the team's repository; every change a reviewed pull request; the wiki, the slides and the who-does-what page made from it | One map in the repository; every change updates it; everything else comes from it. |
| 3 | `3-a-path-for-every-provider` | A path for every provider | The preferred way on one page; a decision tree for the sensors, a timetable bought as a service that never says what was deleted, payroll's nightly file, a faculty's spreadsheet | One preferred way, a path for every provider, and value first. |

Each opens with a story from outside data, in the four beats said outright, an assumption each film's thread checks against its sources: Aravind Eye Hospital (Madurai, from 1976); Ordnance Survey's MasterMap (2001); and the shipping container and the ships that brought their own cranes (from 1956).

## Rules from the plan

The module's rules hold (`../a-plan-in-ninety-days/proposal.md`, *Rules from the plan*): each film marked draft, its merge its release; no release status in a film; tools where the work happens in them; an agent proposes and a person approves; the fictional university; Spanish as captions and pages only.
