# In the weeds of data crafting · One row of what, and when: script

*The script of a film of In the weeds of data crafting, a technical series for analytics engineers, as planned: about 4:45 (target 4 to 6 minutes), in eight chapters, in English, 30 September 2026. The narration lives in [`source/src/narration.js`](source/src/narration.js) and the pauses in [`source/src/breath.js`](source/src/breath.js); this page and those files say the same thing, and where they differ, the source wins. The timings are estimates from the word count (613 words, at the pace of the opening film) until the voice is recorded; the pacing report replaces them. Takes step 3 of Jun's ten: define what each consumer needs, its grain and its history.*

## The promise

A practitioner follows every line, and a data architect agrees with it. Before any SQL, each output says in one sentence what one row is and which day it describes, and that sentence becomes a test. A versioned thing joined on its key alone multiplies rows without an error; joined at the date the question asks about, it doesn't. Versions arrive dated by when a platform saw a change, so where a system says when a change took effect, that date wins, and where it doesn't, the gap is written down. Two consumers can read the same core as it was and as it is, and get two different answers that are both right. **Declare the grain and the day before any SQL, and test both.**

## The story in one paragraph

In 1890 the United States counted its people as they were on one day, 1 June: counting took weeks, but a baby born after the first wasn't counted, and each person became a punched card that Hollerith's machines counted. Planning's question needs both: one card per person, as at one day. Before any SQL, Jun's table for Planning gets its grain: one row per learner per award, as at census date. The agent drafts it from Planning's question and the census report; Noor approves it; it becomes a test. It matters at once: a Health graduate certificate was renamed in July, so the award has two versions, and joined on its key alone, eight learners become sixteen rows and 185 credit points become 370, with no error. Joined at the version valid on census day, there are eight rows again. Versions come from the sources, dated by when the platform saw a change; where a system says when a change happened, the model uses that. The core builds its own versions from those dated facts: Aisha's credit towards her certificate has six, from 5 points in October to 60 in July. Planning asks about census day: Aisha held 45 of 60, and counts. The wallet asks about today: Aisha has finished, and her wallet shows the certificate. Planning's question, learners within 15 points of a certificate, gives twelve as it was on census day and nine asked today. Both are right: they answer about different days. Aisha's three systems are cut at every change date and stitched into one timeline, the student system winning each value. And Priya's withdrawal, effective four days before census and recorded a week late, shows why the effective date wins: dated by recording, Business counts four against the census report's three. Two consumers, one core: next, write down what each is promised.

## What each object stands for

| Object | Stands for |
|---|---|
| One person's column of answers on a family schedule becoming a punched card | One record per thing: the grain |
| A calendar page fixed at "June 1" while the calls go on for weeks | As at one day: time declared, not implied |
| Hollerith's tabulator, a dial advancing as each card passes | Counting rows: the answer depends on what a row is |
| A sentence card, "One row per learner per award, as at census date" | The grain, in one sentence, in `meta.grain` |
| The teal orb over Planning's question and the census report; Noor's gold tick | The agent drafts the output specification; the architect approves the grain |
| A test card, `unique_combination` on learner and award | The grain, tested as a key |
| One award card splitting into two stacked versions (old name, new name) | A versioned entity: the renamed award |
| Rows doubling as each learner meets both versions; a credit total climbing | Fan-out: what a join at the wrong grain does |
| A date line through the stack, one version lit | A point-in-time join: the version valid on census day |
| Stacked cards, each with "from" and "to" dates | Every version kept at ingestion |
| A small eye on each date, "seen", beside a clock, "happened" | When the platform saw a change, and when it was true |
| Aisha's credit as a staircase: 5, 20, 25, 30, 45, 60 | Credit towards an award, versions the core builds from dated results and credentials |
| Two consumer badges, Planning and the wallet, each with a date pin | Each output chooses its day: as it was, as it is |
| Planning's question with two date columns, faculty by faculty: 12 and 9 | Both right: the same question about different days |
| Three coloured bands (blue, green, pink), cut by vertical lines | Three versioned sources, cut at every change date |
| One white band below, drawn segment by segment | One stitched timeline per learner |
| A late card sliding in from the side, "recorded 3 Apr" | Late news: a change recorded after it took effect |
| The label `runs on dbt Core · DuckDB` on every code card | The setup is real, and anyone can run it |
| Two consumer contract cards on one core | The next step: write down what each is promised |

## Script

### 1 · One card, one day · 0:00–0:30

**Narration.** The first of June, 1890. The United States counted its people as they were on that one day. Counting took weeks, but a baby born after the first wasn't counted. Someone who died after it was. Each person became a punched card, counted by Herman Hollerith's machines. One card per person, as at one day. Planning's question needs both.

