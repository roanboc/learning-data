/* Learning Data: "Pause and think" for Many agents, and what emerges, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (little, many, board, alive), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "little":{q:"No starling leads the flock. So how does the whole flock turn together?",
    opts:[{t:"Each bird keeps to its six or seven nearest neighbours, so a turn passes from bird to bird.",ok:true},{t:"Each bird watches the whole flock at once, so every bird sees a turn as it starts.",near:true},{t:"It follows the oldest bird at the front, which knows the way and sets each turn."}],
    why:"A turn passes from neighbour to neighbour, so the whole flock turns as one, with no leader and no plan: the whole does what no part planned. Where you work, what happens because many people each follow a few simple habits, with no one planning it?"},
  "many":{q:"Tested alone, no agent in the naming study leaned towards any name. Why did the group lean anyway?",
    opts:[{t:"The researchers picked one name for them, and the agents simply followed it."},{t:"Each agent had a lean too small to show alone, and the group added them up.",near:true},{t:"The lean came from how the agents met and copied each other, not from any one of them.",ok:true}],
    why:"A group can do what none of its parts does alone, and you only see it by testing the group, working the way it will really work. Where you work, which check looks at each part alone, and would miss what the parts do together?"},
  "board":{q:"The checking agent caught the wrong word. So why did Clara, not the checking agent, approve the reasons?",
    opts:[{t:"The checking agent could approve, but the reasons were Clara's drafts, so she approved her own work once the flag was fixed.",near:true},{t:"Agents are never approvers: the reasons go to the council, so a person who answers for them decides, with the flag in front of her.",ok:true},{t:"The checking agent wasn't sure enough to approve, and an agent approves only when it is fully sure of what it checked."}],
    why:"The agents drafted and the checking agent flagged; Clara decided, and she answers for the reasons. The flag helped her decide, and a plain test now catches the next degree with no faculty, without an agent. Where you work, who signs off on what an agent drafts?"},
  "alive":{q:"By Maturana and Varela's answer, is a team of agents alive?",
    opts:[{t:"No: a living thing keeps making the parts that make it, and today's agents are made, started and stopped by people.",ok:true},{t:"Yes, in part: a team of agents keeps itself going while it runs, so it is alive until a person stops it.",near:true},{t:"Yes: it acts on its own and does things no one planned, which is what Maturana and Varela meant by alive."}],
    why:"Doing what no one planned is emergence, not life. A cell keeps making itself; today's agents don't make or mend themselves, and they run only because we run them. What would have to change before you'd call a machine alive?"}
  }}};
