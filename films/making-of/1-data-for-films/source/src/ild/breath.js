/* Room to think, shared by every language (see ../breathing-cut.md and ../pacing-review.md).
   The engine already leaves 0.7 s after each sentence, and 0.3 s where a sentence runs on into the next line (engine3.js).
   hold: extra seconds of silence after a line, while the picture keeps moving. breathe: a wordless end to the chapter, whose picture starts at the scene's "breath" cue.
   pause: extra seconds of silence before a line. The narration itself lives in narration.js. */
const BREATH={
"tap":{"hold":{"stored":0.8}},
"in":{"hold":{"colours":0.3,"zerobus":0.8,"auto":0.8},"breathe":4},
"sketch":{"hold":{"model":1.0,"concept":0.5},"breathe":4},
"refine":{"hold":{"rough":0.5,"tests":0.8,"orphan":0.8},"breathe":4.5},
"gold":{"breathe":4},
"layers":{"breathe":4.5},
"meaning":{"hold":{"define":1.0,"uc":0.5},"breathe":4},
"speeds":{"hold":{"years":0.8},"breathe":3.5},
"out":{"hold":{"stale":0.3},"breathe":4},
"people":{"hold":{"fix":0.5,"ask":1.0},"breathe":3.5},
"end":{"hold":{"seats":1.3},"breathe":1}
};
