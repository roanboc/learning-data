-- Every graduate the alumni office knows graduated under a student ID the student system issued:
-- in its current table, or in its archive. Fails with one row per alumni record that didn't.
{{ config(group='credential_model') }}

with

alumni as (

    select * from {{ ref('stg_alumni_system__alumni') }}

),

learners as (

    select * from {{ ref('stg_student_system__learners') }}

),

past_learners as (

    select * from {{ ref('stg_student_system__past_learners') }}

),

student_ids as (

    select student_bk from learners
    union all
    select student_bk from past_learners

)

select
    alumni.alumni_bk,
    alumni.student_bk
from alumni
left join student_ids on student_ids.student_bk = alumni.student_bk
where student_ids.student_bk is null
