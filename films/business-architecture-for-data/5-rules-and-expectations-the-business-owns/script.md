# Business architecture for data · Rules and expectations the business owns: script

*The script of *Rules and expectations the business owns*, film 5 of 5 of *Business architecture for data*, the second series of the topic *Enterprise architecture*, in nine chapters, in English, drawn in the look of *The map before the data*. Written on 12 November 2026 from the series' proposal, which the author confirmed and merged on 11 November 2026 (PR #318), and this film's row in it: business rules and data rules, policies and decisions; quality expectations from the service levels of the steps that use the data; the business sets them, and the data team builds the checks; and why the practice keeps maturing. The series' last film, it also says what the qanat story didn't achieve.*

## The promise

Every line passes two tests: someone new to data work can follow it, and a business architect, a data quality lead or a data architect finds nothing wrong in it. Its idea, from the series' last insight: a late reading is wrong only against its step's service level, so the owner of that step writes down what it expects, and the check follows. It deepens *Rules with a home*, which gave every rule a home, an owner and a reason, and doesn't retell it: it asks where rules come from, and who says how good is good enough.

**Takeaway:** "The business writes down what it expects, and the check follows."

## The story in one paragraph

In the 1960s, at Sehdeh, in Iran, three hamlets, Dastgerd, Parvar and Karton, took their water from one qanat, through a basin with three outlets, one to each hamlet. A qanat's flow rises and falls with the water underground, and drought came about one year in four: in a dry year, a hamlet that took more than its share would leave the others' fields dry. And every year silt washed into the tunnel, so a qanat nobody cleaned would choke, and dry up. Each hamlet needed its fair share, in a dry year as in a wet one, and the tunnel kept open. In the 1600s, under Shah Abbas the Great, an engineer set their shares, eight, eight and nine, and built them into the outlets, eight spans wide, eight, and nine, so whatever came into the basin left it in the same shares. Every year the diggers, the muqannis, cleared the silt, and the mirab, the water master, paid with a free share, saw that each farmer got their water at the proper time. More than three hundred years on, the hamlets still took the shares set for them: in a dry year each got less, but each still got its share. At the utility, the data needs the same: what each step expects of it, written down by its owners, and checked. And the story's end, which it didn't achieve: after the Second World War came deep wells with motor pumps, and in the last fifty years about half of Iran's qanats have run dry. Rules last only while people keep them, and change them when the world changes.

## Opening story

The four beats, each said outright (AGENTS.md, *Every opening story has four beats*), checked against Hans E. Wulff's account of Sehdeh and Paul Ward English's of qanat villages (*Rigour*, below). The series follows one true story across its five films (the author, 11 November 2026); this film, its last, tells the rules a qanat's people kept, and says what the story didn't achieve.

| Beat | The line that says it |
|---|---|
| Scenario | "In the 1960s, at Sehdeh, in Iran, three hamlets took their water from one qanat: Dastgerd, Parvar and Karton." "Its water ran into a basin, and out through three outlets, one to each hamlet." |
| Problem | "But a qanat's flow rises and falls with the water underground, and drought came about one year in four." "In a dry year, a hamlet that took more than its share would leave the others' fields dry." "And every year, silt washed into the tunnel: a qanat nobody cleaned would choke, and dry up." "Each hamlet needed its fair share, in a dry year as in a wet one, and the tunnel kept open." |
| Solution | "In the 1600s, under Shah Abbas the Great, an engineer set their shares: eight, eight and nine." "And the shares were built into the outlets: eight spans wide, eight, and nine." "So whatever came into the basin, in a wet year or a dry one, left it in the same shares." "Every year, the diggers, the muqannis, cleared the silt from the tunnel." "And the mirab, the water master, paid with a free share, saw that each farmer got their water at the proper time." |
| Benefits | "More than three hundred years on, the three hamlets still took the shares set for them." "In a dry year, each got less, but each still got its share." Then the same for data: "At the utility, the data needs the same: what each step expects of it, written down by its owners, and checked." |
| Back to the story | In *Written down by its owners*: "At Sehdeh, the shares were set first, and the outlets built to them." "Here too, the expectation comes first, and the check is built from it." And at the end, with what the story didn't achieve and its lesson for data: "At Sehdeh, the shares held for more than three hundred years, while the outlets were kept and the tunnel cleaned." "In the last fifty years, about half of Iran's qanats have run dry, from poor upkeep, or as wells lowered the water underground." "Rules last only while people keep them, and change them when the world changes." "At the utility, each expectation has an owner, who changes it when the business does." |

