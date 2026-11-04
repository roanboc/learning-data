/* Learning Data: "Pause and think" for It feels like understanding, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (fluent, meanings, knowing), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "fluent":{q:"The agent's answer came with a passing check and its evidence attached. What does that tell Jun?",
    opts:[{t:"That the number is right for Anil's plan."},{t:"That its total matched what it checked. Whether it counted what Anil needs, only the evidence and a person can say.",ok:true},{t:"Nothing at all."}],
    why:"A check confirms what it compares, nothing more. A passing check and a paperclip make an answer feel finished; they don't say what the number means. Where you work, which answers feel finished because they come with a tick?"},
  "meanings":{q:"The agent counted 2,160 and its check passed. Why did the check pass?",
    opts:[{t:"It compared the total with the same table it had counted, so it confirmed the sum, not the meaning.",ok:true},{t:"The check was broken."},{t:"The agent changed the data."}],
    why:"The sum was right; the question was different. A check against the agent's own source can't catch a different meaning. Where you work, which word means one thing to you and another in the table you report from?"},
  "knowing":{q:"Which change would have caught the mistake before the faculty planned its advisers?",
    opts:[{t:"A longer explanation from the agent."},{t:"A second agent to approve the first."},{t:"Comparing the count with the faculty's own list of students, every time.",ok:true}],
    why:"A count the agent didn't make shows the gap at once, by a plain rule. Longer explanations raise confidence, not accuracy, and an agent is never an approver: its tick is for reference, and a person decides. Where you work, what could you check an agent's numbers against?"}
  }}};
