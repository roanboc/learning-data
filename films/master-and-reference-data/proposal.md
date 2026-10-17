# Master and reference data: one person, many roles

*Proposal for a series on master and reference data, v0.3. The folder is named after the topic; the series title is a working one, The same one, everywhere. Status: proposed, 16 October 2026. It's the companion of the data governance series, proposed in [`../data-governance/proposal.md`](../data-governance/proposal.md), and shares its decisions.*

## Decided

| Date | Decision |
|---|---|
| 16 October 2026 | A series on master and reference data, beside the data governance series. Both align with the series on definitions and modelling (*From words to data*, *In the weeds of data crafting*). |
| 16 October 2026 | DAMA-DMBOK is the reference body, named once. Very practical, with no over-conceptualisation: each film shows the enabler that keeps master or reference data right in the work, not a plan or an assessment. |
| 16 October 2026 | The series centres on one concept: **the person, and the roles a person can have.** The university is the thread, but the scenario stays generic, and every film shows the same pattern in other industries. |
| 16 October 2026 | This series is made first, starting with *One person, many roles*; the governance series follows, so its films can link to these. |
| 16 October 2026 | One film shows a master data hub at work, with LakeFusion (a Databricks-native MDM product) as the example; another tool could take its place. It shows reconciliation rules, the new agentic helpers, and the features worth seeing: explanations, undo, review, and changes sent on to other systems. |
| 16 October 2026 | The series is more colourful than the other series: each role, system and industry has its own bright colour, and the person's record gathers them. |
| 16 October 2026 | *One person, many roles* ends with more master entities from other industries, and the test for when an entity needs mastering. *Who is it?* opens with the difference between master and reference data, and what a master, or golden, record is. |
| 16 October 2026 | Every film shows at least one concrete example, with real-looking values, so viewers can picture it. |
| 16 October 2026 | The look is watercolour: daylight landscapes in soft washes on paper, drawn in pencil, chosen from seven looks drawn from moments of *One person, many roles* ([reference frames](look/)). The role colours are the strongest washes on screen, so they carry the meaning; sky and land stay soft. |
| 17 October 2026 | *One person, many roles* is built: 5½ minutes, twelve chapters, in watercolour. What changed from the script on the way is in its script's *Built* section. |
| 17 October 2026 | The working series title is *The same one, everywhere* (*El mismo, en todas partes*), on the title card and the site, until the author chooses another. |
| 17 October 2026 | On the site, the series has its own topic, *Master and reference data*, at `master-and-reference-data/`. The governance series can join it or take its own. |
| 17 October 2026 | Spanish is captions and page content only, never the video's pictures (the author, 16 October 2026). The captions are Latin American Spanish, about as long as each English line. |
| 17 October 2026 | The film stops for Pause and think after chapters 3, 6, 7 and 10, one question each. No labs or scenarios until the series has more films. |
| 17 October 2026 | The sound is the series' own: chords that bloom note by note, a clarinet for the mark (1-8-5-1), a plucked note for each role, a bowed D and A for the person. The music sits about 21 dB under the voice, as in *The map before the data*; the one pulse, where HR's letter reaches the old flat, about 8 dB under the music. |
| 17 October 2026 | *One person, many roles* is a move, after the author's review: Linh moves in with her brother, Minh, and tells only the student system; the alumni office, HR and the research office keep her old address, and HR posts her next contract, with her pay, to a flat where someone else lives now. The shared family email leaves the film (the author found it hard to follow). Where a later film uses the project's shared email (`D-001`), it says how it happens: Linh signed up for a short course in her school days with the family's address, which Minh used too. |
| 17 October 2026 | A university doesn't call people customers (the author): Linh's roles are student, casual tutor, researcher and alumna (and once applicant, one day perhaps donor). The role colours: student teal, applicant amber, researcher coral, tutor violet, alumna green, donor magenta. A cross is red ink, and the series' parts wear no role's colour. |
| 17 October 2026 | The opening landscape has no bridge: the church stands on a wider hill, with the lake on both sides (the author found the bridge oddly placed). |
| 17 October 2026 | *One person, many roles* shows the rest of the series in four parts, in two lines: who someone is (*Who is it?*, *Which value wins*), roles and lists (*Roles come and go*, *Lists everyone uses*), sharing it safely (*For this purpose only*, *One person, many systems*), and keeping it right (*A hub at work*, *Kept, not cleaned*). Each part is named, and its two films set beside it. |

