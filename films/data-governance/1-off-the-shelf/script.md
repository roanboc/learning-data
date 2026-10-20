# Data governance · Off the shelf: script

*The script of the opening film of the data governance series (its title is still open), as made: 5:12, in ten chapters, in English, painted in watercolour, 17 October 2026. The narration lives in [`source/src/narration.js`](source/src/narration.js) and the pauses in [`source/src/breath.js`](source/src/breath.js); this page and those files say the same thing, and where they differ, the source wins. The title card follows chapter 1; the end card follows chapter 10. Made to read on a phone: on-screen text is at least 28 px in the frame, nothing sits under the captions, and no caption runs to three lines.*

## The promise

Every line passes two tests: anyone who has seen a policy library gather dust can follow it, and an experienced data governance lead finds nothing wrong in it. The film opens the series and says what it's about. A policy that only lives in a binder is a promise, like Magna Carta's one measure for the whole kingdom, which took six centuries to keep. What made measures the same in the end was all of it together: one definition, a copy where trade happens, and someone who checks, with authority. Governance works the same way. Its job is to decide who decides, and to make sure each decision reaches the work; management does the work. DAMA's body of knowledge is named once, with its wheel, and the series takes what the bodies of knowledge agree on. Governance is people's work: it starts by listening, and tools carry out what people agree. Every line of the binder faces one question, *where does it run?*, and the data team's own loop of ten steps already has the places. **A policy that doesn't run anywhere is a wish.**

## The story in one paragraph

In 1215, Magna Carta promised one measure of wine, ale and corn for the whole kingdom. For six hundred years the promise was repeated; kings sent standards to the towns, and they sat in cupboards. In 1871, a member of Parliament said that in his county alone a bushel meant thirty-two different measures. What worked, by the end of the century, was one definition in law, a copy in every county, and an inspector who checked against it, again and again. Today, Yusuf Demir starts as the university's data governance lead. He inherits a shelf of 34 policies, a maturity score of 2.1 out of 5, a chart of who's responsible for what with half the names "to be confirmed", and a council that meets once a month; his brief is to fix governance before the next submission to the government. The same week, Planning's census report and the draft submission disagree: 4,812 awards, or 4,867. Both are right. On Monday the word *award* changed, so microcredentials of at least 6 credit points now count, and one report ran before the change. The government counts awards its own way, and nobody has decided how the university's meaning maps to it: Mei owns the meaning, Jun builds it, Planning reports it, and the chart says "to be confirmed". Policy 12, "business terms are defined consistently", doesn't say who decides, or how a decision reaches the work. That's what governance is for. Yusuf doesn't write a 35th policy: he listens first, then asks of every line where it runs, and finds the places in the data team's loop where a decision can enter. Over the series, he takes the binder off the shelf.

## What each object stands for

| Object | Stands for |
|---|---|
| A crier at the market cross, reading out a charter | A policy: a promise, read out |
| The year in the corner turning, the proclamation turned over, the wine stall's three jugs never the same three | A promise repeated, not kept |
| The king's bronze standards in a cupboard in the market hall | A standard kept on a shelf, away from the trade |
| Bushels of every size along a merchant's table, each tagged "bushel" | One word, many meanings |
| The inspector of the 1880s, his case of brass copies, his mark on each weight, and the Act on the counter | What works: one definition, a copy where the work happens, someone who checks, with the law behind him |
| The shelf of 34 binders, the framed 2.1 out of 5, the chart with "TBC", the council's minutes | Governance as documents: true, and nowhere in the work |
| Two reports, on Planning's screen and in Mei's hands: 4,812 and 4,867 | Two reports, two meanings of one word |
| The glossary term on Jun's screen, with a new row: "microcredentials, 6 credit points or more" | A meaning that changed |
| The government's reporting manual on the registrar's desk, beside the university's own term | An outside definition someone has to map to |
| "TBC", stamped in red on the chart | A decision nobody owns |
| A gold card flying from the governance office to the glass of each office where the work is done | A decision reaching the work |
| The floor of offices behind glass, with data governance in the middle; DAMA's wheel, in DAMA's book | Governance at the centre, where the other areas meet |
| Speech bubbles in each office, and the answers pinned on Yusuf's board | Listening: what slows people down |
| Three highlighters, green, gold and grey, on policy 12's page | The test for every line of the binder: runs in the work, a decision someone owns, or can go |
| The data team's poster of the loop of ten steps, and gold pins on it | Where governance decisions enter the work |
| Nine binders lighting up on the shelf; six cards on the data team's board | The series: nine films on kinds of policy, then six with the tools |
| A soft wash behind each person: gold, cyan, or warm umber | The business side, the technical side, people of the past |

