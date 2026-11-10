# A worked example: files as data and as context

Documents come in three kinds, and each gets its own answer. Finance's supplier invoices, written for
people, most of them PDF files, are read into data with the platform's functions, each row keeping the
path of its file, and checked like any other data before anyone pays. HR's signed contracts are official,
so they're kept as they were signed, with the metadata the HR system writes beside each file, and a person
or an agent finds the signed version by it and cites its file. Claims for hours, which the university's
own claims app makes, are written as data from the start, with what each field means in a data contract.
*Files as data and as context*, the film of *Documents as data*, the last series of *Modern data basics*,
shows it.

Databricks only: nothing here runs on DuckDB or in CI. The suppliers, the invoices and the counts are
invented, as the film's are; Linh Nguyen's contract, T-26188, is the one in `data/hr_system/contracts.csv`.
Every document differs from one organisation to the next, so take this as the shape of the work, not a
recipe: start from Databricks' docs on `ai_parse_document`, `ai_extract` and volumes, then investigate,
adapt, implement, iterate.

| File | What it is |
|---|---|
| `read_invoices.sql` | October's supplier invoices, from PDF files in a Unity Catalog volume to one row for each invoice: `ai_parse_document` reads each file once and its output is kept; `ai_extract` takes out the fields Finance names (supplier, number, date, total and each line); every row keeps its `file_path` |
| `check_invoices.sql` | The checks every row passes before it's paid: the data project's (every field read, the lines add up to the total), then Finance's rules (the same supplier and number sent before, a supplier Finance knows). Each invoice that stops goes to a person in Rohan Desai's team, with its first reason: of 3,860, 3,734 passed and 126 didn't |
| `contract_documents.csv` | The metadata the HR system writes beside each contract's file as it makes it: Linh's offer (version 1, not signed) and the contract she signed on 14 July 2026 (version 2) |
| `signed_contract_file.sql` | That metadata as a table beside the files, and a Unity Catalog function that finds a contract's signed file, for a person or an agent to open and cite |
| `claims_contract.yaml` | The claims app's contract with the platform, in the Open Data Contract Standard (v3.1.0, the version the project pins in `governance/7-standards/`): what each field of a claim means, for the fields of the app's own table, which the project reads in place as the source `claims_app`, and who answers for it, Ingrid Holm, by name (`team`). The app's team keeps it with the app's code; the film shows its first lines and the field `hours` |

Like `../hr-system-interface/hr_system.yaml`, the claims contract is an input's: written by hand and agreed with the
system's owner. The contracts in `governance/5-data-contracts/` are the canonical tables', written by data governance's
information architect, so it isn't there. To check it against the standard, from the project's folder, with the requirements installed:

```sh
python -c "import json, yaml, jsonschema; s = json.load(open('governance/7-standards/open-data-contract-standard-3.1.0.schema.json')); c = yaml.safe_load(open('examples/files-as-data/claims_contract.yaml')); jsonschema.Draft201909Validator(s).validate(c); print('valid')"
```

What the film shows that isn't a file here: the volumes themselves, the PDF files in them, and the claims
app, which writes each claim to its own database as the claim is made. Who may read a contract is Ingrid
Holm's to decide, in HR; the module *Data protection and privacy* teaches the rest. How a document becomes
an agent's context is *Context engineering*'s and *Context and memory, governed*'s.
