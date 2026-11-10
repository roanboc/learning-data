/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the title card after the opening, and the end card. The voice runs at about 185 words a minute while it speaks,
   so each line keeps a short hold after it, and every chapter stays near 130 words a minute (tools/pace.py). */
const BREATH={
"page":{"hold":{"place":0.6,"crash":0.4,"page":0.6,"cab":0.6,"none":0.8,"homes":1.0,"change":1.2,"book":0.6,"share":0.6,"line":0.8,"unknown":1.0,"today":0.6,"knows":1.0,"same":0.6,"tag":0.8},"breathe":4.4},
"mask":{"hold":{"day":0.8,"least":0.9,"tables":0.9,"hand":1.1,"grants":0.9,"every":1.0,"sam":0.8}},
"parts":{"hold":{"four":0.2,"where":0.6,"whom":0.4,"finds":0.6,"does":1.2,"before":0.2,"each":0.9,"rows":0.8,"shelf":0.8}},
"ways":{"hold":{"small":0.8,"whole":1.2,"part":1.2,"general":1.2,"type":1.4,"filter":1.4,"other":0.6,"code":1.2}},
"through":{"hold":{"owner":1.0,"decide":1.0,"loader":1.2,"given":1.0,"two":1.2,"allows":1.0,"agent":1.0,"compute":0.6}},
"appears":{"hold":{"day":1.0,"level":0.8,"nine":1.4,"first":1.0,"study":1.2,"road":1.2,"until":1.4,"tag":0.8}},
"code":{"hold":{"kept":0.4,"review":0.6,"runs":0.6,"whole":0.6,"door":1.0,"road":0.4,"here":0.6,"lands":0.6,"take":1.4},"breathe":4.0}
};
