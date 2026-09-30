{#-
    Which keys are the same learner, by the identity rules for a learner in model/conceptual.yml.
    Each candidate match carries a priority: the most trusted wins, unless a person decided the
    two keys are different people.
-#}

with

learner_keys as (

    select * from {{ ref('int_learner_keys') }}

),

decisions as (

    select * from {{ ref('learner_identity_decisions') }}

),

kept_apart as (

    select
        qualified_key,
        other_qualified_key as learner_bk
    from decisions
    where same_as_or_not = 'different'

),

-- an email can match a learner only if it belongs to exactly one student
student_emails as (

    select
        email,
        min(qualified_key) as learner_bk
    from learner_keys
    where key_set = 'SIS'
      and email is not null
    group by email
    having count(*) = 1

),

-- every match each key could make, from the student ID outwards
candidates as (

    select qualified_key, other_qualified_key as learner_bk, 1 as priority, 'recorded decision' as match_rule
    from decisions
    where same_as_or_not = 'same'

    union all

    select qualified_key, qualified_key as learner_bk, 2 as priority, 'student ID' as match_rule
    from learner_keys
    where key_set = 'SIS'

    union all

    select qualified_key, student_bk_held as learner_bk, 3 as priority, 'student ID held by the learning platform' as match_rule
    from learner_keys
    where key_set = 'LMS'
      and student_bk_held is not null

    union all

    select learner_keys.qualified_key, student_emails.learner_bk, 4 as priority, 'same email as one student' as match_rule
    from learner_keys
    inner join student_emails on student_emails.email = learner_keys.email
    where learner_keys.key_set in ('LMS', 'SC')

    union all

    select qualified_key, qualified_key as learner_bk, 9 as priority, 'own key' as match_rule
    from learner_keys
    where key_set in ('LMS', 'SC')

),

allowed as (

    select candidates.*
    from candidates
    left join kept_apart
        on kept_apart.qualified_key = candidates.qualified_key
        and kept_apart.learner_bk = candidates.learner_bk
    where kept_apart.qualified_key is null

),

-- first pass: the best match for each key
first_pass as (

    select
        *,
        row_number() over (partition by qualified_key order by priority) as preference
    from allowed

),

-- an email can also match a platform user's learner, if it belongs to exactly one
platform_emails as (

    select
        learner_keys.email,
        min(first_pass.learner_bk) as learner_bk
    from learner_keys
    inner join first_pass on first_pass.qualified_key = learner_keys.qualified_key
    where learner_keys.key_set = 'LMS'
      and learner_keys.email is not null
      and first_pass.preference = 1
    group by learner_keys.email
    having count(distinct first_pass.learner_bk) = 1

),

course_candidates as (

    select learner_keys.qualified_key, platform_emails.learner_bk, 5 as priority, 'same email as one platform user' as match_rule
    from learner_keys
    inner join platform_emails on platform_emails.email = learner_keys.email
    where learner_keys.key_set = 'SC'

),

course_allowed as (

    select course_candidates.*
    from course_candidates
    left join kept_apart
        on kept_apart.qualified_key = course_candidates.qualified_key
        and kept_apart.learner_bk = course_candidates.learner_bk
    where kept_apart.qualified_key is null

),

every_match as (

    select qualified_key, learner_bk, priority, match_rule from allowed
    union all
    select qualified_key, learner_bk, priority, match_rule from course_allowed

),

-- second pass: with the platform users' matches added, each key takes its best
second_pass as (

    select
        *,
        row_number() over (partition by qualified_key order by priority) as preference
    from every_match

),

matched as (

    select
        learner_keys.qualified_key,
        learner_keys.key_set,
        learner_keys.system_key,
        second_pass.learner_bk,
        second_pass.match_rule,
        decisions.decision_id,
        decisions.decided_by,
        decisions.decided_on
    from learner_keys
    inner join second_pass
        on second_pass.qualified_key = learner_keys.qualified_key
        and second_pass.preference = 1
    left join decisions
        on decisions.qualified_key = learner_keys.qualified_key
        and decisions.other_qualified_key = second_pass.learner_bk
        and second_pass.match_rule = 'recorded decision'

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
