-- Governance: the access review, each December. Who can read a table, from the grants themselves,
-- system.information_schema.table_privileges: each grantee and its privilege, including grants
-- made on the table's schema or catalog. Who is in each group, and until when, is in the
-- university's directory, which the platform syncs. Databricks only, like the policy
-- (docs/databricks-governance.md, section 7). Here: the learner table.
--
--     dbt compile --target databricks --select access_review --profiles-dir .
{%- set table = ref('core_learner') %}
select grantee, privilege_type
from system.information_schema.table_privileges
where table_name = '{{ table.identifier }}'
  and table_schema = '{{ table.schema }}'
  and table_catalog = '{{ table.database }}'
order by grantee, privilege_type
