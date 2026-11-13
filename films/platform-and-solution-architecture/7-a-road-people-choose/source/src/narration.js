// Platform and solution architecture · A road people choose. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"ise":{"name":"Once in a lifetime","lead":1.6,"tail":1.0,"vo":[
 {"id":"year","gap":0.8,"text":"Japan, the 1700s. Ordinary people may not travel as they please, but a pilgrimage is hard to refuse.","say":"Japan, the seventeen hundreds. Ordinary people may not travel as they please, but a pilgrimage is hard to refuse."},
 {"id":"once","gap":0.8,"text":"And people say: once in a lifetime, to Ise, to the great shrine."},
 {"id":"far","gap":0.8,"text":"From Edo, that's the Tōkaidō most of the way, then the road south to Ise."},
 {"id":"farmer","gap":0.8,"text":"But a farmer who has never left his village doesn't know the road: where to sleep, how far to the next station, what it all costs."},
 {"id":"cost","gap":0.8,"text":"And the journey costs more than one household can spare."},
 {"id":"need","gap":0.8,"text":"Villagers need a way to go that they can follow without knowing the road, and a way to pay for it."},
 {"id":"group","gap":0.8,"text":"So villages form pilgrimage groups. Every household pays in each year, and each year two or three, chosen by lot, go for everyone."},
 {"id":"oshi","gap":0.8,"text":"Priests from Ise, the oshi, visit those villages every year, bringing charms and calendars."},
 {"id":"lodge","gap":0.8,"text":"At Ise, the oshi lodge the pilgrims in their own houses, and guide them to the shrines."},
 {"id":"book","gap":0.8,"text":"And guidebooks list every station on the way: how far apart they are, the inns, and the sights."},
 {"id":"choose","gap":0.8,"text":"Nobody is made to go. But the way is laid out, paid for together, and someone is expecting them at the end."},
 {"id":"many","gap":0.8,"text":"So ordinary people go: hundreds of thousands in an ordinary year."},
 {"id":"ferry","gap":0.8,"text":"In 1771, more than two million cross the river into Ise in a few months, counted at the ferry.","say":"In seventeen seventy-one, more than two million cross the river into Ise in a few months, counted at the ferry."},
 {"id":"tale","gap":0.8,"text":"Later, a comic tale of two travellers on their way to Ise becomes a craze like none before, and prints of the road's stations follow."},
 {"id":"one","gap":0.8,"text":"At the utility, the last team to put its first data product on the platform waited six weeks, and two teams gave up and built their own."},
 {"id":"ravi","gap":0.8,"text":"So Ravi Menon makes the platform a road teams choose: the easiest way to do it right."}]},
"weeks":{"name":"Six weeks","lead":1.6,"tail":1.4,"vo":[
 {"id":"last","gap":0.8,"text":"A year ago, network's team wanted its first data product on the platform: planned outages, for the call centre."},
 {"id":"tickets","gap":0.8,"text":"It took eleven tickets: a workspace, storage, an account for its job, and each right it needed."},
 {"id":"queue","gap":0.8,"text":"Each one waited its turn in the platform team's queue."},
 {"id":"scratch","gap":0.8,"text":"Then the team wrote its pipeline from nothing, and learned the catalogue's rules when its first pull request came back."},
 {"id":"six","gap":0.8,"text":"Six weeks, before the call centre could see one planned outage."},
 {"id":"gave","gap":0.8,"text":"Two other teams gave up. Field services runs a database on its own server, and metering works from spreadsheets."},
 {"id":"wrong","gap":0.8,"text":"Nobody did anything wrong. The platform was the safe way, but not yet the easy one."},
 {"id":"order","gap":0.8,"text":"Ravi could order every team onto the platform. But an order makes teams use it, not want it, and the quick way finds a way around."}]},
"users":{"name":"Teams, as customers","lead":1.8,"tail":1.4,"vo":[
 {"id":"product","gap":0.8,"text":"So Ravi treats the platform as a product, and the teams that build on it as its customers."},
 {"id":"sits","gap":0.8,"text":"His team sits with each domain team, to see what it needs to do, and what gets in its way."},
 {"id":"three","gap":0.8,"text":"Three things come up again and again: waiting on tickets, not knowing where to start, and learning the rules by being refused."},
 {"id":"story","gap":0.8,"text":"As the oshi visited the villages every year, the platform team goes to the teams."},
 {"id":"more","gap":0.8,"text":"Services with customers shows how to write it down: who each service is for, and what they need."}]},
