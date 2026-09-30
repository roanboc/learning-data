with

matched_keys as (

    select * from {{ ref('int_learner_keys_matched') }}

),

learner_keys as (

    select * from {{ ref('int_learner_keys') }}

),

keys_with_dates as (

    select
        matched_keys.learner_key,
        matched_keys.learner_bk,
        matched_keys.qualified_key,
        matched_keys.key_set,
        learner_keys.first_recorded_at
    from matched_keys
    inner join learner_keys on learner_keys.qualified_key = matched_keys.qualified_key

)

select
    learner_key,
    learner_bk,
    max(case when qualified_key = learner_bk then key_set end) as key_set,
    cast(count(*) as int) as keys_held,
    max(case when key_set = 'SIS' then 1 else 0 end) = 1 as has_student_id,
    min(first_recorded_at) as first_recorded_at
from keys_with_dates
group by learner_key, learner_bk
