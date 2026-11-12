# AI and continuous architecture · Agents on the map: script

*The script of *Agents on the map*, film 1 of 6 of *AI and continuous architecture*, the last series on enterprise architecture, as built: 8:37, in eleven chapters, in English, 12 November 2026. Written from the series' plan ([`../proposal.md`](../proposal.md), merged on 11 November 2026), which follows ArchiMate 4 and the author's method for agents: how far an agent may go, set for each task (inform, draft, verify or run). Made on stated assumptions while the author was away; this film's questions and assumptions are in [`docs/assumptions/05-enterprise-architecture/5-ai-and-continuous-architecture/1-agents-on-the-map.md`](../../../docs/assumptions/05-enterprise-architecture/5-ai-and-continuous-architecture/1-agents-on-the-map.md). The narration lives in [`source/src/narration.js`](source/src/narration.js) and the pauses in [`source/src/breath.js`](source/src/breath.js); this page and those files say the same thing, and where they differ, the source wins. The title card follows chapter 1; the end card follows chapter 11. Made to read on a phone from the start: on-screen text is at least 28 px in the frame, and none runs over another; the map's other elements, seen from afar, are texture. The Spanish version is its captions and its page; the pictures stay in English.*

## The promise

Every line passes two tests: anyone who has worked beside software that acts on its own can follow it, and an experienced enterprise architect, or someone who governs AI, finds nothing wrong in it. Its idea: agents now arrive in vendors' updates and in teams' own tools, so the map has to show them. Each goes on the map as ArchiMate 4 draws software that works beside people: an application, assigned to a role of its own, never a person's. It covers tasks, never a whole activity, and for each task of a written-down process, the process's owner sets how far it may go: inform a person, draft for them, verify their work, or run the task alone. It works under its own identity, one for each set of rights it needs; its role says when it hands over to a person, and to whom; and the person who owns the process answers for it. It never approves.

**Takeaway:** "Each agent in a role of its own, with its tasks, its identity, a hand-off and someone who answers."

## The story in one paragraph

About 620 BCE, Nabopolassar, Babylon's new king, finds Etemenanki, the temple-tower of the god Marduk, in ruins: in his own words, it "had become very weak, and had been allowed to collapse". For Babylon's people the house of their god lay broken at the centre of their city, and the king writes that Marduk commanded him to raise it, its top to rival the heavens. No one crew could: its base was about 90 metres on each side, and every brick was made and carried by hand. So nobody was told to build the whole tower. A survey team measured the ground with a rod, master builders stretched ropes for its plan, and the work was split into tasks: moulding bricks, firing them, carrying baskets, bringing bitumen by river. The king answered for the work, and carried bricks on his head at its foundation. When he died, in 605, it stood about 15 metres high, and his son Nebuchadnezzar finished it with people from many lands. Today the utility's work has many hands too, and some are agents. Tomás's map shows two. Farah brings a household that asked the website's chat for more time to pay: the chat agreed a plan over three months with no late fee, and two weeks later the bill came with one, and a warning that the power could be cut. The chat is an agent its vendor switched on in an update; given a whole activity, payment requests, it agreed 212 plans in six weeks, written in notes billing doesn't read. Tomás finds every agent, six and a helper where the map showed two, and draws each in a role of its own: its tasks and how far it may go on each, set by the head of retail, who owns the process; its own identities; a hand-off to a person; and a person who answers. The vendor's setting is switched off, a check runs on the map with every change, and billing honours the 212 plans, refunds the late fees and calls each household. The Tower of Babel, a story many scholars think Babylon's tower may have inspired, ends with builders who can no longer understand each other. Babylon's real builders spoke many languages, and shared a plan: a task for each, and a name that answered for the work.

## Opening story

The series follows one true story across its six films (the author, 11 November 2026): this film sets its scenario, and its own four beats come from the tower's rebuilding.

