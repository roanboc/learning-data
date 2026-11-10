/* Learning Data: "Pause and think" for From a branch to production, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (rules, door, supply), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The module's labs come later, as one set, so no question
   has a "stop" yet, and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "rules":{q:"Why does GitHub read the code owners file from main, not from the pull request?",
    opts:[{t:"So a change can't name its own reviewers by editing the file it's checked against.",ok:true},{t:"So the newest owners, the ones written in the change, are the ones asked to review.",near:true},{t:"So anyone may change the file, since main is where every change ends up anyway."}],
    why:"GitHub asks the owners named in the file on main, the base of the pull request. If it read the pull request's own copy, a change could name whoever it liked to approve it, or nobody. The newest copy is exactly the one nobody has reviewed yet. Who approves a change to your own rules?"},
  "door":{q:"registrar-loader's sign-in from GitHub names the environment production. What does that add?",
    opts:[{t:"Any workflow, on any branch, can deploy as long as its file names production."},{t:"Only runs from main get in, whether or not a release approver has said yes.",near:true},{t:"Only the job that waited at production for a release approver's yes gets in.",ok:true}],
    why:"Databricks matches the sign-in's subject exactly, and the subject names the environment. Only a job in production, which lets only main deploy and waits for a release approver who didn't start the run, gets a sign-in with that subject. Main alone isn't enough: without the approver, a merge would deploy unread. Which of your deploys could start without a second yes?"},
  "supply":{q:"Why does Sam pin each action to a commit, not to a tag?",
    opts:[{t:"Once it's pinned, an action never needs updating or reviewing again.",near:true},{t:"A tag can be moved to other code; a commit always means the same code.",ok:true},{t:"A commit runs faster, and the workflow's token can't read a tag."}],
    why:"A tag is a label its owner, or a thief, can move to other code; a commit names the code itself. Pinning fixes what runs, but new versions keep coming: Dependabot proposes each one as a pull request, reviewed like any other change. Which actions in your workflows are named by a tag today?"}
  }}};
