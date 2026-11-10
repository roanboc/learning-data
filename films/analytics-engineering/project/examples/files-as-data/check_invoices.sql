-- What the functions read is checked like any other data, before anyone pays: first the data project's own checks
-- (is every field read, and do the lines add up to the total?), then Finance's rules (has this number been sent
-- before, and does Finance know the supplier?). An invoice that passes them all goes on to be paid; one that
-- doesn't goes to a person in Rohan Desai's team, with the first reason it stopped. *Files as data and as context*
-- shows it, in *Invoices, read into data*.
--
-- Databricks only: nothing here runs on DuckDB or in CI. It reads finance.supplier_invoices.invoices
-- (read_invoices.sql), and two tables of Finance's own, which this project doesn't hold:
--   finance.payables.suppliers           the suppliers Finance knows, by name
--   finance.payables.invoices_received   every invoice received before this month: supplier_name, invoice_number
-- In the data project the first two checks are data tests on the model: they say whether the data is right.
-- Finance's rules say what the business does, so they don't fail a run: they sort each invoice into the table
-- below, which Rohan's team works through, as an invoice that fails a data test is sorted there too.

CREATE OR REPLACE TABLE finance.supplier_invoices.checked AS
WITH line_sums AS (
  SELECT i.file_path, sum(l.value:amount.value::decimal(12, 2)) AS lines_total
  FROM finance.supplier_invoices.invoices AS i,
    LATERAL variant_explode(i.lines) AS l
  GROUP BY i.file_path
),

received AS (
  SELECT DISTINCT supplier_name, invoice_number FROM finance.payables.invoices_received
),

known AS (
  SELECT DISTINCT lower(trim(supplier_name)) AS supplier_key FROM finance.payables.suppliers
),

checks AS (
  SELECT
    i.*,
    -- the data project's checks
    (i.supplier_name IS NOT NULL AND i.invoice_number IS NOT NULL
      AND i.invoice_date IS NOT NULL AND i.total IS NOT NULL) AS every_field_read,
    coalesce(abs(s.lines_total - i.total) < 0.01, false) AS lines_add_up,
    -- Finance's rules: the same supplier and number, received before, or earlier this month
    (r.invoice_number IS NOT NULL
      OR row_number() OVER (PARTITION BY i.supplier_name, i.invoice_number ORDER BY i.received_at) > 1) AS sent_before,
    k.supplier_key IS NOT NULL AS supplier_known
  FROM finance.supplier_invoices.invoices AS i
  LEFT JOIN line_sums AS s ON s.file_path = i.file_path
  LEFT JOIN received AS r ON r.supplier_name = i.supplier_name AND r.invoice_number = i.invoice_number
  LEFT JOIN known AS k ON k.supplier_key = lower(trim(i.supplier_name))
)

SELECT
  *,
  CASE
    WHEN NOT every_field_read THEN 'A field the function couldn''t read'
    WHEN NOT supplier_known THEN 'A supplier Finance doesn''t know yet'
    WHEN NOT lines_add_up THEN 'Lines that don''t add up to the total'
    WHEN sent_before THEN 'Sent before: the same supplier and number'
  END AS first_reason
FROM checks;

-- What October's 3,860 invoices gave: 3,734 passed every check, and 126 went to a person.
SELECT coalesce(first_reason, 'Passed every check') AS outcome, count(*) AS invoices
FROM finance.supplier_invoices.checked
GROUP BY ALL
ORDER BY invoices DESC;
--   Passed every check                           3734
--   A field the function couldn't read             72
--   A supplier Finance doesn't know yet            31
--   Lines that don't add up to the total           14
--   Sent before: the same supplier and number       9
--
-- A person opens each of the 126 from its file_path and decides. Nothing here pays an invoice: Rohan's team still
-- approves every payment.
