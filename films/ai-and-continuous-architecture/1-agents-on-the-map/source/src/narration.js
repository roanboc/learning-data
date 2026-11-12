// AI and continuous architecture · Agents on the map. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"hands":{"name":"Many hands","lead":1.4,"tail":1.0,"vo":[
 {"id":"city","gap":0.9,"text":"Babylon, about 620 BCE. At the heart of the city stands the temple-tower of its god, Marduk: Etemenanki.","say":"Babylon, about six hundred and twenty BCE. At the heart of the city stands the temple-tower of its god, Marduk: Etemenanki."},
 {"id":"ruin","gap":0.9,"text":"Its new king, Nabopolassar, finds it in ruins. In his own words, it had become very weak, and had been allowed to collapse."},
 {"id":"harm","gap":0.9,"text":"For the people of Babylon, the house of their god lay broken at the centre of their city."},
 {"id":"must","gap":0.9,"text":"It had to stand again: the king writes that Marduk commanded him to raise it, its top to rival the heavens."},
 {"id":"big","gap":0.9,"text":"No one crew could build it: its base was about ninety metres on each side, and every brick was made and carried by hand."},
 {"id":"plan","gap":0.9,"text":"So no one was told to build the whole tower. Surveyors measured the ground with a rod, and master builders stretched ropes for its plan."},
 {"id":"tasks","gap":0.9,"text":"The work was split into tasks: moulding mud bricks, firing them in kilns, carrying baskets, and bringing bitumen, a natural tar, by river."},
 {"id":"name","gap":0.9,"text":"And the king answered for the work: at its foundation, he carried bricks on his head himself."},
 {"id":"rose","gap":0.9,"text":"When he died, in 605 BCE, the tower stood about fifteen metres high.","say":"When he died, in six hundred and five BCE, the tower stood about fifteen metres high."},
 {"id":"son","gap":0.9,"text":"His son, Nebuchadnezzar, finished it with people from many lands, and their god's house stood again at the heart of the city."},
 {"id":"now","gap":0.9,"text":"Today, the utility's work has many hands too, and some of them are agents."},
 {"id":"help","gap":0.9,"text":"Given a task, a role and someone who answers, an agent helps. Given a whole job, it can harm the people it serves."}]},
"map":{"name":"On Tomás's map","lead":1.2,"tail":1.0,"vo":[
 {"id":"note","gap":0.9,"text":"Tomás's new note asks where agents belong on the map."},
 {"id":"layers","gap":0.9,"text":"His map shows the whole utility in six layers, from why it exists down to what it runs on."},
 {"id":"two","gap":0.9,"text":"Two of its applications are agents: the outage agent proposes which fault matters most, and the map agent drafts changes."},
 {"id":"rights","gap":0.9,"text":"Each is software in a role, with its rights written down and an owner: Grace for one, Tomás for the other."},
 {"id":"series","gap":0.9,"text":"This series adds what's around them: the AI platform, AI in the architects' own work, and a map kept alive."},
 {"id":"module","gap":0.9,"text":"How an agent works is the AI agents module's; here, the map shows where agents work, and who answers for them."}]},
"unseen":{"name":"A plan nobody saw","lead":1.4,"tail":1.0,"vo":[
 {"id":"farah","gap":0.9,"text":"Then Farah brings a household, behind on their bill. They asked the website's chat for more time to pay."},
 {"id":"yes","gap":0.9,"text":"The chat said yes: a plan over three months, and no late fee."},
 {"id":"fee","gap":0.9,"text":"Two weeks later, their bill came with a late fee, and a warning that their power could be cut."},
 {"id":"vendor","gap":0.9,"text":"The chat is an agent: its vendor switched it on in an update to the contact centre's software."},
 {"id":"whole","gap":0.9,"text":"Nobody put it on the map. It was given a whole activity, payment requests, so it agreed plans."},
 {"id":"officer","gap":0.9,"text":"But agreeing a plan is a billing officer's decision, under the regulator's rules for households who can't pay."},
 {"id":"notes","gap":0.9,"text":"It wrote each plan in the contact centre's notes, which billing doesn't read: 212 plans in six weeks.","say":"It wrote each plan in the contact centre's notes, which billing doesn't read: two hundred and twelve plans in six weeks."}]},
"find":{"name":"How many agents?","lead":1.0,"tail":1.0,"vo":[
 {"id":"ask","gap":0.9,"text":"How many agents work here? The IT service management tool can't say: it lists applications, not what's switched on inside them."},
 {"id":"look","gap":0.9,"text":"So Tomás looks where agents leave traces: vendors' release notes and contracts, logs of calls to language models, and each team's answer."},
 {"id":"four","gap":0.9,"text":"He finds three more: a crew planner the network's analysts built, and a meter agent that drafts a work order when a meter goes quiet."},
 {"id":"field","gap":0.9,"text":"And the field app's assistant, which answers crews' questions from the manuals."},
 {"id":"helper","gap":0.9,"text":"Inside billing, an assistant works on each officer's sign-in: a helper, with that person's rights, not an agent of its own."},
 {"id":"seven","gap":0.9,"text":"Six agents and a helper, where the map showed two."}]},
