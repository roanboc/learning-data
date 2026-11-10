/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Two wordless moments: the week's average splitting into its hours as it becomes the title card; and the page with its picture, alone,
   as it becomes the end card. */
const BREATH={
"pilot":{"hold":{"when":0.6,"why":0.4,"avg":0.8,"easy":0.4,"door":1.0,"cockpit":1.0,"change":1.4,"daniels":0.2,"asked":0.6,"ten":0.2,"band":0.8,"height":0.4,"chest":0.4,"fewer":1.2,"none":1.5,"note":1.2,"range":1.0,"fit":0.6,"seats":0.2,"adjust":0.8,"car":0.8,"data":0.6},"breathe":5.6},
"page":{"hold":{"uni":0.2,"ask":1.2,"full":0.8,"q":1.4,"april":1.2,"june":1.0,"ivy":0.8,"draft":1.2,"chart":1.0,"thesis":1.4}},
"first":{"hold":{"pile":1.0,"start":1.4,"minto":1.4,"decision":1.2,"answer":1.4,"three":1.2,"back":1.0,"seats":0.4}},
"turns":{"hold":{"hides":1.0,"map":1.2,"peak":1.6,"right":0.8,"corridors":1.2,"daniels":1.4,"used":1.4,"tufte":1.0,"knaflic":1.2,"together":1.2}},
"unknown":{"hold":{"take":1.4,"forecast":1.4,"unknown":1.4,"holds":1.4,"mei":1.2,"says":1.4,"word":1.4,"words":1.2,"which":0.4,"plan":1.2}},
"decide":{"hold":{"sends":1.2,"meets":1.0,"asks":1.2,"defers":1.4,"argued":1.2}},
"monday":{"hold":{"back":1.2,"ivy":1.4,"one":1.0,"two":1.0,"three":1.0,"four":1.2},"breathe":5.0}
};
