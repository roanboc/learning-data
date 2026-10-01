// In the weeds of data crafting · One row of what, and when. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"card":{"name":"One card, one day","lead":1.4,"tail":1.0,"vo":[
 {"id":"day","gap":0.8,"text":"In 1890, the United States counted its people as they were on one day: the first of June.","say":"In eighteen ninety, the United States counted its people as they were on one day: the first of June."},
 {"id":"called","gap":0.8,"text":"Census takers called for weeks, but every answer described that day."},
 {"id":"born","gap":0.8,"text":"A baby born after the first wasn't counted. Someone who died after it was."},
 {"id":"punch","gap":0.8,"text":"Each person's answers became holes punched in a card, and Herman Hollerith's machines counted them."},
 {"id":"bridge","gap":0.8,"text":"One card per person, as at one day. Planning's question needs the same two things."}]},
"grain":{"name":"One sentence","lead":1.0,"tail":1.0,"vo":[
 {"id":"before","gap":0.8,"text":"Before any SQL, Jun writes down what one row of Planning's table is."},
 {"id":"sentence","gap":0.8,"text":"One row per learner per award, as at census date."},
 {"id":"name","gap":0.8,"text":"That sentence is the grain. It says what a row is, and which day it describes."},
 {"id":"agent","gap":0.8,"text":"The agent drafted it from the census report's columns. Noor, who owns the model, approves it."},
 {"id":"test","gap":0.8,"text":"Then it becomes a test: no two rows with the same learner and the same award."}]},
"fan":{"name":"Fan-out","lead":1.0,"tail":1.0,"vo":[
 {"id":"why","gap":0.8,"text":"Here's why it matters. In July, a graduate certificate in Health changed its name."},
 {"id":"two","gap":0.8,"text":"So the award has two versions: the old name, and the new one."},
 {"id":"join","gap":0.8,"text":"Join the credit to the award on its key alone, and every learner meets both versions."},
 {"id":"double","gap":0.8,"text":"Eight learners become sixteen rows. A hundred and eighty-five credit points become three hundred and seventy."},
 {"id":"quiet","gap":0.8,"text":"Nothing errors, and every row looks right. Only the test on the grain notices."},
 {"id":"fix","gap":0.8,"text":"Join the version that was valid on census day, and there are eight rows again."}]},
"versions":{"name":"Every version kept","lead":1.0,"tail":1.0,"vo":[
 {"id":"kept","gap":0.8,"text":"Those versions come from the sources. Nothing is overwritten: every change arrives as a new row, with the date it started and the date it ended."},
 {"id":"seen","gap":0.8,"text":"But those dates say when the platform saw a change, not when it was true. Where a system says when something happened, the model uses that."},
 {"id":"aisha","gap":0.8,"text":"Aisha's credit towards her certificate has six versions. Five points in October, forty-five by the end of February, and sixty in July."},
 {"id":"core","gap":0.8,"text":"The core's grain says so: one row per learner, per award, per version. A test checks that no two versions overlap."}]},
"was":{"name":"As it was, as it is","lead":1.0,"tail":1.0,"vo":[
 {"id":"days","gap":0.8,"text":"Now two consumers read the same versions, and ask about different days."},
 {"id":"census","gap":0.8,"text":"Planning asks about census day, the 31st of March. Aisha held forty-five of sixty points, with fifteen to go. She counts.","say":"Planning asks about census day, the thirty-first of March. Aisha held forty-five of sixty points, with fifteen to go. She counts."},
 {"id":"today","gap":0.8,"text":"The wallet app asks about today. Aisha finished in July, and her wallet shows the certificate."},
 {"id":"totals","gap":0.8,"text":"Across the university, as it was on census day: twelve learners. As it is today: nine."},
 {"id":"both","gap":0.8,"text":"Both are right. They answer different questions."},
 {"id":"declare","gap":0.8,"text":"So each output declares its day, and one small macro picks the version valid on it."}]},
"stitch":{"name":"One timeline","lead":1.0,"tail":1.0,"vo":[
 {"id":"three","gap":0.8,"text":"A learner lives in three systems, and each keeps its own versions."},
 {"id":"dates","gap":0.8,"text":"Aisha's platform account came first. Her student record took effect six days later. A short-course account arrived in January."},
 {"id":"cut","gap":0.8,"text":"Jun cuts all three at every date on which any of them changed, and stitches one timeline."},
 {"id":"wins","gap":0.8,"text":"On each date, the student system's value wins, then the platform's, then the short course's."},
 {"id":"same","gap":0.8,"text":"A change that alters nothing the model holds makes no new version. Four dates give Aisha three."}]},
"late":{"name":"Late news","lead":1.0,"tail":1.0,"vo":[
 {"id":"priya","gap":0.8,"text":"Last, Priya. She withdrew from her certificate on the 27th of March, four days before census.","say":"Last, Priya. She withdrew from her certificate on the twenty-seventh of March, four days before census."},
 {"id":"week","gap":0.8,"text":"The student system recorded it on the 3rd of April, a week late.","say":"The student system recorded it on the third of April, a week late."},
 {"id":"recorded","gap":0.8,"text":"Dated by when it was recorded, she'd still be studying on census day, and Business would count four. The census report says three."},
 {"id":"effect","gap":0.8,"text":"Dated by when it took effect, Business counts three. As in 1890, the answer describes the day, not the day it was written down.","say":"Dated by when it took effect, Business counts three. As in eighteen ninety, the answer describes the day, not the day it was written down."},
 {"id":"gap","gap":0.8,"text":"The platforms only say when they recorded a change. That gap is accepted, and written down."}]},
"next":{"name":"A promise to write","lead":1.0,"tail":1.0,"vo":[
 {"id":"what","gap":0.8,"text":"One row of what, and when. Declared before any SQL, and tested."},
 {"id":"promise","gap":0.8,"text":"Two consumers, one core. Before any more code, write down what each is promised."}]}
};
