/* Learning Data: "Pause and think" for One person, many systems, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (after, lightest, search, apart), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "after":{q:"The university already links Linh's records and counts her once in its reports. Why could she still get a third student number?",
    opts:[{t:"Mei's office links records only once a year."},{t:"Both work after a record exists, and neither is asked before the application creates one.",ok:true},{t:"The lakehouse doesn't hold student numbers."}],
    why:"A registry links records that are already there, and a copy for analysis gathers them afterwards. Neither is in the application's path, so it still creates a person first, and the duplicate is found later, if at all. In an organisation you know, is a duplicate found when it's made, or after?"},
  "lightest":{q:"Why not let one place create every person at the university?",
    opts:[{t:"It wouldn't stop duplicates."},{t:"It would stop them too, but every system would have to change, and that one place could never stop, when people only come in at two doors.",ok:true},{t:"A university may not keep one list of its people."}],
    why:"The centralised way stops duplicates at the highest cost: every system gives up creating people and depends on one place that must always be there. At the university, people are created at two doors, so making those two read the person back solves the problem for less. Where are people, or customers, created in an organisation you know?"},
  "search":{q:"Why does a likely match wait for Mei's office, instead of the search deciding?",
    opts:[{t:"The search is too slow to decide."},{t:"A wrong merge gives one person's history to another, so a person decides once, with a reason, and the decision is kept.",ok:true},{t:"Mei's office approves every application."}],
    why:"A clear match is safe to act on, and so is no match at all. A likely match is where the mistakes are, and a false merge, two people made one, does more harm than a missed one: it shows one person's records to another. If it were your record, what would you want a person to check?"},
  "apart":{q:"Both applicants are called Linh Nguyen. What would have gone wrong if the search had matched on the name alone?",
    opts:[{t:"Nothing: a full name is enough to tell people apart."},{t:"The second Linh would have been given the first one's records: her degree, her results, her email.",ok:true},{t:"The application would have stopped with an error."}],
    why:"Names are shared, the common ones most of all, so the search compares several things: the birth date, the email, a number from before. Only the name agrees, so she becomes a new person, rightly, and nothing joins her to Linh. How many people share your name, and what tells you apart?"}
  }}};
