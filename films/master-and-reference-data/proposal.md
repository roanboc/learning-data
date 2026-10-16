# Master and reference data, the same one everywhere

*Proposal for a series on master and reference data, v0.1. The folder is named after the topic; the series title is still open. Status: proposed, 16 October 2026. It's the companion of the data governance series, proposed in [`../data-governance/proposal.md`](../data-governance/proposal.md), and shares its decisions.*

## Decided

| Date | Decision |
|---|---|
| 16 October 2026 | A series on master and reference data, beside the data governance series. Both align with the series on definitions and modelling (*From words to data*, *In the weeds of data crafting*). |
| 16 October 2026 | DAMA-DMBOK is the reference body, named once. Very practical, with no over-conceptualisation: each film shows the enabler that keeps master or reference data right in the work, not a plan or an assessment. |

## The brief

From the author (16 October 2026), the same brief as the governance series: draft the storyline and themes; align with the series on definitions and modelling; DAMA as the reference, kept very practical; show the enablers, because governance (and master data with it) often becomes plans, assessments and heavy documentation with little enforcement and no support for real data work.

## Analysis

**What works**

- **The example project already holds master and reference data, without naming it.** The learner arrives three times with three keys (*What makes it the same one*), Mei's identity decisions are a seed (`learner_identity_decisions.csv`), status codes are mapped (`status_map.csv`), faculties approve which microcredentials count (`credit_recognition.csv`), Finance publishes tuition rates (`tuition_rates.csv`), and the faculty sits on the award as two columns from the student system. This series names what's already there, and shows what it takes to keep it right.
- **Master data management is usually sold as a product.** The films show it as a few decisions (what's master, who creates it, which value wins, who decides a match) and a few enablers, most of which a data platform already has. A tool comes later, if ever.
- **Reference data is small and everywhere.** A code list of eight rows can break every report when it changes. It's the easiest place to show an enabler paying off.

**What this proposal adds**

- **Decide per attribute, not per system.** "The student system is the master" is rarely true for every field. The name may come from the student system, the email from where the learner last confirmed it, the faculty from the organisation's structure.
- **A false merge costs more than a missed match.** Two people joined into one shows someone else's credential in a wallet. The series treats matching as a decision with a person accountable, not a score.
- **Reference data has dates.** Codes and hierarchies change; every list carries who published it and from when it applies, so as-was and as-is both work (*One row of what, and when*).
- **Start where you are.** The platform already resolves identity for analytics. The series shows when that's enough, and the lightest step when it isn't.

## The spine: one learner, everywhere

The wallet app shows Aisha two wallets. The short-course platform creates a new customer for every email it's given. The platform knows, in `core_learner`, that several of these are one person, but only the platform knows. The learning team asks: can the systems use the university's learner instead of their own? And can the code lists everyone uses stop living in spreadsheets?

By the end, the university has one learner that every system can read, with each value's source; a steward's queue where matches are decided once; code lists and the faculty structure as owned, dated reference data; and a check at the point of entry that stops most duplicates being made.

## Foundations: DAMA, named once

*The same one, everywhere* names DAMA-DMBOK's reference and master data knowledge area once, with the four ways master data is commonly kept (registry, consolidation, coexistence, centralised) and, in a line, ISO 8000's parts on master data quality. After that, the series teaches what to do.

**The kinds of data, as the films use them:**

| Kind | What it is | In the project |
|---|---|---|
| Master data | The things the business is about, shared across processes and systems | Learner, award; planned: unit of study, organisation unit, staff |
| Reference data | The lists that classify them, often from outside | Status codes, key sets, award types, faculties, field of education, country |
| Transactional data | What happens to them | Enrolments, results, badges issued |
| Metadata | What all of it means, and who owns it | Glossary terms, conceptual models, YAML (the governance series) |

## The world, and the people

**The same university, platform, project and people.** Mei Tanaka is the steward of learner identity (she already decides matches) and owns *award*. Tom Whitfield runs short courses, where most duplicates are made. Noor owns the model, Jun builds it, Rosa runs the admissions system. Prof. David Mensah reads numbers by faculty, and lives through a restructure. Yusuf, from the governance series, appears where a decision right is needed. No new character.

**The look:** each system's record is a card in that system's colour; the master record is glass, each value carrying a small label of where it came from. Reference data is drawn as short, dated lists, pinned where they're used.

## The series at a glance

Seven films of 4 to 6 minutes.

| # | Working title | The enabler | The idea to take away |
|---|---|---|---|
| 1 | **The same one, everywhere** | An inventory: what's master, who creates it, where | Master data is a few decisions, not a product. |
| 2 | **Lists everyone uses** | Reference data as owned, dated tables that tests read | A code list has an owner, a date and one home. |
| 3 | **Same or different** | A steward's queue, with each decision kept | Decide a match once, with a reason, and keep it. |
| 4 | **Which value wins** | Survivorship rules declared per attribute, each value labelled with its source | The rule is declared, not hidden in SQL. |
| 5 | **When the map is redrawn** | A dated hierarchy, with old units mapped to new | Every number by unit says which map it used. |
| 6 | **One record, many systems** | The master published as a data product; search before create | Choose the lightest way that solves the problem. |
| 7 | **Kept, not cleaned** | Stewardship measures; checks at entry; scheduled refreshes | A clean-up decays; prevention lasts. |

## Openings: other places, other times

| Film | Opening | Where | When |
|---|---|---|---|
| 1 | Parish books record every person, and travel with them when they move; later, one number for life | Sweden | 1686, then 1947 |
| 2 | Three-letter airport codes: why Toronto is YYZ, and why nobody changes it | Worldwide | 1930s–today |
| 3 | Martin Guerre: a village accepts the wrong man as the same one | France | 1550s–1560 |
| 4 | A ship carries many chronometers, because when clocks disagree you need a rule for which to trust | HMS Beagle, at sea | 1831 |
| 5 | Three regions become 36 states: every figure "by region" must say which map | Nigeria | 1960–1996 |
| 6 | Countries keep their own post offices and agree one set of rules to exchange mail | Bern, Switzerland | 1874 |
| 7 | Water boards that maintain the dykes, forever | The Netherlands | Since the 1200s |

## The films

### 1. The same one, everywhere

**Opening.** Sweden, 1686: the church law requires every parish to record each person in each household, updated at yearly visits, and a person who moves carries a certificate to the new parish. In 1947 the register gives everyone one number for life. One person, one record, kept by someone, wherever they go.

**Story.** Aisha has two wallets. Tom's platform has three customers that are one learner. Noor draws what the platform already does: it resolves identity for analytics, but no system can ask it. Before choosing a tool, Noor and Mei list, for each key entity on the university's map, which system creates it, which keeps each attribute, and who owns it.

**Ideas.** Master, reference, transactional and metadata, in one picture. DAMA's reference and master data area, named once; the four ways of keeping master data, named once (they return in film 6). Master data management as decisions: what's master, who creates it, which value wins, who decides a match. The difference between a system of record and a system of entry.

**The enabler.** The inventory, written once: for each master entity on the university's map, its systems of entry, its system of record per attribute, and its owner, beside the map in `models/_shared/`.

**On screen.** One learner, three cards in three colours; the inventory as a small matrix that lights per attribute.

**Labs (candidates).** *Master, reference or transactional?* *Fill the inventory.*

### 2. Lists everyone uses

**Opening.** Airport codes: three letters on every bag tag. Toronto is YYZ for reasons older than its airport; Los Angeles is LAX because an X was added when codes grew from two letters to three. A code outlives its reason, because changing it costs everyone.

**Story.** The status codes are mapped in a seed, but the list of allowed statuses is typed again in a test. The microcredentials that count towards each award are approved by faculties in a spreadsheet emailed once a year. The government publishes a new version of a code set the university reports with. Jun moves each list into an owned table with who published it and from when it applies; tests read the list instead of repeating it; a change is a pull request the owner approves.

**Ideas.** Internal and external reference data. Codes and labels. Mappings (crosswalks) between a system's codes and the canonical ones (*What makes it the same one*). Owner and publisher. Effective dates and versions. External lists adopted, not retyped, and refreshed on a schedule.

**The enabler.** Reference tables with `published_by`, `approved_on` and `valid_from` columns; tests that read allowed values from them (`relationships` to the reference table, not a typed list); external lists loaded by a scheduled job, like the glossary sync.

**On screen.** A spreadsheet attachment in an email; then a short, dated list pinned to each test that reads it.

**Labs (candidates).** *Where does this list live?* *Map the codes.*

### 3. Same or different

**Opening.** France, the 1550s: a man returns to a village after years away, claiming to be Martin Guerre. His wife, his family and the village accept him, for years, until the real Martin Guerre walks into the courtroom. A false match, believed by everyone who wanted it to be true.

**Story.** The profile finds learners who share an email, and look-alikes who took the same course on the same day. Some pairs are clear (a student ID typed on the enrolment form); some aren't. Mei's queue: the agent proposes each pair with its evidence; Mei decides same or different, with a reason; the decision is kept and never asked again, and can be undone. One pair is two people with the same student ID typed by mistake (`D-003`): merging them would have put one Aisha's credentials in the other's wallet.

**Ideas.** Match rules: exact (a shared key), and likely (name, date of birth, email), with three outcomes: match, review, no match. False merges and missed matches, and why the first costs more. Link, don't destroy: source records stay as they arrived; the cross-reference joins them (key sets). Stewardship as a queue with an owner and a time limit.

**The enabler.** The steward's queue: profiling queries that propose pairs, a decisions table (`learner_identity_decisions.csv`, grown into a queue) with who, when and why, and tests that every proposed pair has a decision.

**On screen.** Two cards drawn together, and a gold decision card between them: *same*, or *different*, with its reason.

**Labs (candidates).** *Same learner?* *Match, review or no match?*

### 4. Which value wins

**Opening.** 1831: HMS Beagle sails with more than twenty chronometers, because a ship's longitude depends on the time, and clocks drift. When they disagree, the navigator needs a rule, decided before leaving port, for which to trust.

**Story.** Aisha's name, email and status differ across three systems. `core_learner` already chooses: "from the student system if it knows them, then the learning platform, then short courses". The rule is real, but it's written in a description and in SQL, not as a rule anyone can review. Jun declares it per attribute: the name by source order; the email by the most recently confirmed; the status by the canonical map. Each value keeps a label of where it came from and when.

**Ideas.** Survivorship: source priority, recency, completeness, and a steward's override. Rules per attribute, not per system. The golden record keeps each value's source, so a wrong value can be traced and fixed where it was entered. A learner correcting their own details, in the wallet, as a source.

**The enabler.** Survivorship rules in the model's YAML (`meta`), generated into the SQL and tested; a source and a date beside each value.

**On screen.** Three values for one field; a rule card; the winner moves into the glass record, its source label attached.

**Labs (candidates).** *Which value wins?* *Write the rule.*

### 5. When the map is redrawn

**Opening.** Nigeria: three regions at independence in 1960, four in 1963, twelve states in 1967, then nineteen, twenty-one, thirty, and thirty-six by 1996. Any figure "by region" or "by state" has to say which map it used.

**Story.** Two faculties merge in January. Planning's question is "by faculty, as at census date". Today, the faculty is two columns on the award, overwritten by the student system. Which faculty did an award belong to last census? Professor Mensah wants this year's numbers by the new faculty and last year's by both. The faculty structure becomes dated reference data, with old units mapped to new, and the mart offers both roll-ups.

**Ideas.** Hierarchies as master or reference data: organisation units, and what belongs to them. Effective dates on the hierarchy itself. As-was and as-is roll-ups (*One row of what, and when*). Who owns the structure (often not IT, and not the data team).

**The enabler.** An organisation-unit table with `valid_from` and `valid_to`, a mapping from old units to new, and an owner; tests that every award has a faculty at every date.

**On screen.** A tree on a timeline: two branches join; the numbers above it re-roll both ways.

**Labs (candidates).** *As it was, or as it is?* *Redraw the tree.*

### 6. One record, many systems

**Opening.** Bern, 1874: countries keep their own post offices, but agree one set of rules, rates and addresses to exchange mail. Nobody hands their post office over; everyone can deliver everywhere.

**Story.** The wallet, the learning platform and the short-course platform want the university's learner. Noor lays four options side by side: a registry (the cross-reference, read when needed: what exists today), consolidation (one learner for analytics: today's `core_learner`), coexistence (that learner published back for systems to read), centralised (a learner can be created in one place only). The university picks coexistence for the wallet, and one change at entry: the short-course sign-up searches for the learner before creating one.

