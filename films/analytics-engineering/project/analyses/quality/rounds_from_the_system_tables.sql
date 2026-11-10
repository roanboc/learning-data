-- Quality: the rounds of checking the graduation list by hand, counted from the platform's own
-- records (The hidden factory). Each round starts with the list queried and its result downloaded
-- from the SQL editor: the query history, system.query.history, has each query on the list, who
-- ran it and when; the audit log, system.access.audit, has each download, as the action
-- downloadQueryResult of the service databrickssql. A day with both, by one person, is a round's
-- first day: for 2025-26, three Mondays, one before each list, by the graduations team. Beside
-- each, the round's hours from the team's calendar (seeds/reference/graduations/hand_check_rounds.csv).
-- The query history shows a query's text only to account admins and the group allowed to read it,
-- so Sam Okafor, who runs the platform, runs this. Databricks only: compile it, then run the SQL
-- in target/compiled/ on a SQL warehouse:
--
--     dbt compile --target databricks --select rounds_from_the_system_tables --profiles-dir .
{%- set graduation_list = ref('mart_graduations__graduation_list') %}
with queries as (
    -- dbt's own tests read the list each night too, but nobody downloads their results
    select cast(start_time as date) as queried_on, executed_by, count(*) as queries
    from system.query.history
    where statement_type = 'SELECT'
      and contains(lower(statement_text), '{{ graduation_list.identifier | lower }}')
      and start_time >= '2025-08-01'
    group by all
),
downloads as (
    select event_date as downloaded_on, user_identity.email as downloaded_by, count(*) as downloads
    from system.access.audit
    where service_name = 'databrickssql'
      and action_name = 'downloadQueryResult'
      and event_date >= '2025-08-01'
    group by all
),
rounds as (
    select * from {{ ref('hand_check_rounds') }}
)
select
    queries.queried_on,
    queries.executed_by,
    queries.queries,
    downloads.downloads,
    rounds.ceremony_round,
    rounds.hours
from queries
inner join downloads
    on downloads.downloaded_on = queries.queried_on
    and downloads.downloaded_by = queries.executed_by
left join rounds
    on rounds.downloaded_on = queries.queried_on
order by queries.queried_on
