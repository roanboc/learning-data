-- Supplier invoices, read into data: from PDF files in a Unity Catalog volume to one row for each invoice,
-- each row keeping the path of its file. *Files as data and as context* shows it, in *Invoices, read into data*.
--
-- Databricks only: nothing here runs on DuckDB or in CI. ai_parse_document and ai_extract run on serverless compute
-- or a SQL warehouse, not a classic one (their pages say so); ai_extract can't be used in a view, so the steps
-- write tables. The syntax is as Databricks' docs gave it on 5 November 2026: start from them, as the film says.
--
-- Every invoice Finance receives lands as a file in a volume, governed in Unity Catalog as tables are:
--   /Volumes/finance/supplier_invoices/incoming/
-- Reading the files needs READ VOLUME on it. The suppliers, their invoices and every number are invented.

-- 1. Read each file once, and keep what the function read with the file's path. ai_parse_document finds a page's
--    words, its tables and where each sits on the page. Reading costs more than any step after it, so its output is
--    kept, and each run reads only the files that aren't in the table yet.
CREATE TABLE IF NOT EXISTS finance.supplier_invoices.parsed (
  file_path STRING COMMENT 'The invoice as its supplier sent it: open this file to see where a row came from.',
  file_modified TIMESTAMP COMMENT 'When the file last changed in the volume.',
  parsed VARIANT COMMENT 'What ai_parse_document read: the pages, each element on them (text, tables, figures) and where it sits.'
);

INSERT INTO finance.supplier_invoices.parsed
SELECT
  path AS file_path,
  modificationTime AS file_modified,
  ai_parse_document(content, map('version', '2.0')) AS parsed
FROM read_files('/Volumes/finance/supplier_invoices/incoming/', format => 'binaryFile')
WHERE path NOT IN (SELECT file_path FROM finance.supplier_invoices.parsed);

-- 2. Take out the fields Finance names, one row for each invoice. The schema says what each field is, in Finance's
--    words; ai_extract returns each field as {"value": ...}, or null where it couldn't read one.
CREATE OR REPLACE TABLE finance.supplier_invoices.extracted AS
SELECT
  file_path,
  file_modified,
  ai_extract(
    parsed,
    '{
      "supplier_name": {"type": "string", "description": "The business that sent the invoice, as named on it"},
      "invoice_number": {"type": "string", "description": "The invoice number, exactly as the supplier wrote it"},
      "invoice_date": {"type": "string", "description": "The day the invoice was issued, in YYYY-MM-DD format"},
      "total": {"type": "number", "description": "The total to pay, in Australian dollars, GST included"},
      "lines": {
        "type": "array",
        "description": "Each line of the invoice, the GST line included",
        "items": {
          "type": "object",
          "properties": {
            "description": {"type": "string"},
            "amount": {"type": "number", "description": "The line amount, in Australian dollars"}
          }
        }
      }
    }',
    map('version', '2.1', 'instructions', 'These are supplier invoices sent to the university''s Finance team, in Australian dollars.')
  ) AS extracted
FROM finance.supplier_invoices.parsed;

-- 3. The rows Jun's data project reads: each field typed, and the path of its file kept on every row.
CREATE OR REPLACE TABLE finance.supplier_invoices.invoices AS
SELECT
  file_path,
  file_modified AS received_at,
  extracted:response.supplier_name.value::string AS supplier_name,
  extracted:response.invoice_number.value::string AS invoice_number,
  try_cast(extracted:response.invoice_date.value::string AS DATE) AS invoice_date,
  extracted:response.total.value::decimal(12, 2) AS total,
  extracted:response.lines AS lines,
  extracted:error_message::string AS error_message
FROM finance.supplier_invoices.extracted;

-- In October, 3,860 rows, one for each file: for Larkspur Catering's invoice LC-20931,
--   file_path       /Volumes/finance/supplier_invoices/incoming/LC-20931.pdf
--   supplier_name   Larkspur Catering
--   invoice_number  LC-20931
--   invoice_date    2026-10-28
--   total           1284.00
-- check_invoices.sql checks every row before Rohan Desai's team pays it.
