# Data governance, off the shelf

*Proposal for a series on data governance that works where data work happens, v0.3. The folder is named after the topic; the series title is still open. Status: proposed, 16 October 2026. A companion series on master and reference data is proposed beside it, in [`../master-and-reference-data/proposal.md`](../master-and-reference-data/proposal.md).*

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
| 16 October 2026 | The look is **toy town**, chosen from three looks drawn with the same two moments of *Off the shelf* (toy town, the building in section, a graphic novel). The university is a model town on a table: rooms open at the front like dollhouses, people as painted figures on small bases, a soft blur at the top and bottom of the frame. It replaces "the binder is paper, the enablers are glass". Fewer diagrams, more situations: ideas are shown as people doing things in places. |
| 16 October 2026 | *Off the shelf* keeps the Magna Carta opening, as the checks found it: the clause promised one measure, and measures still differed for six centuries; what worked, by the late 1800s, was all of it together (one definition in law, a copy in every county, an inspector who checked, with the law behind him). Inspectors came with the Act of 1834, local measures were abolished in 1835, and the Act of 1878 gave the uniformity. |
| 16 October 2026 | Current versions, named once in *Off the shelf*: DAMA-DMBOK, second edition, revised (2024); DCAM v3 (2025), now the EDM Association's; ISO 8000 for data quality; ISO/IEC 38505-1:2026, which replaced the 2017 edition. |

## The brief

From the author (16 October 2026): a data governance series, and a master and reference data series; draft the storyline and the themes to cover. They should align with the other series, especially those on definitions and modelling. Use DAMA as the reference body, but keep it very practical and avoid over-conceptualisation. Show data governance enablers: governance often becomes a body without tools, only assessments and plans, with heavy documentation, low enforcement and no real support for actual data work.

Added the same day: more films on data quality and on data product ownership, and films on the tools, specifically Databricks and dbt, that implement some of those governance elements, expanded from the films they reference. Of interest: data products and marketplace solutions such as Databricks' Ontos, which help with data domains, contracts and data products in open formats.

And later the same day: governance focuses on people and processes, which is why it benefits from the right tools too; but it's ultimately human work, requiring human understanding and motivation, change management, support and guidance. Data governance teams are the teachers of data, where all the pieces come together, as DAMA shows in its knowledge areas. Say which of those areas each series covers.

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
- **Measured by use, not by maturity.** The final film replaces the maturity assessment with measures read from the work itself.

## The spine: where does each policy line run?

The university's governance programme starts the series with a binder: 34 policies, a maturity assessment of 2.1 out of 5, a RACI, and a council. Each film takes one kind of policy line and moves it off the shelf, into the work:

| The binder says | Where it runs | Film |
|---|---|---|
| "Every critical data element has an accountable owner." | `owner` is required on every domain, entity and public model; a change asks its owner to review it, automatically | Who decides |
| "Business terms are defined consistently across the organisation." | The business glossary is the home of a definition; a sync flags drift and proposes the change as a pull request (DEC-PRJ-11) | One word, one home |
| "Personal data is classified and protected." | Every column of a public model is classified; the platform masks by classification, wherever the column travels | Who may see it |
| "Data quality is monitored and issues are remediated." | Each rule is a test with an owner, a threshold and a reason; a scorecard is read from the last run; a failure opens an issue for its owner | Rules that run |
| "Root causes of data quality issues are addressed." | Each issue is traced to where the data was made, fixed there, and turned into a check at entry; monitoring watches for what no rule names | Fixed where it starts |
| "Changes are assessed for impact before they are made." | Every pull request carries its impact: lineage, tests, exposures and their owners; a breaking change is a new version | Change without surprises |
| "Data is managed as an asset with clear accountability." | Data products with an owner, a contract, service levels and a lifecycle, published where consumers find and request them | A product with an owner |
| "AI use follows the organisation's data policies." | Agents read the same rules as checks and skills, with least privilege; they draft and flag, people approve | An agent that checks |
| "Governance maturity is assessed annually." | Measures read from the metadata and the runs, every day; a stewards' community, guidance beside every check, and rollouts that warn first | Teachers of data |

