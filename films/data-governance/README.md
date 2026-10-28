# Governance principles

*The first of three series on data governance.*

Yusuf Demir starts as the university's data governance lead. He inherits a shelf of thirty-four policies, a maturity score of 2.1 out of 5, a chart with half its names still to be confirmed, and a brief: fix governance before the next submission to the government. The same week, two reports disagree on how many awards were conferred. Over ten films, he takes the binder off the shelf, one kind of policy at a time, and asks every line where it runs: who decides, one trusted glossary in place of many, who may see it, rules that run, fixes at the source, change without surprises, products with owners, an agent that checks, and the people who teach it all. Two more series follow: in *Governance on the map* ([`../governance-on-the-map/`](../governance-on-the-map/)), he and Noor, the data architect, design governance as a capability that lasts, with the services it offers, who does what end to end, and where each piece lives; and *Governance you can use* ([`../governance-in-practice/`](../governance-in-practice/)) builds each piece with dbt and Databricks. The plan for all three is in the [proposal](proposal.md).

**Status:** the prologue, *The same problem, everywhere*, and the films in the table below are built and [on the site](https://data.learn-all.org/data-governance/), each with Pause and think questions; the rest are being made. The prologue tells the real history behind the series: why data management got a body of knowledge, the DMBOK, why governance is at its centre, and why it still matters, with its additions for ethics and AI. Labs and scenarios will come later. On the site, the series sits under the topic *Data governance*, with the two that follow it.

## The films

<!-- films: made by site-tools/build_series.py's readme() -->
| Film | Topic | Length | Chapters | Pause and think | Script |
|---|---|---|---|---|---|
| [The same problem, everywhere](https://data.learn-all.org/data-governance/the-same-problem-everywhere/) | Where governance comes from | 5 min | 8 | 3 questions | [script](0-the-same-problem-everywhere/script.md) · [source](0-the-same-problem-everywhere/source/README.md) |
| [Off the shelf](https://data.learn-all.org/data-governance/off-the-shelf/) | Why data governance | 5½ min | 9 | 4 questions | [script](1-off-the-shelf/script.md) · [source](1-off-the-shelf/source/README.md) |
| [Who decides](https://data.learn-all.org/data-governance/who-decides/) | Decision rights | 5½ min | 10 | 3 questions | [script](2-who-decides/script.md) · [source](2-who-decides/source/README.md) |
| [One word, one home](https://data.learn-all.org/data-governance/one-word-one-home/) | One meaning for each word | 6 min | 8 | 4 questions | [script](3-one-word-one-home/script.md) · [source](3-one-word-one-home/source/README.md) |
| [Who may see it](https://data.learn-all.org/data-governance/who-may-see-it/) | Who may see what | 6 min | 8 | 3 questions | [script](4-who-may-see-it/script.md) · [source](4-who-may-see-it/source/README.md) |
| [Rules that run](https://data.learn-all.org/data-governance/rules-that-run/) | Data quality rules | 6 min | 10 | 3 questions | [script](5-rules-that-run/script.md) · [source](5-rules-that-run/source/README.md) |
| [Fixed where it starts](https://data.learn-all.org/data-governance/fixed-where-it-starts/) | Fixing data at the source | 6 min | 8 | 3 questions | [script](6-fixed-where-it-starts/script.md) · [source](6-fixed-where-it-starts/source/README.md) |
| [An agent that checks](https://data.learn-all.org/data-governance/an-agent-that-checks/) | AI for governance | 6½ min | 8 | 3 questions | [script](9-an-agent-that-checks/script.md) · [source](9-an-agent-that-checks/source/README.md) |
| [Teachers of data](https://data.learn-all.org/data-governance/teachers-of-data/) | Getting people to take part | 7 min | 8 | 3 questions | [script](10-teachers-of-data/script.md) · [source](10-teachers-of-data/source/README.md) |
<!-- /films -->

## The look and the sound

- **Watercolour, in the university's own places.** The series is painted like the series on master and reference data, with a pencil line and watercolour on paper, so the two look like one university. It shows only the university's own places: the campus, Yusuf's office, the floor of offices behind glass where the work is done (Planning, the registrar's office, data governance in the middle, the data team, the platform team), each team's room, and close-ups of their boards, screens and papers. Ideas are shown as people doing things in places, with few diagrams. The past is painted the same way, in its own time, with its year in the corner: in *Off the shelf*, an operating room in 2008. Toy town, chosen first, was dropped on 17 October 2026: it showed homes and places that weren't the university's.
- **Colour means something.** Behind each person, a soft wash of their side: gold for the business side, cyan for the technical side, warm umber for the people of the past. Gold is governance's decisions: the cards, pins and rings that mark where a decision enters the work. Green is what runs in the work, grey what can go, and red what nobody owns yet. Text is dark ink on paper, and every colour comes with a label.
- **People.** Yusuf, the new data governance lead, Mei, who owns what *award* means, and Clara, in Planning, have gold behind them; Jun, who builds the model, and Sam, who runs the platform, cyan. The people of the past wear their own time, with a warm umber wash behind them, such as the surgical team in *Off the shelf*.
- **Made to read on a phone.** Text is at least 28 px in the 1920-pixel frame, and none sits under the captions. `tools/legible.py` checks every frame, and `build.py` stops a caption that would run to three lines.
- **Its own sound.** Each film has its own palette. *Off the shelf*'s is a soft brass choir, in D for the operating room before 2008 and F major for today, and a low music box for the moments that land; the series' mark, 1-5-4-8, plays on a horn at its title and its end. Music plays under each film's opening story, then only at a chapter's turn or under a moment on screen. Nothing loops or pulses, and every effect is something on screen: a knock, paper, a pencil, a cork pin, a rubber stamp.

## How the films are made

Like the other series, each film is generated from code. The series keeps what's its own in [`shared/`](shared/):

| File | What it holds |
|---|---|
| `shared/src/rooms.js` | The colours several films share (each room's walls, award's three meanings, the classes of personal data, amber for a warning), and the university's places, in watercolour: the campus, Yusuf's office, the floor of offices behind glass, the rooms where the numbers are made, and a desk seen from above; the places the later films share (the stewards' meeting room, three desks close up, and Noor's room with her architecture map), with people sitting or standing behind a table or desk; the things on their walls and desks (binders, papers, screens, cards, pins, stamps, speech bubbles); a column's class as a chip, and the mask over a value; the data quality scorecard *Rules that run* and *Fixed where it starts* share; a camera that cuts between shots; and the title and end cards. It paints with the master and reference data series' `wash.js`, bundled as it is |
| `shared/src/people.js` | The series' people, drawn in pencil and wash with the master data series' `people.js`, bundled as it is: the cast of *When things go wrong* and *In the weeds of data crafting*, Yusuf, Clara, Anil and Marta, and the people of the past in their own clothes |
| `shared/src/finish.js` | What a film needs before it starts (the fonts, the logos, the paper, and each place, painted once), and the video's finishing pass: motion blur, with no glow and no film grain |
| `shared/src/page.html` | The standalone player page |
| `shared/tools/lang.py`, `build.py` | Where everything lives, and what a film is made of |
| `shared/tools/names.py`, `cues.py` | Checks `build.py` runs: no name declared in two files, and every moment timed to a word that is, whole, in its line. `build.py` also stops a caption that would run to three lines |
| `shared/tools/check.py` | *From words to data*'s check that every moment draws, then this series' own: each place the film paints lets the page draw again within two seconds |
| `shared/tools/run.py` | Runs a tool on a film: this series' own `lang.py`, `build.py` and `check.py`, and *From words to data*'s other tools and instruments unchanged |
