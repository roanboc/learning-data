/* Learning Data: "Pause and think" for More than a junior, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (more, lose, asked), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "more":{q:"The agent read 33 tables in a minute. Why does that make it more dangerous, not only more useful?",
    opts:[{t:"Because its pace works both ways: given free rein, it could change every table the wrong way as fast as the right one.",ok:true},{t:"It doesn't: the faster it reads, the sooner a person sees its mistakes, so the project is safer."},{t:"Because reading that fast, it skims, so it makes more mistakes per table than a careful junior would make.",near:true}],
    why:"A junior's slow pace keeps their mistakes small. The agent's doesn't, so something else must limit it: its rights. Where you work, what could an agent change in a minute if nothing stopped it?"},
  "lose":{q:"A junior would have asked around before deleting three tables. Why didn't the agent, and what kept the change safe?",
    opts:[{t:"It was careless, as new staff often are, and Jun happened to notice the yearly table before the change went in."},{t:"It has no career and nothing to lose, so it didn't ask. Jun's review of every change kept it safe, since the agent could delete tables in production.",near:true},{t:"It has no career and nothing to lose, so nothing pushed it to ask. Its rights kept the change a draft in a sandbox, until a person found the yearly table.",ok:true}],
    why:"The agent isn't careless; it has nothing to lose. So its caution comes from its rights: it reads, writes only drafts in a sandbox, and a person reviews before a second person approves. Where you work, which table is read only once a year?"},
  "asked":{q:"Which is the better way to check the agent's count: \"It's 4,867, isn't it?\" or \"How many awards this year? Show the query.\"?",
    opts:[{t:"The first, as long as you also ask it to show the query behind its answer.",near:true},{t:"The second: it keeps the answer out of the question, and asks for the evidence.",ok:true},{t:"Either: the agent gives the same answer both ways, so pick the quicker one."}],
    why:"Like the people round Hans, a question can give the answer away: models lean towards an answer we hint at, and their reasoning rarely says so. Ask without the answer, look at how it got there, and check against a count it didn't make. Where you work, how do you ask for a number you already expect?"}
  }}};