The test: someone who has never heard of a qanat can say, from the narration alone, why it was a problem (the water that reached the basin rose and fell, and drought came about one year in four, so in a dry year a hamlet that took more than its share would leave the others' fields dry; and silt washed into the tunnel every year, so a qanat nobody cleaned would choke and dry up) and what the fix gave people (the shares set once, eight, eight and nine, and built into the outlets' widths, so whatever came in left in the same shares; the tunnel cleaned every year and the turns kept by the mirab; so for more than three hundred years each hamlet got its share, less in a dry year, but its share). And what it didn't achieve: the rules held only while people kept them, and deep wells drained the water they shared.

## The reference, and practice

The series' reference holds (`../proposal.md`): the BIZBOK Guide for business architecture; DAMA-DMBOK2 for ownership and data quality; ArchiMate for the map; and, for this film, the ISO 9000 standards' policy, process, procedure and record, OMG's DMN for decisions beside BPMN's flows, and the author's own past material (the proposal, *From the author's past engagements*). Named once each, never taught as products.

- **Where rules come from.** A rule usually starts in a policy: what the business means to do, in its own words (the head of retail's: bills use actual readings wherever they can). Rules make it checkable: *Rules with a home*'s data rule (RUL-020, every reading is marked actual or estimated) and its business rule (RUL-021, an estimate is replaced when the actual reading arrives), which the film names and doesn't retell. Processes carry the policy out, a procedure says how a step is done, and records show it was done: the chain the author's material draws from ISO 9000, whose standards define each of the four words.
- **A decision, in a table.** Some steps decide. Check readings, drawn at level three in BPMN in *Processes, as deep as data needs*, decides whether billing can use each reading; BPMN draws the step and its choice, and the rules it applies go beside it in a DMN decision table, one rule a row, with the hit policy F, the first row that matches. Grace's team owns the table, so a rule changes in the table (a new meter's first reading may be lower than the last) and the flow stays as it is.
- **Late, for whom?** Data quality is fitness for the use the data is put to, as DAMA-DMBOK2 puts it: a reading three hours late for billing was on time for network planning. A reading is late only against the step that needs it, and that step's service level, the reason *Rules with a home* gave timeliness. Billing's had never been written down, so the data team had guessed its own, a day: the gap the film's case turns on.
- **Written down by its owners.** How good is good enough is the business's to say: the owner of the step that uses the data, here the head of retail for billing. The owner of the data, Grace, agrees to meet it. It goes on the map as a requirement, beside the step that realises it, with its owner and reason, and the check is built from what's written (AGENTS.md: a definition starts in the glossary or the data contract catalogue, and the code is built from it).
- **Fixed at the source.** From the author's past material: a source system is accountable for its own data quality; the platform reads sources and never writes to them, and builds a quality rule only when the source can't. The meter system checks each reading as it comes, makes the estimates and reports what's missing; the one check that needs billing's accounts too runs on the platform, and its result goes to the metering lead. Problems are fixed at the source, by its own team.
- **The data practice on the map.** The film's piece of the author's idea (the proposal, *The data practice on the map*): the readings the data team publishes become a data product, *Meter readings*, drawn as an ArchiMate product that bundles the service that provides it and its contract. The contract holds what each of its readers expects, set by that reader's owner, and its checks are built from it (the data team's contracts with the teams that read its data are agreed team to team; AGENTS.md).
- **What the business owns, and what it doesn't.** The owners write down rules and expectations, and decide them; the data team builds and runs the checks, and decides none of them. No owner reviews code, and the film shows no pull request (AGENTS.md: owners and stewards never review pull requests).
- **Why the practice keeps maturing.** The series' last film says what its story didn't achieve (the author, 11 November 2026): Sehdeh's shares held for more than three hundred years, but rules last only while people keep them; deep wells drew the water faster than rain put it back. So each expectation has an owner who changes it when the business does, as billing will when prices change by the hour, and its check follows.

## What each object stands for

