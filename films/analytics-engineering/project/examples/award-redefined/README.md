# A worked example: award's new words, the sync that finds them, and one count of awards

On Monday, the registrar's office changes what *award* means: a microcredential of at least 6
credit points now counts. Mei Tanaka owns the meaning, and data governance publishes the term to
the glossary. That night, the sync (`skills/sync-the-glossary/`) compares the conceptual model's
copy with the glossary, finds the drift, and writes the report that becomes a pull request's body:
on Tuesday morning, Mei approves the meaning and data governance confirms the term. Jun's Tuesday
change, in `../counts-as-award/`, adds `counts_as_award`, which reads the setting
`min_award_credit_points: 6`; and the data team counts awards once, as a metric view on
Databricks, which the draft submission and Planning's census report read. *Meaning on the
platform*, film 3 of 6 of *Governance you can use*, shows it.

| File | What it is |
|---|---|
| `glossary_on_monday.json` | The glossary's export on Monday night: the term *Award*, its new words, and its owner |
| `sync_on_monday.md` | The sync's report on it, the pull request's body: the words removed and added; what may change the meaning (a number, and another entity named, microcredential); and what the new words touch: the doc block, eight definitions that name award, three models, the code that builds them, three decisions, 20 tests, two models downstream, and three exposures to tell, with their owners |
| `awards_conferred.patch` | On top of `../counts-as-award/counts_as_award.patch`: `models/core/course/awards_conferred.sql`, a Unity Catalog metric view (`materialized='metric_view'`, dbt-databricks), turned on for Databricks only; its owner, Mei, in `_core_course__models.yml`; and the two reports' exposures, which say they count with it there |

The new words aren't written into the conceptual model: `--write` would replace `award`'s
definition and `synced_on` and regenerate its doc block, and other films show the words synced on
14 October. On 28 October 2026, Databricks shows the glossary's terms as Pages, in beta, and
documents no API to read them, so the export is the one the glossary's service writes when it
publishes a term; the sync reads either.

The metric view counts the credentials that count as an award, by the year they were issued,
revoked later or not: whether a revoked award still counts as conferred is Mei's to decide, in
the course domain's log. DuckDB has no metric views, so there the model is turned off, and the
exposures keep depending on `core_credential` version 2: an exposure can't depend on a model
that's turned off. On Databricks, reports read it with `measure(awards_conferred)`, grouped by
`year_issued`. Every microcredential in the sample carries 5 credit points, so no count moves.

## Run it again

The sync, from the project's folder:

```sh
dbt parse --profiles-dir .
python skills/sync-the-glossary/sync_glossary.py \
  --glossary examples/award-redefined/glossary_on_monday.json --report sync.md
```

It exits with 1, for the drift, and writes the report. It was captured on 28 October 2026; later
changes to the project can add to its lists.

The metric view, in the scratch worktree of `../counts-as-award/README.md`, after
`counts_as_award.patch`:

```sh
git am "$example/../award-redefined/awards_conferred.patch"
cd films/analytics-engineering/project
dbt build --profiles-dir .      # DuckDB: the metric view is turned off, and the rest passes
dbt compile --target databricks --profiles-dir . --select awards_conferred --no-populate-cache
```

The compile needs the Databricks variables of `profiles.yml`; as in CI, dummy ones do, since it
connects to nothing. It prints the metric view's YAML, with the table's full name in `source`.
