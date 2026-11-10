{#-
    A name allowed by the graduation list's rule: nothing but letters, in any alphabet and with any
    accent, spaces, hyphens and apostrophes. It says a name is allowed, never that it's right: a
    name without its accents, cut short, or with its given and family names swapped is allowed too.

    allowed_name('family_name')  ->  on DuckDB: regexp_matches(family_name, '^[\p{L} \x27-]+$')

    \p{L} is any letter; \x27 is the apostrophe, so the pattern needs no quote of its own.
-#}
{% macro allowed_name(column) -%}
    {{ return(adapter.dispatch('allowed_name', 'credentials')(column)) }}
{%- endmacro %}

{% macro duckdb__allowed_name(column) -%}
    regexp_matches({{ column }}, '^[\p{L} \x27-]+$')
{%- endmacro %}

{#- The same pattern; a raw string keeps its backslashes as written. -#}
{% macro databricks__allowed_name(column) -%}
    {{ column }} rlike r'^[\p{L} \x27-]+$'
{%- endmacro %}

{% macro default__allowed_name(column) -%}
    {{ exceptions.raise_compiler_error("allowed_name has no implementation for " ~ target.type) }}
{%- endmacro %}
