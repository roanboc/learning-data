// The map before the data · A map people and agents can read. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"stars":{"name":"By the stars","lead":1.4,"tail":1.0,"vo":[
 {"id":"coast","gap":0.8,"text":"May 1976. The double-hulled canoe Hōkūleʻa leaves Maui for Tahiti, more than four thousand kilometres south, with no compass and no charts.","say":"May, nineteen seventy-six. The double-hulled canoe Hōkūleʻa leaves Maui for Tahiti, more than four thousand kilometres south, with no compass and no charts."},
 {"id":"mau","gap":0.8,"text":"Its navigator, Mau Piailug, from Satawal in Micronesia, finds his way by the stars, the swells and the birds."},
 {"id":"ring","gap":0.8,"text":"His map is in his memory: a star compass, the points on the horizon where the stars rise and set."},
 {"id":"land","gap":0.8,"text":"After thirty-one days, the crew sights Mataiva. Three days later, in Papeʻete, more than seventeen thousand people are waiting."},
 {"id":"few","gap":0.8,"text":"Few still held this knowledge. It passed only from navigator to apprentice."},
 {"id":"teach","gap":0.8,"text":"Mau chose to teach it beyond his own island, so it wouldn't be lost. A young Hawaiian, Nainoa Thompson, learned it from him, and taught others."},
 {"id":"link","gap":0.8,"text":"Any map lives only while people use it, keep it true, and teach it to the next navigator."},
 {"id":"test","gap":0.8,"text":"The navigator's test: could someone else sail by it?"}]},
"risk":{"name":"Useful, so at risk","lead":1.0,"tail":1.0,"vo":[
 {"id":"note","gap":0.8,"text":"Tomás's last note asks how to keep the map alive."},
 {"id":"used","gap":0.8,"text":"It's used every week now: for the skipper's test, to give rules a home, and to answer the minister."},
 {"id":"stale","gap":0.8,"text":"That's when a map goes stale."},
 {"id":"slides","gap":0.8,"text":"It lives in slides, and in a modelling tool only Tomás edits."},
 {"id":"typed","gap":0.8,"text":"Its applications were typed in by hand from the IT service management tool, and many have changed since."},
 {"id":"copies","gap":0.8,"text":"Its views are copied into decks, and the copies drift. The glossary and the catalogue keep their own words."},
 {"id":"worse","gap":0.8,"text":"A stale map is worse than none, because people trust it."},
 {"id":"fails","gap":0.8,"text":"If Tomás left tomorrow, nobody could sail by it. It fails the navigator's test."}]},
"sources":{"name":"One map, many sources","lead":1.0,"tail":1.0,"vo":[
 {"id":"move","gap":0.8,"text":"So he moves the map into an enterprise architecture tool that everyone can reach, with a database and a graph."},
 {"id":"kept","gap":0.8,"text":"Much of what it holds is already kept somewhere else."},
 {"id":"where","gap":0.8,"text":"Strategy in documents, goals and initiatives in the project management tool, applications and servers in the IT service management tool."},
 {"id":"in","gap":0.8,"text":"The tool brings each one in with its source's ID, and keeps it in step, so nobody retypes it."},
 {"id":"rest","gap":0.8,"text":"The rest is written in the map itself: capabilities, rules, decisions, and the links between everything."},
 {"id":"terms","gap":0.8,"text":"Even the business glossary fits: each term is a business object, defined once by the business."},
 {"id":"job","gap":0.8,"text":"So keeping a map true is a data integration job, as well as a modelling one."}]},
"text":{"name":"Each element once","lead":1.0,"tail":1.0,"vo":[
 {"id":"once","gap":0.8,"text":"Each element is kept once: a capability, a step, a domain, a business object, a rule, a measure."},
 {"id":"id","gap":0.8,"text":"Each has a stable ID. Names change, but IDs don't, so everything else points to the ID."},
 {"id":"fields","gap":0.8,"text":"Then its name, its definition, its owner, and its relationships, named as ArchiMate names them."},
 {"id":"rules","gap":0.8,"text":"And his two rules from day one, on every element: its evidence, with a date, and whether its owner has confirmed it."},
 {"id":"decisions","gap":0.8,"text":"Decisions are kept too, each saying why."},
 {"id":"files","gap":0.8,"text":"A small map could keep all this as text files in a repository: the simplest approach."},
 {"id":"scale","gap":0.8,"text":"With many sources, and many people in their roles, the utility needs the tool. Either way, the ideas are the same."}]},
"review":{"name":"Reviewed and versioned","lead":1.0,"tail":1.0,"vo":[
 {"id":"repo","gap":0.8,"text":"Every version of the map is kept, with who changed what, and when."},
 {"id":"pr","gap":0.8,"text":"A change is proposed as a draft, and nothing changes until it's approved."},
 {"id":"owner","gap":0.8,"text":"The owner of that part approves it: Grace for the network's, Ama for the obligations."},
 {"id":"checks","gap":0.8,"text":"Checks run on the map itself, on every change."},
 {"id":"list","gap":0.8,"text":"Every element has an owner. Every rule, a reason and a home. Every measure, a definition."},
 {"id":"power","gap":0.8,"text":"Generating power still has no owner, and the check says so, every time."}]},
