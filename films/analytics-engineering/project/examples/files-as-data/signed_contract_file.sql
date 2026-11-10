-- Signed contracts, kept as they were signed: no table of their terms, but their metadata beside each file, which the
-- HR system writes as it makes the document (contract_documents.csv holds Linh Nguyen's two). *Files as data and as
-- context* shows it, in *Contracts, kept as signed*.
--
-- Databricks only: nothing here runs on DuckDB or in CI. The files are in a volume, /Volumes/hr/contracts/files/, and
-- their metadata in a table beside them, hr.contracts.contract_documents. Who may read a contract is Ingrid Holm's to
-- decide, in HR: she names who gets READ VOLUME on the files, and the module *Data protection and privacy* teaches the
-- rest.

CREATE TABLE IF NOT EXISTS hr.contracts.contract_documents (
  contract_id STRING NOT NULL COMMENT 'The contract, as the HR system numbers it, such as T-26188.',
  version INT NOT NULL COMMENT 'Each new document for the same contract is a new version: the offer is 1.',
  kind STRING NOT NULL COMMENT 'offer, sent to be accepted; or signed, the contract as both sides signed it.',
  signed_on DATE COMMENT 'The day it was signed. Empty for an offer.',
  file_path STRING NOT NULL COMMENT 'The document itself, in the volume, kept as it was made.'
)
COMMENT 'Written by the HR system as it makes each contract document. Nobody reads the documents to fill it.';

-- In a folder, an offer and the contract signed after it look alike; by their metadata, they don't. A person, or an
-- agent through Unity Catalog's functions, asks for the signed version, opens that file, and cites it.
CREATE OR REPLACE FUNCTION hr.contracts.signed_contract_file(contract STRING)
RETURNS STRING
COMMENT 'The file of a contract as it was signed: its latest signed version. Answer from this file, and cite its path.'
RETURN SELECT max_by(file_path, version)
  FROM hr.contracts.contract_documents
  WHERE contract_id = contract AND kind = 'signed';

-- When Linh asks when her contract ends:
SELECT hr.contracts.signed_contract_file('T-26188');
--   /Volumes/hr/contracts/files/T-26188_v2.pdf
-- The signed contract says it ends on 20 November 2026; the offer, version 1, said 13 November, before HR added a
-- week for marking. The HR system's own record agrees: data/hr_system/contracts.csv, T-26188, ends_on 2026-11-20.