**Picture.** The warm past, with "1890 · United States" in the corner. A calendar page fixed at "June 1". A census taker at a door with the 1890 family schedule, one sheet per household, each person a column of answers; the calendar stays pinned while the days of June run past beside it (2, 9, 16…), carrying the weeks of counting. A cradle drawn on a later day is set aside, uncounted; a person in the household who is gone by a later day keeps their column. Later, in an office in Washington, one person's column lifts from the sheet into a card; a clerk's pantograph punch goes through it, one hole per answer, each a soft muffled knock. Cards stack. A tabulator's dial advances as a card passes. On the bridge, two words lift from the card and drift right, towards the present: "one per person" and "as at June 1". Wordless breather: the title card over the stack of cards, with the series' mark: "IN THE WEEDS OF DATA CRAFTING", *One row of what, and when*, "grain and time, declared before any SQL".

**On screen.** 1890 · United States · June 1 · weeks of counting, one day described · born after: not counted · died after: counted · one card per person · Hollerith · as at one day · *One row of what, and when* · grain and time, declared before any SQL

### 2 · One sentence · 0:30–1:02

**Narration.** Before any SQL, Jun's table for Planning gets one sentence. One row per learner per award, as at census date. That sentence is the grain. It says what a row is, and which day it describes. The agent drafts it from Planning's question and the census report. Noor, who owns the model, approves it. Then it becomes a test: no two rows with the same learner and the same award.

**Picture.** The loop of ten steps, small, with station 3 lit. Planning's consumer badge; the question card from earlier films above it. The two words from the past, "one per" and "as at", settle into a sentence card. The teal orb reads Planning's question and the census report's six columns (one row per faculty) and drafts; the sentence lights, "one row per learner per award" in white and "as at census date" in a clock's colour. Noor, outlined in cyan, adds a gold tick. The card becomes the mart's YAML, with its label:

```yaml
# models/marts/planning/_planning__models.yml · runs on dbt Core · DuckDB
  - name: mart_planning__near_award
    …
    config:
      meta:
        grain: One row per learner per award, as at census date
    …
    data_tests:
      # the grain, tested as a key
      - unique_combination:
          arguments:
            columns: [learner_key, award_key]
```

On "a test", the `unique_combination` lines light, and a thin line from `docs/conventions.md` writes below: "Every model's grain (`meta.grain`) is tested as a key". Beside it, three rows of Aisha's at census slide in (her certificate, and a master's and a second certificate her microcredentials also count towards): three rows, one learner, three awards. The test ticks green.

**On screen.** step 3 · what each consumer needs · one row per learner per award · as at census date · the grain · what a row is · which day · drafted · approved · Noor · a test · no two rows, same learner, same award · runs on dbt Core · DuckDB

### 3 · Fan-out · 1:02–1:41

**Narration.** Here's why it matters. In July, a graduate certificate in Health changed its name. So the award has two versions: the old name, and the new one. Join the credit to the award on its key alone, and every learner meets both versions. Eight learners become sixteen rows. A hundred and eighty-five credit points become three hundred and seventy. Nothing errors, and every row looks right. Only the test on the grain notices. Join the version that was valid on census day, and there are eight rows again.

**Picture.** One award card, `SIS|GCHI`, "Graduate Certificate in Health Information Management", splits into two stacked versions on a date line: 1 Nov 2024 → 2 Jul 2026, then 2 Jul 2026 → (open), "Health Informatics". Eight learner rows, each with its credit, join to it. On "key alone", each row meets both versions and doubles (a low double thud); a credit total climbs from 185 to 370. The rows look ordinary: each name, each number plausible. The grain test from chapter 2 turns red: "16 rows · 8 learners". Then the join gains its date condition; a vertical line at 31 March lights one version; the rows fold back to eight; the test turns green. The analysis, with its label:

```sql
-- analyses/fan_out_without_point_in_time.sql · runs on dbt Core · DuckDB
every_version as (
    select awards.award_code, credit.learner_key, credit.credit_points_earned
    from credit
    inner join awards on awards.award_key = credit.award_key
),

version_at_census as (
    select awards.award_code, credit.learner_key, credit.credit_points_earned
    from credit
    inner join awards
        on awards.award_key = credit.award_key
        and {{ valid_at(census_date(), 'awards.valid_from', 'awards.valid_to') }}
)
```

and its result, from `dbt show`:

```
joined_to              rows_returned  learners  credit_points
every version                     16         8            370
the version at census              8         8            185
```

**On screen.** renamed · 2 Jul 2026 · two versions · joined on the key alone · 8 learners → 16 rows · 185 → 370 credit points · no error · the grain test · the version valid on census day · 8 rows

### 4 · Every version kept · 1:41–2:27

**Narration.** Those versions come from the sources. Nothing is overwritten: every change arrives as a new row, with the date it started and the date it ended. But those dates say when the platform saw a change, not when it was true. Where a system says when something happened, the model uses that. The core builds its own versions from those dated facts. Aisha's credit towards her certificate has six. Five points in October, forty-five by the end of February, and sixty in July. So the core's grain is: one row per learner, per award, per version. A test checks that no two versions overlap.

**Picture.** Three source streams in their colours (blue, green, pink) arrive as stacks of cards; on each card, four small columns. `docs/sources.md` opens beside them:

