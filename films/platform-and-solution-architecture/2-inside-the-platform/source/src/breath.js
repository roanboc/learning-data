/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the drawing whole, its last part lit, then the title; and the mountain at night, every station lit, then the end card. */
const BREATH={
"road":{"hold":{"stage":0.6,"hakone":0.4,"climb":0.6,"same":0.8,"need":0.8,"founded":0.6,"two":1.0,"wrong":0.4},"breathe":4.0},
"draw":{"hold":{"map":0.4,"open":0.6}},
"along":{"hold":{"bring":0.6,"store":0.5,"process":0.4,"serve":0.6,"inner":0.4}},
"across":{"hold":{"observe":0.8}},
"products":{"hold":{"sec":0.4,"obs":1.2}},
"nothing":{"hold":{"nobody":0.6,"bill":0.6,"cant":0.8,"choice":1.0}},
"whose":{"hold":{"high":0.8,"kept":1.4,"like":1.0,"team":1.2}},
"watch":{"hold":{"build":0.6,"tags":0.8,"dash":1.2,"found":1.4,"idle":1.2,"fix":1.0,"back":1.0,"share":1.4}},
"practice":{"hold":{"intro":0.6,"services":0.8,"software":1.0,"ref":1.0,"gap":0.8}},
"end":{"hold":{"data":0.8},"breathe":5.0}
};
