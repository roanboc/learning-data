# A worked example: Tuesday's change, and what it touches

On Tuesday, Jun Park's first draft counts microcredentials of 6 credit points or more as awards, by
relabelling them in `int_credentials_unioned`. No column changes, so no contract breaks; but the
impact check writes into the pull request what the change reaches: five reports and apps, and four
owners to ask. Mei Tanaka, who owns what an award means, says a change of meaning breaks even when
the columns don't. So the second draft keeps every credential as it was and adds a column instead,
`counts_as_award`, to `core_credential` version 2 (not version 1, which is frozen until its
deprecation date). The check calls it additive, with three owners to tell. A sketch then renames the
column, and the check fails: a breaking change needs a new version. *Governed in dbt*, the opening film of
*Governance you can use*, shows it, as *Change without surprises* told it.

| File | What it is |
|---|---|
| `report_exposures.patch` | Two exposures for the reports that count awards, which read credentials: Planning's `census_report`, and the registrar's office's `draft_submission`, against commit `00161b92` |
| `relabel.patch` | The first draft: microcredentials of 6 credit points or more relabelled as awards |
| `impact_relabel.md` | The impact check's report on it: 5 exposures, 4 owners to ask |
| `counts_as_award.patch` | The second draft, on top of the first: the relabel goes, and `counts_as_award` comes, reading a var, `min_award_credit_points: 6` |
| `impact_counts_as_award.md` | The report: "additive: added counts_as_award", 3 exposures, 3 owners |
| `renamed.patch` | A sketch, on top of the second draft: the column renamed `is_award` |
| `impact_renamed.md` | The report: "**breaking**", and the check fails with "breaking change to core_credential v2 with no new version" |

The exposures, the var and the column are only in these patches, not in the project: in the
models, they would change the governance measures other films show. Every microcredential in the
sample carries 5 credit points, so neither draft moves a count, and `dbt build` passes on each.

## Run it again

From the repository's root, in a scratch worktree:

```sh
example=$PWD/films/analytics-engineering/project/examples/counts-as-award
git worktree add /tmp/tuesday 00161b92
cd /tmp/tuesday
git am "$example/report_exposures.patch" && git tag before-tuesday
cd films/analytics-engineering/project
dbt parse --profiles-dir . --no-partial-parse --target-path base
git am "$example/relabel.patch"
dbt parse --profiles-dir . --no-partial-parse
python scripts/check/impact.py --base before-tuesday --base-manifest base/manifest.json
```

Then `git am "$example/counts_as_award.patch"`, parse, and run the impact check the same way. For
the sketch, tag the second draft `column-added`, parse it into `base` again, apply
`renamed.patch`, parse, and run the check with `--base column-added`: it exits with 1.

*Meaning on the platform* goes on from here, with the glossary sync and a metric view that reads
`counts_as_award`: `../award-redefined/`.
