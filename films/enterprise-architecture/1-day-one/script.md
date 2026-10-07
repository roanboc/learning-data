# Enterprise architecture, for data · Day one: script

*The script of the opening film of the series on enterprise architecture and why it matters for data (series title still open), first draft, 7 October 2026. Ten chapters, about 650 words of narration: around 5½ minutes at the site's pace. When the film is built, the narration moves to `source/src/narration.js`, and the source wins where they differ.*

## The promise

Every line passes two tests: anyone who has joined a new organisation can follow it, and an experienced enterprise architect finds nothing wrong in it. The film opens the series and says what it's about. You can't ask good questions about a place you don't understand. Enterprise architecture is a way of looking at an organisation in layers, from why it exists down to what runs it. Many methods describe it, and they agree on more than they differ. The series starts rough, with canvases, and earns its notation. Every claim comes from evidence, and owners confirm it. At the end, the map gives every data rule a home. **Learn the place before you ask the questions.**

## The story in one paragraph

Nineteen years after conquering England, William the Conqueror still didn't know exactly what he ruled, so he sent surveyors to find out: who holds the land, what is on it, and what it's worth, then and now. Today, Tomás starts as an enterprise architect at a publicly owned energy utility. By lunchtime he has a badge, an org chart, a list of 140 systems and an invitation to a meeting about "the transition program". Everyone asks what he thinks, and he doesn't yet know what to ask. Everything he's given is true, and none of it explains the place. Enterprise architecture offers a way of looking: layers held by three questions. Why does it exist, and for whom? How does it work? What runs it? Many methods describe those layers. The series takes what they agree on, and starts rough, with sticky notes on a canvas. Tomás sets himself two rules: every note names its source, and every note stays a draft until its owner confirms it. Why would a data architect care? Because every data rule is a claim about the organisation, and without the map it has no home. Over eleven films, Tomás builds the map. He writes the first note.

## What each object stands for

| Object | Stands for |
|---|---|
| A parchment page, with a surveyor's hand writing entries | The Domesday survey: knowing a place before governing it |
| "then · now" beside an estate's value | Describing what is true, and how it changed: the baseline |
| A badge, a welcome pack, an org chart, a long list of systems, an invitation | Day one: true pieces that don't explain the whole |
| Acronyms floating over Tomás | The organisation's language, not yet his |
| The pieces as jigsaw pieces from different puzzles | Each view is partial, and the views don't connect |
| A stack of empty layers, in the conventional ArchiMate colours | The map: why, how, what runs it |
| Three brackets over the layers: intention, operation, realization | The three questions that hold the layers |
| An arrow down the stack, and a crossed-out arrow up | Each layer is worked out from the one above |
| Method cards, each with its glyph | The known bodies of knowledge, named once |
| The cards' shared points collecting in the middle | The insights the series takes from all of them |
| A wall with canvases and sticky notes | Rough first drafts, meant to be argued with |
| Notes becoming boxes, boxes becoming ArchiMate elements | Notation, earned |
| A small source tag on every note | Evidence: every claim names where it came from |
| A hollow, half and full circle on a note | Not started, draft, confirmed by its owner |
| A data rule card, floating, then tied to a process, an owner and a goal | A rule with a home |
| Eleven film cards along the layers | The series |

## The look

- **Two materials.** Tomás's wall is paper: canvases, sticky notes in pencil and marker, slightly crooked. The model is crisp glass, in the conventional ArchiMate colours: soft yellow for business, blue for application, green for technology, purple for motivation, and a pale gold for strategy. A note that moves from the wall to the model changes material: that's the series' idea of a draft becoming confirmed.
- **The past is parchment and ink,** warm, with the year in the corner, as in the other series.
- **Tomás is outlined in cyan** (the technical side). People who own parts of the business, who appear from film 2 onwards, are outlined in amber.

## Script

### 1 · Before you can govern it · 0:00–0:32

**Narration.** Nineteen years after conquering England, William the Conqueror still didn't know exactly what he ruled. At Christmas 1085, he sent surveyors across most of the country. Who holds this land? What is on it? What is it worth? Ploughs, mills and meadows, then and now. Their record became the Domesday Book. Before you can govern a place, you have to know what it is.

**Picture.** Parchment and ink, "1085" in the corner. A map of England draws itself in ink, county by county; the far north stays blank. A surveyor's hand writes an entry: a holder's name, "2 ploughs · 1 mill · 6 acres of meadow", and "worth then · now" with two values. Wordless breather: the pages stacking into a bound book.

**On screen.** 1085 · who holds it? · what is on it? · what is it worth? · then · now

### 2 · Day one · 0:32–1:05

**Narration.** Today, Tomás starts as an enterprise architect at an energy utility owned by the regional government. It runs the poles and wires for the region, owns a few hydro and wind farms, and sells power to homes and businesses. By lunchtime he has a badge, an org chart, a list of a hundred and forty systems, and an invitation: the transition program. Everyone asks what he thinks. He doesn't know what to think yet. He doesn't even know what to ask.

