/* Learning Data: "Pause and think" for Who is it, really?, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (trust, role, attacker), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The module's labs come later, as one set, so no question
   has a "stop" yet, and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  trust:{q:"Why does the platform trust no request for where it comes from, even inside its own network?",
    opts:[{t:"The wall round the network has been taken down, so there's no inside left to trust.",near:true},{t:"A stolen password works as well inside the wall as out, so where proves nothing.",ok:true},{t:"Requests from inside are checked later, once the night's work is done and quiet."}],
    why:"A stolen password works as well inside the wall as out, so where a request comes from proves nothing. Each request says who it is, proves it, and gets the least it needs. The wall needn't come down; it just stops being the proof. Which of your systems still trust whatever is inside the network?"},
  role:{q:"Nine of the 41 people who could read the whole learner table had moved jobs. What stops that next time?",
    opts:[{t:"Rights go to a role's group: leave the group, and its rights go with you.",ok:true},{t:"Each person's rights get an end date, so they lapse a year after they're given.",near:true},{t:"Sam's team hides the table, and Mei sends the records to whoever asks."}],
    why:"Rights go to a role, never a person: each role is a group, and joining or leaving it gives or takes its rights, as the directory follows HR's records. An end date on each person's rights still leaves rights on people, given by name, which is how the 41 came about. Where are rights given by name in your work?"},
  attacker:{q:"At the camp, Jin Bi's two halves matched. Why was he still right to doubt?",
    opts:[{t:"Generals were told to doubt every order, even one that came with the right half."},{t:"The halves might be forged, so a match could never be trusted on its own.",near:true},{t:"A match proves someone holds the half, not who they are, or that the king sent them.",ok:true}],
    why:"The half was the king's own, taken from his rooms, so the match was real. It proved only that someone held the half. So the platform keeps Jin Bi's doubt: who is it, from where, on which device, asking for what, and is that usual? And each identity gets the least it needs, since a proof can be stolen. What could a copy of your team's token do?"}
  }}};
