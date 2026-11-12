# Platform and solution architecture · One platform, or many: script

*The script of *One platform, or many*, film 3 of 8 of *Platform and solution architecture*, the fourth series of the topic *Enterprise architecture*, in ten chapters, in English, drawn in the look of *The map before the data*. Written on 12 November 2026 from the author's brief of 11 November 2026 and the series' plan (`../proposal.md`), which the author confirmed that day. Made while the author was away; this film's questions and assumptions are in `docs/assumptions/05-enterprise-architecture/4-platform-and-solution-architecture/3-one-platform-or-many.md`. It carries no draft label (the four series' shared *Decided* table). The narration is in `source/src/narration.js`; this file gives its reasons.*

## The promise

Every line passes two tests: someone new to data work can follow it, and an enterprise architect, a data architect or a platform engineer finds nothing wrong in it. Its idea: every data platform brings its own rules, its own way to say who's who and who may see what, its own masks on private data, its own lineage and its own log, so every platform added keeps every rule again, and keeps it in step with the others. For most organisations the simplest architecture is one platform, with every domain owning its data on it, which is what a data mesh's self-serve platform is; many platforms, joined, fit only a few. A second platform is kept only for a reason you can name: a company just bought, until it moves; a separate legal entity that must keep its data apart; data that must stay in its own country. Open table formats and a federated catalogue lessen the harm, but the second set of rules stays. And moving to one platform takes months, not years.

**Takeaway:** "Every platform brings its own rules: keep one, and a second only for a reason you can name."

## The story in one paragraph

Japan, 1462: boats carry rice, goods and people along the Yodo River, between Kyoto and the sea. Every stretch of river and road has owners (the court, the shogunate, temples, shrines and lords), and any of them may set a barrier across it, where everyone who passes pays a toll. That year, it's said, the Yodo alone had 380 barriers, and the road to Ise once had sixty in the eighteen kilometres from Kuwana to Hinaga. A load stopped and paid at every one, so goods came late and dearer. Lords cleared the barriers from their own lands, Oda Nobunaga among them; from about 1585 Toyotomi Hideyoshi forbade the tolls; under the Tokugawa the five roads ran under one set of rules, whoever's lands they crossed, and in 1635 the lords were forbidden barriers of their own. Each domain kept its own lord, laws and taxes, and the road was what they shared. Travellers paid for a horse, a porter or a night at an inn, not for every owner they passed, and in 1771 more than two million pilgrims went to Ise. At the utility, two parts of the business each bought a data platform, years ago, from two vendors: one became the data platform every other domain uses; the other is generation's, with the readings from its hydro and wind farms. The enterprise domain needs both for one measure, the share of green-tariff customers' use, hour by hour, met by the utility's own farms, and its analysts propose a third product to query both where they are. Ama asks for the measure in a ticket, and Ravi Menon draws what each would bring: its own way to say who's who and who may see what, its own masks, its own lineage and its own log, so every rule would be kept three times. He keeps to one rule, the simplest architecture that does the job, and proposes one platform, with every domain owning its data on it, as a data mesh's self-serve platform is. Generation's platform has no reason to stay, so it moves: its tables are already files in an open format in the utility's own cloud storage, so their data needn't be copied; the data platform's catalogue federates generation's until the move is done, so Ama's measure starts at once; a tool converts most of the jobs' code, the data team reviews each pull request and compares every number with the old platform's for a month, generation checks its own reports in test, and after four months the old platform is switched off. Every rule is kept once now, the measure is built once with its lineage whole, and the two people who kept the old platform running build generation's data products.

## Opening story

The four beats, each said outright (AGENTS.md, *Every opening story has four beats*), checked against the sources in *Rigour*, below. The series follows one story across its eight films; this film's beats come from its own part of it, the road before the Gokaidō, when every owner could set a barrier and take a toll.

