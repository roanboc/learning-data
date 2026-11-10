/* Learning Data: "Pause and think" for One copy, one platform, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (usual, copy, fewer), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "usual":{q:"In the usual design, a pipeline copies each change from the app's own database to an analytics platform. What does that copy cost?",
    opts:[{t:"Two platforms, a pipeline to run, two sets of permissions, and a copy always a little behind.",ok:true},{t:"Two platforms to pay for, but one set of permissions, since both of them hold the same claims.",near:true},{t:"Only the storage: it's the same data, so the copy stays right without anyone working on it."}],
    why:"The film counts the cost: two platforms, the pipeline between them, two sets of permissions to keep in step, and a copy that's always a little behind the app. The same data doesn't mean the same rules: each platform grants its own access. What does a copy cost where you work?"},
  "copy":{q:"Payroll's list, the claims job and Finance's cost all read the rows the app writes. Why isn't the app slowed down?",
    opts:[{t:"Because the readers wait for the night, when nobody is writing claims in the app at all."},{t:"Because the lakehouse reads a copy of the rows, made each night, and so it leaves the app alone.",near:true},{t:"Because Postgres serves the app, and the lakehouse reads the same rows in place, on its own engine.",ok:true}],
    why:"Two engines, one copy: Postgres serves the app, and the lakehouse reads the same rows in place, without slowing it. There's no nightly copy: that was the usual design's pipeline. Which of your reports read a copy only so they don't slow an app?"},
  "fewer":{q:"On this platform, one thing still leaves: the hours to pay, by noon each Tuesday. Why that one?",
    opts:[{t:"Because payroll's team doesn't work on the platform, so it needs its own copy of every claim.",near:true},{t:"Because payroll pays from a payroll system the university buys, which isn't on the platform.",ok:true},{t:"Because pay is safer in a second copy than in the same rows the claims app writes each day."}],
    why:"Payroll pays from a payroll system the university buys, off the platform, so the hours to pay leave it by noon on Tuesday, under a contract with payroll. One thing moves, on purpose, instead of a copy of everything: the claims themselves stay where they're written. Which system you buy keeps its own copy, and what does its contract say?"}
  }}};
