# Data governance · Rules that run: script

*The script of the fifth film of the data governance series, *Governance you can use*: a draft for the author's review, 21 October 2026, about 5:50, in ten chapters, in English, painted in watercolour. Nothing is recorded or drawn until the author approves it. Once the film is made, the narration lives in `source/src/narration.js` and the pauses in `source/src/breath.js`, and where they differ from this page, the source wins. The title card follows chapter 1; the end card follows chapter 10. Made to read on a phone: on-screen text is at least 28 px in the frame, nothing sits under the captions, and no caption runs to three lines.*

## The promise

Every line passes two tests: anyone who has filled in a "rate your data from 1 to 5" survey can follow it, and an experienced data quality lead finds nothing wrong in it. Binder 9 says data quality is monitored, and today that means a survey of how people feel about their data. The film replaces it with what already runs: the tests the data team runs every night, each given an owner and a quality dimension, and a scorecard written from the last run, by domain and dimension, with what didn't pass and whose it is. The levels are the owners', set with a reason, because a rule its owner doesn't understand gets ignored, then switched off. A rule about what people do is a list the team works through, not a failed build. One night the scorecard does its job: a level is crossed, the build stops, and the issue reaches the one team that knows what it means. **A quality rule is a test with an owner.**

## The story in one paragraph

In 861, on Roda Island in the Nile, at Fustat, in what is now Cairo, the caliph's new Nilometer is finished: a stone well open to the river, and a marble column marked in cubits. Every day of the flood, the keeper reads the water on the column, and the reading goes to the officials. At sixteen cubits there's water enough for the fields, and the year's land tax is due in full: the tax follows what the water did, not a guess. Today, at the university, binder 9 says data quality is monitored, and monitored means a survey: each spring every system's owner rates its data from one to five, and the average is 3.9. David asks whether they can trust the number they send to the government, and the survey can't say. But the data team already runs 160 tests every night. Yusuf asks for an owner and a dimension on each, Jun writes them once, by folder and by kind of test, and the governance check keeps them there. The scorecard then writes itself from last night's run, and answers David: Planning's number matches the census report, and the test is Planning's. The levels are the owners': the learning team warns on one enrolment with no email and stops the build above five; Planning stops it on any difference from the census report. At Thursday's office hours, Tom reads his row: the walk-in he knows, and a warning about emails typed with spaces and capitals that nobody owned for a year. Following up a walk-in is a list his team works through, not a test. Then one night five more walk-ins arrive with no email, six in all: the test fails, the build stops, and in the morning the scorecard has one red cell and the learning team an issue with the reason and a date. By noon the six are registered, with their emails; that night the cell is green. Where problems like these start is the next film.

## What each object stands for

| Object | Stands for |
|---|---|
| The Nilometer's marble column, marked in cubits, and the water against it | A measure taken where the thing happens |
| The keeper reading the water every day, and the scribe's papyrus going to the officials | A measure taken every day, and a record for the people who decide |
| The sixteen-cubit mark, lit gold | A level set in advance |
| The fields beyond the river, and the year's land tax | A decision that follows the measure, not a guess |
| Binder 9 on Yusuf's shelf, and its line "Data quality is monitored and issues are remediated" | The policy line the film makes run |
| The survey form, a circled 4, and the bar chart of seven systems, average 3.9 | Quality as opinion: how people feel about their data |
| Jun's night build, its lines scrolling, "160 tests" | What already measures the data, every night |
| A test's result line with two empty tags, "owner: ?" and "quality: ?" | A rule nobody owns |
| The folder list with an owner on each, and the six dimension labels | An owner and a dimension, written once |
| The scorecard: domains down, dimensions across, a wash in each cell | Quality read from what ran |
| Planning's accuracy cell, passed, with "owner: Planning" | The answer to David's question |
| Tom's and Clara's speech bubbles beside their tests' descriptions | The level is the owner's, with its reason |
| A test card with "owner: ?", warnings piling up, and a switch turned off | A rule its owner doesn't understand |
| The learning row's two amber cells | A warning the owner knows, and one nobody read |
| The learning team's follow-up list | A rule about what people do: a list the team works through |
| The counter of enrolments with no email, 1 to 6, amber to red | A level crossed |
| Grey cells across the scorecard, "not run" | What a stopped build holds back |
| The issue in the learning team's inbox: the reason, a date, "closed when this test passes" | A failure reaching the one team that knows what it means |
| The bar chart beside the scorecard, its red cell and the learning team's name | Measured, not surveyed |
| A soft wash behind each person: gold, cyan, or warm umber | The business side, the technical side, people of the past |

## The look

*Watercolour*, the series' look: pencil and wash, paint gathering in the paper's grain, soft light from a window, and only the university's own places. People are drawn as the master data films draw them, with a soft wash of their side's colour behind each: gold for the business side, cyan for the technical side, warm umber for the people of the past.

