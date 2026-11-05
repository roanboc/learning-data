# What an agent is

*The first series of the module AI agents in data work.*

Jun Park builds the university's data project, and this term an agent works beside him. Before any rule or product, ten films ask how today's models came about, what they took from the brain, what an agent is, what agents are like to work with, why that means governing them, and what one agent, and many, tell us about ourselves. The series names no product. *Agents at work on data* follows, then the journey from helper to colleague, and teams of people and agents. The plan for this series is in the [proposal](proposal.md).

**Status:** planned on 3 November 2026, and all nine films made by 4 November; a tenth, *Borrowed from the brain*, which the author asked for on 4 November, came in second on 5 November. They're in the table below and [on the site](https://data.learn-all.org/what-an-agent-is/), each with Pause and think questions. The series' look and tools are in [`shared/`](shared/). Labs and scenarios will come later. On the site, it sits under the topic *AI agents in data work*, at `what-an-agent-is/`.

## The films

<!-- films: made by site-tools/build_series.py's readme() -->
| Film | Topic | Length | Chapters | Pause and think | Script |
|---|---|---|---|---|---|
| [Decades in the making](https://data.learn-all.org/what-an-agent-is/decades-in-the-making/) | How we got here | 6½ min | 8 | 3 questions | [script](1-decades-in-the-making/script.md) · [source](1-decades-in-the-making/source/README.md) |
| [Borrowed from the brain](https://data.learn-all.org/what-an-agent-is/borrowed-from-the-brain/) | Nerve cells and models | 9 min | 9 | 3 questions | [script](2-borrowed-from-the-brain/script.md) · [source](2-borrowed-from-the-brain/source/README.md) |
| [A model, reasoning, hands and a loop](https://data.learn-all.org/what-an-agent-is/a-model-reasoning-hands-and-a-loop/) | An agent, part by part | 7 min | 9 | 3 questions | [script](3-a-model-reasoning-hands-and-a-loop/script.md) · [source](3-a-model-reasoning-hands-and-a-loop/source/README.md) |
| [It feels like understanding](https://data.learn-all.org/what-an-agent-is/it-feels-like-understanding/) | Trusting an agent | 7 min | 7 | 3 questions | [script](4-it-feels-like-understanding/script.md) · [source](4-it-feels-like-understanding/source/README.md) |
| [More than a junior](https://data.learn-all.org/what-an-agent-is/more-than-a-junior/) | Supervising agents | 7 min | 7 | 3 questions | [script](5-more-than-a-junior/script.md) · [source](5-more-than-a-junior/source/README.md) |
| [Minds that change](https://data.learn-all.org/what-an-agent-is/minds-that-change/) | Memory and evidence | 7 min | 6 | 3 questions | [script](6-minds-that-change/script.md) · [source](6-minds-that-change/source/README.md) |
| [Ethics we can't read, accountability it can't hold](https://data.learn-all.org/what-an-agent-is/ethics-and-accountability/) | Ethics and accountability | 8½ min | 8 | 3 questions | [script](7-ethics-and-accountability/script.md) · [source](7-ethics-and-accountability/source/README.md) |
| [Why we govern them](https://data.learn-all.org/what-an-agent-is/why-we-govern-them/) | Governing agents | 7½ min | 8 | 3 questions | [script](8-why-we-govern-them/script.md) · [source](8-why-we-govern-them/source/README.md) |
| [What they tell us about ourselves](https://data.learn-all.org/what-an-agent-is/what-they-tell-us-about-ourselves/) | Agents and the mind | 9½ min | 8 | 3 questions | [script](9-what-they-tell-us-about-ourselves/script.md) · [source](9-what-they-tell-us-about-ourselves/source/README.md) |
| [Many agents, and what emerges](https://data.learn-all.org/what-an-agent-is/many-agents/) | Many agents, and emergence | 7½ min | 7 | 4 questions | [script](10-many-agents/script.md) · [source](10-many-agents/source/README.md) |
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
| `shared/src/cards.js` | Cards with and without a tail, an answer with its evidence attached, pills, labels, icons, the kicker, the series' mark, and the title and end cards |
| `shared/src/finish.js`, `page.html` | What a film needs before it starts (the fonts, each place painted once), the video's finishing pass (motion blur, no grain), and the standalone player page |
| `shared/tools/` | Where everything lives (`lang.py`), what a film is made of (`build.py`), its checks (`check.py`, and `quiet.py`, which runs the governance films' sound check), `run.py`, which runs these and *From words to data*'s other tools on a film, and `sketch.py`, to try a frame before a film exists |
