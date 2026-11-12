# Platform and solution architecture

*Proposal for the third of four new series in the topic Enterprise architecture, drafted on 11 November 2026 from the author's review that day. What the four series share is in [`../business-architecture-for-data/proposal.md`](../business-architecture-for-data/proposal.md); this file holds this series' own plan. Status: proposed; no script is written until the author confirms it.*

## Decided

<!-- decided: made by site-tools/build_series.py from decided.md, the series' and each film's -->
| Date | Decision |
|---|---|
| 11 November 2026 | *Platform and solution architecture* is eight films: *An application or a platform?*, *Inside the platform*, *One platform, or many*, *Where it meets the applications*, *Security all the way through*, *One solution, end to end*, *A road people choose* and *Built to change*. Platform architecture designs the shared platform once; solution architecture designs one need on it. Ravi Menon, platform lead, leads it. |
| 11 November 2026 | Application or platform: an application has one purpose with its logic built in; a data platform gives shared capabilities on which many owners build their logic, the enterprise domain (cross-domain measures for performance and analysis) among them. The logic runs on the platform, never in its own components, and its owner is always the business. The platform has a business owner who answers to every domain that uses it. |
| 11 November 2026 | *An application or a platform?* separates a platform product (Databricks, or another vendor's) from your data platform, the service built from it and the components, team and rules around it. |
| 11 November 2026 | *One platform, or many* states the author's position: keep the architecture as simple as possible; few components, centralised, wins for most organisations; federation of platforms fits only a few; every platform brings its own governance layer. Data mesh is introduced as often the simplest architecture: it federates ownership on one self-serve platform. |
| 11 November 2026 | *Where it meets the applications*: the integration platform and the data platform work better integrated, for operations and governance; each flow takes the route that's simplest, cheapest and easiest to govern, through the integration platform or native; every flow is on one map both teams govern. |
| 12 November 2026 | *An application or a platform?* opens the series' story: Japan in 1601, a country of many domains, two weeks on foot from Edo to Kyoto; early in 1601 (the first month of Keichō 6, so not "January") Ieyasu orders each station on the road to Kyoto to keep 36 horses and carry official travellers on, with his seal (no seal, no horses); the five roads, the Gokaidō; a letter relayed in three or four days; one road for every domain's lords, couriers, merchants and pilgrims. It comes back to the road twice: the stations never wrote the letters they carried (*Whose logic*), and the roads' owner, the shogunate, whose officials rode free while others paid their way and the stations and nearby villages carried the burden (*An owner who answers to all*). The plan's "set prices for everyone else" was corrected: fares were partly fixed and partly agreed. |
| 12 November 2026 | The film's data story: the enterprise domain's measure of minutes without power per customer, for the regulator, built on the platform from outages, the network map and the old storm tool, jumps in March from about eight minutes to nineteen. The rule that leaves major storms out came in the storm tool's export, and an update in February dropped it. The map and the catalogue find the owner of the regulator's measures, Ama Owusu; she asks in a ticket and writes the rule in the glossary, the data team builds it with a test and reviews the pull request, and she checks the number in test before the ticket closes: back to nine. The numbers are invented. |
| 12 November 2026 | The film's sound pairs two instruments the site already has, a harpsichord and a bassoon, as a continuo: no film pairs them, and no film of this topic plays either. Every rarer instrument with a sound of its own was already some film's, or sounded like one, or belonged to another culture; whether the four new architecture series may do this when nothing new fits is on the author's checklist (this film's assumptions). The series' mark is *the relay*: three notes rising on the harpsichord, the last taken by the bassoon and carried down. |
| 12 November 2026 | Pause and think stops after *Not every shared system*, *A number nobody owns* and *An owner who answers to all*, right answers at options 3, 1 and 2. In Spanish, an owner is a *responsable* and the enterprise domain the *dominio empresarial*, as in the captions; the title is *¿Una aplicación o una plataforma?* |
<!-- /decided -->

## The brief

The author, on 11 November 2026, in his words:

