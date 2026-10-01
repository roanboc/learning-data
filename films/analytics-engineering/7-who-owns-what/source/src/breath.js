/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the title, drawn over the register book, and the ending. */
const BREATH={
"register":{"hold":{"chain":0.6,"title":0.8,"transfer":0.6},"breathe":3.6},
"domains":{"hold":{"registrar":0.6,"learning":0.6,"domain":0.8,"follows":0.8}},
"products":{"hold":{"publish":0.6,"learner":0.6,"promise":0.8}},
"access":{"hold":{"rings":0.6,"private":0.8,"refused":1.0,"allowed":0.6,"wrong":1.4}},
"grants":{"hold":{"refer":0.8,"grants":0.6,"dashboard":0.6}},
"across":{"hold":{"depends":0.6,"pinned":0.8,"only":0.8}},
"shared":{"hold":{"keysets":0.6,"hash":0.6,"another":1.0,"silos":1.0}},
"split":{"hold":{"why":0.6,"decided":0.8},"breathe":4.2}
};
