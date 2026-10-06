{#-
    Planning's question, written once: the rule, and the count by faculty.
-#}


{#- Near an award: more than none left, and no more than the near_award_credit_points var. -#}
{% macro is_near_award(credit_points_remaining) -%}
    ({{ credit_points_remaining }} > 0 and {{ credit_points_remaining }} <= {{ var('near_award_credit_points') }})
{%- endmacro %}


{#-
    Learners near a graduate certificate, as at census date, one row per value of group_by.
    The reconciliation test and the analyses count with this; the semantic layer's metric
    learners_near_graduate_certificate is the same count for BI.
-#}
{% macro learners_near_graduate_certificate(group_by='faculty_code') -%}
    select
        {{ group_by }},
        count(distinct learner_key) as learners_near_graduate_certificate
    from {{ ref('mart_planning__near_award') }}
    where is_near_award
      and award_type = 'graduate certificate'
    group by {{ group_by }}
{%- endmacro %}
