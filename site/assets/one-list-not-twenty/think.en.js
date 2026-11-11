/* Learning Data: "Pause and think" for One list, not twenty, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (order, six, when), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  order:{q:"Anil's request scores 7 and goes near the top; the dashboard scores 1 and waits. What put Anil's first?",
    opts:[{t:"The Faculty of Health is one of the university's biggest, so a request from it counts for more than one school's."},{t:"Waiting costs a lot, as his copy of staff records grows riskier, and the work is small: a high cost for little effort.",ok:true},{t:"Waiting costs a lot, as his copy of staff records grows riskier, so it goes first, whatever effort the work takes.",near:true}],
    why:"Helena's team weighs what waiting costs: value, urgency and the risk while a request waits, which Donald Reinertsen calls the cost of delay. Divided by the effort, it puts small, urgent, valuable work first: Anil's scores 7 ÷ 1, the dashboard 3 ÷ 3, and it waits with a note saying why and when. Never by who asks, or how loudly. Which request on your list would move if you weighed it this way?"},
  six:{q:"The team keeps at most six pieces of work in progress. Why not start every urgent request the day it arrives?",
    opts:[{t:"Urgent requests often matter less than they seem, so the team leaves each one a week to see if it's still needed."},{t:"With fewer things started, each person is less busy, so they can take more care over every piece of their work.",near:true},{t:"With fewer things started, each one finishes sooner, so everyone gets an answer sooner, the urgent requests too.",ok:true}],
    why:"Starting is easy; finishing is what gives people their answers. With six pieces of work in progress at most, three, two and one, as the team's time is split, each finishes sooner, and when one is done the top of the list moves in: finish, then start. Kanban calls it a limit on work in progress. How many things has your team started and not finished?"},
  when:{q:"Clara's forecast model hears not now. What makes that an answer she can plan around?",
    opts:[{t:"A reason and a date: the timetable's data can't move, her model is refreshed by August, the new one by October.",ok:true},{t:"A reason she can accept: the timetable's data can't move, so the team will come back to her once that is done.",near:true},{t:"A promise that her request goes to the top of the list next time, so she won't have to wait twice for the same thing."}],
    why:"A no without a when leaves Clara guessing, and asking again in two other places. Hers comes with both: the reason, the timetable's date can't move, and the dates, her current model refreshed by 27 August and the new one by 29 October. Emergency departments do the same with triage: every category has a longest wait. Which request of yours is waiting without a date?"}
  }}};
