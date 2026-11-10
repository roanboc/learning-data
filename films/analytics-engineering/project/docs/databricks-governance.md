# Governance on Databricks: tags, masks, a policy and a catalogue

Optional. Everything here runs only on the `databricks` target; DuckDB stays the default and needs
none of it. The project decides each column's class once, in the model's YAML (`meta.personal_data`),
and the platform protects what the project says is personal (DEC-PRJ-13). Product names and their
status were checked on 20 October 2026, sections 5 to 7 on 28 October, section 8 on 29 October, sections 9 and 10 on 4 November, section 10 again and section 11 on 5 November, and sections 12 and 13 on 10 November: check them again on the day.

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
   area, `student`, `course`, `staff`, `learning`, `planning`, `finance` and `wallet`, each on a governed
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
   check then names it among who to tell when a change reaches it.

Outside the university, a product that holds no one's personal data, such as *Awards*, can be
shared with a partner through OpenSharing: a share of its output tables, which the partner reads
where they are, on any platform, with a recipient token that ends within a year, and its contract
sent with it. A product that holds personal data isn't shared outside without an agreement that
allows it.

## 9. Agents, under the same rules

An agent that works on its own, at night or in a job, never signs in as a person: not with their
sign-in, and not with their personal access token, which Databricks calls a legacy way to sign in.
It works as its own service principal, an identity made for software (`AGENTS.md`, *Your access*),
and a person owns it and answers for what it does. Then the sections above hold for it as they do
for people.

1. **Only what its job needs.** Grant the service principal what its job reads, and nothing to write
   where it only reads. The Faculty of Health's workload agent, which answers its heads of school's
   weekly counts of who teaches, reads the two HR tables and writes nowhere:

   ```sql
   grant use catalog on catalog <production catalog> to `<workload agent>`;
   grant use schema on schema <production catalog>.<schema>_staging to `<workload agent>`;
   grant select on table <production catalog>.<schema>_staging.stg_hr_system__staff to `<workload agent>`;
   grant select on table <production catalog>.<schema>_staging.stg_hr_system__contracts to `<workload agent>`;
   ```

   To stop it, an admin deactivates its service principal: it can't sign in, everyone else works on,
   and its grants stay for when it's switched on again.
2. **The masks it already meets.** Section 3's policy masks every column tagged `direct` for
   `account users` except the readers, and `account users` holds every user and every service
   principal in the account. An agent outside the readers' group reads stars, as Clara does, with no
   rule written for agents, and a row filter's `TO` clause covers it the same way. The staff key, a
   hash of the staff ID, isn't tagged, so it stays readable, and an agent can count without a name.
3. **Its tools, granted like tables.** A Unity Catalog function an agent calls as a tool needs
   `EXECUTE` on it, with `USE CATALOG` and `USE SCHEMA` on its catalog and schema: the agent can run
   it, and can't change it. The count of active research projects is one, `active_projects(faculty)`
   (`examples/agents-on-databricks/active_projects.sql`):

   ```sql
   grant execute on function <production catalog>.<research schema>.active_projects to `<project check agent>`;
   ```

4. **Models and tool servers, through Unity Gateway.** Unity Gateway, part of Unity Catalog, has been
   generally available since 4 August 2026. Each model the university allows is a model service in
   the catalog. By default only its owner can call it: to let an agent call it, grant the agent's
   service principal `EXECUTE` on it, with `USE CATALOG` and `USE SCHEMA` on its catalog and schema.
   Tool servers from outside are registered the same way, as MCP services, each with its own
   `EXECUTE`. On each service:
   - **Service policies**, in Beta, check what goes in and what comes out.
     `system.ai.detect_sensitive_data` finds structured personal data in a prompt, such as an email
     address, and blocks the call or redacts the value; it finds no names.
     `system.ai.block_jailbreak` detects jailbreak and prompt-injection content.
   - **A rate limit**, in queries or tokens a minute, for a user, a group or a service principal.
   - **Usage**: every call is a row of `system.ai_gateway.usage`, with its requester (a user or a
     service principal) and its tokens, so the faculty or office an agent works for sees what it costs.
