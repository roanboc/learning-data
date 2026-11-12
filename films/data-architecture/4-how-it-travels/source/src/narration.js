// Data architecture · How it travels. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"strike":{"name":"The same lines","lead":1.4,"tail":1.0,"vo":[
 {"id":"year","gap":0.8,"text":"In October 1972, Cybersyn's telex lines ran from the north of Chile to the south.","say":"In October nineteen seventy-two, Cybersyn's telex lines ran from the north of Chile to the south."},
 {"id":"daily","gap":0.8,"text":"Every afternoon, each factory sent its numbers along them, one way, to Santiago."},
 {"id":"strike","gap":0.8,"text":"That month, truck owners went on strike against a plan for a state trucking company, and shopkeepers, bank clerks and others joined them."},
 {"id":"goods","gap":0.8,"text":"With most trucks standing still, shops and factories across the country could run out of essential goods."},
 {"id":"once","gap":0.8,"text":"A report once a day, one way, couldn't keep goods moving."},
 {"id":"needed","gap":0.8,"text":"The government needed to hear, as it happened, where goods were short and which trucks could still run."},
 {"id":"centre","gap":0.8,"text":"So Fernando Flores, who had started Cybersyn at CORFO, set up an emergency operations centre in Santiago."},
 {"id":"read","gap":0.8,"text":"There, the Cybersyn team and officials read about two thousand telexes a day, from all over the country, and answered them."},
 {"id":"both","gap":0.8,"text":"The same lines now carried new messages, many times a day, in both directions."},
 {"id":"trucks","gap":0.8,"text":"With them, about two hundred trucks still running were sent where they were needed most, against the effects of forty thousand on strike."},
 {"id":"utility","gap":0.8,"text":"At the utility, Inés lists every path that crosses the wall between the network and retail."},
 {"id":"eleven","gap":0.8,"text":"She finds eleven. Only four are on the map."}]},
"paths":{"name":"Paths nobody drew","lead":1.0,"tail":1.0,"vo":[
 {"id":"link","gap":0.8,"text":"One is a link into the meter system's database, made years ago so the complaints team could check a reading during a call."},
 {"id":"all","gap":0.8,"text":"It shows every connection point's readings: all 540,000, the 230,000 served by other retailers among them.","say":"It shows every connection point's readings: all five hundred and forty thousand, the two hundred and thirty thousand served by other retailers among them."},
 {"id":"wall","gap":0.8,"text":"That's what the wall is there to stop: customer information stays with the business that collected it."},
 {"id":"owner","gap":0.8,"text":"A path that isn't on the map has no owner at either end. When one end changes, the other finds out when it breaks."},
 {"id":"march","gap":0.8,"text":"In March, one such path, a nightly script, wrote for months to a queue nothing read. About nineteen hundred bills went uncorrected."}]},
"crosses":{"name":"What crosses","lead":1.0,"tail":1.2,"vo":[
 {"id":"meter","gap":0.8,"text":"In November, the Mendozas' meter, at 14 Quarry Lane, stopped sending readings for nine days, while a radio mast was mended.","say":"In November, the Mendozas' meter, at fourteen Quarry Lane, stopped sending readings for nine days, while a radio mast was mended."},
 {"id":"est","gap":0.8,"text":"The network estimated those days, and billing used the estimate."},
 {"id":"back","gap":0.8,"text":"When the meter came back, it sent what it had stored, and the network replaced the estimate."},
 {"id":"list","gap":0.8,"text":"Now the replacement has to cross the wall, and the agreed list says what may cross."},
 {"id":"five","gap":0.8,"text":"For a replaced reading, it lists five things."},
 {"id":"parts","gap":0.8,"text":"The connection point, by its network ID; the days; the estimate it replaces; the readings; and when it was replaced."},
 {"id":"own","gap":0.8,"text":"Each retailer gets them only for the connection points it serves, the group's own retailer no differently from the rest."},
 {"id":"nothing","gap":0.8,"text":"Nothing else from the meter crosses."}]},
