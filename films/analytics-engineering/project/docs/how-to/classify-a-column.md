# Classify a column

**What the check asks.** Every column other teams read says whether it identifies a person: `special`, `direct`, `pseudonymous`, `indirect` or `none`.

**Why.** On the platform the class becomes a tag, and the tag goes with the column into every table made from it; a policy protects each class wherever its tag lands, and direct personal data is masked for anyone without a purpose (DEC-PRJ-13, DEC-PRJ-17). A column with no class isn't protected.

**Which class.** The strictest that applies, strictest first.

| Class | It holds | For example |
|---|---|---|
| `special` | Something that could harm a person if it got out | Their health, a disability, their faith; exam support given for a disability |
| `direct` | Something that names a person on its own | A name, an email, a student ID, or a key with a student ID inside it (`SIS\|S-20417`) |
| `pseudonymous` | A key that points to a person only through another table, or a code that leads back only with a key kept elsewhere | A hashed learner key: it means nothing until it's joined to the learners |
| `indirect` | Something that names no one alone, but with other columns can single one person out | A date of birth, a year of birth, a home postcode |
| `none` | Nothing about one person | An award's name, a date, a count of learners |

When in doubt between two, choose the stronger: `special` over `direct`, `direct` over `pseudonymous`, `pseudonymous` over `indirect`, `indirect` over `none`.

**How.**

1. Open the model's YAML the message names, and find the column.
2. Ask: could it harm the person if it got out? Then `special`. Could someone tell who this is from this column alone? Then `direct`. Only by joining it to another table, or with a key kept elsewhere? `pseudonymous`. Only with other columns beside it? `indirect`. None of these? `none`.
3. Add the class to the column.

```yaml
- name: email
  description: The learner's email, as the student system holds it.
  config: {meta: {personal_data: direct}}
```

A step that changes what a column holds, such as a code made from a student ID, gets its new class from the data's owner, and is made once, at the source: made later, the platform would bring the student ID's class to it too, a conflict (`docs/databricks-governance.md`, section 12).

**Who to ask.** Data governance's office hours, Thursdays from 2 to 3 pm, or data.governance@uni.example.
