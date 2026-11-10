# Small steps, measured · Prototype first: script

*The script of *Prototype first*, film 1 of 4 of *Small steps, measured*, the last series of the module *Data management*, in six chapters, in English, drawn in the module's sunlit plaster. Written on 10 November 2026 from the author's key for the module ("agile focus, in the sense of prototype and iterate fast"), the series' plan (`../proposal.md`), the module's numbers and its brief in the module's working folder. Made on assumptions while the author was away; this film's questions and assumptions are in the module's working folder (`data-management/9-prototype-first/assumptions.md`). It merges as a draft. The narration is in `source/src/narration.js`; this file gives its reasons.*

## The promise

Every line passes two tests: someone new to data work can follow it, and a data manager, an agile coach or an analytics engineer finds nothing wrong in it. Its idea: put something real in front of the person who decides within two weeks, built from real, governed data; learn from what they do with it; and do it again, in short, fixed rounds, until the decision is served. Then stop, and keep what the prototype taught in the product.

**Takeaway:** "Something real in front of them in two weeks; learn; repeat."

## The story in one paragraph

In Curitiba in May 1972, city crews close the old centre's main street to cars on a Friday evening. Cars had filled it for years and pushed people on foot to its edges; one plan was to widen the streets and knock down buildings from about 1900; the mayor wanted the street given back to people on foot, and the shopkeepers feared their customers would stay away. No plan on paper could show them the street, so the city built it over the weekend: stones, streetlights, kiosks, tens of thousands of flowers. When drivers came the next weekend to take it back, they found children painting on strips of paper. Within days the shopkeepers told the newspapers their sales were up; soon they asked for more of the street, and fifty years on it is still a street for people on foot. In February 2027 Graham Ellis asks Helena Novak's team for a dashboard of room use by Easter; behind it is whether to ask the University Council for a new teaching building. The request waits, as every request did, until the team takes it up the new way on Tuesday 30 March: real data from the first day, governed; an agent's draft checked by Ivy herself; the meaning of room use in the glossary, owned by Graham; Jun's review; a dashboard in front of Graham on Friday 9 April, ten days in, and one question every round: what would change your mind? Three rounds of a week show rooms booked 38% of the week but 93% at the peak, and the third round's answer is plain: move about one peak class in six and release the bookings nobody uses. The decision is served, so the rounds stop; in June the University Council puts the building off for two years.

## Opening story

The four beats, each said outright (AGENTS.md, *Every opening story has four beats*), checked against the sources in *Rigour*, below.

| Beat | The line that says it |
|---|---|
| Scenario | "Curitiba, in the south of Brazil. Friday the 19th of May, 1972, six in the evening." "City crews arrive by truck in the old centre's main street, Rua XV de Novembro, and close it to cars." |
| Problem | "For years, cars and buses had filled it, and people on foot were squeezed to its edges." "One plan was to widen the streets, knocking down buildings from the turn of the century." "The young mayor, Jaime Lerner, an architect, wanted the street given back to people on foot." "The shopkeepers feared the opposite: without cars, their customers would stay away, and their sales would fall." "Something had to change, but no plan on paper could show them what the street would be like." |
| Solution | "So the mayor's team built the real thing, fast." "On Saturday morning, grey and damp, the street was handed to the people, without ceremony." "Over the weekend, crews took up the road, laid stones, and put in streetlights and kiosks." "They planted tens of thousands of flowers." "The next weekend, drivers came to take the street back." "They found long strips of paper on it, and dozens of children painting." |
| Benefits | "Within days, the shopkeepers told the newspapers their sales were up a little." "Soon they were asking for more of the street." "Other streets followed, and fifty years on, it is still a street for people on foot." Then the same for data: "The city didn't win the argument on paper. It put the real thing in front of the people who had to decide." "A data team can work the same way." "Put something real in front of the person who decides, learn from what they do with it, and do it again." |
| Back to the story | Along the way: "As in Curitiba, the talk changes once people can use the real thing." At the end, with its benefit for data: "In Curitiba, a street built in a weekend settled what plans on paper couldn't." "Helena's team did it in three weeks: real data in front of the person who decides, a round at a time." |

The test: someone who has never heard of Curitiba can say, from the narration alone, why it was a problem (people on foot squeezed to the edges of a street full of cars, a plan that would knock down old buildings, and shopkeepers afraid of losing their customers, whom no plan on paper could persuade) and what the fix gave people (a street for people on foot, built in a weekend, sales up within days, more streets after it, and still a street for people fifty years on).