- **The opening is painted the same way,** with the place and year in the corner. Roda Island at the tip where the Nilometer stands, the river wide and brown-green in the flood, palms, boats under lateen sails, and Fustat's low buildings across the water. The well is painted as the sources describe it: courses of dressed stone, a stair running round the inside walls down to the water, three arched openings on the east side where the river comes in and lies still, and in the middle an octagonal marble column, its cubits cut into it, tied at the top by a wooden beam. In 861 it has no dome; the later domes and the conical roof of today are not shown. The inscription bands on the walls are painted as plain bands, with no lettering, because they hold verses of the Quran and the film doesn't write them. No style is borrowed: the building is the series' watercolour, as it would paint any place of work.
- **The people of 861** wear their own time: long linen tunics, mantles and turbans, in undyed linen and soft indigo and madder; the scribe writes on papyrus, still the paper of Egypt's offices in the ninth century, with a reed pen.
- **Places today.** The series' shared places: Yusuf's office, with its shelf of binders and the framed 2.1 out of 5; the data team's room and Jun's screen; Planning's room; and close-ups of screens. Tom's screen is the shared screen close-up, in the learning team's own wall colour.
- **Colour carries meaning.** Gold is governance's decisions; green is what runs and passes; amber is a warning its owner agreed to watch; red is a failure that stops the build; a grey hatch is what didn't run. The colours are never alone: every cell also says it in words.
- **The scorecard is painted from the file the example project writes,** `docs/scorecard.md`, word for word, as a page on a screen. It's shown in turns, so it reads on a phone: the whole page wide, where its words are decoration and the washes carry it; then close, the header and one row at a time, and the rows of *Not passed*, at 28 px or more, with each test's full name in the code font.

## Script

The times are estimates for the draft, from the word count; the recorded voice sets them. Words on screen are on paper, screens, boards, tags and speech bubbles.

### 1 · The measured river · 0:00–0:55

**Narration.** Fustat, in what is now Cairo, in 861. On Roda Island, the caliph's new Nilometer is finished: a stone well open to the Nile, and a marble column marked in cubits. Each summer, the keeper reads the rising water on the column, every day, and the reading goes to the officials. At sixteen cubits, the fields will have water enough, and the year's land tax is due in full. Below it, it isn't. The tax isn't a guess. It follows what the water did. A measure taken every day, a level set in advance, a record for the people who decide. That's what a quality score should be.

**Picture.** Late afternoon on the Nile in flood, painted in watercolour: the river wide and brown-green, boats under lateen sails, palms on Roda Island, and across the water Fustat's low buildings; the place and year in the corner. The camera crosses the water to the island's southern tip, where a low stone parapet frames a square opening at the river's edge. Down into the well: the stair running round the stone walls, three arched openings where the river comes in and lies still, and in the middle the octagonal marble column, its cubits cut into it, the wooden beam across the top; "a column marked in cubits". On "every day", the keeper, in a linen tunic, mantle and turban, stands on the stair by the water and reads the line where it meets the column; the water rises a mark at a time while the light moves across the stones, a day each step; beside him a scribe writes each reading on a sheet of papyrus. On "the officials", the scribe hands the folded sheet to a messenger, whose boat crosses towards Fustat. On "sixteen cubits", close on the column: the water reaches the sixteenth mark, which glows gold; then the fields beyond the river, green, with water in their channels, and a tag, "the year's land tax: due in full"; under it, smaller, "below 16: not in full". On the last line, three tags settle over the well, one by one: "a measure, every day" on the keeper, "a level set in advance" on the gold mark, "a record for those who decide" on the papyrus. Wordless: the water settles, then the title card.

**On screen.** Fustat · in today's Cairo · 861 · the Nilometer · Roda Island · a column marked in cubits · read every day · to the officials · 16 · the year's land tax: due in full · below 16: not in full · a measure, every day · a level set in advance · a record for those who decide · Rules that run · quality measured, not surveyed · Film 5 of 19 · data governance

### 2 · A survey · 0:55–1:29

**Narration.** At the university, binder nine says data quality is monitored. Here, monitored means a survey. Each spring, every system's owner rates its data from one to five. The short-course platform: four. The student system: four. Average: 3.9. Then David asks the question that matters. Can we trust the number we send to the government? The survey can't say. It measures how people feel about their data. Not the data.

**Picture.** Yusuf's office: the shelf of binders and, on the wall, the framed 2.1 out of 5. Binder 9 slides forward and opens on his desk: "9 · Data quality", and its line, "Data quality is monitored and issues are remediated", with "monitored" underlined as it's read. On "a survey", the survey form on top of the binder, "Rate your system's data quality", the numbers 1 to 5, and a 4 circled in pencil. Yusuf pins the results to his board as a bar chart, one bar for each system, with its owner's answer: the student system 4, the learning platform 4, the short-course platform 4, the HR system 4, the research system 3, the alumni system 4, Planning's reports 4; the two named bars light as they're read, and "average 3.9" is written under them. On "David", Prof. David Mensah at the door, as in *Off the shelf*, with his question in a speech bubble. Yusuf looks from the chart to the question; on "Not the data", the chart fades to pencil.

**On screen.** 9 · Data quality · Data quality is monitored and issues are remediated. · Rate your system's data quality · 1 · 2 · 3 · 4 · 5 · Data quality survey · student system · learning platform · short-course platform · HR system · research system · alumni system · Planning's reports · 4 · 3 · average 3.9 · Can we trust the number we send to the government?

### 3 · What already runs · 1:29–1:59

