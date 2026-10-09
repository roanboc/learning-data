/* Learning Data: "Pause and think" for What it must be able to do, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (who, how, heat), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "who":{q:"“Network Operations” is a box on Tomás's first capability map. What's wrong with it?",
    opts:[{t:"Nothing: it's what the team does."},{t:"It should be split into two boxes."},{t:"It's a team, who does the work. Teams change; what must be done stays.",ok:true}],
    why:"Grace's team was two teams two years ago, and may be part of another next year. A capability is what must be done, whoever does it. Think of the last restructure where you work: what did the organisation still have to be able to do afterwards?"},
  "how":{q:"“Run the outage system” and “Dispatch through the control room”: what one capability sits under both?",
    opts:[{t:"Manage outages.",ok:true},{t:"Run the control room."},{t:"Buy a new outage system."}],
    why:"The first names a system: with what. The second names a process: how. A capability survives a restructure, a new system and a new process; if a box wouldn't, it isn't one."},
  "heat":{q:"Connecting customers is red on the heat map. What makes that colour worth acting on?",
    opts:[{t:"Red always means the team is failing."},{t:"Its evidence: new solar takes thirty-four working days to connect, and the goal is ten.",ok:true},{t:"Most people voted for red."}],
    why:"Each colour is backed by evidence, like every note on the wall. A heat map shows where it hurts, so it shows where the money should go. Where does your organisation hurt today, and what evidence would you clip to that card?"}
  }}};
