# A sharper sketch

*Treatment for A Sharper Sketch, v0.1. Status: made. The film follows this treatment; see [script.md](script.md) for what changed in the making.*

## The promise

Same two audiences as *The Inner Life of Data* and *Silent change*: a newcomer understands it, and a data modeller agrees with it. This film is about modelling only: what the model says, not how the pipelines build it. The tools stay in the background. Same university, same platform, same visual world. *The Inner Life of Data* drew the sketch in five boxes and said "get it right, and every piece has its place". This film asks what "right" means, and when a simple sketch stops being precise enough.

**Logline.** Two trusted numbers disagree about how many students are enrolled in Data Science 101. To find out why, we go back to the sketch from *The Inner Life of Data* and sharpen it, one question at a time.

**Why it's worth making.** Data modelling decides whether every number downstream is right, yet most people never see it, and most material about it is either abstract notation or tool tutorials. Feedback on *The Inner Life of Data* showed its sketch is an oversimplification compared with published sector models. The film says so openly. It's the start of this story: every sketch is a simplification, good modellers add precision when a real question needs it, not before, and no model is ever finished.

## The idea at the heart of it

**Add precision when a question can't be answered in only one way.** *The Inner Life of Data*'s sketch was fine for "which classes fill up first?". It stops being fine the moment two people read it and count differently. Each chapter is one of those moments, and each one changes the sketch in a visible way.

**Models evolve, naturally and constantly, even if not often.** A data model isn't drawn once and framed. It changes when the business asks a new question, when the business itself changes (a new status after a system upgrade, as in *Silent change*; a new kind of course), and when the reference model is updated (TCSI publishes its specifications for each reporting year). Most weeks nothing changes; then one question shows the model is out of date. That's normal, not failure. A healthy model is versioned like code, reviewed with the business, and every change is recorded.

**And before you draw, check a reference model.** Most questions a university asks of its data, others have already modelled. A good modeller doesn't start from a blank page: they check a published reference model, adopt it where it fits the actual business, extend it where the business differs, and write down each difference and why. This is the film's second thread. In every chapter, before the sketch changes, the team lays the reference model over it and asks: has someone already solved this?

## The reference model: TCSI