| Beat | The line that says it |
|---|---|
| Scenario | "Japan, 1462." "Boats carry rice, goods and people along the Yodo River, between Kyoto and the sea." "Every stretch of river and road has owners: the court, the shogunate, temples, shrines and lords." "Any of them may set a barrier across it, where everyone who passes pays a toll." |
| Problem | "That year, it's said, the Yodo alone had 380 barriers." "On the road to the shrines at Ise, there were once sixty in eighteen kilometres." "A load stopped and paid at every one, so goods arrived late, and dearer for every barrier they passed." "Merchants and travellers needed a road they could use without paying every owner on it." |
| Solution | "Lords began clearing the barriers from their own lands, Oda Nobunaga among them." "From about 1585, Toyotomi Hideyoshi forbade the tolls, and barriers across the country came down." "Under the Tokugawa, the five roads ran under one set of rules, whoever's lands they crossed." "In 1635, the lords were forbidden barriers of their own." |
| Benefits | "Each domain kept its own lord, its own laws and its own taxes. The road was what they shared." "Travellers paid for what they used, a horse, a porter, a night at an inn, not every owner they passed." "In 1771, more than two million pilgrims went to Ise." Then the same for data: "At the utility, Ravi finds barriers too: two data platforms, from two parts of the business, and a third product proposed to join them." "Each brings its own permissions, policies and logs, so every rule would be kept three times." "So Ravi proposes one platform: every domain owns its data on it, and every rule is kept once." |
| Back to the story | Along the way, in *Three sets of rules*: "Every platform is a barrier with its own toll, and whoever crosses it pays: in rules kept again, and kept in step." In *When two can't be helped*: "The shogunate kept some barriers too: about fifty checkpoints, there to keep order and check who passed." "Keep a second platform the same way: only for a reason you can name." At the end, with its benefit for data: "Between Kuwana and Hinaga, where sixty barriers had stood, the Tōkaidō ran under the same rules as the whole road." "At the utility, there's one platform now, and every domain still owns what it builds on it." |

The test: someone who has never heard of Japan's toll barriers can say, from the narration alone, why they were a problem (anyone who owned a stretch of river or road could set a barrier and take a toll, so a load stopped and paid at every one, hundreds on one river and sixty in eighteen kilometres of one road, and goods came late and dearer) and what the fix gave people (the barriers came down and the roads ran under one set of rules through every domain, so travellers paid only for what they used, a horse, a porter, a night at an inn, and in 1771 more than two million pilgrims went to Ise).

## The reference, and practice

The series follows TOGAF 10 and ArchiMate 4, as *The map before the data* does (`../proposal.md`, *Reference and alternatives*). This film names, once each:

| Body of knowledge | What the film takes | Where |
|---|---|---|
| TOGAF 10: architecture principles, each with a statement, its rationale and its implications | Ravi's rule as a principle: one platform, and a second only for a reason anyone can name | *As simple as it can be*, *The data practice on the map* |
| ArchiMate 4: nodes and the technology services they realise; application components; the motivation layer's principle; the implementation and migration layer's work package | Generation's platform as a second node with its own services to govern and secure; each domain's data products in the application layer; the rule as a principle; the move as a work package, ending the day the old platform was switched off | *The data practice on the map* |
| Zhamak Dehghani, *Data Mesh* (2022): domain ownership, data as a product, a self-serve data platform, federated computational governance | Each domain owns its data, as products, on a self-serve platform, under rules the domains agree together; that platform is one platform, shared | *Many owners, one platform* |
| Thoughtworks, *The state of data mesh in 2026* | Done badly, a data mesh is the old teams with new names, and nobody in the business owning anything | *Many owners, one platform* |
| DAMA-DMBOK 2: data security, metadata, data governance | The four sets of rules every platform brings: who may see what, masks on private data, lineage, and a log of who did what | *Three sets of rules* |
| Open table formats (Delta Lake and Apache Iceberg among them) and catalogue federation | Two platforms that read the same files, and one catalogue where people find all the data; each platform still keeps its own permissions, policies and logs | *When two can't be helped*, *Generation moves* |

