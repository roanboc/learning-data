-- Validation: the same question as at census (as it was) and now (as it is), by faculty.
-- Both are right; they answer different questions. Planning asked for the first.
-- Run: dbt show --select diff_as_was_as_is --profiles-dir .
with

as_was as (

    {{ learners_near_graduate_certificate('faculty_name') }}

),

learners_now as (

    select * from {{ ref('core_learner') }}
    where {{ valid_at(as_is_date()) }}

),

awards_now as (

    select * from {{ ref('core_award') }}
    where {{ valid_at(as_is_date()) }}

),

credit_now as (

    select * from {{ ref('core_credit_towards_award') }}
    where {{ valid_at(as_is_date()) }}

),

as_is as (

    select awards_now.faculty_name, count(distinct learners_now.learner_key) as learners
    from learners_now
    inner join awards_now on awards_now.award_key = learners_now.enrolled_award_key
    left join credit_now
        on credit_now.learner_key = learners_now.learner_key
        and credit_now.award_key = learners_now.enrolled_award_key
    where learners_now.status = 'studying'
      and awards_now.award_type = 'graduate certificate'
      and {{ is_near_award('awards_now.credit_points_required - coalesce(credit_now.credit_points_earned, 0)') }}
    group by awards_now.faculty_name

)

select
    coalesce(as_was.faculty_name, as_is.faculty_name) as faculty_name,
    coalesce(as_was.learners_near_graduate_certificate, 0) as as_at_census,
    coalesce(as_is.learners, 0) as now
from as_was
full outer join as_is on as_is.faculty_name = as_was.faculty_name
order by 1
