/* Learning Data: "Pause and think" for Copies that keep the rules, in English. Keep the keys in step with think.es.js.
   The film stops at the end of three chapters (madeup, share, room), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). The series has no labs yet, so no question has a "stop",
   and the page's .player data-labs is empty. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  madeup:{q:"Jun wants to try his change on the learners' records, in development. Which copy should development get?",
    opts:[{t:"A masked copy, written through the policies, so every value in it is already hidden.",near:true},{t:"A clone, made by someone the policies leave out, since only Jun will ever read it."},{t:"Made-up learners, with production's columns and classes, and not one of them real.",ok:true}],
    why:"A clone is refused to anyone the policies cover, and one made by someone they leave out holds every real value and no column's class, so no policy matches it. A masked copy is still about real people, and a column nobody has classed yet goes through as it is. Made-up learners stand in for the real ones, and none of them is anyone: the script reads only the columns and their classes, never a record. Synthetic data learned from the real records is another kind: the closer it fits them, the more likely it is to give a real person away, so the university treats it as a copy of them. How closely made-up data should follow the real records is the harder question, and still an open one. What does your development data hold today?"},
  share:{q:"The teaching hospital, on Databricks too, wants to plan its places from the learners' records. What should the university share with it?",
    opts:[{t:"A table of totals, small counts already hidden: its policies don't travel with a share.",ok:true},{t:"The learner table itself, since its policies hide each class wherever it's read.",near:true},{t:"A file of the learner table, sent once by email, now that the agreement is signed."}],
    why:"The policies live in the university's catalog. Whoever shares a table must be left out of them, and the hospital reads the share on its own platform, where they never run, so a shared learner table would show every name. The share holds only a table that already shows no more than may leave, and a job removes the access on the agreement's end date. Which of your shares would show every value?"},
  room:{q:"In the clean room, the hospital's code counts how many learners passed. What keeps a count under 10 from coming out?",
    opts:[{t:"The hospital, which reads only the totals it asked for and leaves out the rest."},{t:"The approved code itself: it hides any count under 10 before anything comes out.",ok:true},{t:"The clean room, which hides small counts in whatever comes out of it, by itself.",near:true}],
    why:"A clean room shows each side only the other's column names, and runs only code every other side approved, but it hides nothing by itself: what comes out is what the approved code writes. So the university's data team reviews the code before approving it, and the code hides any count under 10. Who reads the code before your data meets someone else's?"}
  }}
};
