// Context engineering, the opening film of Agents at work on data, the second series on AI agents in data work. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (years in words). The few longer stops are in breath.js.
const NARR={
"lines":{"name":"The lines","lead":3.0,"tail":1.0,"vo":[
 {"id":"when","gap":0.8,"text":"Arezzo, in Italy, about the year 1025.","say":"Arezzo, in Italy, about the year ten twenty-five."},
 {"id":"school","gap":0.8,"text":"A monk named Guido teaches boys to sing the church's chants, its prayers sung through the year."},
 {"id":"ear","gap":0.8,"text":"Each chant is learned by ear, from a master, one at a time."},
 {"id":"signs","gap":0.8,"text":"The books carry small signs above the words, to remind a singer how a chant goes, if he already knows it."},
 {"id":"far","gap":0.8,"text":"A boy who has never heard a chant can't sing it from the page: the signs show up or down, but not how far."},
 {"id":"master","gap":0.8,"text":"So he learns it from a master, and the masters don't agree."},
 {"id":"books","gap":0.8,"text":"Guido wrote that hardly one singer agreed with another, and there were as many chant books as masters: Leo's, or Albert's."},
 {"id":"years","gap":0.8,"text":"Learning the chants takes about ten years, and even then, a singer knows them imperfectly."},
 {"id":"change","gap":0.8,"text":"Something has to change."},
 {"id":"lines","gap":0.8,"text":"Guido's answer is lines across the page: each line, and each space between, one note."},
 {"id":"colour","gap":0.8,"text":"Two of the lines are coloured, red for F and yellow for C, so a singer always knows where he is."},
 {"id":"page","gap":0.8,"text":"Every sign now sits on a line or a space: what lived in the master's head is on the page."},
 {"id":"days","gap":0.8,"text":"Within three days, some of his boys can sing chants they have never heard."},
 {"id":"ten","gap":0.8,"text":"In Guido's words, a singer who took ten years is now made in a year, or two at most."},
 {"id":"pope","gap":0.8,"text":"In Rome, Pope John turns the pages of Guido's book, and won't leave his seat until he has learned a verse he has never heard."},
 {"id":"staff","gap":0.8,"text":"With one more line, it's the staff musicians read today."},
 {"id":"agent","gap":0.8,"text":"An agent is like a boy who has never heard the chant: it can only sing what's on the page."},
 {"id":"head","gap":0.8,"text":"If a word's meaning lives only in someone's head, the agent guesses."},
 {"id":"put","gap":0.8,"text":"Put the meaning on the page, and people and agents both read it right."}
]},
"word":{"name":"A word nobody wrote down","lead":1.0,"tail":1.0,"vo":[
 {"id":"today","gap":0.8,"text":"Today, at the university, Clara, in Planning, asks Jun a new question for next year's plan."},
 {"id":"ask","gap":0.8,"text":"Of the 18,412 students on census day, how many were commencing?"},
 {"id":"gives","gap":0.8,"text":"Jun gives it to his agent, with its tools: Catalog, Query and Docs, each read only."},
 {"id":"reads","gap":0.8,"text":"It reads what they reach: the tables, their columns, the code that builds them, and the team's docs."},
 {"id":"nothing","gap":0.8,"text":"Nothing it reads says what commencing means."},
 {"id":"names","gap":0.8,"text":"So it reasons from the names: commencing must mean a student whose enrolment began this year."},
 {"id":"count","gap":0.8,"text":"It counts 6,931, attaches its query, and sounds as sure as if it knew."}
]},
"inbox":{"name":"In one head, and one inbox","lead":1.0,"tail":1.0,"vo":[
 {"id":"query","gap":0.8,"text":"Jun reads the query: it's careful, and it runs, but is that what the word means?"},
 {"id":"asks","gap":0.8,"text":"He asks Mei, in the registrar's office."},
 {"id":"knows","gap":0.8,"text":"She knows at once: commencing means starting a course at the university for the first time."},
 {"id":"back","gap":0.8,"text":"A student coming back to their course after leave, or a break, isn't commencing: that's the government's rule too."},
 {"id":"right","gap":0.8,"text":"719 of the 6,931 were coming back: the right number is 6,212."},
 {"id":"harm","gap":0.8,"text":"Planning would have planned for 719 new students who weren't new."},
 {"id":"email","gap":0.8,"text":"The meaning was written down once, in 2021, in an email Mei sent to someone in Planning who has since moved on.","say":"The meaning was written down once, in twenty twenty-one, in an email Mei sent to someone in Planning who has since moved on."},
 {"id":"inbox","gap":0.8,"text":"It lived in one head, and one inbox, where no agent could read it."},
 {"id":"careless","gap":0.8,"text":"The agent wasn't careless: what an agent reads decides what it writes."}
]},
"reads":{"name":"What an agent reads","lead":1.0,"tail":1.0,"vo":[
 {"id":"context","gap":0.8,"text":"Everything an agent reads for a job is its context, and in a data team it comes in four kinds."},
 {"id":"code","gap":0.8,"text":"Code: the repository, with its recipes, its tests, and its notes for agents."},
 {"id":"meta","gap":0.8,"text":"Metadata: what words mean, what each table promises, and where each number comes from."},
 {"id":"skills","gap":0.8,"text":"Skills: how the team does a job, step by step."},
 {"id":"tools","gap":0.8,"text":"And tools: what it can reach, and what it may do."},
 {"id":"missing","gap":0.8,"text":"Commencing was missing from the metadata, so the agent filled the gap with a guess, and said it like a fact."},
 {"id":"engineering","gap":0.8,"text":"Choosing what goes into that context, and writing it down, is context engineering."}
]},
"page":{"name":"On the page","lead":1.4,"tail":1.8,"vo":[
 {"id":"glossary","gap":0.8,"text":"Mei writes the meaning once, in the business glossary, where the university's words are defined, and she owns it."},
 {"id":"copy","gap":0.8,"text":"The project copies it into Planning's data, with where it came from, and a new column carries it."},
 {"id":"test","gap":0.8,"text":"A test checks the column on four students: one new, one back from leave, one starting a second course, and one who began last year."},
 {"id":"contract","gap":0.8,"text":"Planning's contract now promises the column, and says what it means."},
 {"id":"rule","gap":0.8,"text":"The notes for agents gain a rule: look a word up before you count by it; if it isn't there, ask its owner, don't guess."}
]},
"team":{"name":"One context for the team","lead":1.0,"tail":1.0,"vo":[
 {"id":"before","gap":0.8,"text":"Until now, each person on the team wired up their own agent, with notes of their own."},
 {"id":"masters","gap":0.8,"text":"Like the chant books named after their masters, each agent was its owner's: what one was told, no other knew."},
 {"id":"one","gap":0.8,"text":"Now the team keeps one context, in the project, reviewed like code, with an owner for every meaning."},
 {"id":"same","gap":0.8,"text":"Every agent, and every person, reads the same page."},
 {"id":"change","gap":0.8,"text":"When a meaning changes, its owner changes it once, and everyone reads the new one."}
]},
"verse":{"name":"A verse never heard","lead":1.0,"tail":1.0,"vo":[
 {"id":"again","gap":0.8,"text":"Jun asks his agent again."},
 {"id":"looks","gap":0.8,"text":"This time it looks the word up, counts 6,212, and cites Mei's definition."},
 {"id":"new","gap":0.8,"text":"A new analyst who joined Planning this week reads the same definition her agent reads."},
 {"id":"boys","gap":0.8,"text":"Like Guido's boys, they can both sing a chant they've never heard."},
 {"id":"once","gap":0.8,"text":"Write it down once, and people and agents both use it."}
]}
};
