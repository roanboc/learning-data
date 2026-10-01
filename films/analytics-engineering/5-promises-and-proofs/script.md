# In the weeds of data crafting · Promises and proofs: script

*The script of Promises and proofs, from In the weeds of data crafting, a technical series for analytics engineers, as planned: about 5:30 (target 4 to 6 minutes), in eight chapters, in English, 30 September 2026. The narration lives in [`source/src/narration.js`](source/src/narration.js) and the pauses in [`source/src/breath.js`](source/src/breath.js); this page and those files say the same thing, and where they differ, the source wins. The timings are estimates from the word count (658 words, at the pace of the opening film, with the holds) until the voice is recorded; the pacing report replaces them. Takes steps 4 and 5 of Jun's ten: name the gaps and write the contracts; write the tests, before any code.*

## The promise

A practitioner follows every line, and a data architect agrees with it. Between what the business expects and what the sources hold there are gaps, and each one needs a decision, written down: fix it at the source, write a rule in the model, or accept it and document it. Then the promises: an enforced, public contract on the core, which every consumer builds on, and a protected contract for each consumer's mart, with an exposure that says who reads it. Then the proofs, before any model code: data tests for keys, relationships, allowed values, versions and a trusted number; unit tests for the logic; and a level for each test, warn or stop, set by the data's owner. **Promise it in a contract. Prove it with a test, first.**

## The story in one paragraph

