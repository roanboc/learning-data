// The map before the data · Day one. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"govern":{"name":"Before you can govern it","lead":1.4,"tail":1.0,"vo":[
 {"id":"n19","gap":0.8,"text":"Nineteen years after conquering England, William the Conqueror still didn't know exactly what he ruled."},
 {"id":"sent","gap":0.8,"text":"At Christmas 1085, he sent surveyors across most of the country.","say":"At Christmas, ten eighty-five, he sent surveyors across most of the country."},
 {"id":"ask","gap":0.8,"text":"Who holds this land? What is on it? What is it worth?"},
 {"id":"then","gap":0.8,"text":"Ploughs, mills and meadows, then and now."},
 {"id":"book","gap":0.8,"text":"Their record became the Domesday Book."},
 {"id":"know","gap":0.8,"text":"Before you can govern a place, you have to know what it is."}]},
"dayone":{"name":"Day one","lead":1.0,"tail":1.0,"vo":[
 {"id":"starts","gap":0.8,"text":"Today, Tomás starts as an enterprise architect at an energy utility owned by the regional government."},
 {"id":"runs","gap":0.8,"text":"It runs the poles and wires for the region, owns a few hydro and wind farms, and sells power to homes and businesses."},
 {"id":"lunch","gap":0.8,"text":"By lunchtime he has a badge, an org chart, a list of a hundred and forty systems, and an invitation: the transition program."},
 {"id":"asks","gap":0.8,"text":"Everyone asks what he thinks."},
 {"id":"know","gap":0.8,"text":"He doesn't know what to think yet. He doesn't even know what to ask."}]},
"pieces":{"name":"True, and not enough","lead":1.0,"tail":1.0,"vo":[
 {"id":"true","gap":0.8,"text":"Everything he's been given is true. None of it explains the place."},
 {"id":"org","gap":0.8,"text":"The org chart shows who reports to whom, not what the utility must be able to do."},
 {"id":"sys","gap":0.8,"text":"The system list shows what was bought, not what it's for."},
 {"id":"manual","gap":0.8,"text":"The process manual runs to four hundred pages, last revised six years ago."},
 {"id":"slogan","gap":0.8,"text":"And the strategy is five words on a slide."},
 {"id":"puzzle","gap":0.8,"text":"Each is a piece of the picture, cut from a different puzzle."}]},
"looking":{"name":"A way of looking","lead":1.0,"tail":1.0,"vo":[
 {"id":"way","gap":0.8,"text":"Enterprise architecture is a way of looking at an organisation in layers, from why it exists down to what runs it."},
 {"id":"three","gap":0.8,"text":"Three questions hold the layers."},
 {"id":"why","gap":0.8,"text":"Why does it exist, and for whom?"},
 {"id":"how","gap":0.8,"text":"How does it work: who does what, with which information?"},
 {"id":"runs","gap":0.8,"text":"And what runs it: which applications, on which technology?"},
 {"id":"above","gap":0.8,"text":"Each layer is worked out from the one above."},
 {"id":"bottom","gap":0.8,"text":"Start from the bottom, and you'll describe every system perfectly, and still not know what they're for."}]},
"methods":{"name":"Many maps, the same lessons","lead":1.0,"tail":1.0,"vo":[
 {"id":"many","gap":0.8,"text":"There's no shortage of methods."},
 {"id":"three","gap":0.8,"text":"TOGAF gives a way to do the work. ArchiMate, a language to draw it. Zachman, a grid to sort it.","say":"Toe-gaff gives a way to do the work. Arky-mate, a language to draw it. Zack-man, a grid to sort it."},
 {"id":"more","gap":0.8,"text":"Business architecture brings capabilities and value streams, process frameworks bring catalogues, domain-driven design shows where meanings change, and data management shows who looks after information."},
 {"id":"champ","gap":0.8,"text":"Each has its champions. Under the vocabulary, they agree on more than they differ."},
 {"id":"takes","gap":0.8,"text":"This series takes what they agree on."}]},
"rough":{"name":"Rough first","lead":1.0,"tail":1.0,"vo":[
 {"id":"starts","gap":0.8,"text":"And it starts rough."},
 {"id":"canvas","gap":0.8,"text":"A canvas on a wall: who the utility serves, what they need, and how it's paid for."},
 {"id":"argue","gap":0.8,"text":"Sticky notes can be argued with in an afternoon."},
 {"id":"later","gap":0.8,"text":"Later, they become a capability map, then value streams, and finally a model in a formal notation."},
 {"id":"earned","gap":0.8,"text":"Notation is earned."},
 {"id":"early","gap":0.8,"text":"Draw too precisely too early, and people correct your drawing instead of your understanding."}]},
"evidence":{"name":"Evidence, then confirmation","lead":1.0,"tail":1.0,"vo":[
 {"id":"rules","gap":0.8,"text":"Tomás sets himself two rules."},
 {"id":"source","gap":0.8,"text":"Every note names where it came from: the annual report, the regulator's decision, the owner's statement of expectations, an interview."},
 {"id":"draft","gap":0.8,"text":"And every note stays a draft until the person who owns that part of the business says it's right."},
 {"id":"opinion","gap":0.8,"text":"A map nobody has confirmed is one person's opinion, drawn neatly."}]},
"data":{"name":"Why this matters for data","lead":1.0,"tail":1.0,"vo":[
 {"id":"care","gap":0.8,"text":"Why would a data architect care?"},
 {"id":"claim","gap":0.8,"text":"Because every data rule is a claim about the organisation."},
 {"id":"rule","gap":0.8,"text":"Take this one: an estimated meter reading stands only until the next actual reading."},
 {"id":"qs","gap":0.8,"text":"Which process creates it? Who owns it? Which goal does it serve?"},
 {"id":"guess","gap":0.8,"text":"Without the map, a rule is a guess, and when it's wrong, nobody knows who should fix it."},
 {"id":"home","gap":0.8,"text":"With the map, the rule has a home."}]},
"series":{"name":"The series","lead":1.4,"tail":1.6,"vo":[
 {"id":"eleven","gap":0.8,"text":"Over eleven films, Tomás builds the map, one layer at a time."},
 {"id":"seven","gap":0.8,"text":"Seven films to understand the utility: who it serves, why it moves, what it must be able to do, how value reaches people, who does what, and what runs it."},
 {"id":"four","gap":0.8,"text":"Then four on what it means for data: the questions that matter, rules with a home, a change in strategy, and a map that people and agents can read."}]},
"end":{"name":"The first note","lead":1.0,"tail":1.0,"vo":[
 {"id":"still","gap":0.8,"text":"The surveyors' first questions still work."},
 {"id":"qs","gap":0.8,"text":"What is this place? Who holds it? What is it worth?"},
 {"id":"note","gap":0.8,"text":"Tomás writes the first note."}]}
};
