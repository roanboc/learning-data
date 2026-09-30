{#-
    Which learner each key belongs to. Each key takes its most trusted candidate, then one rule
    that builds on those matches: a short-course customer with a platform user's email. A learner
    no student ID identifies keeps the key of the first system that knew them.
-#}

with

learner_keys as (

    select * from {{ ref('int_learner_keys') }}

),

candidates as (

    select * from {{ ref('int_learner_key_candidates') }}

),

decisions as (

    select * from {{ ref('learner_identity_decisions') }}

),

-- each key's most trusted candidate
best_candidates as (

    select *
    from candidates
    qualify row_number() over (partition by qualified_key order by priority) = 1

),

-- an email names a platform user's learner only if all the accounts with it agree
platform_emails as (

    select
        learner_keys.email,
        min(best_candidates.learner_bk) as learner_bk
    from learner_keys
    inner join best_candidates on best_candidates.qualified_key = learner_keys.qualified_key
    where learner_keys.key_set = 'LMS'
      and learner_keys.email is not null
    group by learner_keys.email
    having count(distinct best_candidates.learner_bk) = 1

),

by_platform_email as (

    select
        learner_keys.qualified_key,
        platform_emails.learner_bk,
        5 as priority,
        'same email as one platform user' as match_rule
    from learner_keys
    inner join platform_emails on platform_emails.email = learner_keys.email
    where learner_keys.key_set = 'SC'

),

-- a decision that two keys are different people holds for this rule too
kept_apart as (

    select
        qualified_key,
        other_qualified_key as learner_bk
    from decisions
    where decision = 'different'

),

every_candidate as (

    select * from candidates
    union all
    select by_platform_email.*
    from by_platform_email
    left join kept_apart
        on kept_apart.qualified_key = by_platform_email.qualified_key
        and kept_apart.learner_bk = by_platform_email.learner_bk
    where kept_apart.qualified_key is null

),

best_matches as (

    select *
    from every_candidate
    qualify row_number() over (partition by qualified_key order by priority) = 1

),

-- with no student ID, a learner's key is the first one recorded; LMS sorts before SC on a tie
first_known_keys as (

    select
        best_matches.learner_bk as matched_bk,
        learner_keys.qualified_key as learner_bk
    from best_matches
    inner join learner_keys on learner_keys.qualified_key = best_matches.qualified_key
    where best_matches.learner_bk not like 'SIS|%'
    qualify row_number() over (
        partition by best_matches.learner_bk
        order by learner_keys.first_recorded_at, learner_keys.key_set, learner_keys.qualified_key
    ) = 1

),

matched as (

    select
        learner_keys.qualified_key,
        learner_keys.key_set,
        learner_keys.system_key,
        coalesce(first_known_keys.learner_bk, best_matches.learner_bk) as learner_bk,
        case
            when first_known_keys.learner_bk = learner_keys.qualified_key then 'own key'
            when first_known_keys.learner_bk <> best_matches.learner_bk then 'first key recorded'
            else best_matches.match_rule
        end as match_rule,
        decisions.decision_id,
        decisions.decided_by,
        decisions.decided_on
    from learner_keys
    inner join best_matches on best_matches.qualified_key = learner_keys.qualified_key
    left join first_known_keys on first_known_keys.matched_bk = best_matches.learner_bk
    left join decisions
        on decisions.qualified_key = learner_keys.qualified_key
        and decisions.other_qualified_key = best_matches.learner_bk
        and best_matches.match_rule = 'recorded decision'

)

select
    qualified_key,
    key_set,
    system_key,
    {{ hash_key(['learner_bk']) }} as learner_key,
    learner_bk,
    match_rule,
    decision_id,
    decided_by,
    decided_on
from matched
