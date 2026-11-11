// Scripts became software, which opens Data as software, the second series of Modern data basics. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (numbers in words). The few longer stops are in breath.js.
const NARR={
"gertie":{"name":"Tested first","lead":1.6,"tail":1.0,"vo":[
 {"id":"opens","gap":0.8,"text":"Washington State, the 1st of July 1940.","say":"Washington State, the first of July, nineteen forty."},
 {"id":"narrows","gap":0.8,"text":"A new bridge opens across the Tacoma Narrows, its road hung from two great cables: a suspension bridge."},
 {"id":"slender","gap":0.8,"text":"Its deck, the road itself, is light and slender, built to the best theory of its day."},
 {"id":"gertie","gap":0.8,"text":"From the first day, the deck rises and falls in the wind, and people call it Galloping Gertie."},
 {"id":"nobody","gap":0.8,"text":"Nobody had tested how wind would move a deck like it."},
 {"id":"twist","gap":0.8,"text":"On the 7th of November, a wind of about 40 miles an hour sets it twisting, until its middle tears away and falls into the water.","say":"On the seventh of November, a wind of about forty miles an hour sets it twisting, until its middle tears away and falls into the water."},
 {"id":"gone","gap":0.8,"text":"No one is killed, but the only road across the Narrows is gone for ten years. The next bridge had to be proven before it was built."},
 {"id":"board","gap":0.8,"text":"The engineers who looked into it said such bridges must first be tested as models in a wind tunnel, where a fan blows a steady wind."},
 {"id":"tunnel","gap":0.8,"text":"At the University of Washington, Frederick Farquharson tests models for years."},
 {"id":"finds","gap":0.8,"text":"The tests find a deck the wind can't twist: deeper, stiffer, and open to let the wind through."},
 {"id":"opens50","gap":0.8,"text":"The new bridge opens in 1950, tested before it was built, and it has carried traffic for 76 years.","say":"The new bridge opens in nineteen fifty, tested before it was built, and it has carried traffic for seventy-six years."},
 {"id":"next","gap":0.8,"text":"Wind tunnels weren't new: wings had been tested in them since the Wright brothers. Bridges took up a practice from next door."},
 {"id":"data","gap":0.8,"text":"Data work did the same, and took up how software is made."},
 {"id":"export","gap":0.8,"text":"At the university, payroll's export to Finance ran for years as a script on one person's laptop."},
 {"id":"now","gap":0.8,"text":"Now it's software: tested before every change, reviewed by someone else, and released the same way every time."}]},
"laptop":{"name":"A script on a laptop","lead":1.2,"tail":1.0,"vo":[
 {"id":"payday","gap":0.8,"text":"Thursday, the 5th of November 2026: pay day at the university.","say":"Thursday, the fifth of November, twenty twenty-six: pay day at the university."},
 {"id":"rohan","gap":0.8,"text":"Every second Thursday, Rohan Desai in Finance needs to know what casual staff are paid that day, by faculty and unit."},
 {"id":"script","gap":0.8,"text":"For years, a script on one person's laptop told him."},
 {"id":"byhand","gap":0.8,"text":"Before six on each pay day, someone ran it by hand, and emailed its file to Finance."},
 {"id":"rule","gap":0.8,"text":"Payroll's rule was inside it: a claim approved by noon on the Monday before is paid that Thursday; approved later, it waits two weeks."},
 {"id":"worked","gap":0.8,"text":"It worked, and nobody is to blame. Its author moved to another team, and it kept running."},
 {"id":"feb","gap":0.8,"text":"Then in February, the claims moved into the claims app, and the spreadsheets it read stopped coming."},
 {"id":"unsafe","gap":0.8,"text":"One copy, no history of why, and no test to say if a change broke it: nobody could change it safely."}]},
"project":{"name":"Into the project","lead":1.2,"tail":1.0,"vo":[
 {"id":"move","gap":0.8,"text":"Sam Okafor, who runs the platform, and Jun Park moved it into the data project."},
 {"id":"git","gap":0.8,"text":"First into Git, beside the models, where every change is kept, with who made it and why."},
 {"id":"model","gap":0.8,"text":"Its sums became a model in dbt, and the rule is written once, on HR's calendar of pay days."},
 {"id":"ingrid","gap":0.8,"text":"Ingrid Holm in HR confirmed the rule; a change to the pay days now starts with a ticket from HR."},
 {"id":"tests","gap":0.8,"text":"Jun wrote the tests first, at the rule's edge: approved at 11:59 on the Monday, a claim is paid that Thursday; at 12:01, two weeks later.","say":"Jun wrote the tests first, at the rule's edge: approved at eleven fifty-nine on the Monday, a claim is paid that Thursday; at twelve oh one, two weeks later."},
 {"id":"weeds","gap":0.8,"text":"In the weeds of data crafting shows how, in Declare it, then build it, Promises and proofs, and Built in layers."},
 {"id":"branch","gap":0.8,"text":"Each change goes on a branch, and comes back as a pull request, with checks that build it and run every test."}]},
"review":{"name":"Someone else reads it","lead":1.2,"tail":1.0,"vo":[
 {"id":"other","gap":0.8,"text":"Then someone else on the data team, not its author, reviews it."},
 {"id":"swap","gap":0.8,"text":"Jun wrote the model, so Sam reviewed it; Sam wrote the job, so Jun reviewed that."},
 {"id":"merge","gap":0.8,"text":"Nothing merges without that review, and every check green."},
 {"id":"ticket","gap":0.8,"text":"Finance and HR don't review the code: Rohan asked for the move in a ticket, linked to its branch and pull requests."},
 {"id":"surprises","gap":0.8,"text":"Change without surprises shows how a change reaches the people it touches."},
 {"id":"agents","gap":0.8,"text":"And it holds when an agent writes the change: the agent proposes, and a person approves."}]},
"release":{"name":"The same way, every time","lead":1.2,"tail":1.0,"vo":[
 {"id":"bundle","gap":0.8,"text":"How it runs is a file too: a Declarative Automation Bundle lists the project's jobs, and where each one runs."},
 {"id":"job","gap":0.8,"text":"Payroll's export runs at six every Thursday, and builds and tests everything it reads."},
 {"id":"test","gap":0.8,"text":"Once a change is merged, the same files are deployed to test, and the job runs there first."},
 {"id":"checks","gap":0.8,"text":"Rohan checks its figures in test against his own, and his ticket stays open until he says they're right."},
 {"id":"noor","gap":0.8,"text":"Then the release waits for Noor, the data architect. When she approves, the same files go to production."},
 {"id":"account","gap":0.8,"text":"It runs as the platform's own account, never a person's: nobody deploys from a laptop."},
 {"id":"drift","gap":0.8,"text":"The same files, the same steps, every time, so test and production can't drift apart."},
 {"id":"today","gap":0.8,"text":"This morning at six, it ran for the eighteenth time, and 856 casual staff are paid today.","say":"This morning at six, it ran for the eighteenth time, and eight hundred and fifty-six casual staff are paid today."}]},
"choose":{"name":"What to keep","lead":1.2,"tail":1.0,"vo":[
 {"id":"decades","gap":0.8,"text":"None of this is new: software has been built this way for decades, and data work took it up, as bridges took up the wind tunnel."},
 {"id":"keep","gap":0.8,"text":"So keep data work as software: in Git, tested, reviewed by someone else, and deployed the same way every time."},
 {"id":"night","gap":0.8,"text":"The next film, A platform that watches itself, follows a night when a job fails."},
 {"id":"wheel","gap":0.8,"text":"There are already standards for this, so don't reinvent the wheel."},
 {"id":"docs","gap":0.8,"text":"Investigate, adapt, implement and iterate, starting from the official docs."}]},
"stands":{"name":"Still standing","lead":1.2,"tail":1.0,"vo":[
 {"id":"bridge","gap":0.8,"text":"The bridge of 1950 was tested before it was built, and it still stands.","say":"The bridge of nineteen fifty was tested before it was built, and it still stands."},
 {"id":"export","gap":0.8,"text":"Payroll's export is tested before every change, and pay day is just another Thursday."},
 {"id":"takeaway","gap":0.8,"text":"Data work is software."}]}
};
