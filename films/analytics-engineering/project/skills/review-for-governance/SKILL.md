---
name: review-for-governance
description: Review a pull request against data governance's rules - an owner, a glossary term or governance's confirmation there's none, classified columns, a test or a tracking model for each stated rule, and the impact named - and draft what's missing for the owners to approve. Use on every pull request that changes models, sources, seeds or conceptual models.
---

# Review a pull request for governance

Data governance's policy, the lines of it that can run, written as steps an agent follows on
every pull request (DEC-PRJ-12). Most of it is checked by scripts; the rest needs reading. You
find, draft and flag. People decide: you never approve, never edit the business glossary, and
never weaken a test.

## Steps

1. **Build what changed, and run the checks.**
   ```sh
   dbt build --select state:modified+ --defer --state <main's artifacts> --profiles-dir .   # or the whole build
   dbt parse --profiles-dir . --no-partial-parse
   python scripts/check/governance.py --measures
   python scripts/generate/codeowners.py --check
   python scripts/generate/products.py --check
   python scripts/check/impact.py --base origin/main --report impact.md
   ```
   `governance.py` names each missing owner, glossary term, column class, test owner or
   dimension, and description, and links its how-to (`docs/how-to/`). `products.py` fails on a public
   model or mart that's in no data product. `impact.py` names what the
   change touches and who to ask, and fails on a breaking contract change with no new version.
2. **An owner.** For each new entity, kind, model, source or seed with no owner, find who decides
   what it means: the owner of the domain on the university's map (`_shared__conceptual.yml`), or
   the team whose system it comes from. Draft it; if it isn't clear, ask data governance. A new
   owner goes in `governance/2-owners/owners.yml` too, with where their reviews go, and
   `scripts/generate/codeowners.py` regenerates `CODEOWNERS`. A new mart must also be an output of a
   data product, with an owner who answers for it: draft `governance/4-data-products/<name>.yml`, and
   `scripts/generate/products.py` writes its contracts and product descriptor.
3. **A glossary term, or a confirmed absence.** For each new entity in a core domain, ask data
   governance which glossary term applies. If one does, take its words as they are, with
   `source:` (`skills/sync-the-glossary/`, DEC-PRJ-11). If governance confirms there's none, add
   `no_glossary_term:` with who confirmed it and when. Never write the term into the glossary, and
   never guess one.
4. **Classified columns.** For each new column of a public model or mart, draft its class with the
   evidence:
   ```sh
   python skills/review-for-governance/draft_classes.py
   ```
   It counts what each column holds (emails, person IDs, keys that hold one, hashes) and never
   shows a value. Propose `meta.personal_data` (`direct`, `pseudonymous` or `none`) in the pull
   request, with the evidence line, for the model's owner to approve. When the name or the counts
   disagree, say so and ask; when in doubt, propose the stricter class.
5. **A test, or a tracking model, for each stated rule.** Read the rules the change adds or
   touches: `rules:` and `identity:` in the conceptual models, and decisions that say what must be
   true. A rule about the data (a value in a set, a key that matches, a number that adds up) has a
   test, with its owner and dimension. A rule about what people or processes do (a bill corrected
   on the next one, a form signed within a week) is not a failing build: it's an exceptions
   model, owned by the team that acts on it, which tracks the cases (docs/conventions.md, *Tests*).
   List each rule with what checks it, and draft what's missing.
6. **The impact named.** Put `impact.md` in the pull request's description. For each exposure
   reached, tell its owner; for each contract, say whether the change is additive or breaking. A
   breaking change is a new version, with a deprecation date for the old one; prefer an additive
   change when there's one.
7. **Report.** One comment on the pull request: what passed, each finding with its file, what you
   drafted and the evidence, and who must approve each (the owner of the meaning, the data
   architect for the model, data governance for terms). Mark what you weren't sure of.

## Don't

- Don't approve or merge the pull request, or mark a finding resolved for someone.
- Don't edit the business glossary, or write a definition the glossary already holds.
- Don't lower a test's severity, narrow it or delete it to make the check pass, and don't set
  `personal_data: none` to make a column pass: a class is a claim about the data, with evidence.
- Don't copy values out of the data to show evidence: counts and the query that gives them.
