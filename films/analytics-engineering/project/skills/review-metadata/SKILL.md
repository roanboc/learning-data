---
name: review-metadata
description: Review the project's YAML and Markdown for facts written twice, drifted copies and missing metadata. Use when docs change, before a release, or when someone asks where a definition lives.
---

# Review metadata for duplication

Each fact lives once. Meaning goes in `model/conceptual.yml`, decisions and gaps in `docs/`,
everything the build uses in YAML, and long or shared text in doc blocks. This skill finds the
places where that slipped.

## Steps

1. **Generated files are current.**
   ```sh
   dbt parse --profiles-dir .
   python scripts/definitions.py --check
   python scripts/diagrams.py --check
   ```
2. **The same text in more than one description.** List descriptions written out, word for word, in more than one place:
   ```sh
   python skills/review-metadata/find_repeats.py
   ```
   Each one is a candidate for a doc block in `docs/columns.md`, shown with `doc()` in every place. Read near-repeats too: the same meaning in slightly different words is the drift this step exists to catch.
3. **Definitions outside the conceptual model.** Search the YAML and Markdown for a definition of an entity ("A learner is", "A credential is") that isn't a `doc()` of the generated block. There should be one home: `model/conceptual.yml`.
4. **Numbers the build uses, written in prose.** The census date, the 15 credit points, the limit of four microcredentials and the passing grades live as vars in `dbt_project.yml`. Docs refer to the var; they don't repeat the value.
5. **Missing metadata.** Every core and mart model has `meta.owner`, `meta.domain` and a glossary term; every column that holds personal data has `meta.personal_data`; every core and mart column has a description.
6. **Report** each finding with the file and line, the other copies, and a proposed home. Propose the edits in a pull request; the engineer approves them, and the owner when the meaning moves.

## Don't

- Don't merge two descriptions that say different things. That's a disagreement about meaning: ask the owner.
- Don't edit `docs/definitions.md` or `docs/physical.md` by hand; they're generated.
