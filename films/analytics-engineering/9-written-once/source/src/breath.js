/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the title, drawn over the time ball and the gate clock, and the ending, which closes the series. */
const BREATH={
"ball":{"hold":{"drop":0.6,"wires":0.8,"hand":0.6},"breathe":3.6},
"four":{"hold":{"found":0.6,"drift":0.8,"one":1.0}},
"where":{"hold":{"fifth":0.8,"meaning":0.6,"why":0.6,"log":0.8}},
"blocks":{"hold":{"script":0.6,"points":0.8,"change":0.8}},
"diagrams":{"hold":{"hand":0.6,"generated":0.6,"rule":1.4}},
"catalog":{"hold":{"push":0.6,"there":0.8}},
"version":{"hold":{"expire":0.6,"breaks":0.6,"date":0.8,"tell":0.6,"choice":1.0}},
"loop":{"hold":{"steps":0.6,"approved":0.8,"new":0.8},"breathe":4.2}
};