```markdown
<!-- docs/sources.md · runs on dbt Core · DuckDB -->
| Column | What it records |
|---|---|
| `_valid_from` | When ingestion recorded this version |
| `_valid_to` | When ingestion recorded the next version, or saw the row disappear. … |
| `_is_current` | `true` for the version that holds now |
| `_loaded_at` | When ingestion last wrote this row: … |

These dates record when the platform saw a change, not when it was true. Where a system says when
something was true (the student system's `effective_date` and `result_date`), the model uses that.
```

On "saw", a small eye marks each `_valid_from`; on "true", a clock marks `effective_date` and `result_date`, and the clock wins. On "builds", the source cards give way to dated facts: results with their result dates, credentials with their issue dates. Aisha's credit towards `SIS|GCDA` draws from them as a staircase, one step per version, each step marked by the result or credential that made it, each card stacking with a soft paper sound (the real rows of `core_credit_towards_award_v1`):

```
valid_from   valid_to     credit_points_earned
2025-10-14   2025-12-05     5
2025-12-05   2026-01-20    20
2026-01-20   2026-02-12    25
2026-02-12   2026-02-27    30
2026-02-27   2026-07-03    45
2026-07-03   (open)        60
```

Then the core's YAML:

```yaml
# models/core/_core__models.yml · runs on dbt Core · DuckDB
  - name: core_credit_towards_award
    …
      meta:
        grain: One row per learner per award per version
    …
    data_tests:
      - unique_combination:
          arguments:
            columns: [learner_key, award_key, valid_from]
      - versions_do_not_overlap:
          arguments:
            key_columns: [learner_key, award_key]
```

**On screen.** every version kept · valid from · valid to · is current · loaded at · when the platform saw it · when it was true · effective date wins · built from dated facts · Aisha · Graduate Certificate in Data Analytics · 5 → 20 → 25 → 30 → 45 → 60 · one row per learner per award per version · no two versions overlap

### 5 · As it was, as it is · 2:27–3:10

**Narration.** Now two consumers read the same versions, and ask about different days. Planning asks about census day, the 31st of March. Aisha held forty-five of sixty points, with fifteen to go. She counts. The wallet app asks about today. Aisha finished in July, and her wallet shows the certificate. Ask Planning's question, learners within fifteen points of a certificate, as it was on census day: twelve. Ask it today: nine. Both are right. They answer about different days. So each output declares its day, and one small macro picks the version valid on it.

**Picture.** Split screen. The mood of the bed turns from minor to major here. Left: Planning's badge, a date pin at 31 Mar 2026; Aisha's staircase from chapter 4 with a vertical line through the 45 step: "45 of 60 · 15 to go · counted". Right: the wallet's badge, a date pin at today (30 Sep 2026); the staircase has reached 60, and a wallet card shows "completed" and five credentials (one award, three microcredentials, one badge; 0 revoked): "not counted: she's there". Then the split closes. Planning's question card comes forward, "learners within 15 points of a graduate certificate, by faculty", and under it two date columns draw faculty by faculty, "31 Mar 2026" and "30 Sep 2026", from `analyses/diff_as_was_as_is.sql`:

```
faculty                    as at census   now
                           31 Mar 2026    30 Sep 2026
Arts and Education               2          0
Business                         3          1
Engineering and IT               5          6
Health                           2          2
                                12          9
```

On "both are right", both columns stay lit and neither dims; a small caption under them: "the same question · two days". The two badges return, and their grains write under them: "One row per learner per award, as at census date" and, from `models/marts/wallet/_wallet__models.yml`, "One row per learner, as it is now". On "macro", `macros/time.sql` opens, with its label:

```sql
-- macros/time.sql · runs on dbt Core · DuckDB
{#-
    True for the version that was valid on a date: valid_from is inclusive, valid_to exclusive,
    and a null valid_to means the version is still current. Used for every point-in-time join.
-#}
{% macro valid_at(as_at, valid_from='valid_from', valid_to='valid_to') -%}
    ({{ valid_from }} <= {{ as_at }} and ({{ valid_to }} is null or {{ valid_to }} > {{ as_at }}))
{%- endmacro %}
```

and beside it, the mart that uses it, trimmed:

```sql
-- models/marts/planning/mart_planning__near_award.sql · runs on dbt Core · DuckDB
-- as it was: each entity's version on the census date
learners_at_census as (
    select * from learners
    where {{ valid_at(census_date()) }}
),
…
credit_at_census as (
    select * from credit
    where {{ valid_at(census_date()) }}
),
```

The decision writes itself at the bottom, from `docs/decisions.md`: "8 Oct 2026 · Planning's mart is as it was at census, dated by when things took effect. The wallet's marts are as they are now." with a gold tick.

**On screen.** census day · 31 Mar 2026 · 45 of 60 · counted · today · completed · 5 credentials · learners within 15 points of a graduate certificate · 31 Mar 2026: 12 · 30 Sep 2026: 9 · both right · the same question · two days · one row per learner, as it is now · valid_at · from inclusive · to exclusive

### 6 · One timeline · 3:10–3:46

