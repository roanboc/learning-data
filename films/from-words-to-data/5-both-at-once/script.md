# From words to data · Both at once: script

*The script of Both at once, in From words to data, as filmed: 3:55, in nine chapters, in English. The narration lives in [`source/src/narration.js`](source/src/narration.js) and the pauses in [`source/src/breath.js`](source/src/breath.js); this page and those files say the same thing, and where they differ, the source wins. The timings are the voiced ones (see [Pacing report](#pacing-report)).*

## The promise

A newcomer understands it, and a data architect agrees with it. A hybrid database writes and reads in one place: it keeps a shape for writing and a shape for reading in step, or puts an operational database inside the lakehouse. That removes the nightly copy, the pipelines, the wait and a second set of permissions. It doesn't remove the model: counted straight from the app's tables, last year's awards come out wrong. **Hybrid removes the copy, not the model.**

## The story in one paragraph

In 1879, a saloon keeper in Dayton, Ohio, patents a machine that adds each sale to the day's total; within a few years, registers record each sale as well: recording and counting in one place. At the university, writing and reading still live apart: the app writes to its own database, a copy travels to the lakehouse overnight, and the answer is ready tomorrow. But an employer wants to check a credential now, and Aisha's wallet wants to show, now, that she has 2 of 4 microcredentials towards a graduate certificate. Hybrid databases close that distance, in two ways: two stores inside one database, rows for writing and columns for reading, kept in step; or an operational database inside the lakehouse, with tables synced both ways. Keeping two shapes in step means applying each change by its key, in order: revoke an award before it's issued, and it comes back to life. The nightly copy, the pipelines, the wait and the second set of permissions go. The model stays: counting Science awards straight from the app's table gives 131, not 118, because revoked awards are still there and last year's faculty has been overwritten. Data now flows back from gold to the app, and AI agents read and write both shapes. The modeller gets new questions: the source of truth for each idea, the direction and owner of each sync, the freshness of each answer, one place for each definition, and contracts in both directions.

## What each object stands for

Everything from the series (the dark glass of the present, the warm past, the credential's gold), plus:

| Object | Stands for |
|---|---|
| The brass cash register, its keys, the pop-up tab, the dial with two hands and the number wheels under it | Recording each sale and counting the day's total in one machine (1879 and the years after) |
| The bartender's hand pressing a key, its sleeve running out of the frame | A write: one sale, recorded as it happens |
| Blue, horizontal stripes | A store of rows: a shape built to write (the app's database, the operational database) |
| Green, vertical stripes | A store of columns: a shape built to read |
| Magenta | Data flowing back from gold to the app |
| The moon, the tiles on an arc, the sun, the hourglass | The nightly copy, and the wait for tomorrow's answer |
| Bronze, silver and gold vaults | The lakehouse's layers, from *The Inner Life of Data* |
| "One database", a glass capsule holding both stores | A hybrid database with a row store and a column store inside |
| A change card with a number and a key | One captured change: its place in the order, and the key of the row it changes |
| A key icon in the same colour and cut on both sides | A stable key: how a change finds its row |
| The red ghost, "back to life" | A revoked award made valid again by changes applied out of order |
| 131 in red, 118 in green | A count straight from the app's table, against the modelled count |
| Two calendar cards | Counting today, not on census date: the mistake from *Silent change* and *What's in a word* |
| Genie's orb, with green and blue arrows | An AI agent reading what's known and writing what it did |
| A data contract for the awards, drawn like Silent change's card, with arrows both ways | Data contracts in both directions |

## Script

Timings are the voiced film's, from `tools/pace.py`.

### 1 · The till that kept the total · 0:00–0:28

**Narration.** In 1879, a saloon keeper in Ohio patented a machine to keep track of every sale at his bar: the cash register. Within a few years, registers rang up each sale as it happened, and kept a running total, ready to read at closing time. Recording and counting in one place. It's an old wish.

**Picture.** A saloon at night, drawn warm: a wooden bar with a brass foot rail, a mirror and a shelf of bottles, a lamp that flickers. A brass register on the bar. A patent on paper slides in, with the patent's own title, "Cash Register and Indicator", over a line drawing of the machine. A bartender's hand, reaching in from the left in a loose white sleeve with a garter, presses a key: a tab pops up in the window, the dial's two hands move, and the number wheels under the dial read $00.05. More sales, one by one; then the evening goes by fast, the wall clock runs on, and at closing time the wheels read $38.45 (every sale a whole number of nickels). Blue arrows mark "recording: each sale", green "counting: the day's total", and a dashed outline "in one place". The title comes up over the frame.

**On screen.** 1879 · Dayton, Ohio · PATENT · 1879 · Cash Register and Indicator · the cash register · closing time · recording: each sale · counting: the day's total · in one place · *Both at once* · one database that writes and reads

### 2 · The distance · 0:28–0:58

**Narration.** At the university, writing and reading still live apart. The app writes to its own database. Overnight, a copy travels to the lakehouse and gets refined, and the answer is ready tomorrow. But some questions can't wait. An employer wants to check a credential now. A learner's wallet wants to show, now, how close she is to a graduate certificate. That distance is why hybrid databases appeal.

**Picture.** Left, "writing": the app and its database, rows filling. Right, "reading": the answer, dim. Between them, "apart". The moon rises; tiles travel on an arc to bronze, then silver and gold light up; the sun rises and the answer reads "ready tomorrow". Two cards wait, each with an hourglass: an employer asking "Is award A-1042 still valid? now?" (the check reads last night's copy), and Aisha's wallet, "2 of 4 microcredentials towards a graduate certificate, now?". A dimension line spans the whole path: "the distance".

**On screen.** writing · the app's database · reading · the answer · apart · overnight · the lakehouse · Bronze, Silver, Gold · ready tomorrow · tomorrow, 06:00 · An employer · Is award A-1042 still valid? · the check reads last night's copy · Aisha's wallet · now? · the distance

### 3 · Two engines, one place · 0:58–1:26

**Narration.** A hybrid database writes and reads in one place. Some keep two copies inside: rows for writing, and columns for reading, kept in step by the database itself. Others put an operational database inside the lakehouse, with tables synced in both directions. The idea has a name: HTAP, hybrid transactional and analytical processing.

**Picture.** A glass capsule, "one database": the app writes in on the left, a report reads out on the right. Inside, one grid splits into two stores, "two shapes inside": rows, for writing, and columns, for reading; changes pass from one to the other, "kept in step, by the database". Then the lakehouse: an operational database for the app inside it, beside bronze, silver and gold; a blue flow into the lakehouse and a magenta flow back, "synced both ways". A card: HTAP, hybrid *transactional* (blue) and *analytical* (green) processing, beside a small copy of the first picture, one database with both stores inside, the kind the name was coined for.

**On screen.** one database · the app writes · a report reads · two shapes inside · rows, for writing · columns, for reading · kept in step, by the database · the lakehouse · operational database · synced both ways · HTAP · hybrid transactional and analytical processing

### 4 · Keeping two shapes in step · 1:26–1:56

**Narration.** Keeping two shapes in step means capturing each change as it happens, and applying it on the other side, in the same order. That only works if every row has a stable key, so an update finds the row it changes, and a delete finds the row it removes. Apply an award's revocation before its issue, and the award comes back to life. Order matters as much as content.

**Picture.** Rows (the app writes here), a change log, and columns (the reading side). Each side keeps its two tables apart, learners above awards: on the rows side, one row per learner and per award; on the columns side, the learners' columns (learner, name, email) and the awards' columns (award, learner, status), so the same place down one table's columns is the same row. Three changes happen on the left and are captured in order: 1 issue A-1042, 2 update email, 3 revoke A-1042; each is applied on the right and ticked. Every key glows, in its own colour; the update's key finds learner L-207 on both sides, and a delete, 4, finds A-1041 and removes it. Then two panels: the wrong order (revoke, then issue) leaves a red ghost, "A-1042 · issued, back to life"; the right order leaves "A-1042 · revoked", ticked. The right order stays in the wordless ending.

**On screen.** rows · learners · awards · change log · in order · columns · learner · name · email · award · status · 1, 2, 3: the same order on both sides · every row has a stable key · an update finds the row it changes · a delete finds the row it removes · wrong order · no row to revoke yet · back to life · a revoked award, valid again · right order · order matters

### 5 · What it removes · 1:56–2:08

**Narration.** What goes? The nightly copy, the pipelines that move it, the wait, and a second set of permissions to keep in step. Those are real gains.

**Picture.** Writing on the left, reading on the right, four cards between them, each crossed as it's named: the nightly copy, the pipelines, the wait, a second set of permissions. The cards go, and the two stores slide together inside one frame. "Real gains", ticked.

**On screen.** writing · reading · the nightly copy · the pipelines · the wait · a second set of permissions · one place · real gains

### 6 · What it doesn't · 2:08–2:36

**Narration.** Now count awards straight from the app's own tables. Revoked awards are still in there, with a status. Last year's faculty has been overwritten. The count comes out wrong. It's the same mistake as counting enrolments today, instead of on census date. History, shared dimensions and definitions still need modelling. Hybrid removes the copy, not the model.

**Picture.** The app's awards table, today, and a count of "Science awards, last year". Revoked rows are marked "revoked, still in there"; one row's faculty, Health, is struck and overwritten with Science. The count rolls up to 131, in red, crossed; the right count, 118, appears in green (131 − 9 revoked − 4 not Science then). Two calendar cards: counted today, 28 Sep, against census date, 31 Mar. The table's headers sit over their columns. Three chips: history, shared dimensions, definitions. The picture dims: "Hybrid removes ~~the copy~~, not the model."

**On screen.** awards · the app's own table, today · count · Science awards, last year · revoked, still in there · overwritten · 131 · counted straight from the app · 118 · the right count · enrolments: counted today, not on census date · history · shared dimensions · definitions · Hybrid removes the copy, not the model.

### 7 · Data flowing back · 2:36–3:02

**Narration.** Data flows the other way now, too. Gold data is served back to the app: the next microcredential to suggest, or a learner who may need help. Features for machine learning travel the same way: calculated in gold, served in milliseconds. And AI agents need both shapes at once: they read what's known, and write down what they did.

**Picture.** Gold on the right, the app on a phone on the left, and the app's database below it. A magenta flow runs from gold to the app. The phone shows "Next for you: Data Ethics microcredential"; a card flags "a learner who may need help, for an adviser". Three features light up in gold (credits so far, days since last login, may need help) and fly to the app: "served in 8 ms". Genie's orb appears: green arrows from gold, "reads what's known"; blue arrows to the app's database, where a new row, appended with its own key (S-0091), records "L-207 · agent: suggested Data Ethics"; Aisha's row and her award's row stay as they were.

**On screen.** Gold · the app's database · data flowing back · next: Data Ethics microcredential · a learner who may need help · features, for machine learning · calculated in gold · served in 8 ms · an AI agent · reads what's known · writes what it did

### 8 · New questions for the modeller · 3:02–3:32

**Narration.** So the modeller has new questions. For each idea, which shape is the source of truth? Which way does each table sync, and who owns it? How fresh must each answer be? Seconds for a wallet. A day for a plan. Where do the definitions live, so the app and the report agree? In one place, not two. And the data contracts from Silent change now run in both directions.

**Picture.** Five question cards gather on the left, one lit at a time; each gets a picture on the right. The source of truth: rows and columns, with "an award's status" and "a learner's email" starred under rows and "awards by faculty, ten years" under columns. Sync: awards, rows → columns, owner: registrar's team; next suggestion, gold → the app, owner: data team. Freshness: a slider from seconds to a day, the wallet at seconds, a plan at a day. Definitions: one card, "credits towards a certificate", read by the app and the report; a second copy is struck through, with a cross beside its box, "one place, not two". Contracts: a data contract for the awards, drawn like Silent change's card, between the app and gold (fields award, learner, status, date; statuses issued · revoked; what revoked means; a freshness for each direction, to gold within 5 minutes and back to the app within 15; an owner for each direction, the registrar's team and the data team), with arrows both ways.

**On screen.** the five questions · rows · columns · source of truth for… · one direction · owner · seconds, minutes, hours, a day · a wallet · a plan · credits towards a certificate · one place, not two · Data contract · awards · to gold: within 5 minutes · back to the app: within 15 minutes · what the app writes · what gold serves back · both directions

### 9 · Pull back · 3:32–3:55

**Narration.** One logical model. A shape for writing, and a shape for reading, on one platform, with a shorter distance between them. Hybrid removes the copy, not the model. Next: making the meaning itself something a machine can read.

**Picture.** One logical model at the top (Learner, Award, Credential type). Below it, a shape for writing and a shape for reading on one platform, a short arrow between them. The tagline. On the right, Genie's orb reads a card, "award is a kind of credential", a glimpse of *Meaning machines can read*. The end card.

**On screen.** one logical model · Learner · Award · Credential type · for writing · for reading · one platform · Hybrid removes the copy, not the model. · next: meaning a machine can read · *Both at once*

## Pause and think

1. **After *The distance*.** An award is revoked at 15:00. An employer checks it at 16:00, and the answer comes from last night's copy. What does the employer see? (Valid: the copy doesn't know yet.)
2. **After *Keeping two shapes in step*.** The reading side receives "revoke A-1042" before "issue A-1042". What does it end up showing? (Issued: the award is back to life.)
3. **After *What it doesn't*.** The app's awards table is live and exact. Why does counting last year's Science awards from it come out wrong? (It holds today's state: revoked awards still in it, faculties overwritten, no history.)
4. **After *New questions for the modeller*.** Which answer needs to be fresh within seconds? (An employer checking whether a credential is still valid.)

## Rigour sheet

| Chapter | What the film says | What an expert would add, or what it simplifies |
|---|---|---|
| The till | A saloon keeper in Ohio patented a cash register in 1879; within a few years, registers rang up each sale and kept a running total. | James Ritty and his brother John, of Dayton, Ohio, patented a "Cash Register and Indicator" on 4 November 1879 ("Ritty's Incorruptible Cashier"). The first model had keys and a clock-like dial whose two hands showed dollars and cents, added up through the day; it had no cash drawer and no paper roll. So the 1879 machine added each sale to a total; recording each sale (tabs, and later a paper roll) came within a few years, which is why the narration says so. The patent card carries the patent's own title; its drawing is a sketch, not the patent's figure. The picture is a composite: the pop-up tabs, the bell, the drawer and the number wheels under the dial came with later models, after the business was sold and became the National Cash Register Company (1884). |
| The distance | The app writes to its own database; a copy travels to the lakehouse overnight; the answer is ready tomorrow. | Many teams already copy more often than nightly, with change data capture or streaming. The film shows the common batch case to make the distance visible. The employer's check is drawn reading last night's copy, as some universities' verification pages do when they're served from a downstream copy. Reading the source of truth fixes that, hybrid or not: an award's status is a point read of one row. Hybrid matters most for answers that need rules, joins or history, like the wallet's progress towards a certificate. |
| Two engines | Some hybrid databases keep rows and columns inside, kept in step; others put an operational database inside the lakehouse, with tables synced both ways. HTAP. | Gartner coined HTAP in early 2014, and strictly it describes the first kind: one engine, or one database, with both shapes. Examples, named here and not on screen: a row format and a column format kept in step inside one database, as in Oracle Database In-Memory (dual format), SQL Server's updatable columnstore indexes on row tables, TiDB with TiFlash, and Google's AlloyDB with its columnar engine; SingleStore's Universal Storage is a variant, one columnstore format with an in-memory row segment for recent writes, not two copies; and Snowflake's hybrid tables (Unistore). The second kind is an operational Postgres database beside the lakehouse, such as Databricks Lakebase. Databricks calls its lakehouse approach LTAP, lake transactional/analytical processing (announced June 2026, in limited preview), and contrasts it with HTAP: two engines over shared storage in the lake, not one engine. Today most teams use synced tables (generally available), which serve lakehouse tables to Postgres, and Lakehouse Sync (Public Preview), which captures Postgres changes into Delta tables. The film uses HTAP as the name of the idea, and shows the card beside a small copy of the first kind, so the name isn't pinned to the lakehouse variant. "Both directions" means two one-way paths per table, not one table written from both sides. |
| Keeping in step | Capture each change, apply it on the other side in the same order; every row needs a stable key. | Change data capture reads the database's write-ahead log; each change has a log position. Appliers must be idempotent (safe to replay) and keep order per key; deletes must be captured, often as tombstones. Keys that change (natural keys edited by users) break the match: use a stable surrogate key. |
| What it removes | The nightly copy, the pipelines, the wait, a second set of permissions. | "The copy" here, and in the tagline, is the copy a team builds, schedules and waits for. Inside, the database may still keep two shapes (the film calls them "two copies inside" in the narration, and tags them "two shapes inside" on screen), and synced tables are copies the platform maintains and keeps fresh: what goes is the copy job, its schedule and the wait, not every copy. Governance is simpler when both shapes live under one catalog and one set of permissions; some setups still need a separate policy for the operational side. Costs and sizing still need planning. |
| What it doesn't | Counting awards straight from the app's tables gives 131 against 118: revoked awards with a status, last year's faculty overwritten. | The app's tables are built to write: current state, not history. Counting the past needs status history, slowly changing dimensions (faculty as it was), conformed dimensions and an agreed definition, as in *Built to write, built to read*. The numbers are invented and illustrative. |
| Data flowing back | Gold data served back to the app; features calculated in gold, served in milliseconds; AI agents read and write both shapes. | Serving features in milliseconds is the job of an online feature store or a synced table in an operational database. "8 ms" is an illustrative figure. An agent's writes (its log, its suggestions) should go to tables it's allowed to write, with its actions reviewable: in the picture its note is appended as a new row with its own key, and the award rows are untouched. |
| New questions | Source of truth per idea; direction and owner of each sync; freshness per use; one place for definitions; contracts both ways. | Freshness targets belong in the data contract (as in *Silent change*; the awards contract on screen states one for each direction, and its figures are illustrative), and definitions in a semantic layer that both the app and the reports read, the subject of *Meaning machines can read*. |
| Pull back | One logical model, two physical shapes, on one platform. | The logical model is technology-neutral; each shape is a physical design of it. |

## Sources

- James Ritty and the first cash register: Wikipedia, "James Ritty" and "Cash register"; The American Table, "Ritty's Incorruptible Cashier (1879)". Checked 28 September 2026. To check against the patent itself (US patent 221,360, 4 November 1879).
- HTAP: Gartner, "Hybrid Transaction/Analytical Processing Will Foster Opportunities for Dramatic Business Innovation" (2014), as cited by Wikipedia, "Hybrid transactional/analytical processing". Checked 28 September 2026 (secondary sources).
- Databricks Lakebase: generally available on AWS and Azure in early 2026 (Databricks blog; Microsoft Learn release notes); synced tables, generally available, and Lakehouse Sync (Postgres to Delta, by change data capture), in Public Preview as of September 2026, earlier in Beta (Databricks documentation; Microsoft Learn, "Lakehouse Sync"; Lakebase release notes). Checked 28 September 2026.
- LTAP: "Databricks Launches LTAP: The First Lake Transactional/Analytical Processing Architecture" (Databricks press release, Data + AI Summit, 16 June 2026; BigDATAwire; StorageNewsletter, 18 June 2026), in limited preview, positioned against HTAP (one engine) as two engines over shared lake storage. Checked 28 September 2026.
- Snowflake hybrid tables (Unistore): generally available in commercial AWS regions on 30 October 2024, extended to all commercial AWS regions on 13 November 2024, and on Azure on 6 October 2025; not on Google Cloud (Snowflake release notes and press release). Checked 28 September 2026.
- Oracle Database In-Memory (dual format: row format and in-memory column format, transactionally consistent; Oracle technical overview and documentation); SQL Server real-time operational analytics (an updatable nonclustered columnstore index on a rowstore table; Microsoft Learn); SingleStore Universal Storage (a columnstore whose partitions each keep an in-memory rowstore segment for recent writes; SingleStore documentation). Checked 28 September 2026. TiDB with TiFlash and the AlloyDB columnar engine: to check against current product documentation.
- Change data capture, ordering and idempotent appliers: to check against current product documentation.

## Pacing report

```
chapter      duration   wpm  voice  longest quiet  notes
till            28.2s   117    66%           5.4s  
distance        30.3s   133    79%           1.8s  
engines         27.2s   117    77%           1.8s  
sync            30.6s   135    73%           4.3s  
removes         12.2s   128    66%           1.8s  
doesnt          27.6s   124    77%           1.8s  
back            26.0s   136    77%           2.2s  
questions       30.1s   140    69%           2.3s  
end             22.8s   100    57%           6.0s  

total 3:54.8, 494 words, 126 wpm, voice 72% of the time, 176 wpm while speaking
sentences with under 0.5 s after them: 0; stops of 2.5 s or more inside chapters: 0
```
