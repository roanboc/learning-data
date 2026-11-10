// Skills and workflows, the second film of Agents at work on data, the second series on AI agents in data work. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (a year in words). The few longer stops are in breath.js.
const NARR={
"book":{"name":"Completion and balancing","lead":1.6,"tail":1.0,"vo":[
 {"id":"city","gap":0.8,"text":"Baghdad, about twelve hundred years ago."},
 {"id":"sums","gap":0.8,"text":"Every day, its people need sums worked out."},
 {"id":"kinds","gap":0.8,"text":"Estates shared within families, legacies, fields divided, lawsuits, trade, land measured and canals dug."},
 {"id":"law","gap":0.8,"text":"The law sets each heir's share, and a legacy can leave part of an estate to someone outside the family."},
 {"id":"own","gap":0.8,"text":"But each problem is worked out on its own, with its own tricks, and a new kind starts from nothing."},
 {"id":"slip","gap":0.8,"text":"One slip, and a widow or a child could get less than the law gives them."},
 {"id":"two","gap":0.8,"text":"And two reckoners could reach two answers for one estate."},
 {"id":"change","gap":0.8,"text":"Something had to change."},
 {"id":"writes","gap":0.8,"text":"Encouraged by the caliph, Muhammad al-Khwarizmi, a scholar of the House of Wisdom, writes a short book."},
 {"id":"require","gap":0.8,"text":"It teaches what people, in his words, constantly require."},
 {"id":"moves","gap":0.8,"text":"Two moves, completion and balancing, bring any problem to one of six forms."},
 {"id":"steps","gap":0.8,"text":"Each form has its own steps, worked through on an example, and proved with a drawn square."},
 {"id":"ex1","gap":0.8,"text":"A square and ten roots make thirty-nine."},
 {"id":"ex2","gap":0.8,"text":"Halve the ten: five. Multiply it by itself: twenty-five. Add the thirty-nine: sixty-four. Take its root: eight. Take away the five: three."},
 {"id":"cases","gap":0.8,"text":"Then come pages of real cases, legacies most of all."},
 {"id":"anyone","gap":0.8,"text":"Now anyone who follows the steps can solve a problem they've never seen, the same way every time."},
 {"id":"latin","gap":0.8,"text":"The book was copied for centuries, and put into Latin in 1145.","say":"The book was copied for centuries, and put into Latin in eleven forty-five."},
 {"id":"words","gap":0.8,"text":"Its first move, al-jabr, gave us the word algebra; his own name gave us algorithm."},
 {"id":"data","gap":0.8,"text":"Data teams have the same problem: a job solved in one chat is solved again in the next, from nothing."},
 {"id":"reuse","gap":0.8,"text":"Solve it once, write it down, and every agent can reuse it."}
]},
"again":{"name":"Solved again, from nothing","lead":1.0,"tail":1.0,"vo":[
 {"id":"today","gap":0.8,"text":"Today, at the university, Jun's team keeps the census-day count right: 18,412 students, the number the university reports to the government."},
 {"id":"recon","gap":0.8,"text":"Each time the count's code or its sources change, someone reconciles it."},
 {"id":"matches","gap":0.8,"text":"They check that it still matches the census report, the university's official count."},
 {"id":"differ","gap":0.8,"text":"When the two differ, someone has to find out why."},
 {"id":"causes","gap":0.8,"text":"The same few causes come back."},
 {"id":"three","gap":0.8,"text":"Students who withdrew after census day, and still count; a new degree that no faculty holds; a student counted twice."},
 {"id":"found","gap":0.8,"text":"Each was found before, by a person or an agent, and settled by a person."},
 {"id":"stayed","gap":0.8,"text":"But the answer stayed where it was found: in one chat, one note, one email."},
 {"id":"nothing","gap":0.8,"text":"So each time, the agent starts from nothing, and spends an afternoon finding what the team already knew."},
 {"id":"twice","gap":0.8,"text":"And it may settle a cause another way than last time: two answers for one count."}
]},
"skill":{"name":"A skill, earned by hand","lead":1.0,"tail":1.8,"vo":[
 {"id":"hand","gap":0.8,"text":"So Jun does the job once more, by hand, and writes down each step as he goes."},
 {"id":"file","gap":0.8,"text":"It becomes a skill: a file in the project, with a name, and a line that says when to use it."},
 {"id":"steps","gap":0.8,"text":"Then its steps: build the count, and compare it with the census report."},
 {"id":"behind","gap":0.8,"text":"Find the students behind any difference, and report each cause with its query."},
 {"id":"causes","gap":0.8,"text":"And then every cause met so far: how it shows, what settled it, and who decided."},
 {"id":"loads","gap":0.8,"text":"The agent doesn't read every skill all the time: just each one's name and line. It loads the steps only when a job needs them."},
 {"id":"grows","gap":0.8,"text":"When a new case turns up, it gets a line too. Nothing is solved twice."},
 {"id":"book","gap":0.8,"text":"It's al-Khwarizmi's book again: each form's steps, earned on real cases."}
]},
"router":{"name":"A router picks the skill","lead":1.0,"tail":1.4,"vo":[
 {"id":"seven","gap":0.8,"text":"The project has seven skills, one for each job agents do most here."},
 {"id":"which","gap":0.8,"text":"So which one does a job need?"},
 {"id":"router","gap":0.8,"text":"A router decides: a skill whose only job is to choose."},
 {"id":"reads","gap":0.8,"text":"It reads the job, compares it with each skill's line, and loads the one that fits."},
 {"id":"check","gap":0.8,"text":"Check Jun's change before Noor signs it off: reconcile and diff."},
 {"id":"none","gap":0.8,"text":"When no skill fits, it doesn't guess: it says so, and asks a person."},
 {"id":"next","gap":0.8,"text":"That job is done by hand first, and may become the next skill."},
 {"id":"forms","gap":0.8,"text":"Completion and balancing did the same: they brought each problem to the one form whose steps would solve it."}
]},
"workflow":{"name":"A workflow runs what's known","lead":1.0,"tail":1.0,"vo":[
 {"id":"night","gap":0.8,"text":"Some work needs no choosing. Every night, the count is built again from the day's records."},
 {"id":"fixed","gap":0.8,"text":"A workflow runs it: fixed steps, in order, the same way every time."},
 {"id":"list","gap":0.8,"text":"Build. Count as on census day. Run the tests. Compare with the census report."},
 {"id":"agree","gap":0.8,"text":"When they agree, that's the whole job, and no agent is needed."},
 {"id":"rule","gap":0.8,"text":"Automate what's known with plain steps first; keep the agent for what isn't."},
 {"id":"call","gap":0.8,"text":"Only when the numbers don't agree does the workflow call the agent, as one more step, with the reconcile skill."},
 {"id":"person","gap":0.8,"text":"The agent finds out why. A person decides."},
 {"id":"book","gap":0.8,"text":"In the book, too, a form's steps never change. The thinking is in bringing each problem to its form."}
]},
"night":{"name":"One night, a new case","lead":1.0,"tail":1.0,"vo":[
 {"id":"one","gap":0.8,"text":"One night in October, the numbers don't agree: 18,426 against 18,412."},
 {"id":"tests","gap":0.8,"text":"The tests pass, so the workflow calls the agent."},
 {"id":"loads","gap":0.8,"text":"It loads the reconcile skill, and checks the causes met so far, one by one. None fits."},
 {"id":"finds","gap":0.8,"text":"So it finds the records behind the difference: fourteen, all made last week, and all dated back to February."},
 {"id":"drafts","gap":0.8,"text":"In its sandbox, it drafts a report: the cause, the query that shows it, and a question. Are these students?"},
 {"id":"mei","gap":0.8,"text":"In the morning, Mei, in the registrar's office, decides: they're test records, made to try a new screen, and test records never count."},
 {"id":"adds","gap":0.8,"text":"Jun adds the cause to the skill, with Mei's answer, and turns the rule into one more fixed step, with a test."},
 {"id":"noor","gap":0.8,"text":"Noor approves the change before it runs."},
 {"id":"next","gap":0.8,"text":"The next night, the workflow leaves the fourteen out by itself, and calls no agent."}
]},
"close":{"name":"Solve it once","lead":1.0,"tail":1.0,"vo":[
 {"id":"baghdad","gap":0.8,"text":"In Baghdad, al-Khwarizmi solved each kind of problem once, wrote it down, and people followed his steps for centuries."},
 {"id":"uni","gap":0.8,"text":"At the university, a job done once by hand became a skill. A router finds it. A workflow runs what's known, the same way every night."},
 {"id":"agent","gap":0.8,"text":"The agent is called only where thinking is needed, and a person decides."},
 {"id":"new","gap":0.8,"text":"Each new case is written down, so it's never solved twice."},
 {"id":"once","gap":0.8,"text":"Solve it once, write it down, reuse it."}
]}
};
