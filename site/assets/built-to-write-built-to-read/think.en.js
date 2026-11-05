/* Learning Data: "Pause and think" for Built to write, built to read, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (ledger, wrong, read, side), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). Each "stop" is this film's own lab that teaches the same idea;
   the page's .player data-labs says where those labs are. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "ledger":{stop:"faster",q:"The journal lists every entry in time order; the ledger holds the same entries, grouped by account. Why keep both?",
    opts:[{t:"Each book checks the other: if the two totals differ, a clerk knows an entry was lost and looks for it in both."},{t:"Each shape makes one job easy: the journal, writing each entry as it happens; the ledger, reading and balancing an account.",ok:true},{t:"The ledger is the true record, and the journal is a draft kept only until each entry has been copied into its account.",near:true}],
    why:"One set of facts, two shapes, two jobs. And because every entry is posted twice, the balance catches a figure copied wrong on one side (though not an entry left out altogether)."},
  "wrong":{stop:"update",q:"Her name was stored on three award rows, and only two were corrected. What would have prevented the missed copy?",
    opts:[{t:"Storing the name once, in the learner record, with each award pointing to the learner.",ok:true},{t:"Storing the name on each award, with a nightly check that all of a learner's copies match.",near:true},{t:"Correcting every copy at once in one statement, so none of the three rows is missed."}],
    why:"When a fact lives in one place, there's no copy to miss. That's what normalisation is for, in a shape built to write."},
  "read":{stop:"grain",q:"The question is: credit points by kind of credential and by month. Which are the facts, and which the dimensions?",
    opts:[{t:"The facts are credit points and the month; the dimension is the kind of credential.",near:true},{t:"The facts are the kind and the month; the dimension is credit points."},{t:"The fact is credit points; the dimensions are the kind of credential and the month.",ok:true}],
    why:"Facts are what you add up; dimensions are the words after “by”. Credit points are summed, by kind and by month."},
  "side":{stop:"faster",q:"Correcting a faculty's name takes one edit in the normalised shape, and thousands of rows in the star. Is the star badly designed?",
    opts:[{t:"No: it repeats the name, but the star links back to the normalised shape, so one edit there corrects every row.",near:true},{t:"No: it repeats the name on purpose, so reading needs fewer joins. The price is paid when names change, in a reload.",ok:true},{t:"Yes: a well-designed star stores each name once, in its dimension, and each fact row points to it."}],
    why:"Each shape is fast at its own job. The star trades cheap reading for costlier corrections, which is why the two shapes are kept side by side, from one model."}
  }}};
