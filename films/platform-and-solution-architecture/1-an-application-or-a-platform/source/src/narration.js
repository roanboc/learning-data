// Platform and solution architecture · An application or a platform? One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"road":{"name":"Five roads from Edo","lead":1.4,"tail":1.0,"vo":[
 {"id":"year","gap":0.8,"text":"Japan, 1601. A year after the battle that ended a century of war, Tokugawa Ieyasu is the most powerful lord in the land.","say":"Japan, sixteen oh one. A year after the battle that ended a century of war, Tokugawa Ieyasu is the most powerful lord in the land."},
 {"id":"domains","gap":0.8,"text":"His seat is Edo. The emperor's city, Kyoto, is about five hundred kilometres west by road, and between them, many domains, each ruled by its own lord."},
 {"id":"slow","gap":0.8,"text":"A traveller on foot took about two weeks from Edo to Kyoto, and orders and news went no faster than the people who carried them."},
 {"id":"need","gap":0.8,"text":"To govern from Edo, Ieyasu needed his letters, officials and goods to cross the country in days, not weeks."},
 {"id":"order","gap":0.8,"text":"Early in 1601, he gave each station on the road to Kyoto an order: keep thirty-six horses, and carry official travellers on to the next station.","say":"Early in sixteen oh one, he gave each station on the road to Kyoto an order: keep thirty-six horses, and carry official travellers on to the next station."},
 {"id":"seal","gap":0.8,"text":"With it came his seal, and one line: without this seal, no horses."},
 {"id":"roads","gap":0.8,"text":"Over the decades that followed, five great roads ran out of Edo, most along older routes, with stations along the way: the Gokaidō."},
 {"id":"fast","gap":0.8,"text":"Relayed from station to station, an official letter now crossed from Edo to Kyoto in three or four days."},
 {"id":"shared","gap":0.8,"text":"And the road served every domain: lords travelling to Edo, couriers, merchants and pilgrims, each on their own business."},
 {"id":"ravi","gap":0.8,"text":"At the utility, Ravi Menon has just taken over the data platform. Like that road, it carries every domain's business."},
 {"id":"wrong","gap":0.8,"text":"But on the map it's drawn as one more application, and when one of its numbers goes wrong, nobody can say whose rule it is."},
 {"id":"better","gap":0.8,"text":"Drawn as a platform, it serves every domain, and every rule on it has an owner."}]},
"map":{"name":"Where it sits","lead":1.0,"tail":1.0,"vo":[
 {"id":"layers","gap":0.8,"text":"Tomás's map has six layers. This series works in the bottom two: the applications, and the technology they run on."},
 {"id":"list","gap":0.8,"text":"Here are the hundred and forty systems from Today, and where it's going, each with its own job: billing, outages, meter data, finance."},
 {"id":"above","gap":0.8,"text":"Above them, the information layer: what the data means, and where each fact is born."},
 {"id":"box","gap":0.8,"text":"And among the applications, one box: data warehouse. That's the data platform, drawn as one more application."},
 {"id":"ask","gap":0.8,"text":"Ravi asks Tomás to move it. But first, a word that means two things."}]},
"words":{"name":"Two kinds of platform","lead":1.0,"tail":1.0,"vo":[
 {"id":"vendor","gap":0.8,"text":"Databricks calls its product a data platform, and so do other vendors. At the technology layer, it is one: many components, sold as one product."},
 {"id":"yours","gap":0.8,"text":"Your data platform is more: a service the utility runs for all its domains."},
 {"id":"parts","gap":0.8,"text":"It's built from that product and the components around it: identity, the network, integration, orchestration, reporting tools, and what watches it all."},
 {"id":"team","gap":0.8,"text":"And from a team, with rules and support, that keeps it running for everyone."},
 {"id":"keep","gap":0.8,"text":"In this series, Databricks is the product. The data platform is the service."}]},
"test":{"name":"The test","lead":1.0,"tail":1.0,"vo":[
 {"id":"billing","gap":0.8,"text":"Take billing. It has one purpose: to bill customers. Its rules are built into it: tariffs, estimates, discounts."},
 {"id":"owner","gap":0.8,"text":"Its owner is the head of retail, who decides what it does. It's measured by retail's outcomes: bills right, and on time."},
 {"id":"none","gap":0.8,"text":"The data platform has no purpose of its own. It gives shared capabilities: bring data in, store it, process it, serve it, and govern it."},
 {"id":"many","gap":0.8,"text":"On it, many owners build their own logic: the network, retail, finance."},
 {"id":"ent","gap":0.8,"text":"And one more: the enterprise domain, for measures that cross domains, for performance and analysis."},
 {"id":"test","gap":0.8,"text":"That's the test. One purpose, with its logic built in: an application. Shared capabilities, on which many owners build their own: a platform."}]},
