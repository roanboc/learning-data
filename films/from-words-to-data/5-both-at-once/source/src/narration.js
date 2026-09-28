// From words to data · Both at once. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"till":{"name":"The till that kept the total","lead":1.6,"tail":1.0,"vo":[
 {"id":"ritty","gap":0.8,"text":"In 1879, a saloon keeper in Ohio patented a machine to keep track of every sale at his bar: the cash register.","say":"In eighteen seventy-nine, a saloon keeper in Ohio patented a machine to keep track of every sale at his bar: the cash register."},
 {"id":"total","gap":0.8,"text":"Within a few years, registers rang up each sale as it happened, and kept a running total, ready to read at closing time."},
 {"id":"wish","gap":0.8,"text":"Recording and counting in one place. It's an old wish."}]},
"distance":{"name":"The distance","lead":1.0,"tail":1.0,"vo":[
 {"id":"apart","gap":0.8,"text":"At the university, writing and reading still live apart."},
 {"id":"path","gap":0.8,"text":"The app writes to its own database. Overnight, a copy travels to the lakehouse and gets refined, and the answer is ready tomorrow."},
 {"id":"now","gap":0.8,"text":"But some questions can't wait. An employer wants to check a credential now. A learner's wallet wants to show, now, how close she is to a graduate certificate."},
 {"id":"appeal","gap":0.8,"text":"That distance is why hybrid databases appeal."}]},
"engines":{"name":"Two engines, one place","lead":1.0,"tail":1.0,"vo":[
 {"id":"one","gap":0.8,"text":"A hybrid database writes and reads in one place."},
 {"id":"two","gap":0.8,"text":"Some keep two copies inside: rows for writing, and columns for reading, kept in step by the database itself."},
 {"id":"lake","gap":0.8,"text":"Others put an operational database inside the lakehouse, with tables synced in both directions."},
 {"id":"htap","gap":0.8,"text":"The idea has a name: HTAP, hybrid transactional and analytical processing."}]},
"sync":{"name":"Keeping two shapes in step","lead":1.0,"tail":1.0,"vo":[
 {"id":"capture","gap":0.8,"text":"Keeping two shapes in step means capturing each change as it happens, and applying it on the other side, in the same order."},
 {"id":"keys","gap":0.8,"text":"That only works if every row has a stable key, so an update finds the row it changes, and a delete finds the row it removes."},
 {"id":"order","gap":0.8,"text":"Apply an award's revocation before its issue, and the award comes back to life. Order matters as much as content."}]},
"removes":{"name":"What it removes","lead":1.0,"tail":1.0,"vo":[
 {"id":"gone","gap":0.8,"text":"What goes? The nightly copy, the pipelines that move it, the wait, and a second set of permissions to keep in step."},
 {"id":"real","gap":0.8,"text":"Those are real gains."}]},
"doesnt":{"name":"What it doesn't","lead":1.0,"tail":1.0,"vo":[
 {"id":"direct","gap":0.8,"text":"Now count awards straight from the app's own tables."},
 {"id":"revoked","gap":0.8,"text":"Revoked awards are still in there, with a status. Last year's faculty has been overwritten. The count comes out wrong."},
 {"id":"same","gap":0.8,"text":"It's the same mistake as counting enrolments today, instead of on census date."},
 {"id":"model","gap":0.8,"text":"History, shared dimensions and definitions still need modelling. Hybrid removes the copy, not the model."}]},
"back":{"name":"Data flowing back","lead":1.0,"tail":1.0,"vo":[
 {"id":"serve","gap":0.8,"text":"Data flows the other way now, too. Gold data is served back to the app: the next microcredential to suggest, or a learner who may need help."},
 {"id":"features","gap":0.8,"text":"Features for machine learning travel the same way: calculated in gold, served in milliseconds."},
 {"id":"agents","gap":0.8,"text":"And AI agents need both shapes at once: they read what's known, and write down what they did."}]},
"questions":{"name":"New questions for the modeller","lead":1.0,"tail":1.0,"vo":[
 {"id":"truth","gap":0.8,"text":"So the modeller has new questions. For each idea, which shape is the source of truth?"},
 {"id":"sync","gap":0.8,"text":"Which way does each table sync, and who owns it?"},
 {"id":"fresh","gap":0.8,"text":"How fresh must each answer be? Seconds for a wallet. A day for a plan."},
 {"id":"defs","gap":0.8,"text":"Where do the definitions live, so the app and the report agree? In one place, not two."},
 {"id":"contract","gap":0.8,"text":"And the data contracts from Silent change now run in both directions."}]},
"end":{"name":"Pull back","lead":1.0,"tail":1.0,"vo":[
 {"id":"one","gap":0.8,"text":"One logical model. A shape for writing, and a shape for reading, on one platform, with a shorter distance between them."},
 {"id":"tag","gap":0.8,"text":"Hybrid removes the copy, not the model."},
 {"id":"next","gap":0.8,"text":"Next: making the meaning itself something a machine can read."}]}
};