## The look

*Watercolour*, the look of the series on master and reference data, chosen on 17 October 2026. It replaces toy town (chosen on 16 October), which showed homes and places that weren't the university's: now the two series look like one university, and this one shows only its own places.

- **Pencil and wash.** Every place is painted on paper: a pencil line, paint gathering in the paper's grain, soft light from a window. People are drawn the way the master data films draw them (`films/master-and-reference-data/shared/src/people.js`, bundled as it is), with a soft wash of colour behind each one.
- **Only the university's places.** The campus, Yusuf's office, the floor of offices behind glass where the work is done (Planning, the registrar's office, data governance, the data team, the platform team), each team's room, and close-ups of their boards, screens and papers. Each room has its own wall colour: governance warm cream, Planning sage, the registrar's office blue, the data team lilac, the platform team pale teal.
- **Colour carries meaning.** Gold is governance's decisions, and, behind a person, the business side; cyan is the technical side; green is what runs in the work, grey what can go, and red what nobody owns yet.
- **The past is painted the same way,** with the place and year in the corner: a market in 1215, its market hall in 1497, a corn exchange in 1871, a grocer's shop in the 1880s. Its people wear their own time, in wool dyed with madder, woad and weld, or undyed, with a warm umber wash behind them.
- **Fewer diagrams, more situations.** Ideas are shown as people doing things in places: reading out a charter, marking a weight, asking round the offices, marking a policy line by line, pinning a poster. Words are on paper, screens, boards, tags and speech bubbles.

## Script

The times are the film's, from its timeline. Words on screen are on paper, screens, boards, tags and speech bubbles.

### 1 · One measure · 0:00–0:51

**Narration.** In 1215, Magna Carta made a promise. "There is to be one measure of wine throughout our kingdom, and one measure of ale, and one measure of corn." For six hundred years, the promise was repeated, and measures still differed from town to town. Kings sent standards to the towns. Officers checked them now and then. It wasn't enough. In 1871, a member of Parliament said that in his county alone, a bushel meant thirty-two different measures. What finally worked was all of it together: one definition in law, a copy in every county, and an inspector who checked against it, again and again, with the law behind him.

**Picture.** A market in 1215, painted in watercolour, inside the town walls by the gatehouse: a wine stall under a red-striped awning, a corn stall under a blue one, and the place and year in the corner. On the steps of the market cross, the sheriff's crier holds up the charter, "Magna Carta"; on the quote, his speech bubble. A vintner, an alewife with a jug, a miller and a buyer listen. On "repeated", close on the wine stall: the year turns through 1225, 1297, 1640 and 1824, and each time the proclamation on the stall's post turns over, its seal pops, and the stall's three jugs change, never the same three. On "kings", 1497: in the market hall, the king's bronze standards light up in a cupboard behind a grille, "the king's standards"; the clerk of the market takes the gallon out to a trader with a jug, "checked now and then". On "1871", a corn exchange: bushels of every size spring up along the merchant's table, each tagged "bushel", and "32 measures in one county". On "what finally worked", the 1880s: a grocer's shop, the grocer behind his counter. Each part is tagged as it's named: the Act on the counter, "one definition, in law"; the inspector's case of brass copies, "a copy in every county"; and the inspector, in a frock coat, "an inspector who checks", who sets his brass weight in the scale's pan, and the beam settles. Close on the counter: on "again and again", his hands hold a steel punch to each of the shop's iron weights in turn, the mallet comes down, and a crown appears on it; on "with the law behind him", the Act behind them glows gold. Wordless: the last mark, then the title card.

**On screen.** England · 1215 · Magna Carta · One measure of wine throughout our kingdom. · England · 1225 · 1297 · 1640 · 1824 · England · 1497 · the king's standards · checked now and then · England · 1871 · bushel · 32 measures in one county · England · 1880s · one definition, in law · a copy in every county · an inspector who checks · Off the shelf · where a policy meets the work · Film 1 of 16 · data governance

### 2 · The shelf · 0:51–1:19

**Narration.** Today, Yusuf Demir starts as the university's data governance lead. He inherits a shelf of thirty-four policies, and a maturity score: 2.1 out of 5. A chart of who's responsible for what, with half its names still to be confirmed. And the minutes of a council that meets once a month. His brief: fix governance before the next submission to the government.

**Picture.** "Today", in the corner. On the campus, Yusuf, a box of his things in his arms, looks up at the building, then walks in; his name card, "Yusuf Demir · data governance lead". In his office: the shelf of binders, "34 data policies", and the framed score on the wall, 2.1 out of 5, which glows as it's named. Close on the chart pinned to his board, who's responsible for what, for four things: "TBC" is written into half its cells, one by one. On the desk, the council's minutes, this month's on top of the months before: "Action: name the data owners", stamped "CARRIED FORWARD". Back in the office, his box on the desk, Yusuf holds binder 12, worried; Prof. David Mensah, the Deputy Vice-Chancellor, at the door: "Can you fix governance before the submission?"

**On screen.** Today · Yusuf Demir · data governance lead · 34 data policies · Who's responsible for what · responsible · accountable · consulted · informed · census report · award term · government submission · data access · Clara · Jun · Mei · Sam · TBC · Data council · Minutes · July · Minutes · August · Minutes · September · Action: name the data owners · CARRIED FORWARD · policy 12 · Can you fix governance before the submission?

### 3 · Two numbers · 1:19–1:40

**Narration.** The same week, two reports disagree. Planning's census report says 4,812 awards were conferred this year. The draft submission to the government says 4,867. Which number is right?

**Picture.** The floor where the work is done: five offices behind glass, side by side, each named, with people at work in them. Yusuf walks down the corridor in front of them. In Planning, Clara points to the census report on the wall screen, and 4,812 springs in. In the registrar's office, Mei holds up the draft submission: 4,867. The floor again: a card on Planning's glass, "census report · 4,812 awards", one on the registrar's, "draft submission · 4,867 awards", and a gold question mark over Yusuf, between them.

**On screen.** Planning · Registrar's office · Data governance · Data team · Platform team · Census report · awards conferred this year · 4,812 · Draft submission · awards · 4,867 · census report · 4,812 awards · draft submission · 4,867 awards · ?

### 4 · Who decides? · 1:40–2:15

**Narration.** Yusuf follows the numbers back. Both are right, each by its own meaning of award. On Monday, the word changed: microcredentials of at least six credit points now count. One report ran before the change, the other after. But the government counts awards by its own definition. Who decides how ours maps to it? Mei owns what award means here. Jun builds what the model says. Planning reports what it's given. And the chart says: to be confirmed.

**Picture.** Yusuf follows the numbers down the floor to the data team, where Jun waves. On the data team's board, the two reports' cards, "census report · ran Friday · 4,812" and "draft submission · ran Wednesday · 4,867", each get a green tick. Close on Jun's screen: the glossary's term, *award*, and what counts, with a new row lit, "microcredentials, 6 credit points or more", and a gold chip, "changed Monday". On the board, Monday's gold card goes up between the reports, with "before" and "after" over them. On the registrar's desk, the government's reporting manual stands beside the university's own term on a tent card; tags name them, "the government's definition" and "ours", and a gold arc between them ends in a question mark. Mei shrugs. On the floor, a card goes up on each office's glass as it's named: "Mei · owns the meaning", "Jun · builds the model", "Planning · reports what it's given". Then the chart, close: the government submission's row lights, and "TBC" is stamped in red on its accountable cell.

**On screen.** census report · ran Friday · 4,812 · draft submission · ran Wednesday · 4,867 · Glossary · award · what counts: · graduate certificates · masters and doctorates · changed Monday · microcredentials, 6 credit points or more · Monday · award · changed · before · after · Reporting manual · awards · the government's definition · award · our term · ours · ? · Mei · owns the meaning · Jun · builds the model · Planning · reports what it's given · TBC

### 5 · What governance is for · 2:15–2:46

**Narration.** Policy 12 says that business terms are defined consistently. It doesn't say who decides, or how a decision reaches the work. That's what governance is for: deciding who decides, and making sure each decision reaches the work. Like the inspector at the market: a rule, a copy where the work happens, and someone who checks. Governance sets the rules and checks they're kept. Management does the work.

**Picture.** Binder 12, open on Yusuf's desk, at policy 12: "Business terms are defined consistently across the organisation." Two pale red sticky notes go on beside it as they're named: "who decides?" and "how does it reach the work?". The floor: the governance office in the middle lights gold, "deciding who decides", with Yusuf writing in it; then a gold card flies from it to the glass of each office where the work is done, and the people there look up: "each decision reaches the work". The 1880s shop again: "a rule" by the Act, "a copy where the work happens" by the case, and "someone who checks" by the inspector, who sets his weight in the pan. The floor again: on the governance office's glass, "governance · sets the rules, checks they're kept", and a green tick on each decision; over the offices on either side, "management · does the work", and the people there go back to their work.

**On screen.** Policy 12 · Data definitions · Business terms are defined consistently across the organisation. · who decides? · how does it reach the work? · deciding who decides · each decision reaches the work · England · 1880s · a rule · a copy where the work happens · someone who checks · governance · sets the rules, checks they're kept · management · does the work

### 6 · Governance at the centre · 2:46–3:14

**Narration.** Data management has a body of knowledge: DAMA's. It draws eleven areas as a wheel, with governance at the centre, where the others meet. Others cover the same ground, or part of it: DCAM, ISO 8000 for data quality, and ISO/IEC 38505 for governing data. This series takes what they agree on, and shows where it runs.

**Picture.** Yusuf's desk: binder 12, closed, his two notes sticking out of it, and DAMA's book set down beside it. The book open at its wheel: as the wheel is named, the ten areas come in round the centre, one after another; "data governance" lights at the centre, and gold runs where the areas meet it. On "others", the areas dim: a gold ring goes round the whole wheel, "DCAM · the same ground"; data quality lights, "ISO 8000 · data quality"; then the centre, "ISO/IEC 38505 · governing data". The camera closes in on the centre, and on "where it runs", the floor: the governance office in the middle, lit gold, and the offices on either side lighting up as they work.

**On screen.** 12 · Data definitions · DAMA-DMBOK · Data Management Body of Knowledge · data architecture · data modelling & design · data storage & operations · data security · data integration & interoperability · documents & content · reference & master data · data warehousing & BI · metadata · data quality · data governance · DCAM · the same ground · ISO 8000 · ISO/IEC 38505 · governing data

*The only place in the series where the bodies of knowledge are named. Later films teach the idea without saying which body it came from.*

### 7 · Listen first · 3:14–3:53

**Narration.** Yusuf doesn't write a thirty-fifth policy. He asks everyone the same question: what slows you down? For Jun, the rules arrive after the work is built. Mei approves the words, then never sees where they're used. Sam could protect a column in minutes, if anyone said which. Planning doesn't know which number to trust. The people who wrote the binder weren't the problem. They wrote what they were asked for. Governance is people's work. Tools can carry out what people agree, but they can't make them agree.

**Picture.** On Yusuf's desk, a fresh page headed "Policy 35", and nothing else; it turns over, unwritten. On the floor, he walks out with his notebook and asks, "What slows you down?", and the people in each office look up. In each office in turn, the person answers in a speech bubble while Yusuf writes it down: Jun, "The rules arrive after I've built it."; Mei, "I approve the words, then never see them used."; Sam, "Tell me which column, I'll protect it in minutes."; Clara, by her census report with "4,867?" stuck beside it, "Which number do I trust?". Close on his office's board: his question on a card, and the four answers pinned under it, one by one. In his office, the shelf the binder came from glows warm. In the data team's room, Mei, Jun and Yusuf talk it through, nodding. Close on Jun's screen, the tests on *award*: the rule Mei and Jun agreed on Monday runs as a test and passes, with a green tick and the agreement behind it in gold; how *award* maps to the government's has no test, because no one has agreed it.

**On screen.** Policy 35 · What slows you down? · The rules arrive after I've built it. · I approve the words, then never see them used. · Tell me which column, I'll protect it in minutes. · Census report · awards conferred this year · 4,812 · 4,867? · Which number do I trust? · Jun · rules arrive after the build · Mei · never sees where the words go · Sam · no one says which column · Planning · which number to trust? · Tests · award · award counts microcredentials of 6 credit points or more · passed · award mapped to the government's definition · no agreed rule yet

### 8 · Where does it run? · 3:53–4:18

**Narration.** So he opens the binder, with one question for every line: where does it run? Some lines can run in the work itself, as a required field, a check, a tag or a test. Some are decisions: someone owns each one, and writes it down where the work can find it. And some can go.

**Picture.** Yusuf's desk: binder 12, closed, and three highlighters, green, gold and grey. He opens the binder, and sticks a note beside policy 12: "where does it run?". The page, close: policy 12, seven lines. As each is sorted, a highlighter's stroke goes behind it and Yusuf writes beside it: green for the lines that run in the work, "a required field", "a check", "a tag", "a test"; gold for the decisions someone owns, "award: Mei decides", "in the glossary"; and grey for the line that can go, struck through. His key across the top: "runs in the work", "a decision someone owns", "can go".

**On screen.** 12 · Data definitions · Policy 12 · Business terms are defined consistently across the organisation. · where does it run? · 12.1 · Each term has a named owner. · 12.2 · Each term used in a report is in the glossary. · 12.3 · Terms about people are marked as personal data. · 12.4 · Reports count by the glossary's definitions. · 12.5 · Each term's owner decides its definition, and how it maps to the government's. · 12.6 · Each decision is written down with the term. · 12.7 · Staff take care to use terms correctly. · runs in the work · a required field · a check · a tag · a test · a decision someone owns · award: Mei decides · in the glossary · can go

### 9 · Where decisions enter · 4:18–4:49

**Narration.** And the work already has places for them. The data team builds in a loop of ten steps, from a question to a new version. Governance doesn't need another meeting. It needs a pin at the right steps: a term when the question is asked, a classification at the source, an owner and a contract, a rule as a test, an approval at review, and a version when it changes.

**Picture.** The data team's room: Yusuf comes in with a box of gold pins, Jun turns from his desk, and the team's poster of how they build catches the light. Close on the poster, "How we build": the loop of ten steps, from "a question" to "evolve", as in *In the weeds of data crafting*, goes round once. The room again: Jun, "Another meeting?"; Yusuf holds up the box of pins instead, and Jun looks relieved. Close on the poster: as each is named, a gold pin goes in at the edge of its step, a gold ring goes round it, and Yusuf writes what's pinned there: "a term" at the question, "a classification" at the sources, "an owner · a contract" at gaps and contracts, "a rule" at tests, "an approval" at review and ship, "a version" at evolve. A short wordless moment in the room: six gold pins in the team's own poster.

**On screen.** How we build · a question · the sources · the consumers · gaps · contracts · tests first · build in layers · validate · review · ship · written once · evolve · Another meeting? · a term · a classification · an owner · a contract · a rule · an approval · a version

### 10 · The series · 4:49–5:12

**Narration.** Over nine more films, Yusuf takes the binder off the shelf, one kind of policy at a time. Then six more show how to build them, with dbt and Databricks. A policy that doesn't run anywhere is a wish.

**Picture.** Yusuf's office: as the films are named, nine binders on the shelf light up and slide forward, one for each film to come, and he takes the first down: "Who decides". On "six more", the data team's board, close: "With the tools", and six cards pinned up one by one, each with its number, its tools' logos and its title. On the floor, Yusuf carries "Who decides" down the corridor, towards the offices where the work is done, and Jun looks up. The end card.

**On screen.** Who decides · With the tools · 11 · Governed in dbt · 12 · Governed in Unity Catalog · 13 · Meaning on the platform · 14 · Quality on the platform · 15 · Products in open formats · 16 · The marketplace · A policy that doesn't run anywhere is a wish. · Off the shelf · Film 1 of 16 · data governance · Learning Data

## Sound

A new palette for a new series ([`source/tools/score.py`](source/tools/score.py)). A soft brass choir, warm and unhurried, holds the chords: D dorian in open fifths for the market town, F major once the measures hold, and for the university today. A low music box, small and close, marks the moments that land, and means the same thing all through: 1-3-5 rising for a rule, a copy and someone who checks (chapters 1 and 5), two notes a semitone apart for a question no one can answer yet, a note a little out of tune for each bushel. The series' mark, four notes, 1-5-4-8, on one horn with the music box above, plays under the title and the end card. One low pulse, leaning on the semitone at 96 beats a minute, runs under the two numbers that disagree, from "the same week" to "both are right". The effects are wooden knocks, paper, cork pins, rubber stamps and a mallet's thud, each at the moment its thing appears, all below about 2.5 kHz. The mix is -16.6 LUFS: the music sits 20.3 dB under the voice while it speaks and 19.8 dB under in the pauses, near *The map before the data*'s 21 and 18.5; the pulse sits 8 dB under the music; and with the voice silent, the sound above 4 kHz is 0.00013 of full scale (RMS).

## Pause and think

The film can stop at the end of three chapters, with one question each (`site/assets/off-the-shelf/think.en.js` and `think.es.js`). The series has no labs yet, so the questions link to none.

| After | Question | Answer |
|---|---|---|
| Who decides? | Both numbers are right. Why can't anyone say which one goes to the government? | Nobody has decided how the university's meaning of award maps to the government's. The person who should decide is "to be confirmed". |
| What governance is for | What's the difference between governance and management? | Governance decides who decides, sets the rules and checks they're kept. Management does the work: the owners, the engineers and the platform. |
| Where does it run? | "Personal data is classified and protected." Where could this line run? | As a check that every column of a public model is classified, and a mask the platform applies by classification. If it can't run, it's a decision someone owns, or it goes. |

## Labs (candidates)

1. **Where does it run?** Twelve lines from a policy binder. Sort each into runs (and where), owned decision (and who), or retire.
2. **Who decides?** Six decisions about the award. Match each to the owner of the meaning, the person who does the daily work, the platform, or the council.
3. **Pin it on the loop.** Seven governance decisions. Put each at the step where it enters the work.
4. **What slows you down?** Five answers from people at the university. Say which enabler would help each, and which needs a conversation first.

## Rigour to check before recording

Checked on 16 October 2026; the sources are listed below.

- **Magna Carta, clause 35.** The quote is the Magna Carta Project's translation (University of East Anglia), cut before "namely the quarter of London": "There is to be one measure of wine throughout our kingdom, and one measure of ale, and one measure of corn". The British Library's translation reads "There shall be standard measures of wine, ale, and corn (the London quarter), throughout the kingdom". The clause *promised* one measure; it didn't achieve it. It was kept in every reissue (as chapter 25 of the 1225 and 1297 texts) and repealed in 1948. Kings had tried before: Edgar's code, and Richard I's assize of measures of 1196.
- **"Repeated for six hundred years."** The years in the corner: the reissues of 1225 and 1297, the Clerk of the Market Act 1640 ("one Weight one Measure and one Yard... throughout all the Realme") and the Weights and Measures Act 1824. Measures still differed: the Magna Carta Project says local variations persisted long after the thirteenth century.
- **The king's standards.** An Act of 1495 had bronze ("brass") standard measures made and sent to the towns; they were found defective, and remade under an Act of 1496, and sent out about 1497. Elizabeth I's standards of 1588 stayed the primary standards until 1824. Sources disagree on how many towns received them (37, 43, 57 or 60), so the film gives no number. The Henry VII bushel, gallon and quart survive at Winchester; a 1497 bushel at Salisbury. Clerks of the market carried the standards and sealed the measures they checked from the thirteenth century, so "officers checked them now and then" is fair; the film draws a cupboard, not a particular town's.
- **1871.** Sir Charles Adderley, MP for North Staffordshire, in the Commons on 26 July 1871 (Hansard, Weights and Measures (Metric System) Bill): "In his own county, a bushel meant 32 different measures." The same debate cites the 1862 Select Committee: 61 different measures for the sale of wheat. By then the base units were uniform in law; local trade units built on them were not.
- **What worked.** The Weights and Measures Act 1824 set up the imperial standards (in force 1 January 1826). The Act of 1834 had county magistrates buy copies of the standards, keep them at central places, and appoint inspectors, who compared and stamped every weight and measure used in trade and "shall keep a Book" of their comparisons; contracts made with unstamped measures were void. The 1835 Act abolished local and customary measures. The 1878 Act consolidated the law and gave the Board of Trade oversight of standards and inspectors. The film's inspector is in the 1880s, at a grocer's scale, because shop weights and measures were uniform by the late 1800s, while corn kept customary units until the Corn Sales Act 1921: so the film doesn't show the bushels becoming one.
- **Clothes.** 1215: wool tunics and gowns, a coif, veils with wimples, a straw hat, a crier's cape; dyes of madder, woad and weld. 1497: a clerk of the market in a furred gown and a bonnet, a trader in a hood. 1880s: an inspector in a frock coat and top hat, a grocer in shirtsleeves, waistcoat and apron. Check against a costume history before recording.
- **The university's numbers** (4,812 and 4,867, 55 apart) are invented, and so is the change to the term: "...a graduate certificate, a master or a microcredential, for at least 6 credit points..." is the change *Written once* tested its glossary sync with (`films/analytics-engineering/project/skills/sync-the-glossary/`, run 6 October 2026 on a scratch copy). The glossary's own term today is in `films/analytics-engineering/project/skills/sync-the-glossary/example_glossary.json`, and its copy, with `source:`, in `films/analytics-engineering/project/models/core/course/_course__conceptual.yml` (lines 18 to 31).
- **The government's definition** is kept generic on purpose: every reporting regime counts completions by its own rules, and the film doesn't name one. The example project's course domain takes its reference model from TCSI (Australia's Tertiary Collection of Student Information); the film doesn't say which government or rule.
- **RACI** (responsible, accountable, consulted, informed) is a common form of the "chart of who's responsible for what"; "TBC" on it is invented, and common.
- **Governance and management.** ISO/IEC 38505-1:2026, Introduction: "Governance is distinct from management and concerns evaluating, directing and monitoring the use of data, rather than the mechanics of storing, retrieving or managing the data." DAMA-DMBOK2 (p. 67): data governance is "the exercise of authority and control (planning, monitoring, and enforcement) over the management of data assets." "Governance sets the rules and checks they're kept. Management does the work" keeps both: direction and monitoring, against doing. "Deciding who decides" is the proposal's wording of decision rights. Plan-build-run is COBIT's, not used here.
- **DAMA-DMBOK.** The current edition is the second, revised (2024), a maintenance release: no knowledge area was renamed. DAMA describes it as "organized around 11 core knowledge areas, with data governance at the center", drawn as the DAMA Wheel. The areas round the film's wheel use the wheel's short forms of the other ten. The film paints its own wheel, in its own colours, not DAMA's figure. DMBOK 3.0 is in development, targeted for 2027: check before publishing.
- **DCAM** (Data Management Capability Assessment Model) is the EDM Association's (named the EDM Council until 1 July 2025); the current version is DCAM v3 (2025), for members. **ISO 8000** is the series of standards on data quality (Part 1, Overview, April 2022, current). **ISO/IEC 38505-1:2026** (second edition, August 2026) replaced the 2017 edition: anywhere that cites 2017 must change. iso.org can't be read automatically, so on 20 October 2026 the edition was checked in the standard's own preview: its foreword says "This second edition cancels and replaces the first edition (ISO/IEC 38505-1:2017)", and its introduction has the sentence quoted above, word for word. AFNOR's store lists ISO 8000-1:2022 as current.
- **The loop of ten steps** and its signs are *In the weeds of data crafting*'s (`STEPS10` in `films/analytics-engineering/shared/src/weeds.js`). The pins follow the proposal: a term at the question, a classification at the sources, an owner and a contract at contracts, a rule at tests, an approval at review, a version at evolve.

