# Master and reference data · Which value wins: script

*The script of Film 3 of 9 in the series on master and reference data, working title The same one, everywhere: about 6 minutes, in ten chapters, in English. Drafted on 17 October 2026, from the approved plan for the series' films, and built on 17 and 18 October; [Built](#built) lists what changed on the way. The title card follows chapter 1; the end card follows chapter 10. Made to read on a phone, like the rest of the series: on-screen text at least 28 px in the frame, and the camera moves in on whatever the narration is about.*

## The promise

Every line passes two tests: anyone who has ever corrected their name on a form can follow it, and an experienced master data manager finds nothing wrong in it. *Who is it?* linked Linh's records to one person. Now their values disagree: four ways of writing her name, four emails, two mobile numbers, two birth dates. One order for every field, hidden in the SQL, can't get all of them right, and "the newest wins" is worse when a system sends everything again. A rule for each field, declared where everyone can read it, does: trust by source, then the newest confirmed value, then the most complete; a steward who can review and pin; a source and a date beside every value; and a dry run before a rule changes. **The rule is declared, not hidden in the SQL.**

## The story in one paragraph

In December 1831, HMS Beagle leaves Plymouth to sail around the world. At sea, a ship knows how far east or west it is from the time at home, kept by clocks, and clocks drift; with two that disagree, nobody can tell which is wrong. So the Beagle carries twenty-two. Each one's drift is measured in port and written down, the two thought best are the standards, and the others are checked against them. Which clock to trust is decided before the clocks disagree. Today, at the university, Mei's office has linked Linh's five records: one person. But the person needs one name, one birth date and a way to reach her, and her records don't agree. The university's model already picks one value, for one role: the student system first, then the learning platform, then short courses, one order for every field, inside the SQL. The quick fix, "the newest wins", makes it worse: HR sends its whole file again every teaching period, so HR's typo becomes her birth date, her old mobile comes back, and her transcript would print her name as HR typed it. Her legal name is Nguyễn Thị Linh, family name first, with its accents, as on her passport; she goes by Linh, a name she set herself; both are hers, for different things. So Jun writes the rules down, field by field, in the model's YAML: each field has the source it trusts most, like the Beagle's standards; a different birth date from another system waits for Mei, who pins the right one; her mobile is the newest she confirmed, not the newest sent; and dbt turns the rules into the SQL and the tests. Her four emails are each for something, so each is kept as a contact point with its purpose, its source and the day she last confirmed it. Every value in her record now says where it came from, which rule chose it and how old it is. When the alumni office asks for a new rule, a dry run lists the 1,284 values it would change before the registrar approves it. A bank and a shop face the same question. In 1836 the Beagle comes home, its clocks out by thirty-three seconds after five years around the world.

## What each object stands for

| Object | Stands for |
|---|---|
| Twenty-two boxed clocks in a cabin, each ticking at its own rate | Many sources for one value, each with its own errors |
| A rate book, each clock's daily gain or loss written in it | What's known about each source's quality, written down in advance |
| Two clocks ringed in gold, "standard" | The sources trusted most, chosen before anything disagrees |
| A pencil tick for every other clock, checked against the standards | Every value checked against the trusted ones |
| Linh's white figure and five records in their role colours, joined by a gold decision | Records linked to one person (*Who is it?*) |
| Her record, a sheet of fields (legal name, preferred name, birth date, mobile, email) | The master record: one value per field, for the person |
| Values carried from each record into her fields, each a dot in its source's colour that opens into its tag | Candidate values, disagreeing, each labelled with its source |
| A code card with one `coalesce` line, numbered 1, 2, 3 | One order for every field, for one role, hidden in the SQL |
| HR's card sending its whole file again, "Feb 2026", "Jul 2026" | A source that re-sends its whole file, so its values always look new |
| A transcript showing "Linh Nguyen · born 14 May 2001", crossed in red | What "the newest wins" does to the documents that matter |
| A name card, NGUYỄN Thị Linh, with "family name", "middle name", "given name" under each part | A legal name in its own order and script |
| A passport, ticked | The check that makes a source trusted for a field |
| A second card, "Linh", set by her | A preferred name: the person as a source |
| A YAML card, typing one field's rule at a time | Survivorship declared per field, in the model's metadata |
| A gold pin on the birth date, "until Oct 2027" | A steward's pin: a value held, with a reason, until a date |
| A chain of three chips: trust, newest confirmed, most complete | The default order when a field's own rule can't decide |
| An arrow from the YAML to an SQL card and two test chips | dbt writing the SQL and the tests from what's declared |
| One "email" cell, too small for four emails | One column for a thing a person has several of |
| Four contact point cards, each with a purpose, a source and a confirmed date | Contact points by purpose |
| Each value's label: source, rule, age; the others one click away, "not chosen, still kept" | Provenance, and the runners-up kept |
| A dry run sheet, "1,284 values would change", with Linh's row | A rule change shown before it runs |
| Mei's gold tick on a sample; a stamp, "approved · the registrar" | A steward checks; the owner approves |
| A bank statement and a phone app; a billing address and a delivery address | The same question elsewhere |
| The Beagle coming home; "33 seconds" | Rules decided early and checked often are what make the answer trustworthy |

