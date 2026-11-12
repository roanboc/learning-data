# Business architecture for data · Processes, as deep as data needs: script

*The script of *Processes, as deep as data needs*, film 4 of 5 of *Business architecture for data*, the second series of the topic *Enterprise architecture*, in nine chapters, in English, drawn in the look of *The map before the data*. Written on 12 November 2026 from the series' proposal, which the author confirmed and merged on 11 November 2026 (PR #318), and this film's row in it: the four bands, APQC's levels, breadth first and depth on pain, a SIPOC for each level-2 process naming its business objects, where data is born; ArchiMate for the map and BPMN from level 3; meter to cash, with what each step reads and writes, and only one branch reaching level 3, where the complaints are.*

## The promise

Every line passes two tests: someone new to data work can follow it, and a business architect, a process architect or a data architect finds nothing wrong in it. Its idea, from the series' fifth insight: processes go only as deep as data needs. Levels one and two everywhere, each level-2 process with what it reads and writes, so where each concept is born shows; level three only where someone can name what hurts.

**Takeaway:** "Every process drawn to level two, deeper only where it hurts."

## The story in one paragraph

In the twentieth century, at Mahan, near Kerman, the water of a qanat came round to each of its owners in turn. On one of the town's four qanats the turns made a cycle of twelve days, each day fifteen shares of time; most were more complex, like another whose water passed twelve dividers, each sending it to certain fields at certain times. A turn missed or cut short could leave a field dry until the cycle came round again, and where water was short and turns were disputed, some small villages drew lots each autumn for their place in the cycle; those near its end usually got none. Every owner needed to know when their water would come, and when it would stop. So the cycle was kept in levels: its days, each day's shares, each share in six parts of sixteen minutes, and, where a share had been split among heirs and buyers, single minutes. The mirab, the water master, timed each turn with a water clock, a metal cup with a hole in its base floating in water: each time it filled and sank, one measure of time had passed. Each owner knew when their water would come and when it would stop, down to a single minute in twelve days, and the cycle went only as deep as each owner's share needed. At the utility, the business's work needs the same: its processes drawn in levels, and only as deep as each one needs.

## Opening story

The four beats, each said outright (AGENTS.md, *Every opening story has four beats*), checked against Paul Ward English's account of qanat villages (*Rigour*, below). The series follows one true story across its five films (the author, 11 November 2026); this film tells how a qanat's turns were kept, and how deep.

| Beat | The line that says it |
|---|---|
| Scenario | "In the twentieth century, at Mahan, near Kerman, the water of a qanat, a tunnel from the mountains, came round to each owner in turn." "On one of its four qanats, the turns made a cycle of twelve days, and each day was fifteen shares of time." "Most were more complex: on another, the water passed twelve dividers, each sending it to certain fields at certain times." |
| Problem | "A turn missed, or cut short, could leave a field dry until the cycle came round again." "Where water was short and turns were disputed, some small villages drew lots each autumn for their place in the cycle." "Those near the end of it usually got none." "Every owner needed to know when their water would come, and when it would stop." |
| Solution | "So the cycle was kept in levels: its days, each day's shares, and each share in six parts of sixteen minutes." "Where a share had been split among heirs and buyers, it went down to single minutes." "The mirab, the water master, timed each turn with a water clock: a metal cup with a hole in its base, floating in water." "Each time it filled and sank, one measure of time had passed." |
| Benefits | "So each owner knew when their water would come and when it would stop, down to a single minute in twelve days." "And the cycle went only as deep as each owner's share needed." Then the same for data: "At the utility, the business's work needs the same: its processes drawn in levels, and only as deep as each one needs." |
| Back to the story | In *Levels, and how deep*: "As in Mahan: days and shares everywhere, and minutes only where a share is split." And at the end, with its benefit for data: "On a qanat, the cycle went down to the minute only where a share was split, and every owner knew when their water would come." "At the utility, every process is drawn to level two, and only the branch that hurt goes deeper, to where an estimate is born." |

