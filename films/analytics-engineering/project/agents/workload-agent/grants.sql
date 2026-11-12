-- Written by scripts/generate/agents.py from Noor's map and agents/tools.yml.
-- Don't edit it: change the map, then run the script.
--
-- The workload agent's rights in Unity Catalog. Its role's group, workload_contributors, holds them, never its service
-- principal itself, so a second agent in the role gets the same rights and no more. The group's members are
-- the agents the map assigns to the role; the platform team adds each one in the account console, and the
-- nightly check compares them with the map:
--   workload agent  7d2b5e90-1c4a-4f83-b6e7-3a9c0d1f2e58
--
-- Each grant says which thing on the map it's for, and which of its role's steps reads or writes it.

-- data product, which it reads in: find why the night build failed, build it in development
-- Personal and sensitive data masked: the group isn't a reader of direct personal data, so the catalog's policy
-- masks it, and these schemas hold nothing special category or restricted.
grant use catalog on catalog analytics to `workload_contributors`;
grant use schema, select on schema analytics.prod_core to `workload_contributors`;
grant use schema, select on schema analytics.prod_marts to `workload_contributors`;

-- test and its result, which it writes in: build it in development
-- dbt builds a schema for each layer (workload_agent_staging, workload_agent_marts, ...), so it creates its
-- own schemas in the development catalog, and owns only what it creates.
grant use catalog, create schema on catalog analytics_dev to `workload_contributors`;

-- The tools its steps call, through Unity Gateway: their catalog and schemas. EXECUTE on each
-- model and tool server is in unity-gateway.yml, with the steps that call it.
grant use catalog on catalog ai to `workload_contributors`;
grant use schema on schema ai.tools to `workload_contributors`;
grant use schema on schema ai.models to `workload_contributors`;
