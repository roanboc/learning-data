# From words to data · Built to write, built to read: script

*The script of Built to write, built to read, in From words to data, as filmed: 4:48, in eight chapters, in English. The narration lives in [`source/src/narration.js`](source/src/narration.js) and the pauses in [`source/src/breath.js`](source/src/breath.js); this page and those files say the same thing, and where they differ, the source wins. The timings are the voiced ones (see [Pacing report](#pacing-report)).*

## The promise

A newcomer understands it, and a data architect agrees with it. The same facts are stored in two shapes because there are two jobs: writing each fact once, exactly, and reading many facts at once. Normalised tables, keys, constraints and transactions make writing safe; a star, with its grain declared first, makes reading fast; a slowly changing dimension keeps the past as it was. **One logical model, a shape for each job**, and bronze, silver and gold say how refined data is, not what shape it has.

## The story in one paragraph

In Venice in 1494, Luca Pacioli describes how merchants keep their books: every transaction goes into the journal as it happens, then is posted to the ledger, by account, where it can be read and balanced; when a figure is copied wrong, the balance fails. Five centuries later, the university has the same two jobs: on graduation day it issues thousands of awards, one at a time, each complete; on planning day, it reads ten years of them at once. The shape built to write stores each fact once, with keys, rules and transactions. Store the learner's name on every award instead, and Aisha's name change is missed on one copy, which prints on her next certificate; delete the last award of a course, and the course is gone. A signed digital credential is another way to write: one document, easy to write and check, hard to count across a million. The planners' question gets its own shape: a star, with one row per credential awarded, facts to add up, and dimensions for the words after "by". Aisha moved faculty in July, so the learner dimension keeps both rows, with their dates. Side by side, the same question takes seven joins and a history puzzle in one shape, and two joins in the other; a name correction is one edit in one, thousands of rows in the other. Pulled back: one sketch, two shapes, and any medallion layer can hold either.

## What each object stands for

| Object | Stands for |
|---|---|
| The journal, written with a quill, in time order | A shape built to write: each event recorded once, as it happens |
| The ledger, with debit and credit columns per account | A shape built to read: the same facts, grouped for the question asked of them |
| The balance, with a tick or a cross | The first data quality check: debits must equal credits; the ticks check each journal entry was posted. |
| Award tiles written one by one; ten year-slabs lit at once | The two jobs of today: many small writes, and big reads across years |
| Blue glass tables with keys and crow's feet | Normalised tables, primary and foreign keys, one-to-many relationships |
| A dashed row that turns red and drops out | A constraint rejecting data that breaks a rule (an award for a learner who doesn't exist) |
| A dashed box around three writes, committing or rolling back | A transaction: all of its writes happen, or none do |
| The wide table with the name on every row | A denormalised shape used for writing, and its update and delete anomalies |
| A printed certificate with the old name | The cost of the missed copy, in the world |
| A document with nested claim and evidence, and a seal | A signed digital credential, as one document; a document database |
| A million small documents and a slow amber scan | Counting across documents: every one has to be opened |
| The green fact box and four dimensions around it | A star schema: the grain, the facts (measures) and the dimensions |
| Words after "by" lighting in the question | The test: dimensions are what you group by; facts are what you add up |
| Two dimension rows with valid_from and valid_to | A type 2 slowly changing dimension |
| A film strip of issued, revoked, reissued | A status history: nothing overwritten, each change dated |
| The split screen with seven numbered joins and two | The same question on both shapes |
| Three vaults: bronze, silver and gold | The medallion layers: how refined data is, not its shape |

## Script

Timings are the voiced film's, from `tools/pace.py`.

### 1 · Journal and ledger · 0:00–0:47

**Narration.** In 1494, Luca Pacioli set down how Venetian merchants kept their books. Every transaction was written into the journal, as it happened, one after another. Then each entry was posted to the ledger, grouped by account, where it could be read, and balanced. One set of facts, kept in two shapes: one for writing, and one for reading. And if the two sides didn't balance, something was wrong. Five centuries later, the university has the same two jobs. On graduation day, thousands of awards are issued, each one complete and right. On planning day, someone reads ten years of them at once.

**Picture.** The warm past, over Venice's skyline. A parchment plate, *Summa de arithmetica*, rises to the top. The journal opens; a quill writes four dated entries, in ink that bleeds in and settles, each naming the account it debits and the one it credits. The ledger opens on a spread of two pages: Cloth, Spices, Cash, each with debit and credit columns. Each entry flies to the ledger twice, and a tick appears beside it in the journal. The balance appears: all debits 150, all credits 150, a tick. Tags: *one shape for writing*, *one shape for reading*. A figure is copied as 50 instead of 55: the debits read 145, and a red cross, *doesn't balance*; the quill corrects it, and the tick returns. The present: graduation day, award tiles streaming into place one by one, each ticked, a counter rising; planning day, ten slabs from 2017 to 2026 lighting together. Title card: *Built to write, built to read*, "why the same award is stored twice".

**On screen.** 1494 · Venice · Summa de arithmetica · Journal · Ledger · debit · credit · all debits 150 · all credits 150 · balanced · doesn't balance · one shape for writing · one shape for reading · Graduation day · Planning day · awards issued today · ten years, read at once

### 2 · Built to write · 0:47–1:23

**Narration.** A shape built to write keeps each fact in one place. The learner's name is stored once, not on every award. Every row has a key that identifies it, and rules the data must meet: every award belongs to a learner who exists. And issuing an award touches three things at once: the award, the learner's record, and the transcript. All three change, or none of them do. Half an award is never saved. This is normalisation, with keys, constraints and transactions.

**Picture.** Three tables in blue glass: learner, course and award. Aisha's name lights once in the learner table, and her two awards point to it. Keys light on each table; links are drawn from the learner and the course to the award, a bar at one end and a crow's foot at the other. A new award for learner L-999 slides in, turns red and is rejected. The tables move up and fade into the background. A transaction box fills with three writes, each a different fact in its own place: the award's row, the learner record's enrolment marked completed, and the result on the transcript; it commits with a tick. A second one, for award A-9005, writes two, fails on the third, and rolls both back. Four tags light in turn.

**On screen.** learner · course · award · stored once · not on every award · a key identifies each row · rules the data must meet · no learner L-999: rejected · transaction · award · learner record · transcript · commit ✓ · roll back · nothing saved · normalisation · keys · constraints · transactions

### 3 · What goes wrong without it · 1:23–1:55

**Narration.** Store the learner's name on every award instead, and it lives in three places. She changes her name. Two copies are corrected. One is missed. Her next certificate prints the old name. And if the only place a course is described is on its awards, deleting the last award deletes the course. These are called update and delete anomalies. Keeping each fact once is how a shape built to write avoids them.

**Picture.** A wide table with the learner's name on every award row; three copies of "Aisha Karim" glow. A name-change card: Aisha Karim → Aisha Salem. Two cells flip, ticked; the third stays, red. A printed certificate slides out with the old name ringed in red. A panel lists the courses as the awards describe them; Ben's award for Data ethics is deleted, and the course vanishes from the list. Tags name both anomalies; a band shows the fix, each fact once: the name in one learner row with three awards pointing to it, and the course in its own row, which stays.

**On screen.** awards · the name on every row · 3 copies of one name · name change · 2 corrected, 1 missed · the old name · courses, as the awards describe them · described only on its award · gone · update anomaly · delete anomaly · each fact once · 1 edit, no copy to miss · the course keeps its own row

### 4 · Another way to write · 1:55–2:26

**Narration.** Some systems write a whole thing at once, as one document: a digital credential, with its claim and its evidence inside, signed as a single piece. Keep together what's written, and signed, together. Document databases are built for this. They shine when a whole thing is written, and read, at once. One document is easy to write and easy to check. Counting across a million of them is harder.

**Picture.** A credential appears whole, as a document: type, issuer, who it's awarded to, then a nested claim and nested evidence, which light in turn, and a signature seal over it all. A gold bracket holds it together. A document database: the document goes in whole and comes out whole. The seal is checked. Then a million small documents fill the screen, and an amber line scans slowly across them, opening each one.

**On screen.** credential · one document · claim · evidence · proof · signed as one piece · one write: the whole thing · written together, signed together · document databases · written whole · read whole · easy to write, easy to check · a million credentials, one document each · to count them, open every one

### 5 · Built to read · 2:26–3:08

**Narration.** Planning day. How many awards, by faculty and by year, for the last ten years? A shape built to read starts with the grain: one row per credential awarded. The numbers to add up sit in the middle: the award itself, and its credit points. Around them sits everything you'd filter or group by: the learner, the kind of credential, the faculty, the date. A simple test: the facts are what you add up; the dimensions are the words after by, in the question. It's called a star. Reading it takes two steps, not seven.

**Picture.** Ana Ruiz asks the question in a bubble. A green fact box appears, *credential awarded*, with its grain first; award tiles line up under it, one row each. The measures appear: award, counted, and credit points, summed. Four dimensions appear around it and link to it: Learner, Credential kind, Course and Date; as the faculty is named, it lights inside the Learner dimension, which keeps it with its dates. A test card: facts, what you add up; dimensions, the words after "by". In the question, "awards" lights green, and "faculty" and "year" light gold, with the Learner and Date dimensions. The rays pulse: a star. Two joins light, numbered 1 and 2: fact to Learner, fact to Date. In the wordless ending, the answer grows: awards by faculty, one stacked bar a year.

**On screen.** Planning day · FACT · credential awarded · one row per credential awarded · Σ award count · Σ credit points sum · facts · dimensions · Learner · name · faculty · dates · Credential kind · degree · micro · badge · Course · Date · by faculty · by year · a star · two joins, not seven · awards, by faculty and year

### 6 · Keeping history for reading · 3:08–3:49

**Narration.** A learner moved faculty in the middle of the year. Do her awards count for the old faculty, or the new? Keep both, each with the dates it was true. Awards before the move count for the old faculty, and after it, for the new. An award that's revoked and reissued keeps its history too. Nothing is overwritten. Each change has a date. Not every change needs history. Correcting a typo can simply overwrite. A move between faculties can't. Decide for each attribute, and write it down. Engineers call this a slowly changing dimension.

**Picture.** A year line for 2026: Science until 30 June, Engineering from 1 July. Two awards, in May and September, each with a question mark. The learner dimension shows two rows for Aisha, each with valid_from and valid_to; arrows join each award to the row that was true on its date. A film strip for award A-9002: issued, revoked, reissued, each dated, over a status history table. Two cards: *overwrite* (a typo, fixed in place, type 1) and *keep history* (a move: a new row, the old one closed, type 2). A sheet of paper lists the decision for each attribute.

**On screen.** Aisha moves faculty · 1 July · counts for Science · counts for Engineering · learner dimension · each row: the dates it was true · award status history · nothing overwritten · each change has a date · overwrite · keep history · type 1 · type 2 · decided, and written down · slowly changing dimension

### 7 · Side by side · 3:49–4:13

**Narration.** Now ask both shapes the same question. The shape built to write needs seven joins, and a puzzle about history. The shape built to read answers in two. Then correct a name. Easy where it's stored once. Awkward in a shape that repeats it on purpose. Each shape is fast at its own job.

**Picture.** The screen splits: blue on the left, green on the right, the question across the top. On the left, eight tables join one by one, numbered 1 to 7, along the path the question needs: award to award_status; to enrolment, learner, learner_faculty and faculty; and to calendar and academic_year. learner_faculty turns amber, a puzzle about which faculty was true on the award date. On the right, the star lights two joins, to Learner (by faculty) and to Date (by year). Then a faculty's name is corrected: one cell on the left, ticked; on the right, the name repeated on every Engineering learner's row in the learner dimension, updated row by row, with a counter of 4,812 rows. Both shapes return, each with what it's fast at.

**On screen.** awards by faculty and by year, for ten years · built to write · built to read · 7 joins · a puzzle: which faculty, on the award date? · by faculty · by year · 2 joins · correct a name: "Enginering" → "Engineering" · stored once: 1 edit · repeated on purpose · fast to write: issue, correct · fast to read: add up, compare

### 8 · Pull back · 4:13–4:48

**Narration.** One sketch. Two shapes, both built from the same logical model. And a common confusion, cleared up: bronze, silver and gold say how refined data is, not what shape it has. Many platforms keep a normalised shape in silver, close to the sources, and stars in gold. That's a choice, not a rule. Any layer can hold either shape. The next question is which shapes to use for reading. There are several.

**Picture.** A pencil sketch on paper, Learner, Credential and Course, with two arrows down to the two shapes. Three vaults, bronze, silver and gold, with "normalised here?" and "stars here?" struck through, and an arrow under them: how refined the data is. The normalised shape settles in silver and the star in gold; then both shapes appear, fainter, in every vault. Three reading shapes wait above: a star, one wide table, hubs and links. End card.

**On screen.** one sketch · one logical model · built to write · built to read · Bronze · Silver · Gold · normalised here? · stars here? · how refined the data is · not what shape it has · a choice, not a rule · any layer can hold either shape · which shapes, for reading? · *Built to write, built to read* · One logical model, a shape for each job.

## Pause and think

Four stops, one question each.

| After | Question | Answer, in short |
|---|---|---|
| 1 · Journal and ledger | The journal and the ledger hold the same entries. Why keep both? | Each shape makes one job easy: writing as it happens, reading and balancing by account. And because every entry is posted twice, the balance catches a figure copied wrong on one side (though not an entry left out altogether). |
| 3 · What goes wrong without it | Her name was on three rows and two were corrected. What would have prevented the missed copy? | Storing the name once, in the learner record, with each award pointing to it. |
| 5 · Built to read | Credit points by kind of credential and by month: which are the facts, which the dimensions? | Credit points are the fact; the kind and the month are dimensions. |
| 7 · Side by side | A faculty's name is one edit on the left and thousands of rows on the right. Is the star badly designed? | No: it repeats names on purpose, so reading needs fewer joins; corrections cost a reload. |

## Rigour sheet

The university, people, dates and numbers are fictional. What's listed as checked was confirmed through search results on 28 September 2026: the pages themselves couldn't be opened from here, so open them before publishing.

| Chapter | What the film says | What an expert would add, or what it simplifies |
|---|---|---|
| 1 · Journal and ledger | Pacioli, in 1494, set down how Venetian merchants kept their books: a journal in time order, then a ledger by account, balanced. | Pacioli's *Particularis de computis et scripturis*, in the *Summa de arithmetica* (Venice, 1494), is the first printed description of double entry; he described "the method of Venice", he didn't invent it. He describes three books: a memorandum (rough notes, first), the journal and the ledger; the film shows two. Accounts were kept in lire, soldi and grossi; the film counts in ducats. The balance stands for Pacioli's check that the debit and credit totals agree (a trial balance); it catches a figure mis-copied on one side, not every error: an entry left out altogether still balances. Pacioli's ledger gives each account a facing pair of pages, debits on the left and credits on the right; the film draws debit and credit columns side by side on one page. |
| 2 · Built to write | Each fact in one place; keys; rules such as every award belonging to a learner who exists; a transaction that writes three things or none. | Normalisation (Codd, 1970s) usually to third normal form in operational systems. The rule shown is a foreign-key constraint. "All three change, or none" is atomicity, the A of ACID; isolation and durability are not shown. A failed transaction rolls back automatically; the film draws it. The three writes are three different facts, each stored once: the award, the enrolment's status on the learner record, and the result on the transcript. A running total of credit points kept on the learner would be a derived copy, which a normalised design leaves out. |
| 3 · What goes wrong | A name stored on every award is missed on one copy; deleting the last award deletes the course. | Update and delete anomalies are the classic arguments for normalisation (insert anomalies are the third). A certificate that keeps the name it was issued with is sometimes intended: here the missed copy is a mistake, printed later. |
| 4 · Another way to write | A signed digital credential as one document; document databases shine when whole things are written and read at once; counting across a million is harder. | Digital credentials follow standards such as the W3C Verifiable Credentials Data Model 2.0 (a W3C Recommendation since 15 May 2025): claims about a subject, optional evidence, and a securing mechanism (an embedded proof or an enveloping signature). Document databases have indexes and aggregation pipelines, so counting is possible; "harder" means it's slower and less natural than on a columnar, analytical shape. A signed document can't be edited without breaking its signature. The document names who it's awarded to, the credential's subject (credentialSubject); the holder, in the standard, is whoever keeps and presents it. |
| 5 · Built to read | Grain first: one row per credential awarded; facts to add up; dimensions around them; the words after "by"; a star; two steps, not seven. | Kimball's four steps: select the business process, declare the grain, identify the dimensions, identify the facts; the grain is best at the most atomic level. "Award" here is a count of rows (a factless-style count); credit points is additive. "The words after by" is a rule of thumb: filters and "where" words are dimensions too. The faculty is one of the learner dimension's attributes, kept with its dates (chapter 6), so the two joins are fact to Learner (to the row valid on the award date, whose key the fact row holds) and fact to Date; a real query may also filter on the kind of credential. Some designs give faculty a dimension of its own, and the fact row then records the faculty at the time of the award. "Degree" is one kind of credential; "award" means any credential awarded. |
| 6 · Keeping history | Keep both rows, each with its dates; an award keeps its status history; a typo can overwrite; a move can't; decide per attribute. | This is a type 2 slowly changing dimension (a new row, a new surrogate key, effective and expiration dates; Kimball also recommends a current-row flag, not drawn). The overwrite is type 1, which Kimball recommends for corrections. Each fact row points to the dimension row valid when the award was made. The status history is a separate history table (or an accumulating snapshot), not a dimension. |
| 7 · Side by side | Seven joins and a history puzzle, against two; a name correction is one edit against many rows. | The seven joins follow the keys of one plausible normalised design, eight tables, and the question needs each of them: award to award_status (to leave out revoked awards), award to enrolment, enrolment to learner, learner to learner_faculty (the faculty valid on the award date), learner_faculty to faculty, award to calendar, and calendar to academic_year. Real systems vary, and a hand-written query can sometimes skip a table whose key it already has (here, the learner). The star's learner dimension repeats the faculty name on every learner row, current and past (a denormalised attribute), and the fact row points to the learner row valid on the award date; a correction is usually applied by reloading the dimension, not by hand. |
| 8 · Pull back | One logical model, two shapes; bronze, silver and gold say how refined data is, not its shape; normalised in silver and stars in gold is common, a choice, not a rule. | The medallion architecture (bronze, silver, gold) is described by Databricks as a way of organising data by quality and refinement. Many teams model silver in third normal form or Data Vault and gold as Kimball stars; others serve stars from silver, or wide tables from gold. The three shapes above the vaults are the subject of *Many ways to read*. |

## Sources

Checked on 28 September 2026, through search results only (the pages couldn't be opened from here: open each one before publishing).

- Pacioli, *Summa de arithmetica, geometria, proportioni et proportionalita* (Venice, November 1494), and its treatise *Particularis de computis et scripturis*: the first printed description of double entry, not its invention. [Summa de arithmetica (Wikipedia)](https://en.wikipedia.org/wiki/Summa_de_arithmetica); [Sangster and Santini, *Lost in translation: Pacioli's de computis et scripturis*, 2022](https://journals.sagepub.com/doi/full/10.1177/10323732221098443)
- Kimball Group, [Four-step dimensional design process](https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/four-4-step-design-process/) and [Type 2: add new row](https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/type-2/)
- W3C, [Verifiable Credentials Data Model v2.0](https://www.w3.org/TR/vc-data-model-2.0/), and [the announcement of its Recommendation, 15 May 2025](https://www.w3.org/press-releases/2025/verifiable-credentials-2-0/)
- Databricks, [What is a medallion architecture?](https://www.databricks.com/blog/what-is-medallion-architecture) (silver often in third normal form or Data Vault; gold often as Kimball stars)

To check:

- The memorandum, journal and ledger in Pacioli's text, and the "Per" and "A" notation, in a translation such as Geijsbeek (1914) or the Sangster edition.
- Codd, "A relational model of data for large shared data banks" (1970) and "Further normalization of the data base relational model" (1971), for the normal forms and the anomalies.
- Kimball and Ross, *The Data Warehouse Toolkit*, 3rd edition (2013), on grain, conformed dimensions and slowly changing dimensions.
- The aggregation and indexing features of current document databases, if a product is ever named.

## Pacing report

```
chapter      duration   wpm  voice  longest quiet  notes
ledger          47.3s   129    76%           5.4s  
write           35.9s   137    78%           2.1s  
wrong           31.5s   137    73%           1.8s  
docs            30.8s   134    77%           1.8s  
read            42.5s   134    69%           4.2s  
history         41.0s   137    78%           1.8s  
side            23.8s   136    65%           1.8s  
end             34.8s   124    70%           6.0s  

total 4:47.7, 640 words, 133 wpm, voice 74% of the time, 181 wpm while speaking
sentences with under 0.5 s after them: 0; stops of 2.5 s or more inside chapters: 0
```
