// Platform and solution architecture · Security all the way through. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption. The few longer stops are in breath.js.
const NARR={
"pass":{"name":"A pass that matches","lead":1.4,"tail":1.0,"vo":[
 {"id":"year","gap":0.8,"text":"Japan, the early 1600s. A century of war has just ended, but the lords who fought it still rule their own domains.","say":"Japan, the early sixteen hundreds. A century of war has just ended, but the lords who fought it still rule their own domains."},
 {"id":"hostages","gap":0.8,"text":"To keep them from rising again, the shogunate keeps their wives and children in Edo, as hostages."},
 {"id":"fear","gap":0.8,"text":"So on the roads it fears two things: a lord's family slipping out of Edo, and guns going in, to arm a revolt."},
 {"id":"need","gap":0.8,"text":"It needs to see who leaves Edo, and to stop anyone who has no right to."},
 {"id":"checkpoint","gap":0.8,"text":"Around 1619, it sets a checkpoint on the Tōkaidō, in the Hakone mountains, by Lake Ashi.","say":"Around sixteen nineteen, it sets a checkpoint on the Tōkaidō, in the Hakone mountains, by Lake Ashi."},
 {"id":"gate","gap":0.8,"text":"Every traveller passes through its gate, between dawn and dusk."},
 {"id":"pass","gap":0.8,"text":"A woman leaving Edo shows a pass, written by officials in Edo Castle."},
 {"id":"says","gap":0.8,"text":"It says who she is, where she's going and why, and describes her hair, and any marks on her face, hands and feet."},
 {"id":"check","gap":0.8,"text":"A woman examiner checks her against it, and even unties her hair. If she doesn't match her pass, she goes no further."},
 {"id":"round","gap":0.8,"text":"Nobody may go round: taking a side road past a checkpoint is a crime, punished severely."},
 {"id":"men","gap":0.8,"text":"Most men need no pass at all. The checkpoint looks hardest at what the shogunate fears."},
 {"id":"better","gap":0.8,"text":"So whoever leaves Edo by this road is seen and checked, and the road stays open to everyone else."},
 {"id":"stands","gap":0.8,"text":"The checkpoint stands for about 250 years, until 1869.","say":"The checkpoint stands for about two hundred and fifty years, until eighteen sixty-nine."},
 {"id":"one","gap":0.8,"text":"At the utility, one account opens every door on the data platform."},
 {"id":"copy","gap":0.8,"text":"Its key sits in a script anyone could copy, and the log can't say who used it."},
 {"id":"every","gap":0.8,"text":"So Ravi gives every job and every person a pass of their own, and every request is checked where the data is."}]},
"account":{"name":"One account, every door","lead":1.0,"tail":1.0,"vo":[
 {"id":"ask","gap":0.8,"text":"In March, the regulator asks the utility a question: who read customers' bank details in February?"},
 {"id":"ticket","gap":0.8,"text":"Ama Owusu, the regulatory lead, asks the data team in a ticket."},
 {"id":"log","gap":0.8,"text":"The platform's log has a line for every read. But every line names the same account: data_loader.","say":"The platform's log has a line for every read. But every line names the same account: data loader."},
 {"id":"jobs","gap":0.8,"text":"It was made in the platform's first month. Now 47 jobs run as it, and four people sign in as it from their laptops.","say":"It was made in the platform's first month. Now forty-seven jobs run as it, and four people sign in as it from their laptops."},
 {"id":"key","gap":0.8,"text":"Its key sits in a script in the repository, with no end date. Anyone who can read the script can use it."},
 {"id":"rights","gap":0.8,"text":"And it can read and change every table, in every domain."},
 {"id":"harm","gap":0.8,"text":"So nobody can tell the regulator who read the bank details. And anyone who copied the key could still read them today."},
 {"id":"how","gap":0.8,"text":"Nobody meant harm. A new account took a ticket and two weeks, and data_loader worked at once.","say":"Nobody meant harm. A new account took a ticket and two weeks, and data loader worked at once."},
 {"id":"slow","gap":0.8,"text":"The safe way was the slow way."}]},
"who":{"name":"Who is asking","lead":1.0,"tail":1.0,"vo":[
 {"id":"start","gap":0.8,"text":"Ravi starts with identity: every request says who's asking."},
 {"id":"people","gap":0.8,"text":"People sign in as themselves, through the utility's single sign-on, with a second check on their phone."},
 {"id":"jobs","gap":0.8,"text":"Each of the 47 jobs gets an identity of its own. Each run is given a pass that lasts an hour, so there's no key to keep, or to copy.","say":"Each of the forty-seven jobs gets an identity of its own. Each run is given a pass that lasts an hour, so there's no key to keep, or to copy."},
 {"id":"story","gap":0.8,"text":"At Hakone, a pass described the one woman it was for. A key in a script works for whoever holds it."}]},
"least":{"name":"Only what it needs","lead":1.0,"tail":1.0,"vo":[
 {"id":"rights","gap":0.8,"text":"Then each identity gets only the rights it needs."},
 {"id":"jobs","gap":0.8,"text":"The billing load writes billing's raw tables, and nothing else. The outage dashboard reads two tables."},
 {"id":"groups","gap":0.8,"text":"People get their rights through groups, by their role, never one by one."},
 {"id":"bank","gap":0.8,"text":"And customers' bank details can be read by two jobs and the billing team. Nobody else."},
 {"id":"story","gap":0.8,"text":"A woman's pass named one journey, not every road."}]},
"checked":{"name":"Checked where the data is","lead":1.0,"tail":1.0,"vo":[
 {"id":"every","gap":0.8,"text":"Every request is checked where the data is. Before a single row is read, the catalogue checks who's asking and what they may do."},
 {"id":"net","gap":0.8,"text":"Being on the utility's network proves nothing: a laptop in the office is checked like any other."},
 {"id":"side","gap":0.8,"text":"And there are no side roads: nobody can read the files under the tables without going through the catalogue."},
 {"id":"enc","gap":0.8,"text":"Data is encrypted where it's kept and as it moves, set once by the platform for every domain."},
 {"id":"story","gap":0.8,"text":"As at Hakone, nobody goes round the checkpoint."}]},
"secrets":{"name":"No key in the code","lead":1.0,"tail":1.0,"vo":[
 {"id":"some","gap":0.8,"text":"Some keys can't go away: the password for an old billing system, or a supplier's key to its service."},
 {"id":"store","gap":0.8,"text":"Those go in the platform's secret store. A job asks for one by name as it runs, so it's never written in the code."},
 {"id":"pr","gap":0.8,"text":"And every pull request is checked for keys before it's merged."},
 {"id":"off","gap":0.8,"text":"The old key is cancelled, and six weeks after Ama's ticket, data_loader is switched off.","say":"The old key is cancelled, and six weeks after Ama's ticket, data loader is switched off."}]},
"log":{"name":"A name on every line","lead":1.0,"tail":1.0,"vo":[
 {"id":"log","gap":0.8,"text":"Now every line of the audit log names who asked: a person, or a job's own identity."},
 {"id":"again","gap":0.8,"text":"In June, the regulator asks again, about May."},
 {"id":"who","gap":0.8,"text":"This time the answer takes ten minutes: two billing jobs, and one billing analyst working on a ticket."},
 {"id":"closed","gap":0.8,"text":"Ama checks it, and closes her ticket."}]},
"default":{"name":"The safe way, the easy way","lead":1.0,"tail":1.0,"vo":[
 {"id":"why","gap":0.8,"text":"Why is this the platform's job? Left to each domain, the quick way would win again, as data_loader did.","say":"Why is this the platform's job? Left to each domain, the quick way would win again, as data loader did."},
 {"id":"template","gap":0.8,"text":"So the platform makes the safe way the easy way."},
 {"id":"start","gap":0.8,"text":"A new job starts from a template, with its own identity, its rights, its secrets and its log from the first day."},
 {"id":"quick","gap":0.8,"text":"It takes minutes, not a ticket and two weeks. Since June, twelve new jobs, and not one borrowed account."},
 {"id":"handoff","gap":0.8,"text":"How each lock is built, one by one, is the series Locks before the data."}]},
"practice":{"name":"The data practice on the map","lead":1.0,"tail":1.0,"vo":[
 {"id":"intro","gap":0.8,"text":"Here's the data practice, on Tomás's map."},
 {"id":"parts","gap":0.8,"text":"In the technology layer, the data platform's security is services of its own."},
 {"id":"services","gap":0.8,"text":"There's sign-in through the identity provider, access checked by the catalogue, the secret store and the audit log."},
 {"id":"uses","gap":0.8,"text":"Every data product, and every job that builds one, uses the same services."},
 {"id":"principle","gap":0.8,"text":"And the rule is a principle: every request says who's asking, and is checked where the data is."}]},
"end":{"name":"Nobody goes round","lead":1.0,"tail":1.0,"vo":[
 {"id":"road","gap":0.8,"text":"The checkpoint at Hakone didn't close the road. It looked hardest at the few the shogunate feared, and let everyone else go on."},
 {"id":"data","gap":0.8,"text":"On the data platform, every request is checked where the data is, by name, for only what it needs."},
 {"id":"domains","gap":0.8,"text":"Every domain gets that from the platform, by default."},
 {"id":"next","gap":0.8,"text":"Next: one solution, end to end."}]}
};
