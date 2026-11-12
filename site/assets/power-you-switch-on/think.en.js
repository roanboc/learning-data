/* Learning Data: "Pause and think" for Power you switch on, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (second, switched, who), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The module's labs come later, as one set, so no question
   has a "stop" yet, and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "second":{q:"Someone steals Jun's everyday sign-in. What can they reach?",
    opts:[{t:"His admin account too, since both of those accounts are Jun's own."},{t:"Nothing at all, since all of Jun's power sits in his admin account.",near:true},{t:"His everyday work: his code, his tests and the jobs he watches run.",ok:true}],
    why:"His everyday account keeps his everyday work, and nothing more. The admin account is a separate account, never used for email or the web and signed in only with a passkey, so a stolen everyday sign-in doesn't reach it. The great power does sit there, but the everyday account still reaches his daily work. Where there's one account only, a thief reaches the account that keeps the power, switched off: one lock, not two. What would someone reach with your everyday sign-in?"},
  "switched":{q:"Jun must restore one table, a half-hour job. What does he switch on?",
    opts:[{t:"Every admin power, for four hours, so nothing stops him halfway."},{t:"Restore a table, for the time the job needs, with Sam's yes.",ok:true},{t:"Restore a table, for the time the job needs, approved by himself.",near:true}],
    why:"Only the power the task needs, for the time it needs, and another specialist's yes: Sam approves Jun's, Jun approves Sam's, and no one approves their own. The right power for the right time is half of a switch-on; someone else's yes is the other half. Who says yes to admin work where you are?"},
  "who":{q:"Clara, an analyst in Planning, needs a column she can't see. What happens next?",
    opts:[{t:"She asks the platform team, who then decide whether she may see it.",near:true},{t:"She gets an admin account, switched on for an hour to read the column."},{t:"She asks the data's owner, and if they agree, sees it in the catalog.",ok:true}],
    why:"Business users and analysts never get an admin account. Their work goes through the catalog, so Clara asks the data's owner for access, not for power, and sees the column through her role, masked where it must be. The platform team keeps the platform running, but doesn't decide who may see the data. Who decides who may see yours?"}
  }}};
