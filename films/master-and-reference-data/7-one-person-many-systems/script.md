# Master and reference data · One person, many systems: script

*The script of the seventh film of the series on master and reference data, *The same one, everywhere*: about 5 minutes, in twelve chapters, in English. Drafted and built on 17 October 2026, from the approved plan for films 2 to 9 ([proposal](../proposal.md), *7. One person, many systems*). The times below are the built film's, and [Built](#built) lists what changed on the way. The title card follows chapter 1; the end card follows chapter 12. Made to read on a phone, like the rest of the series: on-screen text at least 28 px in the frame, and the camera moves in on whatever the narration is about.*

## The promise

Every line passes two tests: anyone who has applied twice to the same organisation can follow it, and an experienced master data manager finds nothing wrong in it. *One person, many roles* ended with a wish: when Linh applies, the university finds her first. This film makes it happen where the problem starts, at the point where people are created. There are four ways to give many systems one person: a registry that only links, a copy for analysis, a master that systems read back, and one place where people are created. Each costs more than the last, and the lightest that solves the problem wins. Here the problem is at two doors, so two systems read the person back, and the application searches before it creates anyone. **Choose the lightest way that solves the problem.**

## The story in one paragraph

Before 1874, every pair of countries that exchanged letters needed a postal treaty of its own, and a letter's price depended on its route. In Bern that year, twenty-one countries signed one treaty instead: one postal territory, one rate for a letter, and each country kept the postage it collected. Nobody built a post office for the world. Today, at the university, Linh Nguyen wants to apply for a PhD. Last time she applied, the online application gave her a second student number, and nothing linked the two. The application still creates a person first, and nobody looks until later; and four systems need to know who she is. Noor, the data architect, lays out the four ways. The university already has the first two, Mei's links and the copy in the lakehouse; at best they find her after the fact, and neither stops a third number. The last two would, but every system that reads back has to change. New people come in at two doors, the application and HR, so those two read the person back, and the research and alumni offices keep their links: like Bern, each system keeps its own, and they share the person. A bank's customer hub and a country's population register go further. The application now searches before it creates anyone: a clear match adds a role, a likely one waits for Mei's office, and only when nobody matches is a person made. Noor and Mei write down who may create a person. Linh applies, and the search finds her: the application adds a role, and no new number. The same week another Linh Nguyen applies, born in another year and new to the university: only the name agrees, so she becomes a person of her own. Behind the search is the person, published as a data product that Mei's office owns, built, tested and governed on the data platform, and served to the application by a synced table. It ends where it started: in Bern, each country kept its post office and shared the rules; here, each system keeps its records and shares one person.

## What each object stands for

| Object | Stands for |
|---|---|
| Seven small post offices across a valley, each with a post horn | Countries, each with its own post |
| A pencil line between every pair, a wax seal on each | A treaty for every pair: the way things joined before |
| An envelope that takes two different stamps on its way | A letter whose price depended on its route |
| The treaty of 1874, on parchment | One set of rules, agreed once |
| One pencil line round the whole valley, the seals lifting | One postal territory |
| A coin by each office's door | Each country kept the postage it collected |
| A great post office for the world, drawn faint and crossed out | The heaviest way, not taken |
| Linh, in pencil, and later in white paper with bands | The person; the bands are her roles, dated and owned |
| A dashed card under a stamp that hovers | A third student number, about to be made |
| Four cards on Noor's wall, each a small diagram | The four ways to give many systems one person |
| An index card with lines to each system, a question running down each | A registry: it only links, and asks each system for the rest |
| A white figure in the lakehouse, and a small chart | A copy for analysis: everyone counted once, in reports |
| Arrows both ways between the white figure and two systems | A master the systems read back |
| Arrows only out of the white figure | One place where people are created |
| Two doors, on the student system and HR | Where people are created at the university |
| A bank's hub and a country's register | Heavier ways, where the problem needs them |
| The application's fields, and an amber line from it to the person | A search before anyone is created |
| Three lanes: a tick, Mei's queue, a new white figure | A clear match, a likely one, and nobody |
| A sheet, *who may create a person* | The rule: who creates, and who only adds roles |
| An amber band added under Linh | The applicant role, added to the person she already is |
| A second Linh Nguyen, drawn differently, and her own stamp | A namesake kept apart: a new person, rightly made |
| A card with four fields: owner, contract, version, access | The person as a data product |
| A card, "the data platform", with four lines of the person's settings in their simplest form, YAML; a card for who may read it; a synced table | What builds, tests, governs and serves it, with no tool named |