"path":{"name":"A path already laid","lead":1.8,"tail":1.4,"vo":[
 {"id":"grow","gap":0.8,"text":"First, a path already laid. The template every new job starts from grows into one for a whole data product."},
 {"id":"form","gap":0.8,"text":"A team fills in one form: the product's name, its owner, and what it holds. No tickets."},
 {"id":"gets","gap":0.8,"text":"Minutes later, it has a repository with all a data product needs."},
 {"id":"list","gap":0.8,"text":"A pipeline that runs, its tests, a contract for its readers, its entry in the catalogue, rights by role, and its log."},
 {"id":"own","gap":0.8,"text":"The team writes only what's its own: the logic, in a pull request the data team reviews."},
 {"id":"leave","gap":0.8,"text":"A team may leave the path where it needs something else. That part is then its own to run."},
 {"id":"right","gap":0.8,"text":"So the quickest way to a data product is also the right one."}]},
"rules":{"name":"Rules built in","lead":1.8,"tail":1.4,"vo":[
 {"id":"built","gap":0.8,"text":"The rules are built into the path, so a team meets them as it works, not at the end."},
 {"id":"which","gap":0.8,"text":"Personal data is classed before anything is published. The tests run on every pull request. And nothing goes live without an owner."},
 {"id":"back","gap":0.8,"text":"So no first pull request comes back for a rule nobody mentioned."},
 {"id":"rails","gap":0.8,"text":"Guardrails, not gates: they keep a team on the road, without stopping it."}]},
"guide":{"name":"A guide, and someone to ask","lead":1.8,"tail":1.4,"vo":[
 {"id":"guide","gap":0.8,"text":"Then a guide: every step from the form to a first data product, how long each takes, and whom to ask."},
 {"id":"grows","gap":0.8,"text":"It's written from the questions teams asked, and it grows with each new one."},
 {"id":"channel","gap":0.8,"text":"And a question in the platform's channel gets an answer the same day."},
 {"id":"story","gap":0.8,"text":"As the guidebooks listed every station, the inns and the sights, the guide lists every step of the way."}]},
"days":{"name":"Two days","lead":1.8,"tail":1.4,"vo":[
 {"id":"monday","gap":0.8,"text":"In March, metering's team tries again, on the path. On Monday morning, it fills in the form."},
 {"id":"lunch","gap":0.8,"text":"By lunch it has its repository, and writes its logic: which reads count, and how estimates are marked."},
 {"id":"tuesday","gap":0.8,"text":"On Tuesday, the data team reviews the pull request, and the tests pass."},
 {"id":"live","gap":0.8,"text":"By Tuesday evening, checked meter reads are in the catalogue, with their owner, ready for network and retail."},
 {"id":"two","gap":0.8,"text":"Two days, not six weeks. And metering's spreadsheets are retired."}]},
"count":{"name":"Counted at the ferry","lead":1.8,"tail":1.4,"vo":[
 {"id":"counts","gap":0.8,"text":"Ravi counts what tells him the platform works as a product."},
 {"id":"three","gap":0.8,"text":"How many teams choose the path, how long a first data product takes, and what teams say, asked every quarter."},
 {"id":"dec","gap":0.8,"text":"By December, eight of the eleven domain teams have chosen it, and none was told to."},
 {"id":"days","gap":0.8,"text":"A first data product takes two to four days, and nine in ten teams would tell another to use it."},
 {"id":"server","gap":0.8,"text":"Field services moves its jobs onto the platform, and its own server is switched off."},
 {"id":"back","gap":0.8,"text":"And metering's team adds a check to the template, so every team gets it."},
 {"id":"story","gap":0.8,"text":"At Ise, the pilgrims were counted at the ferry. Here, Ravi counts who chooses the road."}]},
"practice":{"name":"The data practice on the map","lead":1.4,"tail":1.4,"vo":[
 {"id":"intro","gap":0.8,"text":"Here's the platform as a product, on Tomás's map."},
 {"id":"path","gap":0.8,"text":"The path is one of the data platform's technology services: a new data product, from the template."},
 {"id":"serves","gap":0.8,"text":"It serves each data product made from it, each owned by its domain."},
 {"id":"goal","gap":0.8,"text":"And the goal, teams choose the platform, is realised by two outcomes: eight teams of eleven, and a first data product in days."}]},
"end":{"name":"The road, chosen","lead":1.0,"tail":1.0,"vo":[
 {"id":"road","gap":0.8,"text":"Nobody was made to go to Ise. The way was laid out, paid for together, and someone was expecting them at the end."},
 {"id":"data","gap":0.8,"text":"On the data platform, teams choose the road because it's the easiest way to do it right."},
 {"id":"what","gap":0.8,"text":"A path already laid, the rules built in, a guide, and someone to ask. And someone counts who chooses it."},
 {"id":"next","gap":0.8,"text":"Next: built to change."}]}
};
