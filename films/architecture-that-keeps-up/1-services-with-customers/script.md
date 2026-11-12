# Architecture that keeps up · Services with customers: script

*The script of *Services with customers*, film 1 of 3 of *Architecture that keeps up*, the third series of the module *Data management*, in six chapters, in English, drawn in the module's sunlit plaster. Written on 10 November 2026 from the author's advice for technical managers of that day ("Product owners benefit from architectural background": "Treat the services you manage as an independent business with suppliers and customers. Start with refining the definition of those services and then identifying your customers (segments), their pains and business drivers; from there refine and traverse all the architectural layers (strategy, business, information, application and technology)"), the series' plan (`../proposal.md`) and its brief in the module's working folder. Made on assumptions while the author was away; this film's questions and assumptions are in the module's working folder (`data-management/13-services-with-customers/assumptions.md`). It merges as a draft. Its line on the layers' names was reworded on 12 November 2026, from the author's review (see *The reference, and practice*). The narration is in `source/src/narration.js`; this file gives its reasons.*

## The promise

Every line passes two tests: someone new to data work can follow it, and a data manager, an enterprise architect or a product owner finds nothing wrong in it. As the series' opening film, it says once what the series is: the product owner's side of a data manager's job, borrowed from architecture. Its own idea: run your team's services as a business of its own, with suppliers and customers. Define the services first, in a customer's words; name the customers in groups, with what hurts and what drives each; then walk each service down every layer, from strategy to technology, so every system and every piece of data is there for someone's need. A picture for each layer.

**Takeaway:** "Know your services and who they're for; then design every layer for them."

## The story in one paragraph

In Madurai in 1976, a retired government eye surgeon opens an eleven-bed hospital among millions blinded by cataracts that a short operation could fix, most of them too poor to pay. He says first what it is for (sight given back, to everyone who needs it) and who it is for, in groups (those who can pay, those who can pay a little, those who can pay nothing), then designs everything below for them; today its hospitals do over 400,000 operations a year, more than half free or for very little. In May 2027, after her data strategy is approved, Helena Novak does the same with her team: four services on one page, its suppliers, its customers in four groups with their pains and drivers; she and Noor walk one service, governed data products, down five layers, a picture each, and the same walk finds 17 of the old warehouse's 38 reports that no one has opened in a year. On 7 June, when the front door opens, 42 of 45 requests land on a service; three land on none, and show where the page needs to change.

## Opening story

The four beats, each said outright (AGENTS.md, *Every opening story has four beats*), checked against the sources in *Rigour*, below.

| Beat | The line that says it |
|---|---|
| Scenario | "Madurai, in the south of India, in 1976." "Dr Govindappa Venkataswamy has just retired as a government eye surgeon, at 58." "He opens a hospital of his own, with eleven beds." |
| Problem | "Around him, millions of people are blind from a cataract: the lens inside the eye turns cloudy, until it lets no light through." "A blind farmer can't work his field. A blind grandmother needs a child to lead her, and the child stops going to school." "A short operation can give their sight back." "But most of them are too poor to pay for it, and live far from any surgeon." "Surgery as hospitals did it then would never reach them all." |
| Solution | "He starts by saying what his hospital is for: sight given back, to everyone who needs it." "Then who it's for, in groups: those who can pay, those who can pay a little, and those who can pay nothing." "Six of the eleven beds are for those who pay nothing." "Those who can't come are reached in their villages, at eye camps, and brought in by bus." "Then he designs everything below for them: how each operating room flows, who does each step, and what it costs." "When bought lenses cost too much, the hospital makes its own, from 1992, for a few dollars each." |
| Benefits | "Today Aravind's hospitals do over four hundred thousand operations a year, more than half of them free or for very little." "Those who pay cover those who can't, and the outcomes hold: in 2007, complications in under two operations in a hundred." Then the same for data: "A data team serves people too, and it can lose sight of who." "Say what each service is, and who it's for, and every system below can be designed for someone." |
| Back to the story | At the end, with its benefit for data: "In Madurai, the eleven beds came after one sentence: sight, for everyone who needs it." "Helena's team did the same with data: every request now finds its service, and every system its customer." |

The test: someone who has never heard of Aravind can say, from the narration alone, why it was a problem (millions blind from a cataract, unable to work, a child kept from school to lead a grandmother, and most too poor to pay or too far from a surgeon) and what the fix gave people (their sight back, over 400,000 operations a year, more than half free or for very little, with outcomes that hold).

## The reference, and practice

The module's spine holds (TOGAF's method, ArchiMate's words; `../../a-plan-in-ninety-days/proposal.md`). This film names, once each:

