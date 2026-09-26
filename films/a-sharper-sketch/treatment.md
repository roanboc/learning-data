# A sharper sketch

*Treatment for the third film, v0.1: a draft for review before any script or picture. Status: proposal.*

## The promise

Same two audiences as the first two films: a newcomer understands it, and a data modeller agrees with it. Same university, same platform, same visual world. The first film drew the sketch in five boxes and said "get it right, and every piece has its place". This film asks what "right" means, and when a simple sketch stops being precise enough.

**Logline.** Two trusted numbers disagree about how many students are enrolled in Data Science 101. To find out why, we go back to the sketch from the first film and sharpen it, one question at a time.

**Why it's worth making.** Data modelling decides whether every number downstream is right, yet most people never see it, and most material about it is either abstract notation or tool tutorials. Feedback on the first film showed its sketch is simpler than sector standards such as the MortarCAPS Higher Learning Data Standard (MCDS). That's not a mistake to hide. It's the start of this story: every sketch is a simplification, and good modellers add precision when a real question needs it, not before.

## The idea at the heart of it

**Add precision when a question can't be answered in only one way.** The first film's sketch was fine for "which classes fill up first?". It stops being fine the moment two people read it and count differently. Each chapter is one of those moments, and each one changes the sketch in a visible way.

## Where film 1's sketch falls short

This is the starting point, and the reason for the film. Film 1's "right sketch" (`ui3.js`, `script.md`) is:

> Student 1–\* Enrolment \*–1 Class \*–1 Term (census date), and Student \*–1 Course.

| Simplification in film 1 | What sector practice does | Chapter |
|---|---|---|
| "Class" means the subject, its run in a term, and the Tuesday 9 am session, all at once | Unit (the curriculum), unit offering (a unit in one teaching period, place and mode), and class (a timetabled activity) are separate | 2 |
| The census date sits on Term | Each unit offering has its own census date, recorded with each unit enrolment | 3 |
| A student belongs to one course | A student can hold several course enrolments (double degrees, transfers, a second course); each unit enrolment counts towards one of them | 4 |
| Enrolment has no history | Enrolments change status over time; the census count is a snapshot at a date, not today's state | 5 |

## The structure: zooming into the sketch

The first film moved downstream, the second upstream. This one moves *inward*: the camera stays on the sketch and zooms in, like a map that gains detail as you get closer. Each zoom is triggered by a disagreement and ends with the two numbers closer together.

**The spine: one question, two answers.** The Head of School asks Genie how many students were enrolled in Data Science 101 on census date. Genie says 131. The certified census report says 118. Both are built from clean, tested data. The difference is meaning.

| Chapter | What happens | What it teaches |
|---|---|---|
| **0. The sketch we drew** | A short recap of film 1: five boxes, the wrong sketch and the right one, 98% class fill. A voice says: "That sketch was right. It just wasn't finished." | A conceptual model is a simplification by design. |
| **1. Two numbers** | Genie says 131; the census report says 118. Both certified, both tested. The tests pass because each is correct for its own reading of the sketch. | Clean data can still disagree. Tests check rules, not meaning. |
| **2. What is a class?** | The Class box splits into three: Unit (Data Science 101, the curriculum), Unit offering (Data Science 101, Semester 1, city campus, on site), and Class (Tuesday 9 am tutorial). Genie counted tutorial places; some students sit in two. | Grain: say exactly what one row stands for. Enrolment belongs to the offering; class allocation is separate. |
| **3. Whose census date?** | The census date slides off Term and onto Unit offering. A summer intensive of the same unit has its own census date, weeks from the semester's. | Put an attribute on the thing it truly describes. Teaching period and census date are related but not the same. |
| **4. One student, two courses** | A double-degree student appears twice in one count. A Course enrolment box appears between Student and Course, and each unit enrolment points to the course it counts towards. | Many-to-many relationships need their own entity. Identity and keys: one person, one student ID, several course enrolments. |
| **5. Enrolled when?** | Film 2's `WAITLISTED` student returns. The enrolment gains a status history: enrolled, waitlisted, withdrawn, each with a date. The census count is a snapshot at census date; Genie was counting today. | Time in models: current state versus history, effective dates, and snapshots. The definition "still enrolled on census date" now has something precise to point at. |
| **6. Three levels of precision** | The same sketch shown three ways: the conceptual model (boxes for the business), the logical model (keys, attributes, cardinality), and the physical tables in silver and gold. In gold, a star: a fact table at one row per student per unit offering, with student, unit offering, course and date around it. | Conceptual, logical, physical. Normalised integration models in silver; dimensional models in gold, built for questions. |
| **7. Words we share** | Our local words (class, subject, module, paper) are mapped to a sector standard, MCDS. Code sets for status and mode come from reference data, not free text. The sharper sketch feeds the catalog and Genie Ontology. | Don't invent a model the sector already agreed. Map local terms to a standard; keep reference data governed. |
| **8. Pull back** | Genie now asks back: "Enrolled on census date, in the Semester 1 offering?" It answers 118, and shows its definition. The sketch is sharper, and still fits on one screen. | Precision where the question needs it, and no more. |

