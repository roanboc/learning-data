# Review and release

Every change to the project reaches production the same way, whoever makes it, a person or an agent: a pull
request, checks on what changed, a review for reference, the approval of the people the map names, a merge into
`main`, a night in test, and a release that a second person approves. Agents propose: they open pull requests from
their own branches, and an agent may review one, for reference. Only people approve, and only a person's yes
releases.

The rules live here as files, so a change to them is reviewed like any other. GitHub runs none of them from here:
this project sits inside a bigger repository, as `CODEOWNERS` does. In the project's own repository, each goes where
*Setting it up* says.

| File | What it is |
|---|---|
| `rulesets/main.json` | The ruleset on `main`, as GitHub exports one |
| `test.json`, `production.json` | The environments `test` and `production`, each as the body of GitHub's REST call that sets it |
| `release.yml` | The release, every night at 23:00 or when a person starts it: it builds `main` in test; only if test passes does it go on to production, where it waits for a release approver, then signs in to Databricks with no secret, deploys the bundle (`../databricks.yml`) and runs the build |
| `teams.yml` | GitHub's teams that the rules name, written from the roles on the map by `../scripts/generate/codeowners.py`. Don't edit it |

`../examples/class-size/` follows one change through all of it: the planning agent's first pull request.

## What each rule stops

| Rule | What it stops | Where it's set |
|---|---|---|
| Every change comes as a pull request: nobody pushes to `main`, deletes it or rewrites its history | A change nobody read | The ruleset (`pull_request`, `deletion`, `non_fast_forward`) |
| Nobody may bypass the rules, not even an administrator | A rule skipped in a hurry | The ruleset: its bypass list is empty |
| One approval, and a code owner's for each file the change touches | A change only its author read | The ruleset (`require_code_owner_review`), with `../CODEOWNERS` |
| Nobody approves their own pull request | A change approved by whoever wrote it | GitHub itself: a pull request's author can't approve it |
| The most recent push is approved by someone who didn't push it | A change slipped in after the approval, or approved by whoever pushed it | The ruleset (`require_last_push_approval`) |
| A new push dismisses the approvals before it | An approval of code that has since changed | The ruleset (`dismiss_stale_reviews_on_push`) |
| Every conversation is resolved | A question left unanswered | The ruleset (`required_review_thread_resolution`) |
| A product owner approves a change to Planning's marts | A data product changed without its owner saying yes | The ruleset's required reviewer rule: `product-owners`, on `models/marts/planning/` |
| A data owner approves a change to what a student, a course or a person means, and to Planning's meanings | A word's meaning changed without its owner | The ruleset's required reviewer rule: `data-owners`, on the four conceptual models |
| A data governance lead and a data custodian both approve a change to these rules, the release, the bundle, `CODEOWNERS`, `AGENTS.md`, `agents/`, the owners, or who holds a role on the map | A rule loosened, or an approver changed, in the same change that relies on it | The ruleset's required reviewer rule: `data-governance-leads` and `data-custodians`, on those files |
| CI's checks pass, on a branch that's up to date with `main` | A change that breaks the build, or only worked on an older `main` | The ruleset (`required_status_checks`, strict), from GitHub Actions only |
| Merging doesn't release: each night the release builds `main` in test first, and goes on only if test passes | A change in production that fails on the night's data | `release.yml`: its job `production` needs its job `test` |
| Production waits for a release approver | A change in production that no second person saw | The environment (`production.json`, `reviewers`) |
| Whoever started the release can't approve it, even a release approver | One person releasing their own change | The environment (`prevent_self_review`) |
| Not even an administrator skips the release approver | A release forced through in a hurry | The environment's settings: *Allow administrators to bypass configured protection rules*, cleared |
| Only `main` deploys, to test and to production | A branch released before its review | Each environment's one deployment branch, `main` |
| The release signs in to Databricks with no secret, and only from its own environment's job | A secret that leaks, or another job writing to test or production | The federation policy on each of the release's two service principals: this repository's jobs in `test`, or in `production`, and nothing else |
| Test and production are deployed from `main` only, and their job runs as the release | A deploy from a branch, or a build under someone else's rights | `../databricks.yml` (`mode: production`, `git.branch: main`, `run_as`) |
| The release builds production; the agents only read it | An agent changing production | Grants on Databricks: the release builds in the production catalog, and the agents' groups only read it (`../AGENTS.md`, *Your access*) |

