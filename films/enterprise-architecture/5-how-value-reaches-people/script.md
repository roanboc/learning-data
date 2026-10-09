# The map before the data · How value reaches people: script

*The script of How value reaches people, film 5 of 11 of The map before the data (a working title), a series on enterprise architecture and why it matters for data, as built: 5:45, in ten chapters, in English, 8 October 2026. The narration lives in [`source/src/narration.js`](source/src/narration.js) and the pauses in [`source/src/breath.js`](source/src/breath.js); this page and those files say the same thing, and where they differ, the source wins. The title card follows chapter 1; the end card follows chapter 10. Made to read on a phone from the start: on-screen text is at least 28 px in the frame; in chapter 1 the camera goes down from a map of Mumbai to a kitchen, follows a bicycle, and comes back up to the whole city.*

## The promise

Every line passes two tests: anyone who has waited for the power to come back can follow it, and an experienced enterprise architect finds nothing wrong in it. A value stream is how value reaches a customer, seen from their side: a few stages, in order, each ending in something they get. Its stages lean on capabilities, and the work behind them crosses teams, which is where it goes wrong. Processes show how the work gets done; a process map sorts them into four groups, and levels open them one box at a time. A SIPOC draws a process's edges. Most steps need no more than a box and an arrow; a step whose rule depends on order and state earns detail, in a notation such as BPMN, and that's where the data rules are. **See it from the customer's side. Go deep only where it matters.**

## The story in one paragraph

In Mumbai, a home-cooked lunch goes into a tin with a few painted marks on its lid, and crosses the city by bicycle, train and on foot, changing hands several times, to reach a desk by lunchtime. Before the pandemic, about five thousand dabbawalas carried some two hundred thousand lunches a day with almost no errors: the detail lives where the tins change hands, and the customer sees only three things. Today, at ten past two on a stormy morning, a branch brings down a line on Hill Street, and forty homes go dark. One household calls the faults line, and Tomás follows that call. Farah draws the night from the household's side: four stages, each ending in something the household gets. That's a value stream. Under its stages go the capabilities from Tomás's map; behind them, the work passes through three teams, and the household feels only the hand-offs that go wrong. Grace shows him the process map, in four groups, and the levels down to seven steps. Tomás draws the process's edges, and the fault record that goes to the regulator. One step needs more: deciding which crew goes first, when three faults compete for two crews. The rule, drawn in BPMN, sends the crews somewhere habit wouldn't, and it needs three facts at two in the morning, one of them from a network model that isn't sure which homes hang off which transformer. The lights come back on, Farah confirms the stages, Grace the steps, and the rule is written down at last.

## What each object stands for

