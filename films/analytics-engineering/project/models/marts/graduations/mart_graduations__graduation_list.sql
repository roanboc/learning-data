-- The graduation list: who graduates, at which ceremony, with which award, and their name as it
-- will be printed on the certificate. One row per certificate, so a double degree is two rows.
-- The name is the one the graduate confirmed in the portal for that ceremony (a correction once
-- the registrar's office has checked it), else the student system's. What each use of the list
-- needs, and the level agreed for it, is in its YAML and its contract (Good enough for what?).

with

graduations as (

    select * from {{ ref('stg_student_system__graduations') }}

),

confirmations as (

    select * from {{ ref('stg_portal__name_confirmations') }}

),

ceremonies as (

    select * from {{ ref('ceremonies') }}

),

awards as (

    select * from {{ ref('core_award') }}

),

current_graduations as (

    select *
    from graduations
    where is_current_version

),

first_recorded as (

    select
        graduation_bk,
        min(recorded_from) as added_at
    from graduations
    group by graduation_bk

),

-- Each graduate's latest answer for a ceremony: a confirmation, or a correction once checked.
latest_answers as (

    select *
    from confirmations
    where is_current_version
        and (answer = 'confirmed' or checked_on is not null)
    qualify row_number() over (
        partition by student_bk, ceremony_id
        order by confirmed_at desc, confirmation_bk desc
    ) = 1

)

select
    current_graduations.graduation_bk,
    current_graduations.student_bk,
    coalesce(latest_answers.given_name, current_graduations.given_name) as given_name,
    coalesce(latest_answers.family_name, current_graduations.family_name) as family_name,
    coalesce(
        latest_answers.name_as_printed,
        current_graduations.given_name || ' ' || current_graduations.family_name
    ) as name_as_printed,
    cast(latest_answers.confirmed_at as date) as name_confirmed_on,
    current_graduations.award_code,
    awards.award_name,
    current_graduations.conferred_on,
    current_graduations.ceremony_id,
    ceremonies.ceremony_on,
    current_graduations.attendance_code = 'ATT' as is_attending,
    cast(first_recorded.added_at as date) as added_on
from current_graduations
inner join first_recorded
    on current_graduations.graduation_bk = first_recorded.graduation_bk
left join latest_answers
    on current_graduations.student_bk = latest_answers.student_bk
    and current_graduations.ceremony_id = latest_answers.ceremony_id
left join ceremonies
    on current_graduations.ceremony_id = ceremonies.ceremony_id
left join awards
    on current_graduations.award_bk = awards.award_bk
    and {{ valid_at('current_graduations.conferred_on', 'awards.valid_from', 'awards.valid_to') }}
