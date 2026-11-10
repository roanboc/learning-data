// From words to data · Keeping it true. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"dict":{"name":"A dictionary is never finished","lead":1.6,"tail":1.0,"vo":[
 {"id":"johnson","gap":0.8,"text":"In 1755, Samuel Johnson published his dictionary. He had hoped to fix the English language in place.","say":"In seventeen fifty-five, Samuel Johnson published his dictionary. He had hoped to fix the English language in place."},
 {"id":"admit","gap":0.8,"text":"In its preface, he admitted that no dictionary can embalm a language. The Oxford English Dictionary is still being revised today."},
 {"id":"planet","gap":0.8,"text":"In 2006, astronomers agreed a definition of planet. Nothing in the sky changed, and the count went from nine to eight.","say":"In two thousand and six, astronomers agreed a definition of planet. Nothing in the sky changed, and the count went from nine to eight."},
 {"id":"kilo","gap":0.8,"text":"In 2019, even the kilogram got a new definition.","say":"In twenty nineteen, even the kilogram got a new definition."},
 {"id":"moves","gap":0.8,"text":"Meaning moves. Every definition needs an owner, a date and a version."}]},
"arrives":{"name":"Change arrives","lead":1.0,"tail":1.0,"vo":[
 {"id":"month","gap":0.8,"text":"At the university, three changes arrive in one month."},
 {"id":"gov","gap":0.8,"text":"The government adds a new field to what universities report about microcredentials."},
 {"id":"error","gap":0.8,"text":"A credential was issued in error, and has to be revoked."},
 {"id":"rate","gap":0.8,"text":"And a new measure, completion rate, appears in three dashboards, with three different definitions."}]},
"stale":{"name":"How models go stale","lead":1.0,"tail":1.0,"vo":[
 {"id":"drift","gap":0.8,"text":"Models rarely break all at once. They drift."},
 {"id":"kinds","gap":0.8,"text":"A value nobody announced, as in Silent change. A column whose meaning slowly shifts. One measure, defined twice. A standard, updated for a new year."},
 {"id":"gap","gap":0.8,"text":"Drift is the gap between what's written down and what's actually used."}]},
"watch":{"name":"AI as a watcher","lead":1.0,"tail":1.0,"vo":[
 {"id":"reads","gap":0.8,"text":"This is where AI helps first. An agent can read the catalog, the lineage, the queries people run, and new data as it arrives."},
 {"id":"compare","gap":0.8,"text":"It compares each definition in the glossary with the code that calculates it, and spots where the two have parted."},
 {"id":"flags","gap":0.8,"text":"It flags each drift, with evidence: three definitions of completion rate, and the dashboards that use each one."},
 {"id":"notice","gap":0.8,"text":"Noticing is tedious for people, and cheap for machines."}]},
"draft":{"name":"AI as a drafter","lead":1.0,"tail":1.0,"vo":[
 {"id":"drafts","gap":0.8,"text":"Then it drafts the change."},
 {"id":"list","gap":0.8,"text":"A new entry for the glossary. A new statement in the ontology. The logical model, the mapping to the government's field, the semantic layer, the contract, the tests, and a note saying why."},
 {"id":"cheap","gap":0.8,"text":"Drafting is cheap now. Judging the draft is still the job."}]},
"decide":{"name":"People decide","lead":1.0,"tail":1.0,"vo":[
 {"id":"who","gap":0.8,"text":"Mei, from the registrar's office, approves the meaning. Noor, the architect, approves the model. The teams approve the build."},
 {"id":"review","gap":0.8,"text":"The agent's draft goes through the same review as anyone's. The tests run on the proposed change, before anything ships."},
 {"id":"rule","gap":0.8,"text":"The agent recommends. People approve. Everything is versioned."}]},
"wrong":{"name":"What can go wrong","lead":1.0,"tail":1.0,"vo":[
 {"id":"invent","gap":0.8,"text":"A confident draft can invent a definition that nobody agreed."},
 {"id":"slip","gap":0.8,"text":"A change can slip through that nobody reviewed. And an agent that learns from old reports can propose an old meaning back."},
 {"id":"check","gap":0.8,"text":"So the tests and the contracts check the agent's work too, just as they check ours."}]},
"e2e":{"name":"End to end","lead":1.0,"tail":1.0,"vo":[
 {"id":"follow","gap":0.8,"text":"Follow one change all the way through."},
 {"id":"chain","gap":0.8,"text":"Completion rate gets one definition in the glossary, one statement in the ontology, one measure in the semantic layer, and one test."},
 {"id":"agree","gap":0.8,"text":"The three dashboards agree. Genie gives the same number, and shows why."},
 {"id":"old","gap":0.8,"text":"Last year's report still reads with last year's definition, version two, unchanged. Each number keeps the meaning it had."},
 {"id":"v3","gap":0.8,"text":"And the sketch's stamp finally reads: version three."}]},
"remains":{"name":"What remains","lead":1.0,"tail":1.6,"vo":[
 {"id":"shapes","gap":0.8,"text":"New ways to shape data keep arriving: data vaults, anchors, hooks, bridges, activity streams. More will come."},
 {"id":"same","gap":0.9,"text":"Look inside any of them, and you find the same four answers."},
 {"id":"four","gap":0.9,"text":"What a credential is. What makes it the same one everywhere. What one row holds. And when each thing was true."},
 {"id":"change","gap":0.9,"text":"What changes is the shape. Engines change, and an agent can draft a vault or a star from the model in minutes."},
 {"id":"alike","gap":0.9,"text":"A search can find two credentials that look alike. Only the model can say whether they're the same one."},
 {"id":"last","gap":0.8,"text":"Learn the part that lasts: meaning, identity, grain and time. Every new shape is another way to write them down."}]},
"end":{"name":"Pull back","lead":1.0,"tail":1.0,"vo":[
 {"id":"start","gap":0.8,"text":"Back to the start of the series: a word, an idea, a thing, and a mark in clay."},
 {"id":"claim","gap":0.8,"text":"A credential is a claim that others can check. So is every number in a report."},
 {"id":"job","gap":0.8,"text":"The tools have changed. The job hasn't: agree what things are, write it down, and keep it true."}]}
};
