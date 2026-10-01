// In the weeds of data crafting · Who owns what. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"register":{"name":"The register is the title","lead":1.4,"tail":1.0,"vo":[
 {"id":"act","gap":0.8,"text":"In 1858, South Australia passed a law for land, promoted by Robert Torrens.","say":"In eighteen fifty-eight, South Australia passed a law for land, promoted by Robert Torrens."},
 {"id":"chain","gap":0.8,"text":"Before it, buying land meant tracing a chain of old deeds, and hoping none was missing."},
 {"id":"title","gap":0.8,"text":"After it, the government's register was the title, and anyone could rely on it."},
 {"id":"transfer","gap":0.8,"text":"Only a registered transfer, signed by the owner, could change it."},
 {"id":"bridge","gap":0.8,"text":"A core model works the same way. Its owner publishes it, everyone relies on it, and only its owner changes it."}]},
"domains":{"name":"Domains","lead":1.0,"tail":1.0,"vo":[
 {"id":"green","gap":0.8,"text":"The credential model builds, and every test is green. One project, built by one team."},
 {"id":"registrar","gap":0.8,"text":"But its meaning has owners. The registrar's office, where Mei works, owns learners and awards, and the student IDs it issues."},
 {"id":"learning","gap":0.8,"text":"The learning team owns microcredentials and badges, and the keys of its two platforms."},
 {"id":"domain","gap":0.8,"text":"Each is a domain: it owns the meaning of the facts it records."},
 {"id":"consumers","gap":0.8,"text":"Planning and the wallet app are domains too. They own what they build for themselves: their marts."},
 {"id":"follows","gap":0.8,"text":"In the project, each model names its domain, and each group names an owner. Ownership follows meaning, not the code."}]},
"products":{"name":"What a domain publishes","lead":1.0,"tail":1.0,"vo":[
 {"id":"publish","gap":0.8,"text":"So what does a domain publish? A core model, as a product."},
 {"id":"learner","gap":0.8,"text":"Take the learner. Its YAML states its grain: one row per learner per version."},
 {"id":"owner","gap":0.8,"text":"Its owner: Mei, at the registrar's office. Its domain, and the word in the glossary it holds."},
 {"id":"promise","gap":0.8,"text":"An enforced contract. A version number, so a change never arrives as a surprise. And its documentation."},
 {"id":"build","gap":0.8,"text":"Noor's group builds it. Mei owns what it means. Everyone else builds on it, not on how it was made."}]},
"access":{"name":"Private, protected, public","lead":1.0,"tail":1.0,"vo":[
 {"id":"rings","gap":0.8,"text":"Who can build on what? In dbt, that's access, and it comes in three rings."},
 {"id":"private","gap":0.6,"text":"Private: only models in the same group can refer to it. That's staging and intermediate."},
 {"id":"protected","gap":0.6,"text":"Protected: any model in the same project. That's the marts."},
 {"id":"public","gap":0.8,"text":"Public: any project at all. That's the core."},
 {"id":"refused","gap":0.8,"text":"The wallet team tries to build on an intermediate model. dbt refuses before anything runs, and says why."},
 {"id":"allowed","gap":0.8,"text":"Then it builds on Planning's mart. dbt allows it: same project, and the mart is protected."},
 {"id":"wrong","gap":0.8,"text":"It's still wrong. That mart is shaped for Planning, and changes when Planning needs it to. Consumers build on the core, not on each other's marts."}]},
"grants":{"name":"Who can read","lead":1.0,"tail":1.0,"vo":[
 {"id":"refer","gap":0.8,"text":"Access decides which models can refer to a model. It doesn't decide who can read its table."},
 {"id":"grants","gap":0.8,"text":"On Databricks, grants do that. Planning's marts grant reading to the groups Planning names."},
 {"id":"agent","gap":0.8,"text":"The agent works as its own service principal. It reads the core and the marts, and writes only to its own development schema."},
 {"id":"doors","gap":0.8,"text":"Referring and reading are two different doors, with two different keys."}]},
"across":{"name":"Across projects","lead":1.0,"tail":1.0,"vo":[
 {"id":"today","gap":0.8,"text":"Today, it's all one project. One day, Planning may own a project of its own."},
 {"id":"depends","gap":0.8,"text":"Then it names the project it depends on: credentials."},
 {"id":"pinned","gap":0.8,"text":"And it refers to the core by project and by name, pinned to a version: the learner, version one."},
 {"id":"only","gap":0.8,"text":"Only public models cross. Planning can't reach the wallet's marts, or any step inside. The domains meet on the core."},
 {"id":"sketch","gap":0.8,"text":"This part is a sketch. References across projects need dbt Cloud, so it doesn't run on DuckDB."}]},
"shared":{"name":"What stays shared","lead":1.0,"tail":1.0,"vo":[
 {"id":"still","gap":0.8,"text":"Split into domains, some things must still be shared."},
 {"id":"keysets","gap":0.8,"text":"The key sets: one per system, each with its owner."},
 {"id":"hash","gap":0.8,"text":"One macro for every hash. Aisha's student ID gives the same sixty-four characters, in every project."},
 {"id":"another","gap":0.8,"text":"Hash it another way, without the macro's upper case, and she gets a second key. Joins find nothing, and no test fails."},
 {"id":"package","gap":0.8,"text":"The conventions and the glossary, too. Macros don't cross projects, so the shared ones would move to a package both install."},
 {"id":"silos","gap":0.8,"text":"Without shared keys, domains become silos."}]},
"split":{"name":"Groups first","lead":1.0,"tail":1.0,"vo":[
 {"id":"why","gap":0.8,"text":"So why not split now? Every project is more to deploy, and more to keep in step."},
 {"id":"decided","gap":0.8,"text":"On the twelfth of October, Noor decided: groups first, in one project, while one team builds the core. Projects later, when teams own their domains."},
 {"id":"hands","gap":0.8,"text":"Many owners, and many hands. One of them isn't a person."}]}
};
