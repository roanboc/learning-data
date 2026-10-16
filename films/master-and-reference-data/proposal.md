# Master and reference data: one person, many roles

*Proposal for a series on master and reference data, v0.2. The folder is named after the topic; the series title is still open. Status: proposed, 16 October 2026. It's the companion of the data governance series, proposed in [`../data-governance/proposal.md`](../data-governance/proposal.md), and shares its decisions.*

## Decided

| Date | Decision |
|---|---|
| 16 October 2026 | A series on master and reference data, beside the data governance series. Both align with the series on definitions and modelling (*From words to data*, *In the weeds of data crafting*). |
| 16 October 2026 | DAMA-DMBOK is the reference body, named once. Very practical, with no over-conceptualisation: each film shows the enabler that keeps master or reference data right in the work, not a plan or an assessment. |
| 16 October 2026 | The series centres on one concept: **the person, and the roles a person can have.** The university is the thread, but the scenario stays generic, and every film shows the same pattern in other industries. |

## The brief

From the author (16 October 2026), the same brief as the governance series: draft the storyline and themes; align with the series on definitions and modelling; DAMA as the reference, kept very practical; show the enablers, because governance (and master data with it) often becomes plans, assessments and heavy documentation with little enforcement and no support for real data work.

Added the same day: focus on the person concept and the roles it might have; a more generic scenario, stating the university but also considering other industries.

## Analysis

**What works**

