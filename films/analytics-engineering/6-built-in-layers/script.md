# In the weeds of data crafting · Built in layers: script

*The script of a film of In the weeds of data crafting, a technical series for analytics engineers, as planned: about 4:36 (target 4 to 6 minutes), in eight chapters, in English, 30 September 2026. The narration lives in [`source/src/narration.js`](source/src/narration.js) and the pauses in [`source/src/breath.js`](source/src/breath.js); this page and those files say the same thing, and where they differ, the source wins. The timings are estimates from the word count (584 words, at the pace of the opening film) until the voice is recorded; the pacing report replaces them. Takes step 6 of Jun's ten: build, layer by layer.*

## The promise

A practitioner follows every line, and a data architect agrees with it. With the contracts and tests written first, the code's job is to turn them green, and each piece of it goes where one job is done: staging tidies one source table and keys it, with no joins and no rules; intermediate holds the steps (match, stitch, gather, apply a rule), not products; the core holds what the blueprint names, under an enforced contract; the marts shape it for one consumer each, and build only on the core. Inside a model, each CTE is one step, named for what it holds, from imports to a final select in the contract's order. How a model is stored follows how it's used. A rule and a count are written once. **Each layer has one job; each CTE, one step.**

## The story in one paragraph

In the 1890s, at the Savoy in London, Auguste Escoffier ran his kitchen as a brigade: one station for sauces, one for roasts, one for fish, one for vegetables, each preparing its part ahead, and every plate checked at the pass. Jun's credential project works the same way. The tests from the last film are written, and now the code has to pass them; the agent writes a first draft of each model, runs its tests and watches them fail, then writes the least code that turns them green, and Jun reviews every line. Staging is seven views, one per source table: rename, cast, trim, one case per key, the readable key with its key set, and its hash; no joins, no rules, and a customer is still a customer. Intermediate is eight views, each a step: match a learner's keys, stitch three timelines, gather credentials from three systems, apply the credit rule; here a customer becomes a learner, and a model's CTE names read like its recipe. The core is what the blueprint names, public and under an enforced contract; the award skips intermediate, because it has one source and nothing to resolve; Noor reviews it. The marts, each built for one consumer, serve Planning a row per learner per award, as at census (73 rows), and the wallet one wide row per learner, as it is now; each builds on the core, never on another mart. Planning's mart reads top to bottom: import CTEs, logical CTEs, a final select. Staging and the steps are views, the core and marts are tables, and the credential table is incremental, merged on its key and clustered by learner on Databricks. Planning's rule and its count are written once, the semantic layer's metric counts the same column, and the pass, the reconciliation with the census report, is green: twelve and twelve. Next: one team built it, but three own it.

## What each object stands for

| Object | Stands for |
|---|---|
| The Savoy's kitchen, stations lighting one by one (sauces, roasts, fish, vegetables) | Layers: one job each |
| Bowls set out ahead at each station | Each layer prepares its part for the next |
| The pass, and a hand checking a plate | Tests and the reconciliation: nothing leaves unchecked |
| Four columns in `LAYER4` colours: staging blue-grey, intermediate violet, core gold, marts green | The project's four layers, as in the opening film's lineage graph |
| A column of test names, grey, then red under a first draft, then green in a wave | Tests written first; a draft makes them fail; the build turns them green |
| The teal orb writing SQL beneath a failing test; Jun's gold tick in review | The agent drafts to pass the tests; a person approves the code |
| Seven small source-coloured files (blue, green, pink) | Staging: one model per source table |
| A label "customer" that stays "customer" in staging and turns "learner" in intermediate | Staging keeps the source's words; intermediate translates them |
| A list of CTE names, lit top to bottom like a recipe card | A model's steps, each named for what it holds |
| Four gold nodes and a relationship, the blueprint behind them | The core: what the blueprint names |
| An arrow from the award's staging file straight to the core, past intermediate | One source, nothing to resolve: no step needed |
| Planning's badge over a tall, narrow table; the wallet's badge over one wide row | A fact for counting; one wide row for one lookup |
| A crossed-out arrow from one mart to another | Marts build on the core, not on each other |
| A glass pane (view), a stone block (table), a block with a thin new layer merging on top (incremental) | Physical choices |
| A small "Databricks" tag on one config line | A line only one engine uses |
| One `is_near_award` column with lines running to the count macro and the metric; the macro's line running on to the reconciliation | The rule written once; two counts read the same column |
| Twelve and twelve on a balance, green | The reconciliation with the census report |
| The label `runs on dbt Core · DuckDB` on every code card | The setup is real, and anyone can run it |

## Script

### 1 · One station, one job · 0:00–0:30

**Narration.** At the Savoy hotel in London, in the 1890s, the chef Auguste Escoffier ran his kitchen as a brigade. Each station had one job: sauces, roasts, fish, vegetables. Each prepared its part ahead, and every plate was checked at the pass. Jun's credential project is a kitchen too: four stations, one job each, and a pass.

**Picture.** The warm past, with "1890s · the Savoy, London" in the corner. A kitchen of the period, drawn with care (cooks in whites and toques, copper pans, a long range). Four stations light in turn, each with a small label: sauces, roasts, fish, vegetables; at each, a cook's hands work (a knife on a board: a soft knock; a pan set down: a low thud). Small bowls line up along each station, prepared ahead. A plate travels along the stations, gaining one part at each, and is slid to the pass (paper-soft); the chef's hand turns it and checks it. On the bridge, the four stations tint into the four layer colours (blue-grey, violet, gold, green), left to right, a small credential card sits on the plate, and the pass becomes a thin line with a tick on it. The past runs about 26 seconds before the title. Wordless breather: the title card over the kitchen, with the series' mark: "IN THE WEEDS OF DATA CRAFTING", *Built in layers*, "each layer one job; each CTE one step".