## Visual language

Reuse the world and components of the first two films: the sketch, tiles, vaults, the dbt line, paintings, Genie. The sketch becomes the stage. New objects, each with a single job:

| New object | Stands for |
|---|---|
| A box that splits like a cell | One concept becoming several (Class into Unit, Unit offering and Class) |
| A magnifier that adds detail to the sketch | Moving from conceptual to logical to physical |
| An attribute tag that slides between boxes | Putting an attribute where it belongs (the census date) |
| A thin film strip behind an enrolment | Status history over time |
| A glass star in the gold vault | A dimensional model: a fact with its dimensions |
| A bilingual dictionary on a lectern | Mapping local words to a sector standard |

**Tone.** Curious and precise, like a good puzzle. No one was wrong: each number was right for its own reading. Music: the first film's palette, lighter and more playful, resolving as the two numbers agree.

## Pacing

About 115 words a minute, a hold after each new idea, and a wordless breather at the end of each chapter (see [PLAYBOOK.md](../../PLAYBOOK.md) and `tools/pace.py`). Target length: 7 to 8 minutes. "Pause and think" questions come with the script, for example: "Before the box splits: what do *you* mean by a class?"

## Labs and scenarios (for Learning Data)

- **Labs:**
  - *Split the box:* drag records onto Unit, Unit offering and Class, and watch the count change.
  - *Where does it live?* Drag attributes (census date, room, credit points, mode) onto the entity they describe.
  - *Grain check:* pick the grain of a fact table and see which questions it can and can't answer.
  - *Map the words:* match local terms to standard ones.
- **Scenarios:** modelling calls. Is this a new entity or an attribute? One row per what? Current state or history? Adopt the standard's name, or keep ours with a mapping?

## Rigour to check when scripting

To confirm against current documentation, and record in the rigour sheet with the date checked:

- **MCDS:** the exact entity and relationship names for student, course, course enrolment, unit, unit offering, class or activity, teaching period, census date and enrolment status, in the current version (V1.2 at the time of writing), from infocaps.mortarcaps.org. The names in this treatment are generic and have **not** yet been checked against MCDS.
- **Australian reporting (TCSI):** where the census date is recorded, and how course admissions and unit enrolments relate.
- **Modelling:** conceptual, logical and physical models; Kimball's grain and dimensional modelling; slowly changing dimensions; dbt snapshots for status history.
- **Databricks:** Unity Catalog primary and foreign key constraints (informational), metric views or semantic definitions, and Genie Ontology's current name and scope.
- **HERM:** how its capability areas relate to MCDS domains, since film 1 already points to HERM.

## Decisions for the author

1. **Fix film 1, or let film 3 correct it?** Options: (a) leave film 1 as it is and let this film name it as a deliberate simplification (recommended: it's honest and makes the story); (b) also make a small fix in film 1, such as moving the census date to the class, and add a note on its rigour sheet. Either way, film 1's rigour sheet should say the sketch is simplified and point to this film.
2. **How much notation?** Plain boxes and crow's feet only (recommended), or show a real ERD for a moment in chapter 6.
3. **Name MCDS on screen?** Naming it makes the film more useful in Australia, New Zealand, Canada and the UK; keeping it generic ("a sector data standard") ages better. A middle path: name it in chapter 7 and in the sources.
4. **The title.** *A sharper sketch* is clear. Alternatives: *What is a class?*, *One row per what?*, *Two numbers*.
5. **The tagline.** Options: "Sharpen the sketch when the question needs it." · "Say exactly what you mean, once."

## Next checkpoints

1. Agree this treatment and decision 1.
2. Get access to the MCDS dictionary and check every name in chapters 2 to 7.
3. Script with a rigour sheet and pacing report.
4. Five style frames: the splitting box, the sliding census date, the film strip, the glass star, the dictionary.
5. A voice test, then the first cut.
