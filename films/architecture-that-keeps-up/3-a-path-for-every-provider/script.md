# Architecture that keeps up · A path for every provider: script

*The script of *A path for every provider*, film 3 of 3 of *Architecture that keeps up*, the third series of the module *Data management*, in seven chapters, in English, drawn in the module's sunlit plaster. Written on 10 November 2026 from the author's advice for technical managers of that day (his point 5: a preferred platform architecture and good practices, decision trees for the providers who can't meet them, lifting them over time, and value to the business first), the series' plan (`../proposal.md`) and its brief in the module's working folder. Made on assumptions while the author was away; this film's questions and assumptions are in the module's working folder (`data-management/15-a-path-for-every-provider/assumptions.md`). It merges as a draft. The narration is in `source/src/narration.js`; this file gives its reasons.*

## The promise

Every line passes two tests: someone new to data work can follow it, and a data manager, a data architect or a platform engineer finds nothing wrong in it. Its idea: write one preferred way for data to arrive, and accept that some providers will never meet it, old systems and new software bought as a service alike. A decision tree gives each of them the best path open to it, every path still with a contract and an owner; the weaker paths are checked more often; each provider is asked for its next step up, in writing; and the data reaches the business now, not after every provider catches up.

**Takeaway:** "One preferred way, a path for every provider, and value first."

## The story in one paragraph

In April 1956 Malcom McLean's *Ideal X* carries 58 boxes from Newark to Houston, lifted on and off whole by crane, for under 16 cents a ton against $5.83 by hand. But a box needs a crane at both ends, and few ports have one: for them nothing changes. In October 1957 his company sends out the *Gateway City* with two cranes of its own, and any port with a quay can take boxes; ports build their own cranes over the years, and ships with their own still call where there are none. In June 2027 Helena Novak and Noor Rahman write the team's preferred way to receive data on one page; Sam Okafor's list of providers shows who can't meet it, old and new. A decision tree gives each one a path. The new timetable, bought as a service, never says what was deleted, so the team compares its full list each night: by the first week of teaching it has found 212 deleted bookings that would have looked booked and empty on Graham's page. Payroll's nightly file is checked more often, and a file cut short is stopped before 2,400 staff are marked as gone. On 30 September Graham's page shows every room and every lab, from four sources, by four paths.

## Opening story

The four beats, each said outright (AGENTS.md, *Every opening story has four beats*), checked against the sources in *Rigour*, below.

| Beat | The line that says it |
|---|---|
| Scenario | "Port Newark, New Jersey, in April 1956." "A trucking man, Malcom McLean, sends an old tanker, the Ideal X, to Houston with 58 metal boxes on its deck." "Each box is lifted on and off whole, by crane, instead of sack by sack and crate by crate." "By McLean's own figures, loading costs under 16 cents a ton, against $5.83 by hand." |
| Problem | "But a box needs a crane strong enough to lift it, at both ends of the trip." "Few ports have one, and building one takes years, and money most of them don't have." "For those ports, the box changes nothing: ships still sit at the quay for days, unloaded by hand, and their goods cost more." "Something has to change, or the box will stop wherever the cranes do." |
| Solution | "In October 1957, McLean's company sends out a rebuilt ship, the Gateway City, with two cranes of its own." "They run on rails along its deck, and reach out over the quay." |
| Benefits | "Now a port with a quay can take boxes, crane or not." "Over the years, ports build cranes of their own, and the ships' cranes are no longer needed there." "Ships with their own cranes still call at ports that have none." "The box's savings reached each port before it could meet the standard, and each port joined the standard when it could." Then the same for data: "Data has its standard ways too, and providers who can't meet them yet." "A path for each of them lets their data arrive now, not after every one of them catches up." |
| Back to the story | At the end, with its benefit for data: "The Gateway City took its own cranes to ports that had none, and the box reached them years before their cranes did." "Helena's team did the same: a path for every provider, and Graham's counts true from the first week." |

The test: someone who has never heard of the Ideal X can say, from the narration alone, why it was a problem (a box needs a crane at both ends, few ports had one or could afford one soon, so their ships still sat for days, unloaded by hand, and their goods cost more) and what the fix gave people (any port with a quay could take boxes at once, and join the standard when it could).

## The reference, and practice

The module's spine holds (TOGAF's method, ArchiMate's words; `../../a-plan-in-ninety-days/proposal.md`). This film names, once each:

| Body of knowledge | What the film takes | Where |
|---|---|---|
| Event-driven integration (Hohpe and Woolf's *Enterprise Integration Patterns*, 2003) | A source that sends each change as an event, the moment it happens | *A tree for the rest*: "The first paths have names" |
| Change data capture | Fetching a source's changes since a given time | The same line |
| Data products and data contracts (*Moving is easy, agreeing is the work*) | A governed product with an owner and a contract, on every path | *One preferred way*, by title |
| Deletion reaching every copy (*Deleted means deleted*, in Data protection) | Saying what was deleted | *One preferred way*, by title |
| TOGAF's architecture principles and standards | A preferred way, with a decision for each exception | Not named: the page and its tree say it |

Where the film differs: the frameworks write a standard and treat what falls short as an exception to approve or refuse; here every exception gets a recommended path at once, from a tree kept in the repository, and the exception is lifted over time, as the author asked: the business gets its value first. The full-list comparison for a source that can't say what was deleted is a common practice (a "full snapshot diff"), not a framework's term; the film describes it and gives it no name.

Practice, from the author's advice: write the preferred way on one page; draw the tree for the providers who can't meet it, each branch ending in a recommendation; ask each provider for its next step up, in its contract or its renewal; check the weaker paths more often, with a stop that asks a person; don't hold value back waiting for the ideal. Every one of these is said in *On Monday*.

## What each object stands for

| On screen | What it stands for |
|---|---|
| The Ideal X, its boxes lifted whole | The standard way, and what it saves |
| A port with nets and sacks, no crane | A provider that can't meet the standard |
| The Gateway City's two cranes on rails | A path that brings the standard's value to those who can't meet it yet |
| Helena's page, three points | The preferred way to receive data |
| Sam's list of four providers | The systems the team takes data from, old and new |
| The decision tree, five questions | The best path open to each provider, each branch with a recommendation |
| The tree as text beside its picture | The tree kept in the team's repository, its picture drawn from it, as in *One map, in the repo* |
| The timetable and the platform side by side | A deletion the source never says, and a booking left behind |
| Two lists compared, a booking struck in amber | The nightly comparison |
| Four lanes, four providers | Four paths to one platform |
| Bars of nightly file sizes, a dashed line | The check on a weaker path, and its stop |
| Four steps, the preferred way at the top | Each provider's next step up |
| Graham's page of rooms and labs | Value delivered now, from every path |

## The look

The module's sunlit plaster, bundled as it is (`films/the-new-skills/shared/`). Port Newark is drawn in the same matte language, lit from the right like the rooms: the quay and its sheds, the water, the tanker with its boxes on a raised deck, a quay crane; the port with no crane, its nets and sacks; the Gateway City with its two cranes on rails. McLean in a 1950s suit and tie, nobody a likeness. The university's rooms in a June morning, a late afternoon and a grey day. The poster is the decision tree, at its third question.

## Script

### 1 · The ship that brought its own cranes · 0:00–2:00
Port Newark, April 1956; McLean on the quay; the Ideal X, 58 boxes lifted whole; the cost, 16 cents against $5.83, as two bars. A port with no crane: nets and sacks, the ship waiting. The Gateway City, October 1957, its two cranes on rails reaching over the quay; ports that build cranes later; a ship with its own still at a port with none. Then the team's room: the box's savings, and data's own standard ways; the title card.

### 2 · One preferred way · 2:00–3:28
The series said once. June 2027: Helena and Noor write the preferred way on one page, its three points coming in as they're said; the films on contracts and deletions, by title. Sam's list of providers, each with what it can do: the sensors, payroll from 2004, the timetable bought in 2026, the labs' spreadsheet.

### 3 · A tree for the rest · 3:28–4:31
The page's second half: the decision tree, each question and its answer lit as it's said. The first paths' names on a sheet. Every branch ticked with its recommendation; the tree as text beside its picture.

### 4 · What the timetable never says · 4:31–5:44
Monday 14 June: Sam's test; Mei cancels a class on the timetable, and the platform keeps it booked. What Graham would see: an empty room, booked. The vendor's renewal in 2028. The tree's answer: the changes every hour and the full list every night; the comparison marks the missing booking deleted. Live on 19 July; by 30 July, 212 deleted bookings found, 212 hours kept off Graham's page.

### 5 · Four providers, four paths · 5:44–6:46
Four lanes to the platform: the sensors' events, payroll's nightly file, the timetable's hours and nights, the labs' governed table. Payroll's file sizes night by night, a dashed line; on 24 August a file cut short stops below it before 2,400 staff are marked as gone. Anil and the labs' table. Each provider's next step up, in writing.

### 6 · Value first · 6:46–7:20
Four steps, the preferred way at the top, each provider a step lifted. Graham's page on 30 September: every room and every lab, from four sources. Helena's page, still one page.

### 7 · On Monday · 7:20–8:10
The Gateway City, framed on the team's wall; Graham's counts true from the first week. Four things to do on Monday; the tree becomes the end card.

## Sound

The long string instrument, reserved for this film in the module's palettes (10 November 2026): brass wires many metres long, rubbed lengthwise with rosined fingertips, and the same wires plucked and damped as its partner; made in `source/tools/score.py`. The mark: four ways to the same note, four short figures that arrive on A by different paths, together at the close. A major, F sharp minor for the problem, tuned pure from A; nothing from the opening's world (no ship's horn, work song or dock bell). No chapter is urgent: the file cut short is stopped calmly. `tools/quiet.py` passes: music 14% of the time after the opening, once every 18.5 s, the effects one at a time.

## Pause and think

After *A tree for the rest* (a source that gives its changes but not its deletions: changes every hour and the full list compared every night, not waiting for the vendor), *What the timetable never says* (why 212 deleted bookings matter: hours that would look booked and empty on Graham's page, not a fault in the platform) and *Four providers, four paths* (why payroll's nightly comparison has a stop: a weaker path is checked more often, so a short file can't mark 2,400 staff as gone). Right answers at options 2, 3 and 1, one near miss each.

## Labs (candidates)

- Write your team's preferred way on one page, then place each of your providers on the tree and write its path.
- Build a nightly full-list comparison for a source that can't say what was deleted, with a stop when the list shrinks too far.

## Rigour to check before recording

Checked on 10 November 2026:

- The Ideal X sailed from Port Newark to Houston on 26 April 1956 with 58 containers (trailer bodies) on a deck built over its tanks; Malcom McLean was a trucking company owner. Sources: [Port Houston, *Ideal X*](https://porthouston.com/ideal-x/); [*The Geography of Transport Systems*, *The Ideal X*](https://transportgeography.org/contents/chapter5/maritime-transportation/ideal-x-container-ship/).
- McLean's own figures: loading loose cargo cost $5.83 a ton in 1956; loading the Ideal X cost under 16 cents a ton (the commonly cited 15.8 cents). Source: [*Invention & Technology*, *The Evolution of a Box*](https://www.inventionandtech.com/content/evolution-box-1); also Marc Levinson, *The Box* (2006). The film says "By McLean's own figures".
- The Gateway City, a converted C-2 freighter, sailed on 4 October 1957 with two shipboard gantry cranes running on rails along its deck, because few ports had cranes able to lift the boxes; as ports built their own cranes, ships' cranes were no longer needed there. Sources: [FreightWaves, *Gateway City*](https://www.freightwaves.com/news/maritime-history-gateway-city-the-first-fully-cellular-container-ship); *Invention & Technology*, as above.
- Geared container ships, with their own cranes, still serve ports without shore cranes: general knowledge of shipping, as in *The Geography of Transport Systems*' pages on container ships.
- The harm (ships held at the quay for days, unloaded by hand, goods that cost more) is the general picture of break-bulk shipping in the sources above, not a figure for one port.
- Change data capture and event-driven integration, as linked on the film's page. No product is named, and no product's release status is said or shown.
- The university, its people and its numbers (212 deleted bookings, 2,400 staff, nine labs, the dates of 2027) are invented, in the module's world.

## Pacing report

`tools/pace.py`, 10 November 2026: 8:09.9, 1,036 words, 127 words a minute, the voice 71% of the time; every chapter from 121 to 137 words a minute (*A tree for the rest*, at 137, is under the 140 a chapter may reach); no sentence with under 0.5 s after it.
