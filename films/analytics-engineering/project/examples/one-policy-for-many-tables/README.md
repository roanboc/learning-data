# A worked example: one policy for many tables

The registrar's catalog on Databricks holds 38 tables with personal data: 140 columns to hide. Masked by
hand, that's 140 masks, and a new table shows every name until someone remembers it. Instead, every
column carries its class as a governed tag, `personal_data` (`special`, `direct`, `pseudonymous`,
`indirect`), and one policy for each class hides it wherever it lands, in every table on the catalog,
now and later. *One policy for many tables*, film 6 of 8 of *Only what you may see*, shows it.

Databricks only: nothing here runs on DuckDB or in CI. These files sit in the registrar's own bundle, in
the platform team's repository (`uni-example/data-platform`, beside the grants and the nightly load),
not in this dbt project; they're kept here so the film's files can be read. Production's names, as the
film shows them. Test's catalog and owner group have test's names (`registrar_test`,
`registrar_test_owners`), so test runs its own copy of these files with those names: change both in the
same pull request.

| File | What it is |
|---|---|
| `registrar/policies/functions.sql` | A small function for each way to hide a value, on the catalog's shelf for policies, `registrar.policies`: `mask_whole` (words become `***`, anything else empty), `mask_in_part` (`S-***12`, `s***@mail.example`), `generalise` (a date becomes the first of January of its year), `in_faculty` (a yes or a no for each row) and `no_rows` |
| `registrar/policies/policies.sql` | The catalog's six policies, `hide_special`, `hide_direct`, `direct_in_part`, `hide_pseudonymous`, `generalise_indirect` and `close_until_levelled`, and on the core shelf `health_rows_only`, which shows the study only the Faculty of Health's learners |
| `registrar/policies/studies.sql` | The study's own shelf, `studies.health_progress`: every class masked whole, but for the study's group |
| `registrar/policies/check.sql` | Run last: fails the job if a table on core has learners' personal data and no column tagged `faculty`, or a table with personal data has no level |
| `registrar/resources/policies.job.yml` | The bundle's job, `registrar_policies`: one SQL task for each file, in order, run as the identity that deploys the bundle |

## Who is let through

A policy covers everyone in its `TO` list except the groups in `EXCEPT`, and nothing else gets past it:
owning a table isn't enough, nor is an admin account. Who is on each list is the data owner's decision,
Mei Tanaka's; the data team reviews these files, and she is told what each change touches.

| Policy | What it does | Let through |
|---|---|---|
| `hide_special` | Masks `special` whole | `registrar_owners`, `registrar_exam_support` |
| `hide_direct` | Masks `direct` whole | `registrar_owners`, `registrar_office`, `help_desk` |
| `direct_in_part` | Masks `direct` in part | Only covers `help_desk` |
| `hide_pseudonymous` | Masks `pseudonymous` whole | `registrar_owners`, `registrar_office`, `health_progress_study`, `planning_learner_readers` |
| `generalise_indirect` | A date becomes the first of January of its year | `registrar_owners`, `registrar_office` |
| `close_until_levelled` | A table with no `level` shows no rows | `registrar_owners` |
| `health_rows_only` (on `registrar.core`) | Only rows whose column tagged `faculty` holds `HLT` | Only covers `health_progress_study` |

## The rules

1. **One policy for each class, as high as it fits.** On the catalog, a policy covers every shelf and
   every table, including tables made later: a new table needs only its tags. A policy on a shelf, like
   the study's row filter on `core`, covers only that shelf.
2. **One mask for each column, for each reader.** Two different masks for one person on one column stop
   the query with an error. So a reader given a second way, like the help desk, is let through the first.
3. **Let the builder through.** `registrar_owners`, whose only member is `registrar-loader`, is on every
   list, or every table it builds from a masked column would hold the stars for good.
4. **A mask gives back the column's own type.** A date stays a date, or the query fails: `mask_whole`
   and `generalise` take and give a `VARIANT`, so one function serves every type of column.
5. **A filter needs its column.** A table with learners and no column tagged `faculty` isn't filtered at
   all, and would show the study every learner: `check.sql` fails the job if one appears.
6. **Set the level last, on the table.** A table's `level` comes after its columns' classes; until then,
   `close_until_levelled` keeps it closed to all but its builder. Never set `level` on a catalog or a
   shelf: every table under it would inherit it, and none would be closed.
7. **A policy hides only what has a tag.** A column no one has classed shows as it is, until the morning
   check of *Proof it held* finds it.
8. **Rules first, then the door.** The policies go in before any grant that lets a reader in: on 14
   October 2026, this job ran in the morning, and the study's grant came that afternoon.
9. **Check what a table really gets,** not what you meant: `SHOW EFFECTIVE POLICIES ON TABLE
   registrar.core.core_progress_v1` lists every policy that applies to it, with those on its shelf and
   catalog.

Only compute that applies policies can read these tables: serverless compute, or standard or dedicated
compute on Databricks Runtime 16.4 and above (dedicated with fine-grained access control filtering on);
older compute is refused. The job runs on a serverless SQL warehouse. Policies use governed tags, made by an
account admin, so only the classes above can be set, and only by those allowed to.

How the project tags each column, and the first policy by tag it wrote, are in
`docs/databricks-governance.md`, sections 1 and 3; section 12 points here.
