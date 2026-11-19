# Continuous architecture

*A series of the topic Enterprise architecture, after* Platform and solution architecture *and before* AI architecture.

An architecture kept alive as a continuous capability: a first draft instead of a blank page, every change checked against the map, and keeping the map someone's job. Its plan is in its [proposal](proposal.md), which points to the plan of *AI and continuous architecture*: the two series were one until 19 November 2026, when *Continuous architecture* became a series of its own, so people can take it without the AI part.

**Status:** all three films are out, at `continuous-architecture/` on the site. The old pages of *AI and continuous architecture* lead here and to *AI architecture*. The films carry no draft label.

## The films

<!-- films: made by site-tools/build_series.py's readme() -->
| Film | Topic | Length | Chapters | Pause and think | Script |
|---|---|---|---|---|---|
| [A first draft, not a blank page](https://data.learn-all.org/continuous-architecture/a-first-draft-not-a-blank-page/) | An agent's first draft | 7½ min | 8 | 3 questions | [script](1-a-first-draft-not-a-blank-page/script.md) · [source](1-a-first-draft-not-a-blank-page/source/README.md) |
| [Every change, checked](https://data.learn-all.org/continuous-architecture/every-change-checked/) | The map, tested on every change | 7½ min | 8 | 3 questions | [script](2-every-change-checked/script.md) · [source](2-every-change-checked/source/README.md) |
| [Kept alive](https://data.learn-all.org/continuous-architecture/kept-alive/) | Keeping the architecture alive | 8½ min | 9 | 3 questions | [script](3-kept-alive/script.md) · [source](3-kept-alive/source/README.md) |

For the whole series, on the site: [3 labs](https://data.learn-all.org/continuous-architecture/labs/) and [6 scenarios](https://data.learn-all.org/continuous-architecture/scenarios/), in English and Spanish, from the words in [site/assets/continuous-architecture/](../../site/assets/continuous-architecture/).
<!-- /films -->

## The look and the sound

The look, the people and the utility of *The map before the data*, with the components it shares with *AI architecture* in [`../ai-and-continuous-architecture/shared/src/aca.js`](../ai-and-continuous-architecture/shared/src/aca.js), and the same true story, the ziggurat of Babylon, each film opening on its part of it. Each film has its own sound. See [`../ai-and-continuous-architecture/README.md`](../ai-and-continuous-architecture/README.md).

## Labs and scenarios

One playground for each film, on [*Take it apart*](https://data.learn-all.org/continuous-architecture/labs/), and the series' evaluation, six situations, two from each film, on [*Make the call*](https://data.learn-all.org/continuous-architecture/scenarios/). The words are in `site/assets/continuous-architecture/learn.en.js` and `learn.es.js`, numbered by this series' films (11 is the first of *A first draft, not a blank page*); the engine is *AI architecture*'s, `site/assets/ai-and-continuous-architecture/learn.js`. Progress stays in the visitor's browser, under `ld-continuous-architecture`. After a change to the words, run `python site-tools/build_series.py`.
