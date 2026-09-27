// When things go wrong · 2. Too good to be true. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line, a natural breath between sentences. The few longer stops are in breath.js.
// Draft 1 of the script (see ../../script.md): not voiced yet, so tools/pace.py estimates each line's length.
const NARR={
"open":{"name":"One version of Tuesday","lead":1.6,"tail":1.0,"vo":[
 {"id":"tuesday","gap":0.8,"text":"It's 10:05 on a Tuesday, in the middle of admissions season."},
 {"id":"committee","gap":0.8,"text":"The planning committee is deciding how many first-year places to offer next year."},
 {"id":"number","gap":0.8,"text":"On the screen, one number: applications for next year, up 38% overnight."},
 {"id":"approve","gap":0.8,"text":"It's good news, and nobody questions it. The committee approves six hundred extra places. Rooms are booked, and tutors will be hired."},
 {"id":"version","gap":0.8,"text":"This is one version of Tuesday. Let's go back to Monday."}]},
"limits":{"name":"The number and its limits","lead":2.9,"tail":1.0,"vo":[
 {"id":"sam","gap":0.8,"text":"Sam, the data engineer, looks after the platform behind that number."},
 {"id":"painting","gap":0.8,"text":"Through Sam's screen, it's a gold painting: applications for next year. On Monday, 8,200 so far."},
 {"id":"card","gap":0.8,"text":"Beside it sits its contract card. One line matters this week: how much the total may change overnight."},
 {"id":"leila","gap":0.8,"text":"Leila, who manages the admissions office, helped set it. On a closing date, applications really do jump, by up to about 15%."},
 {"id":"warn","gap":0.8,"text":"So above 10%, a test raises a warning: worth a look, but the data goes through."},
 {"id":"error","gap":0.8,"text":"Above 25%, it raises an error: this must not reach a decision, so the build stops."},
 {"id":"levels","gap":0.8,"text":"A test on the number itself, not just on each row, with levels the business helped choose."}]},
"night":{"name":"Monday night","lead":1.4,"tail":1.0,"vo":[
 {"id":"sync","gap":0.8,"text":"At eleven on Monday night, the admissions system syncs with the application portal."},
 {"id":"restart","gap":0.8,"text":"Tonight, the sync times out and restarts. It copies the whole week's applications again, 3,100 of them, and gives every copy a new ID."},
 {"id":"twice","gap":0.8,"text":"The admissions system now holds each of those applications twice. The platform copies what the source holds, faithfully."},
 {"id":"rows","gap":0.8,"text":"At two, the nightly build begins, and the checks run, one row at a time. Every ID is unique. No field is empty. Every course exists."},
 {"id":"total","gap":0.8,"text":"Then the total reaches its test: 11,340. Up 38% in one night, when the real growth was forty."},
 {"id":"red","gap":0.8,"text":"The needle swings past amber, into red."},
 {"id":"see","gap":0.8,"text":"Every row was valid. Only a test on the total could see that there were too many."}]},
"tuesdays":{"name":"Three Tuesdays","lead":1.6,"tail":1.0,"vo":[
 {"id":"depends","gap":0.8,"text":"What happens next depends on that test. Here are three versions of the same Tuesday."},
 {"id":"none","gap":0.8,"text":"In the first, there's no test. 11,340 reaches the painting, and the committee approves six hundred places."},
 {"id":"later","gap":0.8,"text":"Three weeks later, the copies are found. The places are cut again, the rooms released, and nobody trusts the dashboard."},
 {"id":"warning","gap":0.8,"text":"In the second, the test is only a warning. It turns amber, and the number is published anyway."},
 {"id":"channel","gap":0.8,"text":"The warning lands in a channel with forty others. Nobody reads it before ten, and the committee makes the same decision."},
 {"id":"error","gap":0.8,"text":"In the third, the test is an error. The build stops before gold."},
 {"id":"banner","gap":0.8,"text":"The painting keeps Monday's 8,200, with a note: last good data, as of 2 am on Monday. Checking an unusual change."},
 {"id":"david","gap":0.8,"text":"David, who chairs the committee, moves the decision to Wednesday. A day late, and right."},
 {"id":"acted","gap":0.8,"text":"A wrong number gets acted on. A late number, clearly labelled, simply waits."},
 {"id":"ours","gap":0.8,"text":"At our university, this test is an error. So this is the Tuesday that happens."}]},
"level":{"name":"Choosing the level","lead":0.8,"tail":1.0,"vo":[
 {"id":"why","gap":0.8,"text":"So why not make every test an error?"},
 {"id":"real","gap":0.8,"text":"Because on a closing date, a jump of 14% is real. Stopping it would hold back good data, and teach people to ignore alarms."},
 {"id":"two","gap":0.8,"text":"So this number has two levels. Amber, for worth a look. Red, for must not reach a decision."},
 {"id":"reads","gap":0.8,"text":"And a warning only helps if someone reads it. So each one goes to a person who owns it, and there are few enough that they do."},
 {"id":"cost","gap":0.8,"text":"Choose the level by what a wrong number would cost."}]},
"thread":{"name":"Follow the thread","lead":0.8,"tail":1.0,"vo":[
 {"id":"upstream","gap":0.8,"text":"At 8:15 on Tuesday, Sam follows the thread upstream, from the painting, through silver, to bronze."},
 {"id":"pairs","gap":0.8,"text":"In bronze, 3,100 pairs of rows are identical, except for their ID and when they were created."},
 {"id":"id","gap":0.8,"text":"The uniqueness test checked the ID, and every ID was unique."},
 {"id":"key","gap":0.8,"text":"But in the real world, an application is one applicant, for one course, in one intake. That's its business key."},
 {"id":"test","gap":0.8,"text":"Test uniqueness on what makes a thing unique in the real world, not only on the system's ID."}]},
"reload":{"name":"Fix at the source","lead":1.2,"tail":1.0,"vo":[
 {"id":"rosa","gap":0.8,"text":"Sam messages Rosa, on the admissions system team. Her team finds the restart within the hour."},
 {"id":"source","gap":0.8,"text":"The copies are in the admissions system itself, so that's where they're removed. And the sync is changed, so it's safe to run twice."},
 {"id":"patch","gap":0.8,"text":"The platform doesn't patch its copy by hand. It loads the affected week again, from the corrected system, so its copy matches the source."},
 {"id":"rebuild","gap":0.8,"text":"Silver and gold are rebuilt from it."},
 {"id":"travel","gap":0.8,"text":"Time travel lays Monday night's total beside today's: 11,340 then, 8,240 now. Forty more than Monday, as it should be."},
 {"id":"wednesday","gap":0.8,"text":"On Wednesday, the committee plans with the right number."}]},
"end":{"name":"Pull back","lead":0.8,"tail":1.2,"vo":[
 {"id":"behind","gap":0.8,"text":"The incident leaves a new test behind: one application per applicant, course and intake."},
 {"id":"doubt","gap":0.8,"text":"Syncs will time out again. When in doubt, keep the last good number, and say so."},
 {"id":"tag","gap":0.8,"text":"Stale and labelled beats fresh and wrong."}]}
};
