# Silent change · the story, fragment by fragment

*Story outline v1, for review before the script and before any more animation. It refines the chapters in the [treatment](treatment.md); where the two differ, this outline is the newer version. Timings are estimates, for about 7:45 in total.*

## The story in one paragraph

Two weeks before census date, the registrar's office announces waitlists for full classes, and the student system team builds them. Both do it well, and both tell the right people, except the platform and the people who rely on its numbers. The night before census, a test notices a status it has never seen, stops the build and keeps yesterday's numbers on the dashboard, clearly labelled. In the morning, Sam follows the thread upstream to the change, and finds that Ben knew what changed and Mei knew what it meant, but neither knew the numbers depended on it. Mei decides what a waitlisted student means, Sam fixes the rule, and the numbers are right before Ana's 9:00 meeting. That week, the four of them agree a data contract that both sides can see and the platform checks all the time. Three weeks later, it catches the next change before it ships, and nobody notices anything at all.

## The shape

| Act | Fragments | Question the viewer is asking |
|---|---|---|
| **1. The morning** | 1 to 4 | Why are the numbers old, and is something broken? |
| **2. The thread** | 5 to 8 | What changed, and why didn't anyone know? |
| **3. Seen by both sides** | 9 to 13 | How do we fix it, and stop it happening again? |

Two ideas are **planted** early and **paid off** later:

- the two announcements in fragment 1 come back in fragment 8, when their paths finally meet, and again in fragment 11, when they become one contract;
- the banner in fragment 3 comes back in fragment 12, by its absence.

## Fragments

### Act 1 · The morning

**1. Two weeks earlier** · 0:00–0:30 · campus
- **We see:** Mei's office sends an email to every School: "From Monday, full classes will have a waitlist." Across campus, Ben's team ships a student system update, with release notes: "New enrolment status: WAITLISTED." Each notice travels its own path through the campus, one gold and one cyan. Both fade out just before they reach the platform.
- **Narration, in spirit:** two good changes, announced in the right places, to the right people. Almost all of them.
- **Plants:** the two notices, and the gap between them.

**2. Title** · 0:30–0:36
- *When things go wrong · Silent change*

**3. 7:58 am · The banner** · 0:36–1:05 · Ana's office
- **We see:** Ana, coffee in hand, opens the dashboard before her 9:00 meeting, where she confirms which classes run before census date tomorrow. The gold painting shows Data Science 101, 94% full, with an amber banner: "Last good data as of yesterday, 23:02." She messages Sam: "Are these numbers safe to use?"
- **Narration, in spirit:** the numbers aren't wrong; they're yesterday's, and the dashboard says so.
- **Teaches:** a good platform keeps the last good data and labels it, rather than showing wrong data.

**4. Six hours earlier** · 1:05–1:45 · the platform at night
- **We see:** 2:40 am. The student system's nightly data arrives. At the staging gate, a test on enrolment status lights red: a value it has never seen. The build stops; every model downstream is skipped, so the painting keeps yesterday's numbers and gains its banner. An alert is filed for the morning: because nothing wrong was published, nobody needs to be woken.
- **Narration, in spirit:** a good platform fails loudly, and safely.
- **Teaches:** tests, stopping downstream, keeping the last good data, and alerts that match the harm.
- **Pause and think:** "The test failed at 2:40 am. Why did nobody need to be woken up?"

### Act 2 · The thread

**5. 7:59 am · Sam** · 1:45–2:05 · Sam's kitchen table
- **We see:** Sam is already reading the alert when Ana's message arrives. Sam replies: "Yesterday's numbers are safe to use. I'm checking today's; back to you by 8:45."
- **Teaches:** trust comes from saying clearly what is known and what isn't.

**6. Through the screen** · 2:05–2:50 · into the platform
- **We see:** the shot from the character sheet, simplified. Over Sam's shoulder, the screen turns to glass and the camera passes through it into the platform. One red thread appears on the lineage and moves upstream one step at a time, pausing at each: the painting, the mart, the intermediate model, then the staging gate, where the test is red. Rows that failed the test sit in the quarantine tray.
- **Narration, in spirit:** lineage is a map you can walk backwards.
- **Teaches:** lineage as a tool for finding causes; keeping failing rows so they can be inspected.
- **Picture note:** the thread only ever follows the lineage, never crosses the screen, and only one step moves at a time. This replaces the busy lines in the first preview.

