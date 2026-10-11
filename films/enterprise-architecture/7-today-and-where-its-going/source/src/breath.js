/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Three wordless moments: today's list beside the imagined street, then the title; a light moving along the path, plateau by plateau; and the ending. */
const BREATH={
"morning":{"hold":{"imagine":0.7,"street":0.9,"crew":0.9,"drawing":0.8},"breathe":4.4},
"list":{"hold":{"note":0.7,"bought":0.8,"place":0.9}},
"find":{"hold":{"three":0.9,"none":0.9,"orphan":0.8}},
"layers":{"hold":{"below":0.8,"derive":0.8}},
"views":{"hold":{"drafts":0.7,"blocks":0.9,"whole":0.9}},
"target":{"hold":{"second":0.8,"new":0.8}},
"gaps":{"hold":{"diff":0.9}},
"path":{"hold":{"third":0.8,"order":0.9},"breathe":3.4},
"why":{"hold":{"each":1.0,"outage":1.1}},
"end":{"hold":{"confirm":0.7,"answer":0.8,"done":0.7},"breathe":5.0}
};