**Narration.** A learner lives in three systems, and each keeps its own versions. Aisha's platform account came first. Her student record took effect six days later. A short-course account arrived in January. Jun cuts all three at every date on which any of them changed, and stitches one timeline. On each date, the student system's value wins, then the platform's, then the short course's. A change that alters nothing the model holds makes no new version. Four dates give Aisha three.

**Picture.** Three horizontal bands, one per source colour, on a shared date axis: green from 15 Jul 2025 (platform account, "active"); blue from 21 Jul 2025 ("ENR"), turning at 20 Jul 2026 ("CMP"); pink from 6 Jan 2026 ("1"). Vertical cut lines drop at each of the four dates. Below, one white band is drawn segment by segment; in each segment, a small stack shows which source's value wins (blue over green over pink). At 6 Jan, a segment starts, finds nothing the model holds has changed, and merges back into the one before it. Three versions remain, labelled from `core_learner_v1`: 15 Jul 2025 studying · 21 Jul 2025 studying, enrolled in the certificate · 20 Jul 2026 completed. The code, trimmed, with its label:

```sql
-- models/intermediate/int_learner_timeline.sql · runs on dbt Core · DuckDB
-- every date on which any source changed
change_dates as (
    select learner_key, valid_from as changed_on from versions
    union
    select learner_key, valid_to from versions where valid_to is not null
),
…
-- one value per attribute: the student system first, then the learning platform, then short courses
resolved as (
    select
        …
        coalesce(student_email, platform_email, customer_email) as email,
```

**On screen.** three systems · three timelines · 15 Jul 2025 · 21 Jul 2025 · 6 Jan 2026 · 20 Jul 2026 · cut at every change · one timeline · student system first · then the platform · then short courses · no change, no version · four dates → three versions

### 7 · Late news · 3:46–4:26

**Narration.** Last, Priya. She withdrew from her certificate on the 27th of March, four days before census. The student system recorded it on the 3rd of April, a week late. Dated by when it was recorded, she'd still be studying on census day, and Business would count four. The census report says three. Dated by when it took effect, Business counts three. As in 1890, the answer describes the day, not the day it was written down. The platforms only say when they recorded a change. That gap is accepted, and written down.

**Picture.** Priya's row (keys only: `SIS|S-20431`, Graduate Certificate in Business Administration, 45 of 60). The census line at 31 March. A withdrawal card, "WD · took effect 27 Mar", arrives late from the side, "recorded 3 Apr" on its tab (a muted knock, off to one side). The evidence, with its label:

```sql
-- analyses/profile_late_changes.sql · runs on dbt Core · DuckDB
select
    *,
    {{ dbt.datediff('took_effect', 'recorded_on', 'day') }} as days_late
from versions
where {{ dbt.datediff('took_effect', 'recorded_on', 'day') }} > 1
order by days_late desc
```

```
student_id  status_code  took_effect  recorded_on  days_late
S-20431     WD           2026-03-27   2026-04-03   7
```

Two ways to date the card. First, placed at 3 April: on census day Priya is still studying, 15 to go; Business shows "4" in amber against the report's "3", with a small red cross between them (the reconciliation test that makes this a failure is the next film's). Then placed at 27 March: she is withdrawn on census day; Business "3", green. The 1890 calendar page, "June 1", flickers in behind for a moment. The rule, from `int_learner_timeline.sql`:

```sql
-- models/intermediate/int_learner_timeline.sql · runs on dbt Core · DuckDB
-- the student system says when each version took effect: that date, not the date it was recorded
student_versions as (
    select
        …
        student_records.effective_date as valid_from,
        …
        student_records.recorded_from as recorded_at,
```

Then gap 6 of `docs/gaps.md` writes itself, trimmed: "A change is dated when it happened. · The student system records some changes late … The platforms only say when they recorded a change. · **Rule in the model:** use the student system's effective date. **Accept** that platform dates are the day the platform recorded the change."

**On screen.** took effect 27 Mar · recorded 3 Apr · 7 days late · dated by recording: Business 4 · census report: 3 · dated by effect: Business 3 · when it was true · when it was recorded · recorded_at kept · platforms: recorded date · gap 6 · accepted

### 8 · A promise to write · 4:26–4:44

**Narration.** One row of what, and when. Declared before any SQL, and tested. Two consumers, one core. Before any more code, write down what each is promised.

**Picture.** The core, drawn as the blueprint's gold node, with its versions stacked behind it. Above it, two consumer cards: Planning, "as it was · one row per learner per award", and the wallet, "as it is · one row per learner". Each card is still blank below its title, where a contract will go. The loop's stations 4 and 5 light. Wordless end card: *One row of what, and when* · "Say what one row is, and which day it describes, before any SQL." · In the weeds of data crafting.

**On screen.** one row of what · and when · declared · tested · two consumers · one core · what each is promised · *One row of what, and when* · Say what one row is, and which day it describes, before any SQL.

## Pause and think

Four stops, one question each.

