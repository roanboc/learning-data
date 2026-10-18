/* Learning Data: "Pause and think" for A map people and agents can read, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (risk, views, rights), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "risk":{q:"Tomás keeps the map up to date himself, every week. Why does it still fail the navigator's test?",
    opts:[{t:"It's kept in slides, and slides can't hold a map."},{t:"Only he can change it: without him, nobody could keep it true, or sail by it.",ok:true},{t:"The copies in the decks are newer than his."}],
    why:"A map lives while people use it, keep it true and can pass it on. Tomás's map is used, and true while he's there, but only he can change it, and its copies drift without him. Kept as text, with each part's owner reviewing its changes, it no longer depends on one person. Who is the only person who can update a map, a model or a glossary in your organisation?"},
  "views":{q:"The glossary says a reading is energy used, and leaves out energy exported from solar panels. Why isn't it fixed in the glossary?",
    opts:[{t:"The glossary belongs to the data team, not to the network."},{t:"The glossary is generated from the map: fixed there, it would disagree with every other view, and be lost the next time the views are generated.",ok:true},{t:"A definition can't change once its owner has confirmed it."}],
    why:"Every view is generated from the map, one way, so they all agree. The fix goes to the map, its owner confirms it, and the glossary, the models, dbt and the catalogue follow. Where is the same definition kept by hand in two places in your organisation?"},
  "rights":{q:"The map's agent reads everything and drafts changes in seconds. Why does its own file say it may not confirm one?",
    opts:[{t:"Agents can't write to the map's files."},{t:"A map is true when the people who own it confirm it: the agent drafts, and an owner decides, and answers for it.",ok:true},{t:"The map would change too often."}],
    why:"Drafting is work an agent does well: finding what a change touches, and writing it out. Confirming says the map is true, and only the owner of that part can say so. Its rights are written down, like anyone's: it reads, drafts and asks; people confirm. Which changes would you let an agent draft in your organisation, and who would confirm them?"}
  }}};