| Beat | The line that says it |
|---|---|
| Scenario | "Babylon, about 620 BCE. At the heart of the city stands the temple-tower of its god, Marduk: Etemenanki." "Its new king, Nabopolassar, finds it in ruins. In his own words, it had become very weak, and had been allowed to collapse." |
| Problem | "For the people of Babylon, the house of their god lay broken at the centre of their city." "It had to stand again: the king writes that Marduk commanded him to raise it, its top to rival the heavens." "No one crew could build it: its base was about ninety metres on each side, and every brick was made and carried by hand." |
| Solution | "So no one was told to build the whole tower. Surveyors measured the ground with a rod, and master builders stretched ropes for its plan." "The work was split into tasks: moulding mud bricks, firing them in kilns, carrying baskets, and bringing bitumen, a natural tar, by river." "And the king answered for the work: at its foundation, he carried bricks on his head himself." |
| Benefits | "When he died, in 605 BCE, the tower stood about fifteen metres high." "His son, Nebuchadnezzar, finished it with people from many lands, and their god's house stood again at the heart of the city." Then the same for the utility: "Today, the utility's work has many hands too, and some of them are agents." "Given a task, a role and someone who answers, an agent helps. Given a whole job, it can harm the people it serves." |
| Back to the story | Before the end, with its benefit for the map: "Babylon's real builders came from many lands, and spoke many languages." "What they shared was the plan: a task for each, and a name that answered for the work." Then the answer: "Tomás's note has its answer: each agent in a role of its own, with its tasks, its identity, a hand-off and someone who answers." |

The test: someone who has never heard of Etemenanki can say, from the narration alone, why it was a problem (the house of the people's god lay broken at the centre of their city, and no one crew could rebuild a tower about 90 metres on each side, brick by brick, by hand) and what the fix gave people (a plan, the work split into tasks and a king who answered for it: the tower rose, and their god's house stood again).

## The reference, and practice

The series follows ArchiMate 4 and the four architecture series' own map (`../proposal.md`). This film names, once each:

| Body of knowledge | What the film takes | Where |
|---|---|---|
| ArchiMate 4 (The Open Group, April 2026) | An agent drawn as software that works beside people: an application, assigned to a role of its own | *Software in a role*: "On the map, an agent is drawn as ArchiMate 4 draws software that works beside people" |
| The author's method for agents | How far an agent may go, set for each task of a written-down process by its owner: inform, draft, verify or run | *How far, task by task* |
| *Five stages, not a switch* (the AI agents module) | How an agent earns more, linked once and not taught again | *How far, task by task*: "How an agent earns more is the AI agents module's Five stages, not a switch." |
| Least privilege (Saltzer and Schroeder, 1975), as *Borrowed rights* teaches it | Its own identity, one for each set of rights; logs that say which agent did what; stopped on its own | *Its own name, and a hand-off* |
| The NIST AI Risk Management Framework (AI RMF 1.0, 2023), GOVERN 2 | Roles and responsibilities written down and clear, and people accountable | *Someone who answers*: "AI frameworks, such as NIST's and ISO's, ask the same" |
| ISO/IEC 42001:2023, clause 5.3 and control A.3.2 | Roles, responsibilities and authorities for AI, defined and assigned | The same line |

Where the film differs: ArchiMate has no element for an AI agent, and the frameworks ask for accountability without saying where it's drawn. The film puts both on the map, as *A map people and agents can read* began to: each agent with its role, its tasks and how far, its identity, its hand-off and the person who answers. The four levels are the author's, not a framework's; the AI agents module's five stages are how an agent earns more, and the film links them once. How an agent works (a model, tools, a loop) stays in the AI agents module, and the film says so.

Practice, from the author and the series' plan: look for agents where they leave traces, since an IT service management tool lists applications, not what's switched on inside them (vendors' release notes and contracts, logs of calls to language models, each team's answer); tell an agent from a helper, which works on a person's sign-in with that person's rights; write the process down before setting levels, and set a level for each task, never for the agent as a whole; keep decisions and approvals with people; check the map on every change, so an agent without a role, an identity, a hand-off or a person who answers can't stay on it. Every one of these is said in the film.

## What each object stands for

