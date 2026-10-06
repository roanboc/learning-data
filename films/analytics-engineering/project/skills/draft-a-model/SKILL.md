---
name: draft-a-model
description: Draft a dbt model to pass the tests and contract written for it first. Use when a model's grain, contract and tests exist, or should, and the SQL doesn't yet.
---

# Draft a model to pass its tests

The contract and the tests say what done looks like. Write them first, then the least SQL that
turns them green, in the right layer.

## Steps

1. **Find the model's place** in `docs/conventions.md`: which layer, which name, which access. Read the entity in its domain's conceptual model (`models/core/<domain>/_<domain>__conceptual.yml`); the model goes in that domain's folder.
2. **Write the YAML first**, in the folder's `_<folder>__models.yml`:
   - the grain in one sentence, in `meta.grain`: "One row per ...", and a description of what a row means;
   - the grain as a test: `unique`, or `unique_combination` with `arguments: {columns: [...]}`;
   - `relationships` for every key that points elsewhere, `accepted_values` for closed sets;
   - for core and marts, every column with its `data_type`, and `not_null` constraints on keys;
   - `meta`: owner, domain, glossary term, and `personal_data` on columns that hold it;
   - unit tests (`unit_tests:`), with mock rows, for any rule with logic.
3. **Run it and watch it fail**: `dbt build --select <model> --profiles-dir .`. The failures are the work to do.
4. **Write the SQL** the way `docs/conventions.md` says: import CTEs, one step per CTE, a final select listing every column in the contract's order. Use `business_key`, `hash_key` and `valid_at` from `macros/`; don't write your own.
5. **Build it with what depends on it**: `dbt build --select <model>+ --profiles-dir .`, until it's green.
6. **Check the generated docs**: `dbt parse`, then `python scripts/generate/diagrams.py --check` and `python scripts/generate/definitions.py --check`; regenerate if the YAML changed them.
7. **Open a pull request** with what the model does, its grain, the tests, and the evidence that it's right: row counts, and a reconciliation where one exists.

## When a test fails and you can't see why

Stop and report it: the test, its failing rows (`dbt show` on the test's compiled query, with a
limit), and what you tried. **Never** loosen, skip or delete the test, lower its severity, or add
a `where` to hide rows. A person decides whether the data, the code or the expectation is wrong.