- "Solutions architecture would be tied to the data platform integrated inner components and its integration with the applications landscape of the organization, being relevant the integration and security components as they traverse all applications. We need to explain the difference between application and platform and why a data platform is a platform (serving all domains) and not an application (serving a business function)."
- "The platform also carries business logic of domains, especially the ones for performance and analysis where new rules are implemented from multiple domains as an enterprise view needs to be built with enterprise logic, which is in itself a separate domain for a business purpose."
- "Platforms will still have a business owner, but they respond to multiple business owners of the different domains using that capability."
- "The problem when a data platform is treated as a simple application is that it might seem it must use integration patterns for applications, but as a platform, it can have its own integration methods." The integrations team said the data platform "was not following the standard integration patterns and they didn't have visibility of it, which is fine for the visibility, but wrong that it must use the integration platform, especially because there are different data consumption patterns inbound and outbound."
- "The platforms benefit from each other and integrated work much better … We currently have services that use both the integrations platform or native integrations when that's better to govern, simpler and cheaper."
- "The platform generally depends on other systems and domains to both bring the data and process the data for delivery, creating the confusion of who owns the logic, which is always the business. With scarce metadata, even identifying the owner of implemented business logic, especially in legacy systems, is tricky. The reason why enterprise architecture is so important for a data platform is because it needs to traverse every domain, both business, data, application and even technology domains."
- "Keeping the architecture as simple as possible is always the goal, because unmanaged complexity is what makes services fail. Every organization has different needs and in very few scenarios federation is good (big multinationals), but for the rest … using the less components possible in a centralized way is the winner." "Every platform will have a different governance layer, and today with the speed of delivery and migration, centralization is becoming easier and useful for users." "Data mesh can many times be also the simplest architecture compared to unmanaged complexity."
- "State the difference between Databricks and any other as a platform and your data platform using multiple tech components. Considering many people call them platforms as well."

