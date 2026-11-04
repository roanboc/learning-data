# Agents at work on data

*The second series of the module AI agents in data work.*

Jun Park's agent now works on the census-day count, the number the university reports to the government. Six films show how agents do data work well: what the agent reads and who writes it, skills and workflows, tools with the fewest rights, memory the whole team shares, deciding how the result will be checked before the agent starts, and the ways it goes wrong. They name no product. The last three show it on Databricks: working with agents on the platform, why Unity Catalog and Unity Gateway govern them, and the team's context and memory, governed like any data. *What an agent is* comes before it; *From helper to colleague* follows. The plan for this series is in the [proposal](proposal.md).

**Status:** planned on 4 November 2026; the films are being made, one at a time, and appear in the table below as each one is out. On the site, the series sits under the topic *AI agents in data work*, at `agents-at-work-on-data/`, since its opening film, *Context engineering*, came out on 4 November 2026.

## The films

<!-- films: made by site-tools/build_series.py's readme() -->
| Film | Topic | Length | Chapters | Pause and think | Script |
|---|---|---|---|---|---|
| [Context engineering](https://data.learn-all.org/agents-at-work-on-data/context-engineering/) | What an agent reads | 6½ min | 7 | 3 questions | [script](1-context-engineering/script.md) · [source](1-context-engineering/source/README.md) |
| [Skills and workflows](https://data.learn-all.org/agents-at-work-on-data/skills-and-workflows/) | Playbooks for agents | 7½ min | 7 | 3 questions | [script](2-skills-and-workflows/script.md) · [source](2-skills-and-workflows/source/README.md) |
| [Plan, define the check, do, check](https://data.learn-all.org/agents-at-work-on-data/plan-check-do-check/) | The work cycle | 7½ min | 8 | 4 questions | [script](5-plan-check-do-check/script.md) · [source](5-plan-check-do-check/source/README.md) |
<!-- /films -->

## The look and the sound

The module's, from [`../what-an-agent-is/shared/`](../what-an-agent-is/shared/):

- **The white lab made Nordic.** A pale grey marble wall with soft veins over a pale oak floor, daylight from the right, and matte off-white cards. The model is a ceramic sphere with a band of violet light; the loop, a bent oak ring; the hands, pale robot arms with oak joints; drafts go in an oak sandbox, and production sits behind a pane of glass. Openings from other places and times are drawn in the same matte style, dressed for their time. No watercolour, and no film grain.
- **Colour means something.** Blue is tools and structure, violet the model thinking, orange data coming back, green a check that passes, amber a check that fails or a loop.
- **People with an adult's proportions**, from the waist up, with one three-quarter head and their arms down: the university's data team from the earlier series, and the people of each film's story.
- **Made to read on a phone.** Text is at least 28 px in the 1920-pixel frame, and none sits under the captions.
- **Its own sound in each film.** Music under the opening story, then only now and then, at a chapter's turn or under a moment on screen; nothing loops or pulses, except an urgent pulse where a story turns to an error or a rush.

## How the films are made

Like *What an agent is*, each film is generated from code, with the engine, components, fonts and voice of *The Inner Life of Data*, *A Sharper Sketch*'s scenes and *From words to data*'s tools. The module's look, people and checks come from [`../what-an-agent-is/shared/`](../what-an-agent-is/shared/), used as it is: each film's tools are three-line runners that point there, as [its README](../what-an-agent-is/shared/README.md) says. A film keeps its own pictures and helpers in its own source. The code and files the films show come from the example project, [`../analytics-engineering/project/`](../analytics-engineering/project/).