## The brief

From the author (16 October 2026), the same brief as the governance series: draft the storyline and themes; align with the series on definitions and modelling; DAMA as the reference, kept very practical; show the enablers, because governance (and master data with it) often becomes plans, assessments and heavy documentation with little enforcement and no support for real data work.

Added the same day: focus on the person concept and the roles it might have; a more generic scenario, stating the university but also considering other industries.

And later: start with the opening film of this series, then governance, so the pieces link. One film can show LakeFusion as an MDM tool, though it could be another. Show reconciliation rules, the new agentic helpers and other interesting features, with at least one example each time so people can picture it.

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

**Linh Nguyen** did her first degree at the university, so the alumni office knows her, and is back as a graduate student in health informatics. She tutors a first-year unit on a casual contract, so the HR system knows her by a staff number, and this year she joined a research project, so the research office has her too. This month she moves in with her brother, Minh Nguyen.

Four systems, four records, four ideas of who Linh is: a student, an alumna, a casual tutor, a researcher. Nobody knows all of them are the same person. When Linh changes her address, three of them don't hear, and HR posts her contract to a flat where someone else lives now. When she asks the university what it holds about her, nobody can answer in one place.

By the end, the university has one person that every system can read, with roles that start and end, each value labelled with its source, matches decided once by a steward, the lists that classify people owned and dated, and each role's data used only for its purpose.

## The same pattern elsewhere

The university is the thread; each film has a short beat, *Elsewhere*, that shows the same decision in another industry:

| Industry | The person | Roles they can hold at once, or over time | The typical mistake |
|---|---|---|---|
| University | Linh | Applicant, student, tutor, researcher, alumna, donor | A student, a staff member, a researcher and an alumna, never joined |
| Health | A patient | Patient, carer, next of kin, staff member, research participant | Two records for one patient, or one record for two |
| Banking | A customer | Account holder, joint holder, guarantor, beneficial owner, employee | A guarantor not linked to the customer they guarantee |
| Energy utility | A household member (*The map before the data*) | Account holder, occupant, life-support customer, solar generator | The account holder taken for the person who lives there |
| Retail | A shopper | Online customer, loyalty member, gift recipient, marketplace seller | One person per email, so a shared family email is one shopper |
| Public sector | A resident | Taxpayer, benefit recipient, licence holder, voter | Each agency asks again for what another already knows ("once only", *Rules with a home*) |

## Foundations: DAMA, named once

*One person, many roles* names DAMA-DMBOK's reference and master data knowledge area once, with the four ways master data is commonly kept (registry, consolidation, coexistence, centralised) and, in a line, the party pattern that data model pattern books describe (a party is a person or an organisation; a role is how a party relates to another) and ISO 8000's parts on master data quality. After that, the series teaches what to do.

Which of DAMA's knowledge areas each series and film covers is mapped once, in [the governance proposal](../data-governance/proposal.md#foundations-dama-named-once). As there, master data is people's work first: stewards who decide, owners who agree what a person and a role are, and help for the teams whose systems change. The tools keep what they decide.

**The kinds of data, as the films use them:**

| Kind | What it is | Here |
|---|---|---|
| Master data | The things the business is about, shared across processes and systems | The person and their roles; also the award and the organisation (parked here) |
| Reference data | The lists that classify them, often from outside | Role types, identifier types, relationship types, countries, consent purposes, status codes |
| Transactional data | What happens to them | Enrolments, results, contracts, donations |
| Metadata | What all of it means, and who owns it | The glossary, the conceptual model, YAML (the governance series) |

## The world, and the people

**The same university, platform, project and people.** Mei Tanaka's office becomes the steward of the person: who someone is, and whether two records are one. Each role stays with the domain that owns it: the registrar's office for students, HR for staff, the research office for researchers, Advancement (the alumni office) for alumni and donors. Noor owns the model, Jun builds it, Yusuf (from the governance series) names who decides. **Linh Nguyen**, already in the project's data, becomes the series' person; Minh appears once.

