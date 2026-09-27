# Silent change · the story, fragment by fragment

*Story outline v2.1 (events or files; the dashboard; the sharper model), with the author's decisions of 26 September (see [Decisions](#decisions)). It refines the chapters in the [treatment](treatment.md); where the two differ, this outline is the newer version. Timings are estimates, for about 7:30 in total.*

## The story in one paragraph

The morning before census date, Ana finds yesterday's numbers on her dashboard, under a calm note. Overnight, a test noticed an enrolment status it had never seen, stopped the build and kept the last good numbers, so nobody had to be woken. Sam follows the thread upstream to the change, and finds two announcements that never met: the registrar's office had introduced waitlists, and the student system team had built them. Ben knew what changed and Mei knew what it meant, but neither knew the numbers depended on it. Mei decides what a waitlisted student means, Sam fixes the rule, and the numbers are right before Ana's 9:00 meeting. That week, the four of them agree a data contract that both sides can see and the platform checks all the time. Three weeks later, it catches the next change before it ships, and nobody notices anything at all.

## The shape

| Act | Fragments | Question the viewer is asking |
|---|---|---|
| **1. The morning** | 1 to 3 | Why are the numbers old, and is something broken? |
| **2. The thread** | 4 to 7 | What changed, and why didn't anyone know? |
| **3. Seen by both sides** | 8 to 12 | How do we fix it, and stop it happening again? |

The film opens on the symptom and keeps the cause hidden, like the viewer, until Sam finds it. Two ideas come back later:

- **the two announcements,** revealed in a flashback in fragment 7, become one contract in fragment 10;
- **the note** from fragment 1 comes back in fragment 11, by its absence.

## Fragments

### Act 1 · The morning

**1. 7:58 am · The banner** · 0:00–0:35 · Ana's office
- **We see:** Ana, coffee in hand, opens the dashboard before her 9:00 meeting, where she confirms which classes run before census date tomorrow. Her Databricks dashboard shows a KPI card for Data Science 101, 94% of places filled, with an amber note: "Last good data, as of 23:02 yesterday." She messages Sam: "Are these numbers safe to use?"
- **Narration, in spirit:** the numbers aren't wrong; they're yesterday's, and the dashboard says so.
- **Teaches:** a good platform keeps the last good data and labels it, rather than showing wrong data.

**2. Title** · 0:35–0:41
- *When things go wrong · Silent change*

**3. Six hours earlier** · 0:41–1:20 · the platform at night
- **We see:** 2:40 am. Enrolment changes reach the platform all day, as events or in files; once a night, dbt builds the numbers from them. At the staging gate, a test on enrolment status lights red: a value it has never seen. The build stops; every model downstream is skipped, so the dashboard keeps yesterday's numbers and gains its note. An alert is filed for the morning: because nothing wrong was published, nobody needs to be woken.
- **Narration, in spirit:** a good platform fails loudly, and safely.
- **Teaches:** tests, stopping downstream, keeping the last good data, and alerts that match the harm.
- **Pause and think:** "The test failed at 2:40 am. Why did nobody need to be woken up?"

### Act 2 · The thread

**4. 7:59 am · Sam** · 1:20–1:40 · Sam's kitchen table
- **We see:** Sam is already reading the alert when Ana's message arrives. Sam replies: "Yesterday's numbers are safe to use. I'm checking today's; back to you by 8:45."
- **Teaches:** trust comes from saying clearly what is known and what isn't.

**5. Through the screen** · 1:40–2:25 · into the platform
- **We see:** over Sam's shoulder, the screen turns to glass and the camera passes through it into the platform. One red thread appears on the lineage and moves upstream one step at a time, pausing at each: the dashboard, the data product (`fct_offering_fill`), the model that joins enrolments to their units, then the staging gate, where the test is red. Rows that failed the test sit in the quarantine tray.
- **Narration, in spirit:** lineage is a map you can walk backwards.
- **Teaches:** lineage as a tool for finding causes; keeping failing rows so they can be inspected.
- **Picture note:** the thread only ever follows the lineage, never crosses the screen, and only one step moves at a time. This replaces the busy lines in the first preview.

**6. The cause, in bronze** · 2:25–2:55 · the bronze vault
- **We see:** the rows are exactly as the student system sent them, whether they came as events or in files: fifteen enrolments in Data Science 101 have a new status, `WAITLISTED`.
- **Narration, in spirit:** nothing was lost; something was new.
- **Teaches:** why bronze keeps what arrived, even a value nothing downstream understands yet.
- **Pause and think:** "Bronze kept the rows with the new status. Why is that better than dropping them?"