## The look

The series' watercolour, unchanged: role colours as the strongest washes (student teal, applicant amber, researcher coral, tutor violet, alumna green), the person as white paper in a pencil line with her roles as bands, Noor edged in cyan and Mei in gold, reference data as bright chips, and soft daylight landscapes on warm paper. What's new:

- **1874.** A wide valley under pointed, snow-capped peaks, with "1874" in the corner, and seven small post offices of different roofs, each with a post horn over its door, standing for the countries. The treaties between pairs are fine pencil lines, each with a dot of red sealing wax; the treaty of Bern is parchment and ink. The territory the treaty makes is one pencil line round the valley, with the paper inside it brightened a little, and the offices keep their own colours inside it. The great post office that nobody built is drawn in a faint, dashed pencil, and crossed out in red ink.
- **No season.** The university's year starts in February, as in the southern hemisphere, so the film gives months and never a season; the campus is *One person, many roles*' own, unchanged.
- **The four ways** are larger copies of the four small diagrams in *One person, many roles*, on Noor's wall, so a viewer who saw it knows them at once. In chapter 5 the coexistence card's diagram opens out into the picture: its frame lifts away, its small white figure grows into Linh, and each system's chip flies to its own card.
- **The search** is an amber line, the applicant's colour, from the application to the person; a likely match is a gold card in Mei's queue, gold being the business side's colour, Mei's.
- **The second Linh Nguyen** is drawn as differently from Linh as two people are: longer hair, a cardigan, younger. When she becomes a person, she's white paper with her own amber band, and nothing joins her to Linh.
- **The person as a product** is a card with four fields, lit as each is said: the owner in gold, the business side's colour, and the technical promises in cyan, like the settings' lines beside it. The parts never wear a role's colour. No tool's name or logo is shown: the series names no tool as the home of master data's rules.

## Script

### 1 · A treaty for every pair · 0:00–0:37

**Narration.** Before 1874, every pair of countries that exchanged letters needed a postal treaty of its own. A letter's price depended on its route. That year, in Bern, twenty-one countries signed one treaty instead. They became one postal territory, with one rate for a letter, and each kept the postage it collected. Nobody built a post office for the world. Each country kept its own, and they shared the rules.

**Picture.** A wide valley in 1874, seven post offices across it, each with a post horn over its door. As "every pair" is said, pencil lines draw between them, neighbours first, each with a dot of sealing wax, until the valley is crossed by twenty-one of them: "a treaty for every pair". An envelope sets out from the office on the left and travels to the far right through a third; at each office a different stamp lands on it: "a price for each route". "That year, in Bern": the camera moves to the town in the middle, by its clock tower, and the treaty arrives on parchment, *General Postal Union · Bern, 9 October 1874*; twenty-one signatures are written in, and its seal is pressed. The pencil lines lift away, the treaty is pinned up above the town, and one line draws round the whole valley: "one postal territory". A new envelope, and a single stamp lands on it, "25 c": "one rate for a letter". A coin spins down by each office's door, bounces and stays: "each kept its postage". A great post office for the world draws in faint and dashed over the valley, and is crossed out: "no post office for the world". Each office lifts in turn, and a line runs from the treaty to each: "one set of rules". The envelope is posted at the office on the left. Wordless breather: it crosses the valley with its one stamp. Then the title card, *One person, many systems*.

