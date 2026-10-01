/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the title, drawn over the 1854 map, and the ending. */
const BREATH={
"map":{"hold":{"marks":0.6,"left":0.8},"breathe":3.6},
"ask":{"hold":{"text":1.0,"decision":0.8,"done":0.6,"real":0.6,"cloud":0.5,"hash":0.8}},
"slice":{"hold":{"four":0.8,"out":0.6,"never":1.4}},
"yaml":{"hold":{"learner":0.6,"words":0.8,"diagram":0.6,"read":0.6}},
"owners":{"hold":{"keys":0.8,"sets":0.6,"mei":0.8,"why":0.8}},
"split":{"hold":{"compare":0.6,"same":0.6,"rule":1.0,"attend":0.6}},
"draft":{"hold":{"skill":0.6,"clause":0.6,"approve":1.0}},
"next":{"hold":{"count":0.6,"sources":0.5},"breathe":4.2}
};