| Object | Stands for |
|---|---|
| A sketch map of Mumbai: the peninsula, the Arabian Sea, the mainland across the creek, and the Western and Central suburban lines | The city the lunch crosses, and the railway it rides |
| A kitchen in the suburbs and an office in the south, joined by a dashed route down the line | One lunch's way, before we follow it |
| A tin (a dabba) with painted marks on its lid | A lunch on its way, and the code read at every hand-off |
| A home, a cyclist who rides in and off again, two stations, a train, a tower; a glowing tin crossing between them | One value stream, from kitchen to desk |
| Rings that glow as the tin passes | The hand-offs |
| Many small lights moving down both lines on the map, then back up | The scale: some two hundred thousand lunches a day, there and back |
| The stations on the map pulsing, each with a small lid beside it | The sorting, where the detail lives |
| Three amber chevrons: lunch leaves home · lunch arrives · the tin comes back | The customer's view: a few stages |
| A night street, a tree whose limb cracks, swings down onto the line, sags it and snaps it, and hangs from the trunk; leaves torn off; a wire on the ground; windows going dark | The outage, and the household inside it |
| A phone glowing in one window, and a phone panel: calling the faults line | The trigger of the value stream |
| A sketch of a house with one window lit by a phone | The household, whose side the stream is seen from |
| Four amber chevrons (acknowledge · dispatch · restore · explain), each with ArchiMate's value-stream glyph, and a tag under each | A value stream's stages, and the value each one delivers |
| Struck-through tags: contact centre · control room · outage system | What the household doesn't see |
| Glass capabilities under the chevrons | The capabilities from *What it must be able to do* that each stage leans on |
| Three swimlanes and a path crossing them, with rings at each crossing; one ring red | The teams the work passes through, and the hand-off that goes wrong |
| Tins at the rings | Callback: the detail belongs where the work changes hands |
| A process map: four bands, between "customer needs" and "customer served" | Strategic, operational, support and evaluation processes |
| A dashed arrow from restore supply to measure reliability | Evaluation measures the operational process |
| A small map, one process, then seven step notes in a row, hung from it by a bracket that grows as each step arrives | Process levels 1 to 3 |
| Ticks on six steps, a red ring and a "?" on one | Most steps need no more; one needs detail |
| Five columns headed S, I, P, O, C | A SIPOC: the process's edges |
| A fault record card, and an arrow to "the regulator" | An output that leaves the night: start, end and cause |
| Three fault cards: Hill Street (a wire down), Riverside (life support), East side (1,200 homes) | Three faults, competing for two crews |
| Two vans, dashed arrows to the biggest fault, a red cross | Habit: the biggest fault first |
| BPMN shapes: a start event, two gateways (wire down? life support?), tasks, an end event | The rule, drawn in detail |
| Coloured tokens moving through the diagram | Each fault put through the rule |
| Vans parked under "send a crew first" and "send the next crew", then driving off | The crews going where the rule says |
| Page-shaped data objects, in the information layer's salmon, joined to the gateways | The facts the rule needs, and where each comes from |
| A red "?" beside the network model | A fact nobody is sure of: which homes hang off which transformer |
| Windows lighting again, a crew's van, a phone message | The value delivered: power back, and an answer |
| Chevrons and a process note turning to glass, gold ticks, a rule card with an owner | Confirmed by their owners; the rule written down |

## Script

### 1 · Lunch, across the city · 0:00–0:50

**Narration.** Mumbai, a weekday morning. A home-cooked lunch goes into a tin, and the tin to a dabbawala. On its lid, a few painted marks say where it's going: the station, the building, the floor. By bicycle, train and on foot, it changes hands several times, and reaches a desk across the city by lunchtime. Before the pandemic, about five thousand dabbawalas carried some two hundred thousand lunches a day, with almost no errors. The detail lives where the tins change hands: marks, read at every sorting. The customer sees only three things: lunch leaves home, lunch arrives, the tin comes back.

**Picture.** "Mumbai · a weekday morning". A sketch map of the city at dawn: the long peninsula between the Arabian Sea and the harbour, "Mumbai", and its two main suburban lines drawing themselves up from the south. "a kitchen in the suburbs" lights up in the north, "an office in the south" at the tip, and a dashed route joins them down the line. The camera goes down to the kitchen, and the map gives way to the street: a home on a hazy morning, a tin glowing on the kitchen window sill. A dabbawala, in white with a white cap, rides in on a bicycle, stops at the door, and the tin passes to his handlebar. A panel shows the lid from above, its marks appearing one by one: a red cross, a large 9 ("station"), a 12 ("building"), a 3 ("floor"), while he rides off and the camera follows him down the road. The camera pulls back to the whole route as he reaches the first station; the tin goes up past the sorters on the platform and into the train's open door; the train crosses to the second station; the tin goes to a dabbawala carrying a crate of tins on his head, who walks to an office tower; a window lights: "by lunchtime". A ring glows at each hand-off. Then the camera comes back up from the office to the whole map, and lunches flow down both lines: "before 2020: about 5,000 dabbawalas" · "some 200,000 lunches a day" · "almost no errors". The stations pulse, a small lid beside each: "the detail: where the tins change hands". Three chevrons go up: lunch leaves home · lunch arrives · the tin comes back; the afternoon warms the light, and the lunches flow back up the lines. Wordless breather: the tins still moving, then the title card.

**On screen.** Mumbai · a weekday morning · Mumbai · Arabian Sea · a kitchen in the suburbs · an office in the south · station · building · floor · by lunchtime · before 2020: about 5,000 dabbawalas · some 200,000 lunches a day · almost no errors · the detail: where the tins change hands · lunch leaves home · lunch arrives · the tin comes back · How value reaches people · the customer's view, and detail only where it matters · Film 5 of 11

