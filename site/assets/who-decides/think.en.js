/* Learning Data: "Pause and think" for Who decides, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (cord, roles, asked), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series' labs and scenarios are its own, for all its films
   (assets/data-governance/), so no question has a "stop"; the page's .player data-labs leads to them. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "cord":{q:"Why doesn't the line stop the moment someone pulls the cord?",
    opts:[{t:"Because a stopped line costs too much, so only a serious accident is worth stopping it for."},{t:"So the supervisor can judge each pull first: the line stops only for problems the supervisor agrees are serious.",near:true},{t:"So people aren't afraid to pull it: most problems are fixed before the job is done, and the line stops only when they can't be.",ok:true}],
    why:"The line stops at the end of the job, at a fixed place, partly because people held back from pulling the cord when the whole line stopped at once. A right that people are afraid to use is a right on paper. Where you work, what makes it easy, or hard, to ask for a decision?"},
  "roles":{q:"Sam's team can change any table. Who decides what award means?",
    opts:[{t:"Mei, its owner. Sam's team is the custodian: it runs the platform, but doesn't decide what the data means.",ok:true},{t:"Sam's team, as custodian, after asking Mei: whoever can change the table writes what it means.",near:true},{t:"The council, because every area of the university uses the word award."}],
    why:"Being able to change something isn't the right to decide what it means. The owner answers for the meaning, the steward keeps it right day to day, and the custodian runs the platform; one person can hold two of the roles, as Mei does. In your work, who can change a table you rely on, and who decides what it means?"},
  "asked":{q:"Why is every routing slip filled in from the register, and never from memory?",
    opts:[{t:"So the council sees every change to who decides what before any slip is filled in."},{t:"So it can't drift: change a name in the register, and every slip follows. Nobody has to remember who to ask.",ok:true},{t:"So it's quicker: the register lists everyone, and each slip is copied from it once, when it's first made.",near:true}],
    why:"Like the cord within reach, the slip makes the work call the person who decides, by name, at the moment it matters. When a steward changes, one change in the register reaches every request. In your work, how does a change find the person who decides?"}
  }}};
