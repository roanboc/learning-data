// In the weeds of data crafting · Start from a question. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"map":{"name":"One question, one map","lead":1.4,"tail":1.0,"vo":[
 {"id":"soho","gap":0.8,"text":"In the late summer of 1854, cholera killed hundreds of people in a few streets of Soho, in London.","say":"In the late summer of eighteen fifty-four, cholera killed hundreds of people in a few streets of Soho, in London."},
 {"id":"asked","gap":0.8,"text":"John Snow, a doctor, asked one question: where did the dead get their water?"},
 {"id":"marks","gap":0.8,"text":"He marked each death at its address, and the deaths gathered around one pump, on Broad Street."},
 {"id":"left","gap":0.8,"text":"His map left out almost everything about London. It showed only what the question needed."},
 {"id":"bridge","gap":0.8,"text":"Jun's model starts the same way: with one question, from Planning."}]},
"ask":{"name":"The question","lead":1.0,"tail":1.0,"vo":[
 {"id":"step","gap":0.8,"text":"Step one: start from a question."},
 {"id":"text","gap":0.8,"text":"How many learners are within 15 credit points of a graduate certificate, by faculty, as at census date?","say":"How many learners are within fifteen credit points of a graduate certificate, by faculty, as at census date?"},
 {"id":"decision","gap":0.8,"text":"Behind it, a decision: how many places to offer in each faculty's final graduate certificate units next semester."},
 {"id":"done","gap":0.8,"text":"The decision says what done looks like. The census report counted twelve. The model has to reach the same number."},
 {"id":"real","gap":0.8,"text":"Everything on screen in these films is real. The code and the data run on dbt Core, with DuckDB, in the series' repository, so anyone can run them."},
 {"id":"cloud","gap":0.8,"text":"The university's own platform is Databricks, with dbt Cloud, and the same project runs there too."},
 {"id":"hash","gap":0.8,"text":"Only the connection changes, and one function: the hash."}]},
"slice":{"name":"The slice","lead":1.0,"tail":1.0,"vo":[
 {"id":"glossary","gap":0.8,"text":"The university's glossary has a term for everything it does: fees, timetables, rooms, staff."},
 {"id":"four","gap":0.8,"text":"The question touches four: a learner, a credential, an award, and the credit a learner holds towards an award."},
 {"id":"out","gap":0.8,"text":"Everything else stays out, however central it seems."},
 {"id":"never","gap":0.8,"text":"Noor agreed that scope with Planning, and wrote down why. Model the university, and you never finish. A question, you can finish."}]},
"yaml":{"name":"Written as YAML, drawn for people","lead":1.0,"tail":1.0,"vo":[
 {"id":"once","gap":0.8,"text":"Each of the four is written down once, in YAML.","say":"Each of the four is written down once, in yammel."},
 {"id":"learner","gap":0.8,"text":"The learner: a definition, an owner, and the rule for its key."},
 {"id":"words","gap":0.8,"text":"The definition is in the business's words, not a system's: a person the university has recorded learning with it, in any of its systems."},
 {"id":"diagram","gap":0.8,"text":"Beside it, a diagram drawn by hand: a learner holds credentials, and holds credit towards an award."},
 {"id":"read","gap":0.8,"text":"The YAML holds the meaning. The diagram lets anyone read it.","say":"The yammel holds the meaning. The diagram lets anyone read it."}]},
"owners":{"name":"Keys and owners","lead":1.0,"tail":1.0,"vo":[
 {"id":"before","gap":0.8,"text":"Next, what identifies each one in business terms, before anyone opens a source."},
 {"id":"keys","gap":0.8,"text":"A learner is her student ID, which the registrar's office issues. An award is its code. A credential is the identifier of the system that issued it."},
 {"id":"sets","gap":0.8,"text":"Each key carries the name of the system it comes from: the student system, the learning platform, or the short-course platform."},
 {"id":"mei","gap":0.8,"text":"And each meaning has an owner. Mei, in the registrar's office, owns learner, credential and award. The learning team owns microcredentials and badges."},
 {"id":"why","gap":0.8,"text":"The sources will disagree. The owner is the person who decides which meaning wins."}]},
"split":{"name":"Combine or split","lead":1.0,"tail":1.0,"vo":[
 {"id":"harder","gap":0.8,"text":"Then a harder call. Is a microcredential a kind of credential, or a thing of its own?"},
 {"id":"compare","gap":0.8,"text":"Compare what identifies it: the issuer's own identifier. Compare its life: issued on a date, and perhaps revoked."},
 {"id":"same","gap":0.8,"text":"Both match any credential. Only the credit points differ."},
 {"id":"rule","gap":0.8,"text":"Same identity, same lifecycle: one entity, with kinds. A different grain or a different lifecycle, and you split."},
 {"id":"attend","gap":0.8,"text":"A certificate of attendance asks to join. It says someone was there, not what they can do. It stays out."}]},
"draft":{"name":"The agent's draft","lead":1.0,"tail":1.0,"vo":[
 {"id":"agent","gap":0.8,"text":"Jun doesn't write all this alone. An AI agent drafts it, following a skill kept in the project."},
 {"id":"skill","gap":0.8,"text":"Write the question first. List only what it touches. Propose combine or split, with the reasons."},
 {"id":"miss","gap":0.8,"text":"The draft defined the credential, but let certificates of attendance in."},
 {"id":"clause","gap":0.8,"text":"Mei adds one clause: a certificate of attendance isn't one."},
 {"id":"approve","gap":0.8,"text":"The agent drafts. The owner approves the meaning, and the decision goes in the log, with her name and the date."}]},
"next":{"name":"Now, the sources","lead":1.0,"tail":1.0,"vo":[
 {"id":"count","gap":0.8,"text":"One question. Four things to model. Two owners of meaning. Nothing else."},
 {"id":"sources","gap":0.8,"text":"Now, the sources."},
 {"id":"three","gap":0.8,"text":"The model says a learner is one person. The sources say Aisha is three."}]}
};