Since 1300, silver sold in England has had to be tested before it's marked; from 1478 the testing was done at Goldsmiths' Hall in London, which gave the hallmark its name, and buyers still trust the mark without testing the silver themselves. A core model makes the same kind of promise, and its tests are the assay. Jun starts with the gap register: ten lines, each setting what the business expects beside what the sources hold. The business expects a revoked credential to be known as revoked; the learning platform deletes it. That gap gets two decisions: a rule in the model (a badge that disappears is revoked from that day, as Jordan's was on 12 August) and a request to the platform for a proper flag. Then the contracts. The core folder is public and its contract enforced; the credential's YAML lists every column, its type and what can't be empty, and a changed type stops the build before the table is made. Planning's mart and the wallet's each carry their own grain and an enforced, protected contract, and each declares its exposure, so the lineage can say who to tell. Then the tests, before the code: keys, relationships, allowed statuses, versions that never overlap, and the census report's twelve, reconciled faculty by faculty. A unit test proves the credit rule on two made-up rows with Jordan's dates. One enrolment has no email: the learning team agreed to warn on any and stop above five, so today the build warns once. A hundred and eleven data tests and four unit tests wait for models that don't exist yet: red, on purpose.

## What each object stands for

| Object | Stands for |
|---|---|
| "1300 · London"; a written standard, "sterling"; a leopard's head punch | The 1300 statute: a standard, a test, then a mark |
| A scraper taking a sliver; a small balance | The assay: testing before marking |
| Goldsmiths' Hall; "hall" lighting inside "hallmark" | Where the testing moved in 1478, and the word it gave |
| A buyer's hand picking up the marked piece | Trusting a mark without testing again |
| The loop of ten steps, stations 4 and 5 lit | Where this film sits in Jun's process |
| A two-column register, "expects" and "holds", ten lines | The gap register, `docs/gaps.md` |
| Three coloured decision tags: fix at source, rule in the model, accept and document | The three decisions a gap can get |
| A green badge card fading out, then reappearing stamped "revoked · 12 Aug 2026" | Gap 1: the platform deletes; the model marks it revoked |
| The core layer, its folder lit gold, with a padlock latch | The enterprise contract: public, enforced |
| A YAML card with a type beside every column | The contract: names, types, what can't be empty |
| A red bar across the build, with a small mismatch table | The contract refusing a changed type |
| Two mart cards on the core, each with its own grain line | The consumer contracts |
| A ring around the marts, labelled "protected" | Only this project can build on them |
| Planning's dashboard badge and the wallet's app badge, joined by dotted lines | Exposures: who reads what |
| A line running from `core_credential` to the wallet badge only | Lineage finds who to tell |
| A test list typing itself before the model boxes are drawn | Tests first |
| A scale weighing the mart's count against the census report | Reconciling with a trusted number |
| Two mock rows and three expected versions | A unit test on the credit rule |
| A traffic light: green, amber, red, with a counter of missing emails | Severity: warn or stop |
| A small clock on a source's edge | Source freshness |
| 111 and 4, in a column of red dots | Every test, waiting for the code |
| The teal orb, drafting | The AI agent drafts the register and the tests |
| Gold ticks from Mei, Noor, Planning, the wallet team, the learning team and Jun | Each owner approves their part |

## Script

### 1 · Tested before it's marked · 0:00–0:36

**Narration.** In 1300, an English law set a standard for silver: sterling. No piece could leave the workshop until it was tested, and marked with a leopard's head. From 1478, the testing was done at Goldsmiths' Hall, in London: the hall in hallmark. Buyers still trust the mark, without testing the silver themselves. A core model makes the same promise. Its tests are the assay, and they come before the mark.

**Picture.** The warm past, with "1300 · London" in the corner. A written standard unrolls: "sterling". A silversmith's cup on a bench; a small scraper takes a sliver from its foot (a filtered scrape); the sliver goes on a small balance, which settles. Only then does the punch come down (a low thud): a leopard's head, pressed into the silver. "1478 · Goldsmiths' Hall": the building's front, and the word "hallmark" with "hall" lit. A buyer's hand lifts the cup, turns it, sees the mark, and puts it in a basket without a second look. On the bridge line, the mark lifts off the cup and drifts right, towards the present, where it becomes a small gold contract seal. Wordless breather: the title card over the struck mark, with the series' mark: "IN THE WEEDS OF DATA CRAFTING", *Promises and proofs*, "contracts say what's promised; tests prove it".

**On screen.** 1300 · London · sterling · tested · then marked · leopard's head · 1478 · Goldsmiths' Hall · hallmark · trusted without testing again · the tests are the assay · *Promises and proofs* · contracts say what's promised; tests prove it

### 2 · The gap register · 0:36–1:32

**Narration.** Step four: name the gaps. Jun's gap register sets what the business expects beside what the sources hold, one line per gap. The business expects a revoked credential to be known as revoked. The learning platform just deletes it. Every gap gets one of three decisions. Fix it at the source. Write a rule in the model. Or accept it, and write it down. This one gets two. A badge that disappears is revoked from that day. And the platform is asked for a proper flag. Jordan's microcredential vanished on the twelfth of August. From that day, it reads as revoked. Ten gaps, ten decisions. Mei approves the ones about meaning.

**Picture.** The loop of ten steps, small in a corner, station 4 lit. The teal orb drafts a two-column register ("expects", "holds"); ten lines type in, short labels only. The first line enlarges, with its label:

```markdown
<!-- docs/gaps.md · runs on dbt Core · DuckDB -->
| # | Expectation | Reality | Decision | Where |
|---|---|---|---|---|
| 1 | A revoked credential is known as revoked. | The learning platform has no revocation
flag: it deletes a revoked badge. | **Rule in the model:** a badge that disappears is revoked
from the day the platform stopped showing it. **Fix at source**, requested: … |
`int_credentials_unioned` |
```

Three tags drop in on "three decisions", each in its colour: "fix at source", "rule in the model", "accept and document". Gap 1 takes two of them. Jordan's microcredential (`LMS|B-5028`, Data Visualisation, green) sits in a row of badge cards; on 12 August it fades out; the model's rule brings it back, stamped "revoked · 12 Aug 2026". Then the ten lines each take their tag; gap 5 (no email: accept and document) and gap 10 (no expiry recorded: accept and document) glow a moment. Mei (business outline) gives gold ticks to the lines about meaning (1, 7, 9); the others are ticked by their owners.

**On screen.** step 4 · the gap register · expects · holds · a revoked credential is known as revoked · the platform deletes it · fix at source · rule in the model · accept and document · LMS|B-5028 · revoked · 12 Aug 2026 · 10 gaps · 10 decisions · Mei approves meaning

### 3 · The enterprise contract · 1:32–2:14

**Narration.** Then the contracts. The core is what everything else builds on, so it makes the strongest promise. The whole core folder gets two settings. Public: other projects may build on it. And a contract, enforced. The credential's YAML lists every column, its type, and what can't be empty. Its grain: one row per credential. Change a column's type in the query, and the build stops before the table is made. The contract is checked at every build, not read once and forgotten. Noor approves it.

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
# models/core/_core__models.yml · runs on dbt Core · DuckDB
  - name: core_credential
    …
    config:
      meta:
        grain: One row per credential
        owner: Mei Tanaka, registrar's office
    …
    columns:
      - name: credential_key
        data_type: string
        constraints: [{type: not_null}]
        data_tests: [unique, not_null]
```

On "change a column's type", `credit_points`' type flips from `int` to `string` in the YAML; a red bar runs across the build and dbt's real message appears, trimmed (a muted double knock):

```
This model has an enforced contract that failed.
| column_name   | definition_type | contract_type | mismatch_reason    |
| credit_points | INTEGER         | VARCHAR       | data type mismatch |
```

The type flips back; the bar turns green. Noor (cyan outline) gives the card a gold tick.

**On screen.** the contracts · the core · the strongest promise · public · enforced · every column · its type · not null · one row per credential · type changed → build stops · checked at every build · Noor approves

### 4 · Two consumer contracts · 2:14–2:59

**Narration.** Each consumer gets a contract of its own, on the same core. Planning's: one row per learner per award, as at census date. The wallet's: one row per learner, as it is now. Both are enforced, and protected: only this project can build on them. And each declares an exposure: the dashboard or the app that reads it, with an owner and an address. Change the credential in the core, and the lineage finds one exposure: the wallet app. That's who to tell. Planning and the wallet team each approve their own.

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
# models/marts/planning/_planning__models.yml · runs on dbt Core · DuckDB
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

and the wallet's (`wallet_app`, type application, owner Wallet app team) beside the app badge. On "change the credential", `core_credential` pulses; a line runs down the lineage and reaches only the wallet badge, with the command's real answer: `exposure:credentials.wallet_app`. Planning's badge and the wallet's each give their card a gold tick.

**On screen.** consumer contracts · Planning · one row per learner per award, as at census date · the wallet · one row per learner, as it is now · enforced · protected · exposure · owner · address · change the credential → the wallet app · who to tell · Planning approves · the wallet team approves

### 5 · Tests first · 2:59–3:41

**Narration.** Step five: the tests, before any model code. They say what done looks like. Every key, unique and never empty. Every relationship, pointing at something real. Every status, from an agreed list: valid, expired or revoked. Every history, with versions that never overlap. And one number people already trust: the census report's twelve learners. A test compares the model's count with the report, and fails on any faculty that differs. The agent drafts the tests from the contracts and the register. Jun reviews them.

**Picture.** The loop's station 5 lights. The model boxes of the lineage are empty outlines; beside them, a test list types itself, one kind per line, each with a small glyph as it's named: unique, not_null, relationships, accepted_values, versions_do_not_overlap. On "valid, expired or revoked", the card:

```yaml
# models/core/_core__models.yml · runs on dbt Core · DuckDB
      - name: status
        description: '{{ doc("credential_status") }}'
        data_type: string
        data_tests:
          - accepted_values:
              arguments:
                values: [valid, expired, revoked]
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

On "trust", the census report as a small table (Arts and Education 2, Business 3, Engineering and IT 5, Health 2: 12), from `seeds/census_report.csv`; a scale weighs it against an empty slot marked "the mart". The singular test:

```sql
-- tests/reconcile_planning_with_census_report.sql · runs on dbt Core · DuckDB
-- Planning's number, reconciled with the census report, faculty by faculty.
-- Fails with one row per faculty where they differ, or that the report doesn't cover.
…
select *
from compared
where in_the_census_report is null
   or in_the_mart <> in_the_census_report
```

The teal orb writes the list in teal; Jun (cyan) reads it and gives a gold tick.

**On screen.** step 5 · tests before code · what done looks like · unique · not null · relationships · valid · expired · revoked · versions never overlap · census report · 12 · faculty by faculty · the agent drafts · Jun reviews

### 6 · Logic, tested alone · 3:41–4:22

**Narration.** Data tests check the tables. Some logic needs checking on its own, with a few rows made up for the purpose. That's a unit test. The credit rule, in two made-up rows. A unit counts from the tenth of January. A microcredential counts from the second of February, until it's revoked on the twelfth of August. Credit changes twice, so the answer is three versions: fifteen, twenty, then fifteen again. The dates are Jordan's. The rule is proved before a single real row arrives.

**Picture.** The table outlines dim; one intermediate box, `int_credit_towards_award`, is lifted out on its own. Two mock rows slide in as "given", then a timeline draws under them: a bar from 10 January (the unit, 15), a second bar from 2 February to 12 August (the microcredential, 5). The credit line steps 15 → 20 → 15, and the three expected rows light as the steps are named:

```yaml
# models/intermediate/_int_models.yml · runs on dbt Core · DuckDB
  - name: revoked_microcredential_stops_counting_the_day_it_is_revoked
    model: int_credit_towards_award
    given:
      - input: ref('int_credit_items')
        rows: |
          learner_key,award_key,item_kind,item_bk,grade,credit_points,counts_from,counts_to
          L1,A1,unit,R1,C,15,2026-01-10,
          L1,A1,microcredential,M1,,5,2026-02-02,2026-08-12
    expect:
      rows: |
        valid_from,valid_to,credit_points_earned
        2026-01-10,2026-02-02,15
        2026-02-02,2026-08-12,20
        2026-08-12,,15
```

On "Jordan's", the August date links back to the revoked badge of chapter 2. A green tick on the unit test (a low felt note).

**On screen.** data tests: the tables · unit tests: the logic · given · a unit from 10 Jan · a microcredential 2 Feb → 12 Aug · expect · 15 → 20 → 15 · three versions · Jordan's dates · proved before real data

### 7 · Warn or stop · 4:22–5:07

**Narration.** Not every failure should stop everything. A test can warn, or it can stop the build. One short-course enrolment has no email: a walk-in, whose certificate can't reach anyone. The learning team agreed: warn when there's any, stop when there are more than five. One or two a term are expected. More means something broke. Today, the build warns once, and carries on. Freshness works the same way: warn when a source is a day late, fail at three. Who sets the level? The data's owner, with the reason written down.

**Picture.** A traffic light beside the short-course stream (pink). One enrolment card, `SC|E-7010`, with an empty email field. The test, with its levels lighting as they're named:

```yaml
# models/staging/short_courses/_short_courses__models.yml · runs on dbt Core · DuckDB
      - name: customer_bk
        description: >
          The customer who enrolled, by email. An enrolment with no email can't be matched to a
          learner. The learning team agreed: warn when any current enrolment has none, stop the
          build when more than five do (see docs/gaps.md).
        data_tests:
          - not_null:
              config:
                where: is_current_version
                warn_if: ">0"
                error_if: ">5"
```

A counter of missing emails runs 0 (green) → 1 to 5 (amber) → 6 (red), then settles back on 1, amber, and the real line of today's build appears: `WARN 1 not_null_stg_short_courses__enrolments_customer_bk`. The learning team (Tom, business outline) gives a gold tick, with its decision line: "9 Oct 2026 · An enrolment with no email: warn when there's any, stop the build when more than five." On "freshness", a small clock on the student system's stream:

```yaml
# models/staging/student_system/_student_system__sources.yml · runs on dbt Core · DuckDB
      loaded_at_field: "cast(_loaded_at as timestamp)"
      freshness:
        warn_after: {count: 1, period: day}
        error_after: {count: 3, period: day}
```

**On screen.** warn · stop · SC|E-7010 · no email · walk-in · warn if > 0 · stop if > 5 · agreed with the learning team · 9 Oct 2026 · today: WARN 1 · freshness · warn after a day · error after three · the owner sets the level · the reason, written down

### 8 · Red, on purpose · 5:07–5:32

**Narration.** 111 data tests. Four unit tests. Every promise written down, with its proof beside it. Run them now, and they fail: there are no models yet. That's on purpose. Next, the least code that turns them green, in the right place.

**Picture.** The whole list at once, in a column: 36 not_null, 20 relationships, 18 accepted_values, 18 unique_combination, 12 unique, 5 versions_do_not_overlap, 2 singular tests, then 4 unit tests. Every dot is red. The model outlines of the lineage (staging, intermediate, core, marts) wait, empty. The hallmark from chapter 1 sits beside the core, not yet struck. The loop's station 6 glows faintly. Wordless end card: *Promises and proofs* · "Promise it in a contract. Prove it with a test, first." · In the weeds of data crafting.

**On screen.** 111 data tests · 4 unit tests · every promise, with its proof · no models yet · red, on purpose · next: the least code that turns them green · *Promises and proofs* · Promise it in a contract. Prove it with a test, first.

## Pause and think

Four stops, one question each.

| After | Question | Answer, in short |
|---|---|---|
| 2 · The gap register (`gaps`) | Why is "accept and document" a real decision, not giving up? | It's made by the owner, with a reason, and it tells every consumer what the data can't do (gap 10: `status` allows `expired`, and nothing sets it yet). An unwritten gap surprises someone later. |
| 3 · The enterprise contract (`enterprise`) | Who can change a public contract, and how? | Its owner, and not by editing it in place: a breaking change arrives as a new version beside the old one, with a date for the old one to go. A later film shows how. |
| 5 · Tests first (`tests`) | Why write the tests before the model? | They say what done is, in a form a machine can check. The code's job is then to turn them green, and nobody can quietly redefine done to fit the code. |
| 7 · Warn or stop (`levels`) | Who sets a test's severity? | The data's owner, with a reason, written in the test's description and the decisions log. Not the person whose build it's blocking. |

## Rigour sheet

| Chapter | What the film says | What an expert would add, or what it simplifies |
|---|---|---|
| 1 | In 1300, an English law set a standard for silver: sterling. | The statute of Edward I, 1300 (28 Edw. I, *Articuli super Cartas*, c. 20): no vessel of silver to leave the maker's hands until assayed by the wardens of the craft and marked with a leopard's head; silver to be of the sterling standard, the standard of the coin. Sterling is 925 parts in 1,000. |
| 1 | No piece could leave the workshop until it was tested, and marked. | At first the wardens of the Goldsmiths' Company went round the workshops to test and mark. The maker's own mark was added in 1363. The film keeps the one point: the test comes before the mark. |
| 1 | From 1478, the testing was done at Goldsmiths' Hall: the hall in hallmark. | From 1478 goldsmiths brought their work to Goldsmiths' Hall, where a permanent assay office with a salaried Common Assayer was set up, and the date letter began. The word "hallmark" (marked at the Hall) is recorded from the early 18th century. |
| 1 | Buyers still trust the mark, without testing the silver themselves. | The Hallmarking Act 1973 still requires articles of precious metal sold as such in the UK to be hallmarked, above exemption weights (7.78 g for silver). The London Assay Office is still at Goldsmiths' Hall. The picture's scraper and balance stand for the assay; methods changed over the centuries (touchstone, cupellation, today X-ray fluorescence and others). |
| 1 | The tests are the assay, and they come before the mark. | The series' metaphor. Kept apart from *Older than the systems*' guild mark on a masterpiece: the point here is the order, test then mark. |
| 2 | Jun's gap register, one line per gap; three decisions. | `docs/gaps.md`: ten gaps, each with one of three decisions (lines 3-4). `docs/process.md` line 11: step 4, approved by "the owner and the consumer". "Mei approves the ones about meaning" simplifies: the decisions about credentials and learners are hers (`docs/decisions.md` 16-17); gap 5's level is the learning team's (line 18). The agent drafting the register is the process's own (`docs/process.md` 11); the film names no product. |
| 2 | The platform deletes a revoked badge; a badge that disappears is revoked from that day; a flag is requested. | `docs/gaps.md` 8. In the model: `int_credentials_unioned.sql` 33-44 and 65 (a badge whose last version is closed and no longer current is revoked on the day that version closed). Known limitation (`docs/gaps.md` 23): a badge deleted for another reason also counts as revoked, and it may have been revoked earlier. The source keeps every version (SCD2 at ingestion). |
| 2 | Jordan's microcredential vanished on 12 August; it reads as revoked. | `core_credential_v2`, run 30 September 2026: `LMS|B-5028`, Data Visualisation, learner `SIS|S-20422`, issued 2026-02-02, `status` revoked, `revoked_on` 2026-08-12, the only revoked credential of 53. Jordan's credit towards `SIS|GCDA` in `core_credit_towards_award_v1`: 45 from 2 March to 12 August 2026 (so 45 at census), 40 since. |
| 3 | The core folder: public, with an enforced contract. | `dbt_project.yml` 40-46. `access: public` means any model in any project may `ref()` it (cross-project refs need dbt Cloud; `docs/conventions.md` 30). An enforced contract makes dbt check, at build, that the model's columns match the YAML by name, data type and number; it is supported for table and incremental models (incremental with `on_schema_change` set to `append_new_columns` or `fail`; `core_credential_v2` uses `append_new_columns`). Constraints: DuckDB enforces `not_null` and `check`; Databricks enforces `not_null` and `check`, and records primary and foreign keys as information only (`docs/decisions.md` 29; `macros/duckdb_constraints.sql`). Hence the tests on keys. |
| 3 | The credential's YAML lists every column, its type and what can't be empty; grain one row per credential. | `models/core/_core__models.yml` 170-187 (trimmed). Grain has no built-in field in dbt; the project keeps it in `meta.grain` and tests it as a key. `constraints: [{type: not_null}]` is enforced by the database; `data_tests: [not_null]` checks the data after the build. |
| 3 | Change a column's type, and the build stops before the table is made. | Run 30 September 2026 on a scratch copy of the project with `credit_points` declared `string`: `dbt build --select +core_credential` gave "This model has an enforced contract that failed. Please ensure the name, data_type, and number of columns in your contract match the columns in your model's definition." with `credit_points | INTEGER | VARCHAR | data type mismatch`, raised in `assert_columns_equivalent` before `create_table_as`. Not committed. |
| 3 | Noor approves it. | `docs/process.md` 11; `docs/decisions.md` 19 (every core model versioned, Noor). |
| 4 | Planning's grain and the wallet's. | `models/marts/planning/_planning__models.yml` 12; `models/marts/wallet/_wallet__models.yml` 10. As-was against as-is is the previous film's subject. |
| 4 | Both enforced, and protected: only this project can build on them. | `dbt_project.yml` 48-53. `protected` allows `ref()` from any model in the same project (`docs/conventions.md` 29): inside this one project the wallet's marts could still ref Planning's, and only review stops it; a later film takes this up. |
| 4 | Each declares an exposure with an owner and an address. | `_planning__models.yml` 107-121; `_wallet__models.yml` 138-152. Exposures are declared in YAML; dbt doesn't discover them. |
| 4 | Change the credential in the core, and the lineage finds one exposure: the wallet app. | `dbt ls --select core_credential+ --resource-type exposure` returned `exposure:credentials.wallet_app` (run 30 September 2026). Planning's mart doesn't read `core_credential`; `core_learner+` reaches both exposures. |
| 5 | Tests before model code. | `docs/process.md` 12 (step 5: "Tests, before any model"); `skills/draft-a-model/SKILL.md` 8-9 and 21: write the YAML and tests first, then "Run it and watch it fail". In dbt, a test's YAML can be written before its model's SQL, but it doesn't parse until the model file exists: "tests first" means written and reviewed first; the next film draws the red. |
| 5 | Keys unique and never empty; relationships; allowed statuses; versions that never overlap. | `data_tests` (dbt 1.8+); recent dbt expects a generic test's arguments under `arguments:`, as the project does. `accepted_values` at `_core__models.yml` 239-245. `versions_do_not_overlap` is the project's own generic test (`tests/generic/versions_do_not_overlap.sql` 1-5); `unique_combination` too. |
| 5 | The census report's twelve; a test fails on any faculty that differs. | `seeds/census_report.csv` 1-5: 2 + 3 + 5 + 2 = 12, as at 31 March 2026, published 14 April 2026. `tests/reconcile_planning_with_census_report.sql` 1-2, 32-35: a singular test, which fails when it returns rows. PASS in the run of 30 September 2026. |
| 5 | The agent drafts the tests; Jun reviews them. | `docs/process.md` 12: "Writes them first" / "Jun Park, in review". Agents in dbt Cloud (dbt Copilot, the dbt MCP server) are named only here; availability by plan to check on the day. |
| 6 | A unit test checks logic on made-up rows. | Unit tests are available from dbt 1.8. They test a model's SQL on given inputs against expected rows, without the real data; they run in `dbt build` before the model is built. The film trims `format: csv` and the description from the YAML. |
| 6 | Two made-up rows; three versions, 15, 20, 15. | `models/intermediate/_int_models.yml` 221-239, `revoked_microcredential_stops_counting_the_day_it_is_revoked`. PASS in the run of 30 September 2026. The dates 2 February and 12 August are Jordan's badge's; the unit's 10 January date is made up. |
| 7 | A test can warn, or stop the build. | `severity`, `warn_if` and `error_if` are test configs; a failing test at error severity makes `dbt build` skip what depends on it. |
| 7 | One enrolment with no email; warn on any, stop above five; today it warns once. | `_short_courses__models.yml` 47-57; `docs/gaps.md` 12 (gap 5); `docs/decisions.md` 18 (9 October 2026, the learning team). The one enrolment is `SC|E-7010` (Excel for Everyone, completed). Build of 30 September 2026: `WARN 1 not_null_stg_short_courses__enrolments_customer_bk`. Checked on a scratch copy with emails blanked: 5 missing gave `WARN 5`, 6 gave `FAIL 6 … configured to fail if >5`. |
| 7 | Freshness: warn after a day, fail at three. | `_student_system__sources.yml` 11-13 (the same on the other two sources). Freshness is checked by `dbt source freshness`, not by `dbt build`; since the sample files don't change, it reports every source `ERROR STALE` here (README, "Run it"; run 30 September 2026: 7 of 7 stale). In dbt Cloud, a job can run it before the build. |
| 7 | The data's owner sets the level, with the reason written down. | The series' rule, from `docs/process.md` and the test's own description (lines 48-51). |
| 8 | 111 data tests, 4 unit tests. | The run of 30 September 2026: 36 `not_null`, 20 `relationships`, 18 `accepted_values`, 18 `unique_combination`, 12 `unique`, 5 `versions_do_not_overlap`, 2 singular; 4 unit tests. The red is illustrative: the run itself is PASS 143, WARN 1, ERROR 0. |

**Project files each snippet comes from** (checked against the files on 30 September 2026):

| Ch | File | Lines |
|---|---|---|
| 2 | `docs/gaps.md` | 6-8 (the table header and gap 1, wrapped; the rest of the decision trimmed with …) |
| 3 | `dbt_project.yml` | 40-46 |
| 3 | `models/core/_core__models.yml` | 170, 176-180, 182-183, 185-187 (trimmed with …; the `description` lines left out) |
| 3 | dbt's message (scratch copy) | the contract error, trimmed to three lines |
| 4 | `models/marts/planning/_planning__models.yml` | 12 (grain); 107-112, 116-121 (trimmed with …) |
| 4 | `models/marts/wallet/_wallet__models.yml` | 10 (grain); 140-152 (named, not shown in full) |
| 4 | `dbt_project.yml` | 48-53 |
| 5 | `models/core/_core__models.yml` | 239-245 |
| 5 | `tests/generic/versions_do_not_overlap.sql` | 1-5 |
| 5 | `seeds/census_report.csv` | 1-5 (as a table) |
| 5 | `tests/reconcile_planning_with_census_report.sql` | 1-2, 32-35 (trimmed with …) |
| 6 | `models/intermediate/_int_models.yml` | 221, 225-227, 229-233, 235-239 (the description and the two `format: csv` lines left out; 15 lines, the longest card in the film) |
| 7 | `models/staging/short_courses/_short_courses__models.yml` | 47-57 |
| 7 | `models/staging/student_system/_student_system__sources.yml` | 10-13 |
| 7 | `docs/decisions.md` | 18 (quoted, trimmed) |

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
| 2 | *Which test catches it?* | pick | Six broken rows (a duplicate credential key, a credential whose learner doesn't exist, a status of "suspended", two versions of a learner that overlap by a day, a faculty count off by one against the census report, an enrolment with no email) against the tests. Pick the one that stops each; pick wrong and the row slips through to the wallet. |
| 3 | *Decide the gap* | sort | Ten gaps from the register into fix at source, rule in the model, and accept and document (some take two). Sort the deleted badge as "accept" only, and Jordan's revoked microcredential shows as valid in the wallet. |
| 4 | *Warn or stop* | steps | A slider of missing emails, 0 to 8. Step through it and watch the test go green, amber, red, and the models after it skip once it's red. Then move `error_if` yourself, and see who you'd have to ask. |

## Scenarios

Eight situations, in this order.

1. **Choose.** The platform deletes revoked badges, and the wallet shows them as valid. What does Jun do first? (Add a line to the gap register, get a decision from the owner, and only then write the rule; ask the platform for a flag too.)
2. **Spot the problem.** The wallet team asks to drop a column from `core_credential` "because we don't use it." (It's a public, contracted model other consumers rely on: a breaking change, which needs a new version and a date, not an edit.)
3. **Choose.** A test fails in production at 2 a.m. for one walk-in enrolment with no email. Was the level wrong? (Here, one missing email warns and carries on, as the learning team agreed; if one failure stops the build, the level wasn't set with the owner.)
4. **True or false.** "The contract on Databricks declares a primary key, so duplicate credential keys can't get in." (False: Databricks records primary keys but doesn't enforce them. The `unique` test does the checking.)
5. **Explain.** A reviewer asks why the tests were written before the SQL. (They say what done is, reviewed by the people who own it; the code is then judged against them, not the other way round.)
6. **Choose.** Planning wants expiry dates on every credential; no source records them. (Accept and document: `status` allows `expired`, nothing sets it yet, gap 10; fix at source if the business needs it.)
7. **Order.** A source hasn't loaded for two days. Put what happens in order: freshness warns after one day; someone is told; the owner looks at the source; at three days, freshness errors; the job stops before the build uses stale data.
8. **Spot the problem.** Every unit test passes, but Planning's number is one off the census report. (Unit tests check logic on made-up rows; the reconciliation checks the result against a trusted number. Only the second can catch this.)

## Pause and think

`gaps`, `enterprise`, `tests`, `levels` (the questions and answers are in [Pause and think](#pause-and-think) above).

## Decisions taken

| Date | Decision |
|---|---|
| 30 September 2026 | Open in London from 1300 with the assay and the hallmark: tested before it's marked, and trusted after. Kept apart from *Older than the systems*' guild mark by making the order the point. |
| 30 September 2026 | Jordan's revoked microcredential (12 August 2026) carries the film: gap 1, the contract's `status`, and the unit test's dates. |
| 30 September 2026 | The contract's refusal and the warn-to-stop step are shown with dbt's real output, from scratch copies of the project, and said so here. The red at the end is illustrative. |
| 30 September 2026 | Every code card carries the label `runs on dbt Core · DuckDB`; the film doesn't repeat the setup lines of *Start from a question*. |

## Open

1. **Scratch experiments.** The contract refusal and the WARN 5 / FAIL 6 runs were made on a copy of the project; consider adding them as documented commands so viewers can repeat them.
2. **Freshness on screen.** The sample data is always stale, so the film shows the configuration, not a freshness result.
3. **Voice.** Check "thirteen hundred", "fourteen seventy-eight", "May" and "dee bee tee" by ear; key strings and test names stay on screen only.
