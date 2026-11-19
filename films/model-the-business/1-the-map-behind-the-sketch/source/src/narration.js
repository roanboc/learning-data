// Model the business · The map behind the sketch. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"lost":{"name":"Lost registers","lead":4.2,"tail":1.0,"vo":[
 {"id":"when","gap":0.8,"text":"China, 1368. After years of war, a new dynasty, the Ming, rules from Nanjing.","say":"China, thirteen sixty-eight. After years of war, a new dynasty, the Ming, rules from Nahn-jing."},
 {"id":"owe","gap":0.8,"text":"Every household owes the state grain from its fields, and work: carrying grain, building walls, mending roads."},
 {"id":"lost","gap":0.8,"text":"But the old registers were lost in the war, and no tax had a fixed measure."},
 {"id":"hide","gap":0.8,"text":"In the rich province of Zhejiang, landowners wrote their fields under other households' names, to escape the work."},
 {"id":"harm","gap":0.8,"text":"So the burden fell on the families who couldn't hide their land."},
 {"id":"need","gap":0.8,"text":"The court didn't need a bigger count. It needed to know whose each field was, and who lived in each house."}]},
"two":{"name":"Two registers","lead":0.8,"tail":1.0,"vo":[
 {"id":"decide","gap":0.8,"text":"So, before counting anything, the court decided what it needed to know, and gave each thing a register of its own."},
 {"id":"yellow","gap":0.8,"text":"From 1381, households went into the Yellow Registers, in village units of a hundred and ten, led by ten of them in turn.","say":"From thirteen eighty-one, households went into the Yellow Registers, in village units of a hundred and ten, led by ten of them in turn."},
 {"id":"fish","gap":0.8,"text":"From 1387, land went into the fish-scale registers. Students of the Imperial Academy measured every field: its shape, its size, and its owner's name.","say":"From thirteen eighty-seven, land went into the fish-scale registers. Students of the Imperial Academy measured every field: its shape, its size, and its owner's name."},
 {"id":"scales","gap":0.8,"text":"Drawn plot by plot, the fields looked like the scales of a fish."},
 {"id":"jobs","gap":0.8,"text":"Each had one job: the land register settled who held a field; the household register, what each family owed."},
 {"id":"warp","gap":0.8,"text":"The Ming History calls them the warp and the weft: threads that run two ways, and together make a cloth."},
 {"id":"count","gap":0.8,"text":"By 1393, the court could count its people again: ten and a half million households.","say":"By thirteen ninety-three, the court could count its people again: ten and a half million households."},
 {"id":"sold","gap":0.8,"text":"And when a field was sold, its tax went with it, so no family paid for land it no longer held."}]},
"sketch":{"name":"The sketch we drew","lead":1.6,"tail":1.0,"vo":[
 {"id":"same","gap":0.8,"text":"A university has the same need, and so does every data model."},
 {"id":"promise","gap":0.8,"text":"The Inner Life of Data ended on a promise: what it means, and who decides, is the rest of the story."},
 {"id":"drew","gap":0.8,"text":"On the way, we drew a sketch: a student, a class, an enrolment, a term and a course."},
 {"id":"noor","gap":0.8,"text":"Noor, the data architect, is about to make it the university's shared model.","say":"Nuur, the data architect, is about to make it the university's shared model."},
 {"id":"place","gap":0.8,"text":"But first, each box needs a place: what it's for, who answers for it, where it's written, and what it means."},
 {"id":"map","gap":0.8,"text":"That's the university's map. The enterprise architecture films draw one for an energy company."}]},
"does":{"name":"What it does","lead":0.8,"tail":1.0,"vo":[
 {"id":"caps","gap":0.8,"text":"The map starts with what the university does: its capabilities."},
 {"id":"herm","gap":0.8,"text":"Universities share a reference for them, HERM, the Higher Education Reference Models, so nobody starts from a blank page.","say":"Universities share a reference for them, Herm, the Higher Education Reference Models, so nobody starts from a blank page."},
 {"id":"what","gap":0.8,"text":"A capability says what, not how. Systems and teams change; the need to award a degree doesn't."},
 {"id":"open","gap":0.8,"text":"Open learning and teaching, and the sketch's boxes start to belong somewhere: awards and courses, learner records, graduation."},
 {"id":"census","gap":0.8,"text":"Counting students on census date sits elsewhere: in planning, under strategy."}]},
