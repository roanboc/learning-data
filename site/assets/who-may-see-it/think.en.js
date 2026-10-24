/* Learning Data: "Pause and think" for Who may see it, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (column, purpose, stars), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "column":{q:"An award's code, S-20417-GCDA, looks harmless. Which class is its column?",
    opts:[{t:"None: it's a code, and a code alone is never personal data."},{t:"Direct: it holds the student number, which identifies someone by itself.",ok:true},{t:"Pseudonymous: only the registrar's office can tell who it belongs to."}],
    why:"Most credential codes are harmless, but an award's code holds the student number, and a student number identifies a person by itself. So Mei classed the column direct: the court's line, drawn at the column. Nothing can be assumed insignificant. Which codes in your data carry an identifier inside them?"},
  "purpose":{q:"Clara sees learner codes, not names. Why does her access still need a purpose and an end date?",
    opts:[{t:"It doesn't: a code names no one, so nobody can ever tell who it is."},{t:"A learner code is still personal data: with the registrar's list, it leads back to a person.",ok:true},{t:"Only because every grant needs a date, whatever its columns show."}],
    why:"A learner code names no one by itself, but the registrar's office keeps the list that links each code to a student, so the code is pseudonymous: still personal data. That's why even codes come with a purpose and an end date. What in your data looks anonymous but could lead back to a person?"},
  "stars":{q:"Clara now needs names, for a new purpose. What happens?",
    opts:[{t:"She copies the table into a spreadsheet she can keep and share."},{t:"She asks the registrar's office, which owns the learner table, and says what it's for.",ok:true},{t:"She asks the data team, who build the table, to turn the mask off."}],
    why:"Mei decides for her office: yes, for that purpose and until a date, or her office does the step that needs names. Yusuf told Clara why the stars are there and showed her the way to more, because a no without a way forward is how tables end up copied into spreadsheets. When someone asks you for more data, what way do you give them?"}
  }}};
