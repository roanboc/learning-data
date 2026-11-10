# The insight in Sam's inbox, on Tuesday morning

Genie ZeroOps runs on the platform, not in this repository, and nothing here sets it up. This is
what its one insight held that morning, written out as text, in the four steps it works through:
it finds the failure, traces its cause, says what it touches, and proposes a fix. Its own page looks
different, and changes as the product does: its documentation says what it shows today.

## 1. Detected

The claims job failed at 22:03 on Monday 2 November 2026, three minutes after it started. Its first
task, *build the hours to pay*, stopped on two tests of the hours in `stg_claims_app__claims`
([`build_that_night.txt`](build_that_night.txt)):

    Conversion Error: Could not convert string "1:30" to DECIMAL(5,2) when casting from source column hours

Its second task, *send to the payroll system*, didn't run. The pay run of Thursday 5 November closes
at 12:00 on Tuesday.

## 2. Root cause

Traced through lineage, from the failed task back to where the hours come from:

    build the hours to pay  <-  core_claim  <-  stg_claims_app__claims  <-  claims_app.claims (hours)

The hours in the claims app's table changed form at 15:02 on Monday, when a new version of the app
went live. One claim since then, CL-104287, holds `1:30`, where every claim before it holds decimal
hours, such as `1.50`. Staging reads the hours with `cast(hours as decimal(5, 2))`, which can't read
`1:30`. The app's contract with the platform still says decimal hours.

## 3. Impact

What reads the hours downstream, and who to tell:

- **The hours to pay** (`mart_payroll__hours_to_pay`), for the payroll system, owned by HR: not built
  tonight. Payroll needs them by noon on Tuesday to pay them on Thursday.
- **Payroll's export** (`mart_finance__casual_pay_paid`), for Finance: its next build, at 06:00 on
  Thursday, would stop the same way.
- **Casual teaching cost**, Finance's measure of what casual teaching costs, which reads the same
  claims.

Nothing wrong reached payroll: the job stopped before it sent anything.

## 4. Proposed fix

Read the hours in either form, as decimal hours, so `1:30` is 1.50. In `stg_claims_app__claims.sql`,
replace

    cast(hours as decimal(5, 2)) as hours,

with

    {{ decimal_hours('hours') }} as hours,

and add the macro `decimal_hours()` and a unit test of both forms ([`fix.patch`](fix.patch)). It isn't
pushed: it waits for a person to ask, and confirm the push. Nothing in production has changed.
