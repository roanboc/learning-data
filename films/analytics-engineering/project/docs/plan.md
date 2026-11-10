# The plan

Every job an agent does here starts from one page, written before it starts by the person who
gives it the job. Most of the waste with agents starts with a plan that doesn't say what the agent
may use; most of the trust comes from deciding, before any work, how the result will be checked.
For a new model, the page holds the first five steps of [`process.md`](process.md) in small: the
question and its meaning, the output, and the tests, before any model.

`AGENTS.md` (*Start from the plan*) says how an agent works from it.

## Line by line

| Line | What it says | Why it's there |
|---|---|---|
| **Goal** | The question, and the answer's shape: what's counted, as at when, split by what | So the agent knows when it's done, and the person what to check |
| **Read** | The glossary's terms the job counts by, and the models it builds on | A column's name is a hint, not a meaning (*What words mean* in `AGENTS.md`) |
| **Tools** | The tools the agent may use, and their rights: read only, unless the job must write | An agent uses what it can find: a plan that names no tools sends it looking, on the web |
| **Writes** | Its own branch, and its development schema, its sandbox | Drafts stay somewhere safe until a person has checked them |
| **Never** | What it must never do: read names, emails or student IDs; write to production | The lines no job crosses, said again on every page |
| **Limit** | How many rounds, then stop and report | So a loop ends, and a person hears why |
| **Checks** | How the result will be checked, decided now: what any right answer must meet, as tests, and the number to reconcile with | Often nobody knows the answer yet, so the checks say how the parts relate and what the words mean, not the numbers. Decided before the work, they say what right means; the agent writes them as tests first, a person approves them, and only a person changes them |
| **Approves** | Who checks the work against this page, and who approves it for production | The agent never approves; every change to production needs a second person |

## The page

```markdown
# <the job>

Asked by: <who, and what for> · Plan: <the person who gives the agent the job> · <date>

- **Goal:** …
- **Read:** <glossary terms>; <the models it builds on>
- **Tools:** <tools>, read only
- **Writes:** only its own branch, and its sandbox
- **Never:** read names, emails or student IDs; write to production
- **Limit:** <n> rounds, then stop and report
- **Checks:** <each check>. Written as tests before any model; <who> approves them, and from then
  on only a person changes them.
- **Approves:** <who checks it against this page> · <the second person, for production>
```

## After the job

The page stays with the work: the pull request takes it line by line, with the evidence for each
line, and the reviewer checks the work against it, not against the agent's word. Each loop leaves
something for the next: a decision in its scope's log, a meaning in the glossary and in the
model's description, a step in a skill, and the page itself, which the next job starts from.

A worked example, from the plan to the pull request: [`examples/census-by-level/`](../examples/census-by-level/).
