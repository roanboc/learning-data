/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Three wordless moments: the water running on through the qanat to the fields, then the title; the two columns of who owns what,
   side by side; and the village's water and channel, then the end card. */
const BREATH={
"water":{"hold":{"edge":0.9,"qanat":1.0,"shafts":0.8,"never":1.0,"fragile":1.0,"needed":0.6,"shares":0.6,"town":1.0,"mirab":0.6,"diggers":0.8,"lasted":0.8,"today":0.8},"breathe":5.2},
"map":{"hold":{"drawn":1.1,"part":0.9,"three":1.5,"next":0.4}},
"three":{"hold":{"ticket":0.8,"answers":0.4,"billing":0.6,"network":0.6,"own":1.0,"last":0.6,"minister":1.0}},
"whose":{"hold":{"pick":0.8,"who":0.8,"analyst":1.2,"choose":1.0,"account":0.8,"point":1.0,"none":1.2}},
"owns":{"hold":{"writes":0.6,"business":1.2,"team":1.0,"like":1.0},"breathe":2.4},
"parts":{"hold":{"core":1.0,"around":0.8,"wider":0.8,"only":0.6,"four":1.0}},
"answer":{"hold":{"back":0.8,"ama":0.6,"both":1.0,"builds":0.8,"retired":0.8,"checks":0.6}},
"practice":{"hold":{"itself":0.8,"actor":1.0,"tickets":0.8,"objects":1.0}},
"end":{"hold":{"village":1.0,"utility":1.0},"breathe":6.0}
};
