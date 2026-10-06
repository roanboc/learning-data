// In the weeds of data crafting · Who owns what. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"register":{"name":"The register is the title","lead":1.4,"tail":1.0,"vo":[
 {"id":"act","gap":0.8,"text":"Before 1858, buying land in South Australia meant tracing a chain of old deeds, and hoping none was missing.","say":"Before eighteen fifty-eight, buying land in South Australia meant tracing a chain of old deeds, and hoping none was missing."},
 {"id":"chain","gap":0.8,"text":"That year, a law promoted by Robert Torrens made the government's register the title."},
 {"id":"title","gap":0.8,"text":"Anyone could rely on it, without checking its history."},
 {"id":"transfer","gap":0.8,"text":"Only a registered transfer, signed by the owner, could change it."},
 {"id":"bridge","gap":0.8,"text":"The credential's core models work the same way. Their owner publishes them, everyone relies on them, and only their owner changes them."}]},
"domains":{"name":"Domains","lead":1.0,"tail":1.0,"vo":[
 {"id":"green","gap":0.8,"text":"Everything is green, in one project."},
 {"id":"registrar","gap":0.8,"text":"But its meaning has owners. The registrar's office, where Mei works, owns learners, awards and credentials, and the student IDs it issues."},
 {"id":"learning","gap":0.8,"text":"The learning team owns two kinds of credential, microcredentials and badges, and the keys of its two platforms."},
 {"id":"domain","gap":0.8,"text":"So there are three kinds of domain. The systems, and the teams that run them, are application domains."},
 {"id":"data","gap":0.8,"text":"What the facts mean, learners, credentials and awards, are data domains, named as the reference model names them: student and course."},
 {"id":"consumers","gap":0.8,"text":"And Planning and the wallet app are business domains: they decide with the data, and own the marts they build for it."},
 {"id":"laid","gap":0.8,"text":"The project is laid out the same way: sources by system, the core by data domain, the marts and exposures by consumer."},
 {"id":"follows","gap":0.6,"text":"Each group names an owner, and the staging, core and mart models name their domain. Ownership follows meaning, not the code."}]},
"products":{"name":"What a domain publishes","lead":1.0,"tail":1.0,"vo":[
 {"id":"publish","gap":0.8,"text":"So what does a domain publish? A core model, as a product."},
 {"id":"learner","gap":0.8,"text":"Take the learner. Its YAML states its grain: one row per learner per version."},
 {"id":"owner","gap":0.8,"text":"Its owner: Mei, at the registrar's office. Its domain. And its glossary term: learner."},
 {"id":"promise","gap":0.8,"text":"An enforced contract. A version number, so a change never arrives as a surprise. And its documentation."},
 {"id":"build","gap":0.8,"text":"Noor's group builds it. Mei owns what it means. Everyone else builds on it, not on how it was made."}]},
"access":{"name":"Private, protected, public","lead":1.0,"tail":1.0,"vo":[
 {"id":"rings","gap":0.8,"text":"Who can build on what? In dbt, that's access, and it comes in three rings."},
 {"id":"public","gap":0.6,"text":"Two came with the contracts. Public, for the core: any project can build on it."},
 {"id":"protected","gap":0.6,"text":"Protected, for the marts: only this project."},
 {"id":"private","gap":0.8,"text":"The third is private: only models in the same group. That's staging and intermediate."},
 {"id":"refused","gap":0.8,"text":"The wallet team tries to build on an intermediate model. dbt refuses before anything runs, and says why."},
 {"id":"allowed","gap":0.8,"text":"Then it builds on Planning's mart. dbt allows it: same project, and the mart is protected."},
 {"id":"wrong","gap":0.8,"text":"It's still wrong. That mart is shaped for Planning, and changes when Planning needs it to. Consumers build on the core, not on each other's marts."}]},
"grants":{"name":"Who can read","lead":1.0,"tail":1.0,"vo":[
 {"id":"refer","gap":0.8,"text":"Access decides which models can refer to a model. It doesn't decide who can read its table."},
 {"id":"grants","gap":0.8,"text":"On Databricks, grants do that. Planning's marts grant reading to the groups Planning names."},
 {"id":"dashboard","gap":0.8,"text":"A dashboard can read a private staging table, if a grant lets it. Access doesn't stop it."},
 {"id":"doors","gap":0.8,"text":"Referring and reading are two different doors, opened by two different rules."}]},
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
 {"id":"another","gap":0.8,"text":"Hash it another way, in lower case, and she gets a second key. Joins find nothing, and no test fails."},
 {"id":"package","gap":0.8,"text":"The conventions and the glossary, too. Macros don't cross projects, so the shared ones would move to a package both install."},
 {"id":"silos","gap":0.8,"text":"Without shared keys, domains become silos."}]},
"split":{"name":"Groups first","lead":1.0,"tail":1.0,"vo":[
 {"id":"why","gap":0.8,"text":"So why not split now? Every project is more to deploy, and more to keep in step."},
 {"id":"decided","gap":0.8,"text":"On the twelfth of October, Noor decided: groups first, in one project, while one team builds the core. Projects later, when teams own their domains."},
 {"id":"later","gap":0.8,"text":"When that day comes, a domain moves out with its own folders: its marts, its exposures, its seeds and its decisions. Nothing else needs untangling."},
 {"id":"hands","gap":0.8,"text":"Many owners, and many hands. One of them isn't a person."}]}
};