**The look: watercolour.** Lighter and more colourful than the other series: daylight landscapes in soft washes on warm paper, drawn in pencil, instead of their dark glass. Each role has its own saturated colour, kept in every film: student teal, applicant amber, researcher coral, tutor violet, alumna green, donor magenta. Each system's cards wear their role's colour as a brushstroke behind the title; each industry in the *Elsewhere* beats has its own (health red, banking blue, energy yellow, retail orange, public sector green-blue). The role colours are the strongest washes on screen, and sky and land stay soft, so colour reads as meaning. The person, as the master record, is the white of the paper in a pencil line, and gathers the colours: each value carries a small coloured label of where it came from, and each role a band of wash with a start and an end, so a golden record reads at a glance as a mix of sources. Reference data is drawn as bright tabs and chips. Colour always means something (a role, a source, an industry), and every colour is checked for contrast and paired with a label, so nothing depends on colour alone.

## The series at a glance

Nine films of 4 to 6 minutes.

| # | Working title | The enabler | The idea to take away |
|---|---|---|---|
| 1 | **One person, many roles** | Person, role, contact point and identifier, modelled apart | Don't store the role and call it the person. |
| 2 | **Who is it?** | Identifiers by type and system; a steward's queue for matches | Decide a match once, with a reason, and keep it. |
| 3 | **Which value wins** | Survivorship per attribute; contact points by purpose | The rule is declared, not hidden in SQL. |
| 4 | **Roles come and go** | Dated roles and relationships | A role has a start and an end; the person stays. |
| 5 | **Lists everyone uses** | Role, identifier and relationship types as owned, dated reference data | A code list has an owner, a date and one home. |
| 6 | **For this purpose only** | Purpose and consent on each role; one place to answer "what do you hold about me?" | Data given for one role isn't free for every role. |
| 7 | **One person, many systems** | The person published as a data product; search before create | Choose the lightest way that solves the problem. |
| 8 | **A hub at work** | An MDM hub on the platform: reconciliation rules, a steward's inbox, AI helpers that suggest, undo, review, a change feed | Rules act, AI suggests, people decide, and everything can be explained and undone. |
| 9 | **Kept, not cleaned** | Stewardship measures; checks at entry | A clean-up decays; prevention lasts. |

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
| 8 | None: it opens on the hub's screen, as the governance series' tools films do | The university | Today |
| 9 | Water boards that maintain the dykes, forever | The Netherlands | Since the 1200s |

## The films

### 1. One person, many roles

**Opening.** Sweden, 1686: the church law requires every parish to record each person in each household, updated at yearly visits, and a person who moves carries a certificate to the new parish. In 1947 the register gives everyone one number for life. One person, one record, kept by someone, wherever they go, whatever they do.

**Story.** Linh moves in with her brother, Minh, and tells the student system her new address. The alumni office, HR (where she tutors) and the research office don't hear, and HR posts her next contract, with her pay, to the old flat, where someone else lives now. Noor looks at the project and corrects it in the open: `core_learner` is a role. The model has no person. She draws four things apart: the person (someone, once); the roles (student, tutor, researcher, alumna), each with its owner and dates; the contact points (an address can be shared, and has a purpose); and the identifiers (a student number belongs to the student system, a staff number to HR).

**Ideas.** Master, reference, transactional and metadata, in one picture. DAMA's reference and master data area and the four ways of keeping master data, named once (they return in *One person, many systems*). The party pattern in one line: a person or an organisation, and the roles that relate them. The same idea in enterprise architecture, in one line and one picture: an actor (a person, a team or an organisation) is assigned to one or more roles, for a time, which links this series to *The map before the data*'s modelling. A system of record per attribute, and a system of entry per role.