5. **Its work, under its own name.** Section 6's query lists the agent's reads under its service
   principal's ID, apart from people's; `system.access.table_lineage` shows the tables its queries
   read; and section 7's review lists its grants with everyone else's.

## 10. Context and memory, one way

What agents read is governed like any data (`AGENTS.md`, *Context and memory are data*). Context's
home is the repository, where every change is a pull request the data team reviews (`CODEOWNERS`); the
glossary's definitions come from Unity Catalog's Glossary, kept there by their owners, and a skill
copies each into the conceptual models with its `source:` (`skills/sync-the-glossary/`). From the
repository, context goes one way, to where agents read it on Databricks, and nobody edits it there.
Memory is kept by the platform, and comes second.

1. **Descriptions, as comments.** `persist_docs` (`dbt_project.yml`) writes each model's and each
   column's description into Unity Catalog as comments, each time it builds the model (DEC-PRJ-04).
   A comment edited in the catalog is written over by the next build.
2. **Skills, in Unity Gateway.** Each skill in `skills/` becomes a Unity Catalog object, with an
   owner (whoever published it), permissions (`READ VOLUME` to use it; `WRITE VOLUME`, with
   `READ VOLUME`, to change it) and an audit of who created, changed, deleted or read it, and who was
   granted it. Databricks' sync notebook, run on a schedule, copies the skills from the repository:
   it creates new ones and updates changed ones, and never deletes one. A skill deleted here is
   deleted there too, by hand.
3. **The team's memory, kept by the platform.** Agent sessions and agent memory are kept in stores
   in Lakebase, the platform's Postgres database. A memory pipeline, run about every 24 hours, reads
   a session store and may rewrite, merge, split or delete any entry in its memory store, and nobody
   approves each one. The store is the security boundary: there's no access for each entry, so
   whoever may write to a store may change any entry in it, and nothing keeps what an entry said
   before. So memory comes second (`memory/README.md`): agents read the glossary's definitions and
   the data rules first, follow the definition where a memory line disagrees, and flag the line.
   Every agent reads the team's store under a read-only grant (`permission="READ"`), and only the
   pipeline writes there.
4. **Kept, then deleted.** Sessions are kept for 30 days; then a scheduled job deletes them.
   Deleting a session, or a session store, doesn't delete the memory kept from it: data governance
   deletes a wrong line from the team's store itself, and records it in `memory/removed.md`.

## 11. Critical data, as a tag

Data is good enough for a use, or not, and each use of a table depends on a few of its columns.
The model's YAML names them: a column's `meta.critical_for` lists the uses that can't do without it
(the graduation list's printed name for the certificates and the programme; its ceremony and
attendance for the seating plan). After the table builds, dbt tags each of those columns with the
key-only tag `critical_data`, and takes the tag off a column no use needs any more
(`macros/governance/critical_data.sql`). The same columns are the contract's critical data elements
(`criticalDataElement`), and its quality section says what each use needs, at the level agreed with
the people who use it (`docs/conventions.md`, *What each use needs*). Once, on the platform:

1. An account admin makes `critical_data` a governed tag, with no values (Catalog Explorer:
   *Govern*, *Governed Tags*, *Create governed tag*). Governed, only those with `ASSIGN` on it can
   set it, so a column is marked critical where its uses are written down, and nowhere else.
2. Give the identity that runs dbt `ASSIGN` on it. It owns the tables it builds, which is enough to
   tag their columns; anyone else needs `APPLY TAG` on the table too.

Tagging a column takes Databricks Runtime 16.1 or above, or a SQL warehouse. To list every critical
column in the catalog, and the table it's in:

```sql
select schema_name, table_name, column_name
from information_schema.column_tags
where tag_name = 'critical_data'
```

## 12. Deleted means deleted

When the privacy office approves a request to erase someone's data, the data team deletes it where
it starts, then from every copy, each on its date, and can show when the last one went. HR's
tutors' newsletters show how: the list, `mart_hr__tutors_mailing_list`, and its send log,
`mart_hr__tutor_news_sent`. Nothing here runs in the build.

1. **Where it starts.** HR builds the list again at the start of each teaching period, from HR's
   records: each casual tutor whose answer about news of tutoring work is yes
   (`stg_hr_system__wishes`). A row deleted only from the list would come back at the next build,
   so the person's no goes on their record in HR's system, put there by the owner of HR's records,
   and each table made from it follows. The rest of the record stays: HR keeps pay records by law.
