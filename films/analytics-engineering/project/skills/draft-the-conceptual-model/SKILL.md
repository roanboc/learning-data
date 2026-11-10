---
name: draft-the-conceptual-model
description: Draft or extend the conceptual model (one file per core domain and mart, and the university's map in models/_shared/) from a question, the glossary and the catalog, for the owner to approve. Use when a new question arrives, or an entity, key or identity rule needs writing down.
---

# Draft the conceptual model

The model starts from a question, not from the sources. Draft the slice the question touches,
in the conceptual model of the domain that owns each entity (`models/core/<domain>/_<domain>__conceptual.yml`). The question, and any concept only its consumer needs, go in the consumer's mart (`models/marts/<consumer>/_<consumer>__conceptual.yml`). Check the university's map (`models/_shared/_shared__conceptual.yml`) first: an entity may already be planned there, under its domain, with the TCSI element to follow. The owner of each meaning approves it.

## Steps

1. **Write the question** under `question:` in the mart's conceptual model (`models/marts/<consumer>/_<consumer>__conceptual.yml`): who asks it, the words they use, and the decision it supports. While it's still being worked out, it can be an open item in `requirements/`; once it's agreed, it lives in the conceptual model and the item is deleted. If the decision isn't clear, ask; don't guess.
2. **List only the entities the question touches.** For each noun in the question, find the term in the glossary and the tables in the catalog. An entity the question doesn't need stays out, however central it seems.
3. **For each entity, draft**:
   - `definition`: one or two plain sentences, in the business's words, not a system's. If the glossary defines it, ask data governance which term applies, take its words, and add `source:` (see `skills/sync-the-glossary/`);
   - `owner`: who owns the meaning (for a learner, an award or a credential, the registrar's office);
   - `business_key`: what identifies it in business terms, who issues it, and the key set it's qualified by;
   - `identity`: the rules that say two records are the same one, most trusted first;
   - `history`: which dates version it.
4. **Combine or split.** Two candidates with the same identity and the same lifecycle are one entity, with kinds (a microcredential is a kind of credential). A different grain or lifecycle is a separate entity. Write the reason as a decision in the domain's log (`models/core/<domain>/_<domain>__decisions.yml`), with `status: proposed`.
5. **Relationships**: the two entities, the cardinality in words, and, when it carries rules, its definition, owner and rules. Numbers a rule uses are vars in `dbt_project.yml`, named, not written out.
6. **Regenerate and check**: `python scripts/generate/definitions.py`, then `dbt parse --profiles-dir .`. Mark each new entity as modelled on the map, under its domain (the script fails until the map and the domains agree), and update the domain's hand-drawn diagram (`_<domain>__conceptual.md`) to match.
7. **Hand it to the owners**, in a pull request: each definition, key and rule, with where it came from (glossary entry, catalog table, a person). Mark anything you inferred as a question.

## Don't

- Don't define an entity by a source table ("a learner is a row in student_system.learners").
- Don't approve a definition yourself, or change one the owner approved: propose the change.