Where the film differs: data mesh's fourth principle, federated computational governance, is about who agrees the rules, not how many platforms keep them; the film shows the rules agreed together and kept once, on one self-serve platform, and says a data mesh is *often* the simplest architecture, not always. No standard counts the sets of rules a platform brings; the four are the ones every data platform keeps for itself, named in plain words, and the film shows three of them at work (masks, rights and lineage), with the log as the fourth.

Practice, from the author's brief: keep the architecture as simple as possible, since unmanaged complexity is what makes services fail; few components, on one platform, for most organisations, and many platforms, joined, only for a few, such as a group spread over many countries; every platform brings its own governance layer; moving to one is easier than it was, months, not years. Ama asks in a ticket, the data team reviews the pull requests and compares the numbers, and generation checks its own reports in test before the old platform goes (AGENTS.md, *Business users ask in tickets*). All of it is said in *As simple as it can be*, *When two can't be helped* and *Generation moves*.

## What each object stands for

| On screen | What it stands for |
|---|---|
| Japan's coast, the camera gliding in to Kyoto, the Yodo and the sea; boats on the river as lights, both ways | The Yodo in 1462, between Kyoto and the sea |
| Each bank's stretch in its own tint, its owner named beside it: the court, the shogunate, a temple, a shrine, a lord | Every stretch of river and road had owners |
| A barrier across the river, close: a post on each bank, a red bar between them, a toll house with its lantern; a boat comes down, stops, pays a coin, and the bar opens | Any owner could set a barrier, and everyone who passed paid a toll |
| 380 fine bars across the Yodo, like hatching; the road from Kuwana to Hinaga, sixty bars in it, its eighteen kilometres bracketed | The count: 380 on the Yodo alone, it's said, and once sixty in eighteen kilometres of the road to Ise |
| A boat coming down by fits and starts, a coin added above it at each stop | A load stopped and paid at every one, so goods came late and dearer |
| The road at dusk: a porter, a horse and its driver, a merchant and a pilgrim waiting at a barrier, a guard with a spear | Waiting, and paying, at every barrier |
| The barrier's bar lifted away, its posts taken down; the queue walks on | Lords clearing the barriers from their own lands |
| The whole country, its roads' and rivers' bars going out from west to east | From about 1585, the tolls forbidden |
| The five roads drawn through the patchwork of domains, each domain lit in turn | One set of rules for the roads, whoever's lands they crossed; each domain kept its own lord, laws and taxes |
| A station and an inn at dusk: a traveller takes a horse, a porter carries a load, pilgrims walk to the inn | Paying for what you use, not for every owner you pass |
| Ravi, the data platform and generation's platform, a dashed box above them, *a third product*, a red bar across each of its links | Two platforms, a third proposed, and a barrier at every border |
| Four small bands on each, lit together; *every rule kept three times* | Each brings its own permissions, policies and logs |
| The data platform widening to take every domain's block, generation's among them; *one platform · every rule kept once* | Ravi's proposal |
| The two platforms, each domain's block on its own; *bought years ago*; generation's, *readings: hydro and wind farms* | Two platforms, from two vendors |
| A measure's card, its dashed lines to both platforms; the third product's dashed box, its arrows to both; *nothing would have to move* | The measure that needs both, and the analysts' proposal |
| Ama's ticket; *to Ravi: how should it be built?* | The ask, in a ticket |
| Three columns side by side, the third product's between, each with four bands and a glyph for each: a person with a key, a value masked, three nodes joined, a log | What each brings: who's who and who may see what, masks, lineage, a log |
| A mask's glyph on the data platform and on the third product, a tick for each check | Meter readings masked twice, two ways, and checked in both |
| A key's glyph in all three columns, a tick in each | An analyst's rights granted in three places, three ways |
| A line from generation's platform toward the data platform, crossed at every border | The measure's lineage, stopping at each platform's edge |
| A red bar between the columns; *paid in rules kept again, and kept in step* | Every platform a barrier with its own toll |
| Ravi's rule on a card; a tangle of small parts, one going red | The simplest architecture that does the job; complexity nobody manages makes services fail |
| One platform with three domains on it; three small platforms, each in its own dashed border with a team, joined | Few components on one platform for most; many platforms, joined, for a group across many countries |
| *open formats*, *tools that convert most of the code*, *months, not years* | Moving to one is easier than it was |
| One self-serve platform, five domains' blocks on it, each with its owner; a gold line across the owners, *rules the domains agree together* | A data mesh: many owners, one platform |
| The owners gone, an empty place and a cross for each | Done badly: the old teams with new names |
| A second platform; three cards: a company just bought, a separate legal entity, data that must stay in its own country | When a second platform can't be helped |
| *the same files, in an open table format* under both, an arrow from each; one catalogue's card, its dashed lines to both | Open table formats, and a catalogue that federates the other's |
| A set of rules on each platform; *the second set of rules stays* | What open formats and federation don't take away |
| The country at dusk, three checkpoints lit: Hakone, Arai, Usui; *about 50 checkpoints, to keep order and check who passed* | The shogunate's own barriers, kept for a reason it could name |
| Generation's platform; *a reason to keep it? none* | No such reason |
| The utility's cloud storage under both platforms, generation's tables as files in it | Its tables already in an open format, in the utility's own storage |
| A catalogue on each platform's front face, a dashed line between them; *Ama's measure · started* | The data platform's catalogue federating generation's until the move is done |
| A pull request's card, *converted by a tool*, *reviewed by the data team*; *every number, old and new, compared for a month* | The code moved, and checked |
| Generation's reports, *checked by generation*; *after four months: switched off* | Generation checks its own reports in test; the old platform goes |
| One platform with every domain's block, one set of rules on its face | Every rule kept once |
| A mask on every domain's data; a tick on the rules' key | The mask holds everywhere; rights granted in one place |
| The green share, hour by hour, over one day, its lineage drawn from each farm's readings | Ama's measure, built once |
| *one platform to pay for, not two*, the third product crossed out, two people over generation's block | The cost, and the two people now building generation's data products |
| Tomás's map in ArchiMate: each domain's data products; the data platform's node; generation's, a second node with its own govern and secure services, outlined in amber | The second set of rules, in plain sight |
| The serve line from generation's node moving to the data platform's | Only what served generation's products changed |
| A principle across the top; a work package at the bottom, *ends: the old platform switched off* | Ravi's rule, and the move |
| The Tōkaidō past Kuwana at night, the sixty barriers' ghosts going out, travellers as lights both ways | One road, under the same rules |
| One platform, every domain on it, one set of rules | One platform now, every domain owning what it builds |

