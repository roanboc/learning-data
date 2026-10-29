// Quality on the platform, film 4 of 6 of Governance you can use, the third series on data governance. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"trust":{"name":"Which number to trust","lead":1.2,"tail":1.0,"vo":[
 {"id":"room","gap":0.8,"text":"In Planning's room, Clara Jensen checks the numbers before they leave."},
 {"id":"leave","gap":0.8,"text":"The census numbers go to the government, and the lists to the faculties."},
 {"id":"slowed","gap":0.8,"text":"When Yusuf asked what slowed her down, Clara said: which number do I trust?"},
 {"id":"ran","gap":0.8,"text":"Checks ran every night, but a failed one said only its name, not whose data it was."},
 {"id":"year","gap":0.8,"text":"A warning that emails were typed with spaces and capitals had run for a year, and nobody owned it."},
 {"id":"survey","gap":0.8,"text":"And data quality was a survey: people rated their data, 3.9 out of 5.","say":"And data quality was a survey: people rated their data, three point nine out of five."},
 {"id":"broken","gap":0.8,"text":"So a broken night could change a number on its way to the government, and nobody knew whose it was to fix."},
 {"id":"change","gap":0.8,"text":"Something had to change."},
 {"id":"now","gap":0.8,"text":"Now every check names its owner, the kind of quality it checks, and the level its owner chose."},
 {"id":"watch","gap":0.8,"text":"Monitoring watches for what no rule names."},
 {"id":"morning","gap":0.8,"text":"And each morning, every result goes into one scorecard, with an issue for each owner."},
 {"id":"oct","gap":0.8,"text":"On the 19th of October, five more enrolments arrived with no email.","say":"On the nineteenth of October, five more enrolments arrived with no email."},
 {"id":"six","gap":0.8,"text":"That made six, more than the five the learning team allows."},
 {"id":"stopped","gap":0.8,"text":"Everything built from them stopped, so nothing wrong went out: Planning kept the day before's numbers."},
 {"id":"noon","gap":0.8,"text":"By noon, the learning team had added the six emails, and that night, all 160 checks passed.","say":"By noon, the learning team had added the six emails, and that night, all a hundred and sixty checks passed."},
 {"id":"trust","gap":0.8,"text":"Now Clara knows each morning which numbers to trust, and who answers for each."}]},
"owner":{"name":"An owner, a dimension, a level","lead":0.8,"tail":0.8,"vo":[
 {"id":"test","gap":0.8,"text":"In the project, each check is a dbt test, and each test names its owner and the kind of quality it checks, its dimension."},
 {"id":"folder","gap":0.8,"text":"The owner comes from the folder: every test on the short-course data is the learning team's."},
 {"id":"kind","gap":0.8,"text":"The dimension comes from the kind of test: a test for empty values checks completeness."},
 {"id":"level","gap":0.8,"text":"The level is in the test, as its owner chose: warn on one enrolment with no email, stop above five."},
 {"id":"log","gap":0.8,"text":"The decision log says who chose it, and why."},
 {"id":"in","gap":0.8,"text":"And a test without an owner or a dimension doesn't get in."}]},
"run":{"name":"Written from the run","lead":0.8,"tail":0.8,"vo":[
 {"id":"read","gap":0.8,"text":"After each night's build, two scripts read dbt's results."},
 {"id":"scorecard","gap":0.8,"text":"One writes the scorecard: for each area and each dimension, how many tests passed."},
 {"id":"learning","gap":0.8,"text":"On the 19th, learning's completeness was six of seven.","say":"On the nineteenth, learning's completeness was six of seven."},
 {"id":"notrun","gap":0.8,"text":"The tests on what was built from the stopped data didn't run: they count as not run, not as failed."},
 {"id":"issue","gap":0.8,"text":"The other script writes each owner an issue to answer: what didn't pass, and why the level is there."},
 {"id":"due","gap":0.8,"text":"A cause to fill in, and a date to answer by."}]},
