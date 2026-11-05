# Data as software

*Proposal for the second series of the module Modern data basics: two films on running a data platform, which the author wants kept light because it's no longer new. Planned on 5 November 2026 from the module's plan, [`../data-that-moves/proposal.md`](../data-that-moves/proposal.md), which holds the brief, the reference, the insights, the advice, the world, the people, the look and the sound the four series share; this file holds what is this series' own. Status: agreed; the films are being made, one at a time, in order.*

## Decided

<!-- decided: made by site-tools/build_series.py from decided.md, the series' and each film's -->
| Date | Decision |
|---|---|
| 5 November 2026 | *Data as software* (*Datos como software*), the second series of *Modern data basics*, is two films: *Scripts became software* and *A platform that watches itself*, in `films/data-as-software/`, at `data-as-software/` on the site, with its page once its opening film is out; its cards say "Film N of 2". *Data that moves* comes before it; *From tables to decisions* follows. The module's plan, its rules and its world are in `films/data-that-moves/proposal.md`. |
| 5 November 2026 | Light, as the author asked: "running the platform: again don't want to focus on this but the principles are around bringing software engineering practices to data, something already know but lacked for decades until tools like dbt and vendors realized scripts had to be better maintained as software. That's no longer new and that's why I don't want to give it much relevance, state Databricks bundles and zero ops". The series' thread: payroll's export to Finance, a script on one person's laptop for years, moved into the example project, versioned, reviewed, tested and deployed with Declarative Automation Bundles; then a night when the job that loads the approved claims fails, and Genie ZeroOps finds the cause and proposes a fix, which Sam Okafor reviews before pay day. The agent proposes and a person approves, as the agent films set it; the films build on *In the weeds of data crafting* and *Change without surprises* and don't teach them again. |
<!-- /decided -->

## The brief

The author, 5 November 2026: "running the platform: again don't want to focus on this but the principles are around bringing software engineering practices to data, something already know but lacked for decades until tools like dbt and vendors realized scripts had to be better maintained as software. That's no longer new and that's why I don't want to give it much relevance, state Databricks bundles and zero ops".

So the series is two short films. The first shows data work kept as software (versioned, reviewed, tested, deployed the same way every time) and says it isn't new: it's how "nothing reaches production without a person" still works once agents write code too. The second shows a platform that watches its own jobs, pipelines and tables, finds the cause of a failure and proposes a fix, which a person reviews. Both point to the official docs and to the films that go deeper: *In the weeds of data crafting* for the project, *Change without surprises* for review before release, and the agent films for agents that propose and never approve.

## The films

| # | Folder | Film (working title) | What it shows | The idea to take away |
|---|---|---|---|---|
| 1 | `1-scripts-became-software` | Scripts became software | Payroll's export to Finance, a script on one person's laptop for years, moved into the example project: in Git, reviewed in a pull request, tested with dbt before it runs, deployed with Declarative Automation Bundles the same way to test and to production | Data work is software. |
| 2 | `2-a-platform-that-watches-itself` | A platform that watches itself | One night the job that loads the approved claims fails. Genie ZeroOps finds it, traces the cause through lineage, says what it touches, and proposes a fix on a branch; Sam reviews it, and a second person approves it, before pay day | The platform proposes; a person approves. |

Each opens with a story from outside data, in the four beats said outright: double-entry bookkeeping, as Luca Pacioli set it down in Venice in 1494, and the 1202 alarm on Apollo 11, on 20 July 1969 (the module's `openings.md`).

## Rules from the plan

The module's rules hold (`../data-that-moves/proposal.md`, *Rules from the plan*): light on purpose and pointing to the docs; no release status in a film; the tools named as their docs name them on the day; an agent proposes and a person approves; the fictional university; Spanish as captions and pages only.
