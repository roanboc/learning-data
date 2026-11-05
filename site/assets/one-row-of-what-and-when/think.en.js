/* Learning Data: "Pause and think" for One row of what, and when, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (grain, fan, was, late), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). Each "stop" is this film's own lab that teaches the same idea;
   the page's .player data-labs says where those labs are. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "grain":{stop:"grain",q:"Why write the grain before the SQL?",
    opts:[{t:"It says which tables the query must join, so the SQL is quicker to write.",near:true},{t:"dbt needs a grain written down before it will build the table."},{t:"It says what the query must produce, so the SQL can be checked against it.",ok:true}],
    why:"Written first, the grain says what the query must produce; written after, it describes whatever the SQL happened to do. As a test, it catches a wrong join on every run. dbt itself has no grain field."},
  "fan":{stop:"fan",q:"The grain test failed. What's wrong: the data, the join, or the grain?",
    opts:[{t:"The join: it ignored the date, so each learner met both versions.",ok:true},{t:"The join: it ignored the learner, so each award met every learner.",near:true},{t:"The grain: it should allow two rows per learner and award."}],
    why:"The data is right (the award really has two versions), and so is the grain. The join ignored the date, so each learner met both versions."},
  "was":{stop:"asat",q:"Twelve or nine: which is right?",
    opts:[{t:"Nine: it's the newest, so it replaces twelve."},{t:"Both: the same question, asked about two days.",ok:true},{t:"Twelve: it matches the census report.",near:true}],
    why:"Learners within 15 points of a graduate certificate: twelve as at census day, which Planning asked for; nine as at today. The output's grain says which day it describes."},
  "late":{stop:"when",q:"The platforms don't record when a change took effect. Which date do you use for them?",
    opts:[{t:"An effective date guessed from the student system's record of the same change."},{t:"The date they recorded it, quietly, as if it were the date the change took effect.",near:true},{t:"The date they recorded it, accepted and written down as a known limitation.",ok:true}],
    why:"The recorded date is the only one there is. It's accepted, and written down on the model as a known limitation, so no one mistakes it for when the change happened."}
  }}};
