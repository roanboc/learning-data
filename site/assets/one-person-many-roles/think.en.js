/* Learning Data: "Pause and think" for One person, many roles, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (five, apart, keeps, entities), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "five":{q:"Linh's application asked for a transcript of a degree the university gave her. Why didn't it know?",
    opts:[{t:"The degree was too old to keep."},{t:"The application gave her a new student number, and nothing linked it to the record of her degree, under the old one.",ok:true},{t:"She hadn't graduated yet."}],
    why:"Five records hold one person, each in its own system, and the student system holds two of them, under two numbers. None of them holds the person, so what one record knows, the others can't see. Has an organisation ever asked you for something it already had about you?"},
  "apart":{q:"Linh and her brother can share a home address, but never a student number. Why?",
    opts:[{t:"An address matters less than a number."},{t:"A contact point is a way to reach people, and two can share it; an identifier is issued by one system to name one record.",ok:true},{t:"The student system doesn't store addresses."}],
    why:"A contact point has a purpose, and a home address can belong to everyone who lives there. An identifier belongs to the system that issued it, to name exactly one record, so two people sharing one is always a mistake. What could go wrong if they did?"},
  "keeps":{q:"Linh's legal name, her preferred name and her work details all describe her. Why does each have a different keeper?",
    opts:[{t:"Every system wants its own copy."},{t:"Each piece is trusted where it's made and checked: the registrar's office for her legal name, Linh for her preferred name, HR for her work details.",ok:true},{t:"The person's record can't hold names."}],
    why:"Who keeps what is decided piece by piece, not system by system, and Mei's office looks after whether two records are one. Think of an organisation that knows you in two ways, as a customer and an employee, say. Who keeps your name there, and who would know if you changed it?"},
  "entities":{q:"An energy utility's meters are in its asset system, its billing system and its field crews' app, and a wrong meter means a wrong bill. What do the four questions say?",
    opts:[{t:"A transaction: each meter is read every month."},{t:"Master it: a thing the utility is about, used by more than one process, kept in more than one place, and it matters when the copies disagree.",ok:true},{t:"Reference data: meters are only a list."}],
    why:"Four yeses: master it. A reading is a transaction, and a list of meter types would be reference data, but the meter itself is one of the things the utility is about. Pick an organisation you know: name one thing it should master, one list that's reference data, and one event that's a transaction."}
  }}};
