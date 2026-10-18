/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Three wordless moments: the road, the closed door and its light, then the title; the appeal's numbers; and the end card. */
const BREATH={
"house":{"hold":{"book":0.6,"fire":0.6,"line":0.9,"home":0.9,"stays":1.0},"breathe":4.6},
"appeal":{"hold":{"today":0.5,"top":0.5,"given":0.4,"goes":0.6}},
"wish":{"hold":{"month":0.6,"reaches":0.8,"said":0.8,"kept":1.0,"linked":0.9}},
"purposes":{"hold":{"each":0.5,"researcher":0.4,"list":0.5,"rule":0.4,"open":1.0}},
"wishes":{"hold":{"on":0.5,"data":0.8,"closes":0.8,"holds":0.6}},
"platform":{"hold":{"tags":0.6,"test":1.0,"policy":0.3,"mask":0.6,"filter":0.6,"once":0.6}},
"again":{"hold":{"next":0.4,"select":0.6,"off":0.8},"breathe":1.6},
"request":{"hold":{"asks":0.6,"used":1.0,"now":1.0,"source":0.9,"fix":0.9,"days":0.8,"forget":0.5,"must":0.8}},
"elsewhere":{"hold":{"every":0.2,"shop":0.6,"hospital":0.3,"next":0.6}},
"only":{"hold":{"house":0.8,"keeps":0.9},"breathe":5.0}
};
