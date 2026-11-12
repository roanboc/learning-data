// Business architecture for data · What the business owns. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"water":{"name":"Water under the desert","lead":1.4,"tail":1.0,"vo":[
 {"id":"edge","gap":0.8,"text":"Iran, at the edge of the desert. For more than two thousand years, villages here have lived on water that nobody sees."},
 {"id":"qanat","gap":0.8,"text":"It comes through a qanat: a tunnel dug from the foot of the mountains, which brings groundwater to the surface by gravity alone."},
 {"id":"shafts","gap":0.8,"text":"A line of shafts marks its path. They let the diggers in, and the earth out."},
 {"id":"never","gap":0.8,"text":"There's never enough water for every field at once. Each family's crop lives or dies by when the water reaches it."},
 {"id":"fragile","gap":0.8,"text":"And the tunnel is fragile. One cave-in can cut off a whole village."},
 {"id":"needed","gap":0.8,"text":"People needed to know whose water it was, and who would keep it flowing."},
 {"id":"shares","gap":0.8,"text":"So each part has its own people. The water belongs to its shareholders, in shares of time."},
 {"id":"town","gap":0.8,"text":"In one town, a share was ninety-six minutes of the flow, every twelve days."},
 {"id":"mirab","gap":0.8,"text":"A water master, the mirab, keeps the turns."},
 {"id":"diggers","gap":0.8,"text":"And the diggers, the muqannis, build and repair the tunnel. They're paid for the work. The water isn't theirs."},
 {"id":"lasted","gap":0.8,"text":"With each part in its own hands, the water has been shared this way for centuries, and the fields stay green."},
 {"id":"today","gap":0.8,"text":"In Gonabad, the Qasabeh qanat still flows, thirty-three kilometres long. In 2016, UNESCO listed eleven qanats as the Persian Qanat.","say":"In Gonabad, the Qasabeh qanat still flows, thirty-three kilometres long. In twenty sixteen, UNESCO listed eleven qanats as the Persian Qanat."},
 {"id":"link","gap":0.8,"text":"At the utility, the data team is the digger. It keeps the channel. The water, and what it means, belongs to the business."}]},
"map":{"name":"Tomás's map","lead":1.0,"tail":1.0,"vo":[
 {"id":"drawn","gap":0.8,"text":"Tomás, the utility's enterprise architect, has drawn its map, layer by layer: why it exists, how it works, and what runs it."},
 {"id":"part","gap":0.8,"text":"This series looks at one part of it: what the business owns about its data."},
 {"id":"three","gap":0.8,"text":"It sits in three layers: the capabilities, in strategy; the work, in business; and the concepts the business uses, in the information layer."},
 {"id":"next","gap":0.8,"text":"The series after it take the map down to the data and the platform, and they start from here."}]},
"three":{"name":"Three answers","lead":1.0,"tail":1.0,"vo":[
 {"id":"ticket","gap":0.8,"text":"A ticket reaches the data team: all customers, by district, for the annual report."},
 {"id":"answers","gap":0.8,"text":"There are three answers."},
 {"id":"billing","gap":0.8,"text":"Billing has three hundred and ten thousand accounts."},
 {"id":"network","gap":0.8,"text":"The network has five hundred and forty thousand connection points."},
 {"id":"own","gap":0.8,"text":"And the data team's own customer table has three hundred and fifty-two thousand."},
 {"id":"last","gap":0.8,"text":"Last year, the annual report gave one number, and the regulator's return another."},
 {"id":"minister","gap":0.8,"text":"In parliament, the minister was asked which was true, and couldn't say."},
 {"id":"which","gap":0.8,"text":"Each count is right about something. But which one is a customer?"}]},