**On screen.** 1890s · the Savoy, London · a brigade · sauces · roasts · fish · vegetables · prepared ahead · the pass · four stations · one job each · *Built in layers* · each layer one job; each CTE one step

### 2 · Staging · 0:30–1:13

**Narration.** The tests are written. Now the code has to pass them, layer by layer. The agent writes a first draft of each model, runs its tests, and watches them fail. Then it writes the least code that turns them green. Jun reviews every line. The first station is staging. One model per source table: seven of them. Staging renames and casts. It trims, and writes each key in one case. It adds the readable key, with its key set, and its hash. No joins, and no rules. A short-course customer is still called a customer here.

**Picture.** The loop of ten steps, small, with station 6 lit. A column of real test names from the build, drawn grey, not yet run (illustrative: the run itself is green): `unique_core_credential_v2_credential_key`, `relationships_mart_planning__near_award_learner_key__…`, `unique_combination_mart_planning__near_award_learner_key__award_key`, `reconcile_planning_with_census_report`, and more, fading down. The teal orb opens the skill, with its label:

```markdown
<!-- skills/draft-a-model/SKILL.md · runs on dbt Core · DuckDB -->
The contract and the tests say what done looks like. Write them first, then the least SQL that
turns them green, in the right layer.
```

The orb writes a first draft under the grey names, runs them, and they turn red; then it writes the least SQL under a failing test; Jun, outlined in cyan, reads it and adds a gold tick. Then four columns in the layer colours; the first, staging, fills with seven small files in their source colours (three blue, two green, two pink). The layers table from `docs/conventions.md` writes itself, trimmed (the Sources row and the Folder column left out):

```markdown
<!-- docs/conventions.md · runs on dbt Core · DuckDB -->
| Layer | Job | Access | Materialised |
|---|---|---|---|
| Staging | One model per source table: rename, cast, add keys qualified by their key set and their hashes. No joins, no rules. … | private | view |
| Intermediate | Steps, not products: match keys, stitch timelines, apply business rules. … | private | view |
| Core | One model per entity and relationship at a declared grain. The enterprise contract, versioned: … | public | table (incremental where it pays) |
| Marts | Built for one consumer. The consumer contract. | protected | table |
```

Only the staging row is lit; the others stay dim until their chapters. One pink file opens, with its label, each part lighting as it's named (rename and cast; trim and one case; the key; the hash):

```sql
-- models/staging/short_courses/stg_short_courses__learners.sql · runs on dbt Core · DuckDB
renamed as (
    select
        nullif(lower(trim(customer_email)), '') as email,
        …
    from source
),
keyed as (
    select
        {{ business_key('SC', 'email') }} as customer_bk,
        *
    from renamed
)
select
    {{ hash_key(['customer_bk']) }} as customer_key,
    *
from keyed
```

On "no joins", a dashed arrow tries to reach from the pink file to a blue one and fades. On "customer", the word `customer_bk` glows, and a small tag "customer" sits on the file.

**On screen.** Build · step 6 · in layers · tests first · now the code · the agent drafts · runs · red · the least code · Jun reviews · staging · one per source table · 7 views · rename · cast · trim · one case · readable key · key set · hash · no joins · no rules · still a customer · runs on dbt Core · DuckDB

**In the repo.** [`skills/draft-a-model/SKILL.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/skills/draft-a-model/SKILL.md) · [`models/staging/short_courses/stg_short_courses__learners.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/staging/short_courses/stg_short_courses__learners.sql) · [`docs/conventions.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/docs/conventions.md)

### 3 · Intermediate · 1:13–1:41

**Narration.** Next, intermediate. Eight models, and each one is a step, not a product. Match a learner's keys. Stitch three timelines into one. Gather the credentials from three systems. Apply the credit rule. Here the sources' words become the model's: a customer becomes a learner. Read the names of one model's steps, top to bottom, and you have its recipe.

**Picture.** The violet column fills with eight small files, drawn with arrows from the staging files. Four are picked out as they're named, each with a one-line label: `int_learner_keys_matched` (match keys), `int_learner_timeline` (one timeline), `int_credentials_unioned` (three systems, one list), `int_credit_towards_award` (the credit rule). The line from `docs/conventions.md` 12 writes: "Steps, not products: match keys, stitch timelines, apply business rules. Translates the source's words into the model's." The tag "customer" from staging travels into the violet column and turns into "learner". Then `int_learner_timeline.sql` shows only its CTE names, lighting top to bottom like a recipe card, the first five dimmer (they import). The card is a list drawn from the file, not lines of it, and says so:

```
-- CTE names from models/intermediate/student/int_learner_timeline.sql · runs on dbt Core · DuckDB
matched_keys · student_records · platform_users
course_customers · status_map
student_versions
platform_versions
customer_versions
versions
change_dates
held
stitched
resolved
translated
compared
changed
```

**On screen.** intermediate · 8 views · steps, not products · match keys · one timeline · three systems, one list · the credit rule · customer → learner · the recipe

**In the repo.** [`docs/conventions.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/docs/conventions.md) · [`models/intermediate/student/int_learner_timeline.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/intermediate/student/int_learner_timeline.sql)

### 4 · Core · 1:41–2:12

**Narration.** Then the core: what the blueprint names. A learner, an award, a credential, and credit towards an award. Each at its declared grain, public, under an enforced contract. Jun builds it, and the tests turn green. The award skips intermediate. It has one source, and nothing to resolve, so staging feeds the core directly. Noor reviews the core. It's her model, built.

**Picture.** The gold column: four nodes, labelled as they're named (learner, award, credential, credit towards award), and behind them, faint, the blueprint (white on blue) with the same entities. The core's folder config, with its label:

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

On "green", the red test names from the staging chapter turn green in a wave, top to bottom (each a soft felt note, rising a fifth as it changes). An arrow runs from `stg_student_system__awards` in the blue-grey column straight past the violet column to the award node; `core_award.sql` opens, with its label:

```sql
-- models/core/course/core_award.sql · runs on dbt Core · DuckDB
with
awards as (
    select * from {{ ref('stg_student_system__awards') }}
)
-- one source and nothing to resolve: no intermediate step needed
select
    award_key,
    award_bk,
    cast(recorded_from as date) as valid_from,
    …
from awards
```

Noor, outlined in cyan, looks over the gold column and adds a gold tick.

**On screen.** core · what the blueprint names · learner · award · credential · credit towards an award · declared grain · public · contract enforced · tests green · the award: one source, nothing to resolve · Noor reviews

**In the repo.** [`dbt_project.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/dbt_project.yml) · [`models/core/course/core_award.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/core/course/core_award.sql)

### 5 · Marts · 2:12–2:42

**Narration.** Last, the marts: each built for one consumer, and shaped for how it's read. Planning's is long and narrow: seventy-three rows, one per learner per award, ready to count by faculty. The wallet's is wide: everything about a learner in one row, so the app reads it in one lookup. Each mart builds on the core, never on another mart.

**Picture.** The green column. Planning's consumer badge over a tall, narrow table (73 rows, 17 columns); its grain writes below, from `models/marts/planning/_planning__models.yml`: "One row per learner per award, as at census date". The rows sort into four faculty groups. The wallet's badge over one long row that stretches across the screen, 14 columns labelled as they arrive (learner_key, status, enrolled award, credit earned, remaining, credentials held, awards, microcredentials, badges, revoked…); a finger taps it once: one lookup. Its YAML, with its label:

```yaml
# models/marts/wallet/_wallet__models.yml · runs on dbt Core · DuckDB
  - name: mart_wallet__learners
    description: >
      Who a learner is, what they hold, and how far they are towards the award they're enrolled
      in, as it is now: each entity's version valid today. One wide row, so the app reads a
      learner in one lookup.
    config:
      meta:
        grain: One row per learner, as it is now
```

On "never", an arrow from the wallet's mart to Planning's appears and is crossed out; both marts' arrows run back to the gold core.

**On screen.** marts · each for one consumer · Planning · one row per learner per award · as at census date · 73 rows · the wallet · one wide row · as it is now · one lookup · on the core, not on another mart

**In the repo.** [`models/marts/wallet/_wallet__models.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/marts/wallet/_wallet__models.yml)