## The look

The series' watercolour (*One person, many roles*, [reference frames](../look/)): daylight washes on warm paper, pencil lines, and colour that always means something.

- **Each source wears its role's colour.** The student system is the student's teal, HR the tutor's violet, the research office the researcher's coral, the alumni office the alumna's green. A value carries a small tag in its source's colour, so a field reads at a glance as a mix of sources. Linh as a source (self-service) is the white of the paper in a pencil line, as she is the person.
- **The past is the same watercolour.** Plymouth Sound in December 1831: a pale winter sky, a grey-green sea, the wooded headland of Mount Edgcumbe, and the Beagle at anchor, a three-masted barque with its sails furled. Its chronometer cabin: honey-coloured wood, a stern window full of sea light, two rows of boxed clocks, and a rate book in brown ink. In October 1836 the sea comes back in warmer light, at Falmouth, with its town and its autumn woods in the same soft dabs as Plymouth's.
- **Code is ink on a paper card**, in the mono face, at 28 px or more after the camera's zoom, one field's rule at a time.
- **Names are drawn in their own script.** Her legal name keeps its accents (Nguyễn, Thị): the film embeds the Vietnamese letters of its sans face, so nothing falls back to another font.
- **People**: Linh in pencil, and as the white figure of the person; Mei (gold, the business side) and Jun (cyan, the technical side), edged in their side's colour. The registrar is not drawn: their approval is a stamp, so each action has one person doing it.
- **Red ink** marks the error, as in the rest of the series.

## Script

### 1 · Twenty-two clocks · 0:00–0:47

**Narration.** Plymouth, December 1831. HMS Beagle is about to sail around the world. At sea, the time back home tells a ship how far east or west it has come. So it carries clocks. And clocks drift. With two that disagree, you can't tell which one is wrong. The Beagle carries twenty-two. In port, each one's drift is measured and written down. The two thought best are the standards, and the others are checked against them. Which clock to trust is decided before the clocks disagree.

**Picture.** Plymouth Sound in winter watercolour, "December 1831 · Plymouth" in the corner; the Beagle at anchor, a tag "HMS Beagle". A card comes down with the sun at noon, "noon here · 12:00", and the home clock, "home time · 3:20 pm"; between them, "3 h 20 min · 50° west". The home clock runs ahead as it drifts (3:21, 3:23, 3:24 pm), and a second clock joins it at 3:16 pm, beating out of step, with a pencil question mark between them: "which is wrong?". Inside the cabin: twenty-two boxed clocks are set on two shelves, "22 clocks", each beating at its own rate. A rate book opens and writes itself in brown ink: "daily rates · Dec 1831", *A · loses 1.6 s*, *B · gains 0.8 s*, *K · gains 0.4 s*, and more. Two clocks are ringed in gold, "standard", and every other clock gets a pencil tick, checked against them. The book shuts, "rates" on its cover: "decided before they disagree". Wordless breather on the ticking cabin, then the title card, *Which value wins*, "a rule for each field, and who says so".

