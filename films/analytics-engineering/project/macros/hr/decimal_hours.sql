{#-
    The hours a claim gives, read as decimal hours: 1.50 for an hour and a half, as the claims
    app's contract with the platform says (the doc block claim_hours). The app keeps them as text.
    Since its new version went live at 15:02 on Monday 2 November 2026, it also sends hours and
    minutes, as tutors say them: 1:30 for an hour and a half. Both forms are read here, and only
    here (DEC-CLM-02):

        1.50  ->  1.50        1:30  ->  1.50        0:45  ->  0.75        1:20  ->  1.33

    Minutes are two digits, 00 to 59, and are rounded to the hundredth of an hour, as the
    contract's two decimals allow. Anything else still fails the cast, as it did at 22:03 that
    night: a form nobody agreed is news, not a number to guess, so the build stops before payroll
    reads it (examples/the-night-the-claims-job-failed/).

    The same SQL on DuckDB and Databricks: split_part, try_cast and length are in both.
-#}
{% macro decimal_hours(column) -%}
    {%- set value = 'trim(' ~ column ~ ')' -%}
    case
        when {{ value }} like '%:__'
            and length(split_part({{ value }}, ':', 2)) = 2
            and try_cast(split_part({{ value }}, ':', 2) as int) between 0 and 59
            then cast(
                cast(split_part({{ value }}, ':', 1) as int)
                + cast(split_part({{ value }}, ':', 2) as int) / 60.0
                as decimal(5, 2))
        else cast({{ value }} as decimal(5, 2))
    end
{%- endmacro %}
