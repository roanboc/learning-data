/* Learning Data: "Pause and think" for Who does what, end to end, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (request, roles, product), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "request":{q:"Mei writes the decided definition once, on Noor's map. Why does nobody have to change the data team's copy, the dashboards or the assistant?",
    opts:[{t:"The map publishes it to the glossary, and the agent copies it to each place the record of who uses what names, once Mei approves.",near:true},{t:"The data team retypes each copy on the day the definition is decided, so they all agree by evening."},{t:"The map publishes it to the glossary, and every copy follows the glossary, one way: each changes by itself and says where it came from.",ok:true}],
    why:"Written once, on the map, and published to the glossary, the definition reaches every copy along one path, in one direction. Nobody retypes it, so no copy drifts, and each one says where it came from. If a definition changed tomorrow where you work, how many places would someone have to change by hand?"},
  "roles":{q:"The agent fills the reviewer's role. What may it do, and what may it not?",
    opts:[{t:"It may change the glossary, as long as the steward checks each change it made the next morning."},{t:"It may read the glossary and who uses what, and note on the draft what's missing and what it touches; it may not decide, or edit the glossary.",ok:true},{t:"It may read the glossary and who uses what, and decide the simple changes on its own, leaving only the hard ones for the owner.",near:true}],
    why:"Its rights are written down on the map, so everyone can see what it may and may not do: it reads and writes its note, and people decide; here, the registrar, as the owner. Whoever fills a role is an actor, and actors come and go; the role and its steps stay. Which checks in your work could an agent do, and which decisions should always stay with a person?"},
  "product":{q:"Why does the glossary list what changed each week, and count who reads each term?",
    opts:[{t:"Its users rely on it, as readers rely on a dictionary, so they need to see what's new; and the counts show which terms nobody reads, to retire them.",ok:true},{t:"To show which stewards work the hardest, so the council can see where more help is needed."},{t:"Its users rely on it, so they need to see what's new; and the counts show which terms are read most, so their owners review those first.",near:true}],
    why:"Run as a product, the glossary has an owner, users and a promise. The week's list shows everyone what's new, like the dictionary's yearly update, and the counts show what nobody uses any more: this year, nine terms are retired. What in your team's shared lists does nobody read now?"}
  }}};
