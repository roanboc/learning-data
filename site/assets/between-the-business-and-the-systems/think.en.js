/* Learning Data: "Pause and think" for Between the business and the systems, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (dama, point, own), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). A question's "stop" is the lab of the series it opens, on the series' labs page;
   a question without one has no lab link. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "dama":{q:"DAMA's body of knowledge knows the old line between data and information. Why does it still use the two words as one?",
    opts:[{t:"Data is a form of information, and information a form of data: split them, and one job gets two disciplines.",ok:true},{t:"Information is data with meaning, so data architecture keeps the data and leaves what it means to the business.",near:true},{t:"Information architecture was the older name, and DAMA replaced it once databases took over from paper files."}],
    why:"DAMA knows the distinction, data as facts and information as data with meaning, and criticises splitting them: data is a form of information, and information is a form of data. So it calls the one discipline data architecture. What the data means still belongs to the business; data architecture joins that meaning to the records. Where does your organisation have two teams, or two names, for one job?"},
  "point":{stop:"records",q:"In the January storm, 180 households never got their outage text. Who should have owned what went wrong?",
    opts:[{t:"The outage system's team, because its locations write addresses differently from customer service's."},{t:"Grace, because she owns connection point, and the owner of a word answers for every record of it.",near:true},{t:"Someone for the line between the word and its six records: how each system's record joins the word.",ok:true}],
    why:"Grace owns what connection point means, and each system's team owns how its system stores its record. Nobody owned the line between them, so the texts were matched on what two systems typed, and 180 households missed theirs. That line, the join, is what data architecture is for. Which word in your organisation do several systems record, with nobody owning the line between them?"},
  "own":{q:"Inés decides that every system that needs a connection point carries the network's ID for it. Why does that fix the texts?",
    opts:[{t:"Every system now keeps one shared table of connection points, so there is nothing left to match."},{t:"Texts are matched on one ID that every system carries, so two ways of writing an address stop mattering.",ok:true},{t:"Customer service copies the outage system's addresses each night, so both write them the same way.",near:true}],
    why:"Each system still keeps its own record, in its own words; what changes is the join. Matched on the network's ID, which every system that needs a connection point carries, the texts no longer depend on how anyone typed an address: in the next storm, all 2,100 households on the list got theirs. Where does your organisation still match records on names or addresses?"}
  }}};
