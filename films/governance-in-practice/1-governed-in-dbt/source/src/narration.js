// Governed in dbt, the first film of Governance you can use, the third series on data governance. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"rules":{"name":"The rules arrive first","lead":1.2,"tail":1.0,"vo":[
 {"id":"today","gap":0.8,"text":"Today, in the data team's room."},
 {"id":"loop","gap":0.8,"text":"Jun Park builds in ten steps round a loop, from a question to a new version, as the team's poster shows."},
 {"id":"opens","gap":0.8,"text":"Now he opens a pull request, a change put up for review: a new table for Planning, the awards conferred this year, by faculty."},
 {"id":"slowed","gap":0.8,"text":"When Yusuf asked what slowed him down, Jun said: the rules arrive after I've built it."},
 {"id":"owner","gap":0.8,"text":"One rule is that every table other teams use has an owner, someone who answers for what it means."},
 {"id":"months","gap":0.8,"text":"For four months, the council's minutes carried the same action: name the data owners."},
 {"id":"nobody","gap":0.8,"text":"Without an owner, nobody answers for a number."},
 {"id":"census","gap":0.8,"text":"On census day, the Faculty of Health couldn't plan its places: Anil was sent from Jun, to Noor, to Planning, and back to Jun."},
 {"id":"change","gap":0.8,"text":"Something had to change."},
 {"id":"live","gap":0.8,"text":"Now the rules live in the project, beside the code, and a check runs them on every pull request."},
 {"id":"answers","gap":0.8,"text":"In a minute, it answers Jun: no owner, and how to add one."},
 {"id":"adds","gap":0.8,"text":"He adds two lines, and the check turns green."},
 {"id":"itself","gap":0.8,"text":"The change goes to Planning for review, by itself."},
 {"id":"minute","gap":0.8,"text":"An action the council carried for four months is now a check that takes a minute."},
 {"id":"first","gap":0.8,"text":"And for Jun, the rules arrive first, while he can still fix them."}]},
"pins":{"name":"A pin at each step","lead":1.0,"tail":1.0,"vo":[
 {"id":"pins","gap":0.3,"text":"Governance puts a pin where each decision enters the loop:"},
 {"id":"pins1","gap":0.3,"text":"a term at the question, a class of personal data at the sources, an owner and a contract at the gaps,"},
 {"id":"pins2","gap":0.8,"text":"a rule at the tests, an approval at review, a version when it changes."},
 {"id":"line","gap":0.8,"text":"In dbt, each pin is a line beside the model's code."},
 {"id":"learner","gap":0.8,"text":"The learner table names its owner, Mei, and the term it holds."},
 {"id":"columns","gap":0.8,"text":"Each column says whether it identifies a person, and each test has an owner."},
 {"id":"reviewed","gap":0.8,"text":"All of it is reviewed with the code."}]},
"access":{"name":"Who may build on what","lead":1.0,"tail":1.0,"vo":[
 {"id":"groups","gap":0.8,"text":"Groups and access decide who may build on what."},
 {"id":"private","gap":0.8,"text":"The data team's first layers are private to its group."},
 {"id":"public","gap":0.8,"text":"Its core tables are public, for any team, and the marts protected, for this project only."},
 {"id":"stops","gap":0.8,"text":"Build on a private one, and dbt stops before anything runs."},
 {"id":"builds","gap":0.8,"text":"Jun's new table reads only public tables, so it builds."},
 {"id":"read","gap":0.8,"text":"But who may read it is the platform's to decide, in the next film."}]},
"contract":{"name":"A promise the build keeps","lead":1.0,"tail":1.0,"vo":[
 {"id":"contract","gap":0.8,"text":"Every table other teams use has a contract: these columns, these types."},
 {"id":"mismatch","gap":0.8,"text":"Each build checks it, and a mismatch stops the table being replaced."},
 {"id":"version","gap":0.3,"text":"A change that would break a reader becomes a new version, beside the old one, with a date to go:"},
 {"id":"date","gap":0.8,"text":"credentials' first version goes on 31 March 2027.","say":"credentials' first version goes on the thirty-first of March, twenty twenty-seven."},
 {"id":"exposures","gap":0.8,"text":"And exposures name who uses each table, and who answers for each use."}]},