"role":{"name":"Software in a role","lead":1.0,"tail":1.0,"vo":[
 {"id":"drawn","gap":0.9,"text":"On the map, an agent is drawn as ArchiMate 4 draws software that works beside people: an application, assigned to a role."},
 {"id":"own","gap":0.9,"text":"A role of its own, never a person's."},
 {"id":"why","gap":0.9,"text":"In a billing officer's role, the chat would hold every right an officer holds, and no one could tell its work from theirs."},
 {"id":"tasks","gap":0.9,"text":"And it covers tasks, never a whole activity: the activity, and the decisions in it, stay with the people who own them."}]},
"far":{"name":"How far, task by task","lead":1.0,"tail":1.0,"vo":[
 {"id":"process","gap":0.9,"text":"Helping a household that can't pay is a process, written down, and its owner is the head of retail."},
 {"id":"levels","gap":0.9,"text":"For each task, its owner sets how far the agent may go: inform a person, draft for them, verify their work, or run the task alone."},
 {"id":"run","gap":0.9,"text":"Answering a question about a bill: run. It may do that alone."},
 {"id":"draft","gap":0.9,"text":"Taking a request for more time: draft. It writes the request for a billing officer, and tells the household when they'll hear back."},
 {"id":"inform","gap":0.9,"text":"Telling the officer what the household owes, and has paid: inform."},
 {"id":"none","gap":0.9,"text":"Agreeing the plan: not at all. That stays with the officer."},
 {"id":"verify","gap":0.9,"text":"Checking that the plan follows the hardship rules: verify. It checks, and the officer decides."},
 {"id":"stages","gap":0.9,"text":"How an agent earns more is the AI agents module's Five stages, not a switch."}]},
"name":{"name":"Its own name, and a hand-off","lead":1.0,"tail":1.0,"vo":[
 {"id":"identity","gap":0.9,"text":"It works under its own identity, never a person's: one for each set of rights it needs."},
 {"id":"pair","gap":0.9,"text":"One may read bills. The other may only write requests into billing's queue."},
 {"id":"logs","gap":0.9,"text":"So every log says which agent did what, and it can be stopped on its own."},
 {"id":"hands","gap":0.9,"text":"Its role says when it hands over, and to whom."},
 {"id":"person","gap":0.9,"text":"Anyone who mentions hardship, illness or life support goes to a person, the same day, and the agent says so."}]},
"answers":{"name":"Someone who answers","lead":1.0,"tail":1.0,"vo":[
 {"id":"who","gap":0.9,"text":"Farah asks what the map couldn't say: when the agent is wrong, who answers for it?"},
 {"id":"not","gap":0.9,"text":"Not the vendor, which answers to the utility under its contract. Not Tomás, who draws the map."},
 {"id":"owner","gap":0.9,"text":"The head of retail, who owns the process and set its tasks, answers for it, as for anyone in that team."},
 {"id":"frames","gap":0.9,"text":"AI frameworks, such as NIST's and ISO's, ask the same: clear roles, and people accountable for each AI system.","say":"AI frameworks, such as NIST's and I S O's, ask the same: clear roles, and people accountable for each AI system."},
 {"id":"approve","gap":0.9,"text":"And it never approves. Approving is a person's job."}]},
"all":{"name":"Every agent on the map","lead":1.0,"tail":1.0,"vo":[
 {"id":"each","gap":0.9,"text":"One by one, every agent goes on the map: its role, its tasks and how far, its identity, its hand-off, and who answers."},
 {"id":"crew","gap":0.9,"text":"The crew planner drafts rosters, a supervisor approves them, and Grace answers for it."},
 {"id":"off","gap":0.9,"text":"The vendor's setting that let the chat agree plans is switched off. It drafts them now."},
 {"id":"check","gap":0.9,"text":"With every change, a check runs on the map: no agent without a role, an identity, a hand-off and a person who answers."},
 {"id":"flag","gap":0.9,"text":"The field app's assistant is flagged: its vendor hasn't said which identity it uses."},
 {"id":"plans","gap":0.9,"text":"And the 212 plans? Billing honours every one, refunds the late fees, and calls each household.","say":"And the two hundred and twelve plans? Billing honours every one, refunds the late fees, and calls each household."}]},
"babel":{"name":"Many languages, one plan","lead":1.0,"tail":1.0,"vo":[
 {"id":"story","gap":0.9,"text":"Many scholars think Babylon's tower may have inspired the story of the Tower of Babel, in the Book of Genesis."},
 {"id":"stop","gap":0.9,"text":"In the story, the builders all speak one language, until they can no longer understand each other, and stop building."},
 {"id":"real","gap":0.9,"text":"Babylon's real builders came from many lands, and spoke many languages."},
 {"id":"shared","gap":0.9,"text":"What they shared was the plan: a task for each, and a name that answered for the work."}]},
"end":{"name":"Agents on the map","lead":1.0,"tail":1.0,"vo":[
 {"id":"answer","gap":0.9,"text":"Tomás's note has its answer: each agent in a role of its own, with its tasks, its identity, a hand-off and someone who answers."},
 {"id":"next","gap":0.9,"text":"Next, the platform they all run on."}]}
};
