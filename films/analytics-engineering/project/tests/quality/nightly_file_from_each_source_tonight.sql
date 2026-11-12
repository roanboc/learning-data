-- The second alarm, on each source's receipts: a nightly file has arrived tonight. The list's age is counted
-- from each source's newest record (dbt source freshness, on newest_record_at), and that check fails when the
-- records are old; it can't say why. This one can: no file since midnight means the source has gone silent,
-- as the student system did on the night of 17 June 2026. A file that came on time with nothing new in it, as
-- on 13 November 2025, passes here and fails there. It reads the sources, as the freshness check does, so it
-- runs before anything is built: first in the night's job, turned on with --vars '{at_the_update: true}', and
-- never in the build, since the sample files end on 4 November 2026. update_at sets the clock, to try it on
-- them (examples/a-late-file/). A source counts from its first file. Fails with each silent source, its last
-- file and the clock; it tells people, and stops nothing.

with

receipts as (

    select
        'student_system' as source_name,
        cast(received_at as timestamp) as received_at
    from {{ source('student_system', 'nightly_files') }}

    union all

    select
        'portal' as source_name,
        cast(received_at as timestamp) as received_at
    from {{ source('portal', 'nightly_files') }}

),

clock as (

    select
        {% if var('update_at', none) -%}
        cast('{{ var("update_at") }}' as timestamp)
        {%- else -%}
        cast({{ dbt.current_timestamp() }} as timestamp)
        {%- endif %} as update_at

),

last_files as (

    select
        receipts.source_name,
        max(receipts.received_at) as last_received_at
    from receipts
    cross join clock
    where receipts.received_at <= clock.update_at
    group by receipts.source_name

)

select
    last_files.source_name,
    last_files.last_received_at,
    clock.update_at
from last_files
cross join clock
where last_files.last_received_at < {{ dbt.date_trunc('day', 'clock.update_at') }}
