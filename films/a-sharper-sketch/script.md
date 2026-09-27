# A Sharper Sketch: script

*Film three of Learning Data, v1. About 5 minutes 29 seconds. English. Treatment: [treatment.md](treatment.md).*

## The promise

A newcomer understands it, and a data modeller agrees with it. This film is about modelling only: what the model says, not how the pipelines build it. It shows why the first film's sketch was an oversimplification, how to sharpen a model when a real question needs it, and the practice of checking a reference model, adopting it where it fits the business, extending it where it doesn't, and recording every difference.

## What each object stands for

| Object | Stands for |
|---|---|
| Blue boxes and crow's feet | The university's conceptual model, the sketch from the first film |
| Warm, dashed boxes on tracing paper | The reference model, TCSI |
| Blue pin | A concept adopted from the reference |
| Amber pin | An extension the university adds |
| The version stamp (sketch v1, v2 draft, v2, v3?) | The model evolves, and each version is recorded |
| The comparison in the corner | Genie's number against the certified census report; it closes as the model sharpens |
| Film strip | An enrolment's status history |
| Tables in mono type | The physical model |
| The fit register | The record of every difference from the reference, and why |

## Script

### Scene 0 · The sketch we drew · 0:00–0:24

**Narration.** In the first film, we drew a sketch of the university: a student, a class, an enrolment, a term and a course. It was an oversimplification. Good enough to start, not good enough to count. That's normal. Every model starts simple, and gets sharper when a real question needs it.

**Picture.** Title card: *A Sharper Sketch*, “When a data model needs more precision”. The first film's sketch draws itself, box by box, as the narration names them: Student, Class, Enrolment, Term (census date) and Course. A version stamp reads *sketch v1*. Three amber questions appear on it: what is a class? one date for all? only one course? Below: “good enough to start” in green, “not good enough to count” in red. Breather: new records arrive and settle into the simple sketch.

**On screen.** Conceptual model · from the first film · sketch v1 · good enough to start · not good enough to count

### Scene 1 · Two numbers · 0:24–1:29

**Narration.** The day after census date, the Head of School asks Genie a simple question. How many students were enrolled in Data Science 101 on census date? Genie says 131. The certified census report says 118. Both come from clean data. Every test passed. The difference isn't in the data. It's in the meaning. So before we change anything, we ask a wider question: how does this kind of business generally work? In many industries, someone has already modelled it, and their model makes a good first template. Often there's more than one to choose from, so which one you pick, and why, matters too. For an Australian university, TCSI is a good choice: it describes the data we already report to government. It's a reference to check against, not a model to copy. We'll see where it fits our business, and where it doesn't.

**Picture.** The Head of School's question appears in a bubble beside Genie. Two cards: Genie, 131, counted from the lakehouse; Census report, 118, sent to government, certified. Both show “every test passed”. The cards fade and the simple sketch returns, with a question over it: how does this kind of business generally work? A row of published industry models appears, a first template: banking, insurance, retail, health, higher education. Then, for higher education, several candidates: TCSI (Australia), HESA Data Futures (United Kingdom), CEDS (United States) and MCDS (a sector standard): which one, and why? TCSI lights up, with the reason: it matches what the university already reports. A sheet of tracing paper slides over the sketch: the reference model, TCSI, drawn in warm ink. “A reference to check against, not a model to copy.” A comparison appears in the corner: Genie 131, Census report 118, gap 13. Breather: the reference glows.

**On screen.** Head of School · Genie 131 · Census report 118 · certified · every test passed · same data, different meaning · how does this kind of business generally work? · published industry models: a first template · reference models for higher education: which one, and why? · our choice: TCSI, because it matches what we already report · Reference model · TCSI · a reference to check against, not a model to copy

### Scene 2 · What is a class? · 1:29–2:13

**Narration.** First question: what is a class? Lay the reference over our sketch, and it has no class at all. It has units of study, and enrolments in them. Our one box was hiding three things. The unit: Data Science 101, the subject itself. The offering: that unit, in one teaching period, at one campus. This is what students enrol in. And the class: the Tuesday 9 am tutorial, a place in the timetable. Genie counted places in tutorials, and some students sit in two. So say exactly what one row stands for. That's called the grain.

**Picture.** The tracing paper slides over the sketch: it has Unit of study and Unit enrolment, and no class. The paper lifts away and the Class box splits into three: Unit (Data Science 101, blue pin: from the reference), Unit offering (Semester 1, city campus, amber pin: ours) and Class (Tue 9 am tutorial, amber pin). Enrolment becomes Unit enrolment and links to the offering. Two tutorials show the same student in each: counted twice. The corner count drops from 131 to 125. Breather: students arrive one by one and each lands once in the offering.

**On screen.** Unit · Unit offering · Class · from the reference · ours · one student, counted twice · grain: one row = one student in one unit offering · sketch v2 · draft

### Scene 3 · Whose census date? · 2:13–2:41

