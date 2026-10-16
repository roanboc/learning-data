# Master and reference data · One person, many roles: script

*The script of the opening film of the series on master and reference data (the title is still open), as drafted: about 6 minutes, in twelve chapters, in English, 16 October 2026. Not built yet: timings are planned, and the source will set them. The title card follows chapter 1; the end card follows chapter 12. Made to read on a phone, like the other series: on-screen text at least 28 px in the frame, and the camera moves in on whatever the narration is about.*

## The promise

Every line passes two tests: anyone who has ever had two accounts with the same organisation can follow it, and an experienced master data manager finds nothing wrong in it. The film opens the series and says what it's about. Most systems store a role (a student, a customer, an employee) and call it the person. A person is someone, once; a role is how they relate to the organisation, for a time; a contact point can be shared and has a purpose; an identifier belongs to the system that issued it. Keep those four apart, write down who keeps each one, and most of master data management becomes a set of decisions, not a product. And the same goes for every thing a business is about that's used in many places, kept in more than one, and matters when the copies disagree. **Know the person, not just the role.**

## The story in one paragraph

In 1686, Sweden's church law asked every parish to write down each person in each household, and a person who moved carried a certificate to the next parish; in 1947 the register gave everyone one number for life. Today, at the university, Linh Nguyen gets her own email address, after years of sharing her family's with Minh, and tells the student system. The learning platform, the short-course platform and the HR system, where she's a casual tutor this semester, don't hear: her certificate and her payslip still go to the family inbox, where Minh reads them. Four systems, four records, four ideas of who Linh is, and next year an alumni office will make a fifth. Noor, the data architect, looks at the university's own model and corrects it in the open: it has a learner, which is a role, and no person. She draws four things apart: the person, the roles, the contact points and the identifiers. Then she and Mei write down, for each role and each attribute, which system creates it, which keeps it, and who owns it. A hospital, a bank and an energy utility have the same problem with different names. DAMA calls this reference and master data, and names four ways to keep it; the series will choose one, and show the tools. People aren't the only master data: organisations, products, places, assets and accounts are too, and four questions say which things need mastering. It ends where it started: Linh changes her email once, and every role hears.

## What each object stands for

| Object | Stands for |
|---|---|
| A parish book, a household's names, a moving certificate | One person, recorded once, followed wherever they go |
| A number stamped on a card, "1947" | An identifier for life, issued by someone who keeps it |
| Linh, drawn once, wearing different cards | One person, many roles |
| A card in each system's colour (student, platform user, customer, tutor) | A role, as each system stores it |
| A dashed card, "alumna, next year" | A role that hasn't started yet |
| An envelope arriving at the family inbox, Minh reading it | A contact point shared by two people, used for the wrong purpose |
| The cards sliding off into four lanes | Person, role, contact point, identifier: kept apart |
| A white figure, drawn in pencil and left unpainted | The person, as the master record |
| Bands under the figure, each with a start and an end | Roles, dated and owned |
| Small tags on each identifier, "issued by" | An identifier belongs to the system that issued it |
| An actor glyph with assignment lines to two role glyphs | Enterprise architecture's view: an actor (person, team or organisation) assigned to roles, for a time |
| A small matrix lighting cell by cell | The inventory: who creates each role, and who keeps each attribute |
| A gallery of things in industry colours: an employer, a product, a meter, a ward, an account | Other master entities |
| Four questions as a checklist, lighting for some things and not others | The test for what needs mastering |
| A hospital band, a bank card, a meter | The same pattern elsewhere |
| DAMA's wheel, one slice lit | Reference and master data, named once |
| Four small diagrams | The four ways to keep master data, named once |
| Nine film cards along Linh's timeline | The series |

## The look

Watercolour, chosen from seven looks drawn from this film's moments. Reference frames: [1686 parish](../look/1686-parish.jpg), [campus today](../look/campus-today.jpg), [four lanes](../look/four-lanes.jpg).

