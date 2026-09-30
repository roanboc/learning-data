with

credit as (

    select * from {{ ref('int_credit_towards_award') }}

)

select
    {{ hash_key(['learner_bk', 'award_bk']) }} as learner_award_key,
    learner_key,
    learner_bk,
    award_key,
    award_bk,
    valid_from,
    valid_to,
    valid_to is null as is_current,
    credit_points_from_units,
    credit_points_from_microcredentials,
    credit_points_earned,
    microcredentials_counted
from credit
