/* Learning Data: "Pause and think" for Why Unity Catalog and Unity Gateway govern them, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (holds, name, gateway), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "holds":{q:"The project's page already tells agents never to copy names into a prompt. Why does the team also enforce it on the platform?",
    opts:[{t:"Because agents never follow written rules."},{t:"A rule an agent is told is a request: it can misread it, lose it, or be talked out of it. A rule the platform enforces holds, whatever the agent is told.",ok:true},{t:"So the page for agents can be deleted."}],
    why:"The page still matters: it tells the agent how to work well. But only what the platform enforces holds when an agent misreads, forgets or is tricked: it can't copy a name it only ever sees as stars. Which of your team's rules live only in what people, or agents, are told?"},
  "name":{q:"Mei's agent answers questions at night, on its own. Why does it need a name of its own, not her personal key?",
    opts:[{t:"On her key, it can read everything she can, and its reads look like hers. With its own name, it gets only what its job needs, its work shows as its own, and it can be stopped alone.",ok:true},{t:"Because a service principal answers faster than a person's key."},{t:"Because Mei shouldn't answer for it any more."}],
    why:"On her key, it could read everything Mei can, though all it needed was counts, and the log took its 2,300 Sunday reads for hers. As a service principal, it gets only the grants its job needs, the log names it, and Sam can switch it off while everyone else works on. Mei still owns it, and answers for what it does. An agent that helps one person while they're there may use their sign-in. Does any software where you work sign in as a person?"},
  "gateway":{q:"The registrar agent now calls its model through Unity Gateway. What does the registrar's office gain?",
    opts:[{t:"Faster answers, because the gateway picks a better model."},{t:"Nothing it didn't have with Mei's key."},{t:"It may call only the model it's granted; checks hide an email address or stop the call, and look for words written to trick it; a limit caps its calls; and every call is counted under its name, in the office's own budget.",ok:true}],
    why:"On Mei's key, the agent's calls came from no one's budget, and no one saw what they carried. In Unity Gateway, each model is a service in the catalog, granted like a table; its checks look at what goes in and what comes out; and the gateway's own table shows every call and its tokens under the agent's name: about 300 dollars a month, from the registrar's own budget. Who pays for your team's model calls, and could you tell which agent made them?"}
  }}};
