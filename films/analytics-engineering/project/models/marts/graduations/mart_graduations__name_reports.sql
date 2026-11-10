-- Name reports (Report, fix, tell): every "This isn't my name" a graduate sends through the
-- portal, with who answers it, when it's due, and when it was answered and the graduate told.
-- The registrar's office, which owns names, promises an answer within two working days. That's a
-- rule about what people do, not about whether the data is right, so it's tracked here and
-- reviewed every week, never failed as a test (docs/conventions.md, Tests). Each morning a
-- Databricks SQL alert tells the office which reports are due (analyses/alerts/). Read together,
-- the reports also show where errors are born: record_made_by.

with

reports as (

    select * from {{ ref('stg_portal__name_confirmations') }}
    where is_current_version
        and answer = 'corrected'

),

-- When each graduate's record, and the name in it, was first made.
records as (

    select
        student_bk,
        min(record_created_on) as record_created_on
    from {{ ref('stg_student_system__graduations') }}
    group by student_bk

),

dated as (

    select
        reports.*,
        records.record_created_on,
        cast(reports.confirmed_at as date) as reported_on,
        -- The day of the week, 0 for a Monday to 6 for a Sunday, counted from Monday 3 January
        -- 2000, so it's the same on DuckDB and Databricks.
        {{ dbt.datediff("cast('2000-01-03' as date)", 'cast(reports.confirmed_at as date)', 'day') }} % 7 as weekday
    from reports
    left join records
        on reports.student_bk = records.student_bk

),

-- Two working days, Monday to Friday: a report made on a Thursday is due on the Monday.
due as (

    select
        *,
        cast({{ dbt.dateadd('day', 'case when weekday in (3, 4) then 4 when weekday = 5 then 3 else 2 end', 'reported_on') }} as date) as due_on
    from dated

)

select
    confirmation_bk as report_bk,
    student_bk,
    ceremony_id,
    name_as_printed as name_given,
    confirmed_at as reported_at,
    '{{ dbt.escape_single_quotes("Registrar's office") }}' as owner,
    due_on,
    answered_at,
    told_at,
    case when answered_at is not null then cast(answered_at as date) <= due_on end as answered_in_time,
    case
        when record_created_on < cast('2015-01-01' as date) then 'paper form'
        when record_created_on < cast('2019-01-01' as date) then 'old online form'
        else 'current online form'
    end as record_made_by
from due
