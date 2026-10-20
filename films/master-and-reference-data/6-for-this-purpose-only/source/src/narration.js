// Master and reference data · For this purpose only. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"house":{"name":"What stays in the house","lead":1.6,"tail":1.0,"vo":[
 {"id":"book","gap":0.8,"text":"About two thousand years ago, India's Charaka Samhita, a book of medicine, set down an oath."},
 {"id":"fire","gap":0.8,"text":"A teacher gave it to each new student, by the sacred fire, before teaching them anything."},
 {"id":"line","gap":0.8,"text":"One line says: the peculiar customs of the patient's household shall not be made public."},
 {"id":"home","gap":0.8,"text":"A healer comes into a home to heal, and sees how the family lives."},
 {"id":"stays","gap":0.8,"text":"It stays in that home."},
 {"id":"purpose","gap":0.8,"text":"What you learn for one purpose isn't yours for every purpose."}]},
"appeal":{"name":"An appeal","lead":1.0,"tail":1.0,"vo":[
 {"id":"today","gap":0.8,"text":"Today, at the university. Advancement, the alumni office, plans an appeal for a new scholarship."},
 {"id":"top","gap":0.8,"text":"Owen, who runs it, asks the registry for this year's top students, to feature them."},
 {"id":"given","gap":0.8,"text":"Their results were collected to teach them and award their degrees, not to raise money."},
 {"id":"goes","gap":0.8,"text":"But nothing in the data says so, and the list goes."}]},
"wish":{"name":"A wish left behind","lead":1.0,"tail":1.0,"vo":[
 {"id":"month","gap":0.8,"text":"The same month, the appeal's email goes to the faculty's students and alumni."},
 {"id":"reaches","gap":0.8,"text":"It reaches Linh, as a student. She's back for a master's."},
 {"id":"said","gap":0.8,"text":"When she graduated in 2022, she asked the alumni office not to ask her for donations.","say":"When she graduated in twenty twenty-two, she asked the alumni office not to ask her for donations."},
 {"id":"kept","gap":0.8,"text":"They wrote it on her alumni record. The student system never heard it."},
 {"id":"linked","gap":0.8,"text":"Her records are linked now, but the wish was written on one of them, not on her."}]},
"purposes":{"name":"What each role is for","lead":1.0,"tail":1.0,"vo":[
 {"id":"each","gap":0.8,"text":"So the university writes its own oath, as data: what each role's data is for."},
 {"id":"student","gap":0.8,"text":"The student's results: teaching and awards."},
 {"id":"alumna","gap":0.8,"text":"The alumna's details: news, events and fundraising."},
 {"id":"tutor","gap":0.8,"text":"The tutor's pay: employment."},
 {"id":"researcher","gap":0.8,"text":"The researcher's data: her project, as she agreed."},
 {"id":"list","gap":0.8,"text":"Each purpose comes from one list, with an owner and a date."},
 {"id":"rule","gap":0.8,"text":"A team may use a role's data only for a purpose written on it."},
 {"id":"open","gap":0.8,"text":"So the appeal can open the alumna's door, and no other."}]},
"wishes":{"name":"Wishes on the person","lead":1.0,"tail":1.0,"vo":[
 {"id":"on","gap":0.8,"text":"And Linh's wishes go on the person, not on a role."},
 {"id":"data","gap":0.8,"text":"Each one is data: what she asked, for which purpose, when, to whom, and how to change it."},
 {"id":"closes","gap":0.8,"text":"Her no to fundraising closes the alumna's door too."},
 {"id":"holds","gap":0.8,"text":"A no she gave the alumni office now holds wherever she appears, until she changes it."}]},
"platform":{"name":"Written into the platform","lead":1.0,"tail":1.0,"vo":[
 {"id":"tags","gap":0.8,"text":"Where the data is transformed, Jun writes each purpose as a tag on the columns."},
 {"id":"test","gap":0.8,"text":"A test fails if a column with personal data has no purpose."},
 {"id":"policy","gap":0.8,"text":"Then two policies on the platform read the tags."},
 {"id":"mask","gap":0.8,"text":"One hides every column tagged for teaching from the appeals team."},
 {"id":"filter","gap":0.8,"text":"The other leaves out anyone whose wishes say no."},
 {"id":"once","gap":0.8,"text":"Each is written once, and every table with those tags follows it."}]},
"again":{"name":"The appeal, again","lead":1.0,"tail":1.0,"vo":[
 {"id":"next","gap":0.8,"text":"So the next appeal goes to alumni, as their role allows."},
 {"id":"select","gap":0.8,"text":"It selects 2,140 of them.","say":"It selects two thousand, one hundred and forty of them."},
 {"id":"off","gap":0.8,"text":"37 come off, because their no sits on the person, and Linh is one of them.","say":"Thirty-seven come off, because their no sits on the person, and Linh is one of them."},
 {"id":"results","gap":0.8,"text":"The top students' results stay with teaching."}]},
"request":{"name":"What do you hold about me?","lead":1.0,"tail":1.4,"vo":[
 {"id":"asks","gap":0.8,"text":"Then Linh asks the university what it holds about her."},
 {"id":"used","gap":0.8,"text":"That used to mean four offices, each searching its own system."},
 {"id":"now","gap":0.8,"text":"Now Mei's office starts from the person, and the links find every role."},
 {"id":"source","gap":0.8,"text":"Each value comes back with where it came from, and what it's for."},
 {"id":"fix","gap":0.8,"text":"A correction goes to the office that keeps the value."},
 {"id":"days","gap":0.8,"text":"Her answer is ready in days, not weeks."},
 {"id":"forget","gap":0.8,"text":"If she asked to be forgotten, each role would keep only what it must."},
 {"id":"must","gap":0.8,"text":"Her degree for good, and her project's data for as long as its rules require."}]},
"elsewhere":{"name":"Elsewhere","lead":1.0,"tail":1.0,"vo":[
 {"id":"every","gap":0.8,"text":"Every industry has these doors."},
 {"id":"shop","gap":0.8,"text":"A shop's loyalty card was given for discounts, not to decide who gets credit."},
 {"id":"hospital","gap":0.8,"text":"A hospital patient agreed to one study."},
 {"id":"next","gap":0.8,"text":"The next study asks again."}]},
"only":{"name":"For this purpose only","lead":1.0,"tail":1.0,"vo":[
 {"id":"house","gap":0.8,"text":"What the healer saw stayed inside the house."},
 {"id":"keeps","gap":0.8,"text":"The university keeps each role's data inside its purpose, and Linh's wishes with her."},
 {"id":"line","gap":0.8,"text":"Data given for one role isn't free for every role."}]}
};