| On screen | What it stands for |
|---|---|
| Etemenanki in ruins, then rising tier by tier | The work no one crew could do |
| The rod and the ropes pegged out | The plan, made before the work was split |
| Four task cards over the ruin: moulding, firing, carrying, bitumen | Work split into tasks, each with its hands |
| The king carrying bricks at the foundation | Someone who answers for the work |
| A teal glass orb | An agent; dashed and faint, an agent nobody put on the map |
| The map's six glass layers | Tomás's map of the utility, from why it exists down to what it runs on |
| The bill with a late fee, and the warning | The harm a plan nobody saw did |
| The contact centre's notes, which billing doesn't read | Where the chat's 212 plans went |
| The IT service management tool's list, each application with a question mark | What can't say how many agents work here |
| Seven cards: on the map, not on it, a helper | Six agents and a helper, where the map showed two |
| An application assigned to a role of its own | An agent, as ArchiMate 4 draws software that works beside people |
| Four rising steps: inform, draft, verify, run | How far an agent may go on a task |
| Two identities, one that reads bills and one that writes to billing's queue | Its own identities, one for each set of rights |
| A log, and a switch that stops the chat | Which agent did what, and stopping it alone |
| Three cards: the vendor, Tomás, the head of retail | Who answers for an agent |
| The register on the map, an agent to a row | Every agent on the map, with the check that runs on every change |
| The Tower of Babel on a page, its builders' speech marks | A story Babylon's tower may have inspired |

## The look

The series' look, from *The map before the data* (`films/enterprise-architecture/shared/src/`): the six layers in glass, paper drafts and sticky notes, the same people at the same utility; the series' own components in [`../shared/src/aca.js`](../shared/src/aca.js). Babylon is warm clay and fired brick at dawn: the precinct, the Euphrates and its date palms, the tower's mound, then the tower rising stage by stage, drawn in the series' own style, never in the style of Mesopotamian art; its builders are silhouettes in their own clothes, the king among them; no script is imitated, and the kings' words are shown in English. In the present, an agent is *Keeping it true*'s glass orb; one nobody put on the map is dashed and faint. Gold is the business side and its owners, cyan the technical side; four rising steps are how far an agent may go. The poster is the four tasks over the ruin, at 1:00.

## Script

### 1 · Many hands · 0:00–1:46
Babylon at dawn, about 620 BCE: the precinct and Etemenanki's broken mound; the king's words on clay. The people who see the house of their god in ruins; the size of it, 90 metres a side, and a brick carried by hand. The rod and the ropes pegged out; four tasks, each with its hands; the king carrying bricks at the foundation. The tower rises to its first stage by 605, then stands whole at sunrise, built by people from many lands. Then the present, as the whole picture changes: the utility's work, many hands, some of them agents; one agent given a task, a role and someone who answers, then the same agent given a whole job. The title card.

### 2 · On Tomás's map · 1:46–2:34
Tomás's note: where do agents belong on the map? The map's six layers; its two agents, the outage agent and the map agent, each an application in a role, with its rights and its owner, Grace and Tomás. What the series adds; how an agent works stays in the AI agents module.

### 3 · A plan nobody saw · 2:34–3:28
Farah brings the household: the website's chat, a plan over three months and no late fee; two weeks later, the bill with a late fee and a warning. The vendor's update that switched the chat on; the whole activity it was given; whose decision a plan is; the contact centre's notes, which billing doesn't read, and 212 plans in six weeks.

### 4 · How many agents? · 3:28–4:19
The IT service management tool lists applications, each with a question mark. Where agents leave traces: vendors' release notes and contracts, logs of calls to language models, each team's answer. Seven cards: the two on the map, the chat, the crew planner, the meter agent, the field app's assistant, and billing's helper on each officer's sign-in. The tally: six agents and a helper, where the map showed two.

### 5 · Software in a role · 4:19–4:51
The chat drawn as ArchiMate 4 draws software beside people: an application, assigned to a role of its own. In a billing officer's role it would hold every right an officer holds, and its work would look like theirs. It covers tasks; the activity and its decisions stay with people.

### 6 · How far, task by task · 4:51–5:49
The camera carries on from the role to the process, written down, with its owner, the head of retail. The four rising steps. Each task in turn: answering a question about a bill, run; taking a request for more time, draft, and the household told when they'll hear back; what the household owes and has paid, inform; agreeing the plan, not at all; checking the plan against the hardship rules, verify. How an agent earns more is *Five stages, not a switch*.

