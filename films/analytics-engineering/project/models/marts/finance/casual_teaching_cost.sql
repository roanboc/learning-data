{#-
    Databricks only: casual teaching cost, defined once, as a Unity Catalog metric view (dbt-databricks,
    DEC-FIN-05). The body is the metric view's YAML, not SQL. Genie, dashboards, alerts and the SQL
    editor read it with MEASURE(casual_teaching_cost), grouped by faculty, unit or teaching period.
    Its rules are inside the measure, not in a filter on the view, so they go with it to any tool
    that reads it. DuckDB has no metric views, so there the model is turned off.
-#}
{{ config(materialized='metric_view', enabled=target.type == 'databricks', contract={'enforced': false}) }}

version: 1.1
source: "{{ ref('mart_finance__casual_claims') }}"
fields:
  - name: faculty_name
    expr: faculty_name
  - name: unit_code
    expr: unit_code
  - name: teaching_period
    expr: teaching_period
measures:
  - name: casual_teaching_cost
    expr: SUM(amount * (1 + on_cost_rate))
      FILTER (WHERE is_teaching_duty)
    display_name: Casual teaching cost
    comment: What the casual teaching in a teaching period costs, from the claims approved for casual staff for tutorials, marking and consultation, plus on-costs, by the teaching period it was done in, not the day it was paid. Owned by Rohan Desai, Finance.
    synonyms: [sessional teaching cost, casual teaching spend]
    format: {type: currency, currency_code: AUD}
