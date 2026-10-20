# Master and reference data · Roles come and go: script

*The script of the fourth film of the series on master and reference data, working title The same one, everywhere: about 5½ minutes, in ten chapters, in English. Written on 17 October 2026 from the approved plan for films 2 to 9 ([proposal](../proposal.md#4-roles-come-and-go)). The narration lives in [`source/src/narration.js`](source/src/narration.js) and the pauses in [`source/src/breath.js`](source/src/breath.js); this page and those files say the same thing, and where they differ, the source wins. The title card follows chapter 1; the end card follows chapter 10. Made to read on a phone, like the other films: on-screen text at least 28 px in the frame, and the camera moves in on whatever the narration is about.*

## The promise

Every line passes two tests: anyone who has ever been a student and an employee of the same place, or left a job and come back, can follow it, and an experienced master data manager finds nothing wrong in it. A role is how a person relates to the organisation for a time, so it has a start, an end and an owner, and the person outlives all of them. A status that each system overwrites every night is true for one day only: ask it about another day and it still answers for today. Give every role the same shape (the person, the role type, its owner, what it relates to, when it's valid from and to), and any question can be asked as at any date: census date, last year, today. Counted that way, someone with three roles open is one person, not three. **A role has a start and an end; the person stays.**

## The story in one paragraph

In the Roman Republic, an ambitious citizen climbed a ladder of public offices, each held for one year: Marcus Porcius Cato was quaestor in 204 BC, aedile, praetor, consul in 195 and censor in 184, and the censors wrote down every citizen: the census. Today, at the university, census date is 31 March 2026, the day it counts who's enrolled. Planning asks how many of its students also work there; the alumni office, which invited Linh back for the master's she was already doing (*One person, many roles*), asks which of its alumni are studying again. Each night, every system tells the platform how it sees Linh that day, as a status written over the next night, so when Planning asks about last year's census date, every answer still says today, and Linh counts as a student four months before she came back. Each office knows when its role starts and ends, so Noor and Mei give every role the same shape, and Linh's roles become dated bands under her white figure: applicant, student from 2019 to 2022, alumna, casual tutor from 2023, applicant and student again from July 2025, researcher from March to December 2026. So far her tutoring is one band, as *One person, many roles* drew it; HR offers her work one semester at a time, so the tutor role starts and ends every term, and in January she isn't staff. Planning draws one line at census date: student, tutor, researcher and alumna are open, so she counts once, as a student who works here; moved back a year, the line finds a tutor and an alumna, and last year's number stays as it was. The alumni office's question becomes a filter: alumni with an open student role. Each role says what it relates to (a course, a contract, a project), and people relate to each other: Ana Ruiz supervises Linh on the project, a relationship with dates of its own. In an energy company, the account holder moves out and his role ends, but the person who stays depends on life support, and her need goes on. On the platform it's one table, a row for each role, tested, asked as at any date, with the day each row was recorded kept beside the day it began. Today Linh is a student, a tutor, a researcher and an alumna; in December the project ends. Roles come and go; the person stays.

## What each object stands for

| Object | Stands for |
|---|---|
| A stone tablet, one name and five offices, each with its year | A person and a sequence of roles, each with a start and an end |
| The tablet's lines copied onto a sheet as rungs on a line of years, 205 to 185 BC | The same record, drawn as a timeline: who held what, when |
| A census list, name by name, with age and property | The first count of everyone, as at one time |
| A calendar page, "31 March · census date" | The day the university counts |
| Planning's card and the alumni office's card, each with its question | Two questions about who someone is on a date |
| Four system cards, each with a status that a pencil rubs out and writes again every night | A status, true for a day and written over the next |
| A small moon, "each night" | Each system's nightly copy to the platform |
| Planning's card asking about 31 March 2025, and a red ring on "student" | Asked about another day, a status still answers for today |
| A blank form, "person · role type · owner · starts · ends" | One shape for every role |
| Linh's white figure, and bands that run from her into rows of a timeline | Her roles, dated, each in its colour, owned by one office |
| An owner's tag at each row: admissions, registrar's office, alumni office, HR, research office | Who owns each role |
| The tutor band breaking into seven pieces, one per semester | A role that starts and ends with each contract |
| A pencil line drawn top to bottom at 31 March 2026, and her bands lit where it crosses an open role | As at one date: which roles are open |
| Three rows from three lists folding into one figure | One person with three roles, counted once |
| The line sliding back to 31 March 2025 | As it was: last year's question, answered as it was |
| A filter card, "alumni with an open student role" | A question about people, asked of their roles |
| "relates to" tags: a master's, a unit and a semester, a project | What each role is for |
| Ana's white figure, and a dated line between her and Linh, "supervises" | A relationship between two people, with its own dates |
| A house, a meter, an account holder walking away, the person who stays, and a heart | Elsewhere: a role ends, the person and the need don't |
| A table with a row for each role, two pencil ticks beside its tests | The enabler: one dated role table, tested on the platform |
| Three date pins: 31 Mar 2026, 31 Mar 2025, today | Any question, as at any date |
| `recorded_at` 2026-04-06 on the row whose `valid_from` is 2026-02-23 | When a row was known, kept apart from when it was true |
| The line at today, bands ending to the right, the white figure unchanged | Roles come and go; the person stays |

## The look

The series' watercolour, as in *One person, many roles* ([look](../look/)): daylight landscapes in soft washes on warm paper, pencil lines, and the role colours as the strongest washes on screen: student teal, applicant amber, researcher coral, tutor violet, alumna green. Linh, as the person, is the white of the paper in a pencil line, banded in the colours of the roles she holds; in this film her bands answer the date the census line stands on, so she wears only the roles that are open on that day.

- **The timeline is the film's own component.** Linh's white figure stands at the left; each band on her body runs out to the right as a row of the timeline, at the same height, so a band on her and a period on the line read as one thing. The rows keep *One person, many roles*' order (student, tutor, researcher, alumna), with applicant last. Each period is a wash in its role's colour with a pencil edge; whatever lies ahead of today is paler, with a dashed edge, and a period still open fades out at the right. The camera stays still in these chapters: the line of years itself widens or narrows to the dates the narration is about, and a line at *today* shows where the story stands. Labels are dark ink, 28 px or more.
- **Rome** is the same watercolour, with the year in the corner: the Forum in daylight, temples of stucco and terracotta (not the white marble of later centuries), the Capitoline's two summits on dry olive slopes, cypresses and stone pines, and Cato in a toga: off-white wool over a tunic, his left arm wrapped in it and the hand at his waist, dark leather shoes, and red hair (Plutarch). The offices are one colour, a terracotta wash, because they're one kind of thing and wear no role's colour.
- **People.** Noor (cyan) and Mei (gold) as in *One person, many roles*; Jun (cyan), from *In the weeds of data crafting*, builds the table; Ana Ruiz, the Head of School from *When things go wrong*, is drawn as the person too, white, when the film shows the relationship between her and Linh. The energy company's two people are white figures, as in the *Elsewhere* of *One person, many roles*, standing on paper so the street doesn't show through them; the company's sheet is in its yellow.
- **The error** is drawn in red ink, as in *One person, many roles*: a ring and a note on the one wrong answer.

## Script

### 1 · A ladder of offices · 0:00–0:38

**Narration.** In the Roman Republic, an ambitious citizen climbed a ladder of public offices, each held for one year. Marcus Porcius Cato was quaestor, then aedile, then praetor, and in 195 BC, consul. Each office had its year, and his name: one man, a sequence of roles, each with a start and an end. His last office was censor. Censors wrote down every citizen, their age and what they owned: the census.

**Picture.** The Forum in watercolour daylight, "204 BC · Rome" in the corner: the Capitoline's two summits, Jupiter's temple on the higher and Juno's on the Arx, the Palatine's houses under stone pines, a portico, the senate house, the temple of Castor, cypresses. Cato in his toga at the left of the paving. As the camera moves in, a stone tablet on a pedestal fills the middle, carved with his name; as each office is named, its line is cut: *204 BC · quaestor*, *199 BC · aedile*, *198 BC · praetor*, *195 BC · consul*. On "a sequence of roles", a sheet arrives at the right, *one man, a sequence of roles*, and the four offices step up it as terracotta rungs on a line of years, 205 to 185 BC, each a year long, with gaps between: a ladder. On "censor", "184 BC" in the corner, and a fifth rung, *censor*, eighteen months long. A census list unrolls over the tablet, name by name, with an age and a holding on each line, and "census" is written large under it in pencil. Wordless breather, then the title card, *Roles come and go*.

**On screen.** 204 BC · Rome · Marcus Porcius Cato · 204 BC · quaestor · 199 BC · aedile · 198 BC · praetor · 195 BC · consul · one man, a sequence of roles · 205 BC · 200 BC · 195 BC · 190 BC · 185 BC · censor · 184 BC · citizen · age · property · census · Roles come and go · Film 4 of 9

### 2 · Census date · 0:38–1:05

**Narration.** At the university, census date is the 31st of March: the day it counts who's enrolled, for its official numbers. Planning has a question for that day. How many of our students also work here? And the alumni office, which invited Linh back for a master's she was already doing, asks: which of our alumni are studying again?

**Picture.** The campus of *One person, many roles*. The word "census" carries over from Rome onto a calendar page, *31 March · census date*, pinned up at the left; "31 March 2026 · the university" in the corner. Linh crosses the lawn. Planning's card arrives at the right with its question; then the alumni office's card, with the ghost of the email from *One person, many roles* under it (*Come back for a master's*), and its question.

**On screen.** 31 March 2026 · the university · census date · 31 March · Planning · How many of our students also work here? · Alumni office · Come back for a master's · Which of our alumni are studying again?

### 3 · True for a day · 1:05–1:40

**Narration.** Each night, every system tells the platform how it sees Linh that day. The student system says enrolled. HR says casual staff. The research office, project member. The alumni office, graduate. Each answer is true for a day, and written over the next. So when Planning asks again about last year's census date, to compare, every answer still says today. Linh counts as a student in March 2025, four months before she came back.

**Picture.** Plain paper. Four system cards in a row, each with its role's brushstroke and Linh's name: *student system*, *HR*, *research office*, *alumni office*. A small moon, "each night", and a dotted line from each card down to one box, *the platform's copy*. Each card's status writes in as it's named: *enrolled*, *casual staff*, *project member*, *graduate*. A pencil rubs each one out and writes it again, under a date that turns over: *30 Mar*, *31 Mar*, *1 Apr*. Planning's card arrives: *students who also work here · as at 31 Mar 2025*. It reads the four statuses, and ticks Linh as a student; a red ring closes on "student", and a red note: *she came back in Jul 2025*. Nothing pulses under it: after the last words, the choir holds one chord open, a question, and lets it go before the film stops for Pause and think.

**On screen.** each night · student system · HR · research office · alumni office · Linh Nguyen · enrolled · casual staff · project member · graduate · the platform's copy · Planning · students who also work here · as at 31 Mar 2025 · student · she came back in Jul 2025

### 4 · A start and an end · 1:40–2:23

**Narration.** Yet each office knows when its role starts and ends. So Noor and Mei give every role the same shape: the person, the kind of role, the office that owns it, when it starts, and when it ends. Linh's roles become bands, under her. Applicant, then student, from 2019 to 2022. Then alumna. Casual tutor, from 2023. Applicant again in 2025, and student again, from July. And researcher, from March to December this year. Some follow each other, and some run at once. The person under them stays the same.

**Picture.** The four system cards stay a moment, and each writes in its own dates: *from 21 Jul 2025*, *23 Feb – 27 Jun 2026*, *2 Mar – 19 Dec 2026*, *since 15 Dec 2022*. Then Noor and Mei, holding a blank form between them, *every role*, that fills in as it's said: *person · role type · owner · starts · ends*. The form shrinks to a strip at the top of the frame, and Linh's white figure stands at the left of a line of years, 2019 to 2026. As each role is named, its band paints onto her and runs out to the right as a dated period on its row, with its owner at the start of the row: *applicant · admissions* (Aug 2018 to Feb 2019), *student · registrar's office* (Feb 2019 to Dec 2022), *alumna · alumni office* (from Dec 2022, open), *tutor · HR* (from Feb 2023, one band for now), *applicant* again (Jun to Jul 2025), *student* again (from Jul 2025, open), *researcher · research office* (Mar to Dec 2026, paler and dashed where it's still ahead). On "this year", a line at *today* (20 April 2026) rises with its tag; the tag lifts away again before the next line. On "some follow each other", pencil arrows join applicant to student to alumna; on "some run at once", a pencil ring holds the four bands of 2026.

**On screen.** from 21 Jul 2025 · 23 Feb – 27 Jun 2026 · 2 Mar – 19 Dec 2026 · since 15 Dec 2022 · every role · person · role type · owner · starts · ends · applicant · admissions · student · registrar's office · alumna · alumni office · tutor · HR · researcher · research office · 2019 · 2020 · 2021 · 2022 · 2023 · 2024 · 2025 · 2026 · today

### 5 · A contract each term · 2:23–2:49

**Narration.** So far, her tutoring is one band, since 2023. HR sees it differently: it offers her work one teaching period at a time, a new contract each semester, for one unit. So the tutor role starts and ends every semester. In January, between contracts, she isn't staff. On census date, she is.

**Picture.** In on the tutor row. A small pencil note, *so far: one band*, and the band breaks into seven pieces, one per semester since February 2023, the gaps opening between them, each piece tagged *S1* or *S2*. HR's card: *an offer of work · each teaching period · one unit*. A pin at *15 Jan 2026* finds a gap: *not staff*. A pin at *31 Mar 2026* finds Semester 1's contract: *staff*.

**On screen.** so far: one band · S1 · S2 · HR · an offer of work · each teaching period · one unit · 15 Jan 2026 · not staff · 31 Mar 2026 · staff

### 6 · One line, one date · 2:49–3:27

**Narration.** Now Planning draws one line across her bands, at census date. Student, tutor and researcher are open, and so is alumna. So Linh counts once, as a student who works here: one person with three roles, not three people. Move the line back a year, and she's a tutor and an alumna, not a student. Last year's number stays as it was. And the alumni office's question becomes a filter: alumni with an open student role. Linh is back, since July 2025.

**Picture.** A pencil line is drawn top to bottom at 31 March 2026, with its tag, *census date · 31 Mar 2026*. Where it crosses an open period, a dot lands, and on her figure only those bands stay lit: student, tutor, researcher, alumna. Planning's card: three rows, *student · Linh*, *tutor · Linh*, *researcher · Linh*, fold into one, *1 person · a student who works here*. The line slides back to *31 Mar 2025*: her student and researcher bands fade from her figure; tutor and alumna stay. The card reads *as at 31 Mar 2025 · Linh: a tutor and an alumna · not a student*, and a badge, *as it was*. The line returns. The alumni office's card: *alumni with an open student role*, and a tick beside *Linh · back since Jul 2025*, while a pencil ring closes on the start of her student period, July 2025.

**On screen.** census date · 31 Mar 2026 · Planning · students who also work here · student · tutor · researcher · Linh · 1 person · a student who works here · as at 31 Mar 2025 · Linh: a tutor and an alumna · not a student · as it was · Alumni office · alumni with an open student role · Linh · back since Jul 2025

*Planning's question is about people, so it counts persons; the roles open at one date are the filter. That's the difference between "three rows" and "one person".*

### 7 · What a role is for · 3:27–3:55

**Narration.** Each role also says what it relates to. Her student role, a master's in health informatics. Each tutor contract, one unit in one semester. Her researcher role, one project. People relate to each other, too. On the project, Ana Ruiz supervises Linh. That relationship has its own dates, and ends with the project. Both people stay.

**Picture.** The 2026 end of the timeline. Under the words *relates to*, a tag for each open role writes in above the timeline as it's named, hung from its period by a dashed pencil line, so the periods stay in sight: *master's · health informatics*; *a first-year unit · S1 2026*; *project · wait times in emergency care*. Then the line of years draws in from the right to make room, and Ana's white figure joins at the right, with her name card, *Ana Ruiz · Head of School · leads the project*, and a coral band of her own. A dotted line runs from her to Linh, and its tag writes in: *supervises · Mar–Dec 2026*. At "ends with the project", a pencil ring closes on December, the project's end; both figures stay.

**On screen.** relates to · master's · health informatics · a first-year unit · S1 2026 · project · wait times in emergency care · Ana Ruiz · Head of School · leads the project · supervises · Mar–Dec 2026

### 8 · Elsewhere · 3:55–4:20

**Narration.** An energy company has the same problem. The account holder moves out in June, and his role ends that day. The person who stays depends on life support at home. Her need goes on, and so does the risk. Kept on his account, the need would close with it. Kept on her, it stays.

**Picture.** A terraced house up close, in watercolour: a brick front, a window, a blue door, a meter on the wall, the neighbours' fronts at either side. Two white figures: the person who stays, in the doorway; the account holder, by the meter, who walks away down the street. A sheet comes up over the pavement, *an energy company*, with a short timeline for 2026: *account holder* (yellow, ends *14 Jun*) and *occupant* (yellow, open). A heart beats on her chest, and its tag, *life support*, sits on the wall above the sheet with a pencil arrow to it. First the heart drops onto the account holder's band, and its dotted line ends with it: a red ring at 14 June, *closes with the account*. Then it moves to her band, and its dotted line runs on: *kept on the person*.

**On screen.** an energy company · account holder · 14 Jun · occupant · life support · closes with the account · kept on the person

### 9 · One table, any date · 4:20–4:59

**Narration.** On the platform, it's one table, with a row for each role. Each row holds the person, the role type, its owner, what it relates to, and the dates it's valid from and to. Jun builds it, with two tests. A role can't end before it starts, and every role belongs to a person. Then any question can take a date: census date, last year, or today. Each row also keeps when it was recorded, so a contract entered late still counts from the day it began.

**Picture.** The data architect's office. A sheet, `core_person_role`, with its columns (*person_key · role_type · owner · relates_to · valid_from · valid_to*), each lit as it's named, the two dates together, and Linh's rows, one per role, each with a dot in its colour; the earlier tutor contracts are folded into one line, *one per semester since 2023 · six rows*. Jun, edged in cyan, arrives beside it, and under it the model's tests: `versions_do_not_overlap` and `relationships: core_person`, each with its plain words (*ends after it starts · belongs to a person*) and a pencil tick. Then the query, `where {{ valid_at(census_date()) }}`, and three date pins along its edge, lit in turn: *31 Mar 2026*, *31 Mar 2025*, *today*. Last, a column comes in, `recorded_at`; the Semester 1 2026 row lights in tutor violet, its `recorded_at` *2026-04-06* in violet ink, and a pencil ring closes round its `valid_from`, *2026-02-23*.

**On screen.** core_person_role · person_key · role_type · owner · relates_to · valid_from · valid_to · Linh · applicant · student · alumni · tutor · researcher · admissions · registrar's office · alumni office · HR · research office · bachelor's · master's · unit · S1 2026 · project · one per semester since 2023 · six rows · null · versions_do_not_overlap · ends after it starts · relationships: core_person · belongs to a person · where {{ valid_at(census_date()) }} · 31 Mar 2026 · 31 Mar 2025 · today · recorded_at · 2026-04-06 · 2026-02-23

*The tests are the project's own: `versions_do_not_overlap` (`tests/generic/versions_do_not_overlap.sql`) checks that every period ends after it starts and doesn't overlap the next one for the same role and thing; dbt's `relationships` checks that each row's person exists.*

### 10 · The person stays · 4:59–5:23

**Narration.** Today, Linh is a student, a tutor, a researcher and an alumna. In December, the project ends. One day, she'll graduate again. Roles come and go. A role has a start and an end. The person stays.

**Picture.** Back to the timeline, the line at *today* with its tag, a dot where it crosses each open period, and Linh's figure wearing four bands. On "December", a pencil ring closes on the researcher period's end; on "graduate again", the student period runs on to the right, paler and dashed, and a ring closes on an end somewhere ahead. The line of years widens until it runs from 2019 to 2027, bands starting and ending all along it, the tutor's seven contracts among them, and the white figure unchanged at the left. The last line writes in above it and settles onto the end card. Wordless breather. End card.

**On screen.** today · A role has a start and an end. The person stays.

## Pause and think

Four questions, one at the end of each of four chapters, as the site shows them (`site/assets/roles-come-and-go/think.en.js` and `think.es.js`):

1. *After chapter 3, True for a day.* Planning ran last year's census count again, and Linh was in it as a student, months before she came back. What went wrong? (Each system sends the platform only how it sees her today, written over every night, so a question about last year still gets today's answer.) It ends by asking viewers what a yes-or-no list they keep would say about last year.
2. *After chapter 5, A contract each term.* On 15 January 2026, between semesters, is Linh a tutor? (No: no contract is open that day; she's still the same person, and her next contract starts with Semester 1.) It ends by asking viewers which roles where they work start and end with a term or a contract.
3. *After chapter 6, One line, one date.* On census date, Linh has four roles open. Planning counts students who also work here. How many times does she count? (Once: it counts people with a student role and a work role open on that day.) It ends by asking viewers which of their reports count roles when they mean people.
4. *After chapter 9, One table, any date.* Linh's Semester 1 contract began on 23 February but was entered on 6 April, before the census report was published on 14 April. Is she in Planning's census-date count as staff? (Yes: it's valid from 23 February; `recorded_at` says when the platform learned of it, which matters only for "what did we know on 1 April?")

## Labs (candidates)

- **Which roles, on census day?** Drag a date line across three people's bands (Linh; a graduate who applied again but hasn't enrolled; a tutor between contracts) and choose which roles are open.
- **Draw Linh's timeline.** Place her roles as dated bands from clues in her four systems.
- **Status or dates?** Sort ten questions by whether a status kept for today can answer them.
- **Write the as-at filter.** Compose the filter for "alumni with an open student role" as at a date, with `valid_at`.

## Where it comes from in the project

| On screen | In the example project |
|---|---|
| Census date, 31 March 2026 | `dbt_project.yml` line 19, the `census_date` var ("Planning's census date: the 'as at' of the Planning mart") |
| As at a date: valid from inclusive, valid to exclusive | `macros/shared/time.sql`, `valid_at` (lines 7–13); used by `models/marts/planning/mart_planning__near_award.sql` |
| *Recorded* beside *valid from* | `models/_shared/_shared__columns.md`, the `recorded_at` doc (lines 36–39): "a withdrawal entered a week after it happened is valid from the day it happened" |
| The census report, published 14 April 2026 by the registrar's census team | `seeds/expected/planning/census_report.csv` (from *One row of what, and when*) |
| A role can't end before it starts | `tests/generic/versions_do_not_overlap.sql` |
| The role table, `core_person_role`, and the person, `core_person` | New: the series adds the person and a dated role table (the proposal's *What the example project gains*, for films 1, 2 and 4) |
| Her two student roles | `data/student_system/past_learners.csv` (her first degree: enrolled 25 February 2019, completed 15 December 2022) and `learners.csv` (enrolled again 21 July 2025); the platform recorded each change the night after (`_valid_from`) |
| Her tutor contracts, one per semester | `data/hr_system/contracts.csv`: her contracts from 2023-S1 to 2026-S1, each with `starts_on` and its last day, `ends_on`. The 2026-S1 contract was recorded on 6 April 2026, and 2026-S2's on 14 July, after the story's today |
| The research project and Ana Ruiz as its lead | `data/research_system/projects.csv` and `project_members.csv`: *Wait times in emergency care*, 2 March to 19 December 2026, led by Ana Ruiz, who supervises Linh on it; recorded on 25 February 2026 |
| The alumni office's question | `data/alumni_system/alumni.csv`: her alumni record, from her graduation on 15 December 2022, recorded when the alumni office's records first reached the platform, 1 November 2024 |
| The statuses each system sends nightly | Invented for the film, as the failure the dated roles fix |

## Rigour to check before recording

- **Cato's offices** (read 17 October 2026): quaestor 204 BC, plebeian aedile 199, praetor 198 (Sardinia), consul 195 with Lucius Valerius Flaccus, censor 184 ([Wikipedia, *Cato the Elder*](https://en.wikipedia.org/wiki/Cato_the_Elder); [Encyclopedia.com](https://www.encyclopedia.com/people/history/ancient-history-rome-biographies/cato-elder): "successively quaestor (204), aedile (199), praetor (198)"). He held no magistracy after the censorship and died in 149 BC, so "his last office" holds.
- **The ladder, not overstated.** From the third century BC careers "followed more or less the same track": quaestor, aedile, praetor, consul ([Livius, *Cursus honorum*](https://www.livius.org/articles/concept/cursus-honorum/)); minimum ages were set in law only in 180 BC, by the *lex Villia annalis*, after Cato's career ([Wikipedia](https://en.wikipedia.org/wiki/Lex_Villia_Annalis)); sources disagree on the exact ages, so the film gives none. The aedileship wasn't required; Cato held it. The film says "a ladder" and "each held for one year", both true of these four offices.
- **The census** (read 17 October 2026): censors "not only wrote down the names of the citizens, but also registered their property and age", every five years, and served eighteen months ([Livius, *Censor*](https://livius.org/articles/concept/censor)). The censor band is eighteen months long.
- **Cato's look:** red hair and grey eyes, from Plutarch's *Life of Cato the Elder*, 1; the toga as off-white wool over a tunic, worn as in 204 BC throughout. Shoes (read 18 October 2026): the calceus went with the toga, most plebeians wore it in tanned leather, and the red one came with curule office ([Wikipedia, *Calceus*](https://en.wikipedia.org/wiki/Calceus)); as quaestor, Cato hadn't held one, so his are dark leather. The censor's own dress is uncertain in the sources, a purple toga or the praetexta ([Smith's *Dictionary*, *Censor*](https://penelope.uchicago.edu/Thayer/E/Roman/Texts/secondary/SMIGRA*/Censor.html)), so the film doesn't change it in 184. Temples of the time in stucco and terracotta, before Rome's marble; the Capitoline has its two summits, the Capitolium with Jupiter's temple and the Arx with Juno Moneta's (344 BC).
- **Census date** (read 17 October 2026): the last day to withdraw from a unit without financial penalty, and the date enrolments are counted for government reporting; 31 March at some Australian universities in some years ([Monash](https://www.monash.edu/students/admin/enrolments/dates/census/archive/2023), [ANU](https://www.anu.edu.au/students/program-administration/program-management/census-dates)), and the example project's own `census_date` (2026-03-31). The film says it plainly: "the day it counts who's enrolled, for its official numbers", with no jurisdiction.
- **Tutors, one teaching period at a time** (read 17 October 2026): Sussex's terms for doctoral tutors, clause 9: "written Offers of Work will be made to a Doctoral Tutor for each module for each defined Teaching Period (usually a semester)" ([Sussex](https://sussex.ac.uk/humanresources/documents/terms-and-conditions-for-doctoral-tutors-2024.pdf)); Australian universities advertise casual tutoring one semester at a time ([ANU](https://jobs.anu.edu.au/jobs/casual-sessional-academic-in-school-of-sociology-canberra-act-act-australia), [Melbourne](https://msd.unimelb.edu.au/__data/assets/pdf_file/0020/5532005/ABP-PD-Sessional-Tutor-SM2-2026.pdf)). The film says "a new contract each semester", generic; neither university is named.
- **Statuses written over each night:** a common way sources reach a platform (a nightly copy of each record as it is), and the reason *One row of what, and when* dates versions by when a change took effect. The film doesn't blame any system: each office does know its dates.
- **Counting people, not rows:** Planning's question is about people; the roles open at one date are the filter. Said without a statistic.
- **Gendered words:** Linh's band says "alumna" because it's hers; the role type in the table is "alumni", a word for anyone. The reference list of role types and its codes is *Lists everyone uses*' to settle; this film shows plain words.
- **The supervisor:** a project lead who supervises the people on the project is common practice; Ana Ruiz is the Head of School from *When things go wrong*, here also the project's lead. The project, *wait times in emergency care*, is invented.
- **Energy** (read 17 October 2026): retailers keep a register of homes with life support equipment, and move-outs are where it goes wrong: a new account holder has to register again, and the flag on the old account can lapse ([ERAWA, *Moving in or out*](https://www.erawa.com.au/customer-protection-codes/switched-on-consumer-guide/moving-in-or-out); AEMC submissions on life support reforms, 2020 and 2026). Generic in the film; no retailer or jurisdiction named.
- **Dated roles in the pattern books:** Silverston's party role and party relationship patterns carry from and thru dates (*The Data Model Resource Book*, volumes 1 and 3). Not named in the film.
- **Two kinds of time:** a role's dates say when it was true; `recorded_at` says when the platform learned of it (often called bitemporal, as *One row of what, and when*'s rigour sheet says). The film doesn't use Delta time travel for this: its history is kept for days, not years, by default (30 days of log, 7 of files), so the table keeps `recorded_at` itself.
- **Her dates, from the project's data** (checked 20 October 2026): each office's card in chapter 4 shows its own last day (*23 Feb – 27 Jun 2026*, *2 Mar – 19 Dec 2026*), the project's `ends_on`. The table's `valid_to` is exclusive, so it's the day after: `2026-06-28` and `2026-12-20`. `recorded_at` follows the project's doc: when the platform recorded the latest change behind the row, from each source's `_valid_from`. So a role that has ended was recorded with its end, the night after, and no row claims an end before it was known. Each role is keyed by the record that grants it (the project's DEC-PER-03, proposed), so the alumna row was recorded with her alumni record, on 1 November 2024, when the alumni office's records first reached the platform. The project was recorded a week before it began, and the 2026-S1 contract on 6 April, six weeks after it began. The applicant rows have no admissions source in the project yet, so their dates are the film's.
- **dbt:** `versions_do_not_overlap` is the project's own generic test; `relationships` is dbt's, written with `arguments:` as the project writes it.
- **Colour:** the role washes and the energy yellow checked for contrast with the dark text on them (4.5:1 or better); every band is labelled, so nothing depends on colour alone.

## Decided

| Date | Decision |
|---|---|
| 17 October 2026 | The opening follows Cato the Elder's offices, 204 to 184 BC, and ends on the census his last office kept, so the word carries into census date. |
| 17 October 2026 | The failure is a status each system overwrites nightly: true for a day, so last year's question gets today's answer. No system is blamed; each office knows its own dates. |
| 17 October 2026 | The tutor role is corrected in the open: one band so far (as in *One person, many roles*), one period per semester here, from an offer of work each teaching period. |
| 17 October 2026 | The supervisor is Ana Ruiz, the Head of School from *When things go wrong*, as the project's lead. |
| 17 October 2026 | The role table uses the project's own conventions: `valid_from` inclusive, `valid_to` exclusive, `recorded_at`, `valid_at(census_date())`, and its `versions_do_not_overlap` test. The role type for alumni is "alumni" in the data; Linh's band says "alumna". |
| 17 October 2026 | No student numbers on screen: *Who is it?* decides which of her two numbers the registry keeps. |
| 17 October 2026 | Pause and think after chapters 3, 5, 6 and 9, one question each; no labs until the series' labs thread adds them. |
| 17 October 2026 | The story's today is 20 April 2026, after the census report of 14 April; a line at *today* shows it from chapter 4 on. |
| 17 October 2026 | In the timeline chapters the camera stays still and the line of years zooms instead, so labels keep their size and nothing drifts. |
| 17 October 2026 | Cato's offices become a ladder of terracotta rungs on a sheet beside the tablet, on a line of years from 205 to 185 BC. |
| 17 October 2026 | The tutor role has seven contracts, one a semester from Semester 1 2023 to Semester 1 2026; the table folds the six earlier ones into one line. |
| 17 October 2026 | When Ana joins, the line of years draws in from the right to make room for her. |
| 17 October 2026 | The energy company's two people are the white figures of the *Elsewhere* in *One person, many roles*, standing on paper so the street doesn't show through them. |
| 18 October 2026 | Cato is drawn as in 204 BC throughout: a quaestor's plain toga, his left arm wrapped in it, and dark leather calcei. The censor's dress is uncertain in the sources, so it doesn't change in 184. |
| 18 October 2026 | The Capitoline has its two summits, with Jupiter's temple on the Capitolium and Juno Moneta's on the Arx, on dry olive slopes. |
| 18 October 2026 | Films stand alone and aren't numbered, so the tutor's correction opens with "so far": chapter 4 drew one band, as *One person, many roles* did. That film is named by its title wherever this one refers to it. |
| 18 October 2026 | The *relates to* tags hang above the timeline on dashed pencil lines: drawn on the rows, they hid the shorter periods, the Semester 1 contract among them. |
| 18 October 2026 | The sound is the film's own: a choir humming, one voice to a note, a felt piano note for each role, a glass harmonica for the person, and the series' clarinet mark, from G minor to D major. Two voices on one note beat into a slow pulse on a phone's speaker, so each note has one. |
| 20 October 2026 | The role table follows the project's new data. Each office's card keeps its own last day, and `valid_to` is the day after: `2026-06-28` for the Semester 1 2026 contract, `2026-12-20` for the project. The tutor's contracts end on the project's dates. `recorded_at` is when the platform recorded each row's latest change, as the project defines it: the night after an ended role's end, 1 November 2024 for the alumna row (with her alumni record), 25 February for the project, and 6 April for the late contract. |
| 20 October 2026 | The narration names no tool for the role table and its tests, after the author's note for the series: rules are defined where transformations are implemented, whatever the master data solution. So chapter 9 says "Jun builds it, with two tests", after "On the platform, it's one table". The screen still shows the tests and the query as YAML and SQL, the simplest form. |
| 20 October 2026 | The sound follows the series' rule from the author's review of *Who is it?*: "I'm keen to just bring some sounds and music from time to time instead of constant sounds." The choir sings under the opening, Rome, then only at a few turns and under the end card; between them, the music is the notes of what's on screen, and the effects are one for each thing that matters. No pulse, no vibrato, and no note played twice a little out of tune: the glass harmonica's two tones a hair apart, with their shimmer, swelled about once a second, and are now one. |

## Built

Built on 18 October 2026, from this script, in watercolour. What changed on the way is in the *Decided* table above; besides that:

- **Captions.** Spanish captions in Latin American Spanish, about as long as each English line.
- **Sound.** A new palette (in `source/tools/score.py`): a choir humming "oo" that holds the notes two chords share, a felt piano note for each role, a glass harmonica's D and A for the person, and the clarinet's mark (1-8-5-1) on G under the title and on D at the end, from G minor to D major. Under Rome, the choir sits about 21 dB under the voice, as in *One person, many roles*; after that, the music comes in from time to time (the last bullet).
- **Rebuilt, 20 October 2026,** with the project's dates for her roles, and chapter 9's line about the tests naming no tool (see *Decided*). That line was voiced again, and the film re-timed, re-mixed and re-captioned around it: 5:23.
- **The sound, again on 20 October 2026,** after the author's note on *Who is it?* for the series (see *Decided*). The choir sings under Rome only, then at four turns and under the end card: a chord held open on A, a question, after the wrong answer about last year and after the late contract, each let go before the film stops for Pause and think; D major, the answer, as chapter 4 begins; B flat major taking up the person's notes as the film moves to the energy company. In between, the music is what's on screen: a role's note, the person's notes, the tutor's seven contracts. It's heard under a fifth of the voice after Rome, never for more than 3 seconds at a time, where it was under all of it. The pulse under chapter 3 is gone, and so are more than half the effects (13 a minute, from 32): one for each thing on screen that matters, not for every stroke, key or step. Nothing trembles: the glass harmonica had played each note as two tones a hair apart, with a shimmer, so its level swelled by a third about once a second; it now holds one steady tone, the choir and the clarinet have no vibrato, the person's A is a pure fifth above her D, and the turns' chords are sung in tune with themselves, so their overtones don't beat. The opening's chords stay tempered: a voice held into the next chord would have to slide.

## Next

1. The author watches the film, and approves it or asks for corrections.
2. The project's additions it needs: the person and the dated role table (`core_person`, `core_person_role`), reading the HR, research office and alumni sources added on 20 October 2026. The applicant rows still need an admissions source.
3. Labs, with the series' interactive learning: the candidates above.
