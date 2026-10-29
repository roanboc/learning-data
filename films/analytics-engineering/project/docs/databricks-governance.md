# Governance on Databricks: tags, masks, a policy and a catalogue

Optional. Everything here runs only on the `databricks` target; DuckDB stays the default and needs
none of it. The project decides each column's class once, in the model's YAML (`meta.personal_data`),
and the platform protects what the project says is personal (DEC-PRJ-13). Product names and their
status were checked on 20 October 2026, sections 5 to 7 on 28 October, section 8 on 29 October: check them again on the day.

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
   Governed, only those three values can be set, and only by someone with `ASSIGN` on the tag:
   give it to the identity that runs dbt.
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
contracts in `governance/5-data-contracts/`, and the Open Data Product Standard, as
`governance/6-product-descriptors/` does. Load the
contracts and products from there; the files in this repository stay their home, and the catalogue
keeps a copy (Noor's map: *data contract* and *data product* in `governance/3-architecture-map/4-information/`).

Ontos is in Databricks Labs, and its README states no support terms. In the films it's an example; the project names
no tool as the only way.

## 5. Areas, from each model's domain

People look for data by area, not by layer, and the Discover page shows a catalog's tables by
area, as domains. After each table other teams read builds, dbt sets its model's domain
(`meta.domain`) as a key-only tag of the same name: `student` on the learner table
(`macros/governance/domain_tag.sql`, DEC-PRJ-15). Nothing to set in the build. Once, on the platform:

1. Someone with `MANAGE DISCOVER` (account and workspace admins have it) creates a domain for each
   area, `student`, `course`, `learning`, `planning`, `finance` and `wallet`, each on a governed
   tag of its name. A table joins its domain when it carries the tag.
2. Give the identity that runs dbt `ASSIGN` on each of those tags.

The catalog and its schemas stay as dbt builds them, a schema for each layer: `prod_core` and
`prod_marts`, when `DATABRICKS_SCHEMA` is `prod`.

## 6. Who read it

Unity Catalog's audit log, the system table `system.access.audit`, records who read each table,
and when: a read is a `getTable` event, with the table's full name in `request_params.full_name_arg`.
It's in Public Preview, and keeps a year. `analyses/governance/who_read_a_table.sql` asks who read
the learner table this month:

```bash
dbt compile --target databricks --profiles-dir . --select who_read_a_table
```

Then run the SQL it writes in `target/compiled/` on a SQL warehouse. Reading the log takes
`USE CATALOG` on `system`, and `USE SCHEMA` and `SELECT` on `system.access`, which an admin grants.

## 7. The access review

Each December, the platform team reads the grants themselves: who can read each table, and through
which group. `analyses/governance/access_review.sql` lists the learner table's, from
`system.information_schema.table_privileges`: each grantee and its privilege, including grants made
on its schema or catalog. Who is in each group, and until when, is in the university's
directory, which the platform syncs: Unity Catalog's grants have no end date of their own.

```bash
dbt compile --target databricks --profiles-dir . --select access_review
```

The information schema shows someone with only `MANAGE` on a table just their own grants on it.
If a grant you expect is missing, check the table with `SHOW GRANTS ON TABLE`.

## 8. Asking for a product

How someone gets a product other teams read, as the university sets it up. Nothing here runs in the
build: the catalogue keeps its own workflows, and the directory its groups (Noor's map: each piece
where it lives).

1. **A readers' group for each product.** Each product has a group in the university's directory,
   named after it: `learners_near_an_award_readers`. The group holds `SELECT` on the product's output
   tables from the day the product goes live, so access is granted once, to the group, never to a
   person. For Planning's marts, the project grants it when the `planning_readers` var names the group:

   ```bash
   dbt build --target databricks --profiles-dir . --vars '{planning_readers: [learners_near_an_award_readers]}'
   ```

2. **One place to ask.** On the platform, the catalog's access request destination is a redirect URL
   to the catalogue: someone who asks for a table on the platform goes to the catalogue's form instead
   of the platform's. Unity Catalog's access requests are in Public Preview.
3. **A request with a reason and an end.** In the catalogue, a request says why, and for how long:
   30, 60 or 90 days, never without a date. It goes to the owners of the product's domain: for
   *Learners near an award*, Clara Jensen, Planning (`governance/4-data-products/learners_near_an_award.yml`),
   not whoever built the table. The owner decides the days, or says no, with a reason. The catalogue
   keeps the request as the record: who asked, why, who decided, and until when.
4. **Access until a date.** On a yes, the catalogue's workflow adds the requester to the product's
   readers' group in the directory, until the date. It reminds them a week before, and on the date
   the directory ends the membership: Unity Catalog's grants have no end date of their own.
5. **A known reader.** A team that keeps using a product adds what it builds from it to `exposures/`,
   in its own folder, as the Faculty of Health's placements plan is (`exposures/health/`). The impact
   check then names it among who to tell, and `CODEOWNERS` asks it to review a change to its file.

Outside the university, a product that holds no one's personal data, such as *Awards*, can be
shared with a partner through OpenSharing: a share of its output tables, which the partner reads
where they are, on any platform, with a recipient token that ends within a year, and its contract
sent with it. A product that holds personal data isn't shared outside without an agreement that
allows it.

## Sources (checked 20 October 2026; *SET TAG* to *TABLE_PRIVILEGES* on 28 October 2026; the last four on 29 October 2026)

- Databricks, *Create and manage attribute-based access control (ABAC) policies*:
  https://docs.databricks.com/aws/en/data-governance/unity-catalog/abac/policies
- Databricks, *ABAC tutorial (SQL)*: https://docs.databricks.com/aws/en/data-governance/unity-catalog/abac/tutorial-sql
- Databricks, *Policy evaluation* (manual masks conflict with ABAC masks):
  https://docs.databricks.com/aws/en/data-governance/unity-catalog/abac/policy-evaluation
- Databricks, *Governed tags*: https://docs.databricks.com/aws/en/admin/governed-tags/
- Databricks Labs, Ontos: https://github.com/databrickslabs/ontos
- Databricks, *SET TAG* (key-only tags; `ASSIGN` for a governed tag):
  https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-ddl-set-tag
- Databricks, *Domains*: https://docs.databricks.com/aws/en/uc-semantics/domains
- Databricks, *Audit log system table reference*: https://docs.databricks.com/aws/en/admin/system-tables/audit-logs
- Databricks, *System tables* (status and retention): https://docs.databricks.com/aws/en/admin/system-tables/
- Databricks Knowledge Base, *List users who executed SELECT command against a list of schemas using
  system access table* (a read is `getTable`): https://kb.databricks.com/en_US/unity-catalog/list-users-who-executed-select-command-against-a-list-of-schemas-using-system-access-table
- Databricks, *TABLE_PRIVILEGES*: https://docs.databricks.com/aws/en/sql/language-manual/information-schema/table_privileges
- Databricks, *Configure access request destinations* (Public Preview; a redirect URL):
  https://docs.databricks.com/aws/en/data-governance/unity-catalog/manage-privileges/access-request-destinations
- Databricks, *What is OpenSharing?*: https://docs.databricks.com/aws/en/opensharing/
- Databricks, *Create a recipient object for non-Databricks users using bearer tokens* (tokens valid for at most a year):
  https://docs.databricks.com/aws/en/delta-sharing/create-recipient-token
- Databricks Labs, Ontos, its access request workflows and their defaults: https://github.com/databrickslabs/ontos
