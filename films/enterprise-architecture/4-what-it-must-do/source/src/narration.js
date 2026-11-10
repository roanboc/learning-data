// The map before the data · What it must be able to do. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"runners":{"name":"The runners","lead":1.4,"tail":1.0,"vo":[
 {"id":"roads","gap":0.8,"text":"In the Andes, in the 1400s, the Inca sent messages across their empire on foot.","say":"In the Andes, in the fourteen hundreds, the Inca sent messages across their empire on foot."},
 {"id":"posts","gap":0.8,"text":"Every few kilometres along the roads stood a small post, and a runner waited there: a chasqui."},
 {"id":"passed","gap":0.8,"text":"Each ran his stretch, then passed the message on: spoken, or knotted into cords called khipu."},
 {"id":"day","gap":0.8,"text":"Relay by relay, a message could travel more than two hundred kilometres in a day."},
 {"id":"turn","gap":0.8,"text":"Runners served their turn and went home. Roads were mended and rebuilt."},
 {"id":"lasted","gap":0.8,"text":"What lasted was an ability: to move a message across the empire, whoever carried it."}]},
"orgchart":{"name":"A familiar map","lead":1.0,"tail":1.0,"vo":[
 {"id":"note","gap":0.8,"text":"Tomás's next note asks what the utility must be able to do."},
 {"id":"start","gap":0.8,"text":"He starts where most people start: with the org chart."},
 {"id":"boxes","gap":0.8,"text":"Network Operations. Customer Service. Finance. Technology. Regulatory Affairs."},
 {"id":"each","gap":0.8,"text":"Each box becomes a capability, and the map is done in an hour."},
 {"id":"again","gap":0.8,"text":"It looks complete. It's the org chart again."}]},
"who":{"name":"A team is who","lead":1.0,"tail":1.0,"vo":[
 {"id":"grace","gap":0.8,"text":"Grace, who owns network operations, reads it."},
 {"id":"team","gap":0.8,"text":"\"Network Operations is my team,\" she says. \"Two years ago, it was two teams. Next year, it may be part of another.\""},
 {"id":"changes","gap":0.8,"text":"The org chart changes. What the network must be able to do doesn't."},
 {"id":"whoever","gap":0.8,"text":"A team is who does the work. A capability is what must be done, whoever does it."}]},
"how":{"name":"Not how, not with what","lead":1.0,"tail":1.0,"vo":[
 {"id":"tries","gap":0.8,"text":"Tomás tries again, and walks into two more traps."},
 {"id":"system","gap":0.8,"text":"\"Run the outage system\" names a system. It says with what."},
 {"id":"process","gap":0.8,"text":"\"Dispatch through the control room\" names a process. It says how."},
 {"id":"under","gap":0.8,"text":"Under both is one ability: manage outages."},
 {"id":"test","gap":0.8,"text":"A capability survives a restructure, a new system and a new process. If a box wouldn't, it isn't one."}]},
"levels":{"name":"Three levels","lead":1.0,"tail":1.0,"vo":[
 {"id":"lay","gap":0.8,"text":"Grace helps him lay them out in levels."},
 {"id":"one","gap":0.8,"text":"Level one is the whole utility: eight boxes, with the support ones beneath."},
 {"id":"two","gap":0.8,"text":"Level two opens one of them. Operating the network means monitoring it, controlling it and managing outages."},
 {"id":"three","gap":0.8,"text":"Level three opens one more. Managing outages means finding faults, dispatching crews, restoring supply and keeping customers informed."},
 {"id":"stop","gap":0.8,"text":"Three levels are enough to talk about. Deeper, and nobody reads it."}]},
"owners":{"name":"An owner for each","lead":1.0,"tail":1.0,"vo":[
 {"id":"each","gap":0.8,"text":"Next, an owner for each: one person who answers for it."},
 {"id":"grace","gap":0.8,"text":"Grace takes the network's. Ama takes meeting the utility's obligations."},
 {"id":"retail","gap":0.8,"text":"The head of retail takes selling energy and serving customers."},
 {"id":"none","gap":0.8,"text":"Generating power has no owner yet. Until someone answers for it, it's a guess."},
 {"id":"person","gap":0.8,"text":"An owner is a person, not a team: someone who can say, yes, that's right."}]},
"heat":{"name":"Where it hurts","lead":1.0,"tail":1.0,"vo":[
 {"id":"now","gap":0.8,"text":"Now the map can show where it hurts."},
 {"id":"colour","gap":0.8,"text":"They colour each capability by how well it works today, with evidence, like every note on the wall."},
 {"id":"operate","gap":0.8,"text":"Operating the network: green. Faults are found and fixed within target."},
 {"id":"assets","gap":0.8,"text":"Maintaining assets: amber. Two poles in five haven't been inspected in ten years."},
 {"id":"connect","gap":0.8,"text":"Connecting customers: red. New solar takes thirty-four working days to connect. The goal is ten."},
 {"id":"money","gap":0.8,"text":"A heat map shows where it hurts, so it shows where the money should go."}]},
"deep":{"name":"Deep only where it hurts","lead":1.0,"tail":1.0,"vo":[
 {"id":"every","gap":0.8,"text":"Tomás wants to open every box. Grace opens only the red one."},
 {"id":"three","gap":0.8,"text":"Connecting customers takes three abilities: assessing network capacity, approving connections, and installing meters."},
 {"id":"quick","gap":0.8,"text":"Approvals and meters are quick. The wait is in assessing capacity."},
 {"id":"oneway","gap":0.8,"text":"The network was built for power that flows one way. Nobody knows how much solar each street can take."},
 {"id":"money","gap":0.8,"text":"So the money goes to one capability, whichever team or system ends up doing the work."}]},
"spine":{"name":"The spine","lead":1.0,"tail":1.0,"vo":[
 {"id":"fill","gap":0.8,"text":"On the map, capabilities fill the strategy layer."},
 {"id":"above","gap":0.8,"text":"Above them, the goals they serve. Below them, the teams, processes and systems that do the work."},
 {"id":"stay","gap":0.8,"text":"Those will change. The capabilities stay. That's why they're the spine."},
 {"id":"data","gap":0.8,"text":"Every measure and every data rule will need a home, and most will hang from one of these boxes."},
 {"id":"street","gap":0.8,"text":"Even a number nobody has yet: how much solar each street can take."}]},
"end":{"name":"Confirmed, for now","lead":1.0,"tail":1.0,"vo":[
 {"id":"confirms","gap":0.8,"text":"Grace confirms the network's capabilities, Ama hers, and the head of retail theirs."},
 {"id":"draft","gap":0.8,"text":"Generating power stays a draft until its owner is found."},
 {"id":"answer","gap":0.8,"text":"Tomás's note has an answer: eight capabilities, seven owners, and one that hurts."},
 {"id":"next","gap":0.8,"text":"Next, he follows one power cut from the first call to the lights coming back on."}]}
};
