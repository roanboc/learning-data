# AI architecture

*The last series of the topic Enterprise architecture, after* Continuous architecture.

Agents and AI services on the map: each agent in a role of its own, with someone who answers; one AI platform under them all; and what each agent may read. The series' plan is in its [proposal](proposal.md); what the architecture series share is in [`../business-architecture-for-data/proposal.md`](../business-architecture-for-data/proposal.md).

**Status:** until 19 November 2026, this was *AI and continuous architecture*, six films. It was split in two so people can take continuous architecture without the AI part: its films 4 to 6 are now [*Continuous architecture*](../continuous-architecture/), in `films/continuous-architecture/`, and this folder keeps its name, its first three films and the components both series share ([`shared/src/aca.js`](shared/src/aca.js)). On the site, the series is at `ai-architecture/`; the old pages at `ai-and-continuous-architecture/` lead to the two new series. The films carry no draft label.

## The films

<!-- films: made by site-tools/build_series.py's readme() -->
| Film | Topic | Length | Chapters | Pause and think | Script |
|---|---|---|---|---|---|
| [Agents on the map](https://data.learn-all.org/ai-architecture/agents-on-the-map/) | Agents in the architecture | 8½ min | 11 | 3 questions | [script](1-agents-on-the-map/script.md) · [source](1-agents-on-the-map/source/README.md) |
| [The AI platform](https://data.learn-all.org/ai-architecture/the-ai-platform/) | The platform under the agents | 8 min | 11 | 3 questions | [script](2-the-ai-platform/script.md) · [source](2-the-ai-platform/source/README.md) |
| [What an agent may read](https://data.learn-all.org/ai-architecture/what-an-agent-may-read/) | The context an agent reads | 7½ min | 9 | 3 questions | [script](3-what-an-agent-may-read/script.md) · [source](3-what-an-agent-may-read/source/README.md) |

For the whole series, on the site: [6 labs](https://data.learn-all.org/ai-architecture/labs/) and [6 scenarios](https://data.learn-all.org/ai-architecture/scenarios/), in English and Spanish, from the words in [site/assets/ai-and-continuous-architecture/](../../site/assets/ai-and-continuous-architecture/).
<!-- /films -->

## The look and the sound

- **The look of *The map before the data*:** paper drafts on a wall, the confirmed model in glass, the six layers in their colours, from [`../enterprise-architecture/shared/`](../enterprise-architecture/shared/), with the same people and the same energy utility.
- **One true story across the series**, told in the series' own drawing style, each film opening on its part of it.
- **Its own sound in each film.** Music under the opening story, then only now and then; nothing loops, trembles or pulses, except an urgent pulse where a story turns to an error or a rush.

## How the films are made

Like *The map before the data*, each film is generated from code, with the engine, components, fonts and voice of *The Inner Life of Data*, *From words to data*'s tools and that series' own components. A film keeps its own pictures and helpers in its own source.

## Labs and scenarios

One set for the series, on two pages: [*Take it apart*](https://data.learn-all.org/ai-architecture/labs/), a playground for each film, and [*Make the call*](https://data.learn-all.org/ai-architecture/scenarios/), the series' evaluation, two situations from each film (`scenarios/#film-2` opens on one film's). Each film's Pause and think questions open its own lab. *Continuous architecture* has its own words and uses the same engine.

- **The engine** is `site/assets/ai-and-continuous-architecture/learn.js` and `learn.css`, shared with *Continuous architecture*. The pictures are drawn with the films' own parts, from *Every change, checked*'s player (the `bundle` in `site-tools/build_series.py`), which has them all.
- **The words** are in `learn.en.js` and `learn.es.js`, with the same keys, ids, numbers and answer places. The Spanish follows the films' Spanish captions.
- **Answers spread.** A scenario's options show in the order the words write them, so the words spread them, with like lengths, in both languages.
- **Progress** stays in the visitor's browser, under `ld-ai-architecture`: `visited` (the labs) and `quiz` (the scenarios, numbered by film and place: 21 is the first of *The AI platform*).
- **Checks.** `site-tools/check_site.py` reads both languages; `site-tools/smoke.py --only series-learn` plays every lab and answers every scenario at 320 px, with `site-tools/smoke/ai-architecture.js`. After a change to the words, run `python site-tools/build_series.py`.
