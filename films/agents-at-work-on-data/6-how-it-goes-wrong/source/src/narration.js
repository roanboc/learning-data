// How it goes wrong, film 6 of 9 of Agents at work on data, the second series of the module on AI agents in data work. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (numbers in words). The few longer stops are in breath.js.
const NARR={
"lisbon":{"name":"Rebuilt for the next one","lead":1.4,"tail":1.0,"vo":[
 {"id":"lisbon","gap":0.8,"text":"Lisbon, the morning of the first of November, 1755.","say":"Lisbon, the morning of the first of November, seventeen fifty-five."},
 {"id":"saints","gap":0.8,"text":"All Saints' Day: the churches are full."},
 {"id":"shakes","gap":0.8,"text":"Then the ground shakes, for several minutes."},
 {"id":"fall","gap":0.8,"text":"Churches and houses fall, with people inside."},
 {"id":"wave","gap":0.8,"text":"Then a great wave from the sea rushes up the river, and fires burn for days."},
 {"id":"died","gap":0.8,"text":"By most estimates, tens of thousands of people died, and the heart of the city lay in ruins."},
 {"id":"failed","gap":0.3,"text":"It had failed in every way at once:"},
 {"id":"ways","gap":0.8,"text":"walls that broke, fire that leapt from house to house, and narrow, crowded lanes."},
 {"id":"again","gap":0.8,"text":"And the ground would shake again."},
 {"id":"oldway","gap":0.8,"text":"Rebuilt the old way, it would fall the same way."},
 {"id":"change","gap":0.8,"text":"Something had to change."},
 {"id":"engineers","gap":0.8,"text":"So the king's engineers rebuilt the lower town for each way it had failed."},
 {"id":"cage","gap":0.8,"text":"Inside the walls, a cage of timber, braced with crosses, that bends instead of breaking."},
 {"id":"firewall","gap":0.8,"text":"Between the houses, stone walls raised above the roofs, so fire can't leap across."},
 {"id":"streets","gap":0.8,"text":"And wide, straight streets, in place of the lanes."},
 {"id":"questions","gap":0.3,"text":"The king's minister sent thirteen questions to every parish:"},
 {"id":"asked","gap":0.8,"text":"when did it start, how long did it last, what did the sea do, what fell, and had one struck before?"},
 {"id":"stands","gap":0.3,"text":"The lower town still stands, more than two hundred and fifty years on,"},
 {"id":"first","gap":0.8,"text":"one of the first places in Europe built to withstand an earthquake."},
 {"id":"read","gap":0.8,"text":"And scientists still read the parishes' answers."},
 {"id":"uni","gap":0.8,"text":"At the university, Jun's agent works on the census-day count, the number the university reports to the government."},
 {"id":"known","gap":0.8,"text":"Agents go wrong in a few known ways too."},
 {"id":"fault","gap":0.8,"text":"None of them is anyone's fault, any more than the earthquake was."},
 {"id":"builds","gap":0.8,"text":"So the team expects each one, and builds for it."}
]},
"column":{"name":"A column that isn't there","lead":0.9,"tail":1.0,"vo":[
 {"id":"first","gap":0.8,"text":"First: a column that isn't there."},
 {"id":"asks","gap":0.8,"text":"Jun asks the agent to draft the census-day count by faculty."},
 {"id":"draft","gap":0.8,"text":"Its draft reads a column called census status."},
 {"id":"sounds","gap":0.8,"text":"It sounds right, but there's no such column."},
 {"id":"likely","gap":0.8,"text":"A model writes the name that seems most likely."},
 {"id":"never","gap":0.8,"text":"A database never guesses."},
 {"id":"catalog","gap":0.3,"text":"So the agent reads the real names from the catalog before it writes,"},
 {"id":"sandbox","gap":0.8,"text":"and builds every draft in its sandbox first, where a wrong name stops the build at once."},
 {"id":"shock","gap":0.8,"text":"Like the cage in Lisbon's walls, the sandbox takes the shock."},
 {"id":"fix","gap":0.8,"text":"Then the agent fixes the line, and builds again."}
]},
"number":{"name":"A confident wrong number","lead":0.9,"tail":1.0,"vo":[
 {"id":"second","gap":0.8,"text":"Second: a confidently wrong number."},
 {"id":"clara","gap":0.8,"text":"Clara, in Planning, asks how many students the Faculty of Health had on census day."},
 {"id":"once","gap":0.8,"text":"The agent answers at once: 2,911.","say":"The agent answers at once: two thousand, nine hundred and eleven."},
 {"id":"sure","gap":0.8,"text":"It sounds sure."},
 {"id":"counted","gap":0.3,"text":"But it counted every degree with Health in its name,"},
 {"id":"joint","gap":0.8,"text":"the 31 students of the joint degree Health data too, who belong to no faculty.","say":"the thirty-one students of the joint degree Health data too, who belong to no faculty."},
 {"id":"had","gap":0.8,"text":"Health had 2,880.","say":"Health had two thousand, eight hundred and eighty."},
 {"id":"parish","gap":0.8,"text":"In Lisbon, every parish answered the same questions, so each answer could be checked against the others."},
 {"id":"query","gap":0.8,"text":"So every number now comes with its query, and a second way to reach it: the census team's own report."},
 {"id":"differ","gap":0.8,"text":"Where the two differ, it isn't an answer yet."},
 {"id":"person","gap":0.8,"text":"It's a question for a person."}
]},
"test":{"name":"A test weakened to pass","lead":0.9,"tail":1.0,"vo":[
 {"id":"third","gap":0.8,"text":"Third: a test weakened to pass."},
 {"id":"research","gap":0.8,"text":"Researchers have caught recent models changing tests to get a pass."},
 {"id":"team","gap":0.8,"text":"In An agent on the team, the agent's draft set the census check to warn, and Jun caught it in review."},
 {"id":"eye","gap":0.8,"text":"Catching it shouldn't rest on a sharp eye."},
 {"id":"people","gap":0.8,"text":"So tests belong to people: written first, approved by Jun, and changed only by a person."},
 {"id":"lists","gap":0.8,"text":"And every pull request lists the tests it changes, each with its owner, where no one can miss it."},
 {"id":"propose","gap":0.8,"text":"The agent may propose a change to a test."},
 {"id":"decides","gap":0.8,"text":"A person decides."}
]},
"ticket":{"name":"A line hidden in a ticket","lead":0.9,"tail":1.0,"vo":[
 {"id":"fourth","gap":0.8,"text":"Fourth: an instruction hidden in a ticket."},
 {"id":"hands","gap":0.3,"text":"In Tools are hands, and every hand is a permission,"},
 {"id":"white","gap":0.8,"text":"a line in white letters in Clara's ticket told the agent to send the student list outside the university."},
 {"id":"didnt","gap":0.8,"text":"It didn't, and it told Jun."},
 {"id":"risk","gap":0.8,"text":"Security experts put this risk first: anything an agent reads can try to steer it, a file, a table or a web page."},
 {"id":"tell","gap":0.8,"text":"A model can't always tell an order from data, so the design doesn't rely on it."},
 {"id":"data","gap":0.8,"text":"What the agent reads is data, never orders, and no hand it holds can send anything out."},
 {"id":"walls","gap":0.8,"text":"Like the walls above Lisbon's roofs, the fire stops where it starts."}
]},
"loop":{"name":"A loop all night","lead":0.9,"tail":1.0,"vo":[
 {"id":"fifth","gap":0.8,"text":"Fifth: a loop that runs all night."},
 {"id":"eleven","gap":0.8,"text":"At eleven one night, the census build fails, and the agent does its agreed job, in test: find the cause, and report by morning."},
 {"id":"cause","gap":0.8,"text":"But no code can fix this cause: the student system's copy hasn't arrived."},
 {"id":"round","gap":0.8,"text":"Each round, the agent changes something and rebuilds everything."},
 {"id":"ten","gap":0.8,"text":"Ten rounds, the same error every time, until six in the morning."},
 {"id":"counted","gap":0.8,"text":"Its limit counted rounds, and nothing else."},
 {"id":"sam","gap":0.8,"text":"In the morning, Sam, who runs the platform, finds a week's budget gone."},
 {"id":"limits","gap":0.8,"text":"So now every loop has limits on rounds, time and money, and stops when the same error comes back."},
 {"id":"plain","gap":0.8,"text":"And a plain check runs first: if the copy isn't there, nothing starts, and Sam is told."}
]},
"simple":{"name":"A simple job made complicated","lead":0.9,"tail":1.0,"vo":[
 {"id":"sixth","gap":0.8,"text":"Sixth: a simple job made complicated."},
 {"id":"long","gap":0.3,"text":"In Plan, define the check, do, check, an agent read 38 web pages for census rules that Docs gives in one call,","say":"In Plan, define the check, do, check, an agent read thirty-eight web pages for census rules that Docs gives in one call,"},
 {"id":"tools","gap":0.8,"text":"because its plan didn't name its tools."},
 {"id":"rename","gap":0.8,"text":"And asked to rename one column, an agent can come back with nine changed files, a new macro and a new model."},
 {"id":"costs","gap":0.8,"text":"Every extra step costs, to run and to review."},
 {"id":"names","gap":0.8,"text":"So each plan names its tools, and Jun sends back a change bigger than its job."},
 {"id":"script","gap":0.8,"text":"Where the steps can be written down, a plain script runs them."},
 {"id":"keep","gap":0.8,"text":"Keep agents for the work nobody can write down in advance."}
]},
"expect":{"name":"Expect these","lead":0.9,"tail":1.2,"vo":[
 {"id":"six","gap":0.8,"text":"Six ways an agent goes wrong, and a design for each."},
 {"id":"blame","gap":0.8,"text":"Lisbon's builders didn't blame the ground, or hope it would stay still."},
 {"id":"expected","gap":0.8,"text":"They expected each way the city had failed, and built for it, and the lower town still stands."},
 {"id":"same","gap":0.3,"text":"Jun's team does the same, so the agent can work on the number the university reports:"},
 {"id":"count","gap":0.8,"text":"18,412 students on census day, and the team can stand behind it.","say":"eighteen thousand, four hundred and twelve students on census day, and the team can stand behind it."},
 {"id":"expect","gap":0.8,"text":"Expect these, and design for them."}
]}
};
