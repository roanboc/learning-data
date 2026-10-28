// An agent that checks, the ninth film of the data governance series. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"night":{"name":"A night, imagined","lead":1.6,"tail":1.0,"vo":[
 {"id":"imag","gap":0.8,"text":"Imagined: the university, a few years from now."},
 {"id":"adds","gap":0.8,"text":"Before going home, Anil Kurian, an analyst in the Faculty of Health, adds a column to a list: each learner's date of birth."},
 {"id":"nothing","gap":0.8,"text":"Nothing marks it as personal data, so nothing hides it: anyone who can open the list would see when each learner was born."},
 {"id":"wrong","gap":0.8,"text":"In the wrong hands, with a name and an email, it can help someone pretend to be that learner."},
 {"id":"now","gap":0.8,"text":"Someone has to catch it, and today, that means waiting for the one person who knows the rules."},
 {"id":"three","gap":0.8,"text":"At three that night, an AI agent reads the change against governance's written rules."},
 {"id":"comment","gap":0.8,"text":"It doesn't edit the change, or approve it. It leaves a note: where, the rule, who decides, and a fix to consider."},
 {"id":"eight","gap":0.8,"text":"At eight, Anil reads it, agrees, and marks the column as personal data."},
 {"id":"relief","gap":0.8,"text":"No one had to wait, and no one saw a date of birth they shouldn't."},
 {"id":"shows","gap":0.8,"text":"What this shows: rules written plainly enough to check, applied by an agent to every change, at any hour, and a person who decides."}]},
"today":{"name":"Sent back","lead":1.0,"tail":1.0,"vo":[
 {"id":"back","gap":0.8,"text":"Back to today, and Anil's first change: the list itself."},
 {"id":"list","gap":0.8,"text":"Every learner studying for one of the faculty's awards, how far each is from finishing, and a name and an email to call."},
 {"id":"fail","gap":0.8,"text":"The checks send it back, with four gaps."},
 {"id":"says","gap":0.8,"text":"Each says what's missing. None says what's right for this list, or who decides."},
 {"id":"waits","gap":0.8,"text":"So Anil asks Jun, who knows the rules, and waits."},
 {"id":"queue","gap":0.8,"text":"Every change nobody else owns waits for Jun, and the advisers wait for their list."}]},
"skill":{"name":"Rules an agent can follow","lead":1.0,"tail":1.0,"vo":[
 {"id":"skill","gap":0.8,"text":"So Yusuf and Noor write governance's rules as a checklist: the steps an agent follows on every change."},
 {"id":"file","gap":0.8,"text":"It's one page, in plain words, for anyone to read."},
 {"id":"oneplace","gap":0.8,"text":"The rules no longer live with one person."},
 {"id":"steps1","gap":0.8,"text":"Run the checks. Find the owner. Take each definition from the glossary, or have governance confirm there's none."},
 {"id":"steps2","gap":0.8,"text":"Classify every column, with evidence. Check each rule about the data; track the ones about what people do."},
 {"id":"steps3","gap":0.8,"text":"Name what it touches. Then report, once, to the people who decide."},
 {"id":"never","gap":0.8,"text":"And it never approves, edits the glossary, weakens a check, or shows a value from the data."},
 {"id":"night","gap":0.8,"text":"It's the page the agent followed on the night we imagined."}]},
"review":{"name":"Three findings","lead":1.0,"tail":1.0,"vo":[
 {"id":"reviews","gap":0.8,"text":"The data team's AI agent reviews Anil's change. Two things pass."},
 {"id":"findings","gap":0.8,"text":"Then three findings, each with where it is and the rule, and what the checks couldn't say: a draft, and who decides."},
 {"id":"one","gap":0.8,"text":"One: nobody answers for it, so no owner would be asked to review a change."},
 {"id":"two","gap":0.8,"text":"Two: ten columns don't say whether they identify a person."},
 {"id":"tally","gap":0.8,"text":"It counts, and shows no values: all seven rows of the email column look like an email."},
 {"id":"rule","gap":0.8,"text":"Three, which no check could find: the faculty wrote a rule, only its own awards, and nothing checks it."},
 {"id":"draft","gap":0.8,"text":"The draft checks that every row's faculty is Health."}]},
"decides":{"name":"People decide","lead":1.0,"tail":1.0,"vo":[
 {"id":"unsure","gap":0.8,"text":"Where the agent wasn't sure, it said so."},
 {"id":"keys","gap":0.8,"text":"Two columns look alike: long codes. One stands for a learner."},
 {"id":"other","gap":0.8,"text":"The other has two values for seven learners, and its description says it's made from the award."},
 {"id":"doubt","gap":0.8,"text":"Maybe not a person at all. But when in doubt, the checklist says, draft the stricter class, and ask."},
 {"id":"confirms","gap":0.8,"text":"Anil confirms: a course, not a person."},
 {"id":"classed","gap":0.8,"text":"So it's classed as identifying no one, with Anil's reason in the review."},
 {"id":"owners","gap":0.8,"text":"Then the owners decide: the faculty, its classes and its rule; Yusuf, the new owner; Jun, how it's built."},
 {"id":"calls","gap":0.8,"text":"The advisers get their list."},
 {"id":"decided","gap":0.8,"text":"The agent decided nothing. It brought each decision to the right person, with the evidence."}]},
"agent":{"name":"Governed, too","lead":1.0,"tail":1.0,"vo":[
 {"id":"binder","gap":0.8,"text":"Binder 26 says: AI use follows the organisation's data policies."},
 {"id":"governed","gap":0.8,"text":"The agent is governed too, by the rules for AI helpers."},
 {"id":"own","gap":0.8,"text":"It has its own identity, reads only what Sam grants it, and writes only in its own workspace."},
 {"id":"samples","gap":0.8,"text":"It works from counts and small samples, never bulk personal data, and only reads the glossary."},
 {"id":"approve","gap":0.8,"text":"And it can't approve: owners sign off, and the agent owns nothing."},
 {"id":"note","gap":0.8,"text":"That's why, on the night we imagined, it only left a note."},
 {"id":"green","gap":0.8,"text":"So the binder's line goes green: it runs, in the agent's access, its checklist, and the owners' approvals."}]},
"written":{"name":"Only what's written","lead":1.0,"tail":1.0,"vo":[
 {"id":"plain","gap":0.8,"text":"An agent can only follow what's written down, plainly enough to check."},
 {"id":"care","gap":0.8,"text":"Remember policy 12's last line: “Staff take care to use terms correctly.” No agent can check care.","say":"Remember policy twelve's last line: “Staff take care to use terms correctly.” No agent can check care."},
 {"id":"open","gap":0.8,"text":"And the checklist itself is open: anyone can read it, and argue with it."},
 {"id":"change","gap":0.8,"text":"A change to the checklist is reviewed like any other: data governance approves it, and the next review follows it."},
 {"id":"trust","gap":0.8,"text":"People trust a review they can read, question and overrule."}]},
"close":{"name":"That night","lead":1.0,"tail":1.0,"vo":[
 {"id":"made","gap":0.3,"text":"That night, a few years from now, is made of what you've just seen:"},
 {"id":"parts","gap":0.8,"text":"a checklist in plain words, rules for AI helpers, a register of who signs off what, and people who decide."},
 {"id":"gains","gap":0.8,"text":"What data governance gains: every change checked against the same rules, at any hour, and no one waiting for one person."},
 {"id":"marked","gap":0.8,"text":"Personal data marked before anyone sees it, and each decision made by its owner, with the evidence, written down."},
 {"id":"last","gap":0.8,"text":"An agent checks what's written. People decide."}]}
};
