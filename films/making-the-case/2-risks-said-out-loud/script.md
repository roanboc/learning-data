# Making the case · Risks, said out loud: script

*The script of *Risks, said out loud*, film 2 of 4 of *Making the case*, the second series of the module *Data management*, in six chapters, in English, drawn in the module's sunlit plaster. Written on 10 November 2026 from the module's brief (section 6 of `../../a-plan-in-ninety-days/proposal.md`, the brief for this film) and its numbers (`/mnt/project-files/data-management/numbers.md`), on assumptions the author reviews later: each is listed in the film's assumptions file, and the main ones in `decided.md`.*

## The promise

Every line passes two tests: someone new to data work can follow it, and a data manager, a risk manager or a project manager finds nothing wrong in it. The film's idea: a risk register that lives. Each risk is one sentence (a cause, what could happen, what it would do), with one owner, a likelihood and an impact, a response, a date to look at it again and an early sign; the people who decide set how much risk they'll take, and on what; the register is read every month, and a risk is closed when it's gone. A risk that has happened is an issue. Said early, a risk builds trust; hidden, it spends it.

**Takeaway:** "Name each risk, give it an owner, watch its early sign."

## The story in one paragraph

In February 1911, Roald Amundsen's expedition lays food in three depots on the flat, white ice of the Barrier, for the way back from the South Pole. In fog, a depot a kilometre away can't be seen, and marks set along the route are easily missed once a party drifts off the line. So they mark each depot across the route instead, nine kilometres out on each side: at the first, twenty black flags, each numbered to tell which side the depot lay and how far. A party off course will still cross the line, and a flag will point it in. Ninety-nine days after setting out, on 25 January 1912, all five are home, well, with food to spare. In 2027, Helena's team is about to move 21 reports off the university's old warehouse. In April she asks the data council how much risk it will take, and on what: low for personal data and security, medium for delays, high for new ways to deliver. In May the team writes eight risks in a register, each one sentence with an owner, a response and an early sign, and on 25 May the case is approved with them; but R3, personal data, is only a worry. On 1 June, the day the move begins, a pre-mortem (imagine it's January 2028 and the move has failed: why?) gives R3 its cause from Ivy, the newest: the old extracts take whole tables, personal fields and all. Its owner, Yusuf, writes its response that afternoon: every extract is checked against the protection rules before it moves. On 16 June the check finds the early sign in the access-card report's old extract: 42 columns of the staff list, five shown, and two the catalog tags personal that no report uses. The extract stays behind, and the report is rebuilt from the one governed staff list; R3 never becomes an issue. On 29 June the council's page carries the top three risks; R8 is closed; R7 stays watched. Amundsen's flags were early signs too, set where they'd be crossed in time.

## Opening story

The four beats, each said outright (AGENTS.md, *Every opening story has four beats*), checked against the sources in *Rigour*, below.

| Beat | The line that says it |
|---|---|
| Scenario | "Antarctica, February 1911." "Later that year, Roald Amundsen and four of his team will go to the South Pole and back on skis: about three thousand kilometres." "First, they leave food on the ice along the way, in three stores called depots." |
| Problem | "But the ice is flat and white for hundreds of kilometres. In fog, you could pass a depot a kilometre away, and never see it." "Miss one on the way home, and they run out of food, far from any help." "Marks set along the route are easily missed, and once you drift off the line, you may not find it again." "Something had to change." |
| Solution | "So they talked it through, and marked each depot across the route instead, nine kilometres out on each side." "At the first, twenty black flags, each numbered to tell which side the depot lay, and how far." "Even off course, they would cross the line, and a flag would point them in." |
| Benefits | "Ninety-nine days after setting out, on 25 January 1912, all five were home, well, with food to spare." Then the same for data: "Helena's team is about to move 21 reports off the university's old data warehouse." "Its risks are hard to see too, until one is missed: a report that stops, or personal data where it shouldn't be." "Said out loud, each with an owner and an early sign, they can be found in time." |
| Back to the story | At the end, with its benefit for data: "Said early, a risk builds trust. Hidden, it spends it." "Amundsen's flags were early signs too, set where they'd be crossed in time." |

The test: someone who has never heard of Amundsen can say, from the narration alone, why it was a problem (a depot can't be seen in fog on flat, white ice; marks along the route are missed once you drift off it; a missed depot means no food, far from any help) and what the fix gave people (a line of numbered flags that a party off course would still cross, pointing it to the depot; all five home, well, with food to spare).

## The reference, and practice

The module's spine holds (TOGAF's method, ArchiMate's words, DAMA-DMBOK's areas; `../../a-plan-in-ninety-days/proposal.md`). For risk, the film names two bodies of knowledge, once each:

| Body of knowledge | What the film takes | Where |
|---|---|---|
| ISO 31000:2018, *Risk management: Guidelines* | Its words: a risk's owner, its likelihood and what it would do, the treatment chosen (avoid it, change its likelihood or what it would do, share it, or keep it by an informed decision), and risk read again on a date | *One sentence, one owner*: "ISO 31000, the international standard for managing risk, uses words like these." |
| Gary Klein's pre-mortem (*Harvard Business Review*, September 2007) | Imagine the project has failed, and say why: people find reasons more easily, and say them more freely; each writes alone, then reads one out, in turn | *It failed. Why?* |

Also drawn on, not named: the risk sentence of David Hillson's risk metalanguage (a cause, an event, an effect), said as "a cause, what could happen, and what it would do"; risk appetite as set by the people who decide (the UK government's *Orange Book* is the free guide linked on the page); a risk that has happened is an issue (as most project methods keep a risk register and an issue log apart); and the early warning indicator, said as "an early sign". Where the film differs: the standard speaks of consequence, treatment and retaining a risk; the film says "how bad would it be", "a response" and "accept it", the words practitioners use. Practice, from the brief: one owner each, a person, not a team; say the early sign you'll watch, and watch it; agree the appetite with the people who decide before writing risks down; read the register every month; close a risk when it's gone; a risk to personal data is avoided, not just watched; say a risk early. Every one of these is said in the film, and the first three again in *Read every month*.