**Sources (16 October 2026).** Magna Carta Project, clause 35: https://magnacarta.cmp.uea.ac.uk/read/magna_carta_1215/Clause_35?com=%21all · British Library translation (via Salisbury Cathedral): https://www.salisburycathedral.org.uk/wp-content/uploads/2025/01/Translation-of-Magna-Carta-Courtesy-of-the-British-Library.pdf · Magna Carta 1297 c. 25 (repealed 1948): https://www.legislation.gov.uk/aep/Edw1cc1929/25/9/section/XXV · Clerk of the Market Act 1640: https://www.legislation.gov.uk/aep/Cha1/16/19/enacted · Hansard, 26 July 1871: https://api.parliament.uk/historic-hansard/commons/1871/jul/26/second-reading · Science Museum Group, Henry VII's bushel and Elizabeth I's weights: https://collection.sciencemuseumgroup.org.uk/objects/co57551 and https://collection.sciencemuseumgroup.org.uk/objects/co57496 · Salisbury Museum, Winchester bushel: https://salisburymuseum.org.uk/collections/winchester-bushel/ · Weights and Measures Act 1834 (scan): https://www.bradingcommunityarchive.com/wp-content/uploads/2020/07/BTT-1086-10-text.pdf · Weights and Measures Act 1835: https://vlex.co.uk/vid/861233434 · Weights and Measures Act 1878: https://vlex.co.uk/vid/861255184 · Corn Sales Act 1921: https://www.legislation.gov.uk/ukpga/Geo5/11-12/35/enacted · N. Williams, the clerk of the market (LAMAS 19): https://archaeologydataservice.ac.uk/catalogue/adsdata/arch-4072-1/dissemination/pdf/LAMAS_Vol19_76-89_SesssionsOfClerkMarketOfTheHouseholdInMiddlesex.pdf · DAMA-DMBOK revision: https://dama.org/dama-dmbok-revision/ · DAMA, what data management is: https://dama.org/about-dama/what-is-data-management/ · DCAM: https://edmcouncil.org/frameworks/dcam/ · ISO 8000-1:2022: https://www.iso.org/standard/81745.html · ISO/IEC 38505-1:2026: https://www.iso.org/standard/87195.html and https://webstore.iec.ch/en/publication/116038 · DMBOK2's definition, as quoted: https://wiki.gccollab.ca/Data_Governance · Checked 20 October 2026: ISO/IEC 38505-1:2026's front pages, in a preview: https://www.technickenormy.cz/publicdoc/iec_previews/4311698.pdf · ISO 8000-1:2022 at AFNOR: https://www.boutique.afnor.org/en-gb/standard/iso-800012022/data-quality-part-1-overview/xs139221/323356