- **Sehdeh from above:** the plain at dusk light, the qanat's line of shafts lit from the hills, its water running to a basin with three outlets, one to each hamlet, Dastgerd, Parvar and Karton, each with its fields; a dry year's water falling in the channels; then the outlets' widths, "eight spans wide", lit as they're said.
- **The bars:** three bars, eight, eight and nine, in a glass card, "8 : 8 : 9, whatever comes in", which rise and fall with the flow and keep their shares.
- **The qanat cut away:** its tunnel under the plain, the silt washing in, the tunnel choking and the fields drying; the diggers at a shaft with their windlass and bucket, the silt cleared; the fields' wooden gates opened in turn, and the mirab by them with a lamp.
- **The deep well:** a well beside the qanat with its motor pump, drawing the water underground down, the qanat's water drawing back, and its fields drying.
- **Rules with a home's rules:** three cards, RUL-020, RUL-021 and RUL-022, each with a requirement's glyph in its corner, in the motivation layer's purple, under Tomás's note.
- **The chain:** four cards left to right, the head of retail's policy, the processes (check readings, make bills), the procedure (how to make an estimate: from the same month last year) and the records (a reading: actual or estimated; a bill: if it used an estimate), joined by arrows; the two rules hang below the policy, "makes it checkable"; and a card names the chain: "ISO 9000 · policy · process · procedure · record".
- **The flow and its table:** check readings at level three in BPMN's shapes, as *Processes, as deep as data needs* drew it (a start event, billing day; a task, check each reading; a gateway; send to billing, or estimate; an end event), with its "no" branch drawn above; under the gateway, joined by a dashed line, a DMN decision table, "decision table · can billing use it?", its inputs (reading came? in range? no lower than the last?) and output as columns, its hit policy F in the corner, a row for each rule, and a new row added second, "no: a new meter", for an actual reading; its owner, Grace's team.
- **Billing's day:** a line from midnight to noon on a January billing day, the readings from 2,600 meters held back by a fault, landing until nine; billing at six; the 2,600 estimated bills; the data team's check (each reading within a day: all was well); network planning, a week later (nothing wrong); and the rule over them: "late only against the step that needs it, and that step's service level", then "billing's service level: never written down".
- **Billing's expectation:** a requirement's card, "expectation · billing", its three lines, its owner (head of retail) and "agreed: Grace"; on the map beside check readings, which realises it, with ArchiMate's dotted realisation line, the step before make bills, and its reason; Sehdeh's outlets in a small card, "the shares, set first", "the outlets, built to them"; and the check, in the data team's blue, "built from it".
- **The source and the platform:** the meter system, an application component (owner: Grace; run by: the metering team), with its three checks; the data platform, which reads it, one way, and never writes back; billing, with its active accounts, read too; the check on the platform, "every active account: a reading by 10:00", and its result each billing morning to the metering lead: two active accounts with no reading.
- **The data practice on the map:** the business layer, with the data team, tickets, services and processes of the films before, and now the data product, *Meter readings*, an ArchiMate product, joined by aggregation lines to the service that provides it and to its contract; the contract's card: "what each reader expects", "set by that reader's owner", "checks built from it".
- **The loop:** the owner writes it down, the check follows, the business changes, and round again: "keeps maturing".
- **Tomás's map:** the six layers, the strategy, business and information layers bracketed, "business architecture for data", "drawn"; and "next: data architecture", an arrow to the information layer.

## The look

*The map before the data*'s look, from `films/enterprise-architecture/shared/`: paper drafts on a wall, the confirmed model in glass, the six layers in their colours, and the same people at the same energy utility. The series' own components are in `../shared/src/ba.js`: the plain, the qanat in section, the people of the story as silhouettes and the data practice. In the desert, blue is the water. Processes are the business layer's yellow, concepts the information layer's salmon, and a requirement, a rule or an expectation the motivation layer's purple, with its glyph; amber marks an estimate, and a reading late for the step that needs it; gold an owner, blue the data team.

## Script

### 1 · Eight, eight and nine · 0:00–1:51

In the 1960s, at Sehdeh, in Iran, three hamlets took their water from one qanat: Dastgerd, Parvar and Karton.
Its water ran into a basin, and out through three outlets, one to each hamlet.
But a qanat's flow rises and falls with the water underground, and drought came about one year in four.
In a dry year, a hamlet that took more than its share would leave the others' fields dry.
And every year, silt washed into the tunnel: a qanat nobody cleaned would choke, and dry up.
Each hamlet needed its fair share, in a dry year as in a wet one, and the tunnel kept open.
In the 1600s, under Shah Abbas the Great, an engineer set their shares: eight, eight and nine.
And the shares were built into the outlets: eight spans wide, eight, and nine.
So whatever came into the basin, in a wet year or a dry one, left it in the same shares.
Every year, the diggers, the muqannis, cleared the silt from the tunnel.
And the mirab, the water master, paid with a free share, saw that each farmer got their water at the proper time.
More than three hundred years on, the three hamlets still took the shares set for them.
In a dry year, each got less, but each still got its share.
At the utility, the data needs the same: what each step expects of it, written down by its owners, and checked.