## The look

*The map before the data*'s look, bundled as it is (`../../enterprise-architecture/shared/`), and the series' kit (`../shared/src/psa.js`): its lantern amber for the road and what every domain shares, Japan's coast from Natural Earth's public-domain data, the stations, horses, walkers and inns, all in the series' own drawing style, light on a dark ground, never in the style of Japanese art. The film's own drawings: the Yodo and the road to Ise on a map whose camera glides from the whole country to one barrier and back, on the series' coast with its corners rounded off for the close looks, so the camera finds a shore and not the piers of today's ports; a barrier across the river with its toll house, and a river boat seen from above, its bales of rice and a lantern at the stern; a barrier on the road at dusk, its bar lifted and its posts taken down; an inn; the domains of the 1600s as a patchwork. The people of the 1400s to the 1700s are small silhouettes on the road, none a likeness. Ravi Menon is drawn as *An application or a platform?* drew him. Red is a barrier, the toll's own colour; technology green is the platforms and the rules they keep; blue each domain's data products; gold an owner in the business, and the rules the domains agree; amber what goes wrong, as the film's *how to read* line says. The two platforms stay put from *Generation moves* to *Every rule, once*, the camera gliding on; *Three sets of rules* and *Many owners, one platform* each open once the chapter before has left. The poster is the two platforms and the third product proposed to join them, each with its own rules.

