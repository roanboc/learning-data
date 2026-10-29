// Governed in Unity Catalog, film 2 of 6 of Governance you can use, the third series on data governance. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"which":{"name":"Which column","lead":1.2,"tail":1.0,"vo":[
 {"id":"today","gap":0.8,"text":"Today, in the platform team's room."},
 {"id":"runs","gap":0.8,"text":"Sam Okafor runs the data platform, where the university's tables are kept and read."},
 {"id":"asks","gap":0.8,"text":"Yusuf asks him who can read the learner table, with every learner's name, email and student number."},
 {"id":"slowed","gap":0.8,"text":"When Yusuf first asked what slowed him down, Sam said: tell me which column, I'll protect it in minutes."},
 {"id":"nobody","gap":0.3,"text":"Nobody could tell him, so access was all or nothing, given by hand:"},
 {"id":"path","gap":0.8,"text":"a form, an emailed approval, and three weeks later, the whole table, to one person, with no end date."},
 {"id":"forty","gap":0.8,"text":"Sam finds forty-one people who can read it."},
 {"id":"nine","gap":0.8,"text":"Nine have moved to other jobs, and still see every learner's name and email."},
 {"id":"change","gap":0.8,"text":"Something had to change."},
 {"id":"now","gap":0.8,"text":"Now each build tells the platform which columns identify a person, from the classes in the project."},
 {"id":"policy","gap":0.8,"text":"One policy shows stars in those columns to everyone outside the registrar's office, on every table, even tables not built yet."},
 {"id":"groups","gap":0.8,"text":"And access goes to groups, until a date."},
 {"id":"december","gap":0.8,"text":"By the end of December, two groups can read the learner table, not forty-one people."},
 {"id":"built","gap":0.8,"text":"Each new table is protected as it's built."},
 {"id":"minutes","gap":0.8,"text":"And Sam protects a column in minutes, because the project tells him which."}]},
"area":{"name":"Laid out by area","lead":1.0,"tail":1.0,"vo":[
 {"id":"catalog","gap":0.8,"text":"On the platform, the project's tables sit in the university's catalog, a schema for each layer the project builds."},
 {"id":"people","gap":0.8,"text":"But people look for data by area, not by layer."},
 {"id":"tag","gap":0.3,"text":"So each table carries its area as a tag, from the domain its model names,"},
 {"id":"discover","gap":0.8,"text":"and the Discover page lays the tables out by area: student, course, planning, finance, and more."},
 {"id":"grant","gap":0.8,"text":"Who may read a table is a grant, and a grant goes to a group, never to a person."}]},
"tag":{"name":"A tag from the class","lead":1.0,"tail":1.0,"vo":[
 {"id":"classes","gap":0.8,"text":"In the project, each column's class says whether it identifies a person: direct, pseudonymous or none."},
 {"id":"writes","gap":0.8,"text":"After each table builds, dbt writes the class to the platform, as a tag on the column."},
 {"id":"governed","gap":0.8,"text":"The tag is governed: an admin created it once, with only those three values, so nobody can tag a column \"maybe\"."},
 {"id":"next","gap":0.8,"text":"Change a class in the project, and the next build changes the tag."},
 {"id":"classifier","gap":0.8,"text":"For tables the project doesn't build, the platform's classifier finds columns that look personal, for their owner to class."}]},
"policy":{"name":"One policy, by tag","lead":1.0,"tail":1.0,"vo":[
 {"id":"masks","gap":0.8,"text":"Then one policy masks every column tagged direct, in the whole catalog, for everyone but the registrar's office."},
 {"id":"tomorrow","gap":0.8,"text":"It isn't set table by table: a table built tomorrow, with an email in it, is masked as soon as it's tagged."},
 {"id":"rows","gap":0.8,"text":"A policy can filter rows the same way; this one masks."},
 {"id":"clara","gap":0.8,"text":"Clara reads the learner table, and sees each learner's status, and stars where the names and emails are."},
 {"id":"values","gap":0.8,"text":"The registrar's office sees the values, and so does the identity that runs the build."}]},
"key":{"name":"The scrambled key","lead":1.0,"tail":1.0,"vo":[
 {"id":"code","gap":0.8,"text":"The learner code is pseudonymous: the student number, scrambled the same way in every table, so tables can be joined without names."},
 {"id":"anon","gap":0.8,"text":"Scrambled isn't anonymous."},
 {"id":"list","gap":0.8,"text":"With the registrar's list, anyone can scramble every number on it and match them."},
 {"id":"still","gap":0.8,"text":"So the code is still personal: the policy leaves it readable, for counting, and reading it takes a purpose and an end date."}]},
"groups":{"name":"Groups, with an end date","lead":1.0,"tail":1.0,"vo":[
 {"id":"never","gap":0.8,"text":"Access goes to groups, never to people."},
 {"id":"yes","gap":0.8,"text":"Mei, for the registrar's office, said yes to Clara: to plan next term's places, until 15 December.","say":"Mei, for the registrar's office, said yes to Clara: to plan next term's places, until the fifteenth of December."},
 {"id":"grants","gap":0.8,"text":"So Sam doesn't grant the table to Clara."},
 {"id":"joins","gap":0.8,"text":"He grants it to a Planning group, and Clara joins the group in the university's directory, until that date."},
 {"id":"reads","gap":0.8,"text":"The platform reads its groups from there."},
 {"id":"jobs","gap":0.8,"text":"When someone changes jobs, the directory moves them, and their access follows."},
 {"id":"ends","gap":0.8,"text":"On 15 December, her access ends by itself.","say":"On the fifteenth of December, her access ends by itself."}]},
"lineage":{"name":"Down to the column","lead":1.0,"tail":1.0,"vo":[
 {"id":"draws","gap":0.8,"text":"The platform also draws each column's lineage."},
 {"id":"pick","gap":0.8,"text":"Pick the learner's email, and it shows every table it flows into, down to the column."},
 {"id":"beta","gap":0.8,"text":"Tags can follow lineage by themselves, in beta."},
 {"id":"need","gap":0.3,"text":"Here they don't need to: every table the email reaches is built by the project, which classes it there too,"},
 {"id":"stops","gap":0.8,"text":"and the check stops a table that doesn't."}]},
"audit":{"name":"Who read this, and when","lead":1.0,"tail":1.0,"vo":[
 {"id":"log","gap":0.8,"text":"And the platform keeps a log, in preview, of who read each table, and when."},
 {"id":"answer","gap":0.8,"text":"So Sam can answer what Yusuf wanted to know: who read the learner table this month."},
 {"id":"review","gap":0.8,"text":"Each December, the access review reads the grants themselves: who can read each table, through which group, and who's in it."},
 {"id":"gave","gap":0.3,"text":"Forty-one people gave way to two groups:"},
 {"id":"two","gap":0.8,"text":"the registrar's office, which keeps the learners' records, and the data team, which builds the tables."}]},
"close":{"name":"What the metadata says","lead":1.0,"tail":1.0,"vo":[
 {"id":"plans","gap":0.8,"text":"Clara plans next term's places with the statuses she needs, and stars where the names are."},
 {"id":"map","gap":0.3,"text":"On Noor's map, the project says what each column is, and the platform holds the line:"},
 {"id":"flow","gap":0.8,"text":"classes become tags, tags meet one policy, and groups carry the dates."},
 {"id":"sam","gap":0.8,"text":"Sam protects a column in minutes now, because the project tells him which."},
 {"id":"last","gap":0.8,"text":"The platform enforces what the metadata says."}]}
};
