/* Learning Data: "Pause and think" for Show the least, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (oneway, undo, totals), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  oneway:{q:"A year of birth can't be turned back into a date. Why does it still count as indirect?",
    opts:[{t:"Because whoever keeps the key can turn 1987 back into 14 May 1987.",near:true},{t:"Because in a small course, one year of birth may fit only one learner.",ok:true},{t:"Because the agreement names it, and every column it names is indirect."}],
    why:"Generalising can't be undone: the day and month are gone. But hidden isn't anonymous. Beside the course, a year of birth can still single out one learner in a small class, and anyone who knows them knows the row. So it keeps its class, indirect, and stays behind the agreement. Which columns in your data say nothing alone, but point to one person together?"},
  undo:{q:"The study's learner code is a keyed hash. Why is its data still personal?",
    opts:[{t:"Because the registrar's office, which keeps the key, can still find whose code it is.",ok:true},{t:"Because anyone with the registrar's list can scramble the numbers and match the codes.",near:true},{t:"Because the code changes every year, so a learner's codes can be lined up year by year."}],
    why:"A keyed hash can be undone, but only with the key: the registrar's office can make the code again from any student number and see whose it is. Without the key, the registrar's list matches nothing, which is why the study gets the keyed code and not the plain scramble. A way that can be undone keeps the data personal, so the study stays behind its agreement. Where in your data is a code one key away from a name?"},
  totals:{q:"Midwifery's 4 reads \"fewer than 10\". Why is Health sciences' 17 hidden too?",
    opts:[{t:"Because hiding it protects the 17 learners in Health sciences who left.",near:true},{t:"Because Health sciences is the largest course, so its count goes first."},{t:"Because the faculty's 80, less the other counts, would give the 4 back.",ok:true}],
    why:"A count under 10 is hidden so that no one can tell who left a small class. But the faculty's total is published too: 80, less 38, 21 and 17, gives the 4 back. Hiding one more count, the next smallest, leaves two unknowns that add up to 21, so the 4 can't be worked out. Where your data publishes totals, could a hidden count come back from the rest?"}
  }}};
