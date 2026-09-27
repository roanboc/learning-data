// When things go wrong · 1. Silent change. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line, a natural breath between sentences. The few longer stops are in breath.js.
const NARR={
"banner":{"name":"Yesterday's numbers","lead":1.6,"tail":1.0,"vo":[
 {"id":"morning","gap":0.8,"text":"It's 7:58 on the morning before census date."},
 {"id":"ana","gap":0.8,"text":"Ana, the Head of School, has a meeting at nine to confirm which classes will run."},
 {"id":"note","gap":0.8,"text":"Her dashboard shows yesterday's numbers, with a note: last good data, as of 11:02 last night."},
 {"id":"old","gap":0.8,"text":"The numbers aren't wrong. They're a day old, and the dashboard says so."},
 {"id":"asks","gap":0.8,"text":"Ana messages Sam: are these numbers safe to use?"}]},
"night":{"name":"Six hours earlier","lead":0.8,"tail":1.0,"vo":[
 {"id":"earlier","gap":0.8,"text":"Six hours earlier, at 2:40 in the morning, the nightly build begins."},
 {"id":"events","gap":0.8,"text":"Enrolment changes reach the platform all day, as events or in files. Once a night, dbt builds the numbers from them."},
 {"id":"test","gap":0.8,"text":"Before anything is built on them, dbt tests them. One test checks that every enrolment has a status it knows."},
 {"id":"unknown","gap":0.8,"text":"Tonight, some have a status it has never seen."},
 {"id":"stops","gap":0.8,"text":"So the build stops there. Everything downstream is skipped, and the dashboard keeps the last good numbers, with that note."},
 {"id":"alert","gap":0.8,"text":"An alert is filed for the morning. Nothing wrong reached anyone, so nobody needs to be woken."},
 {"id":"safely","gap":0.8,"text":"A good platform fails loudly, and safely."}]},
"sam":{"name":"Sam","lead":0.8,"tail":1.0,"vo":[
 {"id":"reading","gap":0.8,"text":"At 7:59, Sam, the data engineer on call, is already reading the alert."},
 {"id":"reply","gap":0.8,"text":"Sam replies: yesterday's numbers are safe. I'm checking today's, and I'll be back to you by 8:45."},
 {"id":"trust","gap":0.8,"text":"Say what you know, and what you don't. That's how trust survives a bad morning."}]},
"thread":{"name":"Follow the thread","lead":2.9,"tail":1.0,"vo":[
 {"id":"lineage","gap":0.8,"text":"Every number on the dashboard has a lineage: the steps that built it."},
 {"id":"back","gap":0.8,"text":"Sam follows it backwards, one step at a time."},
 {"id":"steps","gap":0.8,"text":"From the dashboard, to the data product behind it. Then to the model that joins enrolments to their units."},
 {"id":"staging","gap":0.8,"text":"Then to staging, where the test failed. The rows that failed it were kept aside, so they can be looked at."}]},
"bronze":{"name":"The cause","lead":0.8,"tail":1.0,"vo":[
 {"id":"arrived","gap":0.8,"text":"Upstream, in bronze, the rows are exactly as the student system sent them."},
 {"id":"new","gap":0.8,"text":"Fifteen enrolments in Data Science 101 have a new status: waitlisted."},
 {"id":"kept","gap":0.8,"text":"Bronze keeps what arrived, even what nothing downstream understands yet. Nothing was lost. Something was new."}]},
"halves":{"name":"Two halves of one change","lead":0.8,"tail":1.0,"vo":[
 {"id":"ask","gap":0.8,"text":"Sam asks the student system team: did enrolments change last night?"},
 {"id":"ben","gap":0.8,"text":"Ben replies: yes, waitlists went live. It's in our release notes."},
 {"id":"mei","gap":0.8,"text":"Then Sam calls the registrar's office. Mei says: yes, we introduced waitlists, and we emailed every School."},
 {"id":"weeks","gap":0.8,"text":"Two weeks earlier, both had announced the change."},
 {"id":"notices","gap":0.8,"text":"The registrar's office emailed every School. The student system team published release notes."},
 {"id":"reached","gap":0.8,"text":"Each notice reached its own people. Neither reached the platform, or the people who rely on its numbers."},
 {"id":"knew","gap":0.8,"text":"Ben knew what changed. Mei knew what it meant. Neither knew the numbers depended on it."},
 {"id":"question","gap":0.8,"text":"So, is a waitlisted student enrolled? Sam doesn't guess. It's a business question."},
 {"id":"decides","gap":0.8,"text":"Mei decides: no. Enrolled means holding a seat on census date, and a waitlisted student doesn't hold one yet."},
 {"id":"sketch","gap":0.8,"text":"The sketch, our model of what things mean, gains a new status."}]},
"fix":{"name":"The fix","lead":0.8,"tail":1.0,"vo":[
 {"id":"small","gap":0.8,"text":"Now the fix is small. In dbt, waitlisted becomes a known status, one that doesn't count as enrolled."},
 {"id":"review","gap":0.8,"text":"A colleague reviews it, like any code. Tests run on just what changed, and they pass."}]},
"recover":{"name":"Recover","lead":0.8,"tail":1.0,"vo":[
 {"id":"rerun","gap":0.8,"text":"The skipped models run again."},
 {"id":"would","gap":0.8,"text":"Had the waitlist been counted, the dashboard would have shown Data Science 101 at 108% full."},
 {"id":"believable","gap":0.8,"text":"That's believable. Classes do fill up. Nobody would have questioned it, and Ana might have booked a bigger room for students without a seat."},
 {"id":"versions","gap":0.8,"text":"Time travel lays last night's table beside this morning's: 94% yesterday, 96% today."},
 {"id":"confirm","gap":0.8,"text":"At 8:40, the note disappears. At nine, Ana confirms the classes."}]},
"contract":{"name":"The contract","lead":1.8,"tail":1.0,"vo":[
 {"id":"meet","gap":0.8,"text":"Later that week, the four of them meet: Mei and Ben, who produce the data, and Sam and Ana, who use it."},
 {"id":"agree","gap":0.8,"text":"They agree a data contract for enrolments."},
 {"id":"says","gap":0.8,"text":"It lists the fields, the allowed statuses and what each one means, and how fresh the data must be."},
 {"id":"owners","gap":0.8,"text":"It names an owner on each side, technical and business. Changing it needs both sides to agree."},
 {"id":"checks","gap":0.8,"text":"And the platform keeps checking it: on every load, at the door, and on every proposed change, before it ships."}]},
"later":{"name":"Three weeks later","lead":0.8,"tail":1.0,"vo":[
 {"id":"weeks","gap":0.8,"text":"Three weeks later, Ben's team adds another status: deferred."},
 {"id":"amber","gap":0.8,"text":"In their test environment, before release, the contract check turns amber, and all four owners are told."},
 {"id":"define","gap":0.8,"text":"Mei defines what deferred means. Sam's team adds it. The contract becomes version 1.1."},
 {"id":"monday","gap":0.8,"text":"On Monday, the dashboard simply updates. No note, no alert, and nobody woken."}]},
"end":{"name":"Pull back","lead":0.8,"tail":1.2,"vo":[
 {"id":"coming","gap":0.8,"text":"Changes will keep coming. That's a university doing its job."},
 {"id":"visible","gap":0.8,"text":"The platform's job is to make each one visible, to everyone it touches, in time."},
 {"id":"tag","gap":0.8,"text":"Seen by both sides, before it ships."}]}
};
