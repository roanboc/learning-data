---
owner: Anil Kurian, Faculty of Health
role: workload contributor
---

# The workload agent

*Written by scripts/generate/agents.py from Noor's map and agents/tools.yml. Don't edit it: change the map, then run the script.*

Software that answers the Faculty of Health's heads of school, every week, how many teach in each school or unit this term and how many are casual, under its own name. Its owner, Anil Kurian, Faculty of Health, answers for what it does. On Noor's map it's
`governance/3-architecture-map/5-application/application-components/workload-agent.yml`, assigned to the role *workload contributor*.

## What it may do, and where each right comes from

Its role's steps on the map say what it reads, writes and calls; every right below comes from one of them, and
nothing else does. The other steps of the services it works in are other roles', and its role's `may not:` says
what only people do.

| Step | Reads | Writes | Calls |
|---|---|---|---|
| find why the night build failed | test and its result, data product, pull request, business rule | change draft | build, language model, query, repository |
| build it in development | change draft, data product | test and its result | build, language model, query |
| open a pull request | change draft, test and its result | pull request | language model, repository |

## Its name and its rights in each tool

| Tool | Its name there | Its rights | File |
|---|---|---|---|
| Databricks | Its service principal, "workload agent", `7d2b5e90-1c4a-4f83-b6e7-3a9c0d1f2e58` | Its role's group, `workload_contributors`: reads production (prod_core, prod_marts; personal and sensitive data masked), and builds only in schemas of its own in `analytics_dev` | `grants.sql` |
| Unity Gateway | The same | `EXECUTE` on 1 model (`ai.models.drafting`) and 3 tool servers (`ai.tools.build`, `ai.tools.query`, `ai.tools.repository`) | `unity-gateway.yml` |
| GitHub | Its App, `workload-agent`: its work reads `workload-agent[bot]` | One repository, `uni-example/credentials`; contents and pull requests, write; only branches `agent/workload/*` | `github-app.yml` |
| dbt | The target `agent` (`profiles.yml`), signed in as its service principal | Builds into `workload_agent_marts` and its other layers in `analytics_dev` | `workflow.yml` |
| Its runs | GitHub Actions, in the environment `workload-agent` | Signs in with no secret it can see or leak | `workflow.yml`, `federation-policy.json` |

To change a right, change its step on the map, through review; the script writes these files again, and the
platform team applies them. A right given by hand in a tool is drift: the nightly check fails on it
(`agents/README.md`).

## Its mandate

Its mandate, `governance/8-mandates/workload-agent.yml` (find why the night build failed, in test), says what
it may do alone. Its limits are written on top of its rights, in the same files: 60 minutes as its run's
timeout and 10 rounds as the runner's limit (`workflow.yml`), 50000 tokens a minute as a rate limit on its
service principal (`unity-gateway.yml`), and a plain check as its run's first step (`workflow.yml`).
`scripts/check/mandates.py` fails when any of them allows more than the page.