## Script

### 1 · A toll at every barrier · 0:00–2:05
Japan, 1462: the camera glides from the whole country to Kyoto, the Yodo and the sea; boats on the river. The owners of each stretch named along its banks. One barrier, close: a boat comes down, stops, pays, and the bar opens. The count: 380 bars across the Yodo; the road to Ise, sixty in eighteen kilometres. A boat stopping and paying at every one, its coins piling up. The road at dusk: travellers waiting at a barrier; lords clear it, and they walk on. The whole country: barriers go out from about 1585; the five roads through every domain, under one set of rules; 1635. A station and an inn: a horse, a porter, a night at an inn; 1771, two million pilgrims. Then the utility: Ravi, two platforms and a third product proposed to join them, a bar across each link; three sets of rules; one platform, every domain on it, every rule kept once. The drawing without words, then the title.

### 2 · Two platforms, and a third · 2:05–2:50
The data platform with four domains on it; generation's platform, bought from another vendor, with the readings from its hydro and wind farms. The enterprise domain's measure, from both. The analysts' third product, querying both where they are. Ama's ticket, and the question for Ravi.

### 3 · Three sets of rules · 2:50–3:43
Three columns, the third product's between: each with its four sets of rules. Meter readings masked twice, two ways; an analyst's rights granted three times; the measure's lineage stopping at every border. A barrier between the columns: paid in rules kept again, and kept in step.

### 4 · As simple as it can be · 3:43–4:19
Ravi's rule on a card; complexity nobody manages, and a service that fails. For most, few components on one platform; for a few, a platform and a team in each country, joined. Open formats and tools that convert most of the code: months, not years.

### 5 · Many owners, one platform · 4:19–4:59
One self-serve platform, five domains on it, each with its owner: a data mesh, as Zhamak Dehghani set it out, under rules the domains agree together. Ownership spread out, the platform shared; often the simplest architecture. Done badly: the owners gone, the old teams with new names.

### 6 · When two can't be helped · 4:59–5:50
A second platform, and three cases. The same files in an open table format under both; one catalogue federating the other's. The second set of rules stays. The country in the 1600s: Hakone, Arai and Usui, among about fifty checkpoints; a second platform only for a reason you can name.

### 7 · Generation moves · 5:50–6:40
No reason to keep it. Generation keeps its data products, its people and its owner. The utility's cloud storage, generation's tables already files in it; the data platform's catalogue federates generation's, and Ama's measure starts. The pull request converted by a tool, reviewed by the data team; every number compared for a month; generation's reports checked in test; after four months the old platform is switched off, and the data platform carries generation's block where it was.

### 8 · Every rule, once · 6:40–7:10
One set of rules on one platform; the mask everywhere; rights granted once. Ama's measure, hour by hour, its lineage whole. One platform to pay for, and no third; the two people now building generation's data products.

### 9 · The data practice on the map · 7:10–7:50
Tomás's map: the data products in the application layer; the data platform's node, and generation's second node with its own govern and secure services, outlined in amber. The serve line moves to the data platform. The principle; the work package, ending the day the old platform was switched off.

### 10 · One road, many domains · 7:50–8:14
The Tōkaidō past Kuwana at night, the sixty barriers' ghosts going out, travellers both ways. One platform, every domain on it. "Next: where it meets the applications." The end card.

## Sound