## Foundations: DAMA, named once

*Off the shelf* names the bodies of knowledge once: **DAMA-DMBOK** (the reference, with data governance at the centre of its wheel of knowledge areas), and, in a line, DCAM, ISO 8000 for data quality, and ISO/IEC 38505 for the governance of data. After that, the series teaches what to do.

Governance sits at the centre of DAMA's wheel because it's where the other knowledge areas meet, and where someone has to explain how they fit. The films across the site already teach most of them. This series and its companion fill the gaps, and *Teachers of data* closes on the wheel, each area lit with the films that teach it.

**DAMA's knowledge areas, and where the films cover them:**

| Knowledge area | Where it's covered | Films |
|---|---|---|
| Data governance | This series; touched in every series that shows people approving | Here: all, centrally *Off the shelf*, *Who decides*, *Teachers of data*. Also *Keeping it true*, *An agent on the team* |
| Data architecture | *The map before the data*; *In the weeds of data crafting* | All of *The map before the data*; *Who owns what*. Here: *Who decides*, *A product with an owner* |
| Data modelling and design | *A Sharper Sketch*; *From words to data*; *In the weeds of data crafting* | All of *From words to data*; *Declare it, then build it* to *Built in layers*. Companion: *One person, many roles*, *Roles come and go* |
| Data storage and operations | *The Inner Life of Data*; *From words to data* | *Into the platform*, *Two speeds* (chapters); *Both at once*; *Built in layers* (physical choices) |
| Data security | *The Inner Life of Data*; this series; its companion | *Meaning* (chapter: access control, masks). Here: *Who may see it*, *Governed in Unity Catalog*, *The marketplace*. Companion: *For this purpose only* |
| Data integration and interoperability | *The Inner Life of Data*; *When things go wrong*; *In the weeds of data crafting*; this series | *Into the platform*, *Ways out* (chapters); *Silent change*; *What makes it the same one*. Here: *Change without surprises*, *Products in open formats*, *The marketplace*. Companion: *One person, many systems* |
| Document and content management | Not covered | Parked |
| Reference and master data | The companion series; *In the weeds of data crafting* | All of the companion; *What makes it the same one* (key sets, code mappings) |
| Data warehousing and business intelligence | *The Inner Life of Data*; *From words to data*; *In the weeds of data crafting* | *Refining with dbt*, *Gold*, *Apps and Genie* (chapters); *Built to write, built to read*, *Many ways to read*; *One row of what, and when*, *Built in layers* |
| Metadata management | *The Inner Life of Data*; *From words to data*; *In the weeds of data crafting*; this series | *Meaning* (chapter); *Meaning machines can read*, *Keeping it true*; *Written once*. Here: *One word, one home*, *Governed in dbt*, *Meaning on the platform* |
| Data quality | *When things go wrong*; *In the weeds of data crafting*; this series; its companion | *Too good to be true*; *Promises and proofs*. Here: *Rules that run*, *Fixed where it starts*, *Quality on the platform*. Companion: *Kept, not cleaned* |

The site could show the same map: the wheel on the Topics page, each area linking to its films (a decision for the author, below).

## The world, and the people

**The same university, platform and people** as the other series, and the same example dbt project ([`../analytics-engineering/project/`](../analytics-engineering/project/)): every enabler shown is a file in it, or a file this series adds to it. Mei Tanaka owns the meaning of *award* and decides learner identity; Noor Rahman, the data architect, owns the model; Jun Park builds it; Sam Okafor runs the platform; Leila and Rosa own admissions' data and system.

**One new character: Yusuf Demir, the data governance lead,** new to the role. Yusuf inherits the binder, and is asked to "fix governance" before the university's next government submission. Yusuf is the guide of the series, as Sam is of *When things go wrong* and Noor of *From words to data*.

