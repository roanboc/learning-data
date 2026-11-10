/* Learning Data: "Pause and think" for For this purpose only, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (wish, wishes, platform, request), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series' labs and scenarios are its own, for all its films
   (assets/master-and-reference-data/), so no question has a "stop"; the page's .player data-labs leads to them. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "wish":{q:"Linh asked the alumni office not to ask her for donations, and the appeal still reached her. Why?",
    opts:[{t:"The alumni office forgot to write her no down, so no record held it when the appeal list was drawn."},{t:"Her no was written on her alumni record, and the appeal found her through the student system, which never heard it.",ok:true},{t:"Her no was written on her alumni record, but the appeal list was drawn the week before, so it couldn't know yet.",near:true}],
    why:"A wish kept on one role's record reaches only the lists that read that record. The appeal went to the faculty's students and alumni, and found Linh as a student, where nothing said no. Have you ever told an organisation not to contact you, and heard from it anyway, through another door?"},
  "wishes":{q:"Why does Linh's no to fundraising go on the person, and not on her alumni record?",
    opts:[{t:"Her alumni record is about to be deleted, and the no must outlive it."},{t:"It's her wish, so it's copied onto each of her roles, and every copy is kept in step.",near:true},{t:"It's her wish, not a role's: whichever role a list finds her through, the no comes too.",ok:true}],
    why:"A role's purposes say what its data is for. A wish says what she wants, wherever she appears. Kept on the person, with its purpose, its date, who she told and how to change it, it closes every door that purpose would open. Where might a \"don't contact me\" you once gave an organisation live now?"},
  "platform":{q:"The appeals team asks for this year's top students' grades. What does the platform do?",
    opts:[{t:"It hides the grades, which are tagged for teaching, and leaves out anyone whose wishes say no.",ok:true},{t:"It refuses the whole table, and asks the appeals team to file a request with each faculty."},{t:"It hides the grades, which are tagged for teaching, and sends everyone else's rows as asked.",near:true}],
    why:"Each column's purpose is written as a tag where the data is transformed, and a test fails when personal data has none. Two policies on the platform read the tags: a column mask hides what's tagged for teaching from the appeals team, and a row filter leaves out anyone who said no. Each is written once, and every table with those tags follows it. Which of your tables would need a purpose first?"},
  "request":{q:"If Linh asked to be forgotten, why couldn't the university delete everything about her?",
    opts:[{t:"Her records are linked across systems, so deleting one would break the others, and none of them can be deleted at all."},{t:"Each role keeps only what it must: her degree for good, her project's data as its rules require, and a small record of her no, so it still holds.",ok:true},{t:"Each role is deleted except her degree, which is kept for good; the record of her no goes too, since she asked to be forgotten entirely.",near:true}],
    why:"Being forgotten is decided role by role, starting from the person: what a law, a rule or her own wish still needs stays, and the rest goes. Keeping the fact that she said no is how a \"don't contact me\" keeps working. What would an organisation that knows you need to keep, and for how long?"}
  }}};