**7. Two halves of one change** · 2:55–4:15 · the people, a flashback, then the decision
- **We see:** Sam messages Ben: "Did enrolments change last night?" Ben: "Yes, waitlists went live. It's in our release notes." Sam video-calls Mei, and they appear side by side in two tiles: "Yes, we introduced waitlists. We emailed every School."
- **Flashback, two weeks earlier:** Mei's office sends its email to every School, and Ben's team publishes its release notes. Each notice travels its own path through the campus, one gold and one cyan, and both fade out just before they reach the platform. Back in the present, the two paths meet for the first time, at Sam's screen.
- **Narration, in spirit:** Ben knew what changed; Mei knew what it meant; neither knew the numbers depended on it.
- Then the question only the business can answer: is a waitlisted student enrolled? Sam doesn't guess. Mei decides: no. Enrolled means holding a seat on census date. The conceptual model from *A Sharper Sketch* (Student, Unit enrolment, Status change and the rest) gains a new status on Status change.
- **Teaches:** every change has a technical side and a business side, each with an owner; meaning is a business decision.
- **Pause and think:** "Who should decide whether a waitlisted student counts as enrolled?"

### Act 3 · Seen by both sides

**8. The fix** · 4:15–4:45 · the dbt line
- **We see:** one rule changes in dbt: `WAITLISTED` is an accepted status, and it doesn't count as enrolled. A colleague reviews it like any code change, and CI tests only what changed. Green.
- **Teaches:** fixes go through version control, review and tests, even in a hurry.

**9. Recover** · 4:45–5:25 · the vaults, then Ana
- **We see:** the skipped models run. Time travel lays today's numbers beside what they would have been: counting the 15 waitlisted students, Data Science 101 would have shown 108% full. The right number is 96%. At 8:40 the note disappears. At 9:00 Ana confirms the classes.
- **Narration, in spirit:** 108% is believable. A class can be over-full, and nobody would have questioned it; Ana might have booked a bigger room for students who don't hold a seat. The test didn't just stop a build; it stopped a plausible wrong number from reaching a decision.
- **Teaches:** rerunning what was skipped; comparing versions to check a fix; wrong numbers that look right are the dangerous ones.

**10. The contract** · 5:25–6:25 · a meeting, later that week
- **We see:** Mei, Ben, Sam and Ana on a video call, in four tiles. The gold path and the cyan path from the flashback are drawn into one card: the data contract for enrolments. It holds the columns and types, the allowed statuses and what each means, how fresh the data must be, and four owners: technical and business, on the side that produces the data and the side that uses it. Each signs, and a corner of the card lights up. Then the card goes to two places: the platform's door, where it checks every load, and Ben's test environment, where it checks every proposed change before release.
- **Narration, in spirit:** a contract makes a change visible to both sides before it happens, and the platform keeps checking it.
- **Teaches:** what a data contract holds, who signs it, versioning, and the two moments it's checked.
- **Pause and think:** "When is a data contract checked?"

**11. Three weeks later** · 6:25–7:05 · Ben's test environment, then the dashboard
- **We see:** Ben's team proposes another status, `DEFERRED`. In their test environment, before release, the contract check turns amber, and all four corners of the card light up with a notice. Mei defines what it means; Sam's team adds it to the platform; the card becomes version 1.1. On Monday, the dashboard simply updates. No note.
- **Narration, in spirit:** no note, no alert, nobody woken up: the change arrived as a conversation, not a surprise.
- **Pays off:** the note from fragment 1, by its absence.

**12. Pull back** · 7:05–7:30 · the whole platform
- **We see:** the platform, calm, with the contract glowing at its door. The last line: **"Seen by both sides, before it ships."** In the final seconds, another KPI card's trend line starts to climb too steeply: a hint of the next episode.

## How the characters talk without speaking

The narrator carries the story, and the characters don't speak. Their conversations happen the way they would at work: **messages on screen** (fragments 1, 4 and 7) and **video calls in tiles** (fragments 7 and 10). This keeps one voice for timing and translation, and it means every character can face the camera, so front views are enough for this episode.

## Decisions

Made by the author on 26 September 2026:

1. **The opening:** start at 7:58 with Ana and the banner. The two announcements are revealed only in fragment 7, as a flashback, so the cause stays hidden until Sam finds it.
2. **The alert:** it waits for the morning. Nothing wrong was published, so nobody is woken.
3. **The last line:** "Seen by both sides, before it ships."
4. **The numbers:** a small, believable gap. Yesterday 94%; counting the 15 waitlisted students, 108%; the right number, 96%.
