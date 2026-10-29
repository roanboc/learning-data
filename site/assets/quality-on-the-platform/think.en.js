/* Learning Data: "Pause and think" for Quality on the platform, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (owner, where, watch), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "owner":{q:"Jun adds a test that every badge has a name, and the governance check stops his pull request. What's missing, and who chooses the test's level?",
    opts:[{t:"Its dimension: Jun picks one, and the data team sets the level."},{t:"Its owner: one line in dbt_project.yml gives the learning platform's source tests one. The dimension comes from the kind of test, and the learning team chooses the level.",ok:true},{t:"Nothing: the check stops every new test until data governance approves it."}],
    why:"The learning platform's source tests have no owner by folder yet, so the check stops a new one until a line gives it one. The dimension comes from the kind of test: a test for empty values checks completeness. The level is the owner's to choose, with the reason in their decision log, because they know what an empty name costs. Where you work, who decides how strict a check is?"},
  "where":{q:"Where would you check that a short-course email has an @ in it, and why there?",
    opts:[{t:"Where it's typed: the form can ask again while the person is still there. A test on the source then checks that no email arrives without one, and should never fail.",ok:true},{t:"In monitoring: the platform learns how many emails usually have an @."},{t:"In the data team's models: they can clean each email every night."}],
    why:"Prevent what you can, where it starts: a mistake caught as it's typed is fixed by the one person who knows the answer, while they're still there. The test on the source checks that the form keeps doing its job, so it should never fail; if it does, the form has broken. Cleaning it every night, further on, hides the problem from its owner. Where you work, which checks could move to where the data is typed?"},
  "watch":{q:"Monitoring says last night's badges arrived four hours late. No rule says when they should arrive. What happens next?",
    opts:[{t:"The data team adds a test for when they arrive, straight away."},{t:"The learning team, the owner on record, hears first and finds the cause with the platform team. If the lateness matters, the surprise becomes a rule they own, with a level they choose.",ok:true},{t:"Nothing: without a rule, it isn't a failure."}],
    why:"Monitoring watches for what no rule names, and tells the table's owner, as it did the night half the new badges arrived with no credit. The owner decides whether it matters: if it does, it becomes a rule, a test with their level and the reason in their decision log; if not, monitoring keeps watching. Where you work, who hears first when a table arrives late?"}
  }}};
