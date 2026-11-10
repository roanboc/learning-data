# Governance

What data governance defines that isn't dbt's: who owns what, the architecture map, the data products and their contracts, and the open standards they follow. At the university, each of these lives in its own tool or repository (the owners in the directory, the map in the architecture tool, products and contracts in the product catalogue). Here they sit in one folder, as text, so it's clear they could, or should, move out of the project, and the project's scripts read them from here.

| Folder | What | Written by |
|---|---|---|
| `1-glossary/` | The short forms the project can't avoid, and where every other glossary is | Data governance |
| `2-owners/` | Who each owner is, and how the impact check reaches them (owners decide meaning in the glossary; they don't review pull requests) | Data governance, with the data architect |
| `3-architecture-map/` | The governance part of Noor's map: capabilities, services, roles, steps, artifacts and where they live | The data architect |
| `4-data-products/` | Each data product: owner, purpose, outputs, service levels, support | Each product's owner |
| `5-data-contracts/` | The enterprise contract of each canonical table (a public model), in the Open Data Contract Standard. Only canonical tables have one; other dbt contracts are the data team's | Data governance's information architect, first; the data team builds the model to it, and `scripts/generate/products.py` fails if the two differ |
| `6-product-descriptors/` | Each product, in the Open Data Product Standard | Generated, the same way |
| `7-standards/` | The two standards' schemas, that the generated files are checked against | Copied from the standards |

The folders are numbered in the order to read them. Files are named after what they hold, never by a code.

What stays with the models, because dbt reads it: each model's owner, columns' classes and tests (in the models' YAML), and the conceptual models and decision logs next to them. The checks that hold the project to governance's rules are in `scripts/check/`.
