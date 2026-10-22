/* Learning Data: "Pause and think" for Who is it?, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (words, golden, weights, aisha), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series' labs and scenarios are its own, for all its films
   (assets/master-and-reference-data/), so no question has a "stop"; the page's .player data-labs leads to them. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "words":{q:"The university keeps a list of countries, and a list of partner universities, each with contacts, agreements and renewal dates. Which is master data?",
    opts:[{t:"The countries: every system uses them."},{t:"The partner universities: each has its own details, an owner and a life of its own, and two systems could hold the same partner under two names.",ok:true},{t:"Neither: both are only lists."}],
    why:"You'd ask of a partner, \"is this the same one as that?\", so it's master data. The countries come from a standard, and you only pick one from the list, so they're reference data. Think of a list at your work that has grown owners and dates: is it still a list?"},
  "golden":{q:"Linh's master record shows her work email, labelled \"HR\", and HR's own record stays as it arrived. Why both?",
    opts:[{t:"To keep two copies, in case one is lost."},{t:"The label says where the value came from, so it can be explained and checked; the source record stays, so a link can be undone and HR's system keeps working.",ok:true},{t:"Because HR won't allow its records to be merged."}],
    why:"A golden record isn't a copy of the best system's row. Each value says where it came from, and each source record stays as it arrived, so the record can be explained, value by value, and undone, link by link. If it were only a copy, what would you lose?"},
  "weights":{q:"The same family name, Nguyen, adds 2; the same given name, Linh, adds 3.2. Why does the family name count for less?",
    opts:[{t:"Family names matter less than given names."},{t:"Many people share a common family name, so two different people agree on it often by chance, and an agreement that's common says less.",ok:true},{t:"The two records spell it differently."}],
    why:"A weight measures how much more often a value agrees for the same person than for two different people. A common name agrees by chance a lot, and the check compared only records whose family names sound alike, so agreeing on it says less. Would a match on your own name say a lot, or a little?"},
  "aisha":{q:"The two Aishas' records still share a student number. Why should Mei's \"not the same\" stop the pair coming back?",
    opts:[{t:"So the queue looks shorter."},{t:"What made them look alike is still there, so the pair would be proposed again and again, and someone could link it by mistake; her decision, with its reason, is kept, so nobody decides it twice.",ok:true},{t:"Because the learning platform will delete the account."}],
    why:"A decision is kept with its reason, and the matcher obeys it. A false merge would show one student the other's results; a missed match only leaves two records apart until someone links them. At an organisation that holds your data, which would cost you more: being merged with someone else, or being held twice?"}
  }}};
