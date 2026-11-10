# The map before the data · Today, and where it's going: script

*The script of Today, and where it's going, film 7 of 11 of The map before the data (a working title), a series on enterprise architecture and why it matters for data, as built: 5:09, in ten chapters, in English, 13 October 2026. The narration lives in [`source/src/narration.js`](source/src/narration.js) and the pauses in [`source/src/breath.js`](source/src/breath.js); this page and those files say the same thing, and where they differ, the source wins. The title card follows chapter 1; the end card follows chapter 10. Made to read on a phone from the start: on-screen text is at least 28 px in the frame; the names of systems placed in bulk, in chapter 2, are texture, and each one that matters later is drawn large.*

## The promise

Every line passes two tests: anyone who has inherited a long list of systems can follow it, and an experienced enterprise architect finds nothing wrong in it. A list of systems says what was bought; placed under the capabilities they serve, from evidence, the same systems show overlaps, gaps and shadow systems. Applications run on technology, and each layer serves the one above, so a change can be followed down and a failure up. The drafts become one model in one notation, and each canvas block finds its element. Where the organisation is going is a second drawing, the target, made as carefully as today; the gaps between them are pieces of work; and the path is a third drawing, in plateaus, ordered by what depends on what. Each decision on it is written down with why. **Draw today from evidence, the target as carefully, and the path as its own drawing.**

## The story in one paragraph

On an imagined morning in 2045, in the utility's own region, the homes on one street trade power from their batteries as the sun comes up, and a crew replaces a transformer before it fails; nobody notices. It isn't a forecast: it's a drawing of where the utility wants to go. Today, it runs on a hundred and forty systems. Tomás places each one under the capability it serves, from evidence. Most land where you'd expect, but three systems handle outages, the capability that hurts has nothing but a spreadsheet kept by one engineer, and one system serves nothing anyone can name and still costs a licence. Below the applications is the technology, and each layer serves the one above. The drafts become one model in ArchiMate's notation, every canvas block finding its element. The target goes on the same map: two new capabilities, one outage system, a capacity model, no orphan. The differences are five gaps, and the path closes them in plateaus, in the order their dependencies demand. One decision, to keep one outage system, is written down with what else was considered and who decided, so the answer will be there in three years. Grace confirms today's systems; the target and the path go to the board as drafts. The map of how the utility works is drawn, for now.

## What each object stands for

| Object | Stands for |
|---|---|
| A street at sunrise, "imagined · 2045", with no poles or overhead lines: modern homes with solar roofs, batteries and heat pumps, an electric car on charge, wind turbines on the ridge | The target, drawn as a picture: one imagined morning in the utility's own region |
| A cut-away under the street, "cables under the street": blue light coming in from the grid in the night, then green light moving between the homes along the street's cable | Homes trading power from their batteries, over the street's own network |
| A kiosk on the pavement, "transformer", outlined in amber; a chart of its readings drifting towards a dashed limit; the crew's electric van; a door opens, and the transformer inside is changed | Faults predicted, and a crew sent before one happens |
| A dashed pink frame round the street | The target is a drawing, not a forecast |
| The printed list of 140 systems, scrolling, beside the street drawn small | Today and where it's going: two drawings |
| Eight capabilities in amber glass, and small blue cards flying from the list into place under them | Systems placed under the capabilities they serve |
| Three blue cards under "manage outages", bracketed | An overlap: three systems for one job |
| A spreadsheet on paper under "assess network capacity" (the red capability from *What it must be able to do*), "no system" | A gap, filled by a shadow system |
| A blue card under a dashed slot with a "?", "a licence, every year" | A system that serves no capability |
| Three rows: capabilities in amber, application components in blue, technology nodes in green, joined by lines | The layers, each serving the one above |
| A highlight running down from a capability, then a red cross on a data centre and red running up | Following a change down, and a failure up |
| Paper notes from the canvases, each with its canvas clipped on, flying into a six-layer map and turning to glass | Canvas blocks becoming ArchiMate elements |
| The six layers filling, each with its elements | The whole map, in one notation |
| Two columns: "today" and "target · 2045", the same capabilities in each, two marked "new" | Baseline and target on the same map |
| A red line through "Fleet portal 2" | The licence nobody uses, gone |
| Five pink cards with ArchiMate's gap glyph, between the two columns | The gaps: pieces of work |
| Four pink cards with ArchiMate's plateau glyph, joined by arrows, the work under the arrows | The path: plateaus, and the work between them |
| Dashed gold arrows from the capacity model to local trading, and from sensors to fault prediction | The order: what depends on what |
| A light moving from plateau to plateau | The organisation moving along the path |
| A decision record on paper: decided, considered, why, decided by, status | A decision written down with why |
| A pink note, "Why was the storm tool switched off?", "2029", and an arrow to the record | The question someone will ask, and where the answer is |
| A blue note turning to glass with a gold tick; two pink notes left as paper, "to the board, as drafts" | Today confirmed by its owner; the target and the path still proposals |

