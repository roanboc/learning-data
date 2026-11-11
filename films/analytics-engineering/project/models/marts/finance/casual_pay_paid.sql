{#-
    Databricks only: casual pay paid, defined once, as a Unity Catalog metric view (dbt-databricks).
    HR's measure, owned by Ingrid Holm: what casual staff are paid on each pay day, from the claims
    approved for it, before tax and on-costs. One of the three measures that once shared the name
    casual teaching cost (DEC-FIN-05): casual hours contracted is Planning's, casual teaching cost
    Finance's. Read with MEASURE(casual_pay_paid), grouped by faculty, unit or pay day. Totals only:
    the fact under it has no names or IDs. DuckDB has no metric views, so there it's turned off.
-#}
{{ config(materialized='metric_view', enabled=target.type == 'databricks', contract={'enforced': false}) }}

version: 1.1
source: "{{ ref('mart_finance__casual_pay_paid') }}"
fields:
  - name: faculty_name
    expr: faculty_name
  - name: unit_code
    expr: unit_code
  - name: pay_day
    expr: pay_day
measures:
  - name: casual_pay_paid
    expr: SUM(casual_pay_paid)
    display_name: Casual pay paid
    comment: What casual staff are paid on each pay day, from the claims approved for it, before tax and on-costs, by the pay day that paid it. Owned by Ingrid Holm, HR.
    synonyms: [casual pay, sessional pay paid]
    format: {type: currency, currency_code: AUD}