**Picture.** The films' dark glass. A region at night: lines, substations, a dam, a wind farm, houses lighting up. Then Tomás at a desk, outlined in cyan. Items land one by one: a badge, the org chart, a long system list that scrolls, a calendar invitation. Acronyms drift over his head: OMS, CIS, SCADA, AMI, RAB, DUoS. Three speech bubbles: "What's our data strategy?", "Can you fix the reporting?", "Which system should we keep?". A question mark settles over Tomás.

**On screen.** publicly owned · poles and wires · hydro and wind · homes and businesses · 140 systems · the transition program · what should he ask?

*The acronyms are real ones from the industry, left unexplained on purpose: that's how they feel on day one.*

### 3 · True, and not enough · 1:05–1:37

**Narration.** Everything he's been given is true. None of it explains the place. The org chart shows who reports to whom, not what the utility must be able to do. The system list shows what was bought, not what it's for. The process manual runs to four hundred pages, last revised six years ago. And the strategy is five words on a slide. Each is a piece of the picture, cut from a different puzzle.

**Picture.** Each item comes forward in turn, with what it shows and what it doesn't: the org chart ("who reports to whom" ✓, "what it must do" ✗); the system list ("what was bought" ✓, "what it's for" ✗); a thick manual, dated six years ago; a slide reading "Safe. Affordable. Reliable. Clean. Ours." The four turn into jigsaw pieces with different edges, and none of them fit.

**On screen.** who reports to whom · what it must do · what was bought · what it's for · 400 pages · six years old · five words · different puzzles

### 4 · A way of looking · 1:37–2:17

**Narration.** Enterprise architecture is a way of looking at an organisation in layers, from why it exists down to what runs it. Three questions hold the layers. Why does it exist, and for whom? How does it work: who does what, with which information? And what runs it: which applications, on which technology? Each layer is worked out from the one above. Start from the bottom, and you'll describe every system perfectly, and still not know what they're for.

**Picture.** The jigsaw pieces lift away. An empty stack of layers draws itself, from top to bottom, each in its colour: motivation, strategy, business, information, application, technology. Three brackets appear on the left, one per question: *why, and for whom* over motivation and strategy; *how it works* over business and information; *what runs it* over application and technology. An arrow runs down the stack. Then a second arrow tries to climb from the technology layer and stalls: the system list fills the bottom layer perfectly, while the layers above stay empty.

**On screen.** enterprise architecture · a way of looking · why, and for whom · how it works · what runs it · from the one above

### 5 · Many maps, the same lessons · 2:17–2:58

**Narration.** There's no shortage of methods. TOGAF gives a way to do the work. ArchiMate, a language to draw it. Zachman, a grid to sort it. Business architecture brings capabilities and value streams, process frameworks bring catalogues, domain-driven design shows where meanings change, and data management shows who looks after information. Each has its champions. Under the vocabulary, they agree on more than they differ. This series takes what they agree on.

**Picture.** Method cards fan out around the stack, each with a simple glyph, named as it arrives: TOGAF (a cycle), ArchiMate (layered shapes), Zachman (a grid), business architecture (a capability map), process frameworks (a numbered tree), domain-driven design (two bounded circles), data management (a wheel). Small phrases lift from the cards and gather in the middle: "start with why", "capabilities outlast reorganisations", "describe today first", "trace it to evidence", "just enough".

**On screen.** TOGAF · ArchiMate · Zachman · business architecture · process frameworks · domain-driven design · data management · start with why · capabilities outlast reorganisations · describe today first · trace it to evidence · just enough

*The only place in the series where the methods are named. Each later film teaches the idea without saying which method it came from.*

### 6 · Rough first · 2:58–3:35

**Narration.** And it starts rough. A canvas on a wall: who the utility serves, what they need, and how it's paid for. Sticky notes can be argued with in an afternoon. Later, they become a capability map, then value streams, and finally a model in a formal notation. Notation is earned. Draw too precisely too early, and people correct your drawing instead of your understanding.

**Picture.** A wall. Two canvases are drawn in marker: a value proposition canvas (a circle and a square) and a business model canvas (nine blocks). Sticky notes land: "households", "keep the lights on", "bills too high", "network tariffs". One is moved by a hand from off screen. Then the notes slide into a grid of capability boxes, then into a chevron row (a value stream), then turn into crisp ArchiMate elements in the layer colours: a customer segment becomes a stakeholder, "keep the lights on" a capability. At "your drawing", a too-early, perfect diagram appears; red pen marks land on its line colours and arrowheads, not on what it says.

**On screen.** canvas · who it serves · what they need · how it's paid for · capability map · value streams · formal notation · notation is earned

