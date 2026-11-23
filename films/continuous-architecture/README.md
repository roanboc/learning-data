# Continuous architecture

*A series of the topic Enterprise architecture, after* Platform and solution architecture *and before* AI architecture.

An architecture kept alive as a continuous capability: one map people and agents can read, a first draft instead of a blank page, every change checked against the map, and keeping the map someone's job. Its plan is in its [proposal](proposal.md), which points to the plan of *AI and continuous architecture*: the two series were one until 19 November 2026, when *Continuous architecture* became a series of its own, so people can take it without the AI part. On 23 November 2026, when the portal was consolidated, *A map people and agents can read* came from *The map before the data* to open it, remade to open on Babylon's diary of the sky, and the three films after it moved up one.

**Status:** all four films are out, at `continuous-architecture/` on the site. The old pages of *AI and continuous architecture* lead here and to *AI architecture*. The films carry no draft label.

## The films

<!-- films: made by site-tools/build_series.py's readme() -->
| Film | Topic | Length | Chapters | Pause and think | Script |
|---|---|---|---|---|---|
| [A map people and agents can read](https://data.learn-all.org/continuous-architecture/a-map-people-and-agents-can-read/) | Keeping the map | 9½ min | 12 | 3 questions | [script](1-a-map-people-and-agents-can-read/script.md) · [source](1-a-map-people-and-agents-can-read/source/README.md) |
| [A first draft, not a blank page](https://data.learn-all.org/continuous-architecture/a-first-draft-not-a-blank-page/) | An agent's first draft | 7½ min | 8 | 3 questions | [script](2-a-first-draft-not-a-blank-page/script.md) · [source](2-a-first-draft-not-a-blank-page/source/README.md) |
| [Every change, checked](https://data.learn-all.org/continuous-architecture/every-change-checked/) | The map, tested on every change | 7½ min | 8 | 3 questions | [script](3-every-change-checked/script.md) · [source](3-every-change-checked/source/README.md) |
| [Kept alive](https://data.learn-all.org/continuous-architecture/kept-alive/) | Keeping the architecture alive | 8½ min | 9 | 3 questions | [script](4-kept-alive/script.md) · [source](4-kept-alive/source/README.md) |

For the whole series, on the site: [8 labs](https://data.learn-all.org/continuous-architecture/labs/) and [8 scenarios](https://data.learn-all.org/continuous-architecture/scenarios/), in English and Spanish, from the words in [site/assets/continuous-architecture/](../../site/assets/continuous-architecture/).
<!-- /films -->

## The look and the sound

The look, the people and the utility of *The map before the data*, with the components it shares with *AI architecture* in [`../ai-and-continuous-architecture/shared/src/aca.js`](../ai-and-continuous-architecture/shared/src/aca.js), and the same true story, Babylon: its scholars' diary of the sky, kept from 652 BCE, in the film that opens the series, then the ziggurat, Etemenanki, rebuilt from about 620 BCE, each film opening on its part of it. Each film has its own sound. See [`../ai-and-continuous-architecture/README.md`](../ai-and-continuous-architecture/README.md).

## Labs and scenarios

A playground for each film and a lab in the shared classic kinds, on [*Take it apart*](https://data.learn-all.org/continuous-architecture/labs/), and the series' evaluation, eight situations, two from each film, on [*Make the call*](https://data.learn-all.org/continuous-architecture/scenarios/). The words are in `site/assets/continuous-architecture/learn.en.js` and `learn.es.js`, numbered by this series' films (11 is the first of *A map people and agents can read*, 21 of *A first draft, not a blank page*); when *A map people and agents can read* came, on 23 November 2026, a visitor's answers moved with the numbers, and the answers, experiments and visit they had on *The map before the data*'s pages for that film carried over (`renum` in the words); the engine is *AI architecture*'s, `site/assets/ai-and-continuous-architecture/learn.js`. Progress stays in the visitor's browser, under `ld-continuous-architecture`. After a change to the words, run `python site-tools/build_series.py`.
