-- The send's check, on the list itself: each source's newest record at most 24 hours old when the list goes
-- to the printer, the level on its two as-of columns (_graduations__models.yml). The night's check reads the
-- sources (dbt source freshness); this one reads the list, so a list built before a late file landed still
-- waits. It runs only in the send's job, which turns it on with --vars '{at_the_send: true}': the night's
-- build never runs it, since the night builds the list whatever its age. send_at sets the clock, to try it
-- on the sample files (examples/a-late-file/). Fails with the list's ages and the clock; it stops the send.

with

ages as (

    select distinct
        student_system_as_of,
        portal_as_of
    from {{ ref('mart_graduations__graduation_list') }}

),

clock as (

    select
        {% if var('send_at', none) -%}
        cast('{{ var("send_at") }}' as timestamp)
        {%- else -%}
        cast({{ dbt.current_timestamp() }} as timestamp)
        {%- endif %} as send_at

)

select
    ages.student_system_as_of,
    ages.portal_as_of,
    clock.send_at
from ages
cross join clock
where ages.student_system_as_of < {{ dbt.dateadd('hour', -24, 'clock.send_at') }}
    or ages.portal_as_of < {{ dbt.dateadd('hour', -24, 'clock.send_at') }}
