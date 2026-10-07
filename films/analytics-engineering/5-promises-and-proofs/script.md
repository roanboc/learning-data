# In the weeds of data crafting · Promises and proofs: script

*The script of Promises and proofs, from In the weeds of data crafting, a technical series for analytics engineers, as planned: about 5:25 (target 4 to 6 minutes), in eight chapters, in English, 30 September 2026. The narration lives in [`source/src/narration.js`](source/src/narration.js) and the pauses in [`source/src/breath.js`](source/src/breath.js); this page and those files say the same thing, and where they differ, the source wins. The timings are estimates from the word count (664 words, at the pace of the opening film, with the holds) until the voice is recorded; the pacing report replaces them. Takes steps 4 and 5 of Jun's ten: name the gaps and write the contracts; write the tests, before any code.*

## The promise

A practitioner follows every line, and a data architect agrees with it. Between what the business expects and what the sources hold there are gaps, and each one needs a decision, written down: fix it at the source, write a rule in the model, or accept it and document it. Then the promises: an enforced, public contract on the core, which every consumer builds on, and a protected contract for each consumer's mart, with an exposure that says who reads it. Then the proofs, before the code they check: data tests for keys, relationships, allowed values, versions and a trusted number; unit tests for the logic; and a level for each test, warn or stop, set by the data's owner. **Promise it in a contract. Prove it with a test, first.**

## The story in one paragraph