**More master entities, and the test.** The film ends by widening out: the university also masters organisations (employers, partner universities), awards and units of study, places (campuses, buildings, rooms); a hospital masters patients, practitioners and facilities; a bank, customers, accounts and counterparties; a utility, connection points, meters and assets; a retailer, products, suppliers and stores. Which ones need mastering? Four questions: is it a thing the business is about (a noun, not an event)? Is it used by more than one process or system? Is it created or changed in more than one place, so copies can disagree? And does it matter when they do (money, safety, the law, or a person's trust)? Yes to all four: master it. A short list that classifies things is reference data instead (*Who is it?*), and an event is a transaction.

**Elsewhere.** A hospital nurse admitted as a patient: the staff system and the patient system each have her, and neither should show the other's data.

**The enabler.** The person and role model in the conceptual model, beside the university's map, and an inventory of which system creates each role and keeps each attribute.

**On screen.** One figure wearing four coloured cards; the cards slide off into four lanes; the figure clears to white paper, banded in their colours. At the end, a gallery of master entities across industries, each in its industry's colour, and the four questions as a checklist that lights for some and not others.

**Labs (candidates).** *Person, role, contact point or identifier?* *Fill the inventory.*

### 2. Who is it?

**Opening.** France, the 1550s: a man returns to a village after years away, claiming to be Martin Guerre. His wife, his family and the village accept him, for years, until the real Martin Guerre walks into the courtroom. A false match, believed by everyone who wanted it to be true.

**First, two words people confuse.** Master data is the things the business is about: Linh, an award, a supplier, a meter. Reference data is the short lists used to sort and describe them: countries, role types, statuses, currencies. Master data has many rows, keeps growing, and its records have to be matched and reconciled across systems; reference data has few rows, changes rarely, often comes from outside (a standard's country list), and is picked from, not matched. A test: if you'd ever ask "is this the same one as that?", it's master data; if you only ever choose a value from a list, it's reference data. Some lists sit on the line (faculties, products): they're master data once they have their own attributes, owners and lifecycles.

**And what a master record is.** A master record (often called a golden record) is the one trusted version of a thing, put together from every source that knows it: a stable ID of its own that never changes or gets reused; the best value for each attribute, each labelled with the source and rule that chose it; and links to every source record it came from, which stay as they arrived. It's not a copy of the best system's row, and it's not a record no one can trace: it can be explained, value by value, and undone, link by link.

**Story.** HR's casual staff file has a Linh Nguyen with a different date of birth from the student system's (a typo), and the short-course platform has one email for Linh and Minh, from a course Linh signed up for in her school days with the family's address, which Minh used too. Some pairs are clear (Linh confirmed she took the short course, decision `D-001`); some aren't. Mei's queue: the agent proposes each pair with its evidence; Mei decides same or different, with a reason; the decision is kept, never asked again, and can be undone. One pair is two people with the same student ID typed by mistake (`D-003`): merging them would have shown one person's results in the other's wallet.

**Ideas.** Master data and reference data, and how to tell them apart. The master (golden) record: master ID, best values with provenance, links to sources. Identifiers by type and by issuer, qualified by where they come from (key sets). Match rules: exact (a shared identifier) and likely (name, date of birth, contact point), with three outcomes: match, review, no match. False merges and missed matches, and why the first costs more. Link, don't destroy: source records stay as they arrived; the cross-reference joins them. Stewardship as a queue with an owner and a time limit.

**The example.** Linh's two records, side by side, scored by the reconciliation rules. Given name: same, +3.4. Family name: same, +3.3. Birth date: one digit apart, 14 March and 14 May, a likely typo, +0.9. Email: different, −0.4. Student ID: only one record has it, 0. Score 74, in the review band (60 to 90). What would flip it: if the birth dates agreed, 93, an automatic link. The agent's note for Mei, with the names masked: "same names; birth dates differ by one digit; HR record created three weeks after enrolment, with the university's email domain". It suggests; Mei decides.

**Reconciliation rules, part one: matching.** Blocking finds candidates without comparing everyone with everyone (same family name sound and birth year; same email; same identifier). Each comparison adds or subtracts weight, by how often it agrees for the same person and by chance. Two thresholds make three bands: link automatically, review, keep apart. Hard rules override the score: two different student IDs can never be one person; the same national identifier always is. A steward's "not the same" is remembered, and binds the matcher.

**Elsewhere.** A hospital merges two patient records; a test result follows the wrong one. Health systems keep a person's identifiers by issuer for exactly this reason.

**The enabler.** The steward's queue: profiling queries that propose pairs, a decisions table (`learner_identity_decisions.csv`, grown into a person queue) with who, when and why, and a test that every proposed pair is decided.

**On screen.** First, two shelves: big, varied cards of things (master) and small bright chips of lists (reference), with the test between them. A golden record assembling from coloured source cards, each value keeping its colour as a label, a master ID stamped on top. Then two cards drawn together, and a gold decision card between them: *same*, or *different*, with its reason.

**Labs (candidates).** *Master or reference?* *Build the golden record.* *Same person?* *Match, review or no match?*

### 3. Which value wins

**Opening.** 1831: HMS Beagle sails with more than twenty chronometers, because a ship's longitude depends on the time, and clocks drift. When they disagree, the navigator needs a rule, decided before leaving port, for which to trust.

**Story.** Linh's name, emails and address differ across four systems. `core_learner` already chooses: "from the student system if it knows them, then the learning platform, then short courses". The rule is real, but it's written in a description and in SQL, for one role. Jun declares it for the person, per attribute: the legal name from the student system; the preferred name from Linh herself; each email kept as a contact point with its purpose (study, work, personal) and when it was last confirmed; the home address, from Linh, marked as shared with Minh. Each value keeps a label of where it came from and when.

**The example.** Linh's golden record, value by value: legal name from the student system (trusted first for names); preferred name, "Linh", from Linh in the wallet; study email from the student system, work email from HR, the home address from Linh, marked shared with Minh; birth date from the student system, because HR's is the typo. Each value shows its source, the rule that chose it and its age; the runners-up are one click away. A new rule version (recency first for emails) runs as a dry run over every person, listing every value it would change, before Mei's manager approves it.

**Reconciliation rules, part two: survivorship.** A default order for each attribute (trust by source, then recency, then completeness), trust that can differ by attribute (HR for work email, the person for preferred name), source policies (a change to a critical value from a less trusted source waits for review), and a steward's pin that holds a value until a date.

**Ideas.** Survivorship: source priority, recency, completeness, and a steward's override. Rules per attribute, not per system. Legal and preferred names, and why both matter. Contact points by purpose instead of one "email" column. The person correcting their own details as a source.

**Elsewhere.** A bank holds a customer's legal name for the account and a preferred name for the app; a joint account's address is shared by two people, and belongs to neither alone.

**The enabler.** Survivorship rules in the model's YAML (`meta`), generated into the SQL and tested; a source and a date beside each value; contact points as their own table.

**On screen.** Three values for one field; a rule card; the winner moves into the person's record, its source label attached.

**Labs (candidates).** *Which value wins?* *Write the rule.*

### 4. Roles come and go

**Opening.** Rome, the 2nd century BC: an ambitious citizen climbs a ladder of public offices, each held for a year, in a set order, and the records list every office against one name. The same person, a sequence of roles, each with its dates.

**Story.** Linh was an applicant, then a student, then an alumna; now she's a student again, a casual tutor since 2023, and a researcher on a project that ends in December; one day she may be a donor. Planning asks how many current students also work for the university, as at census; Advancement asks which of its alumni are studying again. Each role becomes a dated band on the person: who owns it, when it started, when it ended, and what it relates the person to (a course, a faculty, a contract). People relate to each other too: a supervisor, a next of kin.

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

**Story.** Advancement wants to invite this year's high achievers to give. The learner's results were collected to award a degree, not to raise money. With the person and the roles apart, the question has an answer: each role carries the purposes its data may be used for, and the person's consent where it's needed. Then Linh asks the university what it holds about her, and, when the research project ends, asks it to delete what the project kept about her. Both reach every role from one place, and the platform shows each value's source, so each system can act.

**Ideas.** Purpose limitation by role. Consent as data, with a purpose, a date and a way to withdraw. Requests for access, correction and deletion, answered from the master record. The master record as the place where privacy is honoured, not only where duplicates are removed (*Who may see it*, in the governance series). Kept generic: "in many places, the law…".

**Elsewhere.** A retailer's loyalty data, given for discounts, used for credit decisions; a hospital's research participant whose consent covers one study, not all.

**The enabler.** Purposes and consent on each role, as data; policies that filter by purpose on the platform; a request workflow that finds every role from the person.

**On screen.** Linh's record; one band lights, and only the doors marked with its purpose open.

**Labs (candidates).** *May this team use it?* *Answer the request.*

### 7. One person, many systems

**Opening.** Bern, 1874: countries keep their own post offices, but agree one set of rules, rates and addresses to exchange mail. Nobody hands their post office over; everyone can deliver everywhere.

**Story.** The wallet, HR, the research office and Advancement's system all want the university's person. Noor lays four options side by side: a registry (the cross-reference, read when needed: what exists today), consolidation (one person for analytics: today's `core_learner`, widened), coexistence (that person published back for systems to read), centralised (a person can be created in one place only). The university picks coexistence for the wallet and HR, and one change at entry: the research office's sign-up searches for the person before creating one.

**Ideas.** The four ways of keeping master data, and what each costs. Choose the lightest that solves the problem. The person published as a data product, with a contract and a version (*Who owns what*, *A product with an owner*), served live where an app needs it (*Both at once*). Who may create a person, and who may only add a role.

**Elsewhere.** A bank's customer hub, which every product system reads; a government's population register, which every agency asks instead of keeping its own.

**The enabler.** The person published as a public, versioned data product, readable by systems; a search-before-create call at the point of entry.

**On screen.** Four small diagrams side by side; one lights, and lines run from the person's record to each system.

**Labs (candidates).** *Which way fits?* *Create a person, or add a role?*

### 8. A hub at work

**Opening.** None: the film opens on the hub's screen, on a Monday morning, with one line recapping *Who is it?* and *Which value wins*.

**Story.** Mei's Monday in a master data hub on the platform. LakeFusion is the example: a master data management product built on Databricks, using Unity Catalog's permissions and lineage, with AI-assisted matching and stewardship workflows; another hub, or a small one the university builds itself, would show the same things. Over the weekend, 1,240 changes arrived from four systems. 1,180 linked automatically under the published rules; 52 stayed apart; 8 wait in Mei's inbox, ranked by how many consumers they touch. She opens the first: Linh's two records, the waterfall of match weights, what would flip it, the systems that would hear of it, and an AI-drafted case note that only suggests. She links them. The decision waits in an undo tray for a minute; she could still take it back. Then it commits, and the change feed tells the wallet and HR, which update their copies. Three alike reviews (the same pattern: a work email and a typo in a birth date) are decided together after Mei checks a sample of them one by one. On Friday, a share of the week's decisions comes back to another steward, blind; if agreement falls, a breaker stops automatic linking until the data owner restores it.

**Ideas.** Reconciliation rules (matching, survivorship, source policies) published, versioned and dry-run before they change anything. The new agentic helpers: AI that matches by meaning as well as by spelling, drafts a case note for each review with personal values masked, explains a score, proposes a rule change from the stewards' decisions, and answers "why is this value here?"; it suggests, deterministic rules act, and people decide. What makes a hub trustworthy: every match and every value explained; every decision undoable (undo, detach, unmerge, a compensating change); checks on the checkers (blind review, a breaker); maker and checker for big changes; personal values masked by role, and every reveal logged; changes published as a feed for other systems, not pushed into them. The same features to ask of any tool.

**The example.** One review, end to end: arrival, score 74, the waterfall, the AI's note, Mei's link, the tray's countdown, the commit, the wallet updated, the provenance on the new golden value.

**The enabler.** The hub, and a short checklist for choosing one: explain, undo, review, mask, publish.

**On screen.** The inbox; the waterfall, bar by bar; the tray's countdown; the golden record with a source label on every value; a line from the hub to each listening system.

**Labs (candidates).** *Link, review or keep apart?* *Read the waterfall.* *What should the AI be allowed to do?*

### 9. Kept, not cleaned

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
| A small HR source with casual staff, a research office source with project members, and an Advancement source with alumni, each a new key set, so Linh appears in four systems | 1, 2, 4 |
| `learner_identity_decisions` grown into a person queue, with a test that every proposed pair is decided | 2 |
| Survivorship declared in YAML per attribute, with each value's source and date; contact points with purpose | 3 |
| A dated role table, and an as-at-census question across roles | 4 |
| Reference tables for role, identifier and relationship types, consent purposes and countries, with owners and dates; tests that read them | 5 |
| Purposes and consent on roles; an example access request answered from the person | 6 |
| The person served to an app, and a search-before-create example | 7 |
| Stewardship measures in the governance scorecard | 9 |
| A small, invented demo of a hub's inbox, waterfall and provenance, drawn in the film's style from the project's data | 8 |

## What the series covers, and where

| Topic | Film |
|---|---|
| Master, reference, transactional and metadata; DAMA, named once; the party pattern; person, role, contact point, identifier; master entities across industries; when an entity needs mastering | 1 |
| Master versus reference data; the master (golden) record; identifiers by type and issuer; matching; false merges and missed matches; link, don't destroy; stewardship queues | 2 |
| Survivorship per attribute; legal and preferred names; contact points by purpose; self-service corrections | 3 |
| Role lifecycles; concurrent roles; dated relationships; as-was and as-is | 4 |
| Reference data: internal and external lists, mappings, owners, versions, effective dates; inclusive lists about people | 5 |
| Purpose limitation, consent, access and deletion requests, from the master record | 6 |
| Registry, consolidation, coexistence, centralised; the person as a product; search before create | 7 |
| A master data hub at work: reconciliation rules, inbox, AI helpers, undo, blind review, breaker, change feed, masking; choosing a tool | 8 |
| Stewardship as operations; prevention; measures; agents proposing | 9 |

**Parked:** organisations as parties in depth (employers, suppliers, partner universities); organisation hierarchies and restructures; product and asset master data; MDM tool selection; probabilistic matching algorithms in depth; address standardisation services.

## Overlap with the other series

- ***What makes it the same one*** resolves a learner's identity for one question; *Who is it?* makes it a standing service for the person, and recaps key sets in a line.
- ***One row of what, and when*** builds as-is and as-was; *Roles come and go* applies them to roles.
- ***Both at once*** serves data live to an app; *One person, many systems* serves the person that way.
- ***The map before the data*** models actors and roles (*Who does it, and where meaning changes*): an actor, a person, team or organisation, is assigned to roles for a time. *One person, many roles* says so in a line and draws it in that series' notation, so the person and role here are the data side of the same model.
- ***Who it serves, and how it pays*** and ***Who does it, and where meaning changes*** (*The map before the data*) show one word, "customer", meaning a person to one domain and a connection point to another; this series models the person under both.
- **The governance series** gives the decision rights (*Who decides*), the protection (*Who may see it*), the products (*A product with an owner*) and the change control (*Change without surprises*) this series uses.

## Rigour to check when scripting

- **The openings:** the 1686 Church Law and Sweden's personal identity number (1947); the Martin Guerre case and its sources; how many chronometers HMS Beagle carried; the *cursus honorum*, its order and the minimum ages, without overstating how fixed it was; the YYZ and LAX code stories and who assigns codes today; the Hippocratic oath's wording on confidentiality and its date; the Universal Postal Union's founding (the General Postal Union, 1874); the age of the Dutch water boards.
- **DAMA-DMBOK:** the current edition, and how it names the ways of keeping master data. ISO 8000's master data parts. The party pattern's usual sources (data model pattern books), named only.
- **Privacy:** keep it generic; no jurisdiction-specific advice; lists about people (titles, gender) checked against current inclusive practice.
- **LakeFusion:** what it does today, from its own documentation, not only its site and partner blogs (checked 16 October 2026: Databricks-native, AI-assisted matching and entity resolution, survivorship rules, golden records with lineage, stewardship workflows, Unity Catalog governance; partner blogs describe vector similarity, language-model inference and AI match justifications). Name it once, as one example among several; no claim it can't back.
- **Matching:** the weights shown follow the usual probabilistic record linkage (agreement and disagreement weights, two thresholds); keep the numbers plausible and invented.
- **Industry examples:** each *Elsewhere* beat plausible and generic; no real organisation.
- **Databricks:** how a published table is served to an app (*Both at once*'s rigour sheet); filtering by purpose with attribute-based policies (the governance series' *Governed in Unity Catalog*).

## Decisions for the author

1. **The series title.** *One person, many roles* · *Who is it?* · *The same one, everywhere* (used for now, 17 October 2026).
2. **The person in the project.** A new `party` domain holding the person, or the person in the student domain with roles from other domains.
3. **Linh as the series' person,** from the project's data, or a new character.
4. **Organisations as parties.** Parked here; a film of their own (employers, partners, suppliers), or a later series.
5. **The hub in *A hub at work*.** LakeFusion, named as the example; another product; or a hub drawn generically, with LakeFusion mentioned in a line.
6. **The same topic as governance,** or its own on the site (its own for now, *Master and reference data*, 17 October 2026).

## Next checkpoints

1. The author agrees this proposal and decides the points above.
2. The project's additions above, starting with the person and role model and the two new sources.
3. ~~A script and rigour sheet for *One person, many roles*.~~ Drafted, 16 October 2026: [script](1-one-person-many-roles/script.md). ~~The source.~~ Built, 17 October 2026: [source](1-one-person-many-roles/source/README.md). Next for it: the author watches it, and approves it or asks for corrections.
