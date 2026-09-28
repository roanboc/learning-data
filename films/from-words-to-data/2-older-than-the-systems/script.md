# From words to data · Older than the systems: script

*The script of Older than the systems, in [From words to data](../README.md), as filmed: 5:21, in eight chapters, in English. The narration lives in [`source/src/narration.js`](source/src/narration.js) and the pauses in [`source/src/breath.js`](source/src/breath.js); this page and those files say the same thing, and where they differ, the source wins.*

## The promise

A newcomer understands it, and a data architect agrees with it. Schools have left evidence of learning for almost four thousand years, and for more than a thousand, credentials have had the same parts: someone trusted makes a claim about someone, backed by evidence, in a way others can check. Only the materials changed. A conceptual model that names those parts outlives every system built on it; a logical model makes it precise, still without technology, and becomes the yardstick every system is held against: to choose a package, map its fields, or move to a new one.

## The story in one paragraph

A museum shelf fills from left to right: a clay school tablet with a teacher's model and a student's copy, a guild's masterpiece lock, a scroll from China's imperial examinations, a licence to teach under a wax seal, then a diploma, a transcript, a digital badge and a credential signed with a digital key. The materials change; one thread of wax-red light runs through them all. Lined up in a table, every exhibit has the same parts: issuer, holder, claim, evidence, date, and someone who checks it; some expire, a few are revoked. The rows lift into a conceptual model, and today's standard for digital credentials uses almost the same words. At the university, credentials live in five systems, each with its own little model inside, one of them bought off the shelf and calling learners customers. Connected in pairs they need ten translations, and in 1999 a spacecraft was lost at Mars because one team's software broke the unit its interface specification required, and nobody checked it against the spec; through one shared model, five translations will do. One learner, Aisha, has four IDs; each fact about her gets one source, her records are linked into one, and a shared list of credential kinds keeps the word meaning the same everywhere. The pencil sketch becomes a precise logical model, and then a yardstick held against a vendor's model: fit and gap. Every part has an owner; a change of meaning travels down, news of a system's change travels up. At the end, the platform still says "customer", but its words are mapped to ours, and systems that come and go every decade stand above ideas that have lasted since the Middle Ages.

## What each object stands for

| Object | Stands for |
|---|---|
| A museum shelf, warm light and date tags | The past: eight materials that learning and its credentials have been written on |
| A clay tablet with a neat column and a wobbly one | An Old Babylonian school tablet: the teacher's model and the student's copy |
| An iron lock, three wax-red ticks and a mark struck on the plate | A guild masterpiece, judged by the masters, and the guild's acceptance |
| A scroll of brush strokes with a red seal | China's imperial examinations and the rank they gave |
| Parchment with a cord and a wax seal | A medieval licence to teach |
| A wax-red thread through every exhibit | The idea that stays while the materials change |
| A table: one column per exhibit, one row per part, rows lighting across | The same five parts in every credential |
| Gold boxes with verbs: Issuer issues, Holder holds, Credential rests on Evidence, Verifier checks | The conceptual model |
| Blue word tags beside the boxes | The W3C Verifiable Credentials standard's words |
| Glass cards, one per system, each with two small boxes inside | Five systems, each with its own model of a credential |
| A cardboard box that slides in and opens | A package bought off the shelf, with its model inside |
| A dashed gold box filling up with the vendors' words | A business that doesn't write its own model down |
| A ring of five systems with ten links, some flickering red | Point-to-point integration, and meaning slipping at each interface |
| Two team cards, a gold interface spec beside them, a red crack between them, a path too low over Mars | The Mars Climate Orbiter: each program ran, one broke the written spec, and nobody checked it |
| A gold hub with five spokes, and a counter from 10 to 5 | Integration through one shared model |
| Four ID cards joined by a gold bracket into one learner record | Master data (the learner record), and its management: linking records that are the same person |
| Arrows from each source to one fact, with ticks | A system of record for each fact |
| A blue list: award, microcredential, badge | Reference data: a shared list of values |
| A pencil sketch that becomes a precise gold diagram | From the conceptual sketch to the logical model |
| Crow's feet, "one" and "many" | Cardinality |
| A red rule card | A business rule in the model: revoked is never counted |
| A gold ruler above a vendor's model, with ticks and crosses | The logical model as a yardstick: fit and gap |
| Three bands (words, logical model, tables), each with its owner | Ownership, from meaning to tables |
| A wax-red arrow down and a blue arrow up | A change of meaning travels down; news of a system's change travels up, before it ships |
| A glossary stamp changing version | Stewardship: keeping it written down and up to date |
| Dashed gold arrows from Customer and Certificate to Learner and Microcredential | Mapping a package's words to the shared model, without renaming |
| System blocks replaced along a timeline, over one steady band | Systems change every decade or so; the concepts stay |