"impact":{"name":"What this change touches","lead":1.0,"tail":1.0,"vo":[
 {"id":"touches","gap":0.8,"text":"Each pull request also says what it touches."},
 {"id":"tuesday","gap":0.8,"text":"On Tuesday, Jun's first draft relabelled microcredentials of 6 credit points or more as awards.","say":"On Tuesday, Jun's first draft relabelled microcredentials of six credit points or more as awards."},
 {"id":"report","gap":0.8,"text":"The impact check wrote it into the pull request: five reports and apps depend on it, four owners to ask."},
 {"id":"mei","gap":0.8,"text":"Mei said a change of meaning breaks, even when the columns don't."},
 {"id":"column","gap":0.8,"text":"So Jun added a column instead: counts as an award."},
 {"id":"additive","gap":0.8,"text":"The check called it additive, with three owners to tell."},
 {"id":"renamed","gap":0.8,"text":"A renamed column would fail: a breaking change needs a new version."}]},
"owners":{"name":"Reviews go to the owners","lead":1.0,"tail":1.0,"vo":[
 {"id":"made","gap":0.8,"text":"Who reviews what is made from the same owners."},
 {"id":"script","gap":0.8,"text":"A script writes the reviewers file: the registrar's office for credentials, Planning for its tables, Clara for her product."},
 {"id":"asks","gap":0.8,"text":"GitHub asks them on every pull request, and a check fails if the file falls behind."},
 {"id":"decisions","gap":0.8,"text":"Decisions are files too, with who decided, when and why."}]},
"teach":{"name":"A check that teaches","lead":1.0,"tail":1.0,"vo":[
 {"id":"says","gap":0.8,"text":"Every message says what to add, and where, and links a page on how, with who to ask."},
 {"id":"warns","gap":0.8,"text":"A new rule warns first."},
 {"id":"holds","gap":0.8,"text":"Every column other teams read must say what it holds: until the first of December, that's a warning with its date, then an error."},
 {"id":"fell","gap":0.8,"text":"Week by week, the warnings fell from forty-one to none."},
 {"id":"anil","gap":0.8,"text":"When Anil added a column, the check showed him how to classify it."}]},
"agent":{"name":"An agent on every pull request","lead":1.0,"tail":1.0,"vo":[
 {"id":"reviews","gap":0.8,"text":"And an agent reviews every pull request, against the same rules."},
 {"id":"skill","gap":0.8,"text":"It follows a skill the team wrote: run the checks, read what they can't, and draft what's missing."},
 {"id":"found","gap":0.8,"text":"On Anil's first pull request, his faculty's call list, it found no owner, ten columns with no class, and a rule with no test."},
 {"id":"drafted","gap":0.8,"text":"It drafted each, with counts as evidence, never values, and said who decides."},
 {"id":"never","gap":0.8,"text":"The agent never approves. People decide."}]},
"close":{"name":"Carried with the code","lead":1.0,"tail":1.0,"vo":[
 {"id":"goes","gap":0.8,"text":"Jun's table goes in, with its owner, its classes, its contract and Planning's yes."},
 {"id":"home","gap":0.3,"text":"On Noor's map, the project is the home of owners, classes, contracts, tests and decisions,"},
 {"id":"flow","gap":0.8,"text":"and their copies flow one way, to the platform and the catalogue."},
 {"id":"after","gap":0.8,"text":"The rules don't arrive after he's built it any more."},
 {"id":"every","gap":0.8,"text":"They arrive with every change."},
 {"id":"last","gap":0.8,"text":"The project carries governance with the code."}]}
};
