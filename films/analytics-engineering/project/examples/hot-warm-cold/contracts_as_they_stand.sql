-- Hot: every contract in the HR system as it stands, within a minute of HR recording a change. The claims
-- app checks each claim against it, and claims approved by noon on Monday are paid on Thursday, so a
-- contract HR changes on a Monday morning has to reach the app before noon. Lakeflow Spark Declarative
-- Pipelines, in SQL. Databricks only; CI doesn't run it.
--
-- Until September 2026 the platform took in the HR system's changes once a night, at 02:00 (the example
-- data's _valid_from times), so the app saw Monday's changes on Tuesday, and 23 tutors waited two more
-- weeks for their pay. Now the HR system pushes each change as it's made, through Zerobus Ingest, which
-- writes it straight into a Delta table in Unity Catalog, with no message bus to run:
--
--   <production catalog>.<hr schema>.contract_changes
--     one row per change, as the HR system sends it: contract_id, staff_id, position_type,
--     position_title, pay_type, unit_code, teaching_period, starts_on, ends_on, and two columns of its
--     own, operation (INSERT, UPDATE or DELETE) and changed_at (when HR recorded the change)
--
-- This pipeline takes in each change as it arrives and applies it to a streaming table of every contract
-- as it stands: one row per contract, its latest version (SCD type 1; the HR system keeps every version
-- of every row, and the data project's snapshot of it keeps history, so this table doesn't need to). The
-- pipeline runs in continuous mode, so something is always running: that's why hot costs the most, and
-- why only what's needed within minutes is kept hot. The platform serves the table to the claims app, as
-- One copy, one platform shows.
--
-- Owner: HR (Ingrid Holm), who agrees the contract at the HR system's interface. No pay or rate of pay
-- travels in it: the app needs the contract's unit, dates and pay type, never what it pays.

create or refresh streaming table contracts
  comment 'Every contract in the HR system as it stands now: one row per contract, each change applied within a minute of HR recording it. The claims app checks each claim against it. Owner: HR (Ingrid Holm).';

create flow contracts_as_they_stand as auto cdc into contracts
from stream(<production catalog>.<hr schema>.contract_changes)
keys (contract_id)
apply as delete when operation = 'DELETE'
sequence by changed_at
columns * except (operation)
stored as scd type 1;