"shapes":{"name":"Three shapes","lead":1.0,"tail":1.2,"vo":[
 {"id":"choice","gap":0.8,"text":"How it travels is a choice too, and DAMA names three shapes."},
 {"id":"p2p","gap":0.8,"text":"Point to point: one system wired straight to another, like the complaints team's link."},
 {"id":"wires","gap":0.8,"text":"It's quick to build. But each new reader adds a wire, and a change at one end can break the other, unseen."},
 {"id":"hub","gap":0.8,"text":"Hub and spoke: every system sends to one hub, and reads from it, as Cybersyn's factories sent to Santiago."},
 {"id":"pubsub","gap":0.8,"text":"Publish and subscribe: the home sends each change once, as it happens, and each reader allowed to read it subscribes."},
 {"id":"three","gap":0.8,"text":"Which one fits depends on three questions: who reads it, when they act on it, and what each may see."}]},
"once":{"name":"Published once","lead":1.0,"tail":1.4,"vo":[
 {"id":"who","gap":0.8,"text":"The replaced reading has many readers: every retailer, and in each, billing and customer service."},
 {"id":"when","gap":0.8,"text":"Billing acts on it at the next bill. Customer service acts on it while a customer is on the phone."},
 {"id":"see","gap":0.8,"text":"And each retailer may see only its own customers'."},
 {"id":"so","gap":0.8,"text":"So the network publishes each replaced reading once, when it's replaced, and each retailer receives only its own."},
 {"id":"hour","gap":0.8,"text":"Within the hour is soon enough: nobody acts on it sooner."},
 {"id":"closed","gap":0.8,"text":"The complaints team's link is closed: they read the same messages as the rest of customer service."}]},
"contract":{"name":"Under a contract","lead":1.0,"tail":1.4,"vo":[
 {"id":"agreed","gap":0.8,"text":"The flow gets a contract, agreed by the two teams at its ends: Grace's, which sends it, and billing's, which reads it."},
 {"id":"nobody","gap":0.8,"text":"It keeps to the agreed list, so they need nobody else's sign-off."},
 {"id":"what","gap":0.8,"text":"It says what crosses, and what each part means."},
 {"id":"soon","gap":0.8,"text":"How soon: within an hour of the replacement."},
 {"id":"late","gap":0.8,"text":"What happens when one is late or wrong: the network's team is told that day, and corrects it at home, never in the copy."},
 {"id":"change","gap":0.8,"text":"And how it changes: parts may be added, but none removed or renamed without a new version, and readers are told first."}]},
"map":{"name":"On the map","lead":1.0,"tail":1.2,"vo":[
 {"id":"drawn","gap":0.8,"text":"On the data practice on the map, the flow is drawn across the wall: from the meter reading in meter data, to its copy in billing."},
 {"id":"names","gap":0.8,"text":"It names its shape and its contract, and an owner at each end: Grace, and the head of retail."},
 {"id":"every","gap":0.8,"text":"Every path across the wall goes on the map, or goes."},
 {"id":"five","gap":0.8,"text":"Five become flows, each with its contract. The other six, the link among them, are closed."},
 {"id":"built","gap":0.8,"text":"How each flow is built, with connectors, events and pipelines, is the series Data that moves."}]},
"back":{"name":"In time to act","lead":1.0,"tail":1.2,"vo":[
 {"id":"chile","gap":0.8,"text":"In October 1972, Chile's telex lines didn't change.","say":"In October nineteen seventy-two, Chile's telex lines didn't change."},
 {"id":"crossed","gap":0.8,"text":"What crossed them did: new messages, many times a day, both ways, in time for whoever could act."},
 {"id":"utility","gap":0.8,"text":"At the utility, every fact that crosses the wall now crosses on purpose: drawn, with its shape and its contract."},
 {"id":"mendoza","gap":0.8,"text":"On the twenty-ninth of November, the Mendozas' meter sent its nine stored days."},
 {"id":"minute","gap":0.8,"text":"The estimate was replaced at 10:14, and billing had it a minute later.","say":"The estimate was replaced at ten fourteen, and billing had it a minute later."},
 {"id":"bill","gap":0.8,"text":"Their December bill charged for what they really used, and nobody had to call."},
 {"id":"month","gap":0.8,"text":"That month, 2,140 estimates were replaced.","say":"That month, two thousand one hundred and forty estimates were replaced."},
 {"id":"nine","gap":0.8,"text":"All but nine reached their retailer within the hour, and those nine were found and sent the same day."},
 {"id":"next","gap":0.8,"text":"Each domain now sends the others what they need. But who owns which data, and who answers for what's made from it?"}]}
};
