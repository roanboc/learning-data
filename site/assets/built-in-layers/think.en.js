/* Learning Data: "Pause and think" for Built in layers, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (staging, core, ctes, physical), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). Each "stop" is this film's own lab that teaches the same idea;
   the page's .player data-labs says where those labs are. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "staging":{stop:"layers",q:"Why no joins in staging?",
    opts:[{t:"A join belongs in staging only when both tables come from the same source, since then no decision is hidden; across sources, it goes to intermediate.",near:true},{t:"Staging models are views, and a join in a view runs again on every read, so joins wait for the core, where tables are built once a night."},{t:"A join hides a decision (which record wins, which key matches) where no one looks for it. Matching is a rule, and rules live in intermediate.",ok:true}],
    why:"Staging tidies each source once, the same way, and every later step starts from it. A join in staging hides a matching rule; in intermediate, it's named and tested."},
  "core":{stop:"layers",q:"Why does the award skip intermediate?",
    opts:[{t:"Awards are final once issued, so the core reads them straight from the source."},{t:"It has one source and nothing to resolve: no keys to match, no timelines to stitch.",ok:true},{t:"It has one source, so it needs no tests: nothing can disagree with one system.",near:true}],
    why:"A step that only passes rows through adds a model to maintain and nothing to test. When a second source of awards arrives, a step appears."},
  "ctes":{stop:"ctes",q:"What does an import CTE buy you?",
    opts:[{t:"Every model the file depends on, listed at the top, once.",ok:true},{t:"A faster query, since the database reads each input once.",near:true},{t:"A test on each input, run before the logic below it."}],
    why:"A reviewer sees the inputs before the logic, a reference can't hide in the middle of a join, and changing an input means changing one line."},
  "physical":{stop:"store",q:"When is incremental worth the risk?",
    opts:[{t:"When the table is large and most of its rows change on every run.",near:true},{t:"Always: merging only what changed is cheaper, whatever the size."},{t:"When the table is large and most of it doesn't change between runs.",ok:true}],
    why:"The risk is that a change of logic doesn't reach rows already built: after one, rebuild in full with --full-refresh, and compare with a full build. Here, with 53 credentials, it's there to show the pattern."}
  }}};
