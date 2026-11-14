# More than a platform: new script, draft

**Draft for the author, third version, 14 November 2026.** Not built yet. It reshapes the whole film from the author's brief of 14 November 2026, so that the film introduces the portal itself, directly. This version works in the author's revisions and answers from later that day. The film on the site still follows [the script as built](script.md) until the author confirms this draft. Nothing here is rendered, voiced or checked by the film's tools.

About 6½ minutes, with some 790 words of narration (about 125 words a minute, with pauses), in eight chapters. That is twice the film as built, because the author asked for more time on the foundations, the project, and the labs and evaluation. English narration in the voice the films have used so far. Spanish captions, page and narration follow once the English is agreed.

## The brief, in the author's words

> This video should start introducing the learn all data portal, stating that the introduction video shows the basics of a data platform but there is much more beyond it to make data useful to the organization. Then it says this portal was created to bring all the topics of data in one place, because many courses and documentation are either too technical without the business and governance context, or too agnostic without practical and technical advice. So the portal was organized in stations grouping these topics with a logical ordering, starting from the organization understanding to the different streams to the details of data delivery and work with data, which includes a real project in dbt that can run locally and in Databricks, ending in the overall view of data management and leading data people, useful for data leads and people being led.
>
> This approach also goes a bit beyond DAMA as we cover also enterprise architecture, AI agents in data work, leadership, and other frameworks that the author have found very useful during his career and after the confusion of so many paradigms and approaches, most of them created as data frameworks, but many times unknowledgeable of the enterprise architecture. And that's why this covers an emerging concept defined as enterprise data architecture.
>
> Make it better structured and worded, but be direct about this portal.

The author's revisions, later the same day:

> In chapter 2, add that I (the author of the portal) have worked in applications, data, and enterprise architecture roles for more than 16 years, and connecting all the pieces slowly, so I decided to consolidate the key learnings here.
> When showing the stations, indicate that I found enterprise architecture as one of the key elements that are not well taught in context and makes people struggle constantly at describing and understanding businesses. Data governance has been generally seen as a slow body of work no one ones to do, generally because enterprise foundations are weak, or the technology was still immature to deliver governance as a service and embedded in the practice instead of just policies. So this portal shows the new approach. Take a bit of extra time explaining the foundations as that's the part data professionals lack the most.
>
> Improve chapter 4 to avoid repetition from added context. And dedicate a bit of extra time describing the interactive labs and evaluation, showing even some of them in action. Also restate again the demo project in GitHub, show some folders and highlight sections that people don't consider generally like folders adding business and governance metadata.

His answers: the portal is called *Learning Data*. "The streams" should become clearer wording for the side paths. Name dbt and Databricks as the tools that show the concepts in real solutions, and say that any tools with similar features would do: "The tool doesn't matter much as it provides the capability and you use them correctly. This should be stated as there are many tools wars."

## What changes from the film as built

- **It opens on the portal, not on a meeting.** The two offices with 176 and 149 for one class are gone. The film says what the portal is and why it exists in its first minute.
- **It says why the portal exists, and who made it:** courses are either technical with no business or governance around the code, or neutral with no practical advice. The author spent more than sixteen years joining those pieces.
- **The foundations get a chapter of their own:** why enterprise architecture comes first, and why governance became slow and how the portal does it now.
- **The route is a railway:** a main line, two branch lines that leave it and rejoin it, and the last two stations. "Streams" is gone.
- **The example project gets a chapter of its own:** a dbt project on GitHub, its folders, and the business and governance metadata most projects leave out. dbt and Databricks are named in the voice, as the tools that show the ideas, with any tools of the same capabilities said to do as well.
- **Beyond DAMA is shorter,** because the foundations chapter now says why enterprise architecture matters.
- **Labs and evaluation get a chapter of their own,** with a question, a lab and a scenario shown in action. The closing line stays.

## Script

### 1 · Beyond the platform · 0:00–0:30

