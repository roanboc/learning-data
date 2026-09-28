// From words to data · Built to write, built to read. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"ledger":{"name":"Journal and ledger","lead":1.6,"tail":1.0,"vo":[
 {"id":"venice","gap":0.8,"text":"In 1494, Luca Pacioli set down how Venetian merchants kept their books.","say":"In fourteen ninety-four, Luca Pacioli set down how Venetian merchants kept their books."},
 {"id":"journal","gap":0.8,"text":"Every transaction went first into the journal, as it happened, one after another."},
 {"id":"post","gap":0.8,"text":"Then each entry was posted to the ledger, grouped by account, where it could be read, and balanced."},
 {"id":"two","gap":0.8,"text":"One set of facts, kept in two shapes: one for writing, and one for reading. And if the two sides didn't balance, something was wrong."},
 {"id":"today","gap":0.8,"text":"Five centuries later, the university has the same two jobs. On graduation day, thousands of awards are issued, each one complete and right. On planning day, someone reads ten years of them at once."}]},
"write":{"name":"Built to write","lead":1.0,"tail":1.0,"vo":[
 {"id":"once","gap":0.8,"text":"A shape built to write keeps each fact in one place. The learner's name is stored once, not on every award."},
 {"id":"keys","gap":0.8,"text":"Every row has a key that identifies it, and rules the data must meet: every award belongs to a learner who exists."},
 {"id":"all","gap":0.8,"text":"And issuing an award touches three things at once: the award, the learner's record, and the transcript. All three change, or none of them do. Half an award is never saved."},
 {"id":"name","gap":0.8,"text":"This is normalisation, with keys, constraints and transactions."}]},
"wrong":{"name":"What goes wrong without it","lead":1.0,"tail":1.0,"vo":[
 {"id":"three","gap":0.8,"text":"Store the learner's name on every award instead, and it lives in three places."},
 {"id":"change","gap":0.8,"text":"She changes her name. Two copies are corrected. One is missed."},
 {"id":"print","gap":0.8,"text":"Her next certificate prints the old name."},
 {"id":"delete","gap":0.8,"text":"And if the only place a course is described is on its awards, deleting the last award deletes the course."},
 {"id":"anomaly","gap":0.8,"text":"These are called update and delete anomalies. Keeping each fact once is how a shape built to write avoids them."}]},
"docs":{"name":"Another way to write","lead":1.0,"tail":1.0,"vo":[
 {"id":"doc","gap":0.8,"text":"Some systems write a whole thing at once, as one document: a digital credential, with its claim and its evidence inside, signed as a single piece."},
 {"id":"together","gap":0.8,"text":"Keep together what's written, and signed, together."},
 {"id":"shine","gap":0.8,"text":"Document databases are built for this. They shine when a whole thing is written, and read, at once."},
 {"id":"trade","gap":0.8,"text":"One document is easy to write and easy to check. Counting across a million of them is harder."}]},
"read":{"name":"Built to read","lead":1.0,"tail":1.0,"vo":[
 {"id":"q","gap":0.8,"text":"Planning day. How many awards, by faculty and by year, for the last ten years?"},
 {"id":"grain","gap":0.8,"text":"A shape built to read starts with the grain: one row per credential awarded."},
 {"id":"facts","gap":0.8,"text":"The numbers to add up sit in the middle: the award itself, and its credit points."},
 {"id":"dims","gap":0.8,"text":"Around them sits everything you'd filter or group by: the learner, the kind of credential, the faculty, the date."},
 {"id":"words","gap":0.8,"text":"A simple test: the facts are what you add up; the dimensions are the words after by, in the question."},
 {"id":"star","gap":0.8,"text":"It's called a star. Reading it takes two steps, not seven."}]},
"history":{"name":"Keeping history for reading","lead":1.0,"tail":1.0,"vo":[
 {"id":"moved","gap":0.8,"text":"A learner moved faculty in the middle of the year. Do her awards count for the old faculty, or the new?"},
 {"id":"both","gap":0.8,"text":"Keep both, each with the dates it was true. Awards before the move count for the old faculty, and after it, for the new."},
 {"id":"revoked","gap":0.8,"text":"An award that's revoked and reissued keeps its history too. Nothing is overwritten. Each change has a date."},
 {"id":"choice","gap":0.8,"text":"Not every change needs history. Correcting a typo can simply overwrite. A move between faculties can't. Decide for each attribute, and write it down."},
 {"id":"scd","gap":0.8,"text":"Engineers call this a slowly changing dimension."}]},
"side":{"name":"Side by side","lead":1.0,"tail":1.0,"vo":[
 {"id":"q","gap":0.8,"text":"Now ask both shapes the same question."},
 {"id":"write","gap":0.8,"text":"The shape built to write needs seven joins, and a puzzle about history."},
 {"id":"read","gap":0.8,"text":"The shape built to read answers in two."},
 {"id":"name","gap":0.8,"text":"Then correct a name. Easy where it's stored once. Awkward in a shape that repeats it on purpose."},
 {"id":"job","gap":0.8,"text":"Each shape is fast at its own job."}]},
"end":{"name":"Pull back","lead":1.0,"tail":1.0,"vo":[
 {"id":"one","gap":0.8,"text":"One sketch. Two shapes, both built from the same logical model."},
 {"id":"medal","gap":0.8,"text":"And a common confusion, cleared up: bronze, silver and gold say how refined data is, not what shape it has."},
 {"id":"often","gap":0.8,"text":"Many platforms keep a normalised shape in silver, close to the sources, and stars in gold. That's a choice, not a rule."},
 {"id":"next","gap":0.8,"text":"Any layer can hold either shape. The next question is which shapes to use for reading. There are several."}]}
};
