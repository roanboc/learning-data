/* Learning Data: "Pause and think" for Why it moves, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (means, goals, principles), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "means":{q:"“A third of the poles are over fifty years old.” What turns a driver into an assessment like this one?",
    opts:[{t:"Working out what the driver means here, with a source for the evidence.",ok:true},{t:"A strong opinion from someone senior."},{t:"Putting it on a slide."}],
    why:"A driver, such as ageing assets, says nothing until someone works out what it means here, and every assessment has a source. Without the evidence, it's just an opinion."},
  "goals":{q:"“Keep bills affordable” is a goal. What makes it something anyone can check?",
    opts:[{t:"Repeating it in every plan."},{t:"Handing it to a committee."},{t:"An outcome with a number and a date: the network charge on a household bill no higher in real terms in 2030.",ok:true}],
    why:"A goal is a direction; an outcome says how anyone will know it's been reached. If no one can say how an outcome will be checked, it isn't one yet. Take one of your goals: what outcome would show it, and who could check it?"},
  "principles":{q:"Why isn't “Be sustainable” a principle?",
    opts:[{t:"It's too long."},{t:"Nothing could ever fail it, so it can't settle a choice.",ok:true},{t:"Sustainability is a goal, not a value."}],
    why:"A principle is a rule every choice is checked against. Checked against Ama's three, the new line isn't the first option; upgrading the old line, with batteries in the valley, is. Could any decision ever fail one of your principles?"}
  }}};
