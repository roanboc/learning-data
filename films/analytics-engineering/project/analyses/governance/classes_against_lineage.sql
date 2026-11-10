-- Governance: every column whose class differs from the class of a column it was made from, from the
-- platform's lineage (the system table system.access.column_lineage) and the tags on each column
-- (system.information_schema.column_tags). With tag propagation on, a column made from a tagged one
-- takes its class; where two values for personal_data meet in one column, a conflict, it takes the
-- tag's default value, special (DEC-PRJ-17). No rows: every class agrees with what lineage brings.
-- Each row is a column to look at: a count may rightly hold no class, but a code made after the
-- source should be made once, at the source, by its owner, and taken from there. Lineage records
-- what the platform can infer, on the platform: a copy made elsewhere isn't in it. Databricks only
-- (docs/databricks-governance.md, section 13). Here: every table in the catalog the project builds into.
-- Compile it, then run the SQL in target/compiled/ on a SQL warehouse:
--
--     dbt compile --target databricks --select classes_against_lineage --profiles-dir .
{%- set catalog = ref('core_learner').database %}
with made_from as (
    select distinct source_table_full_name, source_column_name, target_table_full_name, target_column_name
    from system.access.column_lineage
    where target_table_catalog = '{{ catalog }}'
      and source_table_full_name is not null
      and target_table_full_name is not null
),

classes as (
    select concat_ws('.', catalog_name, schema_name, table_name) as table_full_name, column_name,
           tag_value as class
    from system.information_schema.column_tags
    where tag_name = 'personal_data'
)

select made_from.target_table_full_name, made_from.target_column_name,
       coalesce(its.class, 'no tag') as its_class,
       made_from.source_table_full_name, made_from.source_column_name,
       source.class as source_class
from made_from
inner join classes as source
    on made_from.source_table_full_name = source.table_full_name
    and made_from.source_column_name = source.column_name
left join classes as its
    on made_from.target_table_full_name = its.table_full_name
    and made_from.target_column_name = its.column_name
where coalesce(its.class, 'no tag') <> source.class
order by made_from.target_table_full_name, made_from.target_column_name
