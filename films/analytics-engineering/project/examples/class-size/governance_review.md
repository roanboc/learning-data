## Governance review

*`governance-review-agent[bot]`, Yusuf Demir's, reviewed the pull request on its first push, Tuesday
3 November 2026, and submitted its review as a comment.*

The agent's review of this pull request against data governance's rules, following
`skills/review-for-governance/`. It's a comment, for reference: not an approval, and it blocks nothing. Each
finding says who decides.

**What I read**: the pull request, its files, and CI's results on it (`checks.txt`: the build of what changed and
what depends on it, every test, `scripts/check/governance.py`, `scripts/generate/codeowners.py --check` and the
impact report; `diff.txt`, the data's diff), with `skills/review-for-governance/draft_classes.py`'s counts from
the pull request's build. I can't push, and I have no access to Databricks: the evidence below is counts, never
values.

### Passed

- **An owner.** The class plan has one: Clara Jensen, Planning. The new column is hers, as the plan is.
- **The words, from the glossary.** `class_size`'s description is the glossary's *Class size*, word for word, with
  its source: named by data governance, defined by Mei Tanaka, registrar's office, synced on 3 November 2026.
- **Each new column says whether it identifies a person.** `class_size`: `personal_data: none`. Evidence: 1,236
  rows, 3 distinct values, 31 empty; nothing looks like an email, a student or staff ID or a hash.
- **The impact, named.** One column added: the contract's change is additive, and nothing that reads the plan
  breaks. `classes` changes in 161 units, each one up, 263 in all (`diff.txt`). Downstream, the classes by faculty
  and its tests pass; the faculties' tutor hiring reads them.
- **A test for each stated rule.** "Every student has a place in a class" and "no class is planned that isn't
  needed" are tested, each with an owner and a dimension.

### 1. 31 units have no class size, and nobody is told

`models/marts/planning/mart_planning__class_plan.sql`: a unit with no class size keeps 25, as before, and the pull
request says so. But nothing tells the people who could set one.

| What | Count | The query |
|---|---|---|
| Units with no class size | 31 | `select count(*) from {{ ref('mart_planning__class_plan') }} where class_size is null` |

- **The rule:** each unit's school sets its class size (the glossary's *Class size*). That's something people do,
  so it isn't a failing check: it goes to the people who act on it (`docs/conventions.md`, *Tests*).
- **Suggested:** a warning on `class_size`, owned by the faculties. Every night's build lists the units with none,
  and `scripts/generate/issues.py` puts them in the faculties' issue, for their schools. Not a failing check:
  those units are planned as they were, and a failing build would hold back the 161 that are right.

  ```yaml
      - name: class_size
        data_tests:
          - not_null:
              name: every_unit_has_a_class_size
              config:
                severity: warn
                store_failures: true   # the units with none, in the build's audit schema, for the faculties
                meta: {owner: The faculties}
  ```

  A suggestion: I can't push.
- **Who decides:** Clara Jensen, as the plan's owner.

---

*Jun Park, analytics engineer, approved the first push, for the code; Mei Tanaka, data owner, for the word it
copies.*

*Clara Jensen, Planning, replied:* Yes. A warning, owned by the faculties, so each school sees its units until it
sets a size. And I approve the change.

*The planning agent:* Added, as Clara decided: the warning on `class_size`, owned by the faculties. Pushed to
`agent/planning/class-size`: the second push. Every check passes again, with one warning, the 31 units
(`checks.txt`), and the diff is the same (`diff.txt`).

*The second push dismissed the approvals before it. Approved again, on the second push:* Jun Park, analytics
engineer, for the code. Clara Jensen, product owner, for the change. Mei Tanaka, data owner, for the word it copies.
