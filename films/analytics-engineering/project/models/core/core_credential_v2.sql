{{
    config(
        materialized='incremental',
        unique_key='credential_key',
        incremental_strategy='merge',
        on_schema_change='append_new_columns',
        liquid_clustered_by=(['learner_key'] if target.type == 'databricks' else none)
    )
}}

with

credentials as (

    select * from {{ ref('int_credentials_unioned') }}

),

-- on an incremental run: credentials whose source rows were written since the last run, and
-- credentials whose holder was matched to another learner since (a new key, a new decision)
to_merge as (

    select * from credentials
    {% if is_incremental() %}
    where credentials.loaded_at > (select max(loaded_at) from {{ this }})
       or not exists (
            select 1
            from {{ this }} as built
            where built.credential_key = credentials.credential_key
              and built.learner_key = credentials.learner_key
       )
    {% endif %}

)

select
    credential_key,
    credential_bk,
    learner_key,
    learner_bk,
    key_set,
    credential_kind,
    credential_code,
    credential_name,
    credit_points,
    issued_on,
    status,
    revoked_on,
    loaded_at
from to_merge