| Body of knowledge | What the film takes | Where |
|---|---|---|
| ArchiMate (The Open Group) | Four of the five layers: strategy, business, application and technology. It has no information layer | *Down every layer*: "Four are ArchiMate's layers; information is what TOGAF calls data." |
| TOGAF's four architectures | Business, data, application, technology; the author's "information" is TOGAF's data | The same line |
| DAMA-DMBOK2 | Data and information used as one word; the discipline is data architecture | *Down every layer*, on screen: "TOGAF and DAMA call it data" |
| The service catalogue (ITIL) | Services listed in a customer's words | *Four services, one page*, with governance's own catalogue in *A capability, not a project* |
| The value proposition canvas (Osterwalder and others, 2014) | A customer's pains and gains, in their words | *Who each is for* |

Where the film differs: the frameworks treat these as separate practices (service management, product strategy, enterprise architecture), often owned by different teams; here they are one habit of the data manager's, as the author asked: services first, then customers, then every layer for them. Five layers are the author's (strategy, business, information, application, technology). Four of them are ArchiMate's layers; ArchiMate has no information layer (it keeps a business object in its business layer and a data object in its application layer, as *Listen first* shows), and TOGAF and DAMA call that layer data. The author's answer of 12 November 2026: the five layers stay, and "data" or "information" are both fine at the enterprise level. So the film says "At the level of the whole university, either word is fine", and names *Between the business and the systems*, the film that explains the two words. Until that day the line read "They're ArchiMate's layers, with TOGAF's data called information", which gave ArchiMate a layer it doesn't have.

Practice, from the author's advice: define your services first, in a customer's words; name your suppliers and customers in groups; write each group's pains and drivers; walk each service down every layer, one picture each; if a system serves no customer's need, ask why it's there. Every one of these is said in *On Monday*.

## What each object stands for

| On screen | What it stands for |
|---|---|
| The hospital cut open, its eleven beds | The service's smallest form: what it's for, before anything below is designed |
| Six beds outlined in blue | A design decision made for one group of customers |
| The eye camps and the bus | Reaching the customers who can't come |
| The operating room's four steps | Everything below designed for the service: its flow, its roles, its costs |
| Helena's page of four services | The service catalogue, in a customer's words |
| Suppliers, services, customers, joined | The team's work as a business of its own |
| Four customer sheets | Segments, each with what hurts and what drives it |
| Noor's map, the services and customers on it | The architecture's one picture, kept by the architect |
| Five stacked layers, the customers at the top | One service walked down every layer, a picture each |
| 38 small reports, 17 in amber | Systems that serve no customer's need |
| Four trays under the front door | Every request landing on a service; three that land on none |

## The look

The module's sunlit plaster, bundled as it is (`films/the-new-skills/shared/`). Madurai is drawn in the same matte language, lit from the right like the rooms: the hospital cut open like the module's section of the teaching building, a low whitewashed building with a flat roof; a farmer in a cotton shirt with a cloth over his shoulder, an older woman in a sari, its end over her shoulder; the doctor in a white shirt and glasses. No pattern or ornament borrowed from the place; nobody is a likeness. The poster is the five layers under their customers.

## Script

### 1 · Sight, for everyone · 0:00–2:17
Madurai, 1976, the hospital cut open, still empty; the doctor by the ward's wall; eleven beds; an eye seen from the side, its lens clouding; the farmer and the grandmother in a dry field, what blindness costs them, the short operation, why most never have it; what the hospital is for, its three groups, six beds outlined in blue; the eye camps and the bus on a map; the operating room's four steps and their costs; the lenses; what got better. Then the team's room: "Who is each service for?" and five layers under it, which become the title card.

### 2 · Four services, one page · 2:17–3:24
The series said once. May 2027: the strategy approved in April; Helena runs her team's work as a business of its own. Her page of four services, each named as it comes in; a service catalogue, as governance's own. The suppliers, joined to the services.

### 3 · Who each is for · 3:24–4:28
The customers, in four groups, on the right of the chain; from the 31 conversations of *Listen first*. Each group's sheet, what hurts and what drives it; the value proposition canvas, in a line. Noor puts the services and their customers on her map.

### 4 · Down every layer · 4:28–5:46
Helena and Noor walk governed data products down five layers, each picked out as it's described; ArchiMate's and TOGAF's names in one line, then a note: the information layer lights up under "TOGAF and DAMA call it data", either word is fine at this level, and *Between the business and the systems* tells why. Each picture names its customer at the top. The old warehouse: 17 of 38 reports that no one has opened in a year, and one question.

