-- Privacy: is a request's data gone, now and from the old files? (docs/databricks-governance.md,
-- "Deleted means deleted"). For each model the deletion job erases from (meta.erase_by,
-- macros/privacy/erase.sql): how many rows hold one of the request's keys now, which should be 0
-- the morning after the job; and how many the table held as it was before the delete, read by time
-- travel. That second count finds the rows for 7 days, while the old files are kept so a mistake
-- can be undone; once VACUUM has removed them, the query fails with an error instead: the proof
-- that the old versions are gone too. Like the job, it names the request, never the person.
-- Databricks only.
--
--     dbt compile --target databricks --profiles-dir . --select check_a_request_is_gone \
--         --vars '{request: "2026-117", before: "2026-11-24"}'
{%- if execute %}
{%- for m in erased_models() %}
select
    '{{ m.name }}' as table_name,
    (select count(*) from {{ m.relation }}
     where {{ m.column }} in ({{ request_keys(var('request'), m.key_set) }})) as rows_now,
    (select count(*) from {{ m.relation }} timestamp as of '{{ var("before") }}'
     where {{ m.column }} in ({{ request_keys(var('request'), m.key_set) }})) as rows_before
{{ "union all" if not loop.last }}
{%- endfor %}
{%- endif %}
