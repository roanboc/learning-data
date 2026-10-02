{#-
    The grain, tested as a key: no two rows share the same values in these columns.
    Fails with one row per combination that appears more than once.
-#}
{% test unique_combination(model, columns) %}

select
    {{ columns | join(', ') }},
    count(*) as rows_with_this_combination
from {{ model }}
group by {{ columns | join(', ') }}
having count(*) > 1

{% endtest %}
