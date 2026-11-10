/* Learning Data: "Pause and think" for A platform that watches itself, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (watch, approve, contract), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  watch:{q:"The claims job failed at 22:03. By morning, what is waiting in Sam's inbox?",
    opts:[{t:"An alert for each task and table that failed, each with its own log, for Sam to trace back to one cause."},{t:"One insight: the failure, its cause traced through lineage, what it touches, and a fix for a person to review.",ok:true},{t:"One insight: the failure, its cause traced through lineage, what it touches, and the fix it made in production.",near:true}],
    why:"Genie ZeroOps groups what one cause breaks into one insight: what failed, the cause it traced through lineage (the claims app's change to the hours at 15:02), what the failure touches (the hours for the payroll system, payroll's export and casual teaching cost), and a proposed fix. It doesn't change production data or code without a person's review. Where would your team's first hour of tracing go without lineage?"},
  approve:{q:"Sam asked for the fix on a new branch and opened the pull request. Who approves it for production?",
    opts:[{t:"Sam, who checked the cause against the claims, asked for the branch and opened the pull request.",near:true},{t:"Genie ZeroOps, once the pull request's tests pass, since it found the cause and wrote the fix."},{t:"Noor, who didn't write the change, once Sam has checked it and the pull request's tests pass.",ok:true}],
    why:"Sam reviewed the agent's proposal, and is the pull request's author, so someone else approves it: Noor, at 9:05, on the same road as every change. An agent never approves, however good its fix. Who approves a change to production where you work, and is it ever the change's own author?"},
  contract:{q:"What keeps the same night from coming back with the app's next change?",
    opts:[{t:"The claims app's owner changes its contract first, so everyone who reads the hours knows before the app changes.",ok:true},{t:"The platform reads the hours in any form the app sends, so the claims job never fails on the hours again.",near:true},{t:"Genie ZeroOps watches the claims job more closely, so it finds the next failure a few minutes sooner."}],
    why:"The fix mended the night: the platform reads 1:30 as 1.5. But the next change may be to another field, and only the contract tells everyone who reads the claims what each field holds. So Sam's pull request asks Ingrid Holm, who owns the claims' data, to change the contract first next time, as Apollo's checklist changed for the next missions. Which of your sources could change what a field holds without telling you?"}
  }}};
