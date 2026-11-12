// Data architecture · Where each fact is born. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"sender":{"name":"From the factory itself","lead":1.4,"tail":1.0,"vo":[
 {"id":"year","gap":0.8,"text":"By 1972, Cybersyn had a network: Chile's telex lines, being extended to every factory the state ran, along a country more than four thousand kilometres long.","say":"By nineteen seventy-two, Cybersyn had a network: Chile's telex lines, being extended to every factory the state ran, along a country more than four thousand kilometres long."},
 {"id":"free","gap":0.8,"text":"Some managers were won over by the offer of a free telex."},
 {"id":"own","gap":0.8,"text":"But the software could only warn about a factory if it had that factory's own numbers, from that day."},
 {"id":"else","gap":0.8,"text":"A figure from anywhere else would mislead it: last month's, or a guess made in an office in Santiago."},
 {"id":"harm","gap":0.8,"text":"Then a bad day could look normal, and a mill short of cotton could wait for help that never came."},
 {"id":"needed","gap":0.8,"text":"Each number had to come from where it was made."},
 {"id":"sent","gap":0.8,"text":"So each factory sent its own numbers by telex, once a day, from the factory itself."},
 {"id":"remind","gap":0.8,"text":"It wasn't easy: the team had to keep reminding managers to send them."},
 {"id":"born","gap":0.8,"text":"But now each number had one place where it was born: the factory that made what it counted."},
 {"id":"copy","gap":0.8,"text":"What Santiago read was a copy of what that factory had sent, the same day."},
 {"id":"six","gap":0.8,"text":"The statistics before had taken six months."},
 {"id":"utility","gap":0.8,"text":"At the utility, Inés finds a fact that's born in two places."},
 {"id":"both","gap":0.8,"text":"When a family signs up for a new home, billing creates a premise for it. When the home is connected, the network map creates a service point."},
 {"id":"twice","gap":0.8,"text":"Last year, 214 of 1,160 new homes were created twice.","say":"Last year, two hundred and fourteen of eleven hundred and sixty new homes were created twice."}]},
"twice":{"name":"Born twice","lead":1.0,"tail":1.0,"vo":[
 {"id":"home","gap":0.8,"text":"Take a new home at 14 Quarry Lane.","say":"Take a new home at fourteen Quarry Lane."},
 {"id":"march","gap":0.8,"text":"In March the family signed up. The home had no network ID yet, so billing created a premise of its own, from the address on their form."},
 {"id":"april","gap":0.8,"text":"In April the network team connected it, and the network map created its service point, at Lot 14, Quarry Lane: the builder's name for the plot.","say":"In April the network team connected it, and the network map created its service point, at Lot fourteen, Quarry Lane: the builder's name for the plot."},
 {"id":"copies","gap":0.8,"text":"Customer service copied billing's premise. The outage system copied the network's service point."},
 {"id":"june","gap":0.8,"text":"In June, the power went out on their street."},
 {"id":"saw","gap":0.8,"text":"The outage system saw the cut at the service point, but no account was on it."},
 {"id":"call","gap":0.8,"text":"When the family called, customer service found no cut at their address, and told them to call an electrician."},
 {"id":"count","gap":0.8,"text":"And Grace's measure counted no customer there."}]},
"born":{"name":"Where it's born","lead":1.0,"tail":1.4,"vo":[
 {"id":"place","gap":0.8,"text":"Every fact has a place where it's born: the one system where it's created, and corrected."},
 {"id":"dama","gap":0.8,"text":"DAMA calls it the system of record. Every other system that holds the fact holds a copy."},
 {"id":"matrix","gap":0.8,"text":"To find each fact's home, Inés draws what each system does with each thing: creates it, or copies it."},
 {"id":"one","gap":0.8,"text":"Where a row has one \"creates\", the fact has a home."},
 {"id":"two","gap":0.8,"text":"Where it has two, it's born twice: the connection point, in billing and in the network map, and the customer, in billing and in customer service."}]},
