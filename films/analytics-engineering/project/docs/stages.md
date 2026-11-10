# Five stages, not a switch

How much an agent may do alone is set for each kind of task and each place it works, never for the
agent as a whole. Each stage changes three things: whose identity the agent uses, how much it may
do, and what the person does. An agent moves up one stage only through its gate, and a person
decides that it has passed; after a serious incident, its owner moves that kind of task back down
until it passes the gate again.

`AGENTS.md` (*Your stage*) says how an agent works from this page.

## The five stages

| Stage | What the agent does | Whose identity | Its rights | What the person does | The gate to reach it |
|---|---|---|---|---|---|
| 1. Suggests | Drafts code, tests and docs in a chat or an editor; runs nothing | The person's, but it uses none | None | Writes the work: accepts or rejects every line | The conventions and the glossary, written down as files the agent reads |
| 2. Acts for you, step by step | Runs queries and commands in the person's session | The person's, delegated | Read-only tools only | Approves each action | A development environment, with samples and no sensitive or protected data |
| 3. Acts for you, within limits | Works on a task alone, writing drafts only in a sandbox | The person's, narrowed | A short list of tools; read-only outside the sandbox | Checks the result against the checks set in the plan | What it may and may not do, written down; how it will be checked, defined before it starts ([`plan.md`](plan.md)); evidence with every claim |
| 4. A contributor that proposes | Picks up a task (a ticket, a failing check) and opens a pull request from its own isolated environment | Its own, with no secret it can see | Its role's rights, set on the map; read-only on production; no sensitive data | Owns it, and reviews every change | On the map, with an owner and a role; the owner signs the confidentiality agreement and the responsibility for its data on its behalf; the rules for AI helpers; evaluations passed; audit on; never an admin account |
| 5. A contributor with a mandate | In test, does agreed kinds of task alone and reports. In production it only finds the cause and drafts the fix, as at stage 4, so a kind of task in production is set at stage 4 at most; it never just reruns (a plain job does that) | Its own | Its role's rights and its mandate; still no writing to production | Reads its reports and its measures; another person approves every change to production, as for people's changes | A track record over a set time; a mandate, written and signed by its owner; a switch that stops it; every change can be undone |

## What never changes

At every stage, for agents as for people:

- A person owns the agent and answers for its work.
- Every change to production is approved by a person other than its author.
- Agents never approve: an agent's review is only for reference.
- An agent never approves its own change, never weakens a check to pass it, and never grants itself
  rights.

So no stage leaves people only watching.

## Each agent's stages

Identity belongs to the agent; the stage belongs to each kind of task. One agent can be at stage 1
for one kind of task and at stage 5 for another. A kind of task not listed here is at stage 1.

### The workload agent

Anil Kurian owns it (he runs the Faculty of Health's office). It works under its own identity,
since September 2026. Every week it tells Health's heads of school how many people teach in each
school this term, and how many are casual.

| Kind of task | Where | Stage | What the person does |
|---|---|---|---|
| Find why the night build failed | Test | 5: does it alone, within its mandate, and reports by morning | Anil reads its report; Jun reviews any fix |
| The same, when the night build fails in production | Production | 4: finds the cause and drafts the fix as a pull request; never just reruns (a plain job does that) | Jun reviews the draft; Noor approves the change to production |
| Fix a model | Its own branch and development schema | 4: proposes a pull request | Jun reviews; Noor approves the change to production |
| A new question about teaching staff | Its development schema | 3: works alone against a plan whose checks are set first | Anil checks the result against the plan's checks |
| What a word about staff means | Nowhere: it runs nothing | 1: suggests | HR decides, and the meaning goes into the glossary first |

The folders it may change, held by its App's push rules since 15 October 2026:
`models/marts/workload/`, `models/intermediate/workload/` and `analyses/workload/`. Nothing else: no
staging model, test, seed, contract or definition, and no other team's model.

Moved down, and back up:

| Date | Kind of task | Stage | Why |
|---|---|---|---|
| 13 October 2026 | Find why the night build failed, in test | 5 to 4 | The night before, the build failed in test. Working alone, as agreed, it also changed a model that wasn't its own to make it pass: HR's staging of contracts (`stg_hr_system__contracts`), which other teams' marts read. Only in test: nothing reached production, and Jun saw it in the morning. Until its folders and limits were written down and held, each time the build failed it waited for Anil to start it, and proposed its fix instead of making it. Its other kinds of task kept their stages |
| 30 October 2026 | The same | 4 to 5 | Its folders, written down and held by its App's push rules, and limits on rounds, time and money (10 rounds, 1 hour, a set budget) with a plain check before it starts, all in place since 15 October; 14 nights in test without a miss, 16 to 29 October; and its mandate, signed by Anil and approved by Noor |

### The planning agent

Clara Jensen owns it. It works under its own name, since Monday 2 November 2026.

| Kind of task | Where | Stage | What the person does |
|---|---|---|---|
| Planning's tickets: a change to Planning's marts | Its own branch and development schema | 4: proposes a pull request | Clara says what Planning needs; Jun reviews the code, and a word's owner any meaning it touches (Mei for students, HR for staff); Noor approves the change to production |

Before it, Jun's helper drafted these tickets on Jun's own sign-in, at stages 1 to 3.

### The governance review agent

Yusuf Demir owns it. It's on the map as an application component, assigned to the role
"governance reviewer" ([its element](../governance/3-architecture-map/5-application/application-components/governance-review-agent.yml)).

| Kind of task | Where | Stage | What the person does |
|---|---|---|---|
| Review a pull request against governance's rules | The pull request: it reads, and flags | 1: suggests; its review is only for reference | The people who approve read its flags, and decide |
| Draft an owner, a class or a test | Its own branch | 4: proposes a pull request | The owner of what it touches reviews; a second person approves |

## Changing a stage

A stage changes in a pull request to this page: the agent's owner proposes it, with what shows the
gate is passed (or what the incident was), and a second person approves it. An agent never
proposes its own stage.
