# In the weeds of data crafting · An agent on the team: script

*The script of An agent on the team, from In the weeds of data crafting, a technical series for analytics engineers, as planned: about 5:15 (target 4 to 6 minutes), in eight chapters, in English, 30 September 2026. The narration lives in [`source/src/narration.js`](source/src/narration.js) and the pauses in [`source/src/breath.js`](source/src/breath.js); this page and those files say the same thing, and where they differ, the source wins. The timings are the voiced ones, from the pacing report (`tools/pace.py`, 6 October 2026: 5:26, 684 words). Takes steps 7 and 8 of Jun's ten, validate and review and ship, and gathers what an agent needs at every step.*

## The promise

A practitioner follows every line, and a data architect agrees with it. An AI agent can read a dbt project, run it, profile the sources, draft models and tests, and reconcile the answer, in minutes. To be trusted, it needs what a new colleague needs, written down in the project: a page of rules for agents, a skill file for each job it does, and the process with who approves each step. It works with least access: its own service principal, reading the sources, the core and the marts, writing only to its own development schemas, with counts and small samples rather than personal data. Every claim it makes carries the query and the result behind it. It never weakens a test to make it pass: a failing test is news, reported with its failing rows, and a person decides what's wrong. Before sign-off, the answer is reconciled with the number people trust and diffed against main, built from scratch; CI builds and checks every change; and people approve: the engineer the code, the architect the model, the consumer its number. **The agent drafts and checks, with evidence. People approve.**

## The story in one paragraph

In 1766, Nevil Maskelyne, the Astronomer Royal, published the first Nautical Almanac, for 1767: tables that let a navigator find longitude at sea. He didn't compute them himself; he posted written instructions to computers, people working at home across England, and had every month computed twice, by two computers far apart, with a comparer checking one against the other before anything was printed. The work was delegated, and the check was built in. Jun has had a computer on the team all along: an AI agent, and a fast one, drafting and profiling since the question. This film looks at how it's trusted. It reads `AGENTS.md` first, then five skills, one file each, and the process table that says, for each step, the agent's part and who approves it. The work itself is tracked in the team's backlog tool, which the agent can read; in the project, only what's still open is written down, in `requirements/`, and it's deleted once it's done. On Databricks it works as its own service principal, reading the sources, the core and the marts and writing only to its own development schemas, with counts and samples, never bulk personal data. Every claim it makes comes with its query and result, as the earlier films showed (4 of 42 platform accounts have no student ID; two learners share an email in two systems; one withdrawal was recorded seven days late), now a rule in its page; and where rules can't decide, it asks Mei, who records a decision. Then it tidies the learner's timeline, dating every version, start and end, by when it was recorded, and one test fails: the census reconciliation, Business 4 against 3, because a withdrawal recorded late now looks like a learner still studying on census day. The agent's draft sets the test to warn, and the build passes. Jun's review of the draft pull request stops it: `AGENTS.md` says never weaken a test to make it pass. The fix puts back the dates each change took effect, and Business is 3 again. Before sign-off, two checks: the reconciliation, every faculty with a difference of zero, and a diff against main, built from scratch because an incremental table would hide a change in logic: in Planning's mart the shortcut changed one learner's row, and in the core 55 versions moved; with the fix, the diff is empty. The agent marks its pull request ready for review, with its evidence; CI builds the project on DuckDB, checks the generated docs and the metric, and parses it for Databricks; on dbt Cloud a CI job builds only what changed. Jun approves the code, Noor the model, Planning its number. The agent recommends; people approve. It's merged, and the agent's review of the metadata, in the project and beyond it, finds the definition of an award in four places (the wiki, a YAML description, the catalog and a dashboard's tooltip), three of them wrong.

## What each object stands for

| Object | Stands for |
|---|---|
| "1766 · England"; an almanac page of figures | The Nautical Almanac: tables computed in advance for every day |
| A folded sheet of instructions posted two ways across a map of England | Written instructions for computers working at home: the first skill files |
| Two quills far apart, one at each edge of the frame | Two computers working the same month independently |
| A comparer's desk; one figure that differs, circled in pencil | A check designed into the work: disagreement found before printing |
| A printing press taking the checked page | Shipping only what was checked |
| The teal orb (from *Keeping it true*) beside Jun | The AI agent on the team |
| `AGENTS.md` opening like a door, with five skill files fanned beside it | What's written down for agents |
| The process table, two columns lit: the agent's part (teal), who approves (gold) | Every step: the agent helps, a person approves |
| Two chips under the process table, "the backlog tool · who, when, how big" and "requirements/ · only what's still open", and a tag, "deleted once it's done" | The work, tracked in the team's backlog tool; in the project, only what's still open, and only while it's open |
| The orb holding a key card, "service principal", opening three doors and a small wing of its own | Least access: reads the sources, core and marts; writes its own development schemas |
| A glass wall with counts passing through it, rows of names staying behind | Aggregates and small samples; personal data stays in the database |
| A claim card, clipped to its query and its result row | Evidence |
| Mei's gold tick on a decision row | What rules can't decide, decided by the owner |
| A red test row, `FAIL 1`, Business 4 against 3 | A failing test: news |
| One diff line, `+ severity: warn`, amber, then struck through in red | The shortcut: weakening a test to pass it, stopped in review |
| A scale with the mart on one side and the census report on the other, level | Reconciliation with the trusted number |
| Two builds side by side, main and the branch, compared key by key | The diff against main |
| A draft pull request card, marked ready, with an evidence section; CI checks landing one by one | Review and ship |
| Gold ticks from Jun, Noor and Planning; none from the orb | People approve |
| One definition, four places, three drifting | The next film: written once |

## Script

### 1 · Computed twice · 0:00–0:42

**Narration.** In 1766, Nevil Maskelyne, the Astronomer Royal, published the first Nautical Almanac: tables for finding longitude at sea. He didn't compute them himself. He posted instructions to computers: people working at home, across England. Every month was computed twice, by two computers far apart. A comparer checked one against the other, before anything was printed. Jun has had a computer on the team all along: an AI agent, and a fast one. The checking has to be built in.

