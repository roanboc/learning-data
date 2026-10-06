---
name: sync-the-glossary
description: Compare each definition the university's business glossary holds with the conceptual model's copy, and propose any change in a pull request with what it touches. Use on the scheduled review, when data governance announces a changed term, or when someone asks where a definition comes from.
---

# Sync the conceptual model from the glossary

The university keeps its business glossary outside dbt: Unity Catalog's Glossary, on Databricks,
with its terms organised by domain. Where it defines an entity, data governance names the term
that applies, and that term is the home of the definition (DEC-PRJ-11 in
`models/_shared/_shared__decisions.yml`). The conceptual model keeps a reviewed copy, with the
term in `source:`, so the build, the docs site and the catalog read it from one place. The copy
flows one way: from the glossary into the project, never back.

## Steps

1. **List the entities with a source.** Every entity in a `_<domain>__conceptual.yml` with
   `source:`: the glossary, the term, who named it (`named_by`) and when it was last synced
   (`synced_on`).
2. **Read each term in the glossary**, as it stands now, with its owner and the date it last
   changed. Databricks serves the Glossary through SQL, its APIs and MCP; read access only:
   never edit the glossary from here.
3. **Compare the meaning.** The same words: nothing to do. Different words: is it a reword, or
   does it change what counts? A changed scope (what's included, a number, a condition) changes
   what models count.
4. **Find what it touches.** The doc block it generates (`_<domain>__definitions.md`), every
   model that shows it with `doc()` or names it in `meta.glossary_term`, and their consumers:
   ```sh
   grep -rn 'doc("<entity>")\|glossary_term: <entity>' models
   dbt ls --select <model>+ --resource-type exposure --profiles-dir .
   ```
5. **Propose the change in a pull request**: the new definition in the conceptual model and a new
   `synced_on`, then `python scripts/generate/definitions.py`. Say what changed, which term it
   came from, and what it touches. If the new meaning changes a model's logic or a public
   contract, say so: that's a decision in the domain's log, and possibly a new version.
6. **Hand it to the owners.** The owner of the meaning in the conceptual model approves; data
   governance confirms the term still applies.
7. **Entities without a source.** For each, ask data governance whether the glossary has a term
   for it now. If it does, propose `source:` and the term's definition, as above.

## Don't

- Don't write a definition anew where the glossary has one: take the term's words.
- Don't change the glossary to match the project. If the project's meaning is right and the
  glossary's is wrong, raise it with the term's steward and data governance.
- Don't sync silently. A definition changes only in a reviewed pull request.
