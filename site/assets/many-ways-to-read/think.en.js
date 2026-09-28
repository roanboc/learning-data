/* Learning Data: "Pause and think" for Many ways to read, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (cards, integrate, present, serve), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). Each "stop" is this film's own lab that teaches the same idea;
   the page's .player data-labs says where those labs are. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "cards":{stop:"shapes",q:"A library filed each book on three cards: author, title and subject. What did that cost?",
    opts:[{t:"Nothing: cards were cheap."},{t:"Every card had to be kept in step with the book, or readers went to the wrong shelf.",ok:true},{t:"Readers needed three visits to find a book."}],
    why:"Copies make reading easy and keeping up hard. Every shape for reading is a copy like those cards: arranged for a question, and kept in step."},
  "integrate":{stop:"source",q:"The short-course platform arrives. What changes in a data vault?",
    opts:[{t:"The hubs are redesigned to fit it."},{t:"New satellites and new rows are added; no existing table is altered.",ok:true},{t:"Every satellite is reloaded from scratch."}],
    why:"A vault takes a new source by adding. Hubs keep the business keys, and each source's descriptions arrive as satellites, with their source and load time."},
  "present":{stop:"shapes",q:"Why do the awards star and the fees star share one Learner dimension?",
    opts:[{t:"To save storage."},{t:"So one question can cross both stars, and their answers agree.",ok:true},{t:"Because a data vault requires it."}],
    why:"Conformed dimensions: the same keys and attributes, so stars line up on the same learners and the same dates."},
  "serve":{stop:"where",q:"A wide learner table makes “close to a certificate?” one filter. What's the catch?",
    opts:[{t:"AI assistants can't read wide tables."},{t:"Many columns to maintain, and measures that can end up defined twice.",ok:true},{t:"It can only hold one learner."}],
    why:"Wide tables repeat on purpose. Define each measure once, upstream or in a semantic layer, and let every table read it."}
  }}};
