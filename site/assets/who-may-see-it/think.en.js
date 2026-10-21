/* Learning Data: "Pause and think" for Who may see it, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (column, purpose, stars), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "column":{q:"An award's key, SIS|S-20417|GCDA, looks like a code. Which class is its column?",
    opts:[{t:"None: it's a code, and a code alone is never personal data."},{t:"Direct: it holds the student's ID, which identifies someone by itself.",ok:true},{t:"Pseudonymous: only the student system can tell who it belongs to."}],
    why:"Most credential keys are only codes, but an award's key holds the student's ID, and a student ID identifies a person by itself. So Mei classed the column direct: the court's line, drawn at the column. Nothing can be assumed insignificant. Which codes in your data carry an identifier inside them?"},
  "purpose":{q:"Clara sees only scrambled keys. Why does her access still need a purpose and an end date?",
    opts:[{t:"It doesn't: once a key is scrambled, nobody can ever tell who it is."},{t:"A key is still personal data: anyone with the student IDs could scramble them and match.",ok:true},{t:"Only because every grant needs a date, whatever its columns show."}],
    why:"The key is the student's ID, scrambled the same way every time. Anyone with the list of IDs could put each one through and find the key that matches, so the key is pseudonymous: still personal data. That's why even keys come with a purpose and an end date. What in your data looks anonymous but could be worked back?"},
  "stars":{q:"Clara now needs names, for a new purpose. What happens?",
    opts:[{t:"She copies the table into a spreadsheet she can keep and share."},{t:"She asks the registrar's office, which owns the learner table, and says what it's for.",ok:true},{t:"She asks the data team, who build the table, to turn the mask off."}],
    why:"Mei decides for her office: yes, for that purpose and until a date, or her office does the step that needs names. Yusuf told Clara why the stars are there and showed her the way to more, because a no without a way forward is how tables end up copied into spreadsheets. When someone asks you for more data, what way do you give them?"}
  }}};
