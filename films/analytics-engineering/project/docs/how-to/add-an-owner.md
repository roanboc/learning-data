# Add an owner

**What the check asks.** Everything other teams read has an owner: each domain, each entity in a conceptual model, and each shared model.

**Why.** When a number is wrong or a meaning changes, someone has to decide. The owner is that person, and changes reach them for review.

**How.**

1. Open the file the message names.
2. Find the line it names, and add who decides what it means, as people know them.
3. If that owner is new, add them to `governance/2-owners/owners.yml`, with the email their reviews go to.

For a shared model, both an owner and a domain:

```yaml
config:
  meta: {owner: Learning team, domain: learning}
```

**Who to ask.** Data governance's office hours, Thursdays from 2 to 3 pm, or data.governance@uni.example. If you don't know who owns it, that's the question to bring.
