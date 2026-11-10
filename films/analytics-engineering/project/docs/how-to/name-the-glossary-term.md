# Name the glossary term

**What the check asks.** Every entity in a core domain takes its definition from the business glossary, or data governance has confirmed there's no term for it. Every public model names the entity it holds.

**Why.** One word, one meaning: a definition copied from the glossary means the same here as on every dashboard.

**How.**

1. Look the word up in the business glossary.
2. If it's there, copy its definition into the entity, with where it came from (`source:`, DEC-PRJ-11).
3. If it isn't, ask data governance. Once they confirm there's none, write who confirmed it and when.

```yaml
no_glossary_term: {confirmed_by: data governance, confirmed_on: 2026-10-20}
```

On a public model, name the entity: `meta: {glossary_term: award}`.

**Who to ask.** Data governance's office hours, Thursdays from 2 to 3 pm, or data.governance@uni.example. Only data governance names a glossary term.