**The look:** toy town (decided 16 October 2026). The university is a model town on a table, with the governance office on the green in the middle and the other offices round it, ten paths between them: from above, DAMA's wheel. Rooms open at the front like dollhouses; people are painted figures on small bases, gold-rimmed for the business side and blue-rimmed for the technical side. The binders are on a real shelf in Yusuf's office; a policy line that finds where it runs leaves the shelf for a place in the town.

## The thread: the number reported to the government

The university reports its awards to the government every year. This year, the draft submission and the census report disagree on how many awards were conferred. The same week, the glossary's term *award* changes: microcredentials of at least 6 credit points now count (the kind of drift `skills/sync-the-glossary/` is built to catch). Yusuf is asked to make sure the reported number can be trusted, in time for the submission.

None of the 34 policies would have caught either problem. Each film puts one enabler in place; the last film sends the submission, and shows what's left on the shelf.

## The series at a glance

Sixteen films of 4 to 6 minutes, in two parts. The first ten show what governance needs, and the enabler that delivers each. The last six open the tools, Databricks and dbt, and show how each enabler is built; each names the films it expands.

| Part | # | Working title | The enabler | The idea to take away |
|---|---|---|---|---|
| What governance needs | 1 | **Off the shelf** | The map of where governance enters the work | A policy that doesn't run anywhere is a wish. |
| | 2 | **Who decides** | Owners as required metadata; approvals routed from it | A decision right is real when the work asks for it. |
| | 3 | **One word, one home** | The business glossary and its sync | Define once, sync one way, review every change. |
| | 4 | **Who may see it** | Classification on the column; masks by classification | Classify once; let the platform protect it everywhere. |
| | 5 | **Rules that run** | Owned tests and a scorecard read from the runs | A quality rule is a test with an owner. |
| | 6 | **Fixed where it starts** | Issues traced to their source; checks at entry; monitoring for the unknown | Fix the cause, then make the fix a check. |
| | 7 | **Change without surprises** | Impact on every pull request; versions; exposures | Change control is a step in the change, not a meeting. |
| | 8 | **A product with an owner** | Data products with an owner, a contract, service levels and a lifecycle | Own the product, not only the meaning. |
| | 9 | **An agent that checks** | A governance review skill | Agents follow what's written as a check. People decide. |
| | 10 | **Teachers of data** | The stewards' community, guidance beside every check, warn-then-error rollouts, measures read from the work | Governance is people's work; tools remember what people agreed. |
| With the tools | 11 | **Governed in dbt** | `meta`, groups and access, contracts, versions, exposures, checks in CI | The project carries governance with the code. |
| | 12 | **Governed in Unity Catalog** | Grants, governed tags, attribute-based policies, masks, lineage, audit | The platform enforces what the metadata says. |
| | 13 | **Meaning on the platform** | Unity Catalog's Glossary, metric views, semantic models | One meaning, read by people, BI and agents. |
| | 14 | **Quality on the platform** | dbt tests, pipeline expectations, quality monitoring, alerts routed to owners | Rules you write, and monitoring for the rest. |
| | 15 | **Products in open formats** | Ontos: domains, data products (ODPS) and contracts (ODCS) over Unity Catalog | A contract in an open format outlives the tool. |
| | 16 | **The marketplace** | Discover, request, approve, grant, with an end date; share outside | Finding and getting data is part of governance. |

## Openings: other places, other times

