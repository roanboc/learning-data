// Business architecture for data · Who creates it, who owns it. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"owners":{"name":"Owners, and a water master","lead":1.4,"tail":1.0,"vo":[
 {"id":"edge","gap":0.8,"text":"In the 1860s, at Mahan, near Kerman, a new qanat was dug: a tunnel bringing water from the mountains.","say":"In the eighteen sixties, at Mahan, near Kerman, a new qanat was dug: a tunnel bringing water from the mountains."},
 {"id":"six","gap":0.8,"text":"Its water was owned in six shares of time, each a turn at the water, and three men held them."},
 {"id":"shrine","gap":0.8,"text":"One of the six went to the keeper of the town's shrine."},
 {"id":"sold","gap":0.8,"text":"Over the years, its shares were sold, left to children, and split again and again."},
 {"id":"hundreds","gap":0.8,"text":"Many qanats came to have two or three hundred owners, and some, ten thousand shares."},
 {"id":"turn","gap":0.8,"text":"Each owner's water had to reach the right field at the right time, or a family could lose its crop."},
 {"id":"repairs","gap":0.8,"text":"And every year, the tunnel needed repairs, which someone had to decide on and pay for."},
 {"id":"needed","gap":0.8,"text":"With so many owners, a qanat needed them to decide together, and someone to look after the water."},
 {"id":"met","gap":0.8,"text":"So the owners met each year to decide on the repairs, voting by the size of their shares."},
 {"id":"mirab","gap":0.8,"text":"They paid a water master, the mirab, to guide the water to each field in its turn."},
 {"id":"helpers","gap":0.8,"text":"With his helpers, he kept the channels clean and opened each field's gate on time."},
 {"id":"decided","gap":0.8,"text":"The mirab looked after the water. Its owners decided."},
 {"id":"record","gap":0.8,"text":"For that qanat, the Vakilabad, every change of owner is on record, from the first three men on."},
 {"id":"third","gap":0.8,"text":"Generations later, the shrine keeper's share had become a third, held by twenty of his descendants."},
 {"id":"seventy","gap":0.8,"text":"Some seventy families held the rest, and every share had a named owner."},
 {"id":"link","gap":0.8,"text":"At the utility, each concept needs the same: an owner who decides, and someone to look after it every day."}]},
"note":{"name":"Tomás's next note","lead":1.0,"tail":1.0,"vo":[
 {"id":"note","gap":0.8,"text":"Tomás's next note asks who creates each concept, and who owns it."},
 {"id":"map","gap":0.8,"text":"On his map, each concept already sits beneath the capabilities that use it."},
 {"id":"exactly","gap":0.8,"text":"Now he needs to know exactly what each capability does with each one."}]},
"matrix":{"name":"Creates, reads, updates, deletes","lead":1.0,"tail":1.0,"vo":[
 {"id":"draws","gap":0.8,"text":"He draws a matrix: the capabilities down one side, the concepts across the top."},
 {"id":"letters","gap":0.8,"text":"In each square goes what the capability does with the concept: creates it, reads it, updates it, or deletes it."},
 {"id":"crud","gap":0.8,"text":"Architects call it a CRUD matrix, after those four letters."},
 {"id":"people","gap":0.8,"text":"He fills it in with the people who run each capability, not from what the systems say."},
 {"id":"column","gap":0.8,"text":"Then he reads down each column: each concept should be created by one capability."},
 {"id":"owner","gap":0.8,"text":"And its owner is the owner of that capability."},
 {"id":"cp","gap":0.8,"text":"Connecting customers creates the connection point, so the connection point is Grace's."}]},
"two":{"name":"Two that create","lead":1.0,"tail":1.0,"vo":[
 {"id":"two","gap":0.8,"text":"But the account's column has two."},
 {"id":"serve","gap":0.8,"text":"Serving customers opens an account when someone signs up."},
 {"id":"connect","gap":0.8,"text":"And connecting customers opens one when a new home is switched on, so its first bill can go out."},
 {"id":"both","gap":0.8,"text":"So a family moving into a new home could end up with two."},
 {"id":"last","gap":0.8,"text":"Last year, twelve hundred new homes had two accounts, and three hundred and forty families got two first bills."},
 {"id":"farah","gap":0.8,"text":"Farah, who speaks for the utility's customers, had been asking why. The matrix shows it."},
 {"id":"whose","gap":0.8,"text":"Which capability should create the account isn't for Tomás or the data team to decide."}]},
