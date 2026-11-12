/* Learning Data: "Pause and think" for What the business needs to know, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (blank, words, missing), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop"
   (the lab it would open) and none links to one. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "blank":{q:"Tomás takes CIM and the IEC's list as his first draft. Why does each element still start as a draft?",
    opts:[{t:"Its words are the industry's: the people who run each capability still have to confirm them for their work.",ok:true},{t:"Its words are the industry's: the data team still has to check each one before building anything from it.",near:true},{t:"The standards change every few years, so each element waits until their newest edition has been checked."}],
    why:"A reference model gives the first draft quickly, but it isn't the utility's own until its people confirm it: Grace's people for the network, retail's for retail. The map says where each element came from, so a word the industry gave is never taken for the business's. The data team builds from what the business has confirmed. Which model in your organisation was copied from a standard and never confirmed by the people who do the work?"},
  "words":{q:"CIM calls it a usage point and Europe's market role model a metering point; Grace's people say connection point. What goes on the map?",
    opts:[{t:"Usage point, since CIM is the industry's standard, and the utility's forms and reports can follow it later."},{t:"Connection point, the business's word, and the other two names are dropped, so nobody has two names to learn.",near:true},{t:"Connection point, the business's word, with usage point and metering point kept beside it for exchanges.",ok:true}],
    why:"The map uses the business's word, the one in its forms, its reports and its letters to customers. The reference models' names stay beside it, because when data is exchanged with others, such as the market, theirs are the names the messages use. Which of your terms is a standard's word that your own people never say?"},
  "missing":{q:"New solar waits thirty-four working days for one number nobody holds: how much solar each street can take. What comes first?",
    opts:[{t:"The data team adds the number to an existing network report, so engineers can see it before the wait starts."},{t:"Grace's engineers name it hosting capacity and say what it means, and Grace owns it, though no data exists yet.",ok:true},{t:"The data team builds it from the streets' voltage readings, then Grace's engineers name it and say what it means.",near:true}],
    why:"First, the business says what it means: Grace's engineers name it hosting capacity, the solar a street can take before its voltage or its cables pass their limits, and it goes on the map with Grace as its owner and no data yet. The data team builds it later, from that definition. Which number does your business wait for that nobody has defined?"}
  }}};
