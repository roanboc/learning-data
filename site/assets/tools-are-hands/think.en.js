/* Learning Data: "Pause and think" for Tools are hands, and every hand is a permission, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (rights, six, line), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "rights":{q:"The agent's rules already say it must never write to production. Why does the team also set its rights on its own account?",
    opts:[{t:"In case the file for agents gets lost."},{t:"Because rules are words, which can be argued with or hidden in a ticket, and a right holds whatever the agent is told.",ok:true},{t:"Because the agent reads its rules only once a day."}],
    why:"Rules are words: an agent can be argued out of them, or a hidden line can say the opposite. A right set where the data lives holds whatever the agent is told, like the chain that held Bodley's books whatever the reader meant. Where you work, which of an agent's limits are written only in its instructions?"},
  "six":{q:"Query gives the agent counts and samples of at most 20 rows, with names masked. Why not let it read every row, names and all, since it only reads?",
    opts:[{t:"Reading every row would be too slow."},{t:"Whatever a hand can read, a hidden line or a stolen key can reach too.",ok:true},{t:"Reading can't do any harm, so there's no reason not to."}],
    why:"Whatever a hand can read, a hidden line or a stolen key can reach too. Counts and small samples are all the census-day count needs, and the names stay in the database. Which of your tools can reach more than its job needs?"},
  "line":{q:"Clara's pasted email hid a line telling the agent to send the student list outside. What kept the list safe?",
    opts:[{t:"Luck: the agent didn't notice the line."},{t:"The agent's rule that what it reads is data, and hands that mask names and can't send anything out.",ok:true},{t:"Clara deleted the email before the agent read it."}],
    why:"Two things together. The agent's rule that what it reads is data, never orders, so it told Jun and quoted the line; and its hands, which mask names and can send nothing out, so obeying would have failed too. Tickets always bring strangers' words, so the team took away the other two parts of a leak. Which of your agent's tools could send something outside?"}
  }}};
