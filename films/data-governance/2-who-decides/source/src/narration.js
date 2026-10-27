// Who decides, the second film of the data governance series. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"cord":{"name":"The cord","lead":1.4,"tail":1.0,"vo":[
 {"id":"c1960","gap":0.8,"text":"Japan, the 1960s. A car maker's engine line moves on, past a row of workers.","say":"Japan, the nineteen-sixties. A car maker's engine line moves on, past a row of workers."},
 {"id":"cord","gap":0.8,"text":"Any worker who finds a problem pulls a cord, or presses a button, within reach."},
 {"id":"lamp","gap":0.8,"text":"A lamp lights on the andon, the board above the line, and the supervisor comes at once, to help."},
 {"id":"stops","gap":0.8,"text":"If it can't be fixed before the job is done, the line stops, and the team fixes it together."},
 {"id":"did","gap":0.8,"text":"Every worker could stop the line, and they did."},
 {"id":"reach","gap":0.8,"text":"It was within reach, and it brought someone who could decide, at once."},
 {"id":"data","gap":0.8,"text":"A right to decide about data needs the same."}]},
"tbc":{"name":"To be confirmed","lead":1.0,"tail":1.0,"vo":[
 {"id":"opens","gap":0.8,"text":"Today, Yusuf opens the binder called Who decides."},
 {"id":"says","gap":0.8,"text":"Its policy says every area of data, like students or courses, has an owner and a steward."},
 {"id":"register","gap":0.8,"text":"Its register lists eight areas. Three owners, and half the stewards, are still to be confirmed."},
 {"id":"email","gap":0.8,"text":"So decisions are made in email, or not at all."},
 {"id":"thread","gap":0.8,"text":"How award maps to the government's definition has gone round a thread of twenty-three replies. Nobody has decided."}]},
"written":{"name":"Already written","lead":1.0,"tail":1.0,"vo":[
 {"id":"asks","gap":0.8,"text":"Then he asks the data team who they ask, when a meaning isn't clear."},
 {"id":"list","gap":0.8,"text":"Noor, the data architect, shows him the list on their board: who we ask, area by area. Every area has a name."},
 {"id":"award","gap":0.8,"text":"For award, they ask Mei Tanaka, in the registrar's office."},
 {"id":"built","gap":0.8,"text":"They wrote it down as they built, because they needed someone to ask."},
 {"id":"confirm","gap":0.8,"text":"Yusuf takes each name to its office to confirm it, and asks for the names still missing."}]},
"roles":{"name":"Three roles","lead":1.0,"tail":1.0,"vo":[
 {"id":"sorts","gap":0.8,"text":"On the way, he sorts out three roles, whatever a policy calls them."},
 {"id":"owner","gap":0.8,"text":"The owner answers for what the data means. Mei decides what an award is."},
 {"id":"steward","gap":0.8,"text":"The steward keeps it right, day to day. Mei also decides whether two records are the same learner, and writes down why."},
 {"id":"both","gap":0.8,"text":"One person can hold both roles."},
 {"id":"custodian","gap":0.8,"text":"The custodian runs the platform it lives on. Sam's team can change any table, but doesn't decide what an award means."}]},
"domains":{"name":"Who decides what","lead":1.0,"tail":1.0,"vo":[
 {"id":"own","gap":0.8,"text":"Each area decides what its own words mean."},
 {"id":"shared","gap":0.8,"text":"Governance sets only the few rules they all share, such as one glossary, and one way to classify data."},
 {"id":"council","gap":0.8,"text":"When two areas disagree, or someone needs an exception, the council decides, by its next meeting."},
 {"id":"limit","gap":0.8,"text":"If it can't agree, the deputy vice-chancellor decides."},
 {"id":"rest","gap":0.8,"text":"Everything else, the owner decides, where the work is."}]},
"required":{"name":"Required","lead":1.0,"tail":1.0,"vo":[
 {"id":"required","gap":0.8,"text":"Then Yusuf and Noor make the owner required."},
 {"id":"sheet","gap":0.8,"text":"Anything new that other teams will read has a sign-off sheet. One line on it is never left blank: who answers for what it means."},
 {"id":"back","gap":0.8,"text":"Jun's new report for Planning comes back with that line empty, and a note saying what to add."},
 {"id":"signs","gap":0.8,"text":"He asks Planning. Clara Jensen will answer for it, and signs."},
 {"id":"closed","gap":0.8,"text":"The council's oldest action, name the data owners, is closed."}]},
"asked":{"name":"Asked by name","lead":1.0,"tail":1.0,"vo":[
 {"id":"slip","gap":0.8,"text":"Next, every change request gets a routing slip, filled in from the register."},
 {"id":"keeps","gap":0.8,"text":"Yusuf keeps the register: change a name there, and every slip follows."},
 {"id":"jun","gap":0.8,"text":"Jun's next change request maps award to the government's definition."},
 {"id":"mei","gap":0.8,"text":"Its slip sends it to Mei, by name, then to Noor and Yusuf. Nobody had to remember to."},
 {"id":"like","gap":0.8,"text":"Like the cord on the line: the work calls the person who decides, at the moment it matters."}]},
"logged":{"name":"Where the work is","lead":1.0,"tail":1.0,"vo":[
 {"id":"written","gap":0.8,"text":"When Mei decides, her decision is written down where the work is: what, who, when and why."},
 {"id":"logs","gap":0.8,"text":"She already keeps a log book of which records are the same learner. The mapping will go in the course area's decision book."},
 {"id":"next","gap":0.8,"text":"Each area keeps its own, so the next person can find why."},
 {"id":"not","gap":0.8,"text":"Not in an email thread nobody can find."}]},
"time":{"name":"Time to answer","lead":1.0,"tail":1.0,"vo":[
 {"id":"ask","gap":0.8,"text":"Mei didn't ask to be an owner. She was named because she always answered."},
 {"id":"hours","gap":0.8,"text":"So Yusuf asks her manager for the time it takes: two hours a week."},
 {"id":"scope","gap":0.8,"text":"He keeps her scope small and clear: award, not every word her office uses."},
 {"id":"someone","gap":0.8,"text":"And she has someone to ask: Yusuf, or the council, when owners disagree."},
 {"id":"name","gap":0.8,"text":"A role without time is a name in a spreadsheet."}]},
"which":{"name":"Which award?","lead":1.0,"tail":1.0,"vo":[
 {"id":"line","gap":0.8,"text":"On the line, the cord brought someone who could decide. Here, every change asks its owner."},
 {"id":"real","gap":0.8,"text":"A decision right is real when the work asks for it."},
 {"id":"opens","gap":0.8,"text":"Then Mei opens Jun's change request, and asks a question nobody expected."},
 {"id":"five","gap":0.8,"text":"Which award does she own? She has found it defined in five places, and they don't agree."}]}
};
