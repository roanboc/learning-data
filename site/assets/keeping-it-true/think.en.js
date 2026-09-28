/* Learning Data: "Pause and think" for Keeping it true, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (arrives, watch, decide, e2e), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). Each "stop" is this film's own lab that teaches the same idea;
   the page's .player data-labs says where those labs are. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "arrives":{stop:"drift",q:"A new measure shows three different numbers on three dashboards. What's the most likely reason?",
    opts:[{t:"One of the dashboards has a bug."},{t:"Each dashboard calculates its own definition of the measure.",ok:true},{t:"The data reached two of them late."}],
    why:"Three numbers for one measure usually means three definitions, each calculated correctly. That's drift: what's used has parted from what's written."},
  "watch":{stop:"drift",q:"Why is noticing drift a good first job for an AI agent?",
    opts:[{t:"It can decide which definition is right."},{t:"It can read every query, definition and new value, tirelessly, and show the evidence.",ok:true},{t:"It can change the dashboards by itself."}],
    why:"Noticing is tedious for people and cheap for machines. Deciding what the business means stays with people."},
  "decide":{stop:"review",q:"The agent's draft changes the glossary, the model and the tests. Who approves it?",
    opts:[{t:"The agent, because it drafted it."},{t:"The owners: of the meaning, of the model, and of the build.",ok:true},{t:"Nobody: the tests are enough."}],
    why:"The agent recommends; people approve; the tests check the result. Each layer has an owner who approves their part."},
  "e2e":{stop:"chain",q:"Completion rate was redefined this year. What happens to last year's report?",
    opts:[{t:"It's recalculated with the new definition, and replaced."},{t:"It keeps its number, read with last year's version of the definition.",ok:true},{t:"It's withdrawn, because it no longer matches."}],
    why:"Every number keeps the meaning it had. Versions keep old reports true, and let you restate them beside the new ones when you need to compare."}
  }}};
