# In the weeds of data crafting

*A technical series for analytics engineers: data modelling with dbt, on Databricks and dbt Cloud.*

**Tagline (working):** Declare it. Then build it.

*From words to data* explained what a data model is and why it matters. This series goes one level deeper, into the weeds: how an analytics engineer turns an agreed model into tables, with dbt. It follows Jun, the university's analytics engineer, building version 3 of the credential model, from a question to versioned, tested and documented models, with an AI agent that helps at every step and a person who approves each one. It's for practitioners: it shows real code, YAML and Markdown, and names dbt's features.

**Status:** all nine films are on the site, each with labs, scenarios and Pause and think, in English and Spanish. Their code and data come from [the example dbt project](project/), which runs on dbt Core with DuckDB. The plan is in the [proposal](proposal.md).

**The example project** is laid out the way a large project with several domains would be: sources by system (application domains), the core by what the facts mean (data domains, following TCSI), and the marts and exposures by who decides with them (business domains). Any domain can move out to its own dbt project later, with its folders. Each film's page, script, labs and scenarios link the files its chapters show.

## The films

<!-- films: made by site-tools/build_series.py's readme() -->
| Film | Topic | Length | Chapters | Labs and scenarios | Script |
|---|---|---|---|---|---|
| [Declare it, then build it](https://roanboc.github.io/learning-data/in-the-weeds/declare-it-then-build-it/) | Models and transformations | 5½ min | 11 | 4 labs, 8 scenarios | [script](1-declare-it-then-build-it/script.md) · [source](1-declare-it-then-build-it/source/README.md) |
| [Start from a question](https://roanboc.github.io/learning-data/in-the-weeds/start-from-a-question/) | Scope and owners | 5 min | 8 | 4 labs, 8 scenarios | [script](2-start-from-a-question/script.md) · [source](2-start-from-a-question/source/README.md) |
| [What makes it the same one](https://roanboc.github.io/learning-data/in-the-weeds/what-makes-it-the-same-one/) | Identity and keys | 4½ min | 8 | 4 labs, 8 scenarios | [script](3-what-makes-it-the-same-one/script.md) · [source](3-what-makes-it-the-same-one/source/README.md) |
| [One row of what, and when](https://roanboc.github.io/learning-data/in-the-weeds/one-row-of-what-and-when/) | Grain and time | 5 min | 8 | 4 labs, 8 scenarios | [script](4-one-row-of-what-and-when/script.md) · [source](4-one-row-of-what-and-when/source/README.md) |
| [Promises and proofs](https://roanboc.github.io/learning-data/in-the-weeds/promises-and-proofs/) | Contracts and tests | 5½ min | 8 | 4 labs, 8 scenarios | [script](5-promises-and-proofs/script.md) · [source](5-promises-and-proofs/source/README.md) |
| [Built in layers](https://roanboc.github.io/learning-data/in-the-weeds/built-in-layers/) | Layers and CTEs | 4½ min | 8 | 4 labs, 8 scenarios | [script](6-built-in-layers/script.md) · [source](6-built-in-layers/source/README.md) |
| [Who owns what](https://roanboc.github.io/learning-data/in-the-weeds/who-owns-what/) | Domains and ownership | 5 min | 8 | 4 labs, 8 scenarios | [script](7-who-owns-what/script.md) · [source](7-who-owns-what/source/README.md) |
| [An agent on the team](https://roanboc.github.io/learning-data/in-the-weeds/an-agent-on-the-team/) | Agents and review | 5 min | 8 | 4 labs, 8 scenarios | [script](8-an-agent-on-the-team/script.md) · [source](8-an-agent-on-the-team/source/README.md) |
| [Written once](https://roanboc.github.io/learning-data/in-the-weeds/written-once/) | Documentation and versions | 5 min | 8 | 4 labs, 8 scenarios | [script](9-written-once/script.md) · [source](9-written-once/source/README.md) |
<!-- /films -->

**On the site:** [In the weeds of data crafting](https://roanboc.github.io/learning-data/in-the-weeds/), in Spanish [En las entrañas del oficio de datos](https://roanboc.github.io/learning-data/es/in-the-weeds/). The films are in English, with English and Spanish captions; their pages, chapters, Pause and think questions, labs and scenarios are in English and Spanish.

**Planned** (see the [proposal](proposal.md)): *Start from a question*, *What makes it the same one*, *One row of what, and when*, *Promises and proofs*, *Built in layers*, *Who owns what*, *An agent on the team* and *Written once*.

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
| `shared/src/post.js` | The video's finishing pass, used only by `tools/render.py`: motion blur (eight moments averaged into each frame) and a soft glow. The site's player draws live, without it |
| `shared/src/people.js` | The series' new character, Jun Park, added to the cast of *When things go wrong* |
| `shared/src/page.html` | The standalone player page |
| `shared/tools/lang.py`, `build.py` | Where everything lives, and what a film is made of: *The Inner Life of Data*'s engine, *A Sharper Sketch*'s diagrams, the people, *Silent change*'s components, *From words to data*'s `words.js` and *Keeping it true*'s `true.js`, then this series' files |
| `shared/tools/run.py` | Runs a tool on a film: this series' own `lang.py` and `build.py`, and *From words to data*'s other tools and instruments (`music.py`) unchanged |

So a change to *From words to data*'s shared tools or components, or to *Keeping it true*'s `true.js`, also changes these films: run `tools/check.py` in each film's source after one.
