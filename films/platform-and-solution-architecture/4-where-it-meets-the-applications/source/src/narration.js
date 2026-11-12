// Platform and solution architecture · Where it meets the applications. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"chuma":{"name":"A horse the whole way","lead":1.4,"tail":1.0,"vo":[
 {"id":"year","gap":0.8,"text":"Japan, the 1600s. In Shinano, a province of high mountains, the rivers can't carry boats, so goods cross the passes on horseback.","say":"Japan, the sixteen hundreds. In Shinano, a province of high mountains, the rivers can't carry boats, so goods cross the passes on horseback."},
 {"id":"relay","gap":0.8,"text":"On the main roads, goods go by the stations' relay: a station's horses carry a load only to the next station. There it moves to another horse, and the shipper pays again."},
 {"id":"harm","gap":0.8,"text":"Every change costs time and money, and can damage the goods. When officials travel, the horses go to them first, and loads wait."},
 {"id":"villages","gap":0.8,"text":"For the mountain villages, everything they sell or buy costs more to carry, and takes longer."},
 {"id":"chuma","gap":0.8,"text":"So farmers began carrying loads on their own horses, straight through: no change of horse and no station fee, so cheaper, and less damaged. These were the chūma."},
 {"id":"hit","gap":0.8,"text":"But the stations lost loads and fees, and still had to keep horses for the shogunate. From 1673, they took the farmers to court, again and again.","say":"But the stations lost loads and fees, and still had to keep horses for the shogunate. From sixteen seventy-three, they took the farmers to court, again and again."},
 {"id":"need","gap":0.8,"text":"The mountains needed the cheaper way, and the road needed its stations."},
 {"id":"ruling","gap":0.8,"text":"In 1764, the shogunate ruled. For each road, it set which goods the farmers' horses could carry, and which went by the relay.","say":"In seventeen sixty-four, the shogunate ruled. For each road, it set which goods the farmers' horses could carry, and which went by the relay."},
 {"id":"written","gap":0.8,"text":"It wrote down every village that could run them, 679, and more than eighteen thousand horses. And the farmers would help keep the relay going.","say":"It wrote down every village that could run them, six hundred and seventy-nine, and more than eighteen thousand horses. And the farmers would help keep the relay going."},
 {"id":"better","gap":0.8,"text":"Each kind of load had its way, written down. That year, 9,600 loads went from Iida to Matsumoto, and the farmers' horses spread across Shinano, joining its mountains to both coasts.","say":"Each kind of load had its way, written down. That year, nine thousand six hundred loads went from Iida to Matsumoto, and the farmers' horses spread across Shinano, joining its mountains to both coasts."},
 {"id":"unseen","gap":0.8,"text":"At the utility, the integration team finds loads it can't see: 34 flows in and out of the data platform, none of them on its map.","say":"At the utility, the integration team finds loads it can't see: thirty-four flows in and out of the data platform, none of them on its map."},
 {"id":"sort","gap":0.8,"text":"So Ravi and the team's new lead sort the flows by kind: each takes the route that suits it, and every one goes on one map both teams keep."}]},
"unseen":{"name":"Flows nobody can see","lead":1.0,"tail":1.0,"vo":[
 {"id":"apps","gap":0.8,"text":"The integration platform joins the utility's applications: billing, the customer system, outages, metering and work orders."},
 {"id":"how","gap":0.8,"text":"Through its gateway, one application asks another for something. Through its events, news of a change reaches every application that wants it."},
 {"id":"logged","gap":0.8,"text":"Every message is checked and logged, so the integration team sees every flow between applications."},
 {"id":"yasmin","gap":0.8,"text":"This year, Yasmin Saleh joins as integration lead. Her first review finds 34 flows in and out of the data platform that aren't on her map.","say":"This year, Yasmin Saleh joins as integration lead. Her first review finds thirty-four flows in and out of the data platform that aren't on her map."},
 {"id":"broke","gap":0.8,"text":"One was a nightly read of the customer system. When that system was upgraded, the read broke, and retail's reports were wrong for two days: nobody upgrading it knew the read was there."},
 {"id":"ask","gap":0.8,"text":"So Yasmin asks for a rule: every flow goes through the integration platform, so nothing is hidden."}]},
"kinds":{"name":"Two kinds of traffic","lead":1.0,"tail":1.0,"vo":[
 {"id":"half","gap":0.8,"text":"Ravi agrees with half of it. A flow nobody can see is a flow nobody can govern."},
 {"id":"more","gap":0.8,"text":"But data comes into a data platform, and goes out of it, in more ways than applications pass messages."},
 {"id":"small","gap":0.8,"text":"Between applications, the traffic is small messages, one at a time: a customer moved, a fault was reported, a job was done."},
 {"id":"bulk","gap":0.8,"text":"Into the data platform come bulk loads: each night, forty million meter readings, loaded by the platform's own connectors. In Databricks, that's Lakeflow Connect."},
 {"id":"through","gap":0.8,"text":"Sent through the integration platform, each reading would be a message of its own: a load changing horses at every station, slower, and costlier."},
 {"id":"road","gap":0.8,"text":"Both kinds are flows, and both need governing. They just don't take the same road."}]},