**Narration.** The introduction showed the basics: how a data platform carries data from a tap on a phone to a decision. That part matters. But a platform alone doesn't make data useful to an organisation. Someone still has to know how the organisation works, what each word means, who decides, and who may see what.

**Picture.** The last picture of *The Inner Life of Data*: the platform's map, data flowing to the decision card. The camera pulls back, slowly. The platform becomes one small part of a much larger dark map, with four empty places around it. As each is said, a soft label fills one: the organisation, the meaning, the decision, the access.

**On screen.** The Inner Life of Data · how the organisation works · what each word means · who decides · who may see what

### 2 · Why this portal · 0:30–1:35

**Narration.** Most courses and documentation give you only half of that. Some are deeply technical, with no business and no governance around the code. Others stay neutral, and never say what to do, or in which tool. So you join the halves yourself, at work, under pressure. That's how a model passes every test and answers the wrong question, or a policy never reaches the code. The author of this portal has worked in applications, data and enterprise architecture roles for more than sixteen years, joining those pieces slowly, one project at a time. Nobody who works with data should need sixteen years to join them. So the key lessons are gathered here, in one place. This is Learning Data: the context and the practice, from how the organisation works down to the code.

**Picture.** Two stacks of pages, left and right. The left is dense code, with nothing around it; the right is boxes and arrows, with no code under them. A gap between them. A model card turns green with every test passed, then shows a question mark: the wrong question. A policy sheet drifts and never reaches the code. Then three plain role cards, one after another along a timeline: applications, data, enterprise architecture, with *16+ years* across them. Small pieces from both stacks gather one by one along the timeline. They settle into one: the portal's mark, and the address under it.

**On screen.** Too technical: no business, no governance · Too neutral: no practice · All tests passed · Answers the wrong question · Applications · Data · Enterprise architecture · 16+ years · The context and the practice · Learning Data · data.learn-all.org

### 3 · The foundations · 1:35–2:50

**Narration.** The portal is laid out as a route of stations, like a railway line, in an order that makes sense. It starts with the foundations. There are many conversations about tools, and far fewer about the foundations under them. Enterprise architecture comes first. It describes how a business works: what it does, what it needs, which systems serve it, and how they connect. It's rarely taught in context, so people keep struggling to describe a business, and to understand the one they work in. Then data governance: who decides what the data means, and who may use it. For years it was seen as slow work that nobody wanted to do. Often the enterprise foundations under it were weak, or the technology wasn't ready to deliver governance as a service, built into the daily work. So it stayed a set of policies. This portal shows the newer way: governance built into the work, from the glossary to the code.

**Picture.** The learning route draws itself, as the Topics page draws it, but only its first stretch for now: the introduction's station, then *Foundations*. At *Enterprise architecture*, the station opens into a simple layered map: what the business does, what it needs, the systems, the links between them, one layer at a time. Beside it, a person-free sketch of a blank whiteboard with a question mark: struggling to describe the business. At *Data governance*, a heavy binder of policies sits on its own, with a slow clock beside it; a cracked foundation stone under it, then an old, unfinished machine. Then the binder opens, and its rules flow out as small cards into the work: a glossary term, a check on a column, a line of code.

**On screen.** Foundations · Enterprise architecture: How does the business work? · capabilities · information · systems · links · Data governance: Who decides? · Policies · Weak foundations · Unready technology · Governance as a service · glossary → code

### 4 · The rest of the route · 2:50–3:35

**Narration.** Then the main line, where data is built and kept right: data modelling, modern data basics, analytics engineering and data quality. Two branch lines leave it, and join it again further on. One shares and protects data: master and reference data, and data protection and privacy. The other puts AI agents to work on data, safely. The route ends on the whole picture. Data management fits it all in one plan. And leading data people is for those who lead a data team, and for those being led.

**Picture.** The route goes on drawing itself: the blue main line, station by station; the amber branch line rising for sharing and protecting; the violet branch line dropping for agents. Each station's name appears as it is said, with its question on a small card under the route. At *Analytics engineering*, the project icon sits on the line, as the route on the site shows it: a folder with a branch mark, closed for now. The branch lines rejoin the main line before the last two stations, which light last.