### 6 · One CTE, one step · 2:42–3:14

**Narration.** Open Planning's mart. It's written as named steps, each called a CTE, and it reads like a recipe too. First, import CTEs: one for each model it reads, and nothing else. Then logical CTEs, one step each, named for what they hold: learners at census, not CTE two. Last, a final select that lists every column, in the contract's order. A reviewer reads it top to bottom, and can see where every column comes from.

**Picture.** On "CTE", the word writes itself above the file, with a small expansion beneath it, "common table expression · a named step". Then `mart_planning__near_award.sql` unfolds, section by section, each section a card that folds shut as the next opens (soft paper), with its label. Imports:

```sql
-- models/marts/planning/mart_planning__near_award.sql · runs on dbt Core · DuckDB
learners as (
    select * from {{ ref('core_learner') }}
),
awards as (
    select * from {{ ref('core_award') }}
),
credit as (
    select * from {{ ref('core_credit_towards_award') }}
),
```

Logical, with `cte2` drawn beside `learners_at_census` and struck through:

```sql
-- as it was: each entity's version on the census date
learners_at_census as (
    select * from learners
    where {{ valid_at(census_date()) }}
),
…
measured as (
    select
        *,
        greatest(credit_points_required - credit_points_earned, 0) as credit_points_remaining
    from joined
)
```

Final:

```sql
select
    {{ hash_key(['learner_bk', 'award_bk']) }} as learner_award_key,
    {{ census_date() }} as census_date,
    learner_key,
    award_key,
    …
    is_enrolled
        and learner_status = 'studying'
        and {{ is_near_award('credit_points_remaining') }}
        as is_near_award
from measured
```

Beside it, the CTE names as an outline: learners · awards · credit → learners_at_census · awards_at_census · credit_at_census · learner_awards · joined · measured → final select. On "every column", one column (`credit_points_remaining`) is traced back up the outline to `measured`, then `joined`, then splits in two: `credit_points_required` to `awards_at_census`, and `credit_points_earned` to `credit_at_census`. The SQL conventions, trimmed:

```markdown
<!-- docs/conventions.md · runs on dbt Core · DuckDB -->
- **Import CTEs** first, one per model or source, each `select * from {{ ref(...) }}`.
- Then **logical CTEs**, one step each, named for what they hold (`learners_at_census`, not `cte2`). …
- A **final select** that lists every column, in the contract's order.
```

**On screen.** import CTEs · one per model it reads · logical CTEs · one step each · named for what they hold · learners_at_census, not cte2 · final select · every column · the contract's order · top to bottom

**In the repo.** [`models/marts/planning/mart_planning__near_award.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/marts/planning/mart_planning__near_award.sql) · [`docs/conventions.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/docs/conventions.md)

### 7 · Physical choices · 3:14–3:52

**Narration.** How each model is stored follows how it's used. Staging and the steps are views: nothing stored twice, and the agent can query any one of them. The core and the marts are tables, because people read them all day. The credential table is incremental. Each run merges only what changed, matched on the credential's key. Run it twice, and the second run merges nothing. On Databricks, the same file clusters it by learner. And when the logic changes, rebuild it in full.

**Picture.** The four columns again; the blue-grey and violet become glass panes (views), the gold and green stone blocks (tables). The folder config, trimmed, with its label:

```yaml
# dbt_project.yml · runs on dbt Core · DuckDB
    staging:
      +materialized: view
    …
    intermediate:
      +materialized: view
    …
    core:
      +materialized: table
    …
    marts:
      +materialized: table
```