| After | Question | Answer, in short |
|---|---|---|
| 2 · One sentence (`grain`) | Why write the grain before the SQL? | It says what the query must produce, so the SQL can be checked against it; written after, it describes whatever the SQL happened to do. As a test, it catches a wrong join on every run. |
| 3 · Fan-out (`fan`) | The grain test failed. What's wrong: the data, the join, or the grain? | The join. The data is right (the award really has two versions) and so is the grain; the join ignored the date, so each learner met both versions. |
| 5 · As it was, as it is (`was`) | Twelve or nine: which is right? | Both. They are the same question, learners within 15 points of a graduate certificate, asked about two days: twelve as at census day, which Planning asked for; nine as at today. The output's grain says which day it describes. |
| 7 · Late news (`late`) | The platforms don't record when a change took effect. Which date do you use for them? | The date they recorded it, because it's the only one there is: accepted, and written down as a gap (gap 6), so no one mistakes it for when the change happened. |

## Rigour sheet

| Chapter | What the film says | What an expert would add, or what it simplifies |
|---|---|---|
| 1 | In 1890, the United States counted its people as they were on one day, 1 June. Counting took weeks. | 1 June 1890 was the census day; the instructions to enumerators asked for everyone whose usual place of abode on 1 June was in the household. Enumeration began on 2 June, because 1 June was a Sunday (checked by date arithmetic), and ran for weeks (a month in most places). 1890 was the first census with a separate schedule per family: up to ten persons per sheet, each person a column of answers, which is what the picture draws. |
| 1 | A baby born after the first wasn't counted; someone who died after it was. | From the 1890 instructions: persons born after 1 June were omitted; persons alive on 1 June who had died since were included. The film says "after the first", not a specific day. |
| 1 | Each person became a punched card, counted by Hollerith's machines. | The 1890 census was the first to use Herman Hollerith's electric tabulating system: a card per person, holes for answers, punched from the schedules by clerks in Washington with a pantograph (keyboard) punch, not by the enumerators; pins through the holes closed a circuit and advanced a dial. Claims about how much time it saved vary by source; the film gives none. Most of the 1890 population schedules were later lost after a fire in 1921 (not told). |
| 2 | The grain says what a row is, and which day it describes. | dbt has no built-in grain field; the project keeps it in `config.meta.grain` and, by convention, tests it as a key (`docs/conventions.md` 78). Many teams state the grain without the "as at" part; the series adds it because time is part of what a row means. |
| 2 | The agent drafts it from Planning's question and the census report; Noor approves it. | The story's step 3 (output specification): the agent drafts, the architect approves grain and entities (the plan's roles). The census report (`seeds/census_report.csv`) has six columns, one row per faculty: `census_date`, `faculty_code`, `faculty_name`, `learners_near_graduate_certificate`, `published_by`, `published_on`. A per-learner, per-award grain can't come from the report alone: it comes from Planning's question (learners, near an award, as at census), with the report as the total to reconcile against. |
| 2 | It becomes a test: no two rows with the same learner and award. | `unique_combination` is the project's own generic test (`tests/generic/unique_combination.sql`), in the same spirit as `dbt_utils.unique_combination_of_columns`. The mart also declares a primary key on `learner_award_key`, informational on Databricks and left out on DuckDB. Aisha has three rows in the mart at census (GCDA, MDA, GCCS: microcredentials count towards several awards), checked 30 September 2026. |
| 3 | A Health graduate certificate changed its name in July; the award has two versions. | `core_award_v1`: `SIS|GCHI` from 2024-11-01 to 2026-07-02, "Health Information Management"; from 2026-07-02, "Health Informatics". |
| 3 | Joined on the key alone, eight learners become sixteen rows, and 185 credit points become 370; at the version valid on census day, eight rows. | `dbt show --select fan_out_without_point_in_time --profiles-dir .`, run 30 September 2026: `every version 16 8 370`; `the version at census 8 8 185`. The analysis joins credit already at census, so the only doubling is the award's. |
| 3 | Nothing errors; only the test on the grain notices. | A join doesn't check cardinality; SQL returns every matching pair. dbt's model contracts check names and types, not row counts. The analysis itself is not tested; the mart it illustrates is, by its `unique_combination` test. |
| 4 | Every change arrives as a new row, with the date it started and the date it ended. | The series assumes ingestion keeps every version (a slowly changing dimension of type 2, SCD2; named here only) and is out of scope. In dbt, snapshots add `dbt_valid_from` and `dbt_valid_to`; on Databricks, Lakeflow's `AUTO CDC … STORED AS SCD TYPE 2` fills `__START_AT` and `__END_AT` from the `SEQUENCE BY` column. The project's sources carry `_valid_from`, `_valid_to`, `_is_current`, `_loaded_at` (`docs/sources.md` 7-12). |
| 4 | Those dates say when the platform saw a change, not when it was true. | True of the project's sources and of snapshots with the default configuration (the time the snapshot ran, or the source's `updated_at`). A `SEQUENCE BY` column or `updated_at` that holds a business date gives business dates instead; which one a source uses is to be checked, source by source (step 2). |
| 4 | The core builds its own versions from those dated facts; Aisha's credit has six: 5 points in October, 45 by the end of February, 60 in July. | `core_credit_towards_award_v1`, learner `SIS|S-20417`, award `SIS|GCDA`: 2025-10-14 5; 2025-12-05 20; 2026-01-20 25; 2026-02-12 30; 2026-02-27 45; 2026-07-03 60 (open). Credit counts from the day a result is released or a credential issued (`docs/decisions.md` 16), so these are business dates computed by `core_credit_towards_award`, not the dates ingestion saw a change. |
| 4 | A test checks that no two versions overlap. | `tests/generic/versions_do_not_overlap.sql`: each version ends after it starts and no later than the next begins; only the last may be open. Declared on `core_credit_towards_award` (`_core__models.yml` 299-301) and the other core timelines. |
| 5 | Census day, 31 March; Aisha held 45 of 60, 15 to go; she counts. | Var `census_date: "2026-03-31"` (`dbt_project.yml` 15). `mart_planning__near_award`: GCDA, 45 earned, 15 remaining, `is_near_award` true. "Within 15" means more than 0 and at most 15 left (`macros/near_award.sql` 7-9). |
| 5 | Aisha finished in July; her wallet shows the certificate. | Third unit passed 3 July 2026 (60 of 60); status completed from 20 July 2026. `mart_wallet__learners` with `--vars '{as_is_date: 2026-09-30}'`: completed, 5 credentials (1 award, 3 microcredentials, 1 badge), 0 revoked. |
| 5 | Planning's question, learners within fifteen points of a certificate: twelve as it was on census day, nine today. Both right; they answer about different days. | The same question asked twice: `analyses/diff_as_was_as_is.sql` line 1, "the same question as at census (as it was) and now (as it is)"; both columns count learners studying towards a graduate certificate with more than 0 and at most 15 points left. The wallet's mart doesn't count this: its grain is one row per learner, as it is now. `dbt show --select diff_as_was_as_is`, run 30 September 2026 with `as_is_date` pinned to that day: Arts and Education 2 / 0, Business 3 / 1, Engineering and IT 5 / 6, Health 2 / 2. Twelve matches `seeds/census_report.csv` (published 14 April 2026), difference 0 in every faculty (`reconcile_census_report`). "Now" moves: pin `as_is_date` to repeat the nine. |
| 5 | One small macro picks the version valid on a date. | `macros/time.sql` 7-13: from inclusive, to exclusive, null means current. "As it is" is the version valid today, not the latest recorded, since a change can be dated in the future (`docs/conventions.md` 73). Point-in-time joins can also be written with range joins or `ASOF` joins where the engine supports them; the macro keeps one definition. |
| 6 | Aisha's platform account came first; her student record took effect six days later; a short-course account arrived in January. | `stg_learning_platform__users` `LMS|u-88213` recorded 15 July 2025; `stg_student_system__learners` `SIS|S-20417` effective 21 July 2025, completed effective 20 July 2026; `stg_short_courses__learners` `SC|aisha.k@mail.example` recorded 6 January 2026. |
| 6 | Cut at every change date and stitch one timeline; the student system wins, then the platform, then short courses. | `int_learner_timeline.sql` 111-118 (`change_dates`), 166-184 (`resolved`, `coalesce` in that order). A learner with two keys in one system takes the version recorded last on each date (`docs/gaps.md`, known limitations). |
| 6 | A change that alters nothing the model holds makes no new version; four dates give Aisha three. | `int_learner_timeline.sql` 212-221 (`changed`). `core_learner_v1` for Aisha: 2025-07-15 studying; 2025-07-21 studying, enrolled; 2026-07-20 completed. 101 versions of 46 learners in all. |
| 7 | Priya withdrew on 27 March; recorded on 3 April, a week late. | `dbt show --select profile_late_changes`: `S-20431 WD 2026-03-27 2026-04-03 7` (the only row). `core_learner_v1` keeps `recorded_at` 2026-04-03 beside `valid_from` 2026-03-27. |
| 7 | Dated by recording, Business would count four against the census report's three; dated by effect, three. | Dated by effect: `mart_planning__near_award` has Priya (`SIS|S-20431`, GCBA) enrolled, 15 remaining, status withdrawn, so not counted; Business 3, reconciliation difference 0. Dated by recording: she would be studying on 31 March with 15 remaining and counted, so Business 4. From the series plan's scratch run (student versions dated by `recorded_from` in a copy of the project: Business 4, reconciliation `FAIL 1`), and consistent with the mart's rows above; not committed to the project. |
| 7 | The platforms only say when they recorded a change; the gap is accepted and written down. | `docs/gaps.md` 13, gap 6; `int_learner_timeline.sql` 64-72. Recording both dates (when it was true, when it was known) is often called bitemporal; the core keeps `recorded_at` beside `valid_from` but answers as-was questions by effective date only, as known today. |

