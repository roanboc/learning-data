// What it must be able to do. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"road":{"name":"The road that carried messages","lead":1.4,"tail":1.0,"vo":[
 {"id":"years","gap":0.8,"text":"In the 1400s, the Inca empire sent its messages along a road system thousands of kilometres long, through the Andes.","say":"In the fourteen hundreds, the Inca empire sent its messages along a road system thousands of kilometres long, through the Andes."},
 {"id":"posts","gap":0.8,"text":"Runners, called chasqui, carried each message in relays, from one post to the next.","say":"Runners, called chasqui, carried each message in relays, from one post to the next."},
 {"id":"estimate","gap":0.8,"text":"By one estimate, a message could cover about 240 kilometres in a day.","say":"By one estimate, a message could cover about two hundred and forty kilometres in a day."},
 {"id":"changed","gap":0.8,"text":"At every post, the runner changed. The road stayed, and so did the ability to carry a message along it."},
 {"id":"outlasts","gap":0.8,"text":"A capability outlasts whoever performs it."}]},
"wall":{"name":"A note on the wall","lead":1.0,"tail":1.0,"vo":[
 {"id":"note","gap":0.8,"text":"Tomás's new note asks what the utility must be able to do."},
 {"id":"copy","gap":0.8,"text":"His first answer copies the org chart: one box for each team."},
 {"id":"teams","gap":0.8,"text":"He puts them on the wall: Network Operations, Customer Service, Finance, Regulatory affairs."},
 {"id":"complete","gap":0.8,"text":"It looks complete. It isn't."}]},
"team":{"name":"A team isn't a thing you can do","lead":1.0,"tail":1.0,"vo":[
 {"id":"grace","gap":0.8,"text":"He takes them to Grace, who owns network operations."},
 {"id":"team","gap":0.8,"text":"Network Operations, she says, is a team. A team is who does the work."},
 {"id":"list","gap":0.8,"text":"Ask what it does, and you get a list: manage outages, maintain assets, connect customers."},
 {"id":"capability","gap":0.8,"text":"Those are capabilities: what the utility must be able to do, whoever does it."}]},
"what":{"name":"What, not who","lead":1.0,"tail":1.0,"vo":[
 {"id":"says","gap":0.8,"text":"A capability says what, not who, and not how."},
 {"id":"test","gap":0.8,"text":"The test is one question: would it still be needed after a reorganisation?"},
 {"id":"outages","gap":0.8,"text":"Manage outages would be. The team might not be."},
 {"id":"name","gap":0.8,"text":"So name each capability as an ability, in a few words."}]},
"levels":{"name":"Three levels","lead":1.0,"tail":1.0,"vo":[
 {"id":"top","gap":0.8,"text":"The map starts with the few things the utility must always be able to do. Five of them, at level 1."},
 {"id":"parts","gap":0.8,"text":"Under each, level 2 holds the parts. Under run the network: manage outages, and maintain assets."},
 {"id":"connect","gap":0.8,"text":"Connect customers, from the same list, sits under serve customers. The team's list doesn't match the map, and it shouldn't."},
 {"id":"depth","gap":0.8,"text":"Go down to level 3 only where a rule depends on order. Restoring supply is one: a fault is found, a crew is sent, and supply comes back."}]},
"owners":{"name":"Owners","lead":1.0,"tail":1.0,"vo":[
 {"id":"own","gap":0.8,"text":"Each capability needs an owner: the person who answers for whether it works."},
 {"id":"names","gap":0.8,"text":"Grace owns running the network. Farah owns serving customers. Ama owns reporting to the regulator."},
 {"id":"gap","gap":0.8,"text":"One capability has no owner yet. Generating energy has no name on it."},
 {"id":"empty","gap":0.8,"text":"A capability with no owner is a gap in the map."}]},
"heat":{"name":"Where it hurts","lead":1.0,"tail":1.0,"vo":[
 {"id":"heat","gap":0.8,"text":"Next, the heat map. Each capability is coloured by how well it works, from the evidence."},
 {"id":"hot","gap":0.8,"text":"The hottest is connecting customers. A new connection takes about thirty-five working days. The outcome from Why it moves was ten."},
 {"id":"look","gap":0.8,"text":"A heat map shows where to look first. It doesn't say where the money should go."},
 {"id":"principle","gap":0.8,"text":"That choice is made against the principles."}]},
"spine":{"name":"The spine stays","lead":1.0,"tail":1.0,"vo":[
 {"id":"reorg","gap":0.8,"text":"Next year the utility reorganises. Network Operations splits, and its teams move to new homes."},
 {"id":"move","gap":0.8,"text":"The teams move. The capabilities stay where they are."},
 {"id":"stable","gap":0.8,"text":"Capabilities are the stable spine. Teams come and go beneath it."}]},
"depth":{"name":"Just enough","lead":1.0,"tail":1.0,"vo":[
 {"id":"deeper","gap":0.8,"text":"The map could go on forever. Each capability could be split again, into level 4, and then level 5."},
 {"id":"declare","gap":0.8,"text":"Declare how deep the map goes, and stop there."},
 {"id":"reason","gap":0.8,"text":"Splitting detect faults further would give steps that nobody decides on separately."},
 {"id":"fewer","gap":0.8,"text":"Fewer, well-made boxes beat a complete catalogue that nobody reads."}]},
"end":{"name":"Checked, for now","lead":1.0,"tail":1.0,"vo":[
 {"id":"confirms","gap":0.8,"text":"Grace confirms the first two levels. The heat map goes to the board, as a draft."},
 {"id":"answer","gap":0.8,"text":"Tomás's note has an answer: five things the utility must be able to do, each with an owner."},
 {"id":"next","gap":0.8,"text":"Next, he asks how value reaches a customer."}]}
};
