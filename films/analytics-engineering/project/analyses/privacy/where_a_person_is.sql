-- Privacy: where to look for a person, for a request (docs/databricks-governance.md, "A person's request").
-- Every table built from the tables of the five systems a person's numbers come from, through the
-- platform's lineage, which follows what dbt builds and what notebooks, jobs and dashboards build
-- too; and in each one, the columns whose class says they name a person or hold a code for one
-- (the tag personal_data, macros/governance/personal_data.sql). The search job, privacy-finder,
-- looks in each of them with find_a_person.sql. Lineage records only what it can infer, and only on
-- the platform: payroll, the claims app, the mailing tool and the signed contracts are searched by
-- their owners. A table here with no tagged column has no class yet: someone looks at it by hand.
-- Databricks only, like the policy; recursive queries need Databricks SQL or Runtime 17.0 and above.
--
--     dbt compile --target databricks --profiles-dir . --select where_a_person_is
{%- set systems = [
    source('hr_system', 'staff'), source('hr_system', 'contracts'),
    source('student_system', 'learners'), source('student_system', 'past_learners'),
    source('student_system', 'results'), source('alumni_system', 'alumni'),
    source('research_system', 'researchers'), source('research_system', 'project_members'),
    source('learning_platform', 'users'), source('learning_platform', 'badges'),
] %}
with recursive

edges as (
    select distinct
        lower(source_table_full_name) as built_from,
        lower(target_table_full_name) as table_name
    from system.access.table_lineage
    where source_table_full_name is not null
      and target_table_full_name is not null
      and source_table_full_name <> target_table_full_name
),

downstream (table_name, steps) as (
    select table_name, 0
    from values
    {%- for system in systems %}
        ('{{ (system.database ~ "." ~ system.schema ~ "." ~ system.identifier) | lower }}'){{ "," if not loop.last }}
    {%- endfor %}
        as systems (table_name)
    union all
    select edges.table_name, downstream.steps + 1
    from downstream
    join edges on edges.built_from = downstream.table_name
    where downstream.steps < 10
),

tables as (
    select distinct table_name from downstream
)

select
    tables.table_name,
    tags.column_name,
    tags.tag_value as class
from tables
left join system.information_schema.column_tags as tags
  on lower(tags.catalog_name || '.' || tags.schema_name || '.' || tags.table_name) = tables.table_name
 and tags.tag_name = 'personal_data'
 and tags.tag_value in ('direct', 'pseudonymous')
order by tables.table_name, tags.column_name
