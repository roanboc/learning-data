/* Learning Data: "Pause and think" for Less, on purpose, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (use, stop, time), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  use:{q:"For each thing on the wall, the team asks who uses it, and for what. Why ask that before stopping anything?",
    opts:[{t:"So the team can show the data council how busy it is, and make the case for two more people."},{t:"So each cut comes from what people really use, and nobody loses a thing they still need.",ok:true},{t:"So each cut comes from what the team itself uses, and nobody keeps a thing it doesn't need.",near:true}],
    why:"The answer comes from the people who use each thing: the logs for the reports (21 read by about 260 people, 17 by nobody), and the readers and the people who asked. A cut made from the team's own view could stop what someone else still needs. What on your team's wall has nobody you could name who uses it?"},
  stop:{q:"On Monday 31 May, the 17 reports are switched off, not deleted. Why switch them off first?",
    opts:[{t:"So their last readers can keep opening them, until the old warehouse closes in December.",near:true},{t:"Deleting a report needs the data council's approval, and the council meets once a month."},{t:"So any of them can come back within a day, until the old warehouse closes in December.",ok:true}],
    why:"Switched off, nobody can open them, so the one reader who still needed last year's figures got a copy first. But any of the 17 can be switched back on within a day, until December: every cut can be undone, so nobody has to fear it. Switch it off, wait, then delete. What could you switch off this month, and still bring back?"},
  time:{q:"Each person now has about five hours a week back. What keeps that time from filling up again?",
    opts:[{t:"One rule: anything new needs a reader, a reason and an owner; and each quarter, everything goes back on the wall.",ok:true},{t:"One rule: anything new needs an owner and a reason; and each quarter, everything goes back on the wall.",near:true},{t:"The five hours are booked as focus time in every calendar, so no new meeting can be put in them."}],
    why:"Each thing on the wall was added for a good reason, and still it piled up: what the 17 reports lacked was a reader. So the rule asks for all three: someone who will use it, why, and who looks after it. And at each quarterly review, everything goes back on the wall, so what loses its readers can stop again. Which of your team's new things this year has a reader you could name?"}
  }}};
