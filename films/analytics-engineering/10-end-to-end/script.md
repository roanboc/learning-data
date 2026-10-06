# In the weeds of data crafting · End to end: script

*The script of End to end, the closing film of In the weeds of data crafting, a technical series for analytics engineers, as made: 8:21 (planned at about 9 minutes, longer than the others because it follows one question through all ten steps), in twelve chapters, in English, 6 October 2026. The narration lives in [`source/src/narration.js`](source/src/narration.js) and the pauses in [`source/src/breath.js`](source/src/breath.js); this page and those files say the same. Chapter times are the voiced lengths, from `tools/pace.py`.*

## The promise

A practitioner can replay every step, and a data architect agrees with every file's place. One new consumer, Finance, asks one question, and the film follows it through the ten steps in the example project, one real commit per step, so every card is a file as that commit left it. Two ideas carry the film. Every file has a **home**, named for the kind of domain it belongs to: sources by system (application domains), the core by meaning (data domains), marts and exposures by who decides (business domains). And every file has a **lifetime**: written by hand and kept, generated and never edited, or kept only while the work goes on. The temporary files (the open questions and requirements) arrive, do their job, and are deleted; what lasts goes to its home. Because Finance's folders are named for it from the first commit, Finance can move out to a project of its own, whole.

## The story in one paragraph

In the fourteenth century, the masons building York Minster drew their windows full size on a floor of plaster, cut wooden templates from the drawings, carved the stone to match, and drew the next window over the last; in time the floor was plastered again. The drawings were for the work; the windows stayed. A project has both. Finance arrives with a question: how much tuition does recognised credit save learners, by faculty, as at census date? It's a business domain, so its first commit gives it folders of its own, its question in its conceptual model, its first decision in its log, and one file that won't last: its open requirements. The agent profiles the core and finds credit counted towards several awards at once (385 credit points across awards, 160 in the award each learner is enrolled in); a question opens, Finance answers it, the answer becomes a rule and a decision, and the question is deleted. The output's grain is written down, the contract promised, a gap accepted as a known limitation. The tests come before the logic and fail on purpose; then the logic, reading only the public core and Finance's own rates, makes every test pass: 67,800 dollars across four faculties. Faculty by faculty it matches Finance's own number, and the diff against main shows no other team's numbers moved. The last requirement is done, so it's deleted, with its file and folder. The agent's review finds two descriptions written twice, and they become doc blocks in the course domain. Finance pins the core versions it reads. Ten steps, ten commits: some files arrived to stay, some were for the work, and every file has a home and a lifetime. Declare it. Then build it.

## What each object stands for

| Object | Stands for |
|---|---|
| "14th century · York Minster"; a floor of plaster, a window's tracery cut into it with dividers | A drawing for the work, full size |
| A wooden template lifted from the drawing; a block of stone carved to match | Building from the drawing |
| A rose drawn over the window; fresh plaster spread over both, the old lines faint beneath | Working files, used and then covered |
| The finished window, in stone, with light through its glass | What stays |
| A strip of ten boxes along the top, one per step, each filling with its short commit hash and its counts (+ added, ~ changed, − deleted) | The ten commits, one per step |
| The commit card on the left: the step, its hash, and its files, each appearing as it's named | What that commit changed |
| A file drawn with a dashed amber edge, tagged "temporary" | A file kept only while the work goes on |
| A small cog on a file | A generated file: nobody edits it |
| A red line through a file or an item | Deleted (git keeps it) |
| Finance as a team in pink, with a stack of coins as its badge | The new consumer, a business domain |
| White lines on blue | The model |
| Code on dark glass | A project file, as the step's commit left it |
| The teal orb | The agent's work |
| A gold tick | A person's approval |
| Three boxes: application, data and business domains, each with its folders | Every file has a home |
| Three boxes: written by hand, generated (a cog), only while the work goes on (dashed) | Every file has a lifetime |
| The loop of ten steps from the opening film | The series, closed |
| The blueprint over the lineage graph | The model is the blueprint; dbt is how you build it |

## Script