## Who approves what

People only, each from their role on the map (`../governance/3-architecture-map/3-business/`). After a pull
request, every step of *change a data product* is a person's: the analytics engineer reviews the code, the product
owner approves the change, and the release approver releases it. What a word means stays with its data owner. The
planning contributor's steps end at the pull request.

| A change to | Approved by |
|---|---|
| Any file | One of its code owners (`../CODEOWNERS`, written from the owners in the project's metadata): the analytics engineer for the code, Jun Park today |
| Planning's marts (`models/marts/planning/`) | A product owner, too: Clara Jensen |
| What a student, a course or a person means (`_student__conceptual.yml`, `_course__conceptual.yml`, `_person__conceptual.yml`), and Planning's meanings (`_planning__conceptual.yml`) | A data owner, too: Mei Tanaka |
| These rules, the release, the bundle, `CODEOWNERS`, `AGENTS.md`, `agents/`, the owners register, the map's people and roles, and the scripts that write `CODEOWNERS`, the teams and the agents' settings | A data governance lead and a data custodian, too: Yusuf Demir, and the platform team |
| What runs in production | A release approver who didn't start the release: Noor Rahman, today |

An owner is a person or a team of people. `CODEOWNERS` names people and teams, and the required reviewer rule and
the environment name teams. A GitHub App can't be in a team, and the map gives these roles only to people:
`codeowners.py` stops if it gives one to an agent. So no approval these rules ask for can come from an agent, and an
agent's approval never counts. When Jun opens a pull request, the same rules ask someone else to approve it.

## The governance review agent, in GitHub

`governance-review-agent[bot]`, Yusuf Demir's, reviews each pull request that changes models, sources, seeds or
conceptual models, following `../skills/review-for-governance/`. It's a GitHub App of its own, set up by the
platform team the same way as the planning agent's, and installed on this one repository with three permissions:
Contents, read; Pull requests, read and write, to post its review; and Checks, read, to read what CI ran. Every App
also has Metadata, read. It can't push, so it changes no file and merges nothing. Its token comes from the platform
team's token service, for this one repository and those permissions, and ends after an hour. It reads what CI ran
and builds nothing, so it has no identity in Databricks.

Its review is a comment, for reference. By its rules it never approves and never requests changes, so it never
blocks: each finding says who decides, and a person does. GitHub would let an App with these permissions approve,
but its approval would count for nothing, since every rule here that asks for an approval names people or teams.

Its settings are said here, in words. `../scripts/generate/agents.py` writes a folder in `../agents/` only for an
agent whose role has steps on the map, and the governance reviewer's role has none yet.

## The teams

The ruleset and the environment name GitHub's teams by id, as GitHub exports them. `teams.yml` is written from the
map: one team for each role whose people approve, with the people the map assigns to it. So someone who takes over
a role on the map takes over its team, and its reviews. The ids are this example's; in your organisation, put your
teams' (`gh api orgs/<org>/teams/<team> --jq .id`) in `TEAM_ROLES`, in `../scripts/generate/codeowners.py`, and in
the files here: the script stops if a file here names a team it didn't write. A team's approval counts only if the
team has write access to the repository.

| Team | Its role on the map | Who, today | Id in the files |
|---|---|---|---|
| `product-owners` | product owner | Clara Jensen | 7300101 |
| `data-owners` | data owner | Mei Tanaka | 7300102 |
| `release-approvers` | release approver | Noor Rahman | 7300103 |
| `data-governance-leads` | data governance lead | Yusuf Demir | 7300104 |
| `data-custodians` | data custodian | The platform team, Sam Okafor's | 7300105 |

A team on the map, such as the platform team, means its people: each joins with their own GitHub account. One team
for each role is enough while each role has one person or team in it; with more product owners, give each data
product's owners a team of their own, so only Planning's owner approves Planning's marts.

## Merging isn't releasing

An agent doesn't merge: its rules say so (`../AGENTS.md`). GitHub's rules stop anyone pushing to `main`, and make
sure every approval they ask for comes from a person; but no rule GitHub documents takes the merge alone away from
an App that may push to its own branches. So the line that holds comes next: a merge into `main` only waits for the
night's release. At 23:00 the release builds `main` in test, as its test identity. Only if that passes does its job
`production` start, and it waits at `production` until a release approver who didn't start the run says yes. Until
then the job doesn't run, and without it nothing can sign in to Databricks as the release.

A person may also start the release by hand, after a fix, say. It goes through test and waits for a release
approver all the same, and they can't approve it themselves.

## Setting it up in the project's own repository

1. **The teams.** Make each team in `teams.yml` in the organisation, each member with their own GitHub account, and
   give each team write access to the repository. Put their ids where *The teams* says.
2. **The ruleset.** In the repository's settings, under *Rules* and *Rulesets*, import `rulesets/main.json`. Or:
   `gh api -X POST repos/<owner>/<repo>/rulesets --input rulesets/main.json`.
3. **The environments.** For each of `test` and `production`:
   `gh api -X PUT repos/<owner>/<repo>/environments/<name> --input <name>.json`, then its one deployment branch:
   `gh api -X POST repos/<owner>/<repo>/environments/<name>/deployment-branch-policies -f name=main -f type=branch`.
   In `production`'s settings, clear *Allow administrators to bypass configured protection rules*: the REST call
   has no field for it.
4. **The release.** Copy `release.yml` to `.github/workflows/release.yml`. On each environment, set four variables,
   none of them secret: `DATABRICKS_HOST` (its workspace), `RELEASE_CLIENT_ID` (the application ID of its service
   principal), `CATALOG` and `WAREHOUSE_ID`. Each job reads its own environment's. The schedule is in UTC here, as the
   project's other schedules are; in yours, put your time zone in `timezone:`, an IANA name.
5. **On Databricks**, an admin makes two service principals, "release test" and "release", each with a federation
   policy for GitHub Actions: issuer `https://token.actions.githubusercontent.com`, audience the Databricks account's
   ID, and subject `repo:<owner>/<repo>:environment:test` for "release test", `repo:<owner>/<repo>:environment:production`
   for "release". Each gets what the build needs in its own catalog, and nothing in the other (`USE CATALOG` and
   `CREATE SCHEMA`, so it owns the schemas the build makes there), and joins `personal_data_readers`, since the
   identity that runs dbt must be in it (DEC-PRJ-13). No agent's group gets anything but reading.
6. **`CODEOWNERS`** goes in `.github/`, as its header says.

## What it needs

- An organisation on GitHub: teams, and the required reviewer rule, need one.
- An environment's required reviewers: on every plan for a public repository; for a private one, GitHub Enterprise.
- The Databricks CLI, 0.218.0 or above, for bundles.

## Sources, checked on 5 November 2026

- GitHub Docs: *Available rules for rulesets*; *About rulesets*; REST *Repository rules*; *About code owners*;
  *Approving a pull request with required reviews*; *Deployments and environments*; *Reviewing deployments*; REST
  *Deployment environments*; *Workflow syntax for GitHub Actions* (`on.schedule` and its `timezone`); the *OpenID
  Connect* reference.
- Databricks documentation: *Declarative Automation Bundles*; *Deployment modes*; *Specify a run identity*;
  *Substitutions and variables*; *dbt task for jobs*; *Enable workload identity federation for GitHub Actions*.
