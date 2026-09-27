# When things go wrong · 2. Too good to be true: script

*Script draft 1 for [Too good to be true](treatment.md), in [When things go wrong](../README.md). About 6 minutes, in eight chapters, in English. The narration lives in [`source/src/narration.js`](source/src/narration.js) and the pauses in [`source/src/breath.js`](source/src/breath.js); this page and those files say the same thing, and where they differ, the source wins. Not voiced yet: the timings are estimates (see [Pacing report](#pacing-report)).*

## The promise

A newcomer understands it, and a data engineer agrees with it. Some failures break no rule a row can see: every value is valid, every ID is unique, and yet the number that matters is wrong. A test on the number itself catches it, and its level decides what happens next: a **warning** lets the data through and asks someone to look; an **error** stops it and keeps the last good number, labelled. **Stale and labelled beats fresh and wrong.**

## The story in one paragraph

On Tuesday at 10:05, the planning committee sees applications for next year up 38% overnight, and approves six hundred extra first-year places. That's one version of Tuesday. On Monday night, the admissions system's sync timed out, restarted, and copied a week of applications again, with new IDs. Every row check passed. Only the test on the total saw the jump, and it had two levels, agreed with Leila from the admissions office: amber above 10%, red above 25%. Three Tuesdays play side by side: with no test, the wrong number is acted on; with a warning, it's acted on anyway; with an error, the painting keeps Monday's number, labelled, and David moves the decision to Wednesday. That's the Tuesday that happens. Sam follows the thread to bronze and finds the copies; Rosa's team removes them at the source and makes the sync safe to run twice; the platform loads the week again and rebuilds. On Wednesday, the committee plans with the right number, and a new test on the business key stays behind.

## What each object stands for

Everything from *Silent change* (Sam's screen as the door, the contract card, the version panes, messages on screen), plus:

| Object | Stands for |
|---|---|
| The gold painting of the Vice-Chancellor's office, with one big number | A gold data product: applications for next year |
| A gauge beside the number, with green, amber and red bands | A test on a number, with a warning level (amber, above 10%) and an error level (red, above 25%) |
| The line "overnight change" on the contract card | The expectation agreed with the business that produces the data |
| Row checks lighting green, one after another | Row-level tests: unique ID, not empty, accepted values |
| Pairs of identical tiles with different ID tags | Duplicates in the source system, each copy with a new ID |
| The screen split into three Tuesdays | No test, a warning and an error, side by side |
| A channel of amber notes piling up, unread | Warnings nobody owns |
| The amber note on the painting: "Last good data" | Keeping the last good data, and saying how old it is |
| A week of tiles lifted out of bronze and poured in again | Loading the affected period again from the corrected source |
| Two version panes, side by side | Delta time travel: the table before and after |

## Script

Timings are estimates from `tools/pace.py`, before voicing.

### 1 · One version of Tuesday · 0:00–0:34

**Narration.** It's 10:05 on a Tuesday, in the middle of admissions season. The planning committee is deciding how many first-year places to offer next year. On the screen, one number: applications for next year, up 38% overnight. It's good news, and nobody questions it. The committee approves six hundred extra places. Rooms are booked, and tutors will be hired. This is one version of Tuesday. Let's go back to Monday.

**Picture.** A meeting room in the morning. David Mensah at the head of the table, the committee around it, a large screen with the dashboard in the style of Databricks: a KPI card, "Applications for next year: 11,340 ▲38%", and a trend line that climbs too steeply (the last picture of *Silent change*). Smiles; hands go up. A planner's board fills: "+600 places", rooms booked, "tutors: to hire". The picture freezes and desaturates, and a label appears in the corner: *Version 1 of Tuesday*. Title, over the frozen frame: *When things go wrong · Too good to be true*. The clock winds back to Monday.

**On screen.** Tuesday 10:05 · Planning committee · Applications for next year 11,340 ▲38% · +600 places · Version 1 of Tuesday · *Too good to be true*

### 2 · The number and its limits · 0:34–1:26

**Narration.** Sam, the data engineer, looks after the platform behind that number. Through Sam's screen, it's a gold painting: applications for next year. On Monday, 8,200 so far. Beside it sits its contract card. One line matters this week: how much the total may change overnight. Leila, who manages the admissions office, helped set it. On a closing date, applications really do jump, by up to about 15%. So above 10%, a test raises a warning: worth a look, but the data goes through. Above 25%, it raises an error: this must not reach a decision, so the build stops. A test on the number itself, not just on each row, with levels the business helped choose.

**Picture.** Monday afternoon. Over Sam's shoulder, the screen turns to glass and the camera passes through it into the platform, to the gold vault and its painting: "Applications for next year: 8,200". The contract card slides out beside it; one line lights up: *overnight change*. A video-call tile opens with Leila, who draws last year's closing-date spike on a small chart: +15%. The gauge appears beside the number, and its bands fill as they're named: green up to 10%, amber to 25%, red beyond. Under amber, "warn: the data goes through"; under red, "error: the build stops".

**On screen.** Applications for next year 8,200 · contract: applications · overnight change · Leila Haddad, admissions office · closing date +15% · warn > 10% · error > 25%

### 3 · Monday night · 1:26–2:20

**Narration.** At eleven on Monday night, the admissions system syncs with the application portal. Tonight, the sync times out and restarts. It copies the whole week's applications again, 3,100 of them, and gives every copy a new ID. The admissions system now holds each of those applications twice. The platform copies what the source holds, faithfully. At two, the nightly build begins, and the checks run, one row at a time. Every ID is unique. No field is empty. Every course exists. Then the total reaches its test: 11,340. Up 38% in one night, when the real growth was forty. The needle swings past amber, into red. Every row was valid. Only a test on the total could see that there were too many.

**Picture.** Night. The admissions system, in its source colour, and the application portal beside it; a sync line runs between them, stalls ("timeout"), and starts again from the beginning of the week. Tiles pour across a second time, each copy with a fresh ID tag. In bronze, they settle in pairs. At 2:00, the nightly build begins. Along the dbt line, three row checks light green, one after another: *unique ID*, *not empty*, *course exists*. The total arrives at the last gate, before gold. The counter rolls from 8,200 to 11,340, and the gauge's needle swings through amber into red.

**On screen.** Mon 23:00 · admissions system → application portal · timeout · restart · 3,100 copied again · Tue 02:00 nightly build · ✓ unique ID · ✓ not empty · ✓ course exists · total 11,340 · +38% · real growth: 40

### 4 · Three Tuesdays · 2:20–3:36

**Narration.** What happens next depends on that test. Here are three versions of the same Tuesday. In the first, there's no test. 11,340 reaches the painting, and the committee approves six hundred places. Three weeks later, the copies are found. The places are cut again, the rooms released, and nobody trusts the dashboard. In the second, the test is only a warning. It turns amber, and the number is published anyway. The warning lands in a channel with forty others. Nobody reads it before ten, and the committee makes the same decision. In the third, the test is an error. The build stops before gold. The painting keeps Monday's 8,200, with a note: last good data, as of 2 am on Monday. Checking an unusual change. David, who chairs the committee, moves the decision to Wednesday. A day late, and right. A wrong number gets acted on. A late number, clearly labelled, simply waits. At our university, this test is an error. So this is the Tuesday that happens.

**Picture.** The screen splits into three columns, each with the same night running, each with a small label: *no test*, *warning*, *error*. Each column holds while the narration is on it, and the other two dim.
- **No test:** no gauge; 11,340 flows into the painting, the committee's hands go up, "+600 places". A calendar flips three weeks; the board is wiped, "−600", and a crack runs across the dashboard. Calm and a little wry, never mocking.
- **Warning:** the gauge turns amber, the build carries on, and 11,340 reaches the painting. An amber note drops into a channel of forty unread notes and sinks. The same hands go up.
- **Error:** the gauge turns red and a gate closes before gold. The painting keeps 8,200, with an amber note: "Last good data as of Mon 02:00. Checking an unusual change." David reads it, and moves the item to Wednesday.

Wordless breather: the three columns side by side, the first two fading, the third brightening and filling the screen.

**On screen.** Version 1: no test · Version 2: warning · Version 3: error · +600 places · 3 weeks later: −600 · #data-alerts (40 unread) · Last good data as of Mon 02:00. Checking an unusual change. · Decision: Wednesday

### 5 · Choosing the level · 3:36–4:14

**Narration.** So why not make every test an error? Because on a closing date, a jump of 14% is real. Stopping it would hold back good data, and teach people to ignore alarms. So this number has two levels. Amber, for worth a look. Red, for must not reach a decision. And a warning only helps if someone reads it. So each one goes to a person who owns it, and there are few enough that they do. Choose the level by what a wrong number would cost.

**Picture.** The gauge, large. A closing date on the calendar: the total rises 14%, the needle sits in amber and the data flows on; one amber note goes to Leila, who reads it, nods and closes it: "closing date, expected". Then a wall of red alarms for every small change fades out, crossed through. The channel of forty unread notes shrinks to three, each with an owner's face.

**On screen.** closing date +14% · warn: worth a look · error: must not reach a decision · owner: Leila Haddad · choose the level by the cost of a wrong number

### 6 · Follow the thread · 4:14–4:50

**Narration.** At 8:15 on Tuesday, Sam follows the thread upstream, from the painting, through silver, to bronze. In bronze, 3,100 pairs of rows are identical, except for their ID and when they were created. The uniqueness test checked the ID, and every ID was unique. But in the real world, an application is one applicant, for one course, in one intake. That's its business key. Test uniqueness on what makes a thing unique in the real world, not only on the system's ID.

**Picture.** The red thread from *Silent change* runs along the lineage, one step at a time: painting, gold, silver, bronze. In bronze, the tiles lie in pairs. A magnifier shows one pair: the same applicant, course and intake; different `application_id` and `created_at`. The *unique ID* check glows green over the IDs. Then three columns, applicant, course and intake, light together as one key, and the pairs turn red.

**On screen.** Tue 08:15 · gold → silver → bronze · application_id A-40211 · A-47988 · same applicant, course, intake · unique ID ✓ · business key: applicant + course + intake ✗

### 7 · Fix at the source · 4:50–5:34

**Narration.** Sam messages Rosa, on the admissions system team. Her team finds the restart within the hour. The copies are in the admissions system itself, so that's where they're removed. And the sync is changed, so it's safe to run twice. The platform doesn't patch its copy by hand. It loads the affected week again, from the corrected system, so its copy matches the source. Silver and gold are rebuilt from it. Time travel lays Monday night's total beside today's: 11,340 then, 8,240 now. Forty more than Monday, as it should be. On Wednesday, the committee plans with the right number.

**Picture.** A message from Sam to Rosa; Rosa's reply: "Found it: the sync restarted from Monday. Removing the copies." In the admissions system, the second tile of each pair fades. The sync line gains a small lock: *safe to run twice*. In bronze, the week's tiles lift out and pour in again from the source, once each. Silver and gold rebuild, left to right. Two version panes side by side: *Tue 02:00: 11,340* and *Tue 11:30: 8,240*. The painting's note disappears; the gauge sits in green. The committee, Wednesday: "+0 places", and a nod.

**On screen.** Rosa Díaz, admissions system · copies removed · sync: safe to run twice · reload: one week · version 41: 11,340 · version 43: 8,240 · +40 since Monday · Wednesday

### 8 · Pull back · 5:34–5:56

**Narration.** The incident leaves a new test behind: one application per applicant, course and intake. Syncs will time out again. When in doubt, keep the last good number, and say so. Stale and labelled beats fresh and wrong.

**Picture.** A new check joins the row checks on the dbt line: *unique: applicant + course + intake*. The gauge settles in green. The camera pulls back to the whole platform, calm, with the contract card at its door. Wordless ending: in the last seconds, at 2:00 on another night, a file slot at the platform's door stays empty, and a small clock on a painting starts to count up: a hint of *Late*.

**On screen.** new test: one application per applicant, course and intake · *Stale and labelled beats fresh and wrong.*

## Pause and think

Four stops, one question each, as in *Silent change*. Each links to a lab of *The Inner Life of Data* until this film has its own labs.

| After | Question | Answer, in short |
|---|---|---|
| 3 · Monday night | Every ID was unique and every field was filled. Why did the total still come out wrong? | Row checks look at one row at a time; each copy was a valid row. Only a check on the total, or on the business key, sees that there are too many. |
| 4 · Three Tuesdays | The warning fired, and the same wrong decision was made. Why? | A warning lets the data through. It only helps if someone who owns it reads it in time. |
| 5 · Choosing the level | Why not make every test an error? | Real spikes, such as closing dates, would be stopped too: good data held back, and alarms people learn to ignore. Choose the level by what a wrong number would cost. |
| 7 · Fix at the source | Why doesn't the platform just delete the copies from its own tables? | The copies are in the source system. Fix them there, and load the period again, so the platform's copy matches the source and every other user of the source gets the fix too. |

## Changes from the treatment

- **Length:** about 5:56, under the treatment's 6 to 7 minutes, in step with *Silent change* (5:36) and the series' pace. The three Tuesdays still get the most time, 76 seconds, and a wordless breather.
- **Chapters:** "Fix at the source, then reload" is called *Fix at the source*; the title comes at the end of the first chapter, as in *Silent change*.
- **The note on the painting:** "Last good data as of Mon 02:00. Checking an unusual change.", in the same style as Ana's note in *Silent change*, so the object means the same in both films.
- **The ending hint:** a missing nightly file, for the candidate film *Late*.
- **Where the test sits:** on the total in silver, just before gold, so an error stops gold from being rebuilt (see the rigour sheet, chapter 3).

## Rigour sheet

Checked on 27 September 2026. The university, people, dates and numbers are fictional. The dbt pages were read from their source on GitHub, which is the text of the live pages. The Databricks and Delta Lake pages couldn't be opened from here and were checked through search results; open them again before publishing, especially the preview labels.

| Chapter | The real practice | What the picture simplifies |
|---|---|---|
| 1 · One version of Tuesday | A headline number on a dashboard feeds a planning decision. | The dashboard is in the style of a Databricks dashboard, as in *Silent change*. |
| 2 · The number and its limits | dbt data tests (the current name; "tests" still works as an alias) have a `severity` of `warn` or `error`. `warn_if` and `error_if` compare the number of failures, by default the rows the test returns, with a condition such as `!=0` (the default for both). A warning band and an error band on one number are most simply two singular tests: one returns a row when the overnight change is over 10%, with `severity: warn`; the other when it's over 25%, with the default `error`. A single test can also do it, by setting `fail_calc` to the change as a whole number, with `warn_if: '>10'` and `error_if: '>25'`. | One gauge with two bands stands for the two tests. The limits are the business's, recorded on the contract card; the tests carry them out. |
| 3 · Monday night | Row checks (`unique`, `not_null`, `accepted_values` or `relationships`) look at one row at a time and pass on valid duplicates. `dbt build` runs each model's tests straight after the model, and an error skips every model downstream. Putting the test on the total in silver, just before gold, means an error stops gold from being rebuilt, so the painting keeps the last good data. | The test on the total is written by hand, as a singular test: packages don't offer a plain "change against the previous value" test. dbt-expectations, now maintained by Metaplane (the original by Calogica is no longer supported), has fixed row-count bounds and a moving standard deviation test; Elementary's `volume_anomalies` learns what's normal from history. Real syncs fail in many ways; this one restarts from the start of the week. |
| 4 · Three Tuesdays | A test with `severity: warn` doesn't fail the dbt task, so a Databricks job's failure notification doesn't fire. A warning reaches people only if something sends it: a step that reads the run results or the stored failures (`store_failures`), or `--warn-error` to treat it as an error. Jobs send notifications by email or to system destinations: Slack, Microsoft Teams, PagerDuty and webhooks. With an error, the painting keeps the data from the last successful build. | The note on the painting is the dashboard's own, as in *Silent change*: a real dashboard needs a freshness field or a status table to show it. The channel of forty unread notes is a picture of alert fatigue, not a product. |
| 5 · Choosing the level | Severity follows the cost of a wrong number; thresholds follow what's normal, including seasons such as closing dates. Warnings need an owner. | Real limits are usually tuned over time, per season or per day of the week; the film shows two fixed bands. |
| 6 · Follow the thread | Lineage from the dashboard back to bronze. Uniqueness on a business key: `dbt_utils.unique_combination_of_columns`, the built-in `unique` test on an expression, or a surrogate key tested with `unique`. On Databricks, a primary key constraint is informational, not enforced, so the test is still needed. | Three columns stand for a business key that, in a real admissions system, may need more care (an applicant can apply twice, deliberately). |
| 7 · Fix at the source | The duplicates are in the source system, so they're removed there. The platform then replaces just the affected week: Delta's `replaceWhere` (or `INSERT ... REPLACE WHERE`) atomically replaces the rows matching a predicate, such as a week's dates; Lakeflow pipelines have REPLACE WHERE flows for reprocessing a range. Silver and gold are rebuilt over the same range, for example with dbt's `replace_where` or `insert_overwrite` strategies, or a microbatch backfill with `--event-time-start` and `--event-time-end`. Appending wouldn't remove the old copies, and Auto Loader doesn't read a file again unless it's overwritten. Delta time travel (`VERSION AS OF`, `TIMESTAMP AS OF`, `DESCRIBE HISTORY`) compares the table before and after. | "Loads the week again" stands for a predicate-scoped replace. Time travel reaches back 30 days of history by default, but on current Databricks runtimes only as far as `deletedFileRetentionDuration`, 7 days by default: enough for a day-old comparison. |
| 8 · Pull back | Every incident leaves a test behind. The ending hints at freshness: Databricks' data quality monitoring (formerly Lakehouse Monitoring, now with anomaly detection on freshness and completeness, in Public Preview) can notice a table that's late. | The hint is wordless; *Late* would name the products. |

**Also true, and not in the film.** Lakeflow Spark Declarative Pipelines (formerly Delta Live Tables) have expectations with three actions: keep and record (`expect`), drop the row (`expect_or_drop`) and fail the update (`expect_or_fail`). They check rows, so a test on a total would sit on an aggregate table. The film uses dbt tests, as *Silent change* did.

## Sources

Checked on 27 September 2026.

- dbt: [data tests](https://docs.getdbt.com/docs/build/data-tests), [severity, warn_if and error_if](https://docs.getdbt.com/reference/resource-configs/severity), [fail_calc](https://docs.getdbt.com/reference/resource-configs/fail_calc), [store_failures](https://docs.getdbt.com/reference/resource-configs/store_failures), [uniqueness on two columns](https://docs.getdbt.com/faqs/Tests/uniqueness-two-columns), [constraints](https://docs.getdbt.com/reference/resource-properties/constraints), [Databricks configs: replace_where and insert_overwrite](https://docs.getdbt.com/reference/resource-configs/databricks-configs), [microbatch](https://docs.getdbt.com/docs/build/incremental-microbatch)
- Packages: [dbt-utils](https://github.com/dbt-labs/dbt-utils), [dbt-expectations (Metaplane)](https://github.com/metaplane/dbt-expectations), [dbt-expectations (Calogica, no longer supported)](https://github.com/calogica/dbt-expectations), [Elementary volume anomalies](https://docs.elementary-data.com/data-tests/anomaly-detection-tests/volume-anomalies)
- Databricks: [pipeline expectations](https://docs.databricks.com/aws/en/ldp/expectations), [where is DLT](https://docs.databricks.com/aws/en/ldp/concepts/where-is-dlt), [data quality monitoring](https://docs.databricks.com/aws/en/data-governance/unity-catalog/data-quality-monitoring/), [anomaly detection](https://docs.databricks.com/aws/en/data-governance/unity-catalog/data-quality-monitoring/anomaly-detection/), [job notifications](https://docs.databricks.com/aws/en/jobs/notifications), [dbt in jobs](https://docs.databricks.com/aws/en/jobs/how-to/use-dbt-in-workflows), [selective overwrite](https://docs.databricks.com/aws/en/delta/selective-overwrite), [REPLACE WHERE flows](https://docs.databricks.com/aws/en/ldp/flows-replace-where), [Auto Loader FAQ](https://docs.databricks.com/aws/en/ingestion/cloud-object-storage/auto-loader/faq), [table history and time travel](https://docs.databricks.com/aws/en/tables/history)

## Pacing report

`python tools/pace.py`, run from `source/`, on draft 1. The lines aren't voiced yet, so it estimates each at 171 words a minute, *Silent change*'s voiced rate; run it again after `tts.py`.

```
no src/vodur.js yet: line lengths are estimated at 171 words a minute, as voiced in Silent change

scene      duration   wpm  voice  longest quiet  notes
open          34.0s   122    71%           5.0s  
limits        52.3s   133    78%           1.8s  
night         53.6s   138    81%           1.8s  
tuesdays      75.9s   133    78%           5.3s  
level         38.0s   137    80%           1.8s  
thread        36.2s   136    80%           1.8s  
reload        43.8s   137    80%           1.8s  
end           22.0s   101    59%           6.0s  

total 5:55.8, 782 words, 132 wpm, voice 77% of the time, 171 wpm while speaking
sentences with under 0.5 s after them: 0; stops of 2.5 s or more inside chapters: 0
```

Within the series' guides: about 125 to 135 words a minute, a beat of 0.8 s after every sentence, no stop of 2.5 s or more inside a chapter, and three wordless moments (the title, the three Tuesdays, the ending). The densest chapters, *Choosing the level* and *Fix at the source*, are at 137 words a minute; if the voice runs slower than the estimate, they're the first to trim.

## Next checkpoints

1. ~~Script with a rigour sheet and pacing report.~~ This draft.
2. Style frames: the gauge on the painting, the row checks passing while the gauge goes red, the three Tuesdays, and the reload.
3. A voice test, then `tts.py` and a pacing report on the real voice.
4. The first cut.
