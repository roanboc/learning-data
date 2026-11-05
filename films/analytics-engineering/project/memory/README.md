# The team's memory

What the team's agents learned in their sessions, as the platform keeps it. On Databricks, agent
sessions and the team's lasting memory are kept in stores in Lakebase, the platform's database. A
memory step, run once a day, reads the sessions and keeps what seems worth keeping. It asks no one:
it keeps hundreds of lines a week, more than anyone could read, approve or keep up to date. So nobody
approves each line, and memory comes second.

## Second, after what's governed

Agents read the glossary's definitions and the data rules first, and the team's memory second
(`AGENTS.md`, *Context and memory are data*). Those come from where their owners keep them: the
business glossary on Databricks, copied into the conceptual models with their `source:`
(DEC-PRJ-11, `skills/sync-the-glossary/`), and the data rules in the models and their tests, each
change a pull request its owner reviews. Memory helps an agent find its way; it never decides an
answer.

- **The definition wins.** When a memory line disagrees with a definition or a data rule, the agent
  follows the definition, says which one in its evidence, and flags the line.
- **What must be right every time moves to its home**: a definition in the glossary, a data rule,
  a test or a step in a skill, where its owner reviews every change (`AGENTS.md`, *The team's
  memory*). A line in memory is never the only place a rule lives.

## Who owns it

Data governance, Yusuf Demir, owns the memory as a whole:

| | |
|---|---|
| Who may read the team's store | Every agent on the team, under a read-only grant (`permission="READ"`) |
| Who may write to it | Only the memory step. No agent, and nobody by hand |
| Sessions kept | 30 days. Then a scheduled job deletes them |
| What a line may hold | A lesson about the data, never about a person: no student's name or ID, nothing private |

Each flagged line goes to data governance. Yusuf reads it against the definition it disagrees with,
deletes it from the team's store if it's wrong, and records what he deleted, and why, in
[`removed.md`](removed.md).

## Kept, then deleted

- **Sessions** are kept for 30 days. Then a scheduled job deletes them.
- **Delete where it's kept.** Deleting a session doesn't delete the memory kept from it: a wrong
  line is deleted from the team's store itself.
- **A skill, on both sides.** The sync that copies `skills/` to Unity Gateway never deletes one, so
  a skill deleted here is deleted on the platform too, by hand.
- **The record stays.** Each deletion is a row in [`removed.md`](removed.md): what, from where, by
  whom, when and why.

## Not in this example

The stores, the memory step and the scheduled job are on Databricks
(`docs/databricks-governance.md`, section 10). This project runs on DuckDB, so they aren't here:
the rules for them are, and the record of what was deleted.
