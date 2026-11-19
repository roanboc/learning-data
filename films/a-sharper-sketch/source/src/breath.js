/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds of silence after a line, while the picture keeps moving. breathe: a wordless end to the chapter, whose picture starts at the scene's "breath" cue.
   pause: extra seconds of silence before a line. The narration itself lives in narration.js. */
const BREATH={
"cols":{"hold":{"when":0.6,"change":0.6,"total":0.5,"harm":0.8,"need":0.6,"cols":1.2,"sum":1.0,"back":0.8,"story":1.0,"data":0.4}},
"drawn":{"hold":{"recap":0.4,"map":0.8,"over":1}},
"two":{"hold":{"nums":1.5,"fit":0.8},"breathe":3},
"cls":{"hold":{"hiding":0.8},"breathe":3},
"census":{"hold":{"summer":1}},
"courses":{"hold":{"admission":1.2}},
"time":{"hold":{"snap":1,"cols":1.2}},
"levels":{"hold":{"logical":1,"physical":1,"agree":0.8}},
"fit":{"hold":{"lift":0.4,"check":0.5,"adopt":0.9,"extend":0.9,"record":1.3}},
"end":{"hold":{"answer":1.2,"evolve":0.6,"yellow":0.8,"white":1.0,"side":0.8},"breathe":2.5}
};
