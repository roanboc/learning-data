{#-
    Keys, the same in every model and on every engine.

    business_key('SIS', 'student_id')                  ->  'SIS|S-20417'
    business_key('SIS', ['student_id', 'award_code'])  ->  'SIS|S-20417|GCDA'
    hash_key(['learner_bk'])                            ->  sha-256 of 'SIS|S-20417', 64 hex characters
    hash_key(['learner_bk', 'award_bk'])                ->  the key of a relationship between two keys

    The rules are in docs/conventions.md, under "Keys and hashes". Staging writes each system
    key in one case (IDs and codes upper case, platform user IDs and emails lower case), so a
    readable key and its hash are one to one.

    What the Jinja below compiles to, on DuckDB (Databricks has sha2(..., 256) for sha256):

    business_key('SIS', 'student_id'):

        case when nullif(trim(cast(student_id as string)), '') is not null
            then 'SIS|' || trim(cast(student_id as string)) end

    hash_key(['learner_bk', 'award_bk']):

        sha256(
            case
                when nullif(upper(trim(cast(learner_bk as string))), '') is null
                 and nullif(upper(trim(cast(award_bk as string))), '') is null
                    then null
                else coalesce(nullif(upper(trim(cast(learner_bk as string))), ''), '<null>')
                    || '|'
                    || coalesce(nullif(upper(trim(cast(award_bk as string))), ''), '<null>')
            end
        )
-#}


{#- A readable key, qualified by its key set. Null when any part is missing or blank. -#}
{% macro business_key(key_set, columns) -%}
    {%- set columns = [columns] if columns is string else columns -%}
    {%- set parts = [] -%}
    {%- for column in columns -%}
        {%- do parts.append("trim(cast(" ~ column ~ " as string))") -%}
    {%- endfor -%}
    case when {% for part in parts %}nullif({{ part }}, '') is not null{% if not loop.last %} and {% endif %}{% endfor %}
        then '{{ key_set }}|' || {{ parts | join(" || '|' || ") }} end
{%- endmacro %}


{#- The hash of one or more parts. Each engine has its own sha-256 function; the result is the same. -#}
{% macro hash_key(columns) -%}
    {{ return(adapter.dispatch('hash_key', 'credentials')(columns)) }}
{%- endmacro %}

{% macro duckdb__hash_key(columns) -%}
    sha256({{ credentials.key_string(columns) }})
{%- endmacro %}

{% macro databricks__hash_key(columns) -%}
    sha2({{ credentials.key_string(columns) }}, 256)
{%- endmacro %}

{% macro default__hash_key(columns) -%}
    {{ exceptions.raise_compiler_error("hash_key has no implementation for " ~ target.type) }}
{%- endmacro %}


{#-
    The string that gets hashed. Each part is trimmed and upper-cased, so keys that differ only
    by case or spaces hash the same; a blank part counts as missing. A missing part becomes the
    sentinel '<null>', so ('a', null) and (null, 'a') differ; the sentinel is lower case, so no
    upper-cased part can equal it. Parts are joined with '|'. When every part is missing, the
    string is null, and so is the hash: no key, no hash.
-#}
{% macro key_string(columns) -%}
    {%- set parts = [] -%}
    {%- for column in columns -%}
        {%- do parts.append("nullif(upper(trim(cast(" ~ column ~ " as string))), '')") -%}
    {%- endfor -%}
    {%- if parts | length == 1 -%}
        {{ parts[0] }}
    {%- else -%}
        case when {% for part in parts %}{{ part }} is null{% if not loop.last %} and {% endif %}{% endfor %} then null
            else {% for part in parts %}coalesce({{ part }}, '<null>'){% if not loop.last %} || '|' || {% endif %}{% endfor %} end
    {%- endif -%}
{%- endmacro %}
