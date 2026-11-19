# Model the business · The map behind the sketch: script

*Film 1 of 2 of* Model the business, *v1, 19 November 2026. About 6½ minutes. Made on the author's stated assumptions (the series' [proposal](../proposal.md)), with a Draft label until the author reviews it.*

## The promise

For a newcomer: before a data model gets sharper, each of its boxes needs a place in the organisation: what it's for, who answers for it, where it's first written, and what its word means. For a practitioner: the enterprise architecture and data governance a modeller reads before modelling, shown once for the university, so the energy company's eleven films needn't be told again (issue #405).

## The story in one paragraph

The Inner Life of Data drew a sketch of the university (a student, a class, an enrolment, a term and a course) and ended on a promise: what it means, and who decides, is the rest of the story. Noor, the data architect, is about to make that sketch the model the university shares. First she places each box on the university's map: what the university does (its capabilities, from the sector's HERM), what it needs to know (data domains, each with one owner), where each thing is first written (its system of record), and what each word means (the business glossary). Crossed like warp and weft, the two maps say who creates each thing and who only reads it. Three boxes find a home. Two don't: the registrar's office speaks of unit offerings, not classes, and the term's census date is counted by Planning. The map can't settle that; a sharper sketch can, in the next film. Six centuries earlier, the Ming court had the same need, and met it with two registers, each with one job.

## Opening story

The series follows one true story, the registers of the early Ming (the series' [proposal](../proposal.md), checked against the *Ming History*). This film tells its first part: one register for each thing.

| Beat | The line that says it |
|---|---|
| Scenario | "China, 1368. After years of war, a new dynasty, the Ming, rules from Nanjing." "Every household owes the state grain from its fields, and work: carrying grain, building walls, mending roads." |
| Problem | "But the old registers were lost in the war, and no tax had a fixed measure." "In the rich province of Zhejiang, landowners wrote their fields under other households' names, to escape the work." "So the burden fell on the families who couldn't hide their land." "The court didn't need a bigger count. It needed to know whose each field was, and who lived in each house." |
| Solution | "So, before counting anything, the court decided what it needed to know, and gave each thing a register of its own." "From 1381, households went into the Yellow Registers, in village units of a hundred and ten, led by ten of them in turn." "From 1387, land went into the fish-scale registers." "Each had one job: the land register settled who held a field; the household register, what each family owed." |
| Benefits | "By 1393, the court could count its people again: ten and a half million households." "And when a field was sold, its tax went with it, so no family paid for land it no longer held." Then the same for data: "A university has the same need, and so does every data model." "But first, each box needs a place: what it's for, who answers for it, where it's written, and what it means." |
| Back to the story | In *Warp and weft*, the Ming History's two threads become the university's two maps: "Now cross the two maps, like warp and weft: what the university does, and what it needs to know." And at the end, with its benefit for data: "The two registers let the court settle a field and set a tax, because each had one job, and one keeper." "The university's map does the same for its data: when a number is wrong, everyone knows whose record to check." |

Tested as AGENTS.md asks: from the narration alone, the problem is that nobody could tell whose field was whose, so the work fell on the families who couldn't hide their land; the fix gave the court a count again and made each field's tax follow it to its new owner. The film says what the *Ming History* says and no more: no acreage, and *again*, not *ever*.

## The reference, and practice

The series' [proposal](../proposal.md) holds the references and the insights, with where each comes from. In short:

| Body of knowledge | What it adds | Where the film uses it |
|---|---|---|
| CAUDIT's Higher Education Reference Models (HERM), v3.1.1 | A sector-owned set of reference models for universities, its capabilities among them | *What it does*: the university's eight level-1 capabilities, named once as the sector's shared starting point |
| The site's enterprise architecture method (*The map before the data*: TOGAF's layers, ArchiMate's notation, BIZBOK's capabilities) | Capabilities as what, not how; the layers a map is drawn in | *What it does*, *What it needs to know*, *Where it's written*: read from the example project's map, never drawn again |
| DAMA-DMBOK | Data governance's roles: owners, stewards; the business glossary; systems of record | *What it needs to know*, *Where it's written*, *What the words mean* |
| Information engineering's CRUD matrix, as *Business architecture for data* draws it | Crossing what the business does with what it needs to know shows who creates each thing | *Warp and weft* |