Since 1300, silver sold in England has had to be tested before it's marked; from 1478 the testing was done at Goldsmiths' Hall in London, which gave the hallmark its name, and buyers still trust the mark without testing the silver themselves. A core model makes the same kind of promise, and its tests are the assay. Jun starts with the gap register, kept beside each source while its gaps are open: ten lines, each setting what the business expects beside what the source holds. The business expects a revoked credential to be known as revoked; the learning platform deletes it. That gap gets two decisions: a rule in the model (anything the platform stops showing is revoked from that day, as Jordan's was on 12 August) and a request to the platform for a proper flag. Once decided, each gap leaves the register: a rule becomes a decision in its source's log, an accepted gap a known limitation on the model, and only the fixes still awaited stay open. Then the contracts. The core folder is public and its contract enforced; the credential's YAML lists every column, its type and what can't be empty, and when the query and the contract disagree on a type, the build stops before the table is made. Planning's mart and the wallet's each carry their own grain and an enforced, protected contract, and each declares its exposure, so the lineage can say who to tell. Then the tests, before the code: keys, relationships, closed lists of agreed values, versions that never overlap, and the census report's twelve, reconciled faculty by faculty. A unit test proves the credit rule on two made-up rows, the microcredential's dates Jordan's. One enrolment has no email: the learning team agreed to warn on any and stop above five, so today the build warns once. A hundred and eleven data tests and four unit tests wait for the code they check: until it's built, none can pass, on purpose.

## What each object stands for

| Object | Stands for |
|---|---|
| "1300 · London"; a written standard, "sterling"; a leopard's head punch | The 1300 statute: a standard, a test, then a mark |
| A scraper taking a sliver; a small balance | The assay: testing before marking |
| Goldsmiths' Hall; "hall" lighting inside "hallmark" | Where the testing moved in 1478, and the word it gave |
| A buyer's hand picking up the marked piece | Trusting a mark without testing again |
| The loop of ten steps, stations 4 and 5 lit | Where this film sits in Jun's process |
| A two-column register, "expects" and "holds", ten lines | The gap register: the open gaps, kept beside each source in `requirements/` |
| Three coloured decision tags: fix at source, rule in the model, accept and document | The three decisions a gap can get |
| A green badge card fading out, then reappearing stamped "revoked · 12 Aug 2026" | Gap 1: the platform deletes; the model marks it revoked |
| Register lines struck through and fading; three lines glowing amber; three cards below | Each gap leaving the register once it's settled: a decision in its source's log, a known limitation on the model, or still open until the fix arrives |
| The core layer, its folder lit gold, with a padlock latch | The enterprise contract: public, enforced |
| A YAML card with a type beside every column | The contract: names, types, what can't be empty |
| A red bar across the build, with a small mismatch table | The contract refusing a changed type |
| Two mart cards on the core, each with its own grain line | The consumer contracts |
| A ring around the marts, labelled "protected" | Only this project can build on them (simplified; see the rigour sheet) |
| Planning's dashboard badge and the wallet's app badge, joined by dotted lines | Exposures: who reads what |
| A line running from `core_credential` to the wallet badge only | Lineage finds who to tell |
| A test list typing itself beside the outlines of the models it will check | Tests first |
| A scale weighing the mart's count against the census report | Reconciling with a trusted number |
| Two mock rows and three expected versions | A unit test on the credit rule |
| A traffic light: green, amber, red, with a counter of missing emails | Severity: warn or stop |
| A small clock on a source's edge | Source freshness |
| 112 and 4, in a column of hollow dots | Every test, waiting for the code |
| The teal orb, drafting | The AI agent drafts the register and the tests |
| Gold ticks from Mei, Noor, Planning, the wallet team, the learning team and Jun | Each owner approves their part |

## Script

### 1 · Tested before it's marked · 0:00–0:34

**Narration.** Under a law of 1300, English silver had to meet one standard: sterling. No piece could leave the workshop until it was tested, then marked. From 1478, the testing was done at Goldsmiths' Hall: the hall in hallmark. Buyers still trust the mark, without testing the silver themselves. A core model makes the same promise. Its tests are the assay, and they come before the mark.

**Picture.** The warm past, with "1300 · London" in the corner. A written standard unrolls: "sterling". A silversmith's cup on a bench; a small scraper takes a sliver from its foot (a filtered scrape); the sliver goes on a small balance, which settles. Only then does the punch come down (a low thud): a leopard's head, pressed into the silver. "1478 · Goldsmiths' Hall": the building's front, and the word "hallmark" with "hall" lit. A buyer's hand lifts the cup, turns it, sees the mark, and puts it in a basket without a second look. On the bridge line, the mark lifts off the cup and drifts right, towards the present, where it becomes a small hollow seal beside the core: not yet struck, because the core's tests haven't passed; at the end of this film it still waits. Wordless breather: the title card over the cup's struck mark, with the series' mark: "IN THE WEEDS OF DATA CRAFTING", *Promises and proofs*, "contracts say what's promised; tests prove it".

**On screen.** 1300 · London · sterling · tested · then marked · leopard's head · 1478 · Goldsmiths' Hall · hallmark · trusted without testing again · the tests are the assay · *Promises and proofs* · contracts say what's promised; tests prove it

### 2 · The gap register · 0:34–1:44

**Narration.** Step four: name the gaps. Jun's gap register lists them beside each source, while they're open: what the business expects, beside what the source holds, one line per gap. The business expects a revoked credential to be known as revoked. The learning platform just deletes it. Every gap gets one of three decisions. Fix it at the source. Write a rule in the model. Or accept it, and write it down. This one gets two. Anything the platform stops showing is revoked from that day. And the platform is asked for a proper flag. Jordan's microcredential vanished on the twelfth of August. From that day, it reads as revoked. Ten gaps, ten decisions. Mei approves the ones about meaning. Then each gap leaves the register. A rule in the model becomes a decision, in its source's log. An accepted gap becomes a known limitation, on the model. Only a fix still awaited stays open.

**Picture.** The loop of ten steps, small in a corner, station 4 lit. The teal orb drafts a two-column register ("expects", "holds"), headed `requirements/ · the open gaps`; ten lines type in, short labels only. The first line enlarges, rendered as a small table (not as raw YAML), as the register had it while the gap was open, with the label `requirements/sources/learning_platform/ · GAP-LMS-01 · runs on dbt Core · DuckDB`; the expectation and the reality as GAP-LMS-01 has them, the rule as DEC-LMS-01 has it, the rest of the decision trimmed with "…":

| # | Expectation | Reality | Decision | Where |
|---|---|---|---|---|
| 1 | A revoked credential is known as revoked. | The learning platform has no revocation flag. It deletes a revoked badge. | **Rule in the model:** a badge that disappears is revoked from the day the platform stopped showing it. **Fix at source**, requested: … | `int_credentials_unioned` |

Three tags drop in on "three decisions", each in its colour: "fix at source", "rule in the model", "accept and document". Gap 1 takes two of them. Jordan's microcredential (`LMS|B-5028`, Data Visualisation, green) sits in a row of badge cards; on 12 August it fades out; the model's rule brings it back, stamped "revoked · 12 Aug 2026". Then the ten lines each take their tag; gap 5 (no email: accept and document) and gap 10 ("No source records an expiry": accept and document) glow a moment. Mei (business outline) gives gold ticks to the lines about meaning (7, 9); the others are ticked by their owners (gap 1's rule, about a badge, by the learning team, which owns badges: DEC-LMS-01). On "leaves the register", the seven settled lines (3, 4, 5, 6, 8, 9, 10) strike through and fade, one after another, and three cards rise along the bottom as they're named: "a decision, in its source's log" (`sources/<system>/_<system>__decisions.yml`), "a known limitation, on the model" (`meta.limitations`) and "still open, until the fix arrives" (`requirements/sources/<system>/`). On "stays open", lines 1, 2 and 7, each still waiting on a fix at the source, glow amber.

**On screen.** Promise · step 4 · the gap register · requirements/ · the open gaps · expects · holds · GAP-LMS-01 · a revoked credential is known as revoked · the platform deletes it · fix at source · rule in the model · accept and document · LMS|B-5028 · revoked · 12 Aug 2026 · 10 gaps · 10 decisions · Mei approves meaning · a decision, in its source's log · a known limitation, on the model · still open, until the fix arrives

**In the repo.** [`requirements/`](https://github.com/roanboc/learning-data/tree/main/films/analytics-engineering/project/requirements/) · [`requirements/sources/learning_platform/_learning_platform__requirements.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/requirements/sources/learning_platform/_learning_platform__requirements.yml) · [`sources/learning_platform/_learning_platform__decisions.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/sources/learning_platform/_learning_platform__decisions.yml)

### 3 · The enterprise contract · 1:44–2:25

**Narration.** Then the contracts. The core is what everything else builds on, so it makes the strongest promise. The whole core folder gets two settings. Public: other projects may build on it. And a contract, enforced. The credential's YAML lists every column, its type, and what can't be empty. Its grain: one row per credential. Let the query and the contract disagree on a column's type, and the build stops before the table is made. The contract is checked at every build, not read once and forgotten. Noor approves it.

**Picture.** The blueprint (white on blue) above; below it, the four layers from the opening film, the core lit. A card opens with its label, and `access: public` and `enforced: true` light as they're named (a soft wooden latch on "enforced"):

```yaml
# dbt_project.yml · runs on dbt Core · DuckDB
    core:
      +materialized: table
      +schema: core
      +group: credential_model
      +access: public
      +contract:
        enforced: true
```

A second card, the credential's contract, each part lighting as it's named (`data_type`, `not_null`, `grain`):

```yaml
# models/core/student/_core_student__models.yml · runs on dbt Core · DuckDB
  - name: core_credential
    …
    config:
      meta:
        grain: One row per credential
        owner: Mei Tanaka, registrar's office
    …
    columns:
      - name: credential_key
        …
        data_type: string
        constraints: [{type: not_null}]
        data_tests: [unique, not_null]
      …
      - name: credit_points
        …
        data_type: int
```

On "disagree on a column's type", `credit_points`' type flips from `int` to `string` in the YAML, while the query still makes an integer; a red bar runs across the build and dbt's real message appears, trimmed (a muted double knock):

```
This model has an enforced contract that failed.
| column_name   | definition_type | contract_type | mismatch_reason    |
| credit_points | INTEGER         | VARCHAR       | data type mismatch |
```

The type flips back; the bar turns green. Noor (cyan outline) gives the card a gold tick.

**On screen.** the contracts · the core · the strongest promise · public · enforced · every column · its type · not null · one row per credential · query and contract disagree → build stops · checked at every build · Noor approves

**In the repo.** [`dbt_project.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/dbt_project.yml) · [`models/core/student/_core_student__models.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/core/student/_core_student__models.yml)

### 4 · Two consumer contracts · 2:25–3:06

**Narration.** Each consumer gets a contract of its own, on the same core. Each carries the grain it declared: Planning's as it was on census day, the wallet's as it is now. Both are enforced, and protected: only this project can build on them. And each declares an exposure: the dashboard or the app that reads it, with an owner and an email. Change the credential in the core, and the lineage finds one exposure: the wallet app. That's who to tell. Planning and the wallet team each approve their own.

**Picture.** Two mart cards rise on the core, each with its consumer badge and its grain line typing in (from `_planning__models.yml` line 12 and `_wallet__models.yml` line 10): "One row per learner per award, as at census date" and "One row per learner, as it is now". A ring closes around both, labelled "protected", from:

```yaml
# dbt_project.yml · runs on dbt Core · DuckDB
    marts:
      +materialized: table
      +schema: marts
      +access: protected
      +contract:
        enforced: true
```

On "exposure", Planning's exposure card types itself beside the dashboard badge:

```yaml
# exposures/planning/_planning__exposures.yml · runs on dbt Core · DuckDB
exposures:

  - name: census_dashboard
    label: Census dashboard
    type: dashboard
    maturity: high
    …
    owner:
      name: Planning
      email: planning@uni.example
    depends_on:
      - ref('mart_planning__near_award')
      - metric('learners_near_graduate_certificate')
```

and the wallet's, from `exposures/wallet/_wallet__exposures.yml` (`wallet_app`, type application, owner Wallet app team), beside the app badge. On "change the credential", `core_credential` pulses; a line runs down the lineage and reaches only the wallet badge, with the command's real answer: `exposure:credentials.wallet_app`. Planning's badge and the wallet's each give their card a gold tick.

**On screen.** consumer contracts · Planning · one row per learner per award, as at census date · the wallet · one row per learner, as it is now · enforced · protected · exposure · owner · email · change the credential → the wallet app · who to tell · Planning approves · the wallet team approves

**In the repo.** [`dbt_project.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/dbt_project.yml) · [`exposures/planning/_planning__exposures.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/exposures/planning/_planning__exposures.yml) · [`exposures/wallet/_wallet__exposures.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/exposures/wallet/_wallet__exposures.yml)

### 5 · Tests first · 3:06–3:47

**Narration.** Step five: the tests, before the code they check. They say what done looks like. Every key, unique and never empty. Every relationship, pointing at something real. Every closed list, from agreed values. Every history, with versions that never overlap. And one number people already trust: the census report's twelve learners. A test compares the model's count with the report, and fails on any faculty that differs. The agent drafts the tests from the contracts and the register. Jun reviews them.

**Picture.** The loop's station 5 lights. The models the tests will check are drawn as outlines, not yet built to pass them; beside them, a test list types itself, one kind per line, each with a small glyph as it's named: unique, not_null, relationships, accepted_values, versions_do_not_overlap. On "agreed values", the award's type, on `core_award`:

```yaml
# models/core/course/_core_course__models.yml · runs on dbt Core · DuckDB
      - name: award_type
        description: '{{ doc("award_type") }}'
        data_type: string
        data_tests:
          - accepted_values:
              arguments:
                values: [graduate certificate, master]
```

On "never overlap", the rule, in its own words:

```sql
-- tests/generic/versions_do_not_overlap.sql · runs on dbt Core · DuckDB
{#-
    A timeline, tested: for each key, every version ends after it starts, and ends no later
    than the next one starts. Only the last version may be open (valid_to null).
    Fails with one row per version that breaks the rule.
-#}
```

On "trust", the census report as a small table (Arts and Education 2, Business 3, Engineering and IT 5, Health 2: 12), from `seeds/expected/planning/census_report.csv`; a scale weighs it against an empty slot marked "the mart". The singular test:

```sql
-- tests/reconciliation/reconcile_planning_with_census_report.sql · runs on dbt Core · DuckDB
-- Planning's number, reconciled with the census report, faculty by faculty.
-- Fails with one row per faculty where they differ, or that the report doesn't cover.
…
select *
from compared
where in_the_census_report is null
   or in_the_mart <> in_the_census_report
```

The teal orb writes the list in teal; Jun (cyan) reads it and gives a gold tick.

**On screen.** Promise · step 5 · tests, before the code · what done looks like · unique · not null · relationships · agreed values · graduate certificate · master · versions never overlap · census report · 12 · faculty by faculty · the agent drafts · Jun reviews

**In the repo.** [`models/core/course/_core_course__models.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/core/course/_core_course__models.yml) · [`tests/generic/versions_do_not_overlap.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/tests/generic/versions_do_not_overlap.sql) · [`seeds/expected/planning/census_report.csv`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/seeds/expected/planning/census_report.csv) · [`tests/reconciliation/reconcile_planning_with_census_report.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/tests/reconciliation/reconcile_planning_with_census_report.sql)

### 6 · Logic, tested alone · 3:47–4:29

**Narration.** Data tests check the tables. Some logic needs checking on its own, with a few rows made up for the purpose. That's a unit test. The credit rule, in two made-up rows. A passed unit of study counts from the tenth of January. A microcredential counts from the second of February, until it's revoked on the twelfth of August. Credit changes twice, so the answer is three versions: fifteen, twenty, then fifteen again. The microcredential's dates are Jordan's. The rule is proved before a single real row arrives.

**Picture.** The table outlines dim; one intermediate box, `int_credit_towards_award`, is lifted out on its own. Two mock rows slide in as "given", then a timeline draws under them: a bar from 10 January (the unit, 15), a second bar from 2 February to 12 August (the microcredential, 5). The "given" card, while the bars are drawn:

```yaml
# models/intermediate/student/_int_student__models.yml · runs on dbt Core · DuckDB
  - name: revoked_microcredential_stops_counting_the_day_it_is_revoked
    …
    given:
      - input: ref('int_credit_items')
        …
        rows: |
          learner_key,award_key,item_kind,item_bk,grade,credit_points,counts_from,counts_to
          L1,A1,unit,R1,C,15,2026-01-10,
          L1,A1,microcredential,M1,,5,2026-02-02,2026-08-12
```

The credit line steps 15 → 20 → 15; the "given" card slides up and the "expect" card replaces it, its three rows lighting as the steps are named:

```yaml
# models/intermediate/student/_int_student__models.yml · runs on dbt Core · DuckDB
    expect:
      …
      rows: |
        valid_from,valid_to,credit_points_earned
        2026-01-10,2026-02-02,15
        2026-02-02,2026-08-12,20
        2026-08-12,,15
```

On "Jordan's", the February and August dates link back to the revoked badge of chapter 2. A green tick on the unit test (a low felt note).

**On screen.** data tests: the tables · unit tests: the logic · given · a unit from 10 Jan · a microcredential 2 Feb → 12 Aug · expect · 15 → 20 → 15 · three versions · the microcredential's dates: Jordan's · proved before real data

**In the repo.** [`models/intermediate/student/_int_student__models.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/intermediate/student/_int_student__models.yml)

### 7 · Warn or stop · 4:29–5:11

**Narration.** Not every failure should stop everything. A test can warn, or it can stop the build. One short-course enrolment has no email: a walk-in, whose certificate can't reach anyone. The learning team agreed: warn when there's any, stop when there are more than five. One or two a term are expected. More means something broke. Today, the build warns once, and carries on. Freshness works the same way: warn when a source is a day late, fail at three. Who sets the level? The data's owner, with the reason written down.

**Picture.** A traffic light beside the short-course stream (pink). One enrolment card, `SC|E-7010`, with an empty email field. The test, with its levels lighting as they're named:

```yaml
# models/staging/short_courses/_short_courses__models.yml · runs on dbt Core · DuckDB
      - name: customer_bk
        description: >
          The customer who enrolled, by email. An enrolment with no email can't be matched to a
          learner. The learning team agreed: warn when any current enrolment has none, stop the
          build when more than five do (see DEC-SC-01 and LIM-SC-02).
        data_tests:
          - not_null:
              config:
                where: is_current_version
                warn_if: ">0"
                error_if: ">5"
```

A counter of missing emails runs 0 (green) → 1 to 5 (amber) → 6 (red), then settles back on 1, amber, and the real line of today's build appears: `WARN 1 not_null_stg_short_courses__enrolments_customer_bk`. The learning team (Tom, business outline) gives a gold tick, with its decision line, headed "the learning team · DEC-SC-01 · _short_courses__decisions.yml": "9 Oct 2026 · An enrolment with no email - warn when there's any, stop the build when more than five." On "freshness", a small clock on the student system's stream:

```yaml
# sources/student_system/_student_system__sources.yml · runs on dbt Core · DuckDB
      loaded_at_field: "cast(_loaded_at as timestamp)"
      freshness:
        warn_after: {count: 1, period: day}
        error_after: {count: 3, period: day}
```

**On screen.** warn · stop · SC|E-7010 · no email · walk-in · warn if > 0 · stop if > 5 · agreed with the learning team · 9 Oct 2026 · today: WARN 1 · freshness · warn after a day · error after three · the owner sets the level · the reason, written down

**In the repo.** [`models/staging/short_courses/_short_courses__models.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/staging/short_courses/_short_courses__models.yml) · [`sources/short_courses/_short_courses__decisions.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/sources/short_courses/_short_courses__decisions.yml) · [`sources/student_system/_student_system__sources.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/sources/student_system/_student_system__sources.yml)

### 8 · Waiting, on purpose · 5:11–5:36

**Narration.** 112 data tests. Four unit tests. Every promise written down, with its proof beside it. Each is written before the code it checks, so until that code is built, it can't pass. That's on purpose. Next, the least code that turns them green, in the right place.

**Picture.** The whole list at once, in a column: 36 not_null, 20 relationships, 18 accepted_values, 18 unique_combination, 12 unique, 5 versions_do_not_overlap, 3 singular tests, then 4 unit tests. Every dot is hollow: written, reviewed, not yet run (not red: until the code a test checks is built, dbt has nothing to run it on). The model outlines of the lineage (staging, intermediate, core, marts) wait, empty. The hollow seal from chapter 1 sits beside the core, not yet struck. The loop's station 6 glows faintly. Wordless end card: *Promises and proofs* · "Promise it in a contract. Prove it with a test, first." · In the weeds of data crafting.

**On screen.** 112 data tests · 4 unit tests · every promise, with its proof · written before the code · none can pass yet · on purpose · next: the least code that turns them green · *Promises and proofs* · Promise it in a contract. Prove it with a test, first.

## Pause and think

Four stops, one question each.

| After | Question | Answer, in short |
|---|---|---|
| 2 · The gap register (`gaps`) | Why is "accept and document" a real decision, not giving up? | It's made by the owner, with a reason, and it tells every consumer what the data can't do (gap 10: no source records an expiry, so nothing in the model can say a credential has expired; it leaves the register as a known limitation on `core_credential`). An unwritten gap surprises someone later. |
| 3 · The enterprise contract (`enterprise`) | Who can change a public contract, and how? | Its owner, and not by editing it in place: a breaking change arrives as a new version beside the old one, with a date for the old one to go. A later film shows how. |
| 5 · Tests first (`tests`) | Why write the tests before the model? | They say what done is, in a form a machine can check. The code's job is then to turn them green, and nobody can quietly redefine done to fit the code. |
| 7 · Warn or stop (`levels`) | Who sets a test's severity? | The data's owner, with a reason, written in the test's description and in its source's decision log. Not the person whose build it's blocking. |

## Rigour sheet

| Chapter | What the film says | What an expert would add, or what it simplifies |
|---|---|---|
| 1 | Under a law of 1300, English silver had to meet one standard: sterling. | The statute of Edward I, 1300 (28 Edw. I, *Articuli super Cartas*, c. 20): no vessel of silver to leave the maker's hands until assayed by the wardens of the craft and marked with a leopard's head; silver to be of the sterling standard, the standard of the coin, which already existed: the statute applied it to wares, with a test and a mark. Sterling is 925 parts in 1,000. |
| 1 | No piece could leave the workshop until it was tested, then marked. | At first the wardens of the Goldsmiths' Company went round the workshops to test and mark. The maker's own mark was added in 1363. The film keeps the one point: the test comes before the mark. The leopard's head is named on screen, not in the narration. |
| 1 | From 1478, the testing was done at Goldsmiths' Hall: the hall in hallmark. | Goldsmiths' Hall is in London (on screen, not narrated). From 1478 goldsmiths brought their work to Goldsmiths' Hall, where a permanent assay office with a salaried Common Assayer was set up, and the date letter began. The word "hallmark" (marked at the Hall) is recorded from the early 18th century. |
| 1 | Buyers still trust the mark, without testing the silver themselves. | The Hallmarking Act 1973 still requires articles of precious metal sold as such in the UK to be hallmarked, above exemption weights (7.78 g for silver). The London Assay Office is still at Goldsmiths' Hall. The picture's scraper and balance stand for the assay; methods changed over the centuries (touchstone, cupellation, today X-ray fluorescence and others). |
| 1 | The tests are the assay, and they come before the mark. | The series' metaphor. The mark stands for the model being trusted, struck only once its tests pass, not for the contract, which this film writes before the tests. Kept apart from *Older than the systems*' guild mark on a masterpiece: the point here is the order, test then mark. |
| 2 | Jun's gap register, beside each source while the gaps are open, one line per gap; three decisions. | One register per source, `requirements/sources/<system>/_<system>__requirements.yml`: each gap with its `expectation`, `reality` and `resolution` (`fix_at_source`, `rule_in_model`, `accept`), an owner, and `done_when`, what will show it's done (`requirements/README.md`, *An open item*). The work itself (who, when, how big) is tracked in the team's backlog tool, which an item links to with `ticket`; the project doesn't copy it. Two registers are left today, `learning_platform` and `student_system`, holding the three gaps still open. `docs/process.md` line 17: step 4, approved by "the owner and the consumer". "Mei approves the ones about meaning" simplifies: each decision names who decided it (`decided_by`): Mei for gaps 3, 6, 7, 8 and 9 (DEC-SIS-01 to 03, DEC-STU-09, DEC-SC-03); the learning team for the platforms' rules in gaps 1, 2 and 4 (DEC-LMS-01, DEC-LMS-02, DEC-SC-02) and for gap 5's level (DEC-SC-01). The agent drafting the register is the process's own (`docs/process.md` 17); the film names no product. |
| 2 | The platform deletes a revoked credential; anything the platform stops showing is revoked from that day; a flag is requested. | GAP-LMS-01 (`requirements/sources/learning_platform/_learning_platform__requirements.yml` 8-20), still open for the flag; the rule is DEC-LMS-01 (`sources/learning_platform/_learning_platform__decisions.yml` 10-19). In the model: `models/intermediate/student/int_credentials_unioned.sql` 33-44 and 65 (a badge whose last version is closed and no longer current is revoked on the day that version closed). Known limitation LIM-STU-01, on `core_credential` (`models/core/student/_core_student__models.yml` 124-130): a badge deleted for another reason also counts as revoked, and it may have been revoked earlier. The source keeps every version, with the dates it was recorded. |
| 2 | Jordan's microcredential vanished on 12 August; it reads as revoked. | `core_credential_v2`, run 30 September 2026: `LMS|B-5028`, Data Visualisation, learner `SIS|S-20422`, issued 2026-02-02, `status` revoked, `revoked_on` 2026-08-12, the only revoked credential of 53. Jordan's credit towards `SIS|GCDA` in `core_credit_towards_award_v1`: 45 from 2 March to 12 August 2026 (so 45 at census), 40 since. |
| 2 | Then each gap leaves the register: a rule becomes a decision in its source's log; an accepted gap, a known limitation on the model; only a fix still awaited stays open. | `requirements/README.md`, *Where what lasts goes*, and `docs/conventions.md`, *File lifecycles*: an item is only ever `open` or `in_progress`, and is deleted in the pull request that moves what lasts; `scripts/check/requirements.py` fails on anything else, in CI. The rules: DEC-LMS-01 and 02 (`sources/learning_platform/_learning_platform__decisions.yml`), DEC-SIS-01 to 03 (`sources/student_system/_student_system__decisions.yml`), DEC-SC-02 and 03 (`sources/short_courses/_short_courses__decisions.yml`), each naming its gap, with `was:` or, while a fix is still awaited, `relates_to:`. "In its source's log" simplifies: gap 8's rule, the status map, spans three sources, so it's in the student domain's log (DEC-STU-09, `models/core/student/_student__decisions.yml`). The accepted gaps: LIM-STU-06 on `core_credential` (gap 10), LIM-STU-07 on `core_learner` (gap 6's accepted half), and LIM-SC-02 on the short-course source's `enrolments` table (gap 5), a source rather than a model. Still open, each waiting on a fix at source: GAP-LMS-01, GAP-LMS-02 and GAP-SIS-03 (gaps 1, 2 and 7), the three lines the picture keeps. |
| 3 | The core folder: public, with an enforced contract. | `dbt_project.yml` 46-52. `access: public` means any model in any project may `ref()` it (cross-project refs need dbt Cloud; `docs/conventions.md` 168). An enforced contract makes dbt check, at build, that the model's columns match the YAML by name, data type and number; it is supported for table and incremental models (incremental with `on_schema_change` set to `append_new_columns` or `fail`; `core_credential_v2` uses `append_new_columns`). Constraints: DuckDB enforces `not_null` and `check`; Databricks enforces `not_null` and `check`, and records primary and foreign keys as information only (DEC-PRJ-09, `models/_shared/_shared__decisions.yml`; `macros/adapters/duckdb_constraints.sql`). Hence the tests on keys. |
| 3 | The credential's YAML lists every column, its type and what can't be empty; grain one row per credential. | `models/core/student/_core_student__models.yml` 111-146 and 191-193 (trimmed). Grain has no built-in field in dbt; the project keeps it in `meta.grain` and tests it as a key. `constraints: [{type: not_null}]` is enforced by the database; `data_tests: [not_null]` checks the data after the build. |
| 3 | Let the query and the contract disagree on a column's type, and the build stops before the table is made. | Run 30 September 2026 on a scratch copy of the project with `credit_points` declared `string` in the YAML (the contract side; the query still makes an integer), as the picture shows: `dbt build --select +core_credential` gave "This model has an enforced contract that failed. Please ensure the name, data_type, and number of columns in your contract match the columns in your model's definition." with `credit_points | INTEGER | VARCHAR | data type mismatch`, raised in `assert_columns_equivalent` before `create_table_as`. `definition_type` comes from the query and `contract_type` from the YAML; changing the query instead (say, casting `credit_points` to text) would change the other side and stop the build the same way. Not committed. |
| 3 | Noor approves it. | `docs/process.md` 17; DEC-PRJ-02, `models/_shared/_shared__decisions.yml` (every core model versioned, Noor). |
| 4 | Each carries the grain it declared: Planning's as it was on census day, the wallet's as it is now. | `models/marts/planning/_planning__models.yml` 12; `models/marts/wallet/_wallet__models.yml` 10. The grains were declared, and as-was against as-is explained, in the previous film; this one only recalls them in words and shows the two grain lines on screen. |
| 4 | Both enforced, and protected: only this project can build on them. | `dbt_project.yml` 54-59. `protected` allows `ref()` from any model in the same project (`docs/conventions.md` 167): inside this one project the wallet's marts could still ref Planning's, and only review stops it; a later film takes this up. "Only this project" also simplifies: a project that installs this one as a package can also `ref()` a protected model, unless the dependency sets `restrict-access`; only a cross-project ref is refused (dbt-core, `is_invalid_protected_ref`). |
| 4 | Each declares an exposure with an owner and an email. | `exposures/planning/_planning__exposures.yml` 1-15; `exposures/wallet/_wallet__exposures.yml` 1-15: an owner's name and email, no url. Exposures are declared in YAML, in a folder per consumer (`exposures/<consumer>/`); dbt doesn't discover them. |
| 4 | Change the credential in the core, and the lineage finds one exposure: the wallet app. | `dbt ls --select core_credential+ --resource-type exposure` returned `exposure:credentials.wallet_app` (run 30 September 2026). Planning's mart doesn't read `core_credential`; `core_learner+` reaches both exposures. |
| 5 | Tests before the code they check. | `docs/process.md` 18 (step 5: "Tests, before any model"); `skills/draft-a-model/SKILL.md` 8-9 and 21: write the YAML and tests first, then "Run it and watch it fail". In dbt, a test's YAML can be written before its model's SQL, but it doesn't run until the model file exists: dbt warns "Did not find matching node for patch", creates no test, and a model that refs a missing one fails to compile (checked on a scratch copy without `core_award.sql`, 30 September 2026). So "tests first" means written and reviewed first; the next film writes the models and draws the first red. |
| 5 | Keys unique and never empty; relationships; closed lists from agreed values; versions that never overlap. | `data_tests` (dbt 1.8+); recent dbt expects a generic test's arguments under `arguments:`, as the project does. `accepted_values` on `core_award.award_type` at `models/core/course/_core_course__models.yml` 55-61. The film doesn't show `core_credential`'s `status` list: `status` arrives with version 2 on 13 October 2026 (DEC-STU-07, `models/core/student/_student__decisions.yml`), a later film's turn. `versions_do_not_overlap` is the project's own generic test (`tests/generic/versions_do_not_overlap.sql` 1-5); `unique_combination` too. |
| 5 | The census report's twelve; a test fails on any faculty that differs. | `seeds/expected/planning/census_report.csv` 1-5: 2 + 3 + 5 + 2 = 12, as at 31 March 2026, published 14 April 2026. An expected seed: tests read it, and no model may (`tests/governance/models_do_not_read_expected_seeds.sql`). `tests/reconciliation/reconcile_planning_with_census_report.sql` 1-2, 32-35: a singular test, which fails when it returns rows. PASS in the run of 30 September 2026. |
| 5 | The agent drafts the tests; Jun reviews them. | `docs/process.md` 18: "Writes them first" / "Jun Park, in review". Agents in dbt Cloud (dbt Copilot, the dbt MCP server) are named only here; availability by plan to check on the day. |
| 6 | A unit test checks logic on made-up rows. | Unit tests are available from dbt 1.8. They test a model's SQL on given inputs against expected rows, without the real data; they run in `dbt build` before the model is built. The film trims `model:`, the description and the two `format: csv` lines from the YAML, each marked "…", and shows `given` and `expect` as two cards. |
| 6 | Two made-up rows; three versions, 15, 20, 15. | `models/intermediate/student/_int_student__models.yml` 221-239, `revoked_microcredential_stops_counting_the_day_it_is_revoked`. PASS in the run of 30 September 2026. The dates 2 February and 12 August are Jordan's badge's; the unit's 10 January date is made up. |
| 7 | A test can warn, or stop the build. | `severity`, `warn_if` and `error_if` are test configs; a failing test at error severity makes `dbt build` skip what depends on it. |
| 7 | One enrolment with no email; warn on any, stop above five; today it warns once. | `models/staging/short_courses/_short_courses__models.yml` 47-57. Gap 5 became LIM-SC-02, on the source's `enrolments` table (`sources/short_courses/_short_courses__sources.yml` 43-47); the level is DEC-SC-01 (`sources/short_courses/_short_courses__decisions.yml` 10-20: 9 October 2026, the learning team), listed in the generated index `docs/decisions.md` (line 50), which the picture names. The one enrolment is `SC|E-7010` (Excel for Everyone, completed). Build of 30 September 2026: `WARN 1 not_null_stg_short_courses__enrolments_customer_bk`. Checked on a scratch copy with emails blanked: 5 missing gave `WARN 5`, 6 gave `FAIL 6 … configured to fail if >5`. |
| 7 | Freshness: warn after a day, fail at three. | `sources/student_system/_student_system__sources.yml` 11-13 (the same on the other two sources). Freshness is checked by `dbt source freshness`, not by `dbt build`; since the sample files don't change, it reports every source `ERROR STALE` here (README, "Run it"; run 30 September 2026: 7 of 7 stale). In dbt Cloud, a job can run it before the build. |
| 7 | The data's owner sets the level, with the reason written down. | The series' rule, from `docs/process.md` and the test's own description (lines 48-51). |
| 8 | 112 data tests, 4 unit tests. | `dbt ls` on 6 October 2026: 36 `not_null`, 20 `relationships`, 18 `accepted_values`, 18 `unique_combination`, 12 `unique`, 5 `versions_do_not_overlap`, 3 singular (the reorganisation added `tests/governance/models_do_not_read_expected_seeds.sql`: no model reads an expected seed); 4 unit tests. The run of 30 September 2026, before it, had 111 and was PASS 143, WARN 1, ERROR 0. |
| 8 | Each is written before the code it checks, so until that code is built, it can't pass. | The earlier films showed some of the project's code (the matching rules, the timeline, Planning's mart) while learning the sources and the consumers; in the story, tests come first for the build the next film makes, and "before the code they check" is the series' rule for any change (`docs/process.md` 18). Without model files, dbt doesn't run the tests and fail them: it warns that it found no node for each model's YAML, creates no test, and a ref to a missing model stops compilation (scratch copy, 30 September 2026). So the picture shows every test hollow, written but not yet run, not red. |

**Project files each snippet comes from** (checked against the files on 6 October 2026):

| Ch | File | Lines |
|---|---|---|
| 2 | [`requirements/sources/learning_platform/_learning_platform__requirements.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/requirements/sources/learning_platform/_learning_platform__requirements.yml) | 8, 12-13, 15 (GAP-LMS-01: the expectation, the reality and the fix requested), rendered as a table with the rule; the rest of the decision trimmed with … |
| 2 | [`sources/learning_platform/_learning_platform__decisions.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/sources/learning_platform/_learning_platform__decisions.yml) | 13, 18 (DEC-LMS-01: the rule, and where it lives) |
| 3 | [`dbt_project.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/dbt_project.yml) | 46-52 |
| 3 | [`models/core/student/_core_student__models.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/core/student/_core_student__models.yml) | 111, 117-120, 141-142, 144-146, 191, 193 (each left-out run of lines marked …) |
| 3 | dbt's message (scratch copy) | the contract error, trimmed to three lines |
| 4 | [`models/marts/planning/_planning__models.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/marts/planning/_planning__models.yml) | 12 (grain) |
| 4 | [`exposures/planning/_planning__exposures.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/exposures/planning/_planning__exposures.yml) | 1-6, 10-15 (the description trimmed with …) |
| 4 | [`models/marts/wallet/_wallet__models.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/marts/wallet/_wallet__models.yml) | 10 (grain) |
| 4 | [`exposures/wallet/_wallet__exposures.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/exposures/wallet/_wallet__exposures.yml) | 1-6, 10-15 (the description trimmed with …) |
| 4 | [`dbt_project.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/dbt_project.yml) | 54-59 |
| 5 | [`models/core/course/_core_course__models.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/core/course/_core_course__models.yml) | 55-61 |
| 5 | [`tests/generic/versions_do_not_overlap.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/tests/generic/versions_do_not_overlap.sql) | 1-5 |
| 5 | [`seeds/expected/planning/census_report.csv`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/seeds/expected/planning/census_report.csv) | 1-5 (as a table) |
| 5 | [`tests/reconciliation/reconcile_planning_with_census_report.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/tests/reconciliation/reconcile_planning_with_census_report.sql) | 1-2, 32-35 (trimmed with …) |
| 6 | [`models/intermediate/student/_int_student__models.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/intermediate/student/_int_student__models.yml) | given card: 221, 226-227, 229-232 (9 lines with the two …); expect card: 233, 235-239 (7 lines with the …); `model:`, the description and the `format: csv` lines marked … |
| 7 | [`models/staging/short_courses/_short_courses__models.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/staging/short_courses/_short_courses__models.yml) | 47-57 |
| 7 | [`sources/student_system/_student_system__sources.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/sources/student_system/_student_system__sources.yml) | 10-13 |
| 7 | [`sources/short_courses/_short_courses__decisions.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/sources/short_courses/_short_courses__decisions.yml) | 10, 13, 16-17 (DEC-SC-01: id, text, who and when) |

**dbt and Databricks documentation** (the pages behind each claim; on 30 September 2026 docs.getdbt.com and docs.databricks.com couldn't be reached from the build machine, so each claim was checked against the project's own runs and a web search; to confirm on the pages on the day):

- dbt: "Model contracts" (docs.getdbt.com/docs/mesh/govern/model-contracts) and the `contract` config (docs.getdbt.com/reference/resource-configs/contract): what's checked, which materialisations, `on_schema_change` for incremental models; "Constraints" (docs.getdbt.com/reference/resource-properties/constraints), with the table of what each platform enforces; "Model access" (docs.getdbt.com/docs/mesh/govern/model-access); "Exposures" (docs.getdbt.com/docs/build/exposures); "Data tests" (docs.getdbt.com/docs/build/data-tests) and `data_tests` (docs.getdbt.com/reference/resource-properties/data-tests); "Unit tests" (docs.getdbt.com/docs/build/unit-tests); `severity`, `error_if` and `warn_if` (docs.getdbt.com/reference/resource-configs/severity); "Source freshness" (docs.getdbt.com/docs/deploy/source-freshness) and `freshness` (docs.getdbt.com/reference/resource-properties/freshness); `dbt ls` and the graph operators (docs.getdbt.com/reference/node-selection/graph-operators).
- Databricks: "Constraints on Databricks" (docs.databricks.com/aws/en/tables/constraints): `NOT NULL` and `CHECK` enforced; primary and foreign keys informational.

**Historical sources.**

- The Goldsmiths' Company, "Hallmarking" and "History" (thegoldsmiths.co.uk/history): the 1300 statute, the wardens' assay and the leopard's head; 1363 maker's mark; 1478 assay office at the Hall.
- The Goldsmiths' Company Assay Office (Assay Office London), history pages; Wikipedia's article on the Assay Office, for orientation only.
- Online Etymology Dictionary, "hallmark" (etymonline.com/word/hallmark); Collins and Britannica, "hallmark": the word from Goldsmiths' Hall, recorded from about 1715-25.
- UK Hallmarking Act 1973 (legislation.gov.uk/ukpga/1973/43), as amended, for the present-day requirement and exemption weights.
- Checked in outline 30 September 2026 by a web search (the Company's own pages were blocked from the build machine); the statute's citation and the exemption weight to confirm on the day.

## Labs

| # | Lab | Kind | The mechanism people break |
|---|---|---|---|
| 1 | *Write the contract* | compose | Build `core_credential`'s contract from a tray of columns, types and constraints. Declare `credit_points` as text, or leave a column out, and the build refuses with dbt's mismatch table, before any table is made. Drop `not_null` from `learner_key`, and a credential with no holder gets through. |
| 2 | *Which test catches it?* | pick | Six broken rows (a duplicate credential key, a credential whose learner doesn't exist, an award type of "diploma", two versions of a learner that overlap by a day, a faculty count off by one against the census report, an enrolment with no email) against the tests. Pick the one that stops each; pick wrong and the row slips through to the wallet. |
| 3 | *Decide the gap* | sort | The ten open gaps from the register (`requirements/`) into fix at source, rule in the model, and accept and document (some take two). Sort the deleted badge as "accept" only, and Jordan's revoked microcredential shows as valid in the wallet. In practice: where each gap goes once it's decided, a decision in its source's log, a known limitation on the model, or still open until the fix arrives. |
| 4 | *Warn or stop* | steps | A slider of missing emails, 0 to 8. Step through it and watch the test go green, amber, red, and the models after it skip once it's red. Then move `error_if` yourself, and see who you'd have to ask. |

## Scenarios

Eight situations, in this order.

1. **Choose.** The platform deletes revoked badges, and the wallet shows them as valid. What does Jun do first? (Add a line to the gap register, get a decision from the owner, and only then write the rule; ask the platform for a flag too.)
2. **Spot the problem.** The wallet team asks to drop a column from `core_credential` "because we don't use it." (It's a public, contracted model other consumers rely on: a breaking change, which needs a new version and a date, not an edit.)
3. **Choose.** A test fails in production at 2 a.m. for one walk-in enrolment with no email. Was the level wrong? (Here, one missing email warns and carries on, as the learning team agreed; if one failure stops the build, the level wasn't set with the owner.)
4. **True or false.** "The contract on Databricks declares a primary key, so duplicate credential keys can't get in." (False: Databricks records primary keys but doesn't enforce them. The `unique` test does the checking.)
5. **Explain.** A reviewer asks why the tests were written before the SQL. (They say what done is, reviewed by the people who own it; the code is then judged against them, not the other way round.)
6. **Choose.** Planning wants expiry dates on every credential; no source records them. (Accept and document, gap 10: no source records an expiry, so the model can't say a credential has expired, and a known limitation on `core_credential` says so; fix at source if the business needs it.)
7. **Order.** A source hasn't loaded for two days. Put what happens in order: freshness warns after one day; someone is told; the owner looks at the source; at three days, freshness errors; the job stops before the build uses stale data.
8. **Spot the problem.** Every unit test passes, but Planning's number is one off the census report. (Unit tests check logic on made-up rows; the reconciliation checks the result against a trusted number. Only the second can catch this.)

## Decisions taken

| Date | Decision |
|---|---|
| 7 October 2026 | The series now groups its ten steps into four phases (ask, promise, build, keep), which the opening film introduces. This film's step labels name their phase: "Promise · step 4" and "Promise · step 5". |
| 30 September 2026 | Open in London from 1300 with the assay and the hallmark: tested before it's marked, and trusted after. Kept apart from *Older than the systems*' guild mark by making the order the point. |
| 30 September 2026 | Jordan's revoked microcredential (12 August 2026) carries the film: gap 1 and the unit test's dates. `core_credential`'s `status` (with `expired`) is kept for the film that versions it; this film's closed list is `award_type`. |
| 30 September 2026 | The contract's refusal and the warn-to-stop step are shown with dbt's real output, from scratch copies of the project, and said so here. The end shows the tests waiting, not red: without the code they check, dbt runs none of them. The narration says "before the code they check", not "before any code", because the films before showed code from the project while learning the sources and the consumers. |
| 30 September 2026 | Every code card carries the label `runs on dbt Core · DuckDB`; the film doesn't repeat the setup lines of *Start from a question*. |
| 1 October 2026 | Series read-through: the tests come "before the code they check", not "before any code", since the films before showed project code while learning the sources and the consumers; the end says the tests can't pass until that code is built. *Two consumer contracts* recalls the two grains in one line instead of restating them. "A passed unit of study" avoids "unit" next to "unit test". "Anything the platform stops showing" replaces "a badge that disappears", since the example is a microcredential. The opening line starts "Under a law of 1300". |
| 6 October 2026 | The example project was reorganised by application, data and business domains (sources and staging by system, intermediate and core by data domain, marts and exposures by consumer), with one purpose per folder, ready to split into one project per domain. The film's cards show the files as they are now: gap 1 as `requirements/sources/learning_platform/ · GAP-LMS-01`, the contracts in `models/core/student/_core_student__models.yml` and `models/core/course/_core_course__models.yml`, the exposures in `exposures/planning/` and `exposures/wallet/`, the reconciliation in `tests/reconciliation/`, the census report in `seeds/expected/planning/`, the unit test in `models/intermediate/student/`, freshness in `sources/student_system/`, and the walk-in test's description pointing to DEC-SC-01 and LIM-SC-02. The gap register is now temporary, so *The gap register* tells a gap's whole life: its second line is now "Jun's gap register lists them beside each source, while they're open: what the business expects, beside what the source holds, one line per gap.", and a new last line follows the ten decisions: "Then each gap leaves the register. A rule in the model becomes a decision, in its source's log. An accepted gap becomes a known limitation, on the model. Only a fix still awaited stays open." On it, the settled lines strike through and fade, and the three still waiting on a fix at source (gaps 1, 2 and 7) stay. The labs and scenarios link to the project's files. The chapter times are now the voiced ones, from `tools/pace.py`: 5:36 in all. Also: the count is now "112 data tests" (the reorganisation added a governance test, so 3 are singular); the levels card names DEC-SC-01 in the short-course source's log; Mei ticks gaps 7 and 9, since gap 1's rule is about a badge and the learning team decided it (DEC-LMS-01). |

## Open

1. **Scratch experiments.** The contract refusal and the WARN 5 / FAIL 6 runs were made on a copy of the project; consider adding them as documented commands so viewers can repeat them.
2. **Freshness on screen.** The sample data is always stale, so the film shows the configuration, not a freshness result.
3. **Voice.** Check "thirteen hundred", "fourteen seventy-eight", "May" and "dee bee tee" by ear; key strings and test names stay on screen only.
