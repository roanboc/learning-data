# Glossary

The project writes words out in full where it can. This page holds the short forms it can't avoid, and where every other glossary is, so there's one place to look.

## The other glossaries

| What | Where |
|---|---|
| What the university's words mean: *learner*, *award*, *credential* | The business glossary, in the data platform (an example export: `skills/sync-the-glossary/example_glossary.json`). The conceptual models copy its words, with where they came from (decision DEC-PRJ-11). |
| What each entity and relationship means in the model | Each domain's conceptual model, `models/<layer>/<domain>/_<domain>__conceptual.yml`, and the definitions generated from it, `_<domain>__definitions.md` |
| What each source system calls things | Each source's doc blocks, `sources/<system>/_<system>__docs.md` |

## Short forms

| Short form | Stands for | Used |
|---|---|---|
| ABAC | Attribute-based access control | Unity Catalog's policies that mask or filter by tag (`docs/databricks-governance.md`) |
| CI | Continuous integration | The checks that run on every pull request (`.github/workflows/`) |
| CSV | Comma-separated values | The seeds and the example data |
| DAMA | The Data Management Association | Its body of knowledge, DAMA-DMBOK, names the six quality dimensions the tests use |
| dbt | Data build tool | The tool that writes and tests the models; its name is written in lower case |
| SQL | Structured Query Language | The models |
| TCSI | Tertiary Collection of Student Information | The reference model the core follows (`docs/conventions.md`, *Domains*) |
| YAML | YAML Ain't Markup Language | The project's settings, models' descriptions and governance's files |

The two open standards are named in full in the project's words: the *Open Data Contract Standard* and the *Open Data Product Standard* (`7-standards/`). Their own documents call them ODCS and ODPS.

## Codes in identifiers

Decisions, requirements, gaps and limitations have short identifiers, so a film, a file and a pull request can point at one. They're read as: kind, scope, number.

| Part | Stands for |
|---|---|
| `DEC` | A decision, in a scope's decision log (`_<scope>__decisions.yml`) |
| `REQ` | A requirement still open (`requirements/`) |
| `GAP` | A gap between what a consumer expects and what a source holds, still open |
| `LIM` | A known limitation, on a model or a source |
| `PRJ` | The whole project |
| `SIS` | The student system (student information system) |
| `LMS` | The learning platform (learning management system) |
| `SC` | The short-course platform |
| `HR` | The human resources system |
| `STU`, `PER`, `CRS` | The student, person and course domains |
| `PLN`, `FIN`, `WAL` | Planning's, Finance's and the wallet app's marts |

The same system codes qualify business keys, like `SIS|S-20417`: a student ID the student system issued.

Codes inside the data, like enrolment statuses (`ENR`, `CMP`) and award codes (`GCDA`), are the source systems' own: the seeds map them to the model's words (`seeds/reference/`).
