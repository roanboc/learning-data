-- Warm: every contract in the HR system as it stands, within five minutes of HR recording a change. The
-- claims app checks each claim against it, and claims approved by noon on Monday are paid on Thursday, so
-- a contract HR changes on a Monday morning has to reach the app before noon. Coordinators approve claims
-- all morning: they act within minutes or hours, so five minutes is in time, and far cheaper than a
-- pipeline that never stops.
--
-- Why through the platform at all? Ideally contracts and claims would live in one system; the new ERP
-- brings them together in 2028. Until then the platform fills the gap, as organisations running old
-- systems beside new ones always do. Lakeflow Spark Declarative Pipelines, in SQL. Databricks only; CI
-- doesn't run it.
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
-- Every five minutes, this pipeline takes in the changes that have arrived and applies them to a
-- streaming table of every contract as it stands: one row per contract, its latest version (SCD type 1;
-- the HR system keeps every version of every row, and the data project's snapshot of it keeps history,
-- so this table doesn't need to). The pipeline runs in triggered mode, started every five minutes by a
-- job's schedule, so nothing runs between runs; continuous mode, always running, would cost far more for
-- no action that needs it. The platform serves the table to the claims app, as One copy, one platform
-- shows.
--
-- Owner: HR (Ingrid Holm), who agrees the contract at the HR system's interface. No pay or rate of pay
-- travels in it: the app needs the contract's unit, dates and pay type, never what it pays.

create or refresh streaming table contracts
  comment 'Every contract in the HR system as it stands now: one row per contract, each change applied within five minutes of HR recording it. The claims app checks each claim against it. Owner: HR (Ingrid Holm).';

create flow contracts_as_they_stand as auto cdc into contracts
from stream(<production catalog>.<hr schema>.contract_changes)
keys (contract_id)
apply as delete when operation = 'DELETE'
sequence by changed_at
columns * except (operation)
stored as scd type 1;
