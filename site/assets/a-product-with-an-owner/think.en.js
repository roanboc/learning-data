/* Learning Data: "Pause and think" for A product with an owner, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (promise, steps, life), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "promise":{q:"Last March, nobody answered for Planning's count. What does writing it down as a product change?",
    opts:[{t:"The data team builds it faster, because it's a product now."},{t:"One person answers for it, and its promise is written where people look: what it's for, what's in it, when it's ready, and where to ask.",ok:true},{t:"Planning builds the table itself, instead of the data team."}],
    why:"A table with a promise and an owner is a product. Clara answers for it, while Jun still builds it, Noor designs it and Sam runs it. The card in the catalogue says what it's for, what's in it, that it's ready by seven on census day, and where to ask, so nobody has to guess who to call. As in the bazaar, a buyer knows who stands behind the goods. Which table in your work would leave everyone pointing at someone else if it were late?"},
  "steps":{q:"A table that tidies the student system's data is used only by the data team. Is it a product?",
    opts:[{t:"Yes: every table the data team keeps is a product."},{t:"No, it's a step. A table becomes part of a product when other teams use it, and then it belongs to exactly one.",ok:true},{t:"Yes, if it passes its checks every night."}],
    why:"Of the data team's thirty-three tables, ten are used by other teams, and each of those belongs to one of six products. The other twenty-three are steps, which only the data team needs, so they can change without asking anyone. Every change is checked: a table other teams use, with no product, goes back, as the learning team's follow-up list did until it had one. Which of your tables do other teams use with nobody answering for them?"},
  "life":{q:"The first edition of the credentials is deprecated. What has to happen before it's retired?",
    opts:[{t:"Nothing: once it's deprecated, it can be deleted the same day."},{t:"Its users, from the record of who uses what, are asked to move to the second edition. When none is left, it's retired on its date.",ok:true},{t:"A mailing list is told, and it's retired when nobody replies."}],
    why:"Deprecated means it has a date to go, and its users are asked to move. The record of who uses what shows who they are, not a mailing list, so nobody is left behind. The first edition has no users now, so at the end of March 2027 it's retired. What in your work is still kept running with nobody using it?"}
  }}};