**Project files each snippet comes from** (checked against the files on 30 September 2026):

| Ch | File | Lines |
|---|---|---|
| 2 | `models/marts/planning/_planning__models.yml` | 3, 10-12, 21-25 (trimmed with …) |
| 2 | `docs/conventions.md` | 78 |
| 3 | `analyses/fan_out_without_point_in_time.sql` | 20-36 (blank lines inside the CTEs removed) |
| 3 | `dbt show --select fan_out_without_point_in_time` | result (header as printed: `joined_to`, `rows_returned`, `learners`, `credit_points`) |
| 4 | `docs/sources.md` | 7-15 (lines 10 and 12 trimmed with …) |
| 4 | `core_credit_towards_award_v1` rows for `SIS|S-20417`, `SIS|GCDA` | query of `target/credentials.duckdb` |
| 4 | `models/core/_core__models.yml` | 279, 285-286, 295-301 (trimmed with …) |
| 5 | `analyses/diff_as_was_as_is.sql` | result (faculty names shortened; the two dates and the totals added) |
| 5 | `models/marts/wallet/_wallet__models.yml` | 10 |
| 5 | `macros/time.sql` | 7-13 |
| 5 | `models/marts/planning/mart_planning__near_award.sql` | 21-27, 36-41 (blank lines removed) |
| 5 | `docs/decisions.md` | 15 |
| 6 | `models/intermediate/int_learner_timeline.sql` | 111-118, 166-174 (trimmed with …) |
| 6 | `core_learner_v1` rows for `SIS|S-20417` | query |
| 7 | `analyses/profile_late_changes.sql` | 17-22, and its result |
| 7 | `models/intermediate/int_learner_timeline.sql` | 39-46, 54 (trimmed with …) |
| 7 | `docs/gaps.md` | 13 (trimmed) |

