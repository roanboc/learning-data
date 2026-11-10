-- Written by scripts/generate/agents.py from Noor's map and agents/tools.yml.
-- Don't edit it: change the map, then run the script.
--
-- The planning agent's rights in Unity Catalog. Its role's group, planning_contributors, holds them, never its service
-- principal itself, so a second agent in the role gets the same rights and no more. The group's members are
-- the agents the map assigns to the role; the platform team adds each one in the account console, and the
-- nightly check compares them with the map:
--   planning agent  4f1c9a2e-7b3d-4e61-a8c5-2d9f0b6e1a73
--
-- Each grant says which thing on the map it's for, and which of its role's steps reads or writes it.

-- data product, which it reads in: draft the change, build it in development
-- Names masked: the group isn't a reader of direct personal data, so the catalog's policy masks them.
grant use catalog on catalog analytics to `planning_contributors`;
grant use schema, select on schema analytics.prod_core to `planning_contributors`;
grant use schema, select on schema analytics.prod_marts to `planning_contributors`;

-- test and its result, which it writes in: build it in development
-- dbt builds a schema for each layer (planning_agent_staging, planning_agent_marts, ...), so it creates its
-- own schemas in the development catalog, and owns only what it creates.
grant use catalog, create schema on catalog analytics_dev to `planning_contributors`;

-- The tools its steps call, through Unity Gateway: their catalog and schemas. EXECUTE on each
-- model and tool server is in unity-gateway.yml, with the steps that call it.
grant use catalog on catalog ai to `planning_contributors`;
grant use schema on schema ai.tools to `planning_contributors`;
grant use schema on schema ai.models to `planning_contributors`;