**On screen.** December 1831 · Plymouth · HMS Beagle · noon here · 12:00 · home time · 3:20 pm · 3 h 20 min · 50° west · which is wrong? · 22 clocks · daily rates · Dec 1831 · A · loses 1.6 s · B · gains 0.8 s · K · gains 0.4 s · standard · rates · decided before they disagree · The same one, everywhere · Which value wins · a rule for each field, and who says so · Film 3 of 9 · master and reference data

### 2 · Linked, and still different · 0:47–1:14

**Narration.** Today, at the university. Linh's five records are linked now: Mei's office decided they're one person. So the person needs one name, one birth date, and a way to reach her. But her records don't agree. Four ways of writing her name. Two birth dates. Two mobile numbers. Four emails. Which value wins?

**Picture.** The campus, "today · the university". Linh's white figure, banded in her roles' colours, her five records beside her in their sources' colours (the student system's two, *S-17142 · bachelor's · 2019–22* and *S-20436 · master's · from Jul 2025*; the alumni office's; HR's, *E-4417 · casual tutor*; the research office's, *R-3082 · a project · 2026*), joined to her by dotted lines, and a gold tag, "one person · decided by Mei's office". Her record, "the person", a sheet of empty fields, comes in beside them. As each count is said, that field's values are carried over from their records, each as a dot in its source's colour that opens into its tag in the field: four names (*NGUYỄN Thị Linh*, *Nguyen Thi Linh*, *Linh Nguyen*, *L. Nguyen*), two birth dates (*14 Mar 2001*, *14 May 2001*), two mobiles (shown only by their last digits), four emails. "Which value wins?" is written in the sheet's corner in pencil.

**On screen.** today · the university · Linh · student system · S-17142 · bachelor's · 2019–22 · S-20436 · master's · from Jul 2025 · alumni office · graduated 2022 · HR · E-4417 · casual tutor · research office · R-3082 · a project · 2026 · one person · decided by Mei's office · the person · name · birth date · mobile · email · NGUYỄN Thị Linh · Nguyen Thi Linh · Linh Nguyen · L. Nguyen · 14 Mar 2001 · 14 May 2001 · ••• 038 · ••• 172 · four email addresses · which value wins?

### 3 · One order, hidden in the SQL · 1:14–1:56

**Narration.** The university's model already picks one. For the learner, it takes the student system first, then the learning platform, then short courses. One order, for every field, inside the SQL, where the people who own the data can't see it. For the person, the quick fix is to let the newest value win. But HR sends its whole file again every teaching period, so its values always look new. Her birth date becomes HR's typo, and her old mobile comes back. Her transcript would print her name as HR typed it. Newest isn't truest.

**Picture.** A code card from the example project, `int_learner_timeline.sql`: its comment at line 166, "one value per attribute: the student system first, then the learning platform, then short courses", and its `coalesce` lines, 173 and 174, the three sources numbered 1, 2, 3 as they're named. A pencil ring takes in both lines, "one order · every field", and a badge reads "in the SQL". Mei Tanaka, of the registrar's office, gold-edged, stands outside the card with a question mark: the rule is there, but not where she can read it. Then her record again, under a dashed rule card, "newest wins". HR's violet card, "sends its whole file", and two files slide out from behind it, "Feb 2026" and "Jul 2026"; HR's values take the fields: *Linh Nguyen*, *14 May 2001*, *••• 172* and the staff email. A low pulse rises. Red pencil rings the birth date, "typo", and the mobile, "old". A transcript slides in, "Linh Nguyen · born 14 May 2001", the name ringed in the record, and is crossed in red. Pencil: "newest isn't truest". The pulse fades.

**On screen.** int_learner_timeline.sql · 166 · one value per attribute: the student system first, then the learning platform, then short courses · 173 · 174 · 1 · 2 · 3 · one order · every field · in the SQL · Mei Tanaka · registrar's office · ? · the person · newest wins · HR · E-4417 · sends its whole file · Feb 2026 · Jul 2026 · typo · old · Transcript · Linh Nguyen · born 14 May 2001 · newest isn't truest

*The code is the example project's own (`models/intermediate/student/int_learner_timeline.sql`, lines 166, 173 and 174), shown with its third source elided.*

### 4 · Two names, both hers · 1:56–2:33