"knows":{"name":"What it needs to know","lead":0.8,"tail":1.0,"vo":[
 {"id":"domains","gap":0.8,"text":"Next, what the university needs to know, in data domains: person, student, course, staff, finance, and a few more."},
 {"id":"owner","gap":0.8,"text":"Each domain has one owner: the area that answers for its data."},
 {"id":"mei","gap":0.8,"text":"Student and course belong to Mei's registrar's office, with the faculties for courses. Staff is HR's. Organisation is Planning's."},
 {"id":"drop","gap":0.8,"text":"The student and the enrolment fall into the student domain; the course, the class and the term, into the course domain."},
 {"id":"decides","gap":0.8,"text":"An owner doesn't build anything. An owner decides what the words mean, and what good data looks like."}]},
"kept":{"name":"Where it's written","lead":0.8,"tail":1.0,"vo":[
 {"id":"sor","gap":0.8,"text":"Then, where each thing is first written: its system of record."},
 {"id":"sis","gap":0.8,"text":"Students, enrolments and courses are written in the student system. HR and Finance keep their own."},
 {"id":"copies","gap":0.8,"text":"The data platform holds copies, to read and to count. A copy is useful, but it never decides."},
 {"id":"fix","gap":0.8,"text":"When the two disagree, the record wins, and a mistake is fixed where it was written."}]},
"means":{"name":"What the words mean","lead":0.8,"tail":1.0,"vo":[
 {"id":"gloss","gap":0.8,"text":"Last, what each word means: the business glossary. Each term has a definition, and an owner who decides it."},
 {"id":"first","gap":0.8,"text":"A term is decided there first, and the model copies it, word for word."},
 {"id":"look","gap":0.8,"text":"Look up the sketch's words, and two of them aren't the university's."},
 {"id":"cls","gap":0.8,"text":"The registrar's office speaks of unit offerings, not classes: a unit taught in a semester, on campus, online or both."},
 {"id":"term","gap":0.8,"text":"And of teaching periods, not terms, whose census date Planning counts by, for government."},
 {"id":"gov","gap":0.8,"text":"Owners decide the words, stewards keep them written, and the data team builds from them."}]},
"cross":{"name":"Warp and weft","lead":0.8,"tail":1.0,"vo":[
 {"id":"cross","gap":0.8,"text":"Now cross the two maps, like warp and weft: what the university does, and what it needs to know."},
 {"id":"cells","gap":0.8,"text":"Each crossing says who creates a thing, and who only reads it: learning and teaching creates enrolments; Planning reads them."},
 {"id":"one","gap":0.8,"text":"One creator for each thing; as many readers as need it."},
 {"id":"hang","gap":0.8,"text":"The sketch now hangs on the map. Each box has an owner, a home and a meaning."},
 {"id":"two","gap":0.8,"text":"All but two: the class, whose word isn't the university's, and the term, whose date two areas share."}]},
"start":{"name":"Where the work starts","lead":0.8,"tail":1.0,"vo":[
 {"id":"q","gap":0.8,"text":"And when a new question comes, the map says where the work starts."},
 {"id":"flow","gap":0.8,"text":"A ticket names the question. The map finds its things, their owners and their records. The glossary gives the words."},
 {"id":"build","gap":0.8,"text":"A contract fixes the shape, and only then is the model built, from what already exists."}]},
"end":{"name":"Pull back","lead":0.8,"tail":1.0,"vo":[
 {"id":"back","gap":0.8,"text":"The two registers let the court settle a field and set a tax, because each had one job, and one keeper."},
 {"id":"uni","gap":0.8,"text":"The university's map does the same for its data: when a number is wrong, everyone knows whose record to check."},
 {"id":"next","gap":0.8,"text":"The map says where each box lives. It doesn't say the boxes are right. That's the next film."},
 {"id":"tag","gap":0.8,"text":"Map it before you model it."}]}
};
