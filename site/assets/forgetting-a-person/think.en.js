/* Learning Data: "Pause and think" for Forgetting a person, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (story, places, list, stays), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. The right answers sit in four different places, and each question has one near miss. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  story:{q:"The newspaper's page stayed online. What did the court's ruling take away?",
    opts:[{t:"The page itself, because time had made the old debt irrelevant",near:true},{t:"The links to it from a search for his name",ok:true},{t:"Every mention of the auction, wherever it was online"},{t:"The newspaper's right to print such notices at all"}],
    why:"The page was true and lawfully printed, so it stayed. What went was the link from his name: sixteen years on, it had no reason left. Where you work, what would still come up under a person's name long after it stopped mattering?"},
  places:{q:"Why isn't a search for \"Linh Nguyen\" in every system enough?",
    opts:[{t:"Her name is written three ways, and many places hold only numbers",ok:true},{t:"Her six numbers alone would find everything, so names aren't needed",near:true},{t:"Names are personal data, so the office may not search by them"},{t:"The office must see her passport before it may search at all"}],
    why:"Search by every number and every form of her name, in documents and tools as well as tables, and follow lineage to the copies. Her numbers alone would miss the documents that only name her. Where you work, could you list every place one person's data lives, today?"},
  list:{q:"Why does the university keep her no, instead of only deleting her row?",
    opts:[{t:"So it can ask her again next semester if she's changed her mind"},{t:"Because the law says a deleted row must leave a note behind it"},{t:"So her row can stay on the list, marked \"do not send\"",near:true},{t:"So the next rebuild can't add her back from her 2023 yes",ok:true}],
    why:"The list is rebuilt each semester from contracts and the yes on the person. Her no replaces the yes there, so nothing that reads the old yes adds her back; her row itself leaves the list. Where you work, which lists are rebuilt from somewhere else?"},
  stays:{q:"Her pay records must be kept until 2033. What does the university do with them?",
    opts:[{t:"Deletes them anyway, since her right to be forgotten comes first"},{t:"Keeps them, and may use them for anything else until 2033"},{t:"Keeps them for that reason only, says so, and deletes them in 2033",ok:true},{t:"Keeps them for the law, but tells her nothing, since she can't change it",near:true}],
    why:"The law requires them, so they stay, kept for that reason only and read only by those who need them. The answer says what stays, why, and until when, and a no says how to challenge it. Where you work, does an answer to a person say what stays, and until when?"}
  }}};
