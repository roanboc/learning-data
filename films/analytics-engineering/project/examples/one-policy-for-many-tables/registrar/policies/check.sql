-- Run last by the registrar's job, after the policies: fails the job, with what it found, if
--   1. a table on core holds learners' personal data and has no column tagged faculty, since the study's
--      row filter finds nothing in it and would show the study every learner, or
--   2. a table with personal data has no level, which close_until_levelled keeps closed (so no one is
--      exposed, but its readers can't work until its owner levels it).
-- A policy hides only what has a tag: a column no one has classed is the morning check's to find (Proof it
-- held). Databricks only. Production's names.

with personal as (
    select distinct schema_name, table_name
    from registrar.information_schema.column_tags
    where tag_name = 'personal_data' and tag_value <> 'none'
),

with_faculty as (
    select distinct schema_name, table_name
    from registrar.information_schema.column_tags
    where tag_name = 'faculty'
),

levelled as (
    select distinct schema_name, table_name
    from registrar.information_schema.table_tags
    where tag_name = 'level'
),

gaps as (
    select concat(p.schema_name, '.', p.table_name, ': no faculty column') as gap
    from personal as p
    left join with_faculty as f using (schema_name, table_name)
    where p.schema_name = 'core' and f.table_name is null
    union all
    select concat(p.schema_name, '.', p.table_name, ': no level') as gap
    from personal as p
    left join levelled as l using (schema_name, table_name)
    where l.table_name is null
)

select
    if(count(*) = 0, 'every table on core has its faculty column, and every table with personal data its level',
       raise_error(concat('Tables to fix: ', array_join(sort_array(collect_list(gap)), '; ')))) as result
from gaps;
