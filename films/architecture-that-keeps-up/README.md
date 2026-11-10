# Architecture that keeps up

*The third series of the module Data management.*

The product owner's side of a data manager's job, borrowed from architecture. Three films: *Services with customers* (run the services you manage as a business, with suppliers and customers; then design every layer, from strategy to technology, for them); *One map, in the repo* (the architecture kept in a git repository as one source of truth, updated with every change, everything else made from it); and *A path for every provider* (a preferred platform architecture, and a decision tree for every provider who can't reach it, because value comes first). *Making the case* comes before it, *Small steps, measured* after. The plan for the module is in [`../a-plan-in-ninety-days/proposal.md`](../a-plan-in-ninety-days/proposal.md); this series' own part is in its [proposal](proposal.md).

**Status:** set up on 10 November 2026 from the author's advice for technical managers, on assumptions the author reviews later; the films are being made, one at a time, each marked draft on the site, and appear in the table below as each one is out. On the site, the series sits under the topic *Data management*, after *Making the case*, at `architecture-that-keeps-up/`, once its opening film is out.

## The films

<!-- films: made by site-tools/build_series.py's readme() -->
| Film | Topic | Length | Chapters | Pause and think | Script |
|---|---|---|---|---|---|
| [Services with customers](https://data.learn-all.org/architecture-that-keeps-up/services-with-customers/) | Services and customers | 7 min | 6 | 3 questions | [script](1-services-with-customers/script.md) · [source](1-services-with-customers/source/README.md) |
| [One map, in the repo](https://data.learn-all.org/architecture-that-keeps-up/one-map/) | One source of truth | 7½ min | 7 | 3 questions | [script](2-one-map-in-the-repo/script.md) · [source](2-one-map-in-the-repo/source/README.md) |
| [A path for every provider](https://data.learn-all.org/architecture-that-keeps-up/a-path-for-every-provider/) | Data from every provider | 8 min | 7 | 3 questions | [script](3-a-path-for-every-provider/script.md) · [source](3-a-path-for-every-provider/source/README.md) |
<!-- /films -->

## The look and the sound

- **One look with the leading data people module**, the module's look, assumed on 5 November 2026 for the author to review (the module's *Decided* table, in [`../a-plan-in-ninety-days/proposal.md`](../a-plan-in-ninety-days/proposal.md)). That module's kit, `films/the-new-skills/shared/`, draws this series' films as it is.
- **Its own sound in each film.** A lead instrument the site doesn't have, reserved for each film. Music under the opening story, then only now and then; nothing loops, trembles or pulses, except an urgent pulse where a story turns to an error or a rush.

## How the films are made

Like the site's other series, each film is generated from code, with the engine, components, fonts and voice of *The Inner Life of Data*, *A Sharper Sketch*'s scenes, *From words to data*'s tools and the agent films' kit, and checked with the governance and agent films' checks (`twice.py`, `steady.py`, `jump.py`, `edges.py`, `legible.py`, `quiet.py` with `held.py`). A film keeps its own pictures and helpers in its own source. Where a film shows data work, the example project, [`../analytics-engineering/project/`](../analytics-engineering/project/), is where it happens. Each film's page links the guides and standards it points to.
