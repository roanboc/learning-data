/* Learning Data: "Pause and think" for Everyone at the table, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (map, page, june), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  map:{q:"Staff and students rarely ask, so they sit low on the grid. What does Helena do about them?",
    opts:[{t:"She leaves them off the list for now, as the grid puts them where a plan needs the least of anyone's time."},{t:"She sends them the monthly page, so they hear what the move means for them, though nobody asks them anything.",near:true},{t:"She asks them too, through their representatives, what they want from data: it's their data the move carries.",ok:true}],
    why:"Low on the grid isn't off the list. A power and interest grid shows how much each one can shape a plan, and how much it touches them; it doesn't say who to leave out. Staff and students rarely ask, but it's their data, so Helena asks them too, through their representatives, and their words go on the map beside everyone else's. Who on your plan's list never asks?"},
  page:{q:"Everyone gets the same page on the first Monday of every month. Why the same page for everyone?",
    opts:[{t:"So everyone reads the same story, and nobody hears their news second-hand, in someone else's version of it.",ok:true},{t:"So everyone hears the good news at once; bad news waits for the next page, once the team has put it right.",near:true},{t:"So the deputy vice-chancellor can approve every line on it before it goes out to the other thirteen."}],
    why:"Fourteen stakeholders told fourteen ways soon hear their news second-hand, in versions that don't match. One page, the same for everyone: where the plan is, the measures, the top three risks, the decisions needed, and a line for each of the fourteen. Bad news goes on it too, as soon as it's known, which is why the good news is believed. What would your page say this month?"},
  june:{q:"HR's reports were due to move in July. Why does the plan move them to August?",
    opts:[{t:"The team has too much work in July, so it moves the reports HR uses most to a quieter month for the team."},{t:"July is when payroll can least afford a surprise: a fact about the work, not a preference, so the plan moves.",ok:true},{t:"HR asked for August, and HR is high on the grid, so what HR would rather have decides when its reports move.",near:true}],
    why:"Ingrid shows Jun payroll's year: the financial year ends on 30 June, and payroll's last returns go out by mid-July. That's a real constraint, a fact about the work, not a preference, and not a matter of who is loudest or highest on the grid. So the plan moves round it, as the roof rose over the elms, and the July page tells everyone why. Which dates in your plan fall in someone else's busiest weeks?"}
  }}};