### 2 · The lights go out · 0:50–1:19

**Narration.** Tomás's next note asks how value reaches people. At ten past two on a stormy morning, a branch falls on a line on Hill Street. Forty homes go dark. Four minutes later, one household calls the faults line, and Tomás follows that call to the lights coming back on. On its way, it will pass through three teams, and a rule nobody has written down.

**Picture.** The wall: Tomás and his note from the end of *What it must be able to do*: "How does value reach people?". Then Hill Street at night, in the rain: houses with lit windows, poles and a line, a tree in the wind, its leaves in heavy, overlapping masses. "2:10 a.m. · Hill Street". The camera moves in as one of the tree's limbs cracks at the trunk and swings down, shedding leaves, onto the line; the line sags under it, then snaps with a flash, and the limb is left hanging from the trunk; soft sparks where the wire touches the ground. The windows go dark, from the fault outwards: "40 homes dark". A phone lights in one window, and a phone panel: "2:14 a.m. · calling · the faults line". The camera pulls back. "three teams" · "a rule nobody has written down".

**On screen.** How does value reach people? · 2:10 a.m. · Hill Street · 40 homes dark · 2:14 a.m. · calling · the faults line · three teams · a rule nobody has written down

### 3 · From the household's side · 1:19–1:56

**Narration.** Farah, the customer advocate, draws the night from the household's side. The household sees no teams and no systems. It sees a few stages, in order. Someone knows the power's out. Help is on its way. The lights come back. And someone says what happened. Each stage ends with something the household gets. That's a value stream: how value reaches a customer, seen from their side. This one: get the power back. A utility has only a handful; meter to cash is another.

**Picture.** Farah, outlined in gold, on the right. A paper sketch of a house, one window lit by a phone: "the household". "the household's view: a few stages, in order". Three tags appear and are struck through: contact centre · control room · outage system. Four amber chevrons arrive in a row, each with ArchiMate's value-stream glyph: acknowledge · dispatch · restore · explain, and under each, what the household gets: someone knows · help on the way · the lights are back · an answer; "each stage: something the household gets". The heading becomes "value stream · get the power back", and below, "how value reaches a customer, seen from their side". A smaller stream arrives underneath: "meter to cash": read · bill · paid. "a handful of value streams".

**On screen.** Farah · customer advocate · the household · the household's view: a few stages, in order · contact centre · control room · outage system · acknowledge · dispatch · restore · explain · someone knows · help on the way · the lights are back · an answer · each stage: something the household gets · value stream · get the power back · how value reaches a customer, seen from their side · meter to cash · read · bill · paid · a handful of value streams

### 4 · Three teams, one stream · 1:56–2:28

**Narration.** Under each stage go the capabilities from his map that make it possible. Finding faults. Dispatching crews. Restoring supply. Informing customers. The work itself passes through three teams: the contact centre, the control room and the field crews. The household sees none of them, and feels only the hand-offs that go wrong. As with the dabbawalas' tins, the detail belongs where the work changes hands.

**Picture.** The four chevrons glide up. Under each, a capability in glass, with the capability glyph: find faults · dispatch crews · restore supply · inform customers. Three swimlanes go up below: contact centre · control room · field crews. The work's path draws itself through them, from a call to the contact centre, down to the control room, down to the field crews and back up; a ring marks each hand-off between lanes. One ring, from the control room to the field crews, turns red with a cross. A small tin appears at each ring: "the detail belongs where the work changes hands".

**On screen.** acknowledge · dispatch · restore · explain · find faults · dispatch crews · restore supply · inform customers · contact centre · control room · field crews · the detail belongs where the work changes hands

### 5 · Four kinds of process · 2:28–3:02

**Narration.** A value stream shows what reaches the customer; a process, how the work gets done. Grace shows him the utility's process map. Every process sits in one of four groups. Strategic processes set direction. Operational ones deliver to customers. Support keeps the rest running. Evaluation measures and improves. Restoring supply is operational. Evaluation measures it: how long, and how often, customers are without power.

