{#-
    Payroll's rule for when a claim is paid, written once: a claim approved by noon on the Monday
    before a pay day is paid that Thursday, and one approved later waits for the next pay day,
    two weeks on. For years it lived only in a script on one person's laptop; now it's here, with
    its tests (models/marts/finance/_finance__models.yml, the unit test on payroll's export).

    The pay days and their closing times are payroll's calendar, the seed pay_days, which HR
    owns: a holiday that moves a close moves it there, never here.

    The pay day for an approval time: the first pay day whose claims close at or after it. Null
    for a claim that isn't approved, or approved after the last pay day in the calendar.
-#}
{% macro pay_day_for(approved_at) -%}
    (
        select min(pay_days.pay_day)
        from {{ ref('pay_days') }} as pay_days
        where pay_days.claims_close_at >= {{ approved_at }}
    )
{%- endmacro %}
