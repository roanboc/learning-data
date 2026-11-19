/* Learning Data: "Pause and think" for The map behind the sketch, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (two, knows, kept, cross), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). A "stop" is this film's playground in the series' pack, which
   teaches the same idea; the page's .player data-labs says where it is. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "two":{q:"The court gave households and fields a register each. What did that give it that one register of everything wouldn't?",
    opts:[{t:"A shorter book for each county, so the clerks could copy it out faster each year."},{t:"One job for each register: who held a field settled in one place, what a family owed in the other.",ok:true},{t:"Two counts of every household, one from each register, to check against each other.",near:true}],
    why:"Each register had one job, and only one place settled each question: a dispute over a field went to the land register, and a family's tax and work came from the household register. Two books that both said who held a field would give two answers."},
  "knows":{stop:"place",q:"The student domain is Mei's. Jun changes how the enrolment model is built, and nothing it means changes. What's Mei's part?",
    opts:[{t:"She reviews Jun's pull request, since every change to her domain's data needs her approval.",near:true},{t:"None, unless what a word means changes: she decides meaning and what good data looks like.",ok:true},{t:"She builds the change herself, since the owner of a domain answers for all of its data."}],
    why:"An owner decides what the words mean, and what good data looks like, and builds nothing. The data team builds the change and reviews the code; Mei is told what it touches, and decides only when a meaning changes."},
  "kept":{q:"The platform's copy and the student system disagree on whether an enrolment was withdrawn. Where is it put right?",
    opts:[{t:"In the platform's copy, since that's the table the dashboards and reports read from.",near:true},{t:"In both at once, by hand, so the dashboards and the student system agree from today."},{t:"In the student system, where it was first written; the copy follows on its next load.",ok:true}],
    why:"The student system is the enrolment's system of record: when the two disagree, the record wins. A fix made in the copy is lost at its next load, and the record stays wrong for everyone else who reads it."},
  "cross":{stop:"place",q:"Planning needs enrolments for its census report. Crossing the two maps, what is Planning to enrolments?",
    opts:[{t:"A reader: learning and teaching creates them, and Planning reads them as it needs.",ok:true},{t:"A second creator: it writes its own enrolments into its records, counted on census date.",near:true},{t:"The owner: whoever counts a thing for government decides what that thing means."}],
    why:"One creator for each thing, and as many readers as need it. Learning and teaching creates enrolments, in the student system; Planning reads them on its census date. A second creator would mean two enrolments for one student, and two counts."}
  }}};
