/* Learning Data: "Pause and think" for Roles come and go, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (flags, terms, line, table), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series' labs and scenarios are its own, for all its films
   (assets/master-and-reference-data/), so no question has a "stop"; the page's .player data-labs leads to them. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "flags":{q:"Planning ran last year's census count again, and Linh was in it as a student, months before she came back. What went wrong?",
    opts:[{t:"The student system had the wrong date for her return."},{t:"Each system sends the platform only how it sees her today, written over every night, so a question about last year still gets today's answer.",ok:true},{t:"Planning counted on the wrong census date."}],
    why:"A status is true for one day. The student system knows she came back in July 2025, but the platform kept only today's word, enrolled, so every date gets today's answer. Think of a yes-or-no list you keep, such as current staff or active members. What would it say about last year?"},
  "terms":{q:"On 15 January 2026, between semesters, is Linh a tutor?",
    opts:[{t:"Yes: she has tutored every semester since 2023."},{t:"No: no contract is open that day. She's still the same person, and her next contract starts with Semester 1.",ok:true},{t:"Only if HR's system still says casual staff."}],
    why:"HR offers her work one teaching period at a time, so the tutor role starts and ends with each contract. On 15 January no contract is open, so she isn't staff; on census date, 31 March, Semester 1's contract is, so she is. Which roles where you work start and end with a term or a contract?"},
  "line":{q:"On census date, Linh has four roles open. Planning counts students who also work here. How many times does she count?",
    opts:[{t:"Three: once each as a student, a tutor and a researcher."},{t:"Once: Planning counts people, and she's one person with a student role and a work role open that day.",ok:true},{t:"Four: once for each open role, alumna included."}],
    why:"Planning's question is about people, so it counts persons, and the roles open on census date are the filter: three rows, one person. Which of your reports count roles, or rows, when they mean people?"},
  "table":{q:"Linh's Semester 1 contract began on 23 February but was entered on 6 April, before the census report was published on 14 April. Is she in Planning's census-date count as staff?",
    opts:[{t:"No: on census date, the platform didn't have her contract yet."},{t:"Yes: the contract is valid from 23 February. recorded_at says when the platform learned of it, which matters only for what was known on a given day.",ok:true},{t:"Only if HR enters it again with an earlier date."}],
    why:"A role's dates say when it was true, and recorded_at says when the platform learned of it. Asked as at 31 March, the contract counts, because it was valid that day. Asked what was known on 1 April, it wouldn't, because it wasn't recorded until 6 April. Both are fair questions, and one table answers each."}
  }}};