*On screen:* "Sehdeh, Iran · the 1960s": the plain from above, the qanat's shafts lit from the hills, "one qanat", its water running in; the three hamlets named as they're said. The camera comes down to the basin, "a basin, three outlets", "one to each hamlet". The flow rises and falls, "drought: about one year in four"; one outlet takes more, "one takes more", and the others' fields dry, "the others' fields: dry". The qanat cut away: "silt, every year" washes into the tunnel, "nobody cleans it: it chokes", and "the fields dry up". Sehdeh from above again: "a fair share, wet year or dry", "the tunnel kept open", the shafts lit. "the 1600s · Shah Abbas the Great": each outlet lights as its share is said, "8 shares · Dastgerd", "8 shares · Parvar", "9 shares · Karton"; then their widths, "8 spans wide", "8 spans wide", "9 spans wide". The bars, "8 : 8 : 9, whatever comes in", rise and fall from "a wet year" to "a dry year", and keep their shares. The qanat cut away again: the diggers at a shaft with their windlass, "the muqannis: the silt cleared, each year"; then the fields' gates opening in turn, and "the mirab, the water master", with his lamp, "paid with a free share", "each farmer's water, on time". "Sehdeh · the 1960s, more than 300 years on": each outlet lights with its share; the water falls, "less for each, and a share for each". The plain leaves, and the words come in: "at the utility, the data needs the same", "what each step expects of it", "written down by its owners", "and checked". In the pause, the title: *Rules and expectations the business owns*, "what each step expects, written down by its owners".

### 2 · What the business expects · 1:51–2:13

Tomás's next note asks what the business expects of each concept: the rules on it, and how good it must be.
Rules with a home gave every rule a home, an owner and a reason.
Now he asks where rules come from, and who says how good is good enough.

*On screen:* Tomás's wall, his note from the end of *Processes, as deep as data needs*: "What does the business expect of it? The rules on it, how good it must be?", each part glowing as it's said. The camera steps back as *Rules with a home*'s three rules come in under it, each on its card with a requirement's glyph: "a home", "an owner", "a reason". The rules dim, the three words leave, and the two questions come in where they were: "where do rules come from?" and "who says how good is good enough?".

### 3 · Policy, process, procedure · 2:13–3:02

A rule usually starts in a policy: what the business means to do.
The head of retail's policy: bills use actual readings wherever they can.
Rules make it checkable. A data rule: every reading is marked actual or estimated.
A business rule: an estimate is replaced when the actual reading arrives.
Processes carry the policy out: check readings, and make bills.
A procedure says how a step is done, such as how to make an estimate.
And records show it was done: each reading's mark, and each bill's note of an estimate.
Policy, process, procedure, record: it's the chain the ISO 9000 standards draw.

*On screen:* a policy's card in purple, "what the business means to do", then "Bills use actual readings wherever they can." and its owner, "head of retail". The camera steps back as the rules hang below it, "makes it checkable": the data rule, RUL-020, then the business rule, RUL-021. The chain grows to the right, each card joined by an arrow as it's said: the processes, check readings and make bills, each lit; the procedure, "how to make an estimate: from the same month last year"; and the records, "a reading: actual or estimated", "a bill: if it used an estimate". In the room the rules leave, a card: "ISO 9000 · policy · process · procedure · record", each word lit with its card as it's said, "the chain the standards draw".

### 4 · A decision, in a table · 3:02–3:37

Some steps decide. Check readings decides whether billing can use each reading.
BPMN draws that as a step and its choice.
The rules it applies go beside it, in a decision table: DMN, a notation made for decisions.
Each row is one rule: in range and no lower than the last, it's used; failed or missing, it's estimated.
Grace's team owns the table, so a rule changes in the table, and the flow stays as it is.

*On screen:* "check readings · level 3 · BPMN": the flow from *Processes, as deep as data needs*, its gateway glowing as "decides" and "its choice" are said, and its task as "a step". The camera steps back: under the gateway, joined by a dashed line, the decision table comes in, "decision table · can billing use it?", its hit policy F in the corner, "DMN: a notation for decisions". Its rows light as they're said: the first, used; then the three that estimate. Grace comes in, "owner: Grace's team"; a new row slides in second, "no: a new meter", for an actual reading, "a rule changes in the table", and the flow, dimmed, stays where it was: "the flow stays as it is".

### 5 · Late, for whom? · 3:37–4:26

In January, a fault held back the night's readings from two thousand six hundred meters.
They arrived by nine. Billing had run at six, so those households got estimated bills.
The data team's check said all was well: it asked only that each reading arrive within a day.
Network planning, which reads readings a week later, saw nothing wrong either.
So was the reading late? For billing, by three hours. For planning, not at all.
A reading is late only against the step that needs it, and that step's service level.
Billing's had never been written down, so the data team had guessed its own.

*On screen:* "billing day · January": a day from midnight to noon. "2,600 meters: held back", the meters in red at the left; their readings land along the day until "arrived by 09:00"; "billing ran: 06:00" lights before them. A count: "2,600 estimated bills", "billing, at 06:00". The data team's check, "each reading within a day", gets its tick, "all was well"; network planning, "reads them a week later", its tick too. "late?" over the day; "for billing: 3 hours late" in red, "for planning: on time" in green. A card over them: "late only against the step that needs it, and that step's service level". It gives way to a dashed outline, "billing's service level: never written down", and the check's "within a day" turns amber, "a guess". In the pause, the two answers stay side by side.

