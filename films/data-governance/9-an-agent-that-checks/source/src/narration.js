// An agent that checks, the ninth film of the data governance series. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"night":{"name":"A night, imagined","lead":1.6,"tail":1.0,"vo":[
 {"id":"imag","gap":0.8,"text":"Imagined: the university, a few years from now."},
 {"id":"adds","gap":0.8,"text":"Before going home, Anil Kurian, an analyst in the Faculty of Health, adds a column to a list: each learner's date of birth."},
 {"id":"three","gap":0.8,"text":"At three in the morning, an agent reads the change against governance's written rules."},
 {"id":"nothing","gap":0.8,"text":"Nothing says the new column is personal data, so nothing would protect it."},
 {"id":"comment","gap":0.8,"text":"The agent doesn't change it, or approve it. It leaves a comment: the line, the rule, and a fix to consider."},
 {"id":"eight","gap":0.8,"text":"At eight, Anil reads it, agrees, and marks the column as personal data."},
 {"id":"shows","gap":0.8,"text":"What this shows: rules written as checks, applied by an agent to every change, at any hour, and a person who decides."}]},
"today":{"name":"Thirteen problems","lead":1.0,"tail":1.0,"vo":[
 {"id":"back","gap":0.8,"text":"Back to today, and Anil's first change: the list itself."},
 {"id":"list","gap":0.8,"text":"Every learner studying for one of the faculty's awards, how far each is from finishing, and a name and an email to call."},
 {"id":"fail","gap":0.8,"text":"Three checks fail, with thirteen problems."},
 {"id":"says","gap":0.8,"text":"Each says what's missing. None says what's right for this list, or who decides."},
 {"id":"waits","gap":0.8,"text":"So Anil asks Jun, and waits. Every change that nobody else owns waits for Jun."}]},
"skill":{"name":"Rules an agent can follow","lead":1.0,"tail":1.0,"vo":[
 {"id":"skill","gap":0.8,"text":"So Yusuf and Noor write governance's rules as a skill: the steps an agent follows on every change."},
 {"id":"file","gap":0.8,"text":"It's a file in the project, in plain words, for anyone to read."},
 {"id":"steps1","gap":0.8,"text":"Run the checks. Find the owner. Take each definition from the glossary, or have governance confirm there's none."},
 {"id":"steps2","gap":0.8,"text":"Class every column, with evidence. Test each rule about the data; track the ones about what people do."},
 {"id":"steps3","gap":0.8,"text":"Name what it touches. Then report, once, to the people who decide."},
 {"id":"never","gap":0.8,"text":"And it never approves, edits the glossary, weakens a test, or shows a value from the data."}]},
"review":{"name":"Three findings","lead":1.0,"tail":1.0,"vo":[
 {"id":"reviews","gap":0.8,"text":"The agent reviews Anil's change. Two things pass: it touches nothing else, and needs no new glossary term."},
 {"id":"findings","gap":0.8,"text":"Then three findings, each with its line, the rule it breaks, a draft, and who decides."},
 {"id":"one","gap":0.8,"text":"One: nobody answers for it, so no owner would be asked to review a change."},
 {"id":"two","gap":0.8,"text":"Two: ten columns don't say whether they identify a person."},
 {"id":"tally","gap":0.8,"text":"It counts, and shows no values: all seven rows of the email column look like an email."},
 {"id":"rule","gap":0.8,"text":"Three: a rule, only the faculty's own awards, has no test. The draft checks that every row's faculty is HLT.","say":"Three: a rule, only the faculty's own awards, has no test. The draft checks that every row's faculty is H, L, T."}]},
"decides":{"name":"People decide","lead":1.0,"tail":1.0,"vo":[
 {"id":"unsure","gap":0.8,"text":"Where the agent wasn't sure, it said so."},
 {"id":"keys","gap":0.8,"text":"Two columns look alike: long coded keys. One stands for a learner."},
 {"id":"other","gap":0.8,"text":"The other has two values for seven learners, and its description says it's made from the award's code."},
 {"id":"doubt","gap":0.8,"text":"Maybe not a person at all. But when in doubt, the skill says, draft the stricter class, and ask."},
 {"id":"confirms","gap":0.8,"text":"Anil confirms: a course, not a person."},
 {"id":"classed","gap":0.8,"text":"So it's classed as identifying no one, with Anil's reason in the review."},
 {"id":"owners","gap":0.8,"text":"Then the owners decide: the faculty, its classes and its rule; Yusuf, the new owner; Jun, the code."},
 {"id":"decided","gap":0.8,"text":"The agent decided nothing. It brought each decision to the right person, with the evidence."}]},
"agent":{"name":"Governed, too","lead":1.0,"tail":1.0,"vo":[
 {"id":"binder","gap":0.8,"text":"Binder 26 says: AI use follows the organisation's data policies. The agent is governed, too."},
 {"id":"own","gap":0.8,"text":"It has its own identity, reads only what it's granted, and writes only in its own workspace."},
 {"id":"samples","gap":0.8,"text":"It works from counts and small samples, never bulk personal data, and only reads the glossary."},
 {"id":"approve","gap":0.8,"text":"And it can't approve: approvals come from owners, and the agent owns nothing."},
 {"id":"green","gap":0.8,"text":"So the binder's line goes green: it runs, in the agent's access, its steps, and the owners' approvals."}]},
"written":{"name":"Only what's written","lead":1.0,"tail":1.0,"vo":[
 {"id":"plain","gap":0.8,"text":"An agent can only follow what's written down, plainly enough to check."},
 {"id":"care","gap":0.8,"text":"Remember policy 12's last line: “Staff take care to use terms correctly.” No agent can check care.","say":"Remember policy twelve's last line: “Staff take care to use terms correctly.” No agent can check care."},
 {"id":"open","gap":0.8,"text":"And the steps themselves are open: anyone can read them, and argue with them."},
 {"id":"change","gap":0.8,"text":"A change to a step is reviewed like any other: data governance approves it, and the next review follows it."},
 {"id":"trust","gap":0.8,"text":"People trust a review they can read, question and overrule."}]},
"close":{"name":"That night","lead":1.0,"tail":1.0,"vo":[
 {"id":"made","gap":0.3,"text":"That night, a few years from now, is made of what you've just seen:"},
 {"id":"parts","gap":0.8,"text":"rules written as checks, steps in plain words, an agent with little access, and people who decide."},
 {"id":"last","gap":0.8,"text":"An agent checks what's written. People decide."}]}
};
