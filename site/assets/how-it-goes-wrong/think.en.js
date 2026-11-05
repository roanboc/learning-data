/* Learning Data: "Pause and think" for How it goes wrong, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (number, ticket, loop), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "number":{q:"The agent answered 2,911 at once, and sounded sure. What would have shown it was wrong before Clara used it?",
    opts:[{t:"Asking the agent again, more firmly."},{t:"Its query, which counted every degree with Health in its name, and a second way to reach the number: the census team's report says 2,880.",ok:true},{t:"Nothing: an agent that sounds sure is usually right."}],
    why:"Its query shows what it counted: every degree with Health in its name, so the 31 students of the joint degree Health data, who belong to no faculty, came in too. The census team's own report says 2,880. Where the two differ, it isn't an answer yet; it's a question for a person. Sounding sure is not evidence. Which numbers does your team send on without a second way to reach them?"},
  "ticket":{q:"Why isn't it enough to tell the agent to ignore instructions hidden in what it reads?",
    opts:[{t:"Because agents never follow the rules they're given."},{t:"It is enough: a well-written rule always works."},{t:"A model can't always tell an order from data, and a hidden line can be written to fool it. So what it reads is data, never orders, and its hands can't send anything out anyway.",ok:true}],
    why:"A hidden line can claim to come from anyone, and a model can't always tell an order from data. So the design doesn't rely on the model: what it reads is treated as data, never orders, and it reports what it finds. And its hands couldn't do harm anyway: names come masked, it gets counts and small samples, and no tool can send anything out. Where could a line like that reach an agent where you work?"},
  "loop":{q:"The agent's loop had a limit of ten rounds, yet it ran all night and spent a week's budget. What was missing?",
    opts:[{t:"A faster model, so the ten rounds would end sooner."},{t:"Limits on time and money as well as rounds, a stop when the same error comes back, and a plain check before it starts.",ok:true},{t:"More rounds, so it could find the cause."}],
    why:"No code could fix the cause: the student system's copy hadn't arrived. Ten rounds of the same error ran from eleven to six, because its limit counted rounds and nothing else. Now every loop has limits on rounds, time and money, and stops when the same error comes back; and a plain check runs first, sees in a second that the copy isn't there, and tells Sam. Which of your jobs could a plain check stop before it starts?"}
  }}};
