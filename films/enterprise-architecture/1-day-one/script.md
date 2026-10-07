# Enterprise architecture, for data · Day one: script

*The script of the opening film of The map before the data (a working title), a series on enterprise architecture and why it matters for data, as built: 5:07, in ten chapters, in English, 7 October 2026. The narration lives in [`source/src/narration.js`](source/src/narration.js) and the pauses in [`source/src/breath.js`](source/src/breath.js); this page and those files say the same thing, and where they differ, the source wins. The title card follows chapter 1; the end card follows chapter 10. Made to read on a phone: on-screen text is at least 28 px in the frame, and the camera moves in on whatever the narration is about.*

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
| Grace, outlined in gold, and her gold tick | The person who owns that part of the business, confirming a note |
| A data rule card, floating, then tied to a process, an owner and a goal | A rule with a home |
| A bill flagged "wrong" | What a rule without a home costs a customer |
| Eleven film cards along the layers | The series |

## The look

- **Two materials.** Tomás's wall is paper: canvases, sticky notes in pencil and marker, slightly crooked. The model is crisp glass, in the conventional ArchiMate colours: soft yellow for business, blue for application, green for technology, purple for motivation, and a pale gold for strategy. A note that moves from the wall to the model changes material: that's the series' idea of a draft becoming confirmed.
- **The past is parchment and ink,** warm, with the year in the corner, as in the other series.
- **Tomás is outlined in cyan** (the technical side). People who own parts of the business are outlined in gold, starting with Grace, who owns network operations (chapter 7).

## Script

### 1 · Before you can govern it · 0:00–0:33

**Narration.** Nineteen years after conquering England, William the Conqueror still didn't know exactly what he ruled. At Christmas 1085, he sent surveyors across most of the country. Who holds this land? What is on it? What is it worth? Ploughs, mills and meadows, then and now. Their record became the Domesday Book. Before you can govern a place, you have to know what it is.

**Picture.** Parchment and ink, "1085" in the corner. A map of England draws itself in ink on parchment, and the counties wash in as they're surveyed; the far north and Wales stay blank ("not surveyed"). A quill writes an entry: "Ralph holds Estone from the king. Land for 4 ploughs. 2 ploughs there now. 1 mill. 6 acres of meadow. Woodland, 40 pigs. Worth then 40 shillings; now 60." Each question lights its line. The pages gather and a cover closes: DOMESDAY · 1086. "know the place first". Wordless breather: the book, then the title card, *Day one*.

**On screen.** 1085 · England · not surveyed · who holds it? · what is on it? · what is it worth? · then · 40 · now · 60 · the Domesday Book · know the place first · Day one · a way of looking, before the questions · Film 1 of 11

### 2 · Day one · 0:33–1:09

**Narration.** Today, Tomás starts as an enterprise architect at an energy utility owned by the regional government. It runs the poles and wires for the region, owns a few hydro and wind farms, and sells power to homes and businesses. By lunchtime he has a badge, an org chart, a list of a hundred and forty systems, and an invitation: the transition program. Everyone asks what he thinks. He doesn't know what to think yet. He doesn't even know what to ask.

**Picture.** The films' dark glass. A region at night: a dam and its lake, wind turbines on a ridge, pylons whose lines light up as they're named, a substation, houses whose windows light. Then Tomás behind a desk, outlined in cyan. Items land one by one: a badge, the org chart, a system list that scrolls and counts up to 140, a calendar invitation. Three speech bubbles: "What's our data strategy?", "Can you fix the reporting?", "Which system should we keep?". Then acronyms drift round his head (OMS, CIS, SCADA, AMI, RAB, DUoS, GIS, EAM), his face turns concerned, and a question mark settles over him.

**On screen.** publicly owned · poles and wires · hydro and wind · homes and businesses · 140 systems · the transition program · what should he ask?

*The acronyms are real ones from the industry, left unexplained on purpose: that's how they feel on day one.*

### 3 · True, and not enough · 1:09–1:41

**Narration.** Everything he's been given is true. None of it explains the place. The org chart shows who reports to whom, not what the utility must be able to do. The system list shows what was bought, not what it's for. The process manual runs to four hundred pages, last revised six years ago. And the strategy is five words on a slide. Each is a piece of the picture, cut from a different puzzle.

