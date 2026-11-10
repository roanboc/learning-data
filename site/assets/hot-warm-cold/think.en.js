/* Learning Data: "Pause and think" for Hot, warm, cold, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (hot, warm, cold), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "hot":{q:"The claims app must see a contract change within a minute, so contracts are kept hot. Why not keep all the university's data hot, just in case?",
    opts:[{t:"Few questions need the minute, but a stream costs no more to run than a nightly load.",near:true},{t:"Hot costs the most, since something is always running, and few questions need the minute.",ok:true},{t:"A streaming table holds only one kind of data, so each kind would need a platform of its own."}],
    why:"To keep data fresh to the minute, something has to run all the time: here, the pipeline, in continuous mode. That's worth it where a minute matters, like a contract the claims app checks before noon on Monday, and wasted where yesterday's figures are fresh enough. Where you work, which data truly needs the minute?"},
  "warm":{q:"What each faculty has spent is now a materialized view, worked out each night at two. Why is that better than reading the ledger at every look?",
    opts:[{t:"Yesterday's figures are fresh enough, so the answer is worked out once and ready to read.",ok:true},{t:"A view is always fresher than the ledger, since it changes the moment Finance posts a line."},{t:"Yesterday's figures are fresh enough, so the view keeps a full copy of the ledger to read.",near:true}],
    why:"Finance and the faculties' managers look each morning, and yesterday's figures answer them. Worked out once a night, from the ledger read in place, the view keeps only the answer, one row per faculty: each look is quick, and the ledger is left alone while Finance works in it. Where you work, which report is read far more often than its data changes?"},
  "cold":{q:"Pay records more than a year old now sit in the archive tier, the cloud's cheapest. What does the university give up for that?",
    opts:[{t:"The right to delete them: once archived, the records must be kept for good, past seven years."},{t:"Nothing: an archived year reads as fast as a recent one, since the table knows where its files are.",near:true},{t:"Speed: an archived year takes hours to bring back before it's read, which is fine for an audit.",ok:true}],
    why:"The archive tier is the cheapest place to keep data, and the slowest to read: a file there can't be read until it's brought back, which takes hours. For pay records read once in a while, for an audit, that's a fair trade, and they're still deleted when their seven years are up. Where you work, what's kept for years but rarely read?"}
  }}};
