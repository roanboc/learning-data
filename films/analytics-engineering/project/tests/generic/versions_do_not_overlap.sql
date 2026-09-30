{#-
    A timeline, tested: for each key, every version ends after it starts, and ends no later
    than the next one starts. Only the last version may be open (valid_to null).
    Fails with one row per version that breaks the rule.
-#}
{% test versions_do_not_overlap(model, key_columns, valid_from='valid_from', valid_to='valid_to') %}

with

versions as (

    select
        {{ key_columns | join(', ') }},
        {{ valid_from }} as valid_from,
        {{ valid_to }} as valid_to,
        lead({{ valid_from }}) over (
            partition by {{ key_columns | join(', ') }}
            order by {{ valid_from }}
        ) as next_valid_from
    from {{ model }}

)

select *
from versions
where (valid_to is not null and valid_to <= valid_from)
   or (next_valid_from is not null and (valid_to is null or valid_to > next_valid_from))

{% endtest %}
