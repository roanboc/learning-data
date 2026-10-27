/* Learning Data: "Pause and think" for Teachers of data, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (beside, warn, measured), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "beside":{q:"A check stops Anil's change. What makes it more than a fine?",
    opts:[{t:"It lets Anil skip the rule this time, as long as he asks."},{t:"Its message says what's missing, and links a page written for him: what the rule asks, why, how to fix it, and who to ask.",ok:true},{t:"It sends his change to a queue, where someone approves it."}],
    why:"A check that only says no is a fine with no mime. Anil fixed his change in two minutes because the message and its page were written for the person the check stops, in his words, and they say who to ask: office hours, every Thursday afternoon. Think of the last time a rule stopped you: did it say why, and how to fix it?"},
  "warn":{q:"The stewards agree a new rule: every column other teams read says what it holds. Why does it only warn until 1 December?",
    opts:[{t:"So the rule can be dropped quietly if people complain."},{t:"So people learn why and how first: each warning links its page and names the day it's required, and by then there's nothing left to stop.",ok:true},{t:"Because a warning is quicker to check than an error."}],
    why:"It's Bogotá's order: the people around, then the mime, and the fine last. The rule was agreed with the stewards, explained by its reason, that two guesses make two numbers, and run as a warning before a date everyone knew. Four weeks in, the warnings were gone. Which rule where you work would go better if it warned first, with a date everyone knows?"},
  "measured":{q:"Binder 29 says governance maturity is assessed every year. Why does Yusuf measure from the work instead?",
    opts:[{t:"An assessment every year takes too long to run."},{t:"A score said how governance looked on paper. Measures read from the work, every day, say whether it's used: how much of what other teams read is described and owned, which checks failed and whose they are, and who came to office hours and came back.",ok:true},{t:"Because the government now asks for a measure every day."}],
    why:"The score of 2.1 changed nothing anyone did. Measures read from the work show where governance runs and where it doesn't yet, and whose next step it is; and people coming back to office hours show the help is worth it. What would you count, where you work, to see whether a rule is used?"}
  }}};