## Script

Timings are the voiced film's.

### 1 · Same idea, new materials · 0:00–0:54

**Narration.** Almost four thousand years ago, student scribes in Mesopotamia practised on clay. Some of their school tablets hold a teacher's model, with the student's copy beside it. In medieval Europe, a journeyman became a master by making a masterpiece: one piece of work, judged by the masters of the guild. In China, imperial examinations tested candidates for thirteen centuries, and the rank they earned opened the way to office. At medieval universities, a chancellor granted the licence to teach, under a wax seal. Then came the diploma, the transcript, the digital badge, and today, a credential signed with a digital key. The materials changed every few centuries. The idea didn't.

**Picture.** A museum shelf in warm light. The camera moves along it as each exhibit appears: the clay tablet, where a reed stylus presses the student's copy beside the teacher's model; an iron lock with its key, three wax-red ticks and the guild's mark struck on the plate; a scroll whose red seal lights at "the rank"; a parchment licence whose wax seal presses. The camera pulls back as the diploma, the transcript, the badge and the signed credential appear. Under each, its material; above them all, a wax-red thread. Title.

**On screen.** c. 1800 BCE · Mesopotamia · teacher's model · student's copy · medieval Europe · a masterpiece · the guild's mark · 605–1905 · China · a rank · the way to office · medieval universities · a licence to teach · a wax seal · Diploma · Transcript · Digital badge · Signed credential · clay · iron · paper and ink · parchment · wax · paper · pixels · a digital key · the same idea · the materials changed · FROM WORDS TO DATA · Older than the systems · why the concepts outlive every system

### 2 · The model underneath · 0:54–1:43

**Narration.** Look closely, and every one of them has the same parts. Someone trusted issues it: a guild, the examiners, a university. It names a holder, and makes a claim about them: this person can do this. It rests on evidence: a masterpiece, an examination, an assessment. And it has a date. Someone else can check it: by the seal, by the signature, or today, by the digital key. Some expire. A few are revoked. Today's standard for digital credentials uses almost the same words: issuer, holder, verifier, claims and evidence. A conceptual model can outlast every material it was ever written on.

**Picture.** Five exhibits line up as the columns of a table; a lens passes over them. Each row lights across all five as the narrator names it: issuer, holder, claim, evidence, date, then "checked by", with ticks at the seal, the signature and the key; a status row shows valid, expired and revoked. The rows lift into five gold boxes joined by verbs, the background turns from parchment to glass, and the standard's words line up in blue beside the boxes. The exhibits, kept small along the top, crumble to dust; the model stays lit.

**On screen.** Guild masterpiece · Imperial examination · Licence to teach · Diploma · Signed credential · issuer · holder · claim · evidence · date · checked by · status · valid · expired · revoked · Issuer · Holder · Credential (claim, date, status) · Evidence · Verifier · issues · holds · rests on · checks · W3C Verifiable Credentials · issuer · holder · verifier · claims · evidence · a conceptual model: no material, no technology

### 3 · Every system has a model inside · 1:43–2:16

**Narration.** At the university, credentials now live in five systems. The student system holds awards. The learning platform, completions. Careers, badges. A digital wallet, the signed copies. And the new short-course platform, bought off the shelf, holds the microcredentials. It calls learners customers. Buying a system means adopting its model, whether you look at it or not. If you don't model your business, your vendors will do it for you.

