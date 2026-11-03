// A model, reasoning, hands and a loop, the second film of What an agent is, the first series on AI agents in data work. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (dates in words). The few longer stops are in breath.js.
const NARR={
"off":{"name":"Hands off","lead":1.6,"tail":1.0,"vo":[
 {"id":"date","gap":0.8,"text":"On the 18th of June, 1914, crowds line the River Seine, just outside Paris, for a contest to make aeroplanes safer.","say":"On the eighteenth of June, nineteen fourteen, crowds line the River Seine, just outside Paris, for a contest to make aeroplanes safer."},
 {"id":"last","gap":0.8,"text":"Last to fly is Lawrence Sperry, a young American, with his French mechanic, Emil Cachin."},
 {"id":"hard","gap":0.8,"text":"Flying is hard, tiring work."},
 {"id":"gust","gap":0.8,"text":"When a gust tips a wing, the pilot has to level it again, at once, all through the flight."},
 {"id":"ache","gap":0.8,"text":"On a long flight, his arms and back ache."},
 {"id":"fall","gap":0.8,"text":"And if he's tired, or slow, a tipped aeroplane can slip sideways, and fall."},
 {"id":"change","gap":0.8,"text":"Something has to change."},
 {"id":"box","gap":0.8,"text":"Sperry's answer is a box of four gyroscopes: wheels that spin so fast they keep pointing the same way, however the aeroplane moves."},
 {"id":"feels","gap":0.8,"text":"Each time the aeroplane tips, the box feels it, and pistons driven by air level it again."},
 {"id":"hands","gap":0.8,"text":"Over the river, Sperry lets go, and raises his hands."},
 {"id":"wing","gap":0.8,"text":"Cachin climbs out along the wing."},
 {"id":"dips","gap":0.8,"text":"The aeroplane dips under his weight, and the box brings it back."},
 {"id":"prize","gap":0.8,"text":"The judges give Sperry first prize, and now a pilot can let go, and rest."},
 {"id":"auto","gap":0.8,"text":"His box grew into the autopilot: today, airline pilots fly by hand for only a few minutes of a typical flight."},
 {"id":"seats","gap":0.8,"text":"And they stay in their seats, to watch, and decide."},
 {"id":"nomodel","gap":0.8,"text":"Sperry's box has hands, a check and a loop, but no model: it does one known job, the same way every time."},
 {"id":"agent","gap":0.8,"text":"Put a model that reasons inside that loop, and you have an agent."}
]},
"question":{"name":"Jun's question","lead":1.0,"tail":1.0,"vo":[
 {"id":"today","gap":0.8,"text":"Today, at the university, Planning asks Jun how the census-day count has changed since last year."},
 {"id":"census","gap":0.8,"text":"Census day, the 31st of March, is when the university counts who is studying.","say":"Census day, the thirty-first of March, is when the university counts who is studying."},
 {"id":"byhand","gap":0.8,"text":"By hand, that's an afternoon of small corrections: find the tables, read the rules, query, check, fix."},
 {"id":"gives","gap":0.8,"text":"So Jun gives it to an agent, which takes the steps and checks its own work, while he reviews and decides."}
]},
"writes":{"name":"A model writes","lead":1.0,"tail":1.0,"vo":[
 {"id":"four","gap":0.8,"text":"An agent has four parts, and the first is a model."},
 {"id":"learned","gap":0.8,"text":"It has learned from a vast amount of writing, and it writes what's likely to come next."},
 {"id":"guess","gap":0.8,"text":"Ask it for the census-day count, and the best it can write is a guess: it has never seen the university's records."},
 {"id":"alone","gap":0.8,"text":"On its own, a model can't look anything up, or check what it wrote."}
]},
"reasons":{"name":"Reasoning","lead":1.0,"tail":1.0,"vo":[
 {"id":"second","gap":0.8,"text":"The second part is reasoning."},
 {"id":"plan","gap":0.8,"text":"Before it acts, the model writes out a plan: find the tables, count the students, and check the total against the census report, the university's official count."},
 {"id":"rules","gap":0.8,"text":"It checks the plan against the rules Jun's team gave it: only the university's tools, only reading, and evidence for every answer."},
 {"id":"result","gap":0.8,"text":"It reads each result as feedback, and changes the plan if it must."},
 {"id":"is","gap":0.8,"text":"Reasoning is feedback, and checks against rules."}
]},
"hands":{"name":"Hands","lead":1.0,"tail":1.0,"vo":[
 {"id":"third","gap":0.8,"text":"The third part is hands: a model can't open a table, but tools can."},
 {"id":"three","gap":0.8,"text":"Jun's agent has three: Catalog, which lists the tables; Query, which reads the data; and Docs, with the university's definitions."},
 {"id":"server","gap":0.8,"text":"Each comes from a tool server: a small program that offers it to agents."},
 {"id":"mcp","gap":0.8,"text":"They plug in through an open standard, the Model Context Protocol, so any agent that follows it can use them."},
 {"id":"read","gap":0.8,"text":"Reading is all this job needs, so these three can only read: their account can't change a single row."}
]},
"loop":{"name":"A loop","lead":1.0,"tail":1.0,"vo":[
 {"id":"fourth","gap":0.8,"text":"The fourth part is a loop: plan, act, check, and round again, until the goal is met."},
 {"id":"counts","gap":0.8,"text":"The agent finds the students' table in Catalog, and counts with Query."},
 {"id":"short","gap":0.8,"text":"Then the check: its total is 476 short of the census report."},
 {"id":"today","gap":0.8,"text":"The model reads that feedback: did it count the students as they are today?"},
 {"id":"rule","gap":0.8,"text":"It reads the census rule in Docs: count each student as their record stood on census day."},
 {"id":"again","gap":0.8,"text":"A new query, with that date, gives 18,412."},
 {"id":"passes","gap":0.8,"text":"Its total matches the census report, and the check passes."},
 {"id":"unlike","gap":0.8,"text":"Unlike Sperry's box, which can only push back, the model decides what to try next."},
 {"id":"stops","gap":0.8,"text":"The loop stops when the checks pass, at its limit of tries, or when it needs a person."}
]},
"answer":{"name":"The answer, with its evidence","lead":1.0,"tail":1.0,"vo":[
 {"id":"brings","gap":0.8,"text":"The agent brings Jun its answer: 18,412 students on census day, 454 more than last year."},
 {"id":"evid","gap":0.8,"text":"And its evidence: the tables it read, the rule, both queries, and the check that failed, then passed."},
 {"id":"decides","gap":0.8,"text":"Its check is evidence, not approval: Jun reads it, and decides what goes to Planning."}
]},
"script":{"name":"A plain script","lead":1.0,"tail":1.0,"vo":[
 {"id":"march","gap":0.8,"text":"Next March, Planning will want the same count, and now the steps are known."},
 {"id":"recipe","gap":0.8,"text":"So Jun saves the query as a recipe in the project, with a test against the census report, and Noor approves it."},
 {"id":"runs","gap":0.8,"text":"Every census day, it runs in seconds, for almost nothing, the same way every time, like Sperry's box."},
 {"id":"took","gap":0.8,"text":"The agent took four minutes and twelve steps. A plain rerun needs no agent."},
 {"id":"web","gap":0.8,"text":"An agent can also take the long way: one of the team's agents once searched the web for the census rules, though Docs had them, because its plan didn't name its tools."},
 {"id":"names","gap":0.8,"text":"Now each plan names its tools, and gives the agent only those the job needs."},
 {"id":"known","gap":0.8,"text":"Where the steps can be written down, let a plain script run them."},
 {"id":"keep","gap":0.8,"text":"Keep agents for the work whose steps nobody can write in advance."}
]},
"seat":{"name":"Back in the seat","lead":1.0,"tail":1.0,"vo":[
 {"id":"held","gap":0.8,"text":"Sperry's box held the aeroplane level, the one job it knew, while the pilot stayed in his seat."},
 {"id":"took","gap":0.8,"text":"Jun's agent took the steps of a new question, and brought him the evidence to decide."},
 {"id":"is","gap":0.8,"text":"An agent is a model that reasons, with hands, in a loop."},
 {"id":"only","gap":0.8,"text":"Use one only where a plain script can't do the job."}
]}
};