**Picture.** The four chevrons over "a value stream: what reaches the customer"; below, five yellow step notes over "a process: how the work gets done". Then Grace, on the right, and the process map, band by band, between "customer needs" and "customer served": strategic (set direction · plan the network · manage risk), operational (connect a home · restore supply · meter to cash, along a dashed arrow from need to served), support (people · finance · technology · fleet and stores), evaluation (measure reliability · audit · improve). Each band lights as it's named. Restore supply lights; a dashed arrow runs from it to measure reliability: "measured: how long, and how often, customers are without power".

**On screen.** acknowledge · dispatch · restore · explain · a value stream: what reaches the customer · take the call · find the fault · decide who goes first · send the crew · repair · a process: how the work gets done · strategic · operational · support · evaluation · set direction · plan the network · manage risk · connect a home · restore supply · meter to cash · people · finance · technology · fleet and stores · measure reliability · audit · improve · customer needs · customer served · measured: how long, and how often, customers are without power

### 6 · Levels, again · 3:02–3:27

**Narration.** Like capabilities, processes have levels. Level one is the map. Level two is one process: restore supply. Level three is its steps. Take the call. Find the fault. Decide who goes first. Send the crew. Repair. Switch back on. Confirm. For most of these steps, a box and an arrow say enough.

**Picture.** "level 1": the process map, small, restore supply lit in it. "level 2": restore supply, larger, with dashed lines from the small map. "level 3": seven yellow step notes in a row, joined by arrows, hung from restore supply by a bracket that grows as each one arrives, as they're named: take the call · find the fault · decide who goes first · send the crew · repair · switch back on · confirm. Six get a green tick; "decide who goes first" gets a red ring and a "?". "for most steps, a box and an arrow say enough".

**On screen.** level 1 · level 2 · level 3 · restore supply · take the call · find the fault · decide who goes first · send the crew · repair · switch back on · confirm · ? · for most steps, a box and an arrow say enough

### 7 · The edges · 3:27–3:56

**Narration.** Before going deeper, Tomás draws its edges. Who supplies it, what comes in, what goes out, to whom: a SIPOC, in Six Sigma's terms. In come calls, alarms from smart meters, and where each crew is. What comes out: power back on, a time to tell customers, and a fault record. The fault record, with its start, end and cause, goes to the regulator.

**Picture.** Five columns, with arrows between their letters: S suppliers · I inputs · P process · O outputs · C customers. The process first: restore supply, "seven steps". Then suppliers and inputs in pairs, blue and salmon notes: households · calls; smart meters · meter alarms; crew vans · crew locations. Then outputs and customers: power back on · households; a time to tell customers · the contact centre; a fault record · the regulator. The fault record is outlined, and a card opens below: "fault record: start 2:10 · end 3:40 · cause: a branch", with an arrow to the regulator.

**On screen.** S · I · P · O · C · suppliers · inputs · process · outputs · customers · restore supply · seven steps · households · smart meters · crew vans · calls · meter alarms · crew locations · power back on · a time to tell customers · a fault record · the contact centre · the regulator · fault record · start 2:10 · end 3:40 · cause: a branch

### 8 · Who goes first · 3:56–4:42

**Narration.** Only one step needs more detail: deciding which crew goes first. Tonight the storm has caused three faults, and two crews are free. On Hill Street, a wire is down. On Riverside, twelve homes, one with someone on life support. On the east side, twelve hundred homes. Left to habit, both crews would go to the biggest fault. The rule says otherwise: wires down first, for safety. Then life support. Then whatever brings back the most homes. Order and state: that's where a process earns detail, step by step, in a notation such as BPMN.

**Picture.** "decide who goes first", close up, outlined in red. Three fault cards arrive along the top: Hill Street (wire down · 40 homes), Riverside (life support · 12 homes), East side (1,200 homes). Two vans, crew 1 and crew 2, appear below the east side; dashed red arrows run from them to it, and a red cross: "by habit: the biggest first". The rule draws itself in BPMN's shapes: a start event, a gateway "wire down?" (yes: send a crew first), a gateway "life support?" (yes: send the next crew), and "rank by homes cut off", then an end event. Each fault, as a coloured token, runs through it in the rule's order: Hill Street to "send a crew first", where crew 1 parks; Riverside to "send the next crew", where crew 2 parks; the east side to the end: "East side: the next crew". "BPMN" · "order and state: where a process earns its detail". Wordless breather: the two crews drive off, in the rule's order.

