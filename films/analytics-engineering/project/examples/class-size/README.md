# A worked example: the planning agent's first pull request

Clara Jensen, in Planning, asks for each unit's classes to come from its own class size, on Planning's class plan
for next semester (2027 Semester 1, 1,236 units). The faculties hire their tutors from the plan, in November, for
February. It put every unit's students in classes of 25, but a laboratory holds 16 and a studio 20, so for those
units the faculties hired too few tutors, and students waited for a bench. *Class size* is in the glossary already,
defined by Mei Tanaka. The planning agent, Planning's contributor under its own name, writes two tests before the
change, builds it on its own branch and in its own development schema, and opens its first pull request with its
evidence. The checks build what changed and what depends on it; a diff compares the plan with main's, unit by unit.
The governance review agent reviews it, for reference, and Clara decides what it flagged. Jun Park approves the
code, Clara the change, and Mei the word it copies. Jun merges it; that night the release builds `main` in test,
and on Wednesday morning Noor Rahman, who didn't start it, approves it for production. *Every change through
review*, film 6 of 7 of *From helper to colleague*, follows it.

| File | What it is | In the film |
|---|---|---|
| `pull_request.md` | The agent's pull request: what changed and why, the words it copied from the glossary, its two tests, its evidence, and what it wasn't sure of | *What the agent hands in* |
| `checks.txt` | What CI ran on it: the build of what changed and what depends on it, every test, and the impact report | *What changed, and what it touches* |
| `diff.txt` | The plan from the agent's branch and from main, compared by its key | *What changed, and what it touches* |
| `governance_review.md` | The governance review agent's review, a comment for reference, with Clara's decision and the second push under it | *An agent's review, for reference* |
| `release.md` | Who approved what, the merge, the night in test and the release to production, as GitHub and Databricks record them | *Who approves, from the map* and *A person releases* |

The models it changes, `mart_planning__class_plan` and, built from it, `mart_planning__classes_by_faculty`, are the
film's, at the university's scale, as in `../census-by-level/`. They're only in these examples, not in the project:
its sample holds a few dozen learners. So these files are the change's documents, not code that runs here.

The rules it goes through are in `../../review-and-release/`: the ruleset on `main`, the teams written from the
map, the two environments, the release itself, and the bundle it deploys (`../../databricks.yml`).

What the change leaves for the next one: each unit's classes from its own class size, with the glossary's words and
their source; two tests that only a person changes from now on; and a list of the units with no class size, for
their schools, every night until each one has a size.
