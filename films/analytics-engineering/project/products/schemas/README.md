# The open standards' schemas

Copies of the JSON schemas `scripts/generate/products.py` validates the generated files against,
so the check runs with no network:

| File | Standard | From | Read on |
|---|---|---|---|
| `odcs-json-schema-v3.1.0.json` | Open Data Contract Standard v3.1.0 | [bitol-io/open-data-contract-standard](https://github.com/bitol-io/open-data-contract-standard), `schema/` | 20 October 2026 |
| `odps-json-schema-v1.0.0.json` | Open Data Product Standard v1.0.0 | [bitol-io/open-data-product-standard](https://github.com/bitol-io/open-data-product-standard), `schema/` | 20 October 2026 |

Both are Bitol projects at the Linux Foundation, under the Apache License 2.0; the files are
unchanged. ODCS v3.2.0 and ODPS v1.1.0 are newer. ODCS v3.1.0 is the version Ontos reads and writes
(checked on 16 October 2026), and ODPS v1.0.0 is the product standard's release of the same time.
To move to a newer version, copy its schema here and change `ODCS` or `ODPS` in the script.
