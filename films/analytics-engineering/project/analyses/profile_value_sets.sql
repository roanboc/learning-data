-- Evidence: the status codes each system uses, with how many current rows carry each.
-- Run: dbt show --select profile_value_sets --profiles-dir .
select 'student_system' as system, status_code as code, count(*) as current_rows
from {{ source('student_system', 'learners') }}
where _is_current = 'true'
group by status_code

union all

select 'learning_platform', account_status, count(*)
from {{ source('learning_platform', 'users') }}
where _is_current = 'true'
group by account_status

union all

select 'short_courses', cast(status as string), count(*)
from {{ source('short_courses', 'learners') }}
where _is_current = 'true'
group by status

order by 1, 2
