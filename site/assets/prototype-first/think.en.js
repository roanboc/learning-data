/* Learning Data: "Pause and think" for Prototype first, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (real, rounds, enough), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  real:{q:"On 7 April, the agent's first draft counts every booked hour as a used one. How is that caught, before anyone builds on it?",
    opts:[{t:"Jun finds it when he reviews the change that day, since a reviewer is there to catch what the author missed."},{t:"Ivy reads the agent's notes to the end herself, and checks its draft against what the sensors counted.",ok:true},{t:"Ivy asks the agent to check its own draft against the sensors, and it reports the hours it got wrong.",near:true}],
    why:"Fast isn't careless. The agent proposes and people check: Ivy read its notes to the end, where it said what it had assumed, and checked the draft against the head counts herself. Then room use, as Graham means it, went into the glossary, the model was built from it, and Jun reviewed Ivy's change: no one approved their own work. Where would a wrong assumption hide in a draft you didn't write?"},
  rounds:{q:"Every Friday, Helena asks Graham the same question: what would change your mind? What does his answer give the team?",
    opts:[{t:"What the next round has to show, and a way to know when there's enough for his decision.",ok:true},{t:"What the next round has to show, so the dashboard gains one more chart every week until Easter.",near:true},{t:"A full list of what the dashboard must do, so the team can build it all before he looks again."}],
    why:"His answer turns a vague ask into a test the data can pass or fail: full all week, or not; then, will it still hold in 2030? Each round answers one such question with the real thing on the screen, and when his decision is served, the rounds stop: a fourth would only polish it. What would change the mind of the person waiting for your work?"},
  enough:{q:"After the third round, the rounds stop. What stays from the prototype?",
    opts:[{t:"The reviewed model and the dashboard, with what room use means written in the team's own notes.",near:true},{t:"Only the lessons: a prototype is thrown away, and the product is built again from the start."},{t:"The definition in the glossary, the reviewed model, and a dashboard that Ivy owns from July.",ok:true}],
    why:"The prototype was built properly from the first day: real data, governed, a definition owned by Graham in the glossary, and a model built from it and reviewed by Jun. So nothing is thrown away. What it taught stays in the product, and the dashboard becomes a product of its own, with Ivy as its owner. What would your prototype leave behind if it stopped this Friday?"}
  }}};
