/* The breathing cut: room to think, shared by every language (see ../breathing-cut.md).
   hold: extra seconds of silence after a line, while the picture keeps moving. breathe: a wordless end to the chapter, whose picture starts at the scene's "breath" cue.
   pause: extra seconds of silence before a line. The narration itself lives in narration.js. */
const BREATH={
"tap":{"hold":{"stored":2}},
"in":{"hold":{"colours":2.5,"zerobus":2,"auto":2},"breathe":6},
"sketch":{"hold":{"model":2.5,"wrong":2.5},"breathe":6},
"refine":{"hold":{"rough":2,"tests":2,"orphan":2},"breathe":7},
"gold":{"hold":{"products":3,"subject":2},"breathe":6},
"layers":{"breathe":8},
"meaning":{"hold":{"define":3,"uc":2},"breathe":6},
"speeds":{"hold":{"now":2,"years":2},"breathe":5},
"out":{"hold":{"events":2,"stale":3},"pause":{"twist":1},"breathe":6},
"people":{"hold":{"fix":2,"ask":2},"breathe":5},
"end":{"hold":{"seats":3},"breathe":2}
};
