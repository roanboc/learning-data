---
owner: Clara Jensen, Planning
role: planning contributor
---

# The planning agent

*Written by scripts/generate/agents.py from Noor's map and agents/tools.yml. Don't edit it: change the map, then run the script.*

Software that takes Planning's tickets under its own name, drafts each change in its own development schema and proposes it as a pull request. Its owner, Clara Jensen, Planning, answers for what it does. On Noor's map it's
`governance/3-architecture-map/5-application/application-components/planning-agent.yml`, assigned to the role *planning contributor*.

## What it may do, and where each right comes from

Its role's steps on the map say what it reads, writes and calls; every right below comes from one of them, and
nothing else does. The other steps of the services it works in are other roles', and its role's `may not:` says
what only people do.

| Step | Reads | Writes | Calls |
|---|---|---|---|
| draft the change | ticket, role and its steps, business term, business rule, data contract, owner and column class, data product; second, team memory | change draft | catalog, docs, language model, memory, repository, tickets |
| build it in development | change draft, data product | test and its result | build, language model, query |
| open a pull request | change draft, test and its result | pull request | language model, repository |

## Its name and its rights in each tool

| Tool | Its name there | Its rights | File |
|---|---|---|---|
| Databricks | Its service principal, "planning agent", `4f1c9a2e-7b3d-4e61-a8c5-2d9f0b6e1a73` | Its role's group, `planning_contributors`: reads production (prod_core, prod_marts; personal and sensitive data masked), and builds only in schemas of its own in `analytics_dev` | `grants.sql` |
| Unity Gateway | The same | `EXECUTE` on 1 model (`ai.models.drafting`) and 7 tool servers (`ai.tools.build`, `ai.tools.catalog`, `ai.tools.docs`, `ai.tools.memory`, `ai.tools.query`, `ai.tools.repository`, `ai.tools.tickets`) | `unity-gateway.yml` |
| The team's memory | The same | Read only: `team-memory` | `memory.yml` |
| GitHub | Its App, `planning-agent`: its work reads `planning-agent[bot]` | One repository, `uni-example/credentials`; contents and pull requests, write; only branches `agent/planning/*` | `github-app.yml` |
| dbt | The target `agent` (`profiles.yml`), signed in as its service principal | Builds into `planning_agent_marts` and its other layers in `analytics_dev` | `workflow.yml` |
| Its runs | GitHub Actions, in the environment `planning-agent` | Signs in with no secret it can see or leak | `workflow.yml`, `federation-policy.json` |

To change a right, change its step on the map, through review; the script writes these files again, and the
platform team applies them. A right given by hand in a tool is drift: the nightly check fails on it
(`agents/README.md`).
