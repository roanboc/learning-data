const NARR={
"drawn":{"name":"The sketch we drew","lead":3.8,"tail":1.4,"vo":[
 {"id":"recap","text":"In the first film, we drew a sketch of the university: a student, a class, an enrolment, a term and a course."},
 {"id":"over","text":"It was an oversimplification. Good enough to start, not good enough to count."},
 {"id":"normal","text":"That's normal. Every model starts simple, and gets sharper when a real question needs it."}]},
"two":{"name":"Two numbers","lead":0.6,"tail":1.2,"vo":[
 {"id":"ask","text":"The day after census date, the Head of School asks Genie a simple question."},
 {"id":"q","text":"How many students were enrolled in Data Science 101 on census date?"},
 {"id":"nums","text":"Genie says 131. The certified census report says 118."},
 {"id":"clean","text":"Both come from clean data. Every test passed."},
 {"id":"meaning","text":"The difference isn't in the data. It's in the meaning."},
 {"id":"check","text":"So before we change anything, we do what good modellers do: we check a reference model."},
 {"id":"tcsi","text":"Here, that's TCSI: the data Australian universities report to government. Someone has already modelled this."}]},
"cls":{"name":"What is a class?","lead":0.6,"tail":1.2,"vo":[
 {"id":"q","text":"First question: what is a class?"},
 {"id":"ref","text":"Lay the reference over our sketch, and it has no class at all. It has units of study, and enrolments in them."},
 {"id":"hiding","text":"Our one box was hiding three things."},
 {"id":"unit","text":"The unit: Data Science 101, the subject itself."},
 {"id":"offering","text":"The offering: that unit, in one teaching period, at one campus. This is what students enrol in."},
 {"id":"classes","text":"And the class: the Tuesday 9 am tutorial, a place in the timetable."},
 {"id":"genie","text":"Genie counted places in tutorials, and some students sit in two."},
 {"id":"grain","text":"So say exactly what one row stands for. That's called the grain."}]},
"census":{"name":"Whose census date?","lead":0.6,"tail":1.2,"vo":[
 {"id":"q","text":"Next: where does the census date live?"},
 {"id":"term","text":"Our sketch put it on the term: one date for everyone."},
 {"id":"ref","text":"The reference records it with each unit enrolment, because each unit of study has its own census date."},
 {"id":"summer","text":"A summer intensive of Data Science 101 has a census date weeks away from the semester's."},
 {"id":"adopt","text":"Put each detail on the thing it truly describes. Here, we adopt the reference."}]},
"courses":{"name":"One student, two courses","lead":0.6,"tail":1.2,"vo":[
 {"id":"twice","text":"Now, two students appear twice in the count."},
 {"id":"double","text":"Each is studying a double degree: data science, and business."},
 {"id":"one","text":"Our sketch said a student belongs to one course. That's not how the university works."},
 {"id":"admission","text":"The reference already has the answer: a course admission. One student, in one course, from one start date."},
 {"id":"once","text":"Each unit enrolment counts towards one course admission, so each student is counted once."},
 {"id":"link","text":"When two things connect many to many, the link often deserves its own box."}]},
"time":{"name":"Enrolled when?","lead":0.6,"tail":1.2,"vo":[
 {"id":"q","text":"Last question: enrolled when?"},
 {"id":"today","text":"Genie counted today. The census report counted on census date."},
 {"id":"change","text":"Enrolments change. A student is waitlisted, then enrolled, and later withdraws."},
 {"id":"extend","text":"The reference keeps each enrolment's current status. We need its history, so we extend the model."},
 {"id":"snap","text":"Each change is kept with its date, and the census count becomes a snapshot of one day."}]},
"levels":{"name":"Three levels of precision","lead":0.6,"tail":1.2,"vo":[
 {"id":"still","text":"The sketch is sharper now. But it's still a sketch."},
 {"id":"concept","text":"This is the conceptual model: the things that matter, and how they connect, agreed with the business."},
 {"id":"logical","text":"Zoom in, and it becomes the logical model: what identifies each thing, its details, and how many of each."},
 {"id":"physical","text":"Zoom in again, and it becomes the physical model: the actual tables in the platform."},
 {"id":"agree","text":"Same meaning, three levels of detail. The business owns the first, engineers own the last, and all three must agree."},
 {"id":"another","text":"How to build those tables is a story for another film."}]},
"fit":{"name":"Check, adopt, extend, record","lead":0.6,"tail":1.2,"vo":[
 {"id":"lift","text":"Lift the reference away, and you can see the whole fit."},
 {"id":"check","text":"Check: before you invent something, look for it in a reference model."},
 {"id":"adopt","text":"Adopt: where it fits the business, use its ideas and its words."},
 {"id":"extend","text":"Extend: where the business needs more, add it, in the same style."},
 {"id":"record","text":"Record: write down every difference and why, so the next person knows what is standard and what is ours."},
 {"id":"cage","text":"A reference is a starting point, not a cage. Where the business is truly different, the business wins."}]},
"end":{"name":"Pull back","lead":0.6,"tail":1.0,"vo":[
 {"id":"again","text":"The Head of School asks again."},
 {"id":"asks","text":"This time, Genie asks back: enrolled on census date, in the Semester 1 offering?"},
 {"id":"answer","text":"Then it answers: 118, and shows how it counted."},
 {"id":"version","text":"The sketch has a new version, and a note that says why it changed."},
 {"id":"evolve","text":"It won't be the last. Models evolve: not often, but always."},
 {"id":"tag","text":"Check the reference. Fit it to the business."}]}
};