**On screen.** before 1874 · a treaty for every pair · a price for each route · 1874 · Bern · General Postal Union · Bern, 9 October 1874 · one postal territory · 25 c · one rate for a letter · each kept its postage · no post office for the world · one set of rules · The same one, everywhere · One person, many systems · four ways to share the person, and the lightest that works · Film 7 of 9 · master and reference data

### 2 · Applying again · 0:37–1:05

**Narration.** Today, at the university, Linh Nguyen wants to apply for a PhD. Last time she applied, she got a second student number, and nothing linked the two. The application still creates a person first, and nobody looks until later. And four systems need to know who she is: the student system, HR, the research office and the alumni office.

**Picture.** The campus, late in 2025. Linh, in pencil, and her card: "Linh Nguyen · planning a PhD". Her two student records arrive on the left, *S-17142 · bachelor's · 2019–22* and *master's · from Jul 2025*, whose number, *S-20436*, is stamped on. A pencil line runs from the new one towards the old and stops halfway, at a red cross: "not linked", as *One person, many roles* left her. On the right, the application, in amber, *PhD · health informatics*, and an arrow down from it, "creates a person first", to a dashed applicant's card with a stamp hovering over its empty number: "a third number?". A low pulse runs under it. Then her records give way to the four system cards, settling in a row along the top, each in its role's colour, as each is named, with a line from each down to her.

**On screen.** late 2025 · the university · Linh Nguyen · planning a PhD · Student · S-17142 · bachelor's · 2019–22 · master's · from Jul 2025 · S-20436 · not linked · Application · PhD · health informatics · Applicant · creates a person first · a third number? · student system · students, applicants · HR · staff, tutors · research office · researchers · alumni office · graduates

### 3 · Four ways · 1:05–1:38

**Narration.** Noor, the data architect, lays out four ways to give them one person. A registry only links. It knows which records are one person, and asks each system for the rest. A copy for analysis gathers everyone in the lakehouse, so reports count each person once. A master that systems read back keeps the person in one place, and each system reads her from it. Or one place creates every person, and the systems only read.

**Picture.** Noor's office. Noor, edged in cyan, lays out four cards on the wall, left to right; each is a small diagram over four system chips (teal, violet, coral, green), and the camera moves in on each as it's named. *Registry*: an index card, with a line down to each chip, and a question running down each line and its answer back up. *Consolidation*: a white figure in a box marked "lakehouse", arrows up into it from each chip, and a small bar chart beside it. *Coexistence*: the white figure, with arrows both ways between it and each chip. *Centralised*: the white figure first, and arrows only out of it, down to the chips. Under each, its name and a short line.

**On screen.** Noor Rahman · data architect · registry · only links · consolidation · a copy for analysis · lakehouse · coexistence · systems read it back · centralised · people created here

### 4 · After the fact · 1:38–1:56

**Narration.** The university already has the first two: Mei's links, and the copy in the lakehouse. At best, both find Linh after the fact. Neither stops a third number. The last two do, but every system that reads back has to change.

**Picture.** The two cards on the left take a small badge, "already here", and a note under each, "after the fact", while the two on the right step back. A line under the first two: "neither stops a third number". Then the two on the right come forward, each with a tick, "stops it", and under them, their cost: "every system that reads it changes".

**On screen.** already here · after the fact · neither stops a third number · stops it · every system that reads it changes

### 5 · The lightest that works · 1:56–2:23

**Narration.** So which is the lightest way that still works? New people come in at two doors: the application and HR. So those two read the person back. The research and alumni offices only add roles, so links are enough for them. Like Bern: no post office for the world. Each system keeps its own, and they share the person.

**Picture.** The coexistence card comes forward, and its diagram opens out into the chapter's picture: its frame lifts away, the small white figure grows into Linh, with her roles' bands, and each system's chip flies down to its own card. Two of them, the student system and HR, take a door each, "where people are created", and keep their arrows both ways to her: "reads it back". The research office's and the alumni office's arrows turn to thin pencil links: "links". A badge, "the lightest that works". On "Like Bern", the valley of 1874 comes in small at the corner, its seven offices inside one line. Each system lifts in turn, and a light glows behind her as they share the person. Wordless breather on the settled picture.

