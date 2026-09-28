// From words to data · Many ways to read. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"cards":{"name":"One book, three cards","lead":1.6,"tail":1.0,"vo":[
 {"id":"catalogue","gap":0.8,"text":"For most of the twentieth century, a library's card catalogue filed each book three times: under its author, its title and its subject."},
 {"id":"same","gap":0.8,"text":"One book on the shelf. Three ways in."},
 {"id":"step","gap":0.8,"text":"Every card had to be kept in step with the book, or readers went to the wrong shelf."},
 {"id":"today","gap":0.8,"text":"Data for reading works the same way: copies arranged for the questions people ask."}]},
"argue":{"name":"The argument","lead":1.0,"tail":1.0,"vo":[
 {"id":"four","gap":0.8,"text":"Ask four data engineers how to shape data for reading, and you may get four answers: a normalised core, a data vault, a star, or one wide table."},
 {"id":"names","gap":0.8,"text":"The arguments have names: Inmon's integrated core, Kimball's stars, Linstedt's data vault, and one big table."},
 {"id":"new","gap":0.8,"text":"This week, there's a new source to add: credentials from the short-course platform."},
 {"id":"job","gap":0.8,"text":"There's no best shape. There's a best shape for each job."}]},
"integrate":{"name":"Integrate first","lead":1.0,"tail":1.0,"vo":[
 {"id":"many","gap":0.8,"text":"The first job is to bring many sources together, under one meaning."},
 {"id":"core","gap":0.8,"text":"One way is a normalised core: a shape built to write, but for the whole university."},
 {"id":"vault","gap":0.8,"text":"Another is a data vault. Hubs hold the business keys, the things that identify a learner or a credential. Links hold the relationships between them."},
 {"id":"sat","gap":0.8,"text":"Satellites hold the descriptions, and every change to them, with the source and the time each change arrived."},
 {"id":"new","gap":0.8,"text":"A new source just adds new satellites. Nothing that exists has to change."},
 {"id":"audit","gap":0.8,"text":"It's built for change, and for audit. It isn't built for people to query."}]},
"present":{"name":"Present for people","lead":1.0,"tail":1.0,"vo":[
 {"id":"star","gap":0.8,"text":"For people, there's the star: one for awards, one for enrolments, one for fees."},
 {"id":"share","gap":0.8,"text":"They share the same learner and the same calendar, so one question can cross them: awards and fees, for the same learners, in the same year."},
 {"id":"conformed","gap":0.8,"text":"These shared dimensions are called conformed. They make the stars agree with each other."},
 {"id":"bus","gap":0.8,"text":"Engineers plan them on a grid called a bus matrix: the business processes down the side, the shared dimensions across the top."}]},
"serve":{"name":"Serve an entity","lead":1.0,"tail":1.0,"vo":[
 {"id":"one","gap":0.8,"text":"Some questions are always about one thing: one learner."},
 {"id":"row","gap":0.8,"text":"So build one wide row per learner: their current course, their credit so far, every credential, and what's next."},
 {"id":"easy","gap":0.8,"text":"It's easy for people, for machine learning and for AI assistants. Most questions become a single lookup."},
 {"id":"genie","gap":0.8,"text":"Which learners are close to a graduate certificate? With a wide table, that's one filter, not five joins."},
 {"id":"cost","gap":0.8,"text":"The cost: many columns to maintain, and the same measure defined twice, unless you're careful."}]},
"where":{"name":"Where each lives","lead":1.0,"tail":1.0,"vo":[
 {"id":"place","gap":0.8,"text":"On the platform from The Inner Life of Data, each shape has its place."},
 {"id":"silver","gap":0.8,"text":"Silver integrates, in a normalised core or a vault."},
 {"id":"gold","gap":0.8,"text":"Gold presents stars for people, and serves wide tables to tools."},
 {"id":"sem","gap":0.8,"text":"And a semantic layer can sit on top, so every tool asks for the same definitions."}]},
"choose":{"name":"Choosing","lead":1.0,"tail":1.0,"vo":[
 {"id":"vault","gap":0.8,"text":"Many sources that keep changing, and auditors who ask where each value came from: a vault."},
 {"id":"star","gap":0.8,"text":"Many processes that share the same context: conformed stars."},
 {"id":"wide","gap":0.8,"text":"One entity, asked about in many ways, by people and by AI: wide tables."},
 {"id":"copies","gap":0.8,"text":"And don't copy for its own sake. Every shape is another copy to keep in step, like the library's cards."},
 {"id":"fashion","gap":0.8,"text":"Choose per question, not per fashion. Most platforms use more than one."}]},
"end":{"name":"Pull back","lead":1.0,"tail":1.0,"vo":[
 {"id":"arrived","gap":0.8,"text":"The short-course credentials arrived this week. The vault took them without changing a thing."},
 {"id":"grew","gap":0.8,"text":"The award star gained new rows, and each learner's wide row gained a column."},
 {"id":"next","gap":0.8,"text":"Next: what if the app and the analysts used the same database?"}]}
};