## Script

### 1 · An imagined morning · 0:00–0:40

**Narration.** An imagined morning, in 2045, in the utility's own region. As the sun comes up, the homes on one street trade power from their batteries, house to house. A transformer's readings start to drift, and a crew is sent before it fails. Nobody on the street notices. This isn't a forecast. It's a drawing of where the utility wants to go, made as carefully as a drawing of today. And today, it runs on a hundred and forty systems.

**Picture.** "imagined · 2045". A street before dawn, with no poles and no overhead lines: six modern homes (flat roofs with panels or plants, single pitches whose roofs are solar glass, a narrow townhouse with glass balconies), each with a battery on its wall and a heat pump below it; a few windows still lit; an electric car at a charge post; street trees; an LED street light; on the pavement, a kiosk (a compact substation); wind turbines turning on the ridge. Below the road, the ground in a cut-away, "cables under the street": a cable along the street with a service cable up to each home, and a deeper feeder that comes up into the kiosk. In the night, blue light comes in along the feeder and out to the homes. The sun comes up behind the hills, the solar roofs catch it, the street light goes out, and the blue gives way to green light moving between the homes, down one home's cable, along the street and up another's, as their batteries glow: "homes trading power, house to house". The kiosk is labelled "transformer"; a panel opens, "transformer readings", its line wandering, then drifting up towards a dashed limit, and the kiosk is outlined in amber, its status light amber. The crew's electric van drives in and stops beside it: "a crew, before it fails"; a door opens, the transformer inside is changed, the door closes, and the light turns green again; the green light keeps moving under the street. A dashed pink frame draws itself round the whole street: "the target: a drawing, not a forecast". The street shrinks into the frame on the right, under "where it's going"; on the left, the printed list from *Day one*, "140 systems", scrolling, under "today". Wordless breather: both drawings side by side, then the title card.

**On screen.** imagined · 2045 · cables under the street · homes trading power, house to house · transformer · transformer readings · a crew, before it fails · the target: a drawing, not a forecast · 140 systems · today · where it's going · Today, and where it's going · applications, technology, and the path to a target · Film 7 of 11

### 2 · A hundred and forty systems · 0:40–1:06

**Narration.** Tomás's next note asks what runs the utility today, and where it's going. On day one, the systems were a list: what had been bought, over forty years. Now there's a map to place them on. Each system goes under the capability it serves, from evidence: who uses it, and for what. Most of them land where you'd expect.

**Picture.** The wall. Tomás on the left; his note from the end of *Who does it, and where meaning changes*, large: "What runs it today, and where is it going?". It goes up into the corner, and the printed list, "140 systems", comes up, scrolling. Across the top, the eight capabilities from *What it must be able to do*, in amber glass: plan the network · operate the network · maintain assets · connect customers · generate power · sell energy · serve customers · meet obligations. Small blue cards fly from the list to their columns, one after another, each with ArchiMate's application component glyph (their names texture): "each system, under the capability it serves", then "from evidence: who uses it, and for what". The list fades; the cards settle, and glow softly in turn.

