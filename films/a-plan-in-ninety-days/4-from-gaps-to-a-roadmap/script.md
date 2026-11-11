# A plan in ninety days · From gaps to a roadmap: script

*The script of *From gaps to a roadmap*, film 4 of 4 of *A plan in ninety days*, the first series of the module *Data management*, in seven chapters, in English, drawn in the module's sunlit plaster. Written on 10 November 2026 from the module's plan (`../proposal.md`), its numbers and the film's brief in the module's working folder. Made on assumptions while the author was away; this film's questions and assumptions are in the module's working folder (`data-management/4-from-gaps-to-a-roadmap/assumptions.md`). It merges as a draft. The narration is in `source/src/narration.js`; this file gives its reasons.*

## The promise

Every line passes two tests: someone new to data work can follow it, and a data manager, an enterprise architect or a programme manager finds nothing wrong in it. As the series' last film, it does the third step of Helena's ninety days, plan, and closes the series. Its own idea: set the current state beside the target and list the gaps; group them into work packages a team can finish, each with an owner and a date; order them by what each unlocks and what it's worth; set them in stages that each work on their own, so that if the money stopped after the first, people would still have something they use; date the near stage firmly and the far ones loosely; and put the whole strategy on one page, approved by the people who'll fund it and use it. As fast as necessary, not as fast as possible.

**Takeaway:** "Turn the gaps into stages that each work on their own."

## The story in one paragraph

In the 1970s, Switzerland's railways were losing their riders to cars and new motorways: trains left at different times every hour, a change could mean a long wait, and a plan for new fast lines across the country would have cost billions. From 23 May 1982 the trains ran by the clock, every line every hour at the same minutes; then Rail 2000 turned planning around: start from the timetable people want, with hubs where trains from every direction arrive just before the hour and leave just after, find the stretches too slow to reach the next hub in time, and build only those, in stages: "as fast as necessary, not as fast as possible". Its first stage opened on 12 December 2004, and Bern to Zürich took under an hour. In April 2027, a year from now, Helena Novak has the university's target drawn and three weeks to plan: Noor sets today beside the target on her map, layer by layer, and nine gaps appear; the team groups them into six work packages, each with an owner and a date; orders them by what each unlocks (one list needs the front door; moving the old warehouse's 21 used reports needs their owners first, as Sam sees); and sets them in three stages that each work on their own (a half-finished move is no use, so the whole move goes into stage two). On one page, the data strategy: the four goals, what data must do, the five principles, the target, the roadmap and the measures. On Tuesday 27 April the data council approves it, with the deputy vice-chancellor there; the money for the move is next month's case.

## Opening story

Each beat of the opening, said outright in the narration (AGENTS.md, *Story and world*), and where the film comes back to it.

| Beat | The line that says it |
|---|---|
| Scenario | "Switzerland, in the 1970s: a country of valleys and small towns, joined by its railways." "More people drove, on new motorways: in ten years, the railways' share of travel fell from over a quarter to a sixth." |
| Problem | "Trains left at different times every hour, and a change of trains could mean a long wait on the platform." "For people without a car, students, workers and older people, every trip meant looking up times, and waiting." "Fewer people rode, and the railways ran at a loss." "In 1972, three young railway engineers wrote that the trains no longer fit what people wanted, and the timetable was the heart of it." "The railways' own plan, new fast lines across the country, would cost billions, and in the early 1980s it was dropped." "With no money for new lines, the trains had to win people back another way." |
| Solution | "From 23 May 1982, the trains ran by the clock: every line, every hour, at the same minutes past." "Then the railways turned planning around: Rail 2000 started from the timetable people wanted." "In the big stations, the hubs, trains from every direction would arrive just before the hour and leave just after, so everyone could change." "Where the trains between two hubs were too slow to arrive in time, that stretch was a gap." "Only the gaps would be built." "Its slogan: as fast as necessary, not as fast as possible." "Voters approved it on 6 December 1987." "When the costs rose, it was built in stages, and the first kept one new line of four: the one the timetable needed most." |
| Benefits | "On 12 December 2004, the first stage opened: about 130 projects, with the new line between Bern and Olten at its heart." "Bern to Zürich now took under an hour, so the two hubs connected." "In Bern, every half hour, trains from every direction fill the platforms, and people change in minutes." "By 2019, the Swiss travelled further by train than anyone else in Europe: about 2,500 kilometres each, in a year." Then the same for data: "Data is the same: start from what people need, find the gaps, and build in stages that each work on their own." "A year from now, at a university, the target is drawn, and nine gaps lie between it and today." "Built all at once, it would take years, and if the money stopped half way, nobody would have anything to use." "Its data manager and team turn the gaps into three stages, each useful on its own, and get the plan approved." |
| Back to the story | Twice along the way. In *What each unlocks*: "As the timetable decided what Switzerland would build, the target decides what comes first." In *Each stage on its own*, after the stages and the slogan: "Like Rail 2000's first stage, each works on its own." And at the end, with its benefit for data: "In Switzerland, the first stage built only the gaps the timetable needed, and the hubs connected." "At the university, stage one gives people one door, one list and a measure they can see, even if the money stopped there." |

Test, from the narration alone: why was it a problem? People without a car waited, looked up times and missed connections; fewer rode; the railways lost money; and the plan to fix it with new fast lines everywhere was unaffordable. What did the fix give people? A timetable anyone could remember, hubs where every train connects, Bern to Zürich in under an hour, and in 2019 more train travel than anywhere else in Europe.

## The reference, and practice

The module's spine holds (TOGAF's method, ArchiMate's words: discover, define, plan; `../proposal.md`). This film names, once each:

| Body of knowledge | What the film takes | Where |
|---|---|---|
| TOGAF's migration planning (Phases E and F of its method, The Open Group) | Gaps found by setting the baseline beside the target; work packages a team can finish; transition architectures, the steady states on the way, in an order dependencies and value allow | *Nine gaps*: "TOGAF's method and ArchiMate name the steps: gaps, work packages, and plateaus, the steady states along the way." |
| ArchiMate's implementation and migration elements (The Open Group) | Gap, work package, plateau | The same line; "plateau" is said once, then "stage" (the module's words) |
| *Today, and where it's going* (*The map before the data*) | Today, the target and the path as three drawings, with plateaus and gaps | "The map before the data draws them, in Today, and where it's going." The notation isn't taught again |
| *A capability, not a project* (*Governance on the map*) | Governance kept every year, not ended with a project | "A roadmap ends; keeping data well doesn't, as A capability, not a project shows." |
| Rail 2000's principle | As fast as necessary, not as fast as possible; build only the gaps the target needs; stages that each work | The opening, and *Each stage on its own* |

