with

credentials as (

    select * from {{ ref('core_credential') }}

),

key_sets as (

    select * from {{ ref('key_sets') }}

)

-- as it is now: the latest version of the credential model holds each credential's current state
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
