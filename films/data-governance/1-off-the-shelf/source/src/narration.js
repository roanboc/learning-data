// Off the shelf, the opening film of the data governance series. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"measure":{"name":"One measure","lead":1.4,"tail":1.0,"vo":[
 {"id":"m1215","gap":0.8,"text":"In 1215, Magna Carta made a promise.","say":"In twelve fifteen, Magna Carta made a promise."},
 {"id":"quote","gap":0.8,"text":"“There is to be one measure of wine throughout our kingdom, and one measure of ale, and one measure of corn.”"},
 {"id":"repeat","gap":0.8,"text":"For six hundred years, the promise was repeated, and measures still differed from town to town."},
 {"id":"kings","gap":0.8,"text":"Kings sent standards to the towns. Officers checked them now and then."},
 {"id":"county","gap":0.8,"text":"It wasn't enough. In 1871, a member of Parliament said that in his county alone, a bushel meant thirty-two different measures.","say":"It wasn't enough. In eighteen seventy-one, a member of Parliament said that in his county alone, a bushel meant thirty-two different measures."},
 {"id":"worked","gap":0.3,"text":"What finally worked was all of it together:"},
 {"id":"three","gap":0.8,"text":"one definition in law, a copy in every county, and an inspector who checked against it, again and again, with the law behind him."}]},
"shelf":{"name":"The shelf","lead":1.0,"tail":1.0,"vo":[
 {"id":"starts","gap":0.8,"text":"Today, Yusuf Demir starts as the university's data governance lead."},
 {"id":"shelf","gap":0.8,"text":"He inherits a shelf of thirty-four policies, and a maturity score: 2.1 out of 5.","say":"He inherits a shelf of thirty-four policies, and a maturity score: two point one out of five."},
 {"id":"chart","gap":0.8,"text":"A chart of who's responsible for what, with half its names still to be confirmed."},
 {"id":"council","gap":0.8,"text":"And the minutes of a council that meets once a month."},
 {"id":"brief","gap":0.8,"text":"His brief: fix governance before the next submission to the government."}]},
"numbers":{"name":"Two numbers","lead":1.0,"tail":1.0,"vo":[
 {"id":"week","gap":0.8,"text":"The same week, two reports disagree."},
 {"id":"census","gap":0.8,"text":"Planning's census report says 4,812 awards were conferred this year.","say":"Planning's census report says four thousand, eight hundred and twelve awards were conferred this year."},
 {"id":"draft","gap":0.8,"text":"The draft submission to the government says 4,867.","say":"The draft submission to the government says four thousand, eight hundred and sixty-seven."},
 {"id":"which","gap":0.8,"text":"Which number is right?"}]},
"decides":{"name":"Who decides?","lead":1.0,"tail":1.0,"vo":[
 {"id":"follow","gap":0.8,"text":"Yusuf follows the numbers back."},
 {"id":"both","gap":0.8,"text":"Both are right, each by its own meaning of award."},
 {"id":"monday","gap":0.8,"text":"On Monday, the word changed: microcredentials of at least six credit points now count."},
 {"id":"before","gap":0.8,"text":"One report ran before the change, the other after."},
 {"id":"gov","gap":0.8,"text":"But the government counts awards by its own definition. Who decides how ours maps to it?"},
 {"id":"answers","gap":0.8,"text":"Mei owns what award means here. Jun builds what the model says. Planning reports what it's given."},
 {"id":"tbc","gap":0.8,"text":"And the chart says: to be confirmed."}]},
"for":{"name":"What governance is for","lead":1.0,"tail":1.0,"vo":[
 {"id":"policy","gap":0.8,"text":"Policy 12 says that business terms are defined consistently.","say":"Policy twelve says that business terms are defined consistently."},
 {"id":"doesnt","gap":0.8,"text":"It doesn't say who decides, or how a decision reaches the work."},
 {"id":"for","gap":0.8,"text":"That's what governance is for: deciding who decides, and making sure each decision reaches the work."},
 {"id":"like","gap":0.8,"text":"Like the inspector at the market: a rule, a copy where the work happens, and someone who checks."},
 {"id":"mgmt","gap":0.8,"text":"Governance sets the rules and checks they're kept. Management does the work."}]},
"wheel":{"name":"Governance at the centre","lead":1.0,"tail":1.0,"vo":[
 {"id":"body","gap":0.8,"text":"Data management has a body of knowledge: DAMA's.","say":"Data management has a body of knowledge: Dahma's."},
 {"id":"wheel","gap":0.8,"text":"It draws eleven areas as a wheel, with governance at the centre, where the others meet."},
 {"id":"others","gap":0.8,"text":"Others cover the same ground, or part of it: DCAM, ISO 8000 for data quality, and ISO/IEC 38505 for governing data.","say":"Others cover the same ground, or part of it: Dee-cam, eye-so eight thousand for data quality, and eye-so, I E C, thirty-eight five oh five, for governing data."},
 {"id":"takes","gap":0.8,"text":"This series takes what they agree on, and shows where it runs."}]},
"listen":{"name":"Listen first","lead":1.0,"tail":1.0,"vo":[
 {"id":"ask","gap":0.8,"text":"Yusuf doesn't write a thirty-fifth policy. He asks everyone the same question: what slows you down?"},
 {"id":"jun","gap":0.8,"text":"For Jun, the rules arrive after the work is built."},
 {"id":"mei","gap":0.8,"text":"Mei approves the words, then never sees where they're used."},
 {"id":"sam","gap":0.8,"text":"Sam could protect a column in minutes, if anyone said which."},
 {"id":"plan","gap":0.8,"text":"Planning doesn't know which number to trust."},
 {"id":"binder","gap":0.8,"text":"The people who wrote the binder weren't the problem. They wrote what they were asked for."},
 {"id":"tools","gap":0.8,"text":"Governance is people's work. Tools can carry out what people agree, but they can't make them agree."}]},
"runs":{"name":"Where does it run?","lead":1.4,"tail":1.0,"vo":[
 {"id":"takes","gap":0.8,"text":"So he opens the binder, with one question for every line: where does it run?"},
 {"id":"runs","gap":0.8,"text":"Some lines can run in the work itself, as a required field, a check, a tag or a test."},
 {"id":"owned","gap":0.8,"text":"Some are decisions: someone owns each one, and writes it down where the work can find it."},
 {"id":"go","gap":0.8,"text":"And some can go."}]},
"enter":{"name":"Where decisions enter","lead":1.3,"tail":1.0,"vo":[
 {"id":"places","gap":0.8,"text":"And the work already has places for them."},
 {"id":"loop","gap":0.8,"text":"The data team builds in a loop of ten steps, from a question to a new version."},
 {"id":"pin","gap":0.8,"text":"Governance doesn't need another meeting. It needs a pin at the right steps:"},
 {"id":"pins","text":"a term when the question is asked, a classification at the source, an owner and a contract,"},
 {"id":"pins2","gap":0.8,"text":"a rule as a test, an approval at review, and a version when it changes."}]},
"series":{"name":"The series","lead":1.0,"tail":1.0,"vo":[
 {"id":"next","gap":0.8,"text":"Over nine more films, Yusuf takes the binder off the shelf, one kind of policy at a time."},
 {"id":"tools","gap":0.8,"text":"Then six more show how to build them, with dbt and Databricks."},
 {"id":"wish","gap":0.8,"text":"A policy that doesn't run anywhere is a wish."}]}
};
