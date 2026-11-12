/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the road at dusk, its travellers walking on, then the title; and the five roads lit at the end, then the end card. */
const BREATH={
"road":{"hold":{"domains":0.4,"slow":0.6,"need":0.6,"seal":1.0,"roads":0.8,"fast":0.6,"shared":0.8,"wrong":0.4},"breathe":4.4},
"map":{"hold":{"list":0.6,"box":0.8}},
"words":{"hold":{"vendor":0.6,"parts":0.6,"keep":0.8}},
"test":{"hold":{"billing":0.4,"owner":0.6,"none":0.6,"ent":0.4,"test":1.0}},
"erp":{"hold":{"suite":0.6,"line":0.8}},
"logic":{"hold":{"horses":1.0,"runs":1.0,"always":1.0}},
"minutes":{"hold":{"measure":0.6,"built":0.6,"jump":0.8,"why":1.0,"whose":1.0,"find":1.0,"ticket":0.6,"build":0.8,"check":0.8}},
"owner":{"hold":{"road":1.6,"sponsor":1.0,"all":1.2,"measured":1.4}},
"why":{"hold":{"crosses":0.6,"inside":1.0}},
"practice":{"hold":{"tech":0.6,"app":0.6,"port":0.6,"none":0.8}},
"end":{"hold":{"letters":0.8,"data":0.8},"breathe":5.0}
};
