with

credentials as (

    select * from {{ ref('core_credential', v=2) }}

),

key_sets as (

    select * from {{ ref('key_sets') }}

)

-- as it is now: core_credential, version 2, holds each credential's current status
select
    credentials.credential_key,
    credentials.learner_key,
    credentials.credential_kind,
    credentials.credential_name,
    key_sets.system_name as issued_by,
    credentials.issued_on,
    credentials.status,
    credentials.revoked_on,
    credentials.credit_points
from credentials
inner join key_sets on key_sets.key_set = credentials.key_set