### 7 · Evidence, then confirmation · 3:35–4:12

**Narration.** Tomás sets himself two rules. Every note names where it came from: the annual report, the regulator's decision, the owner's statement of expectations, an interview. And every note stays a draft until the person who owns that part of the business says it's right. A map nobody has confirmed is one person's opinion, drawn neatly.

**Picture.** Close on the wall. Small tags clip onto notes: "annual report 2025", "regulator's decision", "statement of expectations", "interview · operations". A note without a tag fades. Each note carries a circle: hollow, then half filled as Tomás drafts it. A hand, outlined in amber, ticks one; its circle fills, and the note turns from paper into glass. Wordless breather: the wall, half paper and half glass.

**On screen.** every note names its source · a draft until its owner confirms it · not started · draft · confirmed

### 8 · Why this matters for data · 4:12–4:52

**Narration.** Why would a data architect care? Because every data rule is a claim about the organisation. Take this one: an estimated meter reading stands only until the next actual reading. Which process creates it? Who owns it? Which goal does it serve? Without the map, a rule is a guess, and when it's wrong, nobody knows who should fix it. With the map, the rule has a home.

**Picture.** A data rule card floats in the dark, in the style of the data series: "estimated read → replaced by the next actual read". Three empty sockets appear around it: process, owner, goal. On "without the map", the card drifts, and a bill on a customer's screen shows a wrong amount. On "with the map", the layers return; lines run from the card to a process step ("read meters"), to an owner (an amber outline: "metering"), and up to a goal ("fair, accurate bills"). The card settles into place.

**On screen.** every data rule is a claim about the organisation · which process? · who owns it? · which goal? · a guess · a home

### 9 · The series · 4:52–5:22

**Narration.** Over eleven films, Tomás builds the map, one layer at a time. Seven films to understand the utility: who it serves, why it moves, what it must be able to do, how value reaches people, who does what, and what runs it. Then four on what it means for data: the questions that matter, rules with a home, a change in strategy, and a map that people and agents can read.

**Picture.** Eleven film cards line up beside the layers they add, the first seven down the stack, the last four in a second column labelled "for data". Each card lights as it's named.

**On screen.** Day one · Who it serves, and how it pays · Why it moves · What it must be able to do · How value reaches people · Who does it, and where meaning changes · Today, and where it's going · Now the questions appear · Rules with a home · When strategy moves · A map people and agents can read

### 10 · The first note · 5:22–5:40

**Narration.** The surveyors' first questions still work. What is this place? Who holds it? What is it worth? Tomás writes the first note.

**Picture.** The Domesday page, briefly, beside the empty wall. Tomás writes a sticky note, "Why does it exist?", and places it at the top of the wall. Its circle is hollow. Title card, then the end card.

**On screen.** What is this place? · Who holds it? · What is it worth? · Why does it exist? · Film 1 of 11

## Pause and think

Stops after:

- **Chapter 3:** "Think of your first week somewhere new. What were you given, and what did it leave out?"
- **Chapter 4:** "Most handovers start with the system list. What goes wrong when you start from the bottom layer?"
- **Chapter 8:** "Pick a data rule you know. Could you name the process that creates the data, its owner and the goal it serves?"

## Labs (candidates)

1. **Sort the pile.** Twelve things from day one (an org chart, a tariff, a regulator's decision, a server list, a complaint, a strategy slide). Drop each on the layer it tells you about.
2. **Top down or bottom up.** Fill the map from the system list, then from a goal, and compare what each leaves blank.
3. **Tag the source.** Notes without sources. Find which document or person each came from, or mark it unconfirmed.
4. **Give a rule a home.** Three data rules. Connect each to a process, an owner and a goal.

## Rigour to check before recording

- **Domesday.** Commissioned at Gloucester at Christmas 1085; the survey was carried out in 1086. It didn't cover the far north (most of Northumberland, Durham, Cumberland and Westmorland) or London and Winchester, so the script says "most of the country". Entries often give values for 1066 and 1086, sometimes also for when the holder received the land; "then and now" is a fair simplification. The name *Domesday* came later.
- **Industry acronyms:** OMS (outage management system), CIS (customer information system), SCADA, AMI (advanced metering infrastructure), RAB (regulated asset base), DUoS (distribution use of system charges). Check they're current in the markets where the series will be watched.
- **Method names and their one-line descriptions:** TOGAF as a method, ArchiMate as a modelling language, Zachman as a classification. Check each against its owner's own description on the day of publishing, and credit the trademarks (TOGAF and ArchiMate are registered trademarks of The Open Group).
- **ArchiMate colours** are a convention, not part of the standard. Say "conventional" if asked.
- **The canvases** are Strategyzer's; credit them where they're drawn.
- **Estimated readings.** Rules on how estimates are replaced differ by market; the rule shown is a common pattern, not one market's regulation.