### 7 · Its own name, and a hand-off · 5:49–6:22
The chat under identities of its own: one may read bills, the other may only write requests into billing's queue. A log that says which agent did what, and a switch that stops the chat alone. Its role's hand-off: hardship, illness or life support, to a person, the same day, and the agent says so.

### 8 · Someone who answers · 6:22–6:58
Farah's question: when the agent is wrong, who answers for it? Not the vendor, which answers under its contract; not Tomás, who draws the map; the head of retail, who owns the process and set its tasks. NIST's and ISO's frameworks ask the same. It never approves: approving is a person's job.

### 9 · Every agent on the map · 6:58–7:46
The register on the map: each agent in a row, with its role, how far, its identity, its hand-off and who answers. The crew planner drafts rosters, a supervisor approves, Grace answers. The vendor's setting switched off: the chat drafts plans now. The check that runs with every change; the field app's assistant flagged. The 212 plans honoured, the late fees refunded, each household called.

### 10 · Many languages, one plan · 7:46–8:18
Babylon's tower beside a page: the Tower of Babel, in the Book of Genesis, a story many scholars think it may have inspired. In the story, one language, then none they share, and the building stops. Babylon's real builders, from many lands, speaking many languages, sharing one plan. A wordless moment of the builders at work.

### 11 · Agents on the map · 8:18–8:37
Tomás's note and its answer, beside the map with every agent on it. Next, the platform they all run on. The end card.

## Sound

The series' palette (`../proposal.md`, 11 November 2026), made in [`source/tools/score.py`](source/tools/score.py) with From words to data's instruments: for Babylon, low bowed strings and a soft horn, with clay, brick, basket, rope, fire and water as its sounds, and nothing borrowed from the region's music; for the present, a harp, with a celesta wherever an agent acts. The series' mark, four notes rising like a tower's tiers (a fifth, a fourth, a third), on the horn and the harp together, at the title and the end. This film's key is D minor in Babylon, coming to D major as the tower stands again, and F major in the present, each tuned pure from one table of ratios; its lead is the horn, which answers for the work. No chapter is urgent: the plan nobody saw is told calmly. `tools/quiet.py` passes: after the opening, music 16% of the time, coming in once every 13.7 s and at most four times in any 30 s; its loud moments at -29.0 dB and the effects' at -45.8 dB, one at a time.

## Pause and think

