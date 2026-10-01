/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the title, drawn over the two look-alike cards and their fingerprints, and the end card. */
const BREATH={
"west":{"hold":{"measure":0.5,"story":0.8},"breathe":3.6},
"three":{"hold":{"keys":0.9,"inside":0.6}},
"profile":{"hold":{"first":0.6,"nulls":0.5,"shared":0.5,"orphans":0.6}},
"sets":{"hold":{"set":0.6,"alike":0.8,"case":0.6}},
"rules":{"hold":{"same":0.5,"list":1.0,"aisha":0.8}},
"apart":{"hold":{"merge":1.0,"nobody":0.6,"decide":1.4,"undo":0.6}},
"hash":{"hold":{"space":0.8,"macro":0.8,"every":0.5}},
"codes":{"hold":{"codes":0.5,"map":0.6},"breathe":4.2}
};