**Picture.** Four glass cards in the systems' colours, and an empty dashed place. Each card fills with what it holds and its own two-box model: Graduand and Award, User and Completion, Member and Badge, Holder and Credential. A cardboard box slides into the empty place and opens: the short-course platform, with Customer and Certificate. Every model glows; a dashed gold box, "our own model, not written down", appears, and the five vendors' words for a learner fly into it.

**On screen.** At the university · Student system · holds awards · Learning platform · holds completions · Careers · holds badges · Digital wallet · holds signed copies · off the shelf · vendor · Short-course platform · holds microcredentials · learners, called "customers" · our own model · not written down · If you don't model your business, your vendors will.

### 4 · Where meanings meet · 2:16–2:56

**Narration.** Connect five systems in pairs, and you need up to ten translations. Each one is a place where meaning can slip. In 1999, a spacecraft was lost at Mars. One team's software gave the thrusters' push in pound-force seconds. The navigation software expected newton-seconds. Each program ran without an error. The meaning broke between them, and nobody held it to the spec. So translate each system once, to a shared model. Five translations instead of ten, and one place where the meaning is written down.

**Picture.** Five systems in a ring; ten links draw one by one, each with a small diamond, and a counter climbs to 10; three links flicker red. Space: a spacecraft follows a path too low over Mars, below the dashed planned path, and its signal is lost. Two team cards appear, one in pound-force seconds, one in newton-seconds, and beside them the interface spec: newton-seconds. Each program shows it ran with no errors; the arrow between them cracks red; then the spec is held against both, a cross for pound-force seconds and a tick for newton-seconds: not checked against the spec. Back to the ring: the links fade, a gold hub appears, five spokes grow, and the counter falls from 10 to 5.

**On screen.** translations 1–10 · each translation: a place where meaning can slip · 1999 · Mars · planned · actual: too low · signal lost · One team's software · gave the thrusters' push in · pound-force seconds · The navigation software · expected · newton-seconds · interface spec · newton-seconds · ran · no errors · not checked against the spec · 1 pound-force second = 4.45 newton-seconds · shared model · 5 · one place where the meaning is written down

### 5 · One person, many records · 2:56–3:33

**Narration.** Take one learner, Aisha. She has four IDs: a student number, a platform login, a customer number and a wallet address. Her name comes from the student system, her email from IT, and her credentials from three different places. Choosing which system is the source of each fact, and linking the records that are the same person, is master data management. And shared lists of values, such as the kinds of credential, keep a word meaning the same thing in every system. That's reference data.

**Picture.** Aisha, and four ID cards, one per system. A card of her facts fills from the right: the student system gives her name and her award, IT her email, the short-course platform her microcredential, Careers her badge. Each arrow earns a tick; a gold bracket joins the four IDs into one learner, L-000418, labelled master data, and the card turns gold. A blue list of credential kinds appears below, with lines to every system that uses it.

**On screen.** Aisha · Student system · student number · S1048221 · Learning platform · platform login · aisha.k · Short-course platform · customer number · C-77310 · Digital wallet · wallet address · did:key:z6Mk…4f2a · Aisha's facts · one learner · L-000418 · name · email · award · microcredential · badge · IT directory · Careers · one source for each fact · same person · master data · credential kind · award · microcredential · badge · reference data

### 6 · Precise, but not yet technical · 3:33–4:18

**Narration.** The sketch on paper says what matters. The logical model says it precisely. What identifies a credential? Who issued it, to whom, for what, and when. Its attributes, and the values each may take: the level, the volume of learning, the status. How many of one relate to another: one learner holds many credentials, and one microcredential can count towards several awards. And the rules: a revoked credential is never counted. Still no technology. That's what makes it useful: it's the yardstick every system is held against, to choose a package, to map its fields, or to move to a new one.