The run behind every number: `dbt build --profiles-dir . --vars '{as_is_date: 2026-09-30}'`, dbt Core 1.12.5 with dbt-duckdb, 30 September 2026: 146 nodes, PASS 143, WARN 1 (by design: gap 5), ERROR 0.

**dbt and Databricks documentation** (the pages behind each claim; on 30 September 2026 docs.getdbt.com and docs.databricks.com couldn't be fetched from the build machine, so each claim was checked against the project's own run and against search results quoting the pages; to confirm on the pages on the day):

- dbt: "Add snapshots to your DAG" (docs.getdbt.com/docs/build/snapshots) and "Snapshot configurations" (docs.getdbt.com/reference/snapshot-configs): `dbt_valid_from`, `dbt_valid_to`, the timestamp and check strategies; "Model contracts" (docs.getdbt.com/docs/mesh/govern/model-contracts): names and types, not row counts; "Data tests" (docs.getdbt.com/docs/build/data-tests) and `data_tests` with `arguments:`; "meta" (docs.getdbt.com/reference/resource-configs/meta); "Analyses" (docs.getdbt.com/docs/build/analyses) and `dbt show` (docs.getdbt.com/reference/commands/show); "Jinja macros" (docs.getdbt.com/docs/build/jinja-macros); `dbt.datediff` (docs.getdbt.com/reference/dbt-jinja-functions/cross-database-macros).
- Databricks: "The AUTO CDC APIs" and "AUTO CDC INTO" (docs.databricks.com/aws/en/dlt/cdc; docs.databricks.com/aws/en/dlt-ref/dlt-sql-ref-apply-changes-into): `STORED AS SCD TYPE 2`, `__START_AT` and `__END_AT` from `SEQUENCE BY`; constraints, primary and foreign keys informational (docs.databricks.com/aws/en/tables/constraints).
- dbt-utils: `unique_combination_of_columns` (hub.getdbt.com/dbt-labs/dbt_utils), for comparison only.

**Historical sources.**

- US Census Bureau, "1890 Census Instructions to Enumerators" (census.gov/programs-surveys/decennial-census/technical-documentation/questionnaires/1890/1890-instructions.html) and "About the 1890 census" (census.gov/programs-surveys/decennial-census/decade/1890/about-1890.html): 1 June as census day; answers as of that date.
- IPUMS USA, "1890 Census: Instructions to Enumerators" (usa.ipums.org/usa/voliii/inst1890.shtml): usual place of abode on 1 June; enumeration from 2 June.
- US Census Bureau, "The Hollerith Machine" and "Tabulation and Processing" (census.gov/about/history/…): the tabulator, cards and dials.
- IBM, "The punched card tabulator" (ibm.com/history/punched-card-tabulator); The Henry Ford, "Hollerith Tabulating Machine, 1890".
- National Archives, Prologue, "First in the Path of the Firemen: The Fate of the 1890 Population Census" (1996): the later loss of the schedules (not told).
- Checked 30 September 2026 by web search (the census.gov, IPUMS and archives.gov pages themselves couldn't be fetched from the build machine): 1 June as census day; enumeration from 2 June because 1 June was a Sunday; births after 1 June omitted and deaths after 1 June included; one card per person, counted on dials. To confirm on the pages on the day. No figure for time saved is told.

## Labs

| # | Lab | Kind | The mechanism people break |
|---|---|---|---|
| 1 | *Declare the grain* | compose | Build the grain sentence for three outputs (the census dashboard, the wallet's learner page, the wallet's credential list) from parts: "one row per" + learner / award / credential / version + "as at census date" / "as it is now". The test it becomes appears beside it (`unique_combination` on the chosen columns). Pick "one row per learner" for the census dashboard, and Aisha's three awards collapse into one row: the picture shows which two awards vanish. |
| 2 | *Fan-out* | steps | Step through the renamed award: one version, eight rows, 185 points; add the July version, and every learner meets both: 16 rows, 370 points, the grain test red; add the date to the join, and it's 8 again. A third version (a second rename) makes it 24. |
| 3 | *As at census* | steps | A date slider over Aisha's credit staircase and her three versions: at each date, her credit, her status and whether she counts. At 31 March: 45 of 60, counted. After 3 July: 60 of 60, not near; after 20 July: completed. Slide to 26 February (30 of 60) and she isn't near either: 30 left. |
| 4 | *When was it true?* | pick | Four changes: Priya's withdrawal (effective and recorded dates), the award's rename (a new name from 2 July), Jordan's badge disappearing from the platform (the day the platform stopped showing it), a grade amended (the student system's result date). Pick the date that dates each version; the census count for Business moves with Priya's. |

