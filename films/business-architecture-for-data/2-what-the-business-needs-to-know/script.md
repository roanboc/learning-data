# Business architecture for data · What the business needs to know: script

*The script of *What the business needs to know*, film 2 of 5 of *Business architecture for data*, the second series of the topic *Enterprise architecture*, in nine chapters, in English, drawn in the look of *The map before the data*. Written on 12 November 2026 from the series' proposal, which the author confirmed and merged on 11 November 2026 (PR #318), and this film's row in it: industry reference models, the concepts each capability needs, business objects in the business's words, one definition per domain, and the glossary drawn from the map; and one capability that needs a concept nobody holds.*

## The promise

Every line passes two tests: someone new to data work can follow it, and a business architect, a data architect or a data governance lead finds nothing wrong in it. Its idea, from the series' second insight: never start from a blank page; an industry reference model gives the first draft, and every element is confirmed with the business, named in its own words and defined once in its domain, before anyone builds it.

**Takeaway:** "Each concept, defined once in its domain, in the business's own words."

## The story in one paragraph

In the desert villages of Iran, the water of a qanat is owned in shares of time, and a share can be sold, split or left to one's children. But a share didn't mean the same everywhere: on one qanat the water came round every six days, on another every twenty-two. When land passed to the farmers who worked it in the 1960s, the government asked for written deeds to the water, and in some villages the deeds added up to more than twenty-four hours of water a day; owners fought, sometimes violently, and some villages broke apart. Before anyone could count the water, a share had to mean the same to everyone who held one. In Mahan, near Kerman, one qanat's water was measured against the day itself: fifteen shares of ninety-six minutes, each coming round every twelve days, so the shares add up to exactly one day's water. Because a share meant one thing, another of the town's qanats, shared by three men in the 1860s, could pass bit by bit to some seventy families, and shares there could be split as fine as thirty seconds and still add up. At the utility, the business needs the same: each thing it counts, defined once, in its own words, before anyone builds it.

## Opening story

The four beats, each said outright (AGENTS.md, *Every opening story has four beats*), checked against Paul Ward English's account of qanat villages and Ann Lambton's history of the land reform (*Rigour*, below). The series follows one true story across its five films (the author, 11 November 2026); this film tells what a share of water means.

| Beat | The line that says it |
|---|---|
| Scenario | "In the desert villages of Iran, the water of a qanat, a tunnel from the mountains, is owned in shares of time." "A share can be sold, split, or left to your children." |
| Problem | "But a share didn't mean the same everywhere." "On one qanat, the water came round every six days. On another, every twenty-two." "In the 1960s, as land passed to the farmers who worked it, the government asked for written deeds to the water." "In some villages, the deeds added up to more than twenty-four hours of water a day." "Owners fought, sometimes violently, and some villages broke apart." "Before anyone could count the water, a share had to mean the same to everyone who held one." |
| Solution | "In Mahan, near Kerman, one qanat's owners measured every share against the day itself." "A day of its water was fifteen shares, and each share came round every twelve days." "Each share was ninety-six minutes, so fifteen make exactly one day: the shares add up to the water." |
| Benefits | "Another qanat there, shared by three men in the 1860s, passed bit by bit to some seventy families." "Because a share meant one thing, it could be sold, inherited, split as fine as thirty seconds, and still add up." Then the same for data: "At the utility, the business needs the same: each thing it counts, defined once, in its own words, before anyone builds it." |
| Back to the story | In *In the business's words*: "As in Mahan, the measure is shared, and the words are the people's own." And at the end, with its benefit for data: "In Mahan, a share means the same to everyone who holds one, so the water can be counted, and shared." "At the utility, each concept now means one thing in its domain, in the words of the people who use it." |

