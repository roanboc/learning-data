-- Governance: the morning check, two gaps on the tables people read. A column the platform's data
-- classification finds personal, with no class from its owner (no personal_data tag); and a column
-- whose class has to be hidden, with no column mask policy over it whose tags name that class. It
-- reads names and classes only: classification's results also keep sample values, never selected
-- here. Databricks only, like the policy (docs/databricks-governance.md, section 16). A Databricks
-- SQL alert runs it each morning at seven, and emails data governance and the platform team when
-- it returns a row. Here: the project's core and marts schemas, and the class direct, which
-- section 3's policy hides. A platform with more catalogs and classes names them (null: every
-- schema of that catalog):
--
--     dbt compile --target databricks --select morning_check --profiles-dir .
--     dbt compile --target databricks --select morning_check --profiles-dir . --vars \
--         '{morning_check_shelves: {registrar: [core, support, published], studies: null},
--           classes_to_hide: [direct, pseudonymous, indirect, special]}'
{%- set core = ref('core_learner') %}
{%- set marts = ref('mart_planning__near_award') %}
{%- set shelves = var('morning_check_shelves', {core.database: [core.schema, marts.schema]}) %}
{%- set hide = var('classes_to_hide', ['direct']) %}
{%- set results = var('classification_results', 'system.data_classification.results') %}
{%- set ns = namespace(shelves=[]) %}
{%- for catalog, schemas in shelves.items() %}
    {%- if schemas %}
        {%- do ns.shelves.append("(catalog_name = '" ~ catalog ~ "' and schema_name in ('" ~ schemas | join("', '") ~ "'))") %}
    {%- else %}
        {%- do ns.shelves.append("catalog_name = '" ~ catalog ~ "'") %}
    {%- endif %}
{%- endfor %}
{%- set on_shelves = '(' ~ ns.shelves | join(' or ') ~ ')' %}
with found as (
    -- what classification found, by column: the classes it detected, never their samples
    select catalog_name, schema_name, table_name, column_name,
           array_join(sort_array(collect_set(class_tag)), ', ') as found_as
    from {{ results }}
    where {{ on_shelves }}
    group by catalog_name, schema_name, table_name, column_name
),

classed as (
    select catalog_name, schema_name, table_name, column_name, tag_value as class
    from system.information_schema.column_tags
    where tag_name = 'personal_data' and {{ on_shelves }}
),

masks as (
    -- every column mask policy in the metastore, and each class its tags name (no value: every class)
    select catalog_name, schema_name, securable_name, governed.tag_value as class
    from (
        select catalog_name, schema_name, securable_name, explode(governed_tags) as governed
        from system.information_schema.abac_policy_definitions
        where policy_type = 'COLUMN_MASK'
    )
    where governed.tag_key = 'personal_data'
)

select 'found personal, with no class' as gap,
       f.catalog_name, f.schema_name, f.table_name, f.column_name, f.found_as as detail, 1 as found
from found as f
left anti join classed as c
    on c.catalog_name = f.catalog_name and c.schema_name = f.schema_name
    and c.table_name = f.table_name and c.column_name = f.column_name

union all

select 'a class to hide, with no policy' as gap,
       c.catalog_name, c.schema_name, c.table_name, c.column_name, c.class as detail, 1 as found
from classed as c
-- a policy counts if it's on the whole metastore, the column's catalog, its schema or its table
left anti join masks as m
    on (m.class = c.class or m.class is null)
    and (m.catalog_name is null or (m.catalog_name = c.catalog_name
        and (m.schema_name is null or (m.schema_name = c.schema_name
            and (m.securable_name is null
                 or m.securable_name in (c.table_name, concat_ws('.', c.catalog_name, c.schema_name, c.table_name)))))))
where c.class in ('{{ hide | join("', '") }}')

order by gap, catalog_name, schema_name, table_name, column_name
