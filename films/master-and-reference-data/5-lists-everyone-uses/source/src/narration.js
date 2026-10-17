// Master and reference data · Lists everyone uses. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"codes":{"name":"A code outlives its reason","lead":1.6,"tail":1.0,"vo":[
 {"id":"three","gap":0.8,"text":"Airlines know each airport by three letters."},
 {"id":"yyz","gap":0.8,"text":"Toronto's main airport is YYZ, after the old station code of Malton, where it stands."},
 {"id":"sgn","gap":0.8,"text":"Ho Chi Minh City's is SGN. The city took that name in 1976, and its code still says Saigon.","say":"Ho Chi Minh City's is SGN. The city took that name in nineteen seventy-six, and its code still says Saigon."},
 {"id":"outlives","gap":0.8,"text":"A code outlives its reason, because changing it costs everyone who uses it."}]},
"names":{"name":"One role, three names","lead":1.0,"tail":1.0,"vo":[
 {"id":"like","gap":0.8,"text":"A university runs on lists like these."},
 {"id":"linh","gap":0.8,"text":"Linh studies here, and tutors a first-year unit."},
 {"id":"three","gap":0.8,"text":"HR calls her a Casual Academic. Payroll calls her CAS. The learning platform calls her a tutor."},
 {"id":"match","gap":0.8,"text":"Three names for one role, and nothing written down says they match."},
 {"id":"sheet","gap":0.8,"text":"HR's own list of roles lives in a spreadsheet, attached to an email."},
 {"id":"kinds","gap":0.8,"text":"And no one has written down which kinds of identifier the university issues."}]},
"typed":{"name":"Typed again","lead":0.8,"tail":1.0,"vo":[
 {"id":"status","gap":0.8,"text":"Her status is ENR in the student system, and active on the learning platform."},
 {"id":"map","gap":0.8,"text":"One file maps both to studying."},
 {"id":"again","gap":0.8,"text":"Then two tests type the list of statuses again, by hand."},
 {"id":"country","gap":0.8,"text":"Her country of birth is Vietnam in HR, Viet Nam in the student system, and VN at the research office."},
 {"id":"count","gap":0.8,"text":"So a count of people by country lists her country three times."}]},
"kinds":{"name":"The lists that sort","lead":0.8,"tail":1.0,"vo":[
 {"id":"these","gap":0.8,"text":"These are reference data: short lists that sort and describe everything else."},
 {"id":"own","gap":0.8,"text":"Some are the university's own, like role types. Others come from outside, like countries, or airport codes."},
 {"id":"code","gap":0.8,"text":"Each value has a code that systems store, and a label that people read."}]},
"home":{"name":"A home for each list","lead":0.8,"tail":1.0,"vo":[
 {"id":"jun","gap":0.8,"text":"Jun, the analytics engineer, gives each list one home."},
 {"id":"five","gap":0.8,"text":"Role types, identifier types, relationship types, consent purposes, and countries."},
 {"id":"table","gap":0.8,"text":"Each is a table: every value with its code and label, who owns it, and the date it applies from."},
 {"id":"owners","gap":0.8,"text":"HR owns tutor, and the registrar's office owns student."},
 {"id":"map","gap":0.8,"text":"Beside it, each system's own names are mapped: Casual Academic, CAS and tutor all mean tutor."}]},
"read":{"name":"Read, not typed","lead":0.8,"tail":1.0,"vo":[
 {"id":"tests","gap":0.8,"text":"Now the tests read their allowed values from the list, instead of typing them."},
 {"id":"once","gap":0.8,"text":"Change the list once, and every test that reads it follows."},
 {"id":"lineage","gap":0.8,"text":"On the platform, each list is one table, and its lineage shows the tables and reports that read it."}]},
"change":{"name":"A change, with a date","lead":0.8,"tail":1.0,"vo":[
 {"id":"next","gap":0.8,"text":"Next year, HR will call the role Sessional Academic."},
 {"id":"pr","gap":0.8,"text":"The change is a pull request, and HR, as the list's owner, approves it."},
 {"id":"from","gap":0.8,"text":"The new name applies from the first of January."},
 {"id":"ended","gap":0.8,"text":"The old one isn't deleted. It's ended, because Linh's past contracts still use it."}]},
"outside":{"name":"From outside","lead":0.8,"tail":1.0,"vo":[
 {"id":"else","gap":0.8,"text":"Some lists belong to someone else."},
 {"id":"iso","gap":0.8,"text":"Countries come from the international standard, ISO 3166, loaded on a schedule.","say":"Countries come from the international standard, eye-so thirty-one sixty-six, loaded on a schedule."},
 {"id":"glossary","gap":0.8,"text":"Like the project's glossary, the list is copied, never typed again."},
 {"id":"once","gap":0.8,"text":"Viet Nam appears once, with one code: VN."},
 {"id":"count","gap":0.8,"text":"And the count by country lists her country once."}]},
"people":{"name":"Lists about people","lead":0.8,"tail":1.0,"vo":[
 {"id":"some","gap":0.8,"text":"Some lists describe people, like titles or gender."},
 {"id":"short","gap":0.8,"text":"Those stay short and inclusive, and are asked for only with a purpose."},
 {"id":"title","gap":0.8,"text":"A title can tell whether someone is married. If it isn't needed, it isn't asked."}]},
"elsewhere":{"name":"Elsewhere","lead":0.8,"tail":1.0,"vo":[
 {"id":"every","gap":0.8,"text":"Every industry runs on lists like these."},
 {"id":"bank","gap":0.8,"text":"A bank's customer types decide which checks each customer goes through."},
 {"id":"hosp","gap":0.8,"text":"A hospital's relationship types decide who may be told about a patient."},
 {"id":"wrong","gap":0.8,"text":"Get a list wrong, and the wrong thing happens to a real person."}]},
"keeps":{"name":"Who keeps it","lead":0.8,"tail":1.0,"vo":[
 {"id":"linh","gap":0.8,"text":"Now Linh's role, her status and her country each come from one list."},
 {"id":"airport","gap":0.8,"text":"Like an airport code, a value can outlive its reason. But now everyone knows who keeps it, and from when it applies."},
 {"id":"line","gap":0.8,"text":"A list has an owner, a date and one home."}]}
};
