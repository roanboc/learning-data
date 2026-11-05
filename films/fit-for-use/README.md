# Fit for use

*The first series of the module Data quality.*

What "good" means for data, and how to measure it. The graduation list says who graduates, at which ceremony, with which award, and the name printed on each degree certificate; it passed all its checks, and still 41 certificates were printed again in December 2025. Four films: *Good enough for what?* (quality is fitness for a use: one list, four uses, a level for each); *A hundred records* (look at the data, and let the platform profile it, before writing a check); *Valid isn't true* (a check says a value is allowed; only a reference says it's true); and *Late is wrong too* (agree how fresh data must be, and always say how old it is). *Quality as a habit* follows. This folder also holds the plan for the whole module, in the [proposal](proposal.md), and the module's kit, in `shared/`, once its own pull request is merged.

**Status:** set up on 5 November 2026, on assumptions the author reviews later; the films are being made, one at a time, in order, each marked draft on the site, and appear in the table below as each one is out. On the site, the series sits under the topic *Data quality*, after *When things go wrong*, at `fit-for-use/`, once its opening film is out.

## The films

<!-- films: made by site-tools/build_series.py's readme() -->
| Film | Topic | Length | Chapters | Pause and think | Script |
|---|---|---|---|---|---|
<!-- /films -->

## The look and the sound

- **The quality bench**, assumed on 5 November 2026 for the author to review (the module's *Decided* table, in [proposal.md](proposal.md)): the data team's workroom, a warm stone wall and a long bench of dark speckled granite under a brass lamp, with records as cream index cards, checks as gauges and tolerance bands, and results as manila tags (green passes, amber holds for a person, red stops, grey wasn't checked; brass is what good means for a use, steel blue a measure). The Great Hall is where the ceremonies happen. People, the camera and words are the agent films' kit, unchanged: every word at least 28 px in the 1920-pixel frame and none under the captions, people with an adult's proportions and one three-quarter head, arms down, and a camera that glides in one room and cuts only between rooms. The module's kit goes in `shared/` here, in a pull request of its own, and every film of both series bundles it as it is.
- **Its own sound in each film.** A lead instrument the site doesn't have, reserved for each film. Music under the opening story, then only now and then, at a chapter's turn or under a moment on screen; nothing loops, trembles or pulses, except an urgent pulse where a story turns to an error or a rush.

## How the films are made

Like the site's other series, each film is generated from code, with the engine, components, fonts and voice of *The Inner Life of Data*, *A Sharper Sketch*'s scenes, *From words to data*'s tools and the agent films' kit, and checked with the governance and agent films' checks (`twice.py`, `steady.py`, `jump.py`, `edges.py`, `legible.py`, `quiet.py` with `held.py`). A film keeps its own pictures and helpers in its own source. The example project, [`../analytics-engineering/project/`](../analytics-engineering/project/), is where the data story happens: what a film shows in dbt comes from it, and what a film needs that the project lacks is added to it in place. Each film's page links the official docs and standards it points to.