**On screen.** What runs it today, and where is it going? · 140 systems · plan the network · operate the network · maintain assets · connect customers · generate power · sell energy · serve customers · meet obligations · each system, under the capability it serves · from evidence: who uses it, and for what

### 3 · Three, none, and one too many · 1:06–1:42

**Narration.** Under managing outages, there are three: an outage system, a network control system that also handles outages, and a storm tool someone built in 2015. Under assessing network capacity, the capability that hurts, there's no system at all: a spreadsheet, kept by one engineer. And one system serves no capability anyone can name. It still costs a licence every year. Overlaps, gaps and shadow systems: a list could never show them. A map does.

**Picture.** The wall. "manage outages", in amber glass, and under it three blue cards as they're named: OMS · outages · DMS · network control · storm tool · 2015; a bracket joins them. "assess network capacity", lit as it was in *What it must be able to do*, over a dashed empty slot, "no system", which gives way to a spreadsheet on paper: "kept by one engineer". A dashed slot with a "?", and under it a blue card: "Fleet portal 2", "a licence, every year". Tags arrive under each: "overlap" · "gap" · "shadow system" · "serves nothing"; then "a list could never show them; a map does".

**On screen.** manage outages · OMS · outages · DMS · network control · storm tool · 2015 · assess network capacity · no system · spreadsheet · kept by one engineer · ? · Fleet portal 2 · a licence, every year · overlap · gap · shadow system · serves nothing · a list could never show them; a map does

### 4 · What runs it · 1:42–2:09

**Narration.** Below the applications is the technology they run on: two data centres, a cloud, and the radio network the field devices talk over. Each layer serves the one above. The business needs a capability; applications serve it; technology runs them. Change a capability, and you can follow it down. Switch off a server, and you can follow it up.

**Picture.** The films' dark glass, in three rows, each named on the left: strategy, three capabilities in amber (manage outages · connect customers · bill customers); application, five components in blue (OMS · outages · DMS · control · GIS · network map · CIS · customers · Billing), joined to the capabilities they serve; technology, four nodes in green as they're named (data centre 1 · data centre 2 · cloud · field radio network), joined by dashed lines to the applications that run on them. "each layer serves the one above"; each row's name lights as it's spoken. Manage outages lights, then the two applications under it, then the data centre and the radio network under them: "change a capability: follow it down". A red cross on data centre 2; the two applications on it light, then the two capabilities they serve: "switch off a server: follow it up".

**On screen.** strategy · application · technology · manage outages · connect customers · bill customers · OMS · outages · DMS · control · GIS · network map · CIS · customers · Billing · data centre 1 · data centre 2 · cloud · field radio network · each layer serves the one above · change a capability: follow it down · switch off a server: follow it up

### 5 · One map, one notation · 2:09–2:46

**Narration.** For the first time, the drafts become one model, in ArchiMate's notation. Each block of the early canvases finds its element. A customer segment becomes a stakeholder. A pain reliever, a capability. A key activity, a business process. A key resource, a resource. The whole map, layer by layer: why the utility exists, what it must be able to do, how the work flows, who does it, and what runs it. Modelling tools can keep it. The ideas don't depend on them.

**Picture.** The films' dark glass. On the right, the six layers draw themselves. On the left, four paper notes from the canvases of *Who it serves, and how it pays*, each with its canvas clipped on and its block named beside it: households (customer segment) · fewer, shorter outages (pain reliever) · restore supply (key activity) · poles, wires and crews (key resource). "one model, in ArchiMate's notation". As each block is named, its note flies into its layer and turns to glass with its glyph: households, a stakeholder, in motivation; manage outages, a capability, in strategy; restore supply, a business process; poles, wires and crews, a resource, in strategy. The layers fill one by one, each with a few more elements, and down the left: why it exists · what it must be able to do · how the work flows, who does it · what runs it. "modelling tools such as Archi or LeanIX keep it; the ideas don't depend on them".

