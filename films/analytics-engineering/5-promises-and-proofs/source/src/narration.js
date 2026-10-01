// In the weeds of data crafting · Promises and proofs. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"assay":{"name":"Tested before it's marked","lead":1.4,"tail":1.0,"vo":[
 {"id":"law","gap":0.8,"text":"In 1300, an English law set a standard for silver: sterling.","say":"In thirteen hundred, an English law set a standard for silver: sterling."},
 {"id":"test","gap":0.8,"text":"No piece could leave the workshop until it was tested, and marked with a leopard's head."},
 {"id":"hall","gap":0.8,"text":"From 1478, the testing was done at Goldsmiths' Hall, in London: the hall in hallmark.","say":"From fourteen seventy-eight, the testing was done at Goldsmiths' Hall, in London: the hall in hallmark."},
 {"id":"buyer","gap":0.8,"text":"Buyers still trust the mark, without testing the silver themselves."},
 {"id":"bridge","gap":0.8,"text":"A core model makes the same promise. Its tests are the assay, and they come before the mark."}]},
"gaps":{"name":"The gap register","lead":1.0,"tail":1.0,"vo":[
 {"id":"step","gap":0.8,"text":"Step four: name the gaps."},
 {"id":"register","gap":0.8,"text":"Jun's gap register sets what the business expects beside what the sources hold, one line per gap."},
 {"id":"revoked","gap":0.8,"text":"The business expects a revoked credential to be known as revoked. The learning platform just deletes it."},
 {"id":"three","gap":0.8,"text":"Every gap gets one of three decisions. Fix it at the source. Write a rule in the model. Or accept it, and write it down."},
 {"id":"both","gap":0.8,"text":"This one gets two. A badge that disappears is revoked from that day. And the platform is asked for a proper flag."},
 {"id":"jordan","gap":0.8,"text":"Jordan's microcredential vanished on the twelfth of August. From that day, it reads as revoked."},
 {"id":"ten","gap":0.8,"text":"Ten gaps, ten decisions. Mei approves the ones about meaning.","say":"Ten gaps, ten decisions. May approves the ones about meaning."}]},
"enterprise":{"name":"The enterprise contract","lead":1.0,"tail":1.0,"vo":[
 {"id":"contracts","gap":0.8,"text":"Then the contracts. The core is what everything else builds on, so it makes the strongest promise."},
 {"id":"folder","gap":0.8,"text":"The whole core folder gets two settings. Public: other projects may build on it. And a contract, enforced."},
 {"id":"columns","gap":0.8,"text":"The credential's YAML lists every column, its type, and what can't be empty. Its grain: one row per credential.","say":"The credential's yammel lists every column, its type, and what can't be empty. Its grain: one row per credential."},
 {"id":"stops","gap":0.8,"text":"Change a column's type in the query, and the build stops before the table is made."},
 {"id":"noor","gap":0.8,"text":"The contract is checked at every build, not read once and forgotten. Noor approves it."}]},
"consumer":{"name":"Two consumer contracts","lead":1.0,"tail":1.0,"vo":[
 {"id":"own","gap":0.8,"text":"Each consumer gets a contract of its own, on the same core."},
 {"id":"grains","gap":0.8,"text":"Planning's: one row per learner per award, as at census date. The wallet's: one row per learner, as it is now."},
 {"id":"protected","gap":0.8,"text":"Both are enforced, and protected: only this project can build on them."},
 {"id":"exposure","gap":0.8,"text":"And each declares an exposure: the dashboard or the app that reads it, with an owner and an address."},
 {"id":"tell","gap":0.8,"text":"Change the credential in the core, and the lineage finds one exposure: the wallet app. That's who to tell."},
 {"id":"approve","gap":0.8,"text":"Planning and the wallet team each approve their own."}]},
"tests":{"name":"Tests first","lead":1.0,"tail":1.0,"vo":[
 {"id":"step","gap":0.8,"text":"Step five: the tests, before any model code. They say what done looks like."},
 {"id":"keys","gap":0.6,"text":"Every key, unique and never empty. Every relationship, pointing at something real."},
 {"id":"values","gap":0.8,"text":"Every status, from an agreed list: valid, expired or revoked. Every history, with versions that never overlap."},
 {"id":"trusted","gap":0.8,"text":"And one number people already trust: the census report's twelve learners."},
 {"id":"reconcile","gap":0.8,"text":"A test compares the model's count with the report, and fails on any faculty that differs."},
 {"id":"agent","gap":0.8,"text":"The agent drafts the tests from the contracts and the register. Jun reviews them.","say":"The agent drafts the tests from the contracts and the register. Joon reviews them."}]},
"unit":{"name":"Logic, tested alone","lead":1.0,"tail":1.0,"vo":[
 {"id":"alone","gap":0.8,"text":"Data tests check the tables. Some logic needs checking on its own, with a few rows made up for the purpose. That's a unit test."},
 {"id":"rows","gap":0.8,"text":"The credit rule, in two made-up rows. A unit counts from the tenth of January. A microcredential counts from the second of February, until it's revoked on the twelfth of August."},
 {"id":"expect","gap":0.8,"text":"Credit changes twice, so the answer is three versions: fifteen, twenty, then fifteen again."},
 {"id":"before","gap":0.8,"text":"The dates are Jordan's. The rule is proved before a single real row arrives."}]},
"levels":{"name":"Warn or stop","lead":1.0,"tail":1.0,"vo":[
 {"id":"not","gap":0.8,"text":"Not every failure should stop everything. A test can warn, or it can stop the build."},
 {"id":"walkin","gap":0.8,"text":"One short-course enrolment has no email: a walk-in, whose certificate can't reach anyone."},
 {"id":"agreed","gap":0.8,"text":"The learning team agreed: warn when there's any, stop when there are more than five. One or two a term are expected. More means something broke."},
 {"id":"today","gap":0.8,"text":"Today, the build warns once, and carries on."},
 {"id":"fresh","gap":0.8,"text":"Freshness works the same way: warn when a source is a day late, fail at three."},
 {"id":"owner","gap":0.8,"text":"Who sets the level? The data's owner, with the reason written down."}]},
"next":{"name":"Red, on purpose","lead":1.0,"tail":1.0,"vo":[
 {"id":"count","gap":0.8,"text":"111 data tests. Four unit tests. Every promise written down, with its proof beside it.","say":"A hundred and eleven data tests. Four unit tests. Every promise written down, with its proof beside it."},
 {"id":"red","gap":0.8,"text":"Run them now, and they fail: there are no models yet. That's on purpose."},
 {"id":"green","gap":0.8,"text":"Next, the least code that turns them green, in the right place."}]}
};
