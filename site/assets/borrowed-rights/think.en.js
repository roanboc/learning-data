/* Learning Data: "Pause and think" for Borrowed rights, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (wide, who, checked), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  wide:{q:"Jun's helper asked to approve the workload agent's fix as Jun Park, and the fix's checks had passed. What would a yes have done?",
    opts:[{t:"Nothing harmful: the fix's checks had passed, so the approval would only have saved Jun a review on a busy day."},{t:"Failed at once: a helper may not approve another team's fix, so the tools would have refused it and stopped the ticket.",near:true},{t:"An agent's change would have been approved by an agent, and the record would say a person, Jun Park, approved it.",ok:true}],
    why:"On Jun's sign-in the helper had every right Jun has, approving code included, so the yes would have worked. Passing checks isn't a review: Jun reviewed the fix himself on Monday, and Noor approved it for production. Had the helper approved, the record would read \"approved by Jun Park\", over a change no person had read. When did a tool last ask you to allow a step you didn't read?"},
  who:{q:"On Jun's sign-in, his helper and Jun share one name in every tool. What can't the team do because of that?",
    opts:[{t:"Tell its steps from his in the log, or narrow or stop the helper without narrowing or stopping Jun.",ok:true},{t:"Tell its steps from his in the log, though they can still narrow or stop the helper on its own.",near:true},{t:"Keep it from reading what Jun reads, since one shared name gives the helper fewer rights than Jun."}],
    why:"To every tool, the helper is Jun: his log says Jun for his steps and for its steps, and nothing can narrow or stop the helper without doing the same to him. The workload agent had the same problem while it ran on Anil's personal key, until it had a name of its own. Whose name is on your helpers' steps today?"},
  checked:{q:"Jun's helper can be set to ask before each step. Why do Jun and Sam narrow its tools as well?",
    opts:[{t:"Asking before every step slows Jun down, so tools that only read let them turn that setting off for good."},{t:"Its person can change that setting with one click; tools that only read hold, whatever the helper is asked.",ok:true},{t:"A setting can be switched off, so they also write in its instructions that it must never approve or merge.",near:true}],
    why:"One maker calls such a setting a productivity feature, not a security boundary: one click, and the helper goes on without asking. Instructions aren't a boundary either, since words hidden in a ticket it reads can steer it. So the boundary is in its tools: each step is a read, or a draft in its own sandbox, and approving, merging and production stay Jun's. Jun still allows each step at stage two. Where is the boundary for your helpers: in a setting, or in their tools?"}
  }}};