**Picture.** "all true · none of it explains the place". Each item comes forward in turn, with what it shows (✓) and what it doesn't (✗): the org chart (who reports to whom; what it must do); the system list (what was bought; what it's for); the process manual, 412 pages, revised six years ago (how work was done; how it's done now); a slide reading "Safe. Affordable. Reliable. Clean. Ours." (what matters; how it happens). The four gather in the middle as jigsaw pieces whose edges don't fit, and wobble.

**On screen.** all true · none of it explains the place · who reports to whom · what it must do · what was bought · what it's for · how work was done · how it's done now · what matters · how it happens · pieces from different puzzles

### 4 · A way of looking · 1:41–2:15

**Narration.** Enterprise architecture is a way of looking at an organisation in layers, from why it exists down to what runs it. Three questions hold the layers. Why does it exist, and for whom? How does it work: who does what, with which information? And what runs it: which applications, on which technology? Each layer is worked out from the one above. Start from the bottom, and you'll describe every system perfectly, and still not know what they're for.

**Picture.** The jigsaw pieces lift away. An empty stack of layers draws itself, from top to bottom, each in its colour: motivation, strategy, business, information, application, technology. Three brackets appear on the left, one per question: *why, and for whom* over motivation and strategy; *how it works* over business and information; *what runs it* over application and technology. An arrow runs down the stack. Then a second arrow tries to climb from the technology layer and stalls: the system list fills the bottom layer perfectly, while the layers above stay empty.

**On screen.** a way of looking, in layers · motivation · strategy · business · information · application · technology · why, and for whom · how it works · what runs it · each layer, from the one above · every system, perfectly · and what for?

### 5 · Many maps, the same lessons · 2:15–2:50

**Narration.** There's no shortage of methods. TOGAF gives a way to do the work. ArchiMate, a language to draw it. Zachman, a grid to sort it. Business architecture brings capabilities and value streams, process frameworks bring catalogues, domain-driven design shows where meanings change, and data management shows who looks after information. Each has its champions. Under the vocabulary, they agree on more than they differ. This series takes what they agree on.

**Picture.** Method cards fan out around the stack, each with a simple glyph, named as it arrives: TOGAF (a cycle), ArchiMate (layered shapes), Zachman (a grid), business architecture (a capability map), process frameworks (a numbered tree), domain-driven design (two bounded circles), data management (a wheel). The map shrinks to the middle while the cards arrive, then gives way: small phrases lift from the cards and gather in the middle ("start with why", "capabilities outlast reorganisations", "describe today first", "trace it to evidence", "just enough"), and "this series: what they agree on" settles under them.

**On screen.** TOGAF · ArchiMate · Zachman · business architecture · process frameworks · domain-driven design · data management · start with why · capabilities outlast reorganisations · describe today first · trace it to evidence · just enough

*The only place in the series where the methods are named. Each later film teaches the idea without saying which method it came from.*

### 6 · Rough first · 2:50–3:20

**Narration.** And it starts rough. A canvas on a wall: who the utility serves, what they need, and how it's paid for. Sticky notes can be argued with in an afternoon. Later, they become a capability map, then value streams, and finally a model in a formal notation. Notation is earned. Draw too precisely too early, and people correct your drawing instead of your understanding.

**Picture.** A wall. Two canvases are drawn in marker: a value proposition canvas (a circle and a square) and a business model canvas (nine blocks). The camera moves in on each canvas as it's talked about. Sticky notes land: "households", "keep the lights on", "reliable supply", then "the network", "households" again and "network tariffs" on the business model canvas. "bills too high" is moved into the customer profile. Then the canvases give way to a capability map drawn in chalk (keep the lights on, connect customers, bill customers, maintain assets, manage outages, plan the network), a value stream in chevrons (report, locate, repair, restore), and both turn into crisp glass elements in the layer colours, with a stakeholder (households) and a goal (affordable, reliable power). At "too early", a too-precise diagram appears (Customer Mgmt, Grid Ops, Billing Process, Outage Process, CIS); red pen circles land on an arrowhead, a colour and an element type, and "what is it for? — nobody asked" appears under it.

**On screen.** value proposition canvas · business model canvas · notation is earned · wrong arrowhead · not this colour · should be a role? · what is it for? — nobody asked

### 7 · Evidence, then confirmation · 3:20–3:49

**Narration.** Tomás sets himself two rules. Every note names where it came from: the annual report, the regulator's decision, the owner's statement of expectations, an interview. And every note stays a draft until the person who owns that part of the business says it's right. A map nobody has confirmed is one person's opinion, drawn neatly.

**Picture.** The wall, eight notes, Tomás on the left. Small tags clip onto notes as they're named: "annual report 2025", "regulator's decision", "statement of expectations", "interview · operations", then "complaints log" and "tariff schedule". "rooftop solar" has no source, and fades. Each note carries a circle, hollow, then half filled. Grace, who owns network operations, outlined in gold, arrives on the right and ticks two notes in gold; their circles fill, and they turn from paper into glass. A key: not started · draft · confirmed. Wordless breather: four more notes are confirmed, and the wall is half paper, half glass.

**On screen.** every note names its source · a draft until its owner confirms it · Grace · owns network operations · not started · draft · confirmed · unconfirmed: one person's opinion, drawn neatly

### 8 · Why this matters for data · 3:49–4:19

**Narration.** Why would a data architect care? Because every data rule is a claim about the organisation. Take this one: an estimated meter reading stands only until the next actual reading. Which process creates it? Who owns it? Which goal does it serve? Without the map, a rule is a guess, and when it's wrong, nobody knows who should fix it. With the map, the rule has a home.

**Picture.** "why would a data architect care?", then "every data rule is a claim about the organisation". A data rule card arrives: "an estimated reading stands only until the next actual reading". Three empty sockets appear around it as they're asked: which process?, who owns it?, which goal?. On "without the map", the card drifts, a bill ($412.80, based on an estimated reading) is flagged "wrong", and "who should fix it?". On "with the map", the layers appear faintly behind; lines run from the card to a process ("read meters"), an owner in gold ("owner · metering") and up to a goal ("fair, accurate bills"). The card settles and glows: "a rule with a home".

**On screen.** why would a data architect care? · every data rule is a claim about the organisation · data rule · which process? · who owns it? · which goal? · wrong · who should fix it? · read meters · owner · metering · fair, accurate bills · a rule with a home

### 9 · The series · 4:19–4:49

**Narration.** Over eleven films, Tomás builds the map, one layer at a time. Seven films to understand the utility: who it serves, why it moves, what it must be able to do, how value reaches people, who does what, and what runs it. Then four on what it means for data: the questions that matter, rules with a home, a change in strategy, and a map that people and agents can read.

**Picture.** The map on the left ("the map, one layer at a time"); the eleven films in one column on the right, under "understand the utility" (1 to 7) and "for data" (8 to 11). Each card lights as it's named, and the layers it adds light with it.

**On screen.** Day one · Who it serves, and how it pays · Why it moves · What it must be able to do · How value reaches people · Who does it, and where meaning changes · Today, and where it's going · Now the questions appear · Rules with a home · When strategy moves · A map people and agents can read

### 10 · The first note · 4:49–5:07

**Narration.** The surveyors' first questions still work. What is this place? Who holds it? What is it worth? Tomás writes the first note.

**Picture.** The Domesday entry on the wall, with its three questions under it as they're asked. Tomás puts up a sticky note and writes "Why does it exist?"; its circle is hollow. The end card: "Learn the place before you ask the questions." *Day one*, The map before the data · Film 1 of 11.

**On screen.** What is this place? · Who holds it? · What is it worth? · Why does it exist? · Learn the place before you ask the questions. · Day one · Film 1 of 11

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

## Pacing report

From `source/tools/pace.py`, as built: 5:07, 648 words, 127 words a minute, the voice speaking 68% of the time; no sentence with under 0.5 s after it, and no stop of 2.5 s or more inside a chapter. *The series* is the densest chapter, at 142 words a minute: it's a list, and each film card lights as it's named. Three wordless moments: the Domesday Book and the title, the wall half paper and half glass, and the end card.