## Scenarios

Eight situations, in this order.

1. **Spot the problem.** The census dashboard's credit total for Health is double the report's; every row looks right. (A versioned award joined on its key alone: each learner meets both versions. Join the version valid on census day; the grain test would have stopped it.)
2. **Choose.** The wallet team asks to show "the census number" in the app. (It's Planning's as-was count for 31 March, not a fact about the learner today; the wallet reads as it is now. If they need it, it's a new output with its own grain and day.)
3. **Choose.** A rename in July changes March's report when it's rebuilt. What went wrong? (The report read the award's latest version, not the one valid on census day. As-was outputs join every versioned thing at the census date.)
4. **Spot the problem.** A withdrawal is backdated to before census, after the census report was published. Planning's mart now counts one fewer than the report. (Both are right for what they knew: the mart applies today's knowledge to the census date. Record the difference; if the report must be reproduced exactly, the mart would need the date each fact was known too.)
5. **Choose.** Planning wants monthly snapshots, not one date. (A new grain: one row per learner per award per month-end. Declare it, test it on three columns, and join each version at each month's date.)
6. **Spot the problem.** A row of a source says `_is_current` is true, but its `effective_date` is next week. (Ingestion's `_is_current` means recorded last, not true today. The core's `is_current` is the version valid on the as-is date, `valid_at(as_is_date())`, so in the core this version isn't current until next week; read the core, not the source's flag.)
7. **Sort.** Sort the proposals into "keeps the grain" and "breaks it": join credit to awards on the key alone; join at `valid_at(census_date())`; take the latest version of each award; filter awards to `is_current`; group back to one row per learner per award after the join. (Only the point-in-time join keeps the grain and the answer; latest or current gives today's award in March's report, and grouping hides the doubling while the sums stay wrong.)
8. **Order.** Two versions of a learner overlap by a day. Put Jun's moves in order: read the failing rows of `versions_do_not_overlap`; find which source's dates overlap; check whether the source or the stitching made it; fix the code (or the source, with its owner); rerun the test. Never widen the test to let a day through.

## Pause and think

`grain`, `fan`, `was`, `late` (the questions and answers are in [Pause and think](#pause-and-think) above).

## Decisions taken

| Date | Decision |
|---|---|
| 30 September 2026 | Open in 1890 with the US census: one card per person, as at one day. "Counting took weeks" and "born after, not counted; died after, counted" carry "as at"; no figure for time saved is given. The past is kept to about 60 words (under 30 s). |
| 30 September 2026 | The fan-out uses the renamed Health award, from the project's own analysis, so the doubling is real, not staged. |
| 30 September 2026 | The film tells "twelve and nine, both right" as its key line: Planning's question asked about two days, not two consumers' answers. It pins `as_is_date` to 30 September 2026 for the nine. |
| 30 September 2026 | Priya's counter-case (Business 4) is told as a conditional ("dated by when it was recorded"), and its method is in the rigour sheet. |
| 30 September 2026 | "SCD2" and "bitemporal" appear only in the rigour sheet; the film says "every version kept" and "when it was true, when it was recorded". |
| 1 October 2026 | Series read-through: the opening line starts on the date ("The first of June, 1890.") so that the series' openings don't all begin "In [year]". In *Late news*, the red cross sits between the two numbers; the reconciliation test is the next film's. |

## Open

1. **Voice.** Check "sequel", "Pree-ya", "Hollerith" and the dates by ear; key strings, file names and test names stay on screen only.
2. **The counter-case.** Consider adding the recorded-date run as a documented analysis in the project, so viewers can repeat Business 4.
3. **The bed's turn.** The plan moves the key from A minor to A major at *As it was, as it is*; check it doesn't read as "nine, today, is the happy answer".
