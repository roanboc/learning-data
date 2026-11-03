/* Learning Data: "Pause and think" for A model, reasoning, hands and a loop, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (writes, hands, script), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "writes":{q:"A model on its own says the census-day count is about 18,000. What would you need before you trust it?",
    opts:[{t:"A more confident answer from the model."},{t:"Where it came from: the records it read, the rule it used, and a check against a source you trust.",ok:true},{t:"The same answer, asked twice."}],
    why:"A model on its own has none of these: it writes what's likely, from what it learned, not from the university's records. Asking again gives another likely answer, not evidence. Where you work, which numbers do you trust because you know where they came from?"},
  "hands":{q:"Why do the agent's three tools only read?",
    opts:[{t:"Because tools that write are slower."},{t:"Reading is all the job needs, and a tool that can't change anything can't break anything, by mistake or in the wrong hands.",ok:true},{t:"Because the label on each tool says read only."}],
    why:"Each tool gets the fewest rights the job needs, and they're set on its account, not only on a label: a label is a hint, an account is a control. Where you work, which accounts can change more than their job needs?"},
  "script":{q:"Planning will want the census-day count every March. Agent or plain script?",
    opts:[{t:"The agent, since it found the answer once."},{t:"A plain script: the steps are known now, so a recipe with a test does it in seconds, the same way every time.",ok:true},{t:"Both, and compare them every year."}],
    why:"Once the steps can be written down, a plain script is faster, cheaper and the same every time, and Noor approved it before it ran on the schedule. Keep agents for the questions nobody has answered yet. Where you work, which job an agent does today could be a plain script?"}
  }}};
