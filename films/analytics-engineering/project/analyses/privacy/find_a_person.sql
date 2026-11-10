-- Privacy: one column of one table, for a request: how many rows hold the person, by one of their
-- numbers or by the code made from it, so a table that keeps only codes is found too
-- (docs/databricks-governance.md, "A person's request"). The search job, privacy-finder, runs it for each
-- column where_a_person_is.sql lists. The numbers come from the restricted table
-- privacy.request_keys, joined by the request's number: no one's number is ever typed into a
-- query, whose text the platform keeps for a year (system.query.history). A number is matched as
-- the system writes it (S-20436), as the project's key (SIS|S-20436), and as the project's code,
-- the sha-256 of that key in upper case (hash_key, macros/shared/keys.sql). Databricks only.
--
--     dbt compile --target databricks --profiles-dir . --select find_a_person \
--         --vars '{request: "2026-117", table: prod_marts.mart_wallet__learners, column: learner_key}'
{%- set table = var('table') %}
{%- set column = var('column') %}
select count(*) as rows_found
from {{ table }} as t
join privacy.request_keys as k
  on k.request = '{{ var("request") }}'
 and t.{{ column }} in (k.key, k.system || '|' || k.key,
     sha2(upper(k.system || '|' || k.key), 256))
