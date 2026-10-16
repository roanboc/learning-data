# Data governance, off the shelf

*Proposal for a series on data governance that works where data work happens, v0.1. The folder is named after the topic; the series title is still open. Status: proposed, 16 October 2026. A companion series on master and reference data is proposed beside it, in [`../master-and-reference-data/proposal.md`](../master-and-reference-data/proposal.md).*

## Decided

| Date | Decision |
|---|---|
| 16 October 2026 | A series on data governance, and a companion series on master and reference data. Both align with the series on definitions and modelling (*From words to data*, *In the weeds of data crafting*). |
| 16 October 2026 | DAMA-DMBOK is the reference body. It's named once, in the opening film; after that, the series teaches what to do, not the framework's vocabulary. |
| 16 October 2026 | Very practical, with no over-conceptualisation. The series shows governance **enablers**: things in the work that make the right thing the easy thing, and enforce it. Not assessments, plans and heavy documentation with low enforcement. |

## The brief

From the author (16 October 2026): a data governance series, and a master and reference data series; draft the storyline and the themes to cover. They should align with the other series, especially those on definitions and modelling. Use DAMA as the reference body, but keep it very practical and avoid over-conceptualisation. Show data governance enablers: governance often becomes a body without tools, only assessments and plans, with heavy documentation, low enforcement and no real support for actual data work.

## Analysis

**What works**

- **The problem is real and everyone has seen it.** A policy library, a maturity score, a RACI with blanks, a council that meets monthly, and data work that carries on without any of it. Naming that honestly earns the trust of both audiences: the governance lead who wrote the binder, and the engineer who never read it.
- **The other series already built the enablers.** The glossary as the home of a definition and its sync (DEC-PRJ-11, `skills/sync-the-glossary/`), owners in `meta`, `personal_data` on columns, decision logs with who and when, contracts, tests with agreed severity, exposures, versions. This series shows them from governance's side: as the way a policy reaches the work.
- **DAMA as a map, not a syllabus.** DAMA-DMBOK's knowledge areas are a good checklist of what has to be governed. Teaching each area's vocabulary is how governance becomes conceptual; teaching what runs in each is how it becomes useful.

**What this proposal adds**

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
| "Changes are assessed for impact before they are made." | Every pull request carries its impact: lineage, tests, exposures and their owners; a breaking change is a new version | Change without surprises |
| "AI use follows the organisation's data policies." | Agents read the same rules as checks and skills, with least privilege; they draft and flag, people approve | An agent that checks |
| "Governance maturity is assessed annually." | Measures read from the metadata and the runs, every day | Make the right thing easy |

## Foundations: DAMA, named once

*Off the shelf* names the bodies of knowledge once: **DAMA-DMBOK** (the reference, with data governance at the centre of its wheel of knowledge areas), and, in a line, DCAM, ISO 8000 for data quality, and ISO/IEC 38505 for the governance of data. After that, the series teaches what to do.

How the films cover DAMA's knowledge areas, and where the other series already do:

