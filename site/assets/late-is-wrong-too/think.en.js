/* Learning Data: "Pause and think" for Late is wrong too, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (green, fresh, stop), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  green:{q:"The list was built from the night before's file, and every check passed. Why did none of them catch the 23 missing graduates?",
    opts:[{t:"The night's file held errors that none of the list's checks were written to test."},{t:"Each check read only what had arrived, and the boards' lists were a day old too.",ok:true},{t:"The boards' lists were wrong that night, so the check agreed with a wrong list.",near:true}],
    why:"The file that came was Wednesday's, and every row in it was right, so every check that reads rows passed. The boards' approved lists come in the same night's transfer, so they were a day old too, and the list agreed with them: not wrong, only late. No check can see a row that hasn't arrived; only the data's age can say it's late. Which of your tables would pass every check on yesterday's data?"},
  fresh:{q:"One list, three clocks. Why is the level a day old at most, at the send?",
    opts:[{t:"A nightly file can't be fresher than a day, so the platform sets the level.",near:true},{t:"Seating sets it: the hall is counted a week before, from a list a few days old."},{t:"The strictest use sets it: the certificates need that night's files at the send.",ok:true}],
    why:"The platform can see that a table is late; only the people who use the list can say when late is too late. Seating the Great Hall works from a list a few days old, and Planning's count is fine weeks later, but a certificate needs that night's files when the list goes to the printer. The strictest use sets the level, and a nightly file meets it; for fresher data, Hot, warm, cold shows how it moves. How fresh does your strictest use need your data?"},
  stop:{q:"When the check fails at night, why does the night's update still build the list?",
    opts:[{t:"So the list exists and says its age, while the send waits for that night's files.",ok:true},{t:"So the list still goes to the printer on time, a day old but with its age on it.",near:true},{t:"Because a failed task in a job can't stop the tasks that come after it."}],
    why:"The night's update runs the check first, and builds the list once it's done, whatever it said: the list is there, saying how old it is, and Sam and Malia hear at once. That's the warning. What can't be undone is the send to the printer, so the send's job runs the same check, and sends only if it passes; if not, the list waits, and Malia is told why. In your own pipelines, which step can't be undone?"}
  }}};