"where":{"name":"Which check goes where","lead":0.8,"tail":0.8,"vo":[
 {"id":"one","gap":0.8,"text":"A dbt test, on what the data team builds, is one place to check."},
 {"id":"more","gap":0.8,"text":"There are three more along the data's way: where it's typed, where it's loaded, and on the platform's tables, as monitoring."},
 {"id":"each","gap":0.8,"text":"Each catches what the others can't, and each tells the data's owner."},
 {"id":"prevent","gap":0.8,"text":"Prevent what you can, where it starts."},
 {"id":"check","gap":0.8,"text":"Check what you know."},
 {"id":"watch","gap":0.8,"text":"Watch for what you don't."}]},
"typed":{"name":"Where it's typed","lead":0.8,"tail":0.8,"vo":[
 {"id":"cleaned","gap":0.8,"text":"Emails used to arrive as typed, with spaces and capitals, and every night the data team cleaned them."},
 {"id":"form","gap":0.8,"text":"From the 2nd of November, the sign-up form checks each email as it's typed.","say":"From the second of November, the sign-up form checks each email as it's typed."},
 {"id":"source","gap":0.8,"text":"A test on the source, as the data team reads it in, checks every email recorded since, and stops the build if one isn't clean."},
 {"id":"never","gap":0.8,"text":"It should never fail: if it does, the form has broken."},
 {"id":"goes","gap":0.8,"text":"Once the old emails are corrected, the clean-up goes, and the test checks every row."}]},
"loaded":{"name":"Where it's loaded","lead":0.8,"tail":0.8,"vo":[
 {"id":"loads","gap":0.8,"text":"Each night, the platform team's pipeline loads each system's files."},
 {"id":"expect","gap":0.8,"text":"Its expectations, rules on each table, check that a row can be loaded at all."},
 {"id":"apart","gap":0.8,"text":"An enrolment with no ID can't be told apart from another, so it's kept out, and counted."},
 {"id":"reaches","gap":0.8,"text":"The count reaches its owner like any other result, and the row is fixed where it's kept, in the short-course platform."}]},
"watch":{"name":"What no rule names","lead":0.8,"tail":0.8,"vo":[
 {"id":"half","gap":0.8,"text":"One night, half the new badges arrived with no credit."},
 {"id":"passed","gap":0.8,"text":"Every test passed: no rule said a microcredential carries credit."},
 {"id":"caught","gap":0.8,"text":"Monitoring caught it."},
 {"id":"learns","gap":0.8,"text":"The platform learns when each table usually arrives, and how many rows it brings, with no rule to write; that's in preview."},
 {"id":"profile","gap":0.8,"text":"And a profile of the badges counts, each night, how many carry no credit: usually one in twelve."},
 {"id":"two","gap":0.8,"text":"That night, one in two."},
 {"id":"alert","gap":0.8,"text":"An alert went to the owner on record, the learning team."},
 {"id":"became","gap":0.8,"text":"Once they'd confirmed it, the surprise became a test."}]},
"card":{"name":"One scorecard","lead":0.8,"tail":0.8,"vo":[
 {"id":"land","gap":0.8,"text":"The pipeline's counts and the monitors' results land on the platform, by table."},
 {"id":"reads","gap":0.8,"text":"Each table's owner is in the project, so the scorecard reads them too, in a table under the tests'."},
 {"id":"inbox","gap":0.8,"text":"Every result reaches one owner, not a shared inbox."},
 {"id":"measured","gap":0.8,"text":"And quality is measured, not surveyed: last night, 160 of 160 tests passed, one with a warning.","say":"And quality is measured, not surveyed: last night, a hundred and sixty of a hundred and sixty tests passed, one with a warning."},
 {"id":"platform","gap":0.8,"text":"So did the platform's 22 checks, and every test had an owner and a dimension.","say":"So did the platform's twenty-two checks, and every test had an owner and a dimension."}]},
"close":{"name":"Rules, and monitoring for the rest","lead":0.8,"tail":0.8,"vo":[
 {"id":"opens","gap":0.8,"text":"This morning, Clara opens the scorecard before the numbers leave."},
 {"id":"amber","gap":0.8,"text":"One amber cell: an enrolment with no email, that the learning team is following up."},
 {"id":"else","gap":0.8,"text":"Everything else passed, and every cell has an owner."},
 {"id":"knows","gap":0.8,"text":"Clara knows which numbers to trust, and who answers for each."},
 {"id":"last","gap":0.8,"text":"Rules you write, and monitoring for the rest."}]}
};
