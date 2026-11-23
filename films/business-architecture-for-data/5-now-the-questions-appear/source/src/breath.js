/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Three wordless moments: the water running out of the new qanat to the fields, then the title; the goal's line and the request's
   line meeting at one decision; and the ending. */
const BREATH={
"trial":{"hold":{"edge":0.6,"survey":0.9,"cost":0.4,"sure":0.6,"need":1.2,"know":0.6,"trial":0.9,"dip":1.2,"trickle":1.4,"act":0.6,"time":1.6},"breathe":4.4},
"backlog":{"hold":{"note":0.7,"pile":0.9}},
"up":{"hold":{"first":0.8,"climb":1.0,"lobby":0.9}},
"half":{"hold":{"all":0.8,"none":0.9}},
"down":{"hold":{"way":0.9,"gqm":0.8,"better":0.9,"unit":1.0},"breathe":3.0},
"missing":{"hold":{"afford":0.8,"register":1.0}},
"count":{"hold":{"disagree":0.9,"clock":0.9,"define":0.9}},
"home":{"hold":{"homes":1.0}},
"build":{"hold":{"reports":0.8,"group":1.0}},
"well":{"hold":{"back":1.0,"goal":1.6,"measure":1.6,"reach":0.6}},
"end":{"hold":{"confirm":0.7,"answer":0.9},"breathe":5.0}
};
