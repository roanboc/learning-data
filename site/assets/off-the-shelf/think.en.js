/* Learning Data: "Pause and think" for Off the shelf, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (decides, for, runs, keep), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "decides":{q:"Both numbers are right. Why can't anyone say which one goes to the government?",
    opts:[{t:"Planning made a mistake in its report."},{t:"Nobody has decided how the university's meaning of award maps to the government's, and the person who should is still to be confirmed.",ok:true},{t:"The glossary changed, so the older number is wrong."}],
    why:"One report ran before Monday's change to award, the other after, and each is right by its own meaning. The government counts by its own definition, and mapping ours to it is a decision nobody owns yet. Which numbers in your work depend on a decision nobody has written down?"},
  "for":{q:"What's the difference between governance and management?",
    opts:[{t:"Governance writes the policies, and management reads them."},{t:"Governance decides who decides, sets the rules and checks they're kept; management does the work: the owners, the engineers and the platform.",ok:true},{t:"They're two names for the same work."}],
    why:"Like the inspector at the market: a rule, a copy where the work happens, and someone who checks. Governance doesn't build the reports or run the platform; it makes sure each decision has an owner and reaches the work. Where you work, who checks that the rules are kept?"},
  "runs":{q:"“Personal data is classified and protected.” Where could this line run?",
    opts:[{t:"In the policy, read once a year by the council."},{t:"As a label on every column that holds personal data, and a check every night that none is missing.",ok:true},{t:"Nowhere: a line like this can only be a principle."}],
    why:"Sam could protect a column in minutes, if anyone said which: a label on the column says which, and a check every night makes sure no column is missing one. A line that can't run becomes a decision someone owns, written down where the work can find it, or it goes. Pick a line from a policy you know: where would it run?"},
  "keep":{q:"Who keeps the glossary up to date?",
    opts:[{t:"Governance: it writes the glossary and approves every change."},{t:"The stewards keep it up to date, and the owners decide what each word means; the teams use it, and governance checks it's kept.",ok:true},{t:"The data team, because every report reads from it."}],
    why:"Owners decide, stewards keep it up to date, the teams who do the work use it, and governance checks it's kept. Governance doesn't write the words: Mei decides what award means, and someone keeps the glossary in step with her. In your work, who keeps the list of what each word means, and who decides it?"}
  }}};
