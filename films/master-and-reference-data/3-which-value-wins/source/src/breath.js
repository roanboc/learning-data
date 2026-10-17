/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Three wordless moments: the cabin of ticking clocks, then the title; the rules, written and tested; and the end card. */
const BREATH={
"clocks":{"hold":{"plymouth":0.8,"time":1.2,"drift":0.6,"two":0.8,"many":1.2,"rated":1.0,"standards":0.9},"breathe":4.6},
"linked":{"hold":{"today":0.5,"linked":0.6,"needs":0.4,"counts":0.8}},
"hidden":{"hold":{"order":0.6,"every":0.8,"quick":0.4,"resend":0.6,"typo":0.6,"transcript":0.6}},
"names":{"hold":{"legal":0.8,"checked":0.4,"lost":0.8,"chose":0.5,"transcript":0.3,"class":0.6}},
"rules":{"hold":{"writes":0.5,"legal":0.6,"preferred":0.5,"birth":0.3,"waits":0.4,"pin":0.8,"mobile":0.8,"chain":0.8},"breathe":2.0},
"emails":{"hold":{"column":0.6,"study":0.5,"personal":0.6,"none":0.4,"kept":0.8}},
"sources":{"hold":{"says":0.8,"lost":0.6,"why":0.6}},
"dryrun":{"hold":{"asks":0.6,"dry":0.4,"count":0.8,"approve":0.8}},
"elsewhere":{"hold":{"bank":0.3,"statements":0.4,"app":0.5,"shop":0.6}},
"home":{"hold":{"home":0.9,"out":0.9,"settled":0.8,"same":0.9},"breathe":5.0}
};