**7. The cause, in bronze** · 2:50–3:20 · the bronze vault
- **We see:** the rows are exactly as the student system sent them: a new status, `WAITLISTED`, and a new column, `waitlist_position`, which Auto Loader set aside in the rescued data column rather than dropping it.
- **Narration, in spirit:** nothing was lost; something was new.
- **Teaches:** why bronze keeps what arrived; new values and new columns.
- **Pause and think:** "Bronze kept the new status and the new column. Why is that better than dropping them?"

**8. Two halves of one change** · 3:20–4:30 · the people, then both paths
- **We see:** Sam messages Ben: "Did enrolments change last night?" Ben: "Yes, waitlists went live. It's in our release notes." Sam video-calls Mei, and they appear side by side in two tiles: "Yes, we introduced waitlists. We emailed every School." The two notices from fragment 1 reappear, and this time their paths meet, at Sam's screen.
- **Narration, in spirit:** Ben knew what changed; Mei knew what it meant; neither knew the numbers depended on it.
- Then the question only the business can answer: is a waitlisted student enrolled? Sam doesn't guess. Mei decides: no. Enrolled means holding a seat on census date. The sketch from the first film gains a new state.
- **Teaches:** every change has a technical side and a business side, each with an owner; meaning is a business decision.
- **Pause and think:** "Who should decide whether a waitlisted student counts as enrolled?"

### Act 3 · Seen by both sides

**9. The fix** · 4:30–5:00 · the dbt line
- **We see:** one rule changes in dbt: `WAITLISTED` is an accepted status, and it doesn't count as enrolled. A colleague reviews it like any code change, and CI tests only what changed. Green.
- **Teaches:** fixes go through version control, review and tests, even in a hurry.

**10. Recover** · 5:00–5:40 · the vaults, then Ana
- **We see:** the skipped models run. Time travel lays today's numbers beside what they would have been: counting the waitlist, Data Science 101 would have shown 131% full; the right number is 96%. At 8:40 the banner disappears. At 9:00 Ana confirms the classes.
- **Narration, in spirit:** the test didn't just stop a build; it stopped a wrong number from reaching a decision.
- **Teaches:** rerunning what was skipped; comparing versions to check a fix.

**11. The contract** · 5:40–6:40 · a meeting, later that week
- **We see:** Mei, Ben, Sam and Ana on a video call, in four tiles. The gold path and the cyan path from fragment 1 are drawn into one card: the data contract for enrolments. It holds the columns and types, the allowed statuses and what each means, how fresh the data must be, and four owners: technical and business, on the side that produces the data and the side that uses it. Each signs, and a corner of the card lights up. Then the card goes to two places: the platform's door, where it checks every load, and Ben's test environment, where it checks every proposed change before release.
- **Narration, in spirit:** a contract makes a change visible to both sides before it happens, and the platform keeps checking it.
- **Teaches:** what a data contract holds, who signs it, versioning, and the two moments it's checked.
- **Pause and think:** "When is a data contract checked?"

**12. Three weeks later** · 6:40–7:20 · Ben's test environment, then the dashboard
- **We see:** Ben's team proposes another status, `DEFERRED`. In their test environment, before release, the contract check turns amber, and all four corners of the card light up with a notice. Mei defines what it means; Sam's team adds it to the platform; the card becomes version 1.1. On Monday, the dashboard simply updates. No banner.
- **Narration, in spirit:** no banner, no alert, nobody woken up: the change arrived as a conversation, not a surprise.
- **Pays off:** the banner from fragment 3, by its absence.

**13. Pull back** · 7:20–7:45 · the whole platform
- **We see:** the platform, calm, with the contract glowing at its door. The last line. In the final seconds, the gauge beside another painting's number starts to swing towards amber: a hint of the next episode.

## How the characters talk without speaking

The narrator carries the story, and the characters don't speak. Their conversations happen the way they would at work: **messages on screen** (fragments 3, 5 and 8) and **video calls in tiles** (fragments 8 and 11). This keeps one voice for timing and translation, and it means every character can face the camera, so front views are enough for this episode.

## Open questions for the author

1. **The cold open.** Show the two announcements first (recommended: it plants the gap, and fragment 8 pays it off), or start at 7:58 and reveal them only in fragment 8?
2. **The alert waits for the morning.** Because nothing wrong was published, nobody is woken (recommended: it shows failing safely). Or page Sam at 2:40?
3. **The last line.** "Every incident leaves a test behind." fits the fix; something like "Seen by both sides, before it ships." fits the contract, which is the episode's theme. Which one?
4. **The numbers.** Yesterday 94%; with the waitlist counted, 131%; right, 96%. Do they feel right for a popular first-year class?
