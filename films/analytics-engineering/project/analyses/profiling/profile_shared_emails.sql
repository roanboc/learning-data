-- Evidence: emails that belong to more than one key in the same system. Matching on one of these
-- would fan out: one short-course certificate, counted for two learners.
-- Run: dbt show --select profile_shared_emails --profiles-dir .
select
    'student_system' as system,
    lower(trim(email)) as email,
    count(distinct student_id) as keys_with_this_email
from {{ source('student_system', 'learners') }}
where _is_current = 'true'
group by lower(trim(email))
having count(distinct student_id) > 1

union all

select
    'learning_platform',
    lower(trim(email)),
    count(distinct user_id)
from {{ source('learning_platform', 'users') }}
where _is_current = 'true' and nullif(trim(email), '') is not null
group by lower(trim(email))
having count(distinct user_id) > 1
