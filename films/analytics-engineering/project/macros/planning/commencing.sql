{#-
    A commencing student, written once: the business glossary's term, Commencing student, which
    Planning's conceptual model copies with where it came from (DEC-PRJ-11).

    True when the learner was commencing in the award on the census date: the first version in
    which they were studying it took effect in the census date's year, on or before the census
    date. A learner coming back to the award after leave or a break has an earlier version, so
    isn't commencing; one who starts a new award is, in that award.
-#}
{% macro is_commencing(learner_key, award_key) -%}
    coalesce((
        select year(min(versions.valid_from)) = year({{ census_date() }})
        from {{ ref('core_learner') }} as versions
        where versions.learner_key = {{ learner_key }}
            and versions.enrolled_award_key = {{ award_key }}
            and versions.status = 'studying'
            and versions.valid_from <= {{ census_date() }}
    ), false)
{%- endmacro %}
