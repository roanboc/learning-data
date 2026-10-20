/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Four wordless moments: the two parish books side by side, then the title; the four lanes, settled; the eight films in their four parts; and the end card. */
const BREATH={
"parish":{"hold":{"book":0.9,"moved":0.9,"number":0.6},"breathe":4.6},
"back":{"hold":{"today":0.6,"back":0.4,"applies":0.8}},
"five":{"hold":{"now":0.4,"students":0.6,"alumni":0.6,"hr":0.5,"research":0.7,"transcript":1.0,"invite":1.0}},
"kinds":{"hold":{"master":0.6,"reference":0.5,"trans":0.4}},
"role":{"hold":{"learner":0.6,"someone":0.9}},
"apart":{"hold":{"person":0.5,"roles":0.6,"contacts":0.6,"ids":0.4,"none":0.8},"breathe":2.4},
"keeps":{"hold":{"roles":0.3,"attrs":0.4,"mei":0.6}},
"elsewhere":{"hold":{"nurse":0.6,"bank":0.6,"home":0.7}},
"dama":{"hold":{"dama":0.6,"four":0.8}},
"entities":{"hold":{"shop":0.5,"which":0.4,"q1":0.4,"q2":0.4,"q3":0.4,"q4":0.6}},
"series":{"hold":{"parts":0.4},"breathe":2.0},
"found":{"hold":{"now":0.8,"adds":0.9,"there":0.9},"breathe":5.0}
};