"erp":{"name":"Not every shared system","lead":1.0,"tail":1.0,"vo":[
 {"id":"erp","gap":0.8,"text":"Serving every domain isn't the test on its own. The finance system serves finance, procurement and people."},
 {"id":"suite","gap":0.8,"text":"But it's an application suite. Each part has one purpose, and its logic is built in, the way its vendor designed it."},
 {"id":"line","gap":0.8,"text":"The line is where the logic lives: inside the system, or brought to it by its owners."}]},
"logic":{"name":"Whose logic","lead":1.0,"tail":1.0,"vo":[
 {"id":"horses","gap":0.8,"text":"The stations of the Tōkaidō kept the horses and porters ready. They never wrote the letters they carried."},
 {"id":"runs","gap":0.8,"text":"On a data platform, the logic runs on it, in each domain's data products, never in the platform's own components."},
 {"id":"always","gap":0.8,"text":"And its owner is always the business, never the platform team by default."},
 {"id":"hard","gap":0.8,"text":"That's easy to say, and hard to see, because the platform brings the data in and runs the code."}]},
"minutes":{"name":"A number nobody owns","lead":1.0,"tail":1.0,"vo":[
 {"id":"measure","gap":0.8,"text":"One of the enterprise domain's measures: minutes without power, per customer. It goes to the regulator."},
 {"id":"built","gap":0.8,"text":"It's built on the platform from three systems: outages, the network map, and the old storm tool."},
 {"id":"jump","gap":0.8,"text":"In March, it jumps from about eight minutes to nineteen."},
 {"id":"why","gap":0.8,"text":"A major storm counted. The rule that leaves major storms out came in the storm tool's export, and an update in February dropped it."},
 {"id":"whose","gap":0.8,"text":"Whose rule was it? The code was the platform team's. The storm tool had no notes, and the person who set it up had left."},
 {"id":"find","gap":0.8,"text":"Tomás's map and the catalogue find its owner: the measure belongs to the enterprise domain, and for the regulator's measures, that's Ama."},
 {"id":"ticket","gap":0.8,"text":"Ama raises a ticket, and writes in the glossary which storms don't count, as the regulator's method says."},
 {"id":"build","gap":0.8,"text":"The data team builds the rule on the platform, with a test, and reviews the pull request."},
 {"id":"check","gap":0.8,"text":"Ama checks the number in test before her ticket closes. March is back to nine minutes."}]},
"owner":{"name":"An owner who answers to all","lead":1.0,"tail":1.0,"vo":[
 {"id":"road","gap":0.8,"text":"The roads had an owner too: the shogunate. Its officials rode free, others paid their way, and the stations and nearby villages carried the burden."},
 {"id":"sponsor","gap":0.8,"text":"A data platform has a business owner too: a sponsor, with a platform product owner."},
 {"id":"all","gap":0.8,"text":"But it answers to every domain that uses it. It decides less of what's built on it, and answers for how well it serves them all."},
 {"id":"measured","gap":0.8,"text":"It's measured by its users' outcomes: how many build on it, how fast a first data product ships, how reliable it is, and what it costs."}]},
"why":{"name":"Why the map matters most here","lead":1.0,"tail":1.0,"vo":[
 {"id":"most","gap":0.8,"text":"That's why enterprise architecture matters most for a data platform."},
 {"id":"crosses","gap":0.8,"text":"It's the one system that crosses every domain, and every layer: business, data, applications and technology."},
 {"id":"inside","gap":0.8,"text":"It can't be designed from inside any one of them."}]},
"practice":{"name":"The data practice on the map","lead":1.0,"tail":1.0,"vo":[
 {"id":"intro","gap":0.8,"text":"Here's the data practice, on Tomás's map."},
 {"id":"tech","gap":0.8,"text":"In the technology layer, the platform's services: storage, compute, the catalogue. Databricks realises them, as system software."},
 {"id":"app","gap":0.8,"text":"In the application layer, the measure's data product: its pipeline and models, one application component, owned by the enterprise domain."},
 {"id":"port","gap":0.8,"text":"Where others read it, its output port, is an application interface. Its tables are artifacts, kept on the platform."},
 {"id":"none","gap":0.8,"text":"The platform's components hold no rule. The product on them does, with its owner."}]},
"end":{"name":"Every domain's road","lead":1.0,"tail":1.0,"vo":[
 {"id":"letters","gap":0.8,"text":"The Gokaidō carried every domain's letters and goods for more than two and a half centuries. What they said was always the sender's business."},
 {"id":"data","gap":0.8,"text":"Drawn as a platform, Ravi's does the same: every domain builds on it, and every rule on it has an owner Tomás's map can find."},
 {"id":"next","gap":0.8,"text":"Next: what's inside the platform."}]}
};
