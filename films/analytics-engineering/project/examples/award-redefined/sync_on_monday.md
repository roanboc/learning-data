# Sync from the glossary: 1 term(s) drifted

Compared on 2026-10-28 with `glossary_on_monday.json`, read from the glossary. Approve: the owner of each meaning; confirm the term: data governance (DEC-PRJ-11).

## award: synced from the university's Unity Catalog Glossary, on Databricks, term Award

Last synced on 2026-10-14; the term changed, owner Mei Tanaka, registrar's office. The owner of the meaning in `models/core/course/_course__conceptual.yml`: Mei Tanaka, registrar's office.

**Now in the conceptual model**

> A qualification the university confers, such as a graduate certificate or a master, for a set number of credit points. When it's conferred on a learner, it's a credential too.

**In the glossary**

> A qualification the university confers, such as a graduate certificate, a master or a microcredential, for at least 6 credit points. When it's conferred on a learner, it's a credential too.

**What changed** (removed ~~struck~~, added in **bold**)

> A qualification the university confers, such as a graduate certificate, **a master** or a ~~master,~~ **microcredential,** for ~~a set number of~~ **at least 6** credit points. When it's conferred on a learner, it's a credential too.

**May change the meaning:** a number changed; another entity is named or dropped: microcredential. Read each against the models below.

### What it touches

- **Definitions.** The doc block `award` in `models/core/course/_course__definitions.md`, regenerated.
- Names it in its definition or rules: `role` in `models/core/person/_person__conceptual.yml`: check it still reads true.
- Names it in its definition or rules: `learner` in `models/core/student/_student__conceptual.yml`: check it still reads true.
- Names it in its definition or rules: `credential` in `models/core/student/_student__conceptual.yml`: check it still reads true.
- Names it in its definition or rules: `credit_towards_award` in `models/core/student/_student__conceptual.yml`: check it still reads true.
- Names it in its definition or rules: `counts_towards` in `models/core/student/_student__conceptual.yml`: check it still reads true.
- Names it in its definition or rules: `tuition_forgone` in `models/marts/finance/_finance__conceptual.yml`: check it still reads true.
- Names it in its definition or rules: `near_award` in `models/marts/planning/_planning__conceptual.yml`: check it still reads true.
- Names it in its definition or rules: `learner_wallet` in `models/marts/wallet/_wallet__conceptual.yml`: check it still reads true.
- **Models and columns** that show it or hold it:
  - `core_award`: description: doc("award"), meta.glossary_term, column award_key
  - `mart_finance__tuition_forgone`: column award_key
  - `mart_planning__near_award`: column award_key
- **Code** that builds them, to check against the new meaning:
  - `models/marts/planning/mart_planning__near_award.sql`
  - `models/marts/finance/mart_finance__tuition_forgone.sql`
  - `models/core/course/core_award.sql`
  - `macros/governance/domain_tag.sql`
  - `macros/governance/personal_data.sql`
  - `macros/planning/near_award.sql`
  - `macros/shared/keys.sql`
  - `macros/shared/time.sql`
- **Vars** that code reads, in `dbt_project.yml`: a number in the meaning may belong in one: `as_is_date`, `census_date`, `near_award_credit_points`, `personal_data_policy`, `personal_data_readers`
- **Decisions** implemented in them, still true?
  - DEC-CRS-01: The award needs no intermediate step (`models/core/course/_course__decisions.yml`)
  - DEC-FIN-03: The published rate, not what each learner was charged (`models/marts/finance/_finance__decisions.yml`)
  - DEC-PLN-02: Planning's mart is as it was at census (`models/marts/planning/_planning__decisions.yml`)
- **Tests** on them and downstream: 20. `dbt build --select core_award mart_finance__tuition_forgone mart_planning__near_award+` runs them.
- **Downstream models:** `mart_wallet__credentials`, `mart_wallet__learners`
- **Exposures** to tell:
  - `wallet_app`, owned by Wallet app team
  - `revenue_forecast`, owned by Finance
  - `census_dashboard`, owned by Planning
- **Catalog.** On Databricks, persist_docs rewrites the comments of the models above on their next build.

If the meaning changes what a model counts, that's a decision in the domain's log, and a breaking change to a public model is a new version.
