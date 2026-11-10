/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the scene's "breath" cue.
   There are three wordless moments in the whole film: the title, the sketch gaining its new status, and the ending. */
const BREATH={
"banner":{"breathe":3.2},
"night":{"hold":{"test":0.5,"unknown":0.6,"safely":0.8}},
"thread":{"hold":{"back":0.5,"steps":0.5}},
"bronze":{"hold":{"new":0.6}},
"halves":{"hold":{"reached":0.6,"knew":0.8},"breathe":3},
"recover":{"hold":{"would":0.6}},
"contract":{"hold":{"meet":0.4,"agree":0.5,"owners":0.6,"checks":0.8}},
"end":{"breathe":3.5}
};
