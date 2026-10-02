with

results as (

    select * from {{ ref('stg_student_system__results') }}

),

credentials as (

    select * from {{ ref('int_credentials_unioned') }}

),

recognition as (

    select * from {{ ref('credit_recognition') }}

),

matched_keys as (

    select * from {{ ref('int_learner_keys_matched') }}

),

-- a result counts from the day it's released until it's amended; the grade decides later
unit_items as (

    select
        matched_keys.learner_key,
        matched_keys.learner_bk,
        results.award_bk,
        'unit' as item_kind,
        results.result_bk as item_bk,
        results.grade,
        results.credit_points,
        results.result_date as issued_on,
        results.result_date as counts_from,
        coalesce(
            lead(results.result_date) over (partition by results.result_bk order by results.recorded_from),
            case when not results.is_current_version then cast(results.recorded_to as date) end
        ) as counts_to
    from results
    inner join matched_keys on matched_keys.qualified_key = results.student_bk

),

-- a microcredential counts towards each award that recognises it, from issue until revoked
microcredential_items as (

    select
        credentials.learner_key,
        credentials.learner_bk,
        {{ business_key('SIS', 'recognition.award_code') }} as award_bk,
        'microcredential' as item_kind,
        credentials.credential_bk as item_bk,
        cast(null as string) as grade,
        credentials.credit_points,
        credentials.issued_on,
        credentials.issued_on as counts_from,
        credentials.revoked_on as counts_to
    from credentials
    inner join recognition
        on recognition.key_set = credentials.key_set
        and recognition.credential_code = credentials.credential_code
    where credentials.credential_kind = 'microcredential'

),

items as (

    select * from unit_items
    union all
    select * from microcredential_items

)

select
    learner_key,
    learner_bk,
    {{ hash_key(['award_bk']) }} as award_key,
    award_bk,
    item_kind,
    item_bk,
    grade,
    credit_points,
    issued_on,
    counts_from,
    counts_to
from items