**On screen.** Build and monitor · Data modelling · Modern data basics · Analytics engineering · Data quality · Share and protect · Master and reference data · Data protection and privacy · Agents · AI agents in data work · Lead · Data management: One plan · Leading data people: For leads and the people they lead

### 5 · A real project · 3:35–4:35

**Narration.** Along the main line, the films show a real project: a dbt project on GitHub, which runs on your own machine and on Databricks. What the films show on screen is code you can open, and run. And it holds more than models and tests. Next to the code sit the folders most projects leave out: the business glossary, the owners, the architecture map, the data products and their contracts, and the decisions behind them. That is the business and governance metadata, kept in the same place as the code it describes. People argue a lot about tools. Here, dbt and Databricks show the ideas in a working solution, but any tools with the same capabilities would do. What matters is using those capabilities well.

**Picture.** The camera glides into the project icon on the route, and it opens into the project's folder tree, drawn in the film's own hand, not as a screenshot. The code folders light first: models, tests, sources. Then a highlighter band moves down the folders most projects leave out, one at a time as each is said: governance, then glossary, owners, architecture map, data products, data contracts, and the decisions file. A small terminal card shows `dbt build` ending green; beside it, a Databricks target. Then two plain logos step back, and three neutral blocks take their place, each with a capability under it: builds and tests, runs and stores, governs. The icon closes again on the route, still readable as a project.

**On screen.** The example project · GitHub · models · tests · sources · governance · 1-glossary · 2-owners · 3-architecture-map · 4-data-products · 5-data-contracts · docs/decisions.md · business and governance metadata · dbt build: green · runs on your machine and on Databricks · builds and tests · runs and stores · governs · any tool with these capabilities

### 6 · Beyond DAMA · 4:35–5:20

**Narration.** People have mapped this ground before. DAMA's wheel is the best known, and this portal covers it. It also goes further, into enterprise architecture, AI agents in data work and leadership, with other frameworks that proved their worth over those years. Data has many paradigms. Most were made by data people, for data, and many never look at the enterprise around them. This portal starts from the enterprise, and calls it enterprise data architecture: data designed as part of the organisation it serves.

**Picture.** DAMA's wheel, drawn in the film's own hand: a centre and ten parts, with only *Governance* written in the middle. Three new pieces arrive beside it: a layered map, an agent's mark, a person-free mark for leadership. Small competing diagrams crowd in, each turned inward, away from a faint outline of the whole organisation behind them. The outline brightens; the wheel and the new pieces settle inside it. Two words join: enterprise, data architecture. The route returns, with a thin gold thread along it, through every station.

**On screen.** DAMA-DMBOK · Governance · Enterprise architecture · AI agents in data work · Leadership · Enterprise data architecture

### 7 · Learn by doing · 5:20–6:25

**Narration.** Every station is something to do, not only to watch. In a film, a question stops the picture and asks what you'd do. The answers are close: one is almost right, and the film has told you why it isn't. In a lab, you take an idea apart with your own hands. Enrol a student, and watch the event race into the platform. Drop the nightly files, run the loader twice, and see each file read only once. In a scenario, you make the call in a real situation, put the steps in order, or sort what belongs where, and each answer tells you why. Pick a goal, and the route lights up your stops. Search for a word, and find the film that says it. Your progress stays in your own browser.

**Picture.** Three short moments in action, drawn in the film's own hand from the site's own parts, not as screenshots. First, a film's picture pauses, and a question card rises with three answers of equal length; one is picked, the near miss shows why it was almost right. Second, the *Capture* lab: a button is pressed, *Enrol a student*, and an event races from the student system into bronze, with its time in seconds; nightly files drop into the landing zone; *Run* is pressed twice, and the checkpoint count stays the same the second time. Third, a scenario: three options, one picked, and its reason under it; then four steps slide into order. Last, the route with a goal picked, four stops numbered 1 to 4, and a magnifier over lines of words.