"home":{"name":"One home, one owner","lead":1.0,"tail":1.4,"vo":[
 {"id":"names","gap":0.8,"text":"So Inés proposes a home for the connection point, and its owner, Grace, agrees: the network map."},
 {"id":"only","gap":0.8,"text":"From now on, only the network map creates a connection point, with its ID, as soon as a connection is planned."},
 {"id":"ask","gap":0.8,"text":"Billing no longer makes its own. It asks the network team for one, and copies it, ID and all, the same day."},
 {"id":"account","gap":0.8,"text":"The account's home is billing, and its owner is the head of retail."},
 {"id":"rule","gap":0.8,"text":"One fact, one home, one owner. A copy can be read anywhere, but it's corrected only at home."}]},
"lineage":{"name":"A line back","lead":1.0,"tail":1.0,"vo":[
 {"id":"line","gap":0.8,"text":"Each copy keeps a line back to where it was born: which system, which record, and when it was copied."},
 {"id":"called","gap":0.8,"text":"That line is its lineage."},
 {"id":"council","gap":0.8,"text":"In July, the network team corrected the address to the plot's street number, 14 Quarry Lane, at home in the network map.","say":"In July, the network team corrected the address to the plot's street number, fourteen Quarry Lane, at home in the network map."},
 {"id":"morning","gap":0.8,"text":"By the next morning, every copy said the same."},
 {"id":"measure","gap":0.8,"text":"Grace's measure has lineage too: each interruption it counts traces to a record in the outage system, and each customer to an account in billing."}]},
"three":{"name":"Three records, three facts","lead":1.0,"tail":1.2,"vo":[
 {"id":"back","gap":0.8,"text":"Now, back to the cut. Each one is recorded by more than one system."},
 {"id":"meter","gap":0.8,"text":"The meter's \"power off\" event is born in meter data: what the meter saw."},
 {"id":"call","gap":0.8,"text":"The family's call is born in customer service: what a person told us."},
 {"id":"cut","gap":0.8,"text":"The interruption is born in the outage system: the cut as Grace's team defines it, from its start to its end."},
 {"id":"not","gap":0.8,"text":"They aren't three copies of one fact. They're three facts, each with its own home."},
 {"id":"evidence","gap":0.8,"text":"The outage system reads the other two as evidence, and its record is the one Grace's measure counts."}]},
"master":{"name":"Two places, one person","lead":1.0,"tail":1.0,"vo":[
 {"id":"some","gap":0.8,"text":"Some facts can't be born in only one place."},
 {"id":"customer","gap":0.8,"text":"A customer can start in billing, signing up, or in customer service, calling before they've signed anything."},
 {"id":"both","gap":0.8,"text":"Both have to create one. Then the work is to know when two records are the same person, and which value wins."},
 {"id":"series","gap":0.8,"text":"That's master data, and the series The same one, everywhere takes it from here."},
 {"id":"map","gap":0.8,"text":"On the data practice on the map, each data object now names its home, and each copy has a line back to it."}]},
"back":{"name":"From where it was made","lead":1.0,"tail":1.2,"vo":[
 {"id":"chile","gap":0.8,"text":"In Chile, each number was born in its factory, and sent from there once a day."},
 {"id":"read","gap":0.8,"text":"Santiago read copies, and knew where each one came from."},
 {"id":"utility","gap":0.8,"text":"At the utility, each fact now has one home and one owner, and every copy a line back to it."},
 {"id":"october","gap":0.8,"text":"In October, when the power went out on Quarry Lane again, the family's call found the cut, and Grace's measure counted them."},
 {"id":"since","gap":0.8,"text":"Since July, no new home has been created twice."},
 {"id":"next","gap":0.8,"text":"But a fact doesn't stay at home. A meter reading replaced in the network has to reach billing. How does it travel?"}]}
};
