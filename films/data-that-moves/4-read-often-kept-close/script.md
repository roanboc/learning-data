# Data that moves · Read often, kept close: script

*The script of *Read often, kept close*, film 4 of 4 of *Data that moves*, the first series of the module *Modern data basics*, in five chapters, in English, drawn in the module's look. Made on 11 November 2026, when the author's review split *Hot, warm, cold* in two ("the seed vault story shows the temperature of storage, not of ingestion"; consider splitting it into storage options, which are not temperature, and data temperature as freshness). *Hot, warm, cold* became freshness, set by when someone acts on the data; this film is storage: how often data is read decides where it's kept, and the law and the business decide for how long. It keeps the seed vault opening, its pictures and its pyrophone score, written for that film on 5 November 2026 and checked against its sources that day (*Rigour*). The narration lives in `source/src/narration.js` and the pauses in `source/src/breath.js`; this page and those files say the same thing, and where they differ, the source wins. Made to read on a phone: on-screen words at least 28 px in the frame, nothing under the captions, and no caption over two lines.*

## The promise

Every line passes two tests: someone who has never run a data platform can follow it, and a data architect or a data engineer finds nothing wrong in it. *Hot, warm, cold* asked how fresh data must be. This film asks the second question: how often is it read? Cloud storage comes in tiers named hot, cool, cold and archive; the names sound like data's temperature, but they answer this other question. Each tier down costs less to keep and more to read, and the archive tier takes hours to bring a file back. So keep what's read often where reading is cheap, and what's rarely read where keeping is cheap; and how long it's kept at all is set by the law and the business, and goes into the data's contract. It is light on purpose: storage has had tiers for years, and the depth is in the official docs.

**Takeaway:** "How often data is read decides where it's kept; the law and the business decide for how long."

## The story in one paragraph

In February 2008 a vault opens deep in a frozen mountain on Svalbard. At minus 18 °C it keeps copies of seeds from gene banks around the world, which keep the seeds of crops and their wild relatives so breeders can grow crops that stand drought and disease. Near Aleppo, a gene bank keeps 141,052 samples from the world's dry lands, and from 2008 sends copies of most of them to the vault. A gene bank can be lost, and in 2012 war came close: most of its keepers left, it could no longer send seeds out, and every variety was at risk. Unless the copies could come back, the collection would be lost for good. In 2015 the keepers asked the vault for their copies, the first to do so: 38,073 samples came out of the mountain and were sown that November in Lebanon and Morocco. By 2020 nothing was left in Aleppo, yet no more than 1,657 samples were lost, and breeders can order its seeds again. Seeds in use, kept close and ready; their copies, frozen far away, until the day they're needed. Data can be kept the same way. Until September 2026 the university kept all its data in the same storage, the costliest, whether it was read every day or once in seven years, and never deleted an old pay record. In September Noor asks each data owner how often their data is read. Pay records are read often for a year, then rarely: now, a year after it's written, each file moves to the archive tier, the cheapest to keep; the table is told, so recent pay still runs and an audit's year comes back in hours; seven years after each contract ends, the records are deleted, and in October the oldest were. Linh's pay record, written today, will follow the same steps. On Svalbard the vault stays cold and still; in Lebanon and Morocco the bank sends out its seeds again.

## Opening story

Each beat of the opening, said outright in the narration (AGENTS.md, *Story and world*), and where the film comes back to it.

