# A worked example: Jun's completions, and the check that asks for an owner

Jun Park opens a pull request that adds a mart for Planning, `mart_planning__completions`: the
awards conferred in the census year, by faculty and award type, for the census report. He adds it
to a product, `completions`, and runs the scripts that write the product's open-standard files,
`CODEOWNERS` and the physical diagram. He forgets the mart's owner. The governance check stops it,
and says how; he adds two lines, and every check passes. *Governance you can use* film 1 of 6,
*Governed in dbt*, shows it.

| File | What it is |
|---|---|
| `as_opened.patch` | The pull request as Jun opened it, against commit `00161b92`: the mart, its YAML, the product, and the files the scripts wrote |
| `checks_as_opened.txt` | What the checks said: the governance check's one problem, and the impact check's "Nobody named" |
| `owner_added.patch` | The two lines, on top of `as_opened.patch`: `owner: Planning` and `domain: planning` |
| `checks_with_owner.txt` | What the checks said then: every rule met, and Planning to ask |

The mart is only in these patches, not in the project's models: in the models, it would change the
governance measures other films show.

## Run it again

From the repository's root, in a scratch worktree, so your own checkout stays as it is:

```sh
example=$PWD/films/analytics-engineering/project/examples/completions
git worktree add /tmp/completions 00161b92
cd /tmp/completions
git tag before-completions
git am "$example/as_opened.patch"
cd films/analytics-engineering/project
dbt parse --profiles-dir . --no-partial-parse
python scripts/check/governance.py            # no meta.owner or meta.domain
python scripts/generate/products.py --check   # up to date
python scripts/generate/codeowners.py --check # up to date
```

Then apply the two lines (`git am "$example/owner_added.patch"`, from the worktree's root), parse
again, and run the governance check: its rules are met. To compare the impact reports, parse the
base into another target path (`git checkout before-completions`, then
`dbt parse --profiles-dir . --no-partial-parse --target-path base`), come back to the branch, parse
it, and run `python scripts/check/impact.py --base before-completions --base-manifest base/manifest.json`.

Without the product, `python scripts/generate/products.py --check` says "mart_planning__completions
is shared but in no product: add it to a product's outputs in governance/4-data-products/"; without
running `codeowners.py`, its check says "CODEOWNERS is out of date: run python
scripts/generate/codeowners.py".
