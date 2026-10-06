---
name: profile-a-source
description: Profile a source table before modelling it, with the query and the result behind every claim. Use when a new source or table arrives, or before mapping its keys and codes to the model.
---

# Profile a source, with evidence

Know what a source really holds before a model assumes anything about it.

## Steps

1. **Read what's known.** The source's YAML in `models/staging/<system>/`, its key set in `seeds/shared/key_sets.csv`, and any gap about it in `docs/gaps.md`.
2. **Run the profiling queries** in `analyses/`, on the development target:
   - `profile_key_uniqueness`: is the system key unique among current versions? Is an email enough to identify one person?
   - `profile_null_keys`: which keys are missing or blank?
   - `profile_orphans`: which references find nothing, as typed and once normalised?
   - `profile_value_sets`: which codes does each system use, and how often?
   - `profile_shared_emails`: which emails belong to more than one key?
   - `profile_late_changes`: which changes were recorded after they took effect?

   Run each with `dbt show --select <name> --profiles-dir . --limit 20`. For a new table, copy the closest query and point it at the new source.
3. **Write each finding as a claim, its query and its result**, as `AGENTS.md` shows. Counts and aggregates only; a sample of personal data only when the claim needs it, and never more than a few rows.
4. **Propose the mapping**: the system key, its key set, the business key it maps to, and each code's canonical value. Say which findings are gaps, and draft a line for `docs/gaps.md` for each, with a decision to propose: fix at source, rule in the model, or accept and document.
5. **Hand it to a person.** The engineer approves the mapping; the data's owner approves each gap's decision.

## Don't

- Don't state a number without the query that produced it.
- Don't export rows of personal data to read them elsewhere.
- Don't decide a gap yourself: propose it.
