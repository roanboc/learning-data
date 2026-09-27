// "gap": the beat after each line, a natural breath between sentences; longer stops are in breath.js
const NARR={
"drawn":{"name":"The sketch we drew","lead":3.8,"tail":1.4,"vo":[
 {"id":"recap","gap":0.8,"text":"In the first film, we drew a sketch of the university: a student, a class, an enrolment, a term and a course."},
 {"id":"over","gap":0.8,"text":"It was an oversimplification. Good enough to start, not good enough to count."},
 {"id":"normal","gap":0.8,"text":"That's normal. Every model starts simple, and gets sharper when a real question needs it."}]},
"two":{"name":"Two numbers","lead":0.6,"tail":1.2,"vo":[
 {"id":"ask","gap":0.8,"text":"The day after census date, the Head of School asks Genie a simple question."},
 {"id":"q","gap":0.8,"text":"How many students were enrolled in Data Science 101 on census date?"},
 {"id":"nums","gap":0.8,"text":"Genie says 131. The certified census report says 118."},
 {"id":"clean","gap":0.8,"text":"Both come from clean data. Every test passed."},
 {"id":"meaning","gap":0.8,"text":"The difference isn't in the data. It's in the meaning."},
 {"id":"check","gap":0.8,"text":"So before we change anything, we ask a wider question: how does this kind of business generally work?"},
 {"id":"industry","gap":0.8,"text":"In many industries, someone has already modelled it, and their model makes a good first template."},
 {"id":"choose","gap":0.8,"text":"Often there's more than one to choose from, so which one you pick, and why, matters too."},
 {"id":"tcsi","gap":0.8,"text":"TCSI could be one of the choices: it's public, and it describes the data Australian universities report to government."},
 {"id":"mcds","gap":0.8,"text":"Many universities actually use MortarCAPS, the sector's own data standard. Here, we'll check our sketch against TCSI."},
 {"id":"fit","gap":0.8,"text":"It's a reference to check against, not a model to copy. We'll see where it fits our business, and where it doesn't."}]},
"cls":{"name":"What is a class?","lead":0.6,"tail":1.2,"vo":[
 {"id":"q","gap":0.8,"text":"First question: what is a class?"},
 {"id":"ref","gap":0.8,"text":"Lay the reference over our sketch, and it has no class at all. It has units of study, and enrolments in them."},
 {"id":"hiding","gap":0.8,"text":"Our one box was hiding three things."},
 {"id":"unit","gap":0.8,"text":"The unit: Data Science 101, the subject itself."},
 {"id":"offering","gap":0.8,"text":"The offering: that unit, in one teaching period, at one campus. This is what students enrol in."},
 {"id":"classes","gap":0.8,"text":"And the class: the Tuesday 9 am tutorial, a place in the timetable."},
 {"id":"genie","gap":0.8,"text":"Genie counted places in tutorials, and some students sit in two."},
 {"id":"grain","gap":0.8,"text":"So say exactly what one row stands for. That's called the grain."}]},
"census":{"name":"Whose census date?","lead":0.6,"tail":1.2,"vo":[
 {"id":"q","gap":0.8,"text":"Next: where does the census date live?"},
 {"id":"term","gap":0.8,"text":"Our sketch put it on the term: one date for everyone."},
 {"id":"ref","gap":0.8,"text":"The reference records it with each unit enrolment, because each unit of study has its own census date."},
 {"id":"summer","gap":0.8,"text":"A summer intensive of Data Science 101 has a census date weeks away from the semester's."},
 {"id":"adopt","gap":0.8,"text":"Put each detail on the thing it truly describes. Here, we adopt the reference."}]},
"courses":{"name":"One student, two courses","lead":0.6,"tail":1.2,"vo":[
 {"id":"twice","gap":0.8,"text":"Now, two students appear twice in the count."},
 {"id":"double","gap":0.8,"text":"Each is studying a double degree: data science, and business."},
 {"id":"one","gap":0.8,"text":"Our sketch said a student belongs to one course. That's not how the university works."},
 {"id":"admission","gap":0.8,"text":"The reference already has the answer: a course admission. One student, in one course, from one start date."},
 {"id":"once","gap":0.8,"text":"Each unit enrolment counts towards one course admission, so each student is counted once."},
 {"id":"link","gap":0.8,"text":"When two things connect many to many, the link often deserves its own box."}]},
"time":{"name":"Enrolled when?","lead":0.6,"tail":1.2,"vo":[
 {"id":"q","gap":0.8,"text":"Last question: enrolled when?"},
 {"id":"today","gap":0.8,"text":"Genie counted today. The census report counted on census date."},
 {"id":"change","gap":0.8,"text":"Enrolments change. A student is waitlisted, then enrolled, and later withdraws."},
 {"id":"extend","gap":0.8,"text":"The reference keeps each enrolment's current status. We need its history, so we extend the model."},
 {"id":"snap","gap":0.8,"text":"Each change is kept with its date, and the census count becomes a snapshot of one day."}]},
"levels":{"name":"Three levels of precision","lead":0.6,"tail":1.2,"vo":[
 {"id":"still","gap":0.8,"text":"The sketch is sharper now. But it's still a sketch."},
 {"id":"concept","gap":0.8,"text":"This is the conceptual model: the things that matter, and how they connect, agreed with the business."},
 {"id":"logical","gap":0.8,"text":"Zoom in, and it becomes the logical model: what identifies each thing, its details, and how many of each."},
 {"id":"physical","gap":0.8,"text":"Zoom in again, and it becomes the physical model: the actual tables in the platform."},
 {"id":"agree","gap":0.8,"text":"Same meaning, three levels of detail. The business owns the first, engineers own the last, and all three must agree."},
 {"id":"another","gap":0.8,"text":"How to build those tables is a story for another film."}]},
"fit":{"name":"Check, adopt, extend, record","lead":0.6,"tail":1.2,"vo":[
 {"id":"lift","gap":0.8,"text":"Lift the reference away, and you can see the whole fit."},
 {"id":"check","gap":0.8,"text":"Check: before you invent something, look for it in a reference model."},
 {"id":"adopt","gap":0.8,"text":"Adopt: where it fits the business, use its ideas and its words."},
 {"id":"extend","gap":0.8,"text":"Extend: where the business needs more, add it, in the same style."},
 {"id":"record","gap":0.8,"text":"Record: write down every difference and why, so the next person knows what is standard and what is ours."},
 {"id":"cage","gap":0.8,"text":"A reference is a starting point, not a cage. Where the business is truly different, the business wins."}]},
"end":{"name":"Pull back","lead":0.6,"tail":1.0,"vo":[
 {"id":"again","gap":0.8,"text":"The Head of School asks again."},
 {"id":"asks","gap":0.8,"text":"This time, Genie asks back: enrolled on census date, in the Semester 1 offering?"},
 {"id":"answer","gap":0.8,"text":"Then it answers: 118, and shows how it counted."},
 {"id":"version","gap":0.8,"text":"The sketch has a new version, and a note that says why it changed."},
 {"id":"evolve","gap":0.8,"text":"It won't be the last. Models evolve: not often, but always."},
 {"id":"tag","gap":0.8,"text":"Check the reference. Fit it to the business."}]}
};
