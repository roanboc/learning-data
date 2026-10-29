// Products in open formats, film 5 of 6 of Governance you can use, the third series on data governance. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"promise":{"name":"A promise in a file","lead":1.2,"tail":1.0,"vo":[
 {"id":"room","gap":0.8,"text":"Today, in Noor's room, Noor and Clara go over Clara's product."},
 {"id":"designs","gap":0.8,"text":"Noor designs the university's data and its six data products: data with a promise, and an owner who keeps it."},
 {"id":"clara","gap":0.8,"text":"Clara's is the count of learners near an award, ready by seven on census day."},
 {"id":"typed","gap":0.8,"text":"But the promises were typed by hand into a catalogue, where people look for data, and the tables changed every week."},
 {"id":"column","gap":0.8,"text":"So the catalogue could promise a column the table no longer had."},
 {"id":"census","gap":0.8,"text":"And on census day, a faculty's report could break, just when it's needed to plan next semester's places."},
 {"id":"format","gap":0.8,"text":"And each catalogue kept its promises in its own format: change the catalogue, and every promise is typed again."},
 {"id":"change","gap":0.8,"text":"Something had to change."},
 {"id":"now","gap":0.3,"text":"Now each promise is a file, kept with the code, in two open standards that any tool can read:"},
 {"id":"pair","gap":0.8,"text":"one for the product, and one for its table's contract."},
 {"id":"written","gap":0.8,"text":"The contract is written from the table's own code, so the two can't disagree, and a change that would break it stops."},
 {"id":"jun","gap":0.8,"text":"When Jun added a column to credentials, its contract grew by a line, by itself, and no report broke."},
 {"id":"ten","gap":0.8,"text":"All ten tables other teams read have a promise that's checked on every change."},
 {"id":"stay","gap":0.8,"text":"And whichever catalogue shows them, the promises stay the university's."}]},
"owner":{"name":"Written by its owner","lead":0.8,"tail":0.8,"vo":[
 {"id":"file","gap":0.8,"text":"Each product starts as a short file its owner writes."},
 {"id":"for","gap":0.8,"text":"Clara's says what the product is for, and how to use it."},
 {"id":"names","gap":0.8,"text":"It names her as its owner, the table it offers, and its service levels: built every night, and ready by seven on census day."},
 {"id":"ask","gap":0.8,"text":"And it says where to ask."},
 {"id":"keeps","gap":0.8,"text":"The data team builds the table. Clara keeps the promise."}]},
"contract":{"name":"The contract, from the model","lead":0.8,"tail":0.8,"vo":[
 {"id":"is","gap":0.3,"text":"The contract is the promise about the table itself:"},
 {"id":"each","gap":0.8,"text":"each column, its type, whether it's always there, whether it can identify a person, and the tests it must pass."},
 {"id":"nobody","gap":0.8,"text":"Nobody types it."},
 {"id":"script","gap":0.8,"text":"A script writes it from the model, the code that builds the table, and from the product's file, in the Open Data Contract Standard."},
 {"id":"side","gap":0.8,"text":"Side by side, each line of the model has its line in the contract."},
 {"id":"check","gap":0.8,"text":"On every pull request, a check fails if they've drifted apart, or if the contract breaks the standard's rules."}]},
"shared":{"name":"Every shared table, in one product","lead":0.8,"tail":0.8,"vo":[
 {"id":"every","gap":0.8,"text":"Not every table is a product."},
 {"id":"ten","gap":0.8,"text":"Of the data team's thirty-three tables, ten are read by other teams, and each is in exactly one of six products."},
 {"id":"same","gap":0.8,"text":"The same script checks that too."},
 {"id":"new","gap":0.8,"text":"A new table other teams read, in no product, stops its pull request until a product takes it in."}]},
"break":{"name":"A change that would break it","lead":0.8,"tail":0.8,"vo":[
 {"id":"follows","gap":0.8,"text":"When a model changes, its contract follows, by itself."},
 {"id":"some","gap":0.8,"text":"But some changes break the readers."},
 {"id":"rename","gap":0.8,"text":"Rename a column in Clara's table, and the impact check fails: it's breaking, so it needs a new version."},
 {"id":"stays","gap":0.8,"text":"So the old version stays, with a date to go, and the new one goes beside it."},
 {"id":"two","gap":0.8,"text":"Credentials already has two: the first retires on the 31st of March 2027, and its contract says it's deprecated, on its way out.","say":"Credentials already has two: the first retires on the thirty-first of March twenty twenty-seven, and its contract says it's deprecated, on its way out."},
 {"id":"add","gap":0.8,"text":"Better still, add: a new column breaks nobody."}]},
"readers":{"name":"Who reads it","lead":0.8,"tail":0.8,"vo":[
 {"id":"says","gap":0.8,"text":"Each product also says who reads it, from the record of who uses what: Planning's census dashboard reads Clara's table."},
 {"id":"built","gap":0.8,"text":"And it names what it's built from: two of Mei's products, the learner records and the awards."},
 {"id":"when","gap":0.8,"text":"So when one of them changes, Mei knows who to tell, before anything ships."}]},
"open":{"name":"Open standards","lead":0.8,"tail":0.8,"vo":[
 {"id":"both","gap":0.8,"text":"Both files are written in open standards: one for data products, one for data contracts."},
 {"id":"bitol","gap":0.8,"text":"They're kept by Bitol, at the Linux Foundation: free for anyone to use, and versioned."},
 {"id":"tools","gap":0.8,"text":"Tools that know them can read the files, and a check holds every file to the standard's rules."},
 {"id":"keeps","gap":0.8,"text":"The project keeps the versions its catalogue reads today, and moves when the catalogue does."}]},
"catalogue":{"name":"A catalogue over the platform","lead":0.8,"tail":0.8,"vo":[
 {"id":"ontos","gap":0.8,"text":"On the platform, the university's catalogue is Ontos, from Databricks Labs."},
 {"id":"imports","gap":0.8,"text":"It imports each contract from its file, and lays the products out by domain, each with its team."},
 {"id":"steward","gap":0.8,"text":"A steward reviews a product before it's published."},
 {"id":"policy","gap":0.8,"text":"Each night, a policy checks every product: an active one with no owner is tagged, and governance is told."},
 {"id":"link","gap":0.8,"text":"And it can link each column to the business term it holds."},
 {"id":"labs","gap":0.8,"text":"But a Labs project comes as it is, with no formal support."},
 {"id":"home","gap":0.8,"text":"So the files stay at home, in the project, and the catalogue holds a copy."}]},
"close":{"name":"Outlives the tool","lead":0.8,"tail":0.8,"vo":[
 {"id":"march","gap":0.8,"text":"On census day next March, a faculty will open Clara's product in the catalogue, read its promise, and plan from it by seven."},
 {"id":"changed","gap":0.3,"text":"If the catalogue has changed by then, the promise hasn't:"},
 {"id":"file","gap":0.8,"text":"it's a file, in an open format, kept with the code, and any tool that knows the standard can read it."},
 {"id":"last","gap":0.8,"text":"A contract in an open format outlives the tool."}]}
};
