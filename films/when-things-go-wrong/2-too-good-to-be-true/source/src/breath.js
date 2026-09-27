/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the scene's "breath" cue.
   There are three wordless moments in the whole film: the title, the three Tuesdays side by side, and the ending. */
const BREATH={
"open":{"breathe":3.2},
"limits":{"hold":{"card":0.5,"leila":0.5,"warn":0.5,"error":0.6}},
"night":{"hold":{"restart":0.4,"rows":0.6,"total":0.6,"red":0.8}},
"tuesdays":{"hold":{"none":0.5,"later":0.6,"channel":0.6,"error":0.4,"david":0.8},"breathe":3.5},
"level":{"hold":{"real":0.6,"two":0.6,"reads":0.5,"cost":0.4}},
"thread":{"hold":{"upstream":0.4,"pairs":0.6,"key":0.6}},
"reload":{"hold":{"source":0.5,"patch":0.6,"travel":0.6}},
"end":{"hold":{"behind":0.6},"breathe":4}
};
