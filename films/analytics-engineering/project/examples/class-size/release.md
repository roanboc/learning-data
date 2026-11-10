# Who approved it, who merged it, who released it

*"Plan each unit's classes from its own class size", from its first push to production, as GitHub and Databricks
record it. Times are the university's.*

## The pull request, Tuesday 3 November 2026

| Time | Who | What |
|---|---|---|
| 09:12 | `planning-agent[bot]` | Opened the pull request from `agent/planning/class-size`: the first push |
| 09:31 | GitHub Actions | `build` and `databricks-parse` passed ([`checks.txt`](checks.txt)) |
| 09:44 | `governance-review-agent[bot]` | Reviewed it: **Comment**, for reference ([`governance_review.md`](governance_review.md)) |
| 10:20 | Jun Park, analytics engineer | Approved: the code, for the data team |
| 10:52 | Noor Rahman, data architect | Approved: `_planning__conceptual.yml`, which copies the glossary's words |
| 11:05 | Yusuf Demir, data governance lead | Replied to the finding, where the change and the glossary differ: yes |
| 11:24 | `planning-agent[bot]` | The second push: the warning. The two approvals before it were dismissed |
| 11:43 | GitHub Actions | Both checks passed again, with one warning, the 31 units. The impact report names who to tell: Clara Jensen, Planning, and the faculties |
| 13:40 | Jun Park | Approved again: the code |
| 14:02 | Noor Rahman | Approved again: `_planning__conceptual.yml` |
| 15:10 | Jun Park | Merged it into `main`, squashed. The agents don't merge |

What the rules on `main` asked for, and who gave it, each from their role on the map
([`../../review-and-release/`](../../review-and-release/README.md)):

- **A code owner's approval for each file:** the data team's, Jun Park, for the model, its tests and the doc block;
  the data architect's, Noor Rahman, for `_planning__conceptual.yml`.
- **The most recent push approved by someone who didn't push it:** the second push was the planning agent's; both
  approvals of it are people's.
- **Not counted:** the governance review agent's review, a comment. An agent's approval would never count, since
  every rule that asks for one names people or teams.
- **Not asked:** the owners. Mei Tanaka decided what *class size* means, in the glossary, before the change; Clara
  Jensen and the faculties were told what it touches. Owners don't review pull requests.

## The release, Tuesday night and Wednesday morning

The release's run on the schedule, Tuesday 3 November 2026 at 23:00, on `main` as Jun merged it.

| Time | Job | What |
|---|---|---|
| Tue 23:00 | `test`, environment `test` | Signed in to Databricks as "release test", with no secret; deployed the bundle to the target `test`, and ran the build there, in the catalog `test` |
| Tue 23:38 | `test` | Passed: every test, with the one warning, the 31 units |
| Tue 23:38 | `production`, environment `production` | Waiting for a review: one of `release-approvers` |
| Wed 08:46 | Noor Rahman, release approver | Approved the change for production: the deployment to `production`. The schedule started the run, not Noor, so *Prevent self-review* let the approval count |
| Wed 08:47 | `production` | Signed in to Databricks as "release", with no secret; deployed the bundle to the target `prod`, and ran the build |
| Wed 09:21 | `production` | Passed. The class plan in production: 1,236 units, 3,477 classes |

## On Databricks

What the workspace's audit log shows for Wednesday's release:

- **Who signed in:** the service principal "release", through workload identity federation, from a job of
  `uni-example/credentials` in its environment `production`. No secret was used: none exists for it.
- **Who deployed:** the same identity, into the bundle's folder, `/Workspace/Shared/.bundle/data_project/prod`.
- **Who the build ran as:** "release" (`run_as`, which the release sets in place of the platform's service
  principal), which builds in the production catalog, `university`. The planning agent's own service principal only
  read production, before and after.

## What changed for the faculties, from Wednesday

The new class plan: 263 more classes, in 161 units, and a place in a class for every student expected. And their
list of the 31 units with no class size, every night, in the build's audit schema, and in their issue, until each
unit's school sets one.
