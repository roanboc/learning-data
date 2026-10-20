/* Learning Data: "Pause and think" for Now the questions appear, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (up, count, build), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). A question's "stop" is the lab of the series it opens, on the
   series' labs page (the page's .player data-labs is "../labs/"); a question without one has no lab link. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "up":{stop:"skipper",q:"The next request is a dashboard of every outage, refreshed every minute, for the screen in the lobby. Why does it reach nothing?",
    opts:[{t:"Refreshing it every minute would cost too much."},{t:"No one will decide anything with it, so it reaches no decision, and no goal.",ok:true},{t:"The lobby isn't on the map."}],
    why:"A request matters when someone will decide something with its answer, in time. Traced up, the planners' question reaches a decision, a capability and a goal. The lobby's dashboard is as live as the skipper's call, but no one decides anything with it, so it finds no decision at all. Traced up, which of your team's reports would reach a decision?"},
  "count":{stop:"navigator",q:"Two reports count the days to connect new solar: thirty-four, and twenty-one. Which one is wrong?",
    opts:[{t:"The connections report: thirty-four days is too slow to be true."},{t:"Neither: each starts and stops the clock at a different moment, and the measure needs one definition, written down.",ok:true},{t:"The network report: twenty-one is too good to be true."}],
    why:"Both are right about what they count, and neither is the measure. Grace writes it down once: from a complete application to the new meter, in working days, Monday to Friday, not public holidays. Then everyone who counts it gets the same number. Which number does your organisation count two ways?"},
  "build":{q:"Twenty-one requests reach a decision. Why do they need four data products, not twenty-one reports?",
    opts:[{t:"Four are cheaper to build than twenty-one."},{t:"Grouped by capability and domain, each product answers many questions, has one owner, and stays on its own side of the wall.",ok:true},{t:"The twenty-one reports would all be the same."}],
    why:"Built request by request, each report is kept by someone different. Scoped by capability and domain, a data product answers many questions, has one owner, and keeps each domain's meaning on its own side of the wall. How are your data products scoped today?"}
  }}};