**Narration.** But the data team already measures, every night. A hundred and sixty tests run on the data as it's built. An ID is never empty. A key appears once. Every enrolment points to a learner. Planning's number matches the census report. Each test passes, warns or fails. But a result names only the test. Not whose it is, or what kind of quality it checks.

**Picture.** The data team's room at night, the window dark and the two monitors glowing. Close on Jun's screen: the night's build scrolls, one line per test, and the count runs up to "160 tests". As each kind is named, one line stops and lights, with its plain words on a tag beside it: `not_null_…` "an ID is never empty", `unique_…` "a key appears once", `relationships_…` "every enrolment points to a learner", `reconcile_planning_with_census_report` "Planning's number matches the census report". On "passes, warns or fails", three marks, a green tick, an amber "!" and a red cross. On "names only the test", one line grows to fill the screen, `WARN 1 not_null_stg_short_courses__enrolments_customer_bk`, and two empty tags hang beside it: "owner: ?" and "quality: ?".

**On screen.** 160 tests · PASS · WARN · an ID is never empty · a key appears once · every enrolment points to a learner · Planning's number matches the census report · pass · warn · fail · WARN 1 · not_null_stg_short_courses__enrolments_customer_bk · owner: ? · quality: ?

### 4 · An owner and a dimension · 1:59–2:38

**Narration.** So Yusuf asks for two things on every test. An owner: whoever owns the data it checks. Jun writes it once for each folder: the short-course tests belong to the learning team. And a dimension: the kind of quality it checks. There are six common ones: completeness, uniqueness, validity, consistency, accuracy and timeliness. Each kind of test gets its dimension once: a test for empty values checks completeness, a test for duplicates, uniqueness. And the governance check won't let a new test in without both.

**Picture.** The data team's room: Yusuf at Jun's desk with his notebook, two words written in it, "owner" and "dimension". Close on Jun's screen, the project's settings, where each folder of tests gets its owner, and "Learning team" lights gold as it's named:

```yaml
# dbt_project.yml
data_tests:
  credentials:
    short_courses: {+meta: {owner: Learning team}}
    staging:
      student_system: {+meta: {owner: "Registrar's office"}}
      learning_platform: {+meta: {owner: Learning team}}
      short_courses: {+meta: {owner: Learning team}}
```

On "a dimension", six labels drop in along the top of the screen, in the scorecard's order, each with a small sign: completeness (a full cup), uniqueness (one dot), validity (a tick on a form), consistency (two linked rings), accuracy (a target), timeliness (a clock). On "once", the file where each kind of test is given its dimension, its two lines lighting as they're named:

```sql
-- tests/generic/builtin.sql
{% test not_null(model, column_name) %}
    {{ config(meta={'dimension': 'completeness'}) }}
    ...
{% test unique(model, column_name) %}
    {{ config(meta={'dimension': 'uniqueness'}) }}
```

The empty tags from chapter 3 fill: "owner: Learning team", "quality: completeness". On "won't let a new test in", a pull request's check, in red, then fixed: `tests: … has no meta.owner or meta.dimension`, then a green tick, "Governance's rules are met". Back in the room, Jun nods to Yusuf.

**On screen.** owner · dimension · dbt_project.yml · Learning team · Registrar's office · completeness · uniqueness · validity · consistency · accuracy · timeliness · tests/generic/builtin.sql · owner: Learning team · quality: completeness · has no meta.owner or meta.dimension · Governance's rules are met

**In the repo.** [`dbt_project.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/dbt_project.yml) · [`tests/generic/builtin.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/tests/generic/builtin.sql) · [`scripts/check/governance.py`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/scripts/check/governance.py)

### 5 · The scorecard · 2:38–3:11

**Narration.** Now the scorecard writes itself, from last night's run. A row for each domain, a column for each dimension, and in each cell, how many tests passed, of how many. Under it, what didn't pass, and whose it is. Nobody fills it in. And David's question has an answer. Planning's number matches the census report, faculty by faculty. That test is Planning's, and last night, it passed.

**Picture.** Yusuf's office, morning. On his screen, the page "Data quality scorecard" fills in, wide: its rows and columns appear, and a wash floods each cell as its count arrives, almost all green, three amber in the learning row (completeness, validity and All), and the empty cells left as bare paper. A short wordless moment as the last cell fills. Close (the header and the planning row): `planning` · · 3/3 · 1/1 · 1/1 · 1/1 · 6/6, and the accuracy cell lights, with a tag, "Planning's number matches the census report · owner: Planning". In Planning's room, Clara at her wall screen sees the same row, and nods. Close on *Not passed*, its three rows, each test's name in full. On "David's question", David at Yusuf's door again; Yusuf turns the screen to him and points at Planning's row; David's question, in its bubble, gets a green tick.

**On screen.** Data quality scorecard · Domain · completeness · uniqueness · validity · consistency · accuracy · All · alumni · course · finance · hr · learning · planning · registrar · research · shared · student · wallet · 160/160 (3 warn) · planning · 3/3 · 1/1 · 6/6 · Planning's number matches the census report · owner: Planning · Not passed · warn · learning · completeness · not_null_stg_short_courses__enrolments_customer_bk · Learning team · 1 · validity · short_courses_enrolments_email_entered_clean · 6 · short_courses_learners_email_entered_clean · 3 · Can we trust the number we send to the government?

