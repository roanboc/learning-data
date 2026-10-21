/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the comment fixed at eight, then the title; and the ending. */
const BREATH={
"night":{"hold":{"imag":0.6,"adds":0.8,"three":0.8,"comment":0.8,"eight":0.6,"shows":0.6},"breathe":4.2},
"today":{"hold":{"list":0.8,"fail":0.8,"says":0.5,"waits":0.5}},
"skill":{"hold":{"skill":0.6,"file":0.8,"steps1":1.0,"steps2":1.0,"steps3":0.8,"never":0.8}},
"review":{"hold":{"reviews":0.8,"findings":0.8,"one":0.8,"two":0.6,"tally":1.0,"rule":1.0}},
"decides":{"hold":{"keys":0.6,"other":0.8,"doubt":0.8,"confirms":0.6,"classed":0.8,"owners":1.2,"decided":0.6}},
"agent":{"hold":{"binder":0.8,"own":0.8,"samples":0.8,"approve":0.8,"green":1.2}},
"written":{"hold":{"plain":0.4,"care":0.9,"open":0.5,"change":0.6,"trust":0.6}},
"close":{"hold":{"parts":1.2},"breathe":4.6}
};
