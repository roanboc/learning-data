-- The graduations office's follow-up: each graduate of a round whose names haven't gone to the
-- printer yet, who hasn't confirmed their name for that ceremony in the portal or on the paper
-- form. Malia Fonoti follows the count each week, and the graduations team's agent answers from
-- it. "Every graduate has confirmed" would fail most nights, and that's about what people do, not
-- whether the data is right: so it's tracked here, not failed as a check (docs/conventions.md, Tests).

with

graduation_list as (

    select * from {{ ref('mart_graduations__graduation_list') }}

),

ceremonies as (

    select * from {{ ref('ceremonies') }}

),

not_confirmed as (

    select distinct
        graduation_list.student_bk,
        graduation_list.ceremony_id,
        graduation_list.ceremony_on,
        cast(ceremonies.list_due_at as date) as names_due_on
    from graduation_list
    inner join ceremonies
        on graduation_list.ceremony_id = ceremonies.ceremony_id
    where graduation_list.name_confirmed_how is null
        and cast(ceremonies.list_due_at as date) >= {{ as_is_date() }}

)

select
    student_bk,
    ceremony_id,
    ceremony_on,
    names_due_on,
    cast({{ dbt.datediff(as_is_date(), 'names_due_on', 'day') }} as int) as days_left
from not_confirmed