| Film | Opening | Where | When |
|---|---|---|---|
| 1 | "One measure of wine throughout the kingdom", and the standard weights that finally made it true | England | 1215, then centuries later |
| 2 | The andon cord: anyone on the line can stop it | Japan | 1950s–60s |
| 3 | One script, one set of measures, across a newly unified empire | China | 221 BC |
| 4 | A court stops a census: the right to decide what happens to your data | Germany | 1983 |
| 5 | Frontinus measures the aqueducts and finds the records wrong | Rome | 97 AD |
| 6 | Semmelweis has doctors wash their hands, and deaths on the ward fall | Vienna, Austria | 1847 |
| 7 | Dagen H: a whole country switches to driving on the right, overnight, prepared for years | Sweden | 1967 |
| 8 | A covered market where every stall has a maker who answers for it | Istanbul | 1460s onwards |
| 9 | An agent reviews a change at 3 a.m. (imagined) | The university | Imagined, near future |
| 10 | Mimes instead of fines: a city changes how people cross the street | Bogotá, Colombia | 1995 |

The tools films (11 to 16) don't open in the past. Each opens on the screen, with one line from the film it expands, and stays in the present: they're for the people who build it.

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

**Story.** The RACI says "Data steward: TBC" for half the domains, and learner identity is decided in email threads. Yusuf finds the owners are already written down, in the university's map of domains (`_shared__conceptual.yml`) and in each model's `meta.owner`. Yusuf and Noor make the owner required, and route every change from it: a change to the course domain's conceptual model asks Mei to review it, without anyone remembering to.

