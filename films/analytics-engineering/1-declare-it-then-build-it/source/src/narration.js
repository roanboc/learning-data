// In the weeds of data crafting · Declare it, then build it. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"plan":{"name":"A plan is not a building","lead":1.4,"tail":1.0,"vo":[
 {"id":"copy","gap":0.8,"text":"In the 1870s, architects began copying their drawings as blueprints: white lines on blue paper, one copy for every trade on site.","say":"In the eighteen-seventies, architects began copying their drawings as blueprints: white lines on blue paper, one copy for every trade on site."},
 {"id":"exact","gap":0.8,"text":"A blueprint says exactly what the building will be: where every wall stands, how thick it is, and what it carries."},
 {"id":"brick","gap":0.8,"text":"It doesn't lay a single brick."}]},
"recap":{"name":"Where we left off","lead":1.0,"tail":1.0,"vo":[
 {"id":"too","gap":0.8,"text":"Data has blueprints too."},
 {"id":"offices","gap":0.8,"text":"At a university, four offices once gave four different answers to one question: how many credentials did we award?"},
 {"id":"agreed","gap":0.8,"text":"So they agreed what a credential is, and wrote it down as a model."},
 {"id":"four","gap":0.8,"text":"A model answers four questions. What a thing is. What makes it the same one everywhere. What one row holds. And when each thing was true."},
 {"id":"names","gap":0.8,"text":"Meaning, identity, grain and time."},
 {"id":"v3","gap":0.8,"text":"Version three of the university's model has just been approved."},
 {"id":"series","gap":0.8,"text":"The series From words to data tells that story. This is all you need from it."}]},
"shapes":{"name":"Many shapes, one model","lead":1.0,"tail":1.0,"vo":[
 {"id":"many","gap":0.8,"text":"A model can be written down in many shapes: a normalised core, stars, a data vault, anchors, hooks, one wide table per entity."},
 {"id":"same","gap":0.8,"text":"Each has its champions. Look inside any of them, and you find the same four answers."},
 {"id":"middle","gap":0.8,"text":"This series takes a middle way. Integrate on business keys, keep every version, and serve each entity as one wide row, with stars where people need them."}]},
"build":{"name":"Someone has to build it","lead":1.0,"tail":1.0,"vo":[
 {"id":"still","gap":0.8,"text":"But an approved model is still a blueprint."},
 {"id":"arrive","gap":0.8,"text":"The data arrives from three systems, each with its own keys, its own codes, and every version it has ever had."},
 {"id":"turn","gap":0.8,"text":"Someone has to turn what arrives into what was agreed, and show that it matches."},
 {"id":"jun","gap":0.8,"text":"That's the work of an analytics engineer. At the university, that's Jun."}]},
"work":{"name":"The building work","lead":1.0,"tail":1.0,"vo":[
 {"id":"transform","gap":0.8,"text":"The building work is transformation: select, join, clean and reshape."},
 {"id":"tools","gap":0.8,"text":"It can be done in notebooks, in stored procedures, or in pipeline tools. Jun's team uses dbt, a widely used tool for it."},
 {"id":"file","gap":0.8,"text":"Each transformation is a SQL query, in its own file."},
 {"id":"order","gap":0.8,"text":"dbt works out the order from how the queries refer to each other, builds each result as a table or a view on the platform, and keeps the tests and documentation beside the code."}]},
"name":{"name":"The name that misleads","lead":1.0,"tail":1.0,"vo":[
 {"id":"calls","gap":0.8,"text":"dbt calls each of these queries a model. It's a useful name, and a misleading one."},
 {"id":"step","gap":0.8,"text":"A query is one step of the building work. The model is the blueprint."},
 {"id":"apart","gap":0.8,"text":"This series is about keeping the two apart, and connecting them. It's for analytics engineers, and it goes into the weeds."}]},
"models":{"name":"Three hundred models","lead":1.0,"tail":1.0,"vo":[
 {"id":"year","gap":0.8,"text":"A year from now, Jun's project could hold three hundred of these files, in four layers, each folder named for its domain."},
 {"id":"steps","gap":0.8,"text":"Most are steps: one tidies a source, one matches a learner's three keys, one stitches their history into a single timeline."},
 {"id":"core","gap":0.8,"text":"Only the core holds what the blueprint names: a learner, a credential, an award. The marts serve each consumer what it asked for."},
 {"id":"which","gap":0.8,"text":"So which file is the data model? None of them."}]},
"lives":{"name":"Where the model lives","lead":1.0,"tail":1.0,"vo":[
 {"id":"beside","gap":0.8,"text":"The model lives beside the code."},
 {"id":"yaml","gap":0.8,"text":"In YAML: what one row holds, which key makes it unique, how it relates to the rest, and the contract each table promises.","say":"In yammel: what one row holds, which key makes it unique, how it relates to the rest, and the contract each table promises."},
 {"id":"md","gap":0.8,"text":"In a conceptual model, with a diagram anyone can read: what each thing means. And in a decision log beside it: why it was decided that way."},
 {"id":"check","gap":0.8,"text":"The queries make the tables. The YAML and the Markdown say what those tables must be, and the tests check that they are.","say":"The queries make the tables. The yammel and the Markdown say what those tables must be, and the tests check that they are."}]},
"steps":{"name":"Four phases","lead":1.0,"tail":1.0,"vo":[
 {"id":"ten","gap":0.8,"text":"Jun works in four phases: ask, promise, build and keep. Ten steps in all."},
 {"id":"s1","gap":0.6,"text":"Ask. Start from a question. Learn what the sources really hold. Define what each consumer needs."},
 {"id":"s4","gap":0.6,"text":"Promise. Name the gaps, and write the contracts. Write the tests, before any code."},
 {"id":"s7","gap":0.6,"text":"Build. Layer by layer. Validate against a number people trust. Review and ship."},
 {"id":"s9","gap":0.8,"text":"Keep. Each fact written once, and a model that evolves without breaking anyone."},
 {"id":"agent","gap":0.8,"text":"An AI agent can help at every step. At every step, a person approves."}]},
"series":{"name":"The series","lead":1.0,"tail":1.0,"vo":[
 {"id":"next","gap":0.8,"text":"The next eight films take the steps in turn."},
 {"id":"list1","gap":0.3,"text":"Scoping a model from a question. What makes a learner the same one across systems, and how keys and hashes make it explicit. Grain and time."},
 {"id":"list2","gap":0.8,"text":"Contracts and tests. Building in layers. Who owns what, across domains. Working with an agent, responsibly. And writing it all down, once."},
 {"id":"real","gap":0.8,"text":"Everything they show is real code and real data. It runs on dbt Core, with DuckDB, and you can run it yourself."}]},
"end":{"name":"Pull back","lead":1.0,"tail":1.0,"vo":[
 {"id":"bp","gap":0.8,"text":"A blueprint says what a building will be. The building work makes it true."},
 {"id":"data","gap":0.8,"text":"In data, the model is the blueprint, and dbt is one way to build it."},
 {"id":"declare","gap":0.8,"text":"Declare it. Then build it."}]}
};
