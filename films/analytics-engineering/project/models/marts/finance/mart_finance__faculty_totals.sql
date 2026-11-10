{#-
    Databricks only, as the metric view it's made from (DEC-FIN-06): casual teaching cost by faculty,
    for the teaching periods Finance has reported (the seed reported_periods). The one table the
    university shares outside, with a group of universities, through OpenSharing (the share
    teaching_costs, examples/more-readers-than-people/). Never by unit: a unit with one tutor would
    give away that tutor's pay (Ingrid Holm, HR). The measure is asked for by name, so it's counted as
    it's defined, and nothing here repeats its rules. dbt builds it as the identity that runs dbt,
    which reads every faculty (macros/finance/faculty_row_filter.sql).
-#}
{{ config(enabled=target.type == 'databricks') }}

with

totals as (

    select
        faculty_name,
        teaching_period,
        measure(casual_teaching_cost) as casual_teaching_cost
    from {{ ref('casual_teaching_cost') }}
    group by faculty_name, teaching_period

),

reported as (

    select * from {{ ref('reported_periods') }}

)

-- only the periods Finance has reported: one still running, or with claims still to come, isn't shared
select
    totals.faculty_name,
    totals.teaching_period,
    cast(totals.casual_teaching_cost as decimal(14, 2)) as casual_teaching_cost
from totals
inner join reported on reported.teaching_period = totals.teaching_period
