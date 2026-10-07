-- Version 1 came first. Version 2 now holds the logic, and version 1 is built from it,
-- until its deprecation date: the logic lives once, and removing it touches nothing else.
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