"views":{"name":"One map, many views","lead":1.0,"tail":1.0,"vo":[
 {"id":"gen","gap":0.8,"text":"Everything people read is generated from the map, one way."},
 {"id":"list","gap":0.8,"text":"The ArchiMate views, the glossary, the conceptual model, the ontology, the tests and tracking tables, and the heat map."},
 {"id":"readers","gap":0.8,"text":"Each one answers the questions of the people who read it."},
 {"id":"dbt","gap":0.8,"text":"In dbt, each model carries its owner, its domain and the IDs of its rules."},
 {"id":"dbx","gap":0.8,"text":"In Databricks, each table shows its owner, its tags and its description, beside its lineage."},
 {"id":"nobody","gap":0.8,"text":"Nobody edits a view. A fix goes to the map, and every view follows."}]},
"reads":{"name":"An agent reads it","lead":1.0,"tail":1.0,"vo":[
 {"id":"now","gap":0.8,"text":"Now an agent can read the map."},
 {"id":"request","gap":0.8,"text":"Given a request, it applies the skipper's test, and finds the decision, the capability and the owner, or nothing."},
 {"id":"change","gap":0.8,"text":"Given a change, it walks the layers, as Tomás did for the social tariff, and lists the owners who must agree."},
 {"id":"column","gap":0.8,"text":"Given a column in the catalogue, it finds the rule behind it, with its owner and its reason."},
 {"id":"cites","gap":0.8,"text":"Every answer cites IDs and evidence, so a person can check it."}]},
"rights":{"name":"An agent on the map","lead":1.0,"tail":1.0,"vo":[
 {"id":"on","gap":0.8,"text":"The agent is on the map itself: software, filling a role, with its rights written down, like the outage agent's."},
 {"id":"may","gap":0.8,"text":"It may read everything, and draft changes. It may not confirm one."},
 {"id":"asks","gap":0.8,"text":"Where two sources disagree, it doesn't choose. It asks the owner."},
 {"id":"owner","gap":0.8,"text":"Its owner is Tomás."},
 {"id":"same","gap":0.8,"text":"Agents draft, people confirm, every version is kept: the rule that keeps data models true, applied to the map."}]},
"confirm":{"name":"People confirm","lead":1.0,"tail":1.0,"vo":[
 {"id":"code","gap":0.8,"text":"Then the regulator changes the retail code, the rules every energy retailer must follow."},
 {"id":"clause","gap":0.8,"text":"When an actual reading replaces an estimate, the bill must be corrected within ten working days, not on the next one."},
 {"id":"finds","gap":0.8,"text":"The agent finds the one rule whose reason is that clause: retail's half of day one's rule."},
 {"id":"drafts","gap":0.8,"text":"It drafts the rule's new words, and lists what they touch: the billing team's tracking table, and two views."},
 {"id":"confirms","gap":0.8,"text":"The head of retail, who owns the rule, confirms it."},
 {"id":"track","gap":0.8,"text":"From the next morning, the tracking table shows each bill not corrected within ten working days."}]},
"again":{"name":"Day one, again","lead":1.0,"tail":1.0,"vo":[
 {"id":"spring","gap":0.8,"text":"Next spring, Zofia starts as a data engineer."},
 {"id":"day","gap":0.8,"text":"Her first day, like Tomás's, brings a badge, a page of acronyms and a list of systems."},
 {"id":"map","gap":0.8,"text":"This time, there's also a map."},
 {"id":"asks","gap":0.8,"text":"She asks the agent who owns the readings data, and which rules it keeps."},
 {"id":"gets","gap":0.8,"text":"Back come an owner, Grace, and two rules, each with its reason, and links to check them."},
 {"id":"first","gap":0.8,"text":"By the afternoon, she has drafted her first change, for Grace to confirm."}]},
"sailing":{"name":"Still sailing","lead":1.0,"tail":1.0,"vo":[
 {"id":"pwo","gap":0.8,"text":"In 2007, on Satawal, Mau made five Hawaiians master navigators. Nainoa was one of them."},
 {"id":"died","gap":0.8,"text":"Mau died in 2010. What he taught lives on."},
 {"id":"now","gap":0.8,"text":"Fifty years after that first voyage, Hōkūleʻa is still sailing, navigated by people Mau taught, and by people they taught."}]},
"end":{"name":"The map before the data","lead":1.0,"tail":1.0,"vo":[
 {"id":"confirm","gap":0.8,"text":"Grace confirms Zofia's change. The map passes the navigator's test."},
 {"id":"answer","gap":0.8,"text":"Tomás's last note has an answer: a map stays alive while people use it, keep it true, and can pass it on."},
 {"id":"layers","gap":0.8,"text":"Layer by layer: who it serves, why it moves, what it must do, how value reaches people, who does the work, and what runs it."},
 {"id":"data","gap":0.8,"text":"Then, for data: the questions that matter, rules with a home, and a change walked down every layer."},
 {"id":"over","gap":0.8,"text":"The map holds what the organisation means. Turning that meaning into data is where From words to data begins."}]}
};
