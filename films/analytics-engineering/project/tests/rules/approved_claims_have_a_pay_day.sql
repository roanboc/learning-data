-- Every approved claim has a pay day in payroll's calendar (the seed pay_days, which HR owns). When
-- the calendar runs out, a claim approved after its last close would wait for a pay day that isn't
-- there, and payroll's export would leave it out without a word: so the build stops instead.
select
    claims.claim_bk,
    claims.approved_at
from {{ ref('core_claim', v=1) }} as claims
where claims.status = 'approved'
    and {{ pay_day_for('claims.approved_at') }} is null