### 6 · Written down by its owners · 4:26–5:13

How good is good enough is the business's to say: the owner of the step that uses the data.
The head of retail moves billing to ten, and writes down what billing needs.
By ten on billing day, a reading or an estimate for every active meter, and no more than one in a hundred estimated.
Grace, who owns readings, agrees to meet it.
It goes on the map beside check readings, with its owner and reason: billing's service level.
At Sehdeh, the shares were set first, and the outlets built to them.
Here too, the expectation comes first, and the check is built from it.

*On screen:* the day stays, carried on from *Late, for whom?*: billing lights, "its owner: head of retail", and moves from six to ten, "billing: 10:00". A requirement's card, "expectation · billing", is written line by line as it's said: "by 10:00 on billing day", "a reading or an estimate for every active meter", "no more than 1 in 100 estimated", "owner: head of retail"; Grace comes in, "agreed: Grace". The day leaves, and the card moves up onto the map, beside check readings, the step before make bills, which realises it with a dotted line; "reason: billing's service level". At Sehdeh, in a small card: "the shares, set first", "the outlets, built to them", the outlets lighting. Then, under the expectation, the check in the data team's blue, "every active meter: a reading by 10:00", "no more than 1 in 100 estimated", "built from it", and over it, "the expectation comes first".

### 7 · Fixed at the source · 5:13–5:54

The first check is the source's own: the meter system is accountable for its readings.
It checks each one as it comes, makes the estimates, and reports what's missing by ten.
The data platform only reads it and never writes back, so problems are fixed at the source, by its own team.
The data team builds a check only where the source can't.
A reading for every active account needs billing's accounts too, so that check runs on the platform, which reads both.
Each billing morning, its result goes to the metering lead.

*On screen:* "meter system", an application component, "owner: Grace", "run by: the metering team", "accountable for its readings"; its three checks tick in as they're said: "checks each reading as it comes", "makes the estimates", "reports what's missing by 10:00". The data platform comes in, an arrow from the meter system, "reads"; a dashed arrow back is struck out, "never writes back"; "fixed at the source, by its own team". Billing comes in, "owner: head of retail", its "active accounts" read by the platform too; under the platform, a check, "check · on the platform", "every active account: a reading by 10:00", "reads both: readings and accounts". Its result, "each billing morning", "2 active accounts, no reading", goes "to: the metering lead".

### 8 · The data practice · 5:54–6:18

On the data practice's map, the readings the data team publishes become a data product: Meter readings.
Drawn as an ArchiMate product, it bundles the service that provides it and its contract.
Its contract holds what each of its readers expects, set by that reader's owner, and its checks are built from it.

*On screen:* "the data practice, on the map", "business layer": the data team, tickets, services and processes of the films before, with the domains and their owners. The data product comes in, "Meter readings", lit as "ArchiMate product" is said; then the service that provides it, "provide data products", and "its contract", each joined to the product by ArchiMate's aggregation line, a hollow diamond at the product's end. The contract's card: "what each reader expects", "set by that reader's owner", "checks built from it".

### 9 · Kept, and changed · 6:18–7:24

At Sehdeh, the shares held for more than three hundred years, while the outlets were kept and the tunnel cleaned.
But after the Second World War came deep wells with motor pumps, drawing water faster than rain put it back.
In the last fifty years, about half of Iran's qanats have run dry, from poor upkeep, or as wells lowered the water underground.
Rules last only while people keep them, and change them when the world changes.
At the utility, each expectation has an owner, who changes it when the business does.
When prices change by the hour, billing will need a reading for every hour, and its check will follow.
That's why the practice is never built once: it keeps maturing.
What the business owns about its data is drawn. Data architecture, the next series, starts from it.

*On screen:* "more than 300 years": Sehdeh from above, each outlet lighting with its share, "8 · Dastgerd", "8 · Parvar", "9 · Karton", the shafts lit as the tunnel is cleaned. "after the Second World War": the qanat cut away, a deep well beside it, "deep wells, motor pumps"; the water underground falls, "faster than rain puts it back", the qanat's water draws back and its fields dry. A count: "about half", "of Iran's qanats, dry in fifty years", "Iran's hydrologists"; "poor upkeep, or wells lowering the water". The words: "rules last only while people keep them,", "and change them when the world changes". Then billing's expectation again, with its owner; "prices that change by the hour", and its second line becomes "a reading every hour, for every active meter"; "its check will follow": "rebuilt from what's written". The loop: "the owner writes it down", "the check follows", "the business changes", "keeps maturing". Tomás's map: the six layers, the strategy, business and information layers lit and bracketed, "business architecture for data", "drawn"; "next: data architecture", an arrow to the information layer. The end card: "The business writes down what it expects, and the check follows." Film 5 of 5.