**On screen.** motivation · strategy · business · information · application · technology · households · fewer, shorter outages · restore supply · poles, wires and crews · customer segment · pain reliever · key activity · key resource · value proposition canvas · business model canvas · one model, in ArchiMate's notation · manage outages · why it exists · what it must be able to do · how the work flows, who does it · what runs it · modelling tools such as Archi or LeanIX keep it; the ideas don't depend on them

### 6 · Where it's going · 2:46–3:09

**Narration.** Where it's going is a second drawing: the target, on the same map, so the two can be compared. Two capabilities are new: predicting faults, and trading power locally. One outage system instead of three. A model of the network's capacity instead of a spreadsheet. And the licence nobody uses, gone.

**Picture.** The films' dark glass, in two columns. On the left, "today": manage outages over its three systems, assess network capacity over its spreadsheet, and Fleet portal 2. On the right, "target · 2045", the same two capabilities: "on the same map, so the two can be compared". Two more capabilities arrive in the target, each marked "new": predict faults · trade power locally. Under them, as they're named: one outage system · network capacity model · fault prediction · local trading platform. A red line through Fleet portal 2, on the left.

**On screen.** today · target · 2045 · manage outages · assess network capacity · OMS · outages · DMS · network control · storm tool · 2015 · spreadsheet · Fleet portal 2 · predict faults · trade power locally · new · one outage system · network capacity model · fault prediction · local trading platform · on the same map, so the two can be compared

### 7 · The gaps · 3:09–3:30

**Narration.** Laid side by side, the differences between the two are the gaps. Each gap is a piece of work. Merge three outage systems into one. Build the capacity model. Switch off the system nobody uses. Add sensors, and predict faults. Open local trading.

**Picture.** Three columns: "today" (three outage systems · a spreadsheet · Fleet portal 2 · no sensors · no trading), "gaps", and "target · 2045" (one outage system · network capacity model · — · fault prediction · local trading platform). As each is named, a gap arrives between its row's two ends, in pink, with ArchiMate's gap glyph, joined to both: merge three outage systems into one · build the capacity model · switch off the system nobody uses · add sensors, predict faults · open local trading. "each gap: a piece of work".

**On screen.** today · gaps · target · 2045 · three outage systems · a spreadsheet · Fleet portal 2 · no sensors · no trading · one outage system · network capacity model · — · fault prediction · local trading platform · merge three outage systems into one · build the capacity model · switch off the system nobody uses · add sensors, predict faults · open local trading · each gap: a piece of work

### 8 · The path, in order · 3:30–4:06

**Narration.** The path is a third drawing: plateaus, the steady states in between, and the order in which the gaps are closed. The order matters. Trading power on a street needs to know how much that street can take, so the capacity model comes first. Predicting faults needs sensors, so the sensors come before it. By 2028, one outage system and a capacity model. By 2033, fault prediction. Local trading, after that.

**Picture.** Four plateaus in pink, with ArchiMate's plateau glyph, joined by arrows: today · 2028 · 2033 · 2045 · target: "plateaus: the steady states in between". Under the arrows, the work: one outage system, capacity model and switch off the unused system before 2028; sensors and fault prediction before 2033; local trading before 2045. A dashed gold arrow runs from the capacity model, under fault prediction, to local trading, and a short one from sensors to fault prediction: "the order: what depends on what". Each plateau lights as its date is spoken. Wordless breather: a light moves along the path, plateau by plateau, from today to the target.

**On screen.** plateaus: the steady states in between · today · 2028 · 2033 · 2045 · target · one outage system · capacity model · switch off the unused system · sensors · fault prediction · local trading · the order: what depends on what