**On screen.** student system · students, applicants · HR · staff, tutors · research office · researchers · alumni office · graduates · where people are created · reads it back · links · the lightest that works · like Bern

### 6 · Elsewhere · 2:23–2:37

**Narration.** Others need a heavier way. A bank's customer hub is read by every product system. Many countries keep one population register, and agencies ask it instead of keeping their own.

**Picture.** Two panels, each marked "centralised". *A bank*, in banking blue: a white figure in its customer hub, and arrows from it to three product chips, *current account*, *card*, *mortgage*. *A country*, in the public sector's green-blue: a population register, a white figure in it, and arrows to three agencies, *tax office*, *health service*, *schools*. The one being told about stands out; the other steps back.

**On screen.** a heavier way · a bank · centralised · customer hub · current account · card · mortgage · a country · population register · tax office · health service · schools

### 7 · Search before create · 2:37–3:01

**Narration.** And one change at the door: before the application creates a person, it searches for one. It compares the name, the birth date, the email, and any number from before. A clear match adds a role. A likely one waits for Mei's office to decide. Only when nobody matches is a new person made.

**Picture.** Plain paper. The application, in amber, *before it creates a person*, with its door and four empty fields: *name*, *birth date*, *email*, *number from before*. Each field lights as it's named. An amber line runs from it to a magnifying glass: "search first". Three lanes open on the right, each as it's said: a white figure takes an amber band and a tick, "found: add a role"; a gold card slides into a tray where two wait, "likely: Mei's office decides"; a new white figure takes her first amber band, "nobody: a new person".

**On screen.** Application · before it creates a person · name · birth date · email · number from before · search first · found: add a role · likely: Mei's office decides · nobody: a new person

### 8 · Who may create a person · 3:01–3:16

**Narration.** Noor and Mei write down who may create a person: only the application and HR, after a search. The research and alumni offices never do. They add roles to people already there.

**Picture.** Noor's office again. A sheet, *who may create a person*, fills in row by row under *system* and *may it create a person?*: *the application · creates, after a search* and *HR · creates, after a search*, each with a tick; *research office · adds roles*; *alumni office · adds roles*. Each row has its system's dot of colour. Mei, edged in gold, agrees it: a gold bar, "agreed by Mei's office", and her tick.

**On screen.** who may create a person · Mei Tanaka · registrar's office · system · may it create a person? · the application · creates, after a search · HR · research office · adds roles · alumni office · agreed by Mei's office

### 9 · Found · 3:16–3:36

**Narration.** In October, Linh applies for her PhD. The search finds her: the same birth date, the same email, and the student number she gave. So the application adds a role, applicant, to the person she already is. No new number, and nothing to merge later.

**Picture.** The campus, October 2026. Linh in white paper, with the bands of her roles: student, tutor, researcher, alumna. Her application arrives on the right, its fields typed in: *Linh Nguyen*, *14 Mar 2001*, *linh.nguyen@mail.example*, and her number from before, *S-20436*. The amber line runs to her, and ticks land, on the name, the birth date, the email and the number: "found: Linh Nguyen". An amber band is painted in under her, with its chip, *Applicant · PhD · from Oct 2026*. The stamp that hovered in chapter 2 lifts away, with its empty card: "no new number", "nothing to merge later".

**On screen.** October 2026 · the university · Application · PhD · health informatics · name · birth date · email · number from before · Linh Nguyen · 14 Mar 2001 · linh.nguyen@mail.example · S-20436 · found: Linh Nguyen · Applicant · PhD · from Oct 2026 · no new number · nothing to merge later

### 10 · Kept apart · 3:36–3:57

**Narration.** The same week, another Linh Nguyen applies. It's a common Vietnamese name. But she was born in another year, writes from another email, and has never studied here. Only the name agrees. So she becomes a new person, with her own number, and none of Linh's history.

