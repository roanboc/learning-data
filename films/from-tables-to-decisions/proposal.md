# From tables to decisions

*Proposal for the third series of the module Modern data basics: three films on serving data to people, agents and systems. Planned on 5 November 2026 from the module's plan, [`../data-that-moves/proposal.md`](../data-that-moves/proposal.md), which holds the brief, the reference, the insights, the advice, the world, the people, the look and the sound the four series share; this file holds what is this series' own. Status: agreed; the films are being made, one at a time, in order.*

## Decided

<!-- decided: made by site-tools/build_series.py from decided.md, the series' and each film's -->
| Date | Decision |
|---|---|
| 5 November 2026 | *From tables to decisions* (*De las tablas a las decisiones*), the third series of *Modern data basics*, is three films: *Reports on demand*, *Define it once* and *More readers than people*, in `films/from-tables-to-decisions/`, at `from-tables-to-decisions/` on the site, with its page once its opening film is out; its cards say "Film N of 3". *Data as software* comes before it; *Documents as data* follows. The module's plan, its rules and its world are in `films/data-that-moves/proposal.md`. |
| 5 November 2026 | The focus the author set: "Reports can now be generated on demand, so switch the focus to deliver good data models and context as part of the semantic layer and let the users explore the data with the agents. Repetitive queries are the ones deserving dashboards, not trying to build complicated dashboards trying to [answer] every question as it was used to be done, and still is in many people minds." And: "Semantic models is the hype of just defining the basics of data which is known for decades but now finally coming to better standards and not isolated tool definitions". Unity Catalog's metric views are the way in, with dbt's Semantic Layer and Apache Ossie as the open standard; Kimball's facts and dimensions are referred to, as *Data modelling* teaches them. The series' thread: what casual teaching cost the Faculty of Health this semester, asked by Rohan Desai in Finance, answered on demand, defined once, and read by people, agents and systems alike. |
<!-- /decided -->

## The brief

The author, 5 November 2026: "from tables to decisions: same here, old way of doing things was serving data as reports but now there are more channels and consumers like agents and systems. Semantic models is the hype of just defining the basics of data which is known for decades but now finally coming to better standards and not isolated tool definitions [...]. This was software engineering applied to data artifacts including reporting artifacts. In Databricks metric views would be the good intro. Best way there is just go to official documentation and implement it." And later: "Reports can now be generated on demand, so switch the focus to deliver good data models and context as part of the semantic layer and let the users explore the data with the agents. Repetitive queries are the ones deserving dashboards, not trying to build complicated dashboards trying to [answer] every question as it was used to be done, and still is in many people minds."

So the series moves the work from reports to models and their context. People and agents ask for the answer they need; a dashboard is kept for the questions asked again and again; each measure is defined once, near the data, in a format other tools can read; and the same definitions serve every reader. Facts and dimensions are referred to, as *Data modelling* teaches them, never taught again. The series builds on two earlier films and names them: *Meaning machines can read*, which puts the semantic layer in the stack of meaning, and *Meaning on the platform*, which counted awards conferred once, as a metric view that reports, Genie One and an agent read. It takes the next step: from building reports to building models and their context, from one tool's definitions to open ones, and from people to every kind of reader.

## The films

| # | Folder | Film (working title) | What it shows | The idea to take away |
|---|---|---|---|---|
| 1 | `1-reports-on-demand` | Reports on demand | Rohan asks what casual teaching cost the Faculty of Health this semester, and gets it on demand from Genie, set up by the data team with trusted data, measures and rules; the figures asked every fortnight get one AI/BI dashboard | Ask for the answer; keep dashboards for the questions that come back. |
| 2 | `2-define-it-once` | Define it once | Casual teaching cost, counted three ways in three places, defined once as a Unity Catalog metric view with its owner and its words; the same idea in dbt's Semantic Layer and MetricFlow; Apache Ossie, the open standard that lets one tool's definitions travel to another | Define each measure once, in a format others can read. |
| 3 | `3-more-readers-than-people` | More readers than people | The one definition read by Genie, a dashboard, Finance's BI tools, an app and an agent, each with the reader's own rights; OpenSharing (formerly Delta Sharing) for a system outside the university | One definition, every reader. |

Each opens with a story from outside data, in the four beats said outright: the speaking clock (Britain, 1936), the kilogram, from one cylinder in a vault to a definition anyone can make (1889 to 2019), and the road signs of the 1968 Vienna Convention, now read by cars' cameras too (the module's `openings.md`).

## Rules from the plan

The module's rules hold (`../data-that-moves/proposal.md`, *Rules from the plan*): light on purpose and pointing to the docs; no release status in a film; the tools named as their docs name them on the day; an agent proposes and a person approves; the fictional university; Spanish as captions and pages only. The films name Microsoft and Power BI only as tools a reader uses, never as the subject.
