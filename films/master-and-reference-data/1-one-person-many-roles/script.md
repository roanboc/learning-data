# Master and reference data · One person, many roles: script

*The script of the opening film of the series on master and reference data, working title The same one, everywhere: about 6 minutes, in twelve chapters, in English. Drafted on 16 October 2026, built on 17 October 2026, and revised twice the same day after the author's reviews; the times below are the built film's, and [Built](#built) lists what changed on the way. The title card follows chapter 1; the end card follows chapter 12. Made to read on a phone, like the other series: on-screen text at least 28 px in the frame, and the camera moves in on whatever the narration is about.*

## The promise

Every line passes two tests: anyone who has ever had two accounts with the same organisation can follow it, and an experienced master data manager finds nothing wrong in it. The film opens the series and says what it's about. Most systems store a role (a student, a customer, an employee) and call it the person. A person is someone, once; a role is how they relate to the organisation, for a time; a contact point can be shared and has a purpose; an identifier belongs to the system that issued it. Keep those four apart, write down who keeps each one, and most of master data management becomes a set of decisions, not a product. And the same goes for every thing a business is about that's used in many places, kept in more than one, and matters when the copies disagree. **Know the person, not just the role.**

## The story in one paragraph

In 1686, Sweden's church law asked every parish to write down each person in each household, and a person who moved carried a certificate to the next parish; in 1947 the register gave everyone one number for life. Today, at the university, Linh Nguyen, who graduated there in 2022, comes back to study health informatics. She applies online, and the application gives her a new student number: nothing links it to the number she graduated with. So the university has five records of her: two in the student system, under the old number and the new; one at the alumni office, which knows only the old one; one in HR, where she's a casual tutor; and one at the research office, whose project she joined this year. Her application asks for a transcript of the degree the university gave her, and the alumni office invites her back for the master's she's already doing. Five records, and nobody sees they're one person. Noor, the data architect, looks at the university's own model and corrects it in the open: it has a learner, which is a role, and no person. She draws four things apart: the person, the roles, the contact points and the identifiers. Then she and Mei write down, for each role and each attribute, which system creates it, which keeps it, and who owns it. A hospital, a bank and an energy utility have the same problem with different names. DAMA calls this reference and master data, and names four ways to keep it; the series will choose one, and show the tools. People aren't the only master data: organisations, products, places, assets and accounts are too, and four questions say which things need mastering. It ends where it started: this time, when Linh applies, the university finds her first, and adds a role, not a person.

## What each object stands for

| Object | Stands for |
|---|---|
| A parish book, a household's names, a moving certificate | One person, recorded once, followed wherever they go |
| A number stamped on a card, "1947" | An identifier for life, issued by someone who keeps it |
| Linh, drawn once, wearing different cards | One person, many roles |
| A record in each role's colour (two students, an alumna, a casual tutor, a researcher) | A role, as each system stores it |
| A second student number stamped on, and a line towards the first that stops at a red cross | A new record made for someone already known, and nothing linking the two |
| An application asking for a transcript; an email inviting her to a master's | What each system does when it can't see the person |
| A home address marked "shared" | A contact point: it has a purpose, and two people can share it |
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
| Eight film cards in four parts along a line, after this one | The series |
| The application again, and a line that finds her first | Search before create: a role added to a person already known |

## The look

Watercolour, chosen from seven looks drawn from this film's moments. Reference frames: [1686 parish](../look/1686-parish.jpg), [campus today](../look/campus-today.jpg), [four lanes](../look/four-lanes.jpg).

- **Colourful, and every colour means something.** Each role has its own saturated colour, the same in every film: student teal, applicant amber, researcher coral, tutor violet, alumna green (and donor magenta later). A system's cards wear their role's colour as a brushstroke behind the title. The master record is Linh's figure cleared to white paper in a pencil line, gathering those colours: each value carries a small coloured label for its source, and each role is a band of wash with a start and an end, so a golden record reads at a glance as a mix of sources. Each industry in chapters 8 and 10 has its own colour too: health red, banking blue, energy yellow, retail orange, public sector green-blue.
- **Backgrounds** are daylight landscapes in watercolour, not the dark glass of the other series: soft washes of sky and land on warm paper, clouds left as bare paper, buildings and trees drawn in pencil. They stay soft so the role colours, the strongest washes on screen, carry the meaning. Reference data is drawn as bright tabs and chips; transactions as small, quick dabs of colour.
- **Readable, not only bright.** Text is dark ink on paper-light cards, and keeps 4.5:1 contrast or better on a role's wash. Every colour is paired with a label, so nothing depends on colour alone; `legible.py` checks text size frame by frame, as for the other series.
- **The past is the same watercolour,** with the year in the corner; its documents are parchment and ink, as in the other series, touched with the colour of the idea they carry (the parish book's household ribbon in teal, the first role colour).
- **People** are drawn in pencil, with paint that runs a little past the line. Linh, a new figure for the series, has no side colour: she's the person the data is about, so she wears the colours of her roles. Noor (cyan, the technical side) and Mei (gold, the business side) are edged in a soft wash of their side's colour, as they're outlined in *From words to data* and *In the weeds of data crafting*. Her brother is never drawn: he appears only in the home address they share.
- **Industry beats** keep Linh's figure and swap the cards: a hospital wristband, a bank card, a meter. No real organisation is named or drawn.

## Script

### 1 · One record, wherever you go · 0:00–0:35

**Narration.** In 1686, Sweden's church law asked every parish priest to keep a book of every household: who lived there, when they were born, whether they could read. When someone moved, they carried a certificate to their new parish, and the next book took them in. In 1947, the register gave everyone a number for life. One person, written down once, followed wherever they went.

**Picture.** Parchment and ink, "1686" in the corner. A parish book opens on a household: a farmer, his wife, three children, a farmhand, each name with a birth year and a mark for reading. A quill adds a line: "moved to Uppsala parish". A small certificate folds and travels along a road to a second book, which opens and takes the name in. "1947": a number stamps onto a card. Wordless breather: the two books side by side, one name in both. Then the title card, *One person, many roles*.

**On screen.** 1686 · Sweden · every household · moved to · 1947 · a number for life · one person, followed · One person, many roles · Film 1 of 9

### 2 · Back to study · 0:35–0:55

**Narration.** Today, at the university. Linh Nguyen graduated here in 2022. Last year, she came back to study health informatics. She applied online, and got a new student number. Nothing linked it to the number she graduated with.

**Picture.** The campus in watercolour daylight. Linh, in plain pencil, and a card with her name; "health informatics" joins it as it's said. Her record from her first degree arrives on the left, joined to her by a teal line: *Student · S-17142 · bachelor's · 2019–22*. She takes out her phone to apply, and a new record arrives on the right, *Student · master's · from Jul 2025*, its number, S-20436, stamped on as the number of 1947 was. A pencil line sets out from the new record towards the old one, stops halfway, and is crossed in red ink.

**On screen.** today · the university · Linh Nguyen · health informatics · Student · S-17142 · bachelor's · 2019–22 · S-20436 · master's · from Jul 2025

### 3 · Five records, five Linhs · 0:55–1:37

**Narration.** Now the university has five records of her. Two in the student system, under the old number and the new. One at the alumni office, which knows only the old one. One in HR, which pays her to tutor a first-year unit. And one at the research office, for a project she joined this year. So her application asked for a transcript of the degree the university gave her. And the alumni office invites her back, for a master's. She's already doing one. Five records, five Linhs, and nobody sees that she's one person.

**Picture.** Three blank cards draw in as "five records" is said, and each is named as the voice names its office, in its role's colour: *Alumna · S-17142 · graduated 2022*, *Casual tutor · E-4417 · a first-year unit*, *Researcher · R-3082 · a project · Mar–Dec 2026*. Pencil rings mark the old number and the new, then the alumni office's S-17142. Her application arrives at the right, under S-20436, and types in a dashed field, "transcript of your degree", marked "required"; a ring finds "bachelor's · 2019–22" on her old record. Below it, the alumni office's email to S-17142: "Come back for a master's, to our graduates of 2022"; a ring finds "master's · from Jul 2025" on her new record. A quiet pulse runs under both. On "nobody", the lines to Linh fade, and a tag settles: "five records, one person".

**On screen.** Alumna · S-17142 · graduated 2022 · Casual tutor · E-4417 · a first-year unit · Researcher · R-3082 · a project · Mar–Dec 2026 · Application · master's · health informatics · transcript of your degree · required · Alumni office · Come back for a master's · to our graduates of 2022 · five records, one person

*Linh and `S-20436` are the example project's own data; her first-degree number, S-17142, the staff number, the research number, and the HR, research and alumni systems are new to it.*

### 4 · The kinds of data · 1:37–2:06

**Narration.** Linh is master data: one of the things the university is about, shared by every process and system. The lists that sort her, like “casual tutor” or a country, are reference data. What happens to her, an enrolment or a payslip, is transactional data. And the definition of a learner is metadata. This series is about the first two, and the next film tells them apart.

**Picture.** Four shelves draw in. Linh's white figure on *master data*; two short lists on *reference data*, "role type" (student, casual tutor, researcher, alumna) with "casual tutor" lit, and "country" with "Vietnam" lit; a stream of small events (enrolled, result, payslip) on *transactional data*; the glossary's term *learner* on *metadata*. The first two shelves stay lit, master in Linh's role colours and reference as bright chips; the others dim.

**On screen.** master data · the things it's about · reference data · the lists that sort them · transactional data · what happens to them · metadata · what it all means

### 5 · The role, called the person · 2:06–2:31

**Narration.** Noor, the university's data architect, opens the university's own model. It has a learner. A good one, with keys from three systems and a decision for every match. But a learner isn't someone. It's how someone relates to the university, for a while. The model has no person. She says so, and writes it down.

**Picture.** Noor, edged in cyan. The university's map from *In the weeds of data crafting*, with `learner` lit in the student domain; behind it, three key sets (SIS, LMS, SC) and the identity decisions. Noor circles *learner* and writes beside it, in her hand: "a role". A small gap opens above it, labelled "person?". A decision card types in: "The model has roles, not people. Add the person."

**On screen.** learner · a role, not someone · the model has no person · add the person

*The correction in the open follows PLAYBOOK §8: the films say when an earlier model was too simple, and sharpen it.*

### 6 · Four things, kept apart · 2:31–3:14

**Narration.** So she draws four things apart. The person: someone, once. The roles: student, tutor, researcher, each with a start, an end, and an owner. The contact points: an email or an address, each with a purpose, and some shared by two people. And the identifiers: a student number belongs to the student system, a staff number to HR. None of them is the person. Enterprise architects draw it the same way: a person, a team or an organisation is an actor, assigned to one or more roles, for a time.

**Picture.** The four cards slide off Linh into four lanes. Linh clears to white paper in a pencil line. *Roles*: a chip for each, with its dates (student, from July 2025; tutor, since February 2023; researcher, March to December 2026; alumna, since 2022), in the order the voice names them, and a band of each colour on her. *Contact points*: "linh.nguyen@mail.example, personal · Linh", and "7 Hill Road, home · Linh and her brother", marked "shared". *Identifiers*: "S-17142 · S-20436, by the student system", "E-4417, by HR", "R-3082, by the research office". Each lane's label settles above it. On the last sentence, a small card from *The map before the data* slides in at the side, in its notation: an actor glyph (*person, team or organisation*) with an assignment line to two role glyphs (*student*, *tutor*), and a tag, "for a time".

**On screen.** the person · someone, once · roles · a start, an end, an owner · contact points · a purpose · sometimes shared · identifiers · issued by a system · none of them is the person · actor · assigned to · roles · for a time

### 7 · Who keeps what · 3:14–3:43

**Narration.** Then Noor and Mei write down who keeps what. For each role, which system creates it, and who owns it. For each piece of the person, which system is trusted. The registrar's office keeps the legal name. Linh keeps her own preferred name, and her home address. HR keeps her work details. And Mei's office looks after the person: who someone is, and whether two records are one.

**Picture.** Mei joins, edged in gold. A sheet, *who keeps what*, fills in as each line is spoken. First the roles, each with the system that creates it and who owns it: *student: student system, registrar's office*; *tutor: HR system, HR*; *researcher: research system, research office*; *alumna: alumni system, alumni office*. Then the pieces of the person, each with its trusted system and who keeps it: *legal name: student system, registrar's office*; *preferred name* and *home address: self-service, Linh*; *work details: HR system, HR*. Last, one row: *the person: Mei's office, steward*. Mei's gold tick lands on it.

**On screen.** who keeps what · who creates it · who owns it · trusted system · who keeps it · legal name · student system · registrar's office · preferred name · home address · self-service · Linh · work details · HR · the person · steward · Mei's office

*The people side, said in the picture: Mei's tick is on a row that took a conversation to agree. Each role stays with the office that owns it; only "who is who" moves to a steward.*

### 8 · Elsewhere · 3:43–4:05

**Narration.** Every industry has a Linh. A nurse admitted as a patient, in the same hospital. A bank customer who guarantees a friend's loan. A household where the account holder moved out, and the person who stays needs the power on. Different words, the same four things.

**Picture.** Linh's figure stays; its cards swap. A hospital wristband and a staff badge on one figure, a wall between them. A bank card, and a dotted line to a second figure, "guarantor". A meter, an account holder walking out of frame, and the occupant staying, a small heart symbol, "life support". Each time, the four lanes flash under the figure: person, roles, contact points, identifiers.

**On screen.** a nurse · a patient · a customer · a guarantor · an account holder · an occupant · the same four things

### 9 · Named once · 4:05–4:28

**Narration.** The data management body of knowledge, DAMA, calls this reference and master data. It names four ways to keep it: a registry that only links, a copy for analysis, a master that systems read back, or one place where people are created. The series picks one later, and shows the tools that do it.

**Picture.** DAMA's wheel, with *Reference and master data* lit, and the rest dim. Four small diagrams draw beside it, one by one: *registry* (lines only between cards); *consolidation* (a white figure on the platform side); *coexistence* (lines back from the white figure to each card); *centralised* (the white figure first, cards drawn from it). A small tag, "chosen in Film 7 of 9".

**On screen.** DAMA · reference and master data · registry · consolidation · coexistence · centralised · chosen in Film 7 of 9

### 10 · Not only people · 4:28–5:20

**Narration.** People aren't the only master data. The university also has employers and partner universities, awards and units, campuses and rooms. A hospital has patients, practitioners and wards. A bank, customers, accounts and the firms it trades with. A utility, meters, connection points and poles. A shop, products, suppliers and stores. Which of them need mastering? Ask four questions. Is it a thing the business is about, not something that happens? Is it used by more than one process? Is it created or changed in more than one place, so the copies can disagree? And does it matter when they do: money, safety, the law, or someone's trust? Four yeses: master it.

**Picture.** A gallery draws in around Linh's white figure, each thing a bright card in its industry's colour: *employer*, *partner university*, *award*, *room* (university, teal); *patient*, *practitioner*, *ward* (health, red); *customer*, *account*, *counterparty* (banking, blue); *meter*, *connection point*, *pole* (energy, yellow); *product*, *supplier*, *store* (retail, orange). Then a checklist of four questions slides in. Three examples run through it, ticks landing as each question is asked: *a supplier* gets four ticks and clears to white, like Linh, "master it"; *a payment* fails the first ("it happens: a transaction"); *a currency code* passes the first but is a short list from outside ("a list: reference data, next film").

**On screen.** employer · partner university · award · room · patient · practitioner · ward · customer · account · counterparty · meter · connection point · pole · product · supplier · store · a thing, not an event? · used by more than one process? · kept in more than one place? · does it matter if they disagree? · master it · a transaction · reference data

### 11 · The series · 5:20–5:32

**Narration.** Eight more films follow, in four parts. Who someone is. Roles and lists. Sharing it safely. And keeping it right.

**Picture.** A line, left to right, with this film's card at its start, marked "here". Four blank tags are set down on it as the parts are counted; each is named as it's said, and its two films land beside it, one above and one below: *who someone is* (*Who is it?*, *Which value wins*), *roles and lists* (*Roles come and go*, *Lists everyone uses*), *sharing it safely* (*For this purpose only*, *One person, many systems*), *keeping it right* (*A hub at work*, *Kept, not cleaned*). The tags wear no role's colour. A wordless moment to read them.

**On screen.** here · who someone is · roles and lists · sharing it safely · keeping it right · each film's number and title

### 12 · Found first · 5:32–5:55

**Narration.** This time, when Linh applies, the university finds her first. It adds a role, not a person. Her degree is already there, and the alumni office sees she's back. Know the person, not just the role.

**Picture.** July 2025 again, and Linh as the person: her white figure, with the bands of the roles she held then, tutor and alumna. Her application arrives at the right; an amber line runs from it to her, and it ticks "found: Linh Nguyen, S-17142". A teal band is added under her, with its chip, "Student, from Jul 2025". The application ticks "her degree: already on file", and the alumni office's card, still under S-17142, ticks "studying here again: a master's, from Jul 2025". The cards step back for the last line, which then settles onto the end card. Wordless breather. End card.

**On screen.** July 2025 · the university · Application · found: Linh Nguyen, S-17142 · Student · from Jul 2025 · her degree: already on file · Alumni office · studying here again · a master's, from Jul 2025 · Know the person, not just the role.

## Pause and think

Four questions, one at the end of each of four chapters, as the site shows them (`site/assets/one-person-many-roles/think.en.js` and `think.es.js`):

1. *After chapter 3, Five records, five Linhs.* Linh's application asked for a transcript of a degree the university gave her. Why didn't it know? (The application gave her a new student number, and nothing linked it to the record of her degree, under the old one.)
2. *After chapter 6, Four things, kept apart.* Linh and her brother can share a home address, but never a student number. Why? (A contact point is a way to reach people, and two can share it; an identifier is issued by one system to name one record.)
3. *After chapter 7, Who keeps what.* Linh's legal name, her preferred name and her work details all describe her. Why does each have a different keeper? (Each piece is trusted where it's made and checked.) It ends by asking viewers who keeps their own name in an organisation that knows them in two ways.
4. *After chapter 10, Not only people.* An energy utility's meters are in its asset system, its billing system and its field crews' app, and a wrong meter means a wrong bill. What do the four questions say? (Master it.) It ends by asking viewers to name, for an organisation they know, one thing to master, one list that's reference data, and one event that's a transaction.

## Labs (candidates)

- **Person, role, contact point or identifier?** Sort twelve cards from Linh's systems into the four lanes.
- **Fill the inventory.** For six attributes and four roles, choose the system that keeps each, and the owner; the lab shows what goes wrong with each wrong choice.
- **Master it or not?** Twelve things from five industries; run each through the four questions.
- **Spot the role called a person.** Three tables from three industries; find the one that stores a role and calls it the person.

## Where it comes from in the project

| On screen | In the example project |
|---|---|
| Linh, `S-20436`, `u-88236` | `data/student_system/learners.csv`, `data/learning_platform/users.csv` |
| Her first-degree record, S-17142, never linked to S-20436 | New: a graduate's record the series adds to the student system's data |
| The learner's short-course key, decided to be Linh | `seeds/reference/student/learner_identity_decisions.csv` (D-001) |
| The learner, a role, in the student domain | `models/core/student/core_learner.sql`, `_student__conceptual.yml` |
| The university's map | `models/_shared/_shared__conceptual.yml` |
| The tutor role, the staff number E-4417, the HR system | New: a small HR source the series adds to the project |
| The researcher role, R-3082, the research office | New: a small research office source the series adds to the project |
| The alumna role and the alumni office | New: an Advancement source the series adds to the project |
| 7 Hill Road, linh.nguyen@mail.example | Invented for the film; the project holds no addresses yet (contact points with a purpose come with *Which value wins*) |

## Rigour to check before recording

- **Sweden:** the 1686 Church Law and the household examination rolls (*husförhörslängder*), what they recorded (including reading ability), and moving certificates; the personal identity number's introduction in 1947. Keep "asked every parish priest" rather than claiming every parish complied at once.
- **DAMA-DMBOK:** the current edition's name for the knowledge area, and how it names the four ways of keeping master data (registry, consolidation, coexistence, centralised); some sources say "transaction hub" or "authored" for the last.
- **The kinds of data:** the four-way split (master, reference, transactional, metadata) is common teaching, not one standard; say it as a way of sorting, not a law.
- **The party pattern** is not named on screen in this film; it comes in a line in the narration only if time allows, credited to data model pattern books.
- **The four questions:** a synthesis of common criteria (shared across processes, kept in more than one system, identity and cost of error), not one standard's wording; DAMA-DMBOK's own description of master data checked against it.
- **Colour:** each role and industry wash checked for contrast with the dark text on it (4.5:1 or better), and for colour-blind viewers; labels carry the meaning.
- **Enterprise architecture:** in ArchiMate, a business actor (a person, team or organisation) is assigned to business roles; check the current specification's wording, and match the glyphs *The map before the data* draws (`archGlyph` in its `shared/src/ea.js`).
- **Industry beats:** generic and plausible; no real organisation; "life support" customers kept as a general practice of energy retailers in many places.
- **A graduate given a second student number:** universities publish notices about it. The University of Glasgow's registry (read 17 October 2026, gla.ac.uk/myglasgow/registry/staff/studentrecords/duplicatestudentrecords) says "there are circumstances where the system will create a new student number/GUID", for example a graduate who applies again without saying they studied there, and merges "both records to the GUID the student has graduated on". The University of Galway's registration office notice *Merging numbers* (found 17 October 2026, ugal.ie/media/registrationoffice/files/Merging-numbers.pdf) tells returning students that an unmerged number affects their fees, email, course pages and library access. The film names neither: its university is invented.
- **Logins are not the fault:** a person with separate staff and student logins is normal at a university; the film never blames them. The fault is a person nobody can see.
- **The two letters:** an application asking a graduate for a transcript, and an alumni email inviting a current student to the course she's on, are everyday consequences of the missing link, said without any legal claim.
- **Roles at a university:** a casual tutor is on HR's books with a staff number; a research project's office keeps its own list of members; an alumni office keeps graduates. Each is common practice, said without naming a real university.

## Built

Built on 17 October 2026, from this script, in watercolour. What changed on the way, also in the series' *Decided* table:

- **Chapter 1.** The household in the parish book is Anders Persson, Karin Olsdotter and their three children; Olof, the farmhand, is the one who moves, and the next book, in Uppsala, takes him in. When "1947" comes, a veil of paper quiets the parish, so the card and its stamp stand alone.
- **Chapter 2.** Linh applies on her phone, and her new number is stamped on, as the number of 1947 was. The camera ends where chapter 3's begins, so the campus and her records don't double as the chapters cross.
- **Chapter 3.** The three other records arrive blank as "five records" is said, and each is named as the voice names its office, so the count comes before the detail. The application and the alumni office's email take the right of the frame, each ringing the part of her old or new record it missed.
- **Chapter 4.** The camera shows the four shelves, then moves in on the first two, which the series is about.
- **Chapter 5.** The camera moves in on the learner, with Noor at the edge of the shot, and the rest of the model fades while we look at it. She writes the decision on a card pinned behind her.
- **Chapter 7.** The sheet has its own headers (who creates it and who owns it for the roles; the trusted system and who keeps it for the person), and HR is the tutor role's owner. Mei is drawn facing the other way, so her pointing hand stays in the frame.
- **Chapter 8** is one wide shot: the industry being told stands out and the others step back. The account holder's role stays behind, dashed, when he moves out.
- **Chapter 9.** The chosen way to keep master data is tagged "chosen in Film 7 of 9".
- **Chapter 10.** The gallery stays while "which of them" is asked, and gives way to the questions.
- **Chapter 11** holds still, with no pan: four blank tags for the parts, each named in turn with its two films, then two wordless seconds to read them.
- **Chapter 12.** It goes back to July 2025, to the same application and email, so the difference is the only thing that changes. The film's last line is also on the end card: the records step back for it, and it settles from the top of the frame onto the card, so it's never shown twice.
- **After the author's first review (17 October 2026).** A move instead of a new email, since a shared family email was hard to follow (the second review replaced the move, below); a researcher instead of a customer, since a university doesn't call people customers; the roles laid out in the order the voice names them; no bridge in the opening landscape, the church on a wider hill; the series in four parts, in two lines; and an ending with no second person on a phone.
- **After the author's second review (17 October 2026).** A return to study instead of the move, since a contract posted to an old flat isn't how universities work now ("physical addresses for contracts are not really used anymore"); the author chose it from five drafted scenarios. Chapters 2, 3 and 12 are new: *Back to study*, *Five records, five Linhs* and *Found first*. The film is 5:55.
- **Captions.** Spanish captions in Latin American Spanish, about as long as each English line.
- **Sound.** A new palette (in `source/tools/score.py`): chords that bloom note by note, a clarinet for the series' mark, a plucked note for each role, a bowed D and A for the person, from D minor to D major. The music sits about 21 dB under the voice, as in the other series' films, and the only pulse, under the transcript the application asks for and the alumni office's invitation, sits about 8 dB under the music.
- **Paper.** A wash that starts left of the frame is now blotched right to its edge: the parish, the campus, the plains and the office had a pale strip down their left side until 17 October 2026, when the series' wash was fixed.

## Next

1. The author watches the film, and approves it or asks for corrections.
2. The project's additions it needs: the person, roles, contact points and identifiers in the conceptual model; small HR, research office and Advancement sources; and Linh's first-degree record, under S-17142.
3. Labs, once the series has more films: the candidates above.
