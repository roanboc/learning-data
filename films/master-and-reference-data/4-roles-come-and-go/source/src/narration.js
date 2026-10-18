// Master and reference data · Roles come and go. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"rome":{"name":"A ladder of offices","lead":1.6,"tail":1.0,"vo":[
 {"id":"ladder","gap":0.8,"text":"In the Roman Republic, an ambitious citizen climbed a ladder of public offices, each held for one year."},
 {"id":"cato","gap":0.8,"text":"Marcus Porcius Cato was quaestor, then aedile, then praetor, and in 195 BC, consul."},
 {"id":"roles","gap":0.8,"text":"Each office had its year, and his name: one man, a sequence of roles, each with a start and an end."},
 {"id":"census","gap":0.8,"text":"His last office was censor. Censors wrote down every citizen, their age and what they owned: the census."}]},
"census":{"name":"Census date","lead":1.0,"tail":1.0,"vo":[
 {"id":"date","gap":0.8,"text":"At the university, census date is the 31st of March: the day it counts who's enrolled, for its official numbers.","say":"At the university, census date is the thirty-first of March: the day it counts who's enrolled, for its official numbers."},
 {"id":"planning","gap":0.8,"text":"Planning has a question for that day. How many of our students also work here?"},
 {"id":"alumni","gap":0.8,"text":"And the alumni office, which invited Linh back for a master's she was already doing, asks: which of our alumni are studying again?"}]},
"flags":{"name":"True for a day","lead":0.8,"tail":1.0,"vo":[
 {"id":"night","gap":0.8,"text":"Each night, every system tells the platform how it sees Linh that day."},
 {"id":"says","gap":0.8,"text":"The student system says enrolled. HR says casual staff. The research office, project member. The alumni office, graduate."},
 {"id":"over","gap":0.8,"text":"Each answer is true for a day, and written over the next."},
 {"id":"again","gap":0.8,"text":"So when Planning asks again about last year's census date, to compare, every answer still says today."},
 {"id":"wrong","gap":0.8,"text":"Linh counts as a student in March 2025, four months before she came back.","say":"Linh counts as a student in March twenty twenty-five, four months before she came back."}]},
"bands":{"name":"A start and an end","lead":0.8,"tail":1.0,"vo":[
 {"id":"know","gap":0.8,"text":"Yet each office knows when its role starts and ends."},
 {"id":"shape","gap":0.8,"text":"So Noor and Mei give every role the same shape: the person, the kind of role, the office that owns it, when it starts, and when it ends."},
 {"id":"under","gap":0.8,"text":"Linh's roles become bands, under her."},
 {"id":"first","gap":0.8,"text":"Applicant, then student, from 2019 to 2022. Then alumna.","say":"Applicant, then student, from twenty nineteen to twenty twenty-two. Then alumna."},
 {"id":"tutor","gap":0.8,"text":"Casual tutor, from 2023.","say":"Casual tutor, from twenty twenty-three."},
 {"id":"again","gap":0.8,"text":"Applicant again in 2025, and student again, from July.","say":"Applicant again in twenty twenty-five, and student again, from July."},
 {"id":"research","gap":0.8,"text":"And researcher, from March to December this year."},
 {"id":"stays","gap":0.8,"text":"Some follow each other, and some run at once. The person under them stays the same."}]},
"terms":{"name":"A contract each term","lead":0.8,"tail":1.0,"vo":[
 {"id":"drew","gap":0.8,"text":"So far, her tutoring is one band, since 2023.","say":"So far, her tutoring is one band, since twenty twenty-three."},
 {"id":"hr","gap":0.8,"text":"HR sees it differently: it offers her work one teaching period at a time, a new contract each semester, for one unit."},
 {"id":"every","gap":0.8,"text":"So the tutor role starts and ends every semester."},
 {"id":"jan","gap":0.8,"text":"In January, between contracts, she isn't staff. On census date, she is."}]},
"line":{"name":"One line, one date","lead":0.8,"tail":1.0,"vo":[
 {"id":"draw","gap":0.8,"text":"Now Planning draws one line across her bands, at census date."},
 {"id":"open","gap":0.8,"text":"Student, tutor and researcher are open, and so is alumna."},
 {"id":"once","gap":0.8,"text":"So Linh counts once, as a student who works here: one person with three roles, not three people."},
 {"id":"back","gap":0.8,"text":"Move the line back a year, and she's a tutor and an alumna, not a student."},
 {"id":"kept","gap":0.8,"text":"Last year's number stays as it was."},
 {"id":"filter","gap":0.8,"text":"And the alumni office's question becomes a filter: alumni with an open student role."},
 {"id":"since","gap":0.8,"text":"Linh is back, since July 2025.","say":"Linh is back, since July twenty twenty-five."}]},
"relates":{"name":"What a role is for","lead":0.8,"tail":1.0,"vo":[
 {"id":"for","gap":0.8,"text":"Each role also says what it relates to."},
 {"id":"items","gap":0.8,"text":"Her student role, a master's in health informatics. Each tutor contract, one unit in one semester. Her researcher role, one project."},
 {"id":"people","gap":0.8,"text":"People relate to each other, too. On the project, Ana Ruiz supervises Linh."},
 {"id":"ends","gap":0.8,"text":"That relationship has its own dates, and ends with the project. Both people stay."}]},
"elsewhere":{"name":"Elsewhere","lead":0.8,"tail":1.0,"vo":[
 {"id":"energy","gap":0.8,"text":"An energy company has the same problem."},
 {"id":"moves","gap":0.8,"text":"The account holder moves out in June, and his role ends that day."},
 {"id":"need","gap":0.8,"text":"The person who stays depends on life support at home. Her need goes on, and so does the risk."},
 {"id":"kept","gap":0.8,"text":"Kept on his account, the need would close with it. Kept on her, it stays."}]},
"table":{"name":"One table, any date","lead":0.8,"tail":1.0,"vo":[
 {"id":"row","gap":0.8,"text":"On the platform, it's one table, with a row for each role."},
 {"id":"cols","gap":0.8,"text":"Each row holds the person, the role type, its owner, what it relates to, and the dates it's valid from and to."},
 {"id":"tests","gap":0.8,"text":"Jun builds it in dbt, with two tests. A role can't end before it starts, and every role belongs to a person."},
 {"id":"asat","gap":0.8,"text":"Then any question can take a date: census date, last year, or today."},
 {"id":"late","gap":0.8,"text":"Each row also keeps when it was recorded, so a contract entered late still counts from the day it began."}]},
"stays":{"name":"The person stays","lead":0.8,"tail":1.0,"vo":[
 {"id":"today","gap":0.8,"text":"Today, Linh is a student, a tutor, a researcher and an alumna."},
 {"id":"next","gap":0.8,"text":"In December, the project ends. One day, she'll graduate again."},
 {"id":"come","gap":0.8,"text":"Roles come and go."},
 {"id":"last","gap":0.8,"text":"A role has a start and an end. The person stays."}]}
};
