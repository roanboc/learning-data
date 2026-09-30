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

    {% if is_incremental() %}
    -- only credentials whose source rows were written since the last run
    where loaded_at > (select max(loaded_at) from {{ this }})
    {% endif %}

)

select
    credential_key,
    credential_bk,
    learner_key,
    key_set,
    credential_kind,
    credential_code,
    credential_name,
    credit_points,
    issued_on,
    status,
    revoked_on,
    loaded_at
from credentials
