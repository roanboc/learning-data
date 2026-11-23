// Business architecture for data · Now the questions appear. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"trial":{"name":"A trial well","lead":1.4,"tail":1.0,"vo":[
 {"id":"edge","gap":0.8,"text":"Iran, in the 1960s. New qanats are still being dug, tunnels that bring water from under the mountains."},
 {"id":"survey","gap":0.8,"text":"An expert walks the slopes in autumn, looking for a damp patch, or greener plants, where water might be."},
 {"id":"cost","gap":0.8,"text":"A qanat ten kilometres long costs $13,500 to $34,000 to build.","say":"A qanat ten kilometres long costs thirteen and a half to thirty-four thousand dollars to build."},
 {"id":"sure","gap":0.8,"text":"And until it's finished, no one can be sure it will flow all year."},
 {"id":"need","gap":0.8,"text":"Dug to a trickle, it would leave the fields dry, and the money gone."},
 {"id":"know","gap":0.8,"text":"Before they pay, the builders need to know: is there water enough here?"},
 {"id":"trial","gap":0.8,"text":"So two diggers, the muqannis, sink a trial well, and the earth comes up in leather buckets."},
 {"id":"dip","gap":0.8,"text":"At damp ground, they scoop out a hollow, and for the next few days, dip the buckets in, to measure how fast the water gathers."},
 {"id":"trickle","gap":0.8,"text":"More than a trickle means real groundwater. Only then is the tunnel dug."},
 {"id":"act","gap":0.8,"text":"The question was how fast the water comes. It mattered because the builders would act on the answer, by choosing whether to dig."},
 {"id":"time","gap":0.8,"text":"The trial well brought that answer in time."},
 {"id":"repaid","gap":0.8,"text":"Their money went where the water was, and a qanat repaid them well: ten to twenty-five percent, in crops and water sold."}]},
"backlog":{"name":"The backlog, read again","lead":1.0,"tail":1.0,"vo":[
 {"id":"note","gap":0.8,"text":"Tomás's note asks which questions matter."},
 {"id":"pile","gap":0.8,"text":"On day one, the reporting team handed him their backlog: forty-two requests for reports, dashboards and extracts, most of them marked urgent."},
 {"id":"test","gap":0.8,"text":"Then, he couldn't tell which mattered. Now there's a map, and a trial well for every request, before anything is built: who will decide what with the answer, and when?"}]},
"up":{"name":"Up from a request","lead":1.0,"tail":1.0,"vo":[
 {"id":"first","gap":0.8,"text":"The first asks which lines fail most often. Grace's planners need it every spring, to decide which lines to renew first."},
 {"id":"climb","gap":0.8,"text":"That decision belongs to maintaining assets, and it serves a goal: replace assets before they fail. The request reaches the top."},
 {"id":"lobby","gap":0.8,"text":"The next asks for a dashboard of every outage, refreshed every minute, for the screen in the lobby."},
 {"id":"live","gap":0.8,"text":"It's never out of date, but who decides what with it? No one. It reaches nothing."}]},
"half":{"name":"Half of them","lead":1.0,"tail":1.0,"vo":[
 {"id":"all","gap":0.8,"text":"He traces all forty-two. Twenty-one reach a decision and a goal. Some get there through an obligation: the regulator decides with them."},
 {"id":"none","gap":0.8,"text":"The other twenty-one reach nothing: a report someone needed once, a dashboard nobody acts on, an export nobody can explain."},
 {"id":"back","gap":0.8,"text":"Each goes back to whoever asked for it, with one question: what would you decide with it?"}]},