Chosen in the four series' palettes list on 12 November 2026 and made in `source/tools/score.py`: an organ's open metal pipes, its principal, with a regal, the small reed organ of the 1500s, light enough to carry. One wind and one keyboard sound every pipe of the organ, tuned once, as one platform keeps every rule once; the regal is a second instrument, kept for a place the organ couldn't be taken, as a second platform is kept only for a reason you can name, and it plays the barriers, the second platform and the shogunate's checkpoints. The organ plays soft chords spread from the bass up, each pipe speaking with a small breath of wind and held level, no tremulant; the regal plays single notes and short phrases, never held chords. The site has an organ and a regal, never together, and no film of this topic plays either (the palettes list's pair rule of 12 November, on the author's checklist since *An application or a platform?*). The series' mark, *the relay*, in C: the organ plays C, D and G rising and lets the G go as the regal takes it an octave down and carries it to C. The film's own figure, once in the opening and once at the end: the regal plays a short phrase stopped at every barrier, a coin at each stop, and the organ plays the same phrase through, on one wind. C major, A minor for what goes wrong, tuned pure from C, with no D minor chord and nothing that puts D with A, which isn't pure in it. Nothing from the opening's place: no instrument, scale or sound of Japan, and no bells, horns or drums of the road; the river and the road are heard as water, coins, a wooden bar, feet and hooves on the earth. No chapter is urgent: nothing pulses.

`tools/quiet.py` passes (12 November 2026): after the opening the music sounds 12% of the time, coming in once every 14.2 s and at most 4 times in any 30 s; its loud moments at -28.9 dB and its loudest notes at -27.3 dB; the effects' loud moments at -44.1 dB; 187 effects, at most five starting in one second; 117 held notes kept within 0.1 dB in the room.

## Pause and think

After *Three sets of rules* (what the third product would add: a third set of rules, rights, masks, lineage and logs, each kept again and kept in step with the other two; not a third copy of the data, since it would query both where they are), *Many owners, one platform* (whether a data mesh means a platform for each domain: no, each domain owns its data, as products, on one self-serve platform every domain shares; not each domain running its own platform under shared rules) and *When two can't be helped* (when to keep a second platform: only for a reason you can name, such as a company just bought, a separate legal entity, or data that must stay in its country; not whenever open table formats and a federated catalogue join the two, since each platform still keeps its own permissions, policies and logs). Right answers at options 1, 3 and 2, one near miss each.

## Labs (candidates)

- List every data platform your organisation runs, and the rules each keeps: who may see what, masks on private data, lineage, logs. How many times is each rule kept?
- For each platform but one, write the reason it stays in one line. Where you can't, sketch its move: where its files are, how the catalogue finds them in the meantime, how the code moves, and who checks the numbers.

The series' own lab, *Model the data practice*, comes with its last film.

## Rigour to check before recording

Checked on 12 November 2026:

