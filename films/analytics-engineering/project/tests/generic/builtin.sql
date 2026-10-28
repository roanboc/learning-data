{#-
    dbt's four built-in tests, each with the quality dimension it checks, written once. They run
    dbt's own SQL, unchanged: only the dimension is added, in meta.dimension, so the scorecard and
    the governance check can read it. A test that checks a different dimension says so in its own
    meta, which wins.

    The dimensions are DAMA's: completeness, uniqueness, validity, consistency, accuracy and
    timeliness. Each test's owner is set by folder, in dbt_project.yml.
-#}
{% test not_null(model, column_name) %}
    {{ config(meta={'dimension': 'completeness'}) }}
    {{ adapter.dispatch('test_not_null', 'dbt')(model, column_name) }}
{% endtest %}


{% test unique(model, column_name) %}
    {{ config(meta={'dimension': 'uniqueness'}) }}
    {{ adapter.dispatch('test_unique', 'dbt')(model, column_name) }}
{% endtest %}


{% test accepted_values(model, column_name, values, quote=True) %}
    {{ config(meta={'dimension': 'validity'}) }}
    {{ adapter.dispatch('test_accepted_values', 'dbt')(model, column_name, values, quote) }}
{% endtest %}


{% test relationships(model, column_name, to, field) %}
    {{ config(meta={'dimension': 'consistency'}) }}
    {{ adapter.dispatch('test_relationships', 'dbt')(model, column_name, to, field) }}
{% endtest %}
