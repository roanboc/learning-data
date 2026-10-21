# A worked example: the skill on a faculty's pull request

Anil Kurian, an analyst in the Faculty of Health, opens a pull request that adds a mart,
`mart_health__learner_progress`, with no owner, no column classes, and a rule the conceptual model
states but nothing tests. The skill reviews it; the faculty, data governance and the analytics
engineer approve the drafts. *Data governance* film 9, *An agent that checks*, shows it.

| File | What it is |
|---|---|
| `as_opened.patch` | The pull request as Anil opened it, against commit `0028f45` |
| `review.md` | The agent's review comment, with the replies and approvals under it |
| `drafts_applied.patch` | The drafts as the owners approved them, on top of `as_opened.patch` |

The Health mart is only in these patches, not in the project's models: in the models, it would
change the governance measures other films show.

## Run it again

From the repository's root, in a scratch worktree, so your own checkout stays as it is:

```sh
example=$PWD/films/analytics-engineering/project/skills/review-for-governance/example
git worktree add /tmp/health 0028f45
cd /tmp/health
git apply "$example/as_opened.patch"
cd films/analytics-engineering/project
dbt build --profiles-dir . && dbt parse --profiles-dir . --no-partial-parse
python scripts/check/governance.py     # ten unclassified columns, no owner, no domain
python scripts/generate/products.py --check   # the mart is in no product
python skills/review-for-governance/draft_classes.py
```

Then follow `../SKILL.md` and compare its findings with `review.md`. To see every check pass, apply
the drafts too (`git apply "$example/drafts_applied.patch"`, from the worktree's root), and rebuild.
