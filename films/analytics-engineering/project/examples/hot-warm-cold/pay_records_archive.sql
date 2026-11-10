-- Cold: pay records, kept as the law asks, cheaply, until the date they may be deleted. Databricks
-- only (Azure Databricks: archival support works with Azure Storage's archive tier); CI doesn't run it.
--
-- Every pay day, payroll sends the platform a record of each pay, with the hours each casual tutor
-- worked: <production catalog>.<payroll schema>.pay_records, a Delta table, partitioned by nothing, its
-- files written as each pay day's records arrive. Australian law asks employers to keep pay records for
-- seven years, and a casual's record sets out the hours worked (Fair Work Act 2009, s 535; Fair Work
-- Regulations 2009, reg 3.33). After the first year they're rarely read. Until September 2026 every
-- record sat in the costliest storage, and none was ever deleted: a cost, and a risk to everyone in them.
--
-- 1. A year after it's written, each data file moves to the cloud's archive tier, its cheapest. That's
--    a lifecycle rule on the storage account (set by Sam Okafor in Azure, not in Databricks), which moves
--    the table's data files to the archive tier 365 days after they're created. Never the transaction
--    log: _delta_log/ stays where it is.
--
-- 2. The table is told, so Databricks ignores files older than that:

alter table <production catalog>.<payroll schema>.pay_records
  set tblproperties (delta.timeUntilArchived = '365 days');

--    Queries for recent pay still run as before. One that needs an archived year fails early, and
--    says which files to bring back; this lists them, for an audit of 2021:

show archived files for <production catalog>.<payroll schema>.pay_records
  where pay_day between '2021-01-01' and '2021-12-31';

--    Bringing them back (rehydrating them to the hot tier, in Azure) takes hours, which is fine for an
--    audit. While a file is archived it can't be read, changed or deleted.
--
-- 3. The rule for deleting them, as Data protection and privacy's How long, and then what sets it: seven
--    years after each contract ends, then deleted. A casual contract ends in the teaching period it's
--    for, so a casual's records go when the year they were paid in turns seven. A job runs on a date
--    set in advance each year; in October 2026 it deleted the oldest records, those of 2016 to 2018.
--    Rows in archived files can't be deleted where they lie, so it first lists the files the rows to
--    delete are in (as above), has them brought back, and only then deletes:

delete from <production catalog>.<payroll schema>.pay_records
where contract_ends_on < add_months(current_date(), -12 * 7);

--    With deletion vectors on, a delete only marks the rows; this rewrites the files without them:

reorg table <production catalog>.<payroll schema>.pay_records apply (purge);

--    and, once the table's retention threshold has passed (7 days by default), vacuum removes the old
--    files from storage for good. Table history isn't a backup or an archive: it's kept 30 days.

vacuum <production catalog>.<payroll schema>.pay_records;

-- How to delete well (who decides, what else holds a copy, and proving it's gone) is for the films on
-- data protection.
