/* Learning Data: "Pause and think" for Who decides, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (cord, roles, asked), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "cord":{q:"Why doesn't the line stop the moment someone pulls the cord?",
    opts:[{t:"Because the supervisor has to approve every stop first."},{t:"So people aren't afraid to pull it: most problems are fixed before the job is done, and the line stops only when they can't be.",ok:true},{t:"Because only a serious accident is worth stopping the line for."}],
    why:"The line stops at the end of the job, at a fixed place, partly because people held back from pulling the cord when the whole line stopped at once. A right that people are afraid to use is a right on paper. Where you work, what makes it easy, or hard, to ask for a decision?"},
  "roles":{q:"Sam's team can change any table. Who decides what award means?",
    opts:[{t:"Sam's team, because they run the platform it lives on."},{t:"Mei, its owner. Sam's team is the custodian: it runs the platform, but doesn't decide what the data means.",ok:true},{t:"The council, because every area uses award."}],
    why:"Being able to change something isn't the right to decide what it means. The owner answers for the meaning, the steward keeps it right day to day, and the custodian runs the platform; one person can hold two of the roles, as Mei does. In your work, who can change a table you rely on, and who decides what it means?"},
  "asked":{q:"Why is every routing slip filled in from the register, and never from memory?",
    opts:[{t:"Because the register is easier to read than anyone's notes."},{t:"So it can't drift: change a name in the register, and every slip follows. Nobody has to remember who to ask.",ok:true},{t:"So the council sees every change before it's made."}],
    why:"Like the cord within reach, the slip makes the work call the person who decides, by name, at the moment it matters. When a steward changes, one change in the register reaches every request. In your work, how does a change find the person who decides?"}
  }}};