## What each object stands for

| On screen | What it stands for |
|---|---|
| A depot: a cairn of snow blocks, its stores in wooden cases, a black flag on a bamboo pole | What must not be missed: the food for the way back |
| Fog over the ice; small marks along the route | A risk that's hard to see, and a watch set where you may never pass |
| Twenty numbered black flags across the route, from above and on the ice | Early signs, set where you'd cross them, each saying where to go |
| A party's track, dashed amber, crossing the line at flag 14 and turning green at the depot | Off course, and still found in time |
| Five pairs of skis by the hut | All five home |
| The council's appetite, three rows of boxes | How much risk the people who decide will take, and on what |
| The risk register, three of its eight rows at a time | Each risk in one line: owner, likelihood, impact, response |
| R1 and R3 in full: the sentence in three parts, the fields below | A risk written well: cause, what could happen, what it would do; owner, date, response, early sign |
| The four response chips | Avoid, reduce, share, accept: one chosen |
| The wall of notes, scribbled | Eight people's reasons, written alone first (marks, not words) |
| HR's system, an extract, a report | What an old extract is: a copy taken from another system |
| The catalog, on a screen | The extract's columns, the five the report shows, the two tagged personal |
| A risk and an issue, side by side | Something that might happen, and something that has |
| The council's one page | The month's top three risks, each with its owner and its early sign |

## The look

