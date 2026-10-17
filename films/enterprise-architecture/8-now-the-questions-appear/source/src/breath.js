/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Three wordless moments: boats landing along the coast, each where it chose, then the title; the goal's line and the request's line
   meeting at one decision; and the ending. */
const BREATH={
"kerala":{"hold":{"coast":0.6,"markets":0.8,"dump":1.0,"phones":0.9,"spread":0.8},"breathe":4.4},
"backlog":{"hold":{"note":0.7,"pile":0.9}},
"up":{"hold":{"first":0.8,"climb":1.0}},
"half":{"hold":{"all":0.8,"none":0.9}},
"down":{"hold":{"way":0.9,"better":0.9,"unit":1.0},"breathe":3.0},
"missing":{"hold":{"afford":0.8,"register":1.0}},
"count":{"hold":{"disagree":0.9,"clock":0.9,"define":0.9}},
"home":{"hold":{"homes":1.0}},
"build":{"hold":{"reports":0.8,"group":1.0}},
"end":{"hold":{"confirm":0.7,"answer":0.9},"breathe":5.0}
};
