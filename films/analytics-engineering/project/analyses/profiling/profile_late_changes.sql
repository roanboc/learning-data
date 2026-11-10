-- Evidence: changes the student system recorded more than a day after they took effect.
-- When it was true and when it was recorded differ; the model dates versions by the first.
-- Run: dbt show --select profile_late_changes --profiles-dir .
with

versions as (

    select
        student_id,
        status_code,
        cast(effective_date as date) as took_effect,
        cast(cast(_valid_from as timestamp) as date) as recorded_on
    from {{ source('student_system', 'learners') }}

)

select
    *,
    {{ dbt.datediff('took_effect', 'recorded_on', 'day') }} as days_late
from versions
where {{ dbt.datediff('took_effect', 'recorded_on', 'day') }} > 1
order by days_late desc
