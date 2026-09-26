# When things go wrong

*Treatment for the second film, v0.1: a draft for review before any script or picture. Status: proposal.*

## The promise

Same two audiences as the first film: a newcomer understands it, and a data engineer agrees with it. Same university, same platform, same visual world. The first film showed how data should flow; this one shows what happens when it doesn't, and how a good platform notices, contains the damage, fixes the cause and learns from it.

**Logline.** The night before census date, the enrolment numbers go wrong. Follow one broken number upstream, from the dashboard to the change that broke it, and back down again, fixed for good.

**Why it's worth making.** Failure teaches the mechanism better than success does: the first film's strongest moments were the wrong sketch and the stale copy. Most people only see a platform when it breaks, and most material about data quality is either scary or abstract. This film can be calm, specific and useful.

## The structure: a detective story that runs upstream

The first film followed a record downstream, from the tap to the decision. This one inverts it: it starts at the symptom and follows the lineage upstream to the cause, like a detective following a red thread. Then it comes back down with the fix. The viewer already knows the map from the first film, so the reversal feels like a payoff.

**The spine: one incident.** Overnight, the student system is upgraded, and enrolments gain a new status, `WAITLISTED`. The platform was never told. Everything else follows from that one change.

| Chapter | What happens | What it teaches |
|---|---|---|
| **0. 7:58 am** | The day before census, the Head of School opens the dashboard. Class fill for Data Science 101 shows a banner: data as of yesterday, 23:02. | A good platform fails loudly, and keeps the last good numbers instead of showing wrong ones. |
| **1. Signals** | We see what fired overnight: an `accepted_values` test failed in staging, the build skipped everything downstream, and the dashboard's owner was alerted through its exposure. | Tests, severity (warn or error), skipping downstream, alerts, and who gets told. |
| **2. Follow the thread** | A red thread runs upstream through the lineage: exposure, mart, intermediate, staging, source, bronze. The failing rows are kept aside, so we can look at them. | Lineage as a diagnostic tool, and keeping failing rows for inspection rather than deleting them. |
| **3. The cause** | In bronze we find the new status. Auto Loader rescued an unexpected column into `_rescued_data` rather than dropping it. The student system's upgrade changed the data without a word. | Schema drift and new values; why bronze keeps what arrived; a contract with the source team. |
| **4. The meaning** | Is a waitlisted student enrolled? The business decides no: the definition from the first film ("still enrolled on census date") holds. The sketch gains the new status. | Fixes start with meaning, not code. Back to the sketch and the catalog. |
| **5. The fix** | The rule is updated in dbt, reviewed like any code change, and tested in CI on only what changed. | Version control, review, and testing a change before it reaches production. |
| **6. Recover** | The fix is replayed over the affected nights. Time travel compares the numbers before and after, so nobody has to trust a guess. | Backfills, incremental models, Delta versions and time travel, and RESTORE when a table itself is damaged. |
| **7. Prevent** | A new test stays behind, the source team agrees a data contract, and the team writes a short, blameless review. | Every incident should leave a test behind. Runbooks. No blame. |
| **8. Pull back** | 8:40 am: the banner is gone, the numbers are right, and the census report goes out on time. | The platform's job is not to never fail, but to fail safely. |

**Other incidents, shown briefly** (one image each, in chapter 1 or as a closing montage): a late file (freshness), a duplicate from a retry (at-least-once delivery, fixed by merging on a key), a table overwritten by mistake (time travel and RESTORE), and a report that breaks because a mart changed shape (contracts and exposures).

## Visual language

Reuse the first film's world and components: the vaults, tiles, the dbt line, the sketch, the paintings, Genie. Add a few new objects, each with a single job:

| New object | Stands for |
|---|---|
| Amber and red status lights on every component | Tests, freshness and alerts |
| A red thread through the lineage | Tracing a problem upstream |
| A quarantine tray beside the refinery | Failing rows kept aside for inspection |
| Stacked glass panes behind each vault | Delta versions, for time travel and RESTORE |
| A banner on a painting's frame | A data product showing "last good data as of…" |
| A pinned card on a wall of notes | The blameless review, and the test left behind |

**Tone.** Calm and procedural, never alarming. No sirens and no villains: the upgrade was reasonable, the platform did its job, and people made good decisions. Music: the first film's palette in a minor key, resolving to major at the pull back.

## Pacing

Built with room to think from the start: about 115 words a minute, a hold after each new idea, and a wordless breather at the end of each chapter (see [PLAYBOOK.md](../../PLAYBOOK.md) and `tools/pace.py`). Target length: 7 to 8 minutes. "Pause and think" questions for each chapter come with the script.

## Labs and scenarios (for Learning Data)

- **Labs:**
  - *Follow the thread:* click upstream through the lineage to find a cause.
  - *Schema drift:* send a new column through Auto Loader's schema evolution modes and see where it lands.
  - *Time travel:* move a slider across a table's versions and restore one.
  - *Backfill:* replay a date range and compare the numbers before and after.
- **Scenarios:** triage calls. Fix forward or roll back? Who to tell first? Which alert matters? Is a new value a bug or a business change?

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

## Decisions for the author

1. **The spine.** A new status value after an upgrade (recommended, because it connects back to meaning), or a pure schema change?
2. **People on screen.** The first film had none. An on-call engineer would add stakes; a phone with alerts keeps it faceless.
3. **The title.** *When things go wrong* is clear. Alternatives: *The Night Before Census*, or *Fail Loudly*.
4. **The tagline.** Options: "Fail safely. Fix once." · "Every incident leaves a test behind."

## Next checkpoints

1. Agree this treatment.
2. Script with a rigour sheet and pacing report.
3. Five style frames: the red thread, the quarantine tray, the version panes, the banner, the review wall.
4. A voice test.
5. The first cut.