2. **What only adds rows gets its own delete.** The send log is incremental: each build adds the
   newsletters sent since the last, so rebuilding the list never touches it. It can't be built
   again from the start (`full_refresh: false`), or HR's records would bring back everyone the
   deletes removed.
3. **One job, by request.** `privacy-deleter`, the nightly deletion job, a service principal owned
   by Sam Okafor, who runs the data platform, runs at 01:00, before the 02:00 load, for each request
   the office has approved:

   ```bash
   dbt run-operation erase_a_request --args '{request: "2026-117"}' --target databricks --profiles-dir .
   dbt run-operation clean_up_old_files --target databricks --profiles-dir .
   ```

   Each model whose meta names `erase_by`, with its key set and column, loses the rows whose key is
   one of the request's (`macros/privacy/erase.sql`). The keys are read from the restricted table
   `privacy.request_keys` (`request`, `system`, `key`), which only the privacy office's group and
   its jobs may read. So the job's code and every statement name the request, never the person:
   `system.query.history` keeps each statement's text for a year, and nobody can edit it.
4. **A delete, a purge, then VACUUM.** A delete makes a new version of the table, and its history
   (`DESCRIBE HISTORY`) records it, like a receipt; time travel still reads the versions before it.
   Both tables have deletion vectors on (`delta.enableDeletionVectors`), so a delete only marks the
   rows, in files that still hold them: the job then rewrites those files without them
   (`REORG TABLE ... APPLY (PURGE)`). The old files are kept 7 days
   (`delta.deletedFileRetentionDuration`, the default), so a mistake can be undone. `VACUUM`, the
   job's last step each night, removes them on the seventh night after the delete, and with them
   every version that still held the rows.
5. **The proof.** `analyses/privacy/check_a_request_is_gone.sql` counts the request's rows in each
   of those tables, now and as the table was before the delete:

   ```bash
   dbt compile --target databricks --profiles-dir . --select check_a_request_is_gone \
       --vars '{request: "2026-117", before: "2026-11-24"}'
   ```

   The first count is 0 the morning after the job. The second finds the rows for 7 days, then
   fails with an error, because the old files are gone.
6. **Every copy.** Lineage shows each table built from HR's records, and each column's
   `personal_data` tag what it holds (section 1). A copy outside the platform is an exposure: the
   mailing tool copies the list each night at 04:00 and drops whoever has left it, and its contract
   says its own backups lose them within 30 days (`exposures/hr/`); HR, the copy's owner, checks
   that. Each night's locked copy of production, kept 30 days in a place apart, can't be deleted
   early, even by an admin (on Azure, for example, immutable storage with a locked time-based
   retention policy): a person's rows stay in the copies made before the delete, out of use, until
   each is removed. A restored copy is read by no one until the job has run every answered request
   against it again, so a request's keys stay in `privacy.request_keys` until the last locked copy
   that can hold its rows is gone (for request 2026-117, on 24 December).
7. **Cold, until its day.** Payroll's pay records (`examples/hot-warm-cold/pay_records_archive.sql`)
   are kept 7 years after each contract ends, and once a contract has ended, only HR's records team
   reads its records. A year after they're written, their files move to Azure Storage's archive
   tier, where a file can't be read, changed or deleted until it's brought back, which takes hours.
   So the files are grouped by the year each contract ended: each January, a clean-up job brings
   back the year whose seven years have passed (`SHOW ARCHIVED FILES` lists its files), deletes it
   whole, unless a hold keeps part of it, then purges and vacuums.