- In 1462 (Kanshō 3) there were said to be 380 barriers along the Yodo River alone, and on the road to Ise, 60 in the four *ri* (about 18 km) from Kuwana to Hinaga, each taking a toll; the source says "it's said" (という), so the film does too. Source: *Nihon daihyakka zensho*, 関所, on [Kotobank](https://kotobank.jp/word/%E9%96%A2%E6%89%80-86804).
- The barriers' owners: the court, the shogunate, temples and shrines, estate lords and local lords, each taking a toll (関銭) from those who passed; the tolls slowed trade and raised prices. Sources: Kotobank's entries [関所](https://kotobank.jp/word/%E9%96%A2%E6%89%80-86804) and [関銭](https://kotobank.jp/word/%E9%96%A2%E9%8A%AD-86847) (*Nihon daihyakka zensho*, *Sekai daihyakka jiten*, *Britannica kokusai daihyakka jiten*, *Seisenban Nihon kokugo daijiten*, *Ōbunsha Nihonshi jiten*). Britannica's entry says that from the Kamakura period barriers were set more to take tolls than for defence.
- Oda Nobunaga abolished the barriers in his own provinces; Toyotomi Hideyoshi stopped the court's barriers in 1582 and, about 1585, forbade tolls across the country. Source: *Sekai daihyakka jiten*, 関銭, on Kotobank. The film says "From about 1585" for Hideyoshi and gives no year for Nobunaga, since the year found for him (1568) is only in a secondary source.
- Under the Tokugawa the shogunate kept checkpoints of its own, Hakone and Imagiri (Arai) on the Tōkaidō and Usui on the Nakasendō among them, about fifty, for order and to check who passed, not to take tolls. Sources: *Nihon daihyakka zensho* (幕府は軍事・警察上から箱根・今切・碓氷などに関所を設け) and Britannica (幕府直轄の関所は50ヵ所にも及び), both 関所 on Kotobank. Whether they took any fee isn't settled in the sources read, so the film doesn't say.
- In 1635 the Buke shohatto of Kan'ei forbade the lords private barriers (私ノ関所・新法ノ津留メ制禁ノ事). Source: Japanese Wikipedia, [武家諸法度](https://ja.wikipedia.org/wiki/%E6%AD%A6%E5%AE%B6%E8%AB%B8%E6%B3%95%E5%BA%A6).
- The five roads, and the stations where travellers hired horses and porters and stayed at inns: the Ministry of Land, Infrastructure, Transport and Tourism's Yokohama office, *Tōkaidō Q&A*, in Japanese, [Q12](https://www.ktr.mlit.go.jp/yokohama/tokaido/02_tokaido/04_qa/index2/a0212.htm) and [Q13](https://www.ktr.mlit.go.jp/yokohama/tokaido/02_tokaido/04_qa/index2/a0213.htm); [nippon.com, *The Tōkaidō*](https://www.nippon.com/en/japan-topics/g02415/). The fares on the road, partly fixed, are in *An application or a platform?*'s sources.
- More than two million pilgrims went to Ise in 1771, one of the four largest mass pilgrimages (*okagemairi*). Source: Kokugakuin University, *Encyclopedia of Shinto*, [Okagemairi](https://d-museum.kokugakuin.ac.jp/eos/detail/?id=8686), by Sakurai Haruo.
- Kuwana was a station of the Tōkaidō, and the road to Ise left the Tōkaidō at Hinaga no oiwake, in today's Yokkaichi, so the stretch from Kuwana to Hinaga was part of the Tōkaidō in the 1600s. Source: Mie Prefecture's tourism site, [日永の追分](https://www.kankomie.or.jp/spot/4320).
- The Yodo is drawn from Fushimi, below Kyoto, to the bay, as a sketch of its course, not a survey; the road from Kuwana to Hinaga is placed by its towns' longitude and latitude; the coastline is from [Natural Earth](https://www.naturalearthdata.com/), in the public domain, with its corners rounded off for the close looks. The owners along the Yodo are drawn in five stretches, in the order the narration names them, as an example, not as who held which stretch.
- Data mesh: Z. Dehghani, [*Data Mesh*, 2022](https://www.oreilly.com/library/view/data-mesh/9781492092384/ch04.html): domain ownership, data as a product, a self-serve data platform and federated computational governance. Done badly: [Thoughtworks, *The state of data mesh in 2026*](https://www.thoughtworks.com/insights/blog/data-strategy/the-state-of-data-mesh-in-2026-from-hype-to-hard-won-maturity), on domains in name only.
- The move needs no copy only because generation's tables are already files in an open table format in the utility's own cloud storage: the data platform registers those files as its own tables where they are. A platform that keeps its tables in its own storage, or in a closed format, would have to copy them out first. While both run, the data platform's catalogue federates generation's, so the data is found in one place, but each platform keeps its own permissions, policies and logs. The film names no product for converting code or federating a catalogue, so no maturity is recorded.
- The organ and the regal are general music history, used only in the score's notes.
- The utility, its people and its numbers (the two vendors, the measure, the month of comparing numbers, the four months, the two people) are invented, in *The map before the data*'s world.

## Pacing report

`tools/pace.py`, 12 November 2026: 8:14.4, 1061 words, 129 words a minute, the voice 75% of the time; every chapter from 104 to 138 words a minute (*When two can't be helped*, at 138, and *Three sets of rules*, at 137, are under the 140 a chapter may reach), the voice at most 79% of any chapter; no sentence with under 0.5 s after it, and no stop of 2.5 s or more inside a chapter.
