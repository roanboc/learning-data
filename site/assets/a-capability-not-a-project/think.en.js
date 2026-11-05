/* Learning Data: "Pause and think" for A capability, not a project, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (what, colour, ask), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "what":{q:"Yusuf's first three cards were the governance team, the glossary and the stewards' meeting. Why didn't any of them stay at the top of the map?",
    opts:[{t:"Each is what does the work today, so the strongest of the three, the governance team, belongs at the top until it's reorganised.",near:true},{t:"Each is a team, an application or a way of working, and each could change. What survives all three changing is the capability: govern data.",ok:true},{t:"Each is too small for the strategy band, so the three are merged into one card, the governance programme, which stays at the top."}],
    why:"A capability is what must be done, whoever does it, and it survives a restructure, a new system and a new process. A water board isn't its members, or its spades: it's keeping the land dry. Think of something your organisation must always be able to do: how would you name it without naming a team or a system?"},
  "colour":{q:"Why is Change without surprises amber, and not green?",
    opts:[{t:"Who uses what is still written by hand: it works while people remember to keep it up, and nothing in the work itself shows that it runs.",ok:true},{t:"It has never been put in place: nobody does it yet, and the map shows that gap in amber so the board funds it first."},{t:"It's been put in place and it runs, but some teams still don't use it, so it stays amber until every team has adopted it.",near:true}],
    why:"Green is where the work itself shows a capability runs, every night, like the nightly check that finds any copy of a term that has drifted. Amber is where it still depends on people remembering, and red where nothing happens yet. Coloured with evidence, the map shows where next year's money should go. Which of your team's duties would be amber?"},
  "ask":{q:"The capabilities are on the map. Why does the university also write down services?",
    opts:[{t:"The frameworks ask for one service for every capability, so the map can show which team delivers each one and at what cost."},{t:"A service is a capability split into smaller parts, so each team can be given one part of governing data to run, measure and report on.",near:true},{t:"Nobody asks for a capability; people ask for help. A service is what they can ask for, with a promise, such as a term decided in ten working days.",ok:true}],
    why:"Clara asks what a number means; Anil asks to see some data. Named the way they'd ask, each service says what people get and by when, and, as with the water boards, whoever relies on it has a say in it. It's also what the deputy vice-chancellor can read on one page. What would people where you work ask data governance for, in their own words?"}
  }}};