**Picture.** Linh, in white paper, on the left. On the right, another young woman, in pencil, with her phone; her card, *Linh Nguyen · applying for a bachelor's*. The search lays her application beside Linh's person, two columns, *already here* and *applying*: the same name, with a tick; *14 Mar 2001* and *9 Aug 2007*, *linh.nguyen@mail.example* and *linh.n07@mail.example*, *S-20436* and *none*, each with a cross: "only the name agrees". She clears to white paper, a person of her own, with an amber band, and her card turns into her own record, *Applicant · bachelor's · from Oct 2026*, with the stamp landing on it at last, *S-21907*: "a new person". No line joins the two.

**On screen.** October 2026 · the university · Linh Nguyen · applying for a bachelor's · already here · applying · 14 Mar 2001 · 9 Aug 2007 · linh.nguyen@mail.example · linh.n07@mail.example · S-20436 · none · only the name agrees · Applicant · bachelor's · from Oct 2026 · S-21907 · a new person

### 11 · The person, published · 3:57–4:24

**Narration.** Behind the search is the person, published as a data product, and owned by Mei's office. A contract fixes its shape, and a new version marks any change to it, so nothing that reads it breaks by surprise. The data platform builds and tests it, and governs who may read it. A synced table serves it to the application, while the applicant waits.

**Picture.** Plain paper. A card for the person, a white figure on it, a badge, *data product*, and four fields that light as they're said: *owner: Mei's office* in gold, then *contract: enforced*, *version 1* and *access: public* in cyan. Beside it, a card, "the data platform · builds and tests it", with four lines of the person's settings lighting with them, "in its simplest form, YAML"; then a card, "governs who may read it", with its grant, *may read: student system, HR*. The tools step back for a *synced table* card, an arrow to it from the person, and an amber arrow from it to the application, which *searches before it creates*: "while the applicant waits".

**On screen.** the person · data product · owner · Mei's office · contract · enforced · version · 1 · access · public · the data platform · builds and tests it · group: person · access: public · contract: {enforced: true} · latest_version: 1 · in its simplest form, YAML · governs who may read it · may read: student system, HR · synced table · the person, for the search · Application · searches before it creates · while the applicant waits

### 12 · One person, shared · 4:24–4:45

**Narration.** In Bern, each country kept its post office, and they shared the rules. Here, each system keeps its records, and they share one person. Choose the lightest way that solves the problem.

**Picture.** The valley of 1874 again, its offices inside one line, each lifting in turn, and a dot running from the treaty to each. It gives way to the campus: Linh in white paper with all five of her bands, and the four system cards above her, two joined both ways and two by links, each lifting in turn, and a light behind her on "one person". The cards step back for the last line, which then settles onto the end card. Wordless breather. End card.

**On screen.** 1874 · Bern · student system · students, applicants · HR · staff, tutors · research office · researchers · alumni office · graduates · Choose the lightest way that solves the problem. · One person, many systems · The same one, everywhere · Film 7 of 9

## Pause and think

Four questions, one at the end of each of four chapters, as the site shows them (`site/assets/one-person-many-systems/think.en.js` and `think.es.js`):

