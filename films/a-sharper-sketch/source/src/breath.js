/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds of silence after a line, while the picture keeps moving. breathe: a wordless end to the chapter, whose picture starts at the scene's "breath" cue.
   pause: extra seconds of silence before a line. The narration itself lives in narration.js. */
const BREATH={
"drawn":{"hold":{"over":1}},
"two":{"hold":{"nums":1.5,"fit":0.8},"breathe":3},
"cls":{"hold":{"hiding":0.8},"breathe":3},
"census":{"hold":{"summer":1}},
"courses":{"hold":{"admission":1.2}},
"time":{"hold":{"snap":1}},
"levels":{"hold":{"logical":1,"physical":1,"agree":0.8}},
"fit":{"hold":{"adopt":0.6,"extend":0.6,"record":1}},
"end":{"hold":{"answer":1.2},"breathe":2.5}
};
