# Data that moves

*The first series of the module Modern data basics.*

How data moves between applications today, and what still needs people. Linh Nguyen's tutoring contract is born in the HR system, payroll pays her every second Thursday, and Finance asks what casual teaching costs. Three films, light on purpose, at the level of architecture: moving is easy, agreeing is the work (managed connectors and federation in, mirrors out, and the contract at each interface); hot, warm, cold (how fresh each kind of data must be, and where it lives); and one copy, one platform (transactional and analytical work on one copy of the data, governed once). Each film shows the idea once in Databricks and hands over to the official docs. *Data as software* follows. This folder also holds the plan for the whole module, in the [proposal](proposal.md).

**Status:** agreed on 5 November 2026; the films are being made, one at a time, in order, and appear in the table below as each one is out. On the site, the series will sit under the topic *Modern data basics*, right after *Data modelling*, at `data-that-moves/`, once its opening film is out, and the topic appears with it.

## The films

<!-- films: made by site-tools/build_series.py's readme() -->
| Film | Topic | Length | Chapters | Pause and think | Script |
|---|---|---|---|---|---|
| [Moving is easy, agreeing is the work](https://data.learn-all.org/data-that-moves/moving-is-easy/) | Moving data today | 7 min | 5 | 3 questions | [script](1-moving-is-easy/script.md) · [source](1-moving-is-easy/source/README.md) |
<!-- /films -->

## The look and the sound

- **The intro's platform map, up close**, assumed on 5 November 2026 for the author to review (the module's *Decided* table, in [`../data-that-moves/proposal.md`](../data-that-moves/proposal.md)): the dark navy map of *The Inner Life of Data*, drawn near enough to work in, with people drawn to the agent films' rules and lit for the dark. The opening film's thread builds the module's kit in `shared/` here, which every film of the module bundles as it is. Every word is at least 28 px in the 1920-pixel frame and none sits under the captions; colour means the same in every film; people have an adult's proportions and one three-quarter head, with their arms down; and the camera glides in one room and cuts only between rooms.
- **Its own sound in each film.** A lead instrument the site doesn't have, reserved for each film. Music under the opening story, then only now and then, at a chapter's turn or under a moment on screen; nothing loops, trembles or pulses, except an urgent pulse where a story turns to an error or a rush.

## How the films are made

Like the site's other series, each film is generated from code, with the engine, components, fonts and voice of *The Inner Life of Data*, *A Sharper Sketch*'s scenes and *From words to data*'s tools, and checked with the governance and agent films' checks (`twice.py`, `steady.py`, `jump.py`, `edges.py`, `legible.py`, `quiet.py` with `held.py`). The module's look and people come from the kit its opening film sets up, as the module's *Decided* table records. A film keeps its own pictures and helpers in its own source. The example project, [`../analytics-engineering/project/`](../analytics-engineering/project/), is where the data story happens: what a film shows in dbt comes from it, and what a film needs that the project lacks is added to it in place. Each film's page links the official docs it points to.
