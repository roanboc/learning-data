# Master and reference data · For this purpose only: script

*The script of the sixth film of the series on master and reference data, working title The same one, everywhere: about 5 minutes, in ten chapters, in English. Written and built on 17 October 2026 from the approved plan ([proposal](../proposal.md#6-for-this-purpose-only)); the times below are the built film's, and [Built](#built) lists what changed on the way. The title card follows chapter 1; the end card follows chapter 10. Made to read on a phone, like the other films of the series: on-screen text at least 28 px in the frame, and the camera moves in on whatever the narration is about.*

## The promise

Every line passes two tests: anyone who has ever told an organisation "please don't contact me", and then heard from it anyway, can follow it, and an experienced master data manager or privacy officer finds nothing wrong in it. Each role's data was given for a reason: a student's results to teach and award degrees, a tutor's pay to employ her, a researcher's data for one project. Write that reason down beside the data, as data, so a team can read a role's data only for a purpose written on it. And keep the person's own wishes (a no to fundraising, a yes to news) on the person, not on the role where she happened to say them, so they reach every list that finds her. The platform then holds both: tags on the columns, and policies that read them. When she asks what the university holds about her, the answer starts from the person and finds every role. **Data given for one role isn't free for every role.**

## The story in one paragraph

About two thousand years ago, India's Charaka Samhita, a book of medicine, set down the oath a teacher gave each new student: "the peculiar customs of the patient's household shall not be made public". A healer goes into a home to heal, and what they see there stays in that home. Today, at the university, two things happen in one month. Owen, who runs Advancement's appeals, plans an appeal for a new scholarship and asks the registry for this year's top students, to feature them; their results were collected to teach and to award degrees, not to raise money, but nothing in the data says so, and the list goes. And the appeal's email, sent to the faculty's students and alumni, reaches Linh as a student, although she asked the alumni office in 2022 not to ask her for donations: her wish was written on her alumni record, and the student system never heard it. Her records are linked now (*Who is it?*), but the wish sat on one of them, not on her. So the university writes its own oath, as data: each role's owner writes down what its data is for, from one list of purposes; Linh's wishes go on the person, each with its purpose, its date, who she told and how to change it. Jun writes the purposes in dbt as tags on the columns, with a test that fails when personal data has no purpose, and two policies in Unity Catalog read them: one hides the results from the appeals team, the other leaves out anyone who said no. The next appeal goes to alumni: 2,140 selected, 37 taken off, Linh among them. Then Linh asks what the university holds about her, and Mei's office answers from the person, every role and every value with its source, in days. A shop and a hospital have the same rule. What the healer saw stayed inside the house; what Linh gave each role stays with its purpose.

## What each object stands for

| Object | Stands for |
|---|---|
| A palm-leaf book bound between two boards, and a line of the oath, in translation | A rule written down once, and passed on to everyone who learns the work |
| A small fire altar between a teacher and a student | The oath given before teaching begins |
| A healer with a bag, walking into a house; the door closing on its lamplight | What is learned for one purpose (healing) stays where it was learned |
| A neighbour leaning out, and the healer walking on | A second purpose asking, and the first one's answer: no |
| A tag on the house door, "to heal", in health red | The purpose a door was opened for |
| A record in each role's colour, its values behind a painted door | A role's data, which only a request with the right purpose opens |
| A tag on each door: "teaching and awards", "news, events, fundraising", "employment", "her project, as agreed" | Each role's purposes, written beside the data, as data |
| The appeal's request, a tag in donor magenta: "fundraising" | A team asking for a role's data for its own purpose |
| A door that stays shut with a soft knock; a door that swings open | Access refused, and access allowed, by purpose |
| An empty dashed tag on a record | A purpose nobody wrote down |
| A note on Linh's alumni record, "no fundraising" | A wish kept on a role's record, where only that system sees it |
| The same note on Linh's white figure, with its fields | A wish kept on the person, as data: purpose, date, who she told, how to change it |
| A pencil latch from the note to a door | The person's wish closing a door that the role's purpose would open |
| The list of purposes, with an owner and a date | Reference data: purposes come from one list (*Lists everyone uses*) |
| A dbt YAML card, `databricks_tags: {purpose: teaching}` | dbt writes the purposes as tags on the columns |
| A test that fails, then passes | No personal data without a purpose |
| Two policy cards in Unity Catalog's SQL | The platform holds the rule: a column mask by purpose, a row filter by wish |
| A table as the appeals team sees it: a column of grades hidden, rows missing | What the policies do |
| The appeal's list: 2,140, then 37 taken off, Linh struck through | The wishes honoured, wherever they were given |
| Linh's request, and lines from her white figure to every role | An access request answered from the person, not office by office |
| Each value with a small coloured label | Each value's source (*Which value wins*) |
| A shop's loyalty card behind a door marked "discounts"; a hospital's consent marked "study A" | The same rule in other industries |

## The look

Watercolour, the series' own ([reference frames](../look/)), with the role colours as the strongest washes on screen.

- **Colour means what it meant in film 1.** Student teal, applicant amber, researcher coral, tutor violet, alumna green, and here, for the first time, donor magenta: the appeal, and every request made to raise money, wears it, because it asks Linh to take a role she declined. The industries keep theirs: the shop orange, the hospital red, and the healer's purpose in the opening is touched with health red. A cross is red ink; a tick is green ink.
- **Doors.** Each role's values sit behind a door painted in the role's wash, hinged on its left, with the role's purposes on a paper tag on it. A door opens by swinging on its hinge, narrowing in perspective; it stays shut with a small shake. The opening's house has a door of its own, so the idea is drawn before it is named.
- **The person** is Linh cleared to white paper in a pencil line, banded in her roles' colours, as in film 1. Her wishes are a small note pinned to her: data, not a feeling.
- **The past** is the same watercolour, with "about 2,000 years ago · India" in the corner: a hot, bright day on the plains, a teacher's thatched shelter under a banyan, a fire altar of brick, fields, palms, and a village of plastered walls and thatched roofs. People are dressed for their time, after the dress shown in Indian sculpture of the period: an unstitched lower garment and an upper cloth over one shoulder, bare feet, hair tied up; the woman next door in a long wrap with a cloth over her head. Drawn in the series' pencil and wash, not in any Indian painting style. The book is a palm-leaf manuscript bound with a cord between two boards; its writing is drawn as lines, not as letters of a script, and the oath's line is shown in English, marked as a translation.
- **The platform** is drawn as the series draws it: paper cards, code in mono, the tools named once.
- **Readable, not only bright.** Text is dark ink on paper-light cards, at 28 px or more after the camera's zoom; every colour is paired with a label.

## Script

### 1 · What stays in the house · 0:00–0:44

**Narration.** About two thousand years ago, India's Charaka Samhita, a book of medicine, set down an oath. A teacher gave it to each new student, by the sacred fire, before teaching them anything. One line says: the peculiar customs of the patient's household shall not be made public. A healer comes into a home to heal, and sees how the family lives. It stays in that home. What you learn for one purpose isn't yours for every purpose.

**Picture.** A hot, bright plain in watercolour, "about 2,000 years ago · India" in the corner. A palm-leaf book opens on its boards, its leaves lined with ink. The camera moves to a thatched shelter under a banyan: a teacher, white-bearded, and a young student stand on either side of a small brick fire altar, its flames moving. The line of the oath settles on a paper strip, in English, "from the oath, in translation". The student, now a healer with a cloth bag, walks the road to a village house; its door opens on lamplight and he goes in; a tag on the door, "to heal", in health red. He comes out, and the door closes; its light stays inside. Next door, a woman leans out to ask; he walks on. Wordless: the road, the closed door, the light. Then the title card, *For this purpose only*.

**On screen.** about 2,000 years ago · India · Charaka Samhita · the peculiar customs of the patient's household shall not be made public · from the oath, in translation · to heal · For this purpose only · Film 6 of 9

### 2 · An appeal · 0:44–1:07

**Narration.** Today, at the university. Advancement, the alumni office, plans an appeal for a new scholarship. Owen, who runs it, asks the registry for this year's top students, to feature them. Their results were collected to teach them and award their degrees, not to raise money. But nothing in the data says so, and the list goes.

**Picture.** The campus in daylight, "today · the university". Owen, edged in gold, and his card. The appeal's card, its title on a magenta stroke: *Scholarship appeal · health informatics*. A request types itself in: "this year's top students". The student system's card, *Results*, in teal, and on it an empty, dashed tag where a purpose would be. The list leaves it and settles on the appeal: *top students · 24*.

**On screen.** today · the university · Owen Price · Advancement · Scholarship appeal · health informatics · this year's top students · Results · student system · top students · 24

### 3 · A wish left behind · 1:07–1:40

**Narration.** The same month, the appeal's email goes to the faculty's students and alumni. It reaches Linh, as a student. She's back for a master's. When she graduated in 2022, she asked the alumni office not to ask her for donations. They wrote it on her alumni record. The student system never heard it. Her records are linked now, but the wish was written on one of them, not on her.

**Picture.** Linh on the campus path, her phone in her hand. The email arrives beside her, magenta: *Give to the new scholarship*, "to: Linh Nguyen, student". Her two records: *Alumna · S-17142 · since 2022*, with a note pinned to it, "no fundraising · Dec 2022", and *Student · S-20436 · master's, from Jul 2025*, with none. The email's line runs from the student record to her phone. A pencil line sets out from the note towards the student record and stops at a red cross. Then a teal line joins the two records, "linked: one person", and a pencil ring finds the note, still on the alumni record. A quiet pulse runs under the chapter.

**On screen.** Advancement · Give to the new scholarship · to: Linh Nguyen, student · Alumna · S-17142 · since 2022 · no fundraising · Dec 2022 · Student · S-20436 · master's, from Jul 2025 · linked: one person

### 4 · What each role is for · 1:40–2:15

**Narration.** So the university writes its own oath, as data: what each role's data is for. The student's results: teaching and awards. The alumna's details: news, events and fundraising. The tutor's pay: employment. The researcher's data: her project, as she agreed. Each purpose comes from one list, with an owner and a date. A team may use a role's data only for a purpose written on it. So the appeal can open the alumna's door, and no other.

**Picture.** Paper, with a little sky. Linh as the person, white paper in a pencil line, banded in her roles' colours. Her four records stand around her, each with its values behind a painted door: *Student*, *Alumna*, *Casual tutor*, *Researcher*. As each is named, its purposes are written on the tag on its door. The list of purposes slides in below: *purposes · owner: privacy office · from Mar 2026*. Then the appeal's magenta tag, "fundraising", goes from door to door: the student's stays shut with a soft knock, the alumna's swings open on her details, the tutor's and the researcher's stay shut.

**On screen.** Student · teaching and awards · Alumna · news, events, fundraising · Casual tutor · employment · Researcher · her project, as agreed · purposes · owner: privacy office · from Mar 2026 · fundraising · only for a purpose written on it

### 5 · Wishes on the person · 2:15–2:40

**Narration.** And Linh's wishes go on the person, not on a role. Each one is data: what she asked, for which purpose, when, to whom, and how to change it. Her no to fundraising closes the alumna's door too. A no she gave the alumni office now holds wherever she appears, until she changes it.

**Picture.** The note lifts off the alumni record and settles on Linh's white figure, and opens into its fields, one by one as they're said: *no · fundraising · Dec 2022 · told the alumni office · change it: her settings*. The magenta tag tries the alumna's door again; a pencil latch runs from the note to it, and it stays shut. The latch reaches every one of her doors. A tag settles: "a no, wherever she appears".

**On screen.** no · fundraising · Dec 2022 · told the alumni office · change it: her settings · a no, wherever she appears

### 6 · Written into the platform · 2:40–3:22

**Narration.** On the platform, Jun writes each purpose in dbt, as a tag on the columns. A test fails if a column with personal data has no purpose. Then two policies in Unity Catalog read the tags. One hides every column tagged for teaching from the appeals team. The other leaves out anyone whose wishes say no. Each is written once, and every table with those tags follows it.

**Picture.** Jun, edged in cyan, at the left. A dbt YAML card types in: a column, `grade`, with `databricks_tags: {purpose: teaching}`. Beside it, the test: `personal_data_has_a_purpose`, failing on one column, then passing once its tag is written. Two cards in Unity Catalog's SQL slide in, one after the other: a column mask on columns tagged `purpose = teaching`, to `appeals`; a row filter that reads each person's wishes. Then the table as the appeals team sees it: names and emails, the grade column hidden, two rows gone. Last, three tables' names light under the policies: every table with those tags.

**On screen.** dbt · grade · databricks_tags · purpose: teaching · personal_data_has_a_purpose · 1 column with no purpose · passed · Unity Catalog · COLUMN MASK · TO `appeals` · MATCH COLUMNS has_tag_value('purpose', 'teaching') · ROW FILTER · USING COLUMNS (p, 'fundraising') · as the appeals team sees it · hidden · every table with these tags

### 7 · The appeal, again · 3:22–3:42

**Narration.** So the next appeal goes to alumni, as their role allows. It selects 2,140 of them. 37 come off, because their no sits on the person, and Linh is one of them. The top students' results stay with teaching.

**Picture.** The appeal's card, its list counting up: *alumni selected · 2,140*. Then *said no · 37* subtracts, and *to ask · 2,103* settles. In the list, Linh's line is struck through in red ink, her note beside it. The results card, back in teal, with its tag, "teaching and awards", and its door shut. A wordless moment to read the numbers.

**On screen.** Scholarship appeal · alumni selected · 2,140 · said no · 37 · to ask · 2,103 · Linh Nguyen · no fundraising · Results · teaching and awards

### 8 · What do you hold about me? · 3:42–4:30

**Narration.** Then Linh asks the university what it holds about her. That used to mean four offices, each searching its own system. Now Mei's office starts from the person, and the links find every role. Each value comes back with where it came from, and what it's for. A correction goes to the office that keeps the value. Her answer is ready in days, not weeks. If she asked to be forgotten, each role would keep only what it must. Her degree for good, and her project's data for as long as its rules require.

**Picture.** Mei's office. Linh's request arrives as a card, "What do you hold about me?", dated 3 Nov. Four offices' cards appear dimmed, each with its own search, then step back. Mei, edged in gold, faces the person: Linh's white figure, and from her bands, lines to every record: two student records, the alumna, the casual tutor, the researcher. An answer builds on the right, *What we hold about you*, a section per role, each value with a small label in its source's colour and its purpose. A correction arrow runs from one value back to its office. "answered 7 Nov". Then a chip on each record: *degree · kept for good*, *project data · kept as its rules require*.

**On screen.** What do you hold about me? · 3 Nov · What we hold about you · Student · Alumna · Casual tutor · Researcher · source · purpose · answered 7 Nov · degree · kept for good · project data · kept as its rules require

### 9 · Elsewhere · 4:30–4:48

**Narration.** Every industry has these doors. A shop's loyalty card was given for discounts, not to decide who gets credit. A hospital patient agreed to one study. The next study asks again.

**Picture.** Two panels. A shop, in orange: a loyalty card behind a door marked "discounts"; a request marked "credit" knocks, and it stays shut. A hospital, in red: a patient's consent behind a door marked "study A"; "study B" knocks and stays shut; a new consent card, "study B · asked", is written, and its own door opens.

**On screen.** a shop · loyalty card · discounts · credit · a hospital · consent · study A · study B · asked

### 10 · For this purpose only · 4:48–5:08

**Narration.** What the healer saw stayed inside the house. The university keeps each role's data inside its purpose, and Linh's wishes with her. Data given for one role isn't free for every role.

**Picture.** The house from the opening, its door closed on its light. It gives way to Linh as the person, her four doors closed, each with its tag, and her note on her. The cards step back for the last line, which settles onto the end card. Wordless breather. End card.

**On screen.** Data given for one role isn't free for every role. · For this purpose only · Film 6 of 9

## Pause and think

Four questions, one at the end of each of four chapters, as the site shows them (`site/assets/for-this-purpose-only/think.en.js` and `think.es.js`):

1. *After chapter 3, A wish left behind.* Linh asked the alumni office not to ask her for donations, and the appeal still reached her. Why? (Her wish was written on her alumni record, and the appeal found her through the student system, which never heard it.)
2. *After chapter 5, Wishes on the person.* Why does Linh's no to fundraising go on the person, and not on her alumni record? (It's her wish, not a role's: whichever role a list finds her through, the no comes too.) It ends by asking viewers where a "don't contact me" they once gave an organisation might live.
3. *After chapter 6, Written into the platform.* The appeals team asks for the top students' grades. What does the platform do? (It hides the grades, which are tagged for teaching, and leaves out anyone whose wishes say no.)
4. *After chapter 8, What do you hold about me?* Linh asks to be forgotten. Why can't the university delete everything? (Each role keeps only what it must, such as her degree, and to keep honouring a no, a small record that she said it.)

## Labs (candidates)

- **May this team use it?** Eight requests (an appeal, a timetable, a payroll run, a research study), each with a purpose; open the doors each may open, and say why the others stay shut.
- **Where does the wish go?** Four things people tell a university (a no to fundraising, a new email, a yes to news, a research consent): put each on the person, on a role, or on a contact point.
- **Answer the request.** From Linh's person record, find every role and every value, with its source and purpose; then decide what each role keeps if she asks to be forgotten.

## Where it comes from in the project

| On screen | In the example project |
|---|---|
| Linh, `S-20436`, in the Faculty of Health | `data/student_system/learners.csv`, `data/student_system/awards.csv` (`GCHI`, `HLT`) |
| Her results, which the top students' list is made from | `data/student_system/results.csv` |
| "a column with personal data" | `meta.personal_data` on columns (`direct` or `pseudonymous`), `docs/conventions.md` |
| The test `personal_data_has_a_purpose` | New: a governance test that reads the project's graph, not the data, as `tests/governance/models_do_not_read_expected_seeds.sql` does |
| Purposes as tags on columns | New: `databricks_tags: {purpose: ...}` on the columns of the student, staff, research and Advancement models (dbt-databricks 1.10.4 or later) |
| The list of purposes, with an owner and a date | New: a reference table of consent purposes (*Lists everyone uses*) |
| Linh's wish, on the person | New: a table of wishes on the person, with purpose, date, where it was given and how to change it |
| Her alumni record, S-17142, and Advancement | New: the Advancement source the series adds to the project (*One person, many roles*) |
| The links from the person to every record | The person and its links (*Who is it?*) |
| Each value with its source | Survivorship labels (*Which value wins*) |

## Rigour to check before recording

- **The oath.** Checked 17 October 2026. The Charaka Samhita, believed to have been composed between about 100 BC and 200 AD, gives the teacher's instructions to a new medical student in chapter 8 of its Vimanasthana (paragraphs 13 and 14), given "in the presence of the sacred fire, brahmanas and physicians"; agreeing to them is the condition for being taught. The line the film quotes, "The peculiar customs of the patient's household shall not be made public", is the English of the Jamnagar edition (Shree Gulabkunverba Ayurvedic Society, 1949), as given in [Charaka shapath](https://en.wikipedia.org/wiki/Charaka_shapath); the oath is translated and discussed in I. A. Menon and H. F. Haberman, "The medical students' oath of ancient India", *Medical History* 14 (1970), 295–299. The film says "a teacher gave it", not that every teacher did, and doesn't claim when or where the oath was first given.
- **The picture of the past.** Dress after Indian sculpture of the period (an unstitched lower garment, an upper cloth, bare feet, hair tied up), drawn simply, with no jewellery or marks that would claim a particular community, place or caste. The palm-leaf book is the form Indian manuscripts took, not a known copy of the text: the oldest surviving manuscripts are much later. Its writing is drawn as lines, so the film invents no script. No sound from Indian music: the score is the series' own instruments.
- **Purpose, kept general.** Using data only for the purposes it was collected for is a principle in most privacy frameworks (the OECD's privacy guidelines call it purpose specification and use limitation; ISO/IEC 29100 has it too), and many laws make it a duty. The film names no law and no country: "a team may use a role's data only for a purpose written on it" is the university's own rule, and how a purpose is decided (consent, contract, a legal duty) is out of its scope.
- **Opt-in or opt-out.** Some places require a yes before anyone is asked for donations, others honour a no. The film shows a no, honoured wherever she appears, and the same table holds a yes; the mechanism doesn't change.
- **Alumni offices do this.** UWE Bristol's alumni privacy notice (read 17 October 2026, [uwe.ac.uk](https://www.uwe.ac.uk/alumni/stay-connected/alumni-privacy-notice)) says its alumni data is "initially transferred to us from our student record database", that "with your explicit consent we may also contact you to ask for philanthropic support", that "you can withdraw your consent at any time", and that it will "retain a minimal amount of personal information so that we can keep a record that you have asked us not to contact you" (the fourth Pause and think).
- **It goes wrong.** In 2016 the UK regulator fined two large charities £25,000 and £18,000 over wealth screening, sharing supporters' data with other organisations and telling supporters too little about how their data would be used; both disputed the findings ([Civil Society, 6 December 2016](https://www.civilsociety.co.uk/news/ico-fines-rspca-and-british-heart-foundation-after-daily-mail-expose.html), read 17 October 2026). The film names no organisation; its university and its appeal are invented, and Owen means well.
- **A suppression that misses a second record** is a common way a "don't contact me" fails: the wish is checked against one system's list, and the person arrives through another. Said here without numbers.
- **Unity Catalog.** Checked 17 October 2026 in Databricks' documentation. Governed tags are generally available since 2 April 2026 and attribute-based access control (ABAC) since 28 April 2026 ([release notes](https://docs.databricks.com/aws/en/release-notes/product/2026/april)). Row filter and column mask policies are written with `CREATE POLICY ... ON CATALOG | SCHEMA | TABLE`, `ROW FILTER` or `COLUMN MASK` a function, `TO` principals, `FOR TABLES`, `MATCH COLUMNS has_tag_value(...) AS alias`, and `ON COLUMN` or `USING COLUMNS` ([CREATE POLICY](https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-ddl-create-policy)); they need Databricks Runtime 16.4 or above. ABAC grant policies, deny policies and metastore-level policies are in beta: the film uses none of them. The "purpose" is represented by who asks (the `appeals` group), as the platform does; it doesn't read a reason from each query.
- **dbt.** dbt-databricks writes Unity Catalog tags on models and, since 1.10.4, on columns, with `databricks_tags` ([dbt's Databricks configurations](https://docs.getdbt.com/reference/resource-configs/databricks-configs), read 17 October 2026). The test that every personal column has a purpose reads the project's graph, as the example project's governance tests do.
- **The appeal's numbers.** 2,140 alumni, 37 who said no (under 2%): invented, kept plausible. "Ready in days, not weeks" is the university's own target, not a legal deadline.
- **Keeping what it must.** Registrars keep the record of an award permanently (for example, the University of Pittsburgh's [retention schedule](https://www.registrar.pitt.edu/sites/default/files/assets/PDF/Detailed_Retention_Schedule-2026-Final.pdf), found 17 October 2026, lists transcripts as permanent). Research data has its own minimums: under the Australian Code for the Responsible Conduct of Research, "five years from the date of any published or reportable outcome", longer for health research and clinical trials ([Swinburne](https://swinburne.edu.au/research/ethics-integrity/data-management), read 17 October 2026). The film says "for as long as its rules require".
- **Elsewhere.** A loyalty scheme's data used to decide credit, and a research consent that covers one study, are general, well-known cases of a second use; no real organisation.
- **Roles and colours.** Donor magenta is the series' colour for the donor role (film 1, *Decided*, 17 October 2026); the appeal wears it because it asks Linh to be a donor.

## Built

Built on 17 October 2026, from this script, in watercolour.

## Next

1. The author watches the film, and approves it or asks for corrections.
2. The project's additions it needs: purposes as tags on the columns, the list of purposes, a table of wishes on the person, the governance test, and an example access request answered from the person.
3. Labs, with the series' interactive learning: the candidates above.
