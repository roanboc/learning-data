// One map, in the repo: film 2 of Architecture that keeps up, the third series of Data management. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (years and dates in words). The few longer stops are in breath.js.
const NARR={
"tiles":{"name":"One database, every map","lead":3.0,"tail":1.0,"vo":[
 {"id":"when","gap":0.8,"text":"Great Britain, in the late 1990s.","say":"Great Britain, in the late nineteen-nineties."},
 {"id":"os","gap":0.8,"text":"Ordnance Survey, the national mapping agency, keeps the most detailed maps of the country."},
 {"id":"tiles","gap":0.8,"text":"Its paper maps have been turned into digital ones, and cut into tiles, square by square."},
 {"id":"lines","gap":0.8,"text":"But on a tile, a building is only lines on a picture. It has no name, no number, nothing to point to."},
 {"id":"users","gap":0.8,"text":"Councils, water companies and the emergency services each keep their own records of the same buildings and roads."},
 {"id":"match","gap":0.8,"text":"Each matches its records to the lines in its own way."},
 {"id":"harm","gap":0.8,"text":"So one school can be one thing in a council's records, and another in a water company's."},
 {"id":"sure","gap":0.8,"text":"Nobody can be sure that two records mean the same place."},
 {"id":"road","gap":0.8,"text":"And when a new road is built, each of them must find it, and change it, on its own."},
 {"id":"change","gap":0.8,"text":"Something has to change."},
 {"id":"launch","gap":0.8,"text":"In 2001, Ordnance Survey launches OS MasterMap: one seamless database of the whole country, instead of tiles.","say":"In two thousand and one, Ordnance Survey launches OS MasterMap: one seamless database of the whole country, instead of tiles."},
 {"id":"toid","gap":0.8,"text":"Every feature in it, about 440 million at first, gets its own identifier, a TOID, with a version and a date.","say":"Every feature in it, about four hundred and forty million at first, gets its own identifier, a TOID, with a version and a date."},
 {"id":"survey","gap":0.8,"text":"Surveyors, on the ground and from the air, keep it up to date, and users receive only what has changed."},
 {"id":"point","gap":0.8,"text":"Now a council and a water company can point to the same building by its identifier, with no doubt which one they mean."},
 {"id":"history","gap":0.8,"text":"Each change carries its version and its date, so anyone can see what changed, and when."},
 {"id":"grew","gap":0.8,"text":"By 2016, it holds over 500 million features.","say":"By twenty sixteen, it holds over five hundred million features."},
 {"id":"data","gap":0.8,"text":"A data team's architecture has the same problem: one picture of its platform, kept in copies that drift apart."},
 {"id":"one","gap":0.8,"text":"Keep one source, date every change, and make every copy from it."}
]},
"copies":{"name":"Three pictures of one target","lead":1.0,"tail":1.0,"vo":[
 {"id":"series","gap":0.8,"text":"These films are the product owner's side of a data manager's job, borrowed from architecture."},
 {"id":"spring","gap":0.8,"text":"A university, in the spring of 2027. Helena Novak, the data manager, has a target picture for the data platform.","say":"A university, in the spring of twenty twenty-seven. Helena Novak, the data manager, has a target picture for the data platform."},
 {"id":"three","gap":0.8,"text":"It exists three times: Noor's map in the architecture tool, a page on the wiki, and the slides for the data council."},
 {"id":"each","gap":0.8,"text":"Each was right the day it was made. Each has been changed by hand, on its own, since."},
 {"id":"may","gap":0.8,"text":"On Tuesday 25 May, Helena asks the council to retire the old warehouse.","say":"On Tuesday the twenty-fifth of May, Helena asks the council to retire the old warehouse."},
 {"id":"slide","gap":0.8,"text":"The council's slide still shows the old warehouse in the target."},
 {"id":"which","gap":0.8,"text":"Which picture is true? Nobody in the room can say for sure."},
 {"id":"pm","gap":0.8,"text":"Project managers have the same trouble: who does what, when and how, sits in a deck from March."},
 {"id":"noor","gap":0.8,"text":"Noor, the data architect, says what Ordnance Survey found: copies drift. Keep one source."}
]},
"repo":{"name":"The map moves into the repo","lead":1.0,"tail":1.0,"vo":[
 {"id":"june","gap":0.8,"text":"In June, the map's source moves into the data team's repository, as files, beside the platform's code."},
 {"id":"standard","gap":0.8,"text":"Noor writes it in ArchiMate's exchange format, a standard language for architecture, from The Open Group."},
 {"id":"own","gap":0.8,"text":"She adds only what is the team's own, such as each product's owner. Standards first; then what's relevant to you."},
 {"id":"text","gap":0.8,"text":"The diagrams are kept as text too, in Mermaid, or as draw.io files, so a change to a picture is a change you can read."},
 {"id":"night","gap":0.8,"text":"Each night, everything else is made from it: the architecture tool's views, the wiki, and the picture on the monthly page."},
 {"id":"who","gap":0.8,"text":"And the project managers' page of who does what, when and how."},
 {"id":"places","gap":0.8,"text":"Of the team's seven places for its work, from Where each piece lives, the map's source now lives in one: the repository."},
 {"id":"cant","gap":0.8,"text":"The wiki and the slides can't disagree with the map any more. They're made from it."}
]},
"change":{"name":"Every change, reviewed","lead":1.0,"tail":1.0,"vo":[
 {"id":"pr","gap":0.8,"text":"Every change to the map is a pull request, with its reason, reviewed by someone other than its author."},
 {"id":"who","gap":0.8,"text":"Noor, Helena and the principal engineers, Sam and Jun, review. Data partners in the faculties propose."},
 {"id":"july","gap":0.8,"text":"In July, Sam's team adds the rooms' sensor feed to the platform."},
 {"id":"same","gap":0.8,"text":"The same pull request adds the feed to the map's current state. The code and the map change together."},
 {"id":"check","gap":0.8,"text":"And a check fails if a new source has no place on the map."},
 {"id":"wait","gap":0.8,"text":"Nobody waits for a funded project to update the current state and the target."},
 {"id":"legacy","gap":0.8,"text":"Wait for that, and the team ends up building tomorrow's legacy."},
 {"id":"record","gap":0.8,"text":"A big choice gets a short decision record beside it, as Michael Nygard proposed in 2011: what was decided, and why.","say":"A big choice gets a short decision record beside it, as Michael Nygard proposed in twenty eleven: what was decided, and why."}
]},
"agent":{"name":"An agent drafts, a person decides","lead":1.0,"tail":1.0,"vo":[
 {"id":"august","gap":0.8,"text":"In August, Helena asks the team's agent to draft the change that retires the old warehouse, from her notes."},
 {"id":"writes","gap":0.8,"text":"In minutes, it writes the new target state, and draws its diagram, as text."},
 {"id":"review","gap":0.8,"text":"Noor reviews it, line by line."},
 {"id":"wrong","gap":0.8,"text":"One relationship is wrong: payroll's reports still read from the old warehouse, after it's gone."},
 {"id":"fix","gap":0.8,"text":"She asks for the fix, checks it, and approves."},
 {"id":"rule","gap":0.8,"text":"The agent films have the same rule: an agent proposes, and a person decides."}
]},
"everyone":{"name":"Everyone's job, starting with hers","lead":1.0,"tail":1.0,"vo":[
 {"id":"hers","gap":0.8,"text":"The map isn't one person's job. It starts with Helena: she opened its first pull request herself."},
 {"id":"beside","gap":0.8,"text":"The principal engineers keep it with her, and anyone on the team can propose a change."},
 {"id":"dec","gap":0.8,"text":"By Friday 17 December, the old warehouse is retired, and 63 changes of the year are in the map's history, each with its reason.","say":"By Friday the seventeenth of December, the old warehouse is retired, and sixty-three changes of the year are in the map's history, each with its reason."},
 {"id":"council","gap":0.8,"text":"At its reviews, the council reads that history, not a slide made the night before."}
]},
"monday":{"name":"On Monday","lead":1.0,"tail":1.0,"vo":[
 {"id":"back","gap":0.8,"text":"Ordnance Survey stopped keeping its map in pieces: one database, every feature with its identifier, every change with its date."},
 {"id":"helena","gap":0.8,"text":"Helena's team did the same with its architecture: one map, and every other picture made from it."},
 {"id":"repo","gap":0.8,"text":"On Monday, put your architecture in a repository, as files, in a standard language."},
 {"id":"review","gap":0.8,"text":"Review every change like code, and update the current and target state in the change that moves them."},
 {"id":"make","gap":0.8,"text":"Make the wiki, the slides and the who-does-what pages from it."},
 {"id":"agents","gap":0.8,"text":"Let agents draft the structure and the diagrams, and review what they draft."},
 {"id":"job","gap":0.8,"text":"And make architecture everyone's job, starting with yours."},
 {"id":"take","gap":0.8,"text":"One map in the repository; every change updates it; everything else comes from it."}
]}
};