After *Software in a role* (why the chat isn't given a billing officer's role: it would hold every right an officer holds, and no one could tell its work from theirs), *How far, task by task* (why it only drafts a request for more time: agreeing a plan is an officer's decision under the hardship rules, not a stage every agent starts at) and *Someone who answers* (why the head of retail answers for it: they own the process and set its tasks; Tomás only draws the map). Right answers at options 2, 3 and 1, one near miss each, in [`site/assets/agents-on-the-map/think.en.js`](../../../site/assets/agents-on-the-map/think.en.js) and its Spanish twin.

## Labs (candidates)

- Find the agents in your organisation: list where they'd leave traces, and tell each agent from a helper on a person's sign-in.
- Take one written-down process and set, for each task, how far an agent may go: inform, draft, verify, run, or not at all; mark the decisions that stay with people.
- Write one agent's page for the map (its role, tasks and levels, identities, hand-off and who answers), then the check that fails an agent missing any of them.

## Rigour to check before recording

Checked on 11 and 12 November 2026:

- **The kings' own words.** Nabopolassar's Etemenanki cylinder (Npl. 6, C31) and Nebuchadnezzar II's (Nbk. 27, C41), in Jamie Novotny and Frauke Weiershäuser, *The Royal Inscriptions of Nabopolassar (625–605 BC) and Nebuchadnezzar II (604–562 BC), Kings of Babylon, Part 1* (RINBE 1/1, 2024, open access at [LMU Munich](https://epub.ub.uni-muenchen.de/118421/)). Npl. 6 i 28–36: Etemenanki "had become very weak (and) had been allowed to collapse", and Marduk "commanded me to firmly secure its foundation ... (and) to have its summit rival the heavens"; i 37–ii 8: brickmolds, "the vast number of workmen levied in my land", mud bricks "without number", baked bricks "like countless drops of rain", and bitumen carried by the Araḫtu River "like a raging flood"; ii 9–23: craftsmen, "a survey team measured the dimensions using a measuring rod (and) master builders stretched out the (measuring) ropes (and) firmly established (its) ground plan"; ii 31–iii 24: the king "carried mud bricks and mud on my head". Nbk. 27 ii 19–44: Nebuchadnezzar "mustered the widespread people ... from the Upper Sea to the Lower Sea, far-off lands" to build it, and raised its superstructure "to have (its summit) rival the heavens". The film says "their god" and "Marduk commanded him", as the king's belief, without comment.
- **The numbers.** The edition's introduction: the base measured 91.5 by 91.5 metres; by Nabopolassar's death in 605, his workmen had raised the first terrace to 15 metres (30 cubits). The rebuilding's start isn't dated in the inscription; Nabopolassar held all Babylonia from the end of 620 (the same introduction), so the film says "about 620 BCE". It says "about ninety metres" and "about fifteen metres", and no tier count, which is uncertain.
- **Many languages.** The peoples Nebuchadnezzar mustered came from the Mediterranean to the Gulf; that they spoke many languages is the film's inference from where they came from, not a line of the inscription. The Tower of Babel is Genesis 11:1–9; the film tells it as a story, and says many scholars think Babylon's tower may have inspired it (RINBE 1/1's note on Borsippa's ziggurat, wrongly taken for the tower until the nineteenth century, gives the story's purpose: to explain why the world's peoples speak many languages).
- **ArchiMate 4.** *ArchiMate 4 Specification* (The Open Group, C260, 27 April 2026), as *The map before the data* uses it: version 4 makes it easier to model processes in which people and machines work together, with role as a generic concept (Marc Lankhorst, "What Really Changes in the ArchiMate 4 Specification and What Does Not", Bizzdesign, 20 August 2026, checked by *A map people and agents can read* on 18 October 2026). ArchiMate has no element for an AI agent; the film draws one as that film did: an application component, assigned to a role of its own. The licensed specification itself wasn't read.
- **Accountability.** NIST AI RMF 1.0 (NIST AI 100-1, January 2023), GOVERN 2: accountability structures so that "the appropriate teams and individuals are empowered, responsible, and trained"; GOVERN 2.1: roles and responsibilities "are documented and are clear to individuals and teams throughout the organization" (the framework's core on [NIST's AI Resource Center](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/), checked on 12 November 2026; its [page](https://www.nist.gov/itl/ai-risk-management-framework) is linked from the film's). ISO/IEC 42001:2023 ([ISO](https://www.iso.org/standard/42001)): clause 5.3 asks top management to assign and communicate the responsibilities and authorities of relevant roles, and its Annex A control on AI roles and responsibilities (A.3.2) asks for them to be defined and allocated; both from secondary sources and NIST's [crosswalk to ISO/IEC 42001](https://airc.nist.gov/docs/NIST_AI_RMF_to_ISO_IEC_42001_Crosswalk.pdf), since the licensed standard itself wasn't read. Neither says "a named person for each AI system", so the film says what both ask: "clear roles, and people accountable for each AI system" (reworded on 12 November 2026 from "a named person accountable", which said more than they do).
- **Practice.** That vendors switch agents on inside software already bought, and that model-call logs and contracts show them, is the author's experience and the series' plan; no vendor or product is named, and no product's release status is said or shown.
- **The utility.** Its people, its regulator's hardship rules, the chat, the six agents and the helper, and its numbers (212 plans in six weeks, three months, two weeks) are invented, in the world of *The map before the data*.

## Pacing report

`tools/pace.py`, 12 November 2026: 8:37.5, 1,157 words, 134 words a minute, the voice 74% of the time; every chapter from 132 to 139 words a minute but the closing one (93, mostly its end card); no sentence with under 0.5 s after it, and no stop of 2.5 s or more inside a chapter.
