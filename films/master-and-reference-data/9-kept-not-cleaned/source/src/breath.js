/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Three wordless moments: the river in spring, then the title; the steward's five measures, settled; and the end card. */
const BREATH={
"river":{"hold":{"split":0.6,"gravel":0.6,"dry":0.6,"mark":0.8,"rule":0.9,"still":0.4},"breathe":4.6},
"cleanup":{"hold":{"merged":0.5,"team":0.6}},
"return":{"hold":{"year":0.6,"every":0.3,"why":0.6,"linh":0.9}},
"entry":{"hold":{"search":0.5,"match":0.7,"fell":0.8}},
"measures":{"hold":{"process":0.5,"bars":0.6,"dups":0.4,"oldest":0.4,"roles":0.5,"source":0.3,"requests":0.5},"breathe":2.0},
"alert":{"hold":{"monday":0.6,"waiting":0.5,"rang":0.7}},
"agent":{"hold":{"list":0.6,"draft":0.8,"owner":0.5}},
"scorecard":{"hold":{"yusuf":0.8}},
"elsewhere":{"hold":{"bank":0.6}},
"kept":{"hold":{"phd":0.9,"count":0.8,"spring":0.9},"breathe":5.0}
};