The teal orb queries a violet pane, and a few rows appear through it. Then one gold block, `core_credential`, gains a thin new layer on top that merges into it, row by row, matched by key. Its config and filter, with its label:

```sql
-- models/core/student/core_credential_v2.sql · runs on dbt Core · DuckDB
{{
    config(
        materialized='incremental',
        unique_key='credential_key',
        incremental_strategy='merge',
        on_schema_change='append_new_columns',
        liquid_clustered_by=(['learner_key'] if target.type == 'databricks' else none)
    )
}}
…
    {% if is_incremental() %}
    where credentials.loaded_at > (select max(loaded_at) from {{ this }})
    …
```

On "twice", a second run: the new layer is empty: "0 rows to merge". On "Databricks", the `liquid_clustered_by` line lights, with a small dim tag "Databricks · dbt Cloud"; the block's rows regroup by learner. On "in full", a command writes: `dbt build --select core_credential --full-refresh --profiles-dir .`, and the block rebuilds from the bottom.

**On screen.** how it's used · views: staging and steps · tables: core and marts · incremental · merge · on the credential's key · second run: 0 rows to merge · clustered by learner on Databricks · logic changed: --full-refresh

**In the repo.** [`dbt_project.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/dbt_project.yml) · [`models/core/student/core_credential_v2.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/core/student/core_credential_v2.sql)

### 8 · Metrics once · 3:52–4:36

**Narration.** Planning's rule is written once: near an award means more than nothing left, and no more than fifteen points. The count by faculty is one macro. And the metric the dashboards ask for, defined in dbt's semantic layer, counts the same column. Then the pass. Planning's mart against the census report, faculty by faculty: twelve, and twelve. Green. Each layer has one job. Each CTE, one step. It's built by one team, in one project. But the registrar owns learners, the learning team owns microcredentials, and Planning wants a project of its own.

**Picture.** The macro card, with its label:

```sql
-- macros/planning/near_award.sql · runs on dbt Core · DuckDB
{#- Near an award: more than none left, and no more than the near_award_credit_points var. -#}
{% macro is_near_award(credit_points_remaining) -%}
    ({{ credit_points_remaining }} > 0 and {{ credit_points_remaining }} <= {{ var('near_award_credit_points') }})
{%- endmacro %}
…
{% macro learners_near_graduate_certificate(group_by='faculty_code') -%}
    select
        {{ group_by }},
        count(distinct learner_key) as learners_near_graduate_certificate
    from {{ ref('mart_planning__near_award') }}
    where is_near_award
      and award_type = 'graduate certificate'
    group by {{ group_by }}
{%- endmacro %}
```

The var `near_award_credit_points: 15` glows in `dbt_project.yml`, with a thin line to the `is_near_award` macro, and from it to the mart's `is_near_award` column. From that column, two lines run out: one to the count macro, and on from it to the reconciliation test; one to the metric, whose YAML opens beside it. No line joins the count macro to the metric:

```yaml
# models/marts/planning/_planning__semantic.yml · runs on dbt Core · DuckDB
  - name: learners_near_graduate_certificate
    label: Learners near a graduate certificate
    …
    type: simple
    type_params:
      measure: learners
    filter: |
      {{ Dimension('learner_award__is_near_award') }} and {{ Dimension('learner_award__award_type') }} = 'graduate certificate'
```

Then the pass, drawn as the kitchen's pass returning for a moment: the reconciliation, faculty by faculty (from `dbt show --select reconcile_census_report --profiles-dir .`), with its label:

```
-- dbt show --select reconcile_census_report · runs on dbt Core · DuckDB
| census_date | faculty_name                  | in_the_mart | in_the_census_report | difference |
|  2026-03-31 | Faculty of Arts and Education |           2 |                    2 |          0 |
|  2026-03-31 | Faculty of Business           |           3 |                    3 |          0 |
|  2026-03-31 | Faculty of Engineering and IT |           5 |                    5 |          0 |
|  2026-03-31 | Faculty of Health             |           2 |                    2 |          0 |
```

and the build line `PASS reconcile_planning_with_census_report`, green, with the same label, and "12 · 12". On "each layer", the four columns and the Savoy's four stations sit side by side for a moment. On the hand-off, the gold core is shared out: Mei's face (business outline) over learner and award, the learning team (Tom) over the microcredentials, and Planning's badge lifts its mart towards a second, empty project frame. Wordless end card: *Built in layers* · "Each layer one job; each CTE one step; each rule written once." · In the weeds of data crafting.

**On screen.** is_near_award · more than 0 left · no more than 15 · written once · the count, one macro · the metric · the same column · the pass · 12 · 12 · green · one team · one project · the registrar · the learning team · a project of its own · *Built in layers* · Each layer one job; each CTE one step; each rule written once.

