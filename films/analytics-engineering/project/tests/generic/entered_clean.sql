{#-
    A key typed at entry arrives as it will be compared: trimmed, in its one case, and, given a
    pattern, shaped like one (an email: '%_@_%._%'). Checked on the rows recorded since the source
    began checking it at entry (since, on the recorded_at column), so the build never fails on what
    was typed before: staging still cleans those, until the source corrects them.
    Fails with one row per value that arrived as typed.
-#}
{% test entered_clean(model, column_name, since, case='lower', pattern=none, recorded_at='_loaded_at') %}
    {{ config(meta={'dimension': 'validity'}) }}

select {{ column_name }} as value_as_entered
from {{ model }}
where {{ column_name }} is not null
  and cast({{ recorded_at }} as timestamp) >= cast('{{ since }}' as timestamp)
  and ({{ column_name }} <> trim({{ column_name }})
       or {{ column_name }} <> {{ 'upper' if case == 'upper' else 'lower' }}({{ column_name }})
       {%- if pattern %}
       or {{ column_name }} not like '{{ pattern }}'
       {%- endif %})

{% endtest %}