**In the repo.** [`scripts/generate/scorecard.py`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/scripts/generate/scorecard.py) · [`docs/scorecard.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/docs/scorecard.md) · [`tests/reconciliation/_reconciliation__tests.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/tests/reconciliation/_reconciliation__tests.yml)

### 6 · Whose level? · 3:11–3:48

**Narration.** The levels aren't governance's to set. They're the owners'. An enrolment with no email: one or two walk-ins a term are normal, and the learning team follows them up. So they chose: warn on any, stop the build above five. Planning chose the opposite. Any difference from the census report stops the build, because that number goes to the government. Each level is written into its test, with the reason. A rule its owner doesn't understand gets ignored, then switched off.

**Picture.** Close on the short-course test, the real file, beside a card for its owner, Tom Whitfield, the learning team (gold wash), with his speech bubble: "One or two walk-ins a term. More means something broke." The levels light as they're named, and a small counter beside them shows them: 0 green, 1 to 5 amber, 6 red.

```yaml
# models/staging/short_courses/_short_courses__models.yml
      - name: customer_bk
        description: >
          The customer who enrolled, by email. An enrolment with no email can't be matched to a
          learner. The learning team agreed: warn when any current enrolment has none, stop the
          build when more than five do (see DEC-SC-01 and LIM-SC-02).
        data_tests:
          - not_null:
              config:
                where: is_current_version
                warn_if: ">0"
                error_if: ">5"
```

On "the opposite", the reconciliation test beside a card for Clara Jensen, Planning (gold wash), and her bubble: "Any difference, and nobody ships."

```yaml
# tests/reconciliation/_reconciliation__tests.yml
  - name: reconcile_planning_with_census_report
    description: >
      The Planning mart gives the census team's published number, faculty by faculty. If it
      doesn't, the mart is wrong or the report is; either way, nobody ships until someone knows
      which. …
    config:
      meta: {owner: Planning, dimension: accuracy}
```

On "with the reason", both descriptions light. On the last line, a third card, with no face: a test with "owner: ?" and no reason; amber warnings pile up against it, unread, then a hand turns a switch beside it to "off", and the card goes grey. Beside it, the two owners' tests keep their gold.

**On screen.** Tom Whitfield · learning team · One or two walk-ins a term. More means something broke. · warn if > 0 · stop if > 5 · 0 · 1–5 · 6 · Clara Jensen · Planning · Any difference, and nobody ships. · owner: Planning · accuracy · the level · the reason · owner: ? · off