**Picture.** The warm past, with "1766 · England" in the corner. An almanac page draws itself, column by column: dates down the side, figures across, the Moon's small glyph at the head. On "instructions", a folded sheet leaves a desk at Greenwich and splits in two on a map of England, one copy travelling far west, one far north (paper passed). On "twice", two quills at the two edges of the frame write the same column, each in its own hand (the two quills, panned hard left and right). On "comparer", both sheets slide to a desk in the middle; a pencil runs down both columns and stops at one figure that differs: it's circled (the comparer's pencil mark, a low paper tick); one sheet's figure is corrected. The page goes under a press. On the bridge line, the comparer's desk drifts right, towards the present, and becomes Jun's desk; the teal orb settles beside it. Wordless breather: the title card over the two sheets and the printed page, with the series' mark (on a warm analogue synth): "IN THE WEEDS OF DATA CRAFTING", *An agent on the team*, "the agent drafts and checks; people approve".

**On screen.** 1766 · England · the Nautical Almanac · longitude at sea · instructions, by post · computers, at home · computed twice · far apart · the comparer · checked before printing · a computer on the team, all along: an AI agent · build the checking in · *An agent on the team* · the agent drafts and checks; people approve

### 2 · Written down · 0:42–1:36

**Narration.** The agent can read the whole project, run dbt, and draft changes on a branch. Before any of that, it reads one page, written for agents. What it may do, and what it must not. Beside it, five skills, one file each: draft the conceptual model, profile a source, draft a model, reconcile and diff, review the metadata. And the process: for each of the ten steps, the agent's part, and who approves it. The work itself is tracked in the team's backlog tool, which the agent can read. In the project, only what's still open is written down, and it's deleted once it's done. Files in the project, not a long prompt. Versioned, reviewed, and read the same way by people and by agents.

**Picture.** The orb over the lineage graph from the films before, the project box around it. On "reads one page", a file opens, with the label `runs on dbt Core · DuckDB` beside its name:

```markdown
<!-- AGENTS.md · runs on dbt Core · DuckDB -->
# Working here as an AI agent

This project builds the university's credential model with dbt. An agent is welcome to help at
every step: profiling sources, drafting models and tests, reconciling, reviewing metadata. At
every step, a person approves. This page says what an agent may and may not do.

## Read first

- [`docs/process.md`](docs/process.md): the ten steps, what each produces, your part in it, and who approves it.
…
- [`skills/`](skills/): how to do the five jobs agents do most here: …
```

On "five skills", five small files fan out beside it, each named as it's voiced (`draft-the-conceptual-model`, `profile-a-source`, `draft-a-model`, `reconcile-and-diff`, `review-metadata`); two open far enough to show their heads:

```markdown
<!-- skills/draft-a-model/SKILL.md · runs on dbt Core · DuckDB -->
---
name: draft-a-model
description: Draft a dbt model to pass the tests and contract written for it first. Use when a
  model's grain, contract and tests exist, or should, and the SQL doesn't yet.
---
```

```markdown
<!-- skills/reconcile-and-diff/SKILL.md · runs on dbt Core · DuckDB -->
---
name: reconcile-and-diff
description: Validate a change before sign-off, by reconciling with the census report and
  diffing against the previous version. …
---
```

On "the process", the process table, three columns of it (step, the agent's part, who approves), ten rows; the "agent's part" column lights teal, "who approves" gold, row by row. The rows for steps 7 and 8 stay lit:

```markdown
<!-- docs/process.md · runs on dbt Core · DuckDB -->
| # | Step | … | The agent's part | Who approves |
| 7 | **Validate.** … | … | Runs them (`skills/reconcile-and-diff/`) | Jun Park and the owner |
| 8 | **Review and ship.** … | … | Opens the pull request | A reviewer, never the agent |
```

On "backlog tool", a chip slides in under the table: "the backlog tool · who, when, how big". On "still open", a second chip beside it: "requirements/ · only what's still open"; on "deleted", a small tag under it, "deleted once it's done". Both chips go as the next line begins.

On "not a long prompt", a long scroll of text beside the orb fades; the files stay, each with a small version tag and a reviewer's tick (a soft pad swell).

**On screen.** read the project · run dbt · draft on a branch · AGENTS.md · may · must not · five skills · one file each · the process · the agent's part · who approves · the backlog tool · who, when, how big · requirements/ · only what's still open · deleted once it's done · files, not a prompt · versioned · reviewed · shared by people and agents

**In the repo.** [`AGENTS.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/AGENTS.md) · [`skills/draft-a-model/SKILL.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/skills/draft-a-model/SKILL.md) · [`skills/reconcile-and-diff/SKILL.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/skills/reconcile-and-diff/SKILL.md) · [`docs/process.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/docs/process.md) · [`requirements/`](https://github.com/roanboc/learning-data/tree/main/films/analytics-engineering/project/requirements/)

### 3 · Least access · 1:36–2:05

**Narration.** On Databricks, the agent works as its own service principal, never as a person. It reads the sources, and the core and the marts in production. It writes only to its own development schemas. It works with counts and small samples. Names, emails and student IDs stay in the database. Whatever it gets wrong stays where nobody else reads it.

**Picture.** The catalog's tables as doors (from the film before). The orb takes a key card, "service principal", not a person's badge. On "reads", three doors open for it, sources, core and marts, drawn read-only (a thin line, no pen); on "writes", a small wing of its own opens, "development schemas", one room per layer. The grants, with their label (copied from `AGENTS.md` once its grants are corrected; see the rigour sheet and Open 5):

```sql
-- AGENTS.md · Databricks only
grant use catalog on catalog <production catalog> to `<agent service principal>`;
grant use schema, select on schema <production catalog>.<schema>_core to `<agent service principal>`;
grant use schema, select on schema <production catalog>.<schema>_marts to `<agent service principal>`;
grant all privileges on schema <development catalog>.<agent's schema> to `<agent service principal>`;
```

On "counts and small samples", a glass wall at the database's edge: counts pass through it as small numbers; rows of names and emails stay behind, blurred. One line from the must-nots lights:

```markdown
<!-- AGENTS.md · runs on dbt Core · DuckDB -->
- **Pull bulk personal data.** Work with aggregates and small samples (`dbt show --limit 20`).
  Never copy names, emails or student IDs out of the project, into a prompt, a log or a pull
  request, beyond the sample a claim needs.
```

On "gets wrong", a red scribble appears in the orb's small room, and stays there; the production doors don't flicker.

**On screen.** service principal · never a person · reads: sources, core, marts · writes: its own development schemas · Databricks only · counts · small samples · personal data stays in the database · mistakes stay in its own room

**In the repo.** [`AGENTS.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/AGENTS.md)

### 4 · Evidence · 2:05–2:43

**Narration.** Every claim the agent makes about the data comes with the query that shows it, and the result. You've seen its claims already: accounts with no student ID, a shared family email, a withdrawal recorded a week late. Now that habit is a rule, written in the agent's page, with an example to copy. Where rules can't decide, like that shared email, the agent doesn't guess. It asks Mei, and she records a decision. A claim that arrives without its query goes back, unread.

**Picture.** The three evidence cards from the earlier films return, small, in a row (one from the profiling of the sources, two from the films that followed). On "a rule", `AGENTS.md` opens at its "Evidence" section, and its example clips itself together: a claim card, teal, a query card and a result row (the evidence card's soft pad swell):

```markdown
<!-- AGENTS.md · runs on dbt Core · DuckDB -->
> 4 of 42 current learning platform accounts have no student ID.
> `dbt show --select profile_null_keys --profiles-dir .` → `learning_platform.users | student_id | 42 | 4`

A claim without its query is a guess, and reviewers treat it as one.
```

The two other cards stack beside it, each with its query's name and the real row:

```
-- dbt show · runs on dbt Core · DuckDB
profile_shared_emails   student_system    | nguyen.family@mai… | 2
                        learning_platform | nguyen.family@mai… | 2
profile_late_changes    S-20431 | WD | 2026-03-27 | 2026-04-03 | 7
```

On "rules can't decide", the shared-email card turns towards Mei (business outline); she reads it, and a decision row types in, with her gold tick (a low stamp); a small tag under its key, "SC: short courses", says which system that row comes from, a third one with the same email:

```csv
# seeds/reference/student/learner_identity_decisions.csv · runs on dbt Core · DuckDB
decision_id,qualified_key,decision,other_qualified_key,decided_by,decided_on,…
D-001,SC|nguyen.family@mai…,same,SIS|S-20436,"Mei Tanaka, registrar's office",2026-10-06,…
```

On "without its query", a fourth card, "emails are unique", arrives with no query clipped to it; it greys out and slides back to the orb. The line from `AGENTS.md` lights: "A claim without its query is a guess, and reviewers treat it as one."

**On screen.** claim · query · result · seen before · 4 of 42 · no student ID · one email, two learners, two systems · recorded 7 days late · now a rule · AGENTS.md · rules can't decide · short courses: the same email · Mei decides · D-001 · no query: sent back

**In the repo.** [`AGENTS.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/AGENTS.md) · [`seeds/reference/student/learner_identity_decisions.csv`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/seeds/reference/student/learner_identity_decisions.csv)

### 5 · The shortcut · 2:43–3:37

**Narration.** Then the agent tidies the learner's timeline. To keep it simple, it dates every version the same way: by when it was recorded. One test fails: the census reconciliation. Business counts four learners. The report says three. The withdrawal recorded seven days late now looks like a learner still studying on census day. The agent's draft sets the test to warn. The build passes. Jun's review of the draft stops it. The rule is written down: never weaken a test to make it pass. A failing test is news. Report it, with its failing rows, and let a person decide what's wrong. The fix puts back the date each change took effect. Business: three. Green.

**Picture.** The timeline's model opens at the student system's versions; the lines that date them light, with their comment:

```sql
-- models/intermediate/student/int_learner_timeline.sql · runs on dbt Core · DuckDB
-- the student system says when each version took effect: that date, not the date it was recorded
student_versions as (
    select
        …
        student_records.effective_date as valid_from,
        coalesce(
            lead(student_records.effective_date) over (
                …
            ),
            …
        ) as valid_to,
```

On "by when it was recorded", the teal orb rewrites both dates in a diff, labelled "the agent's draft · never merged": the start and the end of each version now come from the recording dates, the platforms' rule:

```diff
# models/intermediate/student/int_learner_timeline.sql · the agent's draft · never merged
-        student_records.effective_date as valid_from,
-        coalesce(
-            lead(student_records.effective_date) over (
-            …
-        ) as valid_to,
+        cast(student_records.recorded_from as date) as valid_from,
+        cast(student_records.recorded_to as date) as valid_to,
```

The build runs; test rows scroll green, then one row goes red (a muted double knock):

```
-- dbt build · runs on dbt Core · DuckDB
FAIL 1 reconcile_planning_with_census_report
faculty_code | in_the_mart | in_the_census_report
BUS          |           4 |                    3
```

On "seven days late", a small calendar: 27 March (took effect) and 3 April (recorded), census day 31 March between them; one learner's marker slides from "withdrawn" to "studying" across the census line (Priya, shown by key only).

On "sets the test to warn", a second diff arrives, in the test's YAML, labelled "the agent's draft · never merged":

```diff
# tests/reconciliation/_reconciliation__tests.yml · the agent's draft · never merged
   - name: reconcile_planning_with_census_report
     …
     config:
       meta: {owner: Planning}
+      severity: warn
```

The red row turns amber, `WARN 1`, and the build's last line reads `ERROR=0`. The key tone turns minor. On "Jun's review of the draft stops it", Jun's hand on the draft pull request (grey "Draft" tag): a comment, and the added line is struck through in red. The rule lights in `AGENTS.md`:

```markdown
<!-- AGENTS.md · runs on dbt Core · DuckDB -->
- **Weaken a test to make it pass.** Don't delete, disable or skip a test, lower its severity,
  raise its thresholds, or narrow it with a `where`. A failing test is news: report it, with its
  failing rows, and propose a fix to the data or the code.
```

and, beside it, the test's own description, the owner's words:

```yaml
# tests/reconciliation/_reconciliation__tests.yml · runs on dbt Core · DuckDB
  - name: reconcile_planning_with_census_report
    description: >
      The Planning mart gives the census team's published number, faculty by faculty. If it
      doesn't, the mart is wrong or the report is; either way, nobody ships until someone knows
      which. …
    config:
      meta: {owner: Planning}
```

On "the fix", both lines return: `student_records.effective_date as valid_from`, and the `coalesce(lead(…))` block as `valid_to`; the build runs; the red row turns green, `PASS reconcile_planning_with_census_report`, Business 3 (a low felt note, rising).

**On screen.** tidy the timeline · one date for every version: when it was recorded · FAIL 1 · reconciliation · Business 4 · report 3 · took effect 27 Mar · recorded 3 Apr · census 31 Mar · severity: warn · the agent's draft · never merged · draft pull request · review stops it · never weaken a test to make it pass · a failing test is news · the fix: when each change took effect · Business 3 · PASS

**In the repo.** [`models/intermediate/student/int_learner_timeline.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/intermediate/student/int_learner_timeline.sql) · [`tests/reconciliation/_reconciliation__tests.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/tests/reconciliation/_reconciliation__tests.yml) · [`AGENTS.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/AGENTS.md)

### 6 · Reconcile and diff · 3:37–4:16

**Narration.** Before anyone signs off, two checks. Reconcile: every faculty against the census report. Two, three, five and two. The difference is zero, everywhere. Diff: build main, then the branch from scratch, and compare them key by key. Counts only; no personal data leaves. From scratch, because the credential table is incremental, and would hide a change in logic. In Planning's mart, the shortcut changed one learner's row. In the core, fifty-five versions moved. With the fix, the diff is empty.

**Picture.** A scale: Planning's mart on one pan, the census report on the other. The reconciliation types in, row by row; each row's difference lands on zero and the scale levels (a soft knock per row):

```
-- dbt show --select reconcile_census_report · runs on dbt Core · DuckDB
census_date | faculty_name               | in_the_mart | in_the_census_report | difference
2026-03-31  | Faculty of Arts and Educ…  |           2 |                    2 |          0
2026-03-31  | Faculty of Business        |           3 |                    3 |          0
2026-03-31  | Faculty of Engineering a…  |           5 |                    5 |          0
2026-03-31  | Faculty of Health          |           2 |                    2 |          0
```

On "Diff", two builds side by side, main and the branch; the skill's steps:

````markdown
<!-- skills/reconcile-and-diff/SKILL.md · runs on dbt Core · DuckDB -->
1. Build the main branch, and keep its database; then build your branch with `--full-refresh`:
   ```sh
   git switch main && dbt build --profiles-dir . && cp target/credentials.duckdb target/main.duckdb
   git switch - && dbt build --full-refresh --profiles-dir .
   ```
   `--full-refresh` matters: `core_credential` is incremental, so a plain build merges only
   credentials whose source rows changed, and a change to the logic never reaches the rows
   already built. The diff would say nothing changed.
````

On "from scratch", the incremental credential table is drawn as a stack that only takes new rows at the top; a changed rule slides past the old rows without touching them, until `--full-refresh` rebuilds the whole stack. On "the shortcut changed", two outputs of `scripts/tools/diff_against_main.py`, side by side, Planning's mart first:

```
-- scripts/tools/diff_against_main.py · runs on dbt Core · DuckDB
the shortcut                                       the fix
dev_marts.mart_planning__near_award,               dev_marts.mart_planning__near_award,
  by learner_award_key                               by learner_award_key
  keys only in this branch: 0                        keys only in this branch: 0
  keys only in main:        0                        keys only in main:        0
  learner_status: 1 rows changed
  is_near_award: 1 rows changed
```

On "in the core", a second pair slides under it, for the core's learner versions:

```
-- scripts/tools/diff_against_main.py · runs on dbt Core · DuckDB
the shortcut                                       the fix
dev_core.core_learner_v1,                          dev_core.core_learner_v1,
  by learner_key,valid_from                          by learner_key,valid_from
  keys only in this branch: 55                       keys only in this branch: 0
  keys only in main:        55                       keys only in main:        0
  valid_to: 38 rows changed
```

On "the diff is empty", the right-hand column, the fix, settles: no key on one side only, no column changed; the branch matches main again.

**On screen.** two checks before sign-off · reconcile · the census report · 2 · 3 · 5 · 2 · difference 0 · diff · main · the branch · --full-refresh · key by key · counts only · incremental hides a change in logic · the mart: 1 row changed · the core: 55 versions moved · the fix: the diff is empty

**In the repo.** [`skills/reconcile-and-diff/SKILL.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/skills/reconcile-and-diff/SKILL.md) · [`scripts/tools/diff_against_main.py`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/scripts/tools/diff_against_main.py)

### 7 · Review and ship · 4:16–5:04

**Narration.** The agent marks its pull request ready for review: what it changed, why, what it checked, and the evidence. CI, the checks that run on every pull request, builds the project on DuckDB. It checks that the generated docs are current, and that the metric still gives the census number. It parses the project for Databricks too. On dbt Cloud, a CI job builds only what changed, and what depends on it. Then people. Jun approves the code. Noor signs off the model, and Planning its number. The agent never merges or approves its own work. The agent recommends; people approve.

**Picture.** The draft pull request from chapter 5, drawn in teal, loses its grey "Draft" tag and turns "Ready for review"; it fills in four headings as they're voiced (changed · why · checked · evidence); the evidence section holds the reconciliation table and the diff summary from chapter 6, as small cards. On "CI", the checks land one by one, each with a soft knock as it appears (not a rhythm), from the workflow:

```yaml
# .github/workflows/credential-project.yml · runs on dbt Core · DuckDB
      - name: Build and test on DuckDB
        run: dbt build --profiles-dir .

      - name: Doc blocks and key sets match the conceptual model
        run: python scripts/generate/definitions.py --check

      - name: Physical diagram matches the YAML
        run: python scripts/generate/diagrams.py --check

      …

      - name: The metric gives the census report's number
        run: |
          …
          python scripts/check/check_metric.py
```

A fifth check, "Parse for Databricks", joins them. On "dbt Cloud", a second label slides in, dim, `Databricks · dbt Cloud`, with the README's line; the lineage graph lights only the changed timeline model and what depends on it:

```markdown
<!-- README.md · runs on dbt Core · DuckDB -->
… With dbt Cloud, a CI job does the same, and builds only the changed models
and what depends on them:
`dbt build --select state:modified+ --defer --state <production artifacts>`,
where the artifacts are the `manifest.json` of the last production run.
```

On "Then people", three gold ticks land in turn (the gold stamp's thud, once for all three): Jun on the code, Noor on the model, Planning on its number. The orb reaches towards the merge button; the button stays grey for it. The table of who approves what lights its last line:

```markdown
<!-- AGENTS.md · runs on dbt Core · DuckDB -->
| Change | Approves |
|---|---|
| Meaning: a definition, a key, an identity rule, a business rule | Mei Tanaka, … |
| The model: grain, entities, relationships, versions | Noor, data architect |
| The code: models, tests, macros | Jun Park, analytics engineer, in review |
| A consumer contract | Its consumer: Planning, or the wallet app team |

The agent recommends; people approve.
```

Jun presses merge.

**On screen.** ready for review · what changed · why · what was checked · evidence · CI · build on DuckDB · docs current · diagram current · the metric: the census number · parse for Databricks · dbt Cloud: only what changed · state:modified+ · Jun: the code · Noor: the model · Planning: its number · the agent never merges · the agent recommends; people approve

**In the repo.** [`scripts/tools/diff_against_main.py`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/scripts/tools/diff_against_main.py) · [`README.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/README.md) · [`AGENTS.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/AGENTS.md)

### 8 · The same words, four places · 5:04–5:26

**Narration.** It's merged, tested and signed off. Then the agent reviews the metadata, in the project and beyond it, and finds something no test checks. The definition of an award now lives in four places. And three of them are wrong.

**Picture.** The merged pull request folds into the lineage graph, all green; the loop of ten steps, small in a corner, with stations 7 and 8 lit, a teal dot and a gold tick at each. The orb opens its fifth skill, and its reach widens past the project's box, to the wiki, the catalog and the dashboards, drawn read-only:

```markdown
<!-- skills/review-metadata/SKILL.md · runs on dbt Core · DuckDB -->
---
name: review-metadata
description: Review the project's YAML and Markdown for facts written twice, drifted copies and
  missing metadata. …
---
```

On "four places", four small cards drift apart around the graph, each holding a sentence that begins "An award is…", each tagged as the next film tags it: the wiki, a YAML description, the catalog, a dashboard's tooltip. On "three of them are wrong", three of the cards' words shift slightly, drawn "as it drifts"; one stays steady. Wordless end card: *An agent on the team* · "The agent drafts and checks, with evidence. People approve." · In the weeds of data crafting.

**On screen.** merged · tested · signed off · review the metadata · in the project and beyond · something no test checks · award · four places · three wrong · *An agent on the team* · The agent drafts and checks, with evidence. People approve.

**In the repo.** [`skills/review-metadata/SKILL.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/skills/review-metadata/SKILL.md)

## Pause and think

Four stops, one question each.

| After | Question | Answer, in short |
|---|---|---|
| 2 · Written down (`skills`) | Why keep the agent's rules and skills as files in the project, not in a long prompt? | Files are versioned, reviewed in pull requests like code, and read the same way by every person and every agent. A prompt lives in one session and changes without anyone seeing it. |
| 4 · Evidence (`evidence`) | What turns a claim about the data into a guess? | No query and no result beside it. A reviewer can rerun a query; they can't rerun a sentence. |
| 5 · The shortcut (`shortcut`) | The reconciliation failed. Whose decision is it to change what the test expects? | The test's owner's (Planning, in its `meta`), with the reason written down, and never the agent's. Here the expectation was right and the code was wrong. |
| 7 · Review and ship (`ship`) | CI is green. Why does a person still approve? | CI checks what someone thought to write down. A person checks what the change means: whether the diff was expected, whether the model still says what was agreed, and whether the right owner signed off. |

## Rigour sheet

| Chapter | What the film says | What an expert would add, or what it simplifies |
|---|---|---|
| 1 | In 1766, Nevil Maskelyne, the Astronomer Royal, published the first Nautical Almanac: tables for finding longitude at sea. | The first edition, *The Nautical Almanac and Astronomical Ephemeris for the Year 1767*, was published in 1766 by order of the Board of Longitude, with Maskelyne (Astronomer Royal from 1765) as its editor. Its main tables gave lunar distances (the Moon's angular distance from the Sun and chosen stars, every three hours), computed from Tobias Mayer's lunar tables, so a navigator could find Greenwich time, and so longitude, from an observation. The plan's label "1767" is the year the tables were for; the film says 1766, the year it was published. |
| 1 | He posted instructions to computers: people working at home, across England. | Computers worked part-time, at home, in towns and villages across England, paid by the month's work; Maskelyne sent the method as written instructions (Croarken calls them "precepts") and the work went back and forth by post. Many computers were clergymen, schoolmasters and surveyors; at least one was a woman, Mary Edwards, whose work was at first sent in her husband's name. The film names no computer. |
| 1 | Every month was computed twice, by two computers far apart; a comparer checked one against the other before printing. | Each month's tables went to two computers, who worked independently with the same method; a third person, the comparer, compared their results and resolved differences, and the pages were printed from the checked copy. Distance made copying unlikely. Richard Dunthorne was the first "Comparer of the Ephemeris and Corrector of the Proofs". Cases where computers were found to have copied each other are reported in the literature; the film doesn't tell one. |
| 1 | Jun has a computer on the team now. | The series' metaphor: "computer" was a job title for a person; the agent is software. The point carried over is the design: delegate the work, and build the check into it. |
| 2 | The agent can read the whole project, run dbt, and draft changes on a branch. | `AGENTS.md` 16-22 ("What you may do"). The agent in the story is a generic AI coding agent working in the repository; dbt Labs also offers its own AI features (dbt Copilot, in dbt Cloud's IDE, and the dbt MCP server, which gives AI tools governed access to a project's models, lineage and metrics) (checked by web search 30 September 2026; docs.getdbt.com/docs/dbt-ai/about-mcp). The film names none. |
| 2 | It reads one page written for agents; five skills, one file each; the process, with the agent's part and who approves. | `AGENTS.md` 1-14; `skills/*/SKILL.md` (five files, each with a `name` and `description` in its frontmatter, the format several agent tools read as "skills"); `docs/process.md` 12-23. `AGENTS.md` is a convention many coding agents read at a repository's root; the project uses it as the single page of rules. |
| 2 | The work itself is tracked in the team's backlog tool, which the agent can read. In the project, only what's still open is written down, and it's deleted once it's done. | `requirements/README.md` 3-13: "Not a backlog. The team's backlog tool tracks the work: who, when, how big"; an item links to it with `ticket` and carries no priority, estimate, assignee or sprint. Each item is `open` or `in_progress`; when it's done, what lasts moves to its home (a decision in its scope's log, `_<scope>__decisions.yml`; a known limitation in `meta.limitations`; the question in the mart's conceptual model; the test that enforces a requirement) and the item is deleted, its register too once empty; git keeps the history. `scripts/check/requirements.py`, run in CI, fails on anything else. `AGENTS.md` 13; `docs/conventions.md`, *File lifecycles*; DEC-PRJ-10 in `models/_shared/_shared__decisions.yml`. On 6 October 2026 two registers are open, `requirements/sources/learning_platform/` and `requirements/sources/student_system/`. The backlog tool isn't named; `AGENTS.md` 13 tells the agent the tool tracks the work and that it can read it (through a connector, say). |
| 2 | Files in the project, not a long prompt: versioned, reviewed. | They change by pull request, like the code, and CI runs on the project they describe. The skill files are instructions: an agent can still ignore them, which is why the checks in chapters 5 to 7 exist. |
| 3 | On Databricks, the agent works as its own service principal; reads the sources, the core and the marts; writes only to its own development schemas. | `AGENTS.md` 24-34. Schemas, plural: the project has no `generate_schema_name` override, so dbt's default builds each layer into `<target schema>_<custom schema>` (`dbt_project.yml` `+schema: staging`, `intermediate`, `core`, `marts`, `reference`; on DuckDB `dev_core`, `dev_marts`), and building a branch reads the sources (`DBT_SOURCES_CATALOG`, `<prefix>student_system`, `learning_platform`, `short_courses`). As written on 30 September 2026, and still on 6 October 2026, `AGENTS.md` 30-33 grants one development schema and no read on the sources, which would not let the agent build its branch or profile a source on Databricks; it needs, besides, `grant use catalog, create schema on catalog <development catalog>` (it then owns the schemas it creates) and `grant use schema, select` on each source schema in `<sources catalog>`. The film's narration says what the corrected grants do; the card copies `AGENTS.md` once those lines are added (Open 5). A service principal is Databricks' identity for automated tools, with its own grants in Unity Catalog; `USE CATALOG`, `USE SCHEMA`, `SELECT` and `ALL PRIVILEGES` are Unity Catalog privileges (docs.databricks.com/aws/en/admin/users-groups/service-principals; docs.databricks.com/aws/en/data-governance/unity-catalog/manage-privileges/privileges). On DuckDB, the development target is a local file (`target/credentials.duckdb`), so the grants apply only on Databricks: that card carries the label `Databricks only`, as in the film before. |
| 3 | Counts and small samples; names, emails and student IDs stay in the database. | `AGENTS.md` 43; the profiling queries (`analyses/profiling/`) return counts; `scripts/tools/diff_against_main.py` 10-11 prints counts only. What an AI tool may see is also a policy question (which data may leave the platform, under which agreement), beyond this project. |
| 4 | Every claim comes with its query and result; the claims seen in the earlier films (4 of 42; a shared family email; a withdrawal recorded a week late) are now a rule in the agent's page. | `AGENTS.md` 49-57. Run 30 September 2026 (dbt Core 1.12.5, dbt-duckdb 1.11.0): `profile_null_keys` → `learning_platform.users | student_id | 42 | 4`; `profile_shared_emails` → `nguyen.family@mail.example` with 2 keys in the student system and 2 on the learning platform; `profile_late_changes` → `S-20431 | WD | 2026-03-27 | 2026-04-03 | 7`. |
| 4 | Where rules can't decide, it asks Mei, and she records a decision. | `seeds/reference/student/learner_identity_decisions.csv` 1-2 (D-001, 6 October 2026, the story's date), under the rule that a person's recorded decision beats every matching rule (DEC-STU-04, in `models/core/student/_student__decisions.yml`, indexed in `docs/decisions.md`). The shared email is matched to Linh Nguyen by that decision; without D-001 and D-002, the census answer is 10, not 12 (the series plan's scratch run; LIM-PLN-01 on `mart_planning__near_award`, in `models/marts/planning/_planning__models.yml`). |
| 5 | The agent dates every version by when it was recorded; the reconciliation fails, Business 4 against 3. | Run 30 September 2026 on a scratch copy of the project: in `models/intermediate/student/int_learner_timeline.sql`, the student system's `valid_from` changed from `effective_date` to `cast(recorded_from as date)` and `valid_to` from the next effective date to `cast(recorded_to as date)` (the platforms' rule, lines 71-72). Both changes are needed, and the diff on screen shows both: with `valid_from` alone, the build passes (`PASS=143 WARN=1 ERROR=0`), because the withdrawn learner's earlier version still ends on 27 March and she falls into a gap on census day rather than counting as studying (reviewer's scratch run, 30 September 2026). `dbt build --vars '{as_is_date: 2026-09-30}'`: `PASS=142 WARN=1 ERROR=1`; the failing test returned `BUS | 4 | 3`; `reconcile_census_report` showed Business 4 against 3, difference 1, and 0 elsewhere. Not committed. Rerun on 6 October 2026 on the reorganised project: the same failing row, `PASS=143 WARN=1 ERROR=1`, as the film's build card draws (one test more than on 30 September: `tests/governance/models_do_not_read_expected_seeds.sql`). "To keep it simple" is the story's motive: the platforms can only be dated by when they recorded a change (DEC-SIS-02, in `sources/student_system/_student_system__decisions.yml`), so one rule for every source looks tidy, and is wrong for the one source that knows better. |
| 5 | The withdrawal recorded seven days late now looks like a learner still studying on census day. | Priya Nair (`SIS|S-20431`), withdrawn effective 27 March 2026, recorded 3 April; census 31 March. Dated by recording, her withdrawal starts after the census, so she counts as studying and near her award. The film shows her by key. The rule is Planning's, the wallet team's and Noor's decision of 8 October (DEC-PLN-02, in `models/marts/planning/_planning__decisions.yml`) and DEC-SIS-02, in `sources/student_system/_student_system__decisions.yml`. |
| 5 | The agent's draft sets the test to warn; the build passes. | The rejected line, `severity: warn` under the test's `config` in `tests/reconciliation/_reconciliation__tests.yml`, is the only line in the series that isn't in the project, because it was never merged: it is drawn in a diff, labelled "the agent's draft · never merged". Run on the same scratch copy with that line: the test reports `WARN 1`, and the build ends `PASS=142 WARN=2 ERROR=0` (`PASS=143 WARN=2 ERROR=0` rerun on 6 October 2026, as the card draws), so a pipeline that stops only on errors carries on. dbt's `severity` config (`error` by default, or `warn`), with `warn_if` and `error_if` (docs.getdbt.com/reference/resource-configs/severity). |
| 5 | The rule is written down: never weaken a test to make it pass; report it, with its failing rows. | `AGENTS.md` 44; `skills/draft-a-model/SKILL.md` 27-31 ("Stop and report it … A person decides whether the data, the code or the expectation is wrong"); the test's description, `tests/reconciliation/_reconciliation__tests.yml` 3-11, and its owner, Planning. Failing rows can be kept with `store_failures` or read from the test's compiled query; the skill uses `dbt show` on the compiled query, with a limit. |
| 5 | The fix puts back the effective dates; Business 3; green. | The project as it stands, on 6 October 2026 (dbt Core 1.12.5, dbt-duckdb 1.11.0): `dbt build --profiles-dir . --vars '{as_is_date: 2026-09-30}'` → `PASS=144 WARN=1 ERROR=0`, 147 nodes (the one warning is by design: LIM-SC-02 on the `short_courses` source and DEC-SC-01, `AGENTS.md` 62). The film's build card draws the same. |
| 6 | Reconcile: every faculty, 2, 3, 5 and 2; difference zero. | `analyses/validation/reconcile_census_report.sql`, run 30 September 2026: Arts and Education 2/2/0, Business 3/3/0, Engineering and IT 5/5/0, Health 2/2/0; the census report is `seeds/expected/planning/census_report.csv`, published 14 April 2026: a number published outside the project, which tests reconcile against and no model reads (`tests/governance/models_do_not_read_expected_seeds.sql` fails the build if one does). The singular test `tests/reconciliation/reconcile_planning_with_census_report.sql` is what fails the build; the analysis shows every row for the sign-off (`skills/reconcile-and-diff/SKILL.md` 11-16). |
| 6 | Diff: build main, then the branch from scratch; key by key; counts only. | `skills/reconcile-and-diff/SKILL.md` 18-35; `scripts/tools/diff_against_main.py` 1-11. Run 30 September 2026, and again on 6 October 2026 on the reorganised project, with the same counts: main built into `target/main.duckdb` from an untouched copy; the shortcut branch, built with `--full-refresh`: `mart_planning__near_award` by `learner_award_key`: 0 keys only on either side, `learner_status: 1 rows changed`, `is_near_award: 1 rows changed` (one learner's row: Priya's); `core_learner_v1` by `learner_key,valid_from`: 55 keys only on each side, `valid_to: 38 rows changed`. The fix, built the same way: 0 keys only on either side and no column changed, in both. The fix restores both lines, so the branch equals main and the empty diff is the expected result, not proof of a behaviour-preserving refactor: the narration says only "the diff is empty". The film's point is the shortcut's diff: one row in the mart, and in the core 55 versions whose start moved (by `learner_key,valid_from`, 55 keys on each side only) and 38 more whose end changed. dbt Cloud has its own comparison of a change against production in CI ("advanced CI", compare changes); to check on the day; the project's script works on DuckDB with no service. |
| 6 | From scratch, because the credential table is incremental and would hide a change in logic. | `core_credential_v2` is `incremental`, merged on `credential_key`, with an `is_incremental()` filter that reads only changed source rows; a logic change never reaches rows already built until `--full-refresh` (docs.getdbt.com/docs/build/incremental-models). The shortcut touched the timeline, which the credential table doesn't read, so here the full refresh changes nothing: the film states the rule, not a case where it bit. |
| 7 | CI builds the project on DuckDB, checks the generated docs and the metric, and parses it for Databricks. | `.github/workflows/credential-project.yml` (at the repository root, not in `project/`) 43-63 and 65-90: `dbt build`, `scripts/generate/definitions.py --check`, `scripts/generate/diagrams.py --check`, `scripts/generate/decisions.py --check` (the decision logs and their index), `scripts/check/requirements.py` (only open items in `requirements/`), a MetricFlow query checked by `scripts/check/check_metric.py`, and `dbt parse --target databricks --warn-error` with dummy credentials and no connection. The card shows four of those steps, and "…" for the two between them (the decision logs and the requirements). No secrets; nothing connects to Databricks. |
| 7 | On dbt Cloud, a CI job builds only what changed, and what depends on it. | dbt Labs renamed dbt Cloud "the dbt platform" in 2025; the story keeps "dbt Cloud", at the author's request, and the CI job and `state:modified+` deferral are the same (to confirm on docs.getdbt.com on the day). `README.md` 104-106: `dbt build --select state:modified+ --defer --state <production artifacts>`. `state:modified` compares with a previous run's `manifest.json`; `--defer` reads unchanged parents from production (docs.getdbt.com/reference/node-selection/methods#state; docs.getdbt.com/docs/deploy/continuous-integration). dbt Cloud's CI jobs do this with a deferral environment; plan names to confirm on the day. |
| 7 | The agent marks its pull request ready for review; Jun approves the code; Noor the model; Planning its number. The agent never merges or approves its own work. | The pull request was opened as a draft when the agent pushed its branch, so Jun's review in chapter 5 happens on the draft; the agent marks it ready once its evidence is in (a GitHub draft pull request). `AGENTS.md` 47, 71-80; `docs/process.md` 20-21 ("A reviewer, never the agent"). Enforcing it is a repository setting (required reviews, and an agent's account that can't approve or merge), beyond the files; the film shows the rule and the grey button. The change touched an intermediate model that dates the core's versions, and versions are Noor's to approve (`AGENTS.md` 76); Planning signs off because its number was at stake (validate: "Jun Park and the owner", `docs/process.md` 20). |
| 8 | The agent reviews the metadata, in the project and beyond it, and finds the definition of an award in four places, three wrong. | `skills/review-metadata/SKILL.md` 1-4 and steps 2-3. The skill covers the project's YAML and Markdown; the wiki, the catalog and the dashboard's tooltip are outside it, so the film widens the review, "in the project and beyond it": the agent reads them (it can read, not write) and reports, as in the next film, which opens on this finding with the same four labels (wiki, YAML description, catalog, tooltip). The four copies are the next film's opening, drawn "as it drifts"; in the project, `find_repeats.py` finds 0 descriptions written twice (run 30 September and 6 October 2026), because the definitions are generated from each domain's conceptual model (the award's is `models/core/course/_course__conceptual.yml`). The drift is in copies outside the build (a page, the catalog, a tooltip), which is what the next film fixes. |

**Project files each snippet comes from** (checked against the files on 6 October 2026; every card labelled `runs on dbt Core · DuckDB`, result cards included, since every result was produced on dbt Core and DuckDB, except the grants, `Databricks only`, and the two never-merged diffs, labelled "the agent's draft · never merged"):

| Ch | File | Lines |
|---|---|---|
| 2 | [`AGENTS.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/AGENTS.md) | 1-5, 7-9, 14 (trimmed with …) |
| 2 | [`skills/draft-a-model/SKILL.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/skills/draft-a-model/SKILL.md) | 1-4 (the description wrapped) |
| 2 | [`skills/reconcile-and-diff/SKILL.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/skills/reconcile-and-diff/SKILL.md) | 1-4 (description trimmed) |
| 2 | [`docs/process.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/docs/process.md) | 12, 20, 21 (columns trimmed with …) |
| 3 | [`AGENTS.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/AGENTS.md) | 30-33 (from the `sql` block) |
| 3 | [`AGENTS.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/AGENTS.md) | 43 (wrapped) |
| 4 | [`AGENTS.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/AGENTS.md) | 54-55, and 57 as a highlighted line |
| 4 | `dbt show` of `profile_shared_emails` and `profile_late_changes` | real output, 30 September 2026 |
| 4 | [`seeds/reference/student/learner_identity_decisions.csv`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/seeds/reference/student/learner_identity_decisions.csv) | 1-2 (the reason column trimmed; the email truncated as in the profile card, `nguyen.family@mai…`; `SC` tagged "short courses") |
| 5 | [`models/intermediate/student/int_learner_timeline.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/intermediate/student/int_learner_timeline.sql) | 39-48, 51, 53 (trimmed with …): `valid_from` and `valid_to`, both changed in the agent's drawn diff and both restored by the fix |
| 5 | scratch run output | `FAIL 1 reconcile_planning_with_census_report`; `BUS | 4 | 3` |
| 5 | [`tests/reconciliation/_reconciliation__tests.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/tests/reconciliation/_reconciliation__tests.yml) | 3, 10-11, plus the drawn `severity: warn` (never merged) |
| 5 | [`AGENTS.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/AGENTS.md) | 44 (wrapped) |
| 5 | [`tests/reconciliation/_reconciliation__tests.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/tests/reconciliation/_reconciliation__tests.yml) | 3-7, 10-11 (trimmed) |
| 6 | [`analyses/validation/reconcile_census_report.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/analyses/validation/reconcile_census_report.sql) | result, 30 September 2026 |
| 6 | [`skills/reconcile-and-diff/SKILL.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/skills/reconcile-and-diff/SKILL.md) | 20-27 |
| 6 | [`scripts/tools/diff_against_main.py`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/scripts/tools/diff_against_main.py) | its output, on the scratch branches: `mart_planning__near_award` and `core_learner_v1` |
| 7 | `.github/workflows/credential-project.yml` (at the repository root) | 43-50, 52-56 (shown as "…"), 58-59, 63 (trimmed) |
| 7 | [`README.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/README.md) | 104-106 (starting "… With dbt Cloud"; rewrapped) |
| 7 | [`AGENTS.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/AGENTS.md) | 73-80 (line 75, Mei's row, trimmed with …) |
| 8 | [`skills/review-metadata/SKILL.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/skills/review-metadata/SKILL.md) | 1-4 (description trimmed) |

**dbt and Databricks documentation** (the pages behind each claim; on 30 September 2026 docs.getdbt.com and docs.databricks.com couldn't be reached from the build machine, so each claim was checked against the project's own runs and a web search; to confirm on the pages on the day):

- dbt: test `severity`, `warn_if`, `error_if` (docs.getdbt.com/reference/resource-configs/severity); `store_failures` (docs.getdbt.com/reference/resource-configs/store_failures); singular data tests (docs.getdbt.com/docs/build/data-tests); incremental models and `--full-refresh` (docs.getdbt.com/docs/build/incremental-models); state selection and `--defer` (docs.getdbt.com/reference/node-selection/methods, docs.getdbt.com/reference/node-selection/defer); continuous integration in dbt Cloud (docs.getdbt.com/docs/deploy/continuous-integration, docs.getdbt.com/docs/deploy/ci-jobs); dbt's AI features: dbt Copilot and the dbt MCP server (docs.getdbt.com/docs/dbt-ai/about-mcp), named only here.
- Databricks: "Service principals" (docs.databricks.com/aws/en/admin/users-groups/service-principals); "Unity Catalog privileges and securable objects" (docs.databricks.com/aws/en/data-governance/unity-catalog/manage-privileges/privileges).

**Historical sources.**

- Croarken, Mary, "Tabulating the heavens: computing the Nautical Almanac in 18th-century England", *IEEE Annals of the History of Computing* 25(3), 2003, 48-61: the computers, the comparers, the instructions, the post.
- Croarken, Mary, "Providing longitude for all: the eighteenth-century computers of the Nautical Almanac", *Journal for Maritime Research* 4(1), 2002 (tandfonline.com/doi/pdf/10.1080/21533369.2002.9668324): two computers per month, a comparer, distance against copying.
- Higgitt, Rebekah (ed.), *Maskelyne: Astronomer Royal* (Robert Hale, 2014).
- *The Board of Longitude: Science, Innovation and Empire in the Georgian World* (Cambridge University Press, 2020), ch. 7, "Manufacturing the Nautical Almanac".
- Cambridge Digital Library, Papers of Nevil Maskelyne and the Board of Longitude (cudl.lib.cam.ac.uk: "Diary of 'Nautical Almanac' work", MS RGO 4/324; *The Nautical Almanac and Astronomical Ephemeris for the Year 1767*, PR-NAO-01767).
- HM Nautical Almanac Office, "The Nautical Almanac & its superintendents" (astro.ukho.gov.uk/nao/history/nao_1767.html): published 1766, for 1767.
- Checked in outline 30 September 2026 by a web search (the primary pages were not reachable from the build machine); "far apart" and the posting of instructions to confirm in Croarken 2003 on the day.

## Labs

| # | Lab | Kind | The mechanism people break |
|---|---|---|---|
| 1 | *Review the agent's pull request* | pick | A diff with five changes: a renamed CTE, a new `accepted_values` test, a `relationships` test narrowed with a `where`, `severity: warn` on the reconciliation, and a comment fixed. Pick the ones to reject. Approve the `where` and the lab shows the rows it hides; approve the warning and the build goes green with Business at 4. |
| 2 | *Write a guideline* | compose | Build a must-not for a new risk (the agent wants to add rows to `seeds/expected/planning/census_report.csv` so the reconciliation passes) from parts: the action, the reason, what to do instead. A guideline without "what to do instead" leaves the agent stuck, and the lab shows it looping. |
| 3 | *Claim or guess?* | sort | Six statements from the agent ("4 of 42 accounts have no student ID", "emails are unique", "the census is 12", "Aisha is a duplicate", …), some with a query and result, some without. Sort into evidence and guess; each guess, run, turns out wrong or unproven (the shared Nguyen email breaks "emails are unique"). |
| 4 | *Least access* | pick | Pick the grants the agent needs for three jobs: profile a source, draft a model, reconcile before sign-off. Give it write on production, and one wrong build overwrites Planning's mart; give it too little, and it can't build its branch. |

## Scenarios

Eight situations, in this order.

1. **Choose.** The reconciliation fails by one; the agent proposes `severity: warn` "until the census report is fixed". (No. The test's owner, Planning, decides whether the report or the mart is wrong; the agent reports the failing row and traces the learner behind it.)
2. **Spot the problem.** The agent pastes 500 learner emails into a pull request, as evidence. (Bulk personal data out of the database: counts, and a sample only as large as the claim needs, never more than a few rows.)
3. **Explain.** The agent's draft passes every test, but the diff shows 40 changed rows nobody expected. (An unexpected difference blocks the change until someone understands it; tests check only what's written down.)
4. **Choose.** The agent asks for write access to production "to save time". (No: its own development schemas only. Production is written by the deployment, after review.)
5. **Spot the problem.** A skill file tells the agent to name CTEs `cte_1`, `cte_2`; `docs/conventions.md` says name them for what they hold. (Two homes for one rule: fix the skill to point at the conventions, and review both in the same pull request.)
6. **True or false.** "CI passed, so the agent may approve its own pull request." (False: CI checks what was written down; a person approves, and the agent never merges or approves its own work.)
7. **Explain.** The agent changes how credit is counted, builds without `--full-refresh`, and the diff shows no change in the credential table. (The table is incremental: old rows kept the old logic. Build from scratch before diffing.)
8. **Spot the problem.** The agent writes "Aisha is a duplicate of another learner" in a pull request, with no query. (A guess, and personal data named: the claim needs the query and its result, by key, and identity is Mei's to decide.)

## Decisions taken

| Date | Decision |
|---|---|
| 30 September 2026 | Open in England in 1766 with the Nautical Almanac: work delegated to computers, every month computed twice, and a comparer: the check built into the work. The label says 1766, the year of publication, not 1767, the year the tables were for. No computer is named; no copying incident is told. |
| 30 September 2026 | The shortcut is real: the refactor and the warning were run on a scratch copy of the project (Business 4 against 3; with the warning, `ERROR=0`). The `severity: warn` line is drawn as a diff labelled "the agent's draft · never merged", the one line in the series not in the project. |
| 30 September 2026 | The agent's motive is plausible, not careless: one date rule for every source looks tidy, because the platforms can only be dated by when they recorded a change. |
| 30 September 2026 | The diff shows both runs: the shortcut (in Planning's mart, one row; in the core, 55 versions moved) and the fix (an empty diff, since it restores both lines). The film doesn't claim the empty diff proves a refactor safe; it shows what the diff caught. |
| 30 September 2026 | The agent's grants carry `Databricks only`, as in the film before; every other card, result cards included, carries `runs on dbt Core · DuckDB`, except the two drawn diffs, "the agent's draft · never merged". dbt's own AI features are named only in the rigour sheet. |
| 1 October 2026 | After an independent review: the agent's diff shows both dates; the agent works on a draft pull request, reviewed in chapter 5 and marked ready in chapter 7; the narration names the AI agent in the bridge; the metadata review reaches beyond the project, with the next film's four labels. |
| 1 October 2026 | Series read-through: the bridge says the agent has been on the team all along (it drafted from the question on). *Evidence* recalls the claims of the earlier films and makes the new point, that the habit is now a rule in `AGENTS.md`, instead of restating them; *Reconcile and diff* drops the restated twelve and nine. CI is defined in words where it's first used. |
| 6 October 2026 | The example project was reorganised by application, data and business domains (sources by system, the core by data domain, the marts and exposures by consumer), with one purpose per folder, ready to split into one project per domain. The film's cards show the files as they are now: `seeds/reference/student/learner_identity_decisions.csv`, `models/intermediate/student/int_learner_timeline.sql`, `tests/reconciliation/_reconciliation__tests.yml` and `scripts/tools/diff_against_main.py`. Requirements are now temporary, so *Written down* gains a line: "The work itself is tracked in the team's backlog tool, which the agent can read. In the project, only what's still open is written down, and it's deleted once it's done." The picture adds two chips under the process table, "the backlog tool · who, when, how big" and "requirements/ · only what's still open", and a tag, "deleted once it's done". The chapter times are now the voiced ones; each chapter, lab and scenario links the project files it shows. |

## Open

1. **Scratch experiments.** The refactor, the warning and both diffs were run on copies of the project; consider adding them as documented commands so viewers can repeat them.
2. **Voice.** Check "ay eye", "seventeen sixty-six", "Maskelin" (Maskelyne, usually said MASK-uh-lin), "May", "dee bee tee", "duck dee bee", "see eye" and "eye dees" by ear; key strings, file names, test names and hashes stay on screen only.
3. **Historical detail.** "Far apart" and "posted instructions" to confirm in Croarken (2003) on the day.
4. **The past's label.** The series plan gives "1767 · England"; the script uses 1766, the year the first almanac was published. Either is defensible if the rigour sheet says which.
5. **The grants in `AGENTS.md`.** Lines 30-33 (29-32 on 30 September; still uncorrected on 6 October 2026) must be corrected in the project (a shared file, not changed by this film) before the pictures are built: add ``grant use catalog, create schema on catalog <development catalog> to `<agent service principal>`;`` and ``grant use schema, select on schema <sources catalog>.<source schema> to `<agent service principal>`;`` for each source schema (or one development schema per layer, or a `generate_schema_name` override), and say "development schemas" in line 27 (line 26 before the reorganisation). The chapter 3 card then copies the corrected lines (still about 6 lines).
