/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the title, drawn over the tracing floor, and the ending, which closes the series. */
const BREATH={
"floor":{"hold":{"drew":0.6,"templates":0.8,"over":0.8,"stayed":1.0},"breathe":3.6},
"question":{"hold":{"asks":0.8,"decides":0.6,"kind":0.8,"files":0.8,"open":0.8,"backlog":1.0}},
"sources":{"hold":{"profile":0.6,"across":0.8,"numbers":1.0,"which":0.8,"rates":0.8}},
"output":{"hold":{"answer":0.6,"moves":0.8,"deleted":1.0,"grain":0.8,"until":0.8}},
"promise":{"hold":{"contract":0.8,"empty":0.8,"gap":0.8,"accept":1.0}},
"tests":{"hold":{"first":0.4,"grain":0.6,"unit":0.6,"report":0.8,"fail":1.0,"done":1.0}},
"build":{"hold":{"logic":0.4,"reads":0.8,"only":0.8,"short":0.8,"green":1.2}},
"validate":{"hold":{"reconcile":1.0,"diff":0.8,"nothing":0.8,"signoff":1.2}},
"ship":{"hold":{"pr":0.4,"last":0.8,"gone":1.0,"check":0.8,"approve":1.0}},
"once":{"hold":{"review":0.4,"two":0.8,"home":0.8,"zero":1.0}},
"evolve":{"hold":{"pin":0.6,"choice":0.8,"move":0.8,"list":1.2}},
"building":{"hold":{"ten":0.8,"stay":0.8,"work":1.0,"homes":1.0,"lives":0.8,"next":1.0,"series":1.0,"blueprint":1.0},"breathe":4.6}
};
