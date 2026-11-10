# Agents under their own names

Each agent that works on this project under its own name has a folder here. It's written by
`scripts/generate/agents.py` from two files: Noor's architecture map (`governance/3-architecture-map/`),
which says what the agent's role does, and `tools.yml`, the platform team's file, which says where each
thing on the map lives in each tool, and the agent's name there. Nothing in an agent's folder is written
by hand, and no right is given by hand.

## What's here

| File | What it is | Who applies it, and where |
|---|---|---|
| `tools.yml` | Where each thing on the map lives in each tool, and each agent's name in each one | Nobody: the script reads it. The platform team writes it by hand |
| `<agent>/README.md` | Its owner, its role, and each right with the step it comes from | Nobody: it's for people to read |
| `<agent>/grants.sql` | Unity Catalog: its role's group, and the group's grants | The platform team, on a SQL warehouse |
| `<agent>/unity-gateway.yml` | Unity Gateway: who may call the model and each tool server its steps call | The platform team, through the permissions API |
| `<agent>/memory.yml` | The team's memory store, read only | The memory keeper, the store's creator, with the AgentKit SDK |
| `<agent>/github-app.yml` | GitHub: its App's one repository and permissions, its branches and its runs' environment | The platform team, in the organization's settings |
| `<agent>/federation-policy.json` | Its service principal signs in only from its runs, with no secret | The platform team, in the account console |
| `<agent>/workflow.yml` | Its run in GitHub Actions, with dbt's `agent` target (`profiles.yml`) | `.github/workflows/` in the project's own repository |
| `rights-held.sql` | What every agent's group holds in Unity Catalog now | The check each night |
| `nightly-check.yml` | The check each night, against the map | `.github/workflows/` in the project's own repository |

## One way, from the map to the tools

1. **The map first.** Noor places the agent on the map, with an owner and a role, through review. Its
   role's steps say what each one reads, writes and calls, and `6-views/rights.md` lists them.
2. **A name in each tool, once.** Sam, who runs the platform, makes its service principal in Databricks and
   its App in GitHub, named after it, and writes their IDs in `tools.yml`, under `agents:`.
3. **The script writes its folder.** `python scripts/generate/agents.py`. It stops on a step of the role that
   doesn't say what it reads, writes or calls; on a step only people do, given to a role an agent fills; on
   anything a step reads, writes or calls that has no line in `tools.yml`; and on an agent in `tools.yml`
   that isn't on the map.
4. **Review, then apply.** The pull request asks the platform team to review the folder (`CODEOWNERS`).
   The agent's owner answers for what it does, and doesn't review pull requests. Once it's merged, the
   platform team applies each file, as the table says.

To give an agent a new right, change its role's step on the map, through review. The script writes the
files again, and the platform team applies them. Never the other way: a right given by hand in a tool is
drift.

## The check each night

`nightly-check.yml` runs at 02:00 UTC as the platform's rights reader, a service principal that may read
grants and permissions and change nothing. It exports what each tool holds for the agents: the grants in
Unity Catalog and each group's members, who may call each model and tool server in Unity Gateway, who may
read the memory store, and each App's installation in GitHub. Then `agents.py --drift` compares them with
the map, and fails on a right a tool holds that the map doesn't give, and on one the map gives that a tool
doesn't hold.

On Tuesday 3 November 2026, to save a day, the planning contributors' group was given the right to change
Planning's production tables, by hand. That night the check failed:

    Unity Catalog: planning_contributors holds MODIFY on schema analytics.prod_marts, which the map doesn't give it

On Wednesday morning, Sam took the grant back. Nobody was named for it, and it couldn't have been used:
the agents run in the development workspace, where production can only be read. If the work had needed
the right, the map would have changed first, through review.

## Stopping an agent

Each agent can be stopped in each tool on its own, and nobody else stops with it.

- **Databricks:** deactivate its service principal. It can't sign in, and its grants stay for when it's
  turned back on.
- **GitHub:** suspend its App's installation. The App can't reach the organization's repositories until
  the installation is unsuspended.

On Wednesday 4 November 2026, Sam tried both for ten minutes. The planning agent's next call failed; Jun,
Lucía and Anil's workload agent worked on. Turned back on, it had every right it had before.

## No secret

An agent's run signs in with passes GitHub gives the run, which last minutes: Databricks takes one because
the service principal's federation policy names the repository and the run's environment, and the token
service takes one to hand back a token for the App, for one repository and its permissions, for an hour.
The App's private key stays in a vault, and only the token service signs with it. Nothing in this folder is
secret: the IDs are public.

The policy names the repository as GitHub's pass does: `repo:uni-example/credentials:environment:<environment>`
for this repository, which is older than 15 July 2026. A repository made, renamed or moved since then carries
its numeric IDs in the pass (`repo:<organization>@<ID>/<repository>@<ID>:...`), and its policy must match them.

## What an agent builds

dbt's `agent` target signs in as the agent's service principal and builds in schemas of its own in the
development catalog: dbt makes one for each layer, such as `planning_agent_marts`. Its build reads what a
change doesn't touch from production, names masked, as its group's grants allow. It never writes there.
