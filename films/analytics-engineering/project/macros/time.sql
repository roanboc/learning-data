{#- Planning's census date, from the census_date var. -#}
{% macro census_date() -%}
    cast('{{ var("census_date") }}' as date)
{%- endmacro %}


{#-
    True for the version that was valid on a date: valid_from is inclusive, valid_to exclusive,
    and a null valid_to means the version is still current. Used for every point-in-time join.
-#}
{% macro valid_at(as_at, valid_from='valid_from', valid_to='valid_to') -%}
    ({{ valid_from }} <= {{ as_at }} and ({{ valid_to }} is null or {{ valid_to }} > {{ as_at }}))
{%- endmacro %}
