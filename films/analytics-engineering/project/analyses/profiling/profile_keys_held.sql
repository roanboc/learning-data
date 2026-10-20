-- Evidence: each system's records of people, and how many hold another system's number. Platform
-- accounts and alumni records hold a student ID, and research records a staff ID. Nothing holds a
-- number that joins a student to a staff member, or one student ID to another.
-- Run: dbt show --select profile_keys_held --profiles-dir .
select
    'student_system.learners' as records_in,
    count(distinct upper(trim(student_id))) as records,
    0 as holding_a_student_id,
    0 as holding_a_staff_id
from {{ source('student_system', 'learners') }}
where _is_current = 'true'

union all

select
    'student_system.past_learners',
    count(distinct upper(trim(student_id))),
    0,
    0
from {{ source('student_system', 'past_learners') }}
where _is_current = 'true'

union all

select
    'learning_platform.users',
    count(distinct lower(trim(user_id))),
    count(distinct case when nullif(trim(student_id), '') is not null then lower(trim(user_id)) end),
    0
from {{ source('learning_platform', 'users') }}
where _is_current = 'true'

union all

select
    'hr_system.staff',
    count(distinct upper(trim(staff_id))),
    0,
    0
from {{ source('hr_system', 'staff') }}
where _is_current = 'true'

union all

select
    'research_system.researchers',
    count(distinct upper(trim(member_id))),
    0,
    count(distinct case when nullif(trim(staff_id), '') is not null then upper(trim(member_id)) end)
from {{ source('research_system', 'researchers') }}
where _is_current = 'true'

union all

select
    'alumni_system.alumni',
    count(distinct upper(trim(alumni_id))),
    count(distinct case when nullif(trim(student_id), '') is not null then upper(trim(alumni_id)) end),
    0
from {{ source('alumni_system', 'alumni') }}
where _is_current = 'true'
