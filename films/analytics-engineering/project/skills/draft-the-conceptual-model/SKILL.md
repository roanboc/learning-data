---
name: draft-the-conceptual-model
description: Draft or extend the conceptual model (one file per domain, models/core/<domain>/_<domain>__conceptual.yml) from a question, the glossary and the catalog, for the owner to approve. Use when a new question arrives, or an entity, key or identity rule needs writing down.
---

# Draft the conceptual model

The model starts from a question, not from the sources. Draft the slice the question touches,
in the conceptual model of the domain that owns it (`models/core/<domain>/_<domain>__conceptual.yml`; the question and key sets in `models/_shared/_shared__conceptual.yml`); the owner of each meaning approves it.

## Steps

1. **Write the question** under `question:`: who asks it, the words they use, and the decision it supports. If the decision isn't clear, ask; don't guess.
2. **List only the entities the question touches.** For each noun in the question, find the term in the glossary and the tables in the catalog. An entity the question doesn't need stays out, however central it seems.
3. **For each entity, draft**:
   - `definition`: one or two plain sentences, in the business's words, not a system's;
   - `owner`: who owns the meaning (for a learner, an award or a credential, the registrar's office);
   - `business_key`: what identifies it in business terms, who issues it, and the key set it's qualified by;
   - `identity`: the rules that say two records are the same one, most trusted first;
   - `history`: which dates version it.
4. **Combine or split.** Two candidates with the same identity and the same lifecycle are one entity, with kinds (a microcredential is a kind of credential). A different grain or lifecycle is a separate entity. Write the reason in `docs/decisions.md` as a proposal.
5. **Relationships**: the two entities, the cardinality in words, and, when it carries rules, its definition, owner and rules. Numbers a rule uses are vars in `dbt_project.yml`, named, not written out.
6. **Regenerate and check**: `python scripts/generate/definitions.py`, then `dbt parse --profiles-dir .`. Update the hand-drawn diagram in `models/_shared/_shared__conceptual.md` to match.
7. **Hand it to the owners**, in a pull request: each definition, key and rule, with where it came from (glossary entry, catalog table, a person). Mark anything you inferred as a question.

## Don't

- Don't define an entity by a source table ("a learner is a row in student_system.learners").
- Don't approve a definition yourself, or change one the owner approved: propose the change.