The film uses one public, well-known model as its reference: the Australian Government's **Tertiary Collection of Student Information (TCSI)**, the data every Australian university reports about its students. It's free to read at [tcsisupport.gov.au](https://www.tcsisupport.gov.au/), and it fits the story, because the census date sits at its centre, as it does in *The Inner Life of Data*.

TCSI is a reporting standard, not a full institutional model, so the film uses it for the core shape and adds the one thing it leaves out (the timetabled class). The rules the film relies on, checked on 26 September 2026:

| TCSI rule | Element | Used in |
|---|---|---|
| A **course admission** is one student in one course from one commencement date: student, course and commencement date are unique together | Course admission packet; E313, E307, E534 | Chapter 4 |
| A **unit enrolment** is unique by course admission, unit of study code and census date | Unit enrolment packet; E354, E489 | Chapters 2 and 3 |
| The **census date belongs to the unit of study**, not to a term | E489, Unit of study census date | Chapter 3 |
| Every unit enrolment links to a course admission, and must count towards that course | Unit enrolment packet | Chapter 4 |
| A unit enrolment has a **status**, such as withdrew without penalty, which is amended when a student withdraws | E355, Unit of study status code | Chapter 5 |

**The sharper sketch, in plain words** (what the film ends on):

- **Student** 1–\* **Course admission** \*–1 **Course**
- **Course admission** 1–\* **Unit enrolment** \*–1 **Unit offering** (unit of study + census date) \*–1 **Unit**
- **Unit offering** 1–\* **Class** (timetabled activity: institutional, not in TCSI)
- **Unit enrolment** has a status, with a history of changes

**How the film fits it to the business.** The practice has four steps, and the film shows each one:

| Step | What it means | In the film |
|---|---|---|
| **Check** | Before inventing a concept, look for it in the reference model | Each chapter lays the reference over the sketch before it changes |
| **Adopt** | Where the reference fits the business, use its concepts, rules and names | Course admission, unit enrolment, census date on the unit, unit status (chapters 2 to 5) |
| **Extend** | Where the business needs more than the reference holds, add it, in the reference's style | Class, the timetabled activity (chapter 2); a full status history, where TCSI reports the current status (chapter 5); Unit offering as a named entity, where TCSI identifies it by unit code and census date |
| **Record** | Write down every difference and why, so the next person can see what is standard and what is ours | A short fit register in the catalog (chapter 7) |

A reference model is a starting point, not a cage: adopting it blindly is as risky as ignoring it. It fits here because TCSI describes the same business the university runs. Where the business is genuinely different, the business wins, and the difference is recorded.

The film names TCSI in chapter 7 and in the sources, and uses everyday words on screen ("course admission", "unit enrolment") with the element codes kept to the rigour sheet.

**Customising for internal videos.** The chapters don't depend on TCSI. To use your own model, replace the table above with your entity names and rules, change the on-screen labels in chapters 2 to 7 and the "Map the words" lab, keep the same four questions (what is one row, where does each attribute live, which relationships need their own entity, and what changes over time), and keep the check, adopt, extend and record steps, with your own fit register. Other public models that would work the same way: CEDS in the United States (public domain), HESA Data Futures in the UK, and 1EdTech OneRoster for learning systems.

## Where the sketch in *The Inner Life of Data* falls short

This is the starting point, and the reason for the film. *The Inner Life of Data*'s "right sketch" (`ui3.js`, `script.md`) is:

> Student 1–\* Enrolment \*–1 Class \*–1 Term (census date), and Student \*–1 Course.

| Simplification in *The Inner Life of Data* | What sector practice does | Chapter |
|---|---|---|
| "Class" means the subject, its run in a term, and the Tuesday 9 am session, all at once | Unit (the curriculum), unit offering (a unit in one teaching period, place and mode), and class (a timetabled activity) are separate | 2 |
| The census date sits on Term | The census date belongs to the unit of study, and is part of what identifies each unit enrolment (TCSI E489) | 3 |
| A student belongs to one course | A student can hold several course admissions (double degrees, transfers, a second course); each unit enrolment links to one of them (TCSI course admission packet) | 4 |
| Enrolment has no history | Unit enrolments carry a status that changes, for example on withdrawal (TCSI E355); the census count is a snapshot at a date, not today's state | 5 |

## The structure: zooming into the sketch

*The Inner Life of Data* moved downstream, *Silent change* upstream. This one moves *inward*: the camera stays on the sketch and zooms in, like a map that gains detail as you get closer. Each zoom is triggered by a disagreement. Before the sketch changes, the reference model slides over it like tracing paper; the team adopts what fits, extends what doesn't, and the two numbers move closer together.

**The spine: one question, two answers.** The Head of School asks Genie how many students were enrolled in Data Science 101 on census date. Genie says 131. The certified census report says 118. Both are built from clean, tested data. The difference is meaning.

| Chapter | What happens | What it teaches |
|---|---|---|
| **0. The sketch we drew** | A short recap of *The Inner Life of Data*: five boxes, the wrong sketch and the right one, 98% class fill. The voice says it plainly: "That sketch was an oversimplification. Good enough to start, not good enough to count." A small version stamp appears in the corner: *sketch v1*. | A conceptual model is a simplification by design, and oversimplifying is easy. Say so when it happens. |
| **1. Two numbers** | Genie says 131; the census report says 118. Both certified, both tested. The tests pass because each is correct for its own reading of the sketch. | Clean data can still disagree. Tests check rules, not meaning. |
| **2. What is a class?** | The reference is laid over the sketch: it has no "class", only units of study and unit enrolments. The Class box splits into three: Unit (Data Science 101, the curriculum), Unit offering (Data Science 101, Semester 1, city campus, on site), and Class (Tuesday 9 am tutorial). Genie counted tutorial places; some students sit in two. Class is ours: an extension, recorded. | Grain: say exactly what one row stands for. Enrolment belongs to the offering; class allocation is separate. Check the reference first. |
| **3. Whose census date?** | The reference shows the census date on each unit enrolment. The census date slides off Term and onto Unit offering. A summer intensive of the same unit has its own census date, weeks from the semester's. | Put an attribute on the thing it truly describes. Teaching period and census date are related but not the same. Adopt the reference where it fits. |
| **4. One student, two courses** | A double-degree student appears twice in one count. The reference already has the answer: a course admission. The box appears between Student and Course, and each unit enrolment points to the course it counts towards. | Many-to-many relationships need their own entity. Identity and keys: one person, one student ID, several course admissions. |
| **5. Enrolled when?** | *Silent change*'s `WAITLISTED` student returns. The enrolment gains a status history: enrolled, waitlisted, withdrawn, each with a date. The census count is a snapshot at census date; Genie was counting today. The reference keeps the current status; the business needs the history, so the model extends it. | Time in models: current state versus history, effective dates, and snapshots. The definition "still enrolled on census date" now has something precise to point at. |
| **6. Three levels of precision** | The same sketch shown three ways, like a map zooming in: the conceptual model (boxes and relationships, for the business), the logical model (each entity's identifier, attributes and cardinality), and the physical model (tables in the lakehouse). A brief glimpse at the end: the physical tables can take different shapes for different uses, such as a star, or one wide row per student. "How to build those is a story for another film." | Conceptual, logical, physical: the same meaning at three levels of detail. The business owns the first; engineers own the last; all three must agree. |
| **7. Check, adopt, extend, record** | The tracing paper lifts away, and we see the whole fit: most boxes match the reference (TCSI), a few are ours, each with a note. Local words (class, subject, module, paper) are mapped to the reference's: "unit of study", "course admission", "unit enrolment". Code sets for status and mode come from reference data, not free text. The fit register and the sharper sketch feed the catalog and Genie Ontology. | Check a reference model before you draw; adopt it where it fits the business, extend it where it doesn't, and record every difference. A bonus: reporting to government gets easier when the model already speaks its language. |
| **8. Pull back** | Genie now asks back: "Enrolled on census date, in the Semester 1 offering?" It answers 118, and shows its definition. The version stamp turns to *sketch v2*, with a short change note. Then a new question arrives on the Head of School's phone, about short courses and microcredentials, and the stamp flickers: v3 is coming, some day. | Precision where the question needs it, and no more. Models evolve: not often, but always. Version them, and record why they changed. |

## Visual language

Reuse the world and components of *The Inner Life of Data* and *Silent change*: the sketch, tiles, vaults, paintings, Genie. The sketch becomes the stage. New objects, each with a single job:

| New object | Stands for |
|---|---|
| A box that splits like a cell | One concept becoming several (Class into Unit, Unit offering and Class) |
| A magnifier that adds detail to the sketch | Moving from conceptual to logical to physical |
| An attribute tag that slides between boxes | Putting an attribute where it belongs (the census date) |
| A thin film strip behind an enrolment | Status history over time |
| Two faint shapes in the gold vault, a star and a single wide row | Physical models can take different shapes (a teaser for the engineers' film) |
| Tracing paper that slides over the sketch | The reference model, checked before each change |
| Small pins on the sketch: blue for adopted, amber for extended | What came from the reference and what is ours |
| A bilingual dictionary on a lectern | Mapping local words to the reference's words |
| A version stamp in the sketch's corner (v1, v2) | The model evolves, and each version is recorded |

**Tone.** Curious and precise, like a good puzzle. No one was wrong: each number was right for its own reading. Music: *The Inner Life of Data*'s palette, lighter and more playful, resolving as the two numbers agree.

## Pacing

About 130 words a minute, with a natural beat after each sentence and a pause only where an idea needs to land (see [PLAYBOOK.md](../../PLAYBOOK.md) and `tools/pace.py`). Target length: 5 to 6 minutes. "Pause and think" questions come with the script, for example: "Before the box splits: what do *you* mean by a class?"

## Labs and scenarios (for Learning Data)

- **Labs:**
  - *Split the box:* drag records onto Unit, Unit offering and Class, and watch the count change.
  - *Where does it live?* Drag attributes (census date, room, credit points, mode) onto the entity they describe.
  - *Grain check:* pick the grain of a fact table and see which questions it can and can't answer.
  - *Map the words:* match local terms to standard ones.
  - *Fit check:* lay the reference over a sketch, then mark each difference as adopt, extend or keep, with a reason.
- **Scenarios:** modelling calls. Is this a new entity or an attribute? One row per what? Current state or history? Adopt the reference's name, or keep ours with a mapping? The reference doesn't match how we work: change the business, or extend the model?

## Rigour to check when scripting

To confirm against current documentation, and record in the rigour sheet with the date checked:

- **TCSI:** recheck the rules in the reference model table against the current year's packet specifications; confirm the licence for reuse of TCSI text on gov.au; confirm the E355 codes shown on screen.
- **Modelling:** conceptual, logical and physical models; grain; identifiers and relationships; effective dating for history; versioning a model and keeping a change log.
- **Databricks:** Genie Ontology's current name and scope (it appears in chapter 7).
- **HERM:** *The Inner Life of Data* names domains after HERM capability areas; check the two fit together in chapter 7.

## Parked for the engineers' film

This film stays with the business-facing model. A later deep dive for engineers can take the same sharper sketch and show how it becomes tables. Candidates, all using this film's university and entities:

- **Dimensional modelling:** a star with one fact row per student per unit offering at census date, and dimensions around it; slowly changing dimensions for history.
- **Entity-centric modelling:** one wide table per entity (Student, Unit offering) that holds its attributes and its time-bound measures as columns, so most questions about an entity are one lookup. For example, one row per student with `current_course`, `units_enrolled_this_term`, `credit_points_passed_total`, `census_enrolments_last_4_terms` (an array) and `withdrawals_last_12_months`. It's easy for people and AI assistants such as Genie to query, and it pairs well with a star underneath. Trade-offs to show: wide tables to maintain, measures defined in two places if you're not careful, and the grain of each time window.
- **The build:** keys and constraints, tests, contracts, model versions, and how status history is captured (for example, with dbt snapshots).

Rigour for that film: the origin and current practice of entity-centric modelling (popularised by Maxime Beauchemin), and Kimball's dimensional techniques.

## Decisions for the author

1. **Fix *The Inner Life of Data*, or let *A Sharper Sketch* correct it?** Options: (a) leave *The Inner Life of Data* as it is and let this film call it an oversimplification, and a natural first version of a model that will keep evolving (recommended: it's honest, and it models the behaviour the film teaches); (b) also make a small fix in *The Inner Life of Data*, such as moving the census date to the class, and add a note on its rigour sheet. Either way, *The Inner Life of Data*'s rigour sheet should say the sketch is simplified and point to this film.
2. **How much notation?** Plain boxes and crow's feet only (recommended), or show a real ERD for a moment in chapter 6.
3. **Name TCSI on screen?** Naming it grounds the film in a real, public standard; keeping it generic ("a national data standard") travels better outside Australia. Recommended: name it in chapter 7 and in the sources only.
4. **The title.** *A sharper sketch* is clear. Alternatives: *What is a class?*, *One row per what?*, *Two numbers*.
5. **The tagline.** Options: "Every model is a first draft." · "Sharpen the sketch when the question needs it." · "Say exactly what you mean, once." · "Check the reference. Fit it to the business."
6. **Entity-centric modelling in this film?** Recommended: no, beyond the one-shot glimpse in chapter 6. Explaining it well needs physical detail (columns, time windows, arrays) that pulls this film away from the business model; it gets its full example in the engineers' film.

## Next checkpoints

1. Agree this treatment and decision 1.
2. Recheck the TCSI rules for the current year.
3. Script with a rigour sheet and pacing report.
4. Five style frames: the splitting box, the tracing paper with its pins, the sliding census date, the film strip, the three levels of precision.
5. A voice test, then the first cut.
