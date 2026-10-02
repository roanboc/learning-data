/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the title, drawn over the two look-alike cards and their fingerprints, and the end card. */
const BREATH={
"west":{"hold":{"measure":0.5,"story":0.8},"breathe":3.6},
"three":{"hold":{"typed":0.9,"inside":0.6}},
"profile":{"hold":{"first":0.6,"nulls":0.5,"shared":0.5,"orphans":0.6}},
"sets":{"hold":{"where":0.4,"set":0.6,"alike":0.8,"case":0.6}},
"rules":{"hold":{"same":0.5,"id":0.5,"held":0.5,"email":0.6,"left":1.0,"best":0.6,"aisha":0.8,"owned":0.4}},
"apart":{"hold":{"merge":1.0,"nobody":0.6,"decide":1.4,"undo":0.6}},
"hash":{"hold":{"one":0.5,"space":0.8,"macro":1.0,"every":0.6}},
"codes":{"hold":{"codes":0.5,"map":0.6},"breathe":4.2}
};