Where the film differs: TOGAF draws a transition architecture for each step, often in full; here a stage is a short list of what people can use on its date, because a data team of eight has no time for three more drawings. TOGAF orders work packages by dependencies, value and risk; the film says the first two, and leaves risk to *Risks, said out loud*. The strategy on one page is common practice rather than any framework's (a "strategy on a page"); the film gives its six parts.

Practice, from the brief: list the gaps from the current state and the target, layer by layer; group them into packages a team can finish, each with one owner and a date; order them by what unlocks what, and by what each is worth; test every stage by asking what people would still use if the money stopped there; date the near stage to the day and the far ones to a month or a year; one page for the whole strategy; get it approved by the people who'll fund it and use it.

## What each object stands for

| On screen | What it stands for |
|---|---|
| The platform with its irregular departures, and the people waiting | The service before: a timetable nobody could remember, and its cost in people's time |
| The station clock, its departures at the same minutes every hour | A target people can feel: the service first |
| The country's lines, its hubs, and trains meeting at a hub | The timetable deciding what the tracks must do |
| A stretch in amber between two hubs | A gap: where today can't reach the target |
| Four dashed new lines, three fading, one kept | Building in stages: the first stage only what the timetable needed most |
| Noor's map, today beside the target, five layers | The current state and the target, laid side by side |
| Each gap boxed in amber on the map, then nine amber slips | The gaps |
| Six blue cards, each with its gaps, owner and date | Work packages a team can finish |
| Arrows between the tiles | What each unlocks: the dependencies |
| Three stage columns under the test, each date boxed solid, dashed or dotted | Stages that each work on their own, the near one dated to the day, the far ones loosely |
| "Half the old reports moved", struck out in stage one | A half-finished move: no use on its own |
| One tall page on the wall, six parts | The data strategy on one page |
| The council's table, and a green pill | Approved by the people who'll fund it and use it |

## The look

