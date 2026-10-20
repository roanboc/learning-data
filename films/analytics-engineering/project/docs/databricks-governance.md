# Governance on Databricks: tags, masks, a policy and a catalogue

Optional. Everything here runs only on the `databricks` target; DuckDB stays the default and needs
none of it. The project decides each column's class once, in the model's YAML (`meta.personal_data`),
and the platform protects what the project says is personal (DEC-PRJ-13). Product names and their
status were checked on 20 October 2026: check them again on the day.

## 1. Tags, every build

Nothing to set up. After each table builds, every classified column gets a Unity Catalog tag,
`personal_data`, with its class: `direct`, `pseudonymous` or `none`
(`macros/governance/personal_data.sql`). Change the class in the YAML and the next build changes the tag.

```bash
dbt build --target databricks --profiles-dir .
```

## 2. Masks, one per column

Name the group that may see direct personal data, and add the identity that runs dbt to it: a model
that reads a masked column sees what its reader sees.

```bash
dbt build --target databricks --profiles-dir . --vars '{personal_data_readers: personal_data_readers}'
```

Before the build, dbt creates `mask_personal_data` in the target's schema; after each table, it sets
that mask on each `direct` column. Everyone outside the group reads `***`.

## 3. Or one policy, by tag

Unity Catalog's attribute-based access control (ABAC) masks by tag: one policy covers every column
tagged `personal_data = direct`, in every schema of the catalog, including tables built later. A
column with its own mask conflicts with a policy on it, so use this or step 2, not both.

1. An account admin makes `personal_data` a **governed tag**, with the allowed values `direct`,
   `pseudonymous` and `none` (Catalog Explorer: *Govern*, *Governed Tags*, *Create governed tag*).
   Governed, only those three values can be set.
2. Build with the policy var, so the build tags and leaves masking to the policy:

   ```bash
   dbt build --target databricks --profiles-dir . \
       --vars '{personal_data_readers: personal_data_readers, personal_data_policy: true}'
   ```

3. Create the policy once (you need MANAGE on the catalog; serverless or Databricks Runtime 16.4 or above):

   ```bash
   dbt run-operation create_personal_data_policy --target databricks --profiles-dir . \
       --vars '{personal_data_readers: personal_data_readers, personal_data_policy: true}'
   ```

   It runs `create or replace policy mask_direct_personal_data on catalog …`, with the mask, to
   `account users` except the readers, matching `has_tag_value('personal_data', 'direct')`.
   `SHOW EFFECTIVE POLICIES` shows what applies to a table.

Some of ABAC is in Beta (policies on views, on the whole metastore): check what's in preview on the day.

## 4. Products in a catalogue

Ontos, from Databricks Labs, is a business catalogue for Unity Catalog: data products, data contracts,
glossaries and semantic models, with review workflows. It runs as a Databricks App (its README:
`databricks bundle deploy`, then `databricks apps deploy`). It follows ODCS v3.1.0, the version of the
contracts in `products/odcs/`, and the Open Data Product Standard, as `products/odps/` does. Load the
contracts and products from there; the files in this repository stay their home, and the catalogue
keeps a copy (Noor's map, OBJ-008 and OBJ-012 in `../map/`).

Ontos is in Databricks Labs, and its README states no support terms. In the films it's an example; the project names
no tool as the only way.

## Sources (checked 20 October 2026)

- Databricks, *Create and manage attribute-based access control (ABAC) policies*:
  https://docs.databricks.com/aws/en/data-governance/unity-catalog/abac/policies
- Databricks, *ABAC tutorial (SQL)*: https://docs.databricks.com/aws/en/data-governance/unity-catalog/abac/tutorial-sql
- Databricks, *Policy evaluation* (manual masks conflict with ABAC masks):
  https://docs.databricks.com/aws/en/data-governance/unity-catalog/abac/policy-evaluation
- Databricks, *Governed tags*: https://docs.databricks.com/aws/en/admin/governed-tags/
- Databricks Labs, Ontos: https://github.com/databrickslabs/ontos