**Picture.** The pencil sketch from *What's in a word*, "sketch v3 · draft", gives way to a precise gold diagram: Credential with its attributes, Learner, Issuer, Evidence, and Microcredential and Award as kinds of credential. Rows light as the narrator names them; crow's feet appear with "one" and "many"; a line joins Microcredential and Award, many to many; a red rule card points at the status. Then the model becomes a gold ruler held above a vendor's model: six ticks, two crosses, fit and gap.

**On screen.** what matters · sketch v3 · draft · Credential: credential id, issuer id, learner id, claim, awarded on: date, level: 1–10, volume of learning: hours, status: valid | expired | revoked · Learner · Issuer · Evidence · Microcredential · Award · a kind of credential · identifies it · allowed values · holds · issues · rests on · counts towards · one · many · rule · revoked → never counted · no technology · our logical model: the yardstick · a vendor's model · short-course platform · customer · certificate no. · course name · level · hours · revoked flag · fit · gap · choose a package · map its fields · move to a new one

### 7 · Who owns what · 4:18–4:48

**Narration.** Every part has an owner. The registrar owns the word award. The short-courses team owns microcredential. Noor, the data architect, owns the logical model, and each team owns its own tables. A change of meaning travels down, from the words to the systems. News of a change in a system travels up, before it ships. Owners decide. Stewards keep it written down, and up to date.

**Picture.** Three bands: the words, the logical model, the systems. Mei stands beside "award", Tom beside "microcredential", Noor beside the model, Ben beside the tables. A wax-red "v1.1" travels down the right side through all three bands; a blue "upgrade" travels up, before it ships. The glossary's stamp turns from v1.4 to v1.5.

**On screen.** the words · the business decides · award · owner: Registrar · Mei · microcredential · owner: Short courses · Tom · the logical model · one model for all · owner: Noor, data architect · the systems · each team, its tables · awards · certificates · badges · meaning · news · before it ships · Owners decide. · Stewards keep it written down. · glossary v1.5 · 28 Sep

### 8 · Pull back · 4:48–5:21

**Narration.** The short-course platform still calls them customers. Nothing inside it changed. But its customer now maps to learner, and its certificate to microcredential. The meaning is joined. Systems come and go every decade or so. The ideas underneath them are centuries old. Model them once, precisely, and hold every system up to that. Next: one model, many shapes.

**Picture.** The short-course platform, unchanged, beside the shared model; dashed gold arrows map Customer to Learner and Certificate to Microcredential, then turn solid. Pull back to a timeline: systems replace one another every decade or so above one steady band, "students · courses · degrees, since the Middle Ages"; the model sits above them, with a dotted line and a tick to each. End card.

**On screen.** nothing inside it changed · the shared model · Learner · Microcredential · maps to · mapped, not renamed: the meaning is joined · mainframe · client–server · web portal · cloud suite · platforms · replaced · a new system every decade or so · students · courses · degrees, since the Middle Ages · the ideas: centuries old · the model · Next: one model, many shapes · The concepts outlive the systems. · Older than the systems

## Pause and think

The film can stop at the end of four chapters, with one question each. Each links to the lab that teaches the same idea.

| After | Question | Answer | Lab |
|---|---|---|---|
| The model underneath | A driving licence, a vendor certification and a PhD. What do they have in common? | The same parts: an issuer, a holder, a claim, evidence and a date, which someone else can check. | Same idea, new materials |
| Where meanings meet | Six systems connected in pairs: how many translations? Through one shared model? | Fifteen in pairs, six through a model. | Fit and gap |
| One person, many records | Aisha's email differs in the learning platform and IT's directory. Which should everyone use? | The one in the system of record for email: IT's directory. | Who is the source? |
| Precise, but not yet technical | The logical model names no database and no product. Why is that an advantage? | It can be held against any system: to choose a package, map its fields, or move to a new one. | Fit and gap |

## Rigour sheet

