-- Warm: what each faculty has spent this year against its budget, which Rohan Desai, in Finance, and the
-- four faculties' managers check every morning. Databricks only (dbt-databricks); CI doesn't run it.
--
-- Until September 2026 every look read the finance system's ledger in place: slow, and a load on the
-- ledger while Finance worked in it. Yesterday's figures are fresh enough, so now it's a materialized
-- view, worked out each night at 02:00, Sydney time, and ready to read. It reads the ledger once a night,
-- in place, through Lakehouse Federation (the finance system's database as the foreign catalog
-- <finance catalog>), and keeps only the answer, one row per faculty: never a copy of the ledger. Over a
-- federated source it's worked out in full each night, not only what changed.
--
-- Jun Park's model, written and tested like any other in the project (spending_by_faculty.yml), and
-- reviewed and approved like any change to production. The schedule is in its own config: a Quartz cron,
-- seconds first, as Databricks reads it.

{{ config(
    materialized='materialized_view',
    schedule={'cron': '0 0 2 * * ?', 'time_zone_value': 'Australia/Sydney'}
) }}

with spent as (

    select
        cost_centres.faculty,
        sum(lines.amount) as spent
    from <finance catalog>.<ledger schema>.ledger_lines as lines
    inner join <finance catalog>.<ledger schema>.cost_centres as cost_centres
        on lines.cost_centre = cost_centres.cost_centre
    where lines.account_type = 'expense'
      and lines.posted_on >= date_trunc('year', current_date())
    group by cost_centres.faculty

),

budget as (

    select
        faculty,
        sum(amount) as budget
    from <finance catalog>.<ledger schema>.budgets
    where budget_year = year(current_date())
    group by faculty

)

select
    budget.faculty,
    coalesce(spent.spent, 0) as spent_this_year,
    budget.budget as budget_this_year,
    round(coalesce(spent.spent, 0) / nullif(budget.budget, 0), 3) as share_of_budget_spent
from budget
left join spent
    on budget.faculty = spent.faculty
