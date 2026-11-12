# Platform and solution architecture · Inside the platform: script

*The script of *Inside the platform*, film 2 of 8 of *Platform and solution architecture*, the fourth series of the topic *Enterprise architecture*, in ten chapters, in English, drawn in the look of *The map before the data*. Written on 12 November 2026 from the author's brief of 11 November 2026 and the series' plan (`../proposal.md`), which the author confirmed that day. Made while the author was away; this film's questions and assumptions are in `docs/assumptions/05-enterprise-architecture/4-platform-and-solution-architecture/2-inside-the-platform.md`. It carries no draft label (the four series' shared *Decided* table). The narration is in `source/src/narration.js`; this file gives its reasons.*

## The promise

Every line passes two tests: someone new to data work can follow it, and an enterprise architect, a data architect or a platform engineer finds nothing wrong in it. Its idea: draw a data platform by what it has to do before what it's made of. Every data platform needs eight parts: four along the way the data goes (bring it in, store it, process it, serve it) and four across them all (catalogue and govern, secure, orchestrate, observe). Then a product under each. Drawn whole, the drawing shows what's missing: here, nothing watches the platform itself. That part serves every domain, so it belongs to the platform team, not to any one domain, and once it's built from the platform's own records, it shows where the money goes.

**Takeaway:** "Draw the parts before the products, and what's missing shows."

## The story in one paragraph

Japan, the early 1600s: the Tōkaidō runs about 490 km from Edo to Kyoto, with a station about every ten kilometres. Each station has the same parts: an office that finds horses and porters, a clerk who writes each one down, and inns for every traveller, from lords to pilgrims; each load goes one stage, to the next station, where it's moved onto fresh horses. One stage was different: Odawara to Mishima, eight *ri*, about thirty kilometres over the Hakone mountains, climbing more than 700 m from the sea and down again with no station on the way, so the same horses and porters carried every load up and over. In 1618 the shogunate founded a station at Hakone, on empty ground by Lake Ashi, and moved fifty households from Odawara and fifty from Mishima to run it; the stage became two of four *ri*, about fifteen kilometres each. The highest station on the road, at 725 m, it was hard to keep going, and the shogunate took pains to keep it. At the utility, Ravi Menon draws the data platform by its parts before he names a product, a reference architecture, then a product under each, most of them Databricks. Under observe: nothing. The platform keeps its own records in its system tables, but nobody reads them: each domain watches its own data products. In September finance asks, in a ticket, why the platform's bill is up by half since June, and nobody can say which jobs made it grow or whose they are. Watching the platform serves every domain, so the platform team builds it: every job and warehouse tagged with its domain, one dashboard of every run and its cost, a budget for each domain with an alert. In a week it finds a job that rebuilt three years of meter readings every night and a warehouse left running all night for a dashboard nobody opened after six. The data team changes both and reviews the pull requests; by November the bill is back to June's, finance checks it and closes its ticket, and each domain sees its own share every month.

## Opening story

The four beats, each said outright (AGENTS.md, *Every opening story has four beats*), checked against the sources in *Rigour*, below. The series follows one story across its eight films; this film's beats come from its own part of it, the station on the mountain.

| Beat | The line that says it |
|---|---|
| Scenario | "Japan, the early 1600s." "The Tōkaidō runs from Edo to Kyoto, with a station about every ten kilometres." "Each station has the same parts: an office that finds horses and porters, and a clerk who writes each one down." "Inns, for every traveller, from lords to pilgrims." "And each load goes one stage, to the next station, where it's moved onto fresh horses." |
| Problem | "But one stage was different: from Odawara to Mishima, about thirty kilometres over the Hakone mountains, the hardest stretch of the road." "From the sea, the road climbs more than seven hundred metres and down again, with no station on the way." "Here, the same horses and porters carried every load up and over the mountains." "The road needed a station where it was hardest." |
| Solution | "In 1618, the shogunate founded one, at Hakone, by a lake on the mountain, and moved fifty households from Odawara and fifty from Mishima to run it." |
| Benefits | "The hardest stage became two, of about fifteen kilometres each, and every load changed to fresh horses and porters halfway." Then the same for data: "At the utility, Ravi draws his data platform by its parts too, before he names a single product." "Every part has something under it but one: nothing watches the platform itself, and its bill has gone up by half, with nobody able to say why." "Drawn whole, the gap shows, and the platform gets the part it was missing." |
| Back to the story | Along the way, in *Whose part it is*: "Hakone's station was the highest on the road, more than seven hundred metres up, on empty ground by the lake." "It was hard to keep going, and the shogunate took pains to keep it: the road's owner, for the whole road." "Watching the platform is like that station: it serves every domain, so no one domain should have to build it." At the end, with its benefit for data: "Hakone's station served the Tōkaidō for two and a half centuries, until the post-station system ended, in 1872." "Ravi's platform has all eight parts now, each with something under it, and one of them watches the rest." |

