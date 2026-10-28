{#-
    More than zero. Fails with one row per value that's zero or less. With the test's where config,
    it checks only the rows a rule is about: a microcredential badge carries credit (DEC-LMS-03).
-#}
{% test positive(model, column_name) %}
    {{ config(meta={'dimension': 'validity'}) }}

select {{ column_name }}
from {{ model }}
where {{ column_name }} <= 0

{% endtest %}
