// The hidden factory, the first film of Quality as a habit, the second series of Data quality. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (years and numbers in words). The few longer stops are in breath.js.
const NARR={
"dead":{"name":"Dead letters","lead":1.6,"tail":1.6,"vo":[
 {"id":"city","gap":0.8,"text":"Washington, 1899.","say":"Washington, eighteen ninety-nine."},
 {"id":"mail","gap":0.8,"text":"More than six million letters and parcels a year end up in one office: the Dead Letter Office."},
 {"id":"means","gap":0.8,"text":"A dead letter is one the post can't deliver, and can't send back."},
 {"id":"moved","gap":0.8,"text":"Most often, people have moved on without leaving an address."},
 {"id":"street","gap":0.8,"text":"Or a letter to a city gives no street and number, or a town is spelt the way it sounds."},
 {"id":"room","gap":0.8,"text":"In one room, clerks, many of them women, work out where each should have gone."},
 {"id":"collins","gap":0.8,"text":"The best known, Patti Lyle Collins, works out about a thousand a day."},
 {"id":"unseen","gap":0.8,"text":"It's skilled work, unseen by the senders, and it never fixes the next letter."},
 {"id":"lost","gap":0.8,"text":"Nearly three million a year are destroyed: news someone never gets."},
 {"id":"change","gap":0.8,"text":"The fix has to start where the address is written, not where it ends up."},
 {"id":"zones","gap":0.8,"text":"In 1943, with experienced clerks gone to the war, big cities get zones: a number the sender writes, so new clerks can sort by it.","say":"In nineteen forty-three, with experienced clerks gone to the war, big cities get zones: a number the sender writes, so new clerks can sort by it."},
 {"id":"zip","gap":0.8,"text":"In 1963, the post brings in the ZIP Code: five digits on every letter, written by the sender.","say":"In nineteen sixty-three, the post brings in the zip code: five digits on every letter, written by the sender."},
 {"id":"sort","gap":0.8,"text":"Now anyone, and soon machines, can sort a letter by its number."},
 {"id":"used","gap":0.8,"text":"By 1969, 83% of Americans use it, and it has saved the post billions since.","say":"By nineteen sixty-nine, eighty-three percent of Americans use it, and it has saved the post billions since."},
 {"id":"start","gap":0.8,"text":"The fix moved to the start: written once, by the person who knows the address."},
 {"id":"campus","gap":0.8,"text":"At the university, two people put the graduation list's names right by hand before every ceremony, in a copy."},
 {"id":"same","gap":0.8,"text":"So every new list brings the same errors back."},
 {"id":"promise","gap":1.0,"text":"Count that work, fix each error where it's born, and a name is put right once, for every list after."}
]},
"hand":{"name":"Every name, by hand","lead":1.0,"tail":1.4,"vo":[
 {"id":"malia","gap":0.8,"text":"Malia Fonoti runs the graduations. Before each list goes to the printer, she and a colleague check every name by hand."},
 {"id":"down","gap":0.8,"text":"On Monday 20 October 2025, they download December's list from the platform into a spreadsheet: 2,031 names.","say":"On Monday the twentieth of October, twenty twenty-five, they download December's list from the platform into a spreadsheet: two thousand and thirty-one names."},
 {"id":"docs","gap":0.8,"text":"Each is checked against the documents seen at enrolment; where it doesn't match, they phone the graduate."},
 {"id":"sent","gap":0.8,"text":"They correct the spreadsheet, and on 13 November it goes to the printer.","say":"They correct the spreadsheet, and on the thirteenth of November it goes to the printer."},
 {"id":"printed","gap":0.8,"text":"In December, 41 certificates still have to be printed again.","say":"In December, forty-one certificates still have to be printed again."},
 {"id":"hundred","gap":0.8,"text":"Yet in February, a close look at a hundred of the list's records found 21 with an error.","say":"Yet in February, a close look at a hundred of the list's records found twenty-one with an error."},
 {"id":"five","gap":0.8,"text":"One record in five, but only 41 certificates in 2,031?","say":"One record in five, but only forty-one certificates in two thousand and thirty-one?"},
 {"id":"like","gap":1.0,"text":"Like the readers in Washington, Malia's team puts the rest right at the end, unseen."}
]},
"hidden":{"name":"Nobody counts it","lead":1.0,"tail":1.4,"vo":[
 {"id":"redman","gap":0.3,"text":"Thomas Redman, who has spent his career on data quality, calls this a hidden data factory:"},
 {"id":"steps","gap":0.8,"text":"the extra steps one team adds to put right the data another team makes."},
 {"id":"plant","gap":0.8,"text":"Decades before, in factories, Armand Feigenbaum called it the hidden plant."},
 {"id":"needed","gap":0.8,"text":"It's careful work, and until the errors stop, it's needed."},
 {"id":"three","gap":0.8,"text":"But it hides three things."},
 {"id":"hours","gap":0.8,"text":"The hours, because nobody counts them."},
 {"id":"rate","gap":0.8,"text":"How good the data really is, because the printer sees only what gets past."},
 {"id":"cause","gap":0.8,"text":"And the cause, because no fix reaches the place where the errors are born."},
 {"id":"advice","gap":1.0,"text":"Redman's advice: count it, then take what you find to the people who make the data."}
]},
"count":{"name":"Count it","lead":1.0,"tail":1.4,"vo":[
 {"id":"august","gap":0.8,"text":"In August 2026, Noor Rahman, the data architect, counts it with Malia, three ways.","say":"In August, twenty twenty-six, Noor Rahman, the data architect, counts it with Malia, three ways."},
 {"id":"cal","gap":0.8,"text":"The hours, from the team's own calendar: about 240 for December's list, 50 for March's, 30 for July's.","say":"The hours, from the team's own calendar: about two hundred and forty for December's list, fifty for March's, thirty for July's."},
 {"id":"year","gap":0.8,"text":"320 hours a year: two months of one person's work.","say":"Three hundred and twenty hours a year: two months of one person's work."},
 {"id":"rounds","gap":0.3,"text":"The rounds, from Databricks' system tables:"},
 {"id":"query","gap":0.8,"text":"its query history and audit log show the list queried and downloaded on three Mondays, one before each list."},
 {"id":"copy","gap":0.8,"text":"And the corrections: December's copy, as it went to the printer, against the list the platform built the night before."},
 {"id":"changed","gap":0.8,"text":"517 names had been changed by hand, and 26 more had got past them: the names printed again.","say":"Five hundred and seventeen names had been changed by hand, and twenty-six more had got past them: the names printed again."},
 {"id":"quarter","gap":0.8,"text":"So 543 of 2,031 names were wrong when the list left the platform: about one in four.","say":"So five hundred and forty-three of two thousand and thirty-one names were wrong when the list left the platform: about one in four."},
 {"id":"minutes","gap":0.8,"text":"A right name takes about two minutes to check. A wrong one, about twenty: find the document, phone the graduate, type it again."},
 {"id":"wrong","gap":0.8,"text":"So the wrong names took about 170 of December's 240 hours.","say":"So the wrong names took about a hundred and seventy of December's two hundred and forty hours."},
 {"id":"ten","gap":1.0,"text":"Redman's rule of ten, a rule of thumb: a record with an error costs about ten times as much to finish."}
]},
"back":{"name":"Cut short again","lead":1.0,"tail":1.4,"vo":[
 {"id":"beatriz","gap":0.8,"text":"Beatriz Fonseca de Albuquerque Cavalcanti graduates twice this year: a graduate certificate in March, a master's in December."},
 {"id":"long","gap":0.8,"text":"Her family name has 33 characters.","say":"Her family name has thirty-three characters."},
 {"id":"feb","gap":0.8,"text":"In February, the portal showed it cut short, and she corrected it: March's certificate was right."},
 {"id":"cutagain","gap":0.8,"text":"In August, her master's joins December's list, cut short again."},
 {"id":"ask","gap":0.8,"text":"With Mei and Malia, Noor and Jun ask why, five times."},
 {"id":"why1","gap":0.8,"text":"Why is it cut? The list takes the student system's name, unless she confirms it for that ceremony."},
 {"id":"why2","gap":0.8,"text":"Why is it still cut there? Her correction went to March's list, not to the student system."},
 {"id":"why3","gap":0.8,"text":"Why? Only the registrar's office changes the student system, and nothing sent it there."},
 {"id":"why4","gap":0.8,"text":"Why was it cut at all? The family name field holds 30 characters.","say":"Why was it cut at all? The family name field holds thirty characters."},
 {"id":"why5","gap":0.8,"text":"Why 30? It was set when the system was built, and it fitted most names then.","say":"Why thirty? It was set when the system was built, and it fitted most names then."},
 {"id":"causes","gap":0.8,"text":"Two causes: a field too short, and no way back."},
 {"id":"lineage","gap":0.3,"text":"Inside the platform, Unity Catalog's lineage draws the same path, column by column:"},
 {"id":"path","gap":0.8,"text":"from the name on the list back to the student system's family name."},
 {"id":"tell","gap":1.0,"text":"Before the platform and after it, people have to tell you."}
]},
"bones":{"name":"Four bones","lead":1.0,"tail":1.4,"vo":[
 {"id":"fish","gap":0.8,"text":"To find every cause, the team draws a fishbone, as Kaoru Ishikawa taught: the problem at its head, the causes along its bones."},
 {"id":"four","gap":0.8,"text":"Four bones: people, process, systems, and interfaces, where data passes from one system to another."},
 {"id":"people","gap":0.8,"text":"People: paper forms before 2015 had one box for the whole name, split by whoever typed it in: 35 swapped.","say":"People: paper forms before twenty fifteen had one box for the whole name, split by whoever typed it in: thirty-five swapped."},
 {"id":"process","gap":0.8,"text":"Process: every fix made in a copy, with no way back."},
 {"id":"systems","gap":0.8,"text":"Systems: the 30-character field, 39 names cut short; and until 2019, an online form that took only A to Z, in capitals: 312 names.","say":"Systems: the thirty-character field, thirty-nine names cut short; and until twenty nineteen, an online form that took only A to Z, in capitals: three hundred and twelve names."},
 {"id":"inter","gap":0.8,"text":"Interfaces: the nightly file to the platform, in an old encoding that turned é into e.","say":"Interfaces: the nightly file to the platform, in an old encoding that turned an e with an accent into a plain e."},
 {"id":"accents","gap":0.8,"text":"143 names stored right lost their accents on the way in.","say":"A hundred and forty-three names stored right lost their accents on the way in."},
 {"id":"nobody","gap":1.0,"text":"Nobody did anything wrong. Each cause made sense when it was made."}
]},
"born":{"name":"Where it's born","lead":1.0,"tail":1.4,"vo":[
 {"id":"fixed","gap":0.8,"text":"As Fixed where it starts showed: fix it where it starts, with its owner."},
 {"id":"night","gap":0.3,"text":"On the night of Monday 14 September, the student system team, with Sam, changes two things:","say":"On the night of Monday the fourteenth of September, the student system team, with Sam, changes two things:"},
 {"id":"file","gap":0.8,"text":"the nightly file keeps every letter, and the family name field holds 100 characters.","say":"the nightly file keeps every letter, and the family name field holds a hundred characters."},
 {"id":"mei","gap":0.8,"text":"From that day, every correction is made once, in the student system, by Mei's office; the graduations team keeps no copy."},
 {"id":"old","gap":0.8,"text":"Old names are put right as each graduate confirms theirs, those graduating first."},
 {"id":"jun","gap":0.8,"text":"And Jun adds checks in dbt where the names are born: on the student system's records, each night, owned by Mei."},
 {"id":"hold","gap":0.8,"text":"A family name exactly 30 characters long, or in capitals only, holds for her office: a list to work through.","say":"A family name exactly thirty characters long, or in capitals only, holds for her office: a list to work through."},
 {"id":"stop","gap":0.8,"text":"A night's file with not one letter outside A to Z stops the update: the list keeps the night before's names, and Sam is told."},
 {"id":"levels","gap":1.0,"text":"A doubt about one name waits for a person; a file losing letters for everyone stops."}
]},
"once":{"name":"Put right once","lead":1.0,"tail":1.6,"vo":[
 {"id":"morning","gap":0.8,"text":"By the morning of Tuesday 15 September, 161 names on December's list have their accents back, and nobody typed them.","say":"By the morning of Tuesday the fifteenth of September, a hundred and sixty-one names on December's list have their accents back, and nobody typed them."},
 {"id":"written","gap":0.8,"text":"The check holds Beatriz's name, and Mei's office writes it in full, once, for every list after."},
 {"id":"score","gap":0.8,"text":"Each round's hours go on the scorecard, beside the checks, so everyone can watch them fall."},
 {"id":"post","gap":0.8,"text":"The post stopped placing letters one by one, and put a code on them at the start, written by the person who knew."},
 {"id":"names","gap":0.8,"text":"At the university, each name is now put right where it's born, by the people who own it."},
 {"id":"take","gap":1.2,"text":"Count the work spent fixing data by hand. Then fix where it's born."}
]}
};
