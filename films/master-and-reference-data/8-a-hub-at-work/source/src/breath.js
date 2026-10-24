/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Three wordless moments: the weekend's count on the hub's screen, then the title; this week's result, under the Friday rule;
   and the end card. */
const BREATH={
"monday":{"hold":{"monday":0.4,"rules":0.6,"hub":0.6},"breathe":4.2},
"rules":{"hold":{"most":0.3,"known":0.5,"new":0.3,"close":0.6}},
"saturday":{"hold":{"applied":0.6,"search":0.4,"likely":0.7}},
"why":{"hold":{"why":0.4,"names":0.5,"dates":0.5,"email":0.6,"band":0.6}},
"ai":{"hold":{"note":0.5,"form":0.7,"same":0.4,"meaning":0.4}},
"decide":{"hold":{"links":0.6,"keeps":0.6,"teaches":0.3}},
"publish":{"hold":{"published":0.6,"app":0.6,"alumni":0.5}},
"source":{"hold":{"where":0.3,"names":0.6,"email":0.5}},
"friday":{"hold":{"friday":0.6,"blind":0.7,"wrong":0.7,"stop":0.3},"breathe":1.4},
"five":{"hold":{"ask":0.5,"explain":0.5,"undo":0.5,"review":0.5,"mask":0.5}},
"end":{"hold":{"three":0.8},"breathe":5.0}
};
