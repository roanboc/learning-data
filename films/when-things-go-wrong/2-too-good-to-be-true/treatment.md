# When things go wrong · 2. Too good to be true

*Treatment for Too good to be true, in [When things go wrong](../README.md), v0.3: the main decisions are made (see [Decisions](#decisions)). Status: agreed; its characters are in the [character sheet](../characters/README.md).*

**Series tagline:** Fail safely. Fix once.

## The promise

Same two audiences, same university, same platform, and Sam, the data engineer from *Silent change*, as the guide.

**The theme: stale and labelled beats fresh and wrong.** Some failures don't break any rule a row can see. Every value is valid, every ID is unique, and yet a crucial number is wrong. Expectations on the numbers themselves, such as how much a total can change overnight, catch what row checks miss. Those tests have two levels: a **warning** says "worth a look" and lets data through; an **error** says "don't publish this" and stops it. Without a test, wrong data reaches people who act on it, and that costs far more than data that's a day old and says so.

**Logline.** Overnight, applications for next year jump 38%, and a committee is about to plan 600 more places for students who don't exist. Watch three versions of the same morning, with no test, a warning and an error, then follow the jump back to a sync that copied a week of applications twice.

**Why it's worth making.** Teams often ask "do we have tests?" but rarely "what level should this test be, and what happens when it fires?" A jump in a headline number is easy to picture, and everyone understands the difference between a decision made on wrong numbers and a decision made a day later on right ones.

## The spine: one number, three mornings

It's Tuesday during admissions season. The Vice-Chancellor's gold painting from *The Inner Life of Data* shows one big number: applications for next year, 8,200 so far. At 10 am, the planning committee meets to decide how many first-year places to offer.

On Monday night, the admissions system's nightly sync to the application portal times out and restarts. On restart it copies the whole week's applications again, 3,100 of them, and gives every copy a new ID. The admissions system now holds each of those applications twice. The platform copies what the source holds, faithfully.

Every row-level check passes: the IDs are unique, nothing is empty, every value is in range. The headline number reads 11,340, up 38% in one night. The real growth was 40 applications.

The contract for this number includes an expectation agreed with the admissions office: the total shouldn't change by more than 10% overnight without someone looking (a **warning**), and never by more than 25% without a stop (an **error**). The admissions office set those limits because closing dates do cause real spikes of up to about 15%.

| Chapter | What happens | What it teaches |
|---|---|---|
| **0. Tuesday, 10:05 am** | The committee sees "Applications ▲38%". Smiles; a vote; 600 extra places approved, rooms booked, tutors to hire. The picture freezes. The narrator: "This is one version of Tuesday. Let's go back to Monday night." | Numbers become decisions. A wrong number doesn't stay on a screen: people act on it. |
| **1. The number and its limits** | Through Sam's screen into the platform, to the gold painting and its contract card. The line that matters: overnight change, amber above 10%, red above 25%. Leila from admissions explains why: closing dates cause real spikes. | Expectations on aggregates, not just rows. Tests have levels, and the business helps set them. |
| **2. Monday night** | The sync restarts and copies a week of applications again, with new IDs. The platform ingests them. Row checks glow green, one after another: unique IDs, no empty fields, valid courses. Then the total arrives at the last gate, and the needle swings past amber into red: +38%. | Why row checks pass while the number is wrong. What a volume expectation sees that row checks can't. |
| **3. Three Tuesdays** | The screen splits into three, and the same night runs three ways. **No test:** 11,340 reaches the painting; the committee approves 600 places. Three weeks later the offers go unanswered, the decision is reversed, and nobody trusts the dashboard. **Warning:** the test fires amber, the build carries on, and the number is published. The warning lands in a channel with forty others that nobody reads before 10 am, and the same decision is made. **Error:** the test stops the build before gold. The painting keeps yesterday's 8,200 with a banner: "Last good data as of Monday 23:00. Checking an unusual change." The committee moves the decision to Wednesday. | No test lets wrong data through. A warning is a note, not a brake. An error keeps the last good number, clearly labelled. Stale and labelled beats fresh and wrong. |
| **4. Choosing the level** | Why not make every test an error? A spike on a closing date is real, and stopping it would hold back good data and teach people to ignore alarms. So the same test has two bands: amber for "worth a look", red for "must not reach a decision". Warnings go to someone who reads them, and there are few enough that they do. | Severity chosen by consequence. Thresholds based on what's normal, including seasons. Alert fatigue. |
| **5. Follow the thread** | Sam follows the thread upstream from the painting to bronze. There, 3,100 pairs of rows are identical except for their ID and the time they were created. The uniqueness test checked the ID, and every ID was unique. What makes an application unique in the real world is the applicant, the course and the intake. | Duplicates in the source system itself. Test uniqueness on the business key, not only the system's ID. |
| **6. Fix at the source, then reload** | Rosa's team removes the copies in the admissions system and makes the sync safe to run twice. The platform can't simply delete rows from its own copy: it reloads the affected week from the corrected source, and rebuilds silver and gold. Time travel compares before and after: 11,340 becomes 8,240. On Wednesday, the committee plans with the right number. | Fix the cause at the source, then re-ingest the affected period. Why the platform's copy should match the source rather than be patched by hand. Time travel to verify. |
| **7. Pull back** | A new test stays behind: one application per applicant, course and intake. The gauge on the painting settles at green. The camera pulls back to the whole platform. The last line: "Stale and labelled beats fresh and wrong." | Every incident leaves a test behind. Fail safely: when in doubt, keep the last good number, and say so. |

## The people

The series' square: technical and business, on the side that produces the data and the side that uses it. Sam returns; the other corners are new. Names are placeholders, and everyone is fictional.

| Character | Corner | Role | What they show |
|---|---|---|---|
| **Leila Haddad** | Business, produces | Admissions office manager | Knows what a normal day looks like, including closing-date spikes, and helps set the limits. |
| **Rosa Díaz** | Technical, produces | Admissions system team | Runs a sync that wasn't safe to restart. Fixes it at the source, without blame. |
| **Sam Okafor** | Technical, uses | Data engineer, the series' guide | Chooses test levels with the business, follows the thread, and reloads the data. |
| **Professor David Mensah** | Business, uses | Deputy Vice-Chancellor, chairs the planning committee | The person about to act on the number. In the error version, he's the one who chooses to wait a day. |

## Visual language

Everything from *Silent change* (the square of characters, Sam's screen as the door, the contract card, the version panes), plus:

| New object | Stands for |
|---|---|
| A gauge beside the painting's number, with green, amber and red bands | A test on a number, with a warning level and an error level |
| Row checks lighting green one after another, while the gauge swings to red | Row-level tests passing while the total is wrong |
| The screen split into three Tuesdays | No test, a warning and an error, side by side |
| A channel of amber notes piling up unread | Warnings nobody acts on |
| Pairs of identical tiles with different ID tags | Duplicates in the source, with new IDs |
| A week of tiles lifted out of bronze and poured in again from the source | Re-ingesting an affected period |

**Tone.** Calm, a little wry in the "no test" version, and never mocking. The committee made a sensible decision on the number it was shown. No villains: a sync timed out, as syncs do.

## Pacing

About 125 to 135 words a minute, a natural beat of about 0.8 s after every sentence, and longer pauses only where an idea needs to land, as the [pacing review](../../inner-life-of-data/pacing-review.md) of *The Inner Life of Data* recommends. The three Tuesdays need time: each version holds long enough to see what was decided and what it cost. Target length: 6 to 7 minutes.

## Labs and scenarios (for Learning Data)

- **Lab, *Set the levels*:** a year of daily application totals, with real closing-date spikes and one duplicated sync. Drag the amber and red bands, and see how many false alarms you raise and which problems slip through.
- **Lab, *Which test catches it?*:** pick the tests (unique ID, unique business key, value in range, overnight change) and send different failures through: a duplicated sync, a missing file, marks on the wrong scale.
- **Scenarios:** a number moves overnight; choose ignore, warn or error, and say who should hear about it:
  - applications up 14% on a closing date
  - applications up 38% on an ordinary night
  - tuition revenue down 60% because a file didn't arrive
  - a revenue total up 100 times after a currency field changed from dollars to cents

## Rigour to check when scripting

To confirm against current documentation, and record in the rigour sheet with the date checked:

- **dbt:**
  - test `severity` (warn or error), and `warn_if` and `error_if`, which count failing rows
  - how to express a warning band and an error band on one number: two tests, or one test with conditions
  - tests that compare a total with a previous value or a baseline, and the current state of the packages that provide them
  - uniqueness on a combination of columns, for the business key
- **Databricks:**
  - pipeline expectations and their actions (keep and record, drop the row, fail the update)
  - data quality monitoring, and its anomaly detection on freshness and volume: current name and scope
  - job alerts, and where warnings go
- **Re-ingesting a period:** reprocessing files with Auto Loader, a full refresh, or replacing a date range in a Delta table; which one fits this story.
- **Delta Lake:** time travel to compare versions.

## Decisions

Made by the author on 26 September 2026:

1. **The incident:** not a new category (that's *Silent change*'s territory), but a crucial number that jumps and deviates from expectations, caused by duplicates in the source system, which requires re-ingesting the data.
2. **What it must show:** warning and error test levels, and that having no test would have been worse: wrong data versus stale data.
3. **The device:** three versions side by side, as in the first draft. They are now no test, a warning and an error.
4. **The crucial number:** applications for next year, before the committee plans first-year places.
5. **The title:** *Too good to be true* (in Spanish, *Demasiado bueno para ser verdad*).
6. **The last line:** "Stale and labelled beats fresh and wrong."

## Next checkpoints

1. ~~Agree this treatment.~~ Done.
2. ~~Reuse the character sheet from *Silent change*, and add the new characters.~~ First pass done: see [the character sheet](../characters/README.md).
3. ~~Script with a rigour sheet and pacing report.~~ Draft 1: see [the script](script.md).
4. ~~Style frames: the gauge on the painting, the row checks passing while the gauge goes red, the three Tuesdays, and the reload.~~ See [the style frames](frames/README.md).
5. ~~A voice test, and the first cut.~~ The film, its labs and its scenarios are on the site: [/when-things-go-wrong/too-good-to-be-true/](https://roanboc.github.io/learning-data/when-things-go-wrong/too-good-to-be-true/).
