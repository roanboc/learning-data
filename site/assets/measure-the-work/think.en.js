/* Learning Data: "Pause and think" for Measure the work, not the people, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (read, pairs, target), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  read:{q:"June's 24 days, taken apart, show 7 of them spent waiting for access to the data. What does the team change?",
    opts:[{t:"When access is asked for: on the day a request is accepted, so it's ready when the work starts.",ok:true},{t:"How fast each person asks for access, so whoever waited longest is reminded to ask sooner.",near:true},{t:"Nothing yet, since governance promises access within five days, so the wait is outside the team."}],
    why:"Nobody was slow: access was asked for only when work started, one dataset at a time, up to five days each. Asking on the day a request is accepted took that wait from seven days to one by September. Helena's question is what slowed the work, never who. Which wait in your team's work comes from how the work is arranged?"},
  pairs:{q:"On 12 August, promises met reaches 82%, and load stands at nine pieces of work against a limit of six. How is it read?",
    opts:[{t:"As a win to celebrate, since promises met is the measure the people who use the products feel most.",near:true},{t:"As a sign the limit can rise to nine, since the team is clearly keeping up with all of its work."},{t:"Together: the promises were kept by carrying too much, so the team finishes before it starts.",ok:true}],
    why:"On its own, 82% is a number to celebrate. Beside load, it shows new work started before old work finished, and tired people make mistakes. Each pair keeps the other honest: the team finished before starting, said not now to two requests, and by December promises met reached 86% with load back at six. Which of your measures needs a partner?"},
  target:{q:"The director of digital services asks for a count of tickets closed by each person, each month. What does Helena do?",
    opts:[{t:"She sends the count with a note, so it's read with care and never used to rank anyone.",near:true},{t:"She says no to the count, and shows the team's page and what its readings changed instead.",ok:true},{t:"She agrees, and adds the hours each person worked, so the director sees the effort too."}],
    why:"The questions behind it were fair, but a count per person soon becomes a target: people split work small, pick easy tickets, stop helping each other, and hide mistakes. Most problems belong to the system, not the people in it. Helena showed the team's page and what its readings changed, and each person's growth stays in their own goals. What would you show instead?"}
  }}};
