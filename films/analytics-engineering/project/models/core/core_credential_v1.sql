-- Version 1, built from version 2 until its deprecation date: the logic lives once.
with

credentials as (

    select * from {{ ref('core_credential', v=2) }}

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
    status = 'revoked' as is_revoked
from credentials
