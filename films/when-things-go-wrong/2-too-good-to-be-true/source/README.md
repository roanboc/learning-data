# Too good to be true: source

*Too good to be true*, the second film in *When things go wrong*, will be generated from code like [*Silent change*](../../1-silent-change/source/README.md), sharing its engine, components and characters. So far it holds the script's narration, the tools to measure it, and the film's own components, which the [style frames](../frames/README.md) draw with; the scenes come next.

| File | What it holds |
|---|---|
| `src/narration.js` | The narration, one line per id, following the chapters of [the script](../script.md). |
| `src/breath.js` | The few longer pauses. Every sentence already gets a beat of 0.8 s from `narration.js`. |
| `src/good.js` | This film's components: the gauge, the number painting, the contract card for applications, row checks, application tiles with IDs, the committee's dashboard, the planner's board, the alert channel and the version panes. |
| `tools/lang.py` | Finds this film's files and the shared source, as in *Silent change*. |
| `tools/pace.py` | The pacing report. Before the lines are voiced, it estimates each at 171 words a minute, *Silent change*'s voiced rate. |

Run from this folder: `python tools/pace.py`.
