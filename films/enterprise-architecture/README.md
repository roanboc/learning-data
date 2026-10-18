# The map before the data

*A series on enterprise architecture and why it matters for data. The title is a working one.*

A new enterprise architect, Tomás, joins a publicly owned energy utility and doesn't yet know how it works, so he doesn't yet know which questions it needs to answer. Over eleven films he builds a map of it, layer by layer, from why it exists down to what runs it, and then shows what that map does for data: the questions that matter, rules with a home, a change in strategy, and a map that people and agents can read. The plan is in the [proposal](proposal.md).

**Status:** the films come out one by one, and the table below lists those [on the site](https://roanboc.github.io/learning-data/enterprise-architecture/), each with three Pause and think questions. One set of labs and scenarios covers the whole series, rather than one per film ([below](#labs-and-scenarios)). On the site, the series sits under the topic *Enterprise architecture*.

## The films

<!-- films: made by site-tools/build_series.py's readme() -->
| Film | Topic | Length | Chapters | Pause and think | Script |
|---|---|---|---|---|---|
| [Day one](https://roanboc.github.io/learning-data/enterprise-architecture/day-one/) | Why enterprise architecture | 5 min | 10 | 3 questions | [script](1-day-one/script.md) · [source](1-day-one/source/README.md) |
| [Who it serves, and how it pays](https://roanboc.github.io/learning-data/enterprise-architecture/who-it-serves/) | Customers and offerings | 5 min | 10 | 3 questions | [script](2-who-it-serves/script.md) · [source](2-who-it-serves/source/README.md) |
| [Why it moves](https://roanboc.github.io/learning-data/enterprise-architecture/why-it-moves/) | Motivation | 4½ min | 10 | 3 questions | [script](3-why-it-moves/script.md) · [source](3-why-it-moves/source/README.md) |
| [What it must be able to do](https://roanboc.github.io/learning-data/enterprise-architecture/what-it-must-do/) | Capabilities | 5½ min | 10 | 3 questions | [script](4-what-it-must-do/script.md) · [source](4-what-it-must-do/source/README.md) |
| [How value reaches people](https://roanboc.github.io/learning-data/enterprise-architecture/how-value-reaches-people/) | Value streams and processes | 6 min | 10 | 3 questions | [script](5-how-value-reaches-people/script.md) · [source](5-how-value-reaches-people/source/README.md) |
| [Who does it, and where meaning changes](https://roanboc.github.io/learning-data/enterprise-architecture/who-does-it/) | Actors, roles and domains | 6 min | 10 | 3 questions | [script](6-who-does-it/script.md) · [source](6-who-does-it/source/README.md) |
| [Today, and where it's going](https://roanboc.github.io/learning-data/enterprise-architecture/today-and-where-its-going/) | Applications, technology and the path to a target | 5 min | 10 | 3 questions | [script](7-today-and-where-its-going/script.md) · [source](7-today-and-where-its-going/source/README.md) |
| [Now the questions appear](https://roanboc.github.io/learning-data/enterprise-architecture/now-the-questions-appear/) | Decisions, questions and measures | 6 min | 11 | 3 questions | [script](8-now-the-questions-appear/script.md) · [source](8-now-the-questions-appear/source/README.md) |

For the whole series, on the site: [12 labs](https://roanboc.github.io/learning-data/enterprise-architecture/labs/) and [25 scenarios](https://roanboc.github.io/learning-data/enterprise-architecture/scenarios/), in English and Spanish, from the words in [site/assets/enterprise-architecture/](../../site/assets/enterprise-architecture/).
<!-- /films -->

## The look and the sound

- **Two materials.** Drafts are paper: canvases and sticky notes on a wall, slightly crooked. The confirmed model is glass, in the colours architects conventionally give the layers. A note that moves from the wall to the model changes material.
- **People.** Tomás, outlined in cyan (the technical side); the people who own parts of the business, outlined in gold, starting with Grace, who owns network operations, Farah, the customer advocate, and Ama, the regulatory lead.
- **Made to read on a phone.** Text is at least 28 px in the 1920-pixel frame (about 12 px on a phone held sideways), the camera moves in on the part of a canvas being talked about, and the player's captions grow as it shrinks (the shared engine does this for every film). `tools/legible.py` checks every frame.
- **Its own sound.** Nylon-string plucks and a soft flute over warm pads, a lute for the past, and its own four-note mark, rising 1-3-5-8. Nothing loops, and every effect is something appearing on screen.

## How the films are made

Like the other series, each film is generated from code. The series keeps what's its own in [`shared/`](shared/):

| File | What it holds |
|---|---|
| `shared/src/ea.js` | The series' components: its colours, title and end cards, the six layers (`slab`, `layerStack`), the wall, canvases and sticky notes (`wallBg`, `vpCanvas`, `bmCanvas`, `sticky`, `statusDot`), glass elements of the model (`archEl`, with ArchiMate's glyph for each kind, `archGlyph`, value streams' chevron, actors' stick figure, contracts, resources, plateaus and gaps included), the data rule card (`ruleCard`), labelled canvases to pin notes into (`vpCanvas2`, `VPC.where`, `BMC_AT`), and a camera that moves in on part of a picture (`focus`, `focusZ`) |
| `shared/tools/legible.py` | Checks that every piece of text on screen is large enough to read on a phone, frame by frame; text marked as decoration is skipped |
| `shared/src/people.js` | The series' people: Tomás Herrera, Grace Achieng, Farah Siddiqui and Ama Owusu, drawn like the cast of *When things go wrong* |
| `shared/src/page.html` | The standalone player page |
| `shared/tools/lang.py`, `build.py` | Where everything lives, and what a film is made of; motion and the video's finishing pass come from *In the weeds of data crafting* |
| `shared/tools/run.py` | Runs a tool on a film: this series' own `lang.py` and `build.py`, and *From words to data*'s other tools and instruments unchanged |

## Labs and scenarios

One set for the whole series, on two pages: [*Take it apart*](https://roanboc.github.io/learning-data/enterprise-architecture/labs/), twelve labs, one for each film and a twelfth on ArchiMate 4, and [*Make the call*](https://roanboc.github.io/learning-data/enterprise-architecture/scenarios/), 25 scenarios, each naming its film (`scenarios/#film-3` opens on one film's). Each film's Pause and think questions open its own lab. Films 9 to 11 are being made: their labs and scenarios follow the [approved draft](proposal.md#9-rules-with-a-home), say the film is coming, and get their chapter (`chapter`, now `null`) when the film is on the site.

- **The engine** is `site/assets/enterprise-architecture/learn.js` and `learn.css`. It draws with the series' own components, from *Now the questions appear*'s player (`bundle` in the series' entry in `site-tools/build_series.py`), and has seven kinds of lab: `deal` (deal cards onto a picture: the layers, a canvas, a chain, systems under capabilities, the skipper's test, ArchiMate 4), `change` (survive a restructure), `night` (the storm night's rule and its facts), `gate` (what crosses the wall), `rule` (a rule with a home, and a case that must fail), `walk` (a change walked down the layers) and `navigator` (the map's own checks, then its agent).
- **The words** are in `learn.en.js` and `learn.es.js`, with the same keys, ids and numbers. Every word a picture draws comes from them. The Spanish follows the films' Spanish captions (capacidad, flujo de valor, impulsor, punto de conexión, electrodependiente, cuadrilla, comercialización), and the map's ids (`cap.connect-customers`) stay as they are.
- **ArchiMate 4** is the standard of films 9 to 11, which don't say what changed from version 3.2. The lab *Redraw it in ArchiMate 4* and three scenarios do: the contract as a business object, a gap as an assessment, a constraint as a requirement, software assigned to a role, an interaction as a process a collaboration performs, and why the series keeps "layers" for its six while version 4 says domains.
- **Progress** stays in the visitor's browser, under `ld-enterprise-architecture`: `visited` (the labs) and `quiz` (the scenarios, numbered by film and place: 31 is the first of *Why it moves*).
- **Checks.** `site-tools/check_site.py` checks that both languages have the same labs and scenarios, each lab on one of its film's chapters and each scenario on a lab. `site-tools/smoke.py --only series-learn` opens every lab from its link and plays it through at 320 px in both languages, with `site-tools/smoke/enterprise-architecture.js`, then answers every scenario.
- **When a film lands:** set its lab's `chapter` in both files (film 9's lab to *Two rules, not one*, film 10's to *Down every layer*, film 11's where its map is written as text), check the names and numbers against its script, and run `python site-tools/build_series.py`.
