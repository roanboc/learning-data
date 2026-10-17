// The map before the data · Now the questions appear. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"kerala":{"name":"Where to land","lead":1.4,"tail":1.0,"vo":[
 {"id":"coast","gap":0.8,"text":"Kerala, on India's south-west coast, a January morning in 1997."},
 {"id":"markets","gap":0.8,"text":"Sardine boats head for the beach markets with their catch. The markets close by eight, and a boat can reach only one."},
 {"id":"dump","gap":0.8,"text":"At Badagara, eleven crews find no buyers, and their catch goes back into the sea. Within fifteen kilometres, twenty-seven buyers leave with no fish."},
 {"id":"phones","gap":0.8,"text":"Within weeks, mobile phones reach the coast. At sea, a skipper calls buyers in several markets, agrees a price, and only then chooses where to land."},
 {"id":"spread","gap":0.8,"text":"As the phones spread, the waste stopped, and prices along the coast evened out."},
 {"id":"act","gap":0.8,"text":"The question was always the same: where should we land? What changed is that the answer reached someone who could still act on it."}]},
"backlog":{"name":"The backlog, read again","lead":1.0,"tail":1.0,"vo":[
 {"id":"note","gap":0.8,"text":"Tomás's note asks which questions matter."},
 {"id":"pile","gap":0.8,"text":"On day one, the reporting team handed him their backlog: forty-two requests for reports, dashboards and extracts, most of them marked urgent."},
 {"id":"test","gap":0.8,"text":"Then, he couldn't tell which mattered. Now there's a map, and one test for every request: who will decide what with the answer, and when?"}]},
"up":{"name":"Up from a request","lead":1.0,"tail":1.0,"vo":[
 {"id":"first","gap":0.8,"text":"The first asks which lines fail most often. Grace's planners need it every spring, to decide which lines to renew first."},
 {"id":"climb","gap":0.8,"text":"That decision belongs to maintaining assets, and it serves a goal: replace assets before they fail. The request reaches the top."},
 {"id":"lobby","gap":0.8,"text":"The next asks for a dashboard of every outage, refreshed every minute, for the screen in the lobby. Who decides what with it? No one. It reaches nothing."}]},
"half":{"name":"Half of them","lead":1.0,"tail":1.0,"vo":[
 {"id":"all","gap":0.8,"text":"He traces all forty-two. Twenty-one reach a decision and a goal. Some get there through an obligation: the regulator decides with them."},
 {"id":"none","gap":0.8,"text":"The other twenty-one reach nothing: a report someone needed once, a dashboard nobody acts on, an export nobody can explain."},
 {"id":"back","gap":0.8,"text":"Each goes back to whoever asked for it, with one question: what would you decide with it?"}]},
"down":{"name":"Down from a goal","lead":1.0,"tail":1.0,"vo":[
 {"id":"way","gap":0.8,"text":"Now the other way, from the top. A goal implies decisions. A decision needs questions answered. A question needs a measure."},
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
"end":{"name":"Questions that matter","lead":1.0,"tail":1.0,"vo":[
 {"id":"confirm","gap":0.8,"text":"Grace confirms her measures and their definitions. The third goes to the head of retail, as a draft."},
 {"id":"answer","gap":0.8,"text":"Tomás's note has an answer: the questions that matter are the ones someone will act on, in time, traced to a goal, with a measure and an owner."},
 {"id":"next","gap":0.8,"text":"But a measure is only as true as the data beneath it, and the rules that data must keep. Next: where each rule belongs."}]}
};
