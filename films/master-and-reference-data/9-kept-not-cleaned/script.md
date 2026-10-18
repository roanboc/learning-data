# Master and reference data · Kept, not cleaned: script

*The script of the ninth and last film of the series on master and reference data, working title The same one, everywhere: about 4½ minutes, in ten chapters, in English. Written and built on 17 October 2026, from the plan the author approved that day ([the plan for films 2 to 9](https://claude.ai/code/artifact/b5341da1-808c-4b08-8441-42ab596feb1c), and film 9 in [the series' proposal](../proposal.md#9-kept-not-cleaned)); the times below are the built film's, and [Built](#built) lists what changed on the way. The title card follows chapter 1; the end card follows chapter 10. Made to read on a phone, like the other films: on-screen text at least 28 px in the frame, and the camera moves in on whatever the narration is about.*

## The promise

Every line passes two tests: anyone who has ever tidied a shared folder or a contact list, and watched it fill up again, can follow it; and an experienced master data manager finds nothing wrong in it. The film closes the series. A clean-up fixes the duplicates there are today, but not the way new ones are made, so they come back with every intake. A check where records are made, the search before create of film 7, stops most of them; the steward's queue catches the rest. A few measures, each with a limit agreed with its owner, show whether it's working, and an alert says when one passes its limit, pointing at a case, not at a person. An agent can draft a change, with its evidence; the owner decides. And the measures sit on the governance scorecard, beside every other domain's. Master data is a process, not a project. **A clean-up decays; prevention lasts.**

## The story in one paragraph

Around 256 BC, the governor Li Bing split the Min River in two, without a dam, to water the Chengdu plain. Its shape sends most of the river's gravel down the outer channel, and every dry season the inner channel is closed off and dug out, down to a mark buried in its bed: stone horses, it's said, at first, and later iron bars. Its rule is six characters long: dig the riverbed deep, keep the weir low. More than two thousand years later, it still waters the plain, because it was never cleaned out once and left: it's kept, every year. At the university, a clean-up project merged two thousand duplicate records of people in 2024. A year later there were eleven hundred new ones, because every intake made more: graduates came back to study, and people applied through two routes, each giving them a new number. Linh's second student number, in July 2025, was one of them. In 2026 the application starts searching before it creates a person, and new duplicates fall under fifty an intake, and stay there: like the river's shape, the search keeps most of them out, and Mei's queue digs out the rest. Mei's office has its own iron bars: five measures, each with a limit. One Monday an alert says the queue's oldest case has waited twelve days; it was waiting for HR, Mei rings them, and it's decided that morning. When the government's list of visa types adds one, an agent drafts its mapping, and the admissions office, the list's owner, approves it. Yusuf, who leads data governance, reads the same measures on his scorecard. A bank that cleans up every three years sees its duplicates come back every time, until one check at entry ends the cycle. In February 2027, Linh starts her PhD: a new role, on the person she already is, and not one of the intake's thirty-eight new duplicates. And at Dujiangyan, every spring, when the repairs are done, the water is let back in.

## What each object stands for

| Object | Stands for |
|---|---|
| The Min River split in two at the head of a levee, most of its gravel going down the outer channel | Prevention by design: most of the problem kept out where it comes in |
| The inner channel closed off with wooden tripods and baskets of stones, and dug out each dry season | Upkeep: the everyday work for what still gets in |
| A stone horse, then iron bars, lying at a set depth in the riverbed | A measure with a mark: it says when the work is done, and when to stop |
| "Dig the riverbed deep, keep the weir low" on a strip of paper | A rule, written down once and kept for centuries |
| The water let back into the inner channel, and out to the fields | What keeping it is for |
| A board of record pairs, each merging into one, and a counter reaching 2,000 | A clean-up: a project, with an end |
| A line that climbs back, intake by intake | Duplicates made faster than anyone finds them: a clean-up decays |
| Two small cards, S-17142 and S-20436, settling into July 2025's bar | Linh's second number, one of the new duplicates: the series' thread |
| The two applications stamping new numbers | Where duplicates are made, which the clean-up didn't touch |
| The application with a search step, and three ways out of it | The check at entry: search before create |
| Bars under a dashed line marked 50 | New duplicates per intake, within its limit |
| Five gauges on a dashboard, each with an iron bar at its limit | The steward's measures, each with a mark |
| A gauge rising past its bar, and an alert card naming one case | A measure past its limit, and an alert that points at a case |
| The government's list with a new row; a drafted change with its evidence; the owner's tick | A list from outside changes; an agent proposes; the owner decides |
| A scorecard with a row for every domain, and one for the person | The measures, where governance reads every domain's |
| A line in banking blue that climbs and drops every three years, then stays down | A clean-up repeated, ended by one check at entry |
| Linh's white figure, given a new band | The person, kept: a new role, and no new number |

## The look

Watercolour, as in every film of the series ([film 1's script](../1-one-person-many-roles/script.md#the-look)): daylight in soft washes on warm paper, pencil lines, and colours that mean something. Each role keeps its colour (student teal, applicant amber, researcher coral, tutor violet, alumna green); the person, as the master record, is the white of the paper in a pencil line, banded in her roles' colours. Crosses are red ink. The government's list wears the public sector's green-blue, and the bank its blue.

- **Dujiangyan** is painted in the series' own watercolour, not in a borrowed style: mountains in layered washes, the river in blue, the levee and its trees in pencil and wash, the plain as strips of field. The past is the same watercolour, with the year in the corner. The people who dig in the dry season are small figures in plain working clothes of hemp, belted at the waist, with cloths tied round their heads, and wooden spades and baskets: dressed for the work and the time, with no costume clichés. One language on screen: the rule is shown in English only, as a strip of paper, and its six characters are said, not drawn.
- **The measures** are gauges on paper, like the iron bars: each has a level and a mark at its limit, so "past its limit" reads without colour. A tick in green ink means within the limit, a red-ink mark past it, and a word says which.
- **The tools** appear once, small, with their official logos: dbt writes and tests the measures; Databricks runs them, keeps them and shows them.
- **People.** Mei (gold, the business side) in the registrar's office; Leila of the admissions office (gold) approving the list's change; Yusuf, the data governance lead (gold), at his scorecard; Sam, Ben and Rosa (cyan, the technical side) with Mei in the clean-up's team of four; and Linh, at the end, as the person.

## Script

### 1 · Kept, every dry season · 0:00–0:50

**Narration.** Around 256 BC, in what is now Sichuan, the governor Li Bing split the Min River in two, without a dam, to water the Chengdu plain. Its shape sends most of the river's gravel down the outer channel. And every dry season, the inner channel is closed off and dug out, down to a mark buried in its bed. Stone horses, it's said, at first, and later iron bars. Its rule is six characters long: dig the riverbed deep, keep the weir low. More than two thousand years later, it still waters the plain. It wasn't cleaned out once and left. It's kept, every year.

**Picture.** "About 256 BC · Sichuan" in the corner. Mountains in layered washes; the Min River comes down from them, and at the head of a long, tree-lined levee it splits in two: a wide outer channel and a narrower inner one, which curves along a hill and through a cut in the rock to the plain, where it branches into canals between fields. Water moves along both channels. Small grains of gravel ride the current; most turn down the outer channel. The season turns: the land pales, the inner channel's water is held back by a line of wooden tripods weighted with long baskets of stones, and its bed lies bare. Small figures dig it out with wooden spades and carry the gravel away in baskets. A cut through the riverbed opens in a panel: the diggers' line goes down through the gravel and stops where a stone horse lies; then the horse gives way to iron bars, "the oldest cast in 1576", and the line stops at them: "dig until you see it, and no deeper". A strip of paper unrolls: "Dig the riverbed deep, keep the weir low", with a tag, "the rule, six characters long". Spring: the tripods come down, the water runs back into the inner channel and out to the fields, and the year in the corner becomes "today". Wordless breather: the river in spring. Then the title card, *Kept, not cleaned*.

**On screen.** about 256 BC · Sichuan · Min River · outer channel · inner channel · to the Chengdu plain · every dry season · stone horses, it's said · iron bars · the oldest cast in 1576 · dig until you see it, and no deeper · Dig the riverbed deep, keep the weir low · the rule, six characters long · today · Kept, not cleaned · Film 9 of 9

### 2 · The clean-up · 0:50–1:07

**Narration.** At the university, in 2024, a clean-up project merged two thousand duplicate records of people. It took a team of four, for six months, and it finished on time. For a while, the duplicates were gone.

**Picture.** The campus in daylight, "2024 · the university" in the corner. A board, *Duplicate clean-up · 2024*: pairs of small record cards in role colours slide together, two by two, and each pair becomes one white card; a counter runs up to "2,000 merged". The team of four stands before it: Mei, Sam, Ben and Rosa. A calendar strip, "Jun–Dec 2024", fills, and a badge settles on the board: "finished on time". A line chart begins at the side, *duplicates waiting*: it falls from 2,000 to nothing at the end of 2024.

**On screen.** 2024 · the university · Duplicate clean-up · 2,000 merged · a team of four · Jun–Dec 2024 · finished on time · duplicates waiting · 2,000 · 0

### 3 · Back, intake by intake · 1:07–1:32

**Narration.** A year later, there were eleven hundred new ones. Every intake made more. Graduates came back to study, and people applied through two routes, each giving them a new number. Linh's second number, in July 2025, was one of them. The clean-up fixed the records. It didn't change how they were made.

**Picture.** The chart takes the frame: the line rises again from zero, a step at each intake, *Feb 2025* (640) and *Jul 2025* (460), to "1,100 new" by the end of 2025. Beside each step, a bar of small record pairs. Two tags explain them as they're said: "back to study" and "two ways to apply", the second over two small application cards, *undergraduate* and *postgraduate*. Two teal cards, *S-17142* and *S-20436*, settle into July's bar, with a tag, "Linh, July 2025". The camera moves out to the two applications, each still stamping a new number, under a tag, "where records are made".

**On screen.** duplicates waiting · Feb 2025 · Jul 2025 · 640 · 460 · 1,100 new · back to study · two ways to apply · undergraduate · postgraduate · S-17142 · S-20436 · Linh, July 2025 · where records are made

### 4 · Stopped at the door · 1:32–1:57

**Narration.** In 2026, the application started searching before it creates a person. A clear match adds a role to someone already known. A likely one goes to Mei's queue. New duplicates fell under fifty an intake, and stayed there. Like the river's shape, the search keeps most of them out. Mei's queue digs out the rest.

**Picture.** The application, in amber, gains a step: "search first". Three ways lead out of it: "found: add a role" to a white figure, which takes a new band; "maybe: to Mei's queue", to a small stack of cases; "new: a new person". The chart comes back with 2026's intakes: *Feb 2026* (44) and *Jul 2026* (29), both under a dashed line, "limit: 50". A small picture of the river's split returns from chapter 1: "the search" is written by the outer channel, and "Mei's queue" by the inner, where the diggers work.

**On screen.** Application · search first · found: add a role · maybe: to Mei's queue · new: a new person · Feb 2026 · Jul 2026 · 44 · 29 · limit: 50 · the search · Mei's queue

### 5 · The steward's iron bars · 1:57–2:41

**Narration.** So keeping the person right isn't a project that ends. It's everyday work. Mei's office has its own iron bars: five measures, each with a limit. New duplicates per intake. How long the queue's oldest case has waited. Roles past their end date, like a tutor whose term contract ended, but who's still active. Values with no source. And requests for what the university holds about someone, answered on time. dbt writes the measures and tests them. Databricks runs them every night, keeps them, and shows them on a dashboard.

**Picture.** Mei's office, Mei edged in gold. A dashboard, pinned up like a sheet of paper, with five gauges, each lighting as it's named. Each gauge is a column with a level, and an iron bar lying across it at its limit, with what it's read from beneath: *new duplicates this intake* (29, limit 50, from the queue); *oldest case in the queue* (3 days, limit 10, from the queue); *roles past their end date* (0, limit 0, from the role table), with a tutor's chip, "term contract ended", ringed and then closed; *values with no source* (0, limit 0, from the tests); *requests answered on time* (14 of 14, from the request log). Each gauge ticks in green ink. Along the bottom, two small cards with the tools' logos: *dbt* "writes and tests the measures", *Databricks* "runs them nightly, keeps them, shows them". A wordless moment on the five gauges.

**On screen.** new duplicates this intake · oldest case in the queue · roles past their end date · values with no source · requests answered on time · limit · from the queue · from the role table · from the tests · from the request log · term contract ended · writes and tests the measures · runs them nightly, keeps them, shows them

### 6 · Past its limit · 2:41–3:02

**Narration.** One Monday, an alert: the oldest case had waited twelve days. It was waiting for HR to confirm a birth date, one digit apart. Mei rang HR, and the case was decided that morning, with its reason. The alert pointed at a case, not at a person to blame.

**Picture.** "Monday" in the corner. The oldest case's gauge rises past its iron bar, "12 days", and a red-ink mark lands beside it, "past its limit". An alert card slides in, *alert · 7:00*: "the queue's oldest case: 12 days · its limit: 10". The case comes forward: two records, *S-21388* and *E-5263*, with their birth dates, 3 June and 8 June, ringed, and a note, "waiting for HR". Mei takes out her phone; the note becomes "HR: 3 June, a typo", and the case is stamped "linked · reason kept". The gauge falls back to "2 days" and ticks. A tag: "a case, not a person to blame".

**On screen.** Monday · 12 days · past its limit · alert · the queue's oldest case · its limit: 10 · S-21388 · E-5263 · 3 June · 8 June · waiting for HR · HR: 3 June, a typo · linked · reason kept · 2 days · a case, not a person to blame

### 7 · Proposed, then decided · 3:02–3:27

**Narration.** Lists from outside change too. This year, the government's list of visa types added one. An agent drafted how it maps to the university's fee categories, with its evidence, as a change to the list. The list's owner, the admissions office, checked it and approved it. The agent proposes. The owner decides.

**Picture.** The government's list, its title on a wash of the public sector's green-blue: *visa types · the government's list*, with "student visa", "graduate visa", "visitor visa", and a new row, "graduate research visa", badged "new". A change card types in, badged "drafted by an agent": *Map a new visa type*, "graduate research visa → international fees", and under it its evidence, "the government's notice · closest value: student visa", and "for: the admissions office". Leila, edged in gold, reads it; her tick lands, "approved by the admissions office", and the row joins the university's own list. A tag settles: "the agent proposes · the owner decides".

**On screen.** visa types · the government's list · student visa · graduate visa · visitor visa · graduate research visa · new · drafted by an agent · Map a new visa type · international fees · the government's notice · closest value: student visa · for: the admissions office · approved by the admissions office · the agent proposes · the owner decides

### 8 · On the scorecard · 3:27–3:42

**Narration.** Yusuf, who leads data governance, reads the same measures on his scorecard, beside every other domain's. Owners, limits, and a way to change them: the person now has all three.

**Picture.** Yusuf's office, Yusuf edged in gold, at a sheet: *governance scorecard*. A row for each domain, with its owner and how many of its measures are within their limits: *course · academic registrar*, *fees · finance office*, *research · research office*, and a new row, *person · Mei's office · 5 of 5*. Three tags land on the person's row as they're named: "an owner", "a limit", "a way to change it".

**On screen.** governance scorecard · domain · owner · within limits · course · academic registrar · fees · finance office · research · research office · person · Mei's office · 5 of 5 · an owner · a limit · a way to change it

### 9 · Elsewhere · 3:42–3:56

**Narration.** Every industry knows this picture. A bank cleans up its customer records every three years, and the duplicates come back every time. One check at entry ends the cycle.

**Picture.** A line in banking blue, *a bank's duplicate customers*: it climbs, drops at a tag, "clean-up", climbs again, drops, three times, three years apart; then a tag, "one check at entry", and the line stays down. Two more chips arrive above it as the same picture: *a hospital's patients* (red) and *a shop's suppliers* (orange).

**On screen.** a bank's duplicate customers · clean-up · every three years · one check at entry · a hospital's patients · a shop's suppliers

### 10 · Kept · 3:56–4:26

**Narration.** February 2027. Linh starts her PhD: a new role, on the person she already is. That intake made thirty-eight new duplicates. She isn't one of them. And at Dujiangyan, every spring, when the repairs are done, the water is let back in. Clean it once, and it decays. Keep it, and it lasts.

**Picture.** "February 2027 · the university" in the corner. Linh as the person: her white figure, with her bands, tutor and alumna, and a new teal band with its chip, "Student · PhD, from Feb 2027". The intake's gauge beside her: "new duplicates, Feb 2027: 38", under its iron bar, ticked, and a tag, "Linh: not one of them". Then Dujiangyan again, "every spring" in the corner: the tripods come down, and the water runs back into the inner channel, out to the canals and the fields. The last line settles from the top of the frame onto the end card. Wordless breather. End card.

**On screen.** February 2027 · the university · Student · PhD, from Feb 2027 · new duplicates, Feb 2027 · 38 · Linh: not one of them · every spring · Dujiangyan · Clean it once, and it decays. Keep it, and it lasts.

## Pause and think

Four questions, one at the end of each of four chapters, as the site shows them (`site/assets/kept-not-cleaned/think.en.js` and `think.es.js`):

1. *After chapter 3, Back, intake by intake.* A clean-up merged 2,000 duplicates, and a year later there were 1,100 new ones. Why? (Nothing changed where records are made: every intake still gave returning graduates, and people applying through two routes, a new number.) It ends by asking viewers how long a folder or list they once tidied stayed tidy.
2. *After chapter 4, Stopped at the door.* Why does the search at the application last, when the clean-up didn't? (It stops a duplicate before it's made, every time someone applies, instead of finding it later.)
3. *After chapter 5, The steward's iron bars.* Why does each measure have a limit? (So it says when to act: past its limit, someone looks, before a backlog builds.) It ends by asking viewers which measure they'd want to see first.
4. *After chapter 7, Proposed, then decided.* An agent drafted the new visa type's mapping. Why does the admissions office approve it, not the agent? (The owner answers for the list: the agent proposes with its evidence, the owner decides, and the reason is kept.)

## Labs (candidates)

- **Clean-up or prevention?** Run two years of intakes, with a clean-up, a check at entry, or both, and watch the line.
- **Read the steward's measures.** Five gauges on a Monday morning: which one needs someone today, and who?
- **Set the limit with the owner.** For each measure, pick a limit; see how often it would alert, and what it would miss.
- **Who decides?** Six proposed changes from an agent: approve, correct or send back, each with its evidence.

## Where it comes from in the project

| On screen | In the example project |
|---|---|
| Linh, `S-20436` | `data/student_system/learners.csv` |
| Her first-degree record, S-17142 | New with *One person, many roles*: a graduate's record the series adds to the student system's data |
| Mei's decisions, each with a reason | `seeds/reference/student/learner_identity_decisions.csv`, grown into a person queue in *Who is it?* |
| A limit agreed with its owner: warn above it, stop the build above another | The project's tests already do this: `customer_bk` in `models/staging/short_courses/_short_courses__models.yml`, lines 46–57 (`warn_if`, `error_if`, decision DEC-SC-01) |
| The role table, and a tutor's term contract with an end date | New with *Roles come and go*: a dated role table |
| Every value with its source | New with *Which value wins*: survivorship declared per field, each value labelled with its source |
| The university's lists, with an owner, and the visa types' mapping | New with *Lists everyone uses*: reference tables with owners and dates; the visa types list is new with this film |
| Requests answered from the person | New with *For this purpose only* |
| The search before create at the application | New with *One person, many systems* |
| The five measures, their limits, the dashboard and the alert | New with this film: a model of the steward's measures, read from the queue, the role table, the tests and the request log, with a test for each limit; a dashboard and an alert on the platform |
| The governance scorecard, with a row for the person | New: stewardship measures in the governance scorecard (the governance series' *Rules that run*) |
| The clean-up, the intakes' numbers, the case S-21388 and E-5263, the visa type, the bank | Invented for the film, kept plausible |

## Rigour to check before recording

Sources checked on 17 October 2026.

- **Dujiangyan's date and builder.** Built from about 256 BC under the Qin, by Li Bing, governor of Shu, and still in use; World Heritage since 2000 ([Wikipedia, Dujiangyan](https://en.wikipedia.org/wiki/Dujiangyan); Sichuan Museum, [China's 2000-year-old irrigation system that's still in use today](https://artsandculture.google.com/story/8AVRiJGumXdeJg), "built late in the Qin Zhaowang (~256 BC - ~251 BC)"). Li Bing's appointment as governor is dated earlier (277 or 272 BC in the classical sources), so "the governor Li Bing" holds in 256 BC. "Without a dam": the system divides the river rather than damming it.
- **Its shape keeps most of the gravel out.** The levee's head splits the river into a deep, narrow inner channel and a wide, shallow outer one, which carries most of the silt and gravel; the Flying Sand spillway sends more back out (Wikipedia, above). A hydraulic study (*Hydraulic Principles of the 2,268-Year-Old Dujiangyan Project in China*) reports about 26 to 29% of the river's bed load entering the inner channel. The film says "most", without a figure, since popular sources give 80% and studies differ.
- **The yearly repair.** "Dujiangyan's annual repairs included systematic maintenance in the dry season – every winter and spring" (Sichuan Museum, above). It still happens: the irrigation district's yearly repair began on 14 November in 2022, with the rivers cut off in turns (found 17 October 2026 in Chinese reporting); the water-releasing ceremony opened the spring irrigation on 3 April 2026 ([Xinhua](https://www.news.cn/local/20260403/fe15843bb1af408e8c16019efd3b9ee6/c.html)). Wooden tripods (*macha*) and bamboo baskets of stones held the river back for the repairs, and were pulled away in spring ([National Geographic](https://www.nationalgeographic.com/travel/article/water-releasing-festival-china-travel-spd)); the film shows them as the old way, and doesn't claim they're used today.
- **The mark in the riverbed.** "Stone horses were buried in the middle of the inner stream to mark the proper depth of the riverbed … later replaced by iron rods or *wotie*" ([ADB](https://rksi.adb.org/publications/applying-ancient-wisdom-to-disaster-risk-mitigation/)). Chinese sources call the stone horses a tradition (传说), recorded in a Song-dynasty text, and list four iron bars at Fengqiwo in the inner channel, cast in 1576, 1864, 1927 and 1994; they're about 4 m long, their tops about 1.8 m under the riverbed, and the dredging stops when they show, because digging deeper would unsettle the bed ([卧铁, Baidu Baike](https://baike.baidu.com/item/%E5%8D%A7%E9%93%81/9173742); [Tencent News, 14 February 2025](https://news.qq.com/rain/a/20250214A07VP000), which dates the third bar to 1925–29). Hence "it's said", and on screen only the oldest bar's date, which the sources agree on.
- **The rule.** 深淘滩，低作堰, six characters, usually given in English as "dig the channel deep, keep the weir low" (the Sichuan Museum's literal "deep clean beach, low weir"); the film says "riverbed" for 滩. Only the English is on screen.
- **Telling it from its own sources.** The story is checked against Chinese sources (the Dujiangyan water authority's staff, as reported; Baidu Baike; Xinhua) as well as English ones. Painted in the series' own watercolour; no Chinese painting style, script or music is borrowed.
- **A clean-up decays.** Duplicate records keep being made while the way records are made is unchanged; a one-off clean-up removes the stock, not the flow. This is common practice in master data management, said without citing one standard; DAMA-DMBOK (named in film 1) treats master data management as an ongoing programme, not a project.
- **Duplicates per intake.** Returning students come in through more than one door, such as Galway's undergraduate and postgraduate application systems, each giving a new number ([University of Galway, *Merging numbers*](https://www.ugal.ie/media/registrationoffice/files/Merging-numbers.pdf)); Glasgow's registry lists graduates applying again among the causes ([duplicate student records](https://www.gla.ac.uk/myglasgow/registry/staff/studentrecords/duplicatestudentrecords/)). Neither is named in the film. The numbers (2,000 merged; 640 and 460 in 2025; 44, 29 and 38 after the search) are invented, for a university of about 30,000 students.
- **The steward's measures** are ones data stewards run: duplicates created, the age of the oldest open case against a service level, records past their end date, values without lineage or a source, and access requests answered within their deadline. Each limit is agreed with its owner, as the example project's tests already record theirs (see above). No jurisdiction's deadline for requests is named.
- **dbt and Databricks, checked on the day.** dbt tests take `warn_if` and `error_if` thresholds (the project uses them). On Databricks: Lakeflow Jobs run the build nightly; Unity Catalog keeps the measures' table; AI/BI dashboards show them; Databricks SQL alerts, generally available since 14 May 2026, check a query on a schedule and notify, and an alert task in Lakeflow Jobs has been generally available since 29 June 2026 ([Databricks release notes, May and June 2026](https://docs.databricks.com/aws/en/release-notes/product/2026/may)). Nothing shown is in preview.
- **Agents propose, people decide.** An agent drafting a reference-data mapping as a change for its owner's review matches the series' rule from film 8 (rules act, AI suggests, people decide) and the governance series' change control. The visa type, its mapping and the government's list are invented; no country's visas are named.
- **The scorecard** follows the governance series' *Rules that run*: a scorecard read from the runs, by domain, each with an owner.
- **The bank.** Generic and plausible: no real organisation; "every three years" is an example.
- **Colour.** The gauges say "within its limit" or "past its limit" in words, beside a tick or a cross, so nothing depends on colour; the role colours keep their meaning.

## Built

Built on 17 October 2026, from this script, in watercolour.

- **Captions.** Spanish captions in Latin American Spanish, about as long as each English line.
- **Sound.** A new palette (in `source/tools/score.py`).

## Next

1. The author watches the film, and approves it or asks for corrections.
2. The project's additions it needs: the steward's measures as a model with tests, a dashboard and an alert, and the person's row in the governance scorecard.
3. Labs, once the series has more films: the candidates above.
