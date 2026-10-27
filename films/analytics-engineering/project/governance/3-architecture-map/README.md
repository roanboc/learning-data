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
| `6-views/` | [generated] the services and their promises; who does what |

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

It fails if a file isn't named after its element, two elements share a name, an owner can't be reached, a relationship names something that isn't on the map or joins two kinds the wrong way, an artifact has no home or a copy that isn't synced one way from it, or a colour has no evidence. The two views in `6-views/` are generated: don't edit them.