## The reference, and practice

The module's spine holds (TOGAF's method, ArchiMate's words; `../../a-plan-in-ninety-days/proposal.md`); this film names neither, as its subject is the delivery loop. It names, once each:

| Body of knowledge | What the film takes | Where |
|---|---|---|
| The Agile Manifesto (2001) | Working software over comprehensive documentation | *Something real in two weeks*: "In 2001, the Agile Manifesto put it plainly" |
| The Scrum Guide (2020) | The sprint review: the work shown to the people who matter, at a fixed time, so they can say what comes next | *Three rounds, a week each*: "Scrum calls it a sprint review" |

Where the film extends them: the manifesto and Scrum speak of software teams building a product; here a data team serves one person's decision, and the round's question comes from that person ("what would change your mind?"). Where it differs from much of the literature on prototypes, which builds them to throw away: here the prototype is built properly from the first day, on real data, governed (counts per room, per hour, never a person), with the meaning of a word owned in the glossary and every change reviewed by someone who didn't write it, so what it taught stays in the product. And it stops when the decision is served, not when the backlog is empty.

Practice, from the author's key and the module's brief: put something real in front of the person who decides within two weeks; use real data from the first day, and govern it; ask every round what would change their mind, and let the answer set the next round; keep the rounds short and fixed; stop when the decision is served; keep what you learned in the product. Each of these is said in *On Monday*.

## What each object stands for

| On screen | What it stands for |
|---|---|
| The street of shop fronts, full of cars at dusk | The problem before anyone tried: the way things are, argued over on paper |
| A plan on paper, its fronts in pencil | What can't show anyone the real thing |
| Stones laid from the end of the street, lamps, kiosks, flowers | The real thing, built fast enough to be tried |
| Strips of paper and children painting | People using the real thing, which settles the argument |
| Ivy's page, five boxes from the decision to the data | The question's whole route, drawn before anything is built |
| The agent's draft, its flagged assumption | A first model made fast, checked by a person |
| The glossary sheet and the model sheet | A word's meaning settled by its owner, and the code built from it |
| The heat map on the screen | The real thing, on real data, in front of the person who decides |
| The strip of rounds, Fridays marked | Short, fixed rounds, each ending with the person who decides |
| Bars of working days | Time from asking to first use: waited, before, and the new way |
| Two buildings cut open, a full hour and a quiet one | What the average hid: the crowded peak and the empty rooms |
| Blue arrows on the heat map | The answer: one peak class in six moved, unused bookings released |
| A fourth round, faint, and a stop | Enough: the decision is served |

## The look

The module's sunlit plaster, bundled as it is (`films/the-new-skills/shared/`), with the module's mark (`dm_mark`, from `films/a-plan-in-ninety-days/shared/src/mark.js`) on the title and end cards. Curitiba in 1972 is drawn in the same matte language: a street of plain two- and three-storey shop fronts, cars and buses of no make, the street at dusk, then grey and damp on Saturday, then sunlit; a shopkeeper in an apron over a shirt, dressed for 1972; the crews and the children small and far off, with no faces; the mayor a name on a sheet, never drawn. No mosaic, flag or ornament borrowed from the place; nobody a likeness. The university: Graham, Helena, Ivy and Jun as the kit draws them; the team's agent as the agent films draw it, the only violet; the dashboard drawn, with Databricks' official mark on it (`NOTICE.md`). Blue for plans and questions, green for what's done, amber for risk, cost and waiting, orange for data. The poster is the dashboard with its three figures, at the moment the real thing surprises everyone.

## Script

### 1 · A street in a weekend · 0:00–2:09
Curitiba, Friday 19 May 1972, six in the evening: the street full of cars at dusk; crews arrive by truck and set barriers at both ends, and the cars drive off. The years before: cars and buses, people on foot squeezed to the edges; one plan, to widen the streets and knock down the old buildings, marked in amber; the mayor, a name on a sheet. One shop: the shopkeepers' fear; something had to change, and a plan on paper that can't show the street. Friday night, the real thing built fast, the first stones laid from the end of the street. Saturday morning, grey and damp, handed to the people; over the weekend the stones, streetlights, kiosks and flowers, the sun coming out; the next weekend the drivers come, and stop at strips of paper and children painting. The shop again: sales up a little, asking for more of the street. Fifty years on, a street for people on foot; not on paper. The team's room: the street framed on the wall, and the loop (something real, learn, repeat), which gives way to the title card.