## Pacing report

From `source/tools/pace.py`, 17 October 2026, with the recorded voice:

| Chapter | Length | Words a minute | Voice | Longest quiet |
|---|---|---|---|---|
| 1 · One measure | 50.9 s | 129 | 71% | 6.4 s (the stamp and the title, wordless) |
| 2 · The shelf | 28.5 s | 131 | 74% | 1.8 s |
| 3 · Two numbers | 20.6 s | 81 | 67% | 2.6 s (after "Which number is right?") |
| 4 · Who decides? | 35.0 s | 134 | 73% | 1.8 s |
| 5 · What governance is for | 30.9 s | 130 | 74% | 1.8 s |
| 6 · Governance at the centre | 27.7 s | 123 | 79% | 1.8 s |
| 7 · Listen first | 39.4 s | 133 | 70% | 2.8 s |
| 8 · Where does it run? | 24.9 s | 132 | 64% | 2.8 s |
| 9 · Where decisions enter | 31.0 s | 136 | 65% | 4.8 s (the pinned poster, wordless) |
| 10 · The series | 22.7 s | 103 | 54% | 6.8 s (the end card, wordless) |
| **Film** | **5:11.5** | **126** | **70%** | |

652 words. Every sentence has at least 0.5 s after it, and no stop inside a chapter lasts 2.5 s or more, apart from the three wordless moments. Chapter 3 is slow on purpose: two numbers, read aloud, need time to land.
