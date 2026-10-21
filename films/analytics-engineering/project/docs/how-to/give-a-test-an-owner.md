# Give a test an owner and a dimension

**What the check asks.** Every test on the data has an owner, the owner of the data it checks, and a quality dimension.

**Why.** When a test fails, the scorecard says who fixes it and what kind of quality slipped.

**How.**

1. Most tests already have both: owners come from the folder (`dbt_project.yml`), dimensions from the kind of test (`tests/generic/`). Check whether your test is in a folder with no owner, or is a new kind.
2. If its data has another owner, or it's a new kind, give it its own.
3. Choose the dimension from DAMA's six: completeness (it's there), uniqueness (once), validity (in the allowed form), consistency (agrees with elsewhere), accuracy (true to the world), timeliness (on time).

```yaml
config:
  meta: {owner: The faculties, dimension: consistency}
```

**Who to ask.** Data governance's office hours, Thursdays from 2 to 3 pm, or data.governance@uni.example.
