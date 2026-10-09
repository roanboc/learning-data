/* Learning Data: "Pause and think" for Day one, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (pieces, looking, data), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "pieces":{q:"Tomás has an org chart, a list of 140 systems and a process manual. Why doesn't he understand the utility yet?",
    opts:[{t:"Some of the documents are wrong."},{t:"Each is true, but each is a piece cut from a different puzzle.",ok:true},{t:"He hasn't read the manual yet."}],
    why:"The org chart shows who reports to whom; the system list, what was bought. None of it says what the utility must be able to do, or why. Think of your first week somewhere new: what were you given, and what did it leave out?"},
  "looking":{q:"Where should a map of the organisation start?",
    opts:[{t:"With the systems: they're the easiest to list."},{t:"With the org chart: it shows who does what."},{t:"With why it exists, and for whom: each layer below is worked out from the one above.",ok:true}],
    why:"Start from the bottom, and you can describe every system perfectly and still not know what any of them is for. Most handovers start with the system list: what goes wrong when you start there?"},
  "data":{q:"“An estimated meter reading stands only until the next actual reading.” What does the map give this rule?",
    opts:[{t:"A home: the process that creates the data, its owner, and the goal it serves.",ok:true},{t:"A table to store it in."},{t:"A test that runs every night."}],
    why:"Every data rule is a claim about the organisation. Without the map, a rule is a guess, and when it's wrong, nobody knows who should fix it. Pick a data rule you know: could you name its process, its owner and its goal?"}
  }}};
