/* Learning Data: "Pause and think" for The AI platform, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (test, gateway, swap), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). A question's "stop" is the lab of the series it opens, on the
   series' labs page (the page's .player data-labs is "../labs/"); a question without one has no lab link. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  test:{stop:"platform",q:"Which of these is the platform's, and not one agent's own?",
    opts:[{t:"The crew planner's instructions, which say how it drafts each week's rosters."},{t:"A model the crew planner reaches with a key kept in its own script.",near:true},{t:"Search over the utility's documents, which any agent may call to find a page.",ok:true}],
    why:"A capability that serves no single purpose, and that many agents can use, is the platform's: a model, tools, memory and search. What each agent is for, its purpose, its instructions and the logic of its tasks, stays its own: an application, with an owner. A model is shared too, but only once it's reached the platform's way: a key in one agent's script is how a retired model surprised everyone. In your organisation, which capability do several agents each reach in their own way?"},
  gateway:{stop:"platform",q:"Every call to a model now goes through the gateway. What does it do with each call?",
    opts:[{t:"Takes it under the agent's own identity, writes it down, and keeps it within limits.",ok:true},{t:"Lets each agent choose any model it likes, and writes down which one it chose.",near:true},{t:"Checks the answer the model writes, and sends it to the agent's owner to approve."}],
    why:"The gateway is one door to every model. Each call comes in under the agent's own identity; it's written down (which agent, which model, when, and what it cost); and each agent stays within its limits. It reaches only the models the utility has terms with, so an agent can't pick any model it likes, and it doesn't approve answers: what an agent does stays with its owner. Could your organisation say, today, which agent called which model yesterday?"},
  swap:{stop:"platform",q:"A model is retired. Who agrees that the crew planner moves to the replacement?",
    opts:[{t:"Ravi's team, because it runs the platform and holds the contracts with the providers.",near:true},{t:"Grace, who owns the crew planner, after looking at the results of its own checks.",ok:true},{t:"The provider, which retires the old model and names the one that replaces it."}],
    why:"Ravi's team runs the platform: from the gateway's log it finds which agents call the retired model, and it tries the replacement on each agent's own checks. But each agent's owner answers for what it does, so each owner looks at the results and agrees before it moves: Grace, for the crew planner. The platform is shared; what each agent does stays its owner's. For an agent you know, who would agree to a change of its model?"}
  }}};
