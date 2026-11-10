# Quality as a habit

*The second series of the module Data quality.*

Keeping data good, and making it better. Every November, two people spend three weeks fixing the graduation list's names by hand, in a copy, and every year the same names come back wrong. Four films: *The hidden factory* (count the work spent fixing data by hand, then fix where errors are born); *Report, fix, tell* (answer every report, fix it at the source, and tell the person who reported it); *Read by an agent* (describe data for a reader who can't ask); and *Small, every week* (one small change a week, measured, then kept). *Fit for use* comes before it. The plan for the module is in [`../fit-for-use/proposal.md`](../fit-for-use/proposal.md); this series' own part is in its [proposal](proposal.md).

**Status:** set up on 5 November 2026, on assumptions the author reviews later; the films are being made, one at a time, in order, each marked draft on the site, and appear in the table below as each one is out. On the site, the series sits under the topic *Data quality*, after *Fit for use*, at `quality-as-a-habit/`, once its opening film is out.

## The films

<!-- films: made by site-tools/build_series.py's readme() -->
| Film | Topic | Length | Chapters | Pause and think | Script |
|---|---|---|---|---|---|
<!-- /films -->

## The look and the sound

- **The quality bench**, the module's look, assumed on 5 November 2026 for the author to review (the module's *Decided* table, in [`../fit-for-use/proposal.md`](../fit-for-use/proposal.md)). The kit goes in `films/fit-for-use/shared/`, and this series bundles it as it is.
- **Its own sound in each film.** A lead instrument the site doesn't have, reserved for each film. Music under the opening story, then only now and then; nothing loops, trembles or pulses, except an urgent pulse where a story turns to an error or a rush.

## How the films are made

Like the site's other series, each film is generated from code, with the engine, components, fonts and voice of *The Inner Life of Data*, *A Sharper Sketch*'s scenes, *From words to data*'s tools and the agent films' kit, and checked with the governance and agent films' checks (`twice.py`, `steady.py`, `jump.py`, `edges.py`, `legible.py`, `quiet.py` with `held.py`). A film keeps its own pictures and helpers in its own source. The example project, [`../analytics-engineering/project/`](../analytics-engineering/project/), is where the data story happens. Each film's page links the official docs and standards it points to.
