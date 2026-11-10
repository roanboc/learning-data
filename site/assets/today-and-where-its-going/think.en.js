/* Learning Data: "Pause and think" for Today, and where it's going, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (find, path, why), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). A question's "stop" is the lab of the series it opens, on the
   series' labs page (the page's .player data-labs is "../labs/"); a question without one has no lab link. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "find":{stop:"place",q:"Placed on the map, the systems show three under one capability, a capability with only a spreadsheet, and one system under none. Why couldn't the list of 140 show that?",
    opts:[{t:"A list says what was bought and who uses it, so it shows overlaps, but not the gaps or the shadow systems.",near:true},{t:"A list only says what was bought; only placed against capabilities does it show overlaps, gaps and shadow systems.",ok:true},{t:"The list was out of date, and it didn't include the spreadsheets or the systems teams built themselves."}],
    why:"A list says what was bought; a map says what each system is for. Overlaps, gaps and shadow systems appear only when systems are placed under the capabilities they serve. What would your organisation's systems show, placed that way?"},
  "path":{q:"Why does the capacity model come before local trading on the path?",
    opts:[{t:"Local trading needs the capacity model's budget before it can be started.",near:true},{t:"It's the cheaper of the two, so it can be finished first and pay for the next."},{t:"Trading power on a street needs to know how much that street can take.",ok:true}],
    why:"The order the gaps close in follows what depends on what. Plateaus are the steady states in between. In your own plans, which piece of work quietly depends on another?"},
  "why":{q:"Three years on, someone asks why the storm tool was switched off. What answers them?",
    opts:[{t:"The decision record: what was decided, what else was considered, and who decided.",ok:true},{t:"The target drawing, which shows the storm tool gone and what replaced it.",near:true},{t:"Whoever remembers the meeting, if they're still with the company."}],
    why:"Each choice on the path is written down with why, so the reason outlives the people in the room. Where does your team keep its decisions, and could a newcomer find the reason for one?"}
  }}};
