with

timeline as (

    select * from {{ ref('int_learner_timeline') }}

),

learners as (

    select * from {{ ref('int_learners') }}

)

select
    timeline.learner_key,
    learners.learner_bk,
    timeline.valid_from,
    timeline.valid_to,
    timeline.valid_to is null as is_current,
    timeline.recorded_at,
    timeline.full_name,
    timeline.email,
    timeline.status,
    {{ hash_key(['timeline.enrolled_award_bk']) }} as enrolled_award_key,
    timeline.enrolled_award_bk,
    learners.key_set,
    learners.keys_held,
    learners.has_student_id
from timeline
inner join learners on learners.learner_key = timeline.learner_key
