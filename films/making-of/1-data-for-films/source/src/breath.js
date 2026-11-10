/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the scene's "breath" cue.
   Four wordless moments: the title, the edge's pixels, the sizes side by side, and the film playing on at the end. */
const BREATH={
"frame":{"hold":{"squares":0.5},"breathe":3.6},
"data":{"hold":{"count":0.6}},
"draw":{"hold":{"rect":0.6,"more":1.0,"raster":0.4,"edge":1.2}},
"layers":{"hold":{"five":0.8,"order":0.4,"swap":0.6,"light":0.4,"lens":0.6,"glitch":0.6}},
"parts":{"hold":{"give":0.6,"rows":0.8,"really":1.4,"same":0.4}},
"camera":{"hold":{"before":0.8},"breathe":1.5},
"time":{"hold":{"function":0.6,"where":0.6,"back":0.6,"ease":1.0,"random":0.4,"exact":0.6}},
"play":{"hold":{"two":0.3,"live":0.8,"video":0.4,"diff":0.8,"sizes":1.6,"flip":0.6}},
"again":{"hold":{"list":0.6},"breathe":4.5}
};
