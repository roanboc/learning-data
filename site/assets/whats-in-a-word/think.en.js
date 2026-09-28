/* Learning Data: "Pause and think" for What's in a word, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (answers, calls, gavagai, edges), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). Each "stop" is this film's own lab that teaches the same idea;
   the page's .player data-labs says where those labs are. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "answers":{stop:"count",q:"Four offices give four numbers for one question. What's the most likely reason?",
    opts:[{t:"Three of their systems have bugs."},{t:"Each office counts a different idea under the same word.",ok:true},{t:"Some of the data is out of date."}],
    why:"Every number was right for what it counted. The word “credential” pointed to four different ideas, one per office."},
  "calls":{stop:"words",q:"A leopard call means any leopard. A dolphin's whistle means one dolphin. In a data model, which is which?",
    opts:[{t:"Both are categories."},{t:"The call is a category; the whistle works like an identifier.",ok:true},{t:"Both are identifiers."}],
    why:"A category groups things of one kind; an identifier picks out one particular thing. Every data model needs both: a Learner entity, and a learner ID."},
  "gavagai":{stop:"grain",q:"A table has one row per student per unit. Someone counts its rows to find how many students there are. What goes wrong?",
    opts:[{t:"Nothing: one row is one student."},{t:"Students in several units are counted several times: the grain doesn't match the question.",ok:true},{t:"Units with no students are left out."}],
    why:"The grain is one student in one unit. Counting students means counting distinct student IDs, not rows."},
  "edges":{stop:"count",q:"Everyone agrees a degree is a credential. Where will the four offices disagree?",
    opts:[{t:"About degrees."},{t:"At the edges: badges and certificates.",ok:true},{t:"Nowhere, if their systems are accurate."}],
    why:"Categories have a clear middle and fuzzy edges. Definitions are written for the edges: that's where the counts part ways."}
  }}};