**Prerequisites, stated on the series page:** *The map before the data* (at least *Who does it, and where meaning changes* and *Today, and where it's going*) and *Data architecture*.

## Reference and alternatives

- **Follows:** TOGAF 10 (application and technology architectures; enterprise, segment and solution levels; the Technical Reference Model) and ArchiMate 4 (application and technology elements).
- **Also uses:** *Team Topologies* (platform teams, a platform as an internal product); the CNCF Platforms White Paper (2023); Zhamak Dehghani's *Data Mesh* (2022: domain ownership, data as a product, a self-serve platform, federated governance); *Enterprise Integration Patterns* (Hohpe and Woolf, 2003); NIST SP 800-207 (zero trust); ISO/IEC 25010 (quality attributes); the C4 model and arc42 for solution views; decision records.
- **Worth knowing:** SABSA (security architecture); the cloud providers' well-architected frameworks.
- **Tools:** Databricks shows the platform (catalogue, storage, compute, pipelines, serving, Lakebase, apps), dbt the recipes; each shown as one example of a capability, never as its reason.
- **Where it differs:** the published definitions say a platform holds no business logic (Dehghani); the series says where the logic is instead: it runs *on* the platform, in data products owned by each domain and by the enterprise domain, never *in* the platform's own components, and never owned by the platform team by default.

## Application or platform

**The words first.** A **platform product** (Databricks, or another vendor's) is a set of technology components sold as one. **Your data platform** is the service your organisation runs for all its domains, built from that product and the components around it (identity, network, integration, orchestration, reporting tools, observability) and the team, rules and support that run it. The films keep "Databricks" for the product and "the data platform" for the service.

**The test** (from TOGAF's *application platform*, Bottcher in *Team Topologies*, the CNCF white paper and Dehghani, with the author's corrections):

| | Application | Data platform |
|---|---|---|
| Purpose | One business purpose | Shared capabilities that serve no single purpose |
| Business logic | Built in, owned with it by the function it serves | Run on it, in data products owned by each domain and by the enterprise domain (cross-domain measures for performance and analysis); none in its own components |
| Business owner | One function's leader, deciding for that function | A sponsor with a platform product owner, answering to every domain that uses it: less free to decide *what* it does, accountable for *how well* it serves all of them |
| Measured by | The function's outcome | Its users' outcomes: adoption, time to a first data product, reliability, cost |
| On the map | Application components serving a capability | Technology services and system software, plus generic application services |

"Serves every domain" isn't the test on its own: an ERP serves many functions and is an application suite. No standard defines "platform owner"; the split is drawn from practice, and the rigour notes say so.

## Insights

| # | Insight | From |
|---|---|---|
| 1 | An application has one purpose, its logic built in; a data platform gives shared capabilities on which many owners, the enterprise domain among them, build their logic. The owner of that logic is always the business. | TOGAF; *Team Topologies*; CNCF; data mesh; the author |
| 2 | Enterprise architecture matters most for a data platform: it's the one system that crosses every domain, business, data, application and technology. | The author |
| 3 | Keep it as simple as possible: few components, centralised, wins for most organisations; every extra platform brings its own governance layer. Federating ownership doesn't need many platforms. | The author; data mesh |
| 4 | Two platforms work better together: each data flow takes the route that's simplest, cheapest and easiest to govern, through the integration platform or native, and every flow is on one map. | The author; *Enterprise Integration Patterns* |
| 5 | Security runs through every layer: identity first, least privilege, every request checked, everything audited. | NIST SP 800-207 |
| 6 | A solution is designed on the platform: context, options, quality attributes, a recorded decision, and its place on the map. | TOGAF solution level; C4; ISO/IEC 25010 |
| 7 | A platform is a product: roads teams choose because they're easier. | *Team Topologies*; CNCF |
| 8 | Choose for change: open formats, clear seams and a plan to move. | Common practice |

## In practice: a data platform treated as an application

- **It's forced into application integration patterns.** The integration team expects every flow through its platform, can't see the data platform's own flows and reads them as non-compliant. Data comes in and goes out in more ways than applications exchange transactions: the fix is two integrated platforms, each flow on its best route, all on one map (the author). Integration and data management have long been separate silos (DATAVERSITY).
- **Nobody can say who owns the logic.** It looks like the platform's because the platform brings and processes the data; it's always the business's, and with scarce metadata, above all in legacy systems, finding the owner is the hard part (the author).
- **The platform team becomes the bottleneck,** owning every domain's transformations and definitions (practitioner accounts, as opinion).
- **It quietly becomes an integration layer nobody designed** (practitioner accounts, as opinion).
- **Domains in name only:** old teams re-badged as domains without business ownership (Thoughtworks, *The state of data mesh in 2026*).
- **Many platforms, joined for their own sake:** three products from three vendors, each with its own permissions, lineage and policies to keep in step (the author).

## Films

Japan's Gokaidō runs through the series; the last film says how it lasted, because it was kept, and how it was replaced.

| # | Working title | What it teaches | The Gokaidō | The utility |
|---|---|---|---|---|
| 1 | **An application or a platform?** | Starts on Tomás's map (the application and technology layers, the 140 systems of *Today, and where it's going*); platform product and your data platform; the test above; the ERP counter-example; whose logic it is; why EA matters most here | Each domain governed itself; the roads and stations served every domain, merchant and pilgrim; the shogunate owned them, served its own officials first and set prices for everyone else | The 140 systems sorted: billing, outages and metering are applications; the data platform is the road they share. A wrong enterprise measure, customer minutes lost, built from three systems, one of them legacy: nobody can say whose rule it is until the map and the catalogue find the business owner |
| 2 | **Inside the platform** | The platform's capabilities (ingest, store, process, serve, catalogue and govern, secure, observe, orchestrate) and a reference architecture; each shown once in Databricks; hand-off to *The Inner Life of Data* | Post stations, horses and porters, inns, distance mounds, ferries: the parts every road shared | Ravi draws the platform as eight capabilities, then a product under each; nothing observes the platform itself |
| 3 | **One platform, or many** | Centralise or federate the platform; data mesh introduced (its self-serve platform is one shared platform); simplest wins for most; when more than one is unavoidable (an acquisition, a separate legal entity, data that must stay in a country), open table formats and catalogue federation reduce the harm but not the second governance layer; migration faster than it was, in many cases | One network of roads under one set of rules, rather than each domain's roads and tolls between them: domains kept their own government and shared one road | Two business units bought different platforms years ago and a third proposes linking them with a third; Ravi draws the three governance layers side by side and proposes one platform, with domains owning their products on it |
| 4 | **Where it meets the applications** | Two platforms that work better together, for operations and governance; application integration and data integration; each flow on its simplest, cheapest, best-governed route; one integration map; hand-off to *Data that moves* and *A path for every provider* | Domain roads joining the five routes; couriers and goods handed on from station to station | The integration team can't see the data platform's flows; the fix joins the two platforms, some flows through the integration platform and some native, all on one map both teams govern |
| 5 | **Security all the way through** | Identity, least privilege, every request checked, encryption, secrets out of code, audit; why it's the platform's job; hand-off to *Locks before the data* | Passes inspected at checkpoints such as Hakone, and permits checked at each station before horses were given (to confirm) | A service account with rights to everything, found in a script; the platform makes the safe way the default |
| 6 | **One solution, end to end** | Solution architecture: context, options, quality attributes, a decision record, reuse; enterprise, platform and solution architects side by side | A domain lord's journey to Edo, planned station by station on the shared road | The hardship tariff from *When strategy moves*, designed on the platform: two options, one chosen, why written down |
| 7 | **A road people choose** | The platform as a product: templates, paved paths, self-service, guardrails; adoption measured; hand-off to *Services with customers* | Pilgrims and merchants chose the roads because they were easier; guidebooks and prints followed | A domain team ships its first data product in two days from the template, not six weeks |
| 8 | **Built to change** | Build or buy, lock-in, open formats, seams, a technology lifecycle, an exit plan; the data practice's consolidated view; why the practice keeps maturing | Kept and adjusted for over 250 years; when it couldn't carry what the country needed, the railway replaced it, along its own route | The open table format and the catalogue make a later move a migration, not a rewrite; one data product followed from its owner to its files |

## Overlap

*The Inner Life of Data* (a tour of the platform: this series draws its architecture); *Data that moves* and *A path for every provider* (integration mechanics, providers' decision trees); *Locks before the data* and *Only what you may see* (data protection); *Services with customers* (services as a business); the AI agents module. Each film links.

## Sources (checked 11 November 2026)

- The Open Group, TOGAF 9 glossary (*application platform*) and TOGAF 10; ArchiMate 4.
- M. Skelton and M. Pais, *Team Topologies*, 2019 (Bottcher's 2018 definition, quoted via secondary sources, to check against the original); [CNCF Platforms White Paper, 2023](https://tag-app-delivery.cncf.io/blog/paap-personas/); Z. Dehghani, [*Data Mesh*, 2022, chapter 4](https://www.oreilly.com/library/view/data-mesh/9781492092384/ch04.html).
- G. Hohpe and B. Woolf, *Enterprise Integration Patterns*, 2003; NIST SP 800-207, 2020; ISO/IEC 25010.
- [Thoughtworks, *The state of data mesh in 2026*](https://www.thoughtworks.com/insights/blog/data-strategy/the-state-of-data-mesh-in-2026-from-hype-to-hard-won-maturity); [DATAVERSITY](https://www.dataversity.net/?p=299648); practitioner blogs, as opinion: [*Your data platform is not a platform*](https://niluswebsite.pages.dev/blog/your_data_platform_is_not_a_platform/), [*Your data platform is an integration layer in disguise*](https://niluswebsite.pages.dev/blog/your_data_platform_is_an_integration_layer_in_disguise/).
- [nippon.com, *The Tōkaidō*](https://www.nippon.com/en/japan-topics/g02415/); [Samurai Archives, *Tōkaidō*](https://samurai-archives.com/wiki/Tokaido).
