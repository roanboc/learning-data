// Master and reference data · One person, many roles. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"parish":{"name":"One record, wherever you go","lead":1.6,"tail":1.0,"vo":[
 {"id":"book","gap":0.8,"text":"In 1686, Sweden's church law asked every parish priest to keep a book of every household: who lived there, when they were born, whether they could read.","say":"In sixteen eighty-six, Sweden's church law asked every parish priest to keep a book of every household: who lived there, when they were born, whether they could read."},
 {"id":"moved","gap":0.8,"text":"When someone moved, they carried a certificate to their new parish, and the next book took them in."},
 {"id":"number","gap":0.8,"text":"In 1947, the register gave everyone a number for life.","say":"In nineteen forty-seven, the register gave everyone a number for life."},
 {"id":"once","gap":0.8,"text":"One person, written down once, followed wherever they went."}]},
"email":{"name":"A new email","lead":1.0,"tail":1.0,"vo":[
 {"id":"today","gap":0.8,"text":"Today, at the university. Linh Nguyen is studying health informatics."},
 {"id":"shared","gap":0.8,"text":"For years she shared her family's email with Minh, who studies here too."},
 {"id":"own","gap":0.8,"text":"This week, Linh gets her own address, and tells the student system."},
 {"id":"done","gap":0.8,"text":"Done, she thinks."}]},
"four":{"name":"Four records, four Linhs","lead":0.8,"tail":1.0,"vo":[
 {"id":"others","gap":0.8,"text":"But the student system isn't the only one that knows her."},
 {"id":"platform","gap":0.8,"text":"The learning platform has her account, with the family email."},
 {"id":"short","gap":0.8,"text":"So does the short-course platform, where she took Health Literacy."},
 {"id":"tutor","gap":0.8,"text":"And this semester she tutors a first-year unit, so HR has her too, with a staff number."},
 {"id":"inbox","gap":0.8,"text":"Her certificate and her payslip still go to the family inbox, and Minh opens them."},
 {"id":"alumni","gap":0.8,"text":"Next year, the alumni office will add one more."}]},
"kinds":{"name":"The kinds of data","lead":1.0,"tail":1.0,"vo":[
 {"id":"master","gap":0.8,"text":"Linh is master data: one of the things the university is about, shared by every process and system."},
 {"id":"reference","gap":0.8,"text":"The lists that sort her, like “casual tutor” or a country, are reference data."},
 {"id":"trans","gap":0.8,"text":"What happens to her, an enrolment or a payslip, is transactional data."},
 {"id":"meta","gap":0.8,"text":"And the definition of a learner is metadata."},
 {"id":"apart","gap":0.8,"text":"This series is about the first two, and the next film tells them apart."}]},
"role":{"name":"The role, called the person","lead":1.0,"tail":1.0,"vo":[
 {"id":"opens","gap":0.8,"text":"Noor, the university's data architect, opens the university's own model."},
 {"id":"learner","gap":0.8,"text":"It has a learner. A good one, with keys from three systems and a decision for every match."},
 {"id":"someone","gap":0.8,"text":"But a learner isn't someone. It's how someone relates to the university, for a while."},
 {"id":"none","gap":0.8,"text":"The model has no person. She says so, and writes it down."}]},
"apart":{"name":"Four things, kept apart","lead":0.8,"tail":1.0,"vo":[
 {"id":"draws","gap":0.8,"text":"So she draws four things apart."},
 {"id":"person","gap":0.8,"text":"The person: someone, once."},
 {"id":"roles","gap":0.8,"text":"The roles: student, tutor, customer, each with a start, an end, and an owner."},
 {"id":"contacts","gap":0.8,"text":"The contact points: an email or an address, each with a purpose, and some shared by two people."},
 {"id":"ids","gap":0.8,"text":"And the identifiers: a student number belongs to the student system, a staff number to HR."},
 {"id":"none","gap":0.8,"text":"None of them is the person."},
 {"id":"ea","gap":0.8,"text":"Enterprise architects draw it the same way: a person, a team or an organisation is an actor, assigned to one or more roles, for a time."}]},
