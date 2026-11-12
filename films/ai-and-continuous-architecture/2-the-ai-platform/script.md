# AI and continuous architecture · The AI platform: script

*The script of *The AI platform*, film 2 of 6 of *AI and continuous architecture*, the last series on enterprise architecture, as built: 8:02, in eleven chapters, in English, 12 November 2026. Written from the series' plan ([`../proposal.md`](../proposal.md), merged on 11 November 2026), which follows ArchiMate 4 and, for what a platform is, *Platform and solution architecture*'s test. Made on stated assumptions while the author was away; this film's questions and assumptions are in [`docs/assumptions/05-enterprise-architecture/5-ai-and-continuous-architecture/2-the-ai-platform.md`](../../../docs/assumptions/05-enterprise-architecture/5-ai-and-continuous-architecture/2-the-ai-platform.md). The narration lives in [`source/src/narration.js`](source/src/narration.js) and the pauses in [`source/src/breath.js`](source/src/breath.js); this page and those files say the same thing, and where they differ, the source wins. The title card follows chapter 1; the end card follows chapter 11. Made to read on a phone from the start: on-screen text is at least 28 px in the frame, and none runs over another; the map's other elements, seen from afar, are texture. The Spanish version is its captions and its page; the pictures stay in English.*

## The promise

Every line passes two tests: anyone who has used a chat assistant at work can follow it, and an experienced platform or enterprise architect finds nothing wrong in it. Its idea: every agent stands on the same few things, a model to answer with, tools to act with, memory and search. Sorted with *Platform and solution architecture*'s test, those serve no single purpose, so they're the platform's, made once and shared; what each agent is for (its purpose, its instructions and the logic of its tasks) is its own, an application with an owner who answers for it. On the map, the platform's capabilities are drawn once, at the foot, as services every agent uses. In front of every model goes one gateway: each call comes in under the agent's own identity, is written down with what it cost, stays within the agent's limits, and reaches only models the utility has terms with. So when a model is retired, the log says which agents call it, each owner looks at its checks, and they move together. The platform has an owner too, and each agent keeps its own.

**Takeaway:** "Agents share the platform's models, gateway, tools, memory and search; each keeps its own purpose, instructions and logic."

## The story in one paragraph

More than 2,600 years ago, Nabopolassar, king of Babylon, is rebuilding the city's temple-tower and its walls. The city stands on the Euphrates inside two great walls of mud brick dried in the sun; by one estimate, the inner wall alone holds nearly a hundred million bricks. But mud brick doesn't stand up to water: in the king's own words, heavy rains and downpours had carried the wall away, and its foundations had become a heap of ruins. A wall the rain could carry away kept out neither enemies nor the river, and building it again in mud would only wait for the next rains. So the brick is fired, baked hard in kilns and laid in bitumen; Nabopolassar surrounds the city's wall, on the outside, with an embankment of baked brick, and the temple-tower is wrapped in the same brick, a skin nearly sixteen metres thick round its mud-brick core. The embankment protected the city against the river's waters, and two and a half thousand years later, archaeologists found his bricks still in place. Today the utility has six agents on Tomás's map, and under every one are the same few things. Ravi Menon, the platform lead, brings Tomás a note: what should our agents share, and what is each one's own? They find each agent reaching its model a different way, and nobody can say which model answered a customer, or what it costs. Then a provider retires the model the crew planner calls; its notice goes to an analyst who has moved team, and three months later the crew planner stops: rosters by hand, fourteen planned jobs slip, and 310 households have to be told again. Ravi sorts what the agents use with *Platform and solution architecture*'s test: a model, tools, memory and search are shared capabilities, the platform's; what each agent is for is its own. On the map, the platform's capabilities go at the foot, drawn once, under every agent. His team puts a gateway in front of every model: one door, each call under the agent's own identity, written down with its cost, within limits, and only to models the utility has terms with. When another model is retired, the log shows three agents calling it; each owner looks at its checks, and all three move in an afternoon: no roster late, no household told twice. Ravi's team owns the platform; each agent's owner still answers for it. On Databricks, the gateway is Unity Gateway, built on Unity Catalog. In Babylon, the same baked brick went into the river wall and the temple-tower, and what each was for was its builder's.

## Opening story

The series follows one true story across its six films (the author, 11 November 2026): *Agents on the map* set its scenario in Etemenanki's rebuilding, and this film's four beats come from the walls of the same reign, and the baked brick that went into the walls and the tower alike.