### 9 · Why, written down · 4:06–4:34

**Narration.** Each choice on the path is written down with why: what was decided, what else was considered, and who decided. Keep the newest outage system, and fold the storm tool into it. Considered: keeping all three, or buying a new one. Decided by Grace. Three years on, someone will ask why the storm tool was switched off. The answer will be there.

**Picture.** The wall. A decision record on paper: "decision record", "7 · one outage system"; its fields written in as they're spoken: decided: keep the newest outage system; fold the storm tool into it · considered: keep all three · buy a new one · why: three systems: three versions of every outage · decided by: Grace · October 2026 · status: accepted. "what was decided, what else was considered, who decided". Grace on the right. "2029", and a pink note: "Why was the storm tool switched off?"; an arrow from it to the record, which lights in gold.

**On screen.** decision record · 7 · one outage system · decided · keep the newest outage system; fold the storm tool into it · considered · keep all three · buy a new one · why · three systems: three versions of every outage · decided by · Grace · October 2026 · status · accepted · what was decided, what else was considered, who decided · 2029 · Why was the storm tool switched off?

### 10 · Three drawings · 4:34–5:09

**Narration.** Grace confirms the network's systems as they stand today. The target and the path go to the board, as drafts. Tomás's note has an answer: today, placed on the map; a target, drawn as carefully; and a path between them, with reasons. The map of how the utility works is drawn, for now. Now, at last, he can open the backlog from day one, and ask which questions matter.

**Picture.** The wall. Three notes: "today: 140 systems, placed on the map", blue paper, turns to glass: "confirmed · Grace"; "target · 2045" and "path · three plateaus, with reasons" stay pink paper, half-filled: "to the board, as drafts". Grace in the middle; Tomás on the right. His note "What runs it today, and where is it going?", and beside it an answer, written out: "Today, placed on the map. A target, drawn as carefully. A path between them, with reasons." The three notes glow once. A new note: "Which questions matter?". The end card.

**On screen.** today: 140 systems, placed on the map · confirmed · Grace · target · 2045 · path · three plateaus, with reasons · to the board, as drafts · What runs it today, and where is it going? · Today, placed on the map. A target, drawn as carefully. A path between them, with reasons. · Which questions matter? · Today, a target, and the path between: three drawings. · Today, and where it's going · Film 7 of 11

## Pause and think

The film can stop at the end of three chapters, with one question each (`site/assets/today-and-where-its-going/think.en.js` and `think.es.js`). The series has no labs yet, so the questions link to none; most answers end with a question to take back to your own organisation, for a class or a team.

| After | Question | Answer |
|---|---|---|
| Three, none, and one too many | Why couldn't the list of 140 show three systems for one job, a gap and an orphan? | A list only says what was bought; only placed against capabilities does it show overlaps, gaps and shadow systems. |
| The path, in order | Why does the capacity model come before local trading? | Trading power on a street needs to know how much that street can take. |
| Why, written down | Three years on, someone asks why the storm tool was switched off. What answers them? | The decision record: what was decided, what else was considered, and who decided. |

## Labs (candidates)

1. **Place the systems.** Twenty systems, each with a line of evidence (who uses it, for what); place them under eight capabilities, then find the overlap, the gap and the orphan.
2. **Follow it.** A three-layer map; change a capability and trace what's affected below; switch off a node and trace what's affected above.
3. **Block to element.** Eight blocks from two canvases; give each its ArchiMate element and its layer.
4. **Find the gaps.** Today and a target, side by side; write the gaps between them as pieces of work.
5. **Order the path.** Six pieces of work and their dependencies; arrange them into plateaus, and say why that order.
6. **Write the record.** A decision and its context; fill in decided, considered, why and who.

## Rigour to check before recording

