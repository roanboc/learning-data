/* Learning Data: "Pause and think" for Who it serves, and how it pays, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (segments, fit, pays), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "segments":{q:"A tenant uses the power and pays the bill, the landlord decides on solar panels, and the regulator sets the price. What does that tell you about customers?",
    opts:[{t:"The tenant is the only customer."},{t:"The regulator is a customer segment."},{t:"Who pays, who uses and who decides are often different people.",ok:true}],
    why:"Segments come from looking at all three. The minister and the regulator matter as much, but they aren't customers: they get their own place on the map. Where you work, are they the same people?"},
  "fit":{q:"On the canvas for homes with solar, one pain has nothing to relieve it: waiting months to connect new panels. What must the canvas say?",
    opts:[{t:"Nothing: one gap doesn't matter."},{t:"Whether it's a missing capability, or a customer the utility has decided not to serve.",ok:true},{t:"That those homes should come off the canvas."}],
    why:"Fit is a rule: every pain needs something that relieves it. Farah is clear that they serve these homes, so it's a missing capability, and it goes on the list."},
  "pays":{q:"Why does each offering get its own business model canvas, instead of one for the whole utility?",
    opts:[{t:"Because each offering has its own economics: who pays, what it earns, and its biggest cost.",ok:true},{t:"Because each team wants its own."},{t:"Because the regulator requires it."}],
    why:"The network earns what the regulator allows, retail earns from tariffs, and the government pays for the hardship plan. One canvas would blur them. Do two of your offerings share one budget line?"}
  }}};
