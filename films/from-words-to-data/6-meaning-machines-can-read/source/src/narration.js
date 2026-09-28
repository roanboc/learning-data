// From words to data · Meaning machines can read. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"before":{"name":"They tried before","lead":1.6,"tail":1.0,"vo":[
 {"id":"linn","gap":0.8,"text":"In the 1750s, Linnaeus gave each species a two-part name, and a place in a hierarchy. Scientists still use his system.","say":"In the seventeen fifties, Linnaeus gave each species a two-part name, and a place in a hierarchy. Scientists still use his system."},
 {"id":"wilkins","gap":0.8,"text":"Nearly a century earlier, John Wilkins designed a language to classify everything in the universe. It never took hold."},
 {"id":"night","gap":0.8,"text":"In 1860, Florence Nightingale asked hospitals to record the same things, in the same way, so that they could be compared.","say":"In eighteen sixty, Florence Nightingale asked hospitals to record the same things, in the same way, so that they could be compared."},
 {"id":"icd","gap":0.8,"text":"An international list of causes of death followed in 1893. Today, it's the International Classification of Diseases.","say":"An international list of causes of death followed in eighteen ninety-three. Today, it's the International Classification of Diseases."},
 {"id":"lesson","gap":0.8,"text":"Shared definitions let strangers compare. The ones that last are made for a purpose, not for everything."}]},
"guesses":{"name":"Genie guesses","lead":1.0,"tail":1.0,"vo":[
 {"id":"ask","gap":0.8,"text":"At the university, the Head of School asks Genie: which learners are one microcredential away from a graduate certificate?"},
 {"id":"finds","gap":0.8,"text":"Genie finds the tables. It finds a column called is_micro, and another called stack_ok.","say":"Genie finds the tables. It finds a column called is micro, and another called stack okay."},
 {"id":"wrong","gap":0.8,"text":"But the stacking rules live in a policy document that no tool can read. Genie guesses, and it's wrong."},
 {"id":"read","gap":0.8,"text":"An AI assistant answers from what it can read. Meaning kept only in documents is out of its reach."}]},
"four":{"name":"Four ways to write meaning down","lead":1.0,"tail":1.0,"vo":[
 {"id":"gloss","gap":0.8,"text":"There are four common ways to write meaning down, and they stack. A glossary: words and their definitions, for people."},
 {"id":"tax","gap":0.8,"text":"A taxonomy: kinds of things in a hierarchy, like Linnaeus's."},
 {"id":"onto","gap":0.8,"text":"An ontology: concepts, the relationships between them, and rules that a machine can check and reason with."},
 {"id":"sem","gap":0.8,"text":"And a semantic layer: how each number is calculated, defined once."},
 {"id":"stack","gap":0.8,"text":"They aren't rivals. Each one answers a different question."}]},
"ontology":{"name":"The ontology","lead":1.0,"tail":1.0,"vo":[
 {"id":"rules","gap":0.8,"text":"In the ontology, the rules are written as statements. A microcredential is a kind of credential. A graduate certificate accepts up to four approved microcredentials towards its credit."},
 {"id":"graph","gap":0.8,"text":"Connect the university's data to these statements, and it becomes a knowledge graph: learners, credentials and courses, linked by what they mean."},
 {"id":"aristotle","gap":0.8,"text":"It's Aristotle's recipe made formal: the kind of thing, and what sets it apart, in a form a machine can use."}]},
"semantic":{"name":"The semantic layer","lead":1.0,"tail":1.0,"vo":[
 {"id":"once","gap":0.8,"text":"In the semantic layer, credentials awarded this year is defined once: what's counted, what's left out, which date, and at what grain."},
 {"id":"tools","gap":0.8,"text":"Dashboards, spreadsheets and Genie all ask it, instead of each writing its own version."},
 {"id":"open","gap":0.8,"text":"Open formats for sharing these definitions between tools are starting to appear."}]},
"standards":{"name":"Standards","lead":1.0,"tail":1.0,"vo":[
 {"id":"blank","gap":0.8,"text":"You don't have to start from a blank page. Finance, health, insurance and retail all publish shared models, and so does education."},
 {"id":"creds","gap":0.8,"text":"Digital credentials have open standards too, with issuer, holder and evidence in them."},
 {"id":"three","gap":0.8,"text":"Even microcredential has official definitions: from Australia, from the European Union, and from UNESCO. They don't quite match."},
 {"id":"choose","gap":0.8,"text":"So choose deliberately. Check, adopt, extend and record, as in A Sharper Sketch, at every layer."}]},
"again":{"name":"Genie, again","lead":1.0,"tail":1.0,"vo":[
 {"id":"asks","gap":0.8,"text":"The Head of School asks again. This time, Genie asks back: approved for stacking, or all microcredentials?"},
 {"id":"answer","gap":0.8,"text":"Then it answers, and shows the definition it used."},
 {"id":"evid","gap":0.8,"text":"Studies have found that grounding an assistant in explicit meaning makes its answers measurably more accurate. The difference is the meaning it can read."}]},
"end":{"name":"Pull back","lead":1.0,"tail":1.0,"vo":[
 {"id":"tri","gap":0.8,"text":"The triangle from the start of the series returns: the word, in English and in Spanish; the idea, now written in the ontology; and the data it points to."},
 {"id":"next","gap":0.8,"text":"Next: keeping all of it true, while everything changes."}]}
};
