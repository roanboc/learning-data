/* Learning Data: "Pause and think" for Both at once, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (distance, sync, doesnt, questions), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). Each "stop" is this film's own lab that teaches the same idea;
   the page's .player data-labs says where those labs are. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "distance":{stop:"fresh",q:"An award is revoked at 15:00. An employer checks it at 16:00, and the answer comes from last night's copy. What does the employer see?",
    opts:[{t:"Valid: the copy doesn't know yet.",ok:true},{t:"An error: the award isn't in it."},{t:"Revoked: the copy reads the change.",near:true}],
    why:"Last night's copy was made before the revocation. Until the next copy, the reading side says the award is valid: that's the distance hybrid databases shorten."},
  "sync":{stop:"order",q:"The reading side receives “revoke A-1042” before “issue A-1042”. What does it end up showing?",
    opts:[{t:"Nothing: both changes are refused."},{t:"Revoked: the last change wins.",near:true},{t:"Issued: the award is back to life.",ok:true}],
    why:"The revocation finds no row, so it changes nothing; then the issue adds the award as issued. Changes must be applied in the order they happened."},
  "doesnt":{stop:"where",q:"The app's awards table is live and exact. Why does counting last year's Science awards from it come out wrong?",
    opts:[{t:"It's exact, but it only holds this year's awards, so last year's must come from backups.",near:true},{t:"It holds today's state: revoked awards still in it, faculties overwritten, no history.",ok:true},{t:"Reading a live table slows the app, so the count is cut off before it finishes."}],
    why:"A table built to write keeps the current state of each row. Counting the past needs history, shared dimensions and a definition: a model."},
  "questions":{stop:"fresh",q:"Which answer needs to be fresh within seconds?",
    opts:[{t:"An employer checking whether a credential is still valid.",ok:true},{t:"A faculty dean checking today's enrolments each morning.",near:true},{t:"Government reporting, due on the census date."}],
    why:"The employer is waiting on a fact that can change. A plan can use last night's data; census reporting must stay fixed on its date."}
  }}};
