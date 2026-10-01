// In the weeds of data crafting · An agent on the team. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"almanac":{"name":"Computed twice","lead":1.4,"tail":1.0,"vo":[
 {"id":"first","gap":0.8,"text":"In 1766, Nevil Maskelyne, the Astronomer Royal, published the first Nautical Almanac: tables for finding longitude at sea.","say":"In seventeen sixty-six, Nevil Maskelin, the Astronomer Royal, published the first Nautical Almanac: tables for finding longitude at sea."},
 {"id":"posted","gap":0.8,"text":"He didn't compute them himself. He posted instructions to computers: people working at home, across England."},
 {"id":"twice","gap":0.8,"text":"Every month was computed twice, by two computers far apart. A comparer checked one against the other, before anything was printed."},
 {"id":"bridge","gap":0.8,"text":"Jun has a computer on the team now, a fast one. The checking still has to be built in."}]},
"skills":{"name":"Written down","lead":1.0,"tail":1.0,"vo":[
 {"id":"can","gap":0.8,"text":"The agent can read the whole project, run dbt, and draft changes on a branch."},
 {"id":"agents","gap":0.8,"text":"Before any of that, it reads one page, written for agents. What it may do, and what it must not."},
 {"id":"five","gap":0.6,"text":"Beside it, five skills, one file each: draft the conceptual model, profile a source, draft a model, reconcile and diff, review the metadata."},
 {"id":"process","gap":0.8,"text":"And the process: for each of the ten steps, the agent's part, and who approves it."},
 {"id":"files","gap":0.8,"text":"Files in the project, not a long prompt. Versioned, reviewed, and read the same way by people and by agents."}]},
"least":{"name":"Least access","lead":1.0,"tail":1.0,"vo":[
 {"id":"principal","gap":0.8,"text":"On Databricks, the agent works as its own service principal, never as a person."},
 {"id":"reads","gap":0.8,"text":"It reads the core and the marts in production. It writes only to its own development schema."},
 {"id":"samples","gap":0.8,"text":"It works with counts and small samples. Names, emails and student IDs stay in the database."},
 {"id":"stays","gap":0.8,"text":"Whatever it gets wrong stays where nobody else reads it."}]},
"evidence":{"name":"Evidence","lead":1.0,"tail":1.0,"vo":[
 {"id":"claim","gap":0.8,"text":"Every claim the agent makes about the data comes with the query that shows it, and the result."},
 {"id":"four","gap":0.6,"text":"Four of forty-two platform accounts have no student ID. Here's the query. Here's the row."},
 {"id":"more","gap":0.8,"text":"Two learners share one email, in two systems. One withdrawal was recorded seven days after it took effect."},
 {"id":"mei","gap":0.8,"text":"Where rules can't decide, like that shared email, the agent doesn't guess. It asks Mei, and she records a decision."},
 {"id":"guess","gap":0.8,"text":"A claim without its query is a guess, and reviewers treat it as one."}]},
"shortcut":{"name":"The shortcut","lead":1.0,"tail":1.0,"vo":[
 {"id":"refactor","gap":0.8,"text":"Then the agent tidies the learner's timeline. To keep it simple, it dates every version the same way: by when it was recorded."},
 {"id":"fails","gap":0.8,"text":"One test fails: the census reconciliation. Business counts four learners. The report says three."},
 {"id":"why","gap":0.8,"text":"The withdrawal recorded seven days late now looks like a learner still studying on census day."},
 {"id":"warn","gap":0.8,"text":"The agent's draft sets the test to warn. The build passes."},
 {"id":"stop","gap":0.8,"text":"Jun's review stops it. The rule is written down: never weaken a test to make it pass."},
 {"id":"news","gap":0.8,"text":"A failing test is news. Report it, with its failing rows, and let a person decide what's wrong."},
 {"id":"fix","gap":0.8,"text":"The fix puts back the date each change took effect. Business: three. Green."}]},
"validate":{"name":"Reconcile and diff","lead":1.0,"tail":1.0,"vo":[
 {"id":"two","gap":0.8,"text":"Before anyone signs off, two checks."},
 {"id":"reconcile","gap":0.8,"text":"Reconcile: every faculty against the census report. Two, three, five and two. The difference is zero, everywhere."},
 {"id":"diff","gap":0.8,"text":"Diff: build main, then the branch from scratch, and compare them key by key. Counts only; no personal data leaves."},
 {"id":"scratch","gap":0.8,"text":"From scratch, because the credential table is incremental, and would hide a change in logic."},
 {"id":"none","gap":0.8,"text":"The shortcut changed one learner's row. The fix changes nothing, which is what a tidy-up should do."},
 {"id":"was","gap":0.8,"text":"And both answers, side by side: twelve as it was at census, for Planning; nine as it is now."}]},
"ship":{"name":"Review and ship","lead":1.0,"tail":1.0,"vo":[
 {"id":"pr","gap":0.8,"text":"The agent opens a pull request: what it changed, why, what it checked, and the evidence."},
 {"id":"ci","gap":0.6,"text":"CI builds the project on DuckDB, checks that the generated docs are current, and that the metric still gives the census number."},
 {"id":"cloud","gap":0.8,"text":"It parses the project for Databricks too. On dbt Cloud, a CI job builds only what changed, and what depends on it."},
 {"id":"people","gap":0.8,"text":"Then people. Jun approves the code. Noor signs off the model, and Planning its number."},
 {"id":"approve","gap":0.8,"text":"The agent never merges or approves its own work. The agent recommends; people approve."}]},
"next":{"name":"The same words, four places","lead":1.0,"tail":1.0,"vo":[
 {"id":"merged","gap":0.8,"text":"It's merged, tested and signed off."},
 {"id":"metadata","gap":0.8,"text":"Then the agent reviews the metadata, and finds something no test checks."},
 {"id":"award","gap":0.8,"text":"The definition of an award now lives in four places. And three of them are wrong."}]}
};