| Beat | The line that says it |
|---|---|
| Scenario | "Babylon, more than 2,600 years ago. Its king, Nabopolassar, is rebuilding the city's temple-tower, and its walls." "The city stands on the Euphrates, inside two great walls, built, like most of Babylon, of mud brick dried in the sun." "By one estimate, the inner wall alone holds nearly a hundred million of those bricks." |
| Problem | "But mud brick doesn't stand up to water. In the king's own words, heavy rains and downpours had carried the wall away, and its foundations had become a heap of ruins." "For the people inside, a wall the rain could carry away kept out neither enemies nor the river." "Building it again in mud would only wait for the next rains: whatever faced the water needed a brick the water couldn't wash away." |
| Solution | "So the brick is fired: baked hard in kilns, and laid in bitumen, a natural tar that keeps water out." "Nabopolassar surrounds the city's wall, on the outside, with an embankment of baked brick." "And the temple-tower is wrapped in the same baked brick: its core of mud brick sits inside a skin nearly sixteen metres thick." |
| Benefits | "The embankment protected the city against the river's waters, and it lasted: two and a half thousand years later, archaeologists found his bricks still in place." Then the same for the utility: "At the energy utility today, six agents are on Tomás's map, each in a role of its own." "Under every one are the same few things: a model to answer with, tools to act with, memory, and search." "Like the fired brick, those can be made once and shared, while what each agent is for stays its own." |
| Back to the story | Before the end, with its benefit for the agents: "In Babylon, the same baked brick and the same bitumen went into the river wall and the temple-tower." "What each was for, holding back a river or raising the house of a god, was its builder's." "At the utility, every agent now stands on one platform, and each keeps its own purpose." Then the answer: "Ravi's note has its answer: agents share the platform's models, gateway, tools, memory and search; each keeps its own purpose, instructions and logic." |

The test: someone who has never heard of Babylon's walls can say, from the narration alone, why it was a problem (the rain carried the mud-brick wall away, and a wall the rain could carry away kept out neither enemies nor the river) and what the fix gave people (baked brick laid in bitumen, which the water couldn't wash away: the embankment protected the city against the river, and lasted two and a half thousand years).

## The reference, and practice

The series follows ArchiMate 4 and the four architecture series' own map (`../proposal.md`); for what a platform is, it takes *Platform and solution architecture*'s test. This film names, once each:

