# The open standards' schemas

Copies of the JSON schemas `scripts/generate/products.py` validates the generated files against,
so the check runs with no network:

| File | Standard | From | Read on |
|---|---|---|---|
| `open-data-contract-standard-3.1.0.schema.json` | Open Data Contract Standard v3.1.0 | [bitol-io/open-data-contract-standard](https://github.com/bitol-io/open-data-contract-standard), `schema/` | 20 October 2026 |
| `open-data-product-standard-1.0.0.schema.json` | Open Data Product Standard v1.0.0 | [bitol-io/open-data-product-standard](https://github.com/bitol-io/open-data-product-standard), `schema/` | 20 October 2026 |

Both are Bitol projects at the Linux Foundation, under the Apache License 2.0; the files are
unchanged; only their names are ours. The contract standard's 3.2.0 and the product standard's 1.1.0
are newer. Contract standard 3.1.0 is the version Ontos reads and writes (checked on 16 October 2026),
and product standard 1.0.0 is the release of the same time. To move to a newer version, copy its
schema here and change the versions in the script.
