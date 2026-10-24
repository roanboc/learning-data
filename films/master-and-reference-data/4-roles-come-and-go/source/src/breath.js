/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Three wordless moments: the census list and the word "census", then the title; Linh's table, read before it's asked about; and the end card. */
const BREATH={
"rome":{"hold":{"cato":0.6,"roles":0.9},"breathe":4.2},
"census":{"hold":{"date":1.0,"planning":1.2,"alumni":1.2}},
"flags":{"hold":{"night":0.4,"says":0.8,"over":0.6,"again":0.6,"wrong":0.9}},
"bands":{"hold":{"know":0.3,"shape":0.8,"under":0.4,"first":0.4,"tutor":0.2,"again":0.3,"research":0.4,"stays":0.6}},
"terms":{"hold":{"drew":0.5,"hr":0.6,"every":0.5,"jan":0.6}},
"line":{"hold":{"draw":0.4,"open":0.6,"once":0.8,"back":1.0,"kept":0.5,"filter":0.4,"since":0.5}},
"relates":{"hold":{"for":0.2,"items":0.5,"people":0.5,"ends":0.5}},
"elsewhere":{"hold":{"energy":0.6,"moves":1.4,"need":1.2,"kept":1.5}},
"table":{"hold":{"row":0.6,"cols":1.4,"tests":1.4,"asat":1.2,"late":1.0},"breathe":1.6},
"stays":{"hold":{"today":0.6,"next":0.8,"come":0.6},"breathe":5.0}
};
