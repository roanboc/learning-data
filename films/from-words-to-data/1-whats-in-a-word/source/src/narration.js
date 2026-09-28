// From words to data · What's in a word. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"answers":{"name":"Four answers","lead":1.6,"tail":1.0,"vo":[
 {"id":"q","gap":0.8,"text":"It's graduation week, and the Deputy Vice-Chancellor wants one number for the speech: how many credentials did we award this year?"},
 {"id":"four","gap":0.8,"text":"Four offices answer, with four numbers."},
 {"id":"nums","gap":0.8,"text":"The registrar says 7,420. Short courses says 10,600. Careers says 14,650. The learning platform says 26,900.","say":"The registrar says seven thousand, four hundred and twenty. Short courses says ten thousand, six hundred. Careers says fourteen thousand, six hundred and fifty. The learning platform says twenty-six thousand, nine hundred."},
 {"id":"none","gap":0.8,"text":"Nobody is wrong. Each office is counting a different idea, under the same word."},
 {"id":"back","gap":0.8,"text":"To see why, we have to go back. Before computers, before writing, before words."}]},
"kinds":{"name":"Kinds without words","lead":1.0,"tail":1.0,"vo":[
 {"id":"pigeons","gap":0.8,"text":"In the 1960s, researchers showed pigeons hundreds of photos. The birds learned to peck at the ones with people in them, even photos they had never seen.","say":"In the nineteen sixties, researchers showed pigeons hundreds of photos. The birds learned to peck at the ones with people in them, even photos they had never seen."},
 {"id":"bees","gap":0.8,"text":"Honeybees can learn the idea of same and different, and use it on colours and patterns they've never met."},
 {"id":"noword","gap":0.8,"text":"No words at all. Yet each of them sorts the world into kinds."},
 {"id":"first","gap":0.8,"text":"Concepts come first. Words come later, to point at them."}]},
"calls":{"name":"Calls that point","lead":1.0,"tail":1.0,"vo":[
 {"id":"vervets","gap":0.8,"text":"Vervet monkeys give different alarm calls for different hunters."},
 {"id":"leopard","gap":0.6,"text":"A leopard call sends the group up into the trees."},
 {"id":"eagle","gap":0.6,"text":"An eagle call makes them look up, and dive into the bushes."},
 {"id":"snake","gap":0.8,"text":"A snake call has them stand tall and search the grass."},
 {"id":"kind","gap":0.8,"text":"Each call stands for a kind of thing, and everyone who hears it knows what to do."},
 {"id":"names","gap":0.8,"text":"Some animals go further. Dolphins, elephants and marmosets use calls that work like names, for one individual."},
 {"id":"ids","gap":0.8,"text":"A kind of thing, and one particular thing: categories, and identifiers. Every data model needs both."}]},
"words":{"name":"What words add","lead":1.0,"tail":1.0,"vo":[
 {"id":"point","gap":0.8,"text":"A baby points before it can talk, to share what it's looking at with you."},
 {"id":"root","gap":0.8,"text":"That shared attention is the root of every word: this one, here, that."},
 {"id":"combine","gap":0.8,"text":"Human words go further than any call. They combine without limit, and they reach things that aren't here: yesterday, a promise, a rule."},
 {"id":"know","gap":0.8,"text":"Even what someone knows. You can't see it. So people have always needed words, and later records, to show it."},
 {"id":"fossil","gap":0.8,"text":"When did speech begin? Nobody knows exactly. Words leave no fossils."}]},
"forms":{"name":"One idea, many forms","lead":1.0,"tail":1.0,"vo":[
 {"id":"cell","gap":0.8,"text":"Inside the human brain, researchers have found single cells that respond to one person: to photos of them, a drawing of them, even their written name."},
 {"id":"one","gap":0.8,"text":"Many forms, one idea."},
 {"id":"tri","gap":0.8,"text":"Think of it as a triangle. A word points to an idea in someone's mind, and the idea points to things in the world."},
 {"id":"gap","gap":0.8,"text":"The word never touches the thing directly. That gap is where misunderstandings live."}]},
"gavagai":{"name":"Which part do you mean?","lead":1.0,"tail":1.0,"vo":[
 {"id":"rabbit","gap":0.8,"text":"A philosopher imagined a stranger pointing at a running rabbit, and saying: gavagai!"},
 {"id":"mean","gap":0.8,"text":"Does it mean the rabbit? Its ears? This moment of running?"},
 {"id":"kids","gap":0.8,"text":"Children solve this every day. They guess the whole thing first."},
 {"id":"grain","gap":0.8,"text":"But every word hides a choice: what counts as one. Data modellers call it the grain."}]},
"edges":{"name":"Fuzzy edges","lead":1.0,"tail":1.0,"vo":[
 {"id":"robin","gap":0.8,"text":"Ask people to picture a bird, and most will think of a robin or a sparrow. Hardly anyone thinks of a penguin."},
 {"id":"typical","gap":0.8,"text":"Categories have typical members in the middle, and fuzzy edges."},
 {"id":"agree","gap":0.8,"text":"We agree about the middle. We argue at the edges."},
 {"id":"cred","gap":0.8,"text":"Is a degree a credential? Of course. A microcredential? Probably. A badge for turning up to a workshop? That's where the four offices part ways."}]},
"drift":{"name":"Words drift","lead":1.0,"tail":1.0,"vo":[
 {"id":"nice","gap":0.8,"text":"Words move, too. Nice once meant foolish."},
 {"id":"cred","gap":0.8,"text":"Credential comes from the Latin for belief. Enrol meant writing a name on a roll. A diploma was a sheet of paper, folded in two."},
 {"id":"still","gap":0.8,"text":"Ambassadors still present their credentials: letters asking their host to trust the person who carries them."},
 {"id":"move","gap":0.8,"text":"Meaning moves slowly, and a word's history often explains its edges."}]},
"paper":{"name":"Agreed on paper","lead":1.0,"tail":1.0,"vo":[
 {"id":"back","gap":0.8,"text":"Back at the university, there's no system in sight. Just four offices, and a sheet of paper."},
 {"id":"def","gap":0.8,"text":"First, what is a credential? A trusted statement, that others can check, that someone has shown what they know or can do."},
 {"id":"kinds","gap":0.8,"text":"Awards and microcredentials are credentials. So are badges, when the learning was assessed. A badge for turning up isn't one."},
 {"id":"recipe","gap":0.8,"text":"The recipe is Aristotle's: name the kind of thing, then say what sets it apart."},
 {"id":"owner","gap":0.8,"text":"Each word gets an owner and a date, and the sketch gains a box, in pencil. Version three, draft."},
 {"id":"answer","gap":0.8,"text":"The answer for the speech is 11,890. And each of the four numbers now has a name. None was wrong: they answered four different questions.","say":"The answer for the speech is eleven thousand, eight hundred and ninety. And each of the four numbers now has a name. None was wrong: they answered four different questions."}]},
"end":{"name":"Pull back","lead":1.0,"tail":1.0,"vo":[
 {"id":"why","gap":0.8,"text":"None of this needed a computer. Contracts open with their definitions. Mergers stall on what counts as a customer. Funding depends on who is counted."},
 {"id":"cost","gap":0.8,"text":"Agreeing on words costs a meeting. Disagreeing costs far more."},
 {"id":"clay","gap":0.8,"text":"About five thousand years ago, people began pressing marks into clay, to keep records that outlast memory."},
 {"id":"last","gap":0.8,"text":"From minds, to marks, to systems. But before you can count anything, you have to agree what it is."}]}
};
