/* Learning Data: "Pause and think" for For this purpose only, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (wish, wishes, platform, request), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "wish":{q:"Linh asked the alumni office not to ask her for donations, and the appeal still reached her. Why?",
    opts:[{t:"The alumni office forgot to write it down."},{t:"Her no was written on her alumni record, and the appeal found her through the student system, which never heard it.",ok:true},{t:"She had changed her mind."}],
    why:"A wish kept on one role's record reaches only the lists that read that record. The appeal went to the faculty's students and alumni, and found Linh as a student, where nothing said no. Have you ever told an organisation not to contact you, and heard from it anyway, through another door?"},
  "wishes":{q:"Why does Linh's no to fundraising go on the person, and not on her alumni record?",
    opts:[{t:"Her alumni record is about to be deleted."},{t:"It's her wish, not a role's: whichever role a list finds her through, the no comes too.",ok:true},{t:"Only the person's record can hold a date."}],
    why:"A role's purposes say what its data is for. A wish says what she wants, wherever she appears. Kept on the person, with its purpose, its date, who she told and how to change it, it closes every door that purpose would open. Where might a \"don't contact me\" you once gave an organisation live now?"},
  "platform":{q:"The appeals team asks for this year's top students' grades. What does the platform do?",
    opts:[{t:"It refuses the whole table."},{t:"It hides the grades, which are tagged for teaching, and leaves out anyone whose wishes say no.",ok:true},{t:"It asks Jun to take the grades out by hand."}],
    why:"dbt writes each column's purpose as a tag, and a test fails when personal data has none. Two policies in Unity Catalog read the tags: a column mask hides what's tagged for teaching from the appeals team, and a row filter leaves out anyone who said no. Each is written once, and every table with those tags follows it. Which of your tables would need a purpose first?"},
  "request":{q:"If Linh asked to be forgotten, why couldn't the university delete everything about her?",
    opts:[{t:"Deleting personal data is never allowed."},{t:"Each role keeps only what it must: her degree for good, her project's data as its rules require, and a small record of her no, so it still holds.",ok:true},{t:"Her records are linked, so none of them can be deleted."}],
    why:"Being forgotten is decided role by role, starting from the person: what a law, a rule or her own wish still needs stays, and the rest goes. Keeping the fact that she said no is how a \"don't contact me\" keeps working. What would an organisation that knows you need to keep, and for how long?"}
  }}};