1. *After chapter 4, After the fact.* The university already has Mei's links and a copy that counts each person once. Why could Linh still get a third student number? (Both work after a record exists; neither is asked before the application creates one.)
2. *After chapter 5, The lightest that works.* Why not let one place create every person at the university? (It would stop duplicates too, but every system would change, and that one place could never stop; people are only created at two doors.) It ends by asking viewers where people, or customers, are created in an organisation they know.
3. *After chapter 7, Search before create.* Why does a likely match wait for Mei's office instead of the search deciding? (A wrong merge gives one person's history to another; a person decides once, with a reason, and the decision is kept.)
4. *After chapter 10, Kept apart.* Both applicants are called Linh Nguyen. What would have gone wrong if the search had matched on the name alone? (The second Linh would have been given the first one's records: her degree, her results, her email.)

## Labs (candidates)

- **Which way fits?** Six organisations, each with a problem (counting customers once, stopping duplicate patients at admission, a register every agency reads); pick the lightest of the four ways that solves each, and see what each heavier one would cost.
- **Create a person, or add a role?** Eight applications and staff forms; run the search on each, and decide: add a role, send to the steward, or create a person.

## Where it comes from in the project

| On screen | In the example project |
|---|---|
| Linh, S-20436, a master's from July 2025 | `data/student_system/learners.csv` (line 50). The project has her in the Graduate Certificate in Health Informatics (GCHI) where the film says a master's: an open point in the proposal's *Decisions for the author* |
| S-17142, her bachelor's, 2019–22, not linked to S-20436 | `data/student_system/past_learners.csv`, the student system's archive of records closed before November 2024 (enrolled 25 February 2019, completed 15 December 2022). No key joins it to S-20436: `analyses/profiling/profile_keys_held.sql` |
| The four systems that need to know her | `data/student_system/`, `data/hr_system/` (E-4417), `data/research_system/` (R-3082, which holds E-4417) and `data/alumni_system/` (A-61207, which holds S-17142 only), each with its sources under `sources/` and its key set in `seeds/reference/shared/key_sets.csv` |
| Mei's links (the registry the university already has) | `seeds/reference/student/learner_identity_decisions.csv`: decisions such as D-001, each with who decided, when and why. None links Linh's two student numbers before *Who is it?* does, on 8 October 2026 |
| The copy in the lakehouse | `models/core/student/core_learner.sql`: the learner, a consolidated copy for analysis, with keys from three systems |
| A product that others read, with an enforced contract | `dbt_project.yml` lines 46 to 52: core models are `access: public`, with `contract: enforced: true` |
| Version 1 | `models/core/student/_core_student__models.yml` lines 7 and 107 to 109: `latest_version: 1`, `versions: - v: 1` |
| Owned by Mei's office | `models/core/student/_core_student__models.yml` line 11, and the groups' owners in `models/_groups.yml` |
| Who may read it | `dbt_project.yml` line 64: `+grants`, Unity Catalog's `select`, for named groups |
| The person, the search at the application, the synced table | The person domain is in the project as a draft for its owners (`models/core/person/_person__conceptual.yml`, with DEC-PER-01 to 03 proposed). The person model, the search the application calls and the synced table are new, this film's own addition, with *Who is it?*'s links and *Which value wins*'s rules |
| Linh's birth date, 14 March 2001, her personal email, the second Linh, S-21907, the PhD | Invented for the film, as in *Who is it?*. The project's student system holds no birth date; HR's `data/hr_system/staff.csv` holds hers as 2001-05-14, the typo *Who is it?* finds. Her email in the student system's data is the shared family one, which the series doesn't use |

## Rigour to check before recording

Sources checked on 17 October 2026.

- **The postal union.** The treaty concerning the formation of a General Postal Union was signed at Bern on 9 October 1874; its preamble lists 21 countries (Germany, Austria-Hungary, Belgium, Denmark, Egypt, Spain, the United States, France, Great Britain, Greece, Italy, Luxembourg, Norway, the Netherlands, Portugal, Romania, Russia, Serbia, Sweden, Switzerland and Turkey). Article 1 makes them "a single postal territory for the reciprocal exchange of correspondence"; the general rate is 25 centimes for a single prepaid letter of up to 15 grams; under Article 9 each administration keeps the whole of the sums it collects; it took effect on 1 July 1875 (the treaty's text, Avalon Project, Yale Law School). It was renamed the Universal Postal Union in 1878 (Wikipedia, "Universal Postal Union"). Some sources count 22 countries, from the delegates at the congress; the film follows the treaty's own list. "One rate" simplifies: countries could round the rate into their own currency within limits, and sea transit over long distances could cost more; transit through a third country was still paid for, by weight, between administrations. The film says "each kept the postage it collected", which is exact.
- **Before the union.** "Every pair of countries that exchanged mail had to negotiate a postal treaty with each other", and without one, mail went through a third country (Wikipedia, "Universal Postal Union"). The US Postmaster General, Montgomery Blair, reported in 1862 that rates "vary greatly according to the route of carriage", with no common standard weight for a single rate (quoted by the Mystic Stamp Company's history of the 1863 Paris conference; to check against the report itself). Seven offices stand for the countries: the picture is a valley, not a map, so no border is drawn.
- **The four ways.** Registry, consolidation, coexistence and centralised (also called transaction or transactional) are the usual names of master data management's implementation styles, usually credited to Gartner, and taught as a range from the lightest to the most invasive. The film names them as *One person, many roles* did, without naming a source again. DAMA-DMBOK's own wording wasn't checked against the book: a CDMP study guide lists the same four for DMBOK2; other summaries of DMBOK2 give three hub approaches (registry, transaction hub, and consolidated as a hybrid of the two). *One person, many roles* attributes the four to DAMA; its thread keeps that check.
- **What each way does.** A registry keeps cross-references and match keys and reads values from the sources when asked; consolidation builds golden records downstream, usually for analysis, and the sources don't see them; coexistence keeps the master and the sources both, and the sources read the master back (often each way); the centralised style makes the hub the system of entry and of record, and other systems take their master data from it. Mixing styles by system or by domain is common, and moving from one style to the next over time is the usual path.
- **Search before create.** Real student systems do this. Ellucian Banner's Common Matching "checks for existing identification records before a new one is added", with three results: the record is new, one match is found (no new identifier is made), or potential matches are found, and the user decides (Otis College, *Banner Common Matching* procedure, 2013; Lehigh University and others document the same). The same procedure lists the offices allowed to create person records: Advancement for alumni and donors, HR for employees, Admissions and the registrar for students. The film's university is invented and its rule is its own; the film names no product.
- **Why it's common.** The University of Galway keeps a returning student's whole history under their first number, asks applicants to say whether they studied there before, and lists what goes wrong when two numbers aren't merged in time: the fees record, email, course pages, a new ID card, the library (registration office notice *Merging numbers*, read 17 October 2026). The film names no university.
- **The search's fields.** Name, birth date, email and a number from before are what an application usually holds; national identifiers aren't used, since many applicants have none in the university's country. A likely match (the same name and birth date, say, with nothing else) goes to a person, because a false merge (two people as one) does more harm than a missed match: it shows one person's records to another. The weights and thresholds are probabilistic record linkage's usual shape; *Who is it?* and *A hub at work* show them.
- **The namesake.** Nguyen is the most common Vietnamese family name, often estimated at around 30 to 40 percent of the population (Wikipedia, "Nguyen"), and Linh is a common given name: a second Linh Nguyen at a large university is ordinary. The film says only "a common Vietnamese name".
- **Two doors.** At this university people are created by the application (applicants and students, in the student system) and by HR (staff, including casual tutors). The research office's members and the alumni office's graduates are already people: they only add roles. Some universities let the research office create visiting researchers; that would be a third door, with the same search.
- **The timing.** The person is rebuilt as each system's changes arrive, and the synced table follows it within seconds in continuous mode. Two applications through two doors in the same few minutes can still slip past each other: Mei's queue and the next build's matching catch them, which is the coexistence way's accepted cost. A centralised hub, the heavier way, has no such window.
- **dbt.** Model contracts guarantee a model's columns, data types and constraints before it builds (`contract: enforced: true`); versions give consumers a migration path and a deprecation window for a breaking change (`versions`, `latest_version`); access sets who may `ref()` a model (`private`, `protected`, `public`); groups bundle models under an owner (dbt documentation, *Model governance*, *Model contracts*, *Model versions*, *Model access*, *Groups*). The four lines on screen follow the example project's own settings; the project sets access and contracts per folder in `dbt_project.yml`. The film names no tool: master data solutions often keep such settings, and the rules behind the person, as configuration behind a screen of their own, and YAML and SQL, as in the example project, are the simplest form (the series' decision of 20 October 2026, from the author's note).
- **Databricks.** Unity Catalog grants say who may read a table. Synced tables serve Unity Catalog tables through Lakebase Postgres, "so applications can query lakehouse data directly with low latency", in snapshot, triggered or continuous mode (continuous: seconds of latency); they're generally available (Databricks documentation, *Serve lakehouse data with synced tables*; the Lakebase release notes: generally available on 22 January 2026). The synced table is read-only to the application: the search reads it, and changes go back through the systems that own them.
- **Elsewhere.** Banks commonly run a customer master that product systems read; many countries keep a central population register that agencies consult (the Nordic registers, the Netherlands' BRP, Estonia's, and others), often under a "once only" principle. Both are said generically; no real organisation is named or drawn.
- **Colour.** The amber of the search and the applicant, the gold of Mei's queue and the gold of the coins in 1874 are checked apart; every colour has a label.

## Built

Built on 17 October 2026, from this script, in watercolour. What changed on the way, sent for the series' *Decided* table:

- **Names.** The plan's "student app" is *the student system*, as in *One person, many roles*; the online application writes to it. The applicant role is added by the application, and the student number stays the one she already has.
- **The rule.** Only the application and HR may create a person, after a search; the research and alumni offices add roles.
- **Dates.** Agreed with *Kept, not cleaned*: the search before create runs from the February 2026 intake; chapter 2 is late 2025; Linh applies in October 2026 for a PhD that starts in February 2027, so her applicant role runs from October 2026; the second Linh applies for a bachelor's and becomes S-21907. The film states no counts of duplicates.
- **Linh's two numbers** (changed on 20 October 2026, agreed with *Who is it?*). Nothing links S-17142 and S-20436 before Mei's office does, on 8 October 2026 (D-005, *Who is it?*), and *One person, many roles* never links them. So chapter 2 says "nothing linked the two", where the first cut said Mei's office had linked them, and its line stops at a cross, "not linked"; chapter 4 says "at best" the registry and the copy find her after the fact; and the first Pause and think no longer says her records are linked. Chapter 9, in October 2026, comes after that decision.
- **1874.** A coin spins down by each office's door, where the plan had a box; the treaty is sealed after its twenty-one signatures, then pinned up above the town.
- **Chapter 5.** The coexistence card's diagram opens out into the picture, instead of a cut to a new one: its frame lifts away, the small white figure grows into Linh, and each system's chip flies to its own card.
- **No tool named** (changed on 20 October 2026, for the series' decision from the author's note). Chapter 11 said "dbt builds and tests it, and Databricks governs who may read it", over both tools' logos. It now says "The data platform builds and tests it, and governs who may read it", and its cards show the settings in their simplest form, YAML, with no tool's name or logo. The line is a word longer, so the beat after it is 1.3 s, keeping the chapter at 138 words a minute.
- **Colours.** The person's fields as a product, and the settings' lit lines, wear the side colours, gold for the owner and cyan for the technical settings, never a role's.
- **Layouts.** Chapter 7's lanes and tags are spaced so nothing overlaps; chapter 9's application is wide enough for the email, and its ticks clear the values; chapter 11 no longer moves in on the application at the end, since the camera, kept inside the frame, pulled a card half out of view: the tools step back instead.
- **Sound.** A new palette (in `source/tools/score.py`): a reed organ's chords that swell with the chapters, from F major in 1874 to D major at the end; a soft horn for the series' mark (1-8-5-1), a nod to the post horn of 1874, with its echo off the valley; a harp for each role, on the notes the roles have had since *One person, many roles*; a low flute, D and A, for the person. Each instrument is set to come out as loud as its part in that film at the same gain, so the music sits about 21 dB under the voice, as in the other series' films, and the only pulse, under the third number the application would make in chapter 2, sits about 9 dB under the music.

## Next

1. The author watches the film, and approves it or asks for corrections.
2. The project's additions it needs: the person published as a model in the person domain (a draft since 20 October 2026), with its owner, contract, version and grants; the search the application calls.
3. Labs, in the series' interactive learning: the candidates above.
