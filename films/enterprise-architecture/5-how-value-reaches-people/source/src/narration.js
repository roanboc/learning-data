// The map before the data · How value reaches people. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"lunch":{"name":"Lunch, across the city","lead":1.4,"tail":1.0,"vo":[
 {"id":"kitchen","gap":0.8,"text":"Mumbai, a weekday morning. A home-cooked lunch goes into a tin, and the tin to a dabbawala."},
 {"id":"code","gap":0.8,"text":"On its lid, a few painted marks say where it's going: the station, the building, the floor."},
 {"id":"hands","gap":0.8,"text":"By bicycle, train and on foot, it changes hands several times, and reaches a desk across the city by lunchtime."},
 {"id":"scale","gap":0.8,"text":"Before the pandemic, about five thousand dabbawalas carried some two hundred thousand lunches a day, with almost no errors."},
 {"id":"detail","gap":0.8,"text":"The detail lives where the tins change hands: marks, read at every sorting."},
 {"id":"customer","gap":0.8,"text":"The customer sees only three things: lunch leaves home, lunch arrives, the tin comes back."}]},
"storm":{"name":"The lights go out","lead":1.0,"tail":1.0,"vo":[
 {"id":"note","gap":0.8,"text":"Tomás's next note asks how value reaches people."},
 {"id":"branch","gap":0.8,"text":"At ten past two on a stormy morning, a branch falls on a line on Hill Street. Forty homes go dark."},
 {"id":"call","gap":0.8,"text":"Four minutes later, one household calls the faults line, and Tomás follows that call to the lights coming back on."},
 {"id":"teams","gap":0.8,"text":"On its way, it will pass through three teams, and a rule nobody has written down."}]},
"side":{"name":"From the household's side","lead":1.0,"tail":1.0,"vo":[
 {"id":"farah","gap":0.8,"text":"Farah, the customer advocate, draws the night from the household's side."},
 {"id":"sees","gap":0.8,"text":"The household sees no teams and no systems. It sees a few stages, in order."},
 {"id":"list","gap":0.8,"text":"Someone knows the power's out. Help is on its way. The lights come back. And someone says what happened."},
 {"id":"gets","gap":0.8,"text":"Each stage ends with something the household gets."},
 {"id":"stream","gap":0.8,"text":"That's a value stream: how value reaches a customer, seen from their side. This one: get the power back."},
 {"id":"handful","gap":0.8,"text":"A utility has only a handful; meter to cash is another."}]},
"teams":{"name":"Three teams, one stream","lead":1.0,"tail":1.0,"vo":[
 {"id":"under","gap":0.8,"text":"Under each stage go the capabilities from his map that make it possible."},
 {"id":"caps","gap":0.8,"text":"Finding faults. Dispatching crews. Restoring supply. Informing customers."},
 {"id":"three","gap":0.8,"text":"The work itself passes through three teams: the contact centre, the control room and the field crews."},
 {"id":"sees","gap":0.8,"text":"The household sees none of them, and feels only the hand-offs that go wrong."},
 {"id":"tins","gap":0.8,"text":"As with the dabbawalas' tins, the detail belongs where the work changes hands."}]},
"map":{"name":"Four kinds of process","lead":1.0,"tail":1.0,"vo":[
 {"id":"how","gap":0.8,"text":"A value stream shows what reaches the customer; a process, how the work gets done."},
 {"id":"grace","gap":0.8,"text":"Grace shows him the utility's process map. Every process sits in one of four groups."},
 {"id":"groups","gap":0.8,"text":"Strategic processes set direction. Operational ones deliver to customers. Support keeps the rest running. Evaluation measures and improves."},
 {"id":"restore","gap":0.8,"text":"Restoring supply is operational. Evaluation measures it: how long, and how often, customers are without power."}]},
"levels":{"name":"Levels, again","lead":1.0,"tail":1.0,"vo":[
 {"id":"like","gap":0.8,"text":"Like capabilities, processes have levels."},
 {"id":"two","gap":0.8,"text":"Level one is the map. Level two is one process: restore supply."},
 {"id":"three","gap":0.8,"text":"Level three is its steps. Take the call. Find the fault. Decide who goes first. Send the crew. Repair. Switch back on. Confirm."},
 {"id":"enough","gap":0.8,"text":"For most of these steps, a box and an arrow say enough."}]},
"edges":{"name":"The edges","lead":1.0,"tail":1.0,"vo":[
 {"id":"edges","gap":0.8,"text":"Before going deeper, Tomás draws its edges."},
 {"id":"sipoc","gap":0.8,"text":"Who supplies it, what comes in, what goes out, to whom: a SIPOC, in Six Sigma's terms.","say":"Who supplies it, what comes in, what goes out, to whom: a sigh-pock, in Six Sigma's terms."},
 {"id":"in","gap":0.8,"text":"In come calls, alarms from smart meters, and where each crew is."},
 {"id":"out","gap":0.8,"text":"What comes out: power back on, a time to tell customers, and a fault record."},
 {"id":"record","gap":0.8,"text":"The fault record, with its start, end and cause, goes to the regulator."}]},
"first":{"name":"Who goes first","lead":1.0,"tail":1.0,"vo":[
 {"id":"one","gap":0.8,"text":"Only one step needs more detail: deciding which crew goes first."},
 {"id":"tonight","gap":0.8,"text":"Tonight the storm has caused three faults, and two crews are free."},
 {"id":"faults","gap":0.8,"text":"On Hill Street, a wire is down. On Riverside, twelve homes, one with someone on life support. On the east side, twelve hundred homes."},
 {"id":"habit","gap":0.8,"text":"Left to habit, both crews would go to the biggest fault."},
 {"id":"rule","gap":0.8,"text":"The rule says otherwise: wires down first, for safety. Then life support. Then whatever brings back the most homes."},
 {"id":"order","gap":0.8,"text":"Order and state: that's where a process earns detail, step by step, in a notation such as BPMN."}]},
"needs":{"name":"What the rule needs","lead":1.0,"tail":1.0,"vo":[
 {"id":"facts","gap":0.8,"text":"At two in the morning, the rule needs three facts."},
 {"id":"wires","gap":0.8,"text":"Which wires are down: from the calls."},
 {"id":"life","gap":0.8,"text":"Who is on life support: from a register."},
 {"id":"homes","gap":0.8,"text":"How many homes each fault cuts off: from the network model, which isn't sure which homes hang off which transformer."},
 {"id":"where","gap":0.8,"text":"Wherever order, state or timing matter, that's where the data rules are."}]},
"end":{"name":"Back on","lead":1.0,"tail":1.0,"vo":[
 {"id":"back","gap":0.8,"text":"At twenty to four, Hill Street's lights come back on, with a message: a branch on the line, now cleared."},
 {"id":"confirm","gap":0.8,"text":"Farah confirms the stages, and Grace the steps."},
 {"id":"rule","gap":0.8,"text":"The rule for who goes first is written down at last, and Grace owns it."},
 {"id":"answer","gap":0.8,"text":"Tomás's note has an answer: value reaches people in a few stages; the detail belongs at one step."},
 {"id":"next","gap":0.8,"text":"Next, he asks who does each step, and what \"customer\" means to each of them."}]}
};