**Ideas.** The four ways of keeping master data, and what each costs. Choose the lightest that solves the problem. A master record published as a data product, with a contract and a version (*Who owns what*), served live where an app needs it (*Both at once*). Who can create a learner, and where.

**The enabler.** `core_learner` published as a public, versioned data product, readable by systems; a search-before-create call at the point of entry.

**On screen.** Four small diagrams side by side; one lights, and a line runs from the glass record to the wallet.

**Labs (candidates).** *Which way fits?* *Who may create a learner?*

### 7. Kept, not cleaned

**Opening.** The Netherlands, since the 1200s: local water boards maintain the dykes. They're among the oldest public bodies in the country, because a dyke is never finished.

**Story.** Six months after a clean-up project, the duplicates are back, because nothing stopped them being made. With the check at entry, the new-duplicate rate falls and stays down. Mei's queue has an age, and a limit; a new code from the government's list arrives as a pull request with its mapping drafted by the agent; the faculty structure changes on its effective date, not when someone remembers. Yusuf's scorecard, from the governance series, shows the same measures.

**Ideas.** Master data is a process, not a project. Prevention at entry; stewardship measures (queue age, duplicates made per week, reference changes applied on time, values without a source); agents that propose with evidence, and stewards who decide. The hand-back to governance: owners, rules and change.

