# Noor's map: the governance part

The university's architecture map is Noor's, the data architect's. At the university it lives in an architecture tool, fed by its sources, as *A map people and agents can read* shows; this folder keeps the part about data governance as text files, the simplest form, so the films and the example dbt project (`../project/`) can point at it. It is fictional, like the university.

*Data governance* films 11 to 13 build it, one layer each:

| Film | Layer | Here |
|---|---|---|
| 11 | What governance must be able to do, and the services it offers | `strategy/`, `business/SRV-*`, `views/services.md` |
| 12 | Who does what, end to end: roles, actors and the steps of each service | `business/ROL-*`, `ACT-*`, `STP-*`, `views/responsibilities.md` |
| 13 | Where each piece lives: every artifact's home, its copies and the one-way flows between them | `information/`, `application/`, `motivation/PRN-001.yml` |

## One file per element

Each element is one YAML file, named by its id, in the folder of its layer. It is drawn in ArchiMate 4's terms, as *The map before the data* draws the map.

| Prefix | Kind | Folder |
|---|---|---|
| `CAP` | capability | `strategy/` |
| `SRV` | business service: with its `promise` and `how_to_ask` | `business/` |
| `ROL` | business role | `business/` |
| `ACT` | business actor: a person or a team | `business/` |
| `STP` | business process: one step of a service | `business/` |
| `OBJ` | business object: one kind of governance artifact, with its `home` and `copies` | `information/` |
| `APP` | application component: a place artifacts are kept, or an agent | `application/` |
| `PRN` | principle | `motivation/` |

Every element has a `name`, an `owner` (a name in `../project/models/_shared/_shared__owners.yml`, so a change can reach them) and a `status`: `confirmed`, `draft` or `proposed`. A capability's `heat` has its `evidence`, with the date it was read.

A relationship is written once, on one element, as `type: ID · name`: a step's `assignment: ROL-003 · data steward` says the data steward does it. The name is there for people; the check makes sure it matches.

## One home for every artifact

PRN-001: every governance artifact has exactly one home and an owner. Every other place keeps a copy, synced one way from the home or from a copy before it, with a check that flags drift. So a business term's home is this map; the glossary keeps a copy synced from the map, and the dbt project and the platform keep copies synced from the glossary (DEC-PRJ-11). A data product's home is the dbt project (`../project/products/`), and the product catalogue keeps a copy.

## The check and the views

```bash
python check.py           # check the map and write views/
python check.py --check   # check it, and fail if a view is out of date (CI)
```

It fails if an id isn't its file's name, an owner can't be reached, a relationship names something that isn't on the map or joins two kinds the wrong way, an artifact has no home or a copy that isn't synced one way from it, or a colour has no evidence. The two views in `views/` are generated: don't edit them.
