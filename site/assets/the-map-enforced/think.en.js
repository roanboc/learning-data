/* Learning Data: "Pause and think" for The map, enforced, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (map, own, logs, stop), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  map:{q:"Next term, the planning agent's work needs to read one more table. What should happen first?",
    opts:[{t:"Sam grants its group the right in Unity Catalog, and Noor adds it to the map later that day.",near:true},{t:"Clara grants the right herself, since she owns the agent and answers for what it does."},{t:"The step that needs it changes on the map, through review, and the script writes the grant.",ok:true}],
    why:"Rights go one way: the map changes first, through review, and the script writes each tool's settings from it. Given by hand first, a right skips the review the map's change goes through, and until the map catches up, the check each night fails on it. Where you work, which rights were given by hand and never written down?"},
  own:{q:"On Tuesday, a grant given by hand let the agent's group change Planning's production tables. Why couldn't the agent have used it?",
    opts:[{t:"It works in the development workspace, where production can only be read, whatever its grants say.",ok:true},{t:"The check each night takes back any right the map doesn't give, so its group never held it.",near:true},{t:"Its pull requests need a person's approval, so a change it made to production would wait for one."}],
    why:"The check each night only reads: it failed, and Sam took the grant back in the morning, so for a day the group held it. What kept production safe was where the agent works: the development workspace, where production can only be read, so even a wrong grant can't write there. Which of your safeguards would still hold if one grant were wrong?"},
  logs:{q:"Anyone could type planning-agent[bot] as a commit's author. How can a reviewer tell the agent's own commits?",
    opts:[{t:"They're signed with a secret key of its own, which only the planning agent can read.",near:true},{t:"They're made through its App, so GitHub marks them verified, and a typed name isn't.",ok:true},{t:"They name its owner, Clara Jensen, in each message, which a typed name never does."}],
    why:"A name typed into a commit is only text. The planning agent's own commits are made through its App, so GitHub marks them verified, and it holds no secret to do it with: each run signs in with a pass that lasts minutes. Then the auditors' question is one search. Where you work, which names in your logs could anyone have typed?"},
  stop:{q:"Sam deactivates the planning agent's service principal for ten minutes. What happens?",
    opts:[{t:"It can't sign in, and its grants are removed, so the map must give them again when it's back.",near:true},{t:"Every agent in its group stops too, since they all sign in with the group's one identity."},{t:"It can't sign in, and it keeps its rights, while Jun, Lucía and the workload agent work on.",ok:true}],
    why:"Each agent has its own name in each tool, so each can be stopped on its own. A deactivated service principal can't sign in, and its grants stay for when it's turned back on. On Wednesday, its next call failed, and nobody else stopped. A helper on Jun's sign-in could only be stopped by stopping Jun. How would you stop one of your agents, and only it?"}
  }}};