The module's sunlit plaster, bundled as it is (`films/the-new-skills/shared/`), with the module's mark (`films/a-plan-in-ninety-days/shared/src/mark.js`) on the title and end cards. Antarctica is drawn in the same matte language, lit from the right like the rooms: the Barrier's flat ice under a pale sky with the sun low, wind ridges in the snow, fog that takes the far ice first; the route on a paper map, with the mountains as an old map draws them; the ice round the first depot from above, on paper, a kilometre to 70 px. Nobody is drawn close, and nobody is a likeness of Amundsen or his team: the depot, the flags, the track and the five pairs of skis by the hut tell it. No dogs are drawn or said. Colour keeps the module's meaning: the plan (the route, the depots, the council's page) in blue, each risk and its early sign in amber, a depot found, a risk closed and a report rebuilt in green, the staff list and its columns in orange; the flags are black, as they were. At the university, Helena, David, Ivy and Yusuf are the module's people; each is drawn at full size, both ways, and checked.

## Script

### 1 · Flags across the route · 0:00–1:56
The Barrier's flat ice, a track running south; "Antarctica, February 1911". The route on a map, to the Pole and back, "About 3,000 km, there and back, on skis", and its three depots. The ice again: a depot, then fog that hides it; "In fog: a depot a kilometre away, unseen"; "Missed on the way home: No food, far from any help". From above: marks along the route, and a party in fog drifting off the line, past the depot; "The depot, missed". Something had to change. The new way, from above: twenty flags drawn out across the route, "9 km" each side. On the ice: the line of black flags, the nearest numbered. In fog again: the party crosses the line, reads flag 14 ("14: east of it, 3.6 km"), turns along it, and finds the depot: "Off course, and still found". Framheim: five pairs of skis set up one by one; "99 days", "25 January 1912: All five home, well, with food to spare"; Amundsen's words. The university: "21 reports to move off the old warehouse"; two risks, hard to see, then each with an owner and an early sign. The title card.

### 2 · How much risk · 1:56–2:36
Tuesday 27 April 2027, the data council. Helena asks: "How much risk will you take, and on what?" The council's appetite: low for personal data and security, medium for delays, high for new ways to deliver, each row filled as it's said. "Personal data: avoided, not just watched." "The team names the risks"; "The council says how much".

### 3 · One sentence, one owner · 2:36–3:55
May: the register, three of its eight rows; a cause, what could happen, what it would do. R1 in full, its sentence in three parts, then its owner, its date, how likely and how bad, its response (the four chips; reduce) and its early sign. "The standard: ISO 31000 (2018)". R8, reduced long before ("Scripts became software"). 25 May: the case, with its eight risks; "The council says yes". R3 picked out: "no cause yet, and no early sign".

### 4 · It failed. Why? · 3:55–5:06
Tuesday 1 June: the move begins. "Imagine: It's January 2028, and the move has failed. Why?"; "A pre-mortem: Gary Klein, Harvard Business Review, 2007"; once failure is a given, reasons come more easily, and are said more freely. The wall: eight people's notes, five minutes alone, then one each, in turn. What an extract is, drawn as it's said: a report, the old warehouse's extract it reads, the copy, HR's system. Ivy's reason. R3 written again: its cause, its owner, its early sign; Yusuf writes its response that afternoon; what no report needs stays behind.

### 5 · The early sign · 5:06–5:53
Wednesday 16 June, the move's third week: Facilities' report of who holds an access card. The catalog on a screen: "42 columns"; the five the report shows, ticked; home address and date of birth tagged personal, "No report uses it"; the two struck from what moves. "Stays behind: The old extract"; "Rebuilt: From the one governed staff list". R3 as a risk, the arrow "Had they moved", and an issue: "Something that has happened". "Locks before the data".

### 6 · Read every month · 5:53–6:57
Tuesday 29 June: the council's one page, room for three; R1, R4 and R3 fill it, R3's sign shown. R8 closed; R7 watched ("How it goes wrong"). "Said early: trust built"; "Hidden: trust spent". Back on the ice: the flags, early signs set where they'd be crossed in time. Four things to do on Monday. The end card.

## Sound

Tuned water glasses, reserved for this film in the module's palettes (10 November 2026, 04:02 UTC), tapped once each near the rim with a felt-tipped stick, with larger goblets and glass bowls an octave lower as the partner; made in `source/tools/score.py`. The mark: one glass tapped alone (the room asked to listen), then A flat, B flat and D flat, answered by the partner's D flat an octave below (said, and owned); whole when the opening says risks said out loud can be found in time, and on the last line. An early sign is one high glass, softly: as flag 14 is read, as R1's and R3's signs are written, as the tags show on 16 June, as R3's sign is read to the council and as the flags come back. D flat major, B flat minor for the opening's problem and the pre-mortem's failure, tuned pure from D flat. Music under the opening story, then only at a chapter's turn or under a moment on screen; one soft breath of wind in the fog; a muffled knock for each pair of skis; paper, pens and taps for the sheets, tags and rows, each where it's drawn. No chapter is urgent: the early sign is caught before anything goes wrong, so nothing pulses.

## Pause and think

After *One sentence, one owner* (what R3 still lacked in May: a cause and an early sign; the near miss, that it wasn't likely yet), *It failed. Why?* (why imagining failure finds more: reasons come more easily and are said more freely, each written alone, then read in turn; the near miss, that it makes people more careful) and *The early sign* (why R3 was still a risk, not an issue, when its sign showed: the personal fields stayed behind, so nothing had happened; the near miss, that the catalog's locks would have kept them safe once moved). The right answers at options 2, 3 and 1, one near miss each.

## Labs (candidates)

- Write your three biggest risks as one sentence each (a cause, what could happen, what it would do), with one owner, a response and an early sign, and a date to look again.
- Run a twenty-minute pre-mortem on work that's about to start: five minutes alone, then one reason each, in turn; turn the best into risks.

## Rigour to check before recording

Checked on 10 November 2026:

- **Amundsen's depots and flags.** Roald Amundsen, *The South Pole: an account of the Norwegian Antarctic expedition in the "Fram", 1910–1912*, translated by A. G. Chater (1912), [Project Gutenberg, ebook 4229](https://www.gutenberg.org/ebooks/4229): three depots laid from 10 February to 11 April 1911, at 80°, 81° and 82° S; marks set along the route "may easily be missed in fog", so the depots were marked across it, east and west; at 80° S twenty black flags on bamboo poles, ten on each side, 900 m apart, nine kilometres out each side, "each bamboo was marked with a number, so that we should always be able to tell from this number on which side the depot lay, and how far off"; at 81° and 82° S the marks across the route were pieces of broken packing cases, two feet high, those east of the depot notched with an axe. So the voice says "marked each depot across the route" and "at the first, twenty black flags". The film numbers the flags 1 to 20 from west to east, so flag 14 is the fourth east of the depot, 3.6 km off; the book says only that the number told the side and the distance.
- **Home, and the distance.** "Ninety-nine days the trip had taken. Distance about 1,860 miles", on the return to Framheim on 25 January 1912, all five well (the same book): about 3,000 km, there and back; the brief's seed of 1,300 km was the distance one way, rounded down, and is not used.
- **His words.** "Victory awaits him who has everything in order: luck, people call it" (the same translation, *The South Pole*, volume 2); the film quotes its first two clauses.
- **Left out on purpose.** The dogs and what became of them; any other expedition; what Amundsen learned from the Netsilik (the brief allows it only from Inuit sources, and none found says what was learned). Nobody is drawn close or as a likeness.
- **ISO 31000:2018**, *Risk management: Guidelines* ([ISO's page](https://www.iso.org/iso-31000-risk-management.html)): risk is the effect of uncertainty on objectives; its treatment options include avoiding a risk, changing its likelihood or its consequences, sharing it and retaining it by an informed decision. "Uses words like these" because the film's "reduce", "accept", "impact" and "early sign" are practitioners' words for the standard's.
- **The pre-mortem.** Gary Klein, ["Performing a Project Premortem"](https://hbr.org/2007/09/performing-a-project-premortem), *Harvard Business Review*, September 2007: imagine the project has failed; each writes the reasons alone, then reads one out in turn, starting with the project's leader; prospective hindsight (Mitchell, Russo and Pennington, 1989) raises the ability to find reasons by 30%. Klein's own short account: ["The Pre-Mortem Method"](https://www.psychologytoday.com/us/blog/seeing-what-others-dont/202101/the-pre-mortem-method), *Psychology Today*, 2021. The film says he "described it in 2007", not that he first named it then.
- **Risk appetite.** HM Treasury, [*The Orange Book: Management of Risk, Principles and Concepts*](https://www.gov.uk/government/publications/orange-book): appetite set by the people who decide, by kind of risk.
- **The university's numbers** come from the module's numbers.md (the old warehouse, its licence ending on 31 December 2027, the 21 reports, the eight risks, the council's appetite, its meetings on the last Tuesday of each month, the June page's top three risks), and *Scripts became software* (payroll's export moved into the project in March 2026, run every second Thursday since). The catalog's tags and personal columns follow *Know what you hold* and the data protection module; *Locks before the data* teaches the locks.
- **Products.** The catalog is drawn, not a product's screen; no product is named, and no feature's release status is said or shown.

## Pacing report

`tools/pace.py`, 10 November 2026: 6:56.7, 873 words, 126 words a minute, the voice 71% of the time; every chapter from 120 to 134 words a minute; no sentence with under 0.5 s after it, and no stop of 2.5 s or more inside a chapter.
