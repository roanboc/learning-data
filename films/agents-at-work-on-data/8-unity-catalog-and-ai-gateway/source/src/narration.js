// Why Unity Catalog and Unity Gateway govern them, film 8 of 9 of Agents at work on data, the second series of the module on AI agents in data work. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (numbers in words). The few longer stops are in breath.js.
const NARR={
"reads":{"name":"Whose reads were those?","lead":1.4,"tail":1.0,"vo":[
 {"id":"today","gap":0.8,"text":"Today, at the university."},
 {"id":"ask","gap":0.8,"text":"Every week, the faculties send the registrar's office the same questions: how many students, in which courses."},
 {"id":"mei","gap":0.8,"text":"So Mei Tanaka set up an agent that answers them at night, on its own."},
 {"id":"key","gap":0.8,"text":"She set it up in an afternoon, with her personal key: a code that lets software sign in as her."},
 {"id":"log","gap":0.3,"text":"Each month, Sam Okafor, who runs the data platform, checks the platform's log:"},
 {"id":"read","gap":0.8,"text":"who read the learner table, with every learner's name and email."},
 {"id":"sunday","gap":0.8,"text":"One Sunday night, Mei read it 2,300 times.","say":"One Sunday night, Mei read it two thousand three hundred times."},
 {"id":"asleep","gap":0.8,"text":"She was asleep. The reads were her agent's."},
 {"id":"all","gap":0.8,"text":"Acting as her, it could read everything she can, though all it needed was counts."},
 {"id":"trick","gap":0.8,"text":"A cleverly worded question could have tricked it into handing names over."},
 {"id":"calls","gap":0.8,"text":"It called its model with another key of hers, paid from no one's budget, and no one saw what the calls carried."},
 {"id":"blame","gap":0.8,"text":"And if names ever leaked, the log would point at Mei."},
 {"id":"nothing","gap":0.8,"text":"She did nothing wrong: a personal key can't hand over less than everything she has."},
 {"id":"change","gap":0.8,"text":"Something had to change."},
 {"id":"own","gap":0.8,"text":"So Sam gives the agent a name of its own, under the same rules as people."},
 {"id":"catalog","gap":0.3,"text":"Unity Catalog, where the platform keeps its rules,"},
 {"id":"grants","gap":0.8,"text":"gives it only the grants its job needs, and stars where the names are."},
 {"id":"gateway","gap":0.8,"text":"Unity Gateway, its gate to models, lets it call only the ones it's allowed, and counts what it spends."},
 {"id":"worked","gap":0.8,"text":"It worked. The faculties get the same answers every morning."},
 {"id":"since","gap":0.8,"text":"Since then, it hasn't seen a single name, and its calls cost about 300 dollars a month, from the registrar's own budget.","say":"Since then, it hasn't seen a single name, and its calls cost about three hundred dollars a month, from the registrar's own budget."},
 {"id":"whose","gap":0.8,"text":"And the log says whose reads they were."},
 {"id":"jun","gap":0.3,"text":"Jun's census agent, which checks the count the university sends the government, works the same way:"},
 {"id":"rules","gap":0.8,"text":"one set of rules for people and agents."}
]},
"holds":{"name":"A rule it's told, and a rule that holds","lead":1.0,"tail":1.0,"vo":[
 {"id":"page","gap":0.8,"text":"The project's page for agents already says: never copy names, emails or student IDs into a prompt."},
 {"id":"request","gap":0.8,"text":"But a rule an agent is told is a request."},
 {"id":"lose","gap":0.8,"text":"It can misread it, lose it in a long task, or be talked out of it by words hidden in what it reads."},
 {"id":"enforce","gap":0.8,"text":"A rule the platform enforces holds, whatever the agent is told: it can't copy a name it only ever sees as stars."},
 {"id":"both","gap":0.8,"text":"So the team does both. It tells its agents the rules, and enforces them where the data and the models live."},
 {"id":"two","gap":0.8,"text":"Two places keep them."},
 {"id":"uc","gap":0.3,"text":"Unity Catalog governs what agents touch:"},
 {"id":"touch","gap":0.8,"text":"the tables, the functions they run as tools, and the log, in preview, of who read what."},
 {"id":"ug","gap":0.8,"text":"Unity Gateway, part of the catalog, governs the models and tool servers they call."}
]},
"name":{"name":"A name for the agent","lead":1.0,"tail":1.0,"vo":[
 {"id":"first","gap":0.8,"text":"First, a name."},
 {"id":"beside","gap":0.8,"text":"An agent that helps one person, while they're there, can use that person's sign-in."},
 {"id":"alone","gap":0.8,"text":"One that works on its own, like Mei's at night, needs a name of its own."},
 {"id":"sp","gap":0.8,"text":"On Databricks, that's a service principal: an identity made for software, not for a person."},
 {"id":"make","gap":0.3,"text":"Sam makes one for Mei's agent, the registrar agent, and grants it only what its job needs:"},
 {"id":"needs","gap":0.8,"text":"it may read the core tables its answers come from, and write nowhere."},
 {"id":"census","gap":0.8,"text":"Jun's census agent already has its own: it reads the core and the marts, and writes only to its own development schema."},
 {"id":"stop","gap":0.8,"text":"To stop an agent, Sam switches off its service principal, and everyone else works on."},
 {"id":"owner","gap":0.8,"text":"And Mei stays its owner: she answers for what it does."}
]},
"stars":{"name":"The same stars","lead":1.0,"tail":1.0,"vo":[
 {"id":"policy","gap":0.8,"text":"Then the masks. One policy shows stars in every column tagged direct, to everyone outside the registrar's office."},
 {"id":"everyone","gap":0.8,"text":"It's written for all the account's users, and on Databricks, they include every service principal."},
 {"id":"counts","gap":0.8,"text":"The registrar agent isn't in the office's group: all it needs is counts."},
 {"id":"clara","gap":0.3,"text":"So it reads the learner table as Clara does:"},
 {"id":"status","gap":0.8,"text":"each learner's status, and stars where the names and emails are."},
 {"id":"nobody","gap":0.8,"text":"Nobody wrote a rule for agents. The rule for people already covered them."},
 {"id":"rows","gap":0.8,"text":"A row filter works the same way, for an agent as for a person."},
 {"id":"code","gap":0.3,"text":"And the learner code stays readable for counting,"},
 {"id":"count","gap":0.8,"text":"so Jun's agent checks the census count, 18,412 students, without a single name.","say":"so Jun's agent checks the census count, eighteen thousand, four hundred and twelve students, without a single name."}
]},
"tools":{"name":"Tools in the catalog","lead":1.0,"tail":1.0,"vo":[
 {"id":"live","gap":0.8,"text":"Agents' tools live in the catalog too."},
 {"id":"fn","gap":0.8,"text":"The census count the data team wrote once is a function there."},
 {"id":"grant","gap":0.8,"text":"Running it takes a grant, the same one a person needs."},
 {"id":"run","gap":0.8,"text":"Jun's agent has it: it may run the count, and can't change it."},
 {"id":"servers","gap":0.3,"text":"And the tool servers agents call are registered there, through Unity Gateway,"},
 {"id":"each","gap":0.8,"text":"each with its own grant: an agent can reach these, and only these."},
 {"id":"fewest","gap":0.8,"text":"Each gets the fewest rights: the registrar agent's tools only read."}
]},
"gateway":{"name":"Through the gateway","lead":1.0,"tail":1.0,"vo":[
 {"id":"models","gap":0.3,"text":"Then the models. In Unity Gateway, each model the university allows is a service in the catalog,"},
 {"id":"granted","gap":0.8,"text":"and only those granted it can call it."},
 {"id":"one","gap":0.8,"text":"The registrar agent is granted one, and Mei's keys are taken back."},
 {"id":"checks","gap":0.8,"text":"Checks on each service, still in beta, look at what goes in and what comes out."},
 {"id":"email","gap":0.8,"text":"One finds an email address in a prompt, and hides it or stops the call."},
 {"id":"trick","gap":0.8,"text":"Another looks for words written to trick the agent."},
 {"id":"limit","gap":0.8,"text":"A limit sets how many calls a minute it may make."},
 {"id":"count","gap":0.8,"text":"And every call is counted under its name, so the registrar's office sees what its agent costs, in its own budget."}
]},
"seen":{"name":"Seen under its own name","lead":1.0,"tail":1.0,"vo":[
 {"id":"month","gap":0.8,"text":"A month later, Sam checks the log again."},
 {"id":"same","gap":0.8,"text":"The same question, who read the learner table this month, lists Mei on weekday mornings, and the registrar agent at night."},
 {"id":"whose","gap":0.8,"text":"Whose reads were those? Now the log says."},
 {"id":"lineage","gap":0.8,"text":"Lineage shows the tables its queries read."},
 {"id":"usage","gap":0.8,"text":"The gateway's own table lists every call it made, and the tokens it used."},
 {"id":"stop","gap":0.8,"text":"If something looks wrong, Sam can stop the agent alone, and nobody else stops with it."},
 {"id":"mei","gap":0.8,"text":"And no read of the agent's is taken for Mei's again."}
]},
"one":{"name":"One set of rules","lead":1.0,"tail":1.2,"vo":[
 {"id":"why","gap":0.8,"text":"Why keep the rules where the data and the models live, and not only in what agents are told?"},
 {"id":"hold","gap":0.8,"text":"Because there, they hold for every agent, every tool and every person, whatever anyone types."},
 {"id":"same","gap":0.8,"text":"And because they're the rules people already work under, there's one set to keep, one log to read, and one review."},
 {"id":"census","gap":0.8,"text":"Jun's census agent works under them too."},
 {"id":"number","gap":0.3,"text":"The number the university sends the government, 18,412 students,","say":"The number the university sends the government, eighteen thousand, four hundred and twelve students,"},
 {"id":"checked","gap":0.8,"text":"is checked by an agent the team can see, limit and account for."},
 {"id":"morning","gap":0.8,"text":"And every morning, the faculties' answers wait under the registrar agent's own name."},
 {"id":"take","gap":0.8,"text":"One set of rules for people and agents, enforced where the data and the models live."},
 {"id":"next","gap":0.8,"text":"Next: the team's context and memory, governed like any data."}
]}
};