"whose":{"name":"Whose meaning?","lead":1.0,"tail":1.0,"vo":[
 {"id":"pick","gap":0.8,"text":"The data team's first idea is to pick one, or to fix its own table until it's right."},
 {"id":"who","gap":0.8,"text":"Tomás asks who decided what that table counts."},
 {"id":"analyst","gap":0.8,"text":"An analyst built it three years ago, for a report due that week: one customer per address, with accounts and connection points merged."},
 {"id":"choose","gap":0.8,"text":"Nobody in the business had said which customer the report meant, so someone had to choose."},
 {"id":"account","gap":0.8,"text":"But an account belongs to the head of retail: someone who pays a bill."},
 {"id":"point","gap":0.8,"text":"A connection point belongs to Grace, who runs the network: a place where power is delivered."},
 {"id":"none","gap":0.8,"text":"The merged table's meaning had no owner. Nobody in the business had ever confirmed it."},
 {"id":"turn","gap":0.8,"text":"In the village, the diggers don't decide whose turn it is."}]},
"owns":{"name":"Who owns what","lead":1.0,"tail":1.0,"vo":[
 {"id":"writes","gap":0.8,"text":"So Tomás writes down who owns what."},
 {"id":"business","gap":0.8,"text":"The business owns what its data means, who creates it, the rules on it, the quality it needs, and the decisions it serves."},
 {"id":"team","gap":0.8,"text":"The data team owns how it's stored, moved and checked."},
 {"id":"like","gap":0.8,"text":"Like the shareholders and the diggers: one owns the water and its rules, the other keeps the channel."},
 {"id":"both","gap":0.8,"text":"Both matter. A channel nobody keeps silts up, and water nobody owns is fought over."}]},
"parts":{"name":"Only what data needs","lead":1.0,"tail":1.0,"vo":[
 {"id":"core","gap":0.8,"text":"Business architecture has many parts. The BIZBOK Guide puts four at its core: capabilities, value streams, information and the organisation."},
 {"id":"around","gap":0.8,"text":"Around them sit stakeholders, products, policies, initiatives and more."},
 {"id":"wider","gap":0.8,"text":"It covers much more than data: products, partners, finance, how the organisation is designed."},
 {"id":"only","gap":0.8,"text":"These films take only what matters for data, and say so."},
 {"id":"four","gap":0.8,"text":"What the business needs to know. Who creates it, and who owns it. The processes it's born in. The rules and expectations on it."},
 {"id":"each","gap":0.8,"text":"One film each, in that order."}]},
"answer":{"name":"The owners answer","lead":1.0,"tail":1.0,"vo":[
 {"id":"back","gap":0.8,"text":"The ticket goes back with one question: which customers does the report mean?"},
 {"id":"ama","gap":0.8,"text":"Ama, who owns the utility's obligations, asked for it. She decides, with the two owners."},
 {"id":"both","gap":0.8,"text":"The report counts both, each by its own name: accounts, as retail defines them, and connection points, as the network does."},
 {"id":"builds","gap":0.8,"text":"The data team builds both counts from those definitions, and tests them."},
 {"id":"retired","gap":0.8,"text":"The merged table is retired. Its rule was never the business's."},
 {"id":"checks","gap":0.8,"text":"Ama checks the counts before the ticket closes."},
 {"id":"same","gap":0.8,"text":"This year, the annual report and the regulator's return agree, and each number says what it counts."}]},
"practice":{"name":"The data practice on the map","lead":1.0,"tail":1.0,"vo":[
 {"id":"itself","gap":0.8,"text":"One more thing goes on the map: the data practice itself, drawn like any part of the business."},
 {"id":"actor","gap":0.8,"text":"The data team is a business actor. What it offers are business services, like answering data requests."},
 {"id":"tickets","gap":0.8,"text":"People reach that service through tickets: its interface."},
 {"id":"objects","gap":0.8,"text":"Account and connection point are business objects. What they mean stays with their owners."},
 {"id":"fills","gap":0.8,"text":"Film by film, the practice fills in: its glossary, its owners, its processes and its products."}]},
"end":{"name":"The water and the channel","lead":1.0,"tail":1.0,"vo":[
 {"id":"village","gap":0.8,"text":"In the village, the diggers keep the channel, and the shareholders decide whose water it is."},
 {"id":"utility","gap":0.8,"text":"At the utility, the data team keeps the channel. What flows in it, and what it means, is the business's."},
 {"id":"next","gap":0.8,"text":"Tomás's next note asks what the business needs to know."}]}
};
