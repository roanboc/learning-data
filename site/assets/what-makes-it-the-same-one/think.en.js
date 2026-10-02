/* Learning Data: "Pause and think" for What makes it the same one, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (profile, sets, apart, hash), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). Each "stop" is this film's own lab that teaches the same idea;
   the page's .player data-labs says where those labs are. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "profile":{stop:"claims",q:"Why keep the query beside each claim about the data?",
    opts:[{t:"So the claim looks more technical."},{t:"So anyone can run it again and see the same result.",ok:true},{t:"Because the query is faster than asking the source team."}],
    why:"A claim without its query is a guess, and a reviewer treats it as one. With the query and its result, anyone can check it, today or next year."},
  "sets":{stop:"same",q:"S-20417 on the platform and S-20417 in the student system: always the same learner?",
    opts:[{t:"Yes: the same ID is the same person."},{t:"Only if the platform's field really holds the student ID, and was typed right.",ok:true},{t:"No: keys from two systems never match."}],
    why:"Qualify each key by its key set first, so nothing is confused by accident. Then decide by a rule, or by a person when the rule can't be trusted."},
  "apart":{stop:"same",q:"Every test passed. How did the wrong merge get through?",
    opts:[{t:"A test was switched off."},{t:"No test knew the two were different people, until a person wrote it down.",ok:true},{t:"The tests ran on old data."}],
    why:"Tests only check what's written down. Mei's decision became a row of data, the code reads it, and a test now fails if the two ever merge again."},
  "hash":{stop:"hash",q:"Why keep the readable key beside the hash?",
    opts:[{t:"In case the hash function changes."},{t:"A hash can't be read or checked by eye; the key beside it traces any row back to its source.",ok:true},{t:"Because hashes can collide often."}],
    why:"0905e6e2… tells nobody anything. SIS|S-20417 beside it can be read, checked against the source, and hashed again to prove the match."}
  }}};