The test: someone who has never heard of Hakone can say, from the narration alone, why it was a problem (on the road's hardest stage, thirty kilometres over a mountain more than seven hundred metres high, there was no station, so the same tired horses and porters had to carry every load all the way, where everywhere else fresh ones took over every ten kilometres) and what the fix gave people (a station on the mountain, run by a hundred households, made the stage two of about fifteen kilometres each, with fresh horses and porters halfway).

## The reference, and practice

The series follows TOGAF 10 and ArchiMate 4, as *The map before the data* does (`../proposal.md`, *Reference and alternatives*). This film names, once each:

| Body of knowledge | What the film takes | Where |
|---|---|---|
| TOGAF 10: the Architecture Continuum's reference architectures, and the Technical Reference Model, a taxonomy of platform services drawn without products | A reference architecture: what the platform has to do, drawn before what it's made of, so any product can change under it | *Parts before products*, *The data practice on the map* |
| ArchiMate 4: technology services realised by system software; the implementation and migration layer's plateaus, gap and work package | The eight parts as the platform's services; the products under them as system software; the missing part as a gap between the platform today and the one it should be, with the work that closes it | *The data practice on the map* |
| DAMA-DMBOK 2: the knowledge areas of data management (data integration and interoperability, data storage and operations, data security, metadata, data governance) | The jobs the eight parts do, named in plain words | *Four along the way*, *Four across it all* |
| The FinOps Foundation's FinOps Framework: allocation by tags, reporting, anomaly management, budgeting, and showback; its *Data Cloud Platforms* category | Every job and warehouse tagged with its domain; one dashboard of every run and its cost; a budget for each domain with an alert; each domain seeing its own share every month | *The platform watches itself* |
| *Team Topologies* (Skelton and Pais, 2019) and the CNCF Platforms White Paper (2023) | What serves every domain is the platform team's to build and run | *Whose part it is* |

Where the film differs: no standard fixes the list of a data platform's parts. The eight are the parts most published data platform reference architectures share, the cloud providers' among them, named in plain words; the film keeps four along the way the data goes and four across them all, so a newcomer sees why the second four are easy to forget. *Observe* means the platform's own health and cost, not a domain's data quality, which each domain watches in its own data products (*Fit for use* and *Data quality*).

Practice, from the author's brief: draw the platform's parts before its products, so a part with nothing under it shows; watching the platform's health and cost is the platform team's, not a domain's, since it serves them all; finance asks in a ticket, the data team changes the jobs and reviews the pull requests, and finance checks the result before its ticket closes (AGENTS.md, *Business users ask in tickets*). All of it is said in *Nobody watching* and *The platform watches itself*.

## What each object stands for

| On screen | What it stands for |
|---|---|
| Japan's coast, the Tōkaidō drawn from Edo to Kyoto, its stations lit one by one | The road, a station about every ten kilometres |
| A station at dusk: the office, the clerk's book written as each horse and porter is found, an inn with its lit screens | The parts every station had |
| A load lifted from one horse onto a fresh one, which takes it on | One stage, then fresh horses at the next station |
| The stage over the Hakone mountains, lit, with no station between Odawara and Mishima | The road's hardest stretch |
| The mountain from the side, its climb drawn steeper than it is, a rule from the sea up to the lake's level | More than seven hundred metres, up and down again |
| One horse and porter climbing all the way, where elsewhere fresh horses take over | The same horses and porters for every load, all thirty kilometres |
| A station by the lake, and lights coming up from both ends, each going out as it arrives | Hakone's station, 1618, and the hundred households who came to run it |
| Two stages of about fifteen kilometres each, a load changed halfway | The hardest stage made two |
| Eight tiles in two rows of four, a product's mark under each but one | The data platform drawn by its parts, and the part with nothing under it |
| Tomás's map, the technology layer lit | Where the first film put the platform |
| The platform's box opened into a frame, eight dashed places in it | A reference architecture: what it has to do, before what it's made of |
| Blank pills leaving and coming back in three slots | Products change; the parts stay |
| Four green boxes along the top, the sources on the left, the uses on the right, one record's light through all four | Four parts along the way the data goes |
| Four bands across, each reaching under every box | Four parts across them all |
| A pill under each part, Databricks' mark on most | A product under each part |
| A dashed, empty slot under observe, and its word: *nothing* | The part nobody built |
| The platform's own tables, greyed: job runs, query history, billing usage | The records it keeps, which nobody reads |
| An eye over each domain's block, and a dashed outline round the whole | Each domain watches its own; nobody watches the whole |
| Finance's ticket beside the bill by month, September's bar in amber, *+50%* | The bill up by half, and the question asked in a ticket |
| *which jobs?*, *whose are they?*, and two poor choices, each struck | What nobody could say, and what that left |
| The station on the mountain at dusk, *more than 700 m up*, *by the lake* | The highest station, kept by the road's owner for the whole road |
| The platform with each domain's block and owner, observe outlined, *health and cost: the platform team* | Watching the platform serves every domain, so it's the platform team's |
| The platform's own dashboard: runs by cost, each with its domain's tag; budgets by domain; an alert | The missing part, built from the platform's own records |
| Two rows lit: *meter readings, nightly*; *reports warehouse*, *on all night* | What the dashboard found in a week |
| The data team's two pull requests | The fixes, reviewed by the data team |
| The bill back to June's, finance's ticket checked and closed, each month split by domain | The benefit: the bill explained, and each domain's share, every month |
| Tomás's map in ArchiMate: each domain's data products, the eight services serving them, system software realising them | The data practice on the map |
| A dashed band, *any product, under it* | The reference architecture, drawn without the software |
| Two plateaus, a gap between them, a work package realising the second | The platform today, the one it should be, and the work that closes the gap |
| The mountain at night, loads changing at the station by the lake | Two and a half centuries |
| The drawing whole, three pills under observe | Every part with something under it, one watching the rest |

## The look

*The map before the data*'s look, bundled as it is (`../../enterprise-architecture/shared/`), and the series' kit (`../shared/src/psa.js`): its lantern amber for the road and what every domain shares, Japan's coast from Natural Earth's public-domain data, the stations, horses, walkers and inns, all in the series' own drawing style, light on a dark ground, never in the style of Japanese art. The people of the 1600s are small silhouettes on the road, none a likeness. The mountain is the film's own: Odawara by the sea, the climb, the lake in its hollow with the station on its shore, cedars along the road, and down to Mishima, drawn many times steeper than it is so the climb reads. Ravi Menon is drawn as the first film drew him. The drawing of the platform stays put from *Parts before products* to *Nobody watching*, its camera gliding on. Technology green is the platform, blue each domain's data products, gold an owner in the business; amber, a lantern's colour, is the road and the part with nothing under it, drawn as a dashed outline, as the film's *how to read* line says. The poster is the mountain stage made two.

## Script

### 1 · The hardest stage · 0:00–1:48
Japan, the early 1600s: the Tōkaidō drawn from Edo to Kyoto, its stations lit. A station at dusk: the office, the clerk's book filling in, an inn and its travellers; a load moved onto a fresh horse. Back on the map, the one stage lit, Odawara to Mishima, no station between. The mountain from the side: the climb, more than seven hundred metres; elsewhere fresh horses every ten kilometres, here the same horse and porter all the way up. 1618: the station by the lake, and the households coming up from both ends; two stages of fifteen kilometres, a load changed halfway. Then the utility: Ravi, and the platform drawn as eight tiles, a product under each but one; drawn whole, the gap shows. The drawing without words, then the title.

### 2 · Parts before products · 1:48–2:12
Tomás's map, the technology layer lit. Ravi opens the platform's box into a frame, eight dashed places: what it has to do, before what it's made of, a reference architecture. Blank products leave and come back in three slots; the places stay.

### 3 · Four along the way · 2:12–2:44
Bring it in, from billing, the meters and the network map; store it, once, in an open format; process it; serve it, to reports, dashboards, apps and other systems. One record's light runs through all four, and *The Inner Life of Data* is named for the tour.

### 4 · Four across it all · 2:44–3:06
Four bands across, each reaching under every box: catalogue and govern, secure, orchestrate, observe, with what each one does.

### 5 · A product under each · 3:06–3:43
Databricks' mark, *most of them*. Lakeflow Connect; Delta Lake in the cloud's storage; Lakeflow pipelines and dbt; Databricks SQL and the reporting tool; Unity Catalog; Lakeflow Jobs; three under secure. Under observe: nothing.

### 6 · Nobody watching · 3:43–4:19
The platform's own tables, its job runs, query history and billing usage, greyed: nobody reads them. Each domain watching its own; a dashed outline round the whole. Finance's ticket and the bill by month, September up by half; *which jobs?*, *whose are they?*; two poor choices, struck.

### 7 · Whose part it is · 4:19–4:54
The station on the mountain at dusk, the highest on the road, by the lake; kept by the road's owner for the whole road. Then the platform with every domain's block and owner: watching it serves them all, so it's the platform team's.

### 8 · The platform watches itself · 4:54–5:50
Observe gets what it was missing, from the platform's own records. Tags by domain; the dashboard of runs by cost; budgets by domain and an alert. In a week: the nightly rebuild of three years of meter readings, and the warehouse left on all night. The data team's two pull requests. November: the bill back to June's, finance's ticket checked and closed; each month split by domain.

### 9 · The data practice on the map · 5:50–6:28
Tomás's map: each domain's data products in the application layer; the eight services in the technology layer, serving them; Databricks, the identity provider and the network realising them, as system software. Without the software: the reference architecture, any product under it. The implementation and migration layer: the platform today, the one it should be, the gap between them, and the work package that closes it.

### 10 · A station on the mountain · 6:28–6:54
The mountain at night, loads changing at the station by the lake: two and a half centuries, until 1872. The drawing whole, observe watching the rest. "Next: one platform, or many." The end card.

## Sound

Chosen in the four series' palettes list on 12 November 2026 and made in `source/tools/score.py`: the town band of about 1600, a cornett and a consort of sackbuts. Many European towns kept such a band, paid by the town to play for everyone, as the road's owner kept the station on the mountain and as the platform team keeps the part that watches the whole. The cornett, the curved wooden pipe of the time, plays only its middle and low notes (G 4 to D 5), soft, each note tongued plainly and held level, no vibrato; the sackbuts, the trombones of 1600, narrow-belled and quiet (G 2 to D 4), play short plain notes and a few held ones, never a slide between them, one player to a note in a chord. The site has a cornett and sackbuts, never together, and no film of this topic plays either (the palettes list's pair rule of 12 November, on the author's checklist since film 1). The series' mark, *the relay*, in G: the cornett plays G, A and D rising and lets the D go as a sackbut takes it, an octave down, and carries it down to G. G major, E minor for what goes wrong, tuned pure from G, with no A minor chord, which isn't pure in it. Nothing from the opening's place: no instrument, scale or sound of Japan, and no bells, horns or drums of the road; the road is hooves and feet on the earth, and the paper of the clerk's book. No chapter is urgent: nothing pulses.

`tools/quiet.py` passes (12 November 2026): after the opening the music sounds 16% of the time, coming in once every 11.8 s and at most 4 times in any 30 s; its loud moments at -28.2 dB and its loudest notes at -25.5 dB; the effects' loud moments at -44.0 dB; 173 effects, at most four starting in one second; 121 held notes kept within 0.1 dB in the room.

## Pause and think

After *A product under each* (why draw the parts before any product: what a platform has to do changes little, so the drawing lasts, and a part with nothing under it shows; not "leave the products off for good"), *Nobody watching* (why nobody could explain the bill: the platform kept its records, but nobody read them, since each domain watched only its own; not "it kept no records") and *Whose part it is* (who builds the part that watches the platform: the platform team, since it serves every domain; not each domain for its own share, though each owns its logic). Right answers at options 2, 3 and 1, one near miss each.

## Labs (candidates)

- Draw your own data platform's eight parts, then write a product under each, and mark any part with nothing under it.
- Take one month of your platform's bill and split it by domain: what would each job and warehouse need to carry for that to work?

The series' own lab, *Model the data practice*, comes with its last film.

## Rigour to check before recording

Checked on 12 November 2026:

- The Tōkaidō ran about 492 km from Nihonbashi in Edo to Sanjō Ōhashi in Kyoto, with 53 stations, so a station about every ten kilometres (nine and a half on average). Sources: [nippon.com, *The Tōkaidō*](https://www.nippon.com/en/japan-topics/g02415/); the Ministry of Land, Infrastructure, Transport and Tourism's Yokohama office, *Tōkaidō Q&A*, in Japanese, [Q5](https://www.ktr.mlit.go.jp/yokohama/tokaido/02_tokaido/04_qa/index1/a0105.htm).
- Each station's office, the *toiyaba*, was run by its head (*toiya*) and assistants (*toshiyori*), with a clerk (*chōtsuke*) who wrote down the horses and porters given out; loads were moved there onto the next station's horses. Inns ranged from the *honjin*, for imperial envoys, lords and the shogunate's officials, to the *hatago* for ordinary travellers. Sources: MLIT [Q12](https://www.ktr.mlit.go.jp/yokohama/tokaido/02_tokaido/04_qa/index2/a0212.htm) and [Q13](https://www.ktr.mlit.go.jp/yokohama/tokaido/02_tokaido/04_qa/index2/a0213.htm).
- Hakone's station was new in 1618 (Genna 4), as the *Shinpen Sagami no kuni fudokiko* records (the date isn't certain), founded to ease the crossing of the Hakone mountains: the shogunate first tried Moto-Hakone, then set the station on empty ground by Lake Ashi, and moved fifty households each from Odawara and Mishima to run it. Source: MLIT [Q11](https://www.ktr.mlit.go.jp/yokohama/tokaido/02_tokaido/04_qa/index2/a0211.htm). The film says "In 1618".
- Hakone-juku stood at 725 m, the highest of the 53 stations, and the shogunate struggled to keep it going (幕府も宿場の維持に苦心した); the way over the mountains, *Hakone hachiri*, was eight *ri*, four from Odawara to Hakone and four from Hakone to Mishima (a *ri* is about 3.9 km), so about thirty kilometres, two stages of about fifteen. Source: Japanese Wikipedia, [箱根宿](https://ja.wikipedia.org/wiki/箱根宿) and [箱根八里](https://ja.wikipedia.org/wiki/箱根八里), checked against MLIT Q11. The film says "more than seven hundred metres" for the climb from the sea, and names no height for the pass.
- Before 1618 there was no station between Odawara and Mishima, so a load went the whole stage on the same horses and porters (MLIT Q11, on the crossing it was founded to ease). The film doesn't say how the station was paid for, which the sources checked don't say.
- The station system ended on the Tōkaidō in 1872 (Meiji 5): from 1618, about two and a half centuries. Source: MLIT, [Q&A, answer 7](https://www.ktr.mlit.go.jp/yokohama/tokaido/02_tokaido/04_qa/index4/answer7.htm).
- The mountain is drawn many times steeper than it is, a kilometre wider over the top than on the plains, so the climb reads; the coastline is from [Natural Earth](https://www.naturalearthdata.com/), in the public domain, and the stations are placed by their longitude and latitude.
- The town bands of cornetts and sackbuts kept by European towns about 1600 are general music history, used only in the score's notes.
- Databricks names, checked in its documentation on 12 November 2026: Lakeflow Connect (bringing data in), Lakeflow pipelines (built on Apache Spark Declarative Pipelines), Lakeflow Jobs, Databricks SQL, Unity Catalog, and the system tables the film shows, `system.lakeflow.job_run_timeline`, `system.query.history` and `system.billing.usage` ([System tables reference](https://docs.databricks.com/aws/en/admin/system-tables/)); budgets, scoped by custom tags, with email alerts ([Create and monitor budgets](https://docs.databricks.com/aws/en/admin/account-settings/budgets)). Tags set on jobs and SQL warehouses reach `system.billing.usage` as custom tags, which is how the bill splits by domain ([Use tags to attribute and track usage](https://docs.databricks.com/aws/en/admin/account-settings/usage-detail-tags)). Delta Lake is an open table format, a Linux Foundation project.
- Maturity, 12 November 2026: Lakeflow Jobs, Lakeflow pipelines, Databricks SQL and Unity Catalog are generally available. Databricks' documentation for AWS gives the three system tables and budgets with no preview label, while its pages for Google Cloud still mark the query history table and budgets as a public preview; budgets' webhook alerts are in beta, and the film shows only an alert. Lakeflow Connect's maturity differs by connector, and the film names none. The film names no feature's release status, on screen or in its voice.
- FinOps terms, from the FinOps Foundation's [FinOps Framework](https://www.finops.org/framework/), checked 12 November 2026: [Allocation](https://www.finops.org/framework/capabilities/allocation/) by tags, [Anomaly Management](https://www.finops.org/framework/capabilities/anomaly-management/), [Budgeting](https://www.finops.org/framework/capabilities/budgeting/), and showback, a team shown its share without a charge ([Invoicing & Chargeback](https://www.finops.org/framework/capabilities/invoicing-chargeback/)); the film uses none of these words, only what they do.
- The utility, its people and its numbers (the bill up by half from June to September, the three years of meter readings, the warehouse on all night, back to June's by November) are invented, in *The map before the data*'s world.

## Pacing report

`tools/pace.py`, 12 November 2026: 6:54.4, 904 words, 131 words a minute, the voice 74% of the time; every chapter from 96 to 138 words a minute (*Four across it all* and *Nobody watching*, at 138, are under the 140 a chapter may reach), the voice at most 80% of any chapter; no sentence with under 0.5 s after it, and no stop of 2.5 s or more inside a chapter.
