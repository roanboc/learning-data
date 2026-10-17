// Master and reference data · One person, many systems. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"bern":{"name":"A treaty for every pair","lead":1.6,"tail":1.0,"vo":[
 {"id":"pairs","gap":0.8,"text":"Before 1874, every pair of countries that exchanged letters needed a postal treaty of its own.","say":"Before eighteen seventy-four, every pair of countries that exchanged letters needed a postal treaty of its own."},
 {"id":"route","gap":0.8,"text":"A letter's price depended on its route."},
 {"id":"signed","gap":0.8,"text":"That year, in Bern, twenty-one countries signed one treaty instead."},
 {"id":"one","gap":0.8,"text":"They became one postal territory, with one rate for a letter, and each kept the postage it collected."},
 {"id":"own","gap":0.8,"text":"Nobody built a post office for the world. Each country kept its own, and they shared the rules."}]},
"again":{"name":"Applying again","lead":1.0,"tail":1.0,"vo":[
 {"id":"today","gap":0.8,"text":"Today, at the university, Linh Nguyen wants to apply for a PhD."},
 {"id":"last","gap":0.8,"text":"Last time she applied, she got a second student number, and Mei's office had to link the two."},
 {"id":"still","gap":0.8,"text":"The application still creates a person first, and nobody looks until later."},
 {"id":"four","gap":0.8,"text":"And four systems need to know who she is: the student system, HR, the research office and the alumni office."}]},
"ways":{"name":"Four ways","lead":0.8,"tail":1.0,"vo":[
 {"id":"noor","gap":0.8,"text":"Noor, the data architect, lays out four ways to give them one person."},
 {"id":"registry","gap":0.8,"text":"A registry only links. It knows which records are one person, and asks each system for the rest."},
 {"id":"copy","gap":0.8,"text":"A copy for analysis gathers everyone in the lakehouse, so reports count each person once."},
 {"id":"master","gap":0.8,"text":"A master that systems read back keeps the person in one place, and each system reads her from it."},
 {"id":"central","gap":0.8,"text":"Or one place creates every person, and the systems only read."}]},
"after":{"name":"After the fact","lead":0.8,"tail":1.0,"vo":[
 {"id":"have","gap":0.8,"text":"The university already has the first two: Mei's links, and the copy in the lakehouse."},
 {"id":"late","gap":0.8,"text":"Both find Linh after the fact. Neither stops a third number."},
 {"id":"cost","gap":0.8,"text":"The last two do, but every system that reads back has to change."}]},
"lightest":{"name":"The lightest that works","lead":0.8,"tail":1.0,"vo":[
 {"id":"which","gap":0.8,"text":"So which is the lightest way that still works?"},
 {"id":"doors","gap":0.8,"text":"New people come in at two doors: the application and HR."},
 {"id":"those","gap":0.8,"text":"So those two read the person back. The research and alumni offices only add roles, so links are enough for them."},
 {"id":"bern","gap":0.8,"text":"Like Bern: no post office for the world. Each system keeps its own, and they share the person."}]},
"elsewhere":{"name":"Elsewhere","lead":0.8,"tail":1.0,"vo":[
 {"id":"bank","gap":0.8,"text":"Others need a heavier way. A bank's customer hub is read by every product system."},
 {"id":"country","gap":0.8,"text":"Many countries keep one population register, and agencies ask it instead of keeping their own."}]},
"search":{"name":"Search before create","lead":0.8,"tail":1.0,"vo":[
 {"id":"door","gap":0.8,"text":"And one change at the door: before the application creates a person, it searches for one."},
 {"id":"compares","gap":0.8,"text":"It compares the name, the birth date, the email, and any number from before."},
 {"id":"clear","gap":0.8,"text":"A clear match adds a role. A likely one waits for Mei's office to decide."},
 {"id":"nobody","gap":0.8,"text":"Only when nobody matches is a new person made."}]},
"rule":{"name":"Who may create a person","lead":0.8,"tail":1.0,"vo":[
 {"id":"write","gap":0.8,"text":"Noor and Mei write down who may create a person: only the application and HR, after a search."},
 {"id":"add","gap":0.8,"text":"The research and alumni offices never do. They add roles to people already there."}]},
"found":{"name":"Found","lead":0.8,"tail":1.0,"vo":[
 {"id":"applies","gap":0.8,"text":"In October, Linh applies for her PhD."},
 {"id":"finds","gap":0.8,"text":"The search finds her: the same birth date, the same email, and the student number she gave."},
 {"id":"adds","gap":0.8,"text":"So the application adds a role, applicant, to the person she already is. No new number, and nothing to merge later."}]},
"apart":{"name":"Kept apart","lead":0.8,"tail":1.0,"vo":[
 {"id":"other","gap":0.8,"text":"The same week, another Linh Nguyen applies. It's a common Vietnamese name."},
 {"id":"born","gap":0.8,"text":"But she was born in another year, writes from another email, and has never studied here."},
 {"id":"only","gap":0.8,"text":"Only the name agrees. So she becomes a new person, with her own number, and none of Linh's history."}]},
"product":{"name":"The person, published","lead":0.8,"tail":1.0,"vo":[
 {"id":"behind","gap":0.8,"text":"Behind the search is the person, published as a data product, and owned by Mei's office."},
 {"id":"contract","gap":0.8,"text":"A contract fixes its shape, and a new version marks any change to it, so nothing that reads it breaks by surprise."},
 {"id":"tools","gap":0.8,"text":"dbt builds and tests it, and Databricks governs who may read it."},
 {"id":"synced","gap":0.8,"text":"A synced table serves it to the application, while the applicant waits."}]},
"shared":{"name":"One person, shared","lead":0.8,"tail":1.0,"vo":[
 {"id":"bern","gap":0.8,"text":"In Bern, each country kept its post office, and they shared the rules."},
 {"id":"here","gap":0.8,"text":"Here, each system keeps its records, and they share one person."},
 {"id":"idea","gap":0.8,"text":"Choose the lightest way that solves the problem."}]}
};
