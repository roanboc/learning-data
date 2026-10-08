# The map before the data

*A series on enterprise architecture and why it matters for data. The title is a working one.*

A new enterprise architect, Tomás, joins a publicly owned energy utility and doesn't yet know how it works, so he doesn't yet know which questions it needs to answer. Over eleven films he builds a map of it, layer by layer, from why it exists down to what runs it, and then shows what that map does for data: the questions that matter, rules with a home, a change in strategy, and a map that people and agents can read. The plan is in the [proposal](proposal.md).

**Status:** *Day one*, *Who it serves, and how it pays*, *Why it moves*, *What it must be able to do* and *How value reaches people* are built. They aren't on the site yet.

## The films

| Film | Topic | Length | Chapters | Script |
|---|---|---|---|---|
| Day one | Why enterprise architecture, and the series | 5 min | 10 | [script](1-day-one/script.md) · [source](1-day-one/source/README.md) |
| Who it serves, and how it pays | Customers, offerings and the canvases | 5 min | 10 | [script](2-who-it-serves/script.md) · [source](2-who-it-serves/source/README.md) |
| Why it moves | Stakeholders, drivers, assessments, goals, outcomes and principles | 5 min | 10 | [script](3-why-it-moves/script.md) · [source](3-why-it-moves/source/README.md) |
| What it must be able to do | Capabilities: levels, owners and heat maps | 5½ min | 10 | [script](4-what-it-must-do/script.md) · [source](4-what-it-must-do/source/README.md) |
| How value reaches people | Value streams, process maps and levels, SIPOC, and detail where order matters | 5¾ min | 10 | [script](5-how-value-reaches-people/script.md) · [source](5-how-value-reaches-people/source/README.md) |

## The look and the sound

- **Two materials.** Drafts are paper: canvases and sticky notes on a wall, slightly crooked. The confirmed model is glass, in the colours architects conventionally give the layers. A note that moves from the wall to the model changes material.
- **People.** Tomás, outlined in cyan (the technical side); the people who own parts of the business, outlined in gold, starting with Grace, who owns network operations, Farah, the customer advocate, and Ama, the regulatory lead.
- **Made to read on a phone.** Text is at least 28 px in the 1920-pixel frame (about 12 px on a phone held sideways), the camera moves in on the part of a canvas being talked about, and the player's captions grow as it shrinks (the shared engine does this for every film). `tools/legible.py` checks every frame.
- **Its own sound.** Nylon-string plucks and a soft flute over warm pads, a lute for the past, and its own four-note mark, rising 1-3-5-8. Nothing loops, and every effect is something appearing on screen.

## How the films are made

Like the other series, each film is generated from code. The series keeps what's its own in [`shared/`](shared/):

| File | What it holds |
|---|---|
| `shared/src/ea.js` | The series' components: its colours, title and end cards, the six layers (`slab`, `layerStack`), the wall, canvases and sticky notes (`wallBg`, `vpCanvas`, `bmCanvas`, `sticky`, `statusDot`), glass elements of the model (`archEl`, with ArchiMate's glyph for each kind, `archGlyph`, value streams' chevron included), the data rule card (`ruleCard`), labelled canvases to pin notes into (`vpCanvas2`, `VPC.where`, `BMC_AT`), and a camera that moves in on part of a picture (`focus`, `focusZ`) |
| `shared/tools/legible.py` | Checks that every piece of text on screen is large enough to read on a phone, frame by frame; text marked as decoration is skipped |
| `shared/src/people.js` | The series' people: Tomás Herrera, Grace Achieng, Farah Siddiqui and Ama Owusu, drawn like the cast of *When things go wrong* |
| `shared/src/page.html` | The standalone player page |
| `shared/tools/lang.py`, `build.py` | Where everything lives, and what a film is made of; motion and the video's finishing pass come from *In the weeds of data crafting* |
| `shared/tools/run.py` | Runs a tool on a film: this series' own `lang.py` and `build.py`, and *From words to data*'s other tools and instruments unchanged |