| Beat | The line that says it |
|---|---|
| Scenario | "February 2008. Deep in a frozen mountain on Svalbard, Norway's Arctic islands, a vault opens." "At minus eighteen degrees, it keeps copies of seeds from gene banks around the world." "Gene banks keep the seeds of crops and their wild relatives, so breeders can grow crops that stand drought and disease." "Near Aleppo, in Syria, a gene bank keeps 141,052 samples of wheat, barley, lentils and chickpeas, from the world's dry lands." "From 2008, it sends copies of most of them to the vault." |
| Problem | "But a gene bank can be lost, to war, flood or a power cut, and a variety lost is lost for good." "In 2012, war came close to Aleppo. Most of the bank's keepers had to leave, and it could no longer send seeds out." "Breeders could no longer get the seeds they relied on, and every variety in the bank was at risk." "Unless the copies could come back, the collection would be lost for good." |
| Solution | "In 2015, the keepers did what no one had done before: they asked the vault for their copies." "38,073 samples came out of the mountain, and that November they were sown in Lebanon and Morocco." |
| Benefits | "By 2020, nothing was left of the collection in Aleppo." "Yet no more than 1,657 of its samples were lost, and breeders can order its seeds again." "Seeds in use, kept close and ready; their copies, frozen far away, until the day they're needed." Then the same for data: "Years of old pay records filled the costliest storage, and none was ever deleted: a cost, and a risk to everyone in them." "Now where data is kept follows how often it's read." |
| Back to the story | In *Pay records*: "Like the copies on Svalbard, they sleep until someone needs them." And at the end, with its benefit for data: "On Svalbard, the vault stays cold and still. In Lebanon and Morocco, the bank sends out its seeds again." "At the university, data is kept the same way: what's read often, where it's quick to read; old pay records, cheaply, until they're deleted." |

