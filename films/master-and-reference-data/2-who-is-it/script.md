# Master and reference data · Who is it?: script

*The script of Who is it?, the film after One person, many roles in the series on master and reference data, working title The same one, everywhere: about 5½ minutes, in eleven chapters, in English. Written and built on 17 and 18 October 2026, from the approved plan for the series' other eight films ([proposal](../proposal.md#2-who-is-it)); the times below are the built film's, and [Built](#built) lists what changed on the way. The title card follows chapter 1; the end card follows chapter 11. Made to read on a phone, like the other films: on-screen text at least 28 px in the frame, nothing under the captions, and the camera moves in on whatever the narration is about.*

## The promise

Every line passes two tests: anyone who has ever been sent someone else's letter, or two copies of their own, can follow it, and an experienced master data manager finds nothing wrong in it. The film answers the series' second question, who is it? First it tells two words apart: master data, the things the business is about, which have to be matched across systems, and reference data, the short lists that sort them, which are picked from. Then it says what matching builds: a master record, often called a golden record, with an ID of its own, the best value for each detail labelled with its source, and links to every record it came from, each kept as it arrived. Then it shows how a match is decided: a check that compares only records that share something, weights that add up to a score, two lines that make three bands, and a steward who decides the pairs in the middle, writes down why, and whose "not the same" the matcher obeys. A false merge costs more than a missed match, so every link can be undone. **Decide a match once, with a reason, and keep it.**

## The story in one paragraph

In 1548, Martin Guerre left his village, Artigat, in the south of France, and his wife, Bertrande. In 1556 a man came back as Martin: he knew the house, the family and their stories, and they took him in. His uncle came to doubt him. At Rieux, about 150 witnesses couldn't agree, and on appeal in Toulouse, as the judges leaned his way, a man with a wooden leg walked in: the real Martin Guerre. The other man was Arnaud du Tilh. Two people, taken for one, because so much matched. Today, at the university, master data and reference data are told apart, and a master record is drawn: Linh's, P-10482, with her preferred name, her student email and her work email, each labelled with its source, and links to her five records. This term, for the first time, the registry runs a duplicate check across the university's systems. Fifty thousand records would make over a billion pairs, so it compares only records that share an email, a number, or a birth year and a family name that sounds alike, and proposes pairs to Mei Tanaka's office, the steward of the person. The first pair, Linh's two student numbers, scores 93, over the line where a pair links on its own; in this first term Mei's office checks the automatic links too, sees on Linh's application that she studied here before, and links them (D-005), and the registry merges the numbers in its own system. The second, her new student number and HR's record of her as a tutor, scores 74, weight by weight: given name +3.2, a common family name +2, birth dates one digit apart +2.4, a different email −0.4. An AI helper drafts a note for Mei with the names hidden; she asks HR, they check her contract, and it's a typo, so she links them (D-006). Which birth date to trust is the next film's question. The third pair, a learning platform account carrying Aisha Karimi's student number, is Aisha Rahman's account: the number was typed in by mistake. Linking them would show one student the other's results, so Mei keeps them apart (D-003), and the matcher never proposes the pair again. Linh's five records now point to one person; nothing was destroyed, and any link can be undone. No rule says two student numbers are never one person. Hospitals match people too, and keep each identifier with the system that issued it, because they sometimes have to undo a merge. In dbt, a query proposes the pairs, the decisions table becomes the person's queue, and a test fails when a pair waits more than a week; in Databricks, the master records and their links keep who decided and why.

## What each object stands for

| Object | Stands for |
|---|---|
| Artigat in watercolour, and a road out of the village and back | Martin's world, 1548 to 1556 |
| A parchment card, "what the village knew", ticked line by line | What matched: everything the village knew of Martin, the man knew |
| The court's record, "about 150 witnesses", in three tallies | People asked the same question, and not agreeing |
| The real Martin Guerre, walking in on a wooden leg | The fact that shows a match was false |
| "Martin Guerre" struck through in red, "Arnaud du Tilh" written in its place | Two people, taken for one |
| Two shelves: big, varied things, and small bright lists | Master data and reference data, side by side |
| A faculty card that grows an owner and a history | A list on the line, becoming master data |
| A white sheet, "master record", a gold "golden record" badge, P-10482 stamped on | The master record and its ID of its own |
| A small coloured label beside each value | Where the value came from |
| Five records in their roles' colours, linked to the sheet, "each kept as it arrived" | Links to the source records, which stay as they arrived |
| Columns of coloured dots, one per system | The university's records |
| A grey web joining every dot to every other | Comparing everyone with everyone: over a billion pairs |
| Three key chips, and a few lines between dots that share a key | Blocking: compare only records that share something |
| The person queue, three numbered pairs, more below | Pairs waiting for the steward |
| A gauge in three bands, with lines at 60 and 90 | Two thresholds, three outcomes: keep apart, a person decides, link |
| A sheet weighing two records row by row, each row's weight at the right | How a score is made: each comparison adds weight or takes it away |
| A card with a spark, the names as grey bars | The AI helper's draft: it suggests |
| A gold decision card: its number, verdict, pair, reason, who and when | A steward's decision, kept |
| A padlock, "never proposed again" | A "not the same" that binds the matcher |
| A balance: a heavy weight on "a false merge", a feather on "a missed match" | Why a false merge costs more |
| A gold link that comes off, dashed, and is made again | Undo, link by link |
| A faint Martin walking in | Any fact that could show a link was wrong |
| Two wristbands, both "Jo Lee", and a test result that follows the merge | A hospital's false merge, and its undoing |
| dbt and Databricks cards, with code and rows | The enabler: the query, the queue, the test and the tables |

## The look

Watercolour, the series' look (`../shared/src/wash.js`), as in *One person, many roles*.

- **The past is the same watercolour,** with the year and place in the corner: 1548 · Artigat, 1556 · Artigat, 1560 · Rieux, 1560 · Toulouse. Artigat is a village of stone and timber houses below the hills, with a road running out of it; the court is stone and tile, with three judges in dark robes and caps at a high bench. The people of Artigat are dressed for the 1550s: wool and linen, hose, a coif, a cap; the real Martin walks with a wooden leg and a crutch. The village's knowledge and the court's record are parchment and ink, as in the other films.
- **Colour means something,** as in *One person, many roles*: student teal, applicant amber, tutor violet, researcher coral, alumna green; the learning platform's records a cool blue, as a system, not a role. The master record is white paper. Gold is the steward's: the band where a person decides, each decision card, and each decision's link. A cross and a negative weight are red ink; a tick and a positive weight are green ink. Every colour comes with a label.
- **Today** is the campus in daylight, Mei's office, and plain paper with a little sky and land for the chapters that explain.
- **People** are drawn in pencil, with paint that runs a little past the line. Linh wears her roles' bands; Mei is edged in gold, the business side. The two Aishas are students, drawn with no side colour. The hospital's two patients are white figures, like Linh as the person.
- **The industry beat** keeps the series' colours: the hospital in health red. No real hospital or university is named or drawn.
- **Vietnamese letters.** Linh's legal name, NGUYỄN Thị Linh, is drawn in the series' fonts, with their Vietnamese subsets added to this film (`source/src/fonts.js`).

## Script

### 1 · Taken for one · 0:00–0:40

**Narration.** In 1548, Martin Guerre left his village in the south of France, and his wife, Bertrande. Eight years later, a man came back as Martin. He knew the house, the family, their stories, and they took him in. His uncle came to doubt him. In court, a hundred and fifty witnesses couldn't agree. On appeal, as the judges leaned his way, a man with a wooden leg walked in: the real Martin Guerre. Two people, taken for one, because so much matched.

**Picture.** Artigat in watercolour daylight, "1548 · Artigat" in the corner. Martin and Bertrande stand at their door, his uncle by the house; Martin turns and walks out along the road, past the edge of the shot. "1556 · Artigat": a man comes back along the same road, dressed as Martin was. A parchment card, "Martin Guerre · what the village knew", ticks the house, the family and their stories as the voice names them, and a green line joins the village to him. His uncle comes to doubt him: an inked question mark. "1560 · Rieux": the court, three judges at their bench, and its record, "about 150 witnesses", filling three tallies: Martin, not Martin, can't say. "1560 · Toulouse": the judges lean towards the man, until the real Martin Guerre walks in from the right on a wooden leg. On "so much matched", a veil of paper quiets the court; the village's card comes back between the two men, every line ticked, joined to both. The first man's name tag, "Martin Guerre", is struck through in red ink, and "Arnaud du Tilh" is written above it. A wordless breath on the two men side by side, then the title card.

**On screen.** 1548 · Artigat · Martin Guerre · Bertrande · 1556 · Artigat · what the village knew · the house · the family · their stories · his uncle · ? · 1560 · Rieux · about 150 witnesses · Martin · not Martin · can't say · 1560 · Toulouse · the real Martin Guerre · Arnaud du Tilh · Who is it? · the golden record, and a match decided once · Film 2 of 9 · master and reference data

### 2 · Two words people confuse · 0:40–1:21

**Narration.** First, two words. Master data is the things the business is about: Linh, an award, a supplier, a meter. Many rows, always growing, and matched across systems. Reference data is the short lists that sort them: countries, role types, statuses. Few rows, rarely changing, often from outside. Would you ever ask, "is this the same one as that?" Then it's master data. If you only pick a value from a list, it's reference data. And a list that gets owners and a life of its own, like faculties, becomes master data.

**Picture.** Plain paper. Two headings over two shelves: "master data · the things the business is about" and "reference data · the short lists that sort them". On the master shelf, as each is named: Linh, a white figure with her four role bands; an award's scroll; a supplier's crate; a meter. Tags settle below it: many rows, always growing, matched across systems. On the reference shelf, three bright short lists: country (Australia, Vietnam, France), role type (student, tutor, researcher), status (active, on leave, graduated), an "ISO 3166" badge on the countries; tags: few rows, rarely changing, often from outside. The shelves step back for the test, typed on a sheet: "is this the same one as that?", an arrow to "master data"; "only pick a value from a list", an arrow to "reference data". Then a faculty card (Health · Science · Arts) grows an owner, "the dean's office", and a history, "since 1998 · renamed 2021", earns a "master data" badge, and moves over to the master side.

**On screen.** master data · the things the business is about · reference data · the short lists that sort them · Linh · an award · a supplier · a meter · many rows · always growing · matched across systems · country · Australia · Vietnam · France · role type · student · tutor · researcher · status · active · on leave · graduated · ISO 3166 · few rows · rarely changing · often from outside · "is this the same one as that?" · only pick a value from a list · faculty · Health · Science · Arts · owner · the dean's office · since 1998 · renamed 2021

### 3 · A golden record · 1:21–1:50

**Narration.** What matching builds is a master record, often called a golden record. An ID of its own, which never changes and is never reused. For each detail, the best value, labelled with where it came from. And links to every record it came from, each kept as it arrived. So it can be explained, value by value, and undone, link by link.

**Picture.** A white sheet, "master record", with Linh's white figure on it; a gold badge, "golden record", on "golden". The camera moves in as an ID is stamped on, P-10482, with "never changes" and "never reused". Three details wait as dashed places until their best values come: preferred name, Linh, labelled "she chose it"; student email, linh.nguyen@student.uni.example, labelled "student system" in teal; work email, linh.nguyen@uni.example, labelled "HR" in violet. Out again: her five records arrive around the sheet, each in its role's colour, and link to it; "each kept as it arrived". On "value by value", the work email is ringed and a violet line runs to HR's record; on "link by link", the alumni office's link comes off, dashed, and is made again.

**On screen.** master record · golden record · P-10482 · never changes · never reused · preferred name · Linh · she chose it · student email · linh.nguyen@student.uni.example · student system · work email · linh.nguyen@uni.example · HR · Student · S-17142 · bachelor's · 2019–22 · S-20436 · master's · from 2025 · Alumna · graduated 2022 · Casual tutor · E-4417 · HR · since 2023 · Researcher · R-3082 · holds E-4417 · each kept as it arrived

### 4 · The duplicate check · 1:50–2:22

**Narration.** Linh came back to study under a new student number. This term, for the first time, the registry runs a duplicate check across the university's systems. Fifty thousand records would make over a billion pairs. So it compares only records that share something: an email, a number, or a birth year and a family name that sounds alike. It proposes pairs for Mei's office, the steward of the person. Here are three.

**Picture.** The campus, "this term · the university". Linh, as *One person, many roles* left her: her old record and her new, with a pencil line between them crossed in red. A veil of paper falls, and the university's systems appear as columns of coloured dots: student system, HR, research office, alumni office, learning platform, under "duplicate check". On "over a billion pairs", a grey web joins every dot to every other: "50,000 records", "1,249,975,000 pairs". It clears, and a few lines are drawn, only between dots that share a key, as each key's chip arrives: same email, same number, same birth year, family name sounds alike. The systems step back for the person queue, "pairs to decide": three rows, numbered as "Here are three" is said (S-17142 · S-20436, S-20436 · E-4417, u-88231 · S-20417), with more, unread, below. Mei arrives at the right: "Mei Tanaka · steward of the person".

**On screen.** this term · the university · Student · S-17142 · bachelor's · 2019–22 · S-20436 · master's · from 2025 · duplicate check · student system · HR · research office · alumni office · learning platform · 50,000 records · 1,249,975,000 pairs · same email · same number · same birth year, family name sounds alike · the person queue · pairs to decide · 1 · 2 · 3 · S-17142 · S-20436 · E-4417 · u-88231 · S-20417 · Mei Tanaka · steward of the person

### 5 · Back to study · 2:22–2:55

**Narration.** The first pair is her two student numbers. Same name, same birth date. Out of a hundred, it scores 93: over the line where a pair links on its own. But in this first term, Mei's office checks the automatic links too, to test the rules. And Linh's application says she studied here before. So Mei links them, and writes down why. The registry merges the two numbers in its own system.

**Picture.** Mei's office, "this term · Mei's office". The camera moves in on two student cards: S-17142, "Nguyen Thi Linh · 2001-03-14 · linh.nguyen2001@mail.example", typed in 2019 without accents, and S-20436, "NGUYỄN Thị Linh · 2001-03-14 · linh.nguyen@mail.example", checked against her passport in 2025. The name and the birth date are ticked. Out a little for the score: a gauge in three bands, keep apart, a person decides, link, with lines at 60 and 90; the needle climbs to 93, and the link band is ringed. A gold tag: "this first term: automatic links checked too". Her application arrives, "Application · S-20436 · master's · health informatics · studied here before? · yes · bachelor's, 2019–22", and the answer is ringed. Mei turns to explain; a gold link joins the two cards, "D-005", and her decision is typed in: "same person · S-17142 = S-20436 · her application: studied here 2019–22 · Mei Tanaka · 8 Oct 2026". Then the registry's merge: the two cards slide into one stack, the old number still showing above the new: "merged in the student system".

**On screen.** this term · Mei's office · Student · S-17142 · Nguyen Thi Linh · 2001-03-14 · linh.nguyen2001@mail.example · S-20436 · NGUYỄN Thị Linh · linh.nguyen@mail.example · keep apart · a person decides · link · 60 · 90 · 93 · this first term: automatic links checked too · Application · master's · health informatics · studied here before? · yes · bachelor's, 2019–22 · D-005 · same person · S-17142 = S-20436 · her application: studied here 2019–22 · Mei Tanaka · 8 Oct 2026 · merged in the student system

### 6 · One digit apart · 2:55–3:32

**Narration.** The second pair is harder: her new student number, and HR's record of her as a tutor. Each thing compared adds weight, or takes it away. Given name, the same: plus 3.2. Family name, the same, but common: plus 2. Birth date, one digit apart, maybe a typo: plus 2.4. Email, different: minus 0.4. Together, 74: between the lines, so a person decides. If the birth dates agreed, it would score 93, like the first pair.

**Picture.** A sheet weighing two records, "student · S-20436" in teal and "HR · E-4417" in violet, with a "weight" column at the right. Each row lights in gold as the voice reaches it, and its weight is written in as it's said: given name, Linh and Linh, "the same", +3.2; family name, Nguyễn and Nguyen, "the same, but common", +2.0; birth date, 2001-03-14 and 2001-05-14, "one digit apart", +2.4; email, linh.nguyen@mail.example and linh.nguyen@uni.example, "different", −0.4 in red. Below, the gauge's needle moves with each weight as it's added, from where any two records start, and settles at 74; the middle band, "a person decides", is ringed. That moment is the film's poster. Then the flip: HR's date changes to 2001-03-14, dashed because it's only supposed, "if they agreed", its weight +4.6, and the needle climbs to 93; the link band is ringed.

**On screen.** student · S-20436 · HR · E-4417 · weight · given name · Linh · the same · +3.2 · family name · Nguyễn · Nguyen · the same, but common · +2.0 · birth date · 2001-03-14 · 2001-05-14 · one digit apart · +2.4 · email · linh.nguyen@mail.example · linh.nguyen@uni.example · different · −0.4 · keep apart · a person decides · link · 60 · 90 · 74 · if they agreed · +4.6 · 93

### 7 · It suggests, Mei decides · 3:32–3:57

**Narration.** An AI helper drafts a note for Mei, with the names hidden: birth dates one digit apart, and the HR email on the university's domain. It suggests; Mei decides. She asks HR, and they check her contract: a typo. She links them, with that reason. Which birth date to trust is the next film's question.

**Picture.** Mei's office. The AI helper's card, marked with a small spark, "AI helper · a draft for Mei", types itself line by line: "pair 2 · names hidden", the names shown only as grey bars, "· birth dates one digit apart", "· HR email on the university's domain", "suggestion: ask HR to check"; a tag, "it suggests". The card rises out of the way, and a gold tag, "Mei decides", settles by Mei as she turns to explain. HR's card, "Casual tutor · E-4417 · Linh Nguyen · 2001-05-14", and her contract, with "born 14 March 2001" in a clerk's hand; HR's date is ringed in red: "typo". Mei's decision is typed in: "D-006 · same person · S-20436 = E-4417 · HR checked her contract: birth date typed wrong · Mei Tanaka · 9 Oct 2026". Then both dates side by side, "2001-03-14 · student system" and "2001-05-14 · HR", an inked question mark, and "the next film: Which value wins".

**On screen.** this term · Mei's office · AI helper · a draft for Mei · pair 2 · names hidden · and · birth dates one digit apart · HR email on the university's domain · suggestion: ask HR to check · it suggests · Mei decides · Casual tutor · E-4417 · Linh Nguyen · 2001-05-14 · contract · born 14 March 2001 · typo · D-006 · same person · S-20436 = E-4417 · HR checked her contract: · birth date typed wrong · Mei Tanaka · 9 Oct 2026 · 2001-03-14 · student system · 2001-05-14 · HR · ? · the next film: Which value wins

### 8 · Two Aishas · 3:57–4:26

**Narration.** The third pair looks easy: a learning platform account with Aisha Karimi's student number. But the account is Aisha Rahman's, and the number was typed in by mistake. Link them, and one student sees the other's results. Two people, taken for one. A false merge costs more than a missed match. So Mei keeps them apart, and her "not the same" binds the matcher.

**Picture.** Plain paper. A learning platform card, u-88231, and a student card, S-20417: the given name, Aisha, and the student number, S-20417, are the same on both, and ticked. Aisha Karimi arrives under the student card, Aisha Rahman under the platform's; the family names fill in, Rahman and Karimi, and a red cross marks them. The number on the platform's card is ringed in red: "typed in by mistake". A gold tag: "scores 71: a person decides". On "Link them", a dashed line joins the cards; Aisha Karimi's result, "Graduate Certificate, Data Analytics", slides over to Aisha Rahman's side and is crossed in red, and Aisha Rahman looks concerned. A low pulse runs under it, the film's only one. Everything steps back for a balance: a heavy weight on "a false merge" sinks below a feather on "a missed match". Then Mei's decision is typed in, "D-003 · not the same · u-88231 ≠ S-20417 · Aisha Rahman's account carries Aisha Karimi's number, typed by mistake · Mei Tanaka · 7 Oct 2026", a padlock settles beside it, and "never proposed again".

**On screen.** Learning platform · u-88231 · given name · Aisha · student no. · S-20417 · family name · Rahman · Student · Karimi · typed in by mistake · scores 71: a person decides · result · Graduate Certificate, Data Analytics · a false merge · a missed match · D-003 · not the same · u-88231 ≠ S-20417 · Aisha Rahman's account carries · Aisha Karimi's number, typed by mistake · Mei Tanaka · 7 Oct 2026 · never proposed again

*The two Aishas, `u-88231`, `S-20417` and decision `D-003` (Mei Tanaka, 7 October 2026) are the example project's own data; the score is the film's.*

### 9 · Link, don't destroy · 4:26–4:49

**Narration.** Two decisions, and Linh's five records point to one person. Nothing was destroyed: each record stays as it arrived. So if a real Martin ever walks in, any link can be undone. And no rule says two student numbers are never one person. A student who comes back has two.

**Picture.** Linh, a white figure with her four role bands. Her five records arrive around her: S-17142, S-20436, E-4417, the alumna's S-17142 and the researcher's R-3082. The two decisions join them in gold, D-005 and D-006; each record's link runs to her band for its role, and "P-10482" settles above her. Pencil lines show the alumni office's record holding S-17142 and the research office's holding E-4417. "each kept as it arrived". On "a real Martin", a faint Martin walks in from the right, drawn faint because he's only supposed; D-006 comes off, dashed, and HR's and the research office's records move away from her, "undone"; then the links are made again, and he fades. A card, "two student numbers are never one person", is crossed in red; "a student who comes back has two", and both student numbers are ringed. A wordless breath on the five records and one person.

**On screen.** Student · S-17142 · bachelor's · 2019–22 · S-20436 · master's · from 2025 · Casual tutor · E-4417 · HR · since 2023 · Alumna · graduated 2022 · Researcher · R-3082 · holds E-4417 · D-005 · D-006 · holds · P-10482 · each kept as it arrived · undone · two student numbers are never one person · a student who comes back has two

### 10 · Elsewhere · 4:49–5:06

**Narration.** Hospitals match people too. Merge two patients by mistake, and a test result follows the wrong one. So they keep each identifier with the system that issued it, and undoing a merge is part of the job.

**Picture.** A card, "a hospital", under a band of health red. Two patients, both called Jo Lee, white figures with wristbands: MRN 448120 and MRN 448210. The bands slide together, merged by mistake, and a test result for the second, "test result · Jo Lee", follows the merge to the wrong one and is crossed in red. Each number is tagged with the system that issued it, "448120 · admissions" and "448210 · emergency"; the bands come apart, the result goes back, and is ticked. "undoing a merge: part of the job".

**On screen.** a hospital · Jo Lee · MRN 448120 · MRN 448210 · test result · 448120 · admissions · 448210 · emergency · undoing a merge: part of the job

### 11 · Decided once · 5:06–5:39

**Narration.** On the platform, in dbt, a query proposes the pairs without comparing everyone, and the decisions table becomes the person's queue. A test fails when a pair waits more than a week: the queue has an owner, and a limit. In Databricks, the master records and their links, each with who decided and why. Decide a match once, with a reason, and keep it.

**Picture.** Four cards, each lit while it's told, the others stepping back. dbt, `int_person_pairs.sql`: "-- pairs that share a key, not everyone", then a self-join on a block key; the comment is underlined in gold on "without comparing everyone". dbt, the person queue, `person_queue.sql`: each pair and its decision, D-005, D-006, D-003, and one pair "waiting 2 days". dbt, a test, `decided_within_a_week`: "S-20577 · S-19902 · 8 days · FAIL" in red, then "owner: Mei's office · limit: 7 days". Databricks, `person_link`: P-10482's links to S-17142, S-20436 and E-4417, each with its decision, and "D-006 · Mei Tanaka · contract: a typo". The cards step back for the last line, which settles onto the end card.

**On screen.** dbt · int_person_pairs.sql · -- pairs that share a key, not everyone · select a.record_key, b.record_key · from blocked_records a · join blocked_records b using (block_key) · where a.record_key < b.record_key · the person queue · person_queue.sql · -- each pair, and its decision · S-17142 · S-20436 D-005 · S-20436 · E-4417 D-006 · u-88231 · S-20417 D-003 · S-20512 · E-5120 waiting 2 days · a test · decided_within_a_week · -- fails when a pair waits over 7 days · S-20577 · S-19902 8 days FAIL · owner: Mei's office · limit: 7 days · person_link · -- master records and their links · P-10482 · S-17142 · D-005 · P-10482 · S-20436 · D-005 · P-10482 · E-4417 · D-006 · D-006 · Mei Tanaka · contract: a typo · Decide a match once, with a reason, and keep it. · Who is it? · Film 2 of 9

## Pause and think

Four questions, one at the end of each of four chapters, as the site shows them (`site/assets/who-is-it/think.en.js` and `think.es.js`):

1. *After chapter 2, Two words people confuse.* The university keeps a list of countries, and a list of partner universities, each with contacts, agreements and renewal dates. Which is master data? (The partner universities: each has its own details, an owner and a life of its own, and two systems could hold the same partner under two names. The countries come from a standard, and are only picked from.) It ends by asking viewers for a list at their own work that has grown owners and dates.
2. *After chapter 3, A golden record.* Linh's master record shows her work email, labelled "HR", and HR's own record stays as it arrived. Why both? (The label says where the value came from, so it can be explained and checked; the source record stays, so a link can be undone and HR's system keeps working.) It ends by asking what would be lost if the master record were only a copy of the best system's row.
3. *After chapter 6, One digit apart.* The same family name, Nguyen, adds 2; the same given name, Linh, adds 3.2. Why does the family name count for less? (Many people share a common family name, so two different people agree on it often by chance, and an agreement that's common says less. The check also compared only records whose family names sound alike.) It ends by asking viewers whether a match on their own name would say a lot, or a little.
4. *After chapter 8, Two Aishas.* The two Aishas' records still share a student number. Why should Mei's "not the same" stop the pair coming back? (What made them look alike is still there, so the pair would be proposed again every time, and someone could link it by mistake; her decision, with its reason, is kept, so nobody decides it twice.) It ends by asking which mistake would cost a viewer more at an organisation that holds their data: being merged with someone else, or being held twice.

## Labs (candidates)

For the series' labs and scenarios, which are made in their own thread:

- **Master or reference?** Sort fifteen things (a person, a country, a faculty, a supplier, a status, a meter, a currency...) onto the two shelves with the test, and see which list is on the line.
- **Build the golden record.** From five source records, choose the best value of three details, label each with its source, then undo one link and see what changes.
- **Same person?** Six pairs, each with its records side by side; decide each, with a reason, and see what each wrong call would cost.
- **Match, review or no match?** Move the two lines on the gauge and watch which pairs link, wait for a person or stay apart, and how many false merges and missed matches each setting makes.

## Where it comes from in the project

| On screen | In the example project |
|---|---|
| Linh, `S-20436` | `data/student_system/learners.csv` |
| The two Aishas, `S-20417`, `u-88231` | `data/student_system/learners.csv`, `data/learning_platform/users.csv` |
| D-003: "not the same", Mei Tanaka, 7 October 2026 | `seeds/reference/student/learner_identity_decisions.csv` (D-003) |
| A "not the same" that binds the matcher | `tests/rules/keys_decided_different_stay_apart.sql` (lines 1–2) |
| Records matched to a learner by identity rules and decisions | `models/intermediate/student/int_learner_key_candidates.sql`, `int_learner_keys_matched.sql` |
| D-005 and D-006 | New: two decisions the series adds to the decisions table |
| Her first-degree record, S-17142; HR's E-4417; the research office's R-3082; the alumni office | New, as in *One person, many roles*: the sources the series adds to the project |
| P-10482, `int_person_pairs.sql`, `person_queue.sql`, `decided_within_a_week`, `person_link` | New: the person's master record, the pairs query, the queue, its test and the links table the series adds; the names are as drawn |
| HR's birth date, 2001-05-14, and her contract's 14 March 2001 | New: kept in HR's record as it arrived, for *Which value wins* |
| linh.nguyen@mail.example, linh.nguyen2001@mail.example, linh.nguyen@student.uni.example, linh.nguyen@uni.example | Invented for the film; the project's `S-20436` carries the family's shared email (`D-001`), which stays out of the films |
| Jo Lee, MRN 448120 and 448210 | Invented for the film |

## Rigour to check before recording

Sources checked on 18 October 2026.

- **Martin Guerre.** Wikipedia, *Martin Guerre*: he left Artigat, "in the Pyrenees of southwestern France", in 1548; a man claiming to be him arrived in the summer of 1556; his paternal uncle, Pierre, became suspicious; at Rieux, in 1560, "more than 150 witnesses", many recognising him, many others naming Arnaud du Tilh, others refusing to take a side; on appeal to the Parlement of Toulouse the judges at first tended to believe the accused, until a man with a wooden leg arrived; the real Martin had lost the leg after the Spanish attack on Saint-Quentin in 1557. The publisher's summary of Natalie Zemon Davis, *The Return of Martin Guerre* (Harvard University Press, 1983), says Arnaud du Tilh "had almost persuaded the learned judges". The tallies on the court's record (35 Martin, 45 not Martin, 60 can't say) follow Davis's account of the depositions as secondary sources quote it (about thirty to forty said he was Martin; about sixty would say neither way; the rest named Arnaud du Tilh): check them against Davis before changing them. The contemporary account is the judge Jean de Coras's *Arrest Memorable* (Lyon, 1561, with later editions). Keep "the south of France", "a hundred and fifty", and the uncle unnamed.
- **Master and reference data.** The test, "is this the same one as that?", is the series' plain form of what makes master data master data: its records are matched and reconciled across systems, while reference data is picked from. Say it as a test, not a definition. Some lists sit on the line (the proposal names faculties and products).
- **Reference data from outside.** ISO 3166-1 assigns codes to 249 countries, territories and areas, maintained by the ISO 3166 Maintenance Agency (Wikipedia, *ISO 3166-1*; iso.org refused the request).
- **The golden record.** The definition is the series' own, from the proposal: an ID of its own, never changed or reused; the best value for each detail, labelled with its source; links to the source records, kept as they arrived. "Often called" because many teams and tools say golden record. The preferred name's source is the person: "she chose it".
- **Blocking.** Splink's documentation, *What are Blocking Rules?*: "Blocking is a technique for reducing the number of record pairs that are considered by a model"; the pairs grow with about the square of the records. 50,000 records make 50,000 × 49,999 / 2 = 1,249,975,000 pairs. The three keys are common practice: an exact identifier, an exact email, and a birth year with a phonetic code of the family name. Peter Christen, *Data Matching* (Springer, 2012), covers both.
- **Weights and bands.** Ivan Fellegi and Alan Sunter, "A Theory for Record Linkage", *Journal of the American Statistical Association* 64 (328), 1969: link, possible link (for clerical review) and non-link, with two thresholds. The film's weights are base-2 log likelihood ratios, from a starting point of −5.69 (odds of about 1 to 52 that two records in a block are one person), and the score is 100 / (1 + 2^−(W − 5.69)). Pair 2: 3.2 + 2.0 + 2.4 − 0.4 = 7.2, so 74; with the dates agreeing (+4.6 in place of +2.4), 9.4, so 93. Pair 1 is the same as pair 2 with its dates agreeing: 93. Pair 3 scores 71. The weights are invented, and ordered as real ones are: a birth date says most, a common family name less, and a different email little, as people have more than one. The family name's lower weight follows term-frequency adjustment (Splink, *Term frequency adjustments*: "the match weight for name should be adjusted downwards for Smiths"); inside a block of family names that sound alike, agreeing on one says less too. The lines at 60 and 90 are invented; real ones are set from the false merges and missed matches an organisation will accept, and how many pairs its stewards can review.
- **The AI helper.** It drafts and suggests, with personal values hidden; a person decides. Generic: no product is named or claimed (*A hub at work* names one).
- **A false merge costs more.** A wrong merge mixes two people's histories, and is harder to find and undo than a duplicate, which health records practice calls an overlay. Said as practice, not as a statistic.
- **Two student numbers can be one person.** The University of Glasgow's registry, *Duplicate Student Records* (gla.ac.uk/myglasgow/registry/staff/studentrecords/duplicatestudentrecords): the system may create a new number for a student who returns "to study a new course", and records are merged "to the GUID the student has graduated on/the correct GUID". The University of Galway's notice for past students returning (ugal.ie/media/registrationoffice/files/Merging-numbers.pdf): "It is the University of Galway's policy to retain your full student history under your first or old University ID Number". The film names neither: its university is invented.
- **Hospitals.** HL7 FHIR R5 (v5.0.0): an identifier's `system` "establishes the namespace for the value", and its `assigner` is the "organization that issued/manages the identifier"; `Patient/$merge` (trial use, maturity 0) marks the source record "replaced-by" and inactive, and notes that provenance "may support a potential un-merge operation" without defining one; master patient index products document an unmerge. The MRNs and the two systems (admissions, emergency) are invented; no real hospital.
- **dbt and Databricks.** Names checked on the day: dbt Labs completed its merger with Fivetran on 1 June 2026, and dbt keeps its name. Nothing shown is in preview. The logos are unaltered and credited in `NOTICE.md`; the query, the queue, the test and the table are the film's, not a product feature.
- **A fictional world.** The university, Linh, Mei, the two Aishas, Jo Lee and every number and email are invented. Martin Guerre is history, told from its sources.
- **Checked on the built film.** `tools/check.py`: every moment draws. `tools/legible.py --overlaps`: 322 texts, no issue, none under the captions. `tools/pace.py`: 5:38.8, 725 words, 128 words a minute (119 to 132 per chapter), voice 70% of the time (at most 74% in a chapter), no sentence with less than 0.5 s after it.

## Built

Built on 17 and 18 October 2026, from the plan, in watercolour. What changed on the way, for the series' *Decided* table:

- **The weights.** The plan's +3.4 (given name), +3.3 (family name), +0.9 (birth date) and −0.4 (email) became +3.2, +2.0, +2.4 and −0.4, so the numbers teach what real weights do: a common family name counts for less, and birth dates one digit apart still say a lot. The total is still 74, and the dates agreeing (+4.6) still make 93. The student number row (only one record has it, so 0) was dropped, so four rows read on a phone.
- **The first check, and the first term.** The plan's "every intake" became "this term, for the first time", which is why nothing caught Linh's two numbers before (*One person, many roles*). Since 93 is over the line where a pair links on its own, Mei's office checks the automatic links too, "in this first term, to test the rules"; so the plan's "linked by a steward, with a reason" holds for pair 1.
- **The test.** The plan's "every proposed pair is decided" became "a test fails when a pair waits more than a week", to show the plan's queue with an owner and a time limit.
- **HR's typo stays in HR's record.** Mei's decision links the records; it changes no value. Which birth date wins is *Which value wins*'s question, and the film ends on it.
- **Pair 3 shows its score,** 71, in the band where a person decides, from the same kind of weights.
- **The master record** shows three details (preferred name, student email, work email), and the preferred name's source is Linh: "she chose it".
- **Linh's emails.** linh.nguyen@mail.example on her new student record and linh.nguyen2001@mail.example on her first, in place of the project's shared family email, which stays out of the films (decided 17 October 2026). Her legal name has its accents on the 2025 record, NGUYỄN Thị Linh, as decided for *Which value wins*, and none on the 2019 one, Nguyen Thi Linh; the matcher compares them without accents.
- **Vietnamese letters.** The series' fonts have no Vietnamese subset, so this film carries their Vietnamese subsets from Google Fonts (same fonts, same SIL Open Font License) in `source/src/fonts.js`. On the site the page's own fonts already have them, so nothing is added there; where they are added, they take the weights of the page's faces, or the page's other letters lose Manrope (the first build did this, and the Spanish page ran wider than a 320 px phone).
- **Chapter 1.** The uncle is not named, and the other man's name, Arnaud du Tilh, is written on screen only. Footsteps follow each walk, and the real Martin's peg sounds with his wooden leg. The witnesses' record fills three tallies as "couldn't agree" is said.
- **Chapter 4** draws five systems, the fifth the learning platform, where the two Aishas' pair comes from.
- **Chapter 9.** The real Martin who might walk in is drawn faint, as he's only supposed, and the link that comes off is D-006, taking HR's and the research office's records with it.
- **Captions.** Spanish captions in Latin American Spanish, about as long as each English line.
- **Pause and think** stops after chapters 2, 3, 6 and 8, one question each.
- **Sound.** A new palette (in `source/tools/score.py`): a consort of viols for the chords, from A minor in Artigat through the chapters to A major at the end; a lute for the village's tune, which comes back when the village takes him in and in chapter 9; a dulcian for each person; a plucked harp note for each role, the same in every chapter; the series' clarinet for the mark (1-8-5-1). The score's needle plays a harp note for each step it crosses. Effects are things on screen: footsteps and a wooden peg, quills, tallies, stamps, wax seals for decisions, keys typing, paper. The one pulse runs under the false merge in chapter 8. The music sits about 22 dB under the voice, nothing in it above 2.5 kHz, mixed to −16 LUFS (measured −16.4, true peak −1.7 dBFS).
- **Paper.** Built after the series' wash fix of 17 October 2026, so full-bleed washes have no pale strip along their left and top edges.

## Next

1. The author watches the film on its review page, and approves it or asks for corrections.
2. The project's additions it needs: decisions D-005 and D-006; the person's master record and links, the pairs query, the person queue and its week-limit test; HR's E-4417, with the birth date typed wrong, for *Which value wins*.
3. Labs and scenarios, in the series' own thread: the candidates above.
