# Governance you can use

*The third series on data governance.*

What the university decided in *Governance principles* ([`../data-governance/`](../data-governance/)), and what Noor's map drew in *Governance on the map* ([`../governance-on-the-map/`](../governance-on-the-map/)), is built here, where the work happens, with dbt and Databricks. Each film builds one of the map's flows, names the films it expands, and shows the files and screens a practitioner uses: owners, contracts and checks in the dbt project; access, tags, masks, lineage and audit on the platform; one meaning, read by people, reports and agents; quality rules and monitoring that tell each owner; data products and contracts in open formats; and a marketplace where people find data and ask for it.

**Status:** planned on 28 October 2026, from films 14 to 19 of the plan for data governance, with its six scripts written the same day. Its opening film, *Governed in dbt*, film 2 of 6, *Governed in Unity Catalog*, film 3 of 6, *Meaning on the platform*, and film 4 of 6, *Quality on the platform*, were made on 28 October 2026, and film 5 of 6, *Products in open formats*, on 29 October; the last is made next. On the site, it sits under the topic *Data governance*, after *Governance on the map*, at `governance-in-practice/`. The plan is in the [proposal](proposal.md).

## The films

<!-- films: made by site-tools/build_series.py's readme() -->
| Film | Topic | Length | Chapters | Pause and think | Script |
|---|---|---|---|---|---|
| [Governed in dbt](https://data.learn-all.org/governance-in-practice/governed-in-dbt/) | Governance in the code | 6 min | 9 | 3 questions | [script](1-governed-in-dbt/script.md) · [source](1-governed-in-dbt/source/README.md) |
| [Governed in Unity Catalog](https://data.learn-all.org/governance-in-practice/governed-in-unity-catalog/) | Access, masks and audit | 6 min | 9 | 3 questions | [script](2-governed-in-unity-catalog/script.md) · [source](2-governed-in-unity-catalog/source/README.md) |
| [Meaning on the platform](https://data.learn-all.org/governance-in-practice/meaning-on-the-platform/) | Glossary and metrics | 6 min | 9 | 3 questions | [script](3-meaning-on-the-platform/script.md) · [source](3-meaning-on-the-platform/source/README.md) |
| [Quality on the platform](https://data.learn-all.org/governance-in-practice/quality-on-the-platform/) | Quality checks and monitoring | 6½ min | 9 | 3 questions | [script](4-quality-on-the-platform/script.md) · [source](4-quality-on-the-platform/source/README.md) |
| [Products in open formats](https://data.learn-all.org/governance-in-practice/products-in-open-formats/) | Open standards | 6 min | 9 | 3 questions | [script](5-products-in-open-formats/script.md) · [source](5-products-in-open-formats/source/README.md) |
<!-- /films -->

## How the films are made

Like *Governance principles*, in its watercolour and its university, with its people and places: each film bundles that series' shared code, [`../data-governance/shared/`](../data-governance/shared/), as it is, and this series' own pictures, painted once for its six films, in [`shared/src/tools.js`](shared/src/tools.js) (files as paper sheets, a pull request's checks, a tool's page as a form, the board with the series' six cards, the poster's pins, the agent's star), and keeps what's its own in its own folder. Every file on screen is a real one, from the example dbt project, [`../analytics-engineering/project/`](../analytics-engineering/project/), with the additions the plan gave it for governance, or from Databricks. Product names and their maturity are checked on the day each film is made, and a feature in preview is called one.