### 5 · Every request lands somewhere · 5:46–6:31
Monday 7 June: the front door opens; 42 of 45 requests fly into the four services' trays; Graham's lands on analysis; three land on none, two handed to digital services with a note, one filling a gap in advice and training.

### 6 · On Monday · 6:31–7:18
Madurai, framed on the team's wall, its one sentence; every request its service, every system its customer. Four things to do on Monday; the five layers under their customers become the end card.

## Sound

A nyckelharpa, reserved for this film in the module's palettes (10 November 2026), with its own low strings plucked as its partner; made in `source/tools/score.py`. The mark: a note offered and a note answered (A, C sharp, E rising; F sharp, E, high A answering). A major, F sharp minor for the problem, tuned pure from A; nothing from the opening's place. No chapter is urgent. `tools/quiet.py` passes: music 15% of the time after the opening, once every 11.6 s, the effects one at a time.

## Pause and think

After *Who each is for* (why write each group's pains and drivers: designed for a need a customer said, not the team's guess), *Down every layer* (17 unopened reports: ask why each is there, not switch them off that night) and *Every request lands somewhere* (three on none: where the page needs to change, not a fifth service). Right answers at options 3, 1 and 2, one near miss each.

## Labs (candidates)

- Write your team's services on one page, in a customer's words, and place last month's requests on them.
- Walk one service down five layers, a picture each, and mark any system no customer needs.

## Rigour to check before recording

Checked on 10 November 2026:

- Aravind Eye Hospital opened in Madurai in 1976 with eleven beds; Dr Govindappa Venkataswamy was 58, the government's retirement age, when he founded it; six of the eleven beds were for patients who could not pay. Sources: [aravind.org, *Our story*](https://aravind.org/our-story/); [Giraffe Heroes, *Govindappa Venkataswamy*](https://www.giraffe.org/govindappa-venkataswamy); [Quartz, 2017](https://qz.com/india/1086177/with-an-assembly-line-approach-an-indian-hospital-chain-performs-250000-eye-surgeries-a-year).
- Eye camps in villages, with patients brought to the hospital: the same sources, and the *Bulletin of the World Health Organization*, 2001, [*Restoring sight to the millions the Aravind way*](https://scielosp.org/article/bwho/2001.v79n3/270-271).
- Aurolab, set up in 1992 to make intraocular lenses; the figures for the lens's cost differ by source and date (from about $70 to $2 in one case study; about $8 in 2001; about $2 for rigid lenses later), so the film says "a few dollars each", with no number. Sources: [Scroll, on the Bridgespan case study](https://scroll.in/pulse/853183/scroll_in); the WHO *Bulletin*, 2001; [*Community Eye Health Journal*, *Cataract surgery at Aravind Eye Hospitals: 1988–2008*](https://cehjournal.org/?p=2852).
- Over 400,000 surgeries or laser procedures a year, more than half free or steeply subsidised: [IAPB's member directory, Aravind Eye Care System](https://www.iapb.org/connect/members/members-directory/aravind-eye-care-system-2/); the film says "over four hundred thousand operations a year, more than half of them free or for very little".
- Complications: 1.6% of 73,323 cataract operations at the Madurai hospital in 2007, from the *Community Eye Health Journal* article; the film says "under two operations in a hundred". The common claim that its outcomes are better than the British health service's is not used: its source gives no comparison.
- Paying patients' fees cover the free ones: every source above.
- The harm (a farmer who can't work, a child kept from school to lead a blind grandmother) is a general picture of cataract blindness in poor rural places, not a quote from a source about Aravind.
- ArchiMate's layers and TOGAF's four architectures: The Open Group's pages, as linked on the film's page. No product's release status is said or shown.
- Checked again on 12 November 2026, for the reworded line: ArchiMate 4 (The Open Group, C260, 27 April 2026) has strategy, business, application and technology among its domains, which the films call layers as *The map before the data* does, and no information layer or domain (a business object sits in its business domain, a data object in its application domain, as *Listen first*'s rigour sheet has it); its list of domains was read that day from the contents of The Open Group's pocket guide to version 4 and from Marc Lankhorst's notes on it, found by search, not from the specification itself. The TOGAF Standard, 10th Edition, names four architecture domains (business, data, application, technology); DAMA-DMBOK2 (revised edition, 2024), chapter 1, uses data and information as one word and calls the discipline data architecture: both as *Between the business and the systems* cites them in its script.

## Pacing report

`tools/pace.py`, 12 November 2026: 7:18.2, 918 words, 126 words a minute, the voice 71% of the time; every chapter from 120 to 134 words a minute; no sentence with under 0.5 s after it.
