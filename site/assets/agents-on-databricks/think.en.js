/* Learning Data: "Pause and think" for Working with agents on Databricks, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (ask, tools, build), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "ask":{q:"The Census day agent is tested on the questions behind Health's three answers. Why test it on mistakes other agents made?",
    opts:[{t:"Because they're the traps a real question falls into, each with its right answer in SQL.",ok:true},{t:"Because the agent learns from those tests, so it won't make the same mistakes.",near:true},{t:"Because those agents were tested on them too, so the two scores can be compared."}],
    why:"Load read as people and a joint degree counted in a faculty are the traps a real question falls into. Each test has its right answer in SQL, so after every change the team sees at once whether the agent still gets them right, before anyone relies on it. Which wrong answers would make good tests where you work?"},
  "tools":{q:"The data team wrote the census count once, as a function. Why not let each agent write its own query?",
    opts:[{t:"Agents write good queries, but a function is quicker to run.",near:true},{t:"Each agent writing its own count is how Health got three answers.",ok:true},{t:"Each agent's query is checked anyway, so one function saves the review."}],
    why:"A count is a known job, so a plain, tested function does it the same way every time. Written once, every agent that calls it gets the same number, and its comment says what it counts. Which count do people where you work write again and again?"},
  "build":{q:"The census check agent passes its evaluation. Why does Jun still decide what its note means?",
    opts:[{t:"Because Jun wrote its evaluation, so only Jun can read its notes."},{t:"Because it passed on past cases, but not yet on enough of them to decide.",near:true},{t:"Because its note is evidence, and a person decides what it means.",ok:true}],
    why:"The evaluation shows how the agent did on past cases, not that it's right tonight. Its note is evidence: the rows, the queries and every step it took. An agent never approves: a person reads the evidence and decides, and any fix to production is reviewed by a person and approved by a second. Who reads the evidence before a decision where you work?"}
  }}};
