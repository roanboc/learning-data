-- One row per day, for the semantic layer's time calculations.
with

days as (

    {{ dbt.date_spine('day', "cast('2025-01-01' as date)", "cast('2028-01-01' as date)") }}

)

select cast(date_day as date) as date_day
from days
