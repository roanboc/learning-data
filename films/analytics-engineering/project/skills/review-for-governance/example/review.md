## Governance review

The agent's review of this pull request against data governance's rules, following
`skills/review-for-governance/`. It's a comment, not an approval: each finding says who decides.

**What I ran**, on this branch, in my own development schema: `dbt build`, `dbt parse --no-partial-parse`,
`scripts/check/governance.py`, `scripts/generate/codeowners.py --check`, `scripts/generate/products.py --check`,
`scripts/check/impact.py --base 0028f45` and `skills/review-for-governance/draft_classes.py`. The evidence below is
counts from the built mart, never its values.

### Passed

- **The impact.** A new mart, `mart_health__learner_progress`, and nothing else: nothing downstream, no exposure,
  no contract changed (the impact report is below).
- **The glossary.** Nothing new in a core domain. The mart reads learner, award and credit towards an award from
  the core, as the core defines them.

### 1. Nobody answers for it

`models/marts/health/_health__models.yml`, line 8: the mart's `meta` has no `owner` and no `domain`
(`governance.py`). The conceptual model names the Faculty of Health as the owner of *learner progress*
(`_health__conceptual.yml`, line 26), but `models/_shared/_shared__owners.yml` doesn't say how to reach the
faculty (`codeowners.py`), so no owner is asked to review a change to it: the impact report says "Who to ask:
Nobody named". And the mart is in no product (`products.py`).

- **The rule:** every model other teams read has an owner (the governance check, rule 1), and every mart is part
  of a product with an owner who answers for it.
- **Drafted:** `owner: Faculty of Health` and `domain: health` in the mart's `meta`; the faculty in
  `_shared__owners.yml`, with the address its reviews go to (**which address?** I haven't guessed one); a product,
  `products/health_learner_progress.yml`, owned by the faculty; the faculty as the owner of tests in `marts/health`
  (`dbt_project.yml`); and a `health` group, like the other consumers'.
- **Who decides:** data governance, for a new owner and the owner register.

### 2. Ten columns don't say whether they identify a person

`_health__models.yml`, lines 13 to 42: no column has `meta.personal_data` (`governance.py`, ten problems). Until
each does, nothing masks it: on Databricks, the mask follows the class (DEC-PRJ-13).

| Column | Drafted class | Evidence |
|---|---|---|
| `email` | direct | 7 rows, 6 distinct; 7 look like an email |
| `full_name` | direct, **not sure** | 7 rows, 7 distinct. Its name says it's a name; please confirm |
| `learner_key` | pseudonymous | 7 rows, 7 distinct; 7 look like a hash |
| `award_key` | pseudonymous, **not sure** | 7 rows, only 2 distinct; 7 look like a hash. Its description says it's the award's hash key, and two values for seven learners agree: it may not identify a person. If it hashes the award's code, it's `none`: please confirm |
| `award_code`, `award_name`, `faculty_code`, `credit_points_required`, `credit_points_earned`, `credit_points_remaining` | none | no email, ID or hash in any of them |

- **The rule:** every column of a model other teams read says whether it identifies a person, with `direct`,
  `pseudonymous` or `none` (rule 3).
- Where I wasn't sure, I've drafted the stricter class.
- **Who decides:** the Faculty of Health, as the mart's owner.

### 3. A stated rule has no test

`_health__conceptual.yml`, line 30: "Only the faculty's own awards (faculty code HLT)." Nothing checks it: the
mart has no tests.

- **The rule:** a rule about the data has a test, with its owner and dimension (rule 4).
- **Drafted:** on `faculty_code`, `accepted_values: [HLT]`, a validity test, owned by the faculty. It passes
  today: 7 of 7 rows are HLT.
- **Who decides:** the Faculty of Health, for the rule; Jun, for the code.

### The impact report

A new mart and its contract; 0 downstream models, 0 tests, 0 exposures. Who to ask: nobody named, until
finding 1 is settled.

---

*Anil Kurian, Faculty of Health, replied:* `award_key` hashes the award's code: it's a course, not a person, so
`none`. `full_name` is direct. The faculty's reviews go to `health.data@uni.example`.

*The agent:* Drafts updated. `award_key` is `none`, with your reason; `full_name` is `direct`; the register
entry uses that address. With the drafts in, every check passes: an owner, a class on every column, an owned
test, the product, and the impact names the Faculty of Health.

*Approved:* the Faculty of Health, for the classes and the rule. Yusuf Demir, data governance, for the faculty as
a new owner. Jun Park, for the code.
