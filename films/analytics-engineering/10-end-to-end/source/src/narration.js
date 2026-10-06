// In the weeds of data crafting · End to end. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"floor":{"name":"The tracing floor","lead":1.4,"tail":1.0,"vo":[
 {"id":"drew","gap":0.8,"text":"In the fourteenth century, the masons building York Minster drew their windows full size, on a floor of plaster."},
 {"id":"templates","gap":0.8,"text":"From each drawing they cut a wooden template, and carved the stone to match it."},
 {"id":"over","gap":0.8,"text":"When a window was done, the next was drawn over it. In time, the floor was plastered again."},
 {"id":"stayed","gap":0.8,"text":"The drawings were for the work. The windows are what stayed."},
 {"id":"bridge","gap":0.8,"text":"A project has both: files for the work, deleted when it's done, and files that stay. This is one new question, from start to end."}]},
"question":{"name":"A new question","lead":1.0,"tail":1.0,"vo":[
 {"id":"arrives","gap":0.8,"text":"A new consumer arrives: Finance."},
 {"id":"asks","gap":0.8,"text":"How much tuition does recognised credit save learners, by faculty, as at census date?"},
 {"id":"decides","gap":0.8,"text":"The answer sets next year's revenue forecast, and what a microcredential should cost."},
 {"id":"kind","gap":0.8,"text":"Finance is a business domain: it decides with the data. So it gets folders of its own, named for it, from the first commit."},
 {"id":"files","gap":0.8,"text":"Step one is the scope. Its conceptual model holds the question; its decision log, the first decision: recognised credit only, read from the public core."},
 {"id":"open","gap":0.8,"text":"And one file that won't last: Finance's open requirements. The first says what done looks like: match Finance's own number."},
 {"id":"backlog","gap":0.8,"text":"Who does the work, and when, lives in the team's backlog tool. The project keeps only what's still open."}]},
"sources":{"name":"What the core holds","lead":1.0,"tail":1.0,"vo":[
 {"id":"profile","gap":0.8,"text":"Step two: what the data really holds. Finance reads the core, not the sources, so the agent profiles the core."},
 {"id":"across","gap":0.8,"text":"Recognised credit counts towards every award it could count towards. Aisha's counts towards three."},
 {"id":"numbers","gap":0.8,"text":"Added up across awards, that's 385 credit points. In the award each learner is enrolled in, 160.","say":"Added up across awards, that's three hundred and eighty-five credit points. In the award each learner is enrolled in, a hundred and sixty."},
 {"id":"which","gap":0.8,"text":"Which one saves the tuition? No rule can say. A question opens, with the query as evidence, and Finance owns the answer."},
 {"id":"rates","gap":0.8,"text":"Finance brings one thing of its own: the tuition rates it publishes, as reference data it owns."}]},
"output":{"name":"One row of what","lead":1.0,"tail":1.0,"vo":[
 {"id":"answer","gap":0.8,"text":"Step three: the output. First, Finance answers: only the award the learner is enrolled in, on census day."},
 {"id":"moves","gap":0.8,"text":"The answer goes where it lasts: a rule in Finance's conceptual model, and a decision in its log."},
 {"id":"deleted","gap":0.8,"text":"And the question is deleted. Git keeps it, and the decision says where it came from."},
 {"id":"grain","gap":0.8,"text":"Then the output, before any code: one row per learner per award they're enrolled in, as at census date."},
 {"id":"until","gap":0.8,"text":"That's a requirement too, open until a contract enforces it."}]},
"promise":{"name":"The promise","lead":1.0,"tail":1.0,"vo":[
 {"id":"contract","gap":0.8,"text":"Step four: the promise. Finance's mart gets a contract: the columns and types the forecast needs, enforced."},
 {"id":"empty","gap":0.8,"text":"For now it's an empty table, the right shape with no rows, and the forecast is declared as what depends on it."},
 {"id":"gap","gap":0.8,"text":"One gap: the project knows the published rate, not what each learner was charged. Scholarships and discounts aren't in."},
 {"id":"accept","gap":0.8,"text":"Finance accepts it. It becomes a known limitation, on the mart, with a decision that says why."}]},
"tests":{"name":"Tests first","lead":1.0,"tail":1.0,"vo":[
 {"id":"first","gap":0.8,"text":"Step five: the tests, before the logic."},
 {"id":"grain","gap":0.8,"text":"The grain, tested as a key. Learners that exist. Only the award types Finance prices."},
 {"id":"unit","gap":0.8,"text":"A unit test for the rule: credit that counts towards two awards still saves tuition once."},
 {"id":"report","gap":0.8,"text":"And Finance's own number, from its spreadsheet, as an expected seed that no model may read. A reconciliation compares the two."},
 {"id":"fail","gap":0.8,"text":"Nothing can pass yet. The unit test fails, so dbt doesn't even build the mart."},
 {"id":"done","gap":0.8,"text":"But the grain is tested and the contract enforced, so the output requirement is done, and deleted."}]},