## Sound

Each film of the series takes its own sound under the topic's `palettes.md` rules. Nothing new fitted, and the glass harmonica first planned was taken by *Every change, checked*, which reserved it first, so this film, like the series' three films before it, pairs two instruments the site has but no film pairs, and no film of this topic plays: a flugelhorn and a tenor saxophone, alone (`source/tools/score.py`; the film's assumptions file says why). The flugelhorn plays in *Change without surprises*, and the saxophones in *A capability, not a project*'s quartet, never together. Two winds, nothing struck or plucked: a note sounds only while someone keeps breathing into it, as a rule lasts only while people keep it.

- **The lead:** a flugelhorn, soft and plain (A 3 to E 5): a valved bugle with a wide, conical bore, so its note is dark and round. Each note is tongued softly, settling onto its pitch from a few cents under, its higher partials speaking a moment after its lower, with a breath of air; then it holds at one level, no vibrato, and stops as the player lets it go. One note at a time. The bugle's calls were signals every listener agreed on, each sounded at its proper time, as the mirab kept each farmer's turn: it carries the opening story's line, a note as each thing lands, and the film's figure.
- **Its partner:** a tenor saxophone, low and soft (A 2 to A 4), breathed under the flugelhorn: a single reed on a conical brass body, so every harmonic of its pitch sounds, shaped by the instrument's own resonances, with more air in its note than the brass. One note at a time, no vibrato. Kept apart from *Who creates it, who owns it*'s clarinet, also a single reed: the saxophone's every harmonic makes it rounder and reedier than the clarinet's hollow low notes.
- **The film's own figure, *eight, eight and nine*:** D, D and E, the E 9/8 of the D, as the shares were set. The flugelhorn plays it where the engineer sets the shares, where the expectation is set first at the utility, as Sehdeh's outlets light again, and where the shares held for three hundred years; the saxophone plays it an octave lower where a dry year gives each hamlet less, but the same share.
- **The mark:** the flugelhorn plays D, then A, and the saxophone holds the F sharp between them: the three layers this series covers, the business layer between the other two. Under the title, and again under the end card.
- **Its sounds:** the desert's wind; the water in the qanat's channels, one soft texture, falling in a dry year; the silt washing in, and the tunnel choking; the diggers' windlass and pick; the fields' gates and the water let in; the deep well's steel and its motor pump, a low, steady rumble, never a beat; and at the utility, cards, paper, a pen, a stamp, and knocks and taps as things are set on the wall.
- **Nothing borrowed:** no santur or other hammered dulcimer, no ney, no kamancheh, no lute of the region, and no Persian mode. D major and its neighbours, tuned pure from D; B minor where the story turns to a loss: a dry year's fields, the qanat that chokes, the estimated bills, the qanats run dry.
- `tools/quiet.py` passes: under the opening story the music sounds 67% of the time; after it, 25% of the time, coming in 26 times, once every 12.8 s on average and at most four times in any 30 s; its loud moments at -28.6 dB, its loudest notes at -26.9 dB, the effects' loud moments at -46.9 dB, 172 effects, at most three starting in one second; 95 held notes, their levels unchanged by the room. Mixed to -16 LUFS.

## Pause and think

The film stops at the end of three chapters, one question each (`site/assets/rules-and-expectations-the-business-owns/think.en.js` and `think.es.js`). The right answers sit in the second, first and third places, each question has a near miss, and every option is about as long as the others.

| Chapter | Question | Right | Near miss |
|---|---|---|---|
| *A decision, in a table* | Grace's team decides that a reading lower than the last is still actual when the meter is new. What changes? | A row is added to the decision table beside the step, and the BPMN flow stays as it is. | The gateway in the BPMN flow, since that's where check readings chooses what to do. The flow draws the choice; the rules it applies are in the table. |
| *Written down by its owners* | After January's late readings, who writes down what billing needs of them, and when? | The head of retail, who owns billing, the step that uses them, before a check is built. | Grace, who owns readings, since her team makes the data that billing uses each month. She owns the data and agrees to meet the expectation, but the owner of the step that uses it sets it. |
| *Fixed at the source* | A reading comes in far out of range. Where is it caught first, and who puts it right? | In the meter system, which checks each reading as it comes, and its own team fixes it there. | In the meter system as it comes, and the data team corrects the platform's copy to match. The platform never writes back, and a problem is fixed at the source, by its own team. |

## Rigour

Checked on 12 November 2026.

| Claim | Source | Note |
|---|---|---|
| In the 1960s, at Sehdeh, in Iran, three hamlets took their water from one qanat, Dastgerd, Parvar and Karton; its water ran into a basin, and out through three outlets, one to each hamlet | H. E. Wulff, "The Qanats of Iran", *Scientific American* 218 (4), April 1968, pp. 94–105, p. 100: "three hamlets in the region of Sehdeh in western Iran still receive the shares that were allotted to them in the 17th century ... these allocations are built into the outlets from the qanat distribution basin" | Wulff writes in the 1960s of what the hamlets "still receive"; the film says "in Iran", not "western Iran", and doesn't place Sehdeh more closely |
| A qanat's flow rises and falls with the water underground, and drought came about one year in four | P. W. English, "Qanats and Lifeworlds in Iranian Plateau Villages", in *Transformations of Middle Eastern Natural Environments*, Yale F&ES Bulletin 103 (1998), pp. 187–205: drought "on average once every four years"; "Should the water table fall during a drought, so will the amount of water filtering into the water-bearing section of the qanat" | English writes of the plateau's villages, not of Sehdeh by name |
| In a dry year, a hamlet that took more than its share would leave the others' fields dry | English (1998): water distributed by shares, with "strict and unforgiving adherence to communal methods of water rotation"; disputes over water rights where water was short | The film's plain reading of shares in a dry year |
| Every year, silt washed into the tunnel: a qanat nobody cleaned would choke, and dry up | Wulff (1968), p. 99: "Muqanni are continually kept employed cleaning out silt that is washed into the conduit from the aquifer, clearing up roof cave-ins and making other repairs"; English (1998): annual repairs and cleaning, and "When communal efforts fail, village water supplies diminish and in some cases the settlements are abandoned" | |
| In the 1600s, under Shah Abbas the Great, an engineer set their shares, eight, eight and nine, and the shares were built into the outlets, eight spans wide, eight and nine | Wulff (1968), p. 100: "allotted to them in the 17th century by the civil engineer in the reign of Shah Abbas the Great. The hamlets of Dastgerd and Parvar are entitled to eight shares apiece and Karton to nine shares, and these allocations are built into the outlets from the qanat distribution basin: the outlets at Dastgerd and Parvar are eight spans wide and the one at Karton is nine spans wide" | Wulff doesn't name the engineer, nor does the film |
| So whatever came into the basin, in a wet year or a dry one, left it in the same shares | Wulff (1968), as above | The film's reading of shares built into the outlets' widths: outlets side by side at one level share the flow by their widths, whatever it is |
| Every year, the diggers, the muqannis, cleared the silt; the mirab, the water master, paid with a free share, saw that each farmer got their water at the proper time | Wulff (1968), p. 99, as above, and p. 100: villagers "elect a trustworthy water bailiff who sees that each farmer receives his just share of the water at the proper time—and who receives a free share himself for this service. The bailiff is guided by an allocation system that has been fixed for hundreds of years" | Wulff's water bailiff is the series' mirab, the water master; English (1998) names the mirab as the one who guides the water |
| More than three hundred years on, the three hamlets still took the shares set for them; in a dry year each got less, but each still got its share | Wulff (1968), p. 100: they "still receive the shares that were allotted to them in the 17th century" | Shah Abbas the Great reigned from 1588 to 1629, so the shares were set more than three hundred years before Wulff wrote. "Each got less" is the film's reading of fixed shares of a smaller flow |
| After the Second World War came deep wells with motor pumps, drawing water faster than rain put it back | Wulff (1968), p. 105: many farmers "are now drilling wells and using diesel pumps"; English (1998): deep wells draw "without regard to rates of recharge", and "water is fast becoming a non-renewable resource in areas where deep wells are used"; F. Pearce, "After Ruining a Treasured Water Resource, Iran Is Drying Up", *Yale Environment 360*, 18 December 2025, on R. Noori's finding that groundwater depletion began in the early 1950s and coincided with the replacement of qanats by deep wells | "After the Second World War" for the early 1950s |
| In the last fifty years, about half of Iran's qanats have run dry, from poor upkeep, or as wells lowered the water underground | Pearce (2025): "Iranian hydrologists estimate that in the past half century, around half of Iran's qanats have been rendered waterless through poor maintenance or as pumped wells have lowered water tables within hillsides" | An estimate, so the film says "about half" and shows it as Iran's hydrologists' |
| A rule usually starts in a policy; rules make it checkable; processes carry it out, a procedure says how a step is done, and records show it was done: the chain the ISO 9000 standards draw | ISO 9000:2015, *Quality management systems — Fundamentals and vocabulary*, which defines policy, process, procedure ("specified way to carry out an activity or a process") and record ("document stating results achieved or providing evidence of activities performed"); the series' proposal, from the author's past material: "A policy is carried out by processes, processes by procedures, and procedures make and keep the artifacts, as ISO 9000 does" | The standards define the four words; their order as one chain is the author's reading, and the usual shape of a quality management system's documents |
| A data rule (every reading is marked actual or estimated) and a business rule (an estimate is replaced when the actual reading arrives) | *Rules with a home*: RUL-020 and RUL-021, with their homes, owners and reasons | Named, not retold |
| Check readings decides whether billing can use each reading; BPMN draws a step and its choice, and the rules it applies go beside it in a decision table, DMN, one rule a row; the hit policy F takes the first row that matches | OMG, *Decision Model and Notation (DMN)*: decision tables, with inputs and outputs as columns, each rule a row, and hit policies, among them F, first; OMG, *Business Process Model and Notation (BPMN)*, version 2.0.2 (2013): tasks, exclusive gateways and business rule tasks, which DMN's decisions can serve | The flow is *Processes, as deep as data needs*'s; the table's rows and the new meter's row are the utility's own, simplified |
| Grace's team owns the table, so a rule changes in the table, and the flow stays as it is | OMG, DMN, its introduction: a decision is modelled apart from the process that uses it, so the process diagram stays simple and the decision's logic is kept in its own model (paraphrased) | Grace owns readings (*Who creates it, who owns it*) |
| A reading is late only against the step that needs it, and that step's service level | DAMA International, *DAMA-DMBOK*, 2nd edition (2017), chapter 13, *Data Quality*: data is of high quality to the degree that it meets the expectations and needs of its consumers, fit for the purposes they apply it to (paraphrased); *Rules with a home*: "Timeliness, from its service level" | The film applies DMBOK's fitness for purpose to timeliness, with its own case |
| How good is good enough is the business's to say: the owner of the step that uses the data; the expectation is written down first, and the check is built from it | DAMA-DMBOK2, chapter 13: data quality starts from what the business and the data's consumers expect, and its rules are written from those expectations (paraphrased); AGENTS.md, *Owners and stewards never review pull requests*: a definition starts in the glossary or the data contract catalogue, and the code is built from it | The owner of the data agrees to meet it, as Grace does |
| The meter system is accountable for its readings; the data platform only reads it and never writes back; problems are fixed at the source, by its own team; the data team builds a check only where the source can't | The series' proposal, from the author's past material: "A source system is accountable for its own data quality; the platform reads sources and never writes to them, and builds a quality rule only when the source can't" | Meter data systems check, estimate and report readings (validation, editing and estimation; *Processes, as deep as data needs*'s sources) |
| The readings the data team publishes become a data product, drawn as an ArchiMate product that bundles the service that provides it and its contract; the contract holds what each reader expects, set by that reader's owner | The Open Group, *ArchiMate 4 Specification* (2026): a product aggregates services and a contract; the series' proposal, *The data practice on the map*; AGENTS.md: the data team's contracts with the teams that read its data are agreed team to team | The data product's name, *Meter readings*, is the utility's own |
| The utility's numbers: a January fault holding back readings from 2,600 meters until nine, billing at six then ten, the data team's check of a day, network planning a week later, no more than one in a hundred estimated, two active accounts with no reading; prices by the hour and a reading every hour | Invented, as the series' world is; the people are *The map before the data*'s | |

No feature's release status is said or shown.

## Pacing report

`tools/pace.py`, 12 November 2026: 7:24 in nine chapters, 970 words, 131 words a minute, the voice 69% of the time.

| Chapter | Length | Words a minute | Voice | Longest quiet |
|---|---|---|---|---|
| Eight, eight and nine | 1:51 | 132 | 67% | 7.8 s |
| What the business expects | 0:22 | 136 | 65% | 2.4 s |
| Policy, process, procedure | 0:49 | 127 | 74% | 1.6 s |
| A decision, in a table | 0:36 | 130 | 74% | 2.0 s |
| Late, for whom? | 0:49 | 129 | 67% | 4.0 s |
| Written down by its owners | 0:46 | 137 | 68% | 2.4 s |
| Fixed at the source | 0:41 | 135 | 71% | 2.2 s |
| The data practice | 0:24 | 132 | 76% | 1.8 s |
| Kept, and changed | 1:06 | 127 | 68% | 7.6 s |

Every sentence has at least 0.5 s after it, and no chapter stops for 2.5 s or more inside it. *What the business expects* and *Written down by its owners* run at 136 and 137 words a minute, under the 140 a chapter may take; the film as a whole runs at 131. The longest quiets are the opening's title, the two answers to "late, for whom?" held side by side, and the end card, without words.
