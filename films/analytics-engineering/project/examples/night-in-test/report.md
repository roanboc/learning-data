# Report · 23:34 · Why the night build failed

*From the workload agent, under its mandate (`governance/8-mandates/workload-agent.yml`), to Anil Kurian, Faculty of
Health, its owner. The night of Wednesday 4 November 2026, in test. Times are the university's.*

| | |
|---|---|
| **Failed at 23:14** | The test each contract counts once: 3 contracts on two rows |
| **Cause** | Today's change to the mart reads every version HR keeps of a contract |
| **Fixed** | On my own branch, checked in my own schema in test: Nursing 64 teachers, 38 of them casual |
| **Then** | A pull request, for Jun Park to review |
| **A question** | For HR: where a tutor who moved this term counts |

## What failed

The release's test job failed at 23:14, on the test `each_contract_counts_once` (`unique` on `contract_key`, in
`mart_workload__teaching_staff`): 3 contracts each on two rows. Nursing showed 67 teachers, 41 of them casual; HR's
own report for this term says 64 and 38. The production job didn't start, so production still has last night's
numbers.

## What I did

Before I started, at 23:15, my run's first step checked that tonight's copy of HR's data had arrived: it had, at
22:41. I started at 23:16.

1. **Round 1.** I read the failed test and its three contracts: `HR|T-26214`, `HR|T-26247` and `HR|T-26261`. HR
   holds two versions of each this term: each tutor moved to another unit during the term, two from one Nursing
   unit to another, and one from a Nursing unit to a Public Health unit.
2. **Round 2.** I compared tonight's build with the last one that passed, on Tuesday night. The only change to the
   mart since is today's rewrite (pull request #428): it counts contracts by their own dates, and it no longer keeps
   only the version of each contract that holds today. So each of the three counted twice, once for each version.
3. **Round 3.** I put that clause back, as the project writes it (`valid_at` and `as_is_date`,
   `macros/shared/time.sql`), on my own branch, `agent/workload/current-version`, and built it in my own schema in
   test. Every test passed, and Nursing counts 64 teachers, 38 of them casual, as HR's report says. At 23:33 I
   opened pull request #431, "Count each contract once, as it stands today" (`fix.patch`).

I changed nothing else: no test, no staging model, no other folder, and nothing in production.

## A question no rule answers

One of the three tutors, `HR|T-26247`, moved from a Nursing unit to a Public Health unit this term. With the fix,
they count where their contract stands today, in Public Health, as they did before today's change. Whether a tutor
who moves counts in both schools that term, or only in the one they teach in now, no rule says: it's what a word
about staff means, so it's HR's to decide. I've asked HR (`question.md`) and changed nothing.

## Against my mandate

| | Used | The page |
|---|---|---|
| Rounds | 3 | 10 |
| Time | 20 minutes, 23:14 to 23:34 | 1 hour |
| Tokens | at most 14,900 in a minute | 50,000 a minute, in Unity Gateway |
| The same error twice | No | Stop and report |
| Checks | Tonight's copy, first; every test, and the counts against HR's own report | The same |
| Where I wrote | My branch, and my own schema in test | Its folders; schemas of its own |

What it needs from people: Jun reviews the pull request; once it's merged, the release builds it in test, and a
release approver says yes for production. Production gets only what passes its night in test, and a person's yes.
