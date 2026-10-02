-- Evidence: keys that are missing or blank, in the current version of each source table.
-- Run: dbt show --select profile_null_keys --profiles-dir .
select 'learning_platform.users' as source_table, 'student_id' as key_column,
    count(*) as current_rows,
    count(case when nullif(trim(student_id), '') is null then 1 end) as missing
from {{ source('learning_platform', 'users') }}
where _is_current = 'true'

union all

select 'learning_platform.users', 'email',
    count(*),
    count(case when nullif(trim(email), '') is null then 1 end)
from {{ source('learning_platform', 'users') }}
where _is_current = 'true'

union all

select 'short_courses.enrolments', 'customer_email',
    count(*),
    count(case when nullif(trim(customer_email), '') is null then 1 end)
from {{ source('short_courses', 'enrolments') }}
where _is_current = 'true'

union all

select 'student_system.learners', 'student_id',
    count(*),
    count(case when nullif(trim(student_id), '') is null then 1 end)
from {{ source('student_system', 'learners') }}
where _is_current = 'true'
