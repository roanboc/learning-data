# Describe a column

**What the check asks.** Every column other teams read has a description. A warning until 1 December 2026, then an error (DEC-PRJ-14).

**Why.** A reader who can't tell what a column holds will guess, and two guesses make two numbers.

**How.**

1. Open the model's YAML the message names, and find the column.
2. Write one sentence its readers know: what it holds, and anything surprising about it.
3. If the column holds a glossary term, use the glossary's words.

```yaml
- name: credit_points
  description: Credit points the badge carries. Zero for a badge that's not a microcredential.
```

**Who to ask.** Data governance's office hours, Thursdays from 2 to 3 pm, or data.governance@uni.example.
