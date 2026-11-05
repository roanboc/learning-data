/* Learning Data: "Pause and think" for Who it serves, and how it pays, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (segments, fit, pays), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). A question's "stop" is the lab of the series it opens, on the
   series' labs page (the page's .player data-labs is "../labs/"); a question without one has no lab link. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "segments":{stop:"fit",q:"A tenant uses the power and pays the bill, the landlord decides on solar panels, and the regulator sets the price. What does that tell you about customers?",
    opts:[{t:"Who pays, who uses and who decides are often different people.",ok:true},{t:"The regulator is the customer that matters most."},{t:"The tenant is the customer, and the others are partners.",near:true}],
    why:"Segments come from looking at all three. The minister and the regulator matter as much, but they aren't customers: they get their own place on the map. Where you work, are they the same people?"},
  "fit":{stop:"fit",q:"On the canvas for homes with solar, one pain has nothing to relieve it: waiting months to connect new panels. What must the canvas say?",
    opts:[{t:"That it's a missing capability, to be built first, before any other pain is looked at.",near:true},{t:"Whether it's a missing capability, or a customer the utility has decided not to serve.",ok:true},{t:"Nothing: one gap on a canvas doesn't change the value it offers those homes."}],
    why:"Fit is a rule: every pain needs something that relieves it. Farah is clear that they serve these homes, so it's a missing capability, and it goes on the list."},
  "pays":{q:"Why does each offering get its own business model canvas, instead of one for the whole utility?",
    opts:[{t:"Because each offering has its own customers, though the costs are shared across the utility.",near:true},{t:"Because the regulator requires a separate canvas for each of the utility's offerings."},{t:"Because each offering has its own economics: who pays, what it earns, and its biggest cost.",ok:true}],
    why:"The network earns what the regulator allows, retail earns from tariffs, and the government pays for the hardship plan. One canvas would blur them. Do two of your offerings share one budget line?"}
  }}};
