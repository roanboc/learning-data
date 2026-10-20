// Master and reference data · Kept, not cleaned. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"river":{"name":"Kept, every dry season","lead":1.6,"tail":1.0,"vo":[
 {"id":"split","gap":0.8,"text":"Around 256 BC, in what is now Sichuan, the governor Li Bing split the Min River in two, without a dam, to water the Chengdu plain.","say":"Around two fifty-six B C, in what is now Sichuan, the governor Li Bing split the Min River in two, without a dam, to water the Chengdu plain."},
 {"id":"gravel","gap":0.8,"text":"Its shape sends most of the river's gravel down the outer channel."},
 {"id":"dry","gap":0.8,"text":"And every dry season, the inner channel is closed off and dug out, down to a mark buried in its bed."},
 {"id":"mark","gap":0.8,"text":"Stone horses, it's said, at first, and later iron bars."},
 {"id":"rule","gap":0.8,"text":"Its rule is six characters long: dig the riverbed deep, keep the weir low."},
 {"id":"still","gap":0.8,"text":"More than two thousand years later, it still waters the plain."},
 {"id":"kept","gap":0.8,"text":"It wasn't cleaned out once and left. It's kept, every year."}]},
"cleanup":{"name":"The clean-up","lead":1.0,"tail":1.0,"vo":[
 {"id":"merged","gap":0.8,"text":"At the university, in 2024, a clean-up project merged two thousand duplicate records of people.","say":"At the university, in twenty twenty-four, a clean-up project merged two thousand duplicate records of people."},
 {"id":"team","gap":0.8,"text":"It took a team of four, for six months, and it finished on time."},
 {"id":"gone","gap":0.8,"text":"For a while, the duplicates were gone."}]},
"return":{"name":"Back, intake by intake","lead":0.8,"tail":1.0,"vo":[
 {"id":"year","gap":0.8,"text":"A year later, there were eleven hundred new ones."},
 {"id":"every","gap":0.8,"text":"Every intake made more."},
 {"id":"why","gap":0.8,"text":"Graduates came back to study, and people applied through two routes, each giving them a new number."},
 {"id":"linh","gap":0.8,"text":"Linh's second number, in July 2025, was one of them.","say":"Linh's second number, in July twenty twenty-five, was one of them."},
 {"id":"fixed","gap":0.8,"text":"The clean-up fixed the records. It didn't change how they were made."}]},
"entry":{"name":"Stopped at the door","lead":0.8,"tail":1.0,"vo":[
 {"id":"search","gap":0.8,"text":"In 2026, the application started searching before it creates a person.","say":"In twenty twenty-six, the application started searching before it creates a person."},
 {"id":"match","gap":0.8,"text":"A clear match adds a role to someone already known. A likely one goes to Mei's queue."},
 {"id":"fell","gap":0.8,"text":"New duplicates fell under fifty an intake, and stayed there."},
 {"id":"shape","gap":0.8,"text":"Like the river's shape, the search keeps most of them out. Mei's queue digs out the rest."}]},
"measures":{"name":"The steward's iron bars","lead":0.8,"tail":1.0,"vo":[
 {"id":"process","gap":0.8,"text":"So keeping the person right isn't a project that ends. It's everyday work."},
 {"id":"bars","gap":0.8,"text":"Mei's office has its own iron bars: five measures, each with a limit."},
 {"id":"dups","gap":0.6,"text":"New duplicates per intake."},
 {"id":"oldest","gap":0.6,"text":"How long the queue's oldest case has waited."},
 {"id":"roles","gap":0.6,"text":"Roles past their end date, like a tutor whose term contract ended, but who's still active."},
 {"id":"source","gap":0.6,"text":"Values with no source."},
 {"id":"requests","gap":0.8,"text":"And requests for what the university holds about someone, answered on time."},
 {"id":"nightly","gap":0.8,"text":"Each has a test for its limit. Every night, the platform works them out, keeps them, and shows them on a dashboard."}]},
"alert":{"name":"Past its limit","lead":0.8,"tail":1.0,"vo":[
 {"id":"monday","gap":0.8,"text":"One Monday, an alert: the oldest case had waited twelve days."},
 {"id":"waiting","gap":0.8,"text":"It was waiting for HR to confirm a birth date, one digit apart."},
 {"id":"rang","gap":0.8,"text":"Mei rang HR, and the case was decided that morning, with its reason."},
 {"id":"blame","gap":0.8,"text":"The alert pointed at a case, not at a person to blame."}]},
"agent":{"name":"Proposed, then decided","lead":0.8,"tail":1.0,"vo":[
 {"id":"list","gap":0.8,"text":"Lists from outside change too. This year, the government's list of visa types added one."},
 {"id":"draft","gap":0.8,"text":"An agent drafted how it maps to the university's fee categories, with its evidence, as a change to the list."},
 {"id":"owner","gap":0.8,"text":"The list's owner, the admissions office, checked it and approved it."},
 {"id":"decides","gap":0.8,"text":"The agent proposes. The owner decides."}]},
"scorecard":{"name":"On the scorecard","lead":0.8,"tail":1.0,"vo":[
 {"id":"yusuf","gap":0.8,"text":"Yusuf, who leads data governance, reads the same measures on his scorecard, beside every other domain's."},
 {"id":"three","gap":0.8,"text":"Owners, limits, and a way to change them: the person now has all three."}]},
"elsewhere":{"name":"Elsewhere","lead":0.8,"tail":1.0,"vo":[
 {"id":"bank","gap":0.8,"text":"Every industry knows this picture. A bank cleans up its customer records every three years, and the duplicates come back every time."},
 {"id":"one","gap":0.8,"text":"One check at entry ends the cycle."}]},
"kept":{"name":"Kept","lead":1.0,"tail":1.0,"vo":[
 {"id":"phd","gap":0.8,"text":"February 2027. Linh starts her PhD: a new role, on the person she already is.","say":"February twenty twenty-seven. Linh starts her PhD: a new role, on the person she already is."},
 {"id":"count","gap":0.8,"text":"That intake made thirty-eight new duplicates. She isn't one of them."},
 {"id":"spring","gap":0.8,"text":"And at Dujiangyan, every spring, when the repairs are done, the water is let back in."},
 {"id":"line","gap":0.8,"text":"Clean it once, and it decays. Keep it, and it lasts."}]}
};
