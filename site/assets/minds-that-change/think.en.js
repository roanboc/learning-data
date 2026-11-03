/* Learning Data: "Pause and think" for Minds that change, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (three, ours, check), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "three":{q:"The agent gave Clara three answers in two days, each as sure as the last. What was missing from all three?",
    opts:[{t:"A score for how sure it was, to show which answer to pick."},{t:"Where each answer came from: the query it ran and the rows it counted.",ok:true},{t:"Nothing: the latest answer is the one to use."}],
    why:"Without evidence, nobody could tell which answer was right, and Monday's, it turned out, was. A score for how sure it was wouldn't help: each answer was already as sure as the last, and the 2025 review it cited doesn't exist. Where you work, which answers arrive without saying where they came from?"},
  "ours":{q:"Clara was sure Health lost the most first-years last year, but it was Science. Was she careless, or lying?",
    opts:[{t:"Careless: she should have remembered."},{t:"Lying, to back the agent's answer."},{t:"Neither: memory rebuilds itself each time we remember, and hers had joined two years into one.",ok:true}],
    why:"Bartlett's retellings and Loftus and Palmer's question show memory filling its gaps with what seems likely, and being sure of it. Her own paper from last year settled it, and nobody was blamed. When did you last find that a memory you were sure of was wrong?"},
  "check":{q:"Counted two ways, the number disagreed by three: 134 and 131. Why is that good news?",
    opts:[{t:"The agent can pick the larger number, to be safe."},{t:"The second way found three students counted twice, which one way alone hid.",ok:true},{t:"It isn't: when two ways disagree, the agent can't be used."}],
    why:"Like the reciters' patterns, a slip shows when two ways must agree. The agent said so instead of picking one, the double count was fixed, and a plain check now looks for it every night; Clara signed with the evidence in front of her. Which number in your work would you want reached a second way before anyone acts on it?"}
  }}};
