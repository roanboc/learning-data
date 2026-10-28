# Governance you can use

*The third series on data governance.*

What the university decided in *Governance principles* ([`../data-governance/`](../data-governance/)), and what Noor's map drew in *Governance on the map* ([`../governance-on-the-map/`](../governance-on-the-map/)), is built here, where the work happens, with dbt and Databricks. Each film builds one of the map's flows, names the films it expands, and shows the files and screens a practitioner uses: owners, contracts and checks in the dbt project; access, tags, masks, lineage and audit on the platform; one meaning, read by people, reports and agents; quality rules and monitoring that tell each owner; data products and contracts in open formats; and a marketplace where people find data and ask for it.

**Status:** planned on 28 October 2026, from films 14 to 19 of the plan for data governance; its six scripts are being written. On the site, it sits under the topic *Data governance*, after *Governance on the map*, and gets its page at `governance-in-practice/` when its opening film is out. The plan is in the [proposal](proposal.md).

## The films

<!-- films: made by site-tools/build_series.py's readme() -->
| Film | Topic | Length | Chapters | Pause and think | Script |
|---|---|---|---|---|---|
<!-- /films -->

## How the films are made

Like *Governance principles*, in its watercolour and its university, with its people and places: each film bundles that series' shared code, [`../data-governance/shared/`](../data-governance/shared/), as it is, and keeps what's its own in its own folder. Every file on screen is a real one, from the example dbt project, which stays in [`../data-governance/project/`](../data-governance/project/) (the films' pages link to it there), or from Databricks. Product names and their maturity are checked on the day each film is made, and a feature in preview is called one.
