/* Learning Data: "Pause and think" for How long, and then what, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (schedule, clock, hold), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  schedule:{q:"Why does the university write one row for each kind of record, not an end date for each record?",
    opts:[{t:"One row decides for every record of its kind, even records not made yet, before they're needed.",ok:true},{t:"Each owner then sets a record's date when it stops being used, one record at a time, as needed.",near:true},{t:"The platform can then delete every kind of record on the same day each year, all at once."}],
    why:"A row for each kind of record decides once, before the records exist, as Washington's schedules did in 1943. Setting each record's date when it stops being used is deciding pile by pile again, the way the schedule replaced."},
  clock:{q:"Linh's first contract ended in June 2023, her last in November 2026. Why are their pay records kept until different dates?",
    opts:[{t:"Her newer pay records hold more of her details, so the schedule keeps them a few years longer."},{t:"Each pay record is kept 7 years from the day it was written, so the newer ones stay longer.",near:true},{t:"Each contract's pay records are kept 7 years from the end of that contract, not a shared date.",ok:true}],
    why:"The clock starts at an event, the end of each contract: her first contract's records are kept until 23 June 2030, her last's until 20 November 2033. Counting from the day each record was written is another clock, not the schedule's."},
  hold:{q:"A former tutor's 2019 pay records are due to go in January, but her pay claim isn't settled. What happens to them?",
    opts:[{t:"A hold keeps them for good, since a settled claim could still come back one day.",near:true},{t:"A hold keeps them until her claim is settled; then they go at the next clean-up.",ok:true},{t:"They go in January as planned: the schedule can't change its dates for one person."}],
    why:"The legal office places a hold that names her 2019 records, its reason, who placed it and who lifts it. The clean-up skips those records, and only those. Once the claim is settled, the hold is lifted and they go: a hold lasts as long as its reason, never just in case."}
  }}};
