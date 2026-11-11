# A worked example: the workload agent's sixth night in test, under its mandate

On Wednesday 4 November 2026, a rewrite of the workload agent's mart merged in the day: it counted contracts by their
own dates, and it dropped the clause that keeps only the version of each contract that holds today. HR keeps every
version it records, and three Nursing tutors had moved to another unit this term, so HR held two versions of each
of their contracts. The project's sample has one version of each contract, so CI passed. That night the release
built `main` in test, and at 23:14 the test "each contract counts once" failed. Nobody was at work. The workload
agent does that one task alone, in test, under its mandate (`../../governance/8-mandates/workload-agent.yml`): a
plain check first, three rounds, the clause put back in its own model and checked in test, a pull request, and its
report twenty minutes after the failure. It also found a question no rule answers, and asked HR, changing nothing.
Production never saw the bug. *A mandate, written and enforced*, film 7 of 7 of *From helper to colleague*, tells it.

| When | What happened |
|---|---|
| Wednesday, in the day | The rewrite of `mart_workload__teaching_staff` is reviewed and merged (pull request #428). CI builds the sample, with one version of each contract, and passes |
| 22:41 | Tonight's copy of HR's data arrives |
| 23:00 | The release starts (`../../review-and-release/release.yml`): its test job builds `main` in test |
| 23:14 | The test each contract counts once fails: 3 contracts on two rows. Nursing shows 67 teachers, 41 of them casual, against HR's own 64 and 38. The production job doesn't start |
| 23:15 | The agent's run starts on the failure. Its first step is a plain check: has tonight's copy arrived? Yes, at 22:41 |
| 23:16 | The agent starts. Round 1: the failed test and its three contracts. Round 2: tonight's build against the last that passed, which finds the day's change. Round 3: the clause put back on its own branch, `agent/workload/current-version`, and built in its own schema in test: every test passes, and Nursing counts 64 and 38 |
| 23:33 | Its pull request, "Count each contract once, as it stands today", opened by `workload-agent[bot]` (#431) |
| 23:34 | Its report, for Anil Kurian: 3 of 10 rounds, 20 of 60 minutes, its tokens well within its limit; and a question for HR |
| Thursday, morning | Anil reads the report. Jun Park reviews the fix, merges it and starts the release by hand. Test passes, and Noor Rahman, who didn't start it, says yes for production: at 09:40, the mart's version 43. The question goes to HR. Nursing counts 64 teachers, 38 of them casual |

| File | What it is | In the film |
|---|---|---|
| `report.md` | The agent's report, as Anil found it: what failed, why, what it fixed and where, its question, and its measures against its mandate | *Last night, in test* |
| `fix.patch` | Its fix: the clause put back in `mart_workload__teaching_staff`, on its own branch, as the project has it now | *Last night, in test* |
| `question.md` | Its question for HR, who decide what a word about staff means: where a tutor who moved counts this term | *Alone in test, a draft in production* |
| `moved.patch` | Only for running the night again here: HR's sample with one tutor who moved this term | |
| `checks.txt` | The night run again on the sample: the test fails on the tutor who moved, then, with the fix, every test passes | *Last night, in test* |

The night's numbers are the university's: 3 tutors who moved, and Nursing's 67 and 41 against 64 and 38. The
project's sample is small, with no list of units and their schools, so it can't count by school; run again here,
the same test fails on its one tutor who moved.

## Run it again

From the repository's root, in a scratch worktree:

```sh
example=$PWD/films/analytics-engineering/project/examples/night-in-test
git worktree add /tmp/night HEAD
cd /tmp/night
git apply -R "$example/fix.patch"   # the day's change: the clause dropped
git apply "$example/moved.patch"    # HR's sample, with one tutor who moved this term
cd films/analytics-engineering/project
dbt build --profiles-dir . --select +mart_workload__teaching_staff --indirect-selection cautious \
    --vars '{as_is_date: 2026-11-04}'                     # FAIL 1 each_contract_counts_once
git -C /tmp/night apply "$example/fix.patch"             # the agent's fix
dbt build --profiles-dir . --select +mart_workload__teaching_staff --indirect-selection cautious \
    --vars '{as_is_date: 2026-11-04}'                     # every test passes
```

The workload agent works alone only in its folders, which its App's push ruleset holds
(`../../review-and-release/rulesets/workload-agent-folders.json`): the mart's SQL is in them; its YAML, with its
contract and its tests, isn't. `scripts/check/mandates.py` fails if a tool allows it more than its mandate.
