/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the scene's "breath" cue.
   Three wordless moments: the title, the words every improvement began with, and the ending. */
const BREATH={
"message":{"hold":{"brief":0.6,"only":0.6},"breathe":3.4},
"lanes":{"hold":{"author":0.5,"claude":0.5}},
"options":{"hold":{"test":0.6,"broke":0.6,"chose":0.6}},
"facts":{"hold":{"changed":0.6,"quick":0.4}},
"push":{"hold":{"light":0.8,"idea":0.6,"precise":0.6},"breathe":2.6},
"cheap":{"hold":{"record":0.6,"frames":0.6,"small":0.6}},
"wrong":{"hold":{"list":0.8,"caught":0.4}},
"publish":{"hold":{"site":1.4,"release":0.9,"more":0.8}},
"split":{"hold":{"person":0.6,"claude":0.6,"again":0.4},"breathe":4.0}
};
