/* Learning Data: "Pause and think" for Who does what, end to end, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (request, roles, product), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "request":{q:"Mei writes the decided definition once, on Noor's map. Why does nobody have to change the data team's copy, the dashboards or the assistant?",
    opts:[{t:"The data team retypes each copy on the day it's decided."},{t:"The map publishes the definition to the glossary, and every copy follows the glossary, one way: each changes by itself and says where it came from, so no copy can say something else.",ok:true},{t:"The agent changes each copy when it checks the draft."}],
    why:"Written once, on the map, and published to the glossary, the definition reaches every copy along one path, in one direction. Nobody retypes it, so no copy drifts, and each one says where it came from. If a definition changed tomorrow where you work, how many places would someone have to change by hand?"},
  "roles":{q:"The agent fills the reviewer's role. What may it do, and what may it not?",
    opts:[{t:"It may decide the simple changes itself, and leave the hard ones to the owner."},{t:"It may read the glossary and the record of who uses what, and write its note on the draft: what's missing, and what the change touches. It may not decide, or change a word in the glossary.",ok:true},{t:"It may change the glossary, as long as the steward checks it afterwards."}],
    why:"Its rights are written down on the map, so everyone can see what it may and may not do: it reads and writes its note, and people decide; here, the registrar, as the owner. Whoever fills a role is an actor, and actors come and go; the role and its steps stay. Which checks in your work could an agent do, and which decisions should always stay with a person?"},
  "product":{q:"Why does the glossary list what changed each week, and count who reads each term?",
    opts:[{t:"To show which stewards work the hardest."},{t:"Its users rely on it, as readers rely on a dictionary, so they need to see what's new. And the counts show which terms nobody reads, so those can be retired, each with its owner's yes.",ok:true},{t:"The agent needs the counts to decide which definitions are right."}],
    why:"Run as a product, the glossary has an owner, users and a promise. The week's list shows everyone what's new, like the dictionary's yearly update, and the counts show what nobody uses any more: this year, nine terms are retired. What in your team's shared lists does nobody read now?"}
  }}};