"build":{"name":"The build","lead":1.0,"tail":1.0,"vo":[
 {"id":"logic","gap":0.8,"text":"Step six: the logic."},
 {"id":"reads","gap":0.8,"text":"It reads the core as it was on census day, keeps the award each learner was enrolled in, and prices the credit at that year's rate."},
 {"id":"only","gap":0.8,"text":"It reads nothing but the public core and Finance's own rates. No other team's model changes."},
 {"id":"short","gap":0.8,"text":"It's short, because the core already did the hard parts: identity, timelines, and the credit itself."},
 {"id":"green","gap":0.8,"text":"Every test passes: 67,800 dollars, across four faculties.","say":"Every test passes: sixty-seven thousand, eight hundred dollars, across four faculties."}]},
"validate":{"name":"Nothing else moved","lead":1.0,"tail":1.0,"vo":[
 {"id":"reconcile","gap":0.8,"text":"Step seven: validate. Faculty by faculty, against Finance's report. The difference is zero."},
 {"id":"diff","gap":0.8,"text":"Then the diff against main, built from scratch: every core table, Planning's mart, the wallet's."},
 {"id":"nothing","gap":0.8,"text":"No key added, none lost, no column changed. A new consumer moved nobody else's numbers."},
 {"id":"signoff","gap":0.8,"text":"Finance signs off, with every row in front of it."}]},
"ship":{"name":"Review and ship","lead":1.0,"tail":1.0,"vo":[
 {"id":"pr","gap":0.8,"text":"Step eight: review and ship."},
 {"id":"last","gap":0.8,"text":"The last open item, match Finance's number, is done: the reconciliation enforces it on every build."},
 {"id":"gone","gap":0.8,"text":"So the item is deleted, and with it Finance's requirements file, and its folder."},
 {"id":"check","gap":0.8,"text":"A check in CI makes sure of it: nothing stays in requirements unless it's still open."},
 {"id":"approve","gap":0.8,"text":"Jun approves the code, and Finance its number. The agent never merges."}]},
"once":{"name":"Written once","lead":1.0,"tail":1.0,"vo":[
 {"id":"review","gap":0.8,"text":"Step nine: the agent reviews the metadata."},
 {"id":"two","gap":0.8,"text":"Two descriptions were written twice, word for word: the award's code and its name, in Finance's YAML and in Planning's."},
 {"id":"home","gap":0.8,"text":"The award belongs to the course domain, so each becomes one doc block there, shown everywhere it's needed."},
 {"id":"zero","gap":0.8,"text":"Zero descriptions written twice. The generated pages, the definitions, the diagram and the index of decisions, keep up on their own."}]},
"evolve":{"name":"Ready to move","lead":1.0,"tail":1.0,"vo":[
 {"id":"pin","gap":0.8,"text":"Step ten: operate and evolve. Finance pins the versions of the core it reads."},
 {"id":"choice","gap":0.8,"text":"A new version reaches Finance as a choice with a date, and the lineage names Finance among who to tell."},
 {"id":"move","gap":0.8,"text":"And because every Finance file lives under a path named for it, Finance can move out to a project of its own, whole."},
 {"id":"list","gap":0.8,"text":"Its marts, its exposure, its seeds and its decisions. Nothing else needs untangling."}]},
"building":{"name":"The whole building","lead":1.0,"tail":1.0,"vo":[
 {"id":"ten","gap":0.8,"text":"Ten steps, ten commits. You can replay them one by one, in the repository."},
 {"id":"stay","gap":0.8,"text":"Some files arrived to stay: the question, the decisions, the contract, the tests, the model."},
 {"id":"work","gap":0.8,"text":"Some were for the work: three open items, and the file that held them. They're gone. The project says only what's still open."},
 {"id":"homes","gap":0.8,"text":"Every file has a home. Sources by system: application domains. The core by meaning: data domains. Marts and exposures by who decides: business domains."},
 {"id":"lives","gap":0.8,"text":"And every file has a lifetime: written by hand, generated, or kept only while the work goes on."},
 {"id":"next","gap":0.8,"text":"The next question will start the same way: in folders of its own, with one file that won't last."},
 {"id":"series","gap":0.8,"text":"That's the series. A question and its meaning, the sources, the consumers, promises and proofs, layers, the trusted number, an agent on the team, written once, and change."},
 {"id":"blueprint","gap":0.8,"text":"The model is the blueprint. dbt is how you build it."},
 {"id":"declare","gap":0.8,"text":"Declare it. Then build it."}]}
};