"route":{"name":"The simplest route for each","lead":1.0,"tail":1.0,"vo":[
 {"id":"sort","gap":0.8,"text":"So Ravi and Yasmin sort the 34 flows by kind, and give each kind one rule.","say":"So Ravi and Yasmin sort the thirty-four flows by kind, and give each kind one rule."},
 {"id":"bulk","gap":0.8,"text":"Bulk loads and history come in natively, through the data platform's own connectors."},
 {"id":"events","gap":0.8,"text":"A change in an application, such as a customer moving, is already an event on the integration platform. The data platform subscribes to it, instead of reading the customer system a second way."},
 {"id":"serve","gap":0.8,"text":"And data served back to an application goes through the integration platform's gateway, the way every application already asks for what it needs."},
 {"id":"simplest","gap":0.8,"text":"Each flow takes the route that's simplest, cheapest and easiest to govern."},
 {"id":"films","gap":0.8,"text":"Data that moves shows how each kind of flow is built, and A path for every provider how a team chooses one for each source."}]},
"map":{"name":"One map, both teams","lead":1.0,"tail":1.0,"vo":[
 {"id":"map","gap":0.8,"text":"And every flow goes on one map: where it starts and ends, its route, who owns it, and its contract."},
 {"id":"keep","gap":0.8,"text":"Both teams keep it. A new flow goes on the map in the same pull request that builds it, reviewed by the team whose platform carries it."},
 {"id":"ruling","gap":0.8,"text":"As the ruling of 1764 wrote down every village and its horses, the map writes down every flow and its route.","say":"As the ruling of seventeen sixty-four wrote down every village and its horses, the map writes down every flow and its route."},
 {"id":"sees","gap":0.8,"text":"Yasmin sees all 34 flows now, and Ravi keeps the routes that suit data.","say":"Yasmin sees all thirty-four flows now, and Ravi keeps the routes that suit data."}]},
"score":{"name":"A score for the outage app","lead":1.0,"tail":1.0,"vo":[
 {"id":"ask","gap":0.8,"text":"Then Grace asks, in a ticket, for each feeder's risk of a fault, shown in the outage app."},
 {"id":"feeder","gap":0.8,"text":"A feeder is a line that carries power to a few streets."},
 {"id":"make","gap":0.8,"text":"Network's data product makes the score on the data platform, every hour, from the weather, each feeder's load and its past faults."},
 {"id":"route","gap":0.8,"text":"It's data served back to an application, so by the rule it goes through the integration platform's gateway, as an API the outage app already calls."},
 {"id":"review","gap":0.8,"text":"The data team reviews the score's pull request, the integration team adds its route to the gateway, and the flow goes on the map."},
 {"id":"test","gap":0.8,"text":"Grace checks the scores in the outage app, in test, before the ticket closes."}]},
"together":{"name":"Better together","lead":1.0,"tail":1.0,"vo":[
 {"id":"count","gap":0.8,"text":"Of the 34 flows they found, 25 stay native, and now they're on the map. Nine move to the integration platform: six become its events, and three go through its gateway.","say":"Of the thirty-four flows they found, twenty-five stay native, and now they're on the map. Nine move to the integration platform: six become its events, and three go through its gateway."},
 {"id":"customer","gap":0.8,"text":"Nothing reads the customer system unseen any more. When it's next upgraded, both teams know from the map which flows it touches."},
 {"id":"help","gap":0.8,"text":"And the two platforms help each other: the data platform takes the integration platform's events, and the integration platform serves the data platform's products."},
 {"id":"better","gap":0.8,"text":"For operations and for governance, the two work better together."}]},
"practice":{"name":"The data practice on the map","lead":1.0,"tail":1.0,"vo":[
 {"id":"intro","gap":0.8,"text":"Here's the data practice, on Tomás's map."},
 {"id":"node","gap":0.8,"text":"In the technology layer, the integration platform is a node beside the data platform, with services of its own: a gateway and events."},
 {"id":"flows","gap":0.8,"text":"Each of the 34 flows is drawn as a flow between applications and data products, labelled with the route it takes.","say":"Each of the thirty-four flows is drawn as a flow between applications and data products, labelled with the route it takes."},
 {"id":"principle","gap":0.8,"text":"And the rule is a principle: each flow takes the route that's simplest, cheapest and easiest to govern, and every flow is on the map."}]},
"end":{"name":"Two kinds of horse, one ruling","lead":1.0,"tail":1.0,"vo":[
 {"id":"road","gap":0.8,"text":"Across Shinano, the farmers' horses and the stations' horses worked the same roads, under one ruling."},
 {"id":"quarrels","gap":0.8,"text":"The quarrels didn't end, but now there was a ruling to settle them by."},
 {"id":"data","gap":0.8,"text":"At the utility, two platforms each carry what they carry best, and every flow is on one map."},
 {"id":"next","gap":0.8,"text":"Next: security all the way through."}]}
};
