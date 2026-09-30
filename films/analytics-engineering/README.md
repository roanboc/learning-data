# In the weeds of data crafting

*A technical series for analytics engineers: data modelling with dbt, on Databricks and dbt Cloud.*

**Tagline (working):** Declare it. Then build it.

*From words to data* explained what a data model is and why it matters. This series goes one level deeper, into the weeds: how an analytics engineer turns an agreed model into tables, with dbt. It follows Jun, the university's analytics engineer, building version 3 of the credential model, from a question to versioned, tested and documented models, with an AI agent that helps at every step and a person who approves each one. It's for practitioners: it shows real code, YAML and Markdown, and names dbt's features.

**Status:** the opening film is built and rendered from code; it isn't on the site yet. The plan is in the [proposal](proposal.md).

## The films

| # | Film | Covers | Status |
|---|---|---|---|
| 1 | [A model is not a transformation](1-a-model-is-not-a-transformation/script.md) | The series' map: the model is the blueprint, a dbt model is one step of the building work; where the model lives; the ten steps; the films to come | Built, 5:20, English captions; [source](1-a-model-is-not-a-transformation/source/README.md) |
| 2 | Start from a question | Scope, the conceptual model in YAML, owners; combining or splitting an entity | Planned |
| 3 | What makes it the same one | Profiling, business keys, key sets, identity mapping, hashing | Planned |
| 4 | One row of what, and when | Grain; SCD2; as it is and as it was; point-in-time joins | Planned |
| 5 | Promises and proofs | Gap register; enterprise and consumer contracts; tests first | Planned |
| 6 | Built in layers | Staging, intermediate, core, marts; CTE standards; materialisations | Planned |
| 7 | Who owns what | Domains, access, groups, cross-project refs | Planned |
| 8 | An agent on the team | Skills, access, evidence, guardrails; validation, review and shipping | Planned |
| 9 | Written once | Doc blocks, Mermaid, `persist_docs`; versions and deprecation | Planned |

## The same world, one level deeper

- **The same university, platform and people** as *The Inner Life of Data*, *When things go wrong* and *From words to data*, and one new character: Jun Park, the analytics engineer ([character card](characters/card-jun.jpg)). Noor, the architect, owns the model; Jun builds it.
- **Two looks carry the idea.** The model is a blueprint, white lines on blue paper; the building work is code, in files, on the films' dark glass. Teal is an AI agent's work; gold is a person's approval.
- **Known approaches are named once**, in the opening film. After that, the series teaches mechanisms (key sets, hashing, grain, timelines) without saying which approach each came from.
- **Its own sound, and a quiet one.** Warm pads and a mellow electric piano, a harp for the past, and its own four-note mark, rising 1-4-5-8. Nothing loops: the music is sustained chords, and every effect is something appearing on screen, at that moment. Effects stay low and soft (knocks, muffled keys, paper, felt notes), with no chimes, pings or hi-hats.
- **Motion with weight.** Things arrive with a spring, every shot drifts, things shared by two chapters carry across the cut, and the video adds motion blur.

## How the films are made

Like the other series, each film is generated from code. The series keeps what's its own in [`shared/`](shared/):

| File | What it holds |
|---|---|
| `shared/src/weeds.js` | The series' components: its colours, title and end cards, the blueprint (`bpPaper`, `bpModel`), code files (`codeFile`), the lineage graph of a dbt project (`lineageGraph`), the loop of ten steps (`stepLoop`) and small cards, and its motion: a spring (`spring`), entrances that settle (`arrive`), a camera that drifts in every shot (`drift`) and dust for depth (`motes`) |
| `shared/src/post.js` | The video's finishing pass, used only by `tools/render.py`: motion blur (eight moments averaged into each frame), a soft glow and a fine grain. The site's player draws live, without it |
| `shared/src/people.js` | The series' new character, Jun Park, added to the cast of *When things go wrong* |
| `shared/src/page.html` | The standalone player page |
| `shared/tools/lang.py`, `build.py` | Where everything lives, and what a film is made of: *The Inner Life of Data*'s engine, *A Sharper Sketch*'s diagrams, the people, *Silent change*'s components, *From words to data*'s `words.js` and *Keeping it true*'s `true.js`, then this series' files |
| `shared/tools/run.py` | Runs a tool on a film: this series' own `lang.py` and `build.py`, and *From words to data*'s other tools and instruments (`music.py`) unchanged |

So a change to *From words to data*'s shared tools or components, or to *Keeping it true*'s `true.js`, also changes these films: run `tools/check.py` in each film's source after one.
