/* Room to think, shared by every language (see ../breathing-cut.md and ../pacing-review.md).
   Each sentence ends on the beat narration.js gives it (0.8 s in English), and 0.3 s is left where a sentence runs on into the next line (engine3.js).
   hold: extra seconds of silence after a line, while the picture keeps moving. breathe: a wordless end to the chapter, whose picture starts at the scene's "breath" cue.
   As in the later films, only three chapters end without words: the sketch (the densest), the people, and the end. The others
   flow on into the next, and every sentence gets a beat of its own ("gap" in narration.js).
   pause: extra seconds of silence before a line. The narration itself lives in narration.js. */
const BREATH={
"tap":{"hold":{"stored":0.8}},
"in":{"hold":{"colours":0.3,"zerobus":0.8,"auto":0.8}},
"sketch":{"hold":{"model":1.0,"wrong":0.4,"concept":0.5},"breathe":4},
"refine":{"hold":{"rough":0.5,"tests":0.8,"orphan":0.8}},
"gold":{"hold":{"marts":0.5}},
"layers":{},
"meaning":{"hold":{"define":1.0,"uc":0.5}},
"speeds":{"hold":{"years":0.8}},
"out":{"hold":{"stale":0.3}},
"people":{"hold":{"fix":0.5,"ask":1.0},"breathe":3.5},
"end":{"hold":{"seats":1.3},"breathe":1}
};
