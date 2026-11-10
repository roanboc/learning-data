-- Quality: the share of a day's badges that carry no credit, from the badges' data profile, for the
-- alert Badges with no credit (both set up by scripts/setup/monitoring.py). Usually it's about 1 in
-- 12, the welcome badges; above 20 in 100, the alert tells the learning team, the badges' owner
-- (DEC-LMS-03). The profile counts each column's values and zeros for each day; this divides them,
-- so the share doesn't depend on how the profile writes its percentages. Databricks only. The
-- set-up compiles it into the alert's query:
--
--     dbt compile --target databricks --select badges_with_no_credit --profiles-dir .
{%- set badges = source('learning_platform', 'badges') %}
select window.start as issued_on, num_zeros as badges_with_no_credit, count as badges,
       round(100 * num_zeros / count, 1) as percent_zeros
from {{ badges.database }}.quality_monitoring.{{ badges.identifier }}_profile_metrics
where column_name = 'credit_points'
  and slice_key is null
order by window.start desc
limit 1
