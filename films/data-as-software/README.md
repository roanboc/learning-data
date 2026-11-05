# Data as software

*The second series of the module Modern data basics.*

Running a data platform, kept light because it's no longer new. Payroll's export to Finance ran for years as a script on one person's laptop. Two films: scripts became software (data work versioned, reviewed, tested and deployed the same way every time, with dbt, Git and Declarative Automation Bundles), and a platform that watches itself (an agent that watches jobs, pipelines and tables, finds the cause of a failure and proposes a fix a person approves). *Data that moves* comes before it; *From tables to decisions* follows. The plan for the module is in [`../data-that-moves/proposal.md`](../data-that-moves/proposal.md); this series' own part is in its [proposal](proposal.md).

**Status:** agreed on 5 November 2026; the films are being made, one at a time, in order, and appear in the table below as each one is out. On the site, the series will sit under the topic *Modern data basics*, at `data-as-software/`, once its opening film is out.

## The films

<!-- films: made by site-tools/build_series.py's readme() -->
| Film | Topic | Length | Chapters | Pause and think | Script |
|---|---|---|---|---|---|
<!-- /films -->

## The look and the sound

- **The look is the author's to choose**, asked on 5 November 2026: the intro's platform map up close (the recommendation), the agent films' marble and oak, or a look of its own. His choice is in the module's *Decided* table, in [`../data-that-moves/proposal.md`](../data-that-moves/proposal.md). Whatever it is, every word is at least 28 px in the 1920-pixel frame and none sits under the captions; colour means the same in every film; people have an adult's proportions and one three-quarter head, with their arms down; and the camera glides in one room and cuts only between rooms.
- **Its own sound in each film.** A lead instrument the site doesn't have, reserved for each film. Music under the opening story, then only now and then, at a chapter's turn or under a moment on screen; nothing loops, trembles or pulses, except an urgent pulse where a story turns to an error or a rush.

## How the films are made

Like the site's other series, each film is generated from code, with the engine, components, fonts and voice of *The Inner Life of Data*, *A Sharper Sketch*'s scenes and *From words to data*'s tools, and checked with the governance and agent films' checks (`twice.py`, `steady.py`, `jump.py`, `edges.py`, `legible.py`, `quiet.py` with `held.py`). The module's look and people come from the kit *Data that moves* sets up, used as it is. A film keeps its own pictures and helpers in its own source. The example project, [`../analytics-engineering/project/`](../analytics-engineering/project/), is where the data story happens: what a film shows in dbt comes from it, and what a film needs that the project lacks is added to it in place. Each film's page links the official docs it points to.