The cards quote the project's files as each step's commit left them; each chapter links its commit, where the whole change can be read, and its files as they are on `main`. Files that were deleted (Finance's requirements file) are only in the commits.

### 1 · The tracing floor · 0:00–0:40

**Narration.** In the fourteenth century, the masons building York Minster drew their windows full size, on a floor of plaster. From each drawing they cut a wooden template, and carved the stone to match it. When a window was done, the next was drawn over it. In time, the floor was plastered again. The drawings were for the work. The windows are what stayed. A project has both: files for the work, deleted when it's done, and files that stay. This is one new question, from start to end.

**Picture.** The warm past, with "14th century · York Minster" in the corner. A floor of plaster, seen from above; a pair of dividers cuts a window's tracery into it, full size (a dry scrape for each line). A wooden template is lifted from the drawing and laid by a block of stone, which is carved to match (a chisel, muffled). On "drawn over it", a rose is cut over the window; on "plastered again", fresh plaster is spread across both (a trowel), the old lines faint beneath. The floor slides aside, and the finished window stands in stone with light through its glass (a swell); the drawings are tagged "for the work", the window "what stayed". Then the present: "a project has both". On the left, three files dashed for the work, struck through as "deleted" is said; on the right, three that stay. The title card, over a small window: *End to end*, the mark on the felt piano.

**On screen.** 14th century · York Minster · full size, on plaster · a wooden template · the stone, carved to match · the next, drawn over it · plastered again · the old lines faint beneath · for the work · what stayed · a project has both · `_finance__requirements.yml` · Q-FIN-01 · REQ-FIN-02 · for the work · deleted when it's done · `_finance__conceptual.yml` · `_finance__decisions.yml` · `mart_finance__tuition_forgone.sql` · what stays · one new question, from start to end · *End to end* · one question, every file it touches, and the ones that leave

### 2 · A new question · 0:40–1:37

**Narration.** A new consumer arrives: Finance. How much tuition does recognised credit save learners, by faculty, as at census date? The answer sets next year's revenue forecast, and what a microcredential should cost. Finance is a business domain: it decides with the data. So it gets folders of its own, named for it, from the first commit. Step one is the scope. Its conceptual model holds the question; its decision log, the first decision: recognised credit only, read from the public core. And one file that won't last: Finance's open requirements. The first says what done looks like: match Finance's own number. Who does the work, and when, lives in the team's backlog tool. The project keeps only what's still open.

**Picture.** From here on, the ledger of ten commits runs along the top, and the step's commit card sits on the left. Finance arrives as a team, in pink, with a question card ("a new question · from Finance"); the question, then what it decides, in large type. Three boxes, application, data and business domain; the business domain lights, and two folders appear: `models/marts/finance/` and `exposures/finance/`. Step one's card fills in: the conceptual model with the question lit, the decision log with DEC-FIN-01, and Finance's requirements file, dashed and tagged "temporary", with REQ-FIN-01. Along the bottom, "the backlog tool · who, when, how big" and "requirements/ · only what's still open".

**On screen.** step 1 · commit 9731784 · the question, and a new business domain · Finance · a new consumer · How much tuition does recognised credit save learners, by faculty, as at census date? · It sets next year's revenue forecast, and the price of microcredentials. · application domain · data domain · business domain · `models/marts/finance/` · `exposures/finance/` · temporary · the backlog tool · who, when, how big · requirements/ · only what's still open

**The commit.** [`9731784` Finance, step 1 of 10 (scope): the question, and a new business domain](https://github.com/roanboc/learning-data/commit/9731784e2f01d135b83c36650fc1ceffd995d493)

**In the repo.** [`models/marts/finance/_finance__conceptual.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/marts/finance/_finance__conceptual.yml) · [`models/marts/finance/_finance__decisions.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/marts/finance/_finance__decisions.yml) · [`exposures/finance/`](https://github.com/roanboc/learning-data/tree/main/films/analytics-engineering/project/exposures/finance/) · [`models/_shared/_shared__conceptual.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/_shared/_shared__conceptual.yml)

### 3 · What the core holds · 1:37–2:22

**Narration.** Step two: what the data really holds. Finance reads the core, not the sources, so the agent profiles the core. Recognised credit counts towards every award it could count towards. Aisha's counts towards three. Added up across awards, that's 385 credit points. In the award each learner is enrolled in, 160. Which one saves the tuition? No rule can say. A question opens, with the query as evidence, and Finance owns the answer. Finance brings one thing of its own: the tuition rates it publishes, as reference data it owns.

**Picture.** The agent profiles the core, not the sources: the profiling query types on; `sources/` dims and `models/core/` lights, "the core: what Finance reads". Aisha's card (`SIS|S-20417`, recognised credit) sends three arrows to three awards: GCDA, 15 credit points; MDA, 10; GCCS, 5. Two numbers: 385 in amber, "credit points, added up across awards", and 160 in gold, "in the award each learner is enrolled in" (a detuned felt pair under the first, a felt note under the second). The requirements card opens Q-FIN-01, dashed; "no rule can say"; Finance's badge, "Finance owns the answer". Then Finance's rates, `tuition_rates.csv`, "reference data · owned by Finance".

**On screen.** step 2 · commit 8e325c8 · credit counted towards several awards · `analyses/profiling/profile_credit_across_awards.sql` · `sources/` · `models/core/` · the core: what Finance reads · Aisha · `SIS|S-20417` · recognised credit · GCDA · MDA · GCCS · 385 · 160 · Q-FIN-01 · no rule can say · Finance owns the answer · `seeds/reference/finance/tuition_rates.csv` · reference data · owned by Finance · `meta: {owner: Finance, domain: finance}`

**The commit.** [`8e325c8` Finance, step 2 of 10 (source reality): credit counted towards several awards](https://github.com/roanboc/learning-data/commit/8e325c8533b1cbd73a2ff41bcc4c304f00ab51d3)

**In the repo.** [`analyses/profiling/profile_credit_across_awards.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/analyses/profiling/profile_credit_across_awards.sql) · [`seeds/reference/finance/tuition_rates.csv`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/seeds/reference/finance/tuition_rates.csv) · [`seeds/reference/finance/_finance__seeds.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/seeds/reference/finance/_finance__seeds.yml)

### 4 · One row of what · 2:22–3:00

**Narration.** Step three: the output. First, Finance answers: only the award the learner is enrolled in, on census day. The answer goes where it lasts: a rule in Finance's conceptual model, and a decision in its log. And the question is deleted. Git keeps it, and the decision says where it came from. Then the output, before any code: one row per learner per award they're enrolled in, as at census date. That's a requirement too, open until a contract enforces it.

**Picture.** Finance's answer, in its colour: "Only the award the learner is enrolled in, on census day." Aisha's three awards again; GCDA lights, "Aisha is enrolled here", the others dim. The answer moves: the rule lights in Finance's conceptual model, DEC-FIN-02 arrives in the decision log with `was: Q-FIN-01`, and Q-FIN-01 is struck through in the requirements file; "git keeps it · the decision says where it came from". Then the grain in one sentence, large, and REQ-FIN-02, dashed: "open until a contract enforces it".

**On screen.** step 3 · commit ea693b7 · one award, and the rows Finance needs · Only the award the learner is enrolled in, on census day. · Aisha is enrolled here · `_finance__conceptual.yml` · `_finance__decisions.yml` · DEC-FIN-02 · `was: Q-FIN-01` · git keeps it · the decision says where it came from · one row per learner per award they're enrolled in, as at census date · REQ-FIN-02 · open until a contract enforces it

**The commit.** [`ea693b7` Finance, step 3 of 10 (consumer output): one award, and the rows Finance needs](https://github.com/roanboc/learning-data/commit/ea693b7aaa8cd8c5083ff9d5cda3768e519f1cba)

**In the repo.** [`models/marts/finance/_finance__conceptual.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/marts/finance/_finance__conceptual.yml) · [`models/marts/finance/_finance__decisions.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/marts/finance/_finance__decisions.yml)

### 5 · The promise · 3:00–3:35

**Narration.** Step four: the promise. Finance's mart gets a contract: the columns and types the forecast needs, enforced. For now it's an empty table, the right shape with no rows, and the forecast is declared as what depends on it. One gap: the project knows the published rate, not what each learner was charged. Scholarships and discounts aren't in. Finance accepts it. It becomes a known limitation, on the mart, with a decision that says why.

**Picture.** The mart's contract: its columns and types, typing on; "contract: enforced" (a low stamp). An empty table with the same columns, "the right shape · no rows"; the exposure card, `revenue_forecast`, with `depends_on` lit. The gap: "what each learner was charged" beside "the published rate, per credit point"; "scholarships · discounts". Finance's badge takes a gold tick; the limitation, LIM-FIN-01, appears in the mart's YAML, with DEC-FIN-03.

**On screen.** step 4 · commit d4cf5d1 · the promise, before the logic · `mart_finance__tuition_forgone` · contract: enforced · the right shape · no rows · `exposures/finance/_finance__exposures.yml` · what each learner was charged · the published rate, per credit point · scholarships · discounts · `models/marts/finance/_finance__models.yml` · LIM-FIN-01

**The commit.** [`d4cf5d1` Finance, step 4 of 10 (gaps and contracts): the promise, before the logic](https://github.com/roanboc/learning-data/commit/d4cf5d17fe0d07ba426d0826d0a097710d435e8b)

**In the repo.** [`models/marts/finance/_finance__models.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/marts/finance/_finance__models.yml) · [`models/marts/finance/mart_finance__tuition_forgone.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/marts/finance/mart_finance__tuition_forgone.sql) · [`exposures/finance/_finance__exposures.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/exposures/finance/_finance__exposures.yml)

### 6 · Tests first · 3:35–4:19

**Narration.** Step five: the tests, before the logic. The grain, tested as a key. Learners that exist. Only the award types Finance prices. A unit test for the rule: credit that counts towards two awards still saves tuition once. And Finance's own number, from its spreadsheet, as an expected seed that no model may read. A reconciliation compares the two. Nothing can pass yet. The unit test fails, so dbt doesn't even build the mart. But the grain is tested and the contract enforced, so the output requirement is done, and deleted.

**Picture.** The tests type on in the mart's YAML, each lit as it's named: the key, the relationship to learners, the accepted award types. The unit test, with the line that says credit counting towards two awards saves tuition once. Finance's report as an expected seed, "an expected seed · no model may read it"; the reconciliation's nodes join the mart and the report. `dbt build`: the unit test fails (a muted double knock) and the mart is skipped; "on purpose: nothing can pass until the logic is built". REQ-FIN-02 is struck through: "grain tested · contract enforced · REQ-FIN-02 done".

**On screen.** step 5 · commit 254da73 · the proofs, before the code · `models/marts/finance/_finance__models.yml` · unit_tests · credit that counts towards two awards · saved once · `seeds/expected/finance/tuition_report.csv` · an expected seed · no model may read it · `reconcile_finance_with_tuition_report` · dbt build · FAIL 1 · unit test · SKIP · on purpose: nothing can pass until the logic is built · grain tested · contract enforced · REQ-FIN-02 done

**The commit.** [`254da73` Finance, step 5 of 10 (tests): the proofs, before the code](https://github.com/roanboc/learning-data/commit/254da735d2349761fb1efe47d013ff0da5c6deeb)

**In the repo.** [`models/marts/finance/_finance__models.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/marts/finance/_finance__models.yml) · [`seeds/expected/finance/tuition_report.csv`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/seeds/expected/finance/tuition_report.csv) · [`tests/reconciliation/reconcile_finance_with_tuition_report.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/tests/reconciliation/reconcile_finance_with_tuition_report.sql)

### 7 · The build · 4:19–4:55

**Narration.** Step six: the logic. It reads the core as it was on census day, keeps the award each learner was enrolled in, and prices the credit at that year's rate. It reads nothing but the public core and Finance's own rates. No other team's model changes. It's short, because the core already did the hard parts: identity, timelines, and the credit itself. Every test passes: 67,800 dollars, across four faculties.

**Picture.** The mart's SQL types on, each part lit as it's named: the core as it was on census day, the enrolled award, the price. Lineage: `core_learner`, `core_award` and `core_credit_towards_award`, and Finance's `tuition_rates`, flow into the mart; Planning's and the wallet's marts sit dim, "no other team's model changes"; "the core did the hard parts: identity · timelines · credit". `dbt build`, green. Four bars by faculty, and the total.

**On screen.** step 6 · commit f761664 · the logic, on the public core · `models/marts/finance/mart_finance__tuition_forgone.sql` · the public core · Finance's own rates · no other team's model changes · the core did the hard parts: identity · timelines · credit · Done. PASS=157 WARN=1 ERROR=0 SKIP=0 NO-OP=3 REUSED=0 TOTAL=161 · tuition forgone, as at census date · AED 2,100 · BUS 10,800 · EIT 42,300 · HLT 12,600 · 67,800 · dollars, across four faculties

**The commit.** [`f761664` Finance, step 6 of 10 (build): the logic, on the public core](https://github.com/roanboc/learning-data/commit/f7616640059df74e6038a69e5b86c7bfc02c6658)

**In the repo.** [`models/marts/finance/mart_finance__tuition_forgone.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/marts/finance/mart_finance__tuition_forgone.sql)

### 8 · Nothing else moved · 4:55–5:25

**Narration.** Step seven: validate. Faculty by faculty, against Finance's report. The difference is zero. Then the diff against main, built from scratch: every core table, Planning's mart, the wallet's. No key added, none lost, no column changed. A new consumer moved nobody else's numbers. Finance signs off, with every row in front of it.

**Picture.** A table, faculty by faculty: the mart, Finance's report, the difference; the difference column lights green, "difference: 0, in every faculty". Then the agent's diff against main: eight tables (the five core tables, Planning's mart, the wallet's two), with keys only here, keys only in main, columns changed: zero in every cell; "a new consumer moved nobody else's numbers · only new: `mart_finance__tuition_forgone`". Finance's badge takes a tick: "Finance signs off, with every row in front of it".

**On screen.** step 7 · commit 130a72c · Finance's number, and nothing else moved · faculty · in the mart · in Finance's report · difference · `analyses/validation/reconcile_tuition_report.sql` · difference: 0, in every faculty · diff against main · keys only here · keys only in main · columns changed · a new consumer moved nobody else's numbers · only new: `mart_finance__tuition_forgone` · Finance signs off, with every row in front of it

**The commit.** [`130a72c` Finance, step 7 of 10 (validate): Finance's number, and nothing else moved](https://github.com/roanboc/learning-data/commit/130a72c422bc9ea8a67740da1483241bf8d5bd7e)

**In the repo.** [`analyses/validation/reconcile_tuition_report.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/analyses/validation/reconcile_tuition_report.sql) · [`scripts/tools/diff_against_main.py`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/scripts/tools/diff_against_main.py)

### 9 · Review and ship · 5:25–5:58

**Narration.** Step eight: review and ship. The last open item, match Finance's number, is done: the reconciliation enforces it on every build. So the item is deleted, and with it Finance's requirements file, and its folder. A check in CI makes sure of it: nothing stays in requirements unless it's still open. Jun approves the code, and Finance its number. The agent never merges.

**Picture.** The pull request, "ready". The requirements file: REQ-FIN-01 struck through; "done: the reconciliation enforces it, on every build". The file is crossed out, "deleted", and its folder struck through. CI's checks land one by one, the last one lit: "Requirements hold only what's open"; `python scripts/check/requirements.py` · "3 requirements open · none of them Finance's". Jun, with a gold tick, "the code"; Finance, with a gold tick, "its number"; the agent: "the agent never merges".

**On screen.** step 8 · commit 4efec1f · the last open item is done, and deleted · Pull request · Finance's tuition forgone, steps 1 to 10 · ready · done: the reconciliation enforces it, on every build · deleted · `requirements/exposures/finance/` · Build and test on DuckDB · Doc blocks and key sets match the conceptual model · Physical diagram matches the YAML · Decision logs are valid and indexed · Requirements hold only what's open · 3 requirements open · none of them Finance's · Jun · the code · Finance · its number · the agent never merges

**The commit.** [`4efec1f` Finance, step 8 of 10 (review and ship): the last open item is done, and deleted](https://github.com/roanboc/learning-data/commit/4efec1f8df2f3f173386aca70802691544034bba)

**In the repo.** [`scripts/check/requirements.py`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/scripts/check/requirements.py)

### 10 · Written once · 5:58–6:31

**Narration.** Step nine: the agent reviews the metadata. Two descriptions were written twice, word for word: the award's code and its name, in Finance's YAML and in Planning's. The award belongs to the course domain, so each becomes one doc block there, shown everywhere it's needed. Zero descriptions written twice. The generated pages, the definitions, the diagram and the index of decisions, keep up on their own.

**Picture.** The agent's review types on: two descriptions, each written twice, word for word, in Finance's YAML and Planning's (a detuned felt pair). The course domain's columns file gains two doc blocks, "the course domain owns the award"; Finance's and Planning's YAML now show them with `doc()`. The review runs again: "0 description(s) written more than once". Three generated files, each with a cog: "generated · up to date".

**On screen.** step 9 · commit 43f3f76 · two descriptions, written once · `$ python skills/review-metadata/find_repeats.py` · 2 description(s) written more than once · `models/core/course/_course__columns.md` · `{% docs award_code %}` · `{% docs award_name %}` · the course domain owns the award · `doc("award_code")` · the agent's review, again · 0 description(s) written more than once · `_finance__definitions.md` · `_finance__physical.md` · `docs/decisions.md` · generated · up to date

**The commit.** [`43f3f76` Finance, step 9 of 10 (written once): two descriptions, written once](https://github.com/roanboc/learning-data/commit/43f3f7621f16bc5d33e4173df411c795b06d2967)

**In the repo.** [`skills/review-metadata/find_repeats.py`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/skills/review-metadata/find_repeats.py) · [`models/core/course/_course__columns.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/core/course/_course__columns.md) · [`models/marts/finance/_finance__models.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/marts/finance/_finance__models.yml) · [`models/marts/planning/_planning__models.yml`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/marts/planning/_planning__models.yml)

### 11 · Ready to move · 6:31–7:04

**Narration.** Step ten: operate and evolve. Finance pins the versions of the core it reads. A new version reaches Finance as a choice with a date, and the lineage names Finance among who to tell. And because Finance's folders were named for it from the first commit, Finance can move out to a project of its own, whole. Its marts, its exposure, its seeds, its decisions, and the test and two analyses it was built with.

**Picture.** The mart's refs, each with `v=1` lit amber (a low stamp). Version 1 of the core's credit model feeds the mart; a version 2 appears dashed beside it, "a choice, with a date"; Finance's badge, "revenue_forecast · who to tell". Then Finance's folders, "Finance's folders, named for it from the first commit", gather into one box, "Finance's own project · refs the public core across projects", and its one test and two analyses join them.

**On screen.** step 10 · commit 39cd815 · pinned, and ready to move out · `ref('core_learner', v=1)` · `ref('core_award', v=1)` · `ref('core_credit_towards_award', v=1)` · `core_credit_towards_award v1` · `core_credit_towards_award v2` · a choice, with a date · revenue_forecast · who to tell · `models/marts/finance/` · `exposures/finance/` · `seeds/reference/finance/` · `seeds/expected/finance/` · `_finance__decisions.yml` · Finance's folders, named for it from the first commit · Finance's own project · refs the public core across projects · `reconcile_finance_with_tuition_report.sql` · `profile_credit_across_awards.sql` · `reconcile_tuition_report.sql`

**The commit.** [`39cd815` Finance, step 10 of 10 (operate and evolve): pinned, and ready to move out](https://github.com/roanboc/learning-data/commit/39cd8152885a61a353bb055733819bca2ef1783c)

**In the repo.** [`models/marts/finance/mart_finance__tuition_forgone.sql`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/models/marts/finance/mart_finance__tuition_forgone.sql) · [`models/marts/finance/`](https://github.com/roanboc/learning-data/tree/main/films/analytics-engineering/project/models/marts/finance/) · [`exposures/finance/`](https://github.com/roanboc/learning-data/tree/main/films/analytics-engineering/project/exposures/finance/) · [`seeds/reference/finance/`](https://github.com/roanboc/learning-data/tree/main/films/analytics-engineering/project/seeds/reference/finance/) · [`seeds/expected/finance/`](https://github.com/roanboc/learning-data/tree/main/films/analytics-engineering/project/seeds/expected/finance/) · [`docs/conventions.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/docs/conventions.md)

### 12 · The whole building · 7:04–8:21

**Narration.** Ten steps, ten commits. You can replay them one by one, in the repository. Some files arrived to stay: the question, the decisions, the contract, the tests, the model. Some were for the work: three open items, and the file that held them. They're gone. The project says only what's still open. Every file has a home. Sources by system: application domains. The core by meaning: data domains. Marts and exposures by who decides: business domains. And every file has a lifetime: written by hand, generated, or kept only while the work goes on. The next question will start the same way: in folders of its own, with one file that won't last. That's the series. A question and its meaning, the sources, the consumers, promises and proofs, layers, the trusted number, an agent on the team, written once, and change. The model is the blueprint. dbt is how you build it. Declare it. Then build it.

**Picture.** `git log --oneline`: the ten commits type on; "replay them, one by one, in the repository". Two columns: "arrived to stay" (the conceptual model, the decisions, the models YAML, the reconciliation test, the mart, the exposure) and "for the work" (Q-FIN-01, REQ-FIN-02, REQ-FIN-01 and the requirements file, struck through one by one); "git keeps them · the project says only what's open". Three boxes, one per kind of domain, with their folders, Finance's lit; below them, three lifetimes. The next question, with folders of its own and one dashed folder that won't last. The loop of ten steps, each station lit as the series is named. The blueprint over the lineage graph; "Declare it. Then build it." The end card: *End to end*, "Every file in its place, for as long as it's needed.", the mark on the felt piano answered by the opening film's electric piano.

**On screen.** git log --oneline · replay them, one by one, in the repository · arrived to stay · for the work · git keeps them · the project says only what's open · application domains · a system, and its team · data domains · what the facts mean · business domains · who decides with the data · written by hand · generated · only while the work goes on · the next question · from anyone, at any time · `models/marts/<consumer>/` · `exposures/<consumer>/` · `requirements/exposures/<consumer>/` · one file that won't last · In the weeds of data crafting · ten films · ten steps · the model is the blueprint · dbt is how you build it · Declare it. Then build it. · *End to end* · Every file in its place, for as long as it's needed.

**In the repo.** [`sources/`](https://github.com/roanboc/learning-data/tree/main/films/analytics-engineering/project/sources/) · [`models/core/`](https://github.com/roanboc/learning-data/tree/main/films/analytics-engineering/project/models/core/) · [`models/marts/`](https://github.com/roanboc/learning-data/tree/main/films/analytics-engineering/project/models/marts/) · [`docs/conventions.md`](https://github.com/roanboc/learning-data/blob/main/films/analytics-engineering/project/docs/conventions.md)

## Pause and think

Four stops, one question each.

| After | Question | Answer, in short |
|---|---|---|
| 2 · A new question (`question`) | Why does Finance get folders of its own, from its first commit? | Finance decides with the data, so its files live by who decides: found by name, never mixed with Planning's or the wallet's, and ready to move out whole one day. |
| 4 · One row of what (`output`) | Finance has answered Q-FIN-01. Where does the answer go? | A rule in Finance's conceptual model and a decision in its log, with `was: Q-FIN-01`; then the question is deleted. The question was temporary; the answer isn't. |
| 9 · Review and ship (`ship`) | Why delete Finance's requirements file when its last item is done? | So the project says only what's still open. Git keeps the history, and each item's lasting part is already in its home: a decision, a known limitation, a contract, a test. |
| 11 · Ready to move (`evolve`) | Why does Finance pin the versions of the core it reads? | So a new version reaches Finance as a choice with a date, not as a surprise in its next build: dbt warns with the date, and Finance moves when it has checked its number. |

## Rigour sheet

| Chapter | What the film says | What an expert would add, or what it simplifies |
|---|---|---|
| 1 | In the fourteenth century, the masons building York Minster drew their windows full size, on a floor of plaster. | York Minster's tracing floor is in the masons' loft above the vestibule between the north transept and the chapter house; with Wells Cathedral's, one of two surviving in England. The floor is thin layers of plaster of Paris. John Harvey identified one drawing as the setting-out of the tracery of the Lady Chapel's aisle windows, built 1361–1373 and designed about 1365, by William de Hoton (junior) or Robert de Patryngton. Later drawings on it are later: Arnold Pacey matched some to St Michael-le-Belfrey, built in the sixteenth century. Tracing floors were for setting out at full size; that the York drawings are full size is to confirm against Harvey's and Pacey's own texts. The picture's window and rose are drawn, not copies of the York drawings. |
| 1 | From each drawing they cut a wooden template, and carved the stone to match it. | The setting-out was copied onto thin boards or metal sheets, templates (moulds) the masons carved to. The picture shows wood. |
| 1 | When a window was done, the next was drawn over it. In time, the floor was plastered again. | The York drawings overlap, and the floor was re-laid with fresh plaster at intervals, trampled flat; the old lines survive faintly beneath. |
| 2 | Finance is a business domain; folders of its own, from the first commit. | Commit 9731784 adds `models/marts/finance/`, `exposures/finance/` (with the exposure) and the requirements register; `models/_groups.yml` gains the `finance` group. The university's map had a *planned* data domain called `finance` (fees, HELP, scholarships); the same commit renames it `fees`, still planned, so the two don't clash. |
| 2 | The first decision: recognised credit only, read from the public core. | DEC-FIN-01, "Recognised credit only, on the public core", decided by Finance with Noor, data architect, 19 October 2026 (`models/marts/finance/_finance__decisions.yml`). Units passed are paid for, so only recognised credit (microcredentials and short-course certificates a faculty recognises) can save tuition. |
| 2 | The first requirement says what done looks like: match Finance's own number. | REQ-FIN-01, "Match Finance's own number", with `done_when`: a reconciliation test passes on every build. In the requirements file from commit 9731784 to 4efec1f. |
| 2 | Who does the work, and when, lives in the team's backlog tool. | `requirements/README.md`: an item links to its ticket with `ticket`, and `scripts/check/requirements.py` fails on an item with a priority, estimate, assignee or sprint. |
| 3 | Recognised credit counts towards every award it could count towards. Aisha's counts towards three. | `core_credit_towards_award` at census date (31 March 2026): Aisha Karimi, `SIS|S-20417`, enrolled in GCDA, holds recognised credit towards GCDA (15 credit points), MDA (10) and GCCS (5). The points differ by award because each award recognises its own microcredentials. |
| 3 | 385 credit points added up across awards; 160 in the award each learner is enrolled in. | `analyses/profiling/profile_credit_across_awards.sql` on the DuckDB build, 6 October 2026: 20 learners with recognised credit, 49 learner-award rows, 385 credit points across awards, 160 in the enrolled award. Q-FIN-01 cites it as evidence. |
| 3 | The tuition rates Finance publishes, as reference data it owns. | `seeds/reference/finance/tuition_rates.csv`: per credit point, graduate certificate 400 (2025) and 420 (2026), master 455 and 480, in AUD; `meta: {owner: Finance, domain: finance, purpose: reference}`. |
| 4 | The answer becomes a rule and a decision; the question is deleted. | Commit ea693b7: the rule on `tuition_forgone` in `_finance__conceptual.yml`; DEC-FIN-02, "Tuition is saved in the enrolled award only", decided by Finance, 21 October 2026, `was: Q-FIN-01`; Q-FIN-01 deleted from the register. `was:` names the deleted item, so the decision says where it came from; `scripts/generate/decisions.py` lists it in `docs/decisions.md` as "(was Q-FIN-01)". |
| 4 | One row per learner per award they're enrolled in, as at census date. | The grain, in the conceptual model; REQ-FIN-02, "The rows and columns the forecast needs", open from ea693b7 to 254da73. |
| 5 | A contract; an empty table with the right shape; the forecast declared as what depends on it. | Commit d4cf5d1: `_finance__models.yml` with `contract: {enforced: true}` and a primary key; the SQL is a typed stub returning no rows; `revenue_forecast` in `exposures/finance/_finance__exposures.yml` gains `depends_on`. |
| 5 | The published rate, not what each learner was charged; a known limitation, with a decision. | LIM-FIN-01 in `meta.limitations` on the mart; DEC-FIN-03, "The published rate, not what each learner was charged", decided by Finance, 22 October 2026. Scholarships, discounts and fee waivers aren't in the project's sources. |
| 6 | The grain tested as a key; learners that exist; only the award types Finance prices. | Commit 254da73: `unique_combination` on learner and award, `relationships` to `core_learner`, `accepted_values` on the award type. |
| 6 | Finance's own number, as an expected seed no model may read; a reconciliation compares the two. | `seeds/expected/finance/tuition_report.csv` (published 16 October 2026: AED 2,100, BUS 10,800, EIT 42,300, HLT 12,600); `tests/governance/models_do_not_read_expected_seeds.sql` fails the build if a model reads it; `tests/reconciliation/reconcile_finance_with_tuition_report.sql`. |
| 6 | The unit test fails, so dbt doesn't even build the mart. | `dbt build` at 254da73, 6 October 2026: the unit test fails, the mart and its tests are skipped: `Done. PASS=150 WARN=1 ERROR=1 SKIP=7`. dbt runs a model's unit tests before building it, and skips the model if one fails. The one warning is older: a short-course enrolment with no customer key, which the project warns on by design. |
| 7 | It reads nothing but the public core and Finance's own rates. | Commit f761664: `mart_finance__tuition_forgone.sql` refs `core_learner`, `core_award`, `core_credit_towards_award` and `tuition_rates` only. The core models are public; Finance's group reads them through `ref()`. |
| 7 | Every test passes: 67,800 dollars, across four faculties. | `dbt build` at f761664: `PASS=157 WARN=1 ERROR=0`, 161 nodes. Australian dollars (the rates' currency is AUD). Faculties: Arts and Education 2,100; Business 10,800; Engineering and IT 42,300; Health 12,600. |
| 8 | Faculty by faculty, against Finance's report. The difference is zero. | `analyses/validation/reconcile_tuition_report.sql` (commit 130a72c), for the sign-off; the reconciliation test enforces the same on every build. |
| 8 | The diff against main, built from scratch; no key added, none lost, no column changed. | `scripts/tools/diff_against_main.py`, comparing a fresh build of the branch with a build of `main` (`target/main.duckdb`), 6 October 2026: each of the five core tables (`core_learner_v1`, `core_award_v1`, `core_credential_v1`, `core_credential_v2`, `core_credit_towards_award_v1`), `mart_planning__near_award`, `mart_wallet__learners` and `mart_wallet__credentials` shows no key only on one side and no column changed. Only `mart_finance__tuition_forgone` is new. |
| 9 | The last open item is done; the file and its folder are deleted; a check in CI makes sure of it. | Commit 4efec1f deletes `requirements/exposures/finance/`. CI's step "Requirements hold only what's open" (`.github/workflows/credential-project.yml`) runs `scripts/check/requirements.py`, which fails on an item that isn't open or in progress and on an empty register. After the commit it prints "3 requirements open" (GAP-LMS-01, GAP-LMS-02, GAP-SIS-03): none of them Finance's. |
| 9 | Jun approves the code, and Finance its number. The agent never merges. | The story's roles, as in the series (`AGENTS.md`): the agent drafts and opens pull requests; people approve and merge. |
| 10 | Two descriptions written twice, word for word; each becomes one doc block in the course domain. | `python skills/review-metadata/find_repeats.py` before commit 43f3f76: `award_code` and `award_name`, each in `_finance__models.yml` and `_planning__models.yml`, "2 description(s) written more than once"; after: "0". The doc blocks are in `models/core/course/_course__columns.md`; the award's name description keeps " On the census date." after `doc()` in each mart. |
| 10 | The generated pages keep up on their own. | `scripts/generate/definitions.py`, `diagrams.py` and `decisions.py` with `--check`, in CI; all pass at 43f3f76. |
| 11 | Finance pins the versions of the core it reads; a new version arrives as a choice with a date. | Commit 39cd815: `ref('core_learner', v=1)`, `ref('core_award', v=1)`, `ref('core_credit_towards_award', v=1)`, in the SQL and the unit test's inputs, as DEC-PRJ-02 asks of every consumer. Version 2 of `core_credit_towards_award` is drawn, not built: today only `core_credential` has two versions. |
| 11 | The lineage names Finance among who to tell. | `dbt ls --select core_credit_towards_award+ --resource-type exposure`, 6 October 2026: `census_dashboard`, `revenue_forecast`, `wallet_app`; `revenue_forecast` names Finance as its owner. |
| 11 | Finance can move out whole: its marts, its exposure, its seeds, its decisions, and the test and two analyses it was built with. | Finance's folders were named for it from commit 9731784. Its singular test and analyses are split by purpose first (`tests/reconciliation/`, `analyses/profiling/`, `analyses/validation/`), so they aren't under a path named for it; `docs/conventions.md`, *Splitting into projects*, names them, with the test's entry in `_reconciliation__tests.yml`. That row was added after the ten steps, in commit d6b2c4e, when the film was checked. What every domain shares becomes a package each project installs. |
| 12 | Ten steps, ten commits. | The ten Finance commits, 9731784 to 39cd815; the conventions fix (d6b2c4e) and the film's own commits follow them. To replay: `git checkout <commit>` in the project, then `dbt build`. At 254da73 the build fails on purpose. |
| 12 | Three open items, and the file that held them. They're gone. | Q-FIN-01 (opened in 8e325c8, deleted in ea693b7), REQ-FIN-02 (ea693b7 to 254da73), REQ-FIN-01 (9731784 to 4efec1f), and `_finance__requirements.yml` (deleted in 4efec1f). |
| 12 | Every file has a home; every file has a lifetime. | `docs/conventions.md`: *Domains*, *Folders*, *File lifecycles*. |

Sources for chapter 1:

- John Harvey, "The tracing floor in York Minster", *Fortieth Annual Report of the Friends of York Minster*, 1968: the floor, and the Lady Chapel aisle windows' tracery.
- Arnold Pacey, *Medieval Architectural Drawing: English Craftsmen's Methods and Their Later Persistence (c. 1200–1700)*, Tempus, 2007: tracing floors, templates, and the York drawings matched to St Michael-le-Belfrey.
- [The tracing floor](https://www-users.york.ac.uk/~arch40/plasterfloor.htm) and [The Masons' Loft in York Minster](https://www-users.york.ac.uk/~arch40/masonsloftintro.htm), University of York; [Medieval Masons and Tracing-floors](https://drawingmatter.org/medieval-masons-and-tracing-floors/), Drawing Matter.
- Checked 6 October 2026 from published summaries; to confirm against Harvey's and Pacey's texts before release.

## Labs

| # | Lab | Kind | The mechanism people break |
|---|---|---|---|
| 1 | *Where does it go?* | sort | Ten things Finance's work touched into four homes: an application domain (`sources/<system>/`), a data domain (`models/core/<domain>/`), a business domain (Finance's folders), or shared (`models/_shared/`, `docs/`). The question, the rates, the forecast and DEC-FIN-03 are Finance's; the award code's description and credit towards an award are the core's; a source table and a key set are the system's; the map and the conventions are shared. |
| 2 | *Follow the question* | steps | Q-FIN-01 from the profile that found it to the SQL that applies it: opened in the register, answered by Finance, moved to a rule and DEC-FIN-02 (`was: Q-FIN-01`), deleted, proved by a unit test, built. The picture lights the file that holds it at each step. |
| 3 | *Ready to move out?* | count | Tick what Finance takes to a project of its own: its four folders, its reconciliation test and its two analyses (7), not its folders alone (4) and not the core and the shared map (9). |
| 4 | *How long does it live?* | sort | Twelve files and items into three lifetimes: written by hand and kept (the conceptual model, the decision log, LIM-FIN-01, the mart), generated (definitions, the physical diagram, `docs/decisions.md`, `key_sets.csv`, the map's drawing), or kept only while the work goes on (Q-FIN-01, the requirements file, a model's version 1). |

## Scenarios

Eight situations, in this order.

1. **Choose.** Someone wants to copy Finance's backlog tickets into `requirements/`. (Keep the work in the backlog tool; `requirements/` holds only what's open about the data, and links to the ticket.)
2. **Choose.** Finance sends its tuition rates. Where do they go? (`seeds/reference/finance/`, owned by Finance: models read reference data. Not `seeds/expected/`, which no model may read; not a CASE in the SQL.)
3. **Spot the problem.** REQ-FIN-02 is done, and kept in the file with `status: done`. (Delete it: CI's check fails on it, and its lasting part, the contract, is already in its home.)
4. **Spot the problem.** A fix made by hand in `_finance__definitions.md`. (It's generated: fix the conceptual model and run the script; CI fails otherwise.)
5. **Spot the problem.** Finance's answer written into the register, the question marked answered. (The answer lasts: a rule in the conceptual model and DEC-FIN-02 with `was: Q-FIN-01`; then delete the question.)
6. **Choose.** Finance's own project: just `models/marts/finance/`? (Its four folders, its test and its two analyses, as the conventions list them; it refs the public core across projects, never a copy.)
7. **Choose.** A version 2 of `core_credit_towards_award`, with a date for version 1. What happens to Finance's pinned mart today? (Nothing breaks: dbt warns with the date, lineage names Finance among who to tell, and Finance chooses when to move.)
8. **Order.** Student services asks a new question. Put the first six steps in order: scope, source reality, consumer output, gaps and contracts, tests, build.

## Pause and think

`question`, `output`, `ship`, `evolve` (the questions and answers are in [Pause and think](#pause-and-think) above).

## Decisions taken

| Date | Decision |
|---|---|
| 6 October 2026 | A closing film follows one new consumer, Finance, through the ten steps in the real project, one commit per step, so every card is a file as its commit left it and the script links each commit. Finance's question is *tuition forgone*: how much tuition recognised credit saves learners, by faculty, as at census date. The university's planned data domain `finance` is renamed `fees`, so the new business domain can take the name. |
| 6 October 2026 | The opening is York Minster's tracing floor: drawings made for the work and drawn over, and the windows that stayed, for the two kinds of file the film is about. About 9 minutes, in twelve chapters: the floor, one chapter per step, and the whole building. Film 9 is no longer the closing film. |
| 6 October 2026 | After checking the film against the project: the chapter on moving out first said "every Finance file lives under a path named for it… Nothing else needs untangling". Finance's test and analyses are split by purpose first, so they aren't. The lines became "And because Finance's folders were named for it from the first commit, Finance can move out to a project of its own, whole." and "Its marts, its exposure, its seeds, its decisions, and the test and two analyses it was built with.", and `docs/conventions.md` now names each domain's tests and analyses (commit d6b2c4e). |
| 6 October 2026 | Only command output keeps the label `runs on dbt Core · DuckDB`; file cards drop it, since every card here is a project file and the ledger names its commit. |

## Open

1. **Chapter 1's facts.** Confirm against Harvey (1968) and Pacey (2007) that the York drawings are full size, and how many layers of plaster the floor has.
2. **Tests and analyses by domain.** The conventions split folders "by purpose first, then by domain", but `tests/reconciliation/` and `analyses/validation/` aren't split by domain yet, for Planning or Finance; the conventions list them instead. Splitting them would change cards in films 2 to 8.
3. **Voice.** Check "York Minster", "dee bee tee", "see eye" and "sixty-seven thousand, eight hundred" by ear.
