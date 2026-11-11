# Architecture for AI and agents

*Proposal for the fourth of four new series in the topic Enterprise architecture, drafted on 11 November 2026 from the author's review that day. What the four series share is in [`../business-architecture-for-data/proposal.md`](../business-architecture-for-data/proposal.md); this file holds this series' own plan. Status: proposed; no script is written until the author confirms it.*

## Decided

<!-- decided: made by site-tools/build_series.py from decided.md, the series' and each film's -->
| Date | Decision |
|---|---|
| 11 November 2026 | *Architecture for AI and agents* is five films: *Agents on the map*, *The AI platform*, *What an agent may read*, *A first draft, not a blank page* and *Every change, checked*. It draws agents and AI services on the architecture and shows AI in the architecture practice; how agents work stays in the AI agents module. |
| 11 November 2026 | *A first draft, not a blank page* (the author's ask): an agent drafts an organisation design from industry reference models, and people refine it with the business, instead of open questions that stalled many initiatives; drafts stay unconfirmed until the business confirms them. *Every change, checked* (the author's ask): the model tested on every change, and a proposed change's impact walked through the layers before anyone builds. |
<!-- /decided -->

## The brief

The author, on 11 November 2026: "I think it's a good idea to have the Architecture for AI and agents." "Let's also add a film to demonstrate how AI has also improved the enterprise architecture practice and makes it easier to draft organization designs to then refine with end users, so they start from a foundational proposal using industry standards instead of open questions of 'what do you do and how do you work?', which generally killed the enterprise architecture initiatives." "Add the testing considerations and also checks when changes are proposed, so now it's easier to analyse the impact of changes."

It adds to the AI agents module rather than repeating it: the module teaches how agents work and are governed; this series draws them on the architecture, and shows AI changing the architecture practice itself.

**Prerequisites, stated on the series page:** *The map before the data* and *Platform and solution architecture*; the AI agents module for how agents work.

## Reference and alternatives

- **Follows:** ArchiMate 4 (an agent as software assigned to a role, as *The map before the data* already draws it) and the four series' own map.
- **Also uses:** industry reference models (from *Business architecture for data*); the NIST AI Risk Management Framework and ISO/IEC 42001 for accountability, named once; decision records.
- **Where it differs:** it treats the architecture model as something tested on every change, like code, with an agent drafting and people deciding.

## Insights

| # | Insight | From |
|---|---|---|
| 1 | An agent is software in a role, with its autonomy, decision rights, escalation and an accountable person; it covers tasks, never a whole activity. | ArchiMate 4; the author's method |
| 2 | Models, gateways, tools, memory and search are platform capabilities, under the same application-or-platform test. | *Platform and solution architecture* |
| 3 | An agent's context is the data practice on the map: which products, contracts and terms it may use, under which permissions. | The four series |
| 4 | Start from a draft, not a blank page: an agent drafts from industry reference models and the organisation's documents; people correct it. | The author |
| 5 | A model in one place can be tested on every change, and a proposed change walked through the layers before anyone builds. | The author; *A map people and agents can read* |

## Films

| # | Working title | What it teaches |
|---|---|---|
| 1 | **Agents on the map** | Starts on Tomás's map. An agent as software assigned to a role, with autonomy, decision rights, escalation and an accountable person; agents cover tasks, never a whole activity |
| 2 | **The AI platform** | Models, the gateway, tools, memory and search as platform capabilities, with *Platform and solution architecture*'s test; where they sit on the map |
| 3 | **What an agent may read** | The data practice map as the agent's context: which products, contracts and glossary terms it may use, under which permissions |
| 4 | **A first draft, not a blank page** | An agent drafts a first organisation design (capabilities, value streams, processes, information) from industry reference models and the organisation's own documents, and people refine it with the business. "What do you do, and how do you work?" asked people to describe everything from nothing, and stalled many initiatives; reacting to a proposal is faster and gives better answers. Every drafted element stays marked unconfirmed until the business confirms it, and the review asks what's missing and what's wrong, because people tend to accept a confident draft |
| 5 | **Every change, checked** | Testing the model on every change: every element has an owner and a source, every capability is realised, every data object realises a business object, every rule has a home and a case that must fail, no orphans or duplicates. Checking a proposed change: the agent walks it through the layers, lists what it touches down to the tables and names the owners who must agree, before anyone builds. The agent is tested too, on a known change with a known impact. People decide |

**Its story** is one true story from a region the other three series don't use, chosen when the films are drafted.

## Overlap

*A map people and agents can read* (an agent keeps the map) and *One map, in the repo* (an agent drafts, a person decides): here an agent starts the map and checks changes to it. The AI agents module (*What an agent is*, *Agents at work on data*, *From helper to colleague*) teaches how agents work, their rights and review; each film links to it.
