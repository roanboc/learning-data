/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the
   chapter's "breath" cue. Two wordless moments: the title card after the opening story, and the end card. The longer holds let a
   picture finish: the office filling floor by floor, the flood of a building's worth, the platform still after "Something has to change",
   the stamps landing, the drawer that fills only after its label, the drawers emptying one note at a time, the papers kept for good,
   the schedule signed and the first clean-up, Linh's eight dates, the day nobody has to decide, the hold's card, the clean-up that skips
   only her records, and the close in 1943 and at the university. */
const BREATH={
"flood":{"hold":{"dc":0.6,"war":0.4,"cabinets":0.8,"flood":1.0,"eighty":0.6,"again":0.6,"kept":0.4,"cost":0.4,"proof":0.8,"change":1.2}},
"before":{"hold":{"law":0.6,"kind":0.6,"approve":0.6,"pile":0.8,"claim":0.6,"other":0.6,"budget":0.8,"family":1.0,"uni":0.8},"breathe":4.4},
"lives":{"hold":{"oct":0.4,"look":0.4,"pay":0.6,"never":0.6,"three":0.4,"use":0.4,"archived":0.6,"deleted":0.6,"good":0.6,"year":0.8,"plan":1.0}},
"schedule":{"hold":{"lists":0.6,"one":0.4,"row":0.8,"owners":0.6,"payrow":0.8,"academic":0.6,"others":0.6,"reason":0.8,"signed":1.0,"went":1.2}},
"clock":{"hold":{"event":0.6,"contract":0.4,"eight":0.8,"firstc":0.6,"lastc":0.8,"others":0.6,"follows":0.8,"friday":0.6,"nobody":1.0,"as43":1.0}},
"hold":{"hold":{"stay":0.8,"tutor":0.8,"due":0.8,"show":0.8,"places":1.2,"names":1.0,"skips":1.0,"never":0.8,"lifts":1.0,"as43":1.0}},
"end":{"hold":{"short":0.6,"long":0.6,"laws":0.8,"outside":0.8,"copy":0.8,"dmd":0.8,"pile":0.8,"few":1.0,"every":1.0},"breathe":5.0}
};
