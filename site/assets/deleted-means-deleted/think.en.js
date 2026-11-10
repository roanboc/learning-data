/* Learning Data: "Pause and think" for Deleted means deleted, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (receipt, source, copies, logs), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  receipt:{q:"On 26 November, a query for the list as it was on the 24th still finds Linh. Why?",
    opts:[{t:"The purge only runs on the eighth night, so her row is still in the current files.",near:true},{t:"The platform keeps the table's old files for seven days, and they still hold her row.",ok:true},{t:"The query reads the mailing tool's copy, which keeps her until its own backups go."},{t:"Deletes wait a week in a queue before the job runs them, so nothing has changed yet."}],
    why:"The job deleted her row and purged it at once, on 25 November: the current files no longer hold her. But the old files are kept seven days, so a mistake can be undone, and a query for the 24th reads them. On 2 December the job's VACUUM removes them, and the same query finds nothing."},
  source:{q:"Next semester the list is rebuilt from HR's records. What keeps Linh off it?",
    opts:[{t:"The delete of 25 November, which the rebuild reads before it adds anyone back.",near:true},{t:"The mailing tool's list of people who left, which the rebuild checks first."},{t:"Her no, kept on her record in HR's system, which is where the rebuild reads.",ok:true},{t:"The locked copies, which hold the list as it was after her row was deleted."}],
    why:"A rebuild starts again from the sources, and a delete made in the list is not one of them: her yes from 2023 would bring her straight back. So Ingrid puts her no on her record in HR's system, where the list is made from, and every table made from it follows."},
  copies:{q:"A locked copy made on 20 November still holds Linh's row. What makes that acceptable?",
    opts:[{t:"No one uses it, it goes after 30 days, and a restore reapplies her request.",ok:true},{t:"The night's VACUUM reaches it on 2 December and removes her row with the rest.",near:true},{t:"An admin deletes it early, as soon as Linh's answer is sent on 7 December."},{t:"Her row is encrypted in the copy, so nobody could ever read it again."}],
    why:"Nobody can delete a locked copy early, even when they should. So her row stays in it, out of use, until the copy is removed by itself, 30 days after it was made; and if it's ever restored, the job applies every answered request again before anyone reads it. VACUUM removes a table's own old files, never the copies in the place apart."},
  logs:{q:"Jun wants to check that request 2026-117's rows are gone. How should his query find them?",
    opts:[{t:"By her email, typed into the query, then removed from the query history."},{t:"By asking the team's agent, since the agent masks emails in its trace.",near:true},{t:"By her staff number, typed in, since a number alone doesn't name anyone."},{t:"By the request number, joined to the restricted table of the request's keys.",ok:true}],
    why:"The platform keeps the text of every query for a year, and nobody can edit it, so a query names the request, never the person: her numbers stay in the restricted table. An agent masks emails in its trace, but the query it runs still goes into the history with whatever it was given."}
  }}};
