/* Learning Data: "Pause and think" for Promises and proofs, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (gaps, enterprise, tests, levels), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). Each "stop" is this film's own lab that teaches the same idea;
   the page's .player data-labs says where those labs are. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "gaps":{stop:"decide",q:"Why is “accept and document” a real decision, not giving up?",
    opts:[{t:"It isn't: it means the gap was too hard to fix."},{t:"The owner makes it, with a reason, and it tells every consumer what the data can't do.",ok:true},{t:"It's a placeholder until someone writes a rule."}],
    why:"Gap 10: no source records an expiry, so nothing in the model can say a credential has expired, and the register says so. An unwritten gap surprises someone later."},
  "enterprise":{stop:"contract",q:"Who can change a public contract, and how?",
    opts:[{t:"Anyone who needs a column changed, by editing the YAML."},{t:"Its owner, with a new version beside the old one, and a date for the old one to go.",ok:true},{t:"Nobody: a public contract can never change."}],
    why:"A breaking change isn't an edit in place: it arrives as a new version, and consumers move in their own time. A later film shows how."},
  "tests":{stop:"catch",q:"Why write the tests before the model?",
    opts:[{t:"So there's something to run while the SQL is written."},{t:"They say what done is, in a form a machine can check; the code's job is then to turn them green.",ok:true},{t:"Because dbt won't build a model without its tests."}],
    why:"Written first, and reviewed by the people who own the data, the tests fix what done means. Nobody can quietly redefine done to fit the code."},
  "levels":{stop:"levels",q:"Who sets a test's severity?",
    opts:[{t:"The engineer whose build it blocks."},{t:"The data's owner, with a reason, written in the test's description and the decisions log.",ok:true},{t:"Nobody: every failing test stops the build."}],
    why:"Here the learning team decided: warn on any enrolment with no email, stop above five. Not the person whose build it's blocking."}
  }}};
