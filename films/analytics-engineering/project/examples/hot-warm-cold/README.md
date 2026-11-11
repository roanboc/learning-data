# A worked example: data that arrives cold, warm or hot, and is kept where it's read

In September 2026, Noor Rahman, the data architect, asked one question of each kind of data: when does
someone act on it? Not whether people would like it fresher (asked, they always say yes), but what
they do next, from real use. The answer sets its temperature, and each went into the data's contract:
cold is days and longer, warm minutes to hours, hot milliseconds to a few seconds. The platform offers
all three; which one each kind gets is the business's call.

What each faculty has spent against its budget is cold: it's talked over once a month, so yesterday's
figures are fresh enough, and it's a materialized view worked out each night at 02:00 from the finance
system's ledger, read in place. Contracts are warm: the claims app checks each claim against the
tutor's contract, and coordinators approve claims until noon on Monday, so the HR system pushes each
change as it's made and a pipeline brings the changes in every five minutes, until the new ERP brings
contracts and claims into one system in 2028. A bank account change is hot: a rule checks it against
the sign-in behind it within a second, and holds that one pay if it comes from a new device close to
pay day; the full record still comes in payroll's nightly file. *Hot, warm, cold*, film 2 of 4 of
*Data that moves*, in *Modern data basics*, shows it.

Where data is kept, and for how long, is the other question, and *Read often, kept close*, film 4,
shows it: pay records are read often for a year, then rarely, so a year after each file is written it
moves to the cloud's archive tier, and the records are deleted when their seven years are up, as
Australian law asks.

Databricks only: nothing here runs on DuckDB or in CI. Catalogs and schemas are placeholders, as
`AGENTS.md` writes them (`<production catalog>`). The numbers are the film's.

| File | Temperature | What it is |
|---|---|---|
| `spending_by_faculty.sql` and `spending_by_faculty.yml` | Cold | Jun Park's dbt model: a materialized view of what each faculty has spent this year against its budget, from the finance system's ledger read in place through Lakehouse Federation, on a schedule of 02:00, Sydney time; with its description and tests |
| `contracts_as_they_stand.sql` | Warm | The pipeline that applies the changes the HR system pushes to a streaming table of every contract as it stands: Lakeflow Spark Declarative Pipelines, in SQL (`AUTO CDC`, SCD type 1), triggered every five minutes |
| `bank_change_hold.py` | Hot | The rule that checks each bank account change against the sign-in behind it and holds one pay: Structured Streaming in real-time mode, a stream-to-stream join of two event streams, and a writer that calls payroll |
| `pay_records_archive.sql` | Cold, kept in the archive tier | Payroll's pay records: the table told when its files go to the archive tier (`delta.timeUntilArchived`), the files an audit needs back (`SHOW ARCHIVED FILES`), and the yearly deletion (`DELETE`, `REORG TABLE ... APPLY (PURGE)` and `VACUUM`) |
| `service_levels.yaml` | All three | Each answer as it goes into the data's contract, how fresh, where it's kept and how long, as the Open Data Contract Standard's service levels (`slaProperties`) |

Four things the films show aren't files here: the HR system's side of Zerobus Ingest, which pushes
each change into the landing table `contract_changes`; the storage account's lifecycle rule, set in
Azure, which moves each data file to the archive tier 365 days after it's written; the job that
starts the contracts pipeline every five minutes, one of its settings; and the way the platform serves
the table of contracts to the claims app, which *One copy, one platform* shows.

The data products' tables, and the enterprise contracts in `governance/5-data-contracts/`, are all
cold: built each night, ready by 7 a.m., as most analysis should be. How to delete well
(who decides, what else holds a copy, and proving it's gone) is for the films on data protection.
