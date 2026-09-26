# When things go wrong

*Treatment for the second film, v0.2: the main decisions are made (see [Decisions](#decisions)). Status: agreed; the next step is a character sheet.*

**Tagline:** Fail safely. Fix once.

## The promise

Same two audiences as the first film: a newcomer understands it, and a data engineer agrees with it. Same university, same platform, same visual world, and this time the people who work in it. The first film showed how data should flow; this one shows what happens when it doesn't, and how a good platform notices, contains the damage, fixes the cause and learns from it.

**Logline.** The night before census date, the enrolment numbers go wrong. Follow one broken number upstream, from the dashboard to the change that broke it, and back down again, fixed for good.

**Why it's worth making.** Failure teaches the mechanism better than success does: the first film's strongest moments were the wrong sketch and the stale copy. Most people only see a platform when it breaks, and most material about data quality is either scary or abstract. This film can be calm, specific and useful.

## The structure: a detective story that runs upstream

The first film followed a record downstream, from the tap to the decision. This one inverts it: it starts at the symptom and follows the lineage upstream to the cause, like a detective following a red thread. Then it comes back down with the fix. The viewer already knows the map from the first film, so the reversal feels like a payoff.

**The spine: one incident.** Overnight, the student system is upgraded, and enrolments gain a new status, `WAITLISTED`. The platform was never told. Everything else follows from that one change.

| Chapter | What happens | What it teaches |
|---|---|---|
| **0. 7:58 am** | The day before census, Ana, the Head of School, opens the dashboard. Class fill for Data Science 101 shows a banner: data as of yesterday, 23:02. | A good platform fails loudly, and keeps the last good numbers instead of showing wrong ones. |
| **1. Signals** | We see what fired overnight: an `accepted_values` test failed in staging, the build skipped everything downstream, and the dashboard's owner was alerted through its exposure. Sam, the data engineer on call, reads the alert on their phone. | Tests, severity (warn or error), skipping downstream, alerts, and who gets told. |
| **2. Follow the thread** | Sam pulls a red thread from their screen, and the camera follows it into the platform, upstream through the lineage: exposure, mart, intermediate, staging, source, bronze. The failing rows are kept aside, so we can look at them. | Lineage as a diagnostic tool, and keeping failing rows for inspection rather than deleting them. |
| **3. The cause** | In bronze we find the new status. Auto Loader rescued an unexpected column into `_rescued_data` rather than dropping it. The student system's upgrade changed the data without a word. | Schema drift and new values; why bronze keeps what arrived; a contract with the source team. |
| **4. The meaning** | Is a waitlisted student enrolled? Sam doesn't guess; they ask Mei, who owns the enrolment data product. The business decides no: the definition from the first film ("still enrolled on census date") holds. The sketch gains the new status. | Fixes start with meaning, not code. Back to the sketch and the catalog. |
| **5. The fix** | The rule is updated in dbt, reviewed like any code change, and tested in CI on only what changed. | Version control, review, and testing a change before it reaches production. |
| **6. Recover** | The fix is replayed over the affected nights. Time travel compares the numbers before and after, so nobody has to trust a guess. | Backfills, incremental models, Delta versions and time travel, and RESTORE when a table itself is damaged. |
| **7. Prevent** | A new test stays behind, Ben from the student system team agrees a data contract with Sam, and the team writes a short, blameless review. | Every incident should leave a test behind. Runbooks. No blame. |
| **8. Pull back** | 8:40 am: the banner is gone, the numbers are right, and Ana sends the census report on time. The last line: "Every incident leaves a test behind." | The platform's job is not to never fail, but to fail safely. |

**Other incidents, shown briefly** (one image each, in chapter 1 or as a closing montage): a late file (freshness), a duplicate from a retry (at-least-once delivery, fixed by merging on a key), a table overwritten by mistake (time travel and RESTORE), and a report that breaks because a mart changed shape (contracts and exposures).

## The people

Four characters, each standing for a role in handling an incident. Their names are placeholders; like the university, they are fictional.

| Character | Role | What they show |
|---|---|---|
| **Ana Ruiz** | Head of School | Why it matters: a decision waits on the numbers. She sees the banner, not an error. |
| **Sam Okafor** | Data engineer, on call | The viewer's guide: alert, trace, fix, replay. Calm and methodical. |
| **Mei Tanaka** | Registrar's office, owner of the enrolment data product | Meaning is a business decision: she decides whether a waitlisted student counts. |
| **Ben Carter** | Student system team | The upgrade was reasonable. He is a partner in the fix, not the villain, and agrees the data contract. |

How they fit the film:

- **Two places, one world.** The people work in a small, quiet campus at dawn: an office, a kitchen table, a meeting room. The platform is the world of light from the first film. Sam's screen is the door between them: the camera moves through it into the platform, and back out again.
- **The narrator tells the story; the characters don't speak.** One voice keeps the film timed to its narration, and makes it easy to translate. The characters act and react: faces, gestures, what they type and what their phones show.
- **Drawn in code, in the film's design language.** An original, simple style made from the same shapes as the first film: rounded forms, luminous edges and a few expressive lines for faces. They blink, breathe and shift their weight, so they feel alive when they're still.
- **Guardrails.** Original designs only, not imitating any studio's style. A varied cast without stereotypes, for example about who is the engineer. No one looks foolish: the tone stays blameless.
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
| A pinned card on a wall of notes | The blameless review, and the test left behind |

**Tone.** Calm and procedural, never alarming. No sirens and no villains: the upgrade was reasonable, the platform did its job, and people made good decisions. The characters carry the stakes, so the pictures don't need to. Music: the first film's palette in a minor key, resolving to major at the pull back.

## Pacing

Built with room to think from the start: about 120 words a minute, a breath after every sentence, a short beat after each new idea, and a short wordless breather at the end of each chapter (see [PLAYBOOK.md](../../PLAYBOOK.md) and `tools/pace.py`). Target length: 7 to 8 minutes. "Pause and think" questions for each chapter come with the script.

## Labs and scenarios (for Learning Data)

- **Labs:**
  - *Follow the thread:* click upstream through the lineage to find a cause.
  - *Schema drift:* send a new column through Auto Loader's schema evolution modes and see where it lands.
  - *Time travel:* move a slider across a table's versions and restore one.
  - *Backfill:* replay a date range and compare the numbers before and after.
- **Scenarios:** triage calls, told from the characters' seats. Sam: fix forward or roll back? Who to tell first? Which alert matters? Mei: is a new value a bug or a business change?

## Rigour to check when scripting

To confirm against current documentation, and record in the rigour sheet with the date checked:

- **Auto Loader:** schema inference and evolution modes, and the rescued data column.
- **dbt:**
  - test severity and `store_failures`
  - `dbt build --select state:modified+` for testing only what changed
  - incremental models, the microbatch strategy and full refreshes for backfills
  - source freshness, contracts and exposures
- **Delta Lake:** time travel and `RESTORE TABLE`.
- **Databricks:**
  - job alerts and notifications
  - the current name and scope of data quality monitoring
  - Unity Catalog lineage and audit logs (system tables)

## Decisions

Made by the author on 26 September 2026:

1. **The spine:** a new status value after an upgrade (`WAITLISTED`), because the fix starts with meaning and connects back to the sketch in the first film.
2. **People on screen:** full characters, with faces (see [The people](#the-people)).
3. **The title:** *When things go wrong* (in Spanish, *Cuando algo sale mal*).
4. **The tagline:** "Fail safely. Fix once." The film's last line is "Every incident leaves a test behind."

## Next checkpoints

1. ~~Agree this treatment.~~ Done.
2. **A character sheet:** the four characters in three poses and three expressions each, plus one shot moving through Sam's screen into the platform. This decides whether full characters work in code.
3. Script with a rigour sheet and pacing report.
4. Five style frames: the red thread, the quarantine tray, the version panes, the banner, the review wall.
5. A voice test.
6. The first cut.
