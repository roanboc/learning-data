-- Quality: the week, night by night, from what each night's run kept (check_results, written by the
-- last step of every run: macros/governance/keep_check_results.sql). For each check, a row for each of
-- the last seven nights: whether it passed, and how many rows it held or failed, from that night's
-- last run. Read on Thursdays, beside what people count (the reports, the hours of hand work, the
-- hundred records), on one dashboard (Small, every week): a check that holds more rows each night is
-- something to look at, even while every night passes. A night's later runs replace its earlier
-- ones, so a rerun after a fix counts once. The same SQL runs on DuckDB and on Databricks:
--
--     dbt build --profiles-dir .
--     dbt compile --select checks_by_night --profiles-dir .
{%- set kept = api.Relation.create(database=target.database, schema=target.schema, identifier='check_results') %}
with

nights as (

    select
        cast(run_started_at as date) as night,
        check_name,
        owner,
        dimension,
        status,
        coalesce(failures, 0) as rows_held,
        row_number() over (
            partition by check_name, cast(run_started_at as date)
            order by run_started_at desc
        ) as latest
    from {{ kept }}
    where run_started_at >= current_date - interval 7 day

)

select
    night,
    check_name,
    owner,
    dimension,
    status,
    rows_held,
    rows_held - lag(rows_held) over (partition by check_name order by night) as more_than_the_night_before
from nights
where latest = 1
order by check_name, night
