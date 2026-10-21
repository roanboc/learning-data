/* Learning Data: "Pause and think" for Kept, not cleaned, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (return, entry, measures, agent), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "return":{q:"A clean-up merged two thousand duplicate records, and a year later there were eleven hundred new ones. Why?",
    opts:[{t:"The clean-up missed half of them."},{t:"Nothing changed where records are made: every intake still gave graduates who came back, and people who applied through two routes, a new number.",ok:true},{t:"Duplicates can't be prevented, only cleaned up."}],
    why:"A clean-up removes the duplicates there are, once. The way new ones were made kept running, intake after intake, and Linh's second number was one of them. Think of a folder or a list you once tidied. How long did it stay tidy?"},
  "entry":{q:"Why does the search at the application last, when the clean-up didn't?",
    opts:[{t:"It merges duplicates faster than the clean-up did."},{t:"It stops a duplicate before it's made, every time someone applies, instead of finding it later.",ok:true},{t:"It runs once a year, after each intake."}],
    why:"The search works where records are made: a clear match adds a role to someone already known, and a likely one waits in Mei's queue, so new duplicates stay under fifty an intake. Like the river's shape, it keeps most of them out, and the queue digs out the rest. Where in your work would a check at the start save a clean-up later?"},
  "measures":{q:"Each of the steward's five measures has a limit. Why?",
    opts:[{t:"So the dashboard has something to colour."},{t:"So it says when to act: past its limit, someone looks, before a backlog builds.",ok:true},{t:"So the measures never have to change."}],
    why:"A number alone only describes. With a limit agreed with its owner, it says when someone should look, the way the iron bars in the river's bed say how deep to dig. Of the five measures, which would you want to see first on a Monday morning?"},
  "agent":{q:"An agent drafted how the new visa type maps to the university's fee categories. Why does the admissions office approve it, not the agent?",
    opts:[{t:"The agent can't read the list."},{t:"The owner answers for the list: the agent proposes, with its evidence, the owner decides, and the reason is kept.",ok:true},{t:"Lists from outside never change the university's own."}],
    why:"The agent saves the drafting. The admissions office, which owns the list, checks the evidence and decides, so someone answers for every value that sorts people. Which lists in your organisation change from outside, and who would approve the change?"}
  }}};
