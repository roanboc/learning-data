/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Four wordless moments: the two parish books side by side, then the title; the four lanes, settled; the eight films in their four parts; and the end card. */
const BREATH={
"parish":{"hold":{"book":0.9,"moved":0.9,"number":0.6},"breathe":4.6},
"move":{"hold":{"today":0.5,"moves":0.6,"tells":0.4}},
"four":{"hold":{"others":0.8,"alumni":0.9,"tutor":1.0,"research":1.0,"letter":1.3}},
"kinds":{"hold":{"master":0.6,"reference":0.5,"trans":0.4}},
"role":{"hold":{"learner":0.6,"someone":0.9}},
"apart":{"hold":{"person":0.5,"roles":0.6,"contacts":0.6,"ids":0.4,"none":0.8},"breathe":2.4},
"keeps":{"hold":{"roles":0.3,"attrs":0.4,"mei":0.6}},
"elsewhere":{"hold":{"nurse":0.6,"bank":0.6,"home":0.7}},
"dama":{"hold":{"dama":0.6,"four":0.8}},
"entities":{"hold":{"shop":0.5,"which":0.4,"q1":0.4,"q2":0.4,"q3":0.4,"q4":0.6}},
"series":{"hold":{"parts":0.4},"breathe":2.0},
"once":{"hold":{"change":0.6,"hears":0.9},"breathe":5.0}
};