- **The imagined morning** is labelled as imagined, and set in the series' own fictional region, as the proposal requires for an opening in the future; it's a target drawing, not a forecast. Local trading of power between neighbours (peer-to-peer or community trading) has been trialled in several countries but isn't standard practice; predicting transformer faults from sensor and meter data (condition monitoring, predictive maintenance) is in use and growing. Many towns already run their low-voltage networks underground, with compact substations (kiosks) at ground level, and new streets are mostly built that way; the street is drawn so, with a cut-away to show the cables, and its homes, car and van as they might be built now. When neighbours trade, power flows on the street's own low-voltage cables, not through the transformer. In the picture the green keeps moving while the transformer is changed: in this imagined street the batteries carry it, as an island, for those minutes; today the same job is done with a short planned outage or a temporary generator. The street and its devices are drawn in the series' own style.
- **Placing systems under capabilities** (capability-to-application mapping) is common practice in application portfolio management, and in TOGAF's and BIZBOK's guidance. "Shadow systems" (or shadow IT) are systems and tools, often spreadsheets, that run part of the business outside the official portfolio. Overlaps, gaps and systems that serve no capability are what application rationalisation looks for; the film doesn't name frameworks for it (such as tolerate, invest, migrate, eliminate).
- **The layers** follow ArchiMate 3.2: application components serve business behaviour and are realised by, or run on, technology nodes; the film draws "serving" as a line from capability to application, a simplification (ArchiMate relates applications to capabilities through realisation and serving, often via business behaviour). TOGAF's business, data, application and technology architectures make the same split. The series' insight 5: each layer is derived from the one above.
- **Canvas blocks to ArchiMate elements** follow the proposal's mapping: a customer segment to a stakeholder (it could also be a business actor or role), a pain reliever to a capability (it could also be a product feature or a service), a key activity to a business process (or function), a key resource to a resource. These are reasonable first mappings, not rules of either framework; ArchiMate's resource and capability are strategy elements, its stakeholder a motivation element. The canvases are Strategyzer's, as credited in *Who it serves, and how it pays*.
- **Tools.** Archi is a free, open-source ArchiMate modelling tool; LeanIX (now SAP LeanIX) is a commercial enterprise architecture management service. Both are named once, on screen, as the proposal planned, alongside the point that the ideas don't depend on them; the voice says only "modelling tools", because a synthetic voice misreads both names. ArchiMate is said with a hard "ch" ("ARK-ee-mate"), and the voice is given that spelling (`say` in `narration.js`). Check the names on the day.
- **Baseline, target and transition** follow TOGAF (baseline and target architectures, gap analysis, transition architectures, migration planning) and ArchiMate 3.2's implementation and migration elements: plateau (a relatively stable state of the architecture during a limited period), gap (the difference between two plateaus) and work package; the gap and plateau glyphs on screen are ArchiMate's, the colour the series' own. The series' insight 8: today, the target and the path are drawn separately.
- **Decision records** follow the practice of architecture decision records (Michael Nygard, 2011: context, decision, status, consequences) and TOGAF's architecture decision log; the fields on screen are a common simplification. The series' insight 9: every decision records why.
- **Merging an outage system and a network control system** into one (often called an advanced distribution management system) is a common direction for distribution utilities; the film keeps it generic.
- **The figures** (140 systems over forty years, a storm tool from 2015, plateaus in 2028, 2033 and 2045, decision 7 in October 2026, the system names) are fictional and plausible. The capacity model is the network's hosting capacity, the "how much solar each street can take" of *What it must be able to do*.

## Pacing report

From `source/tools/pace.py`, as built: 5:09, 649 words, 126 words a minute, the voice speaking 73% of the time; no sentence with under 0.5 s after it, and no stop of 2.5 s or more inside a chapter. Three wordless moments: today's list beside the imagined street, then the title; the light moving along the path, plateau by plateau; and the end card. `source/tools/legible.py`: 302 pieces of text, none smaller than 28 px. `source/tools/check.py`: every frame draws.