**Narration.** Her legal name is Nguyễn Thị Linh: family name first, with its accents, as on her passport. The student system checked it when she enrolled. Her old record lost the accents, and HR turned it round: Linh Nguyen. The name she goes by, Linh, she set herself. Both are hers, for different things. Her transcript carries her legal name. Her class lists and her ID card, the one she chose. So the person keeps two names, and each needs its own rule.

**Picture.** A large name card, *NGUYỄN Thị Linh*, its accents ringed in pencil, and under each part, *family name*, *middle name*, *given name*. A passport (no country's emblem) opens beside it, and a teal tick lands: "checked · student system · Jul 2025". Below, two cards: *Nguyen Thi Linh* ("alumni office · 2019 record"), with pencil rings where the accents went; and *Linh Nguyen* ("HR · 2023"), with a pencil arrow swapping its two words. A white card, *Linh*, "preferred · set by Linh". The two variants step back; a transcript (*NGUYỄN Thị Linh*) joins the legal name, and a class list and an ID card (*Linh*) the preferred one. Last, a tag on each name, "legal name" and "preferred name", each with a dashed chip, "rule?".

**On screen.** NGUYỄN Thị Linh · family name · middle name · given name · checked · student system · Jul 2025 · Nguyen Thi Linh · alumni office · 2019 record · Linh Nguyen · HR · 2023 · Linh · preferred · set by Linh · Transcript · Class list · ID card · legal name · preferred name · rule?

### 5 · A rule for each field · 2:33–3:29

**Narration.** So Jun writes the rules down, field by field, in the model's YAML. Like the Beagle's standards, each field has the source it trusts most. Her legal name, from the student system, which checked her passport. Her preferred name, from Linh herself. Her birth date, from the student system. If another system sends a different one, it waits for Mei. HR's still has the typo, so Mei pins the right one, with a reason, until next year. Her mobile: the newest one she confirmed, not the newest one sent. Every other field falls back on the same order: the most trusted source, then the newest confirmed value, then the most complete. And dbt turns the rules into the SQL, and into tests that check them.

**Picture.** Jun Park, analytics engineer, cyan-edged, in the office's windowless corner; a YAML card, `_core_person__models.yml`, in the middle; her record on the right. One field's rule types in at a time, and the ones before fold to a line each: `legal_name` with `trust: [student_system]` and `checked_against: passport`; `preferred_name` with `trust: [self_service]`; `birth_date` with `trust: [student_system]` and `others: review`; `mobile` with `rule: newest_confirmed`. On "like the Beagle's standards", the trusted value in each field is ringed in gold, as the standards were. As each rule is typed, its winner takes the field in its source's colour and its label appears: *NGUYỄN Thị Linh* ("student system · trusted source", the other three names folded behind "+3"), *Linh* ("set by Linh · self-service"), *14 Mar 2001* (teal), *••• 038* ("confirmed Jul 2025"), while *••• 172* shows "confirmed 2023 · sent Jul 2026" and stays below. HR's *14 May 2001* stays below its field with an amber "waits for Mei"; Mei's gold pin lands on *14 Mar 2001*, "pinned by Mei · until Oct 2027", and HR's "has a typo" in red. A chain of three chips at the foot: *trusted source → newest confirmed → most complete*. Then the record makes way for two cards, joined to the YAML by arrows and a "dbt" tag: "SQL, written by dbt" (`min_by(legal_name, trust_rank) filter (where legal_name is not null) as legal_name,`) and "tests" ("✓ every value has a source", "✓ legal name only from a trusted source"). Wordless breather on the rules, written and tested.

**On screen.** Jun Park · analytics engineer · _core_person__models.yml · columns · legal_name · trust: [student_system] · checked_against: passport · preferred_name · trust: [self_service] · birth_date · others: review · mobile · rule: newest_confirmed · student system · trusted source · +3 · set by Linh · self-service · waits for Mei · pinned by Mei · until Oct 2027 · has a typo · confirmed Jul 2025 · confirmed 2023 · sent Jul 2026 · trusted source · newest confirmed · most complete · dbt · SQL, written by dbt · tests · every value has a source · legal name only from a trusted source

*The YAML is drawn as the series will add it to the example project (dbt 1.10 and later keep a column's `meta` under `config`), and the SQL is what a macro reading it would write; see* Where it comes from in the project.

### 6 · Four emails, each for something · 3:29–4:02

**Narration.** An email column holds one email. Linh has four. Her student email, for her studies. Her staff email, for her tutoring. A personal one from 2019, and a newer one from her application. None of them is wrong. Each is for something. So each is kept as a contact point: its purpose, its source, and the day she last confirmed it. HR writes to her staff email. The alumni office, to a personal one.

**Picture.** A single table cell headed `email` with one address in it; the other three slide in and stop at its edge. The cell gives way to four contact point cards, each arriving as it's named, with its address (mono), a purpose chip (*study*, *work*, *personal*, *personal*), its source in its colour, and "confirmed Jul 2025", "since Feb 2023", "confirmed 2019", "confirmed Jul 2025", under the heading "contact points". On the first card, its purpose is ringed, and its source and its day underlined. Two small cards at the side: HR's, "writes to work", joined to the staff address; the alumni office's, "writes to personal", joined to the 2019 personal address, which a pencil line underlines.

**On screen.** email · linh.nguyen@student.uni.example · linh.nguyen@uni.example · linh.nguyen2001@mail.example · linh.nguyen@mail.example · study · work · personal · student system · HR · alumni office · confirmed Jul 2025 · since Feb 2023 · confirmed 2019 · contact points · writes to work · writes to personal

### 7 · Every value, with its source · 4:02–4:28

**Narration.** Now each value in Linh's record says where it came from, which rule chose it, and how old it is. The values that lost are still there, one click away. So if anyone asks why her record says 14 March, the answer is right there. Her transcript, her class list and the alumni office all read from it.

**Picture.** Her record, complete: each field's value with its label, *student system · trusted source · Jul 2025*, *Linh · self-service · Aug 2025*, *student system · pinned by Mei · until Oct 2027*, *student system · newest confirmed · Jul 2025*, and for email, "4 contact points · each by its purpose". The record steps aside, and a click on "+3" opens a dashed fold, "not chosen, still kept": the three other names, greyed, each with its source. A pencil line underlines the label of *14 Mar 2001*. Three cards line up to the right, "Transcript · legal name", "Class list · preferred name" and "Alumni office · personal email", each joined to its field by a dotted line.

**On screen.** the person · legal name · preferred name · birth date · mobile · email · student system · trusted source · self-service · pinned by Mei · until Oct 2027 · newest confirmed · Jul 2025 · Aug 2025 · 4 contact points · each by its purpose · +3 · not chosen, still kept · Nguyen Thi Linh · alumni office · Linh Nguyen · HR · L. Nguyen · research office · Transcript · Class list · Alumni office · personal email

### 8 · See it before it changes · 4:28–4:57

**Narration.** Rules change too. The alumni office asks for a new one: for personal email, the one people confirmed most recently. Before it runs, a dry run lists every value it would change. 1,284, Linh's among them. Mei checks a sample, and the registrar, who owns the data, approves. Then it runs, as version two, with its date.

**Picture.** Mei Tanaka, of the registrar's office, by the window. The rule as it is, "personal email · trusted source · v1". The alumni office's card, typed: "personal email: the one confirmed most recently". A new rule card, dashed, "personal email · newest confirmed · v2 · draft", with v1 stepping back behind it. A dry run sheet draws in, three rows listed, Linh's first and lit: *Linh Nguyễn · linh.nguyen2001@mail.example → linh.nguyen@mail.example*, then Sara Lind and Kofi Asante; "1,284 values would change", "and 1,281 more". Mei's gold ticks land on the rows she samples; a stamp, "approved · the registrar". The rule card turns solid: "v2 · from 2 Nov 2026", with v1 behind it.

**On screen.** Mei Tanaka · registrar's office · personal email · trusted source · v1 · alumni office · personal email: the one confirmed most recently · newest confirmed · v2 · draft · dry run · Linh Nguyễn · Sara Lind · Kofi Asante · → · 1,284 values would change · and 1,281 more · approved · the registrar · v2 · from 2 Nov 2026

### 9 · Elsewhere · 4:57–5:20

**Narration.** A bank knows two names too. Statements carry the account holder's legal name. The app greets them by the one they chose. A shop keeps a billing address and a delivery address, each for something. Different places, the same question: which value, for what, and who says so.

**Picture.** Two panels. A bank, in its blue: a statement, "account holder · NGUYỄN THỊ LINH", and a phone, "Hi, Linh". A shop, in its orange, while the bank steps back: an order with "billing address · 7 Hill Road · checked with the card", tagged "for paying", and "deliver to · Building 4, the university · this order", tagged "for this parcel". Under both, three tags, one after another: *which value* · *for what* · *who says so*.

**On screen.** a bank · Statement · account holder · NGUYỄN THỊ LINH · Hi, Linh · a shop · Order · billing address · 7 Hill Road · checked with the card · for paying · deliver to · Building 4, the university · this order · for this parcel · which value · for what · who says so

### 10 · Thirty-three seconds · 5:20–5:55

**Narration.** In October 1836, the Beagle came home. After five years around the world, its clocks were out by just thirty-three seconds. Which clock to trust was settled before they disagreed, and checked at every port. Linh's rules work the same way: written down before her records disagree, and tested every night. The rule is declared, not hidden in the SQL.

**Picture.** The sea again, warmer, "October 1836 · Falmouth": the Beagle under sail, coming in past the town and the autumn woods. A card with a clock: "five years, around the world · out by 33 seconds". The rate book, "rates", is set down in the sky, and seven ticks land one after another along a dotted line, "checked at every port". The book is carried across the cut onto the paper, "the Beagle's clocks", beside Linh's YAML card, "Linh's rules", and a tick lands on "tested every night". The cards step back for the last line, which settles onto the end card. Wordless breather. End card.

**On screen.** October 1836 · Falmouth · five years, around the world · out by 33 seconds · rates · checked at every port · the Beagle's clocks · _core_person__models.yml · Linh's rules · tested every night · The rule is declared, not hidden in the SQL. · Which value wins · The same one, everywhere · Film 3 of 9 · Learning Data

## Pause and think

Four questions, one at the end of each of four chapters, as the site shows them (`site/assets/which-value-wins/think.en.js` and `think.es.js`):

1. *After chapter 3, One order, hidden in the SQL.* The quick fix lets the newest value win. Why does Linh's birth date become HR's typo? (HR sends its whole file again every teaching period, so its values always look newest, typo included: newest means the last one received, not the last one confirmed.) It ends by asking which of the viewer's systems sends its whole file again every night.
2. *After chapter 5, A rule for each field.* HR sends a birth date that differs from the student system's. What does Jun's rule do? (The student system's value stays, and HR's waits for Mei, who can pin the right one with a reason, until a date.) It ends by asking which field in the viewer's data they would trust to one source only.
3. *After chapter 6, Four emails, each for something.* Linh has four emails. Why doesn't one of them win? (None of them is wrong: each is for something, so each is kept as a contact point with its purpose, its source and the day she last confirmed it.)
4. *After chapter 8, See it before it changes.* The alumni office asks for a new rule for personal email. What happens before it runs? (A dry run lists every value it would change, 1,284 of them; Mei checks a sample, and the registrar, who owns the data, approves.)

## Labs (candidates)

- **Which value wins?** Five fields, each with three or four candidate values and their sources and dates; pick the winner under a given rule, then change the rule and see what moves.
- **Write the rule.** For six fields, choose trust, newest confirmed or most complete, and the order of sources; the lab runs it on twenty people and shows who ends up wrong.
- **Newest isn't truest.** A source that re-sends its whole file; watch "newest wins" take every field, then switch to "newest confirmed".
- **Dry run.** Propose a rule change, read the list of what it would change, and decide whether to approve it.

## Where it comes from in the project

| On screen | In the example project |
|---|---|
| One order for every field: "the student system first, then the learning platform, then short courses" | `models/intermediate/student/int_learner_timeline.sql`, lines 166, 173 and 174; `models/core/student/_core_student__models.yml`, line 71 (`full_name`'s description) |
| A system's version recorded last wins | `models/core/student/_core_student__models.yml`, `LIM-STU-03`; and `LIM-STU-07`: platform dates are the day a change was recorded, not the day it happened |
| Linh, `S-20436` | `data/student_system/learners.csv` |
| Her legal name with its accents and middle name, her preferred name, her four emails and two mobiles, HR's typo | Invented for the film; the project's student system holds her as "Linh Nguyen" |
| The person's model, `core_person`, and its YAML (`_core_person__models.yml`), with survivorship in each column's `meta` | New: the series adds the person (*One person, many roles*); film by film, its rules come with this film |
| The SQL "written by dbt" and its tests | New: a macro that reads each column's `meta` and writes the SQL, and generic tests that read the same rules |
| Contact points, each with a purpose, a source and a confirmed date | New: a contact point table the series adds to the project |
| HR, the research office and the alumni office | New: the small sources the series adds (*One person, many roles*) |
| The decision that the five records are one person | `seeds/reference/student/learner_identity_decisions.csv`, grown into a person queue (*Who is it?*) |

## Rigour to check before recording

- **The Beagle's clocks.** The second voyage left Barn Pool, Plymouth Sound, on 27 December 1831, and anchored at Falmouth on 2 October 1836 (Wikipedia, *Second voyage of HMS Beagle*, read 17 October 2026). It carried 22 chronometers, six of them FitzRoy's own, kept in sawdust in a cabin of their own; at Devonport their rates were checked and recorded before they were issued; the Admiralty's instructions had the ship stop for "a four-day rating of the chronometers" at set points (Wikipedia, *Ship's chronometer from HMS Beagle* and *Second voyage*, read 17 October 2026). The Admiralty issued a third chronometer because "a ship with two was no better off than with one since a faulty instrument could not be identified" (*Ship's chronometer from HMS Beagle*). The two standards were "the two supposed to be the best", and chronometer K was compared with them before and after each use (Martyn Downer's sale notes for chronometer K, and Wikipedia, *List of chronometers on HMS Beagle*, both read 17 October 2026). The Astronomer Royal, John Pond, reported on the best instruments, which were reserved for the voyage (Royal Museums Greenwich, press release on the pocket chronometer from the Beagle voyage, read 17 October 2026). The chain of meridian distances around the world closed with a total discrepancy of 33 seconds (*List of chronometers on HMS Beagle*; allatsea.co.uk, quoting the same press release). The film says "measured in port", "the standards" and "checked against them", and never claims a daily comparison of every clock, which only an auction footnote could confirm (Bonhams, not readable on the day).
- **Longitude from time.** One hour of difference from home time is 15 degrees of longitude, so 3 hours 20 minutes is 50 degrees; the card's example is a sum, not a place.
- **Names.** Vietnamese names run family name, middle name, given name; about 40% of Vietnamese people are named Nguyễn; Thị is a common middle name for women; people are addressed by their given name; and in English-speaking countries the order is often reversed (*The Cultural Atlas*, Vietnamese culture, naming, read 17 October 2026). Her capitalised family name follows passports and many forms; it's a convention, not a rule of the name. "Linh" is said "Lin", and "Nguyễn" as "Nwin", one of its common English approximations.
- **Legal and preferred names at universities.** Case Western Reserve University's registrar (preferred name policy, read 17 October 2026): rosters show the preferred name, a replacement ID card can show it, students set it themselves in the student system, and transcripts and enrolment and degree verifications use the legal name; it also warns that special characters "may not display correctly in all systems". The film's university is invented, and names none.
- **Banks.** Chase UK uses a chosen name in its app, calls and messages, and issues statements and certain documents in the legal name; TD lets customers print a chosen name on a credit card, with statements and credit reporting in the legal name (both read 17 October 2026). The film names no bank.
- **Survivorship in practice.** Source priority, recency and completeness are the common survivorship strategies in master data hubs, set per attribute; Reltio, for one, applies recency by default when no rule is set, lets a steward pin or ignore a value, and keeps every source's value beside the winner (Reltio documentation and community, read 17 October 2026). The film names no product: *A hub at work* shows one.
- **"The newest wins".** A source that re-sends its whole file looks newest by load time; recency should use when a value was confirmed or changed, which the example project already warns about for the learning platform (`LIM-STU-07`).
- **dbt.** Since dbt 1.10 (backported to 1.9), a column's `meta` sits under `config`; the project runs dbt Core 1.12. `meta` is free-form, so the survivorship keys are the project's own. `min_by` with a `filter` clause runs on DuckDB and on Databricks SQL.
- **The dry run.** A rule change listed value by value before it runs, checked by the steward and approved by the data's owner, is the change control the governance series names; 1,284 is invented, and plausible for a university's alumni.
- **Masked numbers.** Mobiles show only their last three digits, as many systems display them.

## Built

Built on 17 and 18 October 2026, from this script, in watercolour: 5 minutes 55 seconds, ten chapters, 736 words at 124 a minute (137 at most, in *Every value, with its source*), the voice 72% of a chapter at most. Every moment draws; 300 pieces of text, none under 28 px and none overlapping (`tools/legible.py --overlaps`). What changed on the way, for the series' *Decided* table:

- **Values are carried, then opened.** In *Linked, and still different*, a value flying whole from its record into a filled row piled over the values already there. Each now travels as a dot in its source's colour and opens into its tag where it lands.
- **The counts follow the sheet.** The narration counts names, birth dates, mobiles, then emails, the order of the rows, so the camera reads down the sheet once.
- **HR's file, sent again.** Two files slide out from behind HR's card, and their labels, "Feb 2026" and "Jul 2026", are drawn at full size once they land; the first draft's "sent Feb 2026" labels were 15 to 21 px and spilled off the files.
- **Words fold before their cards.** When a card folds or steps back, its words fade first, so nothing reads over a card on its way out.
- **Jun's corner has no window.** *A rule for each field* uses the office without its window, so the YAML card and her record have the wall to themselves; Mei keeps her window in *One order, hidden in the SQL* and *See it before it changes*.
- **The trusted values are ringed in gold**, as the Beagle's standards were, on "like the Beagle's standards".
- **The dry run lists people by display name**, "Linh Nguyễn": her chosen name with her family name, accents kept.
- **The bank stays in view.** In *Elsewhere* the camera stays wide while the shop is explained, so the bank's words never leave the frame.
- **Falmouth.** Its town sits low and warm, and its woods are the same soft autumn dabs as Plymouth's headland, without outlines; a castle, which read as a pasted white box, was left out.
- **One rate book, carried.** In *Thirty-three seconds*, the rate book is set down in the sky beside the Beagle and the ports are ticked one after another, "checked at every port"; the card about the 33 seconds takes turns with it. The same book is then carried across the cut to sit beside Linh's rules, and its tag arrives after it, so two books never show at once.
- **Pace.** *Every value, with its source* ran at 142 words a minute; its three holds grew to a second each (137).
- **Its own sound**, measured against the voice before mixing: a reed organ in E flat and C minor; the series' mark on a horn, 1-8-5-1 in E flat; a harp note for each source, the same all film long; E flat and B flat on the horn for the person; the sea under both harbours; and the twenty-two chronometers, each ticking where its own second hand steps. The music sits about 21 dB under the voice as it speaks and 19 dB under in the pauses; the one pulse, under HR's resent file, about 8 dB under the rest of the music. The film's soundtrack measures -16.5 LUFS, with little energy above 4 kHz (0.00012 of full scale, RMS, where the voice is silent, in the range of *The map before the data*).
- **A shared fix.** The series' wash drew a band of flat colour for some seeds (a negative remainder in `shared/src/wash.js`); *One person, many roles*' thread fixed it for the whole series, and this film dropped its workaround.
- **The poster** is Linh's five records beside her sheet of disagreeing values, as "Which value wins?" is written.
- **Spanish captions** in Latin American Spanish, with the series' words (RR. HH., la oficina de egresados, el certificado de notas) and *celular*, *simulación* for the dry run, and *la jefatura de registro* for the registrar. Two short lines run faster than the rest, "Lo más nuevo no es lo más cierto." and "Su fecha de nacimiento, del sistema de estudiantes."
- **On the site**, the kicker names the practice once, *survivorship*, which the film itself never says.

## Next

1. The author watches the film, and approves it or asks for corrections.
2. The project's additions it needs: the person's YAML with survivorship in each column's `meta`, the macro and tests that read it, and contact points with a purpose.
3. Labs, once the series has more films: the candidates above.
