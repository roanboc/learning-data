/* Learning Data: "Pause and think" for Start from a question, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (ask, slice, owners, split), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). Each "stop" is this film's own lab that teaches the same idea;
   the page's .player data-labs says where those labs are. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "ask":{stop:"scope",q:"Why does a question need a decision behind it?",
    opts:[{t:"So the request sounds important enough to be worth building."},{t:"The decision says how exact, how fresh and how far back the answer must be, and gives a number to reach.",ok:true},{t:"It doesn't: any clear question is enough to start modelling."}],
    why:"A question with no decision has no “done”. Planning's decision (places in each faculty's final units) sets the date, census, and the number to reach, the census report's twelve."},
  "slice":{stop:"slice",q:"Planning now asks about fees too. Which entity do you add to this model?",
    opts:[{t:"Fee: it's the same learners, so it fits."},{t:"None, yet. Fees are a new question, with its own slice and its own owners.",ok:true},{t:"Fee and enrolment, to be safe."}],
    why:"Don't stretch this question to cover the next. Finish it; then the fee question gets its own decision, slice and owners, and extends the model."},
  "owners":{stop:"owners",q:"Why name the owner of each meaning before looking at the data?",
    opts:[{t:"So the owner can be blamed if the numbers are wrong."},{t:"The sources will disagree. Someone has to decide which meaning wins, and that person must be known before the argument starts.",ok:true},{t:"It's a formality: the data team decides in the end."}],
    why:"Three systems will say three things about one learner. Mei owns learner, credential and award, so when they disagree, the decision is hers, not the loudest source's."},
  "split":{stop:"kinds",q:"A badge carries no credit points. Should it be its own entity?",
    opts:[{t:"Yes: without credit points it's a different thing."},{t:"No: it has the same identity and lifecycle as any credential. Credit points are an attribute, not a reason to split.",ok:true},{t:"Leave badges out of the model."}],
    why:"Identified by its issuer's identifier, issued on a date, maybe revoked: a badge is a kind of credential. Split only for a different identity, grain or lifecycle."}
  }}};
