{#-
    A reconciliation, row by row: the model against another record of the same things, by their
    keys. Fails with one row per key the model has and the record hasn't, per key the record has
    and the model hasn't, and per key whose compared columns differ.

    What it measures depends on the record, so each use names it in its own meta: accuracy, against
    a reference kept apart from the data's source (meta.reference names it); consistency, against
    a copy of the same source, which would share the source's gaps and agree with them.

        - reconciles_with:
            arguments: {to: ref('stg_exam_boards__approved_awards'), keys: [student_bk, award_code],
                        compare: [conferred_on], to_where: is_current_version}
-#}
{% test reconciles_with(model, to, keys, compare=[], to_where=none) %}
    {{ config(meta={'method': 'reconciliation'}) }}

with

in_the_model as (

    select {{ (keys + compare) | join(', ') }}
    from {{ model }}

),

in_the_record as (

    select {{ (keys + compare) | join(', ') }}
    from {{ to }}
    {%- if to_where %}
    where {{ to_where }}
    {%- endif %}

),

compared as (

    select
        {%- for key in keys %}
        coalesce(in_the_model.{{ key }}, in_the_record.{{ key }}) as {{ key }},
        {%- endfor %}
        in_the_model.{{ keys[0] }} is not null as is_in_the_model,
        in_the_record.{{ keys[0] }} is not null as is_in_the_record
        {%- for column in compare %},
        in_the_model.{{ column }} as {{ column }}_in_the_model,
        in_the_record.{{ column }} as {{ column }}_in_the_record
        {%- endfor %}
    from in_the_model
    full outer join in_the_record
        on {% for key in keys %}in_the_record.{{ key }} = in_the_model.{{ key }}{% if not loop.last %}
        and {% endif %}{% endfor %}

)

select *
from compared
where not is_in_the_model
   or not is_in_the_record
   {%- for column in compare %}
   or {{ column }}_in_the_model is distinct from {{ column }}_in_the_record
   {%- endfor %}

{% endtest %}
