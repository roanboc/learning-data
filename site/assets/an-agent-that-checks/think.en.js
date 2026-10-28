/* Learning Data: "Pause and think" for An agent that checks, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (today, decides, written), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "today":{q:"Anil's change comes back with four gaps. Why does he still have to wait for someone?",
    opts:[{t:"The checks are broken, so someone has to read every change by hand."},{t:"The checks say what's missing, not what's right for this list, or who decides it.",ok:true},{t:"Jun has to approve every change the university makes."}],
    why:"A check can say a column has no class. It can't say whether this list's columns identify a person, or who answers for the list: those are decisions for the people who own the data. Until someone names them, every change nobody else owns waits for the one person who knows the rules. In your work, which requests wait for one person?"},
  "decides":{q:"The agent saw a long code with two values for seven learners. Why didn't it class it as identifying no one?",
    opts:[{t:"An agent always picks the strictest class, for every column."},{t:"The evidence disagreed, so the checklist says to draft the stricter class and ask the owner, who knows what the code is made from.",ok:true},{t:"It wasn't allowed to read the code's values."}],
    why:"A class is a claim about the data, and it decides what's protected. The counts said maybe not a person; the code looked like one that is. So the agent drafted the stricter class, said it wasn't sure, and asked, and Anil, who knows the list, decided. Where would you want a helper to say “not sure” instead of guessing?"},
  "written":{q:"“Staff take care to use terms correctly.” Could an agent check it? What could take its place?",
    opts:[{t:"Yes, if the agent reads every report."},{t:"No: care can't be checked. A check that every term in a report comes from the glossary can, or a decision someone owns; or the line goes.",ok:true},{t:"No, so the line should stay as it is."}],
    why:"An agent can only follow what's written plainly enough to check, and “take care” names nothing to look at. Every term in a report coming from the glossary is something a check can confirm every night. Pick a line from a policy you know: could an agent check it?"}
  }}};
