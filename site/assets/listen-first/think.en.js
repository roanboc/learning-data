/* Learning Data: "Pause and think" for Listen first, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (ask, count, layers), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  ask:{q:"Helena asks all 31 people the same three questions. Why the same three each time?",
    opts:[{t:"So each conversation stays short, and all 31 of them fit into her first six weeks."},{t:"So their answers can be laid side by side, and patterns show that no one talk would.",ok:true},{t:"So their answers can be laid side by side, and she sees which of the 31 got it wrong.",near:true}],
    why:"The same questions, asked of everyone, give answers she can lay side by side. One person's slow request is a story; eleven ways to ask, seen across 31 answers, is a pattern. Nobody is wrong: each of them is right about what they see. What would you ask everyone you work with?"},
  count:{q:"People told Helena that requests were slow. Why does she count from the tracker too?",
    opts:[{t:"People show where it hurts; the tracker shows how much: 41 working days, on average, to first use.",ok:true},{t:"The tracker shows where it hurts; people show how much, since they know how long they waited.",near:true},{t:"People's answers can't be trusted, so only the tracker's numbers go into the current state."}],
    why:"She needs both. People show where it hurts, in their own words; the systems show how much: 41 working days from the ask to first use, and 17 reports nobody opened in a year. Neither alone gives the current state. What does one of your systems count that nobody has looked at?"},
  layers:{q:"Ingrid said: \"Our staff list is right. It's the copies.\" Where do the three copies go in the current state?",
    opts:[{t:"In the application layer, since each copy of the staff list sits in one of the university's systems.",near:true},{t:"In the technology layer, since the copies are kept on the university's own servers and in the cloud."},{t:"In the information layer, which says what each piece of data is, where it's born and where it's copied.",ok:true}],
    why:"The information layer says what the data is about, where each piece is born, and where it's copied: staff are born in HR's system, then copied twice. The systems that hold the copies sit in the application layer, beside it. That's why Helena gives information a layer of its own: it's where data's own problems show. Which of your data lives in more than one copy?"}
  }}};
