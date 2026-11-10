# A worked example: the contract at the HR system's interface

HR's contracts reach the platform through a managed connector: each change as it's made, and the
whole file again on the first day of each teaching period. Moving them is easy now. What still needs
people is the contract at the interface: what the data means where the HR system meets the
platform. *Moving is easy, agreeing is the work*, in *Modern data basics*, shows Ingrid Holm,
who owns the HR system's data, and Noor Rahman, the data architect, agreeing it, and Jun Park's
tests checking every row against it. This is that contract, written in the Open Data Contract
Standard.

| File | What it is |
|---|---|
| `hr_system.yaml` | The HR system's data contract, by hand, at the standard's version the project pins (v3.1.0, `governance/7-standards/`): the `contracts` and `staff` tables as the connector lands them in bronze |

It says the four things the film names:

| What it says | Where |
|---|---|
| What each field means: `pay_type` has three values, CAS (casual), FT (fixed-term) and CON (continuing, not contract) | `pay_type`'s description, and its rule that only those three arrive |
| Who answers for it: Ingrid Holm, by name | `team`, with Noor, who agreed it, and Jun, whose tests check it |
| What a deletion means: a cancelled contract arrives as a change, with its time, never as a row missing from the next file; the platform closes its last version and keeps its history | `description.usage`, the `deletion` custom property, and `_valid_to` |
| What's personal: names, birth dates, countries of birth and emails come across, marked personal; bank details and rates of pay never leave HR | each field's `classification`, `description.limitations`, and the `personalData` custom property |

The tests that check each row are dbt's, on the staging models
(`models/staging/hr_system/_hr_system__models.yml`): `pay_type` and `position_type` accept only
the contract's values, and every contract has its ID and its staff member. The film's people and
the contract's names are invented, as everywhere in this project; T-26188 is Linh Nguyen's contract
in `data/hr_system/contracts.csv`.

This contract is an input's, so it's written by hand and agreed with the system's owner. The
contracts in `governance/5-data-contracts/` are the project's own outputs, written by
`scripts/generate/products.py` from the dbt models: don't move this one there.

## Check it against the standard

From the project's folder, with the requirements installed:

```sh
python -c "import json, yaml, jsonschema; s = json.load(open('governance/7-standards/open-data-contract-standard-3.1.0.schema.json')); c = yaml.safe_load(open('examples/hr-system-interface/hr_system.yaml')); jsonschema.Draft201909Validator(s).validate(c); print('valid')"
```

The standard's v3.2.0 is newer (approved, read on 5 November 2026) and adds a list of allowed values,
each with its own description, which would hold CAS, FT and CON with their meanings. The project
moves to it with its other contracts, as `governance/7-standards/README.md` says.