### 2 · The question behind the dashboard · 2:09–3:20
February 2027: Graham's request, a dashboard of room use by Easter. The question behind it: whether to ask the University Council for a new teaching building, drawn in dashes beside the campus, about A$140 million. The request waits in the queue: 41 working days on average, from asking to first use. Tuesday 30 March: taken up the new way, as Helena's ninety-day plan set out; Ivy's page of the whole route, all 186 rooms, the 14 named two ways matched; the real data, thirteen weeks of bookings and head counts from the sensors; governed from the first day: counts per room, per hour, never a person.

### 3 · Something real in two weeks · 3:20–4:42
The Agile Manifesto's line, once. Round 1 asks one thing, on the strip of rounds. Wednesday 7 April: the team's agent drafts a first model in a minute, and says what it assumed: a booked hour is a used hour, flagged. Ivy catches it herself, reading the notes to the end and checking against the sensors; room use, as Graham means it, goes into the glossary (owner: Graham Ellis), the model is built from it, and Jun reviews Ivy's change. Fast isn't careless. Friday 9 April, ten days in: Graham and Helena at the screen; the heat map of the week fills in, close up; Helena's question for every round, and Graham's answer.

### 4 · Three rounds, a week each · 4:42–6:01
The strip of rounds, each ending on a Friday; Scrum's sprint review, here half an hour with Graham at one screen. Wednesday 14 April: Graham uses it himself, with his team, first used. Working days: this one waited about seven weeks, like every request; then the new way took 11, against 41. The street on the wall: once people can use the real thing, the talk changes. The real thing surprises everyone, close up: booked 38% of the week, 93% from ten to two, Tuesday to Thursday; one booked hour in five with nobody there, about half the seats filled. Two buildings cut open: Tuesday at 11:00, every room full; Friday at 16:00, most rooms empty; the average hid both. The second review: show me it works in 2030.

### 5 · Stop when it's enough · 6:01–6:53
Friday 23 April, round 3, in the same room: short only at the peak; blue arrows move one peak class in six, unused bookings released; room enough to 2030, without a new building. The strip of rounds: the decision is served, a fourth round only polish, and the rounds stop. Kept: the definition and the reviewed model; the dashboard a product of its own, which Ivy owns from July. June: Graham takes one page to the University Council, and its decision.

### 6 · On Monday · 6:53–7:40
The street on the team's wall, a street built in a weekend; Helena: three weeks, a round at a time. Four things to do on Monday, pinned one by one; the loop again, which gives way to the end card.

## Sound

Elastic bands over a small open wooden box, plucked with a fingertip, reserved for this film in the module's palettes (10 November 2026), with a bigger box of thicker bands an octave lower as its partner; made in `source/tools/score.py`. The mark: a rough phrase made better over three rounds (B flat, G, C; then B flat, G, A flat, C; then the whole phrase home to E flat), heard as the street is built, painted and still there fifty years on, then as Graham's first look, the second review and the third round's answer; on Monday, the whole phrase an octave lower. There is no fourth round, and no note for it. E flat major, C minor for the opening's problem, tuned pure from E flat; nothing from the opening's place. No chapter is urgent. `tools/quiet.py` passes: music 21% of the time after the opening, once every 10.7 s, the effects one at a time.

## Pause and think

| After | Question | Right answer | Near miss |
|---|---|---|---|
| *Something real in two weeks* | How is the agent's wrong assumption caught? | Ivy reads its notes to the end and checks the draft against the sensors herself (option 2) | Ivy asks the agent to check its own draft: the agent proposes, people check |
| *Three rounds, a week each* | What does Graham's answer to "what would change your mind?" give the team? | What the next round must show, and how to know when it's enough (option 1) | One more chart every week: the rounds stop when the decision is served |
| *Stop when it's enough* | What stays from the prototype? | The definition in the glossary, the reviewed model and a dashboard Ivy owns (option 3) | The model and the dashboard, with the meaning in the team's notes: definitions live in the glossary |

## Labs (candidates)

- Take one request that is waiting, write the decision behind it, and the one question that would change the decider's mind.
- Build the smallest real thing on real data that answers that question, show it at a fixed time, and write down what changed.

## Rigour to check before recording

Checked on 10 November 2026:

