# Read hours as said: 1:30 is 1.5

*Sam Okafor's pull request, opened at 08:52 on Tuesday 3 November 2026 from the branch
`read-hours-as-said`, which Genie ZeroOps pushed when Sam asked and confirmed. Its checks are the
project's own, which run on every pull request. Noor, who didn't write it, approved it at 09:05.*

## What and why

Last night's claims job failed at 22:03 ([`build_that_night.txt`](build_that_night.txt)). Since 15:02
on Monday, the claims app's new version sends hours as tutors say them, `1:30` for an hour and a
half, where it sent `1.50`, and staging couldn't read the new form. Nothing reached payroll, and the
hours for Thursday's pay run are waiting. Payroll needs them by noon today.

This reads the hours in either form, as decimal hours: a macro, `decimal_hours()`, in place of the
one cast in `stg_claims_app__claims.sql`, and a unit test of both forms. Any other form still fails
the build, as it should. It's the fix Genie ZeroOps proposed ([`insight.md`](insight.md)). I checked
its cause against the claims:

```sh
dbt show --profiles-dir . --inline "select claim_id, hours, updated_at from {{ source('claims_app', 'claims') }} where hours like '%:%'"
```

| claim_id | hours | updated_at |
|---|---|---|
| CL-104287 | 1:30 | 2026-11-02 15:40:00 |

One claim, typed at 15:40, after the new version went live. DEC-CLM-02 records the rule.

## Checks

- The unit test `hours_are_read_as_said_or_as_decimal_hours`: `1.50`, `1:30`, `0:45`, `1:20` and `2`
  are read as 1.50, 1.50, 0.75, 1.33 and 2.00. Without the fix it fails with last night's error;
  with it, it passes.
- `dbt build --profiles-dir .`: every test passes, and CL-104287 is read as 1.50.
- The decision, product, owner and governance checks pass.

## What this change touches, and who to tell

From `python scripts/check/impact.py`, against `main` before the fix:

> 8 file(s) changed in the project; 1 model(s), seed(s) or source(s) changed, 0 test(s) changed,
> 3 downstream model(s), 27 test(s), 2 exposure(s).
>
> **Changed:** `stg_claims_app__claims` (model)
>
> **Downstream:** `core_claim v1`, `mart_finance__casual_pay_paid`, `mart_payroll__hours_to_pay`
>
> **Who uses it:** `payroll_export`, owned by Finance; `payroll_system`, owned by HR
>
> **Who to ask:** Finance; HR

Casual teaching cost, Finance's measure, reads the same claims on the platform, so Rohan Desai in
Finance is told too.

## Linked ticket: the contract first, next time

A ticket for Ingrid Holm in HR, linked to this pull request; she decides it there, and doesn't
review this code. The fix mends last night, not its cause. The app's change was a good one for tutors; what was
missing was a step. Ingrid Holm, as the claims' owner in HR: could a change to what the claims app
sends, a field's form, type or meaning, be agreed in its contract first, so that everyone who reads
the claims knows before the app changes? I've written it as DEC-CLM-03, proposed, for you to decide in the ticket.
The contract would then say whether hours may come as `1:30`, and DEC-CLM-02 would follow it.
