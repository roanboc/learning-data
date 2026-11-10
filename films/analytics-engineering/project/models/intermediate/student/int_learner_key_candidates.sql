{#-
    Every learner a key could belong to: one CTE per identity rule in the student domain's
    conceptual model (models/core/student/_student__conceptual.yml).
    The lower the priority, the more trusted the rule. A decision that two keys are different
    people removes a match, whatever rule made it.
-#}

with

learner_keys as (

    select * from {{ ref('int_learner_keys') }}

),

decisions as (

    select * from {{ ref('learner_identity_decisions') }}

),

-- a person decided: this key is that learner
by_decision as (

    select
        qualified_key,
        other_qualified_key as learner_bk,
        1 as priority,
        'recorded decision' as match_rule
    from decisions
    where decision = 'same'

),

-- a student ID is a learner
by_student_id as (

    select
        qualified_key,
        qualified_key as learner_bk,
        2 as priority,
        'student ID' as match_rule
    from learner_keys
    where key_set = 'SIS'

),

-- a platform account is the student whose ID it holds
by_student_id_held as (

    select
        qualified_key,
        student_bk_held as learner_bk,
        3 as priority,
        'student ID held by the learning platform' as match_rule
    from learner_keys
    where key_set = 'LMS'
      and student_bk_held is not null

),

-- an email identifies a student only if exactly one student has it
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

by_student_email as (

    select
        learner_keys.qualified_key,
        student_emails.learner_bk,
        4 as priority,
        'same email as one student' as match_rule
    from learner_keys
    inner join student_emails on student_emails.email = learner_keys.email
    where learner_keys.key_set in ('LMS', 'SC')

),

-- anything else is a learner of its own
by_own_key as (

    select
        qualified_key,
        qualified_key as learner_bk,
        9 as priority,
        'own key' as match_rule
    from learner_keys
    where key_set in ('LMS', 'SC')

),

candidates as (

    select * from by_decision
    union all
    select * from by_student_id
    union all
    select * from by_student_id_held
    union all
    select * from by_student_email
    union all
    select * from by_own_key

),

kept_apart as (

    select
        qualified_key,
        other_qualified_key as learner_bk
    from decisions
    where decision = 'different'

)

select
    candidates.qualified_key,
    candidates.learner_bk,
    candidates.priority,
    candidates.match_rule
from candidates
left join kept_apart
    on kept_apart.qualified_key = candidates.qualified_key
    and kept_apart.learner_bk = candidates.learner_bk
where kept_apart.qualified_key is null