- Friday 19 May 1972, 18:00: city workers arrive by truck at Rua XV de Novembro and close it to vehicles; the shopkeepers' resistance, saying their sales would suffer; Saturday 20 May, a grey and damp autumn morning, the street handed to the people "sem festa nem pompa" (without party or pomp); the works done quickly; on 24 May shopkeepers, heard by the press, spoke of a modest rise in sales; the closure extended in the following months, Avenida Luís Xavier in 1973; until 1972 the street carried east–west bus lines and cars. Source: Raul Guilherme Urban, [*Os 40 anos do calçadão da XV*](https://mid.curitiba.pr.gov.br/2012/00118814.pdf), for the city of Curitiba, 2012. The film says "within days" for 24 May and "sales were up a little" for "um discreto aumento de vendas".
- The plan to widen the main streets, "knocking down the turn-of-the-century buildings", and an overpass; Lerner had "no way to convince the store-owners"; store-owners threatening legal action; the work: jackhammering the pavement, cobblestones, streetlights and kiosks, "tens of thousands of flowers"; Lerner's "Let's start Friday night, and we have to finish by Monday morning"; the next weekend, the automobile club threatened to reclaim the street, and found "dozens of children" painting on "strips of paper the length of the mall"; store-owners petitioning to extend it. Source: Bill McKibben, [*Curitiba and hope*](https://www.motherjones.com/environment/2005/11/curitiba-and-hope/), *Mother Jones*, 8 November 2005, an excerpt reprinted from a longer account. The court threat isn't said, to keep the shopkeepers' side simple and blameless: their fear for their customers is.
- Jaime Lerner, an architect, born 17 December 1937 (34 in May 1972), mayor of Curitiba from 1971 to 1974 (his first term): Wikipedia, *Jaime Lerner*. "The young mayor" for 34.
- Still a street for people on foot: Wikipedia (pt), *Rua XV de Novembro (Curitiba)*, its *calçadão* as far as Rua Presidente Faria; "fifty years on" for 54. The claim that it was Brazil's first pedestrian street is contested (a column in the *Gazeta do Povo*, and an ANPUR paper dating Travessa Oliveira Belo to 1966) and is never said.
- The people of the opening are drawn as nobody in particular; the mayor is never drawn.
- The Agile Manifesto, 2001: "Working software over comprehensive documentation" ([agilemanifesto.org](https://agilemanifesto.org/); the Spanish page has "Software funcionando sobre documentación extensiva").
- The Scrum Guide, November 2020: the Sprint Review's purpose "is to inspect the outcome of the Sprint and determine future adaptations", with key stakeholders; at most four hours for a one-month sprint, usually shorter for shorter sprints ([scrumguides.org](https://scrumguides.org/scrum-guide.html)). "Half an hour" for a sprint of a week is the team's choice.
- Dashboards in Databricks ([docs.databricks.com](https://docs.databricks.com/aws/en/dashboards/), last updated 5 November 2026): documented as a standard feature, with no preview label, on 10 November 2026. The film draws a dashboard with Databricks' official mark; it never says or shows a release status.
- The university's numbers are the module's (`numbers.md` in its working folder): Graham's request (February 2027; about A$140 million for 40 rooms); 186 rooms, 14 named two ways; Semester 2 2026's 13 teaching weeks of bookings and head counts; 41 working days on average from asking to first use; taken up on Tuesday 30 March, first used on Wednesday 14 April, eleven working days; booked 38% of the week, 93% from 10:00 to 14:00, Tuesday to Thursday, nobody in 21% of booked hours, 52% of seats filled when used; the agent's draft of Wednesday 7 April; the third round on Friday 23 April; Planning's forecast of 6% more students by 2030; the University Council's decision of Thursday 24 June 2027. Set by this film, in its assumptions: the first review on Friday 9 April, the second on Friday 16 April, Graham's two answers. Counts per room and per hour, never a person.
- Who checks what: the agent proposes; Ivy checks its draft herself before her change; Graham, who owns the term, settles what room use means in the glossary; Jun, of the data team, reviews Ivy's change; no owner or steward reviews code (the author, 10 November 2026).

## Pacing report

`tools/pace.py`, 10 November 2026: 7:40.4, 982 words, 128 words a minute, the voice 69% of the time; every chapter from 122 to 130 words a minute; no sentence with under 0.5 s after it, and no stop of 2.5 s or more inside a chapter.
