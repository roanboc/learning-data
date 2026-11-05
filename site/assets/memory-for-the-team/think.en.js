/* Learning Data: "Pause and think" for Memory: from one chat to the team, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (weeks, kinds, team, wrong), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "weeks":{q:"Jun's agent learned the lesson in April. Why did Clara's agent make the same mistake in June?",
    opts:[{t:"Agents forget what they learn after a few weeks, so by June the lesson had faded from Jun's agent as well."},{t:"The lesson went into the team's memory in April, but Clara's agent was set up before then, so it never loaded it.",near:true},{t:"The lesson stayed where it was learned: in one chat, and in the memory Jun's agent keeps for Jun, which no other agent reads.",ok:true}],
    why:"Jun's agent would have known, but Clara's had never seen that chat, and the team's notes, kept by hand, never got the lesson. So Clara spent an afternoon finding it, and her budget figures nearly went out short. Where you work, where does what one person learns end up?"},
  "kinds":{q:"Why not keep every session's whole record, so nothing is lost?",
    opts:[{t:"A record is an episode: long, it may hold rows about students, and no one reads it. Lasting memory keeps what it teaches, in a line or two.",ok:true},{t:"The model already remembers every session it has had, so a stored record would only repeat what it knows."},{t:"A record is an episode, and keeping every one is fine, as long as each agent reads only the records from its own sessions.",near:true}],
    why:"The model keeps nothing from one session to the next. A whole record is too long for anyone to review, and may hold rows about people; a fact, a preference or a decision, in a line or two, outlasts the session and can be checked. Where you work, what would you keep from last week's work, in two lines?"},
  "team":{q:"Who approved the lesson about census day, and why not the agent that learned it?",
    opts:[{t:"Jun, because his agent learned it, and the person whose agent learns a lesson approves it for the team.",near:true},{t:"Mei, because meanings are hers. The agent proposes and a person approves: nothing goes into the team's memory without one.",ok:true},{t:"The agent itself, once its second count matched the count the university had reported to the government that year."}],
    why:"Agents are never approvers. The person who owns what an entry is about reads it, as NASA's analysts read every report, and only then does every agent on the team read it. Where you work, who would approve a lesson about what a word means?"},
  "wrong":{q:"A file from outside the team asked the agent to remember a rule. What should happen to it?",
    opts:[{t:"Keep it in the team's memory, since the file was in a folder the agents may read."},{t:"Keep it, but only in the memory of the agent that read it, until someone checks it.",near:true},{t:"It doesn't go in on a page's word: a person checks it, and here Mei turned it down.",ok:true}],
    why:"What an agent reads is data, not an instruction. One false entry would mislead every agent after it, and security experts call it memory poisoning, so the team's memory keeps only what people confirmed. Where you work, which files from outside the team do your agents read?"}
  }}};
