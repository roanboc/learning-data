# Platform and solution architecture · An application or a platform?: script

*The script of *An application or a platform?*, film 1 of 8 of *Platform and solution architecture*, the fourth series of the topic *Enterprise architecture*, in eleven chapters, in English, drawn in the look of *The map before the data*. Written on 12 November 2026 from the author's brief of 11 November 2026 and the series' plan (`../proposal.md`), which he confirmed that day. Made while the author was away; this film's questions and assumptions are in `docs/assumptions/05-enterprise-architecture/4-platform-and-solution-architecture/1-an-application-or-a-platform.md`. It carries no draft label (the four series' shared *Decided* table). The narration is in `source/src/narration.js`; this file gives its reasons.*

## The promise

Every line passes two tests: someone new to data work can follow it, and an enterprise architect, a data architect or a platform engineer finds nothing wrong in it. Its idea: an application has one purpose, with its logic built in. A data platform has no purpose of its own: it gives shared capabilities, on which many owners build their own logic, the enterprise domain's among them. That logic runs on the platform, in each domain's data products, never in the platform's own components, and its owner is always the business. The platform has a business owner too, who answers to every domain that uses it. And because it's the one system that crosses every domain and every layer, enterprise architecture matters most here.

**Takeaway:** "One purpose, its logic inside: an application. Shared capabilities, carrying every owner's logic: a platform."

## The story in one paragraph

Japan, 1601: a year after the battle of Sekigahara, Tokugawa Ieyasu holds power from Edo, about 500 km by road from Kyoto, with many domains between, each ruled by its own lord. On foot the trip takes about two weeks, and orders go no faster. Early in 1601 he orders each station on the road to Kyoto to keep 36 horses and carry official travellers on to the next station, with his seal: without it, no horses. Over the decades five great roads run out of Edo, the Gokaidō; a letter relayed from station to station now crosses in three or four days, and the road serves every domain, its lords, couriers, merchants and pilgrims. The shogunate owns the roads: its officials ride free, others pay their way, and the stations and nearby villages carry the burden. At the utility, Ravi Menon has just taken over the data platform, drawn on Tomás's map as one more application box, *data warehouse*. In March the enterprise domain's measure of minutes without power per customer, built on the platform from three systems, jumps from about eight minutes to nineteen: a major storm counted, because the rule that left major storms out came in the old storm tool's export, and an update dropped it in February. Nobody can say whose rule it was until the map and the catalogue find its owner, Ama. She raises a ticket and writes the rule in the glossary; the data team builds it on the platform with a test; she checks the number in test, and March is back to nine minutes.

## Opening story

The four beats, each said outright (AGENTS.md, *Every opening story has four beats*), checked against the sources in *Rigour*, below. The series follows one story across its eight films; this film sets its scenario.

| Beat | The line that says it |
|---|---|
| Scenario | "Japan, 1601." "A year after the battle that ended a century of war, Tokugawa Ieyasu is the most powerful lord in the land." "His seat is Edo." "The emperor's city, Kyoto, is about five hundred kilometres west by road, and between them, many domains, each ruled by its own lord." |
| Problem | "A traveller on foot took about two weeks from Edo to Kyoto, and orders and news went no faster than the people who carried them." "To govern from Edo, Ieyasu needed his letters, officials and goods to cross the country in days, not weeks." |
| Solution | "Early in 1601, he gave each station on the road to Kyoto an order: keep thirty-six horses, and carry official travellers on to the next station." "With it came his seal, and one line: without this seal, no horses." "Over the decades that followed, five great roads ran out of Edo, most along older routes, with stations along the way: the Gokaidō." |
| Benefits | "Relayed from station to station, an official letter now crossed from Edo to Kyoto in three or four days." "And the road served every domain: lords travelling to Edo, couriers, merchants and pilgrims, each on their own business." Then the same for data: "At the utility, Ravi Menon has just taken over the data platform." "Like that road, it carries every domain's business." "But on the map it's drawn as one more application, and when one of its numbers goes wrong, nobody can say whose rule it is." "Drawn as a platform, it serves every domain, and every rule on it has an owner." |
| Back to the story | Along the way, in *Whose logic*: "The stations of the Tōkaidō kept the horses and porters ready." "They never wrote the letters they carried." In *An owner who answers to all*: "The roads had an owner too: the shogunate." At the end, with its benefit for data: "The Gokaidō carried every domain's letters and goods for more than two and a half centuries." "What they said was always the sender's business." "Drawn as a platform, Ravi's does the same: every domain builds on it, and every rule on it has an owner Tomás's map can find." |

