# Business architecture for data

*The second series of the topic Enterprise architecture, after* The map before the data.

What the business owns about its data: the concepts, their owners, the processes they're born in, and the rules and quality the business expects. What the four new architecture series share is in this folder's [proposal](proposal.md), with this series' own plan. *The map before the data* comes before it, *Data architecture* after.

**Status:** set up on 11 November 2026 from the proposal the author confirmed that day; the films are being made, one at a time, and appear in the table below as each one is out. On the site, the series sits under the topic *Enterprise architecture*, at `business-architecture-for-data/`, once its opening film is out. The films carry no draft label: the author discussed them in detail before any was made.

## The films

<!-- films: made by site-tools/build_series.py's readme() -->
| Film | Topic | Length | Chapters | Pause and think | Script |
|---|---|---|---|---|---|
| [What the business owns](https://data.learn-all.org/business-architecture-for-data/what-the-business-owns/) | Who owns what | 7 min | 9 | 3 questions | [script](1-what-the-business-owns/script.md) · [source](1-what-the-business-owns/source/README.md) |
| [What the business needs to know](https://data.learn-all.org/business-architecture-for-data/what-the-business-needs-to-know/) | The business's concepts | 7 min | 9 | 3 questions | [script](2-what-the-business-needs-to-know/script.md) · [source](2-what-the-business-needs-to-know/source/README.md) |
| [Who creates it, who owns it](https://data.learn-all.org/business-architecture-for-data/who-creates-it-who-owns-it/) | Owners and stewards | 7 min | 9 | 3 questions | [script](3-who-creates-it-who-owns-it/script.md) · [source](3-who-creates-it-who-owns-it/source/README.md) |
| [Processes, as deep as data needs](https://data.learn-all.org/business-architecture-for-data/processes-as-deep-as-data-needs/) | Processes and their levels | 7 min | 9 | 3 questions | [script](4-processes-as-deep-as-data-needs/script.md) · [source](4-processes-as-deep-as-data-needs/source/README.md) |
<!-- /films -->

## The look and the sound

- **The look of *The map before the data*:** paper drafts on a wall, the confirmed model in glass, the six layers in their colours, from [`../enterprise-architecture/shared/`](../enterprise-architecture/shared/), with the same people and the same energy utility.
- **One true story across the series**, told in the series' own drawing style, each film opening on its part of it.
- **The series' own components** in [`shared/src/ba.js`](shared/src/ba.js): the qanat cut away, the village and its fields, the desert from above, the story's people as plain silhouettes, the ticket and its counts, and the data practice on the map, which each film adds to.
- **Its own sound in each film.** Each film takes its own instruments, under the topic's rules for its palettes: *What the business owns* plays a bass viol, bowed and plucked; *What the business needs to know*, a clavichord and an oboe. The series' mark, D and A and then the F sharp between them, comes back in every film. Music under the opening story, then only now and then; nothing loops, trembles or pulses, except an urgent pulse where a story turns to an error or a rush.

## How the films are made

Like *The map before the data*, each film is generated from code, with the engine, components, fonts and voice of *The Inner Life of Data*, *From words to data*'s tools and that series' own components. A film keeps its own pictures and helpers in its own source.