"down":{"name":"Down from a goal","lead":1.0,"tail":1.0,"vo":[
 {"id":"way","gap":0.8,"text":"Now the other way, from the top. A goal implies decisions. A decision needs questions answered. A question needs a measure."},
 {"id":"gqm","gap":0.8,"text":"It's Goal, Question, Metric, a method from the 1980s, with a decision added.","say":"It's Goal, Question, Metric, a method from the nineteen eighties, with a decision added."},
 {"id":"better","gap":0.8,"text":"Take replacing assets before they fail. Its outcome said only a better network, and nobody could check that."},
 {"id":"measure","gap":0.8,"text":"Its decision is which lines to renew first, and its question is the one the planners asked."},
 {"id":"unit","gap":0.8,"text":"The measure: interruptions per customer, per year, line by line."},
 {"id":"meet","gap":0.8,"text":"From the top and from the bottom, they meet at one decision. Now the goal can be checked."}]},
"missing":{"name":"A goal with no measure","lead":1.0,"tail":1.0,"vo":[
 {"id":"afford","gap":0.8,"text":"Keeping bills affordable has a measure for the network charge, but none for the people who pay it."},
 {"id":"behind","gap":0.8,"text":"Retail decides whom to offer help, before a household falls too far behind. Its question: how many are falling behind?"},
 {"id":"register","gap":0.8,"text":"The hardship register counts only those already getting help."},
 {"id":"farah","gap":0.8,"text":"Farah, who speaks for customers, has asked for that number for years. A goal without a measure can't be steered."}]},
"count":{"name":"What counts","lead":1.0,"tail":1.0,"vo":[
 {"id":"two","gap":0.8,"text":"Connecting renewable power does have a measure: new solar connected within ten working days."},
 {"id":"disagree","gap":0.8,"text":"Two reports count it, and disagree: thirty-four days, and twenty-one."},
 {"id":"clock","gap":0.8,"text":"They start and stop the clock at different moments. Both are right. Neither is the measure."},
 {"id":"define","gap":0.8,"text":"So Grace writes one definition down: from a complete application to the new meter, in working days, Monday to Friday, not public holidays."},
 {"id":"same","gap":0.8,"text":"Now everyone who counts it gets the same number."}]},
"home":{"name":"A home and an owner","lead":1.0,"tail":1.0,"vo":[
 {"id":"home","gap":0.8,"text":"Each measure gets a home on the map: the capability whose work it measures."},
 {"id":"homes","gap":0.8,"text":"Interruptions, under maintaining assets. Days to connect, under connecting customers. Households falling behind, under serving customers."},
 {"id":"owner","gap":0.8,"text":"And each gets that capability's owner: Grace for the first two, the head of retail for the third."},
 {"id":"means","gap":0.8,"text":"An owner says what the number means, and acts when it moves."}]},
"build":{"name":"By capability, not by request","lead":1.0,"tail":1.0,"vo":[
 {"id":"reports","gap":0.8,"text":"Now, what to build. Twenty-one requests could become twenty-one reports, each kept by someone different."},
 {"id":"group","gap":0.8,"text":"Grouped by capability, and by the domain they belong to, they need four data products: three on the network's side of the wall, one on retail's."},
 {"id":"each","gap":0.8,"text":"Each answers many questions, has one owner, and stays on its own side of the wall."}]},
"well":{"name":"Back at the trial well","lead":1.0,"tail":1.0,"vo":[
 {"id":"back","gap":0.8,"text":"Back at the trial well, the builders' question traces the same way."},
 {"id":"goal","gap":0.8,"text":"A goal: water for the fields, all year. A decision: whether to dig the tunnel here, made by the builders before they pay."},
 {"id":"measure","gap":0.8,"text":"A question: how fast does the water come? And a measure: how fast the hollow fills, day by day."},
 {"id":"reach","gap":0.8,"text":"Every part was there, so the answer reached the people who would act on it, in time."}]},
"end":{"name":"Questions that matter","lead":1.0,"tail":1.0,"vo":[
 {"id":"confirm","gap":0.8,"text":"Grace confirms her measures and their definitions. The third goes to the head of retail, as a draft."},
 {"id":"answer","gap":0.8,"text":"Tomás's note has an answer: the questions that matter are the ones someone will act on, in time, traced to a goal, with a measure and an owner."},
 {"id":"next","gap":0.8,"text":"But a measure is only as true as the data beneath it, and the rules that data must keep. Next: where each rule belongs."}]}
};
