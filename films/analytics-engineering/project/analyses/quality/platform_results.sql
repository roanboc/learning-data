-- Quality: what the platform checked on the source tables last night, a row for each check on each
-- table, for the scorecard and the issues (scripts/generate/scorecard.py and issues.py, --platform).
-- Each kind of check names its quality dimension, as each kind of dbt test does (tests/generic/):
--   - the loading pipeline's expectation has_an_id (scripts/setup/loading_pipeline.sql), from its
--     event log: rows kept out at loading, completeness. A row kept out is a warning: nothing stops;
--   - anomaly detection (in Public Preview), from system.data_quality_monitoring.table_results:
--     each table's freshness, timeliness, and its rows of the last 24 hours, completeness. An
--     unhealthy table is a warning, and one it can't judge yet isn't counted;
--   - the badges' profile: the share of a day's badges with no credit, validity, as the rule it
--     became (DEC-LMS-03). Above 20 in 100 is a warning.
-- Each table's owner and domain are the project's, on its source: the scripts find them by the
-- table's schema and name. Databricks only: compile it, run the SQL on a SQL warehouse after the
-- night's checks, download the result as CSV, and give it to the scripts:
--
--     dbt compile --target databricks --select platform_results --profiles-dir .
--     python scripts/generate/scorecard.py --platform platform_results.csv --out scorecard.md
--     python scripts/generate/issues.py --platform platform_results.csv
{%- set badges = source('learning_platform', 'badges') %}
{%- set catalog = badges.database %}
{%- set schemas = [source('student_system', 'learners').schema, badges.schema, source('short_courses', 'enrolments').schema] %}
with expectations as (
    -- a dataset's name in the event log can be qualified, and quoted: keep its last two parts
    select split(replace(e.dataset, '`', ''), '[.]') as parts, e.name as check_name,
           sum(e.failed_records) as rows_out
    from {{ catalog }}.quality_monitoring.loading_pipeline_events
    lateral view explode(from_json(details:flow_progress:data_quality:expectations,
        'array<struct<name: string, dataset: string, passed_records: bigint, failed_records: bigint>>')) as e
    where event_type = 'flow_progress'
      and timestamp >= current_timestamp() - interval 1 day
    group by all
),
monitors as (
    select schema_name, table_name, freshness.status as freshness, completeness.status as completeness
    from system.data_quality_monitoring.table_results
    where catalog_name = '{{ catalog }}'
      and schema_name in ('{{ schemas | join("', '") }}')
    qualify row_number() over (partition by table_id order by event_time desc) = 1
),
profile as (
    select num_zeros, round(100 * num_zeros / count, 1) as percent_zeros
    from {{ catalog }}.quality_monitoring.{{ badges.identifier }}_profile_metrics
    where column_name = 'credit_points'
      and slice_key is null
    qualify row_number() over (order by window.start desc) = 1
)

select 'pipeline expectation' as kind, element_at(parts, -2) as schema_name, element_at(parts, -1) as table_name,
       check_name, 'completeness' as dimension, if(rows_out > 0, 'warn', 'pass') as status, rows_out as rows,
       'A row with no system key can''t be told apart from another, or versioned: it''s kept out at loading, and counted, until it''s fixed where it''s kept.' as why
from expectations
union all
select 'monitor', schema_name, table_name, 'freshness', 'timeliness',
       case freshness when 'Healthy' then 'pass' when 'Unhealthy' then 'warn' else 'skipped' end, null,
       'Anomaly detection learns when the table usually arrives, with no rule written: it was late.'
from monitors
union all
select 'monitor', schema_name, table_name, 'rows in the last 24 hours', 'completeness',
       case completeness when 'Healthy' then 'pass' when 'Unhealthy' then 'warn' else 'skipped' end, null,
       'Anomaly detection learns how many rows the table usually brings in a day, with no rule written: it brought fewer.'
from monitors
union all
select 'monitor', '{{ badges.schema }}', '{{ badges.identifier }}', 'badges with no credit', 'validity',
       if(percent_zeros > 20, 'warn', 'pass'), num_zeros,
       'A microcredential badge carries credit (DEC-LMS-03). About 1 in 12 badges, the welcome badges, carry none; above 20 in 100, the learning team is told.'
from profile