"decides":{"name":"The business decides","lead":1.0,"tail":1.0,"vo":[
 {"id":"who","gap":0.8,"text":"Grace runs connecting customers, and the head of retail runs serving customers. They decide it together."},
 {"id":"creates","gap":0.8,"text":"Serving customers creates the account. Connecting customers creates the connection point, and only reads the account."},
 {"id":"tells","gap":0.8,"text":"When a new home is switched on, it tells retail, and retail opens the account."},
 {"id":"owner","gap":0.8,"text":"So the account's owner is the head of retail, who runs the capability that creates it."},
 {"id":"dated","gap":0.8,"text":"The decision goes on the map with its date, so nobody has to settle it again."},
 {"id":"since","gap":0.8,"text":"Since then, each new home gets one account, and one first bill."}]},
"stewards":{"name":"Owners and stewards","lead":1.0,"tail":1.0,"vo":[
 {"id":"decides","gap":0.8,"text":"An owner decides what a concept means, who creates it, the rules on it, and how good it must be."},
 {"id":"cant","gap":0.8,"text":"But the head of retail can't look after three hundred and ten thousand accounts, day to day."},
 {"id":"names","gap":0.8,"text":"So each owner names a steward: someone who works with the concept every day."},
 {"id":"billing","gap":0.8,"text":"For accounts, it's retail's billing lead, who keeps the definition, answers questions about it, and follows up when something's wrong."},
 {"id":"mirab","gap":0.8,"text":"Like the mirab, a steward looks after it for its owner, and doesn't own it."},
 {"id":"diggers","gap":0.8,"text":"And the data team builds and runs what holds it, as diggers keep a qanat's tunnel, and owns none of it."}]},
"unwritten":{"name":"An owner nobody wrote down","lead":1.0,"tail":1.0,"vo":[
 {"id":"some","gap":0.8,"text":"Some concepts have no owner written down anywhere."},
 {"id":"table","gap":0.8,"text":"An outage table, built in 2019, holds every outage, and Ama's yearly report to the regulator counts them from it.","say":"An outage table, built in twenty nineteen, holds every outage, and Ama's yearly report to the regulator counts them from it."},
 {"id":"left","gap":0.8,"text":"Whoever built it has left, and nobody knows who owns what's in it."},
 {"id":"asks","gap":0.8,"text":"Tomás doesn't ask which system the table came from. He asks which capability creates outages."},
 {"id":"grace","gap":0.8,"text":"Operating the network does, so outages are Grace's, and her outage desk lead becomes their steward."},
 {"id":"found","gap":0.8,"text":"Owners are found by capability, not by system, even where nothing was written down."}]},
"practice":{"name":"The data practice on the map","lead":1.0,"tail":1.0,"vo":[
 {"id":"roles","gap":0.8,"text":"On the data practice's map, two roles join: the data owner and the data steward."},
 {"id":"holds","gap":0.8,"text":"Each domain's owner holds the owner's role: Grace for the network's concepts, and the head of retail for retail's."},
 {"id":"stewards","gap":0.8,"text":"And each owner names the stewards who look after their concepts, day to day."}]},
"end":{"name":"Every share, a name","lead":1.0,"tail":1.0,"vo":[
 {"id":"village","gap":0.8,"text":"On a qanat, every share has a named owner: the owners decide, and the mirab looks after the water."},
 {"id":"utility","gap":0.8,"text":"At the utility, every concept now has one capability that creates it, an owner who decides, and a steward who looks after it."},
 {"id":"next","gap":0.8,"text":"Tomás's next note asks where each one is born: in which process, and at which step."}]}
};