8. **Out of the logs.** Deletes, checks and searches name the request, never the person. An agent's
   trace records each prompt and answer, and the gateway's inference tables keep each request and
   response: email addresses are masked before a trace is saved (MLflow's masking), and traces and
   the inference tables' rows are deleted after 30 days, the university's rule. A ticket names no
   one: an issue keeps its edits, and every commit is copied to every clone.

## 13. Reports due today, every morning

When a graduate presses "This isn't my name" in the portal, the registrar's office promises an
answer within two working days. That's a rule about what people do, not about whether the data is
right, so it's tracked in a model of its own, `mart_graduations__name_reports`, reviewed every week
and never failed as a test (`docs/conventions.md`, *Tests*). The office hears what's due from a
Databricks SQL alert, which runs a query on a schedule and notifies when its result meets a
condition. Once, on the platform:

1. Compile the alert's query, `analyses/alerts/name_reports_due_today.sql`
   (`dbt compile --target databricks --select name_reports_due_today --profiles-dir .`), and create
   an alert with it. An alert keeps its own query: a saved query can't be reused.
2. The condition: the sum of `reports_due` is greater than 0. Set *Empty result state* to OK, so a
   morning with nothing due sends nothing.
3. The schedule: every day at 8:00, in Quartz cron syntax `0 0 8 * * ?`.
4. The notification: the registrar's office's email destination, with a custom template that
   includes `{{QUERY_RESULT_TABLE}}`, the list itself (its first 100 rows; only email shows it).
   The names in it are direct personal data (section 3), so it goes to the office that owns them,
   and to no one else.

The alert can also be written as code, an `alerts` resource in a bundle, so a change to it is
reviewed like any other change to the project.

## Sources (checked 20 October 2026; *SET TAG* to *TABLE_PRIVILEGES* on 28 October 2026; *Configure access request destinations* to Ontos's workflows on 29 October 2026; *Unity Gateway release notes* to the end on 4 November 2026, *Skills support in Unity Gateway* to the end again, the last two, on 5 November 2026; *Prepare your data for GDPR compliance* to the end, for section 12, and *Databricks SQL alerts* to the end, for section 13, on 10 November 2026)

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
- Databricks, *Unity Gateway release notes* (generally available, 4 August 2026):
  https://docs.databricks.com/aws/en/release-notes/unity-gateway/
- Databricks, *AI governance*: https://docs.databricks.com/aws/en/ai-gateway/ai-governance
- Databricks, *Model services* (only the owner can call one until it grants `EXECUTE`):
  https://docs.databricks.com/aws/en/ai-gateway/model-services
- Databricks, *Govern an MCP*: https://docs.databricks.com/aws/en/ai-gateway/govern-mcp-service
- Databricks, *Rate limits*: https://docs.databricks.com/aws/en/ai-gateway/rate-limits
- Databricks, *Usage tracking*: https://docs.databricks.com/aws/en/ai-gateway/usage-tracking
- Databricks, *Service policies for AI securables* (Beta):
  https://docs.databricks.com/aws/en/data-governance/unity-catalog/service-policies/
- Databricks, *Detect sensitive data with a service policy* (its categories; names aren't among them):
  https://docs.databricks.com/aws/en/data-governance/unity-catalog/service-policies/detect-sensitive-data
- Databricks, *Service principals*: https://docs.databricks.com/aws/en/admin/users-groups/service-principals
- Databricks, *Manage service principals* (deactivation keeps its permissions):
  https://docs.databricks.com/aws/en/admin/users-groups/manage-service-principals
- Databricks, *Groups* (`account users` holds every user and service principal):
  https://docs.databricks.com/aws/en/admin/users-groups/groups
- Databricks, *Authenticate with Databricks personal access tokens (legacy)*:
  https://docs.databricks.com/aws/en/dev-tools/auth/pat
- Databricks, *Create a custom tool* (a function as a tool needs `EXECUTE`):
  https://docs.databricks.com/aws/en/agents/custom-agents/create-custom-tool
- Databricks, *Lineage system tables*: https://docs.databricks.com/aws/en/admin/system-tables/lineage
- Databricks, *Skills support in Unity Gateway* (Beta): https://docs.databricks.com/aws/en/agents/uc-skills/
- Databricks, *Govern skills* (the creator is the owner; the volume privileges; the audit):
  https://docs.databricks.com/aws/en/ai-gateway/govern-skills
- Databricks, *Tutorial: Create and share Unity Gateway Skills* (the sync notebook never deletes):
  https://docs.databricks.com/aws/en/agents/uc-skills/create-share-uc-skills
- Databricks, *Agent sessions* (Beta; deleting a session doesn't delete memory):
  https://docs.databricks.com/aws/en/agents/agent-memory/managed-sessions
- Databricks, *Agent memory* (Beta; the store, not the actor, is the security boundary):
  https://docs.databricks.com/aws/en/agents/agent-memory/managed-memory
- Databricks, *Agent memory pipelines* (Beta; scheduled runs about every 24 hours):
  https://docs.databricks.com/aws/en/agents/agent-memory/memory-pipelines
- Databricks, *Tutorial: Add sessions and memory to an existing agent* (a read-only grant):
  https://docs.databricks.com/aws/en/agents/agent-memory/existing-agent-tutorial
- Databricks, *Lakebase Postgres*: https://docs.databricks.com/aws/en/oltp/projects/
- Databricks, *SET TAG*, again for section 11 (a column takes a key-only tag; setting a tag already
  there fails; Databricks Runtime 16.1 and above): https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-syntax-ddl-set-tag
- Databricks, *COLUMN_TAGS* (the tags on each column, by catalog, schema and table):
  https://docs.databricks.com/aws/en/sql/language-manual/information-schema/column_tags
- Azure Databricks, *Prepare your data for GDPR compliance* (delete where the data starts, from a
  scheduled job driven by a table of requests, then upstream and downstream):
  https://learn.microsoft.com/en-us/azure/databricks/security/privacy/gdpr-delta
- Azure Databricks, *Deletion vectors in Databricks* (a delete marks rows; a purge rewrites the files):
  https://learn.microsoft.com/en-us/azure/databricks/delta/deletion-vectors
- Azure Databricks, *REORG TABLE* (`APPLY (PURGE)` rewrites the files that hold deleted rows):
  https://learn.microsoft.com/en-us/azure/databricks/sql/language-manual/delta-reorg-table
- Azure Databricks, *Remove unused data files with vacuum* (7 days by default; at least 7 strongly
  recommended): https://learn.microsoft.com/en-us/azure/databricks/delta/vacuum
- Azure Databricks, *Work with table history* (time travel needs a version's log and data files;
  `deletedFileRetentionDuration`): https://learn.microsoft.com/en-us/azure/databricks/delta/history
- Azure Databricks, *Archival support in Azure Databricks* (Public Preview; a delete that touches an
  archived file fails): https://learn.microsoft.com/en-us/azure/databricks/optimizations/archive-delta
- Azure Storage, *Access tiers for blob data* (the archive tier is offline; bringing a file back can
  take up to 15 hours): https://learn.microsoft.com/en-us/azure/storage/blobs/access-tiers-overview
- Azure Storage, *Immutable storage for blob data* (under a time-based retention policy, a file can be
  read, not changed or deleted): https://learn.microsoft.com/en-us/azure/storage/blobs/immutable-storage-overview
- Azure Databricks, *Query history system table reference* (each statement's text):
  https://learn.microsoft.com/en-us/azure/databricks/admin/system-tables/query-history
- Azure Databricks, *Log requests and responses to inference tables* (each request and response, in a
  Delta table): https://learn.microsoft.com/en-us/azure/databricks/ai-gateway/inference-tables
- MLflow, *Redacting sensitive data from traces* (masked in the application, before a trace is saved):
  https://mlflow.org/docs/latest/genai/tracing/observe-with-traces/masking/
- dbt, *full_refresh* (false: never built again from the start, whatever the flag):
  https://docs.getdbt.com/reference/resource-configs/full_refresh
- dbt, *Incremental models*: https://docs.getdbt.com/docs/build/incremental-models
- GitHub, *Removing sensitive data from a repository* (clones and forks keep their copies):
  https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository
- Databricks, *Databricks SQL alerts* (a query on a schedule, and a notice when its result meets a
  condition; a saved query can't be reused): https://docs.databricks.com/aws/en/sql/user/alerts/
- Databricks, *Create an alert* (the condition, *Empty result state*, Quartz cron, and the template
  variables, `QUERY_RESULT_TABLE` among them): https://docs.databricks.com/aws/en/sql/user/alerts/create
- Databricks, *Declarative Automation Bundles resources* (an alert, `alerts` in a bundle):
  https://docs.databricks.com/aws/en/dev-tools/bundles/resources
