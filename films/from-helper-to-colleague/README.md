# From helper to colleague

*The third series of the module AI agents in data work.*

How an agent becomes a colleague: designed into the university's enterprise architecture before it gets any rights. Planning's tickets, drafted by Jun Park's helper on his own sign-in, pass to the planning agent, owned by Clara Jensen, with a place on the map: the work it serves, its role, its owner, its stage for each kind of task, and rights that come from its role's steps. Four films show the ideas, with no product: five stages, not a switch; borrowed rights; a place on the map; and rights that follow the role. Three show them in Databricks, GitHub and dbt: the map, enforced; every change through review; and a mandate, written and enforced. *Agents at work on data* comes before it; *A colleague that isn't a person* follows. The plan for this series is in the [proposal](proposal.md).

**Status:** version 2 of the plan, approved on 5 November 2026; the films are being made, one at a time, in order, and appear in the table below as each one is out. On the site, the series will sit under the topic *AI agents in data work*, at `from-helper-to-colleague/`, once its opening film is out.

## The films

<!-- films: made by site-tools/build_series.py's readme() -->
| Film | Topic | Length | Chapters | Pause and think | Script |
|---|---|---|---|---|---|
| [A place on the map](https://data.learn-all.org/from-helper-to-colleague/a-place-on-the-map/) | Agents on the map | 9 min | 7 | 3 questions | [script](3-a-place-on-the-map/script.md) · [source](3-a-place-on-the-map/source/README.md) |
<!-- /films -->

## The look and the sound

The module's, from [`../what-an-agent-is/shared/`](../what-an-agent-is/shared/):

- **The white lab made Nordic.** A pale grey marble wall with soft veins over a pale oak floor, daylight from the right, and matte off-white cards. The model is a ceramic sphere with a band of violet light; the loop, a bent oak ring; the hands, pale robot arms with oak joints; drafts go in an oak sandbox, and production sits behind a pane of glass. Openings from other places and times are drawn in the same matte style, dressed for their time. No watercolour, and no film grain.
- **Colour means something.** Blue is tools and structure, violet the model thinking, orange data coming back, green a check that passes, amber a check that fails or a loop.
- **Agents told apart by name.** Several agents appear in this series, and they look alike: each has its name and its badge, never a colour of its own, and is never in two places at once.
- **People with an adult's proportions**, from the waist up, with one three-quarter head and their arms down: the university's data team from the earlier series, and the people of each film's story.
- **Made to read on a phone.** Text is at least 28 px in the 1920-pixel frame, and none sits under the captions.
- **Its own sound in each film.** Music under the opening story, then only now and then, at a chapter's turn or under a moment on screen; nothing loops or pulses, except an urgent pulse where a story turns to an error or a rush.

## How the films are made

Like the module's earlier series, each film is generated from code, with the engine, components, fonts and voice of *The Inner Life of Data*, *A Sharper Sketch*'s scenes and *From words to data*'s tools. The module's look, people and checks come from [`../what-an-agent-is/shared/`](../what-an-agent-is/shared/), used as it is: each film's tools are three-line runners that point there, as [its README](../what-an-agent-is/shared/README.md) says. A film keeps its own pictures and helpers in its own source. The example project, [`../analytics-engineering/project/`](../analytics-engineering/project/), is the baseline: the series' agents work together in it, the code and files the films show come from it, and what a film needs that the project lacks is added to it in place. How the project is built is told in *In the weeds of data crafting*, [`../analytics-engineering/`](../analytics-engineering/): the films name its films and don't teach them again, and every film page links it.