The test: someone who has never heard of the Gokaidō can say, from the narration alone, why it was a problem (orders and news took about two weeks to cross from Edo to Kyoto, as slow as the people carrying them, too slow to govern a country of many domains) and what the fix gave people (a letter relayed station to station crossed in three or four days, and the same road served every domain's lords, couriers, merchants and pilgrims).

## The reference, and practice

The series follows TOGAF 10 and ArchiMate 4, as *The map before the data* does (`../proposal.md`, *Reference and alternatives*). This film names, once each:

| Body of knowledge | What the film takes | Where |
|---|---|---|
| TOGAF 10: application and technology architecture, and the *application platform* of its Technical Reference Model (the technology that provides the services applications are built on) | An application, and the platform apart from it | *Where it sits*, *The test* |
| ArchiMate 4: the application and technology layers | The data practice drawn on the map: technology services realised by system software; a data product as one application component, its output port an application interface, its tables artifacts | *The data practice on the map* |
| *Team Topologies* (Skelton and Pais, 2019) and the CNCF Platforms White Paper (2023) | A platform as an internal product, with an owner, measured by its users' outcomes | *An owner who answers to all* |
| Zhamak Dehghani, *Data Mesh* (2022) | Domain ownership, and data products built on a shared, self-serve platform | *Whose logic* |
| Application suites (common practice) | A system that serves many functions and is still an application, its logic built in by its vendor | *Not every shared system* |

Where the film differs: the published definitions say a platform holds no business logic (Dehghani: the platform is domain-agnostic). The film says where the logic is instead: it runs on the platform, in data products owned by each domain and by the enterprise domain, never in the platform's own components, and never owned by the platform team by default (the author, 11 November 2026). The *enterprise domain*, which owns the measures that cross domains, for performance and analysis, is the author's term; data mesh's nearest idea is an aggregate data product with an owner of its own. No standard defines a platform's owner: the sponsor with a platform product owner, answering to every domain, is drawn from practice and from *Team Topologies*' platform as a product. "Platform" names two things: a vendor's product, many technology components sold as one, and the service an organisation runs for all its domains, built from that product and what's around it; the series keeps "Databricks" for the product and "the data platform" for the service.

Practice, from the author's brief: draw the data platform as a platform, not as one more application; when a number on it goes wrong, find the owner of its rule in the business, with the map and the catalogue; the owner asks in a ticket and writes the rule in the glossary; the data team builds it on the platform, with a test, and reviews the pull request; the owner checks the result in test before the ticket closes (AGENTS.md, *Business users ask in tickets*). All of it is said in *A number nobody owns*.

## What each object stands for

| On screen | What it stands for |
|---|---|
| Japan's coast, its domains a patchwork of cells | A country of many domains, each governed by its own lord |
| A light walking from Edo to Kyoto, "day 1" to "day 14" | A traveller on foot: about two weeks |
| The order on paper, with a vermilion seal | Ieyasu's order to each station, and the seal without which no horses were given |
| A station at dusk, its horses waiting | A shared capability, kept ready for whoever may use it |
| A lantern-amber light running station to station | A letter relayed: three or four days |
| Lords, a courier, a merchant's porter and pilgrims on one road | Every domain on one road, each on its own business |
| Tomás's map, six layers, the bottom two lit | Where this series works: the application and technology layers |
| A hundred and forty small tiles, four of them named | The utility's systems, from *Today, and where it's going* |
| One box among the applications: *data warehouse* | The data platform, drawn as one more application |
| A green slab, with blue blocks set down on it, each with a gold tag | The platform's shared capabilities, each domain's logic built on them, and its owner in the business |
| A product panel with the Databricks logo, its parts inside | A platform product: many components, sold as one |
| An amber frame round it, with identity, the network, integration, orchestration, reporting tools, what watches it all, a team, its rules and support | Your data platform: the service the utility runs for all its domains |
| Billing's box, its rules inside, its owner and its measure | An application: one purpose, its logic built in |
| The test, as a card | One purpose with its logic built in, or shared capabilities with many owners' logic |
| The finance system, a part for each function | An application suite: it serves many functions, and its logic is still inside |
| The courier's letter box at the station, the horses and porters ready | The platform carries the logic but never writes it: the letter is its sender's |
| A domain's block pushed into the platform's components, and refused | No rule goes into the platform's own components |
| A chart of minutes without power, March's bar at nineteen | The enterprise measure gone wrong |
| Three sources, the old storm tool greyer, a rule in its export struck through | Outages, the network map, and a legacy tool whose export held a rule nobody wrote down |
| Ama's ticket, her glossary entry, the data team's pull request with its test | The rule found, owned, written and built, in that order |
| An official riding free, a merchant paying, the station's people and villagers with the loads | The road's owner, who served its own officials first |
| A sponsor and a platform product owner, a line up to them from every domain | The platform's business owner, answering to every domain |
| Four measures: how many build on it, the first data product, reliability, cost | A platform measured by its users' outcomes |
| The six layers, every domain across them, the platform crossing them all | Why enterprise architecture matters most for a data platform |
| ArchiMate elements: services, system software, a component, an interface, artifacts | The data practice on Tomás's map |

## The look

*The map before the data*'s look, bundled as it is (`../../enterprise-architecture/shared/`), and the series' own kit (`../shared/src/psa.js`): its lantern amber for the road and what every domain shares, Japan's coast from Natural Earth's public-domain data, the stations, horses, walkers, a palanquin and the order's paper, all in the series' own drawing style, light on a dark ground, never in the style of Japanese art. The people of 1601 are small silhouettes on the road, lit from the sky behind them, none a likeness. The utility's rooms are the map's own dark rooms; Ravi Menon joins the cast in a sweater, Ama Owusu as *The map before the data* drew her. Application blue, technology green and the owner's gold carry the meaning, as the film's *how to read* line says. The poster is the shared road at dusk, everyone on it.

## Script

### 1 · Five roads from Edo · 0:00–1:51
Japan, 1601: the coast and its domains; Edo and Kyoto named; a traveller's light walking day by day, two weeks. "Days, not weeks." The road at dusk: a station, its horses, the order on paper and its seal. The five roads drawn out of Edo, the stations along them; a letter's light relayed station to station, "three or four days" against two weeks. The road again, lords, a courier, a porter and pilgrims, each named. Then the utility: Ravi, and the platform with every domain's logic set down on it; on the map, one box among the applications, and a number nobody can say is whose; drawn as a platform, an owner on each block. The road at dusk without words, then the title.

### 2 · Where it sits · 1:51–2:31
Tomás's map, its six layers, the bottom two lit for this series; the hundred and forty systems opened out of the application layer, four named; the information layer above them; the one box, *data warehouse*. Ravi asks Tomás to move it: "platform", one word, two meanings.

### 3 · Two kinds of platform · 2:31–3:11
The product, many components sold as one; your data platform round it: identity, the network, integration, orchestration, reporting tools and what watches it all, then a team, its rules and its support. The two words, as the series uses them.

### 4 · The test · 3:11–4:03
Billing: one purpose, its rules inside, its owner, its measure. The data platform beside it: no purpose of its own, five capabilities, and the network, retail, finance and the enterprise domain setting their logic down on it. The test, as a card.

### 5 · Not every shared system · 4:03–4:28
The finance system, a part for finance, procurement and people, each with its logic inside: an application suite. The line: logic inside the system, or brought to it by its owners.

### 6 · Whose logic · 4:28–4:58
The station: a courier runs in and stops, his letter box on his pole; the horses and porters ready; the letter, its sender's. On the platform, each domain's data product; one pushed into the platform's components, and refused; never the platform team by default; why it's hard to see.

### 7 · A number nobody owns · 4:58–6:10
The measure, minutes without power per customer, for the regulator; three systems feed it; March jumps from eight to nineteen. The rule in the storm tool's export, dropped by February's update. Whose rule? Three answers, none of them right. The map and the catalogue find the owner, Ama; her ticket, the glossary, the data team's pull request with its test; Ama checks it in test, and March is back to nine.

### 8 · An owner who answers to all · 6:10–6:50
The road at dusk: an official riding free, a merchant paying his way, the station's people and the villagers with the loads; "the owner: the shogunate". Then the platform's sponsor and its product owner, a line up to them from every domain; deciding less, answering for how well it serves; its four measures.

### 9 · Why the map matters most here · 6:50–7:10
The six layers, every domain across them, the platform crossing every layer; one domain in one layer, struck through: it can't be designed from there.

### 10 · The data practice on the map · 7:10–7:49
The technology layer: storage, compute and the catalogue as services, Databricks realising them as system software. The application layer: the measure's data product, one component, owned by the enterprise domain; its output port, an interface; its tables, artifacts on the platform. No rule in the platform's components; the rule in the product, with its owner.

### 11 · Every domain's road · 7:49–8:19
The five roads at night, travellers as lights on every one; the platform with every domain and every owner; "Next: Inside the platform"; the end card.

## Sound

Chosen in the four series' palettes list on 12 November 2026 and made in `source/tools/score.py`: a continuo, the part that carries every voice in a piece and never plays its tune, first printed in Italy from 1600 to 1602, the years of the road's first order, as the platform carries every domain's logic and owns none of it. The lead is a harpsichord, one eight-foot register, kept brighter and softer in the treble than the site's other harpsichords; the partner a bassoon, low and level, with no vibrato. No film on the site pairs the two, and no film of this topic plays either: every rarer instrument with a sound of its own was already some film's, as the palettes list records, so the film pairs two the site has, and the question is on the author's checklist. The series' mark, *the relay*: the harpsichord plays three notes rising, D, E and A, and lets the A go as the bassoon takes it and carries it down to D, a phrase handed on as a letter from station to station. D major, B minor for what goes wrong, tuned pure from D. Nothing from the opening's place: no instrument, scale or sound of Japan, and no bells, horns or drums of the road; the road is feet on the earth and a runner passing. No chapter is urgent: nothing pulses.

`tools/quiet.py` passes (12 November 2026): after the opening the music sounds 16% of the time, coming in once every 16.2 s; its loud moments at -29.9 dB and its loudest notes at -27.4 dB; 82 effects, at most three starting in one second; 135 held notes kept within 0.2 dB in the room. Against the voice: the music 21.6 dB under it while it speaks and 18.2 dB in the pauses, the effects 30.5 dB under it.

## Pause and think

After *Not every shared system* (why the finance system is still an application: its logic is built in, the way its vendor designed it, not brought by its owners; serving many functions isn't the test on its own), *A number nobody owns* (who decides which storms count: Ama, who owns the regulator's measures, writing it in the glossary for the data team to build; not the platform team, and never in the platform's own components) and *An owner who answers to all* (how the platform's owner differs from billing's: it answers to every domain, decides less of what's built on it, and is measured by its users' outcomes). Right answers at options 3, 1 and 2, one near miss each.

## Labs (candidates)

- Sort ten of your organisation's systems with the test: one purpose with its logic built in, or shared capabilities carrying others' logic; then draw each in its layer.
- Take one measure built on your platform from several systems, and for each rule in it write who owns it, where it's written and who builds it.

The series' own lab, *Model the data practice*, comes with its last film.

## Rigour to check before recording

Checked on 11 and 12 November 2026:

- The battle of Sekigahara was fought in October 1600; it is commonly taken as the end of the wars of the Sengoku period, though the Toyotomi were defeated only at Osaka in 1615. The film says "the battle that ended a century of war", as the common telling does, and calls Ieyasu "the most powerful lord in the land": he became shogun only in 1603. Edo was his seat from 1590. Sources: [nippon.com, *The Tōkaidō*](https://www.nippon.com/en/japan-topics/g02415/) (also [in Japanese](https://www.nippon.com/ja/japan-topics/g02415/)); [Samurai Archives, *Tōkaidō*](https://samurai-archives.com/wiki/Tokaido).
- The Tōkaidō ran about 492 km from Nihonbashi in Edo to Sanjō Ōhashi in Kyoto, with 53 stations; the film says "about five hundred kilometres west by road". On foot it took about two weeks; official couriers relayed station to station took three or four days. Sources: nippon.com, as above; the Ministry of Land, Infrastructure, Transport and Tourism's Yokohama office, *Tōkaidō Q&A*, in Japanese: [Q5](https://www.ktr.mlit.go.jp/yokohama/tokaido/02_tokaido/04_qa/index1/a0105.htm), [Q6](https://www.ktr.mlit.go.jp/yokohama/tokaido/02_tokaido/04_qa/index1/a0106.htm).
- The order: in the first month of Keichō 6 (慶長6年正月), early in 1601, Ieyasu gave each Tōkaidō station a sealed letter (伝馬朱印状) saying horses were not to be given to anyone without the seal (此の御朱印なくしては伝馬を出すべからざる者也), and the *rules for the post horses* (御伝馬之定): 36 horses kept at each station, and the next station to which loads were carried on. The film says "early in 1601", since the first month of the Japanese calendar of the time isn't January. Sources: MLIT Q5, Q6 and [Q17](https://www.ktr.mlit.go.jp/yokohama/tokaido/02_tokaido/04_qa/index2/a0217.htm); nippon.com, in Japanese.
- Five great roads ran out of Edo, the Gokaidō (the Tōkaidō, Nakasendō, Kōshū Kaidō, Ōshū Kaidō and Nikkō Kaidō), set in order over the decades after 1601, most along older routes. Lords travelled them to Edo under the alternate attendance rule, from 1635 ([Q7](https://www.ktr.mlit.go.jp/yokohama/tokaido/02_tokaido/04_qa/index1/a0107.htm)); merchants and pilgrims used them in large numbers. Sources: nippon.com; Samurai Archives.
- The owner and the burden: travellers with the seal rode free; others paid for horses and porters, at rates partly fixed by the shogunate and partly agreed; the stations were exempted from land tax; from 1638 each Tōkaidō station kept 100 horses and 100 porters; when they weren't enough, nearby villages were made to supply more (助郷). The film says "Its officials rode free, others paid their way, and the stations and nearby villages carried the burden"; the plan's "set prices for everyone else" was corrected to this. Sources: MLIT Q17 and [Q18](https://www.ktr.mlit.go.jp/yokohama/tokaido/02_tokaido/04_qa/index2/a0218.htm).
- The station system ended on the Tōkaidō in 1872 (Meiji 5), when private transport companies took over: about 270 years, "more than two and a half centuries". Source: MLIT, [Q&A, answer 7](https://www.ktr.mlit.go.jp/yokohama/tokaido/02_tokaido/04_qa/index4/answer7.htm). The railway that replaced the road comes in the series' last film.
- The coastline is drawn from [Natural Earth](https://www.naturalearthdata.com/), in the public domain; the domains are a patchwork for the idea, not a map of the domains of 1601; Edo, Kyoto and the stations are placed by their longitude and latitude, the stations as a texture.
- The continuo's first printed parts (Peri, Caccini and Cavalieri, 1600 and 1601; Viadana, 1602) are general music history, used only in the score's notes.
- Leaving major storms out of a reliability measure is common regulatory practice (for example the IEEE 1366 guide's *major event days*); the film names no method, only "the regulator's method".
- Databricks calls its product the Data Intelligence Platform, and a data and AI platform ([databricks.com](https://www.databricks.com/), checked 12 November 2026); the film says only that it calls its product a data platform. The services the film shows, storage, compute and the catalogue, are generally available that day; the film names no feature's release status, on screen or in its voice.
- The utility, its people and its numbers (the hundred and forty systems, eight minutes, nineteen in March, nine after the fix, February's update) are invented, in *The map before the data*'s world.

## Pacing report

`tools/pace.py`, 12 November 2026: 8:19.5, 1,097 words, 132 words a minute, the voice 77% of the time; every chapter from 109 to 138 words a minute (*Not every shared system*, *A number nobody owns* and *An owner who answers to all*, at 138, are under the 140 a chapter may reach), the voice at most 81% of any chapter; no sentence with under 0.5 s after it, and no stop of 2.5 s or more inside a chapter.
