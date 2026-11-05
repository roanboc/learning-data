# A worked example: the census-day count by level of study

Clara Jensen, in Planning, asks for the census-day count by level of study, for the government's
report. Before the agent starts, Jun Park writes one page ([`docs/plan.md`](../../docs/plan.md)
says what each line is for): the goal, what to read, the tools it may use, where it may write, what
it must never do, a limit, and two checks, which the agent writes as tests before any model and
Jun approves. The first run is 28 short: exchange students with no level. The agent doesn't drop
them or touch the test; it asks Mei Tanaka, who owns the meaning, with its query and the result.
She decides they count as non-award, a level of its own; both tests pass; and the agent opens a
pull request with the evidence for every claim. Jun checks it against the plan, and Noor approves
it for production. *Plan, define the check, do, check*, the fifth film of *Agents at work on
data*, follows it.

| File | What it is |
|---|---|
| `plan.md` | Jun's page, as he wrote it before the agent started |
| `tests/levels_add_up_to_census_day.sql` | The first check: the levels add up to the census-day count, 18,412 |
| `tests/_census_by_level__tests.yml` | The second check: every student has exactly one level |
| `pull_request.md` | The agent's pull request: what changed and why, the plan line by line, its four rounds of ten, the evidence, and the description it copied from the glossary |
| `decision.yml` | Mei's decision, as the student domain's decision log keeps one |

The models it names (`mart_planning__census_day_students`, the 18,412 students on census day;
`mart_planning__census_day_levels`; and `mart_planning__census_by_level`) are the film's, at the
university's scale. They're only in this example, not in the project: its sample holds a few dozen
learners, and a count by level in the models would change the counts other films show. So these
files are the job's documents, not code that runs here.

What the loop leaves for the next one: Mei's decision, recorded; *Level of study* in the glossary
and in the model's description, with its source; a step in `skills/reconcile-and-diff/`, *Every
split adds up to its total*, and this cause in its *Causes met so far*; and the plan, which the
next job starts from.