**Narration.** Next: where does the census date live? Our sketch put it on the term: one date for everyone. The reference records it with each unit enrolment, because each unit of study has its own census date. A summer intensive of Data Science 101 has a census date weeks away from the semester's. Put each detail on the thing it truly describes. Here, we adopt the reference.

**Picture.** The census date glows on Term: “one date for everyone”. The reference slides over: census date, with each unit enrolment. Two calendar cards: DS101 · Semester 1, census 31 Mar; DS101 · Summer, census 20 Jan. The census date slides from Term to Unit offering; Term becomes Teaching period. The count drops from 125 to 121. Breather: the two census dates pulse in turn.

**On screen.** one date for everyone · census date, with each unit enrolment · 31 Mar · 20 Jan · adopted from the reference

### Scene 4 · One student, two courses · 2:41–3:16

**Narration.** Now, two students appear twice in the count. Each is studying a double degree: data science, and business. Our sketch said a student belongs to one course. That's not how the university works. The reference already has the answer: a course admission. One student, in one course, from one start date. Each unit enrolment counts towards one course admission, so each student is counted once. When two things connect many to many, the link often deserves its own box.

**Picture.** Two students, each shown twice: counted twice. Student reads “double degree”, with Bachelor of Data Science and Bachelor of Business beside Course. The Student–Course line flashes red: one course only? The reference slides over, with Course admission lit: one student, one course, one start date. A Course admission box (blue pin) appears between Student and Course, and links to Unit enrolment. The pairs merge: each student counted once; the count drops to 119. Breather: light travels from Student through each course admission.

**On screen.** double degree · one course only? · one student, one course, one start date · each student counted once · the link gets its own box

### Scene 5 · Enrolled when? · 3:16–3:44

**Narration.** Last question: enrolled when? Genie counted today. The census report counted on census date. Enrolments change. A student is waitlisted, then enrolled, and later withdraws. The reference keeps each enrolment's current status. We need its history, so we extend the model. Each change is kept with its date, and the census count becomes a snapshot of one day.

**Picture.** Two cards: Genie counted on 26 Apr; the census report on 31 Mar. A strip of film shows one enrolment's story: waitlisted 3 Mar, enrolled 10 Mar, census date 31 Mar, withdrew 14 Apr. Unit enrolment reads “current status”; a Status change box (amber pin) appears beneath it. A flash: the census count is a snapshot on 31 Mar. The count reaches 118: match. Breather: changes keep arriving, each kept with its date.

**On screen.** Genie counted 26 Apr · Census report 31 Mar · waitlisted · enrolled · census date · withdrew · current status · ours: the history of each enrolment · census count: a snapshot on 31 Mar · match

### Scene 6 · Three levels of precision · 3:44–4:24

**Narration.** The sketch is sharper now. But it's still a sketch. This is the conceptual model: the things that matter, and how they connect, agreed with the business. Zoom in, and it becomes the logical model: what identifies each thing, its details, and how many of each. Zoom in again, and it becomes the physical model: the actual tables in the platform. Same meaning, three levels of detail. The business owns the first, engineers own the last, and all three must agree. How to build those tables is a story for another film.

**Picture.** The full sketch, labelled Conceptual model · for the business. The camera zooms into Unit enrolment and Unit offering: each gains its identifiers (marked with a dot) and details, and the line between them reads many and one: Logical model. Zoom again: two tables, unit_enrolment and unit_offering, with a few rows: Physical model. Three panels side by side: Conceptual (owned by the business), Logical (shared), Physical (owned by engineers), under “same meaning, three levels of detail”. A glimpse of two shapes, a star and one wide row per student: how to build them, another film.

**On screen.** Conceptual model · Logical model · Physical model · same meaning, three levels of detail · owned by the business · shared · owned by engineers · another film

### Scene 7 · Check, adopt, extend, record · 4:24–4:59

**Narration.** Lift the reference away, and you can see the whole fit. Check: before you invent something, look for it in a reference model. Adopt: where it fits the business, use its ideas and its words. Extend: where the business needs more, add it, in the same style. Record: write down every difference and why, so the next person knows what is standard and what is ours. A reference is a starting point, not a cage. Where the business is truly different, the business wins.

**Picture.** The tracing paper lies over the finished sketch, then lifts away. Pins appear on every box: blue where the sketch adopts the reference, amber where it extends it. Four steps light in turn: Check, Adopt (blue boxes glow), Extend (amber boxes glow), Record. The camera moves to a fit register: Unit offering, Class, Status change and Teaching period, each extended, with the reason. “A starting point, not a cage.” Breather: the pins twinkle one by one.

**On screen.** 1 Check · 2 Adopt · 3 Extend · 4 Record · Fit register · a starting point, not a cage

### Scene 8 · Pull back · 4:59–5:28

**Narration.** The Head of School asks again. This time, Genie asks back: enrolled on census date, in the Semester 1 offering? Then it answers: 118, and shows how it counted. The sketch has a new version, and a note that says why it changed. It won't be the last. Models evolve: not often, but always. Check the reference. Fit it to the business.

