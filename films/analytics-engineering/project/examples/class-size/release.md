# Who approved it, who merged it, who released it

*"Plan each unit's classes from its own class size", from its first push to production, as GitHub and Databricks
record it. Times are the university's.*

## The pull request, Tuesday 3 November 2026

| Time | Who | What |
|---|---|---|
| 09:12 | `planning-agent[bot]` | Opened the pull request from `agent/planning/class-size`: the first push |
| 09:31 | GitHub Actions | `build` and `databricks-parse` passed ([`checks.txt`](checks.txt)) |
| 09:44 | `governance-review-agent[bot]` | Reviewed it: **Comment**, for reference ([`governance_review.md`](governance_review.md)) |
| 10:20 | Jun Park, analytics engineer | Approved: the code |
| 10:52 | Mei Tanaka, data owner | Approved: the word it copies |
| 11:05 | Clara Jensen, product owner | Replied to the finding, yes; approved: the change |
| 11:24 | `planning-agent[bot]` | The second push: the warning. The three approvals before it were dismissed |
| 11:43 | GitHub Actions | Both checks passed again, with one warning, the 31 units |
| 13:40 | Jun Park | Approved again: the code |
| 14:02 | Clara Jensen | Approved again: the change |
| 14:15 | Mei Tanaka | Approved again: the word it copies |
| 15:10 | Jun Park | Merged it into `main`, squashed. The agents don't merge |

What the rules on `main` asked for, and who gave it, each from their role on the map
([`../../review-and-release/`](../../review-and-release/README.md)):

- **A code owner's approval for each file:** Jun Park, for the model, its tests and the doc block; Mei Tanaka, for
  `_planning__conceptual.yml`.
- **A product owner's, for Planning's marts:** Clara Jensen, of `product-owners`.
- **A data owner's, for Planning's meanings:** Mei Tanaka, of `data-owners`.
- **The most recent push approved by someone who didn't push it:** the second push was the planning agent's; all
  three approvals of it are people's.
- **Not counted:** the governance review agent's review, a comment. An agent's approval would never count, since
  every rule that asks for one names people or teams.

## The release, Tuesday night and Wednesday morning

The release's run on the schedule, Tuesday 3 November 2026 at 23:00, on `main` as Jun merged it.

| Time | Job | What |
|---|---|---|
| Tue 23:00 | `test`, environment `test` | Signed in to Databricks as "release test", with no secret; deployed the bundle to the target `test`, and ran the build in the test catalog |
| Tue 23:38 | `test` | Passed: every test, with the one warning, the 31 units |
| Tue 23:38 | `production`, environment `production` | Waiting for a review: one of `release-approvers` |
| Wed 08:46 | Noor Rahman, release approver | Approved the deployment to `production`. She didn't start the run, so *Prevent self-review* let her |
| Wed 08:47 | `production` | Signed in to Databricks as "release", with no secret; deployed the bundle to the target `production`, and ran the build |
| Wed 09:21 | `production` | Passed. The class plan in production: 1,236 units, 3,477 classes |

## On Databricks

What the workspace's audit log shows for Wednesday's release:

- **Who signed in:** the service principal "release", through workload identity federation, from a job of
  `uni-example/credentials` in its environment `production`. No secret was used: none exists for it.
- **Who deployed:** the same identity, into its own folder, `/Workspace/Users/<release>/.bundle/credentials/production`.
- **Who the build ran as:** "release" (`run_as`), which builds in the production catalog. The planning agent's own
  service principal only read production, before and after.

## What changed for the faculties, from Wednesday

The new class plan: 263 more classes, in 161 units, and a place in a class for every student expected. And their
list of the 31 units with no class size, every night, in the build's audit schema, and in their issue, until each
unit's school sets one.
