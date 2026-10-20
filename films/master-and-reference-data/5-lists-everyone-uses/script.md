# Master and reference data · Lists everyone uses: script

*The script of the fifth of nine films in the series on master and reference data, The same one, everywhere: about 4½ minutes, in eleven chapters, in English. Written from the approved plan for the series' films and built on 17 October 2026; the times below are the built film's, and [Built](#built) lists what changed on the way. The title card ends chapter 1; the end card follows chapter 11. Made to read on a phone, like the other films: on-screen text at least 28 px in the frame, and the camera moves in on whatever the narration is about.*

## The promise

Every line passes two tests: anyone who has picked an answer from a drop-down list can follow it, and an experienced reference data manager finds nothing wrong in it. Reference data are the short lists that sort and describe everything else: role types, statuses, countries, titles. Most organisations keep them in many places, each system with its own codes, typed again wherever they're needed, and owned by nobody. Give each list one home, with an owner for its values and the date each value applies from; map each system's own codes to it; let tests and reports read it instead of repeating it; copy the lists that belong to someone else from their owner; and keep the lists about people short, asked for only with a purpose. **A list has an owner, a date and one home.**

## The story in one paragraph

Airlines know each airport by three letters. Toronto's main airport is YYZ, after the old station code of Malton, where it stands; Ho Chi Minh City's is SGN, which still says Saigon, the name the city had until 1976. A code outlives its reason, because changing it costs everyone who uses it. At the university, Linh studies health informatics and tutors a first-year unit. HR calls her a Casual Academic, payroll CAS and the learning platform a tutor, and nothing written down says the three names match. HR's own list of roles is a spreadsheet attached to an email, and nobody has written down which kinds of identifier the university issues. Her status, ENR in the student system and active on the learning platform, is mapped to studying in one file, then typed again, by hand, in two tests. Her country of birth is Vietnam in HR, Viet Nam in the student system and VN at the research office, so a count of people by country lists her country three times. These are reference data: some the university's own, some from outside, each value a code that systems store and a label that people read. Jun, the analytics engineer, gives each list one home: a table with each value's code and label, its owner and the date it applies from, and beside it each system's own names, mapped. The tests read their allowed values from the list, and the platform's lineage shows what reads it. When HR renames the role Sessional Academic, the change is a pull request that HR, who owns tutor, approves; the new name applies from the first of January, and the old one is ended, not deleted, because Linh's past contracts still use it. Countries come from ISO 3166, copied on a schedule as the project's glossary is copied, so Viet Nam appears once and the count lists her country once. Lists about people, like titles and gender, stay short and inclusive, and are asked for only with a purpose. A bank's customer types and a hospital's relationship types show what a wrong list does to a real person. It ends where it began: a value can outlive its reason, but now everyone knows who keeps it, and from when it applies.

## What each object stands for

| Object | Stands for |
|---|---|
| A luggage tag with three letters, YYZ or SGN, and its old reason fading beside it | A code that outlives its reason |
| Airlines, timetables, bookings, boarding passes and baggage systems, each joined to both tags | Everyone who uses a code, and what changing it would cost them |
| Five small lists across the sky: role types, statuses, countries, grades, fee types | The lists a university runs on |
| Linh, in pencil, with a Student and a Tutor chip | One person, sorted by lists |
| Three system cards, each with its own name for her role | Each system's own codes for one value |
| An email from HR with `roles_FINAL_v3.xlsx` attached | A list with no home |
| Her identifiers, each marked "kind: ?" | A list nobody has written down |
| `status_map.csv`, and two test files typing the same values | A mapping in one place, and the list typed again |
| A count with three bars for one country, gathered by a bracket | What three spellings do to a report |
| A paper card with a yellow tab, its codes in type and its labels in words | A reference list |
| A drum under "code", a reader under "label" | A code that systems store, a label that people read |
| Jun, edged in cyan, giving each list a home | The analytics engineer who keeps the lists as tables |
| The role types table: code, label, owner, from | Each value with its owner and the date it applies from |
| "role names, by system": system, their name, means | Each system's own codes, mapped to the one value they mean |
| A test's typed values struck through, and a line pinned to the list | A test that reads the list instead of repeating it |
| A new status, deferred, added once, and a tick on each test | Change the list once, and everything that reads it follows |
| The platform's lineage: learner_status, core_learner, a census report, a fees dashboard | Who reads a list |
| A violet band across the years: Casual Academic until 2026, Sessional Academic from 2027 | A value's dates |
| A pull request, with its owner's review, approved | A change its owner approves |
| Four past contracts, joined to the old name | Why an old value is ended, not deleted |
| The standard's countries beside the university's copy, "every month" | A list that belongs to someone else, copied from its owner |
| The glossary's Award, copied into the project's model with its source | The same rule for definitions |
| Vietnam, Viet Nam and VN sliding into one row, VN ringed | One value, one code |
| A form about Linh: a title with five choices, and a short gender question | A list about people |
| "why we ask" | A purpose for each question about a person |
| A bank's customer types and a hospital's relationship types, each with a wrong row | What a wrong list does to a real person |
| Linh's three values, each joined to its list, its owner and its date | Each value with a keeper and a date |

## The look

Watercolour, as for the whole series ([the look](../look/README.md)).

- **A list is a paper card with a yellow tab,** the colour of reference data: its codes in type, its labels in words. Reference data is drawn as bright tabs and chips, as the series' look says.
- **Role colours mean roles, and only roles:** student teal, tutor violet, researcher coral, alumna green. Linh's tutor role is violet wherever it appears: on the system cards, on the band across the years and on the pull request's lines.
- **Red means a mistake, and only a mistake:** the title field struck from the form, the wrong row in the bank and the hospital, and the ring round each person it happens to. A yes is the series' green tick, as in *One person, many roles*.
- **People.** Linh is drawn as in *One person, many roles*: in pencil, and as the person, a white figure wearing her role bands. Jun is edged in cyan, the technical side, as in *In the weeds of data crafting*.
- **Places:** an airport terminal with a runway behind the glass; the campus in daylight; plain paper for the chapters that explain; an office window for the change.
- **Tools show, they don't lead.** dbt's logo marks the test files and Databricks' the lineage, each unaltered and only to identify the tool ([NOTICE.md](../../../NOTICE.md)).

## Script

### 1 · A code outlives its reason · 0:00–0:33

**Narration.** Airlines know each airport by three letters. Toronto's main airport is YYZ, after the old station code of Malton, where it stands. Ho Chi Minh City's is SGN. The city took that name in 1976, and its code still says Saigon. A code outlives its reason, because changing it costs everyone who uses it.

**Picture.** An airport terminal in watercolour, "today · an airport" in the corner; a plane taxis behind the glass. Two suitcases, their luggage tags swinging in as the airports are named: YYZ, Toronto, and SGN, Ho Chi Minh City. The camera moves in on Toronto's tag: a card writes "Malton's old station code: YZ", and a pencil ring finds the YZ in YYZ. Across to Ho Chi Minh City's tag: "Saigon" is written beside it, renamed "Ho Chi Minh City" with "1976", SGN is ringed, and a pencil line joins it to the old name. The camera draws back as everyone who reads the codes arrives round the top, each joined to both tags: airlines, timetables, bookings, boarding passes, baggage systems. The reasons fade, and the codes stay. Then the title card.

**On screen.** today · an airport · YYZ · Toronto · SGN · Ho Chi Minh City · Malton's old station code: YZ · Saigon · 1976 · airlines · timetables · bookings · boarding passes · baggage systems · The same one, everywhere · Lists everyone uses · reference data with an owner, a date and one home · Film 5 of 9 · master and reference data

### 2 · One role, three names · 0:33–1:06

**Narration.** A university runs on lists like these. Linh studies here, and tutors a first-year unit. HR calls her a Casual Academic. Payroll calls her CAS. The learning platform calls her a tutor. Three names for one role, and nothing written down says they match. HR's own list of roles lives in a spreadsheet, attached to an email. And no one has written down which kinds of identifier the university issues.

**Picture.** The campus in daylight, "today · the university". Five small lists cross the sky (role types, statuses, countries, grades, fee types) and give way to Linh, in pencil, with her card: Linh Nguyen, health informatics, Student, and, as "tutors" is said, a violet Tutor chip. Three system cards arrive as each is named, each with its own name for her role: *HR system · E-4417 · position type · Casual Academic*; *Payroll · E-4417 · pay type · CAS*; *Learning platform · u-88236 · course role · tutor*. Dotted lines join her tutor chip to each, and each name is ringed as the three are counted. Her records step back for HR's email: from HR, subject "the role list", "The latest version is attached.", and the attachment, `roles_FINAL_v3.xlsx`, ringed. Then her identifiers arrive along the bottom, S-20436, E-4417 and R-3082, each marked "kind: ?".

**On screen.** today · the university · role types · statuses · countries · grades · fee types · Linh Nguyen · health informatics · Student · Tutor · HR system · E-4417 · position type · Casual Academic · Payroll · pay type · CAS · Learning platform · u-88236 · course role · tutor · From · HR · Subject · the role list · The latest version is attached. · roles_FINAL_v3.xlsx · S-20436 · R-3082 · kind: ?

### 3 · Typed again · 1:06–1:35

**Narration.** Her status is ENR in the student system, and active on the learning platform. One file maps both to studying. Then two tests type the list of statuses again, by hand. Her country of birth is Vietnam in HR, Viet Nam in the student system, and VN at the research office. So a count of people by country lists her country three times.

**Picture.** Her status in two systems: *Student system · status · ENR* and *Learning platform · active*. The file that maps them, `status_map.csv`, with its columns `key_set`, `source_code` and `canonical_status`: SIS's ENR, LOA, WD and CMP, and the platform's active and inactive, each mapped to studying, inactive, withdrawn or completed. The camera moves closer as two test files type the same four values again, letter by letter: `_student__seeds.yml` and `_core_student__models.yml`, each with `accepted_values: [studying, inactive, withdrawn, completed]`. They leave as her country is named: three system cards, *country of birth*: Vietnam (HR system, E-4417), Viet Nam (student system, S-20436) and VN (research office, R-3082). A report, "people by country of birth · all systems", grows three bars, 214, 61 and 18; a pencil bracket gathers them, tagged "one country".

**On screen.** Student system · status · ENR · Learning platform · active · status_map.csv · key_set · source_code · canonical_status · SIS · LOA · WD · CMP · LMS · studying · inactive · withdrawn · completed · _student__seeds.yml · _core_student__models.yml · accepted_values · values: [studying, inactive, withdrawn, completed] · HR system · country of birth · Vietnam · Viet Nam · Research office · VN · people by country of birth · all systems · 214 · 61 · 18 · one country

### 4 · The lists that sort · 1:35–1:55

**Narration.** These are reference data: short lists that sort and describe everything else. Some are the university's own, like role types. Others come from outside, like countries, or airport codes. Each value has a code that systems store, and a label that people read.

**Picture.** "reference data" heads three lists, each a paper card with a yellow tab: *learner statuses* (Studying, On leave, Withdrawn, Completed), *role types* (Student, Tutor, Researcher, Alumni) and *countries* (AU Australia, CA Canada, VN Viet Nam). Below them, Linh as the person: her white figure with the bands of her four roles, as in *One person, many roles*. A line runs from each list's value down to her: her status to the student band, her role to the tutor band, and her country to her, below the bands; the statuses come first, so no two lines cross. A pencil bracket gathers the first two lists, "the university's own", and another the countries and Toronto's YYZ tag, "from outside". The camera moves in on one value: VN is ringed, with a drum under it, "code", and Viet Nam, with a reader under it, "label".

**On screen.** reference data · learner statuses · Studying · On leave · Withdrawn · Completed · role types · Student · Tutor · Researcher · Alumni · countries · AU · Australia · CA · Canada · VN · Viet Nam · the university's own · from outside · YYZ · code · label

### 5 · A home for each list · 1:55–2:27

**Narration.** Jun, the analytics engineer, gives each list one home. Role types, identifier types, relationship types, consent purposes, and countries. Each is a table: every value with its code and label, who owns it, and the date it applies from. HR owns tutor, and the registrar's office owns student. Beside it, each system's own names are mapped: Casual Academic, CAS and tutor all mean tutor.

**Picture.** Jun Park, edged in cyan, with a name card, "analytics engineer". The statuses, which the tests typed, are given a home first; then the five lists, as they're named, each a card with a yellow tab, and Jun's hand goes out to each. The camera moves in on two tables, leaving Jun out of the frame. *Role types* becomes a table, a value a row: code (student, tutor, researcher, alumni), label, owner (registrar's office, HR, research office, alumni office) and from (2004-01-01, and 2020-01-01 for the researcher). The owners light as they're named: the registrar's office in student teal, HR in tutor violet. Beside it, *role names, by system*: system, their name, means: HR's Casual Academic, payroll's CAS and the learning platform's tutor each mean tutor, lit in violet together.

**On screen.** Jun Park · analytics engineer · learner statuses · role types · identifier types · relationship types · consent purposes · countries · code · label · owner · from · student · tutor · researcher · alumni · Student · Tutor · Researcher · Alumni · registrar's office · HR · research office · alumni office · 2004-01-01 · 2020-01-01 · role names, by system · system · their name · means · Casual Academic · payroll · CAS · learning platform

### 6 · Read, not typed · 2:27–2:48

**Narration.** Now the tests read their allowed values from the list, instead of typing them. Change the list once, and every test that reads it follows. On the platform, each list is one table, and its lineage shows the tables and reports that read it.

**Picture.** The learner statuses list, codes and labels (studying, Studying; inactive, On leave; withdrawn, Withdrawn; completed, Completed), "owner · registrar's office". The two test files stand either side of it, each with dbt's logo: what they typed is struck through, and a relationships test types in its place, `to: ref('learner_status')`, `field: code`; a line from each is pinned to the list. A new status, deferred, Deferred, is added to the list once, and a green tick lands on each test. Below, the platform, with Databricks' logo and "lineage": the list as one table, `learner_status`, then `core_learner`, then a census report and a fees dashboard.

**On screen.** learner statuses · studying · Studying · inactive · On leave · withdrawn · Withdrawn · completed · Completed · owner · registrar's office · _student__seeds.yml · _core_student__models.yml · relationships: · to: ref('learner_status') · field: code · deferred · Deferred · lineage · learner_status · core_learner · census report · fees dashboard

### 7 · A change, with a date · 2:48–3:10

**Narration.** Next year, HR will call the role Sessional Academic. The change is a pull request, and HR, who owns tutor, approves it. The new name applies from the first of January. The old one isn't deleted. It's ended, because Linh's past contracts still use it.

**Picture.** An office window, and her tutor role across the years, 2023 to 2028: a violet band under HR's name for it, Casual Academic, and the new name, Sessional Academic, dashed, from next year. The camera moves up to the pull request, *HR's new name for tutors*, on *role names, by system*, opened by Jun: it adds a line, "HR · Sessional Academic → tutor · from 2027-01-01", and ends one, "HR · Casual Academic → tutor · until 2026-12-31". Its review, "HR, who owns tutor", turns to "approved", with a green tick. Back down to the years: the day is marked, "1 Jan 2027", and the new name turns solid from it. On "ended", the old line's "until 2026-12-31" is ringed; then four past contracts, 2023 to 2026, arrive above the band, each joined to the old name.

**On screen.** 2023 · 2024 · 2025 · 2026 · 2027 · 2028 · Casual Academic · Sessional Academic · HR's new name for tutors · role names, by system · opened by Jun · + HR · Sessional Academic → tutor · from 2027-01-01 · ~ HR · Casual Academic → tutor · until 2026-12-31 · review · HR, who owns tutor · approved · 1 Jan 2027

### 8 · From outside · 3:10–3:34

**Narration.** Some lists belong to someone else. Countries come from the international standard, ISO 3166, loaded on a schedule. Like the project's glossary, the list is copied, never typed again. Viet Nam appears once, with one code: VN. And the count by country lists her country once.

**Picture.** A divider: on one side, "its owner", the standard's own list, *ISO 3166 · countries*, with alpha-2, alpha-3 and name (AU, AUS, Australia; CA, CAN, Canada; VN, VNM, Viet Nam); on the other, "the university's copy", *countries*, "copied from ISO 3166", "every month". The divider steps back once the copy is the point. Like the glossary: the business glossary's *Award*, "a qualification the university confers…", is copied into the project's model, `_course__conceptual.yml`, with its source, `term: Award`. Vietnam, Viet Nam and VN wait beside the list, then slide one by one into its one row, and VN is ringed as it's said. The count, "people by country of birth · all systems", now has one bar: 293.

**On screen.** its owner · the university's copy · ISO 3166 · countries · alpha-2 · alpha-3 · name · AU · AUS · Australia · CA · CAN · Canada · VN · VNM · Viet Nam · copied from ISO 3166 · every month · business glossary · Award · a qualification the university confers… · copied · _course__conceptual.yml · - name: award · definition: A qualification… · source: · term: Award · Vietnam · people by country of birth · all systems · 293

### 9 · Lists about people · 3:34–3:51

**Narration.** Some lists describe people, like titles or gender. Those stay short and inclusive, and are asked for only with a purpose. A title can tell whether someone is married. If it isn't needed, it isn't asked.

**Picture.** Plain paper. Linh, with her phone, fills in a form, "about you". Its title has five choices, Mr, Mrs, Miss, Ms and Mx; its gender question is short: woman, man, non-binary, another term with a line to write it on, and prefer not to say. On "inclusive", another term and prefer not to say are ringed. On "purpose", a dashed card: "why we ask · the government asks universities to report it". On "married", Mrs and Miss are ringed, with a note, "married?". On "If it isn't needed", the title is struck through in red; on "it isn't asked", it goes, and the gender question moves up into its place.

**On screen.** about you · title · Mr · Mrs · Miss · Ms · Mx · gender · woman · man · non-binary · another term · prefer not to say · why we ask · the government asks universities to report it · married?

### 10 · Elsewhere · 3:51–4:11

**Narration.** Every industry runs on lists like these. A bank's customer types decide which checks each customer goes through. A hospital's relationship types decide who may be told about a patient. Get a list wrong, and the wrong thing happens to a real person.

**Picture.** Two panels in their industry colours, "a bank" in banking blue and "a hospital" in health red, each with Linh's white figure. The industry being told stands out, and the other steps back. The bank's *customer types*: customer type and checks (personal, standard; business, standard; public figure, enhanced), with "enhanced" lit as "checks" is said. The hospital's *relationship to patient*: relationship and may be told (nominated contact, yes; partner, if patient agrees; former partner, no), with "if patient agrees" lit. On the last line both stand out: the lit row's type turns red, and a red ring pulses round each figure, in time with the score's pulse.

**On screen.** a bank · a hospital · customer types · customer type · checks · personal · standard · business · public figure · enhanced · relationship to patient · relationship · may be told · nominated contact · yes · partner · if patient agrees · former partner · no

### 11 · Who keeps it · 4:11–4:35

**Narration.** Now Linh's role, her status and her country each come from one list. Like an airport code, a value can outlive its reason. But now everyone knows who keeps it, and from when it applies. A list has an owner, a date and one home.

**Picture.** The campus again, "today · the university", and Linh as the person, her white figure with her role bands. Her three values arrive as they're named, each joined to its band: *Tutor · role* in violet, *Studying · status* in teal, *Viet Nam · country of birth* in yellow. On "one list", each joins its list: *learner statuses* (owner · registrar's office, from 2004-01-01), *role types* (owner of tutor · HR, from 2004-01-01) and *countries* (owner · ISO 3166, loaded every month). Toronto's YYZ tag hangs in the corner as the airport is named. On "who keeps it", each owner is underlined in pencil, and on "from when", each date. The cards step back for the last line, which settles onto the end card. End card.

**On screen.** today · the university · Studying · status · Tutor · role · Viet Nam · country of birth · learner statuses · owner · registrar's office · from 2004-01-01 · role types · owner of tutor · HR · countries · owner · ISO 3166 · loaded every month · YYZ · A list has an owner, a date and one home. · Lists everyone uses · The same one, everywhere · Film 5 of 9 · Learning Data

## Pause and think

Four questions, one at the end of each of four chapters, as the site shows them (`site/assets/lists-everyone-uses/think.en.js` and `think.es.js`):

1. *After chapter 3, Typed again.* A count of people by country lists Linh's country three times. Why? (Three systems spell it three ways, and no shared list says they're one value.) It ends by asking viewers where they've seen the same thing spelled two ways in one report.
2. *After chapter 5, A home for each list.* What does Jun's mapping do? (It writes down that each system's name means one value in the list, so each system can keep its own name.) It ends by asking who would own each role type in the viewer's organisation.
3. *After chapter 7, A change, with a date.* Why is the old name ended, not deleted? (Linh's past contracts still use it, so it stays valid for the dates it applied.) It ends by asking viewers for a list they know that has changed one of its names.
4. *After chapter 9, Lists about people.* Why does the form stop asking for a title? (A title can say whether someone is married, and the university doesn't need it.) It ends by asking viewers for a question on a form whose purpose they couldn't see.

## Labs (candidates)

- **Map the names.** Twelve codes from four systems (HR, payroll, the learning platform and the student system): map each to the role type or status it means, and find the codes no list holds yet.
- **Read, don't type.** A small dbt project with three tests that type a list: change each to read the list, then add a value and watch every test follow.
- **Date a change.** A value is renamed from a day: choose which records read the old name and which the new, and end the old value instead of deleting it.
- **Short, and with a purpose.** Four forms: strike the questions with no purpose, and fix the lists that aren't inclusive.

## Where it comes from in the project

The example project is *In the weeds of data crafting*'s dbt project, in `films/analytics-engineering/project/`.

| On screen | In the example project |
|---|---|
| Linh, `S-20436`, `u-88236` | `data/student_system/learners.csv` line 50, `data/learning_platform/users.csv` line 34 |
| `status_map.csv`: SIS's ENR, LOA, WD and CMP, and the platform's active and inactive, mapped to studying, inactive, withdrawn and completed | `seeds/reference/student/status_map.csv` lines 2–7. The film leaves out its `source_label` column and the short-course system's two codes (lines 8–9). |
| The two tests that type the statuses | `seeds/reference/student/_student__seeds.yml` lines 29–32 and `models/core/student/_core_student__models.yml` lines 80–86 |
| The statuses' owner, the registrar's office | `seeds/reference/student/_student__seeds.yml` line 10 (`owner: "Mei Tanaka, registrar's office"`) |
| The statuses as a table, `learner_status`, with labels, an owner and dates, and the relationships test that reads it | New: the series adds it to the project |
| The role types and their owners: student, the registrar's office; tutor, HR; researcher, the research office; alumni, the alumni office | `models/core/person/_person__conceptual.yml` lines 61–72, the person domain's kinds of role, a draft for their owners to approve. The film leaves out applicant (lines 58–60), and its labels and dates are its own. |
| The role types as a table, identifier types, relationship types and consent purposes, and each system's names mapped to them | New: lists the series adds to the project |
| Countries copied from ISO 3166 every month | New: a scheduled copy the series adds |
| The award's definition, copied from the glossary with its source | `models/core/course/_course__conceptual.yml` lines 18–30, under decision DEC-PRJ-11 (`models/_shared/_shared__decisions.yml` line 125, `docs/decisions.md` line 77). The film shortens it: it cuts the definition short and leaves out the owner, the business key, the history, and the source's `glossary` and `named_by` lines. |
| Her role's three names: HR's Casual Academic, payroll's CAS and the learning platform's tutor | `data/hr_system/contracts.csv` lines 3–7, 9, 11 and 13, Linh's eight contracts: `position_type` Casual Academic, `position_title` Tutor and `pay_type` CAS. The project has no payroll system of its own: payroll reads the contracts' `pay_type`. Its learning platform holds no tutor role, so the platform's tutor is the film's own. |
| `E-4417` with Vietnam at HR, `R-3082` with VN at the research office, and Viet Nam in the student system | `data/hr_system/staff.csv` line 3 and `data/research_system/researchers.csv` line 4, each in `country_of_birth`. The project's student system holds no country of birth, so its Viet Nam is the film's own. |
| The census report and the fees dashboard; the counts 214, 61, 18 and 293 | Invented for the film |

## Rigour to check before recording

- **YYZ:** "YZ was the code for the station in Malton, Ontario, where Pearson Airport is located" (Wikipedia, *Toronto Pearson International Airport*, read 17 October 2026). The film says "the old station code of Malton, where it stands", and doesn't explain the Y.
- **SGN:** Saigon was renamed Ho Chi Minh City after reunification, in July 1976 (Wikipedia, *Ho Chi Minh City*, read 17 October 2026); SGN is still the code of its airport, Tan Son Nhat.
- **ISO 3166:** the standard's short name is Viet Nam, with the codes VN, VNM and 704 (ISO 3166-1, as listed by the ISO Online Browsing Platform and the UN Group of Experts on Geographical Names, read 17 October 2026). The film shows the alpha-2 and alpha-3 codes, and doesn't say how the copy is obtained.
- **Reference data practice:** the ideas [the series' proposal](../proposal.md) lists for this film, with DAMA-DMBOK as its reference body: internal and external lists, codes and labels, each system's codes mapped to the canonical ones, owner and publisher, effective dates and versions, and outside lists adopted, not retyped, and refreshed on a schedule. Where a list's values belong to different offices, as role types do, each value names its owner (the approved plan's example: "HR for tutors, the registrar for students").
- **Titles:** the GOV.UK Design System's names pattern advises against asking for a title, since it makes people reveal their gender and marital status (design-system.service.gov.uk/patterns/names, read 17 October 2026).
- **Gender:** the form follows the Australian Bureau of Statistics' *Standard for Sex, Gender, Variations of Sex Characteristics and Sexual Orientation Variables* (2020): man, woman, non-binary, a different term (with a write-in) and prefer not to answer, in shorter words. Australian universities report gender to the government through TCSI, element E315, *Gender code* (tcsisupport.gov.au/element/315, read 17 October 2026: F, M or X, and from 2026 aligned with the ABS standard). The film's university is invented and names no country.
- **The bank:** "public figure, enhanced" simplifies politically exposed persons, for whom FATF Recommendation 12 asks for enhanced due diligence (FATF Recommendations, read 17 October 2026).
- **The hospital:** "may be told" simplifies the rules on telling a patient's "responsible person", such as a partner, and their exceptions (OAIC, *Guide to health privacy*, chapters 3 and 7, read 17 October 2026). "Former partner: no" is a plausible local rule, not a law.
- **HR's names:** Casual Academic and Sessional Academic are both common terms at Australian universities; the rename is invented.
- **dbt:** a test's arguments under `arguments:`, as the project's own files write them, and a `relationships` test that reads a list by `to: ref(...)` and `field:`.
- **Databricks:** the platform's lineage shows the tables, notebooks and dashboards that read a table; the film draws only the word "lineage" and Databricks' logo, so no product name needs a maturity check.
- **Colour:** red only for mistakes, role colours only for roles, and every colour paired with a label.

## Built

Built on 17 October 2026, from this script, in watercolour. What changed on the way:

- **Chapter 4.** The lines from the lists to Linh meet her bands from the top down (status, role, then country, below the bands), so no two cross.
- **Chapter 5.** The camera moves in on the two tables and leaves Jun out of the frame, never half in it.
- **Chapter 7.** HR approves the change as the owner of tutor, matching chapter 5, where each role type has its own owner, not as "the list's owner". One line was voiced again.
- **Chapter 8.** Vietnam, Viet Nam and VN wait in a stack beside the list and slide into its row one by one, each fading only as it arrives, so none covers another; VN arrives as it's said.
- **Chapter 9.** Non-binary is one of the gender choices, after the ABS standard, beside another term and prefer not to say; the write-in line is short enough that the two rings don't touch.
- **Chapter 11.** Who keeps each value and from when are underlined, one after the other, since rings round two lines this close crossed. The role types card names the owner of Linh's value: owner of tutor · HR.
- **Small tags.** Under an airport code drawn small, the city is marked as decoration: the code is what's read.
- **Captions.** Spanish captions in Latin American Spanish, about as long as each English line; a value shown on screen keeps its English spelling, in «».
- **Sound.** A new palette (in `source/tools/score.py`): a bed of strings that follows the chapters from B minor to D major; a plucked guitar note for each role and a B for a list's value; a bowed cello for the person; and the series' clarinet mark. For the lists, paper, a felt-tip pen, a pin and a few muffled keys; at the airport, a plane's engines far off behind the glass. The music sits about 21 dB under the voice while it speaks, the effects about 12 dB under the music and below 2.4 kHz, and the only pulse, at 92 a minute under the wrong lists in chapter 10, about 8 dB under the music. Mixed to -16 LUFS.
- **Poster.** The end, at 4:25: Linh, her three values, and their lists with owners and dates.

## Next

1. The author watches the film, and approves it or asks for corrections.
2. The project's additions it needs: the lists as tables, with labels, owners and dates (learner statuses, role types, identifier types, relationship types, consent purposes); each system's codes mapped to them; the tests that read them; and countries copied from ISO 3166 on a schedule.
3. Labs, once the series has more films: the candidates above.
