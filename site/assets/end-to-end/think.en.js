/* Learning Data: "Pause and think" for End to end, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (question, output, ship, evolve), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). Each "stop" is this film's own lab that teaches the same idea;
   the page's .player data-labs says where those labs are. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "question":{stop:"where",q:"Why does Finance get folders of its own, from its first commit?",
    opts:[{t:"Because Finance's data is sensitive: its own folders let the platform lock them away from every other team's models.",near:true},{t:"Because dbt needs one folder for each group of models, and Finance is a new group in the project."},{t:"Because Finance decides with the data: its files live by who decides, so they're found by name, and it can move out whole one day.",ok:true}],
    why:"Marts and exposures are organised by who decides with them. Named for Finance from the start, its files never mix with Planning's or the wallet's, and nothing needs untangling later."},
  "output":{stop:"follow",q:"Finance has answered Q-FIN-01. Where does the answer go?",
    opts:[{t:"A decision in Finance's log, with was: Q-FIN-01, and the question stays in the requirements file, marked answered.",near:true},{t:"A rule in Finance's conceptual model and a decision in its log, with was: Q-FIN-01. Then the question is deleted.",ok:true},{t:"Into the backlog ticket that asked it, with the answer in its comments, and then the ticket is closed."}],
    why:"The question was temporary; the answer isn't. It goes where it lasts and where the next person reads it, and the decision says where it came from."},
  "ship":{stop:"lives",q:"Why delete Finance's requirements file when its last item is done?",
    opts:[{t:"So the project says only what's still open. Git keeps the history, and what lasts is already in its home.",ok:true},{t:"So the project stays small. Git keeps nothing once a file is deleted, so what lasts is copied out first.",near:true},{t:"Because dbt can't read it, and files that dbt can't read shouldn't be kept in a dbt project."}],
    why:"A register exists only while it has open items. Each item, once done, moved to its home: a decision, a known limitation, a contract, a test. What's left would only say something that's no longer true."},
  "evolve":{stop:"move",q:"Why does Finance pin the versions of the core it reads?",
    opts:[{t:"Because dbt requires a version number on every ref to another team's model."},{t:"So Finance's build always reads the newest version of the core the day it comes out.",near:true},{t:"So a new version reaches Finance as a choice with a date, not as a surprise in its next build.",ok:true}],
    why:"An unpinned ref moves as soon as the core's owners make a new version the latest. Pinned, Finance gets dbt's warning with the date, and moves when it has checked its number."}
  }}};
