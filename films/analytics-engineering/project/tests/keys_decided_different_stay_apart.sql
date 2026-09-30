-- When a person decides two keys are different people, they never end up as one learner.
-- Fails with one row per decision that the matching broke.
{{ config(group='credential_model') }}

with

decisions as (

    select * from {{ ref('learner_identity_decisions') }}
    where same_as_or_not = 'different'

),

matched_keys as (

    select * from {{ ref('int_learner_keys_matched') }}

)

select
    decisions.decision_id,
    decisions.qualified_key,
    decisions.other_qualified_key,
    this_key.learner_bk
from decisions
inner join matched_keys as this_key on this_key.qualified_key = decisions.qualified_key
inner join matched_keys as other_key on other_key.qualified_key = decisions.other_qualified_key
where this_key.learner_key = other_key.learner_key