From practice (assumed until the author answers, from the site's films and the example project): a model built from one system's tables inherits that system's meaning; a box with no owner becomes a number nobody can fix; and a sketch always finds words the glossary hasn't decided yet, so the modeller asks the owner rather than deciding them.

## What each object stands for

| Object | Stands for |
|---|---|
| The title card over the fields at dusk: the series' mark, *The map behind the sketch*, *Where a data model's boxes belong* | The film and its series |
| Nanjing at dusk: a city wall, a hall, villages, and fields drawn plot by plot; people as plain silhouettes dressed for their time; *China, 1368 · Nanjing*; tags *grain* and *and work* | A state that runs on what each household owes |
| *the registers, lost in the war*, and *no fixed measure* | Records gone, and a tax nobody could check |
| *Zhejiang, the rich province*; dashed lines from a rich family's fields to other households' doors, *written under other households' names* | Land hidden under other names |
| *the burden*, carried to the households that couldn't hide their land | The harm, for people |
| Two questions over the village, *whose field?* and *who lives here?* | What the court needed to know |
| Two books on the ground, the yellow one and the earth-coloured one, each under its question | One register for each thing |
| *1381*: the Yellow Register open, households as small roofs in rows, *110 households*, *10 heads, a year each*, *ten of them* | The household register, its unit and its keepers |
| *1387*: students measuring a field with a rope, *its shape*, *its size*, *its owner: Chen*; fields drawn plot by plot, *like the scales of a fish* | The land register, measured field by field |
| *one job each*: *who holds each field*, *what each family owes* | Each register has one job |
| *the Ming History*, and a cloth woven between the two books: *the warp: the land*, *the weft: the households* | Two registers, one cloth |
| *1393*: roofs filling in, *households, counted again* | The benefit, with its number |
| A field sold, *its tax went with it*, and *no family* paying for land it no longer held | The benefit, for families |
| *the court, 1393* beside *a university, today*: *the same need*, *and every data model* | The story's need is the modeller's |
| *The Inner Life of Data · how it ended*: *What it means, and who decides, is the rest of the story.* | The promise this series keeps |
| *Conceptual model · the sketch we drew*: Student, Enrolment, Class, Course, Term; *to be shared by the university*; *Noor · data architect* | The intro's sketch, about to become the university's model |
| Four pills over the films' glass: *What it's for* (wheat), *Who answers for it* (salmon), *Where it's written* (green), *What it means* (lilac) | The four places each box needs; their colours mark them all film long |
| A card, *Enterprise architecture films · The map before the data · the same map, for an energy company* | Where the site shows how such a map is made |
| Eight capability tiles under *HERM · the Higher Education Reference Models · shared by universities: nobody starts from a blank page* | What the university does, from the sector's reference |
| *Award a degree*, and under it, *how: its systems and teams*: *ledgers and paper forms*, *the exams office*, *a student system*, *the registrar's office*, *a new student system* | What, not how: the how changes, the capability stays |
| *Learning and teaching* opened: *Awards and courses*, *Credit and its recognition*, *Learner records and credentials*, *Graduation*, *Short courses*, the sketch's boxes settling under them; *Term* under *Planning and census reporting* | Each box finds what it's for |
| Nine domain tiles, each with its owner: *Person*, *Student*, *Course*, *Staff*, *Finance*, *Organisation*, *Admissions*, *Research*, *Fees* | What the university needs to know, each with one owner |
| *Mei · registrar's office* beside *Student* and *Course*, the sketch's boxes dropping into them; *builds*, struck out; *what the words mean*, *what good data looks like* | The owner decides meaning, and builds nothing |
| *Student system · the record*, *HR system · the record*, *Finance system · the record*; *Data platform*, its copies *to read* and *to count*, *a copy never decides* | Systems of record, and the platform's copies |
| An enrolment *enrolled* in the record and *withdrawn* in the copy; the record winning, *fixed where it was written* | When the two disagree, the record wins |
| *Business glossary*: *Award*, *Commencing student*, *Credential*, *Learner*, *Unit offering*; the term *Award* with its definition and its owner, copied *In the model*, *word for word* | A term decided first, then copied |
| The sketch's five words looked up: *Student*, *Enrolment* and *Course* ticked; *Class* and *Term* struck out in amber; *Glossary term · Unit offering · A unit taught in a semester, on campus, online or both. · Owner: registrar's office*; *The registrar's word · Teaching period · Its census date: Planning counts by it, for government* | Two words that aren't the university's |
| *Owners decide the words*, *stewards keep them written*, *the data team builds from them* | Who does what with a word |
| The two maps woven: capabilities across, domains down, each crossing lit as it's read; *learning and teaching* creating enrolments, *Planning* reading them; *one creator for each thing*, *as many readers as need it* | Who creates each thing, and who only reads it |
| *Conceptual model · the sketch, on the map*: each box with four dots in the four colours; amber question marks on *Class*, *whose word?*, and *Term*, *whose date?* | The sketch on the map, and the two questions it leaves |
| *Ana · Head of School*: *How many commencing students are in each course this year?*; five steps lighting in turn: *Ticket · names the question*, *Map · its things, owners and records*, *Glossary · the words*, *Contract · the shape*, *Model · built from what exists* | Where the work starts |
| The two registers again, *set a tax*, *settle a field*, *one job, and one keeper* | The story's close |
| *Enrolled on census date · DS101 · 131 · from a dashboard*, *wrong?*, *whose record*: *Student system · the record*, *Registrar's office · its owner* | The benefit for data: everyone knows whose record to check |
| The sketch on the map again, and a card, *Next · A Sharper Sketch* | The next film |
| *Map it before you model it.* | The film's line to remember |

## The look

*The Inner Life of Data*'s look, as *From words to data* draws it: the past warm, on paper, at dusk; the university on the films' dark glass. The registers, fields and city are objects and places; the story's people are plain silhouettes with no faces, lit at the edge, dressed for their time. Nothing is drawn in the style of Chinese painting or calligraphy. The four places each box needs have their own colours, used for nothing else: wheat for what it's for, salmon for who answers for it, green for where it's written, lilac for what it means; amber marks a question still open.

## Script

### 1 · Lost registers · 0:00–0:45

China, 1368. After years of war, a new dynasty, the Ming, rules from Nanjing. Every household owes the state grain from its fields, and work: carrying grain, building walls, mending roads. But the old registers were lost in the war, and no tax had a fixed measure. In the rich province of Zhejiang, landowners wrote their fields under other households' names, to escape the work. So the burden fell on the families who couldn't hide their land. The court didn't need a bigger count. It needed to know whose each field was, and who lived in each house.

### 2 · Two registers · 0:45–1:52

So, before counting anything, the court decided what it needed to know, and gave each thing a register of its own. From 1381, households went into the Yellow Registers, in village units of a hundred and ten, led by ten of them in turn. From 1387, land went into the fish-scale registers. Students of the Imperial Academy measured every field: its shape, its size, and its owner's name. Drawn plot by plot, the fields looked like the scales of a fish. Each had one job: the land register settled who held a field; the household register, what each family owed. The Ming History calls them the warp and the weft: threads that run two ways, and together make a cloth. By 1393, the court could count its people again: ten and a half million households. And when a field was sold, its tax went with it, so no family paid for land it no longer held.

### 3 · The sketch we drew · 1:52–2:35

A university has the same need, and so does every data model. The Inner Life of Data ended on a promise: what it means, and who decides, is the rest of the story. On the way, we drew a sketch: a student, a class, an enrolment, a term and a course. Noor, the data architect, is about to make it the university's shared model. But first, each box needs a place: what it's for, who answers for it, where it's written, and what it means. That's the university's map. The enterprise architecture films draw one for an energy company.

### 4 · What it does · 2:35–3:12

The map starts with what the university does: its capabilities. Universities share a reference for them, HERM, the Higher Education Reference Models, so nobody starts from a blank page. A capability says what, not how. Systems and teams change; the need to award a degree doesn't. Open learning and teaching, and the sketch's boxes start to belong somewhere: awards and courses, learner records, graduation. Counting students on census date sits elsewhere: in planning, under strategy.

### 5 · What it needs to know · 3:12–3:53

Next, what the university needs to know, in data domains: person, student, course, staff, finance, and a few more. Each domain has one owner: the area that answers for its data. Student and course belong to Mei's registrar's office, with the faculties for courses. Staff is HR's. Organisation is Planning's. The student and the enrolment fall into the student domain; the course, the class and the term, into the course domain. An owner doesn't build anything. An owner decides what the words mean, and what good data looks like.

### 6 · Where it's written · 3:53–4:20

Then, where each thing is first written: its system of record. Students, enrolments and courses are written in the student system. HR and Finance keep their own. The data platform holds copies, to read and to count. A copy is useful, but it never decides. When the two disagree, the record wins, and a mistake is fixed where it was written.

### 7 · What the words mean · 4:20–5:01

Last, what each word means: the business glossary. Each term has a definition, and an owner who decides it. A term is decided there first, and the model copies it, word for word. Look up the sketch's words, and two of them aren't the university's. The registrar's office speaks of unit offerings, not classes: a unit taught in a semester, on campus, online or both. And of teaching periods, not terms, whose census date Planning counts by, for government. Owners decide the words, stewards keep them written, and the data team builds from them.

### 8 · Warp and weft · 5:01–5:38

Now cross the two maps, like warp and weft: what the university does, and what it needs to know. Each crossing says who creates a thing, and who only reads it: learning and teaching creates enrolments; Planning reads them. One creator for each thing; as many readers as need it. The sketch now hangs on the map. Each box has an owner, a home and a meaning. All but two: the class, whose word isn't the university's, and the term, whose date two areas share.

### 9 · Where the work starts · 5:38–5:59

And when a new question comes, the map says where the work starts. A ticket names the question. The map finds its things, their owners and their records. The glossary gives the words. A contract fixes the shape, and only then is the model built, from what already exists.

### 10 · Pull back · 5:59–6:29

The two registers let the court settle a field and set a tax, because each had one job, and one keeper. The university's map does the same for its data: when a number is wrong, everyone knows whose record to check. The map says where each box lives. It doesn't say the boxes are right. That's the next film. Map it before you model it.

## Sound

- **Palette, new for this film:** a harpsichord, plucked, for the weft, and a bass clarinet, held, for the warp: a pair no film on the site has, and neither of them in the topic Data modelling. Nothing borrowed from Chinese music. Just intonation from F; F, B♭ and C major, D minor and A minor. Written in `source/tools/score.py`.
- **Its mark, *warp and weft*:** the harpsichord rises F A C F while the bass clarinet falls C A F; they meet on A, then an F major chord. Under the title, under *warp* in *Two registers* and *Warp and weft*, and under the last line.
- **Music** under the opening story (*Lost registers* and *Two registers*), then only at a chapter's turn or under a moment on screen, never a bed under the voice.
- **Effects**, each tied to something on screen: a knock as a book lands, a rope drawn tight, pages, a sack set down, a card's tap, a pen, a tick.
- **Levels:** mixed to -16 LUFS (`tools/audio.py`). `tools/quiet.py` (the governance films' check) passes: after the opening, music sounds 21% of the time; it comes in 19 times, once every 14.6 seconds, at most four times in any 30 seconds; no figure comes back soon after itself; loud moments at -28.1 dB, the loudest notes at -24.9 dB, the effects' loud moments at -47.7 dB; at most five effects begin in any second; no two held notes beat; nothing pulses. The room rings within 0 dB of one from 100 Hz to 1.5 kHz, and moves none of the 23 held notes' levels.

## Pacing report

Measured by `source/tools/pace.py` on 19 November 2026, from the recorded voice: 134 words a minute over the film, 179 while the voice speaks, with 0.8 s after each sentence and the holds in `source/src/breath.js`.

| Chapter | Length | Words a minute | Voice |
|---|---|---|---|
| 1 · Lost registers | 44.6 s, with the title card | 132 | 73% |
| 2 · Two registers | 67.6 s | 138 | 78% |
| 3 · The sketch we drew | 42.7 s | 139 | 72% |
| 4 · What it does | 37.5 s | 120 | 81% |
| 5 · What it needs to know | 40.3 s | 132 | 80% |
| 6 · Where it's written | 27.1 s | 135 | 74% |
| 7 · What the words mean | 40.9 s | 138 | 77% |
| 8 · Warp and weft | 36.9 s | 138 | 72% |
| 9 · Where the work starts | 21.1 s | 139 | 73% |
| 10 · Pull back | 30.1 s | 130 | 65% |
| **Total** | **6:28.9, 871 words** | **134** | **75%** |

## Pause and think

Four questions, in `site/assets/the-map-behind-the-sketch/think.en.js` and `think.es.js`, each after the chapter it tests: *Two registers*, *What it needs to know*, *Where it's written* and *Warp and weft*. Each has one right answer, one near miss and one wrong option of the same length, and the right answers sit in different places.

## Checks

On 19 November 2026, from `source/`: `tools/build.py`; `tools/check.py` (11,667 moments over 388.9 s, every moment draws, nothing shows twice where one chapter meets the next); `tools/legible.py --overlaps` (250 pieces of text, none under 28 px, none off the frame or over other text); `site-tools/fits.py` (256 pieces of text in boxes, none leaves its box); `tools/pace.py`; `tools/quiet.py`; captions in English and Spanish (52 lines). The film picks no shots with `ag_shots` or `gv_shots`, so `site-tools/shots.py` has nothing to read.

## Rigour sheet

| Scene | Claim | Source |
|---|---|---|
| Lost registers | The Ming ruled from Nanjing from 1368; the registers were mostly lost at the end of the Yuan, and the land tax had no standard | *Mingshi* 77: 元季喪亂，版籍多亡，田賦無準 |
| Lost registers | Households owed grain and labour service | *Mingshi* 77 (賦役: tax and labour service) |
| Lost registers | In Zhejiang, the rich registered their land under other households to avoid labour service | *Mingshi* 77: 兩浙富民畏避徭役，大率以田產寄他戶 |
| Two registers | The Yellow Registers from 1381: 110 households to a *li*, ten heads serving in turn | *Mingshi* 77, 洪武十四年 |
| Two registers | The fish-scale registers from 1387: Imperial Academy students measured fields, with their shape, size and owner's name, drawn like fish scales | *Mingshi* 77, 洪武二十年 |
| Two registers | The land register is the warp, by which land disputes are settled; the household register the weft, by which taxes and labour are set | *Mingshi* 77: 魚鱗冊為經…黃冊為緯 |
| Two registers | 10,652,870 households in 1393 (said as ten and a half million) | *Mingshi* 77, 洪武二十六年 |
| Two registers | When land was sold, its tax was recorded with it, so property wouldn't leave while its tax stayed | *Mingshi* 77: 毋令產去稅存以為民害 |
| What it does | HERM is the universities' shared reference, its capabilities among its models; the eight level-1 capabilities | CAUDIT, HERM v3.1.1 (June 2025); the example project, `10-enterprise-architecture/architecture/1_strategy/2_capabilities.md` |
| What it needs to know | The domains and their owners: student and course the registrar's office's (courses with the faculties), staff HR's, organisation Planning's | The example project, `10-enterprise-architecture/architecture/3_information/1_data-domains-and-objects.md` |
| What it needs to know | An owner decides meaning and what good data looks like, and builds nothing | DAMA-DMBOK; AGENTS.md (*Owners and stewards never review pull requests*) |
| Where it's written | Students, enrolments and courses are first written in the student system; HR and Finance keep their own; the platform holds copies | The example project, `10-enterprise-architecture/architecture/4_application/1_realization-register.md` |
| What the words mean | *Award* and *Unit offering* as the glossary defines them, owned by the registrar's office | The example project, `20-data-governance/1-glossary/business-glossary.yml` |
| What the words mean | Census date is counted by for government reporting, by teaching period | The intro and *A Sharper Sketch*; TCSI (in *A Sharper Sketch*'s sources) |
| Warp and weft | Crossing capabilities with domains shows who creates each thing and who reads it | *Business architecture for data*'s matrix; information engineering's CRUD matrix |
| Where the work starts | Question, ticket, map, glossary, contract, then the model, from what exists | The author's question-to-core flow (16 November 2026); the example project's `00-initiatives/` |

## Sources (checked 19 November 2026)

- *Mingshi* (History of Ming), juan 77, *Shihuo* 1, on Wikisource: https://zh.wikisource.org/wiki/明史/卷77
- Wikipedia, *Yellow Registers* and *Fish-Scale Registers*: https://en.wikipedia.org/wiki/Yellow_Registers, https://en.wikipedia.org/wiki/Fish-Scale_Registers
- CAUDIT, *HERM Version 3.1.1 Now Available* (June 2025): https://www.caudit.edu.au/resources/herm-version-3-1-1-now-available
- EDUCAUSE, *The Higher Education Reference Models*: https://library.educause.edu/resources/2021/9/the-higher-education-reference-models
- The example project (roanboc/learning-data-project), the files named in the rigour sheet.
