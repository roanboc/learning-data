// Master and reference data · A hub at work. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"monday":{"name":"Monday morning","lead":1.4,"tail":1.0,"vo":[
 {"id":"monday","gap":0.8,"text":"Monday morning. Mei, whose office decides who someone is, opens the hub."},
 {"id":"rules","gap":0.8,"text":"Earlier in this series, the university wrote down its rules: when two records are one person, and which value wins."},
 {"id":"hub","gap":0.8,"text":"A hub puts those rules to work, every day."},
 {"id":"lf","gap":0.8,"text":"This one is LakeFusion, which runs inside Databricks. Another hub could take its place."},
 {"id":"weekend","gap":0.8,"text":"Over the weekend, 1,240 changes came in from four systems.","say":"Over the weekend, twelve hundred and forty changes came in from four systems."}]},
"rules":{"name":"Rules act","lead":0.8,"tail":1.0,"vo":[
 {"id":"most","gap":0.8,"text":"The rules dealt with nearly all of them."},
 {"id":"known","gap":0.8,"text":"1,180 matched someone the university already knows.","say":"Eleven hundred and eighty matched someone the university already knows."},
 {"id":"new","gap":0.8,"text":"52 were new people.","say":"Fifty-two were new people."},
 {"id":"close","gap":0.8,"text":"8 were too close to call, so they wait for Mei.","say":"Eight were too close to call, so they wait for Mei."},
 {"id":"first","gap":0.8,"text":"She starts with the one someone is waiting on."}]},
"saturday":{"name":"Waiting, not a new number","lead":0.8,"tail":1.0,"vo":[
 {"id":"applied","gap":0.8,"text":"On Saturday, Rafael Souza applied to come back for a master's, like Linh last year."},
 {"id":"search","gap":0.8,"text":"Before it makes a new person, the application now searches for one."},
 {"id":"likely","gap":0.8,"text":"It found a likely match, but not a sure one."},
 {"id":"waits","gap":0.8,"text":"So instead of a new student number, his application waits for Mei."}]},
"why":{"name":"Why 74","lead":0.8,"tail":1.0,"vo":[
 {"id":"why","gap":0.8,"text":"The hub shows why the rules gave it 74.","say":"The hub shows why the rules gave it seventy-four."},
 {"id":"names","gap":0.8,"text":"The same given and family names add a lot."},
 {"id":"dates","gap":0.8,"text":"Birth dates one digit apart, probably a typo, add a little."},
 {"id":"email","gap":0.8,"text":"A new email takes a little away: his student one closed when he graduated."},
 {"id":"band","gap":0.8,"text":"74 is in the band where a person decides.","say":"Seventy-four is in the band where a person decides."},
 {"id":"flip","gap":0.8,"text":"If the dates agreed, it would be 93, and linked without asking anyone.","say":"If the dates agreed, it would be ninety-three, and linked without asking anyone."}]},
"ai":{"name":"AI suggests","lead":0.8,"tail":1.0,"vo":[
 {"id":"note","gap":0.8,"text":"An AI helper has read the case, and drafted a note."},
 {"id":"form","gap":0.8,"text":"On the form, he wrote that he'd studied here: a bachelor's, finished in 2019.","say":"On the form, he wrote that he'd studied here: a bachelor's, finished in twenty nineteen."},
 {"id":"same","gap":0.8,"text":"The old record says the same thing, in other words."},
 {"id":"meaning","gap":0.8,"text":"The helper reads meaning, not only spelling."},
 {"id":"suggests","gap":0.8,"text":"It suggests they're the same person. It doesn't decide."}]},
"decide":{"name":"People decide","lead":0.8,"tail":1.0,"vo":[
 {"id":"links","gap":0.8,"text":"Mei decides. She links them, and writes down why."},
 {"id":"keeps","gap":0.8,"text":"The hub keeps her name, the time, and her reason."},
 {"id":"teaches","gap":0.8,"text":"Her decision teaches the helper, too."},
 {"id":"undo","gap":0.8,"text":"And it can be undone: unlinking is one step, and every version is kept."}]},
"publish":{"name":"Published, not pushed","lead":0.8,"tail":1.0,"vo":[
 {"id":"published","gap":0.8,"text":"Then the change is published, not pushed: each system reads what concerns it."},
 {"id":"app","gap":0.8,"text":"His application moves on under his old number, with his degree already on file."},
 {"id":"alumni","gap":0.8,"text":"The alumni office stops inviting him back."},
 {"id":"mask","gap":0.8,"text":"And it never sees his birth date. It doesn't need it."}]},
"source":{"name":"Where it came from","lead":0.8,"tail":1.0,"vo":[
 {"id":"where","gap":0.8,"text":"His record shows where each value came from."},
 {"id":"names","gap":0.8,"text":"His names and his birth date come from the student system, checked when he first enrolled."},
 {"id":"email","gap":0.8,"text":"His email comes from the application: the newest one he's confirmed."},
 {"id":"typo","gap":0.8,"text":"The typo stays on the application, but it doesn't win."}]},
"friday":{"name":"Checking the checkers","lead":0.8,"tail":1.0,"vo":[
 {"id":"friday","gap":0.8,"text":"On Friday, Leila, a steward in admissions, checks fifty of the week's automatic links, mostly ones that only just passed."},
 {"id":"blind","gap":0.8,"text":"She sees each pair of records, but not what the rules decided, so she isn't swayed."},
 {"id":"wrong","gap":0.8,"text":"This week, one was wrong, and Mei unlinks it."},
 {"id":"stop","gap":0.8,"text":"If more than three were wrong, automatic linking would stop."},
 {"id":"until","gap":0.8,"text":"Every match would wait for a person, until new rules were agreed."}]},
"five":{"name":"Five questions","lead":0.8,"tail":1.0,"vo":[
 {"id":"ask","gap":0.8,"text":"Whatever the hub, at a university, a hospital or a bank, ask it five questions."},
 {"id":"explain","gap":0.8,"text":"Can it explain every match, and every value?"},
 {"id":"undo","gap":0.8,"text":"Can every decision be undone?"},
 {"id":"review","gap":0.8,"text":"Do people decide what's unsure, and check what isn't?"},
 {"id":"mask","gap":0.8,"text":"Does each office see only what it needs?"},
 {"id":"publish","gap":0.8,"text":"And do systems read the changes, instead of being overwritten?"}]},
"end":{"name":"Explained and undone","lead":0.8,"tail":1.0,"vo":[
 {"id":"three","gap":0.8,"text":"Rules act. AI suggests. People decide."},
 {"id":"end","gap":0.8,"text":"And everything can be explained, and undone."}]}
};
