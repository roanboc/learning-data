// The draft and the decision, film 2 of The new skills, the first series of Leading data people. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (years, dates and shares in words). The few longer stops are in breath.js.
const NARR={
"chess":{"name":"Two amateurs, three computers","lead":3.0,"tail":1.0,"vo":[
 {"id":"when","gap":0.8,"text":"New York, May 1997. The world chess champion, Garry Kasparov, plays a six-game match against a computer built for chess.","say":"New York, May nineteen ninety-seven. The world chess champion, Garry Kasparov, plays a six-game match against a computer built for chess."},
 {"id":"loses","gap":0.8,"text":"The computer wins: the first time a machine has beaten a world champion in a match."},
 {"id":"fear","gap":0.8,"text":"Many fear what that means for people."},
 {"id":"players","gap":0.8,"text":"Players spend years learning the game, and many earn their living by it."},
 {"id":"worth","gap":0.8,"text":"If a machine plays better than the best of them, what is their skill worth?"},
 {"id":"change","gap":0.8,"text":"Players have to find what their skill is for, beside the machine."},
 {"id":"leon","gap":0.8,"text":"A year later, in León, in Spain, Kasparov tries another way: play with the machine, not against it."},
 {"id":"each","gap":0.8,"text":"He and his opponent, Veselin Topalov, each have a computer at hand, running the chess program of their choice."},
 {"id":"plan","gap":0.8,"text":"With the machine checking every tactic, Kasparov finds he can give his thinking to the plan."},
 {"id":"free","gap":0.8,"text":"In 2005, an online tournament goes further: anyone can enter, in teams, with as many computers as they like.","say":"In two thousand and five, an online tournament goes further: anyone can enter, in teams, with as many computers as they like."},
 {"id":"entrants","gap":0.8,"text":"Grandmasters enter with their computers. A supercomputer built for chess enters on its own."},
 {"id":"winners","gap":0.8,"text":"The winners are two amateur players from the United States, with three computers."},
 {"id":"how","gap":0.8,"text":"From their own experience, they choose which moves are worth a look, and compare what each program says."},
 {"id":"deeper","gap":0.8,"text":"They send the programs deeper where it matters, and then the two of them decide."},
 {"id":"final","gap":0.8,"text":"In the final, they beat a team led by a grandmaster, and take first prize. The supercomputer, alone, doesn't reach the last eight."},
 {"id":"lesson","gap":0.8,"text":"Kasparov drew the lesson: weak players, with a machine and a better process, beat a strong computer alone."},
 {"id":"worse","gap":0.8,"text":"More remarkably, they beat strong players whose process was worse."},
 {"id":"counts","gap":0.8,"text":"The players' skill still counted. What counted most was how they worked with the machines."},
 {"id":"data","gap":0.8,"text":"Data work has its machine now too: an agent can write the first draft of a data model in a minute."},
 {"id":"ask","gap":0.8,"text":"Many ask what that leaves for the people."},
 {"id":"left","gap":0.8,"text":"As at the board, it leaves the part that decides: saying what's wanted, checking the draft against what's true, and choosing."},
 {"id":"cheap","gap":0.8,"text":"A draft is cheap. Judgement isn't."}
]},
"draft":{"name":"A draft in a minute","lead":1.0,"tail":1.0,"vo":[
 {"id":"uni","gap":0.8,"text":"At the university, a year from now, the data team has taken up a question from Graham Ellis, the Director of Facilities."},
 {"id":"building","gap":0.8,"text":"He must decide whether to ask the University Council for a new teaching building."},
 {"id":"q","gap":0.8,"text":"His question: do we have too few rooms, or too few at some hours?"},
 {"id":"ivy","gap":0.8,"text":"Wednesday 7 April 2027. Ivy Reyes, a graduate data analyst in her sixth week, is building the first model: how much each room is used.","say":"Wednesday the seventh of April, twenty twenty-seven. Ivy Reyes, a graduate data analyst in her sixth week, is building the first model: how much each room is used."},
 {"id":"ask","gap":0.8,"text":"She asks the team's agent for a first draft: a model of room use, for every room and every teaching hour."},
 {"id":"minute","gap":0.8,"text":"In a minute, it's there."},
 {"id":"tidy","gap":0.8,"text":"It's tidy: the model, a description of every column, and four tests, which all pass."},
 {"id":"figure","gap":0.8,"text":"Its answer: the rooms are used 38% of the teaching week, and 93% at the busiest hours.","say":"Its answer: the rooms are used thirty-eight percent of the teaching week, and ninety-three percent at the busiest hours."},
 {"id":"sure","gap":0.8,"text":"It looks finished, and it sounds sure."},
 {"id":"almost","gap":0.8,"text":"Ivy is about to open a pull request. First, she reads the agent's notes to the end."}
]},
"assumed":{"name":"What it assumed","lead":1.0,"tail":1.0,"vo":[
 {"id":"notes","gap":0.8,"text":"At the end, the agent lists what it assumed."},
 {"id":"line","gap":0.8,"text":"One line stops her: a booked hour counts as a used hour."},
 {"id":"graham","gap":0.8,"text":"In February, Graham had said what used means: people in the room, not a booking."},
 {"id":"tests","gap":0.8,"text":"The tests pass because they check the form of the data: no room counted twice, no hour left out."},
 {"id":"meaning","gap":0.8,"text":"No test can know what Graham means."},
 {"id":"sensors","gap":0.8,"text":"So Ivy checks the draft against something she knows is true: the sensors, which count the people in each room, every hour."},
 {"id":"fifth","gap":0.8,"text":"In one booked hour in five, they counted nobody. The draft calls every one of those hours used."},
 {"id":"harm","gap":0.8,"text":"Graham would have weighed a new building on bookings, not on rooms people use."},
 {"id":"common","gap":0.8,"text":"The agent wasn't careless. In timetabling, use often means booked, and it said what it assumed."},
 {"id":"task","gap":0.8,"text":"It had been given the task, but not the decision, or the words."}
]},
"frame":{"name":"Frame it, then ask","lead":1.0,"tail":1.0,"vo":[
 {"id":"frame","gap":0.8,"text":"So before she asks again, Ivy frames the work."},
 {"id":"word","gap":0.8,"text":"First, the word. She writes room use into the glossary: the share of teaching hours in which the sensors counted at least one person."},
 {"id":"owner","gap":0.8,"text":"Graham approves it there, as its owner, so every model, and every draft, starts from it."},
 {"id":"three","gap":0.8,"text":"Then she asks again, and gives the agent three things, not one."},
 {"id":"decision","gap":0.8,"text":"The decision it serves: whether to ask the University Council for a new building."},
 {"id":"words","gap":0.8,"text":"The words to use: room use, as the glossary has it."},
 {"id":"counts","gap":0.8,"text":"And what counts: teaching hours, eight till six, Monday to Friday, with booked and used side by side."},
 {"id":"draft","gap":0.8,"text":"The new draft keeps the two apart, and says again what it assumed."},
 {"id":"hand","gap":0.8,"text":"Ivy checks it against something she knows is true: one room's week, which she worked out by hand, hour by hour."},
 {"id":"match","gap":0.8,"text":"All fifty hours match."}
]},
"review":{"name":"Someone else approves","lead":1.0,"tail":1.0,"vo":[
 {"id":"pr","gap":0.8,"text":"Ivy opens a pull request. She's its author, so she answers for it, whoever wrote the first draft."},
 {"id":"reason","gap":0.8,"text":"With it, she keeps the reasoning: what she asked for, what the agent assumed, what she changed, and how she checked."},
 {"id":"jun","gap":0.8,"text":"Jun reviews it. Nobody approves their own work: not Ivy, and never the agent."},
 {"id":"asks","gap":0.8,"text":"He asks which room she checked by hand. The answer is in the pull request."},
 {"id":"merge","gap":0.8,"text":"He approves it, and it's merged. Graham is told what it changes: the first answer to his question."},
 {"id":"standup","gap":0.8,"text":"Next morning, at stand-up, Ivy says what she nearly missed: she'd asked for the task, not the decision or the words."},
 {"id":"thanks","gap":0.8,"text":"Helena thanks her for saying it, and the team starts asking that way too."}
]},
"grows":{"name":"The skills that grow","lead":1.0,"tail":1.0,"vo":[
 {"id":"moves","gap":0.8,"text":"When an agent drafts, the work doesn't go away. It moves to either side of the draft."},
 {"id":"before","gap":0.8,"text":"Before it: framing the question, with its decision, its words and what counts, and saying exactly what's wanted."},
 {"id":"after","gap":0.8,"text":"After it: checking what comes back against what you know is true, deciding, and answering for it."},
 {"id":"wef","gap":0.8,"text":"Employers see it too. In the World Economic Forum's Future of Jobs Report 2025, the core skill they seek most is analytical thinking.","say":"Employers see it too. In the World Economic Forum's Future of Jobs Report twenty twenty-five, the core skill they seek most is analytical thinking."},
 {"id":"seven","gap":0.8,"text":"Seven in ten companies call it essential."},
 {"id":"rising","gap":0.8,"text":"AI and big data skills are rising fastest; creative thinking and curiosity are rising too."},
 {"id":"cant","gap":0.8,"text":"An agent can draft, test its work, and say what it assumed. It can't take the decision from you, or the responsibility for it."},
 {"id":"films","gap":0.8,"text":"How agents work, and how teams govern them on data, have films of their own: What an agent is, and Agents at work on data."}
]},
"monday":{"name":"On Monday","lead":1.0,"tail":1.0,"vo":[
 {"id":"back","gap":0.8,"text":"In 2005, two amateurs finished ahead of grandmasters and a supercomputer.","say":"In two thousand and five, two amateurs finished ahead of grandmasters and a supercomputer."},
 {"id":"not","gap":0.8,"text":"Not by out-calculating the machines, but by choosing what to look at, comparing, and deciding."},
 {"id":"ivy","gap":0.8,"text":"Ivy did the same with data: the agent drafted in a minute; she framed the work, checked it and decided."},
 {"id":"rooms","gap":0.8,"text":"And Graham's answer counts people in the rooms, not bookings."},
 {"id":"one","gap":0.8,"text":"On Monday, give the agent the decision, the words and what counts, not only the task."},
 {"id":"two","gap":0.8,"text":"Read what it assumed, to the end."},
 {"id":"three","gap":0.8,"text":"Check its draft against something you know is true."},
 {"id":"four","gap":0.8,"text":"Never approve your own work, and keep the reasoning with the result."},
 {"id":"last","gap":0.8,"text":"Let the agent draft; you frame, check and decide."}
]}
};
