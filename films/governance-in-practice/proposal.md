# Governance you can use

*Proposal for the third of the three series of data governance: governance made operational and useful with dbt and Databricks. Planned on 28 October 2026 from films 14 to 19 of the plan for data governance, [`../data-governance/proposal.md`](../data-governance/proposal.md), which the author approved on 23 October 2026. That plan holds the brief, the reference and its alternatives, the insights, the world, the people and the facts the three series share; this file holds what is this series' own. Status: its scripts are being written.*

## Decided

<!-- decided: made by site-tools/build_series.py from decided.md, the series' and each film's -->
<!-- /decided -->

## The brief

From the author, 28 October 2026: "Also, for data governance we should have 3 series in the data governance pack, the first one for data governance principles, the second one to architect it within the organizational map, and the third one making it operational and useful (beyond the policies)". This is the third.

The part of the plan it comes from, as its brief records the author's words of 16 October 2026: films on the tools, specifically Databricks and dbt, that implement the governance elements, expanded from the films they reference, with data products and a marketplace in open formats, such as Databricks' Ontos. And from 21 October 2026, the reasons come first, so no technical file or screen appears before this series.

## The reference

The plan's, with the rule every series keeps: tools show, they don't lead. Each film starts from a decision the first two series made and shows where it runs: dbt writes and tests the recipes; Databricks runs, stores and governs.

## The films

| Film | Expands | What it builds | The idea to take away | In the plan |
|---|---|---|---|---|
| *Governed in dbt* | *Off the shelf*, *Who decides*, *Change without surprises*, *An agent that checks*, *Teachers of data*, *Where each piece lives* | Owners, terms and classes on models and columns; who may build on what; contracts, versions and the uses each model has; the governance check, and the reviewers made from the owners | The project carries governance with the code. | [14](../data-governance/proposal.md#14-governed-in-dbt) |
| *Governed in Unity Catalog* | *Who may see it*, *Who decides*, *Where each piece lives* | Access for groups with end dates, tags set from the project's classes, one rule that masks by tag, lineage and the audit log | The platform enforces what the metadata says. | [15](../data-governance/proposal.md#15-governed-in-unity-catalog) |
| *Meaning on the platform* | *One word, one home*, *Who does what, end to end*, *Where each piece lives* | A term in the platform's glossary, linked to the tables that hold it, and one shared definition for dashboards and agents | One meaning, read by people, reports and agents. | [16](../data-governance/proposal.md#16-meaning-on-the-platform) |
| *Quality on the platform* | *Rules that run*, *Fixed where it starts*, *Teachers of data* | Tests, pipeline expectations and monitoring, with each alert sent to the owner | Rules you write, and monitoring for the rest. | [17](../data-governance/proposal.md#17-quality-on-the-platform) |
| *Products in open formats* | *A product with an owner*, *Change without surprises*, *Where each piece lives* | Domains, data products and their contracts in open formats, kept beside the models they match | A contract in an open format outlives the tool. | [18](../data-governance/proposal.md#18-products-in-open-formats) |
| *The marketplace* | *A product with an owner*, *Who may see it*, *A capability, not a project* | Find a product, read its promise, ask for access with a purpose, and get it for a group until a date | Finding and getting data is part of governance. | [19](../data-governance/proposal.md#19-the-marketplace) |

## Rules from the plan

- Every file on screen is a real one, from the example dbt project, which stays in [`../data-governance/project/`](../data-governance/project/), or from Databricks.
- Each film names the films it expands, recaps them in a line, and goes straight to how it's built.
- Product names change often: they're kept to labels, checked in each film's rigour sheet on the day it's made, and a feature in preview is called one.
- Each film's title and end cards say "Film 1 of 6 · data governance" and "Film 1 of 6", and so on.
