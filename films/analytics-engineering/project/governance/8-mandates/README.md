# Mandates

A mandate is one page that says the one kind of task an agent may do alone, and where: its task, the folders it may change, the checks it runs, its limits on rounds, time and money, a switch that stops it, and a way to undo each change. An agent works alone only within one. Anything a mandate doesn't give it, it asks for, as at any lower stage ([`docs/stages.md`](../../docs/stages.md): the five stages and their gates).

| File | Agent | Task | Owner | Status |
|---|---|---|---|---|
| `workload-agent.yml` | workload agent | find why the night build failed, in test | Anil Kurian, Faculty of Health | in force since 30 October 2026 |

## On the map

A mandate is a requirement, as Noor's map writes a rule with its home: what must be true, and what holds it. ArchiMate has no element for an agent's mandate, so it's kept here, with the project's governance, and named on the map where it applies: on the agent's assignment to its role, beside its stage for the task it covers (`governance/3-architecture-map/`). The stage says how far the agent may go; the mandate says what, exactly, it may do at stage 5.

## Signed, approved, read again

- **Signed** by the agent's owner, the person who answers for what it does, once its track record is in (for the workload agent, 14 nights in test without a miss).
- **Approved** by a second person who isn't its owner: the data architect, for the workload agent.
- **Read again** each December, with the access review (`docs/databricks-governance.md`, *7. The access review*).
- **Narrowed or withdrawn** by its owner at any time, in a pull request. The task then moves down a stage and waits for its owner again.

## Held by the tools

A page is only words, so each line is held where the work happens, written from the map like every right:

| Line | Held by |
|---|---|
| Where it writes | Unity Catalog's grants, to its role's group: in test, schemas of its own; in production, nothing, it reads |
| Its folders | Its GitHub App's push ruleset, which blocks every path but its folders' model and analysis files (`review-and-release/rulesets/workload-agent-folders.json`): not a test, a seed, a contract or a definition, which live in the YAML beside its models |
| The hour | Its run's timeout in GitHub Actions |
| Its rounds | The plain code that runs it, which counts them and stops at the limit |
| Its budget | A rate limit in Unity Gateway on its own service principal, in tokens a minute. With the hour, that caps a night. A gateway budget is set monthly and doesn't promise a cap, so the mandate doesn't lean on one |
| The plain check | Its run's first step: has tonight's copy arrived? If not, nothing starts |
| The switch | Its service principal deactivated in Databricks, and its App's installation suspended in GitHub |
| The undo | A pull request reverted with another; a table restored to a version before |

`scripts/check/mandates.py` reads each mandate and fails when a place that holds a line allows more than the page: a grant, a rule, a timeout or a limit. It runs on every pull request, so nothing that widens what an agent may do merges without it. The pages live in `governance/`, where no agent's App can push: neither the agent nor anything it reads can widen its own mandate.

## What stays a person's

Even at stage 5, an agent only drafts in production: people review the code and approve the change. What a word means stays its owner's: a question of meaning goes to them, and the agent changes nothing. A night that only needs to run again needs no agent: a plain job reruns it.

*The workload agent's sixth night under its mandate is told in `examples/night-in-test/`, as* A mandate, written and enforced *tells it.*
