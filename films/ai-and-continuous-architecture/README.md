# AI and continuous architecture

*The last series of the topic Enterprise architecture, after* The map before the data.

Agents and AI services on the map, AI in the architecture practice, and architecture kept alive as a continuous capability: the topic's closing remarks. The series' plan is in its [proposal](proposal.md); what the four new architecture series share is in [`../business-architecture-for-data/proposal.md`](../business-architecture-for-data/proposal.md). *Platform and solution architecture* comes before it; it closes the topic.

**Status:** set up on 11 November 2026 from the proposal the author confirmed that day; the films are being made, one at a time, and appear in the table below as each one is out. On the site, the series sits under the topic *Enterprise architecture*, at `ai-and-continuous-architecture/`, once its opening film is out. The films carry no draft label: the author discussed them in detail before any was made. One set of labs and scenarios covers the whole series ([below](#labs-and-scenarios)).

## The films

<!-- films: made by site-tools/build_series.py's readme() -->
| Film | Topic | Length | Chapters | Pause and think | Script |
|---|---|---|---|---|---|
| [Agents on the map](https://data.learn-all.org/ai-and-continuous-architecture/agents-on-the-map/) | Agents in the architecture | 8½ min | 11 | 3 questions | [script](1-agents-on-the-map/script.md) · [source](1-agents-on-the-map/source/README.md) |
| [The AI platform](https://data.learn-all.org/ai-and-continuous-architecture/the-ai-platform/) | The platform under the agents | 8 min | 11 | 3 questions | [script](2-the-ai-platform/script.md) · [source](2-the-ai-platform/source/README.md) |
| [What an agent may read](https://data.learn-all.org/ai-and-continuous-architecture/what-an-agent-may-read/) | The context an agent reads | 7½ min | 9 | 3 questions | [script](3-what-an-agent-may-read/script.md) · [source](3-what-an-agent-may-read/source/README.md) |
| [A first draft, not a blank page](https://data.learn-all.org/ai-and-continuous-architecture/a-first-draft-not-a-blank-page/) | An agent's first draft | 7½ min | 8 | 3 questions | [script](4-a-first-draft-not-a-blank-page/script.md) · [source](4-a-first-draft-not-a-blank-page/source/README.md) |
| [Every change, checked](https://data.learn-all.org/ai-and-continuous-architecture/every-change-checked/) | The map, tested on every change | 7½ min | 8 | 3 questions | [script](5-every-change-checked/script.md) · [source](5-every-change-checked/source/README.md) |
| [Kept alive](https://data.learn-all.org/ai-and-continuous-architecture/kept-alive/) | Keeping the architecture alive | 8½ min | 9 | 3 questions | [script](6-kept-alive/script.md) · [source](6-kept-alive/source/README.md) |

For the whole series, on the site: [6 labs](https://data.learn-all.org/ai-and-continuous-architecture/labs/) and [18 scenarios](https://data.learn-all.org/ai-and-continuous-architecture/scenarios/), in English and Spanish, from the words in [site/assets/ai-and-continuous-architecture/](../../site/assets/ai-and-continuous-architecture/).
<!-- /films -->

## The look and the sound

- **The look of *The map before the data*:** paper drafts on a wall, the confirmed model in glass, the six layers in their colours, from [`../enterprise-architecture/shared/`](../enterprise-architecture/shared/), with the same people and the same energy utility.
- **One true story across the series**, told in the series' own drawing style, each film opening on its part of it.
- **Its own sound in each film.** Music under the opening story, then only now and then; nothing loops, trembles or pulses, except an urgent pulse where a story turns to an error or a rush.

## How the films are made

Like *The map before the data*, each film is generated from code, with the engine, components, fonts and voice of *The Inner Life of Data*, *From words to data*'s tools and that series' own components. A film keeps its own pictures and helpers in its own source.

## Labs and scenarios

One set for the whole series, on two pages: [*Take it apart*](https://data.learn-all.org/ai-and-continuous-architecture/labs/), a lab for each film, and [*Make the call*](https://data.learn-all.org/ai-and-continuous-architecture/scenarios/), three scenarios from each film (`scenarios/#film-4` opens on one film's). Each film's Pause and think questions open its own lab, and each lab plays a chapter of its film.

- **The engine** is `site/assets/ai-and-continuous-architecture/learn.js` and `learn.css`. Every lab is a sort: cards dealt one at a time, each into its box, with why before the next. Its picture gives each box a row, and each card flies to its row as it's placed, through the wrong row first when the first pick was wrong. Every scenario is a choice, with a picture of its situation that shows how it ends once it's answered. The pictures are drawn with the films' own parts (glass, paper, the agent's orb, the stamped brick), from *Every change, checked*'s player (the series' `bundle` in `site-tools/build_series.py`), which has them all.
- **The words** are in `learn.en.js` and `learn.es.js`, with the same keys, ids, numbers and answer places. Every word a picture draws comes from them. The Spanish follows the films' Spanish captions: informar, redactar, verificar, ejecutar; un gestor de facturación, quien dirige comercialización; la puerta de enlace; público, interno, confidencial, restringido; comprobaciones, recorrido, lo que está en marcha.
- **Answers spread.** A lab's cards and a scenario's options show in the order the words write them, so the words spread them: no lab's cards go box by box, the scenarios' right answers are six in each place, and every option has the same detail as the others, in both languages.
- **Progress** stays in the visitor's browser, under `ld-ai-and-continuous-architecture`: `visited` (the labs) and `quiz` (the scenarios, numbered by film and place: 41 is the first of *A first draft, not a blank page*).
- **Checks.** `site-tools/check_site.py` checks that both languages have the same labs and scenarios, each lab on one of its film's chapters and each scenario on a lab, with the answers spread and the options of like length. `site-tools/smoke.py --only series-learn` opens every lab from its link and plays it through at 320 px in both languages, with `site-tools/smoke/ai-and-continuous-architecture.js`, then answers every scenario.
- **Each film's part.** A film's lab and its three scenarios are in both files, numbered by film (61 to 63 are *Kept alive*'s, added with it), each lab on the chapter it plays, and the film's Pause and think questions open that lab. After a change to the words, run `python site-tools/build_series.py`.
