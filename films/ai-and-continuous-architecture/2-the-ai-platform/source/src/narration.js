// AI and continuous architecture · The AI platform. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"brick":{"name":"Mud and fired brick","lead":1.4,"tail":1.0,"vo":[
 {"id":"city","gap":0.9,"text":"Babylon, more than 2,600 years ago. Its king, Nabopolassar, is rebuilding the city's temple-tower, and its walls.","say":"Babylon, more than two thousand six hundred years ago. Its king, Nabopolassar, is rebuilding the city's temple-tower, and its walls."},
 {"id":"walls","gap":0.9,"text":"The city stands on the Euphrates, inside two great walls, built, like most of Babylon, of mud brick dried in the sun."},
 {"id":"count","gap":0.9,"text":"By one estimate, the inner wall alone holds nearly a hundred million of those bricks."},
 {"id":"rain","gap":0.9,"text":"But mud brick doesn't stand up to water. In the king's own words, heavy rains and downpours had carried the wall away, and its foundations had become a heap of ruins."},
 {"id":"harm","gap":0.9,"text":"For the people inside, a wall the rain could carry away kept out neither enemies nor the river."},
 {"id":"need","gap":0.9,"text":"Building it again in mud would only wait for the next rains: whatever faced the water needed a brick the water couldn't wash away."},
 {"id":"fired","gap":0.9,"text":"So the brick is fired: baked hard in kilns, and laid in bitumen, a natural tar that keeps water out."},
 {"id":"river","gap":0.9,"text":"Nabopolassar surrounds the city's wall, on the outside, with an embankment of baked brick."},
 {"id":"tower","gap":0.9,"text":"And the temple-tower is wrapped in the same baked brick: its core of mud brick sits inside a skin nearly sixteen metres thick."},
 {"id":"held","gap":0.9,"text":"The embankment protected the city against the river's waters, and it lasted: two and a half thousand years later, archaeologists found his bricks still in place."},
 {"id":"now","gap":0.9,"text":"At the energy utility today, six agents are on Tomás's map, each in a role of its own."},
 {"id":"same","gap":0.9,"text":"Under every one are the same few things: a model to answer with, tools to act with, memory, and search."},
 {"id":"once","gap":0.9,"text":"Like the fired brick, those can be made once and shared, while what each agent is for stays its own."}
]},
"ways":{"name":"Each its own way","lead":0.8,"tail":0.9,"vo":[
 {"id":"ravi","gap":1.1,"text":"Ravi Menon, the platform lead, brings Tomás a note."},
 {"id":"note","gap":0.9,"text":"What should our agents share, and what is each one's own?"},
 {"id":"follow","gap":1.3,"text":"Together, they follow each agent to the model that answers for it, and find a different way every time."},
 {"id":"chat","gap":1.2,"text":"The website chat uses its vendor's model, inside the contact centre's software."},
 {"id":"key","gap":1.2,"text":"The crew planner calls a provider directly, with a key kept in a script."},
 {"id":"tool","gap":1.2,"text":"The map agent uses a model built into the map's own tool."},
 {"id":"rest","gap":0.9,"text":"The other three each found a way of their own."},
 {"id":"nobody","gap":0.9,"text":"So nobody can say which model answered a customer, or what all of it costs."}
]},
"retired":{"name":"A model retired","lead":0.8,"tail":0.9,"vo":[
 {"id":"notice","gap":0.9,"text":"Then a provider retires the model the crew planner calls. Its notice goes to the analyst who set up the key, who has since moved to another team."},
 {"id":"stop","gap":0.9,"text":"Three months later, on a Monday morning, the crew planner stops drafting rosters."},
 {"id":"hand","gap":0.9,"text":"The dispatchers build the week's rosters by hand, and fourteen planned jobs slip."},
 {"id":"told","gap":0.9,"text":"310 households, told when their power would be off for that work, have to be told again.","say":"Three hundred and ten households, told when their power would be off for that work, have to be told again."},
 {"id":"which","gap":0.9,"text":"Ravi asks which other agents call that model. Nobody can say."}
]},
"test":{"name":"Platform or application","lead":0.8,"tail":0.9,"vo":[
 {"id":"test","gap":0.9,"text":"Ravi sorts what the agents use with the test from Platform and solution architecture."},
 {"id":"app","gap":0.9,"text":"One purpose, with its logic built in: an application."},
 {"id":"plat","gap":0.9,"text":"Shared capabilities, on which many owners build their own: a platform."},
 {"id":"model","gap":0.9,"text":"A model, which writes an agent's answers, serves no single purpose: the chat and the crew planner could use the same one."},
 {"id":"tools","gap":0.9,"text":"The same goes for tools, which let an agent look something up or do something."},
 {"id":"memory","gap":0.9,"text":"And for memory, which keeps what an agent needs from one step to the next, and search, which finds the right page in the utility's documents."},
 {"id":"shared","gap":0.9,"text":"They're shared capabilities, so they're the platform's."},
 {"id":"own","gap":0.9,"text":"What each agent is for is its own: its purpose, its instructions, and the logic of its tasks. That's an application, and its owner answers for it."}
]},
"map":{"name":"Under every agent","lead":0.8,"tail":0.9,"vo":[
 {"id":"foot","gap":0.9,"text":"On Tomás's map, the platform's capabilities go at the foot, as services it offers every agent: reach a model, call a tool, remember, and search."},
 {"id":"apps","gap":0.9,"text":"The agents stay in the application layer, each in its own role, with someone who answers, and each using those services."},
 {"id":"once","gap":0.9,"text":"Drawn once, under all of them, the platform shows what every agent stands on."},
 {"id":"part","gap":0.9,"text":"And the map can answer part of Ravi's question: which agents use which service."}
]},
"gateway":{"name":"One door to every model","lead":0.8,"tail":0.9,"vo":[
 {"id":"gate","gap":1.4,"text":"Then Ravi's team puts a gateway in front of every model: one door that every call, from every agent, goes through."},
 {"id":"id","gap":1.7,"text":"Each call comes in under the agent's own identity, the one its place on the map gives it."},
 {"id":"log","gap":1.6,"text":"The gateway writes every call down: which agent, which model, when, and what it cost."},
 {"id":"limit","gap":1.7,"text":"It keeps each agent within limits, so one stuck in a loop can't run up the bill, or crowd out the rest."},
 {"id":"allow","gap":1.6,"text":"And it reaches only models the utility has terms with: where its data is kept, and that it isn't used to train anyone's model."},
 {"id":"vendor","gap":1.5,"text":"Even the vendor's chat is set to reach its model through the gateway."}
]},
"swap":{"name":"The next retirement","lead":0.8,"tail":0.9,"vo":[
 {"id":"next","gap":0.9,"text":"Months later, another provider retires a model."},
 {"id":"three","gap":0.9,"text":"This time, the gateway's log shows which agents call it: three of them."},
 {"id":"checks","gap":0.9,"text":"Ravi's team tries the replacement on each agent's own checks, and each agent's owner looks at the results."},
 {"id":"move","gap":0.9,"text":"Once the owners agree, all three move to the new model in an afternoon."},
 {"id":"none","gap":0.9,"text":"No roster is late, and no household is told twice."}
]},
"owners":{"name":"Who owns what","lead":0.8,"tail":0.9,"vo":[
 {"id":"platform","gap":0.9,"text":"The platform has its owner too: Ravi's team runs it, sets its limits, and holds the contracts with the providers."},
 {"id":"agents","gap":0.9,"text":"Each agent's owner still answers for what it does: the head of retail for the chat, Grace for the crew planner."},
 {"id":"cost","gap":0.9,"text":"And every month, the gateway's log shows each team what its agents cost."}
]},
"dbx":{"name":"On Databricks","lead":0.8,"tail":0.9,"vo":[
 {"id":"ug","gap":0.9,"text":"On Databricks, that gateway is Unity Gateway, built on Unity Catalog."},
 {"id":"teams","gap":0.9,"text":"In one place, it sets which models each team may use and the limits on each, and keeps track of every call and what it costs."},
 {"id":"split","gap":0.9,"text":"It can split calls between two models, to try a new one, and fall back to another if one fails."},
 {"id":"tools","gap":0.9,"text":"The functions agents use as tools are kept in Unity Catalog too, under the same permissions as the data."},
 {"id":"any","gap":0.9,"text":"Databricks' own models and other providers' go through the same gateway."}
]},
"brickback":{"name":"One brick, many purposes","lead":0.8,"tail":0.9,"vo":[
 {"id":"same","gap":0.9,"text":"In Babylon, the same baked brick and the same bitumen went into the river wall and the temple-tower."},
 {"id":"purpose","gap":0.9,"text":"What each was for, holding back a river or raising the house of a god, was its builder's."},
 {"id":"agents","gap":0.9,"text":"At the utility, every agent now stands on one platform, and each keeps its own purpose."}
]},
"end":{"name":"The AI platform","lead":0.8,"tail":1.0,"vo":[
 {"id":"answer","gap":1.0,"text":"Ravi's note has its answer: agents share the platform's models, gateway, tools, memory and search; each keeps its own purpose, instructions and logic."},
 {"id":"next","gap":1.0,"text":"Next: what an agent may read."}
]}
};