| Chapter | What the film says | What an expert would add, or what the picture simplifies |
|---|---|---|
| Same idea, new materials | Old Babylonian school tablets hold a teacher's model beside a student's copy. | These are "Type II" tablets, the commonest exercise tablets at Nippur: the teacher's model on the left of the obverse, the pupil's copy, often erased and rewritten, on the right (Robson, 2001). The Old Babylonian period is about 1900–1600 BCE, so "almost four thousand years" is rounded. The wedges drawn are not real cuneiform. |
| Same idea, new materials | The shelf begins with a school tablet, then credentials. | The tablet shows teaching and assessment, not a credential: no issuer makes a claim about a holder for others to check, and no Old Babylonian credential document is known. So the table of parts starts with the first credentials (China's imperial examinations, from 605, and medieval guilds and licences), and the site says learning has left evidence for almost four thousand years, and credentials have had the same parts for more than a thousand. |
| Same idea, new materials | A journeyman became a master by making a masterpiece, judged by the masters of the guild. | The path usually went from apprentice to journeyman to master, and it was the journeyman who made the masterpiece; rules, fees and the masterpiece itself varied by town and trade, and many guilds kept the accepted piece. The guild's mark drawn is invented. |
| Same idea, new materials | China's imperial examinations tested candidates for thirteen centuries; the rank opened the way to office. | Usually dated from 605 (Sui dynasty) to their abolition in 1905. The highest degree, jinshi, made a candidate eligible for high office. The scroll's writing is abstract brush strokes, not characters. |
| Same idea, new materials | At medieval universities, a chancellor granted the licence to teach, under a wax seal. | The licentia docendi was granted by the bishop's chancellor (or the scholasticus), not by the masters themselves, from the 12th century; the right to teach anywhere (ius ubique docendi) was first granted by the pope to Toulouse in 1233, and to Paris in 1292. Sealing with wax was the usual way to authenticate such documents. |
| The model underneath | Every credential has an issuer, a holder, a claim, evidence and a date, and can be checked; some expire, a few are revoked. | The five exhibits' values are illustrative, not documented individuals, and their years are examples. Not every historical credential recorded its evidence, and "expiry" and "revocation" are modern terms for older practices. |
| The model underneath | Today's standard uses almost the same words: issuer, holder, verifier, claims and evidence. | The W3C Verifiable Credentials Data Model 2.0 (a W3C Recommendation since 15 May 2025) defines issuers, holders and verifiers, claims, and optional evidence and credentialStatus. Open Badges 3.0 (1EdTech) builds on it. The film's model is conceptual; the standard also defines proofs, subjects and validity periods. |
| Every system has a model inside | Five systems, each with its own model; a package brings its model with it. | The systems and their entity names are fictional composites; real packages differ, and many can be configured. "Adopting its model" means its entities, keys and rules, even when the screens can be relabelled. |
| Where meanings meet | Five systems in pairs need up to ten translations; through a shared model, five. | n systems need up to n(n−1)/2 point-to-point mappings, against n through a canonical model (a hub, or a canonical data model on an integration platform). A shared model still needs governance, and not every pair of systems needs to talk. |
| Where meanings meet | In 1999, Mars Climate Orbiter was lost: ground software gave thruster impulse in pound-force seconds; navigation expected newton-seconds. Each program ran without an error, and nobody held it to the spec. | The Mishap Investigation Board's Phase I report (November 1999) names the root cause as the SM_FORCES ground software, whose file of angular-momentum desaturation data was in pound-force seconds instead of the newton-seconds the interface specification required. The trajectory estimate was off by a factor of about 4.45; the spacecraft arrived at about 57 km instead of the planned 226 km, below the roughly 80 km considered survivable. The meaning was written down; one side broke it, so the film shows the specification, a cross on the side that broke it and a tick on the side that met it. "Nobody held it to the spec" sums up the report's process findings: verification and validation did not adequately cover the ground software, so the file's non-compliance was not caught, and the mis-modelled velocity changes went undetected in operations. |
| One person, many records | Four IDs; each fact has one source; choosing sources and linking records is master data management; shared lists of values are reference data. | The IDs are fictional; the wallet's is shown as a decentralised identifier (did:key), one common form. Master data is the data itself (here, the learner record, labelled "master data"); managing it is the activity the narration names. Master data management also covers matching rules, survivorship and data quality; reference data is often governed by standards bodies (for example, government code sets for reporting). |
| Precise, but not yet technical | The logical model: identifiers, attributes and allowed values, cardinality, and rules, still without technology. | The conceptual–logical–physical levels are the modelling profession's convention (1980s information engineering, IDEF1X and similar), as *A Sharper Sketch* used them; they echo, but are not, ANSI/SPARC's external, conceptual and internal schemas (1975), and build on Chen's entity-relationship model (1976). "Level 1–10" follows the Australian Qualifications Framework's ten levels, as an example; volume of learning is often given in hours or credit points. |
| Precise, but not yet technical | The model is the yardstick to choose a package, map its fields or migrate. | Fit-gap analysis usually grades each requirement (fits, configure, extend, gap); the film's platform is fictional. It has a revoked flag (a fit, as the scenarios, where it revokes certificates, need), and no evidence or stacking (the gaps). |
| Who owns what | Business owners own the words; the architect owns the logical model; teams own tables; changes travel down, news travels up; stewards keep it written down. | Roles vary between organisations (data owner, data steward, custodian); the film uses the series' people. The two directions are *Silent change*'s two halves of a change, applied to the model itself. |
| Pull back | Systems come and go every decade or so; the ideas are centuries old. | The eras on the timeline are indicative, not a history of one university's systems; how long a student system lasts varies widely. |

## Sources

Checked on 28 September 2026, through search results that quote them (the primary pages could not be opened from the build machine):

- W3C (2025). The Verifiable Credentials 2.0 family of specifications is now a W3C Recommendation, 15 May 2025. https://www.w3.org/news/2025/the-verifiable-credentials-2-0-family-of-specifications-is-now-a-w3c-recommendation/ and *Verifiable Credentials Data Model v2.0*, https://www.w3.org/TR/vc-data-model-2.0/
- NASA (1999). *Mars Climate Orbiter Mishap Investigation Board Phase I Report*, November 1999. https://discovery.larc.nasa.gov/PDF_FILES/MCO_report_2.pdf
- 1EdTech. *Open Badges 3.0*. https://www.1edtech.org/standards/open-badges
- Robson, E. (2001). The Tablet House: a scribal school in Old Babylonian Nippur. *Revue d'assyriologie* 95. https://shs.cairn.info/journal-revue-d-assyriologie-2001-1-page-39?lang=en ; CDLI wiki, Old Babylonian school texts, https://www.cdli.ox.ac.uk/wiki/doku.php?id=old_babylonian_school_texts
- The imperial examinations, 605–1905, and the jinshi degree: Britannica, *Jinshi*, https://www.britannica.com/topic/jinshi-Chinese-title
- The licence to teach: Oxford Reference, *Licence to Teach, licentia docendi*, https://www.oxfordreference.com/display/10.1093/oi/authority.20110803100104245
- Guild masterpieces: Britannica, *Master (craft guild)*, https://www.britannica.com/topic/master-craft-guild

To check before the next update:

- ANSI/X3/SPARC Study Group on Database Management Systems (1975), interim report; Chen, P. P. (1976). The entity-relationship model. *ACM Transactions on Database Systems* 1; Codd, E. F. (1970). A relational model of data for large shared data banks. *Communications of the ACM* 13.
- Australian Qualifications Framework, second edition (2013): levels 1–10 and volume of learning.
- The typical life of a student system, from sector surveys.

## Pacing report

```
chapter      duration   wpm  voice  longest quiet  notes
materials       54.2s   122    78%           5.4s  
model           48.6s   126    74%           4.4s  
inside          32.8s   126    77%           1.8s  
meet            40.0s   127    81%           2.0s  
person          36.9s   138    80%           1.8s  
logical         45.4s   135    78%           1.8s  
owners          30.3s   131    78%           1.8s  
end             32.4s   107    67%           6.0s  

total 5:20.7, 677 words, 127 wpm, voice 77% of the time, 165 wpm while speaking
sentences with under 0.5 s after them: 0; stops of 2.5 s or more inside chapters: 0
```