**On screen.** Pause and think · Almost right: why not · Take it apart · Enrol a student · Event to bronze: 2.1 s · Nightly files arrive · Run the loader · Checkpoint: 4 files · Make the call · Put it in order · Pick a goal · Search

### 8 · Start · 6:25–6:40

**Narration.** Platforms have matured. The hard part is everything else. Start there.

**Picture.** The route, whole. The introduction's station is done; the next one, *Enterprise architecture*, lights, with *Start here* under it. Then the end card.

**On screen.** Start here · The hard part is everything else. · More than a platform · data.learn-all.org

## Opening story

It has no story from the past: the author asked for the film to be direct about the portal. The four beats are told in the portal's own terms.

| Beat | The line that says it |
|---|---|
| Scenario | "The introduction showed the basics: how a data platform carries data from a tap on a phone to a decision." |
| Problem | "Most courses and documentation give you only half of that." "That's how a model passes every test and answers the wrong question, or a policy never reaches the code." "Nobody who works with data should need sixteen years to join them." |
| Solution | "So the key lessons are gathered here, in one place." "The portal is laid out as a route of stations, like a railway line, in an order that makes sense." |
| Benefits | "This is Learning Data: the context and the practice, from how the organisation works down to the code." "What the films show on screen is code you can open, and run." |
| Back to the story | "Platforms have matured. The hard part is everything else. Start there." |

## Rigour

| Scene | What it claims | Why it holds |
|---|---|---|
| 1 | The introduction shows a platform carrying data from a tap to a decision | *The Inner Life of Data*, and its topic's own line on the site |
| 2 | Courses tend to be technical without context, or neutral without practice | The author's experience (brief, 14 November 2026), said as the portal's reason, not as a measured fact |
| 2 | The author has worked in applications, data and enterprise architecture roles for more than sixteen years | The author, 14 November 2026 |
| 3 | There are many conversations about tools and fewer about the foundations | The author's view, 14 November 2026, said as an observation, not a measured fact (he chose it over "what data professionals lack most", which no data supports) |
| 3 | Enterprise architecture is rarely taught in context, and people struggle to describe a business | The author's experience, 14 November 2026; the *Enterprise architecture* topic's own line: "How an organisation works, in layers, before you ask what its data should answer." |
| 3 | Governance was seen as slow because the foundations were weak or the technology wasn't ready to deliver it as a service | The author's experience, 14 November 2026; *Governance on the map* and *Governance in practice* show it built into the work |
| 4 | The stations and their order | `modules/route.json`: Start, Foundations, Build and monitor, Share and protect, Agents, Lead; *Leading data people* last |
| 5 | A real dbt project on GitHub runs on your machine and on Databricks | `films/analytics-engineering/project/README.md`: it runs on DuckDB with no account, and the same code on Databricks (`profiles.yml`, target `databricks`) |
| 5 | What the films show on screen is code you can open | The project's README: from *Start from a question* on, every snippet the films show is code in that folder. Said of the films that show code, not of every film |
| 5 | The project keeps a glossary, owners, an architecture map, data products, contracts and decisions | `governance/1-glossary`, `2-owners`, `3-architecture-map`, `4-data-products`, `5-data-contracts`; `docs/decisions.md` |
| 5 | Any tools with the same capabilities would do | The author, 14 November 2026; AGENTS.md: "Tools show, they don't lead" |
| 6 | DAMA's wheel has governance at its centre and ten areas around it | DAMA-DMBOK, second edition, revised 2024, as *Every area, one job* cites it |
| 6 | The portal goes beyond the wheel into enterprise architecture, agents and leadership | The route's topics: *Enterprise architecture*, *AI agents in data work*, *Leading data people* are not areas of the wheel |
| 6 | Enterprise data architecture: data designed as part of the organisation it serves | The author's term for the portal's approach; the *Enterprise architecture* topic and its *Data architecture* series carry it |
| 7 | Pause and think questions have one near miss, explained by the film | AGENTS.md, *Pause and think*; `check_site.py` holds every pack to it |
| 7 | The *Capture* lab: enrol a student and watch the event reach bronze; drop nightly files and run the loader twice | `site/assets/learn/learn.en.js`, lab *Send data in*: "Enrol a student and watch the event race to bronze. Drop the nightly files, then run Auto Loader twice." The voice says "the loader", so no product is named there |
| 7 | Scenarios ask for a choice, an order or a sort, each with a reason | The packs' scenario types (`choice`, `order`, `sort`), each with its `why` |

