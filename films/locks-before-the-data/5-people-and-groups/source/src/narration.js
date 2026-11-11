// People and groups, film 5 of Locks before the data, the first series of Data protection and privacy. One line per id; the film re-times itself to the voice.
// "gap": the beat after each line. "say": how the voice reads a line, when it differs from the caption (numbers and dates in words). The few longer stops are in breath.js.
const NARR={
"keys":{"name":"Keys that outlive the stay","lead":1.8,"tail":0.8,"vo":[
 {"id":"place","gap":0.8,"text":"Moss, on a fjord in Norway, in the 1970s.","say":"Moss, on a fjord in Norway, in the nineteen seventies."},
 {"id":"factory","gap":0.8,"text":"A factory here makes locks, and ice skates."},
 {"id":"sornes","gap":0.8,"text":"Tor Sørnes leads its research."},
 {"id":"hotels","gap":0.8,"text":"Hotels have a problem with their keys."},
 {"id":"forget","gap":0.8,"text":"Guests forget to hand them in when they leave, or lose them on the way."},
 {"id":"opens","gap":0.8,"text":"And a key still opens its door, whoever holds it, long after the stay has ended."},
 {"id":"anyone","gap":0.8,"text":"Anyone who found one, or kept one, could let themselves into the next guest's room, while that guest slept."},
 {"id":"change","gap":0.8,"text":"A key has to stop working when the stay ends."}
]},
"card":{"name":"A card for each stay","lead":1.0,"tail":0.6,"vo":[
 {"id":"lock","gap":0.8,"text":"Sørnes makes a lock that a punched plastic card opens."},
 {"id":"inside","gap":0.8,"text":"Inside each lock is a pattern card, put in from inside the room."},
 {"id":"guest","gap":0.8,"text":"For each new guest, the hotel puts in a new pattern, and gives the guest a card punched to match."},
 {"id":"last","gap":0.8,"text":"The last guest's card opens nothing."},
 {"id":"atlanta","gap":0.8,"text":"In 1978, the first go into a big new hotel in Atlanta, which had been troubled by burglaries.","say":"In nineteen seventy-eight, the first go into a big new hotel in Atlanta, which had been troubled by burglaries."},
 {"id":"lost","gap":0.8,"text":"Now a lost card opens nothing once the next guest arrives, and changing the lock takes only a new card."},
 {"id":"spread","gap":0.8,"text":"By 2011, the company says, its card locks are on six and a half million hotel rooms, in 166 countries.","say":"By twenty eleven, the company says, its card locks are on six and a half million hotel rooms, in a hundred and sixty-six countries."},
 {"id":"ends","gap":0.8,"text":"A key that ends with the stay."},
 {"id":"uni","gap":0.8,"text":"At the university, a place on the data platform could outlive a person's job, and an admin's power outlived the task."},
 {"id":"token","gap":0.8,"text":"And a personal token had no end date at all."},
 {"id":"builds","gap":0.8,"text":"This film builds the answer from three earlier films, in Microsoft Entra ID and Azure Databricks."}
]},
"before":{"name":"Still a key","lead":1.0,"tail":0.8,"vo":[
 {"id":"sam","gap":0.8,"text":"Sam Okafor keeps the university's data platform."},
 {"id":"tables","gap":0.8,"text":"Its tables already give their rights to groups from the university's directory, as Governed in Unity Catalog showed."},
 {"id":"hand","gap":0.8,"text":"But who could come in at all was a list kept by hand."},
 {"id":"people","gap":0.8,"text":"The workspace had been given people, one by one: 214 of them.","say":"The workspace had been given people, one by one: two hundred and fourteen of them."},
 {"id":"moved","gap":0.8,"text":"Nineteen had moved to jobs that didn't need it, and still got in."},
 {"id":"groups","gap":0.8,"text":"Four groups had been made inside the workspace, and the directory knew nothing of them."},
 {"id":"admins","gap":0.8,"text":"Eleven people were its admins, on the same accounts they read their email with."},
 {"id":"fake","gap":0.8,"text":"A fake page that caught one of their sign-ins would catch an admin."},
 {"id":"password","gap":0.8,"text":"Everyone signed in with a password and a code by text message."},
 {"id":"token","gap":0.8,"text":"And Jun's personal token, made in 2024 with no end date, ran the nightly job.","say":"And Jun's personal token, made in twenty twenty-four with no end date, ran the nightly job."},
 {"id":"still","gap":0.8,"text":"Like the hotel keys before the card, each still opened its door, long after the stay."}
]},
"directory":{"name":"One directory","lead":1.0,"tail":0.8,"vo":[
 {"id":"entra","gap":0.8,"text":"The university's directory is Microsoft Entra ID, and HR's records feed it."},
 {"id":"joins","gap":0.8,"text":"When someone joins, their account is made, already in their team's groups."},
 {"id":"moves","gap":0.8,"text":"When they move, their groups change; when they leave, their account is turned off."},
 {"id":"reads","gap":0.8,"text":"Now Azure Databricks reads the directory for itself: its people, and its groups, groups inside groups too."},
 {"id":"aim","gap":0.8,"text":"Sam switches on its automatic identity management, once, for the whole account."},
 {"id":"given","gap":0.8,"text":"Each workspace is then given groups, never people."},
 {"id":"prod","gap":0.8,"text":"Production is given the data team, the registrar's office, and the readers each area's owner allows."},
 {"id":"gone","gap":0.8,"text":"The four groups made by hand are gone: their people are in the directory's groups now."},
 {"id":"one","gap":0.8,"text":"Groups are changed in one place only: the directory."},
 {"id":"signs","gap":0.8,"text":"Each time someone signs in, Databricks reads their groups again."},
 {"id":"follows","gap":0.8,"text":"So when someone moves to another team, the platform follows at their next sign-in."},
 {"id":"leaves","gap":0.8,"text":"And when someone leaves, Databricks turns their user off at its next sync, and nothing can sign in as them."}
]},
"signin":{"name":"Sign in once","lead":1.0,"tail":0.8,"vo":[
 {"id":"once","gap":0.8,"text":"Everyone signs in the same way, once, through the directory."},
 {"id":"rule","gap":0.8,"text":"A rule there, a Conditional Access policy, lets no one reach Azure Databricks without a passkey: a sign-in no fake page can catch."},
 {"id":"lives","gap":0.8,"text":"It lives on their own phone, in the Authenticator app, or on a security key."},
 {"id":"mei","gap":0.8,"text":"Mei Tanaka, who owns the registrar's data, signs in with her phone: her face unlocks the passkey, and she's in."},
 {"id":"none","gap":0.8,"text":"There's no password to type, and none a fake page could use."},
 {"id":"agree","gap":0.8,"text":"The same rule asks for each person's confidentiality agreement, as Who is it, really? showed.","say":"The same rule asks for each person's confidentiality agreement, as Who is it really showed."},
 {"id":"before","gap":0.8,"text":"No one reaches the platform before accepting it, and everyone accepts it again each year."},
 {"id":"keeps","gap":0.8,"text":"The directory keeps who accepted it, and when."}
]},
"power":{"name":"Power you borrow","lead":1.0,"tail":0.8,"vo":[
 {"id":"groups","gap":0.8,"text":"Great power goes to groups too, and no one is in them."},
 {"id":"roles","gap":0.8,"text":"Every admin role, in the Databricks account, in each workspace and in Azure, belongs to a group whose name starts with admin."},
 {"id":"two","gap":0.8,"text":"Only two people can switch one on, Sam and Jun, each from a second account kept for it, signed in only with a security key."},
 {"id":"pim","gap":0.8,"text":"The switch is Microsoft Entra privileged identity management: those accounts are eligible for the groups, never in them."},
 {"id":"report","gap":0.8,"text":"On 19 October, Sam needs to know who still has personal tokens: the account's token report, which only an account admin can read.","say":"On the nineteenth of October, Sam needs to know who still has personal tokens: the account's token report, which only an account admin can read."},
 {"id":"hour","gap":0.8,"text":"So he switches on the account's settings group for one hour, and types why."},
 {"id":"approves","gap":0.8,"text":"Jun approves."},
 {"id":"seconds","gap":0.8,"text":"Within seconds his admin account is in the group."},
 {"id":"alert","gap":0.8,"text":"And an alert reaches the platform team: who, which group, why, who approved, until when."},
 {"id":"reads","gap":0.8,"text":"Databricks reads his groups as he signs in, and for this hour, he can read the report."},
 {"id":"out","gap":0.8,"text":"Then he signs out, and when the hour is up, the directory takes his admin account out of the group."},
 {"id":"like","gap":0.8,"text":"Like a new pattern in the hotel's lock, each switch-on opens one stay, and ends with it."}
]},
"tokens":{"name":"No token to copy","lead":1.0,"tail":0.8,"vo":[
 {"id":"seven","gap":0.8,"text":"The report shows seven personal tokens: six people's, for their command lines, and Jun's."},
 {"id":"browser","gap":0.8,"text":"But the command line can sign in through the browser now, with the same passkey."},
 {"id":"cli","gap":0.8,"text":"The Databricks CLI keeps its own short passes, each an hour long, in the computer's secure store: nothing to copy, nothing to paste."},
 {"id":"six","gap":0.8,"text":"So the six sign in that way, and end their own tokens."},
 {"id":"jun","gap":0.8,"text":"Jun's runs the nightly job, until Workloads without secrets gives the job its own way in, and ends it on 3 November.","say":"Jun's runs the nightly job, until Workloads without secrets gives the job its own way in, and ends it on the third of November."},
 {"id":"off","gap":0.8,"text":"That afternoon, Sam switches on the workspaces' settings for thirty minutes, Jun approves, and Sam turns personal tokens off."},
 {"id":"none","gap":0.8,"text":"Now no one can make a personal token, or use one."}
]},
"close":{"name":"Ends with the stay","lead":1.0,"tail":0.8,"vo":[
 {"id":"hotels","gap":0.8,"text":"In the hotels of the 1970s, a new pattern for each guest meant a lost card opened nothing.","say":"In the hotels of the nineteen seventies, a new pattern for each guest meant a lost card opened nothing."},
 {"id":"uni","gap":0.8,"text":"At the university, a place on the platform now ends with the job, and admin power ends with the task."},
 {"id":"token","gap":0.8,"text":"And no personal token is left to outlive anyone."},
 {"id":"take","gap":0.8,"text":"People sign in once, with no password to steal; power is borrowed, not kept."}
]}
};
