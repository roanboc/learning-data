-- Written by scripts/generate/agents.py from Noor's map and agents/tools.yml.
-- Don't edit it: change the map, then run the script.
--
-- The rights every agent's group, and every agent's service principal, holds in Unity Catalog now, granted
-- directly on a catalog, a schema or a table. agents/nightly-check.yml runs it on a SQL warehouse, as the
-- platform's rights reader, and scripts/generate/agents.py --drift compares the rows with the map. A service
-- principal holds nothing itself: a row for one is drift.
select grantee, privilege_type as privilege, 'catalog' as securable_type, catalog_name as securable
from system.information_schema.catalog_privileges
where grantee in ('planning_contributors', 'workload_contributors', '4f1c9a2e-7b3d-4e61-a8c5-2d9f0b6e1a73', '7d2b5e90-1c4a-4f83-b6e7-3a9c0d1f2e58') and coalesce(inherited_from, 'NONE') = 'NONE'
union all
select grantee, privilege_type, 'schema', catalog_name || '.' || schema_name
from system.information_schema.schema_privileges
where grantee in ('planning_contributors', 'workload_contributors', '4f1c9a2e-7b3d-4e61-a8c5-2d9f0b6e1a73', '7d2b5e90-1c4a-4f83-b6e7-3a9c0d1f2e58') and coalesce(inherited_from, 'NONE') = 'NONE'
union all
select grantee, privilege_type, 'table', table_catalog || '.' || table_schema || '.' || table_name
from system.information_schema.table_privileges
where grantee in ('planning_contributors', 'workload_contributors', '4f1c9a2e-7b3d-4e61-a8c5-2d9f0b6e1a73', '7d2b5e90-1c4a-4f83-b6e7-3a9c0d1f2e58') and coalesce(inherited_from, 'NONE') = 'NONE'
order by grantee, securable_type, securable, privilege
