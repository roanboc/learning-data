// A product with an owner, the eighth film of the data governance series. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"bazaar":{"name":"Who stands behind it","lead":1.4,"tail":1.0,"vo":[
 {"id":"y1461","gap":0.8,"text":"Istanbul, 1461.","say":"Istanbul, fourteen sixty-one."},
 {"id":"hall","gap":0.8,"text":"Sultan Mehmed the Second has a stone hall built for the city's most precious goods: the bedesten."},
 {"id":"streets","gap":0.8,"text":"Shops spread into the streets around it."},
 {"id":"y1520","gap":0.8,"text":"By the 1520s, nearly eight hundred stand outside its walls.","say":"By the fifteen-twenties, nearly eight hundred stand outside its walls."},
 {"id":"named","gap":0.8,"text":"In time, each trade has its own street, named after it."},
 {"id":"guild","gap":0.8,"text":"And each has its guild, with rules for what its goods must be."},
 {"id":"check","gap":0.8,"text":"The guild's officers check the goods, and so does the market inspector."},
 {"id":"short","gap":0.8,"text":"A master who sells short answers for it."},
 {"id":"buyer","gap":0.8,"text":"So a buyer knows where to find a thing, what it will be, and who stands behind it."},
 {"id":"back","gap":0.8,"text":"And they come back."},
 {"id":"data","gap":0.8,"text":"Data can be offered the same way: as a product, with a promise, and someone who answers for it."}]},
"late":{"name":"Nobody's table","lead":1.0,"tail":1.0,"vo":[
 {"id":"policy","gap":0.8,"text":"Today, Yusuf takes down another policy: data is managed as an asset, with clear accountability."},
 {"id":"anil","gap":0.8,"text":"Anil, an analyst in the Faculty of Health, tells him what happened last March."},
 {"id":"census","gap":0.8,"text":"On census day, Planning's count of learners near an award wasn't ready at seven."},
 {"id":"needed","gap":0.8,"text":"The faculty needed it to plan next semester's places."},
 {"id":"asked","gap":0.6,"text":"Anil asked Jun, who built it."},
 {"id":"round","gap":0.8,"text":"Jun said Noor designed it. Noor said Planning asked for it. And Planning said Jun builds it."},
 {"id":"nobody","gap":0.8,"text":"One table, and nobody who answered for it."}]},
"promise":{"name":"Data with a promise","lead":1.0,"tail":1.0,"vo":[
 {"id":"sit","gap":0.8,"text":"Yusuf sits down with Noor and Clara, from Planning."},
 {"id":"question","gap":0.8,"text":"One question: what does this table promise, and who keeps the promise?"},
 {"id":"write","gap":0.8,"text":"They write it on a card, and list it in the university's catalogue."},
 {"id":"for","gap":0.8,"text":"What it's for, and how to use it. Its owner: Clara, for Planning."},
 {"id":"contract","gap":0.8,"text":"What's in it, column by column, and the checks it must pass."},
 {"id":"levels","gap":0.8,"text":"Its service levels: built every night, and ready by seven on census day."},
 {"id":"ask","gap":0.8,"text":"Where to ask, a version, and a status."},
 {"id":"product","gap":0.8,"text":"That's a data product: data, with a promise, and an owner who keeps it."}]},
"answers":{"name":"Who answers for what","lead":1.0,"tail":1.0,"vo":[
 {"id":"clara","gap":0.8,"text":"Clara answers for the product: that it's on time, that it keeps its promise, and that its users are heard."},
 {"id":"mei","gap":0.8,"text":"What award means is still Mei's to decide."},
 {"id":"guild","gap":0.8,"text":"As in the bazaar, where the guild's rules said what the goods must be, and each master answered for his stall."},
 {"id":"two","gap":0.8,"text":"The meaning has an owner, and so does the product. They can be different people."}]},
"job":{"name":"Wanting the job","lead":1.0,"tail":1.0,"vo":[
 {"id":"didnt","gap":0.8,"text":"But Clara didn't ask for this. “I'm not technical,” she says."},
 {"id":"depends","gap":0.8,"text":"So Yusuf shows her who depends on it: the near-award dashboard, and every faculty that plans from it."},
 {"id":"worth","gap":0.8,"text":"What it's worth to them: a number on time, from someone they can ask."},
 {"id":"comes","gap":0.8,"text":"And what comes with it: Jun still builds it, Noor designs it, Sam runs it, and any change to it needs her yes."},
 {"id":"code","gap":0.8,"text":"She answers for the promise, not the code."}]},
"steps":{"name":"Products and steps","lead":1.0,"tail":1.0,"vo":[
 {"id":"every","gap":0.8,"text":"Not every table is a product."},
 {"id":"models","gap":0.8,"text":"The data team keeps thirty-three tables. Ten are used by other teams, and each of those belongs to one of six products."},
 {"id":"rest","gap":0.8,"text":"The rest are steps, which only the data team needs."},
 {"id":"check","gap":0.8,"text":"Every change is checked: a table other teams use must belong to exactly one product, or the change goes back."},
 {"id":"source","gap":0.8,"text":"Some products stay close to one system, like Awards."},
 {"id":"join","gap":0.8,"text":"Some join several, like Learner records."},
 {"id":"use","gap":0.8,"text":"And some serve one use, like Planning's."}]},
"readers":{"name":"Known by name","lead":1.0,"tail":1.0,"vo":[
 {"id":"knows","gap":0.8,"text":"Each product also knows who uses it: not from a mailing list, but from the record of who uses what."},
 {"id":"dash","gap":0.8,"text":"The near-award dashboard uses Planning's product."},
 {"id":"three","gap":0.8,"text":"The registrar's learner records are used by three other products: the wallet's, Planning's and Finance's."},
 {"id":"mei","gap":0.8,"text":"Mei publishes them for everyone to build on, and she knows who does."}]},
"life":{"name":"From draft to retired","lead":1.0,"tail":1.0,"vo":[
 {"id":"life","gap":0.8,"text":"And a product has a life."},
 {"id":"draft","gap":0.8,"text":"It's a draft until its owner says it's ready, and active while people rely on it."},
 {"id":"dep","gap":0.8,"text":"When it's no longer needed, it's deprecated: it gets a date to go, and its users are asked to move."},
 {"id":"v1","gap":0.8,"text":"An old edition goes the same way. Learner records still holds the first edition of its credentials, until the end of March 2027.","say":"An old edition goes the same way. Learner records still holds the first edition of its credentials, until the end of March twenty twenty-seven."},
 {"id":"none","gap":0.8,"text":"Nobody uses it now, so on that date it's retired."}]},
"found":{"name":"Found, and trusted","lead":1.0,"tail":1.0,"vo":[
 {"id":"finds","gap":0.8,"text":"Now Anil finds Planning's product in the catalogue, among the others: its promise, its owner, and where to ask."},
 {"id":"like","gap":0.8,"text":"Like a buyer in the bazaar, he knows where to find it, what it will be, and who stands behind it."},
 {"id":"runs","gap":0.8,"text":"The policy runs in the work now: a product, an owner, and a check."},
 {"id":"own","gap":0.8,"text":"Own the product, not only the meaning."},
 {"id":"next","gap":0.8,"text":"Next, Anil makes a list of his own, for the faculty's advisers. It will need an owner too."}]}
};