**On screen.** decide who goes first · Hill Street · wire down · 40 homes · Riverside · life support · 12 homes · East side · 1,200 homes · crew 1 · crew 2 · by habit: the biggest first · wire down? · life support? · yes · no · send a crew first · send the next crew · rank by homes cut off · East side: the next crew · BPMN · order and state: where a process earns its detail

### 9 · What the rule needs · 4:42–5:08

**Narration.** At two in the morning, the rule needs three facts. Which wires are down: from the calls. Who is on life support: from a register. How many homes each fault cuts off: from the network model, which isn't sure which homes hang off which transformer. Wherever order, state or timing matter, that's where the data rules are.

**Picture.** The films' dark glass; the BPMN diagram stays where it was. Over it, three data objects, page-shaped, in the information layer's salmon, each joined to its part of the rule by a dotted line, each lighting its gateway or task in turn: which wires are down (from the calls) · who is on life support (from a register) · homes each fault cuts off (from the network model). A red "?" beside the last: "which homes hang off which transformer?". "order, state, timing: where the data rules are".

**On screen.** which wires are down · from the calls · who is on life support · from a register · homes each fault cuts off · from the network model · ? · which homes hang off which transformer? · wire down? · life support? · rank by homes cut off · send a crew first · send the next crew · yes · no · order, state, timing: where the data rules are

### 10 · Back on · 5:08–5:45

**Narration.** At twenty to four, Hill Street's lights come back on, with a message: a branch on the line, now cleared. Farah confirms the stages, and Grace the steps. The rule for who goes first is written down at last, and Grace owns it. Tomás's note has an answer: value reaches people in a few stages; the detail belongs at one step. Next, he asks who does each step, and what "customer" means to each of them.

**Picture.** Hill Street, "3:40 a.m.": the line mended, the limb cleared and a sawn stub left on the trunk, the crew's van with its light turning; the windows light again from the fault outwards. A phone panel: "3:40 a.m. · Power back on · Hill Street · a branch on the line, now cleared". Then the wall: the four chevrons turn from paper to amber glass, "confirmed · Farah"; "restore supply · 7 steps" turns to yellow glass, "confirmed · Grace"; a rule card goes up: "rule · who goes first: wires down first, then life support, then the most homes", "owner: Grace". Grace in the middle; Tomás on the right. His note "How does value reach people?", and beside it an answer, written out: "A few stages, from the customer's side. Detail at one step: who goes first." A new note: "Who does it, and where does meaning change?". The end card.

**On screen.** 3:40 a.m. · Hill Street · Power back on · a branch on the line, now cleared · acknowledge · dispatch · restore · explain · confirmed · Farah · restore supply · 7 steps · confirmed · Grace · rule · who goes first · wires down first, then life support, then the most homes · owner: Grace · How does value reach people? · A few stages, from the customer's side. Detail at one step: who goes first. · Who does it, and where does meaning change? · See it from the customer's side. Go deep only where it matters. · How value reaches people · Film 5 of 11

## Pause and think

The film can stop at the end of three chapters, with one question each (`site/assets/how-value-reaches-people/think.en.js` and `think.es.js`). The series has no labs yet, so the questions link to none; most answers end with a question to take back to your own organisation, for a class or a team.

| After | Question | Answer |
|---|---|---|
| From the household's side | Drawn from the household's side, what does each stage of the value stream end with? | Something the household gets, such as help on its way. |
| Three teams, one stream | The call passes through the contact centre, the control room and the field crews. Where does the household feel it? | Only at the hand-offs that go wrong. |
| Who goes first | Three faults, two free crews. Which fault comes first? | Wires down first, for safety; then life support; then whatever brings back the most homes. |

## Labs (candidates)

