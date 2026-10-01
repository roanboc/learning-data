// In the weeds of data crafting · What makes it the same one. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
// Key strings (S-20417, u-88213, SIS|…), emails and hashes are on screen only; the voice never reads them.
const NARR={
"west":{"name":"Look-alikes","lead":1.4,"tail":1.0,"vo":[
 {"id":"measure","gap":0.8,"text":"In the 1880s, a Paris police clerk, Alphonse Bertillon, identified repeat offenders by measuring them.","say":"In the eighteen-eighties, a Paris police clerk, Alphonse Bertillon, identified repeat offenders by measuring them."},
 {"id":"card","gap":0.8,"text":"The head, the arms, a finger: each measured, written on a card, and filed by its numbers."},
 {"id":"story","gap":0.8,"text":"The story goes that in 1903, at Leavenworth prison, a new prisoner matched the card of a man already inside. Fingerprints told them apart.","say":"The story goes that in nineteen-oh-three, at Leavenworth prison, a new prisoner matched the card of a man already inside. Fingerprints told them apart."},
 {"id":"bridge","gap":0.8,"text":"Looking alike isn't being the same. At the university, the question is Aisha."}]},
"three":{"name":"Three keys","lead":1.0,"tail":1.0,"vo":[
 {"id":"aisha","gap":0.8,"text":"Aisha is studying for a graduate certificate in data analytics."},
 {"id":"keys","gap":0.8,"text":"The student system knows her by her student ID. The learning platform, by her account. The short-course platform, by the email she typed, with a space either side, in mixed case."},
 {"id":"inside","gap":0.8,"text":"Three keys. Each one means something only inside its own system."},
 {"id":"which","gap":0.8,"text":"None of them says which learner she is."}]},
"profile":{"name":"Profile first","lead":1.0,"tail":1.0,"vo":[
 {"id":"first","gap":0.8,"text":"Before matching anything, Jun learns what the sources really hold. The agent profiles them, and every claim comes with the query that shows it."},
 {"id":"nulls","gap":0.8,"text":"Four of forty-two platform accounts have no student ID."},
 {"id":"shared","gap":0.8,"text":"Two students share one family email, and so do their two platform accounts."},
 {"id":"orphans","gap":0.8,"text":"Two short-course enrolments point at no customer, as typed. Trimmed and in lower case, none do."},
 {"id":"guess","gap":0.8,"text":"A claim without its query is a guess."}]},
"sets":{"name":"Key sets","lead":1.0,"tail":1.0,"vo":[
 {"id":"where","gap":0.8,"text":"So first, every key says where it comes from."},
 {"id":"set","gap":0.8,"text":"A key set: the student system, the learning platform or short courses, each with a short code, and an owner."},
 {"id":"alike","gap":0.8,"text":"Two systems can use the same-looking key for two different people. Qualified, they can't be confused."},
 {"id":"case","gap":0.8,"text":"And staging writes every key one way: trimmed, and in one case. Aisha's email loses its spaces and its capitals."}]},
"rules":{"name":"Rules, most trusted first","lead":1.0,"tail":1.0,"vo":[
 {"id":"same","gap":0.8,"text":"Then: which keys are the same learner? Jun writes it as rules, most trusted first, one block of the query for each."},
 {"id":"list","gap":0.6,"text":"A student ID is a learner. A platform account is the student whose ID it holds. An email names a student, but only if exactly one student has it. Anything left is a learner of its own."},
 {"id":"best","gap":0.8,"text":"Each key takes the most trusted rule that fits."},
 {"id":"aisha","gap":0.8,"text":"Aisha's three keys resolve to her student ID. Across the university, ninety keys become forty-six learners."},
 {"id":"owned","gap":0.8,"text":"The rules are written in words in the model, and in code in one query. Mei, who owns what a learner means, approved them.","say":"The rules are written in words in the model, and in code in one query. May, who owns what a learner means, approved them."}]},
"apart":{"name":"Keep them apart","lead":1.0,"tail":1.0,"vo":[
 {"id":"other","gap":0.8,"text":"But another Aisha has a platform account, and its student ID field holds our Aisha's number, typed by mistake."},
 {"id":"merge","gap":0.8,"text":"The rules merge them. Aisha's wallet now shows six credentials, one she never earned. And every test still passes."},
 {"id":"nobody","gap":0.8,"text":"No test knew they were two people, because nobody had written it down."},
 {"id":"decide","gap":0.8,"text":"Mei checks, and records a decision: different people. A person's decision beats every rule.","say":"May checks, and records a decision: different people. A person's decision beats every rule."},
 {"id":"undo","gap":0.8,"text":"The merge undoes, and Aisha holds five. A test now holds the decision, so no rule can merge them again."}]},
"hash":{"name":"The same hash everywhere","lead":1.0,"tail":1.0,"vo":[
 {"id":"one","gap":0.8,"text":"Now every learner has one business key, and Jun hashes it."},
 {"id":"space","gap":0.8,"text":"Sixty-four characters. Add one trailing space, and the hash is completely different."},
 {"id":"macro","gap":0.8,"text":"So one macro builds every hash. It trims each part, writes it in upper case, marks a missing part, and joins the parts with a bar."},
 {"id":"every","gap":0.8,"text":"The same key gives the same hash, in every model, and on every engine."},
 {"id":"beside","gap":0.8,"text":"And the readable key stays beside the hash. A hash can't be read, or checked by eye."}]},
"codes":{"name":"Codes, too","lead":1.0,"tail":1.0,"vo":[
 {"id":"codes","gap":0.8,"text":"Codes need the same care. Three systems, three codes, one meaning: studying."},
 {"id":"map","gap":0.8,"text":"A status map says so, one row per code. The registrar's office owns it, and approves every change."},
 {"id":"next","gap":0.8,"text":"Now every learner has one key. But one key can still mean many rows, and many versions."}]}
};
