// The map before the data · Who does it, and where meaning changes. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"two":{"name":"Two frequencies","lead":1.4,"tail":1.0,"vo":[
 {"id":"tokyo","gap":0.8,"text":"Japan, the 1890s. Tokyo buys its generators from Germany. They make power at fifty cycles a second."},
 {"id":"osaka","gap":0.8,"text":"Osaka buys American ones, at sixty."},
 {"id":"grow","gap":0.8,"text":"The two grids grow until they meet in the middle of the country. Both sides call it power, but they can't simply be joined."},
 {"id":"quake","gap":0.8,"text":"In March 2011, after the earthquake and tsunami, the east loses a large share of its power stations. The west has power to spare."},
 {"id":"convert","gap":0.8,"text":"But it can send east only what a few converter stations can translate: about one gigawatt. Around Tokyo, the power is cut in turns."},
 {"id":"costly","gap":0.8,"text":"Making one side match the other has been studied, and judged far too costly. So Japan builds more converters."},
 {"id":"edge","gap":0.8,"text":"The same word means something different on each side of a line. What crosses is translated at the edge, and that's where it can fail."}]},
"names":{"name":"A name on each step","lead":1.3,"tail":1.5,"vo":[
 {"id":"note","gap":0.8,"text":"Tomás's next note asks who does the work, and where meaning changes."},
 {"id":"night","gap":0.8,"text":"He writes a name on each step of the night on Hill Street. Priya took the call. Sam decided who went first."},
 {"id":"grace","gap":0.8,"text":"Grace crosses the names out. Next week, someone else is on the night shift."},
 {"id":"role","gap":0.8,"text":"A step is done by a role: the call-taker, the duty controller, the crew leader."},
 {"id":"actor","gap":0.8,"text":"Whoever fills a role is an actor: a person, or a team. Actors come and go; roles stay."}]},
"partner":{"name":"A partner, and a contract","lead":1.0,"tail":1.0,"vo":[
 {"id":"units","gap":0.8,"text":"Roles sit in teams: the contact centre, the control room."},
 {"id":"crew","gap":0.8,"text":"But the crew that fixed Hill Street isn't the utility's. It's a contractor's: a partner."},
 {"id":"contract","gap":0.8,"text":"What a partner must do is written in a contract: on site within two hours, under the utility's safety rules."},
 {"id":"next","gap":0.8,"text":"Partners change. The contract goes on the map, because it says what the next one must do too."}]},
"agent":{"name":"An agent on the night shift","lead":1.0,"tail":1.0,"vo":[
 {"id":"one","gap":0.8,"text":"One more actor worked that night, and it isn't a person."},
 {"id":"reads","gap":0.8,"text":"An AI agent reads every outage report as it arrives: calls, texts, alarms from smart meters."},
 {"id":"groups","gap":0.8,"text":"It groups them into faults, and proposes which matters most."},
 {"id":"rights","gap":0.8,"text":"Its rights are written down, like anyone's. It may group reports and propose. It may not send a crew."},
 {"id":"escalate","gap":0.8,"text":"A wire down, or someone on life support, goes straight to the duty controller. The agent recommends; a person decides."}]},
"count":{"name":"How many customers?","lead":1.0,"tail":1.0,"vo":[
 {"id":"ask","gap":0.8,"text":"Then Tomás asks a simple question: how many customers do we have?"},
 {"id":"retail","gap":0.8,"text":"Retail says three hundred and ten thousand: people and businesses with an account, who pay a bill."},
 {"id":"network","gap":0.8,"text":"The network says five hundred and forty thousand: connection points, the places where power is delivered, whichever retailer they buy from."},
 {"id":"move","gap":0.8,"text":"When a family moves out of fourteen Hill Street, retail closes one account and opens another. The network's connection point doesn't change."},
 {"id":"both","gap":0.8,"text":"Both numbers are right. They count different things, with the same word."}]},
"wall":{"name":"A wall between them","lead":1.0,"tail":1.0,"vo":[
 {"id":"ama","gap":0.8,"text":"Ama, the regulatory lead, explains what keeps them apart."},
 {"id":"rules","gap":0.8,"text":"In many markets, the rules separate a network from retail, even inside one group. The utility's own principle says it too: customer information stays with the business that collected it."},
 {"id":"solar","gap":0.8,"text":"The network knows who has just applied to connect solar panels. To a retailer, that's a list of people to sell batteries to."},
 {"id":"must","gap":0.8,"text":"It must not cross."}]},
"domains":{"name":"Two organisations in one","lead":1.0,"tail":1.0,"vo":[
 {"id":"draw","gap":0.8,"text":"So Tomás draws the edge. On one side, the network. On the other, retail."},
 {"id":"domain","gap":0.8,"text":"Each is a domain: a part of the organisation, modelled as an organisation in its own right."},
 {"id":"own","gap":0.8,"text":"Each has its own customers, its own capabilities, and its own words. The network says connection point, feeder, outage. Retail says account, tariff, bill."},
 {"id":"meaning","gap":0.8,"text":"Meaning changes at a domain's edge. Customer is one word, for two things."}]},
"one":{"name":"One definition for everyone?","lead":1.0,"tail":1.0,"vo":[
 {"id":"tempt","gap":0.8,"text":"Tomás's first instinct is one definition of customer for everyone, kept in one place."},
 {"id":"fit","gap":0.8,"text":"It would fit neither side. And it would carry what the network knows straight across the wall."},
 {"id":"instead","gap":0.8,"text":"Instead, each domain keeps its own meaning, and the edge gets a translation: a short, agreed list of what crosses, and how."},
 {"id":"list","gap":0.8,"text":"Which connection point. Which retailer serves it. Planned outages. And who there depends on power for life support."}]},
"fails":{"name":"Where it can fail","lead":1.0,"tail":1.0,"vo":[
 {"id":"movein","gap":0.8,"text":"When someone on life support moves into a home, retail hears first."},
 {"id":"cross","gap":0.8,"text":"The network must know before the next storm, because its rule for who goes first works from that list."},
 {"id":"late","gap":0.8,"text":"If the message is late, the rule works from the wrong list."},
 {"id":"like","gap":0.8,"text":"As at Japan's converters, the edge is where the translation is built, and where it can fail."}]},
"end":{"name":"Drawn, for now","lead":1.0,"tail":1.0,"vo":[
 {"id":"confirm","gap":0.8,"text":"Grace confirms the network's roles, and the head of retail confirms theirs. Ama confirms the edge, and what may cross it."},
 {"id":"agent","gap":0.8,"text":"The agent's rights go on the map, with an owner: Grace."},
 {"id":"answer","gap":0.8,"text":"Tomás's note has an answer: roles do the work, and people, partners and agents fill them. Customer means two things, with a wall between them and a translation at the edge."},
 {"id":"next","gap":0.8,"text":"Next, at last, he opens the list of a hundred and forty systems."}]}
};