**Picture.** The Head of School asks again. Genie asks back, then answers 118, matching the census report, with how it counted: one row = one student in one unit offering; enrolled on census date, 31 Mar; each student counted once. The sketch returns with its note: sketch v2, what was added, why, and that it was checked against TCSI. A new question arrives: how do we count short courses and microcredentials? The stamp flickers: sketch v3? Black, then the tagline.

**On screen.** How it counted · sketch v2 · A new question · sketch v3? · Check the reference. Fit it to the business.
## Changes from the treatment

- The reference model gets its own introduction in scene 1: first ask how this kind of business generally works, then look for a published industry model as a first template, and check whether it fits. The reference is checked, not adopted automatically.
- There is often more than one reference model: scene 1 shows four candidates for higher education, and why TCSI is chosen here.
- Pauses are used sparingly: a short beat after each sentence, a few holds where an idea needs to land, and three short wordless endings, instead of a breather in every chapter.
- The music is its own: a slow, warm ambience with a sparse felt-piano motif and no beat, rather than the first film's pads and pulses.

- Chapter 7 shows the four steps and the fit register, but not the dictionary of local words or governed code sets: they made the chapter too dense.
- The film uses English only for now. The labs and scenarios proposed in the treatment are not built yet.

## Rigour sheet

Checked on 26 September 2026. The university, people, dates and numbers are fictional.

| Scene | The real practice | What the picture simplifies |
|---|---|---|
| 0 · The sketch we drew | The first film's conceptual model: Student 1–\* Enrolment \*–1 Class \*–1 Term (census date), and Student \*–1 Course. It merges unit, offering and class, puts one census date on the term, and allows one course per student. | The film calls it an oversimplification, and a normal first version. |
| 1 · Two numbers | Numbers built from the same clean, tested data can disagree when they read the model differently. Several reference models exist for higher education, with different purposes, regions and scopes: TCSI (Australian government reporting), HESA Data Futures (UK regulatory reporting), CEDS (US common education data standards, public domain) and MCDS (MortarCAPS, a sector-owned standard). TCSI is the Australian Government's collection of student data from higher education providers, published at tcsisupport.gov.au. | The 13-student gap is split across four causes for teaching; real gaps have fewer, messier causes. Genie stands for any tool that answers from the data. |
| 2 · What is a class? | TCSI has units of study and unit enrolments; it has no timetabled class. Enrolment is to a unit in a teaching period; class allocation is a separate, institutional concept. Grain is what one row stands for. | TCSI identifies an offering by unit of study code and census date, rather than naming it; the film names it Unit offering, and records that as an extension. |
| 3 · Whose census date? | TCSI element E489 is the unit of study census date, and it is part of what identifies each unit enrolment. Different offerings of a unit can have different census dates. | The film moves the census date to the unit offering. The dates 31 Mar and 20 Jan are illustrative. |
| 4 · One student, two courses | A TCSI course admission is one student, one course and one commencement date (E313, E307, E534). Each unit enrolment links to a course admission and must count towards that course. | Double degrees are modelled differently across universities; some report one combined course. The film shows two. |
| 5 · Enrolled when? | TCSI records a unit of study status (E355), which is amended, for example when a student withdraws. A history of changes, each with a date, lets the count be taken as a snapshot on census date. | Waitlisting is the university's own status, as in the second film's treatment, not a TCSI code. Status change is an extension. |
| 6 · Three levels of precision | Conceptual (things and relationships, for the business), logical (identifiers, attributes, cardinality) and physical (tables) models describe the same meaning at three levels of detail. | Two tables with a few columns stand for a full physical model. The star and the wide row are named only as shapes, for a later film. |
| 7 · Check, adopt, extend, record | Checking a published reference model, adopting it where it fits the business, extending it where it doesn't, and recording each difference is common practice. | The fit register shows four rows; a real one also records who decided and when. |
| 8 · Pull back | Genie answering with its definition, and asking a clarifying question, stands for a governed definition used by any tool. | Models change rarely but continually: new questions, business changes and reference updates (TCSI publishes specifications for each reporting year). |

## Sources

Checked on 26 September 2026.

- [TCSI Support](https://www.tcsisupport.gov.au/)
- [E489 Unit of study census date](https://www.tcsisupport.gov.au/element/489)
- [Unit enrolment packet](https://www.tcsisupport.gov.au/reporting/hestudent/requirements/unit-enrolments/unit-enrolment-packet)
- [Course admission packet](https://www.tcsisupport.gov.au/reporting/hestudent/requirements/course-admissions/Course-admission-packet)
- [E534 Course of study commencement date](https://www.tcsisupport.gov.au/element/534)
- [E355 Unit of study status code](https://www.tcsisupport.gov.au/element/355)
- [Reporting withdrawals in TCSI](https://www.tcsisupport.gov.au/support/reporting-withdrawals-in-tcsi)
