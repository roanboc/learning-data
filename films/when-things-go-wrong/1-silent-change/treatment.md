# When things go wrong · 1. Silent change

*Treatment for the first episode of [When things go wrong](../README.md), v0.4: the main decisions are made, and the theme is set (see [Decisions](#decisions)). Status: agreed; the next step is a character sheet.*

**Series tagline:** Fail safely. Fix once.

## The promise

Same two audiences as the first film: a newcomer understands it, and a data engineer agrees with it. Same university, same platform, same visual world, and this time the people who work in it. The first film showed how data should flow; this one shows what happens when it doesn't, and how a good platform notices, contains the damage, fixes the cause and learns from it.

**The theme: a change is only safe when both sides can see it.** Every change to data has a technical side (what the system now stores) and a business side (what it means). The incident happens because each side saw only its own half. A **data contract** puts both halves on one page, with a technical and a business owner on each side, and the platform checks it constantly: on every load, and on every proposed change before it ships.

**Logline.** The night before census date, the enrolment numbers stop. Follow one broken number upstream to a change that each side of the university saw only half of, and back down again, with a contract that keeps the next change in plain sight.

**Why it's worth making.** Failure teaches the mechanism better than success does: the first film's strongest moments were the wrong sketch and the stale copy. Most people only see a platform when it breaks, and most material about data quality is either scary or abstract. This film can be calm, specific and useful, and it shows that the fix is as much about people agreeing as about code.

## The structure: a detective story that runs upstream

The first film followed a record downstream, from the tap to the decision. This one inverts it: it starts at the symptom and follows the lineage upstream to the cause, like a detective following a red thread. Then it comes back down with the fix, and ends by showing the next change arriving safely. The viewer already knows the map from the first film, so the reversal feels like a payoff.

**The spine: one change, seen in halves.** The registrar's office introduces waitlists for full classes: a business decision, announced to every School by email. The student system team builds it: enrolments gain a new status, `WAITLISTED`, and a new column, `waitlist_position`, listed in their release notes. Both sides did their part well. Nobody told the platform, or the people who rely on its numbers. Everything else follows from that gap.

| Chapter | What happens | What it teaches |
|---|---|---|
| **0. 7:58 am** | The day before census, Ana, the Head of School, opens the dashboard. Class fill for Data Science 101 shows a banner: data as of yesterday, 23:02. | A good platform fails loudly, and keeps the last good numbers instead of showing wrong ones. |
| **1. Signals** | We see what fired overnight: an `accepted_values` test failed in staging, the build skipped everything downstream, and the dashboard's owner was alerted through its exposure. Sam, the data engineer on call, reads the alert on their phone. The only thing that noticed the change was a test. | Tests, severity (warn or error), skipping downstream, alerts, and who gets told. |
| **2. Follow the thread** | Sam pulls a red thread from their screen, and the camera follows it into the platform, upstream through the lineage: exposure, mart, intermediate, staging, source, bronze. The failing rows are kept aside, so we can look at them. | Lineage as a diagnostic tool, and keeping failing rows for inspection rather than deleting them. |
| **3. The cause** | In bronze we find the new status, and the new column, which Auto Loader rescued into `_rescued_data` rather than dropping it. | New values and schema drift; why bronze keeps what arrived. |
| **4. Two halves of one change** | Sam asks Ben: yes, the new status was in the release notes. Sam asks Mei: yes, her office introduced waitlists, and emailed every School. Ben knew what changed but not what it meant for the numbers; Mei knew what it meant but not that the platform counts by status. Then the meaning: is a waitlisted student enrolled? Sam doesn't guess. Mei decides no: enrolled still means holding a seat on census date. The sketch gains the new status. | A change has a technical side and a business side, and each needs an owner. Meaning is a business decision. Fixes start with meaning, not code. |
| **5. The fix** | The rule is updated in dbt, reviewed like any code change, and tested in CI on only what changed. | Version control, review, and testing a change before it reaches production. |
| **6. Recover** | The fix is replayed over the affected nights. Time travel compares the numbers before and after, so nobody has to trust a guess. At 8:40 am the banner is gone, and Ana sends the census report on time. | Backfills, incremental models, Delta versions and time travel, and RESTORE when a table itself is damaged. |
| **7. The contract** | Later that week, the four of them agree a data contract for enrolments. One card holds the columns and types, the allowed statuses and what each one means, how fresh the data must be, and four owners: technical and business, on the side that produces the data and the side that uses it. Changing the card needs a technical and a business sign-off. The platform checks every load against it at the door, and the student system tests every proposed change against it before release. A new test stays behind, and the team writes a short, blameless review. | What a data contract holds and who signs it. Contracts are versioned, and validated constantly: on every load, and on every change before it ships. No blame. |
| **8. Three weeks later** | Ben's team proposes another status, `DEFERRED`. Before it ships, the contract check fails in their test environment, and all four owners are told at once. Mei defines what it means, Sam's team adds it to the platform, and the contract becomes version 1.1. The change goes live that week. No banner, no alert, nobody woken up. | Visibility before the change, not after. A contract turns a surprise into a conversation. |
| **9. Pull back** | The whole platform, calm, with the contract glowing at its door. The last line: "Every incident leaves a test behind." In the final seconds, the gauge beside another painting's number starts to swing towards amber: a hint of the next episode. | The platform's job is not to never fail, but to fail safely, and to make the next change visible to everyone it touches. |

Other ways things go wrong, such as a late file, a duplicate from a retry or a table overwritten by mistake, get their own episodes (see [the series](../README.md)), so this one stays on a single story.

## The people

Four characters. Together they make a square: technical and business, on the side that produces the data and the side that uses it. A change is only safe when all four corners can see it, and the contract card has a signature in each corner. Their names are placeholders; like the university, they are fictional.

| Character | Corner | Role | What they show |
|---|---|---|---|
| **Mei Tanaka** | Business, produces | Registrar's office, owner of enrolment policy and data | Her office introduced waitlists, and she decides what a waitlisted student means. |
| **Ben Carter** | Technical, produces | Student system team | He built the change well and documented it. He is a partner in the fix, not the villain. |
| **Sam Okafor** | Technical, uses | Data engineer, on call | The viewer's guide: alert, trace, ask, fix, replay. Calm and methodical, and asks instead of guessing. |
| **Ana Ruiz** | Business, uses | Head of School | Why it matters: a decision waits on the numbers. She sees the banner, not an error. |

How they fit the film:

- **Two places, one world.** The people work in a small, quiet campus at dawn: an office, a kitchen table, a meeting room. The platform is the world of light from the first film. Sam's screen is the door between them: the camera moves through it into the platform, and back out again.
- **Two notices that never meet.** Mei's email and Ben's release notes each travel their own way through the campus and never reach the platform. In chapter 7, the contract card is where the two paths finally cross.
- **The narrator tells the story; the characters don't speak.** One voice keeps the film timed to its narration, and makes it easy to translate. The characters act and react: faces, gestures, what they type and what their phones show.
- **Drawn in code, in the film's design language.** An original, simple style made from the same shapes as the first film: rounded forms, luminous edges and a few expressive lines for faces. They blink, breathe and shift their weight, so they feel alive when they're still.
- **Guardrails.** Original designs only, not imitating any studio's style. A varied cast without stereotypes, for example about who is the engineer. No one looks foolish: the tone stays blameless, because each side did its own half right.
- **An honest risk.** Expressive characters are new ground for this code-drawn pipeline. A character sheet comes before anything else (see Next checkpoints). If the characters don't hold up at close range, the fallback is line-figure silhouettes in the same style.

## Visual language

Reuse the first film's world and components: the vaults, tiles, the dbt line, the sketch, the paintings, Genie. Add the people above, and a few new objects, each with a single job:

| New object | Stands for |
|---|---|
| Amber and red status lights on every component | Tests, freshness and alerts |
| A red thread through the lineage | Tracing a problem upstream |
| A quarantine tray beside the refinery | Failing rows kept aside for inspection |
| Stacked glass panes behind each vault | Delta versions, for time travel and RESTORE |
| A banner on a painting's frame | A data product showing "last good data as of…" |
| An email and a release note on separate paths | A change each side saw only half of |
| A contract card at the platform's door, with a signature in each corner and a version number | The data contract: shape, allowed values, meaning, freshness and owners |
| Each arrival lighting up line by line against the card | The contract checked on every load |
| The card appearing in the student system team's test environment | The contract checked on every proposed change, before release |
| A pinned card on a wall of notes | The blameless review, and the test left behind |

**Tone.** Calm and procedural, never alarming. No sirens and no villains: the waitlist was a good idea, the upgrade was well built, the platform did its job, and people made good decisions. The characters carry the stakes, so the pictures don't need to. Music: the first film's palette in a minor key, resolving to major at the contract, and staying there for the quiet change three weeks later.

## Pacing

Built with room to think from the start: about 115 words a minute, a hold after each new idea, and a wordless breather at the end of each chapter (see [PLAYBOOK.md](../../../PLAYBOOK.md) and `tools/pace.py`). Target length: 7 to 8 minutes, now that other incidents have their own episodes. The contract and the change three weeks later are the heart of it, and stay whatever else is cut. "Pause and think" questions for each chapter come with the script.

## Labs and scenarios (for Learning Data)

- **Labs:**
  - *Follow the thread:* click upstream through the lineage to find a cause.
  - *Schema drift:* send a new column through Auto Loader's schema evolution modes and see where it lands.
  - *Contract check:* as Ben, propose a change to the student system. See which checks fail, which of the four owners are told, and which questions need a business answer before it can ship.
  - *Time travel:* move a slider across a table's versions and restore one.
  - *Backfill:* replay a date range and compare the numbers before and after.
- **Scenarios:** calls made from the characters' seats.
  - Sam: fix forward or roll back? Who to tell first? Which alert matters?
  - Mei: a release note mentions a new status. Is it a bug or a business change, and whose job is it to say what it means?
  - Ben: the contract check fails in your test environment the day before a release. Ship, wait, or change the contract?
  - Ana: the dashboard shows yesterday's numbers with a banner. Use them, wait, or ask?

## Rigour to check when scripting

To confirm against current documentation, and record in the rigour sheet with the date checked:

- **Data contracts:**
  - what a contract holds (schema, allowed values, meaning, freshness, owners, versions), and the Open Data Contract Standard (ODCS)
  - where each part is enforced, and what the film's single card simplifies
  - checking a producer's change against the contract in its CI, before release
- **Auto Loader:** schema inference and evolution modes, and the rescued data column.
- **dbt:**
  - test severity and `store_failures`
  - `dbt build --select state:modified+` for testing only what changed
  - incremental models, the microbatch strategy and full refreshes for backfills
  - source freshness, model contracts (enforced at build, on models rather than sources), model versions and exposures
- **Delta Lake:** time travel, `RESTORE TABLE`, and table constraints (`NOT NULL`, `CHECK`).
- **Databricks:**
  - pipeline expectations, as a check on load
  - job alerts and notifications
  - the current name and scope of data quality monitoring
  - Unity Catalog lineage and audit logs (system tables)

## Decisions

Made by the author on 26 September 2026:

1. **The spine:** a new status value after an upgrade (`WAITLISTED`), because the fix starts with meaning and connects back to the sketch in the first film.
2. **People on screen:** full characters, with faces (see [The people](#the-people)).
3. **The title:** *When things go wrong* became the series title (in Spanish, *Cuando algo sale mal*). This episode is *Silent change* (*Cambio silencioso*).
4. **The tagline:** "Fail safely. Fix once.", now for the whole series. This episode's last line is "Every incident leaves a test behind."
5. **The theme:** changes need visibility on both the technical and the business side. That's why data contracts matter, and why they're checked constantly. The change starts as a business decision and a technical build that never met; the film ends with a contract catching the next change before it ships.

## Next checkpoints

1. ~~Agree this treatment.~~ Done.
2. **A character sheet:** the four characters in three poses and three expressions each, plus one shot moving through Sam's screen into the platform. This decides whether full characters work in code.
3. Script with a rigour sheet and pacing report.
4. Six style frames: the red thread, the quarantine tray, the version panes, the banner, the contract card at the door, and the review wall.
5. A voice test.
6. The first cut.