| Body of knowledge | What the film takes | Where |
|---|---|---|
| *Platform and solution architecture*'s test (the series before this one) | One purpose, with its logic built in: an application. Shared capabilities, on which many owners build their own: a platform | *Platform or application*: "Ravi sorts what the agents use with the test from Platform and solution architecture." |
| ArchiMate 4 (The Open Group, April 2026), as the series draws the map | The platform's capabilities as services at the foot of the map, which the agents in the application layer use; each agent still an application in a role of its own (*Agents on the map*) | *Under every agent* |
| Least privilege, as *Agents on the map* and *Borrowed rights* teach it | Each call under the agent's own identity, the one its place on the map gives it | *One door to every model* |
| Practice for a gateway in front of models (the author and the series' plan) | One door for every call: identity, a log of which agent, which model, when and what it cost, limits per agent, and only models with agreed terms (where data is kept, no training on it) | *One door to every model* |
| Databricks Unity Gateway (docs checked on 12 November 2026) | The gateway on the platform: built on Unity Catalog; which models each team may use, limits, every call and its cost; splitting calls and falling back; the functions agents use as tools under the data's permissions; Databricks' own models and other providers' through one gateway | *On Databricks* |

Where the film differs: ArchiMate has no element for a model or a gateway; the film draws the platform's capabilities as services at the foot of the map and the gateway as one door, and leaves the notation's details to *The map before the data*. How a model writes its answers, and how an agent uses tools and memory, stays in the AI agents module; the film says only what each is for, in one line. What an agent may read, the platform's search included, is the next film's.

Practice, from the author and the series' plan: sort before you build, with the test, so nothing that serves one purpose ends up on the platform and nothing shared is built six times; never keep a provider's key in an agent's script, and reach every model through the gateway, the vendor's chat included; give each agent its own checks, so a new model can be tried on them; keep each team's costs visible; send a provider's notice to the platform's team, not to whoever set up a key; and keep two owners apart: the platform's team runs the platform and holds the contracts, and each agent's owner agrees before its model changes. Every one of these is said or shown in the film.

## What each object stands for

| On screen | What it stands for |
|---|---|
| Babylon's two walls of pale mud brick, and the brickfield with its moulder and carrier | A city built of what the rain could carry away |
| The rain, and the inner wall slumping into a heap | The problem: mud brick doesn't stand up to water |
| Three clay cards: a baked brick, a kiln, bitumen | The fix: one material, made to last |
| The embankment of baked brick rising along the river, outside the wall | The same brick, for one purpose |
| The temple-tower in section: a mud-brick core in a skin of baked brick | The same brick, for another purpose |
| The dig, and "his bricks, still in place" | What was made once, and made well, lasted |
| A teal glass orb | An agent (*Keeping it true*'s, as in *Agents on the map*) |
| Four coloured blocks under each agent: a model, tools, memory, search | The same few things under every agent |
| One tray under all six agents | The platform: those things made once and shared |
| Ravi's note | The question the film answers |
| Six lines from six agents, each to a different model, three named | Each agent reaching its model its own way |
| The provider's notice, and the analyst who moved team | A retirement nobody was told about |
| The crew planner crossed out, rosters on paper, fourteen jobs, 310 households | The harm: work by hand, jobs late, households told twice |
| Two cards: an application, a platform | *Platform and solution architecture*'s test |
| The tray with a model, tools, memory and search; the panel with a purpose, instructions and logic, and its owner | What's the platform's, and what's each agent's own |
| Tomás's map with the services at its foot | The platform drawn once, under every agent |
| A wall with one door in front of the models | The gateway |
| The log: which agent, which model, when, what it cost | Every call written down |
| A loop stopped at its limit; a model with no terms dimmed | Limits per agent, and only models with agreed terms |
| Ticks on each agent's checks, and each owner's agreement | A model change tried and agreed before it moves |
| A dotted line round the platform, and Ravi's team | The platform's owner |
| Databricks' window: Unity Catalog, models, limits, calls; a split and a fallback; tools under a lock | The gateway on Databricks |

## The look

The series' look, from *The map before the data* (`films/enterprise-architecture/shared/src/`): the six layers in glass, paper notes, the same people at the same utility; the series' own components in [`../shared/src/aca.js`](../shared/src/aca.js). Babylon is warm clay and brick, seen from across the river: pale mud brick dried in the sun, red brick fired in kilns, black bitumen, the Euphrates and its date palms, the rain in grey, all drawn in the series' own style, never in the style of Mesopotamian art; its people are silhouettes in their own clothes, and the king's words are shown in English. In the present, an agent is a teal glass orb; the platform is a tray of four coloured blocks, the same colour for the same capability wherever it appears; the gateway is one door in a wall. Ravi Menon joins the series' people, copied from *Platform and solution architecture*'s source into this film's own (he looked right at full size, facing both ways). Gold is the business side and its owners, cyan the technical side. The poster is the river wall and its new embankment of baked brick, at 1:10.

## Script

### 1 · Mud and fired brick · 0:00–1:59
Babylon at dawn, across the river: the temple-tower and the city's two walls of mud brick; the brickfield, its moulder and a carrier; the inner wall, nearly a hundred million bricks. The rain: the king's words on the wall carried away, and the wall slumping into a heap; the people inside, in the breach. The need, and the fix: three cards, a baked brick, a kiln, bitumen, and a boat bringing bitumen by river. The embankment of baked brick rising outside the wall; the tower in section, its mud-brick core in a skin nearly sixteen metres thick. The storm again, the embankment holding; then the dig, two and a half thousand years later, his bricks still in place. Then the present, as the whole picture changes: six agents on Tomás's map, each in its role; under every one, a model, tools, memory and search; the six stacks become one tray, while each agent's role stays its own. The title card.

### 2 · Each its own way · 1:59–2:43
Ravi Menon, the platform lead, brings Tomás a note: what should our agents share, and what is each one's own? The six agents in a row, each followed to its model: the website chat through its vendor's software, the crew planner with a key in a script, the map agent through the map's own tool; the other three, each its own way. Nobody can say which model answered a customer, or what all of it costs.

### 3 · A model retired · 2:43–3:21
The provider's notice that the model the crew planner calls will be retired, sent to the analyst who set up the key, who has moved to another team. Three months later, on a Monday morning, the crew planner stops; the dispatchers build the week's rosters by hand, fourteen planned jobs slip, and 310 households are told again. Which other agents call that model? Nobody can say.

### 4 · Platform or application · 3:21–4:20
The test, from *Platform and solution architecture*: an application, one purpose with its logic built in; a platform, shared capabilities on which many owners build their own. A model two agents could share slides into the platform's tray, then tools, memory and search, each with what it's for. What each agent is for stays its own: its purpose, its instructions and the logic of its tasks, an application, and its owner answers for it.

### 5 · Under every agent · 4:20–4:54
Tomás's map: the platform's services at its foot, reach a model, call a tool, remember, search; the agents in the application layer, each in its role, with someone who answers, each using those services. Drawn once, under all of them. Which agents use which service.

### 6 · One door to every model · 4:54–5:43
Ravi's room: the six agents, the models, and a gateway with one door, every call going through it. A call under the agent's own identity; the log, row by row; an agent stuck in a loop, stopped at its limit; the utility's terms, and a model without them dimmed; the vendor's chat moving its line behind the gateway.

### 7 · The next retirement · 5:43–6:13
The room glides on. Another provider's notice: the log shows three agents calling the model. The replacement tried on each agent's own checks, a tick for each; each owner agrees; all three move in an afternoon. No roster late, no household told twice.

### 8 · Who owns what · 6:13–6:37
The room glides on. Ravi's team round the platform: it runs it, sets its limits and holds the contracts. Each agent's owner still answers for it, the head of retail for the chat, Grace for the crew planner. Each month, the log shows each team what its agents cost.

### 9 · On Databricks · 6:37–7:15
Databricks' window, Unity Gateway: Unity Catalog's data, models and tools; the door again; the models each team may use, their limits and calls today; a split to try a new model, and a fallback to model A; the functions agents use as tools, under the data's permissions; Databricks' own models and other providers', through the same gateway.

### 10 · One brick, many purposes · 7:15–7:40
Babylon again at dawn: one baked brick; the river wall lit, then the temple-tower, and what each was for, holding back a river, raising the house of a god. Then the six agents on one platform, each with its own purpose; a wordless moment.

### 11 · The AI platform · 7:40–8:02
Tomás and Ravi, the note and its answer, written out, over the six agents on one platform. Next, what an agent may read. The end card.

## Sound

A new palette for this film, reserved on 12 November 2026 in the four architecture series' palettes, made in [`source/tools/score.py`](source/tools/score.py): tuned flowerpots of fired clay, hung on cords and struck softly with felt mallets, each ringing three to five seconds, low (A 3 to E 5), and never set down, so never a knock; and an ocarina, the twelve-hole alto, breathed softly with no vibrato in a small room, in slurred phrases of two to four notes on one breath (A 4 to C sharp 6). Both are fired clay, one struck and one breathed, as one baked brick went into a river wall and a temple-tower. The pots spread each chord from the bass up and give one note as a thing is made or set in place; the ocarina answers them, for what people do with what was made. A major, F sharp minor for what goes wrong (the rain; the model retired with nobody told), tuned pure from A. The film's own figure, once in Babylon and once near the end: three pots struck (A, C sharp, E), then the ocarina playing the same three notes. The series' mark (a fifth, a fourth and a third, rising) is on the pots, the ocarina taking its last note, at the title and the end. *Agents on the map* played the series' first palette, all of whose instruments were already on the site; from this film on, each film takes its own. Nothing new fitted, so this film pairs two instruments the site has, which no film pairs and no film of this topic plays (the palettes file's exception, written down as an assumption). Its sounds: water, wet clay, fired brick, a kiln's fire, bitumen, the rain as one soft texture, a trowel; then paper, keys and soft knocks. No chapter is urgent. `tools/quiet.py` passes: after the opening, music 16% of the time, coming in once every 15.1 s and at most four times in any 30 s; its loud moments at -29.0 dB and the effects' at -46.0 dB, one at a time; held notes moved by the room by at most 0.3 dB.

## Pause and think

After *Platform or application* (which of three things is the platform's: search over the utility's documents, not the crew planner's instructions, nor a model reached with a key in its own script), *One door to every model* (what the gateway does with each call: takes it under the agent's own identity, writes it down and keeps it within limits; it doesn't let an agent pick any model, nor approve answers) and *The next retirement* (who agrees that the crew planner moves to the replacement: Grace, its owner, after looking at its checks, not Ravi's team, which runs the platform). Right answers at options 3, 1 and 2, one near miss each, in [`site/assets/the-ai-platform/think.en.js`](../../../site/assets/the-ai-platform/think.en.js) and its Spanish twin.

## Labs (candidates)

- Sort what your agents use with the test: list each agent's model, tools, memory and search, mark what serves no single purpose, and draw it once at the foot of the map.
- Draw the gateway's log for a week: which agent, which model, when and what it cost; find the agents that call one model, and the one that would stop if it were retired.
- Plan a model change: the agents it touches, each one's checks, each owner who agrees, and the fallback while it moves.

## Rigour to check before recording

Checked on 12 November 2026:

- **The king's own words.** Nabopolassar's inscriptions, in Jamie Novotny and Frauke Weiershäuser, *The Royal Inscriptions of Nabopolassar (625–605 BC) and Nebuchadnezzar II (604–562 BC), Kings of Babylon, Part 1* (RINBE 1/1, 2024, open access at [LMU Munich](https://epub.ub.uni-muenchen.de/118421/)). Npl. 3 (Imgur-Enlil, the inner wall), ii 20–30: "a long time ago it became weak, collapsed, and, on account of heavy rains and downpours, its wall(s) were carried away (and) its foundation(s) had become a heap of ruins"; the film shows those words, shortened, and says the king's belief and his work without comment. Npl. 8, on the edges of baked bricks: Nabopolassar "surrounded the wall of Babylon on the outside with an embankment of baked bricks". The edition's introduction: the walls were "growing old and starting to collapse, due to aging and water damage (heavy rain)", and he "actively reinforced the embankment wall ... with baked brick (and bitumen)", which "ran outside the entire circuit" of the outer wall, and "protected the city against the waters of the Araḫtu River", Babylon's arm of the Euphrates.
- **The numbers.** The same introduction: two walls of sun-dried mud brick, the inner one (Imgur-Enlil) about 96.8 million unbaked bricks and the outer one 28.5 million, so the film says "by one estimate, ... nearly a hundred million". The baked-brick inscriptions were made for the embankment and for Etemenanki's outer mantle, 15.75 metres thick round a mud-brick core: "nearly sixteen metres", and "the same baked brick". "More than 2,600 years ago": his reign, 625 to 605 BCE. "Two and a half thousand years later": Robert Koldewey's excavations of the Kasr, 1899 to 1917, found the embankment's stamped bricks in place (the edition's figure 14), drawn as "the early 1900s".
- **The film's inferences.** That a wall the rain could carry away kept out neither enemies nor the river is the film's reading of what a city wall was for; that the same brick and bitumen went into both works is the edition's, from the bricks' inscriptions.
- **Platform and solution architecture's test.** That series' plan ([`../../platform-and-solution-architecture/proposal.md`](../../platform-and-solution-architecture/proposal.md)): an application has one business purpose, its logic built in and owned with it; a platform offers shared capabilities that serve no single purpose, on which many owners build their own. The film quotes Ravi's line as that series says it.
- **Databricks.** "AI governance with Unity Gateway" ([docs](https://docs.databricks.com/aws/en/ai-gateway/), updated 9 November 2026, read on 12 November 2026): "Unity Gateway is the Databricks governance solution for enterprise AI. Built on Unity Catalog ..."; control which AI services teams can use; rate limits on model services; traffic splitting and fallbacks; "Govern the Unity Catalog functions that agents use as tools, with the same privileges you use for data"; usage tracked in system tables; Databricks' own models (Foundation Model APIs) and external providers through the same access control. Maturity, never said in the film: Unity Gateway generally available on 4 August 2026 ([release notes](https://docs.databricks.com/aws/en/release-notes/unity-gateway/); [August 2026](https://docs.databricks.com/aws/en/release-notes/product/2026/august)), its API on 16 September and consumer access on 15 October 2026; service policies, agent services and the Skills API still in Beta (none of them in the film); in Public Preview on AWS GovCloud. The window in the film is drawn, not a screenshot, and shows only what the docs describe.
- **Practice.** That vendors' chats can reach their models through a customer's gateway, and that a retirement notice goes to whoever registered a key, are the author's experience and the series' plan; the film names no model provider and no vendor, and no product's release status is said or shown.
- **The utility.** Its people, the six agents, the models (A, B, D, E and the vendor's), the notice, the fourteen jobs and the 310 households, the limits and the costs are invented, in the world of *The map before the data*.

## Pacing report

`tools/pace.py`, 12 November 2026: 8:01.6, 1,054 words, 131 words a minute, the voice 71% of the time; every chapter from 123 to 139 words a minute but the closing one (81, mostly its end card); no sentence with under 0.5 s after it, and no stop of 2.5 s or more inside a chapter. *Each its own way* and *One door to every model* first ran at 142 and 150 words a minute; their beats after each line were lengthened (up to 1.7 s), and nothing was cut.