**In the repo.** [`models/staging/short_courses/_short_courses__models.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/staging/short_courses/_short_courses__models.yml) (lines 47 to 57) · [`sources/short_courses/_short_courses__decisions.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/sources/short_courses/_short_courses__decisions.yml) (DEC-SC-01, lines 10 to 20) · [`docs/conventions.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/docs/conventions.md) (*Tests*, line 231)

### 7 · Tom reads his row · 3:48–4:16

**Narration.** On Thursday, at Yusuf's office hours, Tom reads the learning row. One amber cell he knows: a walk-in from February, whose certificate still can't reach anyone. And one he's never seen: emails typed with spaces and capitals, warning every night for a year. Staging cleans them, so nothing broke. And nobody owned the warning, so nobody read it. Now it's his team's.

**Picture.** Yusuf's office on a Thursday afternoon, a card on the open door, "Office hours · Thursdays 2–3 pm". Tom sits beside Yusuf at the screen. Close (the header and the learning row): `learning` · 7/7 (1 warn) · 5/5 · 7/7 (2 warn) · 3/3 · · 22/22 (3 warn). On "he knows", the completeness cell lights, and an enrolment card slides out of it: "SC|E-7010 · Excel for Everyone · completed · email: —", with a certificate that can't find an address. On "never seen", the validity cell lights, and its two rows of *Not passed*; beside them, an email as it was typed, " Aisha.K@Mail.example ", spaces and capitals showing. On "Staging cleans them", the same email passes through a small sieve and comes out "aisha.k@mail.example". On "nobody read it", a stack of old warning lines, one for every night, each with "owner: —"; on "Now it's his team's", "owner: Learning team" lands on the stack in gold, and Tom looks up at Yusuf.

**On screen.** Office hours · Thursdays 2–3 pm · learning · 7/7 (1 warn) · 5/5 · 7/7 (2 warn) · 3/3 · 22/22 (3 warn) · SC|E-7010 · Excel for Everyone · completed · email: — · warn · validity · short_courses_enrolments_email_entered_clean · 6 · short_courses_learners_email_entered_clean · 3 · " Aisha.K@Mail.example " · aisha.k@mail.example · every night, for a year · owner: — · owner: Learning team

### 8 · A test, or a list? · 4:16–4:34

**Narration.** Following up the walk-ins stays out of the tests. It's a rule about what people do, not about the data, so it never fails a build. It's a list the learning team works through, one case at a time.

**Picture.** Tom's screen, at his desk, in the learning team's wall colour: the team's follow-up list, built every night with the rest, its one row today, the walk-in from February, open 240 days. Beside it, two cards side by side: "a test · checks the data · can stop the build" and "a list · what people do · a case to work through". Tom writes a note on the row: "called · email to come".

**On screen.** Enrolments to follow up · enrolment · course · status · enrolled on · days open · SC|E-7010 · Excel for Everyone · completed · 17 Feb 2026 · 240 · a test · checks the data · can stop the build · a list · what people do · a case to work through · called · email to come

**In the repo.** [`models/marts/learning/mart_learning__enrolments_to_follow_up.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/marts/learning/mart_learning__enrolments_to_follow_up.sql) · [`docs/conventions.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/docs/conventions.md) (*Tests*, line 232)

### 9 · One red night · 4:34–5:14

**Narration.** Then, one night, five more walk-ins arrive with no email. That's six, over the learning team's five, so the test fails, and the build stops. Everything built from the short courses waits, Planning's numbers too. In the morning, the scorecard has one red cell, and the learning team has an issue, with the reason and a date. Tom knows what it means. His team chose the level. And their list shows the six. By noon, they've registered them, with their emails. That night, the cell is green.

**Picture.** Night: the data team's room dark, Jun's screen still running the build. The counter of enrolments with no email ticks from 1 to 6, amber, then red at 6; the build line `FAIL 6 not_null_stg_short_courses__enrolments_customer_bk`, and below it the lines that depend on it turn grey, one after another, "SKIP". Morning, Yusuf's screen, wide: the scorecard with one red cell, learning's completeness, and grey hatching across the cells of student, planning, finance and the wallet. Close (the learning row): `learning` · 6/7 (1 fail) · 5/5 · 7/7 (2 warn) · 3/3 · · 21/22 (2 warn, 1 fail); then the planning row, `planning` · 1/6 (5 not run), and the *Not passed* line "not run · student · 22 tests · an earlier test failed". On "an issue", Tom's screen at his desk: the issue the night's run wrote for his team, "Data quality: 3 tests to answer, by 20 October 2026", "From the run of 19 October 2026", its first section lit: "Status: fail, 6 rows", "Why the limit is there: … stop the build when more than five do (see DEC-SC-01 …)", "Due: 20 October 2026", "Closed when: … passes"; the two warnings below it, due a week later, stay unlit. Tom reads it and nods: "Six. Something broke." On "their list", the follow-up list now holds six rows: the walk-in from February and five First Aid enrolments from last night, each 0 days open. On "By noon", a clock at twelve; on each row an email is written in, in pencil, and each enrolment card links to a new learner card, one by one, six times. On "That night", the scorecard again: the red cell washes back to green, the grey cells fill green, and the learning row reads 7/7 · 5/5 · 7/7 (2 warn) · 3/3 · · 22/22 (2 warn); only the email warning stays amber, and the follow-up list is empty.

**On screen.** no email · 1 · 2 · 3 · 4 · 5 · 6 · FAIL 6 · not_null_stg_short_courses__enrolments_customer_bk · SKIP · learning · 6/7 (1 fail) · 21/22 (2 warn, 1 fail) · planning · 1/6 (5 not run) · not run · student · 22 tests · an earlier test failed · Data quality: 3 tests to answer, by 20 October 2026 · Owner: Learning team · From the run of 19 October 2026 · Status: fail, 6 rows · Why the limit is there: · stop the build when more than five do · Due: 20 October 2026 · Closed when: … passes · Six. Something broke. · SC|E-7010 · SC|E-7021 · SC|E-7022 · SC|E-7023 · SC|E-7024 · SC|E-7025 · First Aid · 19 Oct 2026 · 0 · 12:00 · learning · 7/7 · 5/5 · 7/7 (2 warn) · 3/3 · 22/22 (2 warn)

**In the repo.** [`scripts/generate/issues.py`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/scripts/generate/issues.py) · the three scorecards the film shows, and how they were made: `/mnt/project-files/governance/film-5/` (to move into the film's `source/` folder)

### 10 · Measured, not surveyed · 5:14–5:49

**Narration.** Binder nine's line runs now: every rule a test, with an owner, a level and a reason, and a scorecard read from what ran. The survey still says four out of five. The scorecard says which cell, and whose. Where problems like these start, and how to fix them there, is the next film. A quality rule is a test with an owner.

**Picture.** Yusuf's office: binder 9 open at its line. On "runs now", a green highlighter stroke goes behind it, and Yusuf writes beside it, one by one: "a test, with an owner", "a level and a reason", "a scorecard from the runs", "an issue for its owner". On "The survey still says", his board: the survey's bar chart on the left, and on the right the morning's scorecard, its one red cell and, beside it, "Learning team". On "the next film", Yusuf puts binder 9 back on the shelf and takes down binder 15, "Fixed where it starts". The lesson line, then the end card.

**On screen.** 9 · Data quality · Data quality is monitored and issues are remediated. · a test, with an owner · a level and a reason · a scorecard from the runs · an issue for its owner · survey · average 3.9 · scorecard · Learning team · 15 · Fixed where it starts · A quality rule is a test with an owner. · Rules that run · Film 5 of 19 · data governance · Learning Data

## Sound

A new palette ([`source/tools/score.py`](source/tools/score.py), to write). Music comes only now and then, soft, never as a bed under the voice: under the opening on the river; under the title card; a short wordless moment when the scorecard's last cell fills; one low note when the red cell appears, with no pulse; and the close and end card. The opening and the close have a soft clarinet pair over a low bowed string and a harp that plucks once for each reading on the column, rising a step each time, and settling on the fifth at sixteen cubits; the university's chords are the same instruments, warmer, in the key the opening ends in. The series' mark, four notes, 1-5-4-8, plays under the title and the end card, on the clarinet, with the harp above. No music in Egyptian or Arabic modes, and no instruments borrowed from them: the opening is told in the series' own sound. The effects are each tied to what's on screen, soft and below about 2.5 kHz: water lapping in the well, a reed pen on papyrus, an oar, paper, a pinned chart, keys, a soft wooden tick as each cell fills, a lower tick for a warning, a muffled thud for the fail, a hush as cells turn grey, and pencil for the emails written in. Mix to -16 LUFS, the music well under the voice when it speaks.

## Pause and think

The film can stop at the end of three chapters, with one question each (`site/assets/rules-that-run/think.en.js` and `think.es.js`), each linked to its lab.

| After | Question | Answer |
|---|---|---|
| What already runs | A test fails at 2 a.m. Before this film, who would have heard about it? | Nobody in particular: the result named only the test. Once every test has an owner, by folder, the scorecard and the issue name whose it is. |
| Whose level? | One enrolment with no email warns; six stop the build. Who chose that, and why? | The learning team, who own the data: one or two walk-ins a term are normal and they follow them up, while more means something broke. The level and its reason are written in the test. |
| A test, or a list? | "Every walk-in is followed up within a week." A test, or a list? | A list. It's a rule about what people do, so it's tracked as cases the learning team works through, not a failed build. The test checks only the data: an enrolment with no email. |

## Labs (candidates)

1. **Which dimension?** Ten tests from the project. Put each under completeness, uniqueness, validity, consistency, accuracy or timeliness.
2. **Set the level with the owner.** Four checks and what each owner says about them. Choose when each warns and when it stops the build, and write the reason in the owner's words.
3. **Read the scorecard.** One morning's scorecard. Say what each amber, red and grey cell means, whose it is, and what happens next.
4. **A test, or a list?** Eight rules. Which check the data, and which are about what people do?

## Rigour to check before recording

Checked on 21 October 2026; the sources are listed below.

- **Fustat, not Cairo.** In 861 the city on the east bank was Fustat, with al-Askar beside it; al-Qahira, Cairo, was founded by the Fatimids in 969. The Nilometer stands on Roda Island, in today's Cairo, so the corner says "Fustat · in today's Cairo · 861", and the narration "Fustat, in what is now Cairo".
- **Built in 861, by the caliph's order.** The Cairo Governorate's page, Arabic Wikipedia and Discover Islamic Art (whose entry is by Tarek Torky of the Supreme Council of Antiquities) give 247 AH / 861 CE, under, or by order of, the Abbasid caliph al-Mutawakkil; Maspero, after Ibn Iyas, says building began in 246 / 860 and was finished in 247 / 861, and that the caliph had the other gauges in Egypt set aside for this one, "the New Nilometer". Some attribute it to al-Ma'mun. Sources disagree on who built it, al-Farghani (the Governorate) or Ahmad ibn Muhammad al-Hasib (Ibn Khallikan, as cited by Arabic Wikipedia; Discover Islamic Art), so the film names no builder. Earlier gauges stood on Roda Island from 715 and by the Babylon fortress before that; the film says "new", not "first".
- **The well and the column.** A square well of dressed stone in three levels, a stair round the inside walls to the bottom, three openings on the east side through which the river comes in and lies still, and in the middle a graduated octagonal marble column, with a wooden beam tying it at the top (the Governorate; Arabic Wikipedia; Discover Islamic Art). The column's length differs: 19 cubits (the Governorate, Arabic Wikipedia), "about twenty" (Maspero), 16 (Discover Islamic Art); the film gives none. The dome came later, and the conical roof of today in the 1920s: the film paints the well open.
- **Read every day, and sent to the officials.** The Governorate: the keeper (*sahib al-miqyas*) measured the rise every afternoon, compared it with the same day of the year before, and the readings went in a register to the state's leaders. Ibn Jubayr, who saw it in 1183: the one who watches the rise every day announces it day by day until the decreed level is reached. The film doesn't show the later public customs (the black curtain, criers in the streets, the cutting of the canal), which belong to later centuries.
- **Sixteen cubits, and the tax.** Al-Mas'udi (tenth century), as quoted by Ibn 'Imad al-Aqfahsi (died 1405) in *Akhbar Nil Misr*: "When the rise reaches sixteen cubits, the sultan's kharaj is complete." In the same book, Mahfuz ibn Sulayman: "When the water completes sixteen cubits, Egypt's kharaj is fully met." Ibn Jubayr: the kharaj is due at sixteen cubits and above; "if it falls short of sixteen cubits, there is no collection for the sultan that year, and no kharaj." Al-Maqrizi, as quoted by Maspero, calls sixteen "the required level". One passage in al-Aqfahsi's book calls sixteen a shortfall for the sultan's kharaj, so the level was not the same in every period; the film says only "due in full" at sixteen and "not in full" below it. Arabic Wikipedia: on its reading "the taxes for the coming agricultural year are determined"; Discover Islamic Art: the means of calculating the taxes on farmland "according to the size of the Nile flood every year".
- **"The tax isn't a guess."** Maspero (6 March 2026, with Prof. Muhammad Ahmad Abd al-Latif of Mansoura University, a former assistant minister of antiquities): the kharaj was assessed by the quantity of the Nile's water, and "not estimated arbitrarily" (*juzafan*, by guesswork), but justly. The Governorate adds that a low reading was kept quiet; the film doesn't need it.
- **People and things of 861.** A keeper and a scribe in long linen tunics, mantles and turbans; papyrus was still the writing material of Egypt's administration in the ninth century, replaced by paper in the tenth; a reed pen. Boats under lateen sails on the Nile. Check against a costume history before drawing. The inscription bands are painted without lettering (they carry verses of the Quran).
- **Six dimensions.** Completeness, uniqueness, timeliness, validity, accuracy and consistency are DAMA UK's six (*The Six Primary Dimensions for Data Quality Assessment*, October 2013), which the UK Government's Data Quality Framework (2020) also adopts; DAMA-DMBOK discusses more. As *Off the shelf* says, later films teach the idea without naming the body it came from, so the narration says "six common ones". The example project calls them "DAMA's six" in its code. The scorecard has no timeliness column because no test is tagged with it yet (the sources' freshness is checked by `dbt source freshness`, not by a test); the generator leaves out a dimension with no tests.
- **dbt.** Severity: a test returns its failures, usually the rows its query finds; `severity` is `error` by default, and `warn_if` and `error_if` are comparisons on that count (dbt's *severity, error_if, and warn_if*). A failing test with severity error makes `dbt build` skip what's built from the model it tests, and the command exits with an error (dbt's *About dbt build command*). The film's "the build stops" means that: what depends on the model waits; the rest still builds. A singular test's `meta` is lost on a partial parse, so the film's scorecards were all written after `dbt build --no-partial-parse`, which the generator now asks for.
- **The example project, as the film shows it** (PR #53, branch `claude/project-thread-ltr3tq`, commit 07d78aa, checked 21 October 2026): test owners by folder in `dbt_project.yml` (lines 105 to 131); dimensions once per kind of test in `tests/generic/builtin.sql`; the governance check's fourth rule in `scripts/check/governance.py` (lines 14 to 15 and 161 to 172); the scorecard, `scripts/generate/scorecard.py`, writing `docs/scorecard.md`; the issues, `scripts/generate/issues.py` (a dry run: one Markdown file per owner in `target/issues/`, added to CI's summary; at the university, a failure goes to its owner that morning and warnings in one issue every Monday); the follow-up list, `models/marts/learning/mart_learning__enrolments_to_follow_up.sql`, which reads the source table so it's there on the night the staging test stops the build; the walk-in test (`models/staging/short_courses/_short_courses__models.yml`, lines 47 to 57) and its decision, DEC-SC-01 (`sources/short_courses/_short_courses__decisions.yml`, lines 10 to 20); the reconciliation (`tests/reconciliation/_reconciliation__tests.yml`, lines 3 to 11); the conventions (`docs/conventions.md`, lines 231 to 233). These line numbers are cited: if PR #53 moves them, update them here.
- **The scorecards on screen are the generator's own output,** from the project with the story's changes, never committed (`/mnt/project-files/governance/film-5/README.md` and `film5_states.sh`, to move into `source/`): the first morning, Thursday 15 October 2026, with the two short-course email rules at warn on every row, as before DEC-SC-04 (160/160, 3 warn); the red night, Monday 19 October 2026, with five more enrolments with no email in the night's extract, six in all (123/160: 1 fail, 2 warn, 36 not run); and the next morning, Tuesday 20 October 2026, with the six registered at noon on Monday, with their emails (160/160, 2 warn), which is where *Fixed where it starts* begins. Each is the night's run at 2 a.m. on its story date, with `as_is_date` and the run's date set to it, so the follow-up list's days open and the issue's dates are the story's. The issues and follow-up lists are beside the scorecards. Registering the emails alone isn't enough: an enrolment must point to a learner, so the six get learner records too, or the consistency test fails.
- **The numbers.** The survey (seven systems, four 4s and one 3 shown, average 3.9) is invented; 3.9 is 27 ÷ 7. 160 is the scorecard's count of tests on the data at 07d78aa (the governance tests aren't scored); re-check it at recording. The walk-in from February is the project's own SC|E-7010 (Excel for Everyone, completed 2 March 2026, enrolled 17 February). The five new walk-ins (SC|E-7021 to SC|E-7025, First Aid) and the six names and emails are invented for the red night.
- **Dates.** The film names no calendar date in its narration. Thursday's office hours are the series' (Thursdays, 2 to 3 pm): Thursday 15 October 2026. The red night is the run of Monday 19 October 2026, so the morning's issue carries the failure, due the next working day (20 October), and the Monday warnings, due a week after the run (26 October): at the university, a failure goes to its owner that morning, and warnings in one issue every Monday. The cell is green in the run of Tuesday 20 October, the day of the stewards' meeting. These dates are proposed to the series' list of shared facts; if it sets others, only the issue's words on screen change.

**Sources (21 October 2026).** Cairo Governorate, the Nilometer in Roda: https://www.cairo.gov.eg/ar/culture/lines-of-knowledge/nile-gauge-in-rawda/ · Maspero, "مقياس النيل" (6 March 2026): https://www.maspero.eg/articles/2026/03/06/933558/%D9%85%D9%82%D9%8A%D8%A7%D8%B3-%D8%A7%D9%84%D9%86%D9%8A%D9%84 · Maspero, "عيد وفاء النيل" (15 August 2026): https://www.maspero.eg/reports-egypt/2026/08/15/980514/ · Arabic Wikipedia, مقياس النيل (الروضة): https://ar.wikipedia.org/wiki/%D9%85%D9%82%D9%8A%D8%A7%D8%B3_%D8%A7%D9%84%D9%86%D9%8A%D9%84_%D8%A8%D8%A7%D9%84%D8%B1%D9%88%D8%B6%D8%A9 · Discover Islamic Art, Nilometer: https://islamicart.museumwnf.org/database_item.php?id=monument;ISL;eg;Mon01;1;en · Ibn 'Imad al-Aqfahsi, *Akhbar Nil Misr*: https://usul.ai/t/akhbar-nil-misr/12 and https://usul.ai/t/akhbar-nil-misr/13 · Ibn Jubayr, *Rihla*, Rawdat al-Nil: https://ar.wikisource.org/wiki/%D8%B1%D8%AD%D9%84%D8%A9_%D8%A7%D8%A8%D9%86_%D8%AC%D8%A8%D9%8A%D8%B1/%D8%B1%D9%88%D8%B6%D8%A9_%D8%A7%D9%84%D9%86%D9%8A%D9%84 · The Ministry of Tourism and Antiquities' page (https://egymonuments.gov.eg/ar/monuments/rawda-island-nilometer/) didn't load on 21 October 2026: check it before recording · UK Government, the data quality dimensions: https://www.gov.uk/government/news/meet-the-data-quality-dimensions · dbt, severity, error_if and warn_if: https://docs.getdbt.com/reference/resource-configs/severity · dbt, About dbt build command: https://docs.getdbt.com/reference/commands/build

## Changed from the plan

The proposal's brief for this film was written before the example project's files existed. Where they differ, the film follows the files, and these changes are for the author to confirm:

- **Whose levels.** The brief has Leila, of the admissions office, set the thresholds and Rosa's team fix the cause. The example project has no admissions tests, so the film shows the levels it does have: the learning team's (DEC-SC-01, Tom as its face, as in *Promises and proofs*) and Planning's (the census reconciliation, Clara).
- **The red cell, and the fix.** The red cell is learning · completeness, for one night; learning · validity (the emails typed as typed) is the amber warning *Fixed where it starts* opens on, agreed with that film's thread. This film doesn't tell the fix at the source: it points to the next film.
- **Issues and the follow-up list.** "A failure opens an issue for its owner, with a date" needed a file, and so did the rule about following up walk-ins: the example project now has both (`issues.py`, a dry run, and the learning team's follow-up list).
- **The opening's wording.** "Cairo, 861" becomes "Fustat, in what is now Cairo, in 861", and "not a report" becomes "not a guess", which is what the Egyptian sources say.

## Decided

| Date | Decision |
|---|---|
| 21 October 2026 | The opening says "Fustat, in what is now Cairo, in 861", and shows only what the sources agree on for a gauge of that time: a reading every day, sent to the officials, and the tax due in full at sixteen cubits. No builder is named, the column's length isn't given, and the well is painted open, without the later dome or its inscriptions' words. |
| 21 October 2026 | The levels shown are the example project's: the learning team's (warn on any enrolment with no email, stop above five, DEC-SC-01) and Planning's (any difference from the census report stops the build), in place of the brief's admissions thresholds. |
| 21 October 2026 | One red night: six walk-ins with no email, learning · completeness red, the build stopping what's built from the short courses, an issue for the learning team, and green the next night. Learning · validity stays amber, for *Fixed where it starts*. Agreed with that film's thread. |
| 21 October 2026 | The scorecard on screen is the generator's output, word for word, shown in turns: the whole page as decoration, then one row at a time at 28 px or more. |
| 21 October 2026 | The film names no body of knowledge: the six dimensions are "six common ones" (DAMA UK's, in the rigour notes), as *Off the shelf* set for the films after it. |
| 21 October 2026 | Music only now and then: the opening, the title, the scorecard's last cell, one low note for the red cell, the close. No pulse. |
| 21 October 2026 | The story's dates, proposed to the series' shared facts: Tom reads his row at office hours on Thursday 15 October; the red night is the run of Monday 19 October, so its issue carries the failure and the Monday warnings; the cell is green in the run of Tuesday 20 October. The film's scorecards, issues and follow-up lists are run on those dates. |

## Pacing report

To come from `source/tools/pace.py` with the recorded voice. The draft has 729 spoken words (861 read as "eight sixty-one", 3.9 as "three point nine"). The chapter times above take *Off the shelf*'s measured pace, 131 words a minute in a chapter, with its pauses, and add the wordless moments: about 5 s for the water and the title card, 2 s for the numbers of the survey, 2 s for the scorecard's last cell and 6 s for the end card. That makes about 5:50, inside the series' 4 to 6 minutes.