**The enabler.** Stewardship measures read from the queue, the tests and the reference tables; scheduled refreshes for external lists.

**On screen.** Two lines over a year: after a clean-up, duplicates climb back; after the check at entry, they stay down.

**Labs (candidates).** *Clean-up or prevention?* *Read the steward's measures.*

## What the example project gains

| Addition | For film |
|---|---|
| The master data inventory beside the university's map, in `models/_shared/` | 1 |
| Reference tables with `published_by`, `approved_on`, `valid_from` and `valid_to`; tests that read allowed values from them; one external code set, loaded by a script | 2 |
| Profiling that proposes pairs; `learner_identity_decisions` grown into a queue, with a test that every pair is decided | 3 |
| Survivorship declared in `core_learner`'s YAML, with each value's source and date | 4 |
| An organisation-unit table, dated, with old units mapped to new; both roll-ups in Planning's mart | 5 |
| `core_learner` served to an app, and a search-before-create example | 6 |
| Stewardship measures in the governance scorecard | 7 |

## What the series covers, and where

| Topic | Film |
|---|---|
| Master, reference, transactional and metadata; DAMA, named once; system of record and of entry | 1 |
| Internal and external reference data; codes and mappings; owners; versions and effective dates | 2 |
| Matching; false merges and missed matches; link, don't destroy; stewardship queues | 3 |
| Survivorship per attribute; each value's source; self-service corrections | 4 |
| Hierarchies; dated structures; as-was and as-is roll-ups | 5 |
| Registry, consolidation, coexistence, centralised; master data as a product; search before create | 6 |
| Stewardship as operations; prevention; measures; agents proposing | 7 |