"keeps":{"name":"Who keeps what","lead":0.8,"tail":1.0,"vo":[
 {"id":"write","gap":0.8,"text":"Then Noor and Mei write down who keeps what."},
 {"id":"roles","gap":0.8,"text":"For each role, which system creates it, and who owns it."},
 {"id":"attrs","gap":0.8,"text":"For each piece of the person, which system is trusted."},
 {"id":"legal","gap":0.8,"text":"The registrar's office keeps the legal name."},
 {"id":"own","gap":0.8,"text":"Linh keeps her own preferred name, and her personal email."},
 {"id":"hr","gap":0.8,"text":"HR keeps her work details."},
 {"id":"mei","gap":0.8,"text":"And Mei's office looks after the person: who someone is, and whether two records are one."}]},
"elsewhere":{"name":"Elsewhere","lead":0.8,"tail":1.0,"vo":[
 {"id":"every","gap":0.8,"text":"Every industry has a Linh."},
 {"id":"nurse","gap":0.8,"text":"A nurse admitted as a patient, in the same hospital."},
 {"id":"bank","gap":0.8,"text":"A bank customer who guarantees a friend's loan."},
 {"id":"home","gap":0.8,"text":"A household where the account holder moved out, and the person who stays needs the power on."},
 {"id":"same","gap":0.8,"text":"Different words, the same four things."}]},
"dama":{"name":"Named once","lead":0.8,"tail":1.0,"vo":[
 {"id":"dama","gap":0.8,"text":"The data management body of knowledge, DAMA, calls this reference and master data."},
 {"id":"four","gap":0.8,"text":"It names four ways to keep it: a registry that only links, a copy for analysis, a master that systems read back, or one place where people are created."},
 {"id":"later","gap":0.8,"text":"The series picks one later, and shows the tools that do it."}]},
"entities":{"name":"Not only people","lead":0.8,"tail":1.0,"vo":[
 {"id":"only","gap":0.8,"text":"People aren't the only master data."},
 {"id":"uni","gap":0.8,"text":"The university also has employers and partner universities, awards and units, campuses and rooms."},
 {"id":"health","gap":0.6,"text":"A hospital has patients, practitioners and wards."},
 {"id":"bank","gap":0.6,"text":"A bank, customers, accounts and the firms it trades with."},
 {"id":"utility","gap":0.6,"text":"A utility, meters, connection points and poles."},
 {"id":"shop","gap":0.8,"text":"A shop, products, suppliers and stores."},
 {"id":"which","gap":0.8,"text":"Which of them need mastering? Ask four questions."},
 {"id":"q1","gap":0.8,"text":"Is it a thing the business is about, not something that happens?"},
 {"id":"q2","gap":0.8,"text":"Is it used by more than one process?"},
 {"id":"q3","gap":0.8,"text":"Is it created or changed in more than one place, so the copies can disagree?"},
 {"id":"q4","gap":0.8,"text":"And does it matter when they do: money, safety, the law, or someone's trust?"},
 {"id":"yes","gap":0.8,"text":"Four yeses: master it."}]},
"series":{"name":"The series","lead":0.8,"tail":1.0,"vo":[
 {"id":"first","gap":0.8,"text":"Who is it? Which value wins?"},
 {"id":"come","gap":0.8,"text":"Roles that come and go, and the lists that sort them."},
 {"id":"see","gap":0.8,"text":"What each role may see. One person in many systems."},
 {"id":"keep","gap":0.8,"text":"A hub at work, and how to keep it right."}]},
"once":{"name":"Once","lead":0.8,"tail":1.0,"vo":[
 {"id":"change","gap":0.8,"text":"Linh changes her email, once."},
 {"id":"hears","gap":0.8,"text":"Every role hears."},
 {"id":"know","gap":0.8,"text":"Know the person, not just the role."}]}
};
