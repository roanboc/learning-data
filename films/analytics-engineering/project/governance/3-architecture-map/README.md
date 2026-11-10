# Noor's map: the governance part

The university's architecture map is Noor's, the data architect's. At the university it lives in an architecture tool, fed by its sources, as *A map people and agents can read* shows; this folder keeps the part about data governance as text files, the simplest form, so the films and the project can point at it. It is fictional, like the university.

*Data governance* films 11 to 13 build it, one layer each:

| Film | Layer | Here |
|---|---|---|
| 11 | What governance must be able to do, and the services it offers | `2-strategy/`, `3-business/services/`, `6-views/services.md` |
| 12 | Who does what, end to end: roles, actors and the steps of each service | `3-business/roles/`, `actors/`, `process-steps/`, `6-views/responsibilities.md` |
| 13 | Where each piece lives: every artifact's home, its copies and the one-way flows between them | `4-information/`, `5-application/`, `1-motivation/` |

## One file per element, named after it

Each element is one YAML file, named after the element (`define-what-words-mean.yml`), in the folder of its layer and kind. The folders are numbered in reading order: why, then what, who, which information, and where it's kept. It is drawn in ArchiMate 4's terms, as *The map before the data* draws the map.

| Folder | Kind |
|---|---|
| `1-motivation/principles/` | principle |
| `2-strategy/capabilities/` | capability, with its `heat` and the `evidence` for it |
| `3-business/services/` | business service, with its `promise` and `how_to_ask` |
| `3-business/roles/` | business role |
| `3-business/actors/` | business actor: a person or a team |
| `3-business/process-steps/` | business process: one step of a service |
| `4-information/business-objects/` | business object: one kind of governance artifact, with its `home` and `copies` |
| `5-application/application-components/` | application component: a place artifacts are kept, or an agent |
| `5-application/application-services/` | application service: a tool a step calls, realized by the component that holds it |
| `6-views/` | [generated] the services and their promises; who does what; each role's rights |

Every element has a `name`, unique on the map, an `owner` (a name in `../2-owners/owners.yml`, so a change can reach them) and a `status`: `confirmed`, `draft` or `proposed`.

A relationship is written once, on one element, naming the other: a step's `assignment: data steward` says the data steward does it. No codes: in an architecture tool, each element also has the tool's own identifier, which people never need to read.

## One home for every artifact

*One home for every artifact*: every governance artifact has exactly one home and an owner. Every other place keeps a copy, synced one way from the home or from a copy before it, with a check that flags drift. So a business term's home is this map; the glossary keeps a copy synced from the map, and the dbt project and the platform keep copies synced from the glossary (decision DEC-PRJ-11). A data product's home is this folder's neighbour, `../4-data-products/`, and the product catalogue keeps a copy.

## The check and the views

From the project's folder:

```bash
python scripts/check/architecture_map.py           # check the map and write 6-views/
python scripts/check/architecture_map.py --check   # check it, and fail if a view is out of date (CI)
```

It fails if a file isn't named after its element, two elements share a name, an owner can't be reached, a relationship names something that isn't on the map or joins two kinds the wrong way, an artifact has no home or a copy that isn't synced one way from it, or a colour has no evidence. The three views in `6-views/` are generated: don't edit them.

## Agents on the map

An agent is drawn as the map draws any software that works beside people: an application component, here with `agent: 'yes'` (quoted, since YAML reads a bare yes as true), an owner, who must be a person, and an assignment to a role, as a person's actor file is assigned to theirs. ArchiMate has no element for how far an agent may act alone, so its stage for each kind of task is written on its assignment, one line each, from 1 (it suggests) to 5 (a contributor with a mandate):

```yaml
relationships:
- assignment: planning contributor
  stage:
    Planning's tickets: 4
    what a word means: 1
```

A step is a step whoever does it, a person or an agent: Planning's change process, the service *change a data product*, has seven steps, and the role *planning contributor* is assigned only the three that draft a change. People keep the others: the analytics engineer reviews the code, the product owner approves the change and the release approver releases it, so whoever drafts a change never approves or releases it. The map holds three agents: the planning agent, the workload agent and the governance review agent.

The check also fails if an agent has no owner, no assignment to a role, or no stage from 1 to 5 for each kind of task on its assignment, or if a `stage:` sits anywhere but on an agent's assignment. *From helper to colleague*'s *A place on the map* adds them.

## Rights from the steps

A role's rights come from its steps, not from a list written by hand: what each step reads and writes (`access (reads)` and `access (writes)`, on the step) and the tools it calls (`serving`, on each application service that serves it). The tools are application services in `5-application/application-services/`, each realized by the component that holds it (`realization`, on the component): *tickets* by the tracker, *docs* by the map and the dbt project, *catalog*, *query*, *memory* and *language model* by the data platform, *build* by the dbt project and *repository* by the code repository.

```yaml
name: build it in development
kind: business process
relationships:
- assignment: planning contributor
- access (reads): change draft
- access (reads): data product
- access (writes): test and its result
```

A step reads in order: the governed context first, each part with an owner and changed only through review, then what's marked `priority: second`, the team's memory, kept by the platform, which nobody checks line by line. When the two disagree, the definition wins, and the agent says so in its report, so the definition's owner sees it. A step only people do says so: `people only: 'yes'`, on *review the code*, *approve the change*, *release to production* and *decide*.

`6-views/rights.md` lists each role's rights from its steps, each right with the step it comes from. For a role an agent fills, that's all it may do, so the view also says who answers for each thing it reads and what's left out, with the reason; for a role people fill, it's only their part in these services. The planning contributor's `may:` is gone: its rights are its three steps'. Its `may not:` and `asks:` stay, as words for people.

The check also fails if a step only people do is given to a role an agent fills; if a step of such a role doesn't say what it reads or writes, or calls no tool; if a role with steps still has a `may:` written by hand; if an application service has no component that realizes it, or serves no step; or if `people only` or `priority` sits where it doesn't belong. When the work changes, a step changes here first, through review; the view follows, and the tools follow the view (*The map, enforced*). *From helper to colleague*'s *Rights follow the role* adds them.
