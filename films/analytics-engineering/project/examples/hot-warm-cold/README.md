# A worked example: data kept hot, warm and cold

In September 2026, Noor Rahman, the data architect, asked each data owner two questions: how fresh
must it be, and how often is it read? The answers set three temperatures, and each went into the
data's contract. Contracts are hot: the claims app checks each claim against the tutor's contract,
and a change HR records on a Monday morning must reach it before noon, so the HR system pushes each
change as it's made, and a pipeline keeps a streaming table of every contract as it stands, within a
minute. What each faculty has spent against its budget is warm: yesterday's figures are fresh
enough, so it's a materialized view, worked out each night at 02:00 from the finance system's
ledger, read in place. Pay records are cold: kept for seven years, as Australian law asks, and
rarely read after the first, so a year after each file is written it moves to the cloud's archive
tier, and the records are deleted when their seven years are up. *Hot, warm, cold*, film 2 of 3 of
*Data that moves*, in *Modern data basics*, shows it.

Databricks only: nothing here runs on DuckDB or in CI. Catalogs and schemas are placeholders, as
`AGENTS.md` writes them (`<production catalog>`). The numbers are the film's.

| File | Temperature | What it is |
|---|---|---|
| `contracts_as_they_stand.sql` | Hot | The pipeline that applies each change the HR system pushes to a streaming table of every contract as it stands: Lakeflow Spark Declarative Pipelines, in SQL (`AUTO CDC`, SCD type 1), run in continuous mode |
| `spending_by_faculty.sql` and `spending_by_faculty.yml` | Warm | Jun Park's dbt model: a materialized view of what each faculty has spent this year against its budget, from the finance system's ledger read in place through Lakehouse Federation, on a schedule of 02:00, Sydney time; with its description and tests |
| `pay_records_archive.sql` | Cold | Payroll's pay records: the table told when its files go to the archive tier (`delta.timeUntilArchived`), the files an audit needs back (`SHOW ARCHIVED FILES`), and the yearly deletion (`DELETE`, `REORG TABLE ... APPLY (PURGE)` and `VACUUM`) |
| `service_levels.yaml` | All three | Each answer as it goes into the data's contract, how fresh and how long it's kept, as the Open Data Contract Standard's service levels (`slaProperties`) |

Four things the film shows aren't files here: the HR system's side of Zerobus Ingest, which pushes
each change into the landing table `contract_changes`; the storage account's lifecycle rule, set in
Azure, which moves each data file to the archive tier 365 days after it's written; the pipeline's
continuous mode, one of its settings; and the way the platform serves the table of contracts to the
claims app, which *One copy, one platform* shows.

The contracts in `governance/5-data-contracts/` are generated from the data products, and every one
of them is warm: built each night, ready by 7 a.m. That's where the film starts. How to delete well
(who decides, what else holds a copy, and proving it's gone) is for the films on data protection.
