/* Learning Data: "Pause and think" for Moving is easy, agreeing is the work, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (promise, ways, contract), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "promise":{q:"Events, messages and batches have had names since 2003. What has changed since then?",
    opts:[{t:"Their names: the tools call them something new, so the book no longer applies."},{t:"The patterns: events replaced batches, so systems no longer send whole files.",near:true},{t:"How little it takes to move them: the tools now do what teams once built.",ok:true}],
    why:"Events, messages and batches are the ideas Hohpe and Woolf named in 2003, and the HR system still sends both shapes: each change as it's made, and its whole file each teaching period. What changed is the work: a managed connector now reads only what changed, tries again and keeps its place, where a team once built that by hand. Which shapes does your busiest system send?"},
  "ways":{q:"Finance's general ledger is read in place, without copying it in. When do the docs recommend a connector instead?",
    opts:[{t:"When the ledger holds personal data, so it has to be copied in to be governed."},{t:"For large volumes or quick answers, where reading the other system each time is slow.",ok:true},{t:"When Finance wants to change the ledger, since a query in place can only read it.",near:true}],
    why:"A query in place reads the finance system where the ledger lives and changes nothing, so there's no copy to keep in step; neither way changes the ledger, which Finance keeps in its own system. For large volumes, or answers that must come fast, the docs recommend a managed connector, which brings the data in once and then only what changed. Which of your sources is read often enough to bring in?"},
  "contract":{q:"HR deletes a cancelled contract. Why does the HR system's data contract say the deletion arrives as a change, with its time?",
    opts:[{t:"So the platform knows it was cancelled, and when, and can close it and keep its history.",ok:true},{t:"So the platform can delete the row as well, and both systems stay exactly the same.",near:true},{t:"Because a missing row means the same thing, so the next file would show it anyway."}],
    why:"A row that's just missing from the next file could be a cancelled contract, a failed export or a filter someone changed. Sent as a change with its time, the deletion says what happened and when, so the platform closes the contract, marks it no longer current, and keeps its history for anyone who asks later. How does a deletion reach your platform today?"}
  }}};
