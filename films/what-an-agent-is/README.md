# What an agent is

*The first series of the module AI agents in data work.*

Jun Park builds the university's data project, and this term an agent works beside him. Before any rule or product, nine films ask how today's models came about, what an agent is, what agents are like to work with, why that means governing them, and what one agent, and many, tell us about ourselves. The series names no product. *Agents at work on data* follows, then the journey from helper to colleague, and teams of people and agents. The plan for this series is in the [proposal](proposal.md).

**Status:** planned on 3 November 2026. The series' look and tools are in [`shared/`](shared/), and its films are being made, one at a time, in order; each appears in the table below and on the site once it's out, at `what-an-agent-is/`, under the topic *AI agents in data work*.

## The films

<!-- films: made by site-tools/build_series.py's readme() -->
| Film | Topic | Length | Chapters | Pause and think | Script |
|---|---|---|---|---|---|
<!-- /films -->

## The look and the sound

- **The white lab made Nordic.** A pale grey marble wall with soft veins over a pale oak floor, daylight from the right, and matte off-white cards. The model is a ceramic sphere with a band of violet light; the loop, a bent oak ring; the hands, pale robot arms with oak joints. Openings from other places and times are drawn in the same matte style, dressed for their time. No watercolour, and no film grain.
- **Colour means something.** Blue is tools and structure, violet the model thinking, orange data coming back, green a check that passes, amber a check that fails or a loop.
- **People with an adult's proportions**, from the waist up: the university's data team from the earlier series, and the people of each film's story.
- **Made to read on a phone.** Text is at least 28 px in the 1920-pixel frame, and none sits under the captions.
- **Its own sound in each film.** Music under the opening story, then only at a chapter's turn or under a moment on screen; nothing loops or pulses, except an urgent pulse where a story turns to an error.

## How the films are made

Like the other series, each film is generated from code, with the engine, components, fonts and voice of *The Inner Life of Data*, *A Sharper Sketch*'s scenes and *From words to data*'s tools. What the module adds is in [`shared/`](shared/), which its later series bundle too; [`shared/README.md`](shared/README.md) says how a film uses it.

| File | What it holds |
|---|---|
| `shared/src/kit.js` | The module's colours and what they mean, words drawn live (so the legibility check measures them), timing and easing, the camera and its cuts, places painted once, and the matte shapes everything is drawn with |
| `shared/src/room.js` | The lab: the marble wall, the oak floor, the window's light, by day and by night (with a floor lamp); a desk, a screen and a framed picture on the wall |
| `shared/src/people.js` | The cast of eight, with an adult's proportions: their poses (pointing, explaining, holding, at a desk, thinking), breathing, blinking and talking; and people of other times, in their own clothes |
| `shared/src/agent.js` | The model, its ring and the steps of its loop, its hands, the tools they reach, the data that comes back, and a check's verdict |
| `shared/src/cards.js` | Cards with and without a tail, pills, labels, icons, the kicker, the series' mark, and the title and end cards |
| `shared/src/finish.js`, `page.html` | What a film needs before it starts (the fonts, each place painted once), the video's finishing pass (motion blur, no grain), and the standalone player page |
| `shared/tools/` | Where everything lives (`lang.py`), what a film is made of (`build.py`), its checks (`check.py`, and `quiet.py` for the sound), `run.py`, which runs these and *From words to data*'s other tools on a film, and `sketch.py`, to try a frame before a film exists |
