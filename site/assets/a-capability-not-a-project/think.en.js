/* Learning Data: "Pause and think" for A capability, not a project, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (what, colour, ask), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "what":{q:"Yusuf's first three cards were the governance team, the glossary and the stewards' meeting. Why didn't any of them stay at the top of the map?",
    opts:[{t:"Noor's map has room for only one card in the strategy band."},{t:"Each is who does the work, an application, or how it's done, and each could change: a team reorganised, a glossary replaced, a meeting changed. What survives all three is the capability: govern data.",ok:true},{t:"The deputy vice-chancellor funds tools, not teams."}],
    why:"A capability is what must be done, whoever does it, and it survives a restructure, a new system and a new process. A water board isn't its members, or its spades: it's keeping the land dry. Think of something your organisation must always be able to do: how would you name it without naming a team or a system?"},
  "colour":{q:"Why is Change without surprises amber, and not green?",
    opts:[{t:"Nobody has put it in place yet."},{t:"Who uses what is still written by hand: it works while people remember to keep it up, and nothing in the work shows that it runs.",ok:true},{t:"It costs more than the other capabilities."}],
    why:"Green is where the work itself shows a capability runs, every night, like the nightly check that finds any copy of a term that has drifted. Amber is where it still depends on people remembering, and red where nothing happens yet. Coloured with evidence, the map shows where next year's money should go. Which of your team's duties would be amber?"},
  "ask":{q:"The capabilities are on the map. Why does the university also write down services?",
    opts:[{t:"A service is cheaper to run than a capability."},{t:"Nobody asks for a capability; people ask for help. A service is what they can ask for, named the way they'd ask, with a promise, such as a new term decided within ten working days, and its users review it each year.",ok:true},{t:"The frameworks ask for one service for every capability."}],
    why:"Clara asks what a number means; Anil asks to see some data. Named the way they'd ask, each service says what people get and by when, and, as with the water boards, whoever relies on it has a say in it. It's also what the deputy vice-chancellor can read on one page. What would people where you work ask data governance for, in their own words?"}
  }}};
