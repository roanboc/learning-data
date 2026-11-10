/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Three wordless moments: the title, the star answering the planners' question, and the ending. */
const BREATH={
"ledger":{"hold":{"post":0.5,"two":0.6},"breathe":3.6},
"write":{"hold":{"once":0.8,"keys":0.7,"all":0.8,"name":0.3}},
"wrong":{"hold":{"three":0.5,"change":0.7,"print":0.8,"delete":0.6}},
"docs":{"hold":{"doc":0.7,"together":0.6,"shine":0.5}},
"read":{"hold":{"q":0.8,"grain":0.8,"facts":0.6,"dims":0.8,"words":0.8},"breathe":2.4},
"history":{"hold":{"moved":0.7,"both":0.8,"revoked":0.7,"choice":0.8}},
"side":{"hold":{"q":0.4,"write":0.6,"read":0.8,"name":0.6}},
"end":{"hold":{"medal":0.6,"often":0.5},"breathe":4.2}
};
