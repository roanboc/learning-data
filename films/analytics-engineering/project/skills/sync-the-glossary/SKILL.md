---
name: sync-the-glossary
description: Check each term in the business glossary (Unity Catalog's Glossary) against the conceptual model's copy; on a drift, propose the update in a pull request and analyse its impact on definitions, models and code. Use on the scheduled review, when data governance announces a changed term, or when someone asks where a definition comes from.
---

# Sync the conceptual model from the glossary

The university keeps its business glossary outside dbt: Unity Catalog's Glossary, on Databricks,
with its terms organised by domain. Where it defines an entity, data governance names the term
that applies, and that term is the home of the definition (DEC-PRJ-11 in
`models/_shared/_shared__decisions.yml`). The conceptual model keeps a reviewed copy, with the
term in `source:`, so the build, the docs site and the catalog read it from one place. The copy
flows one way: from the glossary into the project, never back.

## Steps

1. **Read each term from the official place.** For every entity with `source:` in a
   `_<domain>__conceptual.yml`, read its term in the glossary, as it stands now, with its owner and
   the date it last changed. Databricks serves the Glossary through SQL, its APIs and MCP; read
   access only, never edit it from here. Write what you read to a glossary export, a JSON file
   shaped like `example_glossary.json` here (`term`, `definition`, `owner`, `updated_on`), or a
   CSV with the same columns. Don't retype a definition: copy it as the glossary gives it.
2. **Compare, and analyse the impact.**
   ```sh
   dbt parse --profiles-dir .
   python skills/sync-the-glossary/sync_glossary.py --glossary <export> --report sync.md
   ```
   It compares each definition with its term, ignoring spacing. In step: nothing to do, and the
   run ends there. On a drift it exits 1 and writes the report: the words removed and added; what
   may change the meaning (a number, a negation or limit, another entity named or dropped); and
   what the change touches: the generated doc block, other definitions that name the entity, the
   models and columns that show it or hold it, the SQL and macros that build them and the vars
   they read, the decisions implemented in them, their tests, everything downstream, and the
   exposures to tell, with their owners.
3. **Read the impact as a person would.** The flags are prompts, not verdicts. For each model and
   macro in the report, ask whether its logic still matches the new words: does it count what the
   term now includes, and leave out what it now excludes? Does a number in the meaning belong in
   a var? Add what you find to the report, with the query that shows it.
4. **Propose the update.**
   ```sh
   python skills/sync-the-glossary/sync_glossary.py --glossary <export> --write
   dbt build --select <the models in the report>+ --profiles-dir .
   ```
   `--write` replaces only each drifted definition and its `synced_on`, then regenerates the doc
   blocks. Open a pull request with the report as its body. If the new meaning changes what a
   model counts, say so: that's a decision in the domain's log, and a change to a public model's
   columns or meaning is a new version (`docs/conventions.md`).
5. **Hand it to the owners.** The owner of the meaning in the conceptual model approves; data
   governance confirms the term still applies; the exposures' owners are told.
6. **Entities without a source.** For each, ask data governance whether the glossary has a term
   for it now. If it does, propose `source:` and the term's definition, as above.

Run it on a schedule (a recurring job, or the team's reminder), and whenever data governance
announces a changed term. CI runs it on `example_glossary.json`, which matches the conceptual
models, so the script stays working.

## Don't

- Don't write a definition anew where the glossary has one: take the term's words.
- Don't change the glossary to match the project. If the project's meaning is right and the
  glossary's is wrong, raise it with the term's steward and data governance.
- Don't sync silently. A definition changes only in a reviewed pull request.