**Ideas.** Decision rights, in three roles: the owner (accountable for meaning), the steward (does the daily work, such as Mei's identity decisions), the custodian (runs the platform). Federated: domains decide their own meaning; governance sets a few shared rules (the glossary, key sets, classification, conventions), as in *Who owns what*. The council decides only conflicts and exceptions, with a time limit and an escalation path. Every decision recorded where the work is, with who and when (the decision logs).

**The enabler.** Owners in metadata; a check that fails a public model without one; review requests generated from the owners (a `CODEOWNERS` file, made from the metadata, not by hand).

**On screen.** A RACI matrix with blanks; then a pull request that asks Mei, by name.

**The people side.** Mei didn't ask to be an owner. Being named needs time from her manager, a small and clear scope, and someone to ask. A role without time is a name in a spreadsheet.

**Labs (candidates).** *Owner, steward or custodian?* *Route the change.*

### 3. One word, one home

**Opening.** China, 221 BC: a newly unified empire takes one script, one set of weights and measures, and one axle width, so a word, a weight and a road mean the same in every former state.

**Story.** The glossary term *award* changes in Unity Catalog's Glossary. Before, someone would have noticed months later, in a dashboard. Now the scheduled sync finds the drift and opens a pull request with its impact: the near-award mart, the wallet, the census dashboard and their owners. Mei approves the new meaning; governance confirms the term still applies; Jun sees that "at least 6 credit points" is a number, so it belongs in a var.

**Ideas.** Business glossary, data dictionary and catalog: three different things. A term has a definition, an owner, a status and a date. The glossary is the home of a definition it holds; the model takes its words and records where they came from (DEC-PRJ-11). One direction of sync. A definition change is reviewed with what it touches. A definition with a number in it is also a rule.

**The enabler.** The glossary, and the `sync-the-glossary` skill, already in the project, run on a schedule and in CI.

**On screen.** A term moving one way: glossary, conceptual model, doc block, catalog. A second arrow, backwards, crossed out.

**The people side.** The words were agreed in a workshop where Mei and the faculties argued them out. The glossary keeps the agreement; it doesn't make it.

**Labs (candidates).** *Glossary, dictionary or catalog?* *Read the drift report.*

### 4. Who may see it

**Opening.** Germany, 1983: the Constitutional Court halts the national census and rules that people have a right to decide what happens to their personal data.

**Story.** A planner asks for learner-level data behind the near-award list. The old path: a form, an emailed approval, the whole table granted, never revoked. The new one: every column of the public models is already classified (`personal_data: direct` or `pseudonymous`, in the project's YAML); the classification travels to the platform as a tag; a policy masks direct personal data for anyone outside the registrar's office. The planner gets pseudonymous keys, for the purpose stated, until the date stated. The agent works on samples.

**Ideas.** Classify once, at the column, when the column is made. Policies by classification, not table by table. Least privilege; purpose; expiry; retention. Access reviews read from the grants, not from a spreadsheet. dbt's `access` decides who can `ref()`; the platform's grants decide who can read (*Who owns what*).

**The enabler.** A check that every column of a public model is classified; tags and masks on Databricks applied from the classification; access with an end date.

**On screen.** One column's tag lights up, and the mask follows the column downstream, through every model it reaches.

**The people side.** The planner isn't a risk to manage. They're told why the mask is there and how to get more when the purpose needs it. A refusal without a path is a reason to copy data into a spreadsheet.

**Labs (candidates).** *Classify the columns.* *Who sees what?*

### 5. Rules that run

**Opening.** Rome, 97 AD: Frontinus, the new water commissioner, measures what the aqueducts take in and what they deliver, and finds the official records wrong, and water stolen by illegal pipes. Measure; don't trust the register.

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

**Story.** Planning's census mart is used by the census dashboard, two faculties' spreadsheets and, it turns out, Finance. When it was late last term, nobody knew who to call: Jun built it, Noor owns the model, Planning asked for it. Yusuf, Noor and Planning name it a data product: an owner who answers for it (Planning's lead), a contract that says what it promises (*Promises and proofs*), service levels (fresh by 7 a.m. on census day), documentation, a version and a lifecycle, from draft to retired. The registrar's learner and award models are products too, owned by the registrar's office, which publishes them for everyone else to build on.

**Ideas.** A data product is data plus a promise: owner, contract, service levels, documentation, version and lifecycle. Its owner answers for the product; the data owner answers for meaning; they may be different people. Products belong to domains (*Who owns what*, *Who does it, and where meaning changes*). Source-aligned, aggregate and consumer-aligned products. Consumers are known by name, through exposures and access requests. Not everything is a product: most models are steps.

**The enabler.** A product descriptor beside the models: owner, domain, contract, service levels, consumers and status, generated into the catalog; a check that a public model belongs to a product; consumers asked before a product is deprecated.

**On screen.** One table, three people pointing at each other; then a product card with one name on it, and a line of consumers behind it.

**The people side.** Planning's lead has to want the job. Yusuf shows who depends on the mart, what it's worth to them, and what support comes with owning it.

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

**Opening.** Bogotá, 1995: the mayor sends mimes into the streets to mock people who cross against the lights or drive carelessly, instead of fining them. With other measures, deaths on the roads fall. People follow a rule more readily when they understand it, and when following it is easy, visible and normal.

**Story.** Submission day. The number is the same in the submission and the census report, and its definition is the glossary's. Yusuf knows why it worked: not because of the checks alone, but because people understood them. So the governance team's work changes. A stewards' community meets every month to share what broke and what helped. Office hours replace approval queues. Every check's message links to a short how-to, written for the person it stops. A new check is announced, explained, runs as a warning first, and becomes an error only on a date everyone knows. Every new analyst starts with these films and their labs. The maturity assessment isn't repeated; the measures come from the work: how many public models have an owner, a term and classified columns; how long a drift takes to close; how many failures were fixed at the source; how long access takes to grant; how many people came to office hours, and came back. The binder: of 34 policies, some became checks, some became decisions with owners, and the rest were retired.

**Ideas.** Governance is people and processes; tools serve them. Change management in practice: why before what, start with the willing, warn before enforcing, support at the moment of friction, celebrate what works; the common change models, named once (such as Kotter's steps and ADKAR). Guidance and support as the governance team's daily work. Communities of practice. Measure by use and outcome. Start small: one question, one domain, three enablers, then the next. The governance team as the teachers of data: at the centre of DAMA's wheel, because that's where every other area meets and someone has to show how they fit.

**The enabler.** The human ones: the stewards' community, office hours, guidance beside every check, a warn-then-error rollout, an onboarding path through the films and labs. And a governance scorecard generated from the metadata and the runs.

**The people side.** The whole film.

**On screen.** Yusuf in a room with stewards, not at a shelf. Then DAMA's wheel, governance at its centre; each slice lights with the films across the site that teach it, and the lines all run back to the centre.

**Labs (candidates).** *Warn first, or stop?* *Plan the rollout of a check.* *Measure it from the work.*

*Part two: with the tools*

The films of this part show the same university, the same project and the same people, on Databricks and dbt, with the files and screens a practitioner uses. Each one says which films it expands, recaps them in a line, and goes straight to how it's built. Product names change often: they're kept to labels, and checked in each film's rigour sheet.

### 11. Governed in dbt

**Expands** *Who decides*, *Rules that run*, *Change without surprises*; builds on *Promises and proofs*, *Who owns what* and *Written once*.

**Story.** Jun opens the project and shows where each governance element lives in dbt: `meta` on models and columns (owner, domain, glossary term, personal data class), groups and `access` (who may `ref()` what), enforced contracts, model versions with deprecation dates, exposures naming consumers and their owners, tests carrying their owner and dimension. Then the checks that make it stick: a CI step that fails a public model without an owner, a term or classified columns; `CODEOWNERS` generated from `meta`; `state:modified+` running only what changed and what depends on it; `persist_docs` pushing descriptions to the catalog.

**Ideas.** The project as the first place governance is enforced: before anything reaches the platform. What dbt decides (who can build on what) and what it doesn't (who can read).

**On screen.** One model's YAML, each governance line lit and labelled with the film it comes from; a red CI check, then green.

### 12. Governed in Unity Catalog

**Expands** *Who may see it*, *Who decides*, *Change without surprises*.

**Story.** Sam shows the platform's side. Catalogs and schemas laid out by domain; grants to groups, never to people; governed tags, set from the project's `personal_data`, and attribute-based policies that mask direct personal data and filter rows by tag, on every table that carries it; lineage down to the column, from source to dashboard; audit logs and system tables that answer "who read this, and when"; access requests that expire.

**Ideas.** Policies by attribute, not table by table. The metadata decides; the platform enforces. Access reviews read from the grants. The link to dbt: the build writes the tags, the platform applies the policies.

**On screen.** A tag set in YAML, travelling to a column in the catalog; a mask applied as a planner queries it; the audit log line that records the query.

### 13. Meaning on the platform

**Expands** *One word, one home*; builds on *Written once* and *Meaning machines can read*.

**Story.** Mei's term *award* in Unity Catalog's Glossary, linked to the tables and columns that hold it; the sync that keeps the conceptual model in step; a metric view that defines "awards conferred" once, for dashboards and Genie alike; and the semantic model in Ontos, which links business concepts to the assets that hold them.

**Ideas.** Glossary, metrics and semantic models: three layers of meaning, each with one home. Agents read the same meaning people do.

**On screen.** One term, its linked assets lighting up across the catalog; a question to Genie answered with the governed metric and its definition.

### 14. Quality on the platform

**Expands** *Rules that run* and *Fixed where it starts*; builds on *Too good to be true* and *Promises and proofs*.

**Story.** Rules where they belong: dbt tests on the models, expectations in the ingestion pipelines that keep bad rows out or flag them, and quality monitoring on the tables that matter, for freshness, volume and anomalies no rule names. Results land in system tables; the scorecard reads them; a failure alerts the owner in the metadata, not a shared inbox.

**Ideas.** Which check goes where: at entry, in the pipeline, on the model, or as monitoring. One scorecard from every source of results.

**On screen.** The loop of checks along the lineage, from source to mart, each with its owner's name; one alert travelling to one person.

### 15. Products in open formats

**Expands** *A product with an owner* and *Change without surprises*; builds on *Who owns what*.

**Story.** Noor sets up Ontos, a Databricks Labs project that adds a business catalog over Unity Catalog: the university's domains, teams and projects; the census mart registered as a data product, described in the Open Data Product Standard (ODPS); its promise as a data contract in the Open Data Contract Standard (ODCS): schema, quality rules, service levels and meaning. The contract is a file, in an open format, kept in the repository beside the dbt contract it matches, and checked against it in CI. Stewards approve a product before it goes to production; compliance rules run on a schedule and tag, notify or block.

**Ideas.** Contracts and product descriptors in open formats, so they move between tools and outlive any one of them. One source of truth for the schema: the dbt contract and the ODCS file are checked against each other, not written twice. Domains as the shape of the catalog. What a Labs project means: open, useful, and not a supported product, so it's chosen with care.

**On screen.** A product card in the catalog; behind it, two files side by side, the ODCS contract and the dbt YAML, the matching lines linked.

### 16. The marketplace

**Expands** *A product with an owner* and *Who may see it*.

**Story.** A faculty analyst needs learners near an award. Before, they'd ask around. Now they search the university's catalog of products, read the contract and the service levels, see the owner, and request access, stating a purpose. The owner approves; access is granted to a group, with an end date; the request is the record. For a partner outside the university (the government's reporting, a partner university), the product is shared through OpenSharing or a private listing in the Databricks Marketplace, with the same contract.

**Ideas.** Discovery, request, approval, grant and expiry as one flow. Internal marketplaces and external sharing. Consumers become known, so changes reach them (*Change without surprises*).

**On screen.** A shop window of products, each with an owner's face; one request moving from the analyst to the owner and back as a key with a date on it.

## What the example project gains

So every enabler on screen is real, the series adds to [the example dbt project](../analytics-engineering/project/), and the films draw from it:

| Addition | For film |
|---|---|
| A governance check: owner on every domain, entity and public model; a glossary term or a confirmed absence; every column of a public model classified; tests with `meta` owner and dimension | 2, 4, 5, 9, 11 |
| `CODEOWNERS`, generated from the owners in the metadata | 2, 11 |
| Tags and masks on Databricks applied from `personal_data`, left out on DuckDB (as DEC-PRJ-09 does for keys) | 4, 12 |
| A scorecard generated from the run results, by domain and dimension | 5, 10, 14 |
| An impact report on pull requests, generalised from the glossary sync's | 7 |
| A `review-for-governance` skill | 9 |
| A decision in the project's log: governance's checks, and who owns them | 1, 2 |
| A fix at entry for short-course emails, and the staging clean-up turned into a test | 6 |
| Product descriptors (owner, domain, contract, service levels, consumers, status) for the public core models and the marts | 8, 15 |
| ODCS contracts and ODPS descriptors generated from, or checked against, the dbt contracts in CI | 15 |
| A Databricks target that applies governed tags and policies, and an Ontos setup that registers the products (both optional; DuckDB stays the default) | 12, 15, 16 |

## What the series covers, and where

| Topic | Film |
|---|---|
| Governance and management; DAMA-DMBOK and its wheel, named once; policy to enabler | 1 |
| Decision rights; owners, stewards and custodians; federated governance; the council; escalation | 2 |
| Business glossary, data dictionary, catalog; one direction of sync; metadata management | 3 |
| Classification, masking by policy, least privilege, purpose, expiry, retention, access reviews | 4 |
| Quality dimensions, rules as owned tests, thresholds, scorecards | 5 |
| Issue management, root cause, prevention at entry, quality service levels, monitoring | 6 |
| Lineage, impact analysis, contracts, versions, deprecation, change control | 7 |
| Data products, product ownership, service levels, lifecycle, domains, consumers | 8 |
| Agents under governance, and governance by agents; evidence; human approval | 9 |
| People and change: change management, guidance, support, communities of practice; measuring governance; starting small; DAMA's wheel brought together | 10 |
| dbt: `meta`, groups and access, contracts, versions, exposures, CI checks, `CODEOWNERS`, `persist_docs` | 11 |
| Unity Catalog: grants, governed tags, attribute-based policies, masks and row filters, lineage, audit, system tables | 12 |
| Glossary, metric views, semantic models, Genie | 13 |
| Tests, pipeline expectations, quality monitoring, alerting | 14 |
| Ontos; ODPS and ODCS; approvals; compliance rules | 15 |
| Internal marketplace, access requests, OpenSharing, Databricks Marketplace | 16 |

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
- **The master and reference data series** takes over the identity, survivorship and code lists that *Who decides* and *Rules that run* point at.

## Rigour to check when scripting

- **The openings:** Semmelweis's ward, his figures, and how slowly his advice was accepted; the Grand Bazaar's founding and its guilds; Magna Carta's clause on measures and how measures were standardised later (the 1824 Weights and Measures Act and the standards sent to towns); the andon cord and its history at Toyota; the Qin standardisation of script, measures and axle widths; the 1983 census ruling (*Volkszählungsurteil*); Frontinus's *De aquaeductu* and what he found; Dagen H's date, hour and preparation; Bogotá's mimes, their number and what the road-death figures can and can't be credited to.
- **DAMA-DMBOK:** the current edition, and the current names of its knowledge areas and quality dimensions. DCAM, ISO 8000 and ISO/IEC 38505: current versions, named only.
- **Databricks:** Unity Catalog's Glossary (its status, and how a term is read; see *Written once*'s rigour sheet); governed tags, attribute-based access control, column masks and row filters; how dbt-databricks applies tags; data quality monitoring. Product names change: keep them to labels and the rigour sheet.
- **Ontos:** what it does today (domains, teams, projects, data products, data contracts, semantic models, compliance rules, approvals, MCP), which ODCS and ODPS versions it reads and writes, its licence (the repository and third-party pages disagree), and its status as a Databricks Labs project, without formal support. Checked on 16 October 2026 from [its repository](https://github.com/databrickslabs/ontos): ODCS v3.1.0 for contracts, ODPS for products, runs as a Databricks App.
- **Open standards:** ODCS and ODPS (Bitol, the Linux Foundation), their current versions and lifecycle states; a tool that tests an ODCS contract in CI.
- **Databricks sharing:** OpenSharing (formerly Delta Sharing) and the Databricks Marketplace, private listings and exchanges, and their current names.
- **dbt:** `meta` on tests; run results; `state:modified+` for impact; exposures; model versions and deprecation.
- **Change models:** Kotter's steps and ADKAR, named only, with their sources.
- **DAMA's wheel:** the current edition's knowledge areas and how it draws governance at the centre; the coverage map above checked against the films as made.
- **Privacy:** keep it generic ("in many places, the law…"); no jurisdiction-specific advice.

## Decisions for the author

1. **The series title.** *Off the shelf* · *Rules that run* · *Governance you can use*.
2. **Sixteen films in one series, or two series.** The tools films could be their own series, for practitioners, as *In the weeds* is to *From words to data*.
3. **Ontos as the example for products and contracts.** It's open and built on Unity Catalog, but a Labs project without formal support. Alternatives: Unity Catalog alone, with ODCS files in the repository; or a commercial catalog, named once.
4. **The new character.** Yusuf Demir, the data governance lead, outlined in gold (the business side), or a name you'd prefer.
5. **DAMA's wheel on the site.** Show the coverage map above on the Topics page, each knowledge area linking to its films.
6. **The topic on the site.** A new topic, *Data governance*, holding this series and the master and reference data series, or both under *Data quality and change*.
7. **Labs and scenarios:** per film, as in *In the weeds*, or one set for the series, as in *The map before the data*.
8. **Your governance enablers.** Share the checks, templates or policies you use, so the films show them rather than a generic version.

## Next checkpoints

1. The author agrees this proposal and decides the points above.
2. Yusuf's character card, and the binder and loop as components.
3. The project's additions above, starting with the governance check, so the opening films draw from real files.
4. A script and rigour sheet for *Off the shelf*.
