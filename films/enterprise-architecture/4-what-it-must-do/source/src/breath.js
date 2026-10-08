/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Three wordless moments: the road fades, then the title; the map's depth fading out under "just enough"; and the ending. */
const BREATH={
"road":{"hold":{"years":0.4,"changed":0.6},"breathe":4.6},
"wall":{"hold":{"copy":0.3,"complete":0.6}},
"team":{"hold":{"team":0.5,"list":0.3}},
"what":{"hold":{"test":0.6}},
"levels":{"hold":{"top":0.4,"parts":0.6,"connect":0.5,"depth":0.5}},
"owners":{"hold":{"gap":0.6}},
"heat":{"hold":{"heat":0.5,"hot":0.6,"look":0.4}},
"spine":{"hold":{"move":0.8,"stable":0.4}},
"depth":{"hold":{"declare":0.5},"breathe":3.0},
"end":{"hold":{"answer":0.6},"breathe":5.0}
};
