/* Learning Data: "Pause and think" for From gaps to a roadmap, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (gaps, order, stages), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  gaps:{q:"Noor sets the current state beside the target, layer by layer. What makes something a gap?",
    opts:[{t:"Whatever people asked the team for most often this year, as counted in the tracker."},{t:"Any place where today and the target differ, in any layer, from strategy to technology.",ok:true},{t:"Any place where today and the target differ, wherever a system has to be changed.",near:true}],
    why:"A gap is wherever the two drawings differ, in any layer. Some are systems, like the old warehouse's servers, still running; many aren't: eleven ways to ask, three copies of the staff list, about 40 people working alone. A list of systems to change would miss them. Which of your gaps isn't about a system?"},
  order:{q:"Helena puts the six packages in order. Why does the front door come first?",
    opts:[{t:"Because the data manager owns it, and the person who leads the plan should go first."},{t:"Because it's the cheapest package, so it shows quick progress before the costly ones.",near:true},{t:"Because it unlocks others: once every request comes in one way, one list can follow.",ok:true}],
    why:"The packages are ordered by what each unlocks, and what it's worth, never by who asks loudest. A quick, cheap win can help, but that isn't why the door comes first: one way in makes one list possible, and lets the days from ask to first use be counted. Which of your packages unlocks the most others?"},
  stages:{q:"Helena's first draft moved half the old reports by September. Why does the whole move go into stage two?",
    opts:[{t:"Because half a move is no use on its own: reports in two places, the licence still paid.",ok:true},{t:"Because the 21 reports can't all move by September, and a stage holds only what fits.",near:true},{t:"Because the council hasn't agreed to the money, so nothing costly can start before 2028."}],
    why:"Each stage must pass one test: if the money stopped after it, would people still have something they use? Half a move fails it: reports in two places, and the licence still paid. Dates matter, but the test comes first, so stage one keeps what people can use at once. Which stage of your plan would leave people with nothing, if the money stopped?"}
  }}};