**Parked:** product and supplier master data (other industries); MDM tool selection; probabilistic matching algorithms in depth; address standardisation services.

## Overlap with the other series

- ***What makes it the same one*** resolves identity for one question; *Same or different* makes it a standing service with a queue, and recaps key sets in a line.
- ***One row of what, and when*** builds as-is and as-was; *When the map is redrawn* applies them to a hierarchy.
- ***Both at once*** serves data live to an app; *One record, many systems* serves the master record that way.
- ***Who owns what*** publishes core models as data products; the learner master is one.
- **The governance series** gives the decision rights (*Who decides*), the rules (*Rules that run*) and the change control (*Change without surprises*) this series uses.

## Rigour to check when scripting

- **The openings:** the 1686 Church Law and Sweden's personal identity number (1947); the YYZ and LAX code stories and who assigns codes today; the Martin Guerre case and its sources; how many chronometers HMS Beagle carried; Nigeria's regions and states by year; the Universal Postal Union's founding (the General Postal Union, 1874); the age of the Dutch water boards.
- **DAMA-DMBOK:** the current edition, and how it names the ways of keeping master data. ISO 8000's master data parts.
- **Reference data the university reports with:** which code sets the government's collection (TCSI) uses, how they're versioned, and which one the films show.
- **Databricks:** how a published table is served to an app (*Both at once*'s rigour sheet).

## Decisions for the author

1. **The series title.** *The same one, everywhere* · *One of each* · *Lists everyone uses*.
2. **Seven films, or six.** Merge *Kept, not cleaned* into the governance series' *Make the right thing easy*.
3. **Which external code set** the films show (field of education, country, or another the university reports).
4. **The same topic as governance,** or its own on the site.

## Next checkpoints

1. The author agrees this proposal and decides the points above.
2. The project's additions above, starting with the reference tables and the steward's queue.
3. A script and rigour sheet for *The same one, everywhere*.