**In the repo.** [`macros/planning/near_award.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/macros/planning/near_award.sql) · [`dbt_project.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/dbt_project.yml) · [`models/marts/planning/_planning__semantic.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/marts/planning/_planning__semantic.yml)

## Pause and think

Four stops, one question each.

| After | Question | Answer, in short |
|---|---|---|
| 2 · Staging (`staging`) | Why no joins in staging? | So each source is tidied once, the same way, and every later step starts from it. A join in staging hides a decision (which record wins, which key matches) where no one looks for it; matching is a rule, and rules live in intermediate, where they're named and tested. |
| 4 · Core (`core`) | Why does the award skip intermediate? | It has one source and nothing to resolve: no keys to match, no timelines to stitch. A step that only passes rows through adds a model to maintain and nothing to test. When a second source of awards arrives, a step appears. |
| 6 · One CTE, one step (`ctes`) | What does an import CTE buy you? | Every model the file depends on, listed at the top, once. A reviewer sees the inputs before the logic; a reference can't hide in the middle of a join, and changing an input means changing one line. |
| 7 · Physical choices (`physical`) | When is incremental worth the risk? | When the table is large and most of it doesn't change between runs. The risk is that a change of logic doesn't reach rows already built: after one, rebuild in full (`--full-refresh`), and compare with a full build before trusting it. Here, with 53 credentials, it's there to show the pattern. |

## Rigour sheet

| Chapter | What the film says | What an expert would add, or what it simplifies |
|---|---|---|
| 1 | In the 1890s, at the Savoy in London, Auguste Escoffier ran his kitchen as a brigade. | Escoffier ran the Savoy's kitchens from its opening years, with César Ritz as manager, from 1890 until both were dismissed in March 1898. He is credited with codifying and spreading the *brigade de cuisine*; kitchens organised by stations existed before him (he systematised, didn't invent), so the film says "ran his kitchen as a brigade", not "invented". His *Le Guide culinaire* followed in 1903 (not told). |
| 1 | Each station had one job: sauces, roasts, fish, vegetables. | The stations (*parties*): saucier (sauces, and sautéed dishes), rôtisseur (roasts, grills), poissonnier (fish), entremetier (vegetables, soups, eggs), with garde-manger, pâtissier and others. Each station was a team under a chef de partie, not one cook; the film names the stations, not the cooks. |
| 1 | Each prepared its part ahead; every plate was checked at the pass. | Preparation ahead (*mise en place*) and a pass where the head chef or an expediter checks each plate are standard in brigade kitchens; the film doesn't claim a specific Savoy practice beyond the brigade. |
| 2 | The tests are written. Now the code has to pass them, layer by layer. | Illustrative: the test names are real (from the build of 30 September 2026), but the run shown is the finished project, where they pass. With YAML and no model, dbt doesn't fail: it warns "Did not find matching node for patch" and that each test depends on a node that was not found, skips those tests, and the build passes with none run; `--select <model>` selects nothing. Checked 30 September 2026 on a scratch project (dbt Core 1.12.5, dbt-duckdb 1.11.0). Tests go red only once a model exists, even a first draft: so the film shows the names grey until the agent's draft, then red. |
| 2 | The agent writes a first draft, runs the tests, watches them fail, then writes the least code; Jun reviews. | `skills/draft-a-model/SKILL.md` 8-9 and 21-23 (step 3, "Run it and watch it fail", runs before any SQL exists, which on dbt selects nothing: raised with the author, see Open); `AGENTS.md` (the agent may build against the development target only; a person approves). The agent is the series' own; no product is named. What dbt Cloud offers for agents (dbt Copilot, the dbt MCP server) is to be checked on the day and stays in the rigour sheets. |
| 2 | Staging: one model per source table, seven of them; rename, cast, trim, one case per key, the readable key and its hash; no joins, no rules. | `docs/conventions.md` 11 and 201; 7 staging views in `models/staging/`, a folder per source system. dbt's own guide ("How we structure our dbt projects") puts staging as one model per source table, materialised as views, with renaming, type casting, basic computations and categorisation, and no joins or aggregations; the series adds the keys and hashes there. The project uses `source` → `renamed` → `keyed` → final select (dbt's guide names the first two `source` and `renamed` too). |
| 2 | A short-course customer is still called a customer here. | `docs/conventions.md` 11: "Keeps the source's own words (a 'customer' is still a customer)". `customer_bk`, `customer_key` in `stg_short_courses__learners`. |
| 3 | Intermediate: eight models, each a step, not a product. | `int_learner_keys`, `int_learner_key_candidates`, `int_learner_keys_matched`, `int_learners`, `int_learner_timeline`, `int_credentials_unioned`, `int_credit_items`, `int_credit_towards_award`, in `models/intermediate/student/`; all views (`dbt_project.yml` 38-42). dbt's guide describes intermediate models as purpose-built steps, not exposed to end users. |
| 3 | Here a customer becomes a learner. | `docs/conventions.md` 12; `int_learner_keys.sql` reads `course_customers` and turns each `customer_bk` into a learner key to match (lines 15, 49-53). |
| 3 | Read the names of a model's steps and you have its recipe. | `int_learner_timeline.sql`: 16 CTEs, 5 import (`matched_keys` … `status_map`) and 11 logical (`student_versions` … `changed`), lines 9-213. |
| 4 | The core: learner, award, credential, and credit towards an award; declared grain; public; enforced contract. | `dbt_project.yml` 46-52 (`access: public`, `contract: enforced: true`, set once for the folder); `meta.grain` on each (`models/core/student/_core_student__models.yml` 10, 119, 246; `models/core/course/_core_course__models.yml` 10). Five core tables in the warehouse: `core_learner_v1` (101 rows), `core_award_v1` (9), `core_credential_v2` (53) and `core_credential_v1` (53, built from v2), `core_credit_towards_award_v1` (166). An enforced contract checks column names and data types at build time (and, where the platform supports them, `not_null` and `check` constraints); it doesn't check the grain, which the tests do. |
| 4 | Jun builds it, and the tests turn green. | The build of 30 September 2026: `dbt build --profiles-dir . --vars '{as_is_date: 2026-09-30}'`, dbt Core 1.12.5 with dbt-duckdb 1.11.0: 146 nodes, PASS 143, WARN 1 (by design: an enrolment with no email, LIM-SC-02), ERROR 0; 111 data tests and 4 unit tests. |
| 4 | The award skips intermediate: one source and nothing to resolve. | `models/core/course/core_award.sql` 9; `docs/conventions.md` 20. |
| 5 | Planning's mart: one row per learner per award, as at census date, 73 rows. | `_planning__models.yml` 12; 73 rows in `mart_planning__near_award` (17 columns), queried 30 September 2026. It's a fact in the usual sense (one row per event or pair, with numbers to add up); the film doesn't name the pattern. |
| 5 | The wallet's is wide: one row per learner, as it is now, one lookup. | `_wallet__models.yml` 3-10; 46 rows, 14 columns in `mart_wallet__learners`, with `as_is_date` pinned to 30 September 2026. |
| 5 | Each mart is built for one consumer, and builds on the core, never on another mart. | The marts' `ref()`s: `core_learner`, `core_award`, `core_credit_towards_award`, `core_credential` (v2), and the seed `key_sets`. dbt itself would allow a mart to `ref()` another here (both are `protected`, one project); review and the conventions stop it (`docs/conventions.md` 167). The next film takes this up. |
| 6 | A model is written as named steps, each called a CTE. | A CTE is a common table expression, a named `select` in a `with` clause; SQL reads them in order, and each can use the ones before it. The narration names the term here, where the series first uses it in words. |
| 6 | Import CTEs, logical CTEs named for what they hold, a final select in the contract's order. | `docs/conventions.md` 191-196; dbt Labs' style guide ("How we style our SQL") recommends import CTEs at the top, one logical unit of work per CTE, descriptive CTE names, and a final `select * from` a last CTE; the project instead lists every column in the final select, in the contract's order, so the file reads like the contract. |
| 7 | Staging and the steps are views; the agent can query any one of them. | `dbt_project.yml` 32-42 (staging and intermediate both `+materialized: view`; in the warehouse, 7 `dev_staging` and 8 `dev_intermediate` relations, all views); README, "Workarounds": "Intermediate models are views, not ephemeral. Unit tests can then mock their inputs as plain rows, and an agent can query each step." Ephemeral models are inlined as CTEs and can't be queried on their own. A view is computed each time it's read; "nothing stored twice" means no copy of the data. |
| 7 | The core and the marts are tables. | `dbt_project.yml` 46-59. On Databricks, tables are Delta tables in Unity Catalog. |
| 7 | The credential table is incremental, merged on the credential's key; run twice, the second run merges nothing. | `core_credential_v2.sql` 1-9, 21-34: `incremental_strategy='merge'`, `unique_key='credential_key'`; rows written to the source since the last run, or whose holder was re-matched. Checked 30 September 2026: after a build, `dbt run --select core_credential` again selects 0 rows to merge (the `to_merge` filter run against the built table). `merge` is dbt-databricks' default for Delta; dbt-duckdb supports it too (used here). |
| 7 | On Databricks, the same file clusters it by learner. | `liquid_clustered_by` (dbt-databricks), set only when `target.type == 'databricks'`; Delta liquid clustering; dbt-databricks runs `OPTIMIZE` after the build when it's set. Not run on DuckDB. |
| 7 | When the logic changes, rebuild it in full. | `dbt build --select core_credential --full-refresh --profiles-dir .` (the project's `profiles.yml` lives in `project/`, so every command here passes the flag); an incremental model otherwise keeps rows built under the old logic. `skills/reconcile-and-diff/SKILL.md` builds the branch with `--full-refresh` before diffing. |
| 8 | Near an award means more than nothing left, and no more than fifteen points. | `macros/planning/near_award.sql` 6-9; var `near_award_credit_points: 15` (`dbt_project.yml` 21). The mart applies it once, into `is_near_award` (with enrolled and studying). |
| 8 | The count by faculty is one macro; the metric counts the same column. | `macros/planning/near_award.sql` 17-25, used by `tests/reconciliation/reconcile_planning_with_census_report.sql` 7 and the analyses; the metric `learners_near_graduate_certificate` (`models/marts/planning/_planning__semantic.yml` 49-59) counts distinct `learner_key` filtered on the same `is_near_award` column. Two expressions of one count, one for SQL and one for BI, both reading the column the rule wrote once. Checked 30 September 2026 with MetricFlow 0.15.0 on a copy of the project (`mf query --metrics learners_near_graduate_certificate --group-by learner_award__faculty_name`): Arts and Education 2, Business 3, Engineering and IT 5, Health 2, the same as the macro; CI checks the same (`.github/workflows/credential-project.yml` 58-63). The dbt Semantic Layer (MetricFlow) is queried through dbt Cloud on plans that include it; with dbt Core, the MetricFlow CLI queries it locally. |
| 8 | The pass: twelve and twelve, faculty by faculty. Green. | `dbt show --select reconcile_census_report`: 2/2/0, 3/3/0, 5/5/0, 2/2/0; the singular test `reconcile_planning_with_census_report` passes (it returns a row for any faculty that differs). The census report is `seeds/expected/planning/census_report.csv`, published 14 April 2026. |

**Project files each snippet comes from** (checked against the files on 6 October 2026):

| Ch | File | Lines |
|---|---|---|
| 2 | [`skills/draft-a-model/SKILL.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/skills/draft-a-model/SKILL.md) | 8-9 |
| 2 | [`docs/conventions.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/docs/conventions.md) | 8, 11-14 (the Sources row and the Folder column left out; the Job column trimmed with …) |
| 2 | [`models/staging/short_courses/stg_short_courses__learners.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/staging/short_courses/stg_short_courses__learners.sql) | 9-12, 19, 21, 23, 25-28, 30, 32-35 (blank lines removed; trimmed with …) |
| 2 | test names | from the build output of 30 September 2026 |
| 3 | [`docs/conventions.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/docs/conventions.md) | 12 (trimmed) |
| 3 | [`models/intermediate/student/int_learner_timeline.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/intermediate/student/int_learner_timeline.sql) | the CTE names, lines 9-213 (a list drawn from the file, labelled "CTE names from"; not lines of it) |
| 4 | [`dbt_project.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/dbt_project.yml) | 46-52 |
| 4 | [`models/core/course/core_award.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/core/course/core_award.sql) | 1-5, 7, 9-13, 22 (blank lines removed; trimmed with …) |
| 5 | [`models/marts/planning/_planning__models.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/marts/planning/_planning__models.yml) | 12 |
| 5 | [`models/marts/wallet/_wallet__models.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/marts/wallet/_wallet__models.yml) | 3-10 |
| 6 | [`models/marts/planning/mart_planning__near_award.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/marts/planning/mart_planning__near_award.sql) | 3-19, 21-27, 79-86, 88-92, 105-109 (blank lines removed; trimmed with …) |
| 6 | [`docs/conventions.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/docs/conventions.md) | 192-194 (trimmed) |
| 7 | [`dbt_project.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/dbt_project.yml) | 32-33, 38-39, 46-47, 54-55 (trimmed with …) |
| 7 | [`models/core/student/core_credential_v2.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/core/student/core_credential_v2.sql) | 1-9, 24-25 (trimmed with …) |
| 8 | [`macros/planning/near_award.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/macros/planning/near_award.sql) | 6-9, 17-25 |
| 8 | [`dbt_project.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/dbt_project.yml) | 18, 21 (trimmed) |
| 8 | [`models/marts/planning/_planning__semantic.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/marts/planning/_planning__semantic.yml) | 49-50, 55-59 (trimmed with …) |
| 8 | `dbt show --select reconcile_census_report --profiles-dir .` | result, with its real column names and full faculty names (dbt show's separator row dropped) |
| 8 | build output | `PASS reconcile_planning_with_census_report` |

The run behind every number: `dbt build --profiles-dir . --vars '{as_is_date: 2026-09-30}'`, dbt Core 1.12.5 with dbt-duckdb 1.11.0, 30 September 2026: 146 nodes, PASS 143, WARN 1, ERROR 0; 24 models (15 views, 8 tables, 1 incremental), 5 seeds, 111 data tests, 4 unit tests, 2 exposures. The 24 models: 7 staging, 8 intermediate, 5 core (`core_learner`, `core_award`, `core_credit_towards_award`, `core_credential` v1 and v2), 3 marts, and the semantic layer's time spine.

**dbt and Databricks documentation** (the pages behind each claim; checked 30 September 2026 by search results quoting the pages; to confirm on the pages on the day):

- dbt: "How we structure our dbt projects", with "Staging", "Intermediate" and "Marts" (docs.getdbt.com/best-practices/how-we-structure/1-guide-overview and the pages after it); "How we style our SQL" (docs.getdbt.com/best-practices/how-we-style/2-how-we-style-our-sql); "Materializations" (docs.getdbt.com/docs/build/materializations): view, table, incremental, ephemeral; "Configure incremental models" (docs.getdbt.com/docs/build/incremental-models), "About incremental strategy" (docs.getdbt.com/docs/build/incremental-strategy), `unique_key` (docs.getdbt.com/reference/resource-configs/unique_key), `--full-refresh` (docs.getdbt.com/reference/resource-configs/full_refresh); "Databricks configurations" (docs.getdbt.com/reference/resource-configs/databricks-configs): `liquid_clustered_by`, merge as the default strategy on Delta; "Model contracts" (docs.getdbt.com/docs/mesh/govern/model-contracts); "Model access" (docs.getdbt.com/docs/mesh/govern/model-access); "Unit tests" (docs.getdbt.com/docs/build/unit-tests); "Jinja and macros" (docs.getdbt.com/docs/build/jinja-macros); "Creating metrics" and "About MetricFlow" (docs.getdbt.com/docs/build/metrics-overview, docs.getdbt.com/docs/build/about-metricflow); `dbt show` (docs.getdbt.com/reference/commands/show).
- Databricks: "Use liquid clustering for tables" (docs.databricks.com/aws/en/delta/clustering); "MERGE INTO" (docs.databricks.com/aws/en/sql/language-manual/delta-merge-into); "Views" in Unity Catalog (docs.databricks.com/aws/en/views/).

**Historical sources.**

- Auguste Escoffier, *Le Guide culinaire* (1903); *Souvenirs inédits* (memoirs, published 1985; English as *Memories of My Life*, 1997).
- Kenneth James, *Escoffier: The King of Chefs* (Hambledon, 2002): the Savoy from 1890; the dismissal of Ritz, Echenard and Escoffier on 8 March 1898.
- The Savoy, "History" pages (thesavoylondon.com); Famous Hotels, "Kitchen revolt at the Savoy" (famoushotels.org), on the 1898 dismissal.
- Checked 30 September 2026 by web search (encyclopaedia pages couldn't be fetched from the build machine): at the Savoy 1890 to 1898; the brigade codified, not invented; *Le Guide culinaire* in 1903. Some sources give 1899 for the end at the Savoy; the film says "the 1890s", which holds either way.

## Labs

| # | Lab | Kind | The mechanism people break |
|---|---|---|---|
| 1 | *Which layer?* | sort | Ten pieces of logic into the four layers: trim an email; rename `customer_email` to `email`; add the readable key and its hash; match a platform account to a student; stitch three timelines; apply the credit rule; the award, with one source; a wide row for the wallet app; one row per learner per award as at census; a count by faculty (a macro, above the marts). Drop "match two keys" into staging and the picture shows the join hiding inside a tidy-up step; drop the credit rule into a mart and a second mart computes it differently. |
| 2 | *Refactor the CTEs* | steps | A jumbled `mart_planning__near_award`: its CTEs out of order, one called `cte2`, one `ref()` buried in a join. Step it into import → logical → final: the buried reference moves to the top, `cte2` is renamed for what it holds (`learners_at_census`), and the final select lists every column in the contract's order. Leave a `ref()` in the middle and the outline shows an input nobody sees at the top. |
| 3 | *View, table or incremental?* | pick | Five models with their size and use shown: a staging model read only by the next step; `int_learner_timeline`, which an agent queries while drafting; `core_learner`, read by both marts all day; `core_credential`, large in a real university and mostly unchanged between runs; the wallet's mart, read by an app. Pick a way to store them (all views, all tables, all incremental, the steps ephemeral, or the project's choice) and six checks show what it gets right; all incremental shows the extra logic for no gain; change the credit rule without `--full-refresh` and old rows keep the old logic. |
| 4 | *One rule, twice* | count | Graduate certificate learners as at census, grouped by status and points left: tick the ones each count includes. The rule, written once (var at 15), counts 12, as the census report does. With the var at 10, the mart, the macro and the metric move together (1), and the reconciliation fails, as it should. A dashboard's own copy of the filter, `points left <= 15`, counts 16 (it forgot "more than nothing left" and "still studying"), still says 16 with the var at 10, and the reconciliation can't see it: it only checks the mart. |

## Scenarios

Eight situations, in this order.

1. **Spot the problem.** A staging model joins the student system to the learning platform "to save a step". (A join is a matching rule, hidden where nobody looks for one. Staging tidies one table; matching belongs in intermediate, named and tested.)
2. **Choose.** The wallet's mart needs credit by award, and Planning's mart already has it. Ref Planning's mart, or the core? (The core. A mart built on another mart inherits its day (as at census) and its changes; dbt allows it in one project, so review has to stop it.)
3. **Spot the problem.** A reviewer finds CTEs called `cte1`, `cte2` and `final_final`. (Name each for what it holds; a reader should know what a CTE contains without reading its SQL.)
4. **Choose.** The credit rule changed last week; the incremental credential table still shows the old status for older rows. What now? (Rebuild it in full, `--full-refresh`, and compare with a full build. Incremental runs only touch rows the filter selects.)
5. **Spot the problem.** The wallet's mart computes credit towards an award with its own `sum`, and its number differs from Planning's by one learner. (The rule lives once, in intermediate and the core; a mart reads it, it doesn't recompute it.)
6. **Choose.** Someone makes every intermediate model ephemeral "to save space". (Views already store nothing; ephemeral steps can't be queried by the agent or a person, and unit tests must mock them as SQL. Keep them views unless there's a reason.)
7. **Choose.** `core_award` reads `stg_student_system__awards` directly; a colleague wants `int_awards`, so every core model has a step. Which reason would earn one? (A second source of awards, award codes to match across systems, or an award rule that needs a unit test. Not "every entity needs one", nor a symmetrical lineage graph: only work earns a step.)
8. **Order.** A `sum` of credit points returns a type the contract refuses, and the build stops. Put Jun's moves in order: read the contract error; find the column and the type the contract promises; cast the sum to that type, where it's computed (`sum` on DuckDB returns a 128-bit integer); rebuild the model and the ones that depend on it; check the reconciliation still passes. Never change the contract to match the code.

## Decisions taken

| Date | Decision |
|---|---|
| 7 October 2026 | The series now groups its ten steps into four phases (ask, promise, build, keep), which the opening film introduces. This film's step label names its phase: "Build · step 6 · in layers". |
| 30 September 2026 | Open in the 1890s in Escoffier's kitchen at the Savoy: stations with one job each, and a pass. "Ran his kitchen as a brigade", not "invented". |
| 30 September 2026 | The tests at the start are the real test names, drawn grey (not run: with no model, dbt skips them) and red only once the agent's first draft exists; the rigour sheet says the run is green. |
| 1 October 2026 | After review: the opening trimmed to about 26 seconds and its bridge names the credential; the marts "each built for one consumer" (the wallet has two); staging named with the steps as views; the last chapter renamed *Metrics once* (the proposal's name), so it doesn't echo the series' last film. |
| 30 September 2026 | The film says the semantic layer's metric "counts the same column" rather than "is the same macro": the rule is written once, and the count has one expression for SQL and one for BI, both checked to give 12. |
| 30 September 2026 | "Run it twice, and the second run merges nothing" is from a real second run, not assumed. |
| 30 September 2026 | The setup-is-real lines stay in *Start from a question*; this film carries only the on-screen label, `runs on dbt Core · DuckDB`, and one dim `Databricks · dbt Cloud` tag on the clustering line. |
| 1 October 2026 | Series read-through: *Staging* opens on "Now the code has to pass them" (the film before ends with the tests waiting for the code). CTE is defined in words where the narration first uses it; the semantic layer is introduced as where the dashboards' metric is defined. *Marts* says each mart's shape (long and narrow; wide) instead of repeating the grains a third time. The opening line starts "At the Savoy hotel". |
| 6 October 2026 | The example project was reorganised by application, data and business domains (sources and staging by source system; intermediate and core by data domain, `student` and `course`; the marts by consumer, `planning` and `wallet`), so each domain is ready to split into a project of its own. The film's cards show the files as they are now: `models/core/course/core_award.sql`, `models/core/student/core_credential_v2.sql`, `macros/planning/near_award.sql`, `models/marts/planning/_planning__semantic.yml`, and `…/student/_core_student__models.yml` in the contract scenario's picture. No narration line changed. The script's layers table now matches the card (no Folder column), and each chapter, lab and scenario links the project files it shows. |

## Open

1. **Voice.** Check "oh-goost" (Auguste), "ess-coff-ee-ay" (it may be read letter by letter or with stray stops; try "ess-koff-yay" if so), "see tee ee(s)", "sequel" and "the Savoy" by ear; test names, file names and `cte2` stay on screen only (the narration says "CTE two").
2. **Length.** 574 words, about 4:36: within the range, and one of the shorter films; *Intermediate* is the thinnest chapter (28 s). If the voiced cut runs short, a line on the credit rule's unit test belongs there.
3. **The cooks.** Draw the Savoy kitchen with care (PLAYBOOK 4): whites and toques of the 1890s, copper, a coal range; no modern kit.
4. **For the author.** `skills/draft-a-model/SKILL.md` step 3 ("Run it and watch it fail") comes before step 4 writes the SQL; with no model, dbt warns, skips the tests and selects nothing, so nothing fails. A first draft or a stub has to exist first. The previous film's hand-off ("Run them now, and they fail: there are no models yet") makes the same claim. Neither is this film's to change.
