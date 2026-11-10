{#-
    The rules for credit towards an award, as the student domain's conceptual model states them
    (models/core/student/_student__conceptual.yml). Each CTE below says which rule it applies; the numbers come from vars in dbt_project.yml.
-#}

{%- set passing_grades = var('passing_grades') -%}
{%- set microcredentials_per_award = var('microcredentials_per_award') -%}

with

items as (

    select * from {{ ref('int_credit_items') }}

),

-- a unit counts only with a passing grade
counting_items as (

    select * from items
    where item_kind = 'microcredential'
       or grade in ('{{ passing_grades | join("', '") }}')

),

-- every date on which credit towards an award can change
change_dates as (

    select learner_key, learner_bk, award_key, award_bk, counts_from as valid_from from counting_items
    union
    select learner_key, learner_bk, award_key, award_bk, counts_to from counting_items where counts_to is not null

),

-- on each of those dates, the items that counted: issued or released, not yet amended or revoked
held as (

    select
        change_dates.*,
        counting_items.item_kind,
        counting_items.item_bk,
        counting_items.credit_points,
        counting_items.issued_on
    from change_dates
    left join counting_items
        on counting_items.learner_key = change_dates.learner_key
        and counting_items.award_key = change_dates.award_key
        and {{ valid_at('change_dates.valid_from', 'counting_items.counts_from', 'counting_items.counts_to') }}

),

-- an award accepts a limited number of microcredentials: the first ones issued, on that date
ranked as (

    select
        *,
        case when item_kind = 'microcredential' then
            row_number() over (
                partition by learner_key, award_key, valid_from, item_kind
                order by issued_on, item_bk
            )
        end as microcredential_rank
    from held

),

totals as (

    select
        learner_key,
        learner_bk,
        award_key,
        award_bk,
        valid_from,
        cast(coalesce(sum(case when item_kind = 'unit' then credit_points end), 0) as int)
            as credit_points_from_units,
        cast(coalesce(sum(case when microcredential_rank <= {{ microcredentials_per_award }} then credit_points end), 0) as int)
            as credit_points_from_microcredentials,
        cast(count(case when microcredential_rank <= {{ microcredentials_per_award }} then 1 end) as int)
            as microcredentials_counted
    from ranked
    group by learner_key, learner_bk, award_key, award_bk, valid_from

),

compared as (

    select
        *,
        lag(credit_points_from_units) over (partition by learner_key, award_key order by valid_from) as previous_units,
        lag(credit_points_from_microcredentials) over (partition by learner_key, award_key order by valid_from) as previous_microcredentials
    from totals

),

-- a new version only when the credit changed
changed as (

    select * from compared
    where previous_units is null
       or credit_points_from_units <> previous_units
       or credit_points_from_microcredentials <> previous_microcredentials

)

select
    learner_key,
    learner_bk,
    award_key,
    award_bk,
    valid_from,
    lead(valid_from) over (partition by learner_key, award_key order by valid_from) as valid_to,
    credit_points_from_units,
    credit_points_from_microcredentials,
    credit_points_from_units + credit_points_from_microcredentials as credit_points_earned,
    microcredentials_counted
from changed
