# Requirements

**Temporary.** While something is being built, what's still open about it is an item here: a
question not yet answered, a requirement not yet met, a gap waiting on a fix. Each item says what
will show it's done (`done_when`), so the metadata to watch is written down while the work goes on.

**Not a backlog.** The team's backlog tool tracks the work: who, when, how big. An item links to
it with `ticket`, and carries none of that itself. `scripts/check/requirements.py` fails on an
item with a priority, estimate, assignee or sprint.

**Deleted when done.** When an item is fulfilled, move what lasts to its home, then delete the
item. Git keeps its history. `scripts/check/requirements.py` fails on any item that isn't `open` or
`in_progress`, and on a register with nothing in it. CI runs it, and it lists what's still open.

## Where what lasts goes

| When it's done, the item was | What lasts | Its home |
|---|---|---|
| A question | The question, and the decision it supports | `question:` in the mart's conceptual model (`models/marts/<consumer>/_<consumer>__conceptual.yml`) |
| A requirement | The test, contract or metadata that now enforces it | The model's YAML, or `tests/` |
| A gap, resolved by a rule in the model | The rule, and why | A decision in the scope's log (`DEC-…`, with `was:` naming the gap), and the rule in the model |
| A gap, accepted | What anyone using the data needs to know | `meta.limitations` on the model or source table it affects, and the decision that accepted it |
| A gap, fixed at source | Nothing, beyond the fix | Retire the rule that worked around it: mark its decision `superseded` |

Decision logs are permanent: one per scope, next to what it's about, indexed in
[`docs/decisions.md`](../docs/decisions.md) by `scripts/generate/decisions.py`.

| Scope | Open requirements | Decision log |
|---|---|---|
| Project | `requirements/_project__requirements.yml` | `models/_shared/_shared__decisions.yml` |
| Source | `requirements/sources/<system>/_<system>__requirements.yml` | `sources/<system>/_<system>__decisions.yml` |
| Core domain | `requirements/models/<domain>/_<domain>__requirements.yml` | `models/core/<domain>/_<domain>__decisions.yml` |
| Consumer | `requirements/exposures/<consumer>/_<consumer>__requirements.yml` | `models/marts/<consumer>/_<consumer>__decisions.yml` |

A requirements register exists only while it has open items.

## An open item

```yaml
scope: {kind: source, name: learning_platform, code: LMS}   # project, source, domain or consumer

items:
  - id: GAP-LMS-01                 # Q, REQ or GAP, the scope's code, a number
    type: gap                      # question, requirement or gap
    step: gaps_and_contracts       # the step of docs/process.md it belongs to
    title: No revocation flag
    text: A revocation flag and date, requested from the learning team.
    owner: Learning team           # who answers or decides
    status: in_progress            # open or in_progress; nothing else stays here
    done_when: >                   # what will show it's fulfilled: the metadata, test or change to watch
      The platform sends a revocation flag and date; staging reads them, and DEC-LMS-01's rule is retired.
    ticket: https://…              # optional: the backlog item
    expectation: …                 # gaps: what the business expects
    reality: …                     # gaps: what the source holds
    resolution: [fix_at_source]    # gaps: fix_at_source, rule_in_model, accept
    sources: […]                   # optional: every source it's about, when more than its own
    evidence: [analyses/…]         # optional: the queries that show it
    relates_to: [DEC-LMS-01]       # optional: decisions, limitations or other open items
```

The steps: `scope`, `source_reality`, `consumer_output`, `gaps_and_contracts`, `tests`, `build`,
`validate`, `review_and_ship`, `written_once`, `operate_and_evolve`.

## A decision

```yaml
scope: {kind: domain, name: student, code: STU}

decisions:
  - id: DEC-STU-01
    step: scope
    title: A microcredential is a kind of credential
    text: A microcredential is a kind of credential, not an entity of its own. So is a badge.
    why: Same identity and the same lifecycle. Only the credit points differ.
    decided_by: Mei Tanaka, registrar's office
    decided_on: 2026-10-02
    status: agreed                 # proposed, agreed or superseded; a decision is never deleted
    informed: […]                  # optional: who was told
    implemented_in: […]            # optional: models, tests, seeds, macros
    relates_to: […]                # optional
    was: GAP-…                     # optional: the gap it resolved
```
