// From words to data · Older than the systems. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"materials":{"name":"Same idea, new materials","lead":1.6,"tail":1.0,"vo":[
 {"id":"clay","gap":0.8,"text":"Almost four thousand years ago, student scribes in Mesopotamia practised on clay. Some of their school tablets hold a teacher's model, with the student's copy beside it."},
 {"id":"guild","gap":0.8,"text":"In medieval Europe, an apprentice became a master by making a masterpiece: one piece of work, judged by the masters of the guild."},
 {"id":"exams","gap":0.8,"text":"In China, imperial examinations tested candidates for thirteen centuries, and the rank they earned opened the way to office."},
 {"id":"seal","gap":0.8,"text":"Medieval universities granted a licence to teach, under a wax seal. Then came the diploma, the transcript, the digital badge, and today, a credential signed with a digital key."},
 {"id":"idea","gap":0.8,"text":"The materials changed every few centuries. The idea didn't."}]},
"model":{"name":"The model underneath","lead":1.0,"tail":1.0,"vo":[
 {"id":"parts","gap":0.8,"text":"Look closely, and every one of them has the same parts."},
 {"id":"issuer","gap":0.8,"text":"Someone trusted issues it: a guild, the examiners, a university."},
 {"id":"holder","gap":0.8,"text":"It names a holder, and makes a claim about them: this person can do this."},
 {"id":"evidence","gap":0.8,"text":"It rests on evidence: a masterpiece, an examination, an assessment. And it has a date."},
 {"id":"verify","gap":0.8,"text":"Someone else can check it: by the seal, by the signature, or today, by the digital key. Some expire. A few are revoked."},
 {"id":"standard","gap":0.8,"text":"Today's standard for digital credentials uses almost the same words: issuer, holder, verifier, claims and evidence."},
 {"id":"outlast","gap":0.8,"text":"A conceptual model can outlast every material it was ever written on."}]},
"inside":{"name":"Every system has a model inside","lead":1.0,"tail":1.0,"vo":[
 {"id":"five","gap":0.8,"text":"At the university, credentials now live in five systems."},
 {"id":"list","gap":0.8,"text":"The student system holds awards. The learning platform, completions. Careers, badges. A digital wallet, the signed copies."},
 {"id":"bought","gap":0.8,"text":"And the new short-course platform, bought off the shelf, holds the microcredentials. It calls learners customers."},
 {"id":"adopt","gap":0.8,"text":"Buying a system means adopting its model, whether you look at it or not."},
 {"id":"vendors","gap":0.8,"text":"If you don't model your business, your vendors will do it for you."}]},
"meet":{"name":"Where meanings meet","lead":1.0,"tail":1.0,"vo":[
 {"id":"pairs","gap":0.8,"text":"Connect five systems in pairs, and you need up to ten translations. Each one is a place where meaning can slip."},
 {"id":"mars","gap":0.8,"text":"In 1999, a spacecraft was lost at Mars. One team's software gave the thrusters' push in pound-force seconds. The navigation software expected newton-seconds.","say":"In nineteen ninety-nine, a spacecraft was lost at Mars. One team's software gave the thrusters' push in pound-force seconds. The navigation software expected newton-seconds."},
 {"id":"both","gap":0.8,"text":"Each side made sense on its own. The meaning broke between them."},
 {"id":"hub","gap":0.8,"text":"So translate each system once, to a shared model. Five translations instead of ten, and one place where the meaning is written down."}]},
"person":{"name":"One person, many records","lead":1.0,"tail":1.0,"vo":[
 {"id":"ids","gap":0.8,"text":"Take one learner, Aisha. She has four IDs: a student number, a platform login, a customer number and a wallet address."},
 {"id":"facts","gap":0.8,"text":"Her name comes from the student system, her email from IT, and her credentials from three different places."},
 {"id":"master","gap":0.8,"text":"Choosing which system is the source of each fact, and linking the records that are the same person, is master data."},
 {"id":"codes","gap":0.8,"text":"And shared lists of values, such as the kinds of credential, keep a word meaning the same thing in every system. That's reference data."}]},
"logical":{"name":"Precise, but not yet technical","lead":1.0,"tail":1.0,"vo":[
 {"id":"sketch","gap":0.8,"text":"The sketch on paper says what matters. The logical model says it precisely."},
 {"id":"id","gap":0.8,"text":"What identifies a credential? Who issued it, to whom, for what, and when."},
 {"id":"attrs","gap":0.8,"text":"Its attributes, and the values each may take: the level, the volume of learning, the status."},
 {"id":"card","gap":0.8,"text":"How many of one relate to another: one learner holds many credentials, and one microcredential can count towards several awards."},
 {"id":"rules","gap":0.8,"text":"And the rules: a revoked credential is never counted."},
 {"id":"still","gap":0.8,"text":"Still no technology. That's what makes it useful: it's the yardstick every system is held against, to choose a package, to map its fields, or to move to a new one."}]},
"owners":{"name":"Who owns what","lead":1.0,"tail":1.0,"vo":[
 {"id":"words","gap":0.8,"text":"Every part has an owner. The registrar owns the word award. The short-courses team owns microcredential."},
 {"id":"arch","gap":0.8,"text":"Noor, the data architect, owns the logical model, and each team owns its own tables."},
 {"id":"down","gap":0.8,"text":"A change of meaning travels down, from the words to the systems. News of a change in a system travels up, before it ships."},
 {"id":"stewards","gap":0.8,"text":"Owners decide. Stewards keep it written down, and up to date."}]},
"end":{"name":"Pull back","lead":1.0,"tail":1.0,"vo":[
 {"id":"same","gap":0.8,"text":"The short-course platform still calls them customers. Nothing inside it changed."},
 {"id":"joined","gap":0.8,"text":"But its customer now maps to learner, and its certificate to microcredential. The meaning is joined."},
 {"id":"outlive","gap":0.8,"text":"Systems come and go every decade or so. The ideas underneath them are centuries old."},
 {"id":"last","gap":0.8,"text":"Model them once, precisely, and hold every system up to that. Next: one model, many shapes."}]}
};