Someone who has never heard of the seed vault can answer, from the narration alone, "why was that a problem?" (a gene bank can be lost to war, and a variety lost is lost for good; with the keepers gone, breeders couldn't get the seeds, and every variety was at risk) and "what did the fix give people?" (the copies, kept frozen far away, came back and were sown again: at most 1,657 of 141,052 samples were lost, and breeders can order its seeds again).

## The reference, and practice

This film sits in the lifecycle's *storage* stage (*Fundamentals of Data Engineering*) and in DAMA-DMBOK's *data storage and operations*, which hold retention, archiving and purging. The cloud's storage tiers (Azure Storage, *Access tiers for blob data*) name hot, cool, cold and archive by how often data is read; the film says plainly that these names are not data's temperature in the sense of *Hot, warm, cold*, which is set by when someone acts on data. The Open Data Contract Standard's `retention` service level holds how long it's kept.

**Practice, from the author (review of 11 November 2026):** the seed vault shows the temperature of storage, not of ingestion, so storage options belong in their own film, apart from freshness. The film keeps to the practitioner's rule: keep what's read often where reading is cheap, keep what's rarely read cheaply, keep nothing past its date, and write how long into the data's contract.

## What the example project has

`examples/hot-warm-cold/` in the example project (`films/analytics-engineering/project/`), for Databricks only and not run by CI: `pay_records_archive.sql` (the table told when its files go to the archive tier, `SHOW ARCHIVED FILES` for an audit, and the yearly deletion: `DELETE`, `REORG TABLE ... APPLY (PURGE)` and `VACUUM`), and `service_levels.yaml`, whose `pay_records` contract holds its retention of seven years and its `storageTier`, hot, then archive.

## The look

The module's look, *the platform map drawn up close*, from the module's kit in `films/data-that-moves/shared/`, used as it is. The opening is drawn in the same night: a map of the North as dots of light (its land from NOAA's GLOBE data, credited in `NOTICE.md`), the vault cut open in the polar night, and a field at first light. No flags, no logos, no faces from photographs; the war is said in a line and never shown. Storage tiers are shelves: the hot tier bright and near, the archive below, under frost.

## Script

### 1 · The seed vault

**Picture.** Svalbard in the polar night, the mountain cut open: the vault's door, tunnel and halls light, boxes of seeds on shelves, "minus 18 °C". A map of the North as dots of light, its gene banks warm points; Aleppo's pin, lanes of seeds "to breeders" and a lane north, "copies, from 2008". "A gene bank can be lost"; 2012, the keepers leave, the lanes fade, "Every variety at risk". 2015: the call up the lane, and the copies coming down to Lebanon and Morocco, "38,073 samples". A field at first light, sprouting, then ripening: "Nothing left in Aleppo", then "1,657 of 141,052 samples lost". Two tags: "in use · close and ready", "copies · frozen far away". Then the university: every year of pay records, 2016 to 2026, on one shelf, "One storage for all · the costliest", read every day or once in seven years, none ever deleted, a risk to everyone in them; "Now": the older years sink to an archive shelf, "kept as it's read". The title: "Read often, kept close", "where data lives, and for how long", FILM 4 OF 4.

**Narration.**

- February 2008. Deep in a frozen mountain on Svalbard, Norway's Arctic islands, a vault opens.
- At minus eighteen degrees, it keeps copies of seeds from gene banks around the world.
- Gene banks keep the seeds of crops and their wild relatives, so breeders can grow crops that stand drought and disease.
- Near Aleppo, in Syria, a gene bank keeps 141,052 samples of wheat, barley, lentils and chickpeas, from the world's dry lands.
- From 2008, it sends copies of most of them to the vault.
- But a gene bank can be lost, to war, flood or a power cut, and a variety lost is lost for good.
- In 2012, war came close to Aleppo. Most of the bank's keepers had to leave, and it could no longer send seeds out.
- Breeders could no longer get the seeds they relied on, and every variety in the bank was at risk.
- Unless the copies could come back, the collection would be lost for good.
- In 2015, the keepers did what no one had done before: they asked the vault for their copies.
- 38,073 samples came out of the mountain, and that November they were sown in Lebanon and Morocco.
- By 2020, nothing was left of the collection in Aleppo.
- Yet no more than 1,657 of its samples were lost, and breeders can order its seeds again.
- Seeds in use, kept close and ready; their copies, frozen far away, until the day they're needed.
- Data can be kept the same way.
- Until September, the university kept all its data in the same storage, whether it was read every day or once in seven years.
- Years of old pay records filled the costliest storage, and none was ever deleted: a cost, and a risk to everyone in them.
- Now where data is kept follows how often it's read.

### 2 · Read often, or rarely

**Picture.** Noor at the left, "September". "First: how fresh must it be?", then a card, "A second question · How often is it read?". A table of the cloud's tiers, Hot, Cool, Cold and Archive, each with who reads it; columns come in: to keep, to read, back in (at once, or hours for the archive). A card: not "when does someone act on it?" but "how often does anyone read it?". Tags: read often, where reading is cheap; rarely read, where keeping is cheap. A gold card, "DATA CONTRACT · PAY RECORDS": read often for a year, then rarely; kept 7 years after each contract ends, then deleted.

**Narration.**

- In September, Noor asked each data owner a second question, after how fresh it must be: how often is it read?
- Cloud storage comes in tiers, named hot, cool, cold and archive, after how often data is read.
- The names sound like data's temperature, but they answer another question: not when someone acts on it, but how often anyone reads it.
- Each tier down costs less to keep, and more to read. The archive tier takes hours to bring a file back.
- So keep what's read often where reading is cheap, and what's rarely read where keeping is cheap.
- How long it's kept at all is set by the law and the business, and it goes into the data's contract.

### 3 · Pay records

**Picture.** The payroll system and the lilac table "pay_records", with its lock; the years 2016 to 2026 in one row, all in the hot tier until September. Now 2017, then each older year, sinks to the archive shelf; the vault, its copies asleep; the table told, `delta.timeUntilArchived = '365 days'`; a card "2021 · FILES TO BRING BACK", two file names, "hours · fine for an audit"; a gold tag, "7 years after each contract ends, then deleted", and 2016 to 2018 leaving in October. A card, "Data protection · Deleting well".

**Narration.**

- Every pay day, payroll sends the platform a record of each pay, with the hours each casual tutor worked.
- Australian law asks employers to keep pay records for seven years, and after the first, they're rarely read.
- Until September, every year's records sat in the hot tier, and none was ever deleted.
- Now, a year after it's written, each file moves to the archive tier, the cheapest to keep.
- Like the copies on Svalbard, they sleep until someone needs them.
- The table is told, so queries for recent pay still run, and one that needs an archived year says which files to bring back.
- Bringing them back takes hours, which is fine for an audit.
- When a year's records turn seven, they're deleted, on a date set in advance, and their files removed for good.
- In October, the oldest records, more than seven years old, were deleted.
- How to delete well is for the films on data protection.

### 4 · One record's years

**Picture.** Linh at the left, her name tag beside her. Three steps: Hot tier (read often: her payslip, a question, the year's end), Archive tier (a year on, rarely read, back in hours for an audit) and Deleted (7 years after her contract ends, its files removed for good). Her pay record, a card, moves down the steps as a corner pill says "Today · pay day", "A year from now", "Seven years after her contract ends".

**Narration.**

- One record moves down as it ages.
- Today, Linh's pay record is written. This year it's read often: for her payslip, a question, the year's end.
- A year from now, its file moves to the archive tier, where keeping it costs a small part of what it did.
- If an audit asks for it, it comes back in hours.
- Seven years after her contract ends, it's deleted, and its files are removed for good.
- At each step, where it lives follows how often it's read.

### 5 · Kept as it's read

**Picture.** The vault, cold and still; the field, its seeds sent out again. The university's two shelves: 2026 in the hot tier, the archived years below. A card, "Written today · 2,960 pay records · Linh's among them". The takeaway card; the module's mark, "storage has had tiers for years"; the docs card, with four verbs; Next: data as software; the end card.

**Narration.**

- On Svalbard, the vault stays cold and still. In Lebanon and Morocco, the bank sends out its seeds again.
- At the university, data is kept the same way: what's read often, where it's quick to read; old pay records, cheaply, until they're deleted.
- Today, a pay day, 2,960 new pay records are written, Linh's among them.
- How often data is read decides where it's kept; the law and the business decide for how long.
- Storage has had tiers for years: there's no wheel to reinvent.
- Start from the official docs, then investigate, adapt, implement, iterate.
- Next: data as software, where scripts became software.


## Sound

The pyrophone made for *Hot, warm, cold* on 5 November 2026, which this film takes with the seed vault (the module's `palettes.md`, 11 November 2026): glass tubes sung by a flame, a tube sounding while it's hot and falling silent as it cools, with its own low tubes for the ground. E major, C sharp minor for the problem; the mark, a note that cools to nothing, at the copies frozen far away, the archive tier, one record moving down, and the end card. `source/tools/score.py`; `tools/quiet.py` passes.

## Pacing report

`tools/pace.py`: 5:53, 769 words, 131 words a minute (vault 130, tiers 139, records 138, years 135, close 112), the voice 74% of the time, no sentence with under 0.5 s after it.

## Pause and think

| After | Question | Answer |
|---|---|---|
| Tiers | Cloud storage tiers are named hot, cool, cold and archive. What decides which tier a file belongs in? | How often it's read: often, where reading is cheap; rarely, where keeping is cheap. |
| Pay records | Pay records more than a year old now sit in the archive tier, the cheapest to keep. What does the university give up for that? | Speed: an archived year takes hours to bring back before it's read, which is fine for an audit. |
| One record's years | Seven years after Linh's contract ends, her pay record is deleted. What decides that it's seven years? | The law and the business, and the rule is written into the pay records' contract. |

## Rigour

| Claim | Source | Checked |
|---|---|---|
| "February 2008. Deep in a frozen mountain on Svalbard, Norway's Arctic islands, a vault opens." | Svalbard Global Seed Vault, *The Facility*: opened 26 February 2008, cut into solid rock, its store more than 100 m inside the mountain; *Purpose, Operations and Organisation*: "Svalbard is the Norwegian archipelago half way between the Northern pole and Mainland Norway" | 5 November 2026 |
| "At minus eighteen degrees, it keeps copies of seeds from gene banks around the world." | *The Facility*: cooled to minus 18 °C; *Purpose, Operations and Organisation*: safety duplicates of seeds from gene banks around the world, free and long-term | 5 November 2026 |
| "Gene banks keep the seeds of crops and their wild relatives, so breeders can grow crops that stand drought and disease." | *Purpose, Operations and Organisation*: seeds hold what breeders need "to improve the yield, resilience or disease resistance" of crops; ICARDA, 25 October 2020: its collection holds landraces and wild relatives | 5 November 2026 |
| "Near Aleppo, in Syria, a gene bank keeps 141,052 samples of wheat, barley, lentils and chickpeas, from the world's dry lands." | ICARDA (the International Center for Agricultural Research in the Dry Areas), *ICARDA efforts to preserve its valuable genebank collection pay off*, 25 October 2020: its gene bank at Tel Hadya, near Aleppo, from 1984; by 2012 an active collection of 141,052 accessions (wheat, barley, chickpea, lentil, faba bean, grass pea, forages). The film names four crops and doesn't name the centre | 5 November 2026 |
| "From 2008, it sends copies of most of them to the vault." | Svalbard Global Seed Vault, *ICARDA seeds safe back in Lebanon and Morocco*, 27 October 2017: from 2008 to 2014 ICARDA deposited 116,484 duplicate samples in the vault (of 141,052) | 5 November 2026 |
| "But a gene bank can be lost, to war, flood or a power cut, and a variety lost is lost for good." | *Purpose, Operations and Organisation*: the vault's value lies in "providing back-up to individual collections in the event that the original samples ... are lost due to natural disasters, human conflict, changing policies, mismanagement"; *The Facility*: generators for a power cut | 5 November 2026 |
| "In 2012, war came close to Aleppo. Most of the bank's keepers had to leave, and it could no longer send seeds out." | ICARDA, 25 October 2020: "By 2012 the conflict in Syria had neared Tel Hadya"; Shaoni Bhattacharya, *Syrian seed bank gets new home away from war*, Nature, 5 October 2016 (republished by Scientific American): "Most staff left ICARDA's Aleppo site in 2012"; "seeds can no longer be moved in or out easily". Told with care: the war is named once, with no side | 5 November 2026 |
| "Breeders could no longer get the seeds they relied on, and every variety in the bank was at risk." | Nature, 2016: the centre provided researchers and breeders with about 20,000 samples a year (Ahmed Amri), and "the situation in Syria did not allow us to continue our core activities" | 5 November 2026 |
| "In 2015, the keepers did what no one had done before: they asked the vault for their copies." | Seed vault, 27 October 2017: the first withdrawal ever, September 2015; ICARDA, 10 September 2017: "ICARDA became the first organization in history to withdraw seed from Svalbard" | 5 November 2026 |
| "38,073 samples came out of the mountain, and that November they were sown in Lebanon and Morocco." | Seed vault, 27 October 2017: "A total of 38073 seed accessions arrived safely in Lebanon and Morocco in good condition, and were sown already in November 2015". Sources differ on how many were asked for (news at the time gave about 38,000, one report about 116,000): the film says the number that arrived, from the vault's own page | 5 November 2026 |
| "By 2020, nothing was left of the collection in Aleppo." | ICARDA, 25 October 2020: the old premises "extensively damaged, with nothing remaining of the collection" | 5 November 2026 |
| "Yet no more than 1,657 of its samples were lost, and breeders can order its seeds again." | ICARDA, 25 October 2020: "the overall loss of accessions did not exceed 1,657 out of the original 141,052"; more than 143,806 accessions now kept in Morocco and Lebanon, 83,702 of them available to order | 5 November 2026 |
| "Seeds in use, kept close and ready; their copies, frozen far away" | The bank's active collection, sent to breeders, against the vault's safety duplicates. Gene banks also keep a base collection at minus 18 to minus 20 °C; the film leaves it out | 5 November 2026 |
| "Australian law asks employers to keep pay records for seven years" | *Fair Work Act 2009* (Cth), s 535(1): "An employer must make, and keep for 7 years, employee records of the kind prescribed by the regulations"; *Fair Work Regulations 2009*, reg 3.33: records of pay, and for a casual paid by the hour, "the record must set out the hours worked" (Federal Register of Legislation, compilations in force 7 July and 1 November 2026). The voice names no act | 5 November 2026 |
| "Cloud storage comes in tiers, named hot, cool, cold and archive, after how often data is read." and "Now, a year after it's written, each file moves to the cloud's archive tier, its cheapest." | Microsoft, *Access tiers for blob data* (checked 10 November 2026): the hot tier is "optimized for storing data that is accessed or modified frequently", and the cool, cold and archive tiers for data read less and less often. The same page (updated 3 November 2026): the archive tier is an offline tier with "the lowest storage cost", for data rarely read, kept at least 180 days; a lifecycle rule moves blobs between tiers by when they were created (set on the storage account, not in Databricks); the table's `_delta_log/` is never archived | 5 November 2026 |
| "The table is told, so queries for recent pay still run, and one that needs an archived year says which files to bring back." | Databricks, *Archival support in Azure Databricks* (updated 12 October 2026): `delta.timeUntilArchived` tells Databricks to ignore files older than it; queries that need only unarchived files run; "Queries that require archived files fail", early, and `SHOW ARCHIVED FILES` lists the files to restore; it works with Azure's archive tier only | 5 November 2026 |
| "Bringing them back takes hours, which is fine for an audit." | *Access tiers for blob data*: rehydrating a blob from the archive tier "can take up to 15 hours"; while a blob is in the archive tier, "it can't be read or modified" | 5 November 2026 |
| "When a year's records turn seven, they're deleted, on a date set in advance, and their files removed for good." "In October, the oldest records, more than seven years old, were deleted." | The university's rule, as *How long, and then what* (*Kept for a reason*) sets it: pay records kept 7 years after each contract ends, then deleted; its first clean-up in October 2026 deleted 2016 to 2018 (agreed with that film's thread, 5 November 2026). A casual's contract ends in the teaching period it's for, so a casual's records go when the year they were paid in turns seven. Databricks: a `DELETE` on archived files fails until they're restored (*Archival support*); with deletion vectors, `REORG TABLE ... APPLY (PURGE)` rewrites the files without the deleted rows; `VACUUM` removes files no longer referenced once the retention threshold (7 days by default) has passed: "Permanently removing these files from cloud storage ensures these records are no longer accessible" (*Remove unused data files with vacuum*) | 5 November 2026 |
| "Storage has had tiers for years" | Cloud storage has priced data by how often it's read for years, as Azure Storage's hot, cool, cold and archive tiers do (*Access tiers for blob data*); Reis and Housley, *Fundamentals of Data Engineering* (2022), on hot, lukewarm and cold storage | 5 November 2026 |

## Sources

- Svalbard Global Seed Vault, *The Facility* (seedvault.no/about/the-facility/) and *Purpose, Operations and Organisation* (seedvault.no/about/purpose-operations-and-organisation/), read 5 November 2026.
- Svalbard Global Seed Vault, *ICARDA seeds safe back in Lebanon and Morocco*, 27 October 2017 (seedvault.no), read 5 November 2026.
- ICARDA, *ICARDA efforts to preserve its valuable genebank collection pay off*, 25 October 2020 (icarda.org/node/14184), and *Protecting ICARDA's unique seed collection*, 10 September 2017 (icarda.org/node/10666), read 5 November 2026.
- Shaoni Bhattacharya, *Syrian seed bank gets new home away from war*, Nature 538, 16 (5 October 2016), doi:10.1038/538016a, republished by Scientific American, read 5 November 2026.
- *Fair Work Act 2009* (Cth), s 535, compilation in force 7 July 2026, and *Fair Work Regulations 2009*, regs 3.32 and 3.33, compilation in force 1 November 2026, Federal Register of Legislation (legislation.gov.au), read 5 November 2026.
- Microsoft, *Access tiers for blob data*, Azure Storage (learn.microsoft.com/en-us/azure/storage/blobs/access-tiers-overview), updated 3 November 2026, read 5 November 2026.
- dbt Labs, *Databricks configurations* (docs.getdbt.com/reference/resource-configs/databricks-configs), read 5 November 2026.
- Bitol, Open Data Contract Standard v3.1.0, *Service-Level Agreement* (bitol-io.github.io/open-data-contract-standard), read 5 November 2026.
- Joe Reis and Matt Housley, *Fundamentals of Data Engineering* (O'Reilly, 2022), *Storage*.
- DAMA International, *DAMA-DMBOK: Data Management Body of Knowledge*, 2nd edition (2017), *Data storage and operations*.
