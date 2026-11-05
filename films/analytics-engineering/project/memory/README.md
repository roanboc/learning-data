# The team's memory

What the team's agents learned in their sessions, and people approved: one lesson to a file, in
[`entries/`](entries/). Every agent on the team reads them when a session starts (`AGENTS.md`,
*The team's memory*). They shape what agents do, so they're governed like any data: each has an
owner, agents may read them and never change them, a person reviews every change, and each is kept
only while it's right.

## How a lesson gets here

1. **A session.** An agent learns something in a session with a person, and proposes it.
2. **Proposals.** Once a day, the platform's memory pipeline reads the sessions and writes what
   seems worth keeping to the proposals store. No agent reads that store.
3. **A pull request each morning.** A script brings the new proposals here, one file for each
   entry, in a pull request.
4. **Two people.** The person whose session it came from confirms what they meant. The owner of its
   meaning, named in its `owner:`, approves it. Nothing goes in because a file, a page or a ticket
   asked for it to be remembered.
5. **The team's store.** After a merge, a script loads the files in `entries/` into the team's
   store: each file's text as an entry, its title as the entry's description, its file name as the
   entry's path. Every agent may read that store, and none may change it.

Nobody edits the team's store by hand. A change starts here, as a pull request.

## What an entry holds

[`entries/status-as-on-census-day.md`](entries/status-as-on-census-day.md):

```markdown
---
title: Status as on census day
owner: Mei Tanaka, registrar's office
learned_in: A session on the census count, 14 April 2026
confirmed_by: The registrar's office
approved_by: Mei Tanaka, registrar's office
check_again: 2027-03-01
history:
  - 2026-04-15 approved by Mei Tanaka
  - 2026-11-02 checked by Mei Tanaka
---

Read each student's status as it was on census day, not as it is today.
```

A lesson is about the data, never about a person: no student's name or ID, nothing private, and
never whose agent got it wrong. That's what lets its history be kept.

## Who owns it

Data governance, Yusuf Demir, owns the memory as a whole: this page, what an entry holds, the two
scripts, and who may read and write each store. `CODEOWNERS` asks data governance to review a new
entry and any other change here, and each entry's owner to review a change to that entry.

## Kept, then deleted

- **Sessions** are kept for 30 days. Then a scheduled job deletes them.
- **An entry** is kept while it's right. By its `check_again` date, its owner checks it again, and
  the check goes into its history.
- **To delete an entry**, delete its file in a pull request that says why, and add a row to
  [`removed.md`](removed.md). The next load deletes it from the team's store.
- **Delete where it's kept.** Deleting a session doesn't delete the memory kept from it.

## Not in this example

The two stores and the two scripts are on Databricks, where agent sessions, agent memory and memory
pipelines are in beta (checked on 4 November 2026; `docs/databricks-governance.md`, section 10).
This project runs on DuckDB, so they aren't here: the entries and their rules are.