1. **Stages or steps.** Twelve statements about a power cut; sort them into the household's stages and the utility's process steps.
2. **What does the customer get?** A value stream with its stages; write the value each stage delivers, from the customer's side.
3. **Four kinds.** Sixteen processes; sort them into strategic, operational, support and evaluation.
4. **Draw the edges.** A process and a pile of cards; build its SIPOC.
5. **Who goes first?** Five faults and three crews; apply the rule, then find the facts it needs and where each comes from.

## Rigour to check before recording

- **The dabbawalas.** The service dates from 1890, when Mahadeo Havaji Bachche started it in what was then Bombay. Before the COVID-19 pandemic, press coverage commonly gave about 5,000 dabbawalas and about 200,000 lunches a day (estimates range from about 160,000 to 350,000); the association that represents them, the Mumbai Tiffin Box Suppliers Association, has since reported a sharp fall, to around 3,000 workers or fewer, after lockdowns and with remote work and food-delivery apps. The narration therefore says "before the pandemic". The "six sigma" error rate often quoted comes from press coverage, not a formal study, so the film says "almost no errors" (as the proposal advised). Lids carry painted marks (abbreviations, colours, numbers and symbols) for the collection point, the stations, the building and the floor; there's no single published key, so the lid on screen is illustrative. A tin changes hands several times (sources give three or four, some up to six). Dabbawalas travel by bicycle, handcart, suburban train and on foot, and wear white caps. They're drawn in the series' own style, not in the style of Indian art, and the music has no borrowed Indian instruments (PLAYBOOK §2). Check against a source from Mumbai, such as the association's own material, on the day.
- **The map** is a sketch of Mumbai's shape and of its two main suburban railway lines (Western and Central), not a survey or to scale; the Harbour line and other lines are left out, and no national borders are drawn. Check the shape against a map of the city on the day.
- **Value streams** follow BIZBOK and ArchiMate 3.2: an end-to-end sequence of value-adding stages that creates a result for a stakeholder, named from that stakeholder's side, each stage with the value it delivers; stages are enabled by capabilities (a cross-mapping BIZBOK recommends). ArchiMate draws a value stream as a chevron, in the strategy layer, like a capability. "Get the power back" is named from the household's side; "meter to cash" is the industry's usual name for that stream, from the utility's side.
- **The process map** in four groups (strategic, operational, support, evaluation) is a common convention in process management, often used with the process approach of ISO 9001; the standard itself doesn't prescribe the groups. Process levels follow the APQC Process Classification Framework's idea of levels (category, process group, process, activity, task); the film uses "level 1 to 3" loosely, from the map down to one process's steps.
- **SIPOC** (suppliers, inputs, process, outputs, customers) is a Lean Six Sigma tool for scoping a process. **BPMN** is the OMG's Business Process Model and Notation; the shapes on screen (a thin circle for a start event, a thick one for an end event, diamonds with an X for exclusive gateways, rounded boxes for tasks, a folded page for a data object) are BPMN's. The level-4 diagram is drawn in BPMN; the earlier pictures use ArchiMate's glyphs.
- **The restoration rule** is fictional and simplified. Real utilities usually put public safety first (wires down, hazards), then critical loads and customers who depend on power for medical equipment, then restoration by the number of customers affected, with remote switching restoring many homes before crews arrive. Registers of customers who depend on power for medical equipment exist in many markets, under names such as life support registers or priority services registers.
- **"Which homes hang off which transformer"**: distribution networks often don't know exactly which customers are connected to which transformer or phase on the low-voltage network; utilities increasingly use smart-meter data to correct their connectivity models. It's the same gap as "how much solar each street can take" in *What it must be able to do*.
- **"How long, and how often, customers are without power"** are the reliability measures usually called SAIDI and SAIFI; the film doesn't use the names.
- **The figures** (forty homes, 2:10 and 3:40, twelve homes on Riverside, twelve hundred on the east side, two crews) are fictional and plausible.

## Pacing report

From `source/tools/pace.py`, as built: 5:45, 722 words, 125 words a minute, the voice speaking 71% of the time; no sentence with under 0.5 s after it, and no stop of 2.5 s or more inside a chapter. Three wordless moments: the lunches still crossing the city, then the title; the two crews driving off in the rule's order; and the end card. `source/tools/legible.py`: 333 pieces of text, none smaller than 28 px. `source/tools/check.py`: every frame draws.
