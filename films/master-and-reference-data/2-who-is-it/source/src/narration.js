// Master and reference data · Who is it? One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"guerre":{"name":"Taken for one","lead":1.6,"tail":1.0,"vo":[
 {"id":"left","gap":0.8,"text":"In 1548, Martin Guerre left his village in the south of France, and his wife, Bertrande.","say":"In fifteen forty-eight, Martin Guerre left his village in the south of France, and his wife, Bertrande."},
 {"id":"back","gap":0.8,"text":"Eight years later, a man came back as Martin. He knew the house, the family, their stories, and they took him in."},
 {"id":"court","gap":0.8,"text":"His uncle came to doubt him. In court, a hundred and fifty witnesses couldn't agree."},
 {"id":"leg","gap":0.8,"text":"On appeal, as the judges leaned his way, a man with a wooden leg walked in: the real Martin Guerre."},
 {"id":"two","gap":0.8,"text":"Two people, taken for one, because so much matched."}]},
"words":{"name":"Two words people confuse","lead":1.0,"tail":1.0,"vo":[
 {"id":"first","gap":0.8,"text":"First, two words."},
 {"id":"master","gap":0.8,"text":"Master data is the things the business is about: Linh, an award, a supplier, a meter."},
 {"id":"many","gap":0.8,"text":"Many rows, always growing, and matched across systems."},
 {"id":"ref","gap":0.8,"text":"Reference data is the short lists that sort them: countries, role types, statuses. Few rows, rarely changing, often from outside."},
 {"id":"test","gap":0.8,"text":"Would you ever ask, “is this the same one as that?” Then it's master data."},
 {"id":"pick","gap":0.8,"text":"If you only pick a value from a list, it's reference data."},
 {"id":"line","gap":0.8,"text":"And a list that gets owners and a life of its own, like faculties, becomes master data."}]},
"golden":{"name":"A golden record","lead":0.8,"tail":1.0,"vo":[
 {"id":"builds","gap":0.8,"text":"What matching builds is a master record, often called a golden record."},
 {"id":"id","gap":0.8,"text":"An ID of its own, which never changes and is never reused."},
 {"id":"best","gap":0.8,"text":"For each detail, the best value, labelled with where it came from."},
 {"id":"links","gap":0.8,"text":"And links to every record it came from, each kept as it arrived."},
 {"id":"undo","gap":0.8,"text":"So it can be explained, value by value, and undone, link by link."}]},
"check":{"name":"The duplicate check","lead":0.8,"tail":1.0,"vo":[
 {"id":"linh","gap":0.8,"text":"Linh came back to study under a new student number."},
 {"id":"runs","gap":0.8,"text":"This term, for the first time, the registry runs a duplicate check across the university's systems."},
 {"id":"billion","gap":0.8,"text":"Fifty thousand records would make over a billion pairs."},
 {"id":"share","gap":0.8,"text":"So it compares only records that share something: an email, a number, or a birth year and a family name that sounds alike."},
 {"id":"three","gap":0.8,"text":"It proposes pairs for Mei's office, the steward of the person. Here are three."}]},
"first":{"name":"Back to study","lead":0.8,"tail":1.0,"vo":[
 {"id":"pair","gap":0.8,"text":"The first pair is her two student numbers. Same name, same birth date."},
 {"id":"score","gap":0.8,"text":"Out of a hundred, it scores 93: over the line where a pair links on its own."},
 {"id":"term","gap":0.8,"text":"But in this first term, Mei's office checks the automatic links too, to test the rules."},
 {"id":"before","gap":0.8,"text":"And Linh's application says she studied here before."},
 {"id":"links","gap":0.8,"text":"So Mei links them, and writes down why."},
 {"id":"merge","gap":0.8,"text":"The registry merges the two numbers in its own system."}]},
"weights":{"name":"One digit apart","lead":0.8,"tail":1.0,"vo":[
 {"id":"second","gap":0.8,"text":"The second pair is harder: her new student number, and HR's record of her as a tutor."},
 {"id":"weigh","gap":0.8,"text":"Each thing compared adds weight, or takes it away."},
 {"id":"names","gap":0.8,"text":"Given name, the same: plus 3.2. Family name, the same, but common: plus 2.","say":"Given name, the same: plus three point two. Family name, the same, but common: plus two."},
 {"id":"date","gap":0.8,"text":"Birth date, one digit apart, maybe a typo: plus 2.4. Email, different: minus 0.4.","say":"Birth date, one digit apart, maybe a typo: plus two point four. Email, different: minus point four."},
 {"id":"total","gap":0.8,"text":"Together, 74: between the lines, so a person decides."},
 {"id":"flip","gap":0.8,"text":"If the birth dates agreed, it would score 93, like the first pair."}]},
"note":{"name":"It suggests, Mei decides","lead":0.8,"tail":1.0,"vo":[
 {"id":"drafts","gap":0.8,"text":"An AI helper drafts a note for Mei, with the names hidden: birth dates one digit apart, and the HR email on the university's domain."},
 {"id":"asks","gap":0.8,"text":"It suggests; Mei decides. She asks HR, and they check her contract: a typo."},
 {"id":"links","gap":0.8,"text":"She links them, with that reason."},
 {"id":"next","gap":0.8,"text":"Which birth date to trust is the next film's question."}]},
"aisha":{"name":"Two Aishas","lead":0.8,"tail":1.0,"vo":[
 {"id":"third","gap":0.8,"text":"The third pair looks easy: a learning platform account with Aisha Karimi's student number."},
 {"id":"rahman","gap":0.8,"text":"But the account is Aisha Rahman's, and the number was typed in by mistake."},
 {"id":"results","gap":0.8,"text":"Link them, and one student sees the other's results. Two people, taken for one."},
 {"id":"worse","gap":0.8,"text":"A false merge costs more than a missed match."},
 {"id":"apart","gap":0.8,"text":"So Mei keeps them apart, and her “not the same” binds the matcher."}]},
"link":{"name":"Link, don't destroy","lead":0.8,"tail":1.0,"vo":[
 {"id":"five","gap":0.8,"text":"Two decisions, and Linh's five records point to one person."},
 {"id":"kept","gap":0.8,"text":"Nothing was destroyed: each record stays as it arrived. So if a real Martin ever walks in, any link can be undone."},
 {"id":"rule","gap":0.8,"text":"And no rule says two student numbers are never one person. A student who comes back has two."}]},
"elsewhere":{"name":"Elsewhere","lead":0.8,"tail":1.4,"vo":[
 {"id":"hospital","gap":0.8,"text":"Hospitals match people too. Merge two patients by mistake, and a test result follows the wrong one."},
 {"id":"issuer","gap":0.8,"text":"So they keep each identifier with the system that issued it, and undoing a merge is part of the job."}]},
"once":{"name":"Decided once","lead":0.8,"tail":1.0,"vo":[
 {"id":"dbt","gap":0.8,"text":"On the platform, in dbt, a query proposes the pairs without comparing everyone, and the decisions table becomes the person's queue."},
 {"id":"test","gap":0.8,"text":"A test fails when a pair waits more than a week: the queue has an owner, and a limit."},
 {"id":"tables","gap":0.8,"text":"In Databricks, the master records and their links, each with who decided and why."},
 {"id":"decide","gap":0.8,"text":"Decide a match once, with a reason, and keep it."}]}
};