Rules it keeps: no feature's release status; no count of topics or films in the voice, so the film needn't change when the site grows; the portal's tools as shapes drawn from the site's parts, not screenshots; no people on screen; DAMA said "Dah-ma" (the film's `say`).

## Critique before building

A review of the whole script, 14 November 2026, ranked by how much each point would change the film.

1. **Enterprise data architecture is the film's big idea, but it arrives last and the portal never uses it.** The term appears only in chapter 6, in one line. No page, film, lab or topic line on the site says it today, so a viewer who searches for it after the film finds nothing. *Recommendation:* plant it early (chapter 2: "joining those pieces is what this portal calls enterprise data architecture"), pay it off in chapter 6, and give it a home on the site before the film is published: a line on the *Enterprise architecture* topic, or a short page.
2. **Other claims are as unsupported as "what data professionals lack most".** "*Most* courses and documentation give you only half", "rarely taught in context, so people *keep* struggling", "slow work that *nobody* wanted", and "*most* paradigms were made by data people" are all generalisations with no data behind them. *Recommendation:* say them as the author's experience, or soften them: "Many courses…", "In the author's experience, it's rarely taught in context…", "often seen as slow work few wanted to do", "many were made by data people, for data".
3. **It is long for what it is.** At about 6½ minutes it is twice the film as built, and longer than most films on the site, for a film meant to make people want to start. *Recommendation:* aim for about 5 minutes. Chapter 4 can lose the spoken station names (they are on screen as the route draws), keeping only the group names; chapter 7 can keep one lab step instead of two.
4. **The closing line no longer closes this film.** "The hard part is everything else" answered the old film's meeting. This film's thread is the four empty places from chapter 1. *Recommendation:* "Platforms have matured. The hard part is everything else: the organisation, the meaning, the decisions and the people. Start there." The four places light again on the route.
5. **The author's credential sits oddly in a synthetic voice.** "The author of this portal has worked…" read by a narrator sounds like a press release. *Recommendation:* keep the line, but show a plain card with the author's name and the three roles, so the claim has a face without a photo or a person drawn.
6. **Chapter 2 does four jobs** (the gap in courses, the harm, the author, the portal). It works, but it is dense. *Recommendation:* hold about a second after "a policy never reaches the code" before the author's line, so the problem lands before the answer.
7. **Numbers in the lab must be the lab's own.** "Event to bronze: 2.1 s" and "Checkpoint: 4 files" are placeholders. *Recommendation:* take them from the *Capture* lab as it runs when the film is built, so the film never shows what the lab can't do.
8. **The project icon must match the site.** Another thread is adding the project icon to the route and a page for the project. *Recommendation:* draw the film's icon from that thread's design, and point the end card to the project page, once both are on main.
9. **Earlier decisions it reverses.** The film's *Decided* table says about three minutes, no product in the voice, and the old meeting story. *Recommendation:* when the film is built, add the new decisions to `decided.md` (portal-first opening, dbt and Databricks named as examples, the author's credential, the new length) so the table and the film agree.

What works and should stay: the problem line "a model passes every test and answers the wrong question, or a policy never reaches the code" is concrete and memorable; the railway's main line and branch lines match the route; the tools stance ("any tools with the same capabilities would do") is clear and fair; and the project chapter shows something few courses show, the governance folders beside the code.

## Still open for the author

1. **Branch lines** or *side routes* for the two side paths.
2. **Length:** about 6½ minutes as it is, or trimmed to about 5 (point 3).
3. **The author's name** on a card, or "the author" only (point 5).
4. **The definition** of enterprise data architecture: "data designed as part of the organisation it serves"?