The test: someone who has never heard of a qanat can say, from the narration alone, why it was a problem (a share meant different things on different qanats, so when the government asked for deeds, some villages' deeds added up to more water than a day holds, and owners fought until some villages broke apart) and what the fix gave people (in Mahan every share was measured against the day, fifteen shares of ninety-six minutes making exactly one day, so a share could be sold, inherited or split as fine as thirty seconds and the shares still added up to the water, as one qanat passed from three men to some seventy families).

## The reference, and practice

The series' reference holds (`../proposal.md`): the BIZBOK Guide for business architecture; DAMA-DMBOK2 for the glossary and ownership; ArchiMate for the map; and, for this film, the industry's reference models. Named once each, never taught as products.

- **What the film adopts.** BIZBOK's information map, the business's concepts, drawn from the capabilities that need, create or change them; on Tomás's map they sit in the information layer, under the strategy layer's capabilities, as *The map before the data* draws them. ArchiMate's business object for each concept. DAMA-DMBOK2's business glossary, with each term's definition and owner.
- **Never a blank page.** The industry's reference models give the first draft. For electricity: the IEC's Common Information Model (CIM, IEC 61970 and 61968), IEC 61968-1's interface reference model (what a distribution utility does, and the business objects each part uses, drawn in ArchiMate since its 2020 edition), the Smart Grid Architecture Model, and the ENTSO-E, ebIX and EFET Harmonised Electricity Market Role Model. Others are named once: BIAN for banks, TM Forum for telecoms, ACORD for insurers, HL7 FHIR for health and HERM for universities. Each element is marked as a draft, with where it came from, until the people who run the capability confirm it (the series' plan: a reference model presented as the organisation's own is a known mistake).
- **In the business's words.** Where the reference model's word isn't the business's, the map uses the business's and keeps the reference model's beside it, for when data is exchanged: CIM's usage point and the market role model's metering point stand beside the utility's connection point.
- **One definition per domain.** Each word is defined once, in its business domain, with the people who use it; a word several domains share, like location, sits in a shared domain, so each word's owner is easy to find (the author, 11 November 2026: the glossary is grouped by business domain, and by data domain for the definitions several share).
- **The glossary drawn from the map.** One term for each business object, with its definition, domain and owner. It needs no tool to start: a table is enough, as long as every term has an owner. Later, the data team's tables and reports point to the terms they hold (*One language, kept*, in *Data architecture*, takes this further).
- **From practice.** Start from what already hurts, not a catalogue of everything: the film follows connecting customers, where new solar waits thirty-four working days, to a concept nobody holds yet. The business names it and owns it before the data team builds it (AGENTS.md, *Definitions come from the glossary*).
- **The data practice on the map.** The film's piece of the author's idea (the proposal, *The data practice on the map*): the glossary's domains appear on the business layer, with the business objects in them and each domain's owner. *What the business owns* drew the data team, its service, tickets, and account and connection point; *Who creates it, who owns it* adds the owners and stewards as roles.

## What each object stands for

- **The village cut away, and the panel above it:** the qanat's water reaching the fields at their gates, with the shareholders by their fields; the panel shows what a share is: one day of water in its owners' shares, two turns of the water (every six days, every twenty-two), then the deeds of the 1960s laid along one day, the last running past twenty-four hours in red.
- **Mahan's days of water:** a dial for one day of one of the town's qanats, its fifteen shares of ninety-six minutes, each lit in its turn, and twelve circles for its twelve-day turn; beside it, a second dial for the qanat built in the 1860s, first six shares held by three men, then split, bit by bit, among some seventy families, and the day still adding up. Drawn plainly, in the series' own style, with nothing borrowed from Persian art.
- **Tomás's wall:** paper notes are drafts, blue where a reference model gave the word, with a "CIM" label, and yellow where the business named it; glass in the layers' colours is the confirmed model. The capabilities are in the strategy layer's light gold, the concepts below them in the information layer's salmon; solid lines for what a capability creates, dashed for what it only reads.
- **The reference models:** glass cards, each with who keeps it and what it is; the IEC's list of business functions with their business objects; the Smart Grid Architecture Model's planes, from business at the top to components at the bottom.
- **A concept lifted off the wall:** a business object, its name, its definition, its domain and its owner, read in the middle, then carried back to its place.
- **The domains:** dashed outlines in the domains' colours, blue for the network, rose for retail and cyan for what they share, each with its owner in gold.
- **The street of houses with solar on their roofs:** one cable from the transformer at its end; as more solar shines, the voltage at the street's end rises toward its limit and the cable warms: what hosting capacity measures.
- **The glossary:** a table, one row per term, with its definition, domain and owner, grouped by domain; later, a table and a report point to the terms they hold.
- **The data practice on the map:** the data team, tickets and service from *What the business owns*, on the business layer, now with the glossary's domains, the business objects in them and their owners.

## The look

*The map before the data*'s look, from `films/enterprise-architecture/shared/`: paper drafts on a wall, the confirmed model in glass, the six layers in their colours, and the same people at the same energy utility. The series' own components are in `../shared/src/ba.js`: the village, the qanat in section, the day of water and the data practice. In the desert, blue is the water, and the people of the story are silhouettes.

## Script

### 1 · A share of water · 0:00–1:43

In the desert villages of Iran, the water of a qanat, a tunnel from the mountains, is owned in shares of time.
A share can be sold, split, or left to your children.
But a share didn't mean the same everywhere.
On one qanat, the water came round every six days. On another, every twenty-two.
In the 1960s, as land passed to the farmers who worked it, the government asked for written deeds to the water.
In some villages, the deeds added up to more than twenty-four hours of water a day.
Owners fought, sometimes violently, and some villages broke apart.
Before anyone could count the water, a share had to mean the same to everyone who held one.
In Mahan, near Kerman, one qanat's owners measured every share against the day itself.
A day of its water was fifteen shares, and each share came round every twelve days.
Each share was ninety-six minutes, so fifteen make exactly one day: the shares add up to the water.
Another qanat there, shared by three men in the 1860s, passed bit by bit to some seventy families.
Because a share meant one thing, it could be sold, inherited, split as fine as thirty seconds, and still add up.
At the utility, the business needs the same: each thing it counts, defined once, in its own words, before anyone builds it.

*On screen:* "Iran · desert villages": the village cut away at dusk, the qanat's water running to the fields at their gates, the shareholders by their fields. Above it, "one day of the qanat's water" in its owners' shares, each lit in its turn: one share "sold", one split in two, one "left to a child"; then "one share: the same everywhere?". "one qanat: every 6 days", "another: every 22 days", each with its days and its share's day lit. "Iran · the 1960s": "one day of water: 24 hours", the deeds landing along it as paper slips of 6, 5, 4, 4, 3, 2 and 2 hours, the last running past the day's end in red: "26 hours of deeds in a day of 24"; "disputes" over the village, then "some villages broke apart" as the fields dry; "a share has to mean the same to everyone". Then "Mahan, near Kerman · Iran": a dial, "the day", a hand going once round its twenty-four hours; "one of the town's qanats", "fifteen shares to a day", "each share comes round every 12 days" with twelve circles, "one share: 96 minutes", "15 × 96 minutes = 24 hours". Beside it, "another, built in the 1860s": six shares by "first, three men", split bit by bit into "then some seventy families"; "sold", "inherited", "split", "as fine as 30 seconds", "and the day still adds up". Then "Mahan: one share, one meaning" and "the utility: each thing it counts, defined once". The title: *What the business needs to know*, "each thing it counts, defined once".

### 2 · Tomás's next note · 1:43–2:09

Tomás's next note asks what the business needs to know.
He starts from the capabilities on his map: the eight things the utility must be able to do.
Each one needs some information, creates some, or changes it.
Those are the business's concepts. They go in the information layer, beneath the capabilities that use them.

*On screen:* the note from the end of *What the business owns*, "What does the business need to know?", with Tomás beside it. The eight capabilities come in across the strategy layer (plan the network, operate the network, maintain assets, connect customers, generate power, sell energy, serve customers, meet obligations); under three of them, empty outlines: "needs", "creates", "changes"; then "information layer" beneath.

### 3 · Never a blank page · 2:09–3:24

He doesn't start from a blank page.
Utilities share reference models, written by their industry's standards bodies.
The IEC, which sets the world's electrical standards, keeps the Common Information Model, CIM.
It names what a utility works with, from its cables and meters to its customers, and how they relate.
One of its standards lists what a distribution utility does, and the business objects each part uses.
Its 2020 edition draws them in ArchiMate, the language of Tomás's map.
The Smart Grid Architecture Model shows where each part sits, from the power station to the home.
And Europe's market role model names who does what in the electricity market.
Other industries have their own, from BIAN for banks to HERM for universities.
Tomás takes CIM and the IEC's list as his first draft, and the map says where each element came from.
A reference model isn't the utility's own until its people confirm it, so every element starts as a draft.

*On screen:* a blank page, set aside. "the industry's reference models": four outlines filling in turn: "IEC 61970 · 61968, Common Information Model"; "IEC 61968-1:2020, interface reference model"; "CEN-CENELEC-ETSI, Smart Grid Architecture Model"; "ENTSO-E · ebIX · EFET, market role model". CIM's classes, from cables and meters to customers ("usage point" among them), joined to show "how they relate". The IEC's business functions (network operations, records and asset management, operational planning, maintenance and construction, network extension planning, customer support, meter reading and control, customer account management), with their business objects (meter reading, meter, account, bill), each function drawn with ArchiMate's glyph: "ArchiMate: the language of Tomás's map". The Smart Grid Architecture Model's planes rising from component to business, "from the power station" to the home. The market role model's roles: "balance supplier", "grid access provider", "metered data responsible": "who does what". Then BIAN (banks), TM Forum (telecoms), ACORD (insurers), HL7 FHIR (health) and HERM (universities). Back on the wall, the first draft: meter reading, outage, connection point, meter and account as blue notes, each with a "CIM" label: "each element: where it came from"; then "a draft, until its people confirm it".

### 4 · What each capability needs · 3:24–3:59

He goes through the capabilities one at a time, with the people who run each one.
Connecting customers needs a connection request, the network's capacity, a connection point and a meter.
Serving customers needs accounts, bills and complaints.
Operating the network needs meter readings and outages.
Some of these a capability creates; others it only reads.
Most of them, CIM already names, so the first draft comes quickly.

*On screen:* the camera glides on along the wall. Grace and the head of retail are named over the capabilities they run. Connecting customers: "connection request" and "network capacity" as new yellow notes, the business's words, beside the CIM notes for connection point and meter; serving customers: account, then "bill" and "complaint"; operating the network: meter readings and outages. Lines from each capability to its concepts: solid where it "creates it", dashed where it "only reads it"; then "most from CIM" as the blue notes glow.

### 5 · In the business's words · 3:59–4:52

But CIM's words aren't always the utility's.
CIM calls a connection point a usage point. Europe's market role model calls it a metering point.
Grace's people call it a connection point, and so do their forms, their reports and their customers.
So the map uses the business's word, and keeps the reference model's beside it, for when data is exchanged.
As in Mahan, the measure is shared, and the words are the people's own.
Each word gets one definition in its domain, written with the people who use it.
The network's words sit with the network, and retail's with retail.
A word both use, like location, sits in a shared domain, so each word's owner is easy to find.

*On screen:* the connection point's note is lifted off the wall to be read, the rest of the wall stepping back. Beside it, "CIM: usage point" and "market role model: metering point". "Grace's people": a connection form, a network report and a letter to a customer, each saying "connection point". On the map, the note turns to glass, a business object, "connection point", with "also: usage point (CIM) · metering point (market)" and "kept for when data is exchanged". A window onto Mahan: the day of fifteen shares, "the measure: the day, shared by everyone", "the words: the town's own". Its definition: "a place where power is delivered", "domain: network", "written with Grace's people". Carried back to the wall, the notes are confirmed in their domains: "network" around the network's words, "retail" around retail's, "shared" around location, with dashed lines to both; "owner: Grace", "owner: head of retail", "owner: Grace".

### 6 · A concept nobody holds · 4:52–5:40

Then the capability that hurts: connecting customers. New solar takes thirty-four working days to connect.
The wait is in assessing the network's capacity, and that needs one number: how much solar each street can take.
No system holds it, no report shows it, and nobody owns it.
Grace's engineers name it hosting capacity: the solar a street can take before its voltage or its cables pass their limits.
It goes on the map in their words, with Grace as its owner, and no data yet.
The data team will build it later. First, the business says what it means.

*On screen:* connecting customers turns red on the wall: "new solar: 34 working days". A street of houses, solar panels on some roofs, fed by one cable from the transformer at its end: "the wait: assessing the network's capacity", "how much solar can each street take?"; "no system", "no report", "no owner", each crossed. More panels shine; the voltage at the street's end rises toward its limit, "the cable warms": "hosting capacity", "the solar a street can take before its voltage or its cables pass their limits". Back on the wall, its note is lifted to be read: a business object, "hosting capacity", its definition, "owner: Grace", "no data yet", "data team: later". Without words, it goes back on the map in the network's domain, where "network capacity" was.

### 7 · A glossary from the map · 5:40–6:09

Each concept on the map is a business object, with a name, a definition, a domain and an owner.
The glossary is drawn from them: one term for each, grouped by domain.
It doesn't need a tool to start. A table is enough, as long as every term has an owner.
Later, each table and report the data team builds will point to the terms it holds.

*On screen:* "business object": hosting capacity's name, definition ("the solar a street can take within its limits"), domain (network) and owner (Grace), each lit as it's named. The glossary, one row at a time, grouped by domain: connection point, meter reading and hosting capacity (network, Grace); account and bill (retail, head of retail); location (shared, Grace). The owner column lit: "no tool needed to start: a table is enough". Then "later": "table · meter readings" and "report · connections", each with a dashed arrow to the terms it holds.

### 8 · The data practice on the map · 6:09–6:34

On the data practice's map, the glossary's domains appear: the network, retail, and what they share.
Meter readings and hosting capacity join the network, and bills join retail. Location sits in the shared domain.
The connection point and the account were already there. Now each sits in its domain, with its owner.

*On screen:* the glossary leaves; "the data practice, on the map", on the business layer, as *What the business owns* left it: the data team, tickets and "answer data requests", with connection point and account, and the dashed outlines still to fill. "the glossary's domains": network, retail and shared; meter reading and hosting capacity join the network, bill joins retail and location the shared domain; the connection point and the account move into theirs; each domain's owner in gold: Grace, head of retail, Grace.

### 9 · One meaning, everywhere · 6:34–7:02

In Mahan, a share means the same to everyone who holds one, so the water can be counted, and shared.
At the utility, each concept now means one thing in its domain, in the words of the people who use it.
Tomás's next note asks who creates each one, and who owns it.

*On screen:* the village again, "Mahan · Iran", with "one day of water in Mahan: fifteen shares", each share lit in its turn, and "a share: the same to everyone who holds one" as one field's gate opens. Then the utility: the wall with every concept confirmed in its domain, its owners named. Tomás's next note: "Who creates it? Who owns it?". The end card: "Each concept, defined once in its domain, in the business's own words." Film 2 of 5.

## Sound

The series began with a consort of viols, which the site turned out to have already (the topic's `palettes.md`); from this film on, each film of the series takes its own sound under that file's rules. Nothing new fitted, so this film pairs two instruments the site has but no film pairs, and no film of this topic plays: a clavichord and an oboe (`source/tools/score.py`; the film's assumptions file says why).

- **The lead:** a clavichord, brass strings struck by a brass tangent that stays on the string while the key is held: a soft, close note, a little metallic, the tangent's faint knock as it meets the string, and the cloth damping it the moment the key is let go; one string to a note, every partial in tune, nothing trembling. It spreads each chord from the bass up under the opening story and at a chapter's turn, and gives one note as a thing lands on the wall.
- **Its partner:** an oboe, low and soft (D 4 to A 5), each note tongued softly, held at one level, with no vibrato: plain notes in D major. Every orchestra tunes to the oboe's A, one note that means the same to every player, as a share in Mahan meant the same to everyone who held one.
- **The film's own figure, played once:** where a share has to mean the same to everyone, the oboe gives its A and the clavichord's A answers it.
- **The mark:** the clavichord plays D, then A, and the oboe holds the F sharp between them: the three layers this series covers, the business layer between the other two. Under the title, and again under the end card.
- **Its sounds:** the desert's wind; the water in the channel, one soft texture; the fields' wooden gates; the deeds' paper slips; and at the utility, cards, paper, keys, a pen, and knocks and taps as things are set on the wall.
- **Nothing borrowed:** no santur, tar, kamancheh, ney, daf or tombak, and no Persian mode. D major and its neighbours, tuned pure from D; B minor and F sharp minor for the disputes, a lack or a loss, and for the concept nobody holds.
- `tools/quiet.py` passes: under the opening story the music sounds 89% of the time; after it, 19% of the time, once every 13.9 s on average and at most four times in any 30 s; its loud moments at -29.5 dB, its loudest notes at -25.2 dB, the effects' loud moments at -45.5 dB, at most four starting in one second; 14 held notes, kept within 0.1 dB in the room.

## Pause and think

The film stops at the end of three chapters, one question each (`site/assets/what-the-business-needs-to-know/think.en.js` and `think.es.js`). The right answers sit in the first, third and second places, each question has a near miss, and every option is about as long as the others.

| Chapter | Question | Right | Near miss |
|---|---|---|---|
| *Never a blank page* | Tomás takes CIM and the IEC's list as his first draft. Why does each element still start as a draft? | Its words are the industry's: the people who run each capability still have to confirm them for their work. | Its words are the industry's: the data team still has to check each one before building anything from it. The data team builds from what the business has confirmed; it doesn't confirm the business's words. |
| *In the business's words* | CIM calls it a usage point and Europe's market role model a metering point; Grace's people say connection point. What goes on the map? | Connection point, the business's word, with usage point and metering point kept beside it for exchanges. | Connection point, the business's word, and the other two names are dropped, so nobody has two names to learn. The reference models' names are kept, for when data is exchanged. |
| *A concept nobody holds* | New solar waits thirty-four working days for one number nobody holds: how much solar each street can take. What comes first? | Grace's engineers name it hosting capacity and say what it means, and Grace owns it, though no data exists yet. | The data team builds it from the streets' voltage readings, then Grace's engineers name it and say what it means. First, the business says what it means; the data team builds it later. |

## Rigour

Checked on 12 November 2026.

| Claim | Source | Note |
|---|---|---|
| A qanat's water is owned in shares of time, which can be sold, split or inherited | P. W. English, "Qanats and Lifeworlds in Iranian Plateau Villages", in *Transformations of Middle Eastern Natural Environments*, Yale F&ES Bulletin 103 (1998), pp. 187–205 | Shares (*sahms*) held, inherited, divided and sold by named owners |
| On one qanat the water came round every six days, on another every twenty-two | English (1998): rotations "once every six days or twelve days to once every eighteen, nineteen, twenty-one or twenty-two days" | The film gives the two ends |
| In the 1960s, as land passed to the farmers who worked it, the government asked for written deeds to the water | A. K. S. Lambton, *The Persian Land Reform 1962–1966* (Oxford, 1969); English (1998): "Government land reform programs in the 1960s ... required written deeds to determine water ownership" | The reform gave land to the sharecroppers who worked it |
| In some villages the deeds added up to more than twenty-four hours of water a day; owners fought, sometimes violently, and some villages broke apart | English (1998): "Some settlements honestly or otherwise produced deeds that taken together made up more than twenty-four hours of water a day. The resulting chaos led to violent ownership disputes and sometimes to total social breakdown." | The 26 hours of deeds drawn on screen are an example, not a record |
| In Mahan, near Kerman, a day of one qanat's water was fifteen shares, each coming round every twelve days; each share was ninety-six minutes | English (1998): water from one of the town's four qanats "is divided into fifteen sahms ... on a twelve day rotation", "each sahm is equal to ninety-six minutes of water once every twelve days" | 15 × 96 minutes = 24 hours, as the film says. That the owners measured the shares against the day is the film's way of saying the division is the shareholders' own; English doesn't say who set it |
| Another qanat in Mahan, shared by three men in the 1860s, passed bit by bit to some seventy families | English (1998), from English (1989), on the Vakilabad qanat, built in Mahan in the 1860s: "initially, its water was divided among three men in six shares"; "sold off bit by bit such that some seventy families now own shares" | |
| A share split as fine as thirty seconds | English (1998): "in another qanat system in the same town ... the smallest portion has rights to only thirty seconds of water once every twelve days" | Said of Mahan's shares in general: on screen it sits in the list (sold, inherited, split), not on either drawn qanat's day |
| The IEC keeps the Common Information Model, which names what a utility works with, from its cables and meters to its customers, and how they relate | IEC 61970-301 (CIM base) and IEC 61968-11 (distribution extensions), IEC Technical Committee 57 | A UML model of classes and their associations; "usage point" is its class for a point in the network where readings or events are attributed |
| One of its standards lists what a distribution utility does, and the business objects each part uses; its 2020 edition draws them in ArchiMate | IEC 61968-1:2020, *System interfaces for distribution management, Part 1: Interface architecture and general recommendations*, edition 3 (29 April 2020): its interface reference model's business functions, moved to ArchiMate in this edition, which also added business functions and business objects ([IEC webstore](https://webstore.iec.ch/en/publication/32542)) | The eight functions on screen are from its list, including customer account management, which it places outside distribution management |
| The Smart Grid Architecture Model shows where each part sits, from the power station to the home | CEN-CENELEC-ETSI Smart Grid Coordination Group, *Smart Grid Reference Architecture* (2012): five interoperability layers (business, function, information, communication, component) across domains from generation to customer premises | |
| Europe's market role model names who does what in the electricity market, and calls the connection point a metering point | ENTSO-E, ebIX and EFET, *The Harmonised Electricity Market Role Model*, 2023-01 ([ENTSO-E](https://www.entsoe.eu/Documents/EDI/Library/HRM/Harmonised_Role_Model_2023-01.pdf)): roles such as balance supplier, grid access provider and metered data responsible, and the metering point | |
| Other industries have their own reference models | BIAN (banking), TM Forum (telecoms), ACORD (insurance), HL7 FHIR (health data), CAUDIT's HERM (higher education) | Named once, as the series' plan says |
| Each concept is a business object, with a name, a definition, a domain and an owner; the glossary is drawn from them, grouped by domain | The Open Group, ArchiMate 4 (April 2026): business object; DAMA International, *DAMA-DMBOK*, 2nd edition, revised (2024): business glossary | Grouped by business domain, and a shared domain for what several use (the author, 11 November 2026) |
| Hosting capacity: the solar a street can take before its voltage or its cables pass their limits | EPRI, *Defining a Roadmap for Successful Implementation of a Hosting Capacity Method for New York State* (2016), and the hosting capacity maps distribution utilities publish | The amount of distributed generation a feeder can take without voltage, thermal or protection limits being passed; the film names voltage and cables |
| The utility's numbers: eight capabilities, thirty-four working days for new solar, the domains and owners | Invented, as the series' world is; the eight capabilities are *The map before the data*'s | |

No feature's release status is said or shown.

## Pacing report

`tools/pace.py`, 12 November 2026: 7:02 in nine chapters, 902 words, 128 words a minute, the voice 71% of the time.

| Chapter | Length | Words a minute | Voice | Longest quiet |
|---|---|---|---|---|
| A share of water | 1:43 | 133 | 71% | 7.0 s |
| Tomás's next note | 0:26 | 125 | 69% | 2.4 s |
| Never a blank page | 1:15 | 129 | 76% | 2.4 s |
| What each capability needs | 0:35 | 117 | 69% | 2.4 s |
| In the business's words | 0:53 | 135 | 74% | 2.4 s |
| A concept nobody holds | 0:48 | 125 | 71% | 4.6 s |
| A glossary from the map | 0:29 | 137 | 69% | 2.7 s |
| The data practice on the map | 0:25 | 124 | 73% | 2.4 s |
| One meaning, everywhere | 0:28 | 113 | 56% | 7.8 s |

Every sentence has at least 0.5 s after it, and no chapter stops for 2.5 s or more inside it. The longest quiets are the opening's title and the end card, without words.