- **Everyone is a person with roles.** A learner who also tutors, a patient who is also a nurse, a bank customer who guarantees a loan, a household that is both a customer and a generator (*Who it serves, and how it pays*). Every industry has this, and most systems get it wrong the same way: they store the role and call it the person.
- **The example project already shows the problem.** The learner arrives three times with three keys (*What makes it the same one*); two people share a family email; two learners share a typed student ID; Mei decides each match in `learner_identity_decisions.csv`. But the project models a *learner*, a role, not a person. The series makes that its first correction, in the open (PLAYBOOK §8).
- **Master data management is usually sold as a product.** The films show it as a few decisions (what's a person, which roles exist, who creates each, which value wins, who decides a match, what each role may see) and a few enablers, most of which a data platform already has.

**What this proposal adds**

- **Person, role, contact point and identifier are four different things.** A person is someone; a role is how they relate to the organisation, for a time; a contact point (an email, an address) can be shared or change by purpose; an identifier belongs to a system or a role, not to the person.
- **Decide per attribute, not per system.** The legal name from the student system, the preferred name from the person, the work email from HR, the personal email from where the person last confirmed it.
- **A false merge costs more than a missed match.** Two people joined into one shows someone else's record in an app. Matching is a decision with a person accountable, not a score.
- **Purpose travels with the role.** What a person told the university as a learner isn't automatically available to the team that asks alumni for donations. The master record is where that's honoured, and where a request to be forgotten reaches every role.
- **Start where you are.** The platform already resolves identity for analytics. The series shows when that's enough, and the lightest step when it isn't.

## The spine: one person, many roles

**Linh Nguyen** is a graduate student at the university. She took a short course before enrolling, signing up with her family's shared email, the one her mother Minh also uses. This year she tutors a first-year unit, on a casual contract, so the HR system knows her by a staff number. Next year she'll graduate, and the alumni office will ask her to give.

Four systems, four records, four ideas of who Linh is: a student, a customer, an employee, an alumna. The platform knows two of them are the same person; nobody knows all four are. When Linh changes her email, three of them don't hear. When she asks the university what it holds about her, nobody can answer in one place.

By the end, the university has one person that every system can read, with roles that start and end, each value labelled with its source, matches decided once by a steward, the lists that classify people owned and dated, and each role's data used only for its purpose.

## The same pattern elsewhere

The university is the thread; each film has a short beat, *Elsewhere*, that shows the same decision in another industry:

| Industry | The person | Roles they can hold at once, or over time | The typical mistake |
|---|---|---|---|
| University | Linh | Applicant, learner, short-course customer, tutor, alumna, donor | A learner, a staff member and an alumna, never joined |
| Health | A patient | Patient, carer, next of kin, staff member, research participant | Two records for one patient, or one record for two |
| Banking | A customer | Account holder, joint holder, guarantor, beneficial owner, employee | A guarantor not linked to the customer they guarantee |
| Energy utility | A household member (*The map before the data*) | Account holder, occupant, life-support customer, solar generator | The account holder taken for the person who lives there |
| Retail | A shopper | Online customer, loyalty member, gift recipient, marketplace seller | One person per email, so a shared family email is one shopper |
| Public sector | A resident | Taxpayer, benefit recipient, licence holder, voter | Each agency asks again for what another already knows ("once only", *Rules with a home*) |

## Foundations: DAMA, named once

*One person, many roles* names DAMA-DMBOK's reference and master data knowledge area once, with the four ways master data is commonly kept (registry, consolidation, coexistence, centralised) and, in a line, the party pattern that data model pattern books describe (a party is a person or an organisation; a role is how a party relates to another) and ISO 8000's parts on master data quality. After that, the series teaches what to do.

**The kinds of data, as the films use them:**

| Kind | What it is | Here |
|---|---|---|
| Master data | The things the business is about, shared across processes and systems | The person and their roles; also the award and the organisation (parked here) |
| Reference data | The lists that classify them, often from outside | Role types, identifier types, relationship types, countries, consent purposes, status codes |
| Transactional data | What happens to them | Enrolments, results, contracts, donations |
| Metadata | What all of it means, and who owns it | The glossary, the conceptual model, YAML (the governance series) |

## The world, and the people

**The same university, platform, project and people.** Mei Tanaka's office becomes the steward of the person: who someone is, and whether two records are one. Each role stays with the domain that owns it: the registrar's office for learners, People and culture for staff, Advancement for alumni and donors, Tom Whitfield's short courses for customers. Noor owns the model, Jun builds it, Yusuf (from the governance series) names who decides. **Linh Nguyen**, already in the project's data, becomes the series' person; her mother Minh appears once.

**The look:** each role is a card in its system's colour, worn by the same figure; the person is glass, with each value carrying a small label of where it came from, and each role a band with a start and an end. The *Elsewhere* beats keep the same figure and change the cards: a hospital band, a bank card, a meter.

## The series at a glance

Eight films of 4 to 6 minutes.

| # | Working title | The enabler | The idea to take away |
|---|---|---|---|
| 1 | **One person, many roles** | Person, role, contact point and identifier, modelled apart | Don't store the role and call it the person. |
| 2 | **Who is it?** | Identifiers by type and system; a steward's queue for matches | Decide a match once, with a reason, and keep it. |
| 3 | **Which value wins** | Survivorship per attribute; contact points by purpose | The rule is declared, not hidden in SQL. |
| 4 | **Roles come and go** | Dated roles and relationships | A role has a start and an end; the person stays. |
| 5 | **Lists everyone uses** | Role, identifier and relationship types as owned, dated reference data | A code list has an owner, a date and one home. |
| 6 | **For this purpose only** | Purpose and consent on each role; one place to answer "what do you hold about me?" | Data given for one role isn't free for every role. |
| 7 | **One person, many systems** | The person published as a data product; search before create | Choose the lightest way that solves the problem. |
| 8 | **Kept, not cleaned** | Stewardship measures; checks at entry | A clean-up decays; prevention lasts. |

## Openings: other places, other times

| Film | Opening | Where | When |
|---|---|---|---|
| 1 | Parish books record every person, and travel with them when they move; later, one number for life | Sweden | 1686, then 1947 |
| 2 | Martin Guerre: a village accepts the wrong man as the same one | France | 1550s–1560 |
| 3 | A ship carries many chronometers, because when clocks disagree you need a rule for which to trust | HMS Beagle, at sea | 1831 |
| 4 | A career of public offices, each held for a year, all recorded against one name | Rome | 2nd century BC |
| 5 | Three-letter airport codes: why Toronto is YYZ, and why nobody changes it | Worldwide | 1930s–today |
| 6 | The physician's oath: what is learned in care stays for care | Greece | About 400 BC |
| 7 | Countries keep their own post offices and agree one set of rules to exchange mail | Bern, Switzerland | 1874 |
| 8 | Water boards that maintain the dykes, forever | The Netherlands | Since the 1200s |

## The films

### 1. One person, many roles

**Opening.** Sweden, 1686: the church law requires every parish to record each person in each household, updated at yearly visits, and a person who moves carries a certificate to the new parish. In 1947 the register gives everyone one number for life. One person, one record, kept by someone, wherever they go, whatever they do.

**Story.** Linh changes her email. The student system updates; the short-course platform still writes to the family address, where Minh reads it; HR's payslips go to the old one. Noor looks at the project and corrects it in the open: `core_learner` is a role. The model has no person. She draws four things apart: the person (someone, once); the roles (learner, customer, tutor, alumna), each with its owner and dates; the contact points (an email can be shared, and has a purpose); and the identifiers (a student ID belongs to the student system, a staff number to HR).

**Ideas.** Master, reference, transactional and metadata, in one picture. DAMA's reference and master data area and the four ways of keeping master data, named once (they return in film 7). The party pattern in one line: a person or an organisation, and the roles that relate them. A system of record per attribute, and a system of entry per role.

**Elsewhere.** A hospital nurse admitted as a patient: the staff system and the patient system each have her, and neither should show the other's data.

**The enabler.** The person and role model in the conceptual model, beside the university's map, and an inventory of which system creates each role and keeps each attribute.

**On screen.** One figure wearing four cards; the cards slide off into four bands; the figure turns to glass.

**Labs (candidates).** *Person, role, contact point or identifier?* *Fill the inventory.*

### 2. Who is it?

**Opening.** France, the 1550s: a man returns to a village after years away, claiming to be Martin Guerre. His wife, his family and the village accept him, for years, until the real Martin Guerre walks into the courtroom. A false match, believed by everyone who wanted it to be true.

**Story.** HR's casual staff file has a Linh Nguyen with a different date of birth from the student system's (a typo), and the short-course platform has one email for Linh and Minh. Some pairs are clear (Linh gave her student ID on the enrolment form); some aren't. Mei's queue: the agent proposes each pair with its evidence; Mei decides same or different, with a reason; the decision is kept, never asked again, and can be undone. One pair is two people with the same student ID typed by mistake (`D-003`): merging them would have shown one person's results in the other's wallet.

**Ideas.** Identifiers by type and by issuer, qualified by where they come from (key sets). Match rules: exact (a shared identifier) and likely (name, date of birth, contact point), with three outcomes: match, review, no match. False merges and missed matches, and why the first costs more. Link, don't destroy: source records stay as they arrived; the cross-reference joins them. Stewardship as a queue with an owner and a time limit.

**Elsewhere.** A hospital merges two patient records; a test result follows the wrong one. Health systems keep a person's identifiers by issuer for exactly this reason.

**The enabler.** The steward's queue: profiling queries that propose pairs, a decisions table (`learner_identity_decisions.csv`, grown into a person queue) with who, when and why, and a test that every proposed pair is decided.

**On screen.** Two cards drawn together, and a gold decision card between them: *same*, or *different*, with its reason.

**Labs (candidates).** *Same person?* *Match, review or no match?*

### 3. Which value wins

**Opening.** 1831: HMS Beagle sails with more than twenty chronometers, because a ship's longitude depends on the time, and clocks drift. When they disagree, the navigator needs a rule, decided before leaving port, for which to trust.

**Story.** Linh's name, emails and address differ across four systems. `core_learner` already chooses: "from the student system if it knows them, then the learning platform, then short courses". The rule is real, but it's written in a description and in SQL, for one role. Jun declares it for the person, per attribute: the legal name from the student system; the preferred name from Linh herself; each email kept as a contact point with its purpose (study, work, personal) and when it was last confirmed; the family email marked as shared. Each value keeps a label of where it came from and when.

**Ideas.** Survivorship: source priority, recency, completeness, and a steward's override. Rules per attribute, not per system. Legal and preferred names, and why both matter. Contact points by purpose instead of one "email" column. The person correcting their own details as a source.

**Elsewhere.** A bank holds a customer's legal name for the account and a preferred name for the app; a joint account's address is shared by two people, and belongs to neither alone.

**The enabler.** Survivorship rules in the model's YAML (`meta`), generated into the SQL and tested; a source and a date beside each value; contact points as their own table.

**On screen.** Three values for one field; a rule card; the winner moves into the glass record, its source label attached.

**Labs (candidates).** *Which value wins?* *Write the rule.*

### 4. Roles come and go

**Opening.** Rome, the 2nd century BC: an ambitious citizen climbs a ladder of public offices, each held for a year, in a set order, and the records list every office against one name. The same person, a sequence of roles, each with its dates.

**Story.** Linh was an applicant, then a short-course customer, then a learner; she's a tutor this semester only; next year she'll be an alumna, and maybe a donor. Planning asks how many current students also work for the university, as at census; Advancement asks who graduated in 2027. Each role becomes a dated band on the person: who owns it, when it started, when it ended, and what it relates the person to (a course, a faculty, a contract). People relate to each other too: a supervisor, a next of kin.

**Ideas.** Roles as dated relationships between a person and the organisation (or another party). Concurrent and successive roles. Role lifecycles (applicant to alumna). As-was and as-is, applied to roles (*One row of what, and when*). Relationships between people. Who owns each role.

**Elsewhere.** A utility's account holder moves out; the occupant stays, and is on life support. The role ended; the person and the risk didn't (*How value reaches people*).

**The enabler.** A role table with type, owner, `valid_from` and `valid_to`, and what it relates to; tests that a role can't end before it starts and that every role has a person.

**On screen.** A timeline of bands under one figure, overlapping and ending; a census line drawn across them.

**Labs (candidates).** *Which roles, on census day?* *Draw Linh's timeline.*

### 5. Lists everyone uses

**Opening.** Airport codes: three letters on every bag tag. Toronto is YYZ for reasons older than its airport; Los Angeles is LAX because an X was added when codes grew from two letters to three. A code outlives its reason, because changing it costs everyone.

**Story.** The role types are typed differently in every system ("Casual Academic", "CAS", "tutor"); the identifier types aren't listed anywhere; the status codes are mapped in a seed but typed again in a test; the country list is three different versions. Jun moves each list into an owned table with who published it and from when it applies: role types, identifier types, relationship types, consent purposes, countries from the international standard. Tests read the lists instead of repeating them; a change is a pull request the owner approves. Lists that describe people (titles, gender) are kept inclusive, minimal and asked for only with a purpose.

**Ideas.** Internal and external reference data. Codes and labels. Mappings between a system's codes and the canonical ones (`status_map.csv`). Owner and publisher. Effective dates and versions. External lists adopted, not retyped, and refreshed on a schedule. Reference data about people is personal in its effect.

**Elsewhere.** A bank's list of customer types decides which checks a customer goes through; a hospital's list of relationship types decides who may be told about a patient.

**The enabler.** Reference tables with `published_by`, `approved_on`, `valid_from` and `valid_to`; tests that read allowed values from them; external lists loaded by a scheduled job, like the glossary sync.

**On screen.** A spreadsheet attachment in an email; then a short, dated list pinned to each test that reads it.

**Labs (candidates).** *Where does this list live?* *Map the codes.*

### 6. For this purpose only

**Opening.** Greece, about 400 BC: the physician's oath promises that what is seen or heard in the course of care stays private. What a person tells you for one purpose isn't yours for every purpose.

**Story.** Advancement wants to invite this year's high achievers to give. The learner's results were collected to award a degree, not to raise money. With the person and the roles apart, the question has an answer: each role carries the purposes its data may be used for, and the person's consent where it's needed. Then Linh asks the university what it holds about her, and later asks it to delete her short-course account. Both reach every role from one place, and the platform shows each value's source, so each system can act.

**Ideas.** Purpose limitation by role. Consent as data, with a purpose, a date and a way to withdraw. Requests for access, correction and deletion, answered from the master record. The master record as the place where privacy is honoured, not only where duplicates are removed (*Who may see it*, in the governance series). Kept generic: "in many places, the law…".

**Elsewhere.** A retailer's loyalty data, given for discounts, used for credit decisions; a hospital's research participant whose consent covers one study, not all.

**The enabler.** Purposes and consent on each role, as data; policies that filter by purpose on the platform; a request workflow that finds every role from the person.

**On screen.** Linh's glass record; one band lights, and only the doors marked with its purpose open.

**Labs (candidates).** *May this team use it?* *Answer the request.*

### 7. One person, many systems

**Opening.** Bern, 1874: countries keep their own post offices, but agree one set of rules, rates and addresses to exchange mail. Nobody hands their post office over; everyone can deliver everywhere.

**Story.** The wallet, HR, the short-course platform and Advancement's system all want the university's person. Noor lays four options side by side: a registry (the cross-reference, read when needed: what exists today), consolidation (one person for analytics: today's `core_learner`, widened), coexistence (that person published back for systems to read), centralised (a person can be created in one place only). The university picks coexistence for the wallet and HR, and one change at entry: the short-course sign-up searches for the person before creating one.

**Ideas.** The four ways of keeping master data, and what each costs. Choose the lightest that solves the problem. The person published as a data product, with a contract and a version (*Who owns what*, *A product with an owner*), served live where an app needs it (*Both at once*). Who may create a person, and who may only add a role.

**Elsewhere.** A bank's customer hub, which every product system reads; a government's population register, which every agency asks instead of keeping its own.

**The enabler.** The person published as a public, versioned data product, readable by systems; a search-before-create call at the point of entry.

**On screen.** Four small diagrams side by side; one lights, and lines run from the glass record to each system.

**Labs (candidates).** *Which way fits?* *Create a person, or add a role?*

### 8. Kept, not cleaned

**Opening.** The Netherlands, since the 1200s: local water boards maintain the dykes. They're among the oldest public bodies in the country, because a dyke is never finished.

**Story.** Six months after a clean-up project, the duplicates are back, because nothing stopped them being made. With the check at entry, new duplicates fall and stay down. Mei's queue has an age and a limit; a role that should have ended (a tutor whose contract finished) is flagged; a new value in a government list arrives as a pull request with its mapping drafted by the agent. Yusuf's scorecard, from the governance series, shows the same measures.

**Ideas.** Master data is a process, not a project. Prevention at entry; stewardship measures (queue age, duplicates made per week, roles past their end date, values without a source, requests answered on time); agents that propose with evidence, and stewards who decide. The hand-back to governance: owners, rules and change.

**Elsewhere.** Any industry: the clean-up project that's repeated every three years, and the one check at entry that ends it.

**The enabler.** Stewardship measures read from the queue, the roles, the tests and the reference tables; checks at entry.

**On screen.** Two lines over a year: after a clean-up, duplicates climb back; after the check at entry, they stay down.

**Labs (candidates).** *Clean-up or prevention?* *Read the steward's measures.*

## What the example project gains

| Addition | For film |
|---|---|
| A person entity in the university's map and the student domain's conceptual model (or a new `party` domain), with roles, contact points and identifiers apart; `core_learner` becomes a role | 1 |
| A small HR source with casual staff, and an Advancement source with alumni, each a new key set, so Linh appears in four systems | 1, 2, 4 |
| `learner_identity_decisions` grown into a person queue, with a test that every proposed pair is decided | 2 |
| Survivorship declared in YAML per attribute, with each value's source and date; contact points with purpose | 3 |
| A dated role table, and an as-at-census question across roles | 4 |
| Reference tables for role, identifier and relationship types, consent purposes and countries, with owners and dates; tests that read them | 5 |
| Purposes and consent on roles; an example access request answered from the person | 6 |
| The person served to an app, and a search-before-create example | 7 |
| Stewardship measures in the governance scorecard | 8 |

## What the series covers, and where

| Topic | Film |
|---|---|
| Master, reference, transactional and metadata; DAMA, named once; the party pattern; person, role, contact point, identifier | 1 |
| Identifiers by type and issuer; matching; false merges and missed matches; link, don't destroy; stewardship queues | 2 |
| Survivorship per attribute; legal and preferred names; contact points by purpose; self-service corrections | 3 |
| Role lifecycles; concurrent roles; dated relationships; as-was and as-is | 4 |
| Reference data: internal and external lists, mappings, owners, versions, effective dates; inclusive lists about people | 5 |
| Purpose limitation, consent, access and deletion requests, from the master record | 6 |
| Registry, consolidation, coexistence, centralised; the person as a product; search before create | 7 |
| Stewardship as operations; prevention; measures; agents proposing | 8 |

**Parked:** organisations as parties in depth (employers, suppliers, partner universities); organisation hierarchies and restructures; product and asset master data; MDM tool selection; probabilistic matching algorithms in depth; address standardisation services.

## Overlap with the other series

- ***What makes it the same one*** resolves a learner's identity for one question; *Who is it?* makes it a standing service for the person, and recaps key sets in a line.
- ***One row of what, and when*** builds as-is and as-was; *Roles come and go* applies them to roles.
- ***Both at once*** serves data live to an app; *One person, many systems* serves the person that way.
- ***Who it serves, and how it pays*** and ***Who does it, and where meaning changes*** (*The map before the data*) show one word, "customer", meaning a person to one domain and a connection point to another; this series models the person under both.
- **The governance series** gives the decision rights (*Who decides*), the protection (*Who may see it*), the products (*A product with an owner*) and the change control (*Change without surprises*) this series uses.

## Rigour to check when scripting

- **The openings:** the 1686 Church Law and Sweden's personal identity number (1947); the Martin Guerre case and its sources; how many chronometers HMS Beagle carried; the *cursus honorum*, its order and the minimum ages, without overstating how fixed it was; the YYZ and LAX code stories and who assigns codes today; the Hippocratic oath's wording on confidentiality and its date; the Universal Postal Union's founding (the General Postal Union, 1874); the age of the Dutch water boards.
- **DAMA-DMBOK:** the current edition, and how it names the ways of keeping master data. ISO 8000's master data parts. The party pattern's usual sources (data model pattern books), named only.
- **Privacy:** keep it generic; no jurisdiction-specific advice; lists about people (titles, gender) checked against current inclusive practice.
- **Industry examples:** each *Elsewhere* beat plausible and generic; no real organisation.
- **Databricks:** how a published table is served to an app (*Both at once*'s rigour sheet); filtering by purpose with attribute-based policies (the governance series' *Governed in Unity Catalog*).

## Decisions for the author

1. **The series title.** *One person, many roles* · *Who is it?* · *The same one, everywhere*.
2. **The person in the project.** A new `party` domain holding the person, or the person in the student domain with roles from other domains.
3. **Linh as the series' person,** from the project's data, or a new character.
4. **Organisations as parties.** Parked here; a film of their own (employers, partners, suppliers), or a later series.
5. **The same topic as governance,** or its own on the site.

## Next checkpoints

1. The author agrees this proposal and decides the points above.
2. The project's additions above, starting with the person and role model and the two new sources.
3. A script and rigour sheet for *One person, many roles*.
