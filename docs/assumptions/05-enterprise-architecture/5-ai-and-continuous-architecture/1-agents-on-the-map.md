# Agents on the map: questions and assumptions

*Enterprise architecture* · *AI and continuous architecture*, film 1 · its pull request is linked from the series' README once it merges

[Watch it on the site](https://data.learn-all.org/ai-and-continuous-architecture/agents-on-the-map/), once merged

Film 1 of 6 of *AI and continuous architecture* (`films/ai-and-continuous-architecture/1-agents-on-the-map`), the series' opening film, made from the plan Rodrigo merged on 11 November 2026 (pull request [#318](https://github.com/roanboc/learning-data/pull/318)) and his word that evening: "ok, merged, we can now start the films generation." Each question I would have asked, the assumption I made instead, where it shows, and what changes if it's wrong. The four new series' shared questions are in [`../0-module.md`](../0-module.md).

Written 12 November 2026.

| # | Question | Assumption made | Where it shows | If it's wrong |
|---|---|---|---|---|
| 1 | Which part of Etemenanki's story opens the series? | The rebuilding, as the plan's table says: many hands, each with a task. About 620 BCE Nabopolassar finds it "very weak" and "allowed to collapse"; a survey team with a rod, master builders with ropes, the work split into four tasks, the king carrying bricks on his head; 15 metres by his death in 605; finished by his son with people from many lands. Every line checked against RINBE 1/1 (Npl. 6, Nbk. 27) | *Many hands* (chapter 1), the poster | Chapter 1 |
| 2 | How are the gods named? | As the Babylonians named them, as the king's belief, without comment: "the king writes that Marduk commanded him"; "the house of their god" | *Many hands* | A few words |
| 3 | When did the rebuilding start? | The inscription doesn't say; Nabopolassar held all Babylonia from the end of 620, so the film says "about 620 BCE" | The first line | One number |
| 4 | How is the Tower of Babel told? | As a story many scholars think Babylon's tower may have inspired, in the Book of Genesis, never as history; that Babylon's builders "spoke many languages" is my inference from where Nebuchadnezzar says they came from (the Mediterranean to the Gulf), not a line of an inscription | *Many languages, one plan* (chapter 10) | One line |
| 5 | Which agents does Tomás find? | Six and a helper, where the map showed two: the outage agent and the map agent (on it), the website chat, the network analysts' crew planner, a meter agent that drafts work orders, the field app's assistant, and a helper on each billing officer's sign-in. The plan said "five more"; I changed it to three more and a helper, and corrected the plan | *How many agents?*, *Every agent on the map* | A tally and a few cards |
| 6 | How far may the chat go on each task? | As the author's method, set by the process's owner: answering a bill question, run; a request for more time, draft; what's owed and paid, inform; agreeing the plan, not at all; checking it against the hardship rules, verify. Five stages is linked as how an agent earns more | *How far, task by task* | The steps on five tasks |
| 7 | Who answers for the chat? | The head of retail, who owns the process, named by role as in *The map before the data*; in Spanish, *quien dirige comercialización*, so no gender is given | *Someone who answers* | One card |
| 8 | Which identities, and which hand-off? | Two identities, one that may read bills and one that may only write requests into billing's queue; anyone who mentions hardship, illness or life support goes to a person, the same day, and the agent says so | *Its own name, and a hand-off* | Two cards and a line |
| 9 | What do NIST's and ISO's frameworks ask? | "Clear roles, and people accountable for each AI system". The first draft said "a named person accountable for each AI system", which says more than GOVERN 2 or clause 5.3 do, so I reworded and re-voiced it before release | *Someone who answers* | One line |
| 10 | How is the vendor shown? | Named by role only, with no product: "its vendor switched it on in an update to the contact centre's software"; it answers to the utility under its contract | *A plan nobody saw*, *Someone who answers* | A few words |
| 11 | What happens to the 212 plans? | Billing honours every one, refunds the late fees and calls each household; the vendor's setting is switched off, and the chat drafts plans now | *Every agent on the map* | Two lines |
| 12 | Does Farah join the series' people? | Yes, as *The map before the data* gives her: Farah Siddiqui, the customer advocate. Added to the series' `series.json` | The series page | One row |
| 13 | Which sound? | The series' palette (low strings and horn for Babylon, harp and celesta for the present), D minor to D major, then F major; the horn leads. Nothing from the region's music. `quiet.py` passes | The score | `score.py` |
| 14 | Spanish words | Title *Agentes en el mapa*, kicker *Agentes en la arquitectura*; a billing officer is *un gestor de facturación*, never *agente*; *permisos* for rights, *una derivación* for a hand-off; *Nabopolasar*, *Nabucodonosor*, *Babilonia* | Spanish captions and page | The Spanish files |
| 15 | How long? | 8:37, eleven chapters, 134 words a minute (every chapter 132 to 139 but the closing one), the voice 74% of the time | The film | Lines cut |
| 16 | Pause and think | Three questions, after *Software in a role*, *How far, task by task* and *Someone who answers*; right answers at options 2, 3 and 1, one near miss each; no lab link until the series' labs are made | The film's page | The packs |
| 17 | The poster | The four tasks over the ruin, at 1:00 | The series page and the film's card | `film.json`'s poster moment |
| 18 | A review page? | None made in the session, as Rodrigo asked for films merged on green: it goes on the *Films to check* list once it merges, and he watches it on the site | The *Films to check* list | A review page on request |
| 19 | The soundtrack's release | Nothing to run by hand: `audio.json` with the MP3 beside it (`git add -f`); *Store audio outside Git* publishes and verifies the release when the film reaches main | The film's page | Only where the MP3 is kept |
