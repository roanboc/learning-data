# Classify a column

**What the check asks.** Every column other teams read says whether it identifies a person: `direct`, `pseudonymous` or `none`.

**Why.** On the platform the class becomes a tag, and direct personal data is masked for anyone without a purpose (DEC-PRJ-13). A column with no class isn't protected.

**Which class.**

| Class | It holds | For example |
|---|---|---|
| `direct` | Something that names a person on its own | A name, an email, a student ID, or a key with a student ID inside it (`SIS\|S-20417`) |
| `pseudonymous` | A key that points to a person only through another table | A hashed learner key: it means nothing until it's joined to the learners |
| `none` | Nothing about one person | An award's name, a date, a count of learners |

When in doubt between two, choose the stronger: `direct` over `pseudonymous`, `pseudonymous` over `none`.

**How.**

1. Open the model's YAML the message names, and find the column.
2. Ask: could someone tell who this is from this column alone? Then `direct`. Only by joining it to another table? `pseudonymous`. Neither? `none`.
3. Add the class to the column.

```yaml
- name: email
  description: The learner's email, as the student system holds it.
  config: {meta: {personal_data: direct}}
```

**Who to ask.** Data governance's office hours, Thursdays from 2 to 3 pm, or data.governance@uni.example.
