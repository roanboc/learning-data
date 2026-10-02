/* Learning Data: "Pause and think" for Built in layers, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (staging, core, ctes, physical), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). Each "stop" is this film's own lab that teaches the same idea;
   the page's .player data-labs says where those labs are. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "staging":{stop:"layers",q:"Why no joins in staging?",
    opts:[{t:"Joins are slow, and staging models are views."},{t:"A join hides a decision (which record wins, which key matches) where no one looks for it. Matching is a rule, and rules live in intermediate.",ok:true},{t:"dbt doesn't allow a join in a staging model."}],
    why:"Staging tidies each source once, the same way, and every later step starts from it. A join in staging hides a matching rule; in intermediate, it's named and tested."},
  "core":{stop:"layers",q:"Why does the award skip intermediate?",
    opts:[{t:"It has one source and nothing to resolve: no keys to match, no timelines to stitch.",ok:true},{t:"Awards never change, so they need no tests."},{t:"The core can only read staging models."}],
    why:"A step that only passes rows through adds a model to maintain and nothing to test. When a second source of awards arrives, a step appears."},
  "ctes":{stop:"ctes",q:"What does an import CTE buy you?",
    opts:[{t:"A faster query: the database reads each input once."},{t:"Every model the file depends on, listed at the top, once.",ok:true},{t:"Nothing: it's a matter of style."}],
    why:"A reviewer sees the inputs before the logic, a reference can't hide in the middle of a join, and changing an input means changing one line."},
  "physical":{stop:"store",q:"When is incremental worth the risk?",
    opts:[{t:"Always: merging only what changed is always cheaper."},{t:"When the table is large and most of it doesn't change between runs.",ok:true},{t:"Never: a table rebuilt in full is always safer."}],
    why:"The risk is that a change of logic doesn't reach rows already built: after one, rebuild in full with --full-refresh, and compare with a full build. Here, with 53 credentials, it's there to show the pattern."}
  }}};
