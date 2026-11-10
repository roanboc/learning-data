-- HR's send log: who was sent each newsletter, a row for each newsletter and each person on the
-- list the day it went. It only adds rows: each build adds the newsletters sent since the last one,
-- and never reads an old newsletter again, so a rebuild of the list doesn't touch it, and a row
-- deleted here stays deleted. It can't be built again from the start (full_refresh: false): HR's
-- records would bring back everyone the deletes removed (docs/databricks-governance.md, "Deleted
-- means deleted").

{{ config(materialized='incremental', unique_key=['newsletter', 'staff_id'], on_schema_change='fail', full_refresh=false) }}

with

newsletters as (

    select * from {{ ref('newsletters') }}
    where sent_on <= {{ as_is_date() }}
    {% if is_incremental() %}
        and newsletter not in (select newsletter from {{ this }})
    {% endif %}

),

contracts as (

    select * from {{ ref('stg_hr_system__contracts') }}
    where pay_type = 'CAS'

),

wishes as (

    select * from {{ ref('stg_hr_system__wishes') }}
    where purpose = 'News of tutoring work'

),

on_the_list as (

    select distinct
        newsletters.newsletter,
        contracts.staff_id,
        newsletters.sent_on
    from newsletters
    inner join contracts
        on {{ valid_at('cast(newsletters.sent_on as timestamp)', 'contracts.recorded_from', 'contracts.recorded_to') }}
        and contracts.starts_on <= newsletters.sent_on
        and contracts.ends_on >= {{ dbt.dateadd('year', -2, 'newsletters.sent_on') }}
    inner join wishes
        on contracts.staff_bk = wishes.staff_bk
        and {{ valid_at('cast(newsletters.sent_on as timestamp)', 'wishes.recorded_from', 'wishes.recorded_to') }}
    where wishes.answer = 'yes'

)

select newsletter, staff_id, sent_on
from on_the_list
