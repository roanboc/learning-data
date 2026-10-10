/* Learning Data: "Pause and think" for Who does it, and where meaning changes, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (names, agent, one), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "names":{q:"Tomás wrote “Sam” on the step “decide who goes first”. Why did Grace cross it out?",
    opts:[{t:"Sam got the decision wrong."},{t:"A step is done by a role, the duty controller; Sam is only the actor who filled it that night.",ok:true},{t:"Steps shouldn't say who does them at all."}],
    why:"Next week someone else is on the night shift, and the step doesn't change. Roles stay; actors, people or teams, come and go. In your own process maps, how many steps carry a person's name?"},
  "agent":{q:"The agent groups the outage reports and proposes an order. A report says a wire is down. What happens?",
    opts:[{t:"The agent sends the nearest crew."},{t:"The agent ranks it with the others, by the number of reports."},{t:"It goes straight to the duty controller: the agent recommends, and a person decides.",ok:true}],
    why:"An AI agent is an actor like any other, with its rights written down: it may group reports and propose; it may not send a crew; wires down and life support are escalated. If an agent works with your team, where are its rights written, and who owns them?"},
  "one":{q:"Why not one definition of “customer” for the whole utility?",
    opts:[{t:"It would fit neither side, and it would carry what the network knows across the wall.",ok:true},{t:"Because a definition would take too long to agree."},{t:"Because only retail has customers."}],
    why:"Retail's customer is an account holder; the network's is a connection point. Each domain keeps its own meaning, and the edge gets a translation: a short, agreed list of what crosses, and how. Where does one word mean two things where you work?"}
  }}};
