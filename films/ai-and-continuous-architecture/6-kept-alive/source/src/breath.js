/* Pauses, used sparingly: the film flows, and stops only where an idea needs a moment to land.
   hold: extra seconds after a line, while the picture keeps moving. breathe: a wordless end to a chapter, whose picture starts at the chapter's "breath" cue.
   Four wordless moments: the utility's map, kept, with the things it describes moving under it, then the title; Grace's question to
   Tomás; the city wall, its words in clay still in it, beside the map, kept; and the end card. */
const BREATH={
"fall":{"hold":{"city":0.6,"ruin":0.8,"strabo":0.7,"died":1.0,"quarry":0.7,"walls":1.0,"need":1.0,"listed":0.6,"keepers":0.9,"utility":0.6},"breathe":3.6},
"five":{"hold":{"year":0.6,"asks":1.1,"five":1.2,"why":1.3,"copy":1.0,"two":1.3,"grace":0.6},"breathe":2.4},
"moved":{"hold":{"read":0.9,"steps":0.9,"words":1.0,"people":0.9,"agents":0.9,"passed":1.0,"never":0.8}},
"copy":{"hold":{"paste":1.2,"drift":1.4,"chat":1.2,"rule":1.3,"cite":1.2,"retest":1.3}},
"leaves":{"hold":{"lead":1.1,"name":0.9,"sees":1.1,"agent":1.3,"now":1.1,"confirm":0.6}},
"job":{"hold":{"whole":1.1,"term":0.9,"product":1.0,"cap":0.9,"owner":1.0,"budget":1.0,"rhythm":1.0,"month":1.0,"quarter":1.0}},
"series":{"hold":{"last":1.1,"map":1.0,"business":1.0,"data":1.0,"platform":1.0,"here":1.1,"links":0.6}},
"back":{"hold":{"wall":0.9,"practice":1.2,"babel":0.8,"slowly":1.1,"spring":0.9,"homes":0.6},"breathe":3.6},
"end":{"hold":{"answer":0.6,"keep":1.0},"breathe":5.0}
};
