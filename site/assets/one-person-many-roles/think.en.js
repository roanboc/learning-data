/* Learning Data: "Pause and think" for One person, many roles, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (four, apart, keeps, entities), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "four":{q:"Linh told the student system her new email. Why do her certificate and her payslip still go to the family inbox?",
    opts:[{t:"The student system lost the change."},{t:"Each system keeps its own record of her, and nothing tells the others they are the same person.",ok:true},{t:"Minh changed the email back."}],
    why:"Four systems each hold a role: a student, a platform user, a customer, a tutor. None of them holds the person, so a change told to one never reaches the rest. Which of your own details would you have to change in more than one place?"},
  "apart":{q:"Linh and Minh can share the family email, but never a student number. Why?",
    opts:[{t:"An email matters less than a number."},{t:"A contact point is a way to reach people, and two can share it; an identifier is issued by one system to name one record.",ok:true},{t:"The student system doesn't store emails."}],
    why:"A contact point has a purpose, and a family email or a home address can belong to two people. An identifier belongs to the system that issued it, to name exactly one record, so two people sharing one is always a mistake. What could go wrong if they did?"},
  "keeps":{q:"Linh's legal name, her preferred name and her work details all describe her. Why does each have a different keeper?",
    opts:[{t:"Every system wants its own copy."},{t:"Each piece is trusted where it's made and checked: the registrar's office for her legal name, Linh for her preferred name, HR for her work details.",ok:true},{t:"The person's record can't hold names."}],
    why:"Who keeps what is decided piece by piece, not system by system, and Mei's office looks after whether two records are one. Think of an organisation that knows you in two ways, as a customer and an employee, say. Who keeps your name there, and who would know if you changed it?"},
  "entities":{q:"An energy utility's meters are in its asset system, its billing system and its field crews' app, and a wrong meter means a wrong bill. What do the four questions say?",
    opts:[{t:"A transaction: each meter is read every month."},{t:"Master it: a thing the utility is about, used by more than one process, kept in more than one place, and it matters when the copies disagree.",ok:true},{t:"Reference data: meters are only a list."}],
    why:"Four yeses: master it. A reading is a transaction, and a list of meter types would be reference data, but the meter itself is one of the things the utility is about. Pick an organisation you know: name one thing it should master, one list that's reference data, and one event that's a transaction."}
  }}};
