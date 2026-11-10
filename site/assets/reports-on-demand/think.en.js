/* Learning Data: "Pause and think" for Reports on demand, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (ask, context, back), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The module has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "ask":{q:"Rohan sets Health's budget from Genie One's answer, A$1.84 million. What lets him trust it enough to do that?",
    opts:[{t:"The data team reads every answer Genie gives before it reaches the person who asked it."},{t:"It says what it counted, and shows the query it ran, so anyone can check the number.",ok:true},{t:"It says what it counted, claims and on-costs, so the number needs no other check.",near:true}],
    why:"Genie One answers from the Genie Agent the data team set up, and says what it counted: the claims approved for casual teaching, plus on-costs. It also shows the query it ran, so Rohan, or anyone, can check the number before a budget rests on it. Nobody reads each answer first: the trust comes from the model and its rules, and from showing the work. Where you work, which answers come with a way to check them?"},
  "context":{q:"Ingrid's rule is totals only, never one person's pay. How does the Genie Agent keep to it?",
    opts:[{t:"Its instructions tell Genie never to show anyone's pay, so it leaves those rows out.",near:true},{t:"Each answer is checked against HR's list of staff, and any name is taken out of it."},{t:"Its data is one measure, by faculty, unit and teaching period, so it never reads a claim.",ok:true}],
    why:"The rule is kept by the data itself: the agent's only data is the measure, casual teaching cost, by faculty, unit and teaching period, so it reads totals and never anyone's claims. An instruction alone asks Genie to behave; data that holds no one's pay can't show it. And each answer runs as the person asking, so they see only what they may read. Where you work, which rules live in the data, and which only in words?"},
  "back":{q:"Which question deserves a dashboard of its own, by the film's rule of thumb?",
    opts:[{t:"How many claims still wait for approval, asked every pay day by payroll, who chase them.",ok:true},{t:"What casual teaching cost Health this semester, asked by Rohan for next year's budget."},{t:"How many claims were paid a year ago, asked every pay day, though no one acts on what it shows.",near:true}],
    why:"A question deserves a dashboard when it comes back on a schedule, and someone acts on what it shows. Claims still waiting come back every pay day, and payroll chases them before the pay run closes. Rohan's question comes once, for a decision: he asks it when he needs it. The claims paid a year ago come back on a schedule too, but nobody acts on them, so they don't earn a dashboard either. Which of your dashboards does someone act on?"}
  }}};
