/* Learning Data: "Pause and think" for Meaning machines can read, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (before, guesses, four, standards), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). Each "stop" is this film's own lab that teaches the same idea;
   the page's .player data-labs says where those labs are. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "before":{stop:"standard",q:"Wilkins tried to classify everything in the universe. The list of causes of death was made so that hospitals and countries could compare. Why did the list last?",
    opts:[{t:"It was simpler to print."},{t:"It was made for one purpose, and shared by the people who needed to compare.",ok:true},{t:"Wilkins's categories were wrong."}],
    why:"Shared definitions let strangers compare, and they last when they serve a purpose that people keep using them for. A classification of everything serves no one in particular."},
  "guesses":{stop:"ground",q:"Genie found the right tables and still gave the wrong number. What was missing?",
    opts:[{t:"A faster database."},{t:"The stacking rule, in a form it could read.",ok:true},{t:"More rows of data."}],
    why:"The rule lived in a policy document that no tool reads. An assistant answers from what it can read, so it guessed from the column names."},
  "four":{stop:"layers",q:"Where does “a graduate certificate accepts up to four approved microcredentials” belong?",
    opts:[{t:"In the glossary."},{t:"In the ontology.",ok:true},{t:"In the semantic layer."}],
    why:"It's a relationship with a limit and a condition: a rule a machine can check. The glossary explains words; the semantic layer calculates numbers."},
  "standards":{stop:"standard",q:"Three official definitions of microcredential don't quite match. What do you do?",
    opts:[{t:"Use the newest one everywhere, without saying so."},{t:"Choose one deliberately, map the others to it, and record the differences.",ok:true},{t:"Ignore all three, and write your own."}],
    why:"Check, adopt, extend, record. A standard saves starting from blank, but only a deliberate choice, written down, keeps numbers comparable."}
  }}};
