/* Learning Data: "Pause and think" for One language, kept, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (fourth, model, kept), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). A question's "stop" is the lab of the series it opens, on the series' labs page;
   a question without one has no lab link. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  fourth:{stop:"names",q:"The app team's first table is called customer. Why does the review stop it before it reaches a table?",
    opts:[{t:"Customer is retail's word, so only the head of retail's team may build a table called that.",near:true},{t:"Customer already means three things here, so anyone would read the table as one of them.",ok:true},{t:"Names need three parts, and customer is one word, too short to pass the naming rules."}],
    why:"The trouble isn't who may use the word, or how long it is: customer already means three things at the utility, an account holder, a connection point and a contact, so a table called just customer would be read as any of them. The last time one thing had six names, the January storm's texts missed 180 households. The review catches it from what the data architecture keeps with the map, before it reaches a table."},
  model:{q:"The utility keeps its own words, and maps each to the Common Information Model. What does that give it?",
    opts:[{t:"Its tables can all be renamed in the model's words, so the glossary is no longer needed."},{t:"It can drop its own words over time, since the model's are the industry's standard names.",near:true},{t:"A new system or a partner can be matched to its words, through words they already know.",ok:true}],
    why:"A reference model is the industry's shared words, not a replacement for the utility's own. The utility keeps its words, defined once in its glossary, and maps each to the model: a connection point to a usage point, an account holder to a customer. So a new system or a partner that speaks the model's words can be matched to the utility's. Whoever signs in to the app is none of the three words it maps: a new concept, which needs its own name and an owner."},
  kept:{q:"The app team needs a table for everyone who signs in. What comes first?",
    opts:[{t:"The head of retail defines app user in the glossary, asked in a ticket; then the table is built.",ok:true},{t:"The data team chooses a clear name in its review, since it checks every name before a table.",near:true},{t:"The app team names it as it needs, and the glossary is brought up to date after the release."}],
    why:"What a new term means is the business's to decide, not the team that builds or reviews the code. So the app team asks retail in a ticket, the head of retail defines app user in the glossary first, and the table is built from it. Then the check passes, because the name is in the glossary, and the data team's review passes. On the map, app user joins retail's concepts, with its owner and a link to decision 7."}
  }}};
