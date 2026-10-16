# From words to data · Meaning machines can read: script

*The script of Meaning machines can read, in From words to data, as filmed: 5:00, in nine chapters, in English. The narration lives in [`source/src/narration.js`](source/src/narration.js) and the pauses in [`source/src/breath.js`](source/src/breath.js); this page and those files say the same thing, and where they differ, the source wins. The timings are the voiced ones (see [Pacing report](#pacing-report)).*

## The promise

A newcomer understands it, and a data architect agrees with it. An AI assistant answers from the meaning it can read. There are four common ways to write meaning down, and they stack rather than compete: a **glossary** says what words mean, for people; a **taxonomy** says what kind each thing is; an **ontology** says how things relate and what's allowed, in a form a machine can check; a **semantic layer** says how each number is calculated, once, for every tool. An ontology is not the data model again: they name the same things, but the **data model** plans the records a business keeps, while the ontology defines what those things mean, for every system, so a machine can reason with them. The glossary explains the word, the ontology defines the idea, the model plans the records, and each points to the others. Published standards save starting from blank, if you choose them deliberately.

## The story in one paragraph

People tried to write meaning down long before computers: Linnaeus gave every species a two-part name and a place in a hierarchy, and scientists still use it; Wilkins tried to classify everything in the universe, and it never took hold; Nightingale asked hospitals to record the same things the same way, and a shared list of causes of death became today's ICD. The ones that last are made for a purpose. At the university, Ana, the Head of School, asks Genie which learners are one microcredential away from a graduate certificate. Genie finds the tables and the columns `is_micro` and `stack_ok`, but the stacking rule lives in a policy PDF that no tool reads, so it guesses: 214, against the registrar's 132. The film then builds the four floors of meaning, writes the stacking rule in the ontology and connects the university's data to it as a knowledge graph, and puts the ontology beside Noor's data model, which names the same things but plans the records: its boxes become tables and its lines keys. Asked whether Aisha holds a fourth microcredential, the tables say no, because none is recorded, and the ontology says it can't tell, because one may come from elsewhere; three cards end the chapter, the glossary, the ontology and the data model on one thread. The film then defines "credentials awarded this year" once in the semantic layer for every tool, and shows the shelf of published standards and the three official definitions of *microcredential*. Ana asks again; Genie asks back, "approved for stacking, or all microcredentials?", and answers 132 with the definition it used. The triangle from *What's in a word* returns, with the word in English and Spanish, in the glossary, the idea in the ontology, and the data.

## What each object stands for

Everything from *What's in a word* (the warm past, the dark glass of the present, the triangle), Genie's orb and chip from *A Sharper Sketch*, plus:

| Object | Stands for |
|---|---|
| A living tree with paper tags, the robin at the tip of its branch | Linnaeus's hierarchy: kingdom, class, order, genus, species, and a two-part name |
| A root card "everything", forty slips, and fine strokes running off the screen | Wilkins's universal classification: bounded by nothing, so it sprawls and fades |
| Three hospital forms with the same columns, a band of light across them | Nightingale's uniform hospital statistics: comparable because recorded the same way |
| A handwritten list becoming a glass card of codes, a line of revisions | The 1893 list of causes of death becoming today's ICD, revised again and again |
| Four floors stacked like a building, each with its question | Glossary (gold), taxonomy (green), ontology (violet), semantic layer (blue): a stack, not rivals |
| A white thread through the four floors | One idea, *microcredential*, written down at every layer |
| Tables with two columns outlined; a greyed PDF with a crossed-out eye | What Genie can read, and meaning kept where no tool reads it |
| Red 214 beside green 132 | A confident answer from guessed meaning, against the registrar's list |
| Violet statements, then a graph of learners, microcredentials and a certificate | The ontology's rules, and the data connected to them: a knowledge graph |
| A pencil sheet beside a violet panel of formal lines | Aristotle's recipe (the kind, and what sets it apart), made formal |
| Two panels: the ontology's violet concepts, and Noor's blue boxes with crow's feet | The ontology and the data model: the same things, named twice, for different jobs |
| Boxes that become tables, a line that becomes a key | The data model plans the records: from the conceptual sketch to the tables the systems store |
| A dashed link, "holds · concluded" | A conclusion a machine draws from the ontology, which nobody wrote down |
| One question, two answers: "no: none is recorded" and "can't tell: not stated" | A database's closed world, and an ontology's open world: each right for its job |
| Three cards on one white thread: glossary, ontology, data model | The word, the idea and the records: three jobs, linked, each with its owner |
| A blue metric card with four parts; a dashboard, a spreadsheet and Genie pointing at it | A metric defined once in the semantic layer, and every tool asking it |
| A card of plain lines under the metric | An open format for sharing definitions between tools |
| A shelf of binders by industry | Published models and standards: a start, not a blank page |
| A digital credential with issuer, holder · subject, claim, evidence and status | The parts a digital-credential standard names |
| Three cards with green shared parts and amber differences | Three official definitions of *microcredential* that don't quite match |
| Check, adopt, extend, record, and pins on every floor | Choosing a standard deliberately, at every layer (from *A Sharper Sketch*) |
| Two bars, "guesses" and "grounded", not to scale | Grounding an assistant in explicit meaning makes it more accurate |

## Script

Timings are the voiced film's, from `tools/pace.py` and the timeline.

### 1 · They tried before · 0:00–0:50

**Narration.** In the 1750s, Linnaeus gave each species a two-part name, and a place in a hierarchy. Scientists still use his system. Nearly a century earlier, John Wilkins designed a language to classify everything in the universe. It never took hold. In 1860, Florence Nightingale asked hospitals to record the same things, in the same way, so that they could be compared. An international list of causes of death followed in 1893. Today, it's the International Classification of Diseases. Shared definitions let strangers compare. The ones that last are made for a purpose, not for everything.

**Picture.** The warm past. A tree grows, with tapering branches and leaves that sway; a robin lands at the tip of one branch. "Erithacus rubecula" appears under it, genus and species bracketed, with a note: named by Linnaeus in 1758 as *Motacilla rubecula*. Paper tags light along the robin's branch: kingdom Animalia, class Aves, order Passeriformes, genus Erithacus; "his system: still used today". Then Wilkins: a card "everything" fans out into forty slips (God, world, element, stone, metal, herb, tree, fish, bird, beast…), and fine strokes run off every edge of the screen; the chart fades, "never took hold". Three hospital forms breathe on the table, the same columns and the same diseases in the same order on each, every row adding up; a band of light crosses the three header rows. A handwritten list of causes of death, 1893, becomes a glass card of ICD-11 codes, above a line of revisions (1893, WHO in 1948, ICD-10, ICD-11). Three cards: Linnaeus ✓, Wilkins ✗, Nightingale → ICD ✓, and the lesson card. At the breath, the title.

**On screen.** 1750s · Linnaeus · Erithacus rubecula · genus · species · 1668 · Wilkins · 40 kinds, divided again and again · never took hold · 1860 · Nightingale · same columns, same way: now they compare · 1893 → today · International Classification of Diseases · made for a purpose, not for everything · *Meaning machines can read* · what an AI assistant needs to answer right

### 2 · Genie guesses · 0:50–1:22

**Narration.** At the university, the Head of School asks Genie: which learners are one microcredential away from a graduate certificate? Genie finds the tables. It finds a column called is_micro, and another called stack_ok. But the stacking rules live in a policy document that no tool can read. Genie guesses, and it's wrong. An AI assistant answers from what it can read. Meaning kept only in documents is out of its reach.

**Picture.** Ana in her bubble; Genie's orb and chip. Three tables appear (learners, credentials, certificates); dashed beams run from the orb to each, a scan crosses the columns, and `is_micro` and `stack_ok` are outlined. A policy PDF appears, its two rules legible ("4.1 Each approved microcredential is worth 10 credits; four complete the certificate's 40." and "4.2 A graduate certificate accepts up to four approved microcredentials towards its credit."), then greys out behind a crossed-out eye: "no tool can read this". Genie's card glitches in red, 214, "guessed from is_micro and stack_ok"; the registrar's list, 132, in green; a red cross. A dashed border draws around the tables, "what Genie can read"; the document gets its own border, outside it.

**On screen.** Ana Ruiz · Head of School · learners · credentials · certificates · no tool can read this · Genie 214 · Registrar's list 132 · what Genie can read

### 3 · Four ways to write meaning down · 1:22–1:56

**Narration.** There are four common ways to write meaning down, and they stack. A glossary: words and their definitions, for people. A taxonomy: kinds of things in a hierarchy, like Linnaeus's. An ontology: concepts, the relationships between them, and rules that a machine can check and reason with. And a semantic layer: how each number is calculated, defined once. They aren't rivals. Each one answers a different question.

**Picture.** Four empty floors stack up like a building, then light one by one from the bottom: gold word cards (credential, microcredential, stacking); a green hierarchy (credential, then award, microcredential, badge, then degree and graduate certificate); violet concepts with labelled links and a rule chip ("up to 4 · approved only"); blue metric cards (11,890 credentials awarded, 132 near a certificate, 71% completion). Each floor shows its question. A white thread runs through *microcredential* on every floor: "a stack, not rivals". In the breath, the four floors glow in turn.

**On screen.** Glossary · what does it mean? · Taxonomy · what kind is it? · Ontology · how does it relate, and what's allowed? · Semantic layer · how is it calculated? · a stack, not rivals

### 4 · The ontology · 1:56–2:30

**Narration.** In the ontology, the rules are written as statements. A microcredential is a kind of credential. A graduate certificate accepts up to four approved microcredentials towards its credit. Connect the university's data to these statements, and it becomes a knowledge graph: learners, credentials and courses, linked by what they mean. It's Aristotle's recipe made formal: the kind of thing, and what sets it apart, in a form a machine can use.

**Picture.** Two violet statement cards, each written in words and then as nodes and a labelled link; the second gains three conditions (max 4, approved only, towards its credit): "a machine can check this". The statements become the ontology row of a knowledge graph (Microcredential counts towards Graduate certificate, which "accepts max 4 · approved"); below the dashed line, the data: Aisha, Ben and Chen linked to Data Visualisation, SQL for Analysis, Data Ethics and Python Basics, and those (except Python Basics, "not approved") to the Graduate Certificate in Data Analytics. Aisha lights: "3 approved: one more completes it". Then a breathing pencil sheet, Aristotle's recipe with the kind underlined in blue and what sets it apart in amber, beside a violet panel of formal lines (under Microcredential: subClassOf Credential, assessed, volume, countsTowards Graduate certificate; under Graduate certificate: accepts max 4 approved Microcredential): "made formal", "a form a machine can use".

**On screen.** Ontology: rules, written as statements · is a kind of · accepts · max 4 · approved only · towards its credit · a knowledge graph · accepts max 4 · approved · 3 approved: one more completes it · the kind of thing · what sets it apart · made formal · a form a machine can use

### 5 · Ontology or model? · 2:30–3:17

**Narration.** Noor's data model draws the same things: learners, credentials, certificates. Is the ontology just the model again? No: they do different jobs. The model plans the records the university keeps. Each box becomes a table; each line, a key. The ontology says what things mean, for every system, so a machine can draw conclusions from it. Ask both: does Aisha hold a fourth microcredential? The tables say no: none is recorded. The ontology says it can't tell: one may come from elsewhere. The glossary explains the word. The ontology defines the idea. The model plans the records.

**Picture.** Two panels of glass. On the left, the ontology, carried over from the knowledge graph: Credential, Microcredential, Learner and Graduate certificate, linked by "is a kind of", "holds" and "counts towards". On the right, Noor's data model ("owner: Noor, data architect"): Learner, Credential and Certificate drawn as *A Sharper Sketch* draws them, boxes with crow's feet. Each thing lights on both sides as it's named; a round "=" between the panels asks "the same things?", and becomes "≠" at "No": "different jobs". While the model speaks, the ontology steps back: "plans the records the university keeps"; the boxes become three tables (learners, certificates and credentials, with Aisha's three microcredentials as rows), and the line between learners and credentials becomes a key, learner_id, outlined in both tables. Then the model steps back: "says what things mean", "for every system"; the certificate dims, a light runs along "is a kind of" and "holds", and a dashed link appears from Learner to Credential, "holds · concluded". A question card: "Does Aisha hold a fourth microcredential?" On the left, Aisha in the knowledge graph with her three microcredentials and a dashed fourth, "from elsewhere?"; on the right, an empty dashed row under the credentials table. "no: none is recorded"; "can't tell: not stated"; "each right, for its job". The panels move over and a glossary card comes in from the left: three cards, each lighting as it's named, with its job and its form of the one idea: the word *microcredential* and its definition (owner: Short courses); the concept Microcredential, a kind of Credential (owner: Short courses); a credentials row of kind micro (owner: Noor, data architect). A white thread joins the word, the concept and the row: "one idea, three jobs".

**On screen.** Ontology · Credential · Microcredential · Learner · Graduate certificate · is a kind of · holds · counts towards · Data model · owner: Noor, data architect · Learner · Credential · Certificate · the same things? · = · ≠ · different jobs · plans the records the university keeps · learners · certificates · credentials · learner_id · credential_id · kind · key · says what things mean · for every system · holds · concluded · Does Aisha hold a fourth microcredential? · Aisha K. · Data Visualisation · SQL for Analysis · Data Ethics · from elsewhere? · no: none is recorded · can't tell: not stated · each right, for its job · Glossary · explains the word · microcredential · a small credential, whose learning has been assessed · owner: Short courses · defines the idea · plans the records · one idea, three jobs

### 6 · The semantic layer · 3:17–3:41

**Narration.** In the semantic layer, credentials awarded this year is defined once: what's counted, what's left out, which date, and at what grain. Dashboards, spreadsheets and Genie all ask it, instead of each writing its own version. Open formats for sharing these definitions between tools are starting to appear.

**Picture.** A blue metric card fills in, part by part as they're named: measure (count of credentials), left out (revoked credentials), date (awarded on, this academic year), grain (one row per credential awarded). A dashboard, a spreadsheet and Genie appear with their own numbers in red (12,140, 11,702, 12,960); arrows reach the card, and all three turn to 11,890, their old versions struck through. A small definition card slides out: "open formats are appearing".

**On screen.** credentials awarded this year · semantic layer · defined once · measure · left out · date · grain · = 11,890 · one definition, every tool · open formats are appearing

### 7 · Standards · 3:41–4:15

**Narration.** You don't have to start from a blank page. Finance, health, insurance and retail all publish shared models, and so does education. Digital credentials have open standards too, with issuer, holder and evidence in them. Even microcredential has official definitions: from Australia, from the European Union, and from UNESCO. They don't quite match. So choose deliberately. Check, adopt, extend and record, as in A Sharper Sketch, at every layer.

**Picture.** A blank page with a blinking cursor slides away; a shelf of binders fills, group by group: FIBO and ISO 20022 (finance); HL7 FHIR, SNOMED CT and ICD (health); ACORD (insurance); GS1 (retail); CEDS, HERM and TCSI (education). Below: W3C Verifiable Credentials, Open Badges and the European Learning Model, and a digital credential (issuer, holder · subject, claim, evidence, status) whose issuer, holder and evidence light as they're named. Then three cards for *microcredential*: Australia, the European Union and UNESCO, each with a shared part (assessed, in green) and two differences (in amber): "same word, different edges". Last, the four steps from *A Sharper Sketch*, and a small four-floor stack gains a pin of each colour on every floor: "at every layer".

**On screen.** the standards' names and industries · DIGITAL CREDENTIALS · issuer · holder · subject · claim · evidence · status · "microcredential": three official definitions · same word, different edges · 1 Check · 2 Adopt · 3 Extend · 4 Record · at every layer

### 8 · Genie, again · 4:15–4:39

**Narration.** The Head of School asks again. This time, Genie asks back: approved for stacking, or all microcredentials? Then it answers, and shows the definition it used. Studies have found that grounding an assistant in explicit meaning makes its answers measurably more accurate. The difference is the meaning it can read.

**Picture.** Ana's question again. Genie's bubble asks back; Ana answers, "Approved for stacking." Genie's card counts up to 132, green, "matches the registrar's list", beside the definition it used ("one away: holds 3 approved microcredentials; four complete a graduate certificate"), with its sources (ontology · stacking rule; semantic layer · near a certificate). Two bars grow, "tables only: guesses" short and red, "tables + meaning: grounded" long and green, marked "illustrative · not to scale": "the difference is the meaning it can read".

**On screen.** Genie asks back · Approved for stacking, or all microcredentials? · Approved for stacking. · Genie 132 · the definition it used · one away: holds 3 approved microcredentials; four complete a graduate certificate · how often the answer is right · illustrative · not to scale · the difference is the meaning it can read

### 9 · Pull back · 4:39–5:00

**Narration.** The triangle from the start of the series returns: the word, in English and in Spanish; the idea, now written in the ontology; and the data it points to. Next: keeping all of it true, while everything changes.

**Picture.** The dashed triangle from *What's in a word* (word, idea, thing) fills in: the word *credential*, with *credencial* under it, "the word, in the glossary"; the idea as a violet node, with Award and Microcredential as its kinds; the data as a small table of credentials. "Next: keeping it true." The end card.

**On screen.** from What's in a word · credential · credencial · the word, in the glossary · Credential · now written in the ontology · the data it points to · Next: keeping it true · *An assistant answers from the meaning it can read.*

## Pause and think

The film stops at the end of five chapters (`site/assets/meaning-machines-can-read/think.en.js`):

1. **They tried before.** Wilkins tried to classify everything; the list of causes of death was made so that hospitals and countries could compare. Why did the list last? *It was made for one purpose, and shared by the people who needed to compare.*
2. **Genie guesses.** Genie found the right tables and still gave the wrong number. What was missing? *The stacking rule, in a form it could read.*
3. **Four ways to write meaning down.** Where does "a graduate certificate accepts up to four approved microcredentials" belong? *In the ontology.*
4. **Ontology or model?** Asked whether Aisha holds a fourth microcredential, the tables say no, and the ontology says it can't tell. Which is right? *Both, each for its own job: the tables read what isn't recorded as not true, which is right for the records the university keeps; the ontology treats what isn't stated as unknown.*
5. **Standards.** Three official definitions of microcredential don't quite match. What do you do? *Choose one deliberately, map the others to it, and record the differences.*

## Rigour sheet

| Chapter | What the film says | What an expert would add, or what it simplifies |
|---|---|---|
| They tried before | Linnaeus, in the 1750s, gave each species a two-part name and a place in a hierarchy; scientists still use his system. | *Species Plantarum* (1753) for plants and the 10th edition of *Systema Naturae* (1758) for animals. The robin was named *Motacilla rubecula* in 1758; Cuvier's genus *Erithacus* (1800) gives today's name, as the note on screen says. The tree shows today's placement with Linnaeus's ranks (kingdom, class, order, genus, species); family and other ranks came later. |
| They tried before | Wilkins, "nearly a century earlier" (1668), designed a language to classify everything; it never took hold. | About 85 to 90 years earlier. The *Essay* sorts things into 40 genera, then differences, then species (about 251 and 2,030 in most counts); the slips show all 40, shortened (his "Oeconomical" relation, of household and family, is "household relation"). It influenced later thesauri (Roget cites it). |
| They tried before | Nightingale, 1860, asked hospitals to record the same things the same way. | Her model hospital statistical forms were endorsed by the International Statistical Congress in London in 1860; only some London and Paris hospitals used them. At that congress she urged the adoption of Farr's classification of diseases (prepared with d'Espine for the congresses of 1853 and 1855) for hospital statistics, which WHO's history of the ICD counts in its lineage: hence the "Nightingale → ICD" card. The columns and numbers on screen are illustrative. |
| They tried before | An international list of causes of death followed in 1893; today it's the ICD. | Bertillon's classification, adopted by the International Statistical Institute in Chicago in 1893; WHO took over with the sixth revision in 1948, which added diseases, not only deaths. ICD-11 came into effect in 2022; the codes shown are ICD-11 MMS. Many countries still report with ICD-10. The listed early causes are typical of the 1893 lists, without their numbers. |
| Genie guesses | Genie finds the tables and columns, but not the rule in a PDF, and guesses 214 against 132; meaning kept only in documents is out of its reach. | The university, the policy, the numbers and the columns are fictional. In this fictional policy, each approved microcredential is worth 10 credits, so four approved microcredentials complete a certificate's 40 (rule 4.1 on screen), and three make a learner "one away"; rule 4.2 caps how many count. Assistants can be given documents (retrieval over documents is common), but this Genie isn't given the PDF, and a rule buried in prose is not something a query can check or count by. |
| Four ways | Glossary, taxonomy, ontology and semantic layer stack; each answers a different question. | The boundaries blur in practice: a thesaurus (SKOS) sits between glossary and taxonomy; an ontology usually contains a taxonomy of classes; some semantic layers carry relationships. The four jobs are what matter. |
| The ontology | Rules are written as statements; data connected to them becomes a knowledge graph. | Real ontologies are written in RDF and OWL (or a vendor's language); "accepts up to four approved" would be a cardinality restriction plus a condition, often checked with SHACL rather than inferred with OWL. The formal lines on screen are simplified, not a real syntax; the limit sits on the certificate (it accepts at most four approved microcredentials), not on the microcredential. |
| Ontology or model? | Noor's data model draws the same things as the ontology; it plans the records the university keeps: each box becomes a table, each line a key. | A simplification of the steps from the conceptual model to the physical one: a many-to-many relationship becomes a table of its own (the sort lab says so), a kind can share its parent's table or get one, and a key is a column that points to another table's identifier. In this series the conceptual model is also the business's to read (*Older than the systems*); planning the records is its job, not its only reader. |
| Ontology or model? | The ontology says what things mean, for every system, so a machine can draw conclusions from it; "holds · concluded". | The panel shows the knowledge graph's schema from the chapter before. The conclusion is the simplest a reasoner draws: anything that is a microcredential is also a credential, so whoever holds one holds a credential. Ontology engineering aims at a shared agreement on meaning, independent of any one application, that machines can reason with; data modelling, at one application's records and their integrity (Spyns, Meersman and Jarrar, 2002). Many practitioners treat a conceptual model as a lightweight ontology: what differs is the job, how formal it is, and how a missing fact is read. |
| Ontology or model? | Asked whether Aisha holds a fourth microcredential, the tables say no (none is recorded); the ontology says it can't tell (one may come from elsewhere). | Databases answer under the closed-world assumption (Reiter, 1978): what isn't recorded is taken as false. OWL reasons under the open-world assumption (W3C, OWL 2 Primer): what isn't stated is unknown, unless the ontology closes it, for example with a cardinality. A SPARQL query over a knowledge graph still returns only what's in it, and SHACL validates data as it is (closed); the open world is about what a reasoner may conclude. In the fiction, credit recognised from another provider could count towards the certificate. |
| Ontology or model? | Three cards: the glossary explains the word, the ontology defines the idea, the model plans the records; a thread joins them; the meaning's owner keeps the glossary and the ontology, Noor the model. | The links are real practice: a glossary term attached to the concept and the columns it describes (SKOS can publish the glossary), and a mapping from each table to the concept it records (W3C R2RML), which lets a knowledge graph read existing databases without copying them. Ownership follows *Keeping it true*: the owner of the meaning approves the glossary and the ontology, the architect the model. Ontologies are for people too, as a shared understanding; machines are what need their formality. |
| The semantic layer | A metric is defined once: measure, what's left out, which date, grain. Open formats are appearing. | Tools include dbt's semantic layer (MetricFlow), Databricks metric views, Snowflake semantic views, Cube and others. The Open Semantic Interchange (OSI) was announced in September 2025; its v1.0 specification was published on GitHub on 27 January 2026, and it entered the Apache Incubator as Apache Ossie on 10 July 2026. Maturity differs by tool: check on the day. |
| Standards | Finance, health, insurance, retail and education publish shared models; digital credentials have open standards with issuer, holder and evidence. | FIBO is an ontology; ISO 20022 and HL7 FHIR are message and exchange standards; SNOMED CT is a terminology; ICD a classification; GS1 identifiers; CEDS, HERM and TCSI education models. They sit at different layers. W3C Verifiable Credentials 2.0 became a Recommendation in May 2025; Open Badges 3.0 aligns with it; the European Learning Model underpins Europass digital credentials. In the VC model, the claims are about a subject, usually the holder; "holder" is a role (and a property of verifiable presentations), not a property of the credential, so the card's row reads "holder · subject". |
| Standards | Australia, the European Union and UNESCO define microcredential; they don't quite match. | Each definition has more parts than the three shown: Australia's National Microcredentials Framework (2021) sets at least one hour and less than an AQF award; the EU's Council Recommendation (2022) speaks of a small volume of learning, assessed against transparent criteria, owned by the learner and portable; UNESCO (2022) of a trusted provider and standalone value. All three require assessment. |
| Genie, again | Studies found that grounding an assistant in explicit meaning makes it measurably more accurate. | Sequeda, Allemang and Jacob (2023): GPT-4 answered 16.7% of enterprise questions correctly over the SQL schema alone and 54.2% over a knowledge graph of the same data. Later benchmarks on semantic layers point the same way. The bars on screen are illustrative, not to scale. Genie's asking back is shown as the ideal; real assistants ask back only when configured and prompted well. |
| Pull back | The triangle returns, with the word in two languages, in the glossary, the idea in the ontology, and the data. | Labels in several languages for one concept are what SKOS and OWL labels (with language tags) are for; a glossary can keep the word in each language too. |

## Sources

Checked 28 September 2026:

- The European robin: described by Linnaeus in 1758 as *Motacilla rubecula*; genus *Erithacus* by Cuvier in 1800 (Wikipedia, "European robin"; Birds of the World).
- Wilkins, *An Essay towards a Real Character, and a Philosophical Language* (1668): 40 genera, subdivided into differences and species (Wikipedia; Internet Archive facsimile).
- Nightingale's letter and forms endorsed by the International Statistical Congress, London, 1860, and her urging the adoption of Farr's classification for hospital statistics (plus.maths.org, "Florence Nightingale: the compassionate statistician"; WHO, "History of the development of the ICD"; Wikipedia).
- The Bertillon classification adopted by the International Statistical Institute in Chicago, 1893, and the history of the ICD (WHO, "History of the development of the ICD"; Wikipedia).
- ICD-11 MMS codes 1A00 Cholera, BA41 Acute myocardial infarction, CA40 Pneumonia, 2C25 Malignant neoplasms of bronchus or lung (ICD-11 MMS listings).
- Australia's National Microcredentials Framework, November 2021, and its definition (Department of Education, Australian Government).
- UNESCO (2022), *Towards a common definition of micro-credentials* (UNESCO-UNEVOC TVETipedia glossary).
- W3C Verifiable Credentials Data Model v2.0, a W3C Recommendation since 15 May 2025 (w3.org).
- Open Badges 3.0 aligned with the W3C Verifiable Credentials Data Model (1EdTech).
- The Open Semantic Interchange initiative, announced 23 September 2025 (Snowflake press release; dbt Labs blog); its v1.0 specification, published on GitHub on 27 January 2026, and its entry into the Apache Incubator as Apache Ossie on 10 July 2026 (ossie.apache.org; incubator.apache.org/clutch/ossie.html).
- Sequeda, Allemang and Jacob (2023), *A Benchmark to Understand the Role of Knowledge Graphs on Large Language Model's Accuracy for Question Answering on Enterprise SQL Databases*, arXiv 2311.07509.
- Databricks Genie: instructions, example SQL queries and trusted assets (docs.databricks.com).

Checked 16 October 2026, for *Ontology or model?*:

- Spyns, Meersman and Jarrar (2002), "Data modelling versus ontology engineering", *ACM SIGMOD Record* 31(4), 12–17: data models serve one application's records and their integrity; ontologies aim at a shared agreement on meaning, independent of any one application.
- Gruber (1993), "A translation approach to portable ontology specifications", *Knowledge Acquisition* 5(2), 199–220: an ontology as an explicit specification of a conceptualization.
- Reiter (1978), "On closed world data bases", in Gallaire and Minker (eds), *Logic and Data Bases*, Plenum Press (presented at the Toulouse workshop in 1977; the page range differs between listings): the closed-world assumption.
- W3C, *OWL 2 Web Ontology Language Primer (Second Edition)*, a W3C Recommendation since 11 December 2012: OWL's open-world assumption.
- W3C, *SKOS Simple Knowledge Organization System Reference*, a W3C Recommendation since 18 August 2009.
- W3C, *R2RML: RDB to RDF Mapping Language*, a W3C Recommendation since 27 September 2012.
- W3C, *Shapes Constraint Language (SHACL)*, a W3C Recommendation since 20 July 2017.

To check:

- The exact wording of the Council of the European Union's Recommendation of 16 June 2022 (checked here only through secondary sources that quote the European Commission's wording).
- The current names and maturity of Databricks metric views, Snowflake semantic views, dbt's semantic layer and Genie (Databricks' current documentation also speaks of Genie Agents).
- The European Learning Model's current version and its use in Europass digital credentials.
- The descriptions on the binders (FIBO, ISO 20022, HL7 FHIR, SNOMED CT, ACORD, GS1, CEDS, HERM, TCSI).

## Pacing report

```
chapter      duration   wpm  voice  longest quiet  notes
before          49.8s   114    76%           6.0s  
guesses         32.0s   133    79%           2.1s  
four            34.3s   117    72%           4.8s  
ontology        34.0s   125    81%           2.2s  
model           47.0s   124    80%           2.3s  
semantic        23.5s   123    77%           1.8s  
standards       34.3s   121    80%           1.8s  
again           23.9s   126    77%           1.8s  
end             21.7s   105    60%           6.0s  

total 5:00.4, 606 words, 121 wpm, voice 77% of the time, 158 wpm while speaking
sentences with under 0.5 s after them: 0; stops of 2.5 s or more inside chapters: 0
```