The module's sunlit plaster, bundled as it is (`films/the-new-skills/shared/`), with the module's mark (`dm_mark`) on the title and end. The opening is drawn in the same matte language, lit from the right like the rooms: valleys in soft layers, a platform under a plain canopy with a plain clock (no railway's own clock, logo or livery), a schematic map of the main lines with six cities named. People on the platform are dressed for the 1970s, plainly; nobody is a likeness. Colour keeps the module's meaning: the timetable, the target and the plans in blue; what was built and what was approved in green; the gaps, the waits and the costs in amber; the share of travel, a statistic, in orange. The poster is the three stages, each with its pill: works on its own.

## Script

### 1 · Every hour, at the same minutes · 0:00–3:12
Switzerland in the 1970s: valleys, small towns, a railway; a motorway with cars; the railways' share of travel on a sheet, 1960 and 1970. A platform: a board of departures at different minutes, people waiting, a student, a worker and an older person; the railways at a loss. The 1972 brochure. The map of the main lines: the fast new lines drawn across the country, then dropped. The clock: 23 May 1982, departures at the same minutes every hour. Rail 2000: start from the timetable; a hub, trains arriving from every direction before the hour and leaving after; the stretch too slow to meet the next hub, in amber; only it built. The slogan. The vote. Four planned new lines, three fade, one kept. 12 December 2004: the new line between Bern and Olten, in green; Bern to Zürich under an hour; Bern's platforms full every half hour; 2,500 km by train each in 2019. Then the team's room: three steps; today and the target with nine amber slips between them; all at once, broken half way; three stages. The title card.

### 2 · Nine gaps · 3:12–4:40
Monday 5 April 2027: Helena, the target drawn, three weeks to plan; the date for the data council. Noor's map on the wall: today on the left, the target on the right, five layers. The references, named once. The camera glides down the map a layer at a time as the voice reads it, the rows it isn't reading set aside, and each gap is boxed in amber as it's named; then back to the whole map: nine gaps, and some wait on others.

### 3 · Six pieces of work · 4:40–5:35
The nine gaps as amber slips along the top, the old warehouse's reports and servers side by side in a blue edge ("Closed together: one package"); six blue cards come in as each is named, with its owner and date, and each slip settles onto the card that closes it. The first two cards end in something people can see: a door that opens, a server switched off.

### 4 · What each unlocks · 5:35–6:36
The six cards as smaller tiles, the two that wait for later dimmed; "who asks loudest" struck out, "what each unlocks, and what it's worth" in its place. The front door first, with an arrow to the measures page it unlocks. The old warehouse: A$310,000 a year and its licence to 31 December, in amber. Helena's first draft moves the reports from June; Sam comes in beside the tiles; a report with no owner can't be moved, so the draft is struck out, and an arrow from the owners' tile to the move says which goes first: the 21 reports get their owners, then the move. The timetable's lesson, said once, on a sheet.

### 5 · Each stage on its own · 6:36–8:03
The one test, on a sheet across the top, and three stage columns under it. The first draft's "half the old reports moved" in stage one, struck out, with what's wrong in amber (reports in two places, the licence still paid); "the whole move" slides into stage two. Each stage's date and list as they're said; each date boxed by how firm it is: solid to the day, dashed to the month, dotted to the year. Rail 2000's slogan replaces the test; stage two before the licence ends, stage three as fast as the faculties can spare a day a week. Rail 2000's first stage, in a line, and each stage's pill: works on its own.

### 6 · On one page · 8:03–8:49
One tall page on the wall, its six parts drawing themselves as each is said: the four goals, what data must do, the five principles, the target in one picture, the roadmap, the measures.

### 7 · Approved · 8:49–10:18
Monday 26 April: the page and its roadmap ready. Tuesday 27 April: the council's room, its long table; Helena, the deputy vice-chancellor, the dean of Arts and the data owners. The dean's question; the far dates are loose. A green pill: approved. One package needs money: its case next month, in amber. The ninety days end. Back to Switzerland: the hub, connected. At the university: stage one's door, list and measure. The roadmap ends; the capability goes on. The last line, and the end card.

## Sound

A double siren, reserved for this film in the module's palettes (10 November 2026): two discs on one axle, each with rings of holes, air blown through a ring as the discs turn, so each ring sounds one note; played as a laboratory plays it, never as an alarm: the wheel keeps one speed and a ring is opened for each note, so nothing wails or slides. Its partner is the lower disc on the same axle, an octave lower: the two turn together, so every chord they sound is pure and still. Made in `source/tools/score.py`. The mark: two short phrases, one on each disc, that arrive on the same chord at the same moment, as trains meet at a hub on the hour. C major, A minor for the opening's problem. Nothing Swiss and no railway sounds: no alphorn, cowbells, post horn, station chimes, whistles or wheels on rails. No chapter is urgent.

## Pause and think

After *Nine gaps* (what a gap is: where today differs from the target, not a wish list), *What each unlocks* (why owners come before the move: nobody could say a moved report is still right, not that owners must approve the code) and *Each stage on its own* (why the half move left stage one: half a move is no use on its own, not that it was late).

## Labs (candidates)

- Lay your team's current state beside its target, layer by layer, and list the gaps; group them into packages, each with one owner and a date.
- Put the packages on a line of months in stages, and test each stage: if the money stopped there, what would people still use?

## Rigour to check before recording

Checked on 10 November 2026:

- The railways' share of passenger travel in Switzerland, 27.8% in 1960 and 16.0% in 1970 (road traffic, private, 64.8% and 78.8%): Bundesamt für Statistik (1985), *Schweizerische Verkehrsstatistik*, p. 116, as figure 2 of Gisela Hürlimann, *The Swiss path to the "Railway of the Future" (1960s to 2000)*, 5th Swiss Transport Research Conference, Monte Verità, 9 to 11 March 2005. The film says "from over a quarter to a sixth"; the motorways from the same paper (the 1958 vote for building motorways).
- The service before 1982: the interpellation of 9 October 1981 in the Council of States (Amtliches Bulletin der Bundesversammlung, 19 March 1982, 81.536) says the new concept of 23 May 1982 brings "more trains, more regular intervals, better connections" ("Mehr Züge, regelmässigere Abstände, bessere Anschlüsse"). The wait on the platform is the general picture that follows from it, not a quote.
- The railways' losses and the brochure: Hürlimann 2005 (SBB's structural crisis from the late 1960s; its deficit over 700 million francs in the 1970s); the brochure *Taktfahrplan Schweiz: Ein neues Reisezugkonzept* by Jean-Pierre Berthouzoz, Hans Meiner and Samuel Stähli, 16 June 1972, as Hürlimann quotes it: the service "does not meet today's customer wishes anymore. The main ingredient of this service is the timetable". Hürlimann calls its authors "a group of young SBB engineers"; the film names no one.
- The fast new lines (Neue Haupttransversalen, NHT): planned from 1969; "a 'Railway of the Future' implying billions of Swiss francs"; opposed on the Olten to Bern stretch since 1966; its public consultation of 1983 "depressing"; SBB "buried their speed vision in the early 1980s" (Hürlimann 2005).
- The clock-face timetable from 23 May 1982: the Amtliches Bulletin above.
- Rail 2000: planning began in June 1984 (Hans-Jürg Spillmann, SBB Infrastruktur, *Schlussstein für die Bahn-2000-Brücke*, SBB media conference, Bern, 12 October 2004); hubs where trains arrive shortly before the full or half hour and leave shortly after, and "as fast as necessary, not as fast as possible", the project's slogan (Wikipedia, *Rail 2000* and *Bahn 2000*, citing Kräuchi and Stöckli, *Mehr Zug für die Schweiz: Die Bahn-2000-Story*, 2004, p. 14); approved by the voters on 6 December 1987 with 57.0% (the same, p. 15), after a referendum launched by communities along the new lines (Hürlimann 2005; Spillmann 2004).
- The stages: costs underestimated by 1991; in 1992 the Federal Council had the project cut down and built in stages (Wikipedia, *Bahn 2000*); the first stage kept one of the four new lines planned, between Mattstetten and Rothrist on the Bern to Olten line, "the heart" of Rail 2000 (Hürlimann 2005). The four planned lines are drawn on the map schematically, not as surveyed routes.
- The first stage, opened on 12 December 2004: about 130 projects; the 45 km new line between Mattstetten and Rothrist its backbone; in Bern, at the full and half hour, the long-distance trains from every direction fill every platform (Spillmann 2004). Bern to Zürich from 69 minutes to 58 (56 from the end of 2007) and trains every half hour on main lines (Wikipedia, *Rail 2000*, *Bahn 2000*): the film says "under an hour" and "every half hour".
- 2019: about 2,505 km and 74 journeys by train per person, the most in Europe: LITRA, as reported by swissinfo.ch, 27 November 2020 (*Swiss are Europe's train champions*). The film says "about 2,500 kilometres each, in a year".
- The data story's numbers are the module's (`numbers.md` in its working folder): the nine gaps from the current state of *Listen first* and the target of *Design it simple*; the six packages and their dates; the three stages; the old warehouse's 38 reports, 21 used, A$310,000 a year, licence to 31 December 2027; the front door from 7 June 2027; the council on the last Tuesday of the month; the case for the money on 25 May 2027 (*A case worth funding*). Each package's owner is this film's assumption.
- TOGAF's migration planning and ArchiMate's gaps, work packages and plateaus: The Open Group's published standards, as linked on the film's page. No product's release status is said or shown.

## Pacing report

`tools/pace.py`, 10 November 2026: 10:18.4, 1,312 words, 127 words a minute, the voice 74% of the time (171 words a minute while speaking); every chapter from 121 to 134 words a minute and its voice from 69% to 77%; no sentence with under 0.5 s after it, and no stop of 2.5 s or more inside a chapter. The two wordless moments, the title card after the opening and the end card, are 7.4 s and 6.8 s.