| DAMA knowledge area | Here | Already in |
|---|---|---|
| Data governance | 1, 2, 7 | |
| Metadata management | 3, 6 | *Written once* |
| Data quality | 5 | *Too good to be true*, *Promises and proofs* |
| Data security | 4 | |
| Data modelling and design | 3 (the glossary's link to the model) | *From words to data*, *In the weeds of data crafting* |
| Data integration and interoperability | 6 (contracts, impact) | *Silent change* |
| Reference and master data | Handed over | The companion series |
| Data architecture | 2 (domains) | *The map before the data*, *Who owns what* |
| Data warehousing and BI, storage and operations | Out of scope | *The Inner Life of Data* |
| Document and content management | Parked | |

## The world, and the people

**The same university, platform and people** as the other series, and the same example dbt project ([`../analytics-engineering/project/`](../analytics-engineering/project/)): every enabler shown is a file in it, or a file this series adds to it. Mei Tanaka owns the meaning of *award* and decides learner identity; Noor Rahman, the data architect, owns the model; Jun Park builds it; Sam Okafor runs the platform; Leila and Rosa own admissions' data and system.

**One new character: Yusuf Demir, the data governance lead,** new to the role. Yusuf inherits the binder, and is asked to "fix governance" before the university's next government submission. Yusuf is the guide of the series, as Sam is of *When things go wrong* and Noor of *From words to data*.

**The look:** the binder is paper, heavy, on a shelf, like the drafts of *The map before the data*; the enablers are glass, in the work: on *In the weeds*' loop of ten steps, in the files, in a pull request. A policy line that finds where it runs changes material.

## The thread: the number reported to the government

The university reports its awards to the government every year. This year, the draft submission and the census report disagree on how many awards were conferred. The same week, the glossary's term *award* changes: microcredentials of at least 6 credit points now count (the kind of drift `skills/sync-the-glossary/` is built to catch). Yusuf is asked to make sure the reported number can be trusted, in time for the submission.

None of the 34 policies would have caught either problem. Each film puts one enabler in place; the last film sends the submission, and shows what's left on the shelf.

## The series at a glance

Eight films of 4 to 6 minutes. Each starts in another place and time, with a rule that either ran or didn't.

| # | Working title | The enabler | The idea to take away |
|---|---|---|---|
| 1 | **Off the shelf** | The map of where governance enters the work | A policy that doesn't run anywhere is a wish. |
| 2 | **Who decides** | Owners as required metadata; approvals routed from it | A decision right is real when the work asks for it. |
| 3 | **One word, one home** | The business glossary and its sync | Define once, sync one way, review every change. |
| 4 | **Who may see it** | Classification on the column; masks by classification | Classify once; let the platform protect it everywhere. |
| 5 | **Rules that run** | Owned tests and a scorecard read from the runs | A quality rule is a test with an owner. |
| 6 | **Change without surprises** | Impact on every pull request; versions; exposures | Change control is a step in the change, not a meeting. |
| 7 | **An agent that checks** | A governance review skill | Agents follow what's written as a check. People decide. |
| 8 | **Make the right thing easy** | Measures read from the work | Measure governance by use, not by maturity. |

## Openings: other places, other times

| Film | Opening | Where | When |
|---|---|---|---|
| 1 | "One measure of wine throughout the kingdom", and the standard weights that finally made it true | England | 1215, then centuries later |
| 2 | The andon cord: anyone on the line can stop it | Japan | 1950s–60s |
| 3 | One script, one set of measures, across a newly unified empire | China | 221 BC |
| 4 | A court stops a census: the right to decide what happens to your data | Germany | 1983 |
| 5 | Frontinus measures the aqueducts and finds the records wrong | Rome | 97 AD |
| 6 | Dagen H: a whole country switches to driving on the right, overnight, prepared for years | Sweden | 1967 |
| 7 | An agent reviews a change at 3 a.m. (imagined) | The university | Imagined, near future |
| 8 | Mimes instead of fines: a city changes how people cross the street | Bogotá, Colombia | 1995 |

## The films

### 1. Off the shelf

**Opening.** England, 1215: Magna Carta promises one measure of wine, ale and corn throughout the kingdom. The promise is restated for centuries, and measures still differ from town to town. What finally works is a standard you can hold, kept where trade happens, and someone who checks against it.

**Story.** Yusuf's first week. The shelf: 34 policies, a maturity assessment of 2.1, a RACI, the council's minutes. The same week: two numbers for awards, and a changed glossary term. Yusuf follows the number back through the platform and finds the four places a definition lives (*Written once*), none of which knows the policy exists.

**Ideas.** What governance is for: deciding who decides what, and making sure that decision reaches the work. Governance and management: governance decides and oversees; owners, engineers and the platform do. DAMA-DMBOK, named once, with its wheel; DCAM, ISO 8000 and ISO/IEC 38505 in a line. The test for every policy line: where does it run? Three outcomes: it runs, it's an owned decision, or it goes.

**The enabler.** *In the weeds*' loop of ten steps, with a pin at each point where a governance decision enters the work: a term at scope, an owner, a classification at source, a rule at tests, a contract, an approval at review, a version at operate.

**On screen.** The binder, paper on a shelf; the loop, glass. Policy lines lift off the page and find their pins; some find none.

**Labs (candidates).** *Where does it run?* (sort policy lines into runs, owned decision, retire).

### 2. Who decides

**Opening.** Japan, the 1950s and 60s: on a car assembly line, any worker who sees a defect pulls a cord, the andon, and the line stops. A right that comes with a cord gets used; one written in a manual doesn't.

**Story.** The RACI says "Data steward: TBC" for half the domains, and learner identity is decided in email threads. Yusuf finds the owners are already written down, in the university's map of domains (`_shared__conceptual.yml`) and in each model's `meta.owner`. Yusuf and Noor make the owner required, and route every change from it: a change to the course domain's conceptual model asks Mei to review it, without anyone remembering to.

**Ideas.** Decision rights, in three roles: the owner (accountable for meaning), the steward (does the daily work, such as Mei's identity decisions), the custodian (runs the platform). Federated: domains decide their own meaning; governance sets a few shared rules (the glossary, key sets, classification, conventions), as in *Who owns what*. The council decides only conflicts and exceptions, with a time limit and an escalation path. Every decision recorded where the work is, with who and when (the decision logs).

**The enabler.** Owners in metadata; a check that fails a public model without one; review requests generated from the owners (a `CODEOWNERS` file, made from the metadata, not by hand).

**On screen.** A RACI matrix with blanks; then a pull request that asks Mei, by name.

**Labs (candidates).** *Owner, steward or custodian?* *Route the change.*

### 3. One word, one home

**Opening.** China, 221 BC: a newly unified empire takes one script, one set of weights and measures, and one axle width, so a word, a weight and a road mean the same in every former state.

**Story.** The glossary term *award* changes in Unity Catalog's Glossary. Before, someone would have noticed months later, in a dashboard. Now the scheduled sync finds the drift and opens a pull request with its impact: the near-award mart, the wallet, the census dashboard and their owners. Mei approves the new meaning; governance confirms the term still applies; Jun sees that "at least 6 credit points" is a number, so it belongs in a var.

**Ideas.** Business glossary, data dictionary and catalog: three different things. A term has a definition, an owner, a status and a date. The glossary is the home of a definition it holds; the model takes its words and records where they came from (DEC-PRJ-11). One direction of sync. A definition change is reviewed with what it touches. A definition with a number in it is also a rule.

**The enabler.** The glossary, and the `sync-the-glossary` skill, already in the project, run on a schedule and in CI.

**On screen.** A term moving one way: glossary, conceptual model, doc block, catalog. A second arrow, backwards, crossed out.

**Labs (candidates).** *Glossary, dictionary or catalog?* *Read the drift report.*

### 4. Who may see it

**Opening.** Germany, 1983: the Constitutional Court halts the national census and rules that people have a right to decide what happens to their personal data.

**Story.** A planner asks for learner-level data behind the near-award list. The old path: a form, an emailed approval, the whole table granted, never revoked. The new one: every column of the public models is already classified (`personal_data: direct` or `pseudonymous`, in the project's YAML); the classification travels to the platform as a tag; a policy masks direct personal data for anyone outside the registrar's office. The planner gets pseudonymous keys, for the purpose stated, until the date stated. The agent works on samples.

**Ideas.** Classify once, at the column, when the column is made. Policies by classification, not table by table. Least privilege; purpose; expiry; retention. Access reviews read from the grants, not from a spreadsheet. dbt's `access` decides who can `ref()`; the platform's grants decide who can read (*Who owns what*).

**The enabler.** A check that every column of a public model is classified; tags and masks on Databricks applied from the classification; access with an end date.

**On screen.** One column's tag lights up, and the mask follows the column downstream, through every model it reaches.

**Labs (candidates).** *Classify the columns.* *Who sees what?*

### 5. Rules that run

**Opening.** Rome, 97 AD: Frontinus, the new water commissioner, measures what the aqueducts take in and what they deliver, and finds the official records wrong, and water stolen by illegal pipes. Measure; don't trust the register.

**Story.** The programme measured quality with a survey: "rate your system's data quality from 1 to 5". Yusuf replaces it with what already runs. Each rule is a test with an owner, a threshold agreed with that owner (warn and error, as in *Too good to be true*) and a reason; the scorecard is read from last night's run, by domain and dimension; a failing rule opens an issue for its owner, with a date, and the fix happens at the source (Rosa's team, as in *Too good to be true*).

**Ideas.** The quality dimensions, named once and used as labels: completeness, validity, uniqueness, consistency, timeliness, accuracy. A rule comes from the process or the definition (*Rules with a home*). Prevention at entry beats detection; detection beats a survey. Issues have owners and root causes.

**The enabler.** Tests carrying `meta` (owner, dimension, the rule they enforce); a scorecard generated from dbt's run results; failures routed as issues to owners.

**On screen.** A bar chart of survey answers; beside it, a scorecard drawn from the tests, with one red cell and its owner's name.

**Labs (candidates).** *Which dimension?* *Set the threshold with the owner.*

### 6. Change without surprises

**Opening.** Sweden, 3 September 1967: Dagen H. At 5 a.m., the whole country switches from driving on the left to driving on the right. It took years of preparation, a sign on every road changed overnight, and a campaign everyone saw. The change was huge, and nothing about it was a surprise.

**Story.** The new meaning of *award* changes what `core_award` counts. A change advisory board would meet next month. Instead the pull request carries its impact: the models downstream, the tests that run, the exposures and their owners. Because the meaning of a public model changed, it's a new version, with a deprecation date for the old one (DEC-PRJ-02); the wallet team and Planning are told by name, from the exposures.

**Ideas.** Lineage and impact analysis. Data contracts between source and platform (*Silent change*) and between platform and consumers (*Promises and proofs*). Versions and deprecation. Notification from exposures, not a mailing list. Change control as a step in the pull request.

**The enabler.** Impact on every pull request: changed models and everything downstream, from the manifest; the exposures' owners asked; enforced contracts.

**On screen.** The change as a ripple along the lineage, pausing at each owner until they nod.

**Labs (candidates).** *Breaking or not?* *Who must be told?*

### 7. An agent that checks

**Opening.** Imagined, and labelled so: the university, a few years on, 3 a.m. An agent reviews a change from a faculty's analyst, finds an unclassified column holding dates of birth, and leaves a comment. The analyst fixes it before breakfast.

**Story.** Back to today. Yusuf turns the policy lines that run into a skill an agent can follow: on every pull request, check for an owner, a glossary term (or governance's confirmation that there's none), classified columns, a test for each stated rule, and named impact. The agent drafts classifications for new columns with the evidence for each, finds drift, and flags. It never approves, never edits the glossary, never lowers a test.

**Ideas.** Governance for AI and AI for governance. Agents follow what's written down, so a policy written as a check becomes something an agent can apply (*An agent on the team*). Agents are governed by the same enablers: least privilege, samples rather than bulk personal data, read-only on the glossary, every claim with its evidence.

**The enabler.** A `review-for-governance` skill beside `sync-the-glossary` and `review-metadata`.

**On screen.** The agent's review: three findings, each with its line, the rule it breaks and a proposed fix; a person's approval in gold.

**Labs (candidates).** *Review the agent's review.* *Turn a policy into a check.*

### 8. Make the right thing easy

**Opening.** Bogotá, 1995: the mayor sends mimes into the streets to mock people who cross against the lights or drive carelessly, instead of fining them. With other measures, deaths on the roads fall. People follow a rule more readily when following it is easy, visible and normal.

**Story.** Submission day. The number is the same in the submission and the census report, and its definition is the glossary's. The maturity assessment isn't repeated; the measures now come from the work: how many public models have an owner, a term and classified columns; how long a drift takes to close; how many rule failures were fixed at the source; how long access takes to grant. The binder: of 34 policies, some became checks, some became decisions with owners, and the rest were retired.

**Ideas.** Measure governance by use and by outcome. Start small: one question, one domain, three enablers (owner, term, classification), then the next. Enable first, then enforce. The council's agenda changes from approving documents to deciding exceptions. Governance as a service with users, whose job is to make the right thing the easy thing.

**The enabler.** A governance scorecard generated from the metadata and the runs.

**On screen.** The shelf emptying, line by line, into the loop; a thinner binder that's still there for the decisions only people can make.

**Labs (candidates).** *Measure it from the work.* *Where to start.*

## What the example project gains

So every enabler on screen is real, the series adds to [the example dbt project](../analytics-engineering/project/), and the films draw from it:

| Addition | For film |
|---|---|
| A governance check: owner on every domain, entity and public model; a glossary term or a confirmed absence; every column of a public model classified; tests with `meta` owner and dimension | 2, 4, 5, 7 |
| `CODEOWNERS`, generated from the owners in the metadata | 2 |
| Tags and masks on Databricks applied from `personal_data`, left out on DuckDB (as DEC-PRJ-09 does for keys) | 4 |
| A scorecard generated from the run results, by domain and dimension | 5, 8 |
| An impact report on pull requests, generalised from the glossary sync's | 6 |
| A `review-for-governance` skill | 7 |
| A decision in the project's log: governance's checks, and who owns them | 1, 2 |

## What the series covers, and where

| Topic | Film |
|---|---|
| Governance and management; DAMA-DMBOK and its wheel, named once; policy to enabler | 1 |
| Decision rights; owners, stewards and custodians; federated governance; the council; escalation | 2 |
| Business glossary, data dictionary, catalog; one direction of sync; metadata management | 3 |
| Classification, masking by policy, least privilege, purpose, expiry, retention, access reviews | 4 |
| Quality dimensions, rules as owned tests, thresholds, scorecards, issue management, root cause | 5 |
| Lineage, impact analysis, contracts, versions, deprecation, change control | 6 |
| Agents under governance, and governance by agents; evidence; human approval | 7 |
| Measuring governance; starting small; operating model | 8 |

**Parked:** document and content management; records retention schedules in depth; regulatory specifics by country (kept generic); data ethics as its own film; tool selection for catalogs.

## Overlap with the other series

- ***Written once*** shows the glossary sync from the engineer's side; *One word, one home* shows it from governance's, and recaps in a line.
- ***Who owns what*** draws domains and access; *Who decides* adds decision rights and the routing that makes them real.
- ***Too good to be true*** and ***Promises and proofs*** build the tests; *Rules that run* gives them owners and reads the scorecard from them.
- ***Silent change*** shows a contract with a source; *Change without surprises* puts change control into the pull request.
- ***Rules with a home*** (*The map before the data*) says where a rule belongs in the organisation; this series makes it run.
- ***An agent on the team*** sets the agent's guardrails; *An agent that checks* gives it governance's checks.
- **The master and reference data series** takes over the identity, survivorship and code lists that *Who decides* and *Rules that run* point at.

## Rigour to check when scripting

- **The openings:** Magna Carta's clause on measures and how measures were standardised later (the 1824 Weights and Measures Act and the standards sent to towns); the andon cord and its history at Toyota; the Qin standardisation of script, measures and axle widths; the 1983 census ruling (*Volkszählungsurteil*); Frontinus's *De aquaeductu* and what he found; Dagen H's date, hour and preparation; Bogotá's mimes, their number and what the road-death figures can and can't be credited to.
- **DAMA-DMBOK:** the current edition, and the current names of its knowledge areas and quality dimensions. DCAM, ISO 8000 and ISO/IEC 38505: current versions, named only.
- **Databricks:** Unity Catalog's Glossary (its status, and how a term is read; see *Written once*'s rigour sheet); governed tags, attribute-based access control, column masks and row filters; how dbt-databricks applies tags; data quality monitoring. Product names change: keep them to labels and the rigour sheet.
- **dbt:** `meta` on tests; run results; `state:modified+` for impact; exposures; model versions and deprecation.
- **Privacy:** keep it generic ("in many places, the law…"); no jurisdiction-specific advice.

## Decisions for the author

1. **The series title.** *Off the shelf* · *Rules that run* · *Governance you can use*.
2. **Eight films, or seven.** Merge *An agent that checks* into *Make the right thing easy*.
3. **The new character.** Yusuf Demir, the data governance lead, outlined in gold (the business side), or a name you'd prefer.
4. **The topic on the site.** A new topic, *Data governance*, holding this series and the master and reference data series, or both under *Data quality and change*.
5. **Labs and scenarios:** per film, as in *In the weeds*, or one set for the series, as in *The map before the data*.
6. **Your governance enablers.** Share the checks, templates or policies you use, so the films show them rather than a generic version.

## Next checkpoints

1. The author agrees this proposal and decides the points above.
2. Yusuf's character card, and the binder and loop as components.
3. The project's additions above, starting with the governance check, so the first films draw from real files.
4. A script and rigour sheet for *Off the shelf*.
