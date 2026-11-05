/* Learning Data: "Pause and think" for Too good to be true, in English. Keep the keys in step with think.es.js.
   The film stops at the end of four chapters (night, tuesdays, level, reload), with one question each. think.js shows them,
   and lists them again under "Think it through" (#think-list). Each "stop" is this film's own lab that teaches the same idea;
   the page's .player data-labs says where those labs are. */
window.LEARN={lang:"en",
think:{ui:{toggle:"Pause and think",kicker:"Pause and think",cont:"Continue",skip:"Skip",lab:"Try the idea in a lab",off:"Turn off pauses",right:"Right.",wrong:"Not quite.",start:"Play with pauses to think",answer:"Answer:",watch:"Watch this part"},
  qs:{
  "night":{stop:"tests",q:"Every ID was unique and every field was filled. Why did the total still come out wrong?",
    opts:[{t:"Each copy had a new ID, so a uniqueness check on the ID would have caught them if it had been switched on.",near:true},{t:"Each copy was a valid row: only a check on the total, or on the business key, sees that there are too many.",ok:true},{t:"The platform added the copies itself during the load, after the row checks had already passed."}],
    why:"Row checks look at one row at a time, and every copy passed. A test on the total sees the jump; a uniqueness test on applicant, course and intake sees the pairs."},
  "tuesdays":{stop:"levels",q:"The warning fired, and the same wrong decision was made. Why?",
    opts:[{t:"A warning lets the number through: it only helps if someone who owns it reads it in time.",ok:true},{t:"A warning stops the number until someone reads it, and nobody read it before the decision.",near:true},{t:"The warning went to a channel that the people making the decision don't follow."}],
    why:"A warning is a note, not a brake. An error kept Monday's number, labelled, and the decision waited a day: stale and labelled beats fresh and wrong."},
  "level":{stop:"levels",q:"Why not make every test an error?",
    opts:[{t:"Errors are slower to run than warnings, so the nightly build would no longer finish before morning."},{t:"Errors stop the build, so every test would need an owner awake at night to restart it after each failure.",near:true},{t:"Real spikes, such as closing dates, would be stopped too: good data held back, and alarms people learn to ignore.",ok:true}],
    why:"Choose the level by what a wrong number would cost. Warn on what's worth a look; stop what must not reach a decision."},
  "reload":{stop:"fix",q:"Why doesn't the platform just delete the copies from its own tables?",
    opts:[{t:"The copies are in the source, but deleting them on the platform is quicker, and the source can be fixed later when its team has time.",near:true},{t:"The copies are in the source: fix them there and load the week again, so the platform matches the source and everyone gets the fix.",ok:true},{t:"Delta tables can't delete rows once they are written, so the only way to remove the copies is to load the whole table again."}],
    why:"Fix it once, at the source. Then the platform replaces the affected week, and time travel shows before and after."}}}};
