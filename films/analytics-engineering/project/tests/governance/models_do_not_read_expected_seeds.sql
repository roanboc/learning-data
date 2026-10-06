{#-
    A model never reads an expected seed (seeds/expected/): those are the numbers tests reconcile
    against, and a model that reads them would grade its own homework.
    Fails with one row per model that refs one. It reads the project's graph, not the data.

    On dbt v2 this belongs in checks/ as a check, run before any model is built:

        select e.child_unique_id as unique_id
        from {{ info_schema('edges') }} as e
        join {{ info_schema('seeds') }} as s on s.unique_id = e.parent_unique_id
        join {{ info_schema('models') }} as m on m.unique_id = e.child_unique_id
        where list_contains(s.tags, 'expected')
-#}
{%- set expected = [] -%}
{%- for node in graph.nodes.values() if node.resource_type == 'seed' and 'expected' in node.tags -%}
    {%- do expected.append(node.unique_id) -%}
{%- endfor -%}
{%- set breaches = [] -%}
{%- for node in graph.nodes.values() if node.resource_type == 'model' -%}
    {%- for parent in node.depends_on.nodes if parent in expected -%}
        {%- do breaches.append((node.unique_id, parent)) -%}
    {%- endfor -%}
{%- endfor %}

{% if breaches -%}
{%- for model, seed in breaches %}
select '{{ model }}' as model, '{{ seed }}' as expected_seed
{%- if not loop.last %} union all{% endif %}
{%- endfor %}
{%- else -%}
select cast(null as string) as model, cast(null as string) as expected_seed
where 1 = 0
{%- endif %}