- **Colourful, and every colour means something.** Each role has its own saturated colour, the same in every film: student teal, platform user amber, customer coral, tutor violet, alumna green (and donor magenta later). A system's cards wear their role's colour as a brushstroke behind the title. The master record is Linh's figure cleared to white paper in a pencil line, gathering those colours: each value carries a small coloured label for its source, and each role is a band of wash with a start and an end, so a golden record reads at a glance as a mix of sources. Each industry in chapters 8 and 10 has its own colour too: health red, banking blue, energy yellow, retail orange, public sector green-blue.
- **Backgrounds** are daylight landscapes in watercolour, not the dark glass of the other series: soft washes of sky and land on warm paper, clouds left as bare paper, buildings and trees drawn in pencil. They stay soft so the role colours, the strongest washes on screen, carry the meaning. Reference data is drawn as bright tabs and chips; transactions as small, quick dabs of colour.
- **Readable, not only bright.** Text is dark ink on paper-light cards, and keeps 4.5:1 contrast or better on a role's wash. Every colour is paired with a label, so nothing depends on colour alone; `legible.py` checks text size frame by frame, as for the other series.
- **The past is the same watercolour,** with the year in the corner; its documents are parchment and ink, as in the other series, touched with the colour of the idea they carry (the parish book's household ribbon in teal, the first role colour).
- **People** are drawn in pencil, with paint that runs a little past the line. Linh, a new figure for the series, has no side colour: she's the person the data is about, so she wears the colours of her roles. Noor (cyan, the technical side) and Mei (gold, the business side) are edged in a soft wash of their side's colour, as they're outlined in *From words to data* and *In the weeds of data crafting*. Minh appears once, reading an envelope.
- **Industry beats** keep Linh's figure and swap the cards: a hospital wristband, a bank card, a meter. No real organisation is named or drawn.

## Script

### 1 · One record, wherever you go · 0:00–0:32

**Narration.** In 1686, Sweden's church law asked every parish priest to keep a book of every household: who lived there, when they were born, whether they could read. When someone moved, they carried a certificate to their new parish, and the next book took them in. In 1947, the register gave everyone a number for life. One person, written down once, followed wherever they went.

**Picture.** Parchment and ink, "1686" in the corner. A parish book opens on a household: a farmer, his wife, three children, a farmhand, each name with a birth year and a mark for reading. A quill adds a line: "moved to Uppsala parish". A small certificate folds and travels along a road to a second book, which opens and takes the name in. "1947": a number stamps onto a card. Wordless breather: the two books side by side, one name in both. Then the title card, *One person, many roles*.

**On screen.** 1686 · Sweden · every household · moved to · 1947 · a number for life · one person, followed · One person, many roles · Film 1 of 9

### 2 · A new email · 0:32–1:02

**Narration.** Today, at the university. Linh Nguyen is studying health informatics. For years she shared her family's email with Minh, who studies here too. This week, Linh gets her own address, and tells the student system. Done, she thinks.

**Picture.** The campus in watercolour daylight. Linh, in plain pencil, at a laptop. A small email card, "nguyen.family@mail.example", with two names under it, Linh and Minh. A new card types in, "linh.nguyen@mail.example". She sends it to the student system's card, which updates with a soft tick.

**On screen.** Linh Nguyen · health informatics · nguyen.family@mail.example · shared with Minh · linh.nguyen@mail.example · student system ✓

### 3 · Four records, four Linhs · 1:02–1:40

**Narration.** But the student system isn't the only one that knows her. The learning platform has her account, with the family email. So does the short-course platform, where she took Health Literacy. And this semester she tutors a first-year unit, so HR has her too, with a staff number. Her certificate and her payslip still go to the family inbox, and Minh opens them. Next year, the alumni office will add one more.

**Picture.** Four cards fan out around Linh, each in its system's colour: *Student · S-20436*, *Platform user · u-88236*, *Short-course customer · nguyen.family@…*, *Casual tutor · E-4417*. Three of them still show the family email, lit amber. An envelope, "certificate C-86", travels to the family inbox; another, "payslip", follows. Minh, edged in gold for a moment, opens one and frowns. A fifth card draws in dashed, "Alumna · next year".

**On screen.** student · S-20436 · platform user · u-88236 · short-course customer · tutor · E-4417 · still the family email · alumna · next year

*Linh, Minh, `S-20436`, `u-88236`, the family email and certificate C-86 are the example project's own data; the staff number and the HR system are new to it.*

### 4 · The kinds of data · 1:40–2:10

**Narration.** Linh is master data: one of the things the university is about, shared by every process and system. The lists that sort her, like "casual tutor" or a country, are reference data. What happens to her, an enrolment or a payslip, is transactional data. And the definition of a learner is metadata. This series is about the first two, and the next film tells them apart.

**Picture.** Four shelves draw in. Linh's white figure on *master data*; two short lists, "role type: casual tutor" and "country: Vietnam", on *reference data*; a stream of small events (enrolled, result, payslip) on *transactional data*; the glossary's term *learner* on *metadata*. The first two shelves stay lit, master in Linh's role colours and reference as bright chips; the others dim.

**On screen.** master data · the things it's about · reference data · the lists that sort them · transactional data · what happens to them · metadata · what it all means

### 5 · The role, called the person · 2:10–2:45

**Narration.** Noor, the university's data architect, opens the university's own model. It has a learner. A good one, with keys from three systems and a decision for every match. But a learner isn't someone. It's how someone relates to the university, for a while. The model has no person. She says so, and writes it down.

**Picture.** Noor, edged in cyan. The university's map from *In the weeds of data crafting*, with `learner` lit in the student domain; behind it, three key sets (SIS, LMS, SC) and the identity decisions. Noor circles *learner* and writes beside it, in her hand: "a role". A small gap opens above it, labelled "person?". A decision card types in: "The model has roles, not people. Add the person."

**On screen.** learner · a role, not someone · the model has no person · add the person

*The correction in the open follows PLAYBOOK §8: the films say when an earlier model was too simple, and sharpen it.*

### 6 · Four things, kept apart · 2:45–3:25

**Narration.** So she draws four things apart. The person: someone, once. The roles: student, tutor, customer, each with a start, an end, and an owner. The contact points: an email or an address, each with a purpose, and some shared by two people. And the identifiers: a student number belongs to the student system, a staff number to HR. None of them is the person. Enterprise architects draw it the same way: a person, a team or an organisation is an actor, assigned to one or more roles, for a time.

**Picture.** The four cards slide off Linh into four lanes. Linh clears to white paper in a pencil line. *Roles*: bands under her, each with dates (student, from July 2025; customer, January to February 2026; tutor, March to June 2026; alumna, dashed). *Contact points*: two email cards, one marked "study, personal: Linh", the other "family: Linh and Minh". *Identifiers*: S-20436 tagged "issued by the student system", u-88236 "by the learning platform", E-4417 "by HR". Each lane's label settles above it. On the last sentence, a small card from *The map before the data* slides in at the side, in its notation: an actor glyph (*person, team or organisation*) with an assignment line to two role glyphs (*student*, *tutor*), and a tag, "for a time".

**On screen.** the person · someone, once · roles · a start, an end, an owner · contact points · a purpose · sometimes shared · identifiers · issued by a system · none of them is the person · actor · assigned to · roles · for a time

### 7 · Who keeps what · 3:25–4:00

**Narration.** Then Noor and Mei write down who keeps what. For each role, which system creates it, and who owns it. For each piece of the person, which system is trusted. The registrar's office keeps the legal name. Linh keeps her own preferred name, and her personal email. HR keeps her work details. And Mei's office looks after the person: who someone is, and whether two records are one.

**Picture.** Mei joins, edged in gold. A small matrix draws in, rows for the attributes, columns for the systems, and lights cell by cell as each line is spoken: *legal name: student system*; *preferred name: Linh*; *personal email: Linh*; *work details: HR*. Below, a second strip for roles: *student: registrar's office*; *customer: short courses*; *tutor: People and culture*; *alumna: alumni office*. At the top, one row: *the person: Mei's office, steward*. Mei's gold tick lands on it.

**On screen.** who creates it · who keeps it · who owns it · legal name · student system · preferred name · Linh · work details · HR · the person · steward · Mei's office

*The people side, said in the picture: Mei's tick is on a row that took a conversation to agree. Each role stays with the office that owns it; only "who is who" moves to a steward.*

### 8 · Elsewhere · 4:00–4:25

**Narration.** Every industry has a Linh. A nurse admitted as a patient, in the same hospital. A bank customer who guarantees a friend's loan. A household where the account holder moved out, and the person who stays needs the power on. Different words, the same four things.

**Picture.** Linh's figure stays; its cards swap. A hospital wristband and a staff badge on one figure, a wall between them. A bank card, and a dotted line to a second figure, "guarantor". A meter, an account holder walking out of frame, and the occupant staying, a small heart symbol, "life support". Each time, the four lanes flash under the figure: person, roles, contact points, identifiers.

**On screen.** a nurse · a patient · a customer · a guarantor · an account holder · an occupant · the same four things

### 9 · Named once · 4:25–4:45

**Narration.** The data management body of knowledge, DAMA, calls this reference and master data. It names four ways to keep it: a registry that only links, a copy for analysis, a master that systems read back, or one place where people are created. The series picks one later, and shows the tools that do it.

**Picture.** DAMA's wheel, with *Reference and master data* lit, and the rest dim. Four small diagrams draw beside it, one by one: *registry* (lines only between cards); *consolidation* (a white figure on the platform side); *coexistence* (lines back from the white figure to each card); *centralised* (the white figure first, cards drawn from it). A small tag on the last two: "Film 7 of 9".

**On screen.** DAMA · reference and master data · registry · consolidation · coexistence · centralised · chosen in Film 7 of 9

### 10 · Not only people · 4:45–5:25

**Narration.** People aren't the only master data. The university also has employers and partner universities, awards and units, campuses and rooms. A hospital has patients, practitioners and wards. A bank, customers, accounts and the firms it trades with. A utility, meters, connection points and poles. A shop, products, suppliers and stores. Which of them need mastering? Ask four questions. Is it a thing the business is about, not something that happens? Is it used by more than one process? Is it created or changed in more than one place, so the copies can disagree? And does it matter when they do: money, safety, the law, or someone's trust? Four yeses: master it.

**Picture.** A gallery draws in around Linh's white figure, each thing a bright card in its industry's colour: *employer*, *partner university*, *award*, *room* (university, teal); *patient*, *practitioner*, *ward* (health, red); *customer*, *account*, *counterparty* (banking, blue); *meter*, *connection point*, *pole* (energy, yellow); *product*, *supplier*, *store* (retail, orange). Then a checklist of four questions slides in. Three examples run through it, ticks landing as each question is asked: *a supplier* gets four ticks and clears to white, like Linh, "master it"; *a payment* fails the first ("it happens: a transaction"); *a currency code* passes the first but is a short list from outside ("a list: reference data, next film").

**On screen.** employer · partner university · award · room · patient · practitioner · ward · customer · account · counterparty · meter · connection point · pole · product · supplier · store · a thing, not an event? · used by more than one process? · kept in more than one place? · does it matter if they disagree? · master it · a transaction · reference data

### 11 · The series · 5:25–5:45

**Narration.** Who is it? Which value wins? Roles that come and go, the lists that sort them, what each role may see, one person in many systems, a hub at work, and how to keep it right.

**Picture.** Linh's timeline, left to right, and nine film cards land along it as they're named: *One person, many roles* (here), *Who is it?*, *Which value wins*, *Roles come and go*, *Lists everyone uses*, *For this purpose only*, *One person, many systems*, *A hub at work*, *Kept, not cleaned*.

**On screen.** the nine films

### 12 · Once · 5:45–6:00

**Narration.** Linh changes her email, once. Every role hears. Know the person, not just the role.

**Picture.** Linh types her new email into a single field; the white figure takes it; lines run out to each card, and each updates with a soft tick. The family inbox stays quiet; Minh, in passing, doesn't look up. Wordless breather on the white figure and its bands. End card.

**On screen.** once · every role hears · Know the person, not just the role.

## Pause and think

1. *After chapter 3.* Which of these are the person, and which are a role: a student number, Linh's date of birth, "casual tutor", the family email?
2. *After chapter 6.* Why might two people rightly share a contact point, but never an identifier?
3. *After chapter 7.* Think of an organisation you deal with in two ways (as a customer and an employee, say). Who keeps your name there, and who would know if you changed it?
4. *After chapter 10.* Pick an organisation you know. Name one thing it should master, one list that's reference data, and one event that's a transaction.

## Labs (candidates)

- **Person, role, contact point or identifier?** Sort twelve cards from Linh's systems into the four lanes.
- **Fill the inventory.** For six attributes and four roles, choose the system that keeps each, and the owner; the lab shows what goes wrong with each wrong choice.
- **Master it or not?** Twelve things from five industries; run each through the four questions.
- **Spot the role called a person.** Three tables from three industries; find the one that stores a role and calls it the person.

## Where it comes from in the project

| On screen | In the example project |
|---|---|
| Linh, Minh, `S-20436`, `u-88236`, the family email | `data/student_system/learners.csv`, `data/learning_platform/users.csv` |
| Health Literacy, certificate C-86 | `data/short_courses/enrolments.csv` (E-7007) |
| The short-course customer decided to be Linh | `seeds/reference/student/learner_identity_decisions.csv` (D-001) |
| The learner, a role, in the student domain | `models/core/student/core_learner.sql`, `_student__conceptual.yml` |
| The university's map | `models/_shared/_shared__conceptual.yml` |
| The tutor role, the staff number E-4417, the HR system | New: a small HR source the series adds to the project |

## Rigour to check before recording

- **Sweden:** the 1686 Church Law and the household examination rolls (*husförhörslängder*), what they recorded (including reading ability), and moving certificates; the personal identity number's introduction in 1947. Keep "asked every parish priest" rather than claiming every parish complied at once.
- **DAMA-DMBOK:** the current edition's name for the knowledge area, and how it names the four ways of keeping master data (registry, consolidation, coexistence, centralised); some sources say "transaction hub" or "authored" for the last.
- **The kinds of data:** the four-way split (master, reference, transactional, metadata) is common teaching, not one standard; say it as a way of sorting, not a law.
- **The party pattern** is not named on screen in this film; it comes in a line in the narration only if time allows, credited to data model pattern books.
- **The four questions:** a synthesis of common criteria (shared across processes, kept in more than one system, identity and cost of error), not one standard's wording; DAMA-DMBOK's own description of master data checked against it.
- **Colour:** each role and industry wash checked for contrast with the dark text on it (4.5:1 or better), and for colour-blind viewers; labels carry the meaning.
- **Enterprise architecture:** in ArchiMate, a business actor (a person, team or organisation) is assigned to business roles; check the current specification's wording, and match the glyphs *The map before the data* draws (`archGlyph` in its `shared/src/ea.js`).
- **Industry beats:** generic and plausible; no real organisation; "life support" customers kept as a general practice of energy retailers in many places.
- **Privacy:** Minh reading Linh's certificate is shown as an everyday consequence, not a breach story; no legal claim.

## Next

1. The author's review of this script.
2. The project's additions it needs: the person, roles, contact points and identifiers in the conceptual model, and a small HR source.
3. Linh's character card, and the series' components in watercolour (washes, pencil line and paper; cards, lanes, the white figure, the inventory matrix), then the source.