The test: someone who has never heard of a qanat can say, from the narration alone, why it was a problem (the water came round in a cycle of turns, so a turn missed or cut short left a field dry until the cycle came round again, and where water was short and turns disputed, the owners near the end of the cycle got none; every owner needed to know when their water would come and when it would stop) and what the fix gave people (the cycle kept in levels, days, shares and sixteen-minute parts, down to single minutes only where a share had been split, and timed by the mirab's water clock, so each owner knew when their water would come and stop, to the minute, and nobody kept more detail than their share needed).

## The reference, and practice

The series' reference holds (`../proposal.md`): the BIZBOK Guide for business architecture; DAMA-DMBOK2 for ownership; ArchiMate for the map; and, for this film, the APQC Process Classification Framework's levels, the ISO 9001 process approach and BPMN, with the author's own method for drawing processes (the proposal, *How processes are drawn*). Named once each, never taught as products.

- **What the film adopts.** The author's method: level one in four bands, strategic, operational, support and evaluation, which only sort the processes and aren't elements of the model, so an empty band is a finding; level one, the macro processes, eight to fifteen for a whole organisation; level two, a process with a trigger, an output and one person accountable, three to eight under each macro process; level three, its activities as a flow; level four, each task, kept out of the model. The levels are drawn from APQC's framework, which has five (category, process group, process, activity, task) and a version for utilities; the film says "drawn from", not "the same as".
- **Breadth first, depth on pain.** Levels one and two everywhere; level three only where someone can name what hurts; and the map says which branches weren't drawn deeper, so nobody thinks they were.
- **A SIPOC for each level-2 process.** Supplier, input, process, output and customer, with its trigger and its owner (the author's method adds them). What comes in and goes out are concepts from the map, so a SIPOC shows where each one is born: in the process that first writes it. It finds what's missing too: the payment, born in collecting payments, wasn't on the map.
- **ArchiMate for the map, BPMN from level 3.** ArchiMate keeps levels one and two and where a level-3 process sits; its access lines show what each process reads and writes. BPMN draws the detail from level three down: steps, their order, and the choices between them (the author, 11 November 2026).
- **From practice.** Start where it hurts: last winter's complaints about estimated bills, which Farah, who speaks for the utility's customers, reads. Level three shows what level two couldn't: a second kind of reading, an estimate, is born in checking readings, not at the meter, so tables loaded from the meters never hold one, though every reading is already marked actual or estimated (*Rules with a home*'s RUL-020). The owners decide what follows (Grace, who owns readings: a reading is what the check sends on; the head of retail, who owns bills: each bill says if it used an estimate), and a ticket asks the data team to take its readings from the check; the data team builds it, and decides none of it (AGENTS.md: business users ask in tickets; owners and stewards never review pull requests). The film shows no pull request.
- **The data practice on the map.** The film's piece of the author's idea (the proposal, *The data practice on the map*): the data team's own processes join the business layer, answering a data request, building a data product, taking on a source, each drawn like the utility's, at level two, with its trigger, output, owner and what it reads and writes, and none deeper until something hurts. *Rules and expectations the business owns* starts from the check readings step.

## What each object stands for

- **The ring of turns:** the cycle of one of Mahan's four qanats as a ring of twelve days, drawn from the top, clockwise, with one day lifted out as the dial *What the business needs to know* drew: its fifteen shares of time.
- **The dividers:** another qanat's channel, its water passing twelve dividers, each sending it up or down to its own field in its turn, the fields greening as their turn comes.
- **The village cut away:** the qanat's water reaching the fields at their wooden gates, an owner by each field; the third field's turn missed, and its crop drying.
- **The lots:** a panel over the village, as in some small villages each autumn: owners in a circle, a light going round them as the count does, each one counted out taking the next place in the cycle; the cycle's turns as a bar, and the water running short before its end.
- **The levels:** the cycle kept in levels, a bar for each, each opening from one cell of the bar above: its twelve days; a day's fifteen shares; a share's six parts of sixteen minutes; and a part's sixteen single minutes, opened only where a share was split among heirs and buyers. An owner's water runs along it, from the minute it comes to the minute it stops.
- **The water clock:** a basin of water on a stone ledge at dusk, cut away so its water shows, with the mirab beside it, his hand on its rim; in it a small metal cup with a hole in its base, filling through the hole until it sinks, with a few bubbles.
- **The matrix:** Tomás's matrix as *Who creates it, who owns it* leaves it, the squares where each concept is created lit.
- **Grace's process map:** four bands, each with its processes as ArchiMate process elements in the business layer's yellow: strategic (set direction, plan the network, manage risk), operational (connect a home, restore supply, meter to cash), support (people, finance, technology, fleet and stores) and evaluation (measure reliability, audit, improve). Thirteen in all.
- **The tree of levels:** the thirteen macro processes in a row (level 1), each with its processes below it (level 2); one branch, under meter to cash, drawn down to a small flow (level 3); level 4's tasks in a dashed box, struck out; and the branches not drawn deeper in dashed outlines, with a key.
- **Meter to cash, opened:** the macro process above its five processes; the SIPOC for check readings (supplier: read meters; input: readings; output: readings; customer: make bills; trigger: each billing day; owner: metering lead); the concepts in the information layer's salmon, meter reading, account and bill, with ArchiMate's access lines, dashed, the arrowhead on the concept where a process writes it and on the process where it only reads; each concept's first write drawn solid and lit, "born here" under it; and the payment in a dashed outline, not on the map yet.
- **The meters and the bills:** five meters sending their readings each night, one with none and one failing a check, and the estimate in amber; then one household's bills, November to February, three marked E, then one that caught up all at once.
- **The level-3 flow:** check readings in BPMN's own shapes: a start event (billing day), a task (check each reading), its check as a text annotation (in range? no lower than the last?), a gateway (passes?), a task (send to billing), and, on the path for "no, or none came", a task (estimate from the same month last year) that sends its estimate to billing in the reading's place; an end event; and a data object, "estimated reading", born in the estimate task.
- **The owners' decision:** the data team's table of meter readings (meter, day, kWh and read_type, the column *A map people and agents can read*'s catalogue names), loaded from the meters, so every row says "actual" and the rows of the meter that stopped sending are empty; the glossary's entry for meter reading with Grace's line, "a reading: what the check sends on, read from the meter, or estimated"; a January bill stamped "estimated"; the ticket to the data team, "take readings from the check", from Grace and the head of retail; the empty rows filled with the estimates; and Farah's count.
- **The data practice on the map:** the business layer, with the data team, tickets and service of the films before, and now the data team's own three processes, each at level two, with a short access line to what it reads.

## The look

*The map before the data*'s look, from `films/enterprise-architecture/shared/`: paper drafts on a wall, the confirmed model in glass, the six layers in their colours, and the same people at the same energy utility. The series' own components are in `../shared/src/ba.js`: the village, the qanat in section, the day of water and the data practice. In the desert, blue is the water, and the people of the story are silhouettes. Processes are the business layer's yellow, concepts the information layer's salmon; levels go down the screen; a dashed outline marks a branch not drawn deeper, or a concept not yet on the map; amber marks the estimate; gold an owner, blue the data team.

## Script

### 1 · A cycle of turns · 0:00–1:55

In the twentieth century, at Mahan, near Kerman, the water of a qanat, a tunnel from the mountains, came round to each owner in turn.
On one of its four qanats, the turns made a cycle of twelve days, and each day was fifteen shares of time.
Most were more complex: on another, the water passed twelve dividers, each sending it to certain fields at certain times.
A turn missed, or cut short, could leave a field dry until the cycle came round again.
Where water was short and turns were disputed, some small villages drew lots each autumn for their place in the cycle.
Those near the end of it usually got none.
Every owner needed to know when their water would come, and when it would stop.
So the cycle was kept in levels: its days, each day's shares, and each share in six parts of sixteen minutes.
Where a share had been split among heirs and buyers, it went down to single minutes.
The mirab, the water master, timed each turn with a water clock: a metal cup with a hole in its base, floating in water.
Each time it filled and sank, one measure of time had passed.
So each owner knew when their water would come and when it would stop, down to a single minute in twelve days.
And the cycle went only as deep as each owner's share needed.
At the utility, the business's work needs the same: its processes drawn in levels, and only as deep as each one needs.

*On screen:* "Mahan, near Kerman · the twentieth century": the desert from above, the qanat's line of shafts lit from the mountains to the village, "a qanat: a tunnel from the mountains"; the fields take the water one by one, "each owner, in turn". Then "one of Mahan's four qanats": the ring goes round as the turns are said, "12 days, the cycle" in its middle; one day lifts out, "a day, 15 shares". Another qanat's channel runs in, its twelve dividers coming up along it, each sending the water to its own field in turn: "certain fields, at certain times". The village cut away: the turns go along the fields, the third field's turn is missed and its crop dries, "a turn missed: dry until it comes round". "Some small villages · each autumn": the owners in a circle, a light going round as they're counted, each taking the next place in "the cycle's turns"; the water runs short along the bar, "the end of the cycle: none". "When will my water come?" and "and when will it stop?" over the owners by their fields. The levels: the cycle's twelve days fill in as they're said, a day's fifteen shares, a share's six parts of sixteen minutes, and one part opened to sixteen single minutes, "split among heirs and buyers", its holders in their colours. At dusk, the water clock: "the mirab, the water master", "a water clock", "a metal cup, a hole in its base"; the cup fills through the hole and sinks, "filled and sank: one measure". The levels again: an owner's water runs along the minutes, "comes", then "stops", "down to a single minute in twelve days"; then "only as deep as each share needs": "whole shares: no deeper", "whole parts: no deeper", "a split part: to the minute". The levels leave, and the words come in where they were: "at the utility, the business's work needs", "its processes, drawn in levels", "only as deep as each one needs". In the pause, the title: *Processes, as deep as data needs*, "in levels, and only as deep as each one needs".

### 2 · Where it's born · 1:55–2:15

Tomás's next note asks where each concept is born: in which process, and at which step.
His matrix says which capability creates each one, but a capability is what the utility can do, not how the work runs.
For that, he needs the processes.

*On screen:* Tomás's wall, his note from the end of *Who creates it, who owns it*: "Where is it born? In which process, at which step?", each part glowing as it's said. The note gives way to his matrix, the squares where each concept is created lit; the capabilities that create them glow, "a capability: what the utility can do", "not how the work runs". The matrix leaves: "how the work runs: the processes".

### 3 · Four bands · 2:15–2:54

Grace's process map sorts the utility's processes into four bands: strategic, operational, support and evaluation.
The bands only sort them. They aren't elements of the model.
The operational band holds the work customers feel: connecting a home, restoring supply, and meter to cash.
If a band were empty, that would be a finding in itself: nobody setting direction, or nobody measuring.
These thirteen are level one, the macro processes: eight to fifteen, for a whole organisation.

*On screen:* Grace comes in, and her process map is drawn band by band, each band lit as it's named: strategic, operational, support, evaluation, each with its processes in the business layer's yellow. "bands sort the processes; they aren't elements". The operational band glows, "the operational band: the work customers feel", and connect a home, restore supply and meter to cash light in turn. The strategic band empties to dashed outlines, then the evaluation band: "an empty band: a finding in itself"; both fill again. The thirteen light one after another: "level 1: macro processes, 8 to 15 for a whole organisation".

### 4 · Levels, and how deep · 2:54–3:42

Level two is a process with a trigger, an output and one person accountable, three to eight under each macro process.
Level three is its activities, drawn as a flow. Level four, each task, stays out of the model.
These levels are drawn from APQC's process framework, which has a version for utilities.
Breadth first: levels one and two, everywhere.
Depth only on pain: level three only where someone can name what hurts.
And the map says which branches weren't drawn deeper, so nobody thinks they were.
As in Mahan: days and shares everywhere, and minutes only where a share is split.

*On screen:* the map's processes move into a row, the first level of a tree, the bands' names over them: "level 1". Meter to cash is named, and its processes open below it, "level 2"; a glass card, "level 2 · a process": "a trigger", "an output", "one person accountable", "3 to 8 under each macro process". One of them opens to a small flow, "level 3"; "level 4": "tasks", struck out, "out of the model". "drawn from APQC's process framework", "which has a version for utilities". "breadth first: levels 1 and 2, everywhere": the processes open under every macro process. The flow comes back under check readings only, "where it hurts"; the other branches turn to dashed outlines, with a key: "not drawn deeper". A card, "as in Mahan": the days with their shares, one share opened to its parts and one part to its minutes, "days and shares everywhere, minutes only where a share is split".

### 5 · Meter to cash · 3:42–4:28

Meter to cash is one macro process: from a meter's reading to a paid bill.
At level two, it has five processes: read meters, check readings, make bills, collect payments, and answer billing questions.
Each gets a SIPOC: who supplies it, what comes in, what goes out and to whom, with its trigger and its owner.
What comes in and goes out are concepts from the map: readings, accounts and bills.
A concept is born in the process that first writes it: readings in reading meters, bills in making bills.
And one wasn't on the map yet: the payment, born in collecting payments.

*On screen:* the tree leaves, all but meter to cash, which moves to the top, "level 1", "a reading → a paid bill"; its five processes move into a row below it, each named as it's said, "level 2". The SIPOC for check readings: S, supplier, read meters; I, input, readings; P, process, check readings; O, output, readings; C, customer, make bills; "trigger: each billing day", "owner: metering lead". The SIPOC leaves, and the concepts come in below the row, meter reading, account and bill, with dashed access lines from the processes that read and write them. Reading meters' line to the meter reading turns solid and lit, "born here"; then making bills' line to the bill. Collecting payments writes a new concept in a dashed outline, the payment, "born here", "not on the map yet".

### 6 · Where it hurts · 4:28–5:08

Only one branch needs more.
Last winter, complaints about bills doubled. Reading them, Farah found two in three were about estimated bills.
Most meters send a reading every night. When one doesn't, or its reading fails a check, the bill uses an estimate.
Some meters had stopped sending for weeks, so their households got estimate after estimate, then a bill that caught up all at once.
So check readings goes to level three, drawn in BPMN, the notation for steps, their order and the choices between them.

*On screen:* the concepts leave; check readings stays lit and the rest dim. Farah comes in: "×2, complaints about bills, last winter"; "2 in 3, about estimated bills, Farah, reading them". "every night": five meters send their readings up to read meters; one sends "none", one "fails", and "an estimate" in amber goes to make bills. "one household's bills": November to February, three marked E, "no readings, for weeks", "then one that caught up". Check readings: "level 3, in BPMN"; BPMN's shapes come in as they're named: a step, their order, a choice.

### 7 · Level three · 5:08–6:14

On each billing day, every reading is checked: is it in range, and no lower than the last?
If it passes, it goes to billing.
If it fails, or never came, an estimate is made from the same month last year, and goes to billing in its place.
Level three shows what level two couldn't: a second kind of reading is born here, in this step, not at the meter.
But the data team's tables took readings from the meters, so Farah couldn't see a single estimate in them.
Grace, who owns readings, decides a reading is what the check sends on, read from the meter or estimated.
The head of retail decides each bill says if it used an estimate, and a ticket asks the data team to take readings from the check.
Now Farah can see which households have had estimates, and for how long.

*On screen:* check readings moves up to head the flow, "level 3 · BPMN". The flow is drawn in, in order: "billing day"; "check each reading", "in range?", "no lower than the last?"; "passes?"; "send to billing"; then "no, or none came": "estimate from the same month last year", "in its place", and its estimate joins the flow to billing. The estimate task glows amber, and a data object comes out of it, "estimated reading": "born here, not at the meter". The flow leaves, and the data team's table comes in, "table · meter readings", with meter, day, kWh and read_type: every row "actual", and the rows of the meter that stopped sending empty, "from the meters: no estimates"; beside it, "which households are getting estimates?". The glossary's entry, "business glossary · meter reading", gains Grace's line, "a reading: what the check sends on, read from the meter, or estimated", and "owner: Grace", ticked. A January bill, "head of retail", is stamped "estimated"; a ticket, "ticket · data team", "take readings from the check", "from: Grace and the head of retail"; the empty rows fill with the estimates, "estimated" in amber. Then Farah's count, held in the pause: "this winter", "4,120 households with estimates", "380 of them for four weeks or more".

### 8 · The data practice · 6:14–6:38

On the data practice's map, the data team's own processes join: answering a data request, building a data product, taking on a source.
Each is drawn like the utility's, at level two, with its trigger, its output, its owner, and what it reads and writes.
None goes deeper until something hurts.

*On screen:* the flow and its people leave first; "the data practice, on the map", "business layer": the data team, tickets and service of the films before, the glossary's domains and their owners. Three processes join, each as it's named: answering a data request, building a data product, taking on a source. They glow in turn, "at level two"; a card for the first, "answer a data request": "trigger: a ticket", "output: an answer", "owner: data team lead"; each draws a short access line to what it reads. "level 3: not drawn".

### 9 · As deep as it needs · 6:38–7:11

On a qanat, the cycle went down to the minute only where a share was split, and every owner knew when their water would come.
At the utility, every process is drawn to level two, and only the branch that hurt goes deeper, to where an estimate is born.
Tomás's next note asks what the business expects of each concept: the rules on it, and how good it must be.

*On screen:* the levels of the cycle again, the split part opened to its minutes, "to the minute, only where a share was split"; an owner's water runs along the minutes, "every owner: when it comes". Then the utility's wall: the tree, every macro process's processes drawn, "drawn to level two"; the one branch under check readings drawn deeper, "check readings", "where an estimate is born", the rest dashed. Tomás's next note: "What does the business expect of it? The rules on it, how good it must be?". The end card: "Every process drawn to level two, deeper only where it hurts." Film 4 of 5.

## Sound

Each film of the series takes its own sound under the topic's `palettes.md` rules. Nothing new fitted, so this film, like *What the business needs to know* and *Who creates it, who owns it*, pairs two instruments the site has but no film pairs, and no film of this topic plays: a cylinder music box and a cello, alone (`source/tools/score.py`; the film's assumptions file says why).

- **The lead:** a cylinder music box, its comb low (D 4 to D 6): a comb of steel teeth, each tuned to one note, plucked by the pins of a turning cylinder, each pin in its place, so one turn of the cylinder gives every note its turn, as a qanat's cycle gives every owner theirs. A tooth is plucked and rings, dying away, the low teeth longer than the high, with a faint, higher overtone for a moment as it speaks; a tooth plucked again is stopped first. Played softly, its top cut at 2.5 kHz, and never the mechanism's tick, so nothing pulses. It spreads chords from the bass up under the opening story and at a chapter's turn, and gives single quick notes only where the film goes down to the finest level.
- **Its partner:** a cello, alone, bowed softly in its middle notes (D 3 to A 4), one note at a time and never a chord, with no vibrato: each note swells in as the bow takes the string, holds level and stops as the bow leaves it. The plain line under the music box, at the level where most of the map stays.
- **The film's own figure, *as deep as it needs*:** the cello plays three plain notes, A, F sharp and D, and the music box divides only the middle one into six quick notes, as one share went down to its minutes and the rest didn't. Twice: where a share is split down to single minutes, and where check readings goes to level three.
- **The mark:** the music box plays D, then A, and the cello holds the F sharp between them: the three layers this series covers, the business layer between the other two. Under the title, and again under the end card.
- **Its sounds:** the desert's wind; the water in the channel, one soft texture; the fields' wooden gates and the water let in; the lots drawn, a wooden clack for each place; the water clock's cup filling through its hole, and sinking; and at the utility, cards, paper, a pen, a stamp, and knocks and taps as things are set on the wall.
- **Nothing borrowed:** no santur or other hammered dulcimer, no ney, no lute of the region, and no Persian mode. D major and its neighbours, tuned pure from D; B minor where the story turns to a loss: the owners at the end of the cycle with none, the estimated bills.
- `tools/quiet.py` passes: under the opening story the music sounds 49% of the time; after it, 21% of the time, once every 12.2 s on average and at most four times in any 30 s; its loud moments at -28.1 dB, its loudest notes at -25.8 dB, the effects' loud moments at -46.2 dB, at most five starting in one second; 35 held notes, kept within 0.1 dB in the room. Mixed to -16 LUFS.

## Pause and think

The film stops at the end of three chapters, one question each (`site/assets/processes-as-deep-as-data-needs/think.en.js` and `think.es.js`). The right answers sit in the second, third and first places, each question has a near miss, and every option is about as long as the others.

| Chapter | Question | Right | Near miss |
|---|---|---|---|
| *Levels, and how deep* | Grace has drawn all thirteen macro processes and the processes under each. Which branches does Tomás draw down to level three? | Only those where someone can name what hurts, and the map says which weren't drawn deeper. | The operational band's, since that's the work customers feel; the other bands stay at level two. A band doesn't earn depth; a named pain does. |
| *Meter to cash* | Reading meters writes each reading; checking readings and making bills read it. In which process is the reading born? | In reading meters, the first process that writes it; the two after it only read it. | In checking readings, since a reading counts for billing only once it passes the check. A concept is born where it's first written, and at level two the check only reads it. |
| *Level three* | What did drawing check readings at level three show that level two couldn't? | That a second kind of reading is born in the check: the estimate, made in a reading's place. | Which households had estimates, and for how long, so that Farah could count them this winter. Her count came later, once the data team took its readings from the check. |

## Rigour

Checked on 12 November 2026.

| Claim | Source | Note |
|---|---|---|
| In the twentieth century, at Mahan, near Kerman, the water of a qanat came round to each owner in turn; on one of its four qanats the turns made a cycle of twelve days, each day fifteen shares of time | P. W. English, "Qanats and Lifeworlds in Iranian Plateau Villages", in *Transformations of Middle Eastern Natural Environments*, Yale F&ES Bulletin 103 (1998), pp. 187–205: "In a relatively simple example from Mahan near Kirman, water from one of the towns' four qanats is divided into fifteen sahms with a volume of forty qasabs per day on a twelve day rotation. In this case, each sahm is equal to ninety-six minutes of water once every twelve days" | Fifteen sahms of ninety-six minutes make a day, so the film says "each day was fifteen shares of time", as *What the business needs to know* drew Mahan's day of water. English's fieldwork in the Kerman basin is of the twentieth century (his *City and Village in Iran*, 1966, and "The Qanats of Mahan", 1989) |
| Most were more complex: on another, the water passed twelve dividers, each sending it to certain fields at certain times | English (1998): "Most systems of water distribution, however, are much more complex. In a more typical case based on another qanat in the same settlement, the flow of water passes through twelve separate water dividers or maqsams that allocate water to specific fields at specific times on specified days in a conjoined eighteen, nineteen, and twenty-one day rotation (English 1989)" | The film leaves out the three rotations, which a newcomer needn't follow |
| A turn missed, or cut short, could leave a field dry until the cycle came round again; every owner needed to know when their water would come, and when it would stop | English (1998): water is distributed by "ownership of time shares" in rotations, with "strict and unforgiving adherence to communal methods of water rotation"; the mirab guides the water "to the right field at the right time" | The film's plain reading of a rotation: the next turn comes when the cycle comes round, as *Who creates it, who owns it* reads a missed turn |
| Where water was short and turns were disputed, some small villages drew lots each autumn for their place in the cycle; those near the end of it usually got none | English (1998): "In other very small settlements where disputes over water rights occurred, lotteries were held on the autumnal equinox in an effort to distribute scarcity more equitably. Water owners formed a circle, and at a signal from the village headman threw out any number of fingers ... the person at the end of the count received water on the first hour of the first day of the rotation ... Needless to say, owners near the end of the rotation usually received no water" | "Each autumn" for the autumnal equinox; the lots drawn as owners in a circle, counted round |
| The cycle was kept in levels: its days, each day's shares, and each share in six parts of sixteen minutes; where a share had been split among heirs and buyers, it went down to single minutes | English (1998): "each sahm is subdivided into six dangs, each composed of six habbeh. According to this measurement system, one dang would equal sixteen minutes of water and one habbeh a single minute of water once every twelve days"; shares held, inherited and sold until, in another qanat of the same town, "the owner of the smallest portion has rights to only thirty seconds of water once every twelve days" | English's "six habbeh" to a dang doesn't fit his own sixteen minutes to a dang and one minute to a habbeh; the film follows the minutes, which he states twice, and doesn't name the units. That the finest level was used only where a share was split is the film's reading of a share split by inheritance and sale |
| The mirab timed each turn with a water clock: a metal cup with a hole in its base, floating in water; each time it filled and sank, one measure of time had passed | English (1998): "In the past, mirabs measured units of flow with a water clock (tas) based on the time it took for a metal cup with a hole in the bottom to sink in a container of water. Recently, these clepsydras have been replaced by clocks"; UNESCO, *The Persian Qanat*, World Heritage nomination file: the mirab distributed the water, traditionally using a water clock | English describes the water clock for the plateau's villages, not for Mahan by name; the film shows it with Mahan's mirab, as the way turns were timed |
| Each owner knew when their water would come and when it would stop, down to a single minute in twelve days; the cycle went only as deep as each owner's share needed | English (1998): "one habbeh a single minute of water once every twelve days" | The film's reading of the measurement system: whole shares and whole parts needed no finer level |
| Four bands, strategic, operational, support and evaluation, which only sort the processes and aren't elements of the model; an empty band is a finding | The series' proposal, *How processes are drawn* (the author's own method, checked 11 November 2026) | A common convention in process management, often used with ISO 9001's process approach (ISO 9001:2015, 0.3), which the proposal names; the standard doesn't prescribe the bands. The thirteen macro processes, and which band each sits in, are the utility's own, invented |
| Level one, the macro processes, eight to fifteen for a whole organisation; level two, a process with a trigger, an output and one person accountable, three to eight under each; level three its activities as a flow; level four each task, out of the model; breadth first, depth on pain, and the map says which branches weren't drawn deeper | The series' proposal, *How processes are drawn* (the author's method) | "One person accountable" for the method's "one accountable role" |
| These levels are drawn from APQC's process framework, which has a version for utilities | APQC, *Introduction to APQC's Process Classification Framework* and *Understanding the Elements of APQC's Process Classification Framework* (APQC, Houston): thirteen categories; five levels, category, process group, process, activity and task; "The PCF is not consistently leveled"; industry-specific versions, among them utilities | The author's four levels map onto APQC's five, the macro process covering its category and process group; the film says "drawn from", not "the same as". *How value reaches people* used the levels loosely, from the map down to one process's steps; this film follows the author's method, where the map's processes are level one |
| Each level-2 process gets a SIPOC: who supplies it, what comes in, what goes out and to whom, with its trigger and its owner | M. L. George, D. Rowlands, M. Price and J. Maxey, *The Lean Six Sigma Pocket Toolbook* (McGraw-Hill, 2005): SIPOC, supplier, input, process, output, customer; the series' proposal: "with purpose, trigger and owner" | The trigger and the owner are the author's addition, as the proposal says |
| A concept is born in the process that first writes it; ArchiMate's access lines show what each process reads and writes | The Open Group, *ArchiMate 4 Specification* (2026): the access relationship between a behaviour element and a passive structure element, its arrowhead showing whether it reads or writes; the series' proposal (where data is born; ArchiMate keeps levels 1 and 2) | |
| BPMN, the notation for steps, their order and the choices between them; BPMN from level three | OMG, *Business Process Model and Notation (BPMN)*, version 2.0.2 (2013), also ISO/IEC 19510:2013: tasks, sequence flows, exclusive gateways, start and end events, data objects and text annotations; the author, 11 November 2026: "BPMN will describe the process details after level 3" | |
| Most meters send a reading every night; when one doesn't, or its reading fails a check, the bill uses an estimate, made from the same month last year | Utilities' validation, editing and estimation of meter readings (VEE): California Public Utilities Commission working group, *Monthly VEE*, which estimates from the same period last year; Oncor, *AMS VEE tutorial with estimation examples* (ERCOT, 2013), which takes the prior year's same billing month | The utility's two checks (in range, and no lower than the last) and its rule are its own, simplified, as the series' world is |
| Grace owns readings; the head of retail owns bills; a ticket from them asks the data team to take its readings from the check | *Who creates it, who owns it*: the meter is the network's, Grace's, and the bill retail's, the head of retail's; AGENTS.md: business users ask in tickets, and the data team reviews the pull request | The film shows no pull request |
| Every reading is already marked actual or estimated, in a column the table calls read_type | *Rules with a home*: RUL-020, "every reading is marked actual or estimated", a data rule with its tests; *A map people and agents can read*: the catalogue's column read_type, "actual · estimated" | What this film adds is where the estimate is born: in the check, after the meter, so a table loaded from the meters holds no estimate at all, and the rows of a meter that stopped sending are simply missing |
| The data team's own processes, at level two: answering a data request (trigger: a ticket; output: an answer; owner: the data team lead), building a data product, taking on a source | The series' proposal, *The data practice on the map*: the data team's services and processes in the business layer | |
| The utility's numbers: complaints about bills doubled last winter, two in three about estimated bills, 4,120 households with estimates this winter, 380 of them for four weeks or more; the meters, days and readings in the table | Invented, as the series' world is; the people are *The map before the data*'s | |

No feature's release status is said or shown.

## Pacing report

`tools/pace.py`, 12 November 2026: 7:11 in nine chapters, 938 words, 131 words a minute, the voice 71% of the time.

| Chapter | Length | Words a minute | Voice | Longest quiet |
|---|---|---|---|---|
| A cycle of turns | 1:55 | 135 | 68% | 7.8 s |
| Where it's born | 0:20 | 130 | 72% | 1.6 s |
| Four bands | 0:39 | 117 | 79% | 1.6 s |
| Levels, and how deep | 0:48 | 128 | 72% | 2.6 s |
| Meter to cash | 0:46 | 134 | 74% | 2.4 s |
| Where it hurts | 0:40 | 131 | 78% | 1.8 s |
| Level three | 1:06 | 133 | 67% | 4.8 s |
| The data practice | 0:23 | 132 | 75% | 1.8 s |
| As deep as it needs | 0:34 | 125 | 63% | 7.8 s |

Every sentence has at least 0.5 s after it, and no chapter stops for 2.5 s or more inside it. *Four bands* runs at 117 words a minute, under 120, to give Grace's map time to be drawn band by band; the film as a whole runs at 131. The longest quiets are the opening's title, Farah's count at the end of *Level three*, and the end card, without words.
